from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import List, Dict, Any
import os
from supabase import create_client, Client
from rapidfuzz import process, fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

# Add debug logging
print(f"Supabase URL: {supabase_url}")
print(f"Supabase key: {supabase_key[:5]}... (truncated for security)")

# Check if environment variables are set
if not supabase_url or not supabase_key:
    print("WARNING: Supabase credentials not properly set in environment variables")
    print("Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set")

try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully")

    # Test connection with a simple query
    test_result = supabase.table('Tags').select(
        'count', count='exact').limit(1).execute()
    print(f"Connection test result: {test_result}")
    print(
        f"Tags count: {test_result.count if hasattr(test_result, 'count') else 'unknown'}")

    # List available tables (if your permissions allow)
    try:
        tables = supabase.rpc('get_tables').execute()
        print(
            f"Available tables: {tables.data if hasattr(tables, 'data') else 'Permission denied'}")
    except Exception as e:
        print(f"Could not get table list: {str(e)}")

except Exception as e:
    print(f"ERROR initializing Supabase client: {str(e)}")

# Fuzzy Search Helper Function


def fuzzy_filter(query: str, records: List[Dict[str, Any]], key: str, threshold: int = 50):
    """
    Perform fuzzy matching on a list of records based on a specific key

    Args:
        query: The search string
        records: List of record dictionaries
        key: The dictionary key to match against
        threshold: Minimum score to consider a match (0-100)

    Returns:
        List of matched records
    """
    # Create a mapping from record to its value for the specified key
    # This handles records where the key might be missing
    record_values = []
    record_map = {}

    for i, record in enumerate(records):
        value = record.get(key, "")
        if not isinstance(value, str):
            value = str(value) if value is not None else ""
        record_values.append(value)
        record_map[(i, value)] = record

    matches = process.extract(query, record_values, scorer=fuzz.WRatio, limit=10)
    results = []
    for value, score, idx in matches:
        if score >= threshold:
            record = record_map[(idx, value)]
            record_with_sim = {**record, "similarity": score / 100.0}
            results.append(record_with_sim)
    return results



@app.route('/api/tags', methods=['GET'])
def get_tags():
    try:
        # Query the Tags table
        response = supabase.table('Tags').select('*').execute()

        # Check if the query was successful
        if hasattr(response, 'error') and response.error is not None:
            return jsonify({"error": response.error.message}), 500

        # Return the data
        return jsonify({
            "success": True,
            "data": response.data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/organizations', methods=['GET'])
def get_organizations():
    try:
        # Step 1: Get all organizations
        org_response = supabase.table('Organizations').select('*').execute()
        if hasattr(org_response, 'error') and org_response.error is not None:
            return jsonify({"error": org_response.error.message}), 500
        organizations = org_response.data

        # Step 2: Get all organization tags
        tags_response = supabase.table('Organization_Tags').select('*').execute()
        if hasattr(tags_response, 'error') and tags_response.error is not None:
            return jsonify({"error": tags_response.error.message}), 500
        tag_records = tags_response.data

        # Step 3: Group tags by organization
        org_id_to_tags = {}
        for tag in tag_records:
            org_id = tag.get("organization_id")
            tag_name = tag.get("tag_name")
            if org_id and tag_name:
                org_id_to_tags.setdefault(org_id, []).append(tag_name)

        # Step 4: Attach tags to each organization
        for org in organizations:
            org["tags"] = org_id_to_tags.get(org["id"], [])

        return jsonify({
            "success": True,
            "data": organizations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def fetch_organizations():
    """Fetch organizations from Supabase."""

    response = supabase.table('Organizations').select('*').execute()

    # Print out the response object for debugging
    print("Response:", response)
    
    response = supabase.table('Organizations').select(
        'id, name, org_description').execute()

    print(response)

    if response.data:
        return response.data
    else:
        print("ERROR: No organizations retrieved")
        return []


organizations = fetch_organizations()
vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)


def compute_tfidf():
    """Precompute TF-IDF matrix for organizations."""
    global organizations, vectorizer, tfidf_matrix
    texts = [
        f"{org['name']} {org.get('org_description', '')}" for org in organizations]
    tfidf_matrix = vectorizer.fit_transform(texts)
    print("🔄 TF-IDF Index Updated!")


compute_tfidf()

# 🔹 TF-IDF Search


def tfidf_search(query: str, threshold: float = 0.15):
    """Search organizations using TF-IDF + Cosine Similarity.
    Returns a list of records with an added 'similarity' key.
    """
    query_vector = vectorizer.transform([query])
    similarities = cosine_similarity(query_vector, tfidf_matrix)[0]
    matched_records = []
    for i, sim in enumerate(similarities):
        if sim >= threshold:
            record = organizations[i]
            # Attach the cosine similarity score
            record_with_sim = {**record, "similarity": sim}
            matched_records.append(record_with_sim)
    # Sort the matches by similarity (highest first)
    matched_records.sort(key=lambda x: x["similarity"], reverse=True)
    return matched_records

@app.route('/api/search', methods=['GET', 'POST'])
def search():
    """Search API endpoint using TF-IDF and Fuzzy Matching, including tag filtering."""
    try:
        print("\n--------- New Search Request ---------")
        # Parse the incoming request (POST or GET)
        if request.method == 'POST':
            print(f"POST request with data: {request.data}")
            data = request.get_json(silent=True) or {}
        else:
            print(f"GET request with args: {request.args}")
            data = request.args.to_dict()
            tag_ids_str = data.get('tagIds', '')
            data['tagIds'] = [int(id) for id in tag_ids_str.split(',')] if tag_ids_str else []

        original_query = data.get('query', '')
        query = original_query.lower() if original_query else ''
        tag_ids = data.get('tagIds', [])

        print(f"Processed request: query='{original_query}', tagIds={tag_ids}")

        # Fetch all organizations initially
        org_response = supabase.table('Organizations').select('*').execute()
        if org_response.data is None:
            print("ERROR: No organizations retrieved from database")
            return jsonify({
                'status': 'error',
                'message': "No organizations found.",
                'debug_info': {}
            }), 500

        org_records = org_response.data

        # -------- Apply the Search Logic --------
        results = []
        if query:
            print(f"Searching for '{query}'")

            # 1. Exact matches: assign a maximum similarity score (1.0)
            exact_matches = [
                {**org, "similarity": 1.0} for org in org_records
                if org.get('name') and query in org.get('name', '').lower()
            ]
            print(f"Found {len(exact_matches)} exact matches")

            # 2. TF-IDF search: returns records with a 'similarity' key
            tfidf_matches = tfidf_search(query)
            print(f"Found {len(tfidf_matches)} TF-IDF matches")

            # 3. Fuzzy matching on name and description using normalized scores
            name_matches = fuzzy_filter(query, org_records, "name", threshold=60)
            print(f"Found {len(name_matches)} fuzzy name matches")
            description_matches = fuzzy_filter(query, org_records, "org_description", threshold=50)
            print(f"Found {len(description_matches)} fuzzy description matches")

            # Combine all matches into one list
            all_matches = exact_matches + tfidf_matches + name_matches + description_matches
            combined_matches = {}
            for match in all_matches:
                org_id = match.get('id')
                if org_id in combined_matches:
                    combined_matches[org_id]['similarity'] = max(combined_matches[org_id]['similarity'], match['similarity'])
                else:
                    combined_matches[org_id] = match
            sorted_matches = sorted(combined_matches.values(), key=lambda x: x["similarity"], reverse=True)
            print(f"Combined unique matches: {len(sorted_matches)}")
        else:
            # If no query is provided, just use the organizations filtered by tags
            print("No query provided, returning organizations filtered by tags with default similarity 0")
            sorted_matches = org_records

        # -------- Tag Filtering After Search --------
        if tag_ids:
            print(f"DEBUGGING TAG FILTERING: Selected tag IDs = {tag_ids}")
            filtered_matches = []
            for org in sorted_matches:
                org_id = org.get('id')

                # Query the organization_tags table to check if this organization has all the selected tags
                tag_check_response = supabase.table('Organization_Tags').select('organization_id').in_('tags_id', tag_ids).eq('organization_id', org_id).execute()

                if tag_check_response.data and len(tag_check_response.data) == len(tag_ids):
                    filtered_matches.append(org)

            print(f"Filtered matches to {len(filtered_matches)} organizations with the selected tags")
            sorted_matches = filtered_matches

        # Build the final list of results for the response
        results = []
        for org in sorted_matches:
            results.append({
                'type': 'organization',
                'id': org['id'],
                'title': org['name'],
                'description': org.get('org_description'),
                'org_logo': org.get('org_logo'),
                'similarity': org.get('similarity', 0)
            })

        return jsonify({
            'status': 'success',
            'results': results,
            'debug_info': {
                'query': query,
                'tag_ids': tag_ids,
                'total_results': len(results),
                'raw_data_count': len(org_records)
            }
        })

    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e),
            'debug': True
        }), 500


@app.route('/api/autocomplete', methods=['GET', 'POST'])
def autocomplete():
    try:
        if request.method == 'POST':
            data = request.get_json(silent=True) or {}
        else:  # GET method
            data = request.args.to_dict()

        query = data.get('query', '').lower()

        print(f"Autocomplete request received with query: '{query}'")

        if len(query) < 1:  # Allow even single-character queries
            return jsonify({'status': 'success', 'suggestions': []})

        # Fetch all organizations
        org_results = supabase.table(
            'Organizations').select('id, name').execute()

        if not org_results.data:
            print("ERROR: No organizations retrieved from database")
            return jsonify({'status': 'success', 'suggestions': []})

        print(f"Retrieved {len(org_results.data)} organizations from database")

        # Filter organizations locally
        matches = [
            {'id': org.get('id'), 'name': org.get('name')}
            for org in org_results.data
            if org.get('name') and query in org.get('name', '').lower()
        ]

        print(f"Found {len(matches)} direct matches for query '{query}'")

        # Limit to top 5 matches
        top_matches = matches[:5]
        print(f"Returning {len(top_matches)} suggestions for query '{query}'")

        return jsonify({
            'status': 'success',
            'suggestions': top_matches
        })

    except Exception as e:
        error_message = str(e)
        print(f"Autocomplete error: {error_message}")
        return jsonify({
            'status': 'error',
            'message': error_message,
            'debug': True
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
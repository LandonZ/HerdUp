import React, { useState, useEffect } from "react";
import {
	Image,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Text,
	FlatList,
	ActivityIndicator,
	ScrollView,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from '@expo/vector-icons';
import HealthIcon from '../../../../assets/images/Health.svg';
import DesignIcon from '../../../../assets/images/Design.svg';
import SoftwareIcon from '../../../../assets/images/Software.svg';
import NetworkingIcon from '../../../../assets/images/Networking.svg';
import SustainabilityIcon from '../../../../assets/images/Sustainability.svg';
import TechIcon from '../../../../assets/images/tech.svg';
import BusinessIcon from '../../../../assets/images/Business.svg';
import SportsIcon from '../../../../assets/images/Sports.svg';

interface Tag {
	id: number;
	"tag_name": string;
	created_at: string;
}

interface Suggestion {
	id: string;
	name: string;
	description: string;
	org_logo: string;
	tags: string[];
}

interface SearchResult {
	id: number;
	title: string;
	description?: string;
	org_logo?: string;
}

export default function SearchScreen() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	// Added state to track if the search box is focused
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [searchState, setSearchState] = useState<'initial' | 'focused' | 'results'>('initial');

	const tagColors: { [key: string]: string } = {
		Health: "#FFB2C7",
		Design: "#FFC5BE",
		Software: "#C6CDD7",
		Networking: "#FFC1A8",
		Sustainability: "#B9FFC7",
		Tech: "#FFD9AB",
		Business: "#D0F4FF",
		Sports: "#D0B8FF",
	};

	const tagTextColors: { [key: string]: string } = {
		Health: "#F03467",
		Design: "#BE1400",
		Software: "#1C56A8",
		Networking: "#FF7C46",
		Sustainability: "#008E1B",
		Tech: "#FDA33A",
		Business: "#2A91B0",
		Sports: "#8A50FF",
	};

	const selectedTagBorderColors: { [key: string]: string } = {
		Health: "#F03467",
		Design: "#C5ACA9",
		Software: "#71A1E5",
		Networking: "#F4895C",
		Sustainability: "#008E1B",
		Tech: "#FDA33A",
		Business: "#275796",
		Sports: "#0E908C",
	};

	const tagIcons: { [key: string]: any } = {
		Health: HealthIcon,
		Design: DesignIcon,
		Software: SoftwareIcon,
		Networking: NetworkingIcon,
		Sustainability: SustainabilityIcon,
		Tech: TechIcon,
		Business: BusinessIcon,
		Sports: SportsIcon,
	};

	const handleTagPress = (tagId: number) => {
		setSelectedTagIds((prev) => {
			if (prev.includes(tagId)) {
				return prev.filter((id) => id !== tagId);
			} else {
				return [...prev, tagId];
			}
		});
	};

	const handleSearch = async () => {
		if (!query.trim() && selectedTagIds.length === 0) {
			setErrorMessage("Please enter a search term or select tags");
			return;
		}

		try {
			setLoading(true);
			setErrorMessage("");
			console.log("🔍 Sending request to Flask backend...");

			const response = await fetch("http://127.0.0.1:5000/api/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query,
					tagIds: selectedTagIds,
				}),
			});

			const data = await response.json();
			console.log("✅ API Response:", data);

			if (data.status === "success") {
				setResults(data.results);
			} else {
				setResults([]);
				setErrorMessage(data.message || "An error occurred during search");
			}
		} catch (error) {
			console.error("❌ API Error:", error);
			setErrorMessage("Failed to connect to the server. Please try again.");
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	// Handle text input change (similar to your original code)
	const handleQueryChange = async (text: string) => {
		setQuery(text);

		if (text.length < 2) {
			setResults([]);
			return;
		}

		try {
			const response = await fetch("http://127.0.0.1:5000/api/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: text, tagIds: selectedTagIds }),
			});

			const data = await response.json();
			console.log("✅ Live Search API Response:", data);

			if (data.status === "success") {
				setResults(data.results);
			} else {
				setResults([]);
			}
		} catch (error) {
			console.error("❌ Search API Error:", error);
			setResults([]);
		}
	};

	useEffect(() => {
		if (query.trim() || selectedTagIds.length > 0) {
		  handleSearch();
		}
	  }, [query, selectedTagIds]); 
	  

	useEffect(() => {
		const fetchTags = async () => {
			try {
				setLoading(true);
				const response = await fetch("http://127.0.0.1:5000/api/tags", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				const data = await response.json();
				console.log("✅ Tags API Response:", data);
				if (data.success && data.data) {
					setTags(data.data);
				} else {
					console.error("Failed to fetch tags:", data.error || "Unknown error");
				}
			} catch (error) {
				console.error("❌ Tags API Error:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchSuggestions = async () => {
			try {
				const response = await fetch("http://127.0.0.1:5000/api/organizations", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				const data = await response.json();
				console.log("✅ Organizations API Response:", data);
				
				if (data.success && data.data) {
					setSuggestions(data.data);
				} else {
					console.error("Failed to fetch organizations:", data.error || "Unknown error");
				}
			} catch (error) {
				console.error("❌ Organizations API Error:", error);
			}
		};		

		fetchTags();
		fetchSuggestions();

		return () => {
			if (window.autocompleteTimer) {
				clearTimeout(window.autocompleteTimer);
			}
		};
	}, []);

	const renderItem = ({ item }: { item: SearchResult }) => (
		<View style={styles.resultItem}>
			<Image
				source={{ uri: item.org_logo || "https://via.placeholder.com/100" }}
				style={styles.resultLogo}
				resizeMode="cover"
			/>
			<View style={styles.resultTextContainer}>
				<Text style={styles.resultTitle}>{item.title}</Text>
				{item.description && (
					<Text style={styles.resultDescription} numberOfLines={2}>
						{item.description}
					</Text>
				)}
			</View>
		</View>
	);

	const renderSuggestionItem = ({ item }: { item: Suggestion }) => {
		const tags = item.tags || [];
		return (
			<TouchableOpacity style={styles.suggestionCard}>
				<View style={styles.imageContainer}>
				<Image
					source={{
						uri: item.org_logo && item.org_logo !== "{}" ? item.org_logo : "https://via.placeholder.com/100",
					}}
					style={styles.suggestionImage}
					resizeMode="cover"
				/>
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.suggestionCardText}>{item.name}</Text>
					<View style={styles.orgTagsContainer}>
						{item.tags.slice(0, 5).map((tag, index) => {
							const bgColor = tagColors[tag] || "#ccc";
							const borderColor = selectedTagBorderColors[tag] || "#000";
							return (
							<Text
								key={index}
								style={[
								styles.tag,
								{
									backgroundColor: bgColor,
									borderColor: borderColor,
								},
								]}
								numberOfLines={1}
							>
								{tag}
							</Text>
							);
						})}
						</View>
				</View>
			</TouchableOpacity>
		);
	};

	const handleBackPress = () => {
		setIsSearchFocused(false);
		setQuery('');
		setSearchState('initial');
		Keyboard.dismiss();
	};

	const renderSuggestionRow = () => (
		<FlatList
			data={suggestions}
			keyExtractor={(item) => item.id.toString()}
			renderItem={renderSuggestionItem}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.suggestionRow}
		/>
	);

	const renderContent = () => {
		if (loading) {
			return <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />;
		}

		return (
			<View style={styles.contentContainer}>
				<ScrollView 
					style={styles.scrollContainer}
					contentContainerStyle={styles.scrollContentContainer}
					showsVerticalScrollIndicator={true}
					scrollEventThrottle={16}
					bounces={true}
					alwaysBounceVertical={true}
					nestedScrollEnabled={true}
				>
					{searchState === 'initial' ? (
						<View style={styles.suggestionsContainer}>
							{/* Featured Section */}
							<Text style={styles.sectionHeader}>Featured</Text>
							<View style={styles.suggestionRowContainer}>
								{renderSuggestionRow()}
							</View>

							{/* Suggested for You Section */}
							<Text style={styles.sectionHeader}>Suggested for You</Text>
							<View style={styles.suggestionRowContainer}>
								{renderSuggestionRow()}
							</View>

							{/* Popular Spirit Groups Section */}
							<Text style={styles.sectionHeader}>Popular Spirit Groups</Text>
							<View style={styles.suggestionRowContainer}>
								{renderSuggestionRow()}
							</View>

							{/* Popular Fraternities & Sororities */}
							<Text style={styles.sectionHeader}>Popular Fraternities & Sororities</Text>
							<View style={styles.suggestionRowContainer}>
								{renderSuggestionRow()}
							</View>
						</View>
					) : (
						<View style={styles.listView}>
							{results.map((item) => (
								<TouchableOpacity 
									key={item.id.toString()} 
									style={styles.listItem}
									activeOpacity={1}
									onPress={() => {}}
								>
									{renderItem({ item })}
								</TouchableOpacity>
							))}
						</View>
					)}
				</ScrollView>
			</View>
		);
	};

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<ThemedView style={styles.container}>
				<View style={styles.searchAndBrowseContainer}>
					<View style={styles.searchHeader}>
						{isSearchFocused && (
							<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
								<Ionicons name="chevron-back" size={28} color="#000" />
							</TouchableOpacity>
						)}
						<View style={styles.searchInputContainer}>
							<TextInput
								style={styles.searchInput}
								placeholder="Search"
								placeholderTextColor="#444444"
								value={query}
								onChangeText={handleQueryChange}
								onFocus={() => {
									setIsSearchFocused(true);
									setSearchState('focused');
								}}
								onSubmitEditing={handleSearch}
							/>
						</View>
					</View>
					{!isSearchFocused && <Text style={styles.browseText}>Browse All</Text>}
				</View>

				{!loading && tags.length > 0 && (isSearchFocused || searchState !== 'initial') && (
					<View style={styles.tagsSection}>
						<ThemedText style={styles.tagsSectionTitle}>
							{searchState === 'focused' ? "Relevant" : "Filter by:"}
						</ThemedText>
						<ScrollView 
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.tagsScrollContent}
						>
							<View style={styles.tagsRows}>
								<View style={styles.tagRow}>
									{tags.slice(0, Math.ceil(tags.length/2)).map((tag) => {
										const tagName = tag["tag_name"];
										const bgColor = tagColors[tagName] || "#ccc";
										const textColor = tagTextColors[tagName] || "#000";
										const isSelected = selectedTagIds.includes(tag.id);
										const iconName = tagIcons[tagName];

										return (
											<TouchableOpacity
												key={tag.id}
												style={[
													styles.tagPill,
													{
														backgroundColor: bgColor,
														borderWidth: isSelected ? 2 : 0,
														borderColor: textColor,
													},
												]}
												onPress={() => handleTagPress(tag.id)}
											>
												<View style={styles.tagContent}>
													{iconName && React.createElement(iconName, {
														width: 16,
														height: 16,
														color: textColor,
														style: styles.tagIcon
													})}
													<Text style={[styles.tagPillText, { color: textColor }]}>{tagName}</Text>
												</View>
											</TouchableOpacity>
										);
									})}
								</View>
								<View style={styles.tagRow}>
									{tags.slice(Math.ceil(tags.length/2)).map((tag) => {
										const tagName = tag["tag_name"];
										const bgColor = tagColors[tagName] || "#ccc";
										const textColor = tagTextColors[tagName] || "#000";
										const isSelected = selectedTagIds.includes(tag.id);
										const iconName = tagIcons[tagName];

										return (
											<TouchableOpacity
												key={tag.id}
												style={[
													styles.tagPill,
													{
														backgroundColor: bgColor,
														borderWidth: isSelected ? 2 : 0,
														borderColor: textColor,
													},
												]}
												onPress={() => handleTagPress(tag.id)}
											>
												<View style={styles.tagContent}>
													{iconName && React.createElement(iconName, {
														width: 16,
														height: 16,
														color: textColor,
														style: styles.tagIcon
													})}
													<Text style={[styles.tagPillText, { color: textColor }]}>{tagName}</Text>
												</View>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						</ScrollView>
					</View>
				)}

				{renderContent()}
			</ThemedView>
		</TouchableWithoutFeedback>
	);
}

// Retaining the global autocomplete timer cleanup from your original code
declare global {
	interface Window {
		autocompleteTimer: ReturnType<typeof setTimeout> | undefined;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: 61,
	},
	contentContainer: {
		flex: 1,
		width: '100%',
	},
	searchHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	backButton: {
		padding: 8,
		marginRight: 8,
	},
	searchInputContainer: {
		flex: 1,
		marginRight: 16,
	},
	searchInput: {
		backgroundColor: '#FFFFFF',
		borderRadius: 50,
		paddingVertical: 12,
		paddingHorizontal: 20,
		fontSize: 16,
		height: 46,
		color: '#444444',
		borderWidth: 1,
		borderColor: '#000000',
	},
	tagsSection: {
		width: '100%',
		paddingHorizontal: 15,
		marginBottom: 15,
	},
	tagsSectionTitle: {
		fontSize: 18,
		marginBottom: 15,
		marginTop: 12,
		fontWeight: "500",
		color: "#C15B27",
	},
	browseText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#C15B27",
		paddingHorizontal: 15,
		paddingVertical: 10,
		backgroundColor: '#fff',
	},
	tagsScrollContent: {
		paddingRight: 15,
	},
	tagsRows: {
		height: 84,
	},
	tagRow: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	tagPill: {
		borderRadius: 20,
		marginRight: 8,
		marginBottom: 8,
		paddingHorizontal: 14,
		paddingVertical: 6,
	},
	tagContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tagIcon: {
		marginRight: 6,
	},
	tagPillText: {
		fontSize: 14,
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContentContainer: {
		paddingTop: 5,
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		width: '100%',
		paddingTop: 10,
	},
	gridItem: {
		width: '48%',
		marginBottom: 15,
	},
	suggestionCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		padding: 10,
		height: 145,
		elevation: 3,
		width: 162,
		marginRight: 5,
	},
	suggestionsContainer: {
		width: "100%",
		marginTop: 10,
		minHeight: '100%',
	},
	suggestionsList: {
		width: "100%",
	},
	suggestionsContent: {
		paddingBottom: 20,
	},
	suggestionCardText: {
		fontSize: 14,
		fontWeight: 400,
		color: "#00000",
		textAlign: "left",
		marginBottom: 4,
	},
	imageContainer: {
		width: "100%",
		height: "60%",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	suggestionImage: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
	textContainer: {
		width: "100%",
		height: "40%",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingLeft: 0,           
		paddingTop: 10,
	},
	titleText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#FF8C00",
		textAlign: "center",
		marginBottom: 20,
	},
	searchContainer: {
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 20,
		zIndex: 1,
	},
	autocompleteContainer: {
		width: "90%",
		position: "relative",
		zIndex: 10,
		marginBottom: 10,
	},
	input: {
		width: "100%",
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	button: {
		backgroundColor: "#FFA500",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginBottom: 10,
		width: "40%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	resultsList: {
		width: "100%",
	},
	resultItem: {
		flexDirection: 'row',
		paddingVertical: 18,
		paddingHorizontal: 15,
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF',
	},
	resultLogo: {
		width: 60,
		height: 60,
		borderRadius: 30,
		marginRight: 18,
		backgroundColor: '#F5F5F5',
	},
	resultTextContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	resultTitle: {
		fontSize: 17,
		fontWeight: '500',
		color: '#000000',
		marginBottom: 10,
	},
	resultDescription: {
		fontSize: 14,
		fontWeight: '400',
		color: '#666666',
		lineHeight: 18,
	},
	loader: {
		marginTop: 30,
	},
	errorText: {
		color: "red",
		textAlign: "center",
		marginTop: 20,
	},
	noResultsText: {
		textAlign: "center",
		marginTop: 30,
		fontSize: 16,
		color: "#666",
	},
	tagButton: {
		backgroundColor: "#eee",
		borderRadius: 30,
		paddingVertical: 4,
		paddingHorizontal: 12,
		marginRight: 8,
		marginBottom: 5,
	},
	tagText: {
		fontSize: 13,
	},
	selectedTagButton: {
		backgroundColor: "#FFA500",
	},
	selectedTagText: {
		color: "#fff",
		fontWeight: "500",
	},
	tag: {
		backgroundColor: "#FFA500",
		color: "#fff",
		borderRadius: 6,
		paddingVertical: 1,
		paddingHorizontal: 5,
		marginRight: 4,
		marginBottom: 3,
		fontSize: 8,
		maxWidth: 70,
		overflow: "hidden",
	},
	orgLogo: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
		backgroundColor: "#eee",
	},
	// Styles for the UI when the search box is focused but the query is empty
	focusedSearchContainer: {
		width: "100%",
		alignItems: "center",
		marginTop: 20,
	},
	focusedSearchText: {
		fontSize: 16,
		color: "#666",
	},
	listView: {
		width: '100%',
	},
	listItem: {
		width: '100%',
		marginBottom: 10,
	},
	orgTagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 10,
		borderRadius: 15,
		paddingLeft: 0,
	},
	suggestionRowContainer: {
		marginBottom: 5,
	},
	suggestionRow: {
		flexDirection: "row",
		paddingHorizontal: 10,
	},
	searchAndBrowseContainer: {
		paddingVertical: 0,
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: 600,
		color: "#BF5700",
		paddingHorizontal: 15,
		paddingBottom: 10,
	},
});

export { };
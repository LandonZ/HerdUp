import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';
import { Ionicons } from '@expo/vector-icons';

// Define TypeScript interface for organization data
interface Organization {
  id: string;
  name: string;
  org_logo: string | null;
  org_description: string | null;
  email?: string | null;
  time_commitment?: string | null;
  dues?: string | null;
  meeting_times?: string | null;
  major_restrictions?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

// Define interfaces for events and announcements
interface Event {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  organization_id: string;
  organization_name: string;
}

interface Announcement {
  id: string;
  announcement_description: string;
  announcement_date: string;
  announcement_time: string;
  organization_id: string;
  organization_name: string;
}

export default function OrgPage() {
  const { id } = useLocalSearchParams(); // learning about this was so cool
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch organization details
        const { data: orgData, error: orgError } = await supabase
          .from('Organizations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (orgError) {
          throw orgError;
        }

        setOrg(orgData as Organization);

        // Fetch events for this organization
        const { data: eventsData, error: eventsError } = await supabase
          .from('Events')
          .select('*')
          .eq('organization_id', id)
          .order('event_date', { ascending: true })
          .order('event_time', { ascending: true });
        
        if (eventsError) {
          console.error('Error fetching events:', eventsError);
        } else {
          setEvents(eventsData || []);
        }

        // Fetch announcements for this organization
        const { data: announcementsData, error: announcementsError } = await supabase
          .from('Announcements')
          .select('*')
          .eq('organization_id', id)
          .order('announcement_date', { ascending: false })
          .order('announcement_time', { ascending: false });
        
        if (announcementsError) {
          console.error('Error fetching announcements:', announcementsError);
        } else {
          setAnnouncements(announcementsData || []);
        }

      } catch (err) {
        console.error('Error fetching data:', err instanceof Error ? err.message : 'Unknown error');
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF5700" />
        <Text style={styles.loadingText}>Loading organization...</Text>
      </View>
    );
  }

  if (error || !org) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Organization not found"}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper functions for formatting dates and times
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short', // "Apr"
      day: 'numeric', // "12"
    });
  };
  
  const formatTime = (timeStr: string): string => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // General open link function: instagram, linkedin, facebook, website
  const openLink = (url?: string | null) => {
    if (!url) return;
    
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }
    
    Linking.openURL(formattedUrl).catch(err => {
      console.error('Error opening URL:', err);
    });
  };

  // Email opening
  const openEmail = (email?: string | null) => {
    if (!email) return;
    
    Linking.openURL(`mailto:${email}`).catch(err => {
      console.error('Error opening email client:', err);
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Organization Header */}
      <View style={styles.orgHeader}>
        <View style={styles.logoContainer}>
          {org.org_logo ? (
            <Image
              source={{ uri: org.org_logo }}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>
                {org.name ? org.name.charAt(0) : '?'}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.orgName}>{org.name}</Text>
        <Text style={styles.description}>{org.org_description || ''}</Text>
        
        {/* Social Media Icons */}
        {(org.email || org.website || org.instagram || org.facebook || org.linkedin) && (
          <View style={styles.socialIconsContainer}>
            {org.email && (
              <TouchableOpacity 
                style={styles.socialIconButton}
                onPress={() => openEmail(org.email)}
              >
                <View style={styles.socialIcon}>
                  <Ionicons name="mail" size={24} color="#BF5700" />
                </View>
              </TouchableOpacity>
            )}
            
            {org.website && (
              <TouchableOpacity 
                style={styles.socialIconButton}
                onPress={() => openLink(org.website)}
              >
                <View style={styles.socialIcon}>
                  <Ionicons name="globe" size={24} color="#BF5700" />
                </View>
              </TouchableOpacity>
            )}
            
            {org.instagram && (
              <TouchableOpacity 
                style={styles.socialIconButton}
                onPress={() => openLink(org.instagram)}
              >
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-instagram" size={24} color="#BF5700" />
                </View>
              </TouchableOpacity>
            )}
            
            {org.facebook && (
              <TouchableOpacity 
                style={styles.socialIconButton}
                onPress={() => openLink(org.facebook)}
              >
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-facebook" size={24} color="#BF5700" />
                </View>
              </TouchableOpacity>
            )}
            
            {org.linkedin && (
              <TouchableOpacity 
                style={styles.socialIconButton}
                onPress={() => openLink(org.linkedin)}
              >
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-linkedin" size={24} color="#BF5700" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Follow and Contact Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton} >
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Organization Details */}
      {(org.meeting_times || org.time_commitment || org.dues || org.major_restrictions) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Details</Text>
          
          <View style={styles.detailsList}>
            {org.meeting_times && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Meeting Times</Text>
                <Text style={styles.detailValue}>{org.meeting_times}</Text>
              </View>
            )}
            
            {org.time_commitment && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Time Commitment</Text>
                <Text style={styles.detailValue}>{org.time_commitment} Hours</Text>
              </View>
            )}
            
            {org.dues && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Dues</Text>
                <Text style={styles.detailValue}>${org.dues}</Text>
              </View>
            )}
            
            {org.major_restrictions && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Major Restrictions</Text>
                <Text style={styles.detailValue}>{org.major_restrictions}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {events.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {events.map((event, index) => (
              <TouchableOpacity key={index} style={styles.eventCard}>
                <Text style={styles.eventDate}>
                  {formatDate(event.event_date)}, {formatTime(event.event_time)}
                </Text>
                <Text style={styles.eventTitle}>{event.event_name}</Text>
                {/* Add the Check-in button */}
                <TouchableOpacity 
                  style={styles.checkInButton}
                >
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No upcoming events</Text>
          </View>
        )}
      </View>

      {/* Announcements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>
        {announcements.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {announcements.map((announcement, index) => (
              <View key={index} style={styles.announcementCard}>
                <Text style={styles.announcementDate}>
                  {formatDate(announcement.announcement_date)} • {formatTime(announcement.announcement_time)}
                </Text>
                <Text style={styles.announcementText}>
                  {announcement.announcement_description}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No recent announcements</Text>
          </View>
        )}
      </View>

      {/* Footer space for tab bar */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212121',
  },
  orgHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderLogo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orgName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIconButton: {
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  followButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  contactButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BF5700',
    marginBottom: 16,
  },
  detailsList: {
    
  },
  detailItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  emptyStateContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
  },
  // New styles for events and announcements
  horizontalScrollContent: {
    paddingVertical: 8,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    height: 150,
    width: 300, 
    borderRadius: 12, 
    padding: 16, 
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 5},
    position: 'relative',
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000000CC' 
  },
  eventTitle: {
    fontSize: 18, 
    fontWeight: 500,
    color: '#000000',
    paddingVertical: 8,
  },
  checkInButton: {
    backgroundColor: '#BF5700',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 16,
    right: 16, 
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  announcementList: {
    paddingVertical: 8,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    height: 225,
    width: 300, 
    borderRadius: 12, 
    padding: 16, 
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 5},
  },
  announcementDate: {
    fontSize: 10,
    fontWeight: 500,
    color: '#00000099'
  },
  announcementText: {
    fontSize: 13,
    fontWeight: 500, 
    marginTop: 8, 
    color: '#000000CC' 
  },
});
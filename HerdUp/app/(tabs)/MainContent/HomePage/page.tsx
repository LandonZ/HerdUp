import React, { useEffect, useState } from "react";
import { 
  ScrollView, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { supabase } from '@/components/utils/supabase';
import { useRouter } from 'expo-router';

// const organizations = [
//   { name: 'Convergent', logo: require('../../../../assets/images/convergent.png') },
//   { name: 'TPEO', logo: require('../../../../assets/images/tpeo.png') },
//   { name: 'Blockchain', logo: require('../../../../assets/images/blockchain.png') },
//   {name: 'LeSunshine', logo: require('../../../../assets/images/lebron.png') },
// ];


// const eventsData = [
//   { date: 'MAR 25', time: '6:00 PM', title: 'General Meeting', org: 'Convergent', logo: require('../../../../assets/images/convergent.png') },
//   { date: 'MAR 3', time: '7:00 PM', title: 'Rooftop Social', org: 'Blockchain', logo: require('../../../../assets/images/blockchain.png') },
//   { date: 'APR 7', time: '5:00 PM', title: 'Meet and Greet', org: 'LeSunshine', logo: require('../../../../assets/images/lebron.png') },
// ];

// const announcementsData = [
//   { org: 'Convergent', logo: require('../../../../assets/images/convergent.png'), date: 'MAR 3', time: '11:00 AM', details: 'T-shirt pick-up will take place at this week\'s general meeting. Hope to see you there! Food will be provided!' },
//   { org: 'TPEO', logo: require('../../../../assets/images/tpeo.png'), date: 'APR 4', time: '12:00 PM', details: 'Our workshop rooms have been changed! We are now meeting in GDC 1.304.' }
// ];

const suggestedOrgs = [
  { name: 'ECLAIR', logo: require('../../../../assets/images/eclair.png') },
  { name: 'UT Stem Buddies', logo: require('../../../../assets/images/stembuddies.png') },
  { name: 'LeFollowers', logo: require('../../../../assets/images/lebron.png') },
];

export default function HomeScreen() {

  const [user_id, setUserId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsWithLogos, setEventsWithLogos] = useState<any[]>([]);
  const [announcementsWithLogos, setAnnouncementsWithLogos] = useState<any[]>([]);
  const router = useRouter();

   // Navigation to org pages
   const navigateToOrg = (orgId: any) => {
    router.push({
      pathname: "/MainContent/OrgPage/[id]",
      params: { id: orgId }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await fetchUserId();
      if (!userId) return;
  
      await fetchOrganizations(userId);
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (organizations.length > 0) {
      fetchEvents();
      fetchAnnouncements();
    }
  }, [organizations]); // Fetch events only after organizations updates
  
  const fetchUserId = async (): Promise<string | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id || null;
    setUserId(userId);
    if (!userId) console.error("User not authenticated");
    return userId;
  };
  
  const fetchOrganizations = async (userId: string) => {
    const { data: orgsData, error: orgsError } = await supabase
      .from("Org_Junction")
      .select("org_id")
      .eq("user_id", userId);
  
    if (orgsError) {
      console.error("Error fetching organizations:", orgsError);
      return;
    }
  
    if (!orgsData.length) {
      console.log("No organizations found for user.");
      return;
    }
  
    const orgIds = orgsData.map((org) => org.org_id);
    const { data: orgDetails, error: orgDetailsError } = await supabase
      .from("Organizations")
      .select("*")
      .in("id", orgIds);
  
    if (orgDetailsError) {
      console.error("Error fetching organization details:", orgDetailsError);
    } else {
      setOrganizations(orgDetails || []);
    }
  };

  const fetchEvents = async () => {
    const orgIds = organizations.map((org) => org.id);
    if (orgIds.length === 0) return;
  
    const { data: eventsData, error: eventsError } = await supabase
      .from("Events")
      .select("*")
      .in("organization_id", orgIds);
  
    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return;
    }
  
    setEvents(eventsData || []);
  
    // Immediately fetch logos for these events
    const uniqueOrgIds = Array.from(
      new Set(eventsData.map(e => e.organization_id).filter(id => id !== undefined))
    );
  
    const { data: orgs, error: orgsError } = await supabase
      .from("Organizations")
      .select("id, org_logo")
      .in("id", uniqueOrgIds);
  
    if (orgsError) {
      console.error("Error fetching org logos:", orgsError);
      return;
    }
  
    const orgLogoMap = new Map(orgs.map(org => [org.id, org.org_logo]));
  
    const merged = eventsData.map(event => ({
      ...event,
      org_logo: orgLogoMap.get(event.organization_id),
    }));
  
    setEventsWithLogos(merged);
  };

  const fetchAnnouncements = async () => {
    const orgIds = organizations.map((org) => org.id);
    if (orgIds.length === 0) return;
  
    const { data: announcementsData, error: announcementsError } = await supabase
      .from("Announcements")
      .select("*")
      .in("organization_id", orgIds);
  
    if (announcementsError) {
      console.error("Error fetching events:", announcementsError);
      return;
    }
  
    // Immediately fetch logos for these events
    const uniqueOrgIds = Array.from(
      new Set(announcementsData.map(e => e.organization_id).filter(id => id !== undefined))
    );
  
    const { data: orgs, error: orgsError } = await supabase
      .from("Organizations")
      .select("id, org_logo")
      .in("id", uniqueOrgIds);
  
    if (orgsError) {
      console.error("Error fetching org logos:", orgsError);
      return;
    }
  
    const orgLogoMap = new Map(orgs.map(org => [org.id, org.org_logo]));
  
    const merged = announcementsData.map(event => ({
      ...event,
      org_logo: orgLogoMap.get(event.organization_id),
    }));
  
    setAnnouncementsWithLogos(merged);
  };

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

  
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Current Organizations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Organizations</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalList}
          >
            {organizations.map((org, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.orgCircle}
                onPress={() => navigateToOrg(org.id)}
              >
                <View style={styles.orgImageWrapper}>
                  <Image source={{ uri: org.org_logo }} style={styles.orgLogo} />
                </View>
                <Text style={styles.orgCircleName}>{org.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events - Horizontal Scrollable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalList}
          >
            {eventsWithLogos.map((event, index) => (
                
              <TouchableOpacity 
                key={index} 
                style={styles.eventCard} 
                onPress={ () => {} }
              >
                <Text style={styles.eventDate}>
                  {formatDate(event.event_date)}, {formatTime(event.event_time)}
                </Text>
                <Text style={styles.eventTitle}>{event.event_name}</Text>

                <View style={styles.eventOrgContainer}>
                  <Image source={{ uri: event.org_logo }} style={styles.eventOrgLogo} />
                  <Text style={styles.eventOrg}>{event.organization_name}</Text>
                </View>

                {/* Add the Check-in button */}
                <TouchableOpacity 
                  style={styles.checkInButton}
                >
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Announcements - Horizontal Scrollable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalList}
          >
            {announcementsWithLogos.map((announcement, index) => (
              <TouchableOpacity 
              key={index} 
              style={styles.announcementCard}
              onPress={ () => {} }
              >
                <View style={styles.announcementHeader}>
                  <Image source={{ uri: announcement.org_logo }} style={styles.announcementOrgLogo} />
                  <View>
                    <Text style={styles.announcementOrg}>{announcement.organization_name}</Text>
                    <Text style={styles.announcementTime}>
                      {formatDate(announcement.announcement_date)}, {formatTime(announcement.announcement_time)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.announcementDetails}>{announcement.announcement_description}</Text>
              </TouchableOpacity>      
            ))}
          </ScrollView>
        </View>

        {/* Suggested for You - Horizontal Scrollable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested For You</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalList}
          >
            {suggestedOrgs.map((org, index) => (
              <View key={index} style={styles.suggestedCard}>
                <View style={styles.suggestedImageWrapper}>
                  <Image source={org.logo} style={styles.suggestedLogo} />
                  <Text style={styles.suggestedOrgName}>{org.name}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFFFA',
    marginBottom: 80,
  },
  section: { 
    paddingVertical: 16 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8, 
    marginLeft: 16, 
    color: '#BF5700'
  },

  // New style for horizontal content container
  horizontalList: { 
    flexDirection: 'row', 
    paddingHorizontal: 16 
  },
  horizontalScroll: {},
  
  // Org Circles ----------------
  orgCircle: { 
    alignItems: 'center', 
    marginRight: 16 
  },
  orgImageWrapper: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#EDEDED', 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  orgLogo: { 
    width: 60, 
    height: 60,
    resizeMode: 'cover'
  },
  orgCircleName: { 
    fontSize: 10,
    color: '#000', 
    marginTop: 8 
  },

  // Events Section ----------------
  eventCard: { 
    backgroundColor: '#FFFFFF',
    height: 150,
    width: 300, 
    borderRadius: 12, 
    padding: 16, 
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
  eventOrgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  eventOrg: { 
    fontSize: 12,
    fontWeight: 500, 
    color: '#00000099' 
  },
  eventOrgLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
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
  
  // Announcements Section ----------------
  announcementCard: { 
    backgroundColor: '#FFFFFF',
    height: 225,
    width: 300, 
    borderRadius: 12, 
    padding: 16, 
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  announcementOrgLogo: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    marginRight: 10 
  },
  announcementOrg: { 
    fontSize: 14, 
    fontWeight: 500, 
    color: '#000000' 
  },
  announcementTime: { 
    fontSize: 10,
    fontWeight: 500,
    color: '#00000099'
  },
  announcementDetails: { 
    fontSize: 13,
    fontWeight: 500, 
    marginTop: 8, 
    color: '#000000CC' 
  },

  // Suggested for You -----------------
  suggestedCard: { 
    alignItems: 'center', 
    marginRight: 16,
    marginBottom: 16,
  },
  suggestedImageWrapper: { 
    width: 200, 
    height: 220,
    borderRadius: 15, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },  
  suggestedOrgName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#000000', 
    marginTop: 12,
  },  
  suggestedLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
});

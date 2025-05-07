import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { supabase } from '@/components/utils/supabase';
import { router } from 'expo-router';

export default function UserProfileScreen() {
  // Fallback data for testing
  var userInterestNames: string[] = [];
  
  const [user_id, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [userInterests, setUserInterests] = useState<any[]>([]);

  const fetchUserId = async (): Promise<string | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id || null;
    setUserId(userId);
    if (!userId) console.error("User not authenticated");
    console.log("fetching user id:   " + userId);
    return userId;
  };

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();
  
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return;
    }
    
    console.log("Profile data:", profileData);
    setProfile(profileData);
  };

  const fetchTags = async () =>{ 
    const { data: tagsData, error: tagsError } = await supabase
    .from("Tags")
    .select("*");

    if (tagsError) {
      console.error("error fetching tags");
    }
    
    setTags(tagsData || []);
  }

  const fetchUserInterests = async () => {
    const { data: interestsData, error: interestsError } = await supabase
      .from("User_Interests")
      .select("tag_name")
      .eq("user_id", user_id); // Make sure you filter by user_id
  
    if (interestsError) {
      console.error("Error fetching user interests:", interestsError);
      return;
    }
  
    // Assuming interestsData is an array of objects with a "tag_name" field
    userInterestNames = interestsData?.map(interest => interest.tag_name) || [];
    setUserInterests(userInterestNames); // Update the userInterests state
    setSelectedInterests(userInterestNames); // Set selectedInterests to match the user's current interests
  };


  const toggleInterest = (interest: string) => {
    setSelectedInterests(prevInterests => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter(item => item !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  const updateInterests = async () => {
    if (profile && user_id) {
      // Update local state to reflect selected interests
      setUserInterests(selectedInterests);
  
      // Step 1: Delete the old interests from the User_Interests table
      const { error: deleteError } = await supabase
        .from("User_Interests")
        .delete()
        .eq("user_id", user_id); // Assuming user_id is the correct column name
  
      if (deleteError) {
        console.error("Error deleting old interests:", deleteError);
        return;
      }
  
      // Step 2: Insert the new interests for the user into the User_Interests table
      const newInterests = selectedInterests.map(tag_name => ({
        user_id: user_id,
        tag_name: tag_name,
      }));
  
      const { error: insertError } = await supabase
        .from("User_Interests")
        .upsert(newInterests); // Using upsert to insert new rows or update existing rows
  
      if (insertError) {
        console.error("Error inserting new interests:", insertError);
      } else {
        console.log("Interests updated successfully");
  
        // Step 3: Re-fetch the updated interests from the database
        await fetchUserInterests(); // Fetch the updated interests and update the profile
      }
    }
  
    setModalVisible(false); // Close the modal after the update
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            onPress: async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Error logging out:", error);
                return;
              }
              router.replace("/(tabs)/student-login");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await fetchUserId(); // Ensure fetchUserId() is defined and returns the correct user_id
      if (userId) {
        setUserId(userId); // Set user_id state
        fetchTags();
        await fetchProfile(userId); // Fetch the user's profile
      }
    };
  
    fetchData();
  }, []); // This effect only runs once when the component is mounted



  useEffect(() => {
    if (user_id) {
      fetchUserInterests(); // Fetch the user's interests after user_id is set
    }
  }, [user_id]); // This effect runs every time user_id changes

  useEffect(() => {
    // Initialize selected interests when profile loads
    if (profile && userInterests) {
      setSelectedInterests(userInterests);
    }
  }, [profile]);

  if (!profile) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={styles.emptyStateText}>Loading profile information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{profile.first_name} {profile.last_name}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Graduation Year</Text>
              <Text style={styles.infoValue}>{profile.classyear || 'Not set'}</Text>
            </View>
            <View style={styles.infoItemDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Major</Text>
              <Text style={styles.infoValue}>{profile.major || 'Not set'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email || 'Not set'}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.interestsContainer}>
          {(userInterests).map((interest, index) => (
            <View
              key={index}
              style={[styles.interestTile, { backgroundColor: getRandomColor(index) }]}
            >
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          

        </View>
      </View>
      
      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer space */}
      <View style={styles.footerSpace} />

      {/* Interest Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Interests</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Your current interests:</Text>
            <View style={styles.selectedInterestsContainer}>
              {(userInterests || []).map((interest, index) => (
                <View key={index} style={styles.selectedInterestTile}>
                  <Text style={styles.selectedInterestText}>{interest}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Choose new interests:</Text>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tagItem,
                    selectedInterests.includes(tag.tag_name) && styles.selectedTagItem
                  ]}
                  onPress={() => toggleInterest(tag.tag_name)}
                >
                  <Text 
                    style={[
                      styles.tagText,
                      selectedInterests.includes(tag.tag_name) && styles.selectedTagText
                    ]}
                  >
                    {tag.tag_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={updateInterests}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const getRandomColor = (index: number) => {
  const colors = ['#FFE0E6', '#D0F4DE', '#FFDEB4', '#D7E3FC', '#F8D9FF', '#C2F0FC'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#BF5700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
  },
  editProfileButton: {
    backgroundColor: '#BF5700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  userInfoContainer: {
    marginTop: 8,
  },
  userName: {
    color: '#000',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoItemDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BF5700',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTile: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BF5700',
  },
  logoutButton: {
    backgroundColor: '#FFF0EE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDC7',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  footerSpace: {
    height: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
  },
  findConnectionsButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  findConnectionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BF5700',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  closeButton: {
    fontSize: 24,
    color: '#757575',
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  searchBarPlaceholder: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  searchBarText: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagItem: {
    backgroundColor: '#BF5700',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  selectedTagText: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  updateButton: {
    backgroundColor: '#BF5700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedInterestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectedInterestTile: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
  selectedInterestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00796B',
  },
});
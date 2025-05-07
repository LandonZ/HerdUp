import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Confirmation() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <View style={styles.placeholderImage} />
        
        <Text style={styles.confirmationText}>You're all set!!</Text>
        
        <TouchableOpacity 
          style={styles.viewRsvpButton}
          onPress={() => router.push('/view-rsvp')}
        >
          <Text style={styles.viewRsvpText}>View RSVP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.discoverButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.discoverText}>Discover more events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 24,
  },
  confirmationText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 48,
    textAlign: 'center',
  },
  viewRsvpButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  viewRsvpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  discoverButton: {
    paddingVertical: 8,
  },
  discoverText: {
    color: '#666',
    fontSize: 16,
  },
});
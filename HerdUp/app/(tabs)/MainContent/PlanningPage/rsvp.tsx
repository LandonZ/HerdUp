import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function RSVP() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>RSVP</Text>
      
      <View style={styles.eventCard}>
        <Text style={styles.eventName}>General Meeting</Text>
        <View style={styles.hostContainer}>
          <Text style={styles.hostLabel}>Hosted by:</Text>
          <View style={styles.hostRow}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostInitial}>C</Text>
            </View>
            <Text style={styles.hostText}>Convergent</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="calendar-today" size={24} color="black" />
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailMainText}>Sat, 16 Dec 2025</Text>
          <Text style={styles.detailSubText}>2:00 PM - 4:00PM</Text>
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="location-on" size={24} color="black" />
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailMainText}>1,108 Gates Dell Complex</Text>
          <Text style={styles.detailSubText}>2317 Speedway, Austin, TX 78712</Text>
        </View>
      </View>
      
      <View style={styles.notificationRow}>
        <MaterialIcons name="check-box" size={24} color="#C4703C" />
        <Text style={styles.notificationText}>Enable Notifications: Get updates about this event</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => router.push('/confirmation')}
        >
          <Text style={styles.confirmButtonText}>Confirm RSVP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C4703C',
    textAlign: 'center',
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hostContainer: {
    marginTop: 8,
  },
  hostLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  hostInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hostText: {
    fontSize: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailMainText: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  notificationText: {
    fontSize: 14,
    marginLeft: 12,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  confirmButton: {
    backgroundColor: '#C4703C',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
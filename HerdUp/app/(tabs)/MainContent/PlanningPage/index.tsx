import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function EventDetails() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bookmark-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>Sketching Success</Text>
        <View style={styles.hostContainer}>
          <Text style={styles.hostLabel}>Hosted by:</Text>
          <Text style={styles.hostName}>Convergent & Design at UT</Text>
          <Text style={styles.attendingText}>23 Attending</Text>
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

        <Text style={styles.descriptionText}>
          Come along for a wild party alongside Santa's Elves, as you all go on an epic holiday adventure! The River North Bar and more of Chicago's top...
        </Text>
        <TouchableOpacity>
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.priceText}>Free</Text>
        <Link href="/rsvp" asChild>
          <TouchableOpacity style={styles.rsvpButton}>
            <Text style={styles.rsvpButtonText}>RSVP Now</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  eventContent: {
    paddingHorizontal: 16,
    flex: 1,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  hostContainer: {
    marginBottom: 24,
  },
  hostLabel: {
    fontSize: 14,
    color: '#666',
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  attendingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 16,
  },
  readMoreText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 20,
  },
  rsvpButton: {
    flex: 1,
    backgroundColor: '#C4703C',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
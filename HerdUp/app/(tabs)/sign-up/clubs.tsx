import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

const UT_BURNT_ORANGE = '#BF5700';
const uuid = "df6a4449-0708-49b4-8e0a-e5f900e4411a";

const passionsData = [
  { label: 'Business', icon: '💼', bgColor: '#E0F3FF', textColor: '#0080FF' },
  { label: 'Health', icon: '❤️', bgColor: '#FFE0E0', textColor: '#FF4D4D' },
  { label: 'Tech', icon: '💻', bgColor: '#FFF0D9', textColor: '#FF8000' },
  { label: 'Sustainability', icon: '🌱', bgColor: '#D4FBD7', textColor: '#00AA00' },
  { label: 'Design', icon: '🎨', bgColor: '#FFE0E0', textColor: '#FF4D4D' },
  { label: 'Networking', icon: '🤝', bgColor: '#E0E0E0', textColor: '#666666' },
];

export default function ClubsScreen() {
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());

  const toggleChip = (label: string) => {
    setSelectedSet((prev) => {
      const updated = new Set(prev);
      updated.has(label) ? updated.delete(label) : updated.add(label);
      return updated;
    });
  };

  const handleFinish = async () => {
    const clubsArray = Array.from(selectedSet);

    const {error} = await supabase
      .from("User_Profiles")
      .update({ clubs: clubsArray })
      .eq('user_id', uuid)

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.push('/(tabs)');
      }
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <Text style={styles.stepText}>5/5</Text>

      {/* Updated Question Title */}
      <Text style={styles.questionTitle}>What fuels your passion?</Text>

      {/* Two-column grid of chips */}
      <View style={styles.chipsContainer}>
        {passionsData.map((item) => {
          const isSelected = selectedSet.has(item.label);
          return (
            <Pressable
              key={item.label}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? UT_BURNT_ORANGE : item.bgColor,
                  borderColor: isSelected ? UT_BURNT_ORANGE : 'transparent',
                },
              ]}
              onPress={() => toggleChip(item.label)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? 'white' : item.textColor,
                  },
                ]}
              >
                {item.icon} {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Finish Button */}
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  stepText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: UT_BURNT_ORANGE,
    marginBottom: 10,
  },
  // Increased font size for question and more bottom spacing
  questionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: UT_BURNT_ORANGE,
    marginBottom: 40,
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chip: {
    width: '48%',
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  finishButton: {
    marginTop: 'auto',
    backgroundColor: UT_BURNT_ORANGE,
    paddingVertical: 15,
    borderRadius: 35,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

const UT_BURNT_ORANGE = '#BF5700';
const uuid = "df6a4449-0708-49b4-8e0a-e5f900e4411a";

// The time commitment options (you can edit as needed)
const commitOptions = [
  'Occasional (1-2 Hours)',
  'Light participation (3-5 Hours)',
  'Regular involvement (6-10 Hours)',
  'Committed (11-13 Hours)',
  'All in (14+ Hours)',
  "Don't know",
];

export default function CommitScreen() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleContinue = async () => {
    if(selectedIndex === null) {
      Alert.alert('Error', 'Please select a time commitment option.');
      return;
    }

    const selectedOption = commitOptions[selectedIndex];

    const {error} = await supabase
      .from("User_Profiles")
      .update({ commitment: selectedOption })
      .eq('user_id', uuid)

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/(tabs)/sign-up/clubs');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.push('/(tabs)/sign-up/clubs');
  };

  return (
    <View style={styles.container}>
      {/* Step indicator */}
      <Text style={styles.stepText}>4/5</Text>

      {/* Question */}
      <Text style={styles.questionTitle}>How much time can you commit?</Text>

      {/* Options as a radio list */}
      <View style={styles.optionsContainer}>
        {commitOptions.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => setSelectedIndex(index)}
              activeOpacity={0.8}
            >
              <View style={[styles.bullet, isSelected && styles.bulletSelected]}>
                {isSelected && <View style={styles.bulletInner} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Set up later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  questionTitle: {
    fontSize: 26, // Increased font size
    fontWeight: '600',
    color: UT_BURNT_ORANGE,
    marginBottom: 50, // More space after question
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30, // Increased space between options
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletSelected: {
    borderColor: UT_BURNT_ORANGE,
  },
  bulletInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: UT_BURNT_ORANGE,
  },
  optionText: {
    fontSize: 18, // Increased font size for options
    color: 'black',
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: UT_BURNT_ORANGE,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goBackButton: {
    borderWidth: 2,
    borderColor: UT_BURNT_ORANGE,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  goBackButtonText: {
    color: UT_BURNT_ORANGE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
});

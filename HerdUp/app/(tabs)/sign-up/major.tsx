import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

const UT_BURNT_ORANGE = '#BF5700';
const uuid = "df6a4449-0708-49b4-8e0a-e5f900e4411a"

export default function MajorScreen() {
  const router = useRouter();

  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [loading, setLoading] = useState(false);

  // "Continue" navigates to the next screen; "Go Back" returns; "Set up later" skips to clubs.
  const handleContinue = async () => {
    setLoading(true);
    const profileData = {
      major,
      minor,
      user_id: uuid,
    }

    const {data, error} = await supabase
      .from("User_Profiles")
      .update({major: profileData.major, minor: profileData.minor})
      .eq('user_id', profileData.user_id)

    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      // On success, navigate to the next screen
      router.push('/(tabs)/sign-up/graduate');
    }
    
    router.push('/(tabs)/sign-up/graduate');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.push('/(tabs)/sign-up/clubs');
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.stepText}>2/5</Text>
        <Text style={styles.questionTitle}>What’s your major?</Text>
        <TextInput
          style={styles.input}
          placeholder="For Ex: Business"
          placeholderTextColor="#999"
          value={major}
          onChangeText={setMajor}
        />

        <Text style={styles.questionTitle}>What about a minor?</Text>
        <TextInput
          style={styles.input}
          placeholder="Put N/A if you don't have one"
          placeholderTextColor="#999"
          value={minor}
          onChangeText={setMinor}
        />
      </View>

      {/* Bottom Section: Buttons positioned in the upper part of the lower third */}
      <View style={styles.bottomSection}>
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
    paddingBottom: 80, // Ensures extra space at bottom
    justifyContent: 'space-between',
  },
  topSection: {
    // Occupies the top portion for question texts and inputs
  },
  stepText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: UT_BURNT_ORANGE,
    marginBottom: 10,
    marginRight: 4,
  },
  questionTitle: {
    fontSize: 30,  // Larger font for questions
    fontWeight: '600',
    color: UT_BURNT_ORANGE,
    marginBottom: 30, // More space below question heading
    marginTop: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: 'black',
    paddingVertical: 12, // More vertical padding
    fontSize: 18, // Bigger input text
    marginBottom: 50,
    color: 'black',
  },
  bottomSection: {
    // Positioned in the lower third – adjust marginTop if needed
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: UT_BURNT_ORANGE,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
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
    paddingVertical: 14,
    alignItems: 'center',
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
    textAlign: 'center',
    fontSize: 14,
  },
});

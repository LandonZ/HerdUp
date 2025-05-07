import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

const UT_BURNT_ORANGE = '#BF5700';
const uuid = "df6a4449-0708-49b4-8e0a-e5f900e4411a";

// Generate graduation terms from Spring '24 to Fall '31
const generateTerms = () => {
  const terms: string[] = [];
  for (let year = 2024; year <= 2031; year++) {
    terms.push(`Spring '${year.toString().slice(-2)}`);
    terms.push(`Fall '${year.toString().slice(-2)}`);
  }
  return terms;
};

const graduationTerms = generateTerms();

export default function GraduateScreen() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const listRef = useRef<FlatList<string>>(null);

  // Define item height – adjust for your design
  const ITEM_HEIGHT = 120;
  const windowWidth = Dimensions.get('window').width;

  // When scrolling, compute which item is centered.
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // Using paddingVertical = ITEM_HEIGHT * 1.5 means center is offset by that amount
    const centerOffset = offsetY + ITEM_HEIGHT * 1.5;
    const index = Math.round(centerOffset / ITEM_HEIGHT) - 1; // subtract 1 to fine-tune centering
    if (index >= 0 && index < graduationTerms.length) {
      setSelectedIndex(index);
    }
  };

  const handleContinue = async () => {
    const selectedTerm = graduationTerms[selectedIndex];

    // Update the user's profile in the "user_profiles" table (hardcoded)
    const { error } = await supabase
      .from("User_Profiles")
      .update({ graduation: selectedTerm })
      .eq('user_id', uuid);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/(tabs)/sign-up/commit');
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
      {/* Header: Back button and Step Indicator */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>3/5</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>When do you graduate?</Text>

      {/* Scrollable Graduation Terms */}
      <View style={styles.wheelContainer}>
        <FlatList
          ref={listRef}
          data={graduationTerms}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 1.5,
          }}
          renderItem={({ item, index }) => {
            const diff = Math.abs(index - selectedIndex);
            // Center item: largest font, full opacity
            let fontSize = 56;
            let color = UT_BURNT_ORANGE;
            let opacity = 1.0;
            if (diff === 1) {
              fontSize = 48;
              color = '#666';
              opacity = 0.7;
            } else if (diff >= 2) {
              fontSize = 32;
              color = '#aaa';
              opacity = 0.4;
            }
            return (
              <View style={[styles.itemContainer, { height: ITEM_HEIGHT }]}>
                <Text style={[styles.itemText, { fontSize, color, opacity }]}>
                  {item}
                </Text>
              </View>
            );
          }}
        />
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    // Optionally add padding for touch area
  },
  backButtonText: {
    color: UT_BURNT_ORANGE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    color: UT_BURNT_ORANGE,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: UT_BURNT_ORANGE,
    marginBottom: 20,
    textAlign: 'center',
  },
  wheelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: UT_BURNT_ORANGE,
    paddingVertical: 14,
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
    paddingVertical: 14,
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
    marginTop: 5,
    color: 'gray',
    textAlign: 'center',
    fontSize: 14,
  },
});

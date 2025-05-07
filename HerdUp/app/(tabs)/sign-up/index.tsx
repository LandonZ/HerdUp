import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

const UT_BURNT_ORANGE = '#BF5700';

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [utEid, setUtEid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      //Hardcoded for testing
      //Alert.alert('Sign Up Failed', error.message);
      //console.log(error);
      router.push('/(tabs)/sign-up/major');
    } else {
      Alert.alert('Sign Up Successful', `Welcome!`);
      router.push('/(tabs)/sign-up/major');
    }
  };

  return (
    <View style={styles.container}>
      {/* Step indicator at top right */}
      <Text style={styles.stepText}>1/5</Text>

      {/* Main title */}
      <Text style={styles.title}>Create an account</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* UT EID */}
      <Text style={styles.label}>UT EID</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={utEid}
        onChangeText={setUtEid}
      />

      {/* UT Email */}
      <Text style={styles.label}>UT Email</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => {
          if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
          }
          handleSignUp(email, password);
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Sign Up with Google */}
      <TouchableOpacity style={styles.signUpWithButton}>
        <Text style={styles.signUpWithText}>Sign Up with</Text>
        <View style={styles.googleIcon}>
          <Text style={styles.googleIconText}>G</Text>
        </View>
      </TouchableOpacity>

      {/* Already a member? Sign In */}
      <TouchableOpacity style={styles.signInLink} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.signInLinkText}>
          Already a member? <Text style={styles.signInLinkBold}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  stepText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: UT_BURNT_ORANGE,
    marginBottom: 10,
    marginRight: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UT_BURNT_ORANGE,
    marginBottom: 30,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: 'black',
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  signUpButton: {
    backgroundColor: UT_BURNT_ORANGE,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  signUpWithButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: UT_BURNT_ORANGE,
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 14,
  },
  signUpWithText: {
    fontSize: 16,
    color: UT_BURNT_ORANGE,
    fontWeight: '500',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: UT_BURNT_ORANGE,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: UT_BURNT_ORANGE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  signInLink: {
    marginTop: 40,
    alignSelf: 'center',
  },
  signInLinkText: {
    fontSize: 14,
    color: 'gray',
  },
  signInLinkBold: {
    color: UT_BURNT_ORANGE,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  // UT_BURNT_ORANGE is inline above, or you can define it here
});

import { useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

import { ThemedView } from '@/components/ThemedView';

export default function WelcomeScreen() {
  // const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign In Failed", error.message);
    } else {
      router.replace('/(tabs)/MainContent/HomePage/page');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* logo */}
      <Image
        source={require('@/assets/images/herdUpLogo.png')}
        style={styles.herdUpLogo}
      />

      {/* input fields */}

      {/* email */}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput 
        style={styles.inputField} 
        placeholder=""
        value={email}
        onChangeText={setEmail}
        autoCapitalize = "none"
      />

      {/* Password Field */}
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput 
        style={styles.inputField} 
        placeholder=""
        secureTextEntry
        value = {password}
        onChangeText= {setPassword}
      />

      <TouchableOpacity style={styles.forgotPasswordButton} 
        onPress={() => router.push('/forgot-password')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign in Button */}
      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={() => {
          if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields.");
            return;
          }

          handleSignIn(email, password);
        }} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signInButtonText}>Log In</Text>}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider}></View>
        <View style={styles.orContainer}>
          <Text style={styles.orText}>or</Text>
        </View>
        <View style={styles.divider}></View>
      </View>

      {/* Sign In With */}
      <TouchableOpacity style={styles.signInWithButton}>
        <Text style={styles.signInWithText}>Sign In with</Text>
        <Image 
          source={require('@/assets/images/google-icon-logo.png')}
          style={styles.signInWithIcon}
        />
      </TouchableOpacity>

      {/* Sign Up */}
      <TouchableOpacity
        onPress={() => router.push('/sign-up')}>
          <Text style={styles.signUpText}>
            Not a member? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    padding: 0,
  },
  herdUpLogo: {
    width: 310,
    height: 150,
    resizeMode: 'contain',
    alignContent: 'center',
    marginTop: 100,
    marginBottom: 25,
    borderWidth: 0,
  },
  inputLabel: {
    width: '80%',
    fontSize: 15,
    marginBottom: 10,
    color: 'black',
    fontWeight: '400',
  },
  inputField: {
    width: '80%',
    borderBottomWidth: 1.5,
    borderBottomColor: 'black',
    marginBottom: 24,
    paddingVertical: 5,
    fontSize: 16,
  },
  forgotPasswordButton: {
    width: '80%',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
    fontSize: 15,
    color: '#6b6767',
  },
  signInButton: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#B45309',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 40,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 600,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#6b6767',
  },
  orContainer: {
    marginHorizontal: 20,
  },
  orText: {
    fontSize: 18,
    color: '#6b6767',
    fontWeight: 500,
  },
  signInWithButton: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#B45309',
    marginTop: 0,
  },
  signInWithText: {
    color: '#B45309',
    fontSize: 22,
    fontWeight: 600,
    marginRight: 8,
  },
  signInWithIcon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },
  signUpText: {
    color: 'gray',
    marginTop: 70,
    fontSize: 16,
  },
  signUpLink: {
    color: 'gray',
    textDecorationLine: 'underline',
  },
});
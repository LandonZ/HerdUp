import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Images */}
      <View style={styles.imageRow}>
        {/* left col */}
        <View style={styles.sideImageColumn}>
          <Image source={require('@/assets/images/topLeft.png')} style={styles.sideImage} />
          <Image source={require('@/assets/images/bottomLeft.png')} style={styles.sideImage} />
        </View>

        {/* center image */}
        <Image source={require('@/assets/images/center.jpg')} style={styles.centerImage} />

        {/* right col */}
        <View style={styles.sideImageColumn}>
          <Image source={require('@/assets/images/topRight.png')} style={styles.sideImage} />
          <Image source={require('@/assets/images/bottomRight.png')} style={styles.sideImage} />
        </View>
      </View>

      {/* welcome text */}
      <Text style={styles.welcomeText}>Welcome to</Text>
      {/* herdup logo */}
      <Image
        source={require('@/assets/images/herdUpLogo.png')}
        style={styles.herdUpLogo}
      />

      {/* description */}
      <Text style={styles.subtitleText}>The hub for Texas student organizations in athletics, technology, business, and more.</Text>

      {/* Sign in Button */}
      <TouchableOpacity 
        style={styles.signInButton}
        onPress={() => router.replace('/student-login')}
      >
          <Text style={styles.signInButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <TouchableOpacity 
        style={styles.signUpButton}
        onPress={() => router.push('/sign-up')}
      >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '110%',
    overflow: 'hidden',
  },
  sideImageColumn: {
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  sideImage: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginVertical: 10,
  },
  centerImage: {
    width: 180,
    height: 300,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 30,
  },
  welcomeText: {
    marginTop: 5,
    fontSize: 30,
    color: 'black',
    fontWeight: 600,
  },
  herdUpLogo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    paddingTop: 0,
    marginTop: 0,
    borderWidth: 0,
  },
  subtitleText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 17,
    color: '#A9A9A9',
  },
  signInButton: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#B45309',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 600,
  },
  signUpButton: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#B45309',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#B45309',
    fontSize: 22,
    fontWeight: 600,
  },
});

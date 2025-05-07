// do npm install @react-navigation/stack
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './(tabs)'; // Your Welcome Page
import StudentLoginScreen from './(tabs)/student-login'; // Student Login Page
import { StatusBar } from 'react-native';

export type RootStackParamList = {
    Welcome: undefined;
    StudentLogin: undefined;
  };
  
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false, // Hide default headers for a cleaner UI
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

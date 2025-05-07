import React from 'react';
import { Stack } from 'expo-router';

export default function SignUpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="major" />
      <Stack.Screen name="graduate" />
      <Stack.Screen name="commit" />
      <Stack.Screen name="clubs" />
    </Stack>
  );
}

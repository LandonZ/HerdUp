import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#CC5E00',
            position: 'absolute',
            padding: 20,
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="HomePage/page"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SearchPage/page"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="PlanningPage/page"
        options={{
          title: 'Planning',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ProfilePage/page"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      {/* Add this to get rid of Maehek's shenanigans */}
      <Tabs.Screen
        name="ProfilePage/user-profile"
        options={{
          href: null, // Prevents the route from showing in tab bar
        }}
      />
      <Tabs.Screen
        name="OrgPage/[id]"
        options={{
          href: null, // Prevents the route from showing in tab bar
        }}
      />
    </Tabs>
  );
}
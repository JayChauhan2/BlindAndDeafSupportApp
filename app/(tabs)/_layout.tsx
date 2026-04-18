import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

import { ThemeContext } from '@/components/ThemeContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  const { currentTheme } = useContext(ThemeContext);

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
        tabBarActiveTintColor: Colors.lightBg,
        tabBarInactiveTintColor: Colors.darkBg,
        tabBarLabelStyle: {
          fontSize: 16, // Set your desired font size here
          fontWeight: 'bold',
          color: currentTheme === 'dark' ? 'red' : Colors.lightBg
        },
        tabBarStyle: { backgroundColor: currentTheme === 'dark' ? Colors.darkGray : Colors.lightGray } 
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={focused ? Colors.lightBg : '#B7B7B3'} 
              size={28}
            />
          ),
          
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ focused}) => (
            <Ionicons
              name={focused ? 'camera' : 'camera-outline'}
              color={focused ? Colors.lightBg : '#B7B7B3'}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
    
  );
}

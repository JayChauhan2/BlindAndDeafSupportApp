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
        tabBarActiveTintColor: '#0077b6',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 16, // Set your desired font size here
          fontWeight: 'bold',
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
              color={focused ? '#0077b6' : 'gray'} 
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
              color={focused ? '#0077b6' : '#gray'} 
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transcription"
        options={{
          title: 'Transcribe',
          tabBarIcon: ({ focused}) => (
            <Ionicons
              name={focused ? 'ear' : 'ear-outline'}
              color={focused ? '#0077b6' : '#gray'} 
              size={28}
            />
          ),
        }}
      />
    </Tabs>
    
  );
}

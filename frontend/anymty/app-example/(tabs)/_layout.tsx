// app/(tabs)/_layout.tsx
import { ChatIcon, SettingsIcon, TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
export default function TabLayout() {
  const colorScheme = useColorScheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
        />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: (props) => <ChatIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: (props) => <SettingsIcon {...props} />,
        }}
      />
      
    </Tabs>
  );
}

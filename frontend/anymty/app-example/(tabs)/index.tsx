import { Link } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Button } from 'react-native-elements';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'tabIconDefault');

  return (
    <>
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Anonymous Chat</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Start Chatting</ThemedText>
          <ThemedText>
            Begin your anonymous conversations. Your privacy is our priority.
          </ThemedText>
          <Link href="/chat" asChild>
            <Button title="Go to Chats" containerStyle={styles.button} buttonStyle={{ backgroundColor: buttonColor }} />
          </Link>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Customize Your Experience</ThemedText>
          <ThemedText>
            Adjust your settings to tailor the app to your preferences.
          </ThemedText>
          <Link href="/settings" asChild>
            <Button title="Open Settings" containerStyle={styles.button} buttonStyle={{ backgroundColor: buttonColor }} />
          </Link>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">How It Works</ThemedText>
          <ThemedText>
            1. Start a new chat or join an existing one.{'\n'}
            2. Chat freely - your identity remains hidden.{'\n'}
            3. Use <ThemedText type="defaultSemiBold">"/commands"</ThemedText> for special actions.{'\n'}
            4. Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
            </ThemedText>{' '}
            to access developer tools.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 20,
  },
  chatIcon: {
    height: 100,
    width: 100,
    bottom: 20,
    right: 20,
    position: 'absolute',
  },
  button: {
    marginTop: 10,
  },
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isAnonymousModeEnabled, setIsAnonymousModeEnabled] = React.useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      router.replace('/loginscreen');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
    }
  };

  const renderSwitch = (title: string, value: boolean, onValueChange: (value: boolean) => void) => (
    <View style={styles.switchContainer}>
      <Text style={[styles.switchText, { color: colors.text }]}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.background : colors.text}
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <CustomButton title="Change Username" onPress={() => {}} />
        <CustomButton title="Privacy Settings" onPress={() => {}} />
      </View>
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        {renderSwitch('Enable Notifications', isNotificationsEnabled, setIsNotificationsEnabled)}
        {renderSwitch('Anonymous Mode', isAnonymousModeEnabled, setIsAnonymousModeEnabled)}
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <CustomButton title="Terms of Service" onPress={() => {}} />
        <CustomButton title="Privacy Policy" onPress={() => {}} />
        <Text style={[styles.version, { color: colors.text }]}>Version 1.0.0</Text>
      </View>
      <CustomButton title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchText: {
    fontSize: 16,
  },
  version: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default SettingsScreen;
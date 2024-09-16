import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isAnonymousModeEnabled, setIsAnonymousModeEnabled] = React.useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <CustomButton title="Change Username" onPress={() => {}} />
        <CustomButton title="Privacy Settings" onPress={() => {}} />
      </View>
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchText, { color: colors.text }]}>Enable Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isNotificationsEnabled ? colors.background : colors.text}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchText, { color: colors.text }]}>Anonymous Mode</Text>
          <Switch
            value={isAnonymousModeEnabled}
            onValueChange={setIsAnonymousModeEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isAnonymousModeEnabled ? colors.background : colors.text}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <CustomButton title="Terms of Service" onPress={() => {}} />
        <CustomButton title="Privacy Policy" onPress={() => {}} />
        <Text style={[styles.version, { color: colors.text }]}>Version 1.0.0</Text>
      </View>
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
  },
});

export default SettingsScreen;
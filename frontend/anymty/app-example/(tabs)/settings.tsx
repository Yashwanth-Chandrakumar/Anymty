import { useTheme } from '@/hooks/useTheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Switch } from 'react-native-elements';

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ListItem bottomDivider containerStyle={{ backgroundColor }}>
        <ListItem.Content>
          <ListItem.Title style={{ color: textColor }}>Notifications</ListItem.Title>
        </ListItem.Content>
        <Switch
          value={notifications}
          onValueChange={(value) => setNotifications(value)}
        />
      </ListItem>
      <ListItem bottomDivider containerStyle={{ backgroundColor }}>
        <ListItem.Content>
          <ListItem.Title style={{ color: textColor }}>Dark Mode</ListItem.Title>
        </ListItem.Content>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </ListItem>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
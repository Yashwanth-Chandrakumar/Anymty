import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from '../hooks/useCustomTheme';

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  isUnread?: boolean; // Added optional prop to show unread message state
}

const ChatItem: React.FC<ChatItemProps> = ({ id, name, lastMessage, time, isUnread = false }) => {
  const { colors } = useCustomTheme();
  const router = useRouter();

  const handlePress = () => {
    // Update the route to match your app's structure
    router.push(`/chat/${id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderBottomColor: colors.border }]} 
      onPress={handlePress}
      accessibilityLabel={`Chat with ${name}`}
    >
      <Avatar name={name} />
      <MessageContent 
        name={name} 
        lastMessage={lastMessage} 
        time={time} 
        isUnread={isUnread} 
      />
    </TouchableOpacity>
  );
};

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.avatar}>
      <Ionicons name="person-circle-outline" size={50} color={colors.text} />
    </View>
  );
};

interface MessageContentProps {
  name: string;
  lastMessage: string;
  time: string;
  isUnread: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ name, lastMessage, time, isUnread }) => {
  const { colors } = useCustomTheme();
  
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }, isUnread && styles.unreadText]}>
          {name}
        </Text>
        <Text style={[styles.time, { color: colors.text }]}>{time}</Text>
      </View>
      <Text 
        style={[styles.message, { color: colors.text }]} 
        numberOfLines={1}
      >
        {lastMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unreadText: {
    color: '#ff5a5f', // Highlight color for unread messages
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
  },
});

export default ChatItem;

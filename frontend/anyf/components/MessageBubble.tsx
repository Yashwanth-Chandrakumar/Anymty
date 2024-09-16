import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from '../hooks/useCustomTheme';

interface MessageProps {
  message: {
    sender: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
  };
}

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const { colors } = useCustomTheme();
  const isOwnMessage = message.sender === 'me'; // Replace with actual logic

  const handleFileOpen = () => {
    if (message.fileUrl) {
      Linking.openURL(message.fileUrl);
    }
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage,
      { backgroundColor: isOwnMessage ? colors.primary : colors.card }
    ]}>
      {message.type === 'text' && (
        <Text style={[styles.text, { color: isOwnMessage ? colors.background : colors.text }]}>
          {message.content}
        </Text>
      )}
      {message.type === 'image' && (
        <Image source={{ uri: message.fileUrl }} style={styles.image} />
      )}
      {message.type === 'file' && (
        <TouchableOpacity onPress={handleFileOpen}>
          <Text style={[styles.text, { color: isOwnMessage ? colors.background : colors.text }]}>
            📎 {message.content}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.timestamp, { color: isOwnMessage ? colors.background : colors.text }]}>
        {message.timestamp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
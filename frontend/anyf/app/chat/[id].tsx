import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get(`http://127.0.0.1:8000/chatrooms/${id}/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const { token } = JSON.parse(userInfo);
          await axios.post(
            `http://127.0.0.1:8000/chatrooms/${id}/messages/`,
            { content: inputText },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setInputText('');
          fetchMessages();
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, { backgroundColor: colors.card }]}>
      <Text style={[styles.messageSender, { color: colors.text }]}>{item.sender}</Text>
      <Text style={[styles.messageContent, { color: colors.text }]}>{item.content}</Text>
      <Text style={[styles.messageTimestamp, { color: colors.text }]}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContent: {
    marginBottom: 5,
  },
  messageTimestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
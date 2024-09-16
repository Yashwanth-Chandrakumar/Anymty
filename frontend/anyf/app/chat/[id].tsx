import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MessageBubble from '../../components/MessageBubble';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { fetchMessages, sendMessage } from '../../services/chatService';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

const ChatScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { colors } = useCustomTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const fetchedMessages = await fetchMessages(id as string);
    setMessages(fetchedMessages);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      await sendMessage(id as string, { type: 'text', content: inputText });
      setInputText('');
      loadMessages();
    }
  };

  const handleSendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await sendMessage(id as string, { type: 'image', content: result.assets[0].uri });
      loadMessages();
    }
  };

  const handleSendFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
      });

      if (result.type === 'success') {
        await sendMessage(id as string, { 
          type: 'file', 
          content: result.uri,
          name: result.name
        });
        loadMessages();
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleSendImage}>
          <Ionicons name="image" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendFile}>
          <Ionicons name="document" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;
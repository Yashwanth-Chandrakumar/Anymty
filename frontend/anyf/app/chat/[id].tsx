import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  file_url?: string;
  file_type?: string;
}

const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = useCallback(async (content: string, file?: any) => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const formData = new FormData();
        formData.append('content', content);

        if (file) {
          const fileInfo = await fetch(file.uri);
          const fileBlob = await fileInfo.blob();
          formData.append('file', fileBlob, file.name);
        }

        const response = await axios.post('http://127.0.0.1:8000/chatrooms/1/messages/', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Message sent successfully:', response.data);
        setInputText('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  }, []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      sendMessage('', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
    setIsAttachmentMenuVisible(false);
  }, [sendMessage]);

  const pickDocument = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      sendMessage('', {
        uri: asset.uri,
        type: asset.mimeType,
        name: asset.name,
      });
    }
    setIsAttachmentMenuVisible(false);
  }, [sendMessage]);

  const fetchMessages = useCallback(async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get('http://127.0.0.1:8000/chatrooms/1/messages/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  


  const renderMessageItem = useCallback(({ item }: { item: Message }) => (
    <View style={[styles.messageItem, { alignSelf: item.sender === 'You' ? 'flex-end' : 'flex-start' }]}>
      {item.type === 'text' && (
        <View style={[styles.textBubble, { backgroundColor: item.sender === 'You' ? colors.primary : colors.card }]}>
          <Text style={[styles.messageContent, { color: item.sender === 'You' ? 'white' : colors.text }]}>{item.content}</Text>
        </View>
      )}
      {item.type === 'image' && item.file_url && (
        <Image source={{ uri: item.file_url }} style={styles.imageMessage} />
      )}
      {item.type === 'file' && item.file_url && (
        <TouchableOpacity onPress={() => Linking.openURL(item.file_url)}>
          <View style={[styles.fileBubble, { backgroundColor: item.sender === 'You' ? colors.primary : colors.card }]}>
            <Ionicons name="document" size={24} color={item.sender === 'You' ? 'white' : colors.text} />
            <Text style={[styles.fileName, { color: item.sender === 'You' ? 'white' : colors.text }]}>
              {item.file_url.split('/').pop()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  ), [colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setIsAttachmentMenuVisible(!isAttachmentMenuVisible)} style={styles.attachButton}>
          <Ionicons name="attach" size={24} color={colors.text} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity onPress={() => sendMessage(inputText)} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isAttachmentMenuVisible && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity onPress={pickImage} style={styles.attachmentOption}>
            <Ionicons name="image" size={30} color={colors.primary} />
            <Text style={{ color: colors.text }}>Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickDocument} style={styles.attachmentOption}>
            <Ionicons name="document" size={30} color={colors.primary} />
            <Text style={{ color: colors.text }}>Document</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageItem: {
    maxWidth: '80%',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  textBubble: {
    borderRadius: 20,
    padding: 10,
  },
  messageContent: {
    fontSize: 16,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  fileBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  attachButton: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  attachmentOption: {
    alignItems: 'center',
  },
});

export default ChatScreen;
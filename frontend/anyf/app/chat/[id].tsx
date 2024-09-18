import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
  fileType?: string;
  type: 'text' | 'image' | 'file';
}

const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
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

  const sendMessage = async (fileUri: string | null = null, fileType: string | null = null) => {
    if (inputText.trim() || fileUri) {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const { token } = JSON.parse(userInfo);
          const formData = new FormData();
          formData.append('content', inputText);
  
          if (fileUri && fileType) {
            const response = await fetch(fileUri);
            const blob = await response.blob();
            formData.append('file', {
              uri: fileUri,
              type: fileType, // Ensure the correct MIME type
              name: fileUri.split('/').pop() // Extract filename
            });
          }
  
          await axios.post(
            `http://127.0.0.1:8000/chatrooms/${id}/messages/`,
            formData,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
          );
          setInputText('');
          fetchMessages();
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      sendMessage(result.assets[0].uri, 'image');
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.assets && result.assets.length > 0) {
      sendMessage(result.assets[0].uri, 'file');
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, { backgroundColor: colors.card }]}>
      <Text style={[styles.messageSender, { color: colors.text }]}>{item.sender}</Text>
      {item.type === 'text' && (
        <Text style={[styles.messageContent, { color: colors.text }]}>{item.content}</Text>
      )}
      {item.type === 'image' && item.fileUrl && (
        <TouchableOpacity onPress={() => setSelectedImage(item.fileUrl)}>
          <Image source={{ uri: item.fileUrl }} style={styles.imagePreview} />
        </TouchableOpacity>
      )}
      {item.type === 'file' && (
        <TouchableOpacity onPress={() => console.log('Open file', item.fileUrl)}>
          <View style={styles.filePreview}>
            <Ionicons name="document" size={24} color={colors.text} />
            <Text style={[styles.fileName, { color: colors.text }]}>
              {item.fileUrl?.split('/').pop()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <Text style={[styles.messageTimestamp, { color: colors.text }]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

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
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <Ionicons name="image" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={pickDocument}>
          <Ionicons name="document" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={() => sendMessage()}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
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
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fileName: {
    marginLeft: 10,
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
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default ChatScreen;
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get('http://127.0.0.1:8000/chatrooms/1/messages/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: 'timestamp' } // Add ordering parameter here
        });
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
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

  const renderMessageItem = useCallback(({ item }: { item: Message }) => (
    <View style={[styles.messageItem, { alignSelf: item.sender === 'You' ? 'flex-end' : 'flex-start' }]} key={item.id}>
      {item.type === 'text' && (
        <View style={[styles.textBubble, { backgroundColor: item.sender === 'You' ? colors.primary : colors.card }]}>
          <Text style={[styles.messageContent, { color: item.sender === 'You' ? 'white' : colors.text }]}>{item.content}</Text>
        </View>
      )}
      {item.type === 'image' && item.file_url && (
        <TouchableOpacity onPress={() => setSelectedImage(item.file_url)}>
          <Image source={{ uri: item.file_url }} style={styles.imageMessage} />
        </TouchableOpacity>
      )}
      {item.type === 'file' && item.file_url && (
        <TouchableOpacity onPress={() => setSelectedPdf(item.file_url)}>
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
  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
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
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
      <Modal visible={!!selectedPdf} transparent={true} onRequestClose={() => setSelectedPdf(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPdf(null)}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedPdf && (
            <WebView
              source={{ uri: selectedPdf }}
              style={styles.fullScreenPdf}
            />
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
    margin: 10,
    maxWidth: '80%',
  },
  textBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageContent: {
    fontSize: 16,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  fileBubble: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'grey',
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentMenu: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fullScreenPdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default ChatScreen;

import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  public: boolean;
}

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get('https://anymty-qe5z.onrender.com/chatrooms/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Chat Rooms:', response.data); // Check the returned data
        setChatRooms(response.data);  // Set the chat rooms to the state
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };
  
  

  const createChatRoom = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        await axios.post(
          'https://anymty-qe5z.onrender.com/chatrooms/',
          {
            name: newRoomName,
            description: newRoomDescription,
            public: isPublic,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setModalVisible(false);
        setNewRoomName('');
        setNewRoomDescription('');
        setIsPublic(true);
        fetchChatRooms();
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const renderChatRoomItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={[styles.chatRoomItem, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.chatRoomContent}>
        <Text style={[styles.chatRoomName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.chatRoomDescription, { color: colors.text }]} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <Ionicons 
        name={item.public ? "earth" : "lock-closed"} 
        size={24} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoomItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Chat Room</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Chat Room Name"
              placeholderTextColor={colors.text}
              value={newRoomName}
              onChangeText={setNewRoomName}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Description"
              placeholderTextColor={colors.text}
              value={newRoomDescription}
              onChangeText={setNewRoomDescription}
              multiline
            />
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Public</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isPublic ? colors.background : colors.text}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={createChatRoom}
            >
              <Text style={styles.buttonText}>Create Chat Room</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatRoomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatRoomContent: {
    flex: 1,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatRoomDescription: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
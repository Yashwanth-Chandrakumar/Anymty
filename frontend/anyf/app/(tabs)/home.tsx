import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ChatItem from '../../components/ChatItem';

interface ChatData {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
}

const dummyData: ChatData[] = [
  { id: '1', name: 'Anonymous User 1', lastMessage: 'Hey there! How are you doing?', time: '10:30 AM' },
  { id: '2', name: 'Anonymous User 2', lastMessage: 'Did you see the latest news?', time: '11:45 AM' },
  { id: '3', name: 'Anonymous User 3', lastMessage: 'Lets meet up soon!', time: '2:15 PM' },
  { id: '4', name: 'Anonymous User 4', lastMessage: 'Thanks for your help yesterday!', time: '5:20 PM' },
  { id: '5', name: 'Anonymous User 5', lastMessage: 'What are your plans for the weekend?', time: 'Yesterday' },
];

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={dummyData}
        renderItem={({ item }) => (
          <ChatItem
            id={item.id}
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
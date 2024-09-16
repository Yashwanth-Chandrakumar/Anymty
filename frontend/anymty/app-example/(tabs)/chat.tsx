import { useThemeColor } from '@/hooks/useThemeColor';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
}

const chats: Chat[] = [
  { id: '1', name: 'Anonymous 1', lastMessage: 'Hello there!' },
  { id: '2', name: 'Anonymous 2', lastMessage: 'How are you?' },
];

export default function ChatsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'background');

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={[styles.chatItem, { backgroundColor, borderBottomColor: borderColor }]}>
      <Link href={`/chat/${item.id}`} asChild>
        <View style={styles.chatInfo}>
          <Avatar
            rounded
            title={item.name[0]}
            containerStyle={styles.avatar}
          />
          <View style={styles.chatInfo}>
            <Text style={[styles.chatName, { color: textColor }]}>{item.name}</Text>
            <Text style={[styles.lastMessage, { color: textColor }]}>{item.lastMessage}</Text>
          </View>
        </View>
      </Link>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={[styles.container, { backgroundColor }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
  },
  avatar: {
    backgroundColor: '#3498db',
  },
  chatInfo: {
    marginLeft: 15,
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    marginTop: 5,
  },
});

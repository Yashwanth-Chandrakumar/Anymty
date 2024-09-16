import { useTheme } from '@/hooks/useTheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bubble as GiftedBubble, GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode } = useTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello anonymous! This is chat ${id}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Anonymous User',
        },
      },
    ]);
  }, [id]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const renderBubble = (props: any) => (
    <GiftedBubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: darkMode ? '#333' : '#fff' },
        left: { backgroundColor: darkMode ? '#444' : '#f5f5f5' },
      }}
      textStyle={{
        right: { color: darkMode ? '#fff' : '#000' },
        left: { color: darkMode ? '#fff' : '#000' },
      }}
    />
  );

  // Custom Input Toolbar Component
  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: darkMode ? '#222' : '#fff',
        borderTopColor: darkMode ? '#444' : '#ddd',
        borderTopWidth: 1,
      }}
      primaryStyle={{
        alignItems: 'center',
      }}
      textInputStyle={{
        backgroundColor: darkMode ? '#333' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import axios from 'axios';

const API_URL = 'https://anymty-qe5z.onrender.com/api';

export const fetchMessages = async (chatId: string) => {
  try {
    const response = await axios.get(`${API_URL}/chats/${chatId}/messages/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (chatId: string, message: { type: string; content: string; name?: string }) => {
  try {
    const formData = new FormData();
    formData.append('type', message.type);
    formData.append('content', message.content);
    
    if (message.type === 'image' || message.type === 'file') {
      // Create a new Blob from the file data
      const response = await fetch(message.content);
      const blob = await response.blob();

      formData.append('file', blob, message.name || 'file');
    }

    const response = await axios.post(`${API_URL}/chats/${chatId}/messages/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

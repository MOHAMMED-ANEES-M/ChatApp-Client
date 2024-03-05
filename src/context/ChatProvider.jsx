import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat');
        setChatData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data', error);
        setLoading(false);
      }
    };

    fetchChatData();

    // Connect to Socket.io server
    const newSocket = io('http://localhost:5000'); // Replace with your Socket.io server URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for new messages from the server
      socket.on('newMessage', (newMessage) => {
        setChatData((prevChatData) => [...prevChatData, newMessage]);
      });
    }
  }, [socket]);

  const sendMessage = async (message, userId) => {
    try {
      // Send message to the server
      await axios.post('http://localhost:5000/api/chat', { message, userId });

      // Emit the new message to all clients via Socket.io
      socket.emit('sendMessage', { message, userId });
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <ChatContext.Provider value={{ chatData, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

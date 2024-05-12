import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NewMessageContext = createContext();

const socket = io('http://localhost:5000', {
    pingInterval: 10000,
    pingTimeout: 5000,
});

export const NewMessageProvider = ({ children }) => {
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const [lastSenderId, setLastSenderId] = useState('');

  const updateNewMessageAlert = (value) => {
      setNewMessageAlert(value);
      console.log('new alert',newMessageAlert);
  };

  const updateLastSenderId = (id) => {
    setLastSenderId(id);
    console.log('last sender id',lastSenderId);
  };
 

  const contextValue = React.useMemo(() => ({
    newMessageAlert,
    lastSenderId,
    updateNewMessageAlert: setNewMessageAlert,
    updateLastSenderId: setLastSenderId,
  }), [newMessageAlert, lastSenderId]);


  return (
    <NewMessageContext.Provider value={contextValue}>
      {children}
    </NewMessageContext.Provider>
  );
};

export const useNewMessageContext = () => {
  return useContext(NewMessageContext);
};

export { socket };

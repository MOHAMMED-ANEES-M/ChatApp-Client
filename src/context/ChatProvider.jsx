import React, { createContext, useContext, useState } from 'react';

const NewMessageContext = createContext();

export const NewMessageProvider = ({ children }) => {
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  const updateNewMessageAlert = (value) => {
    setNewMessageAlert(value);
    console.log('new alert',newMessageAlert);
  };

  return (
    <NewMessageContext.Provider value={{ newMessageAlert, updateNewMessageAlert }}>
      {children}
    </NewMessageContext.Provider>
  );
};

export const useNewMessageContext = () => {
  return useContext(NewMessageContext);
};

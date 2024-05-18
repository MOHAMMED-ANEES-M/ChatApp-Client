
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false); 
  const token = localStorage.getItem('chatToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/current`, {
          headers: {
            Authorization: token,
          },
        });
        setUserData(response.data);
        console.log('contextuser',response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const initializeUserData = async () => {
      if (token && userId) {
        await fetchUserData();
      }
    };
  
    initializeUserData();

  }, [token, userId, refresh, fetchAgain]);

  const updateUser = (newUserData) => {
    setUserData(newUserData);
    setRefresh(!refresh)
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, setFetchAgain }}>
      {children}
    </UserContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'
import { errorToast, successToast } from '../Components/Toast';
import { useNavigate } from 'react-router-dom';

// Create a UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState('');
  const [googleUser, setGoogleUser] = useState('')
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

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      console.log('signincurrent ',currentUser);
      const data = {
        firstname: currentUser.displayName,
        email: currentUser.email,
        image: currentUser.photoURL,
        verifyEmail: true,
      };
      setGoogleUser(data);
      return data;
  }

  const logout = () => {
    console.log('logout');
    signOut(auth)
  }

  const updateUser = (newUserData) => {
    setUserData(newUserData);
    setRefresh(!refresh)
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('googleuser:',currentUser);
        // const data = {firstname: currentUser.displayName, email: currentUser.email, image: currentUser.photoURL, verifyEmail: true}
        // setGoogleUser(data)
      }
    })
    return () => {
      unsubscribe()
    }
  },[])


  return (
    <UserContext.Provider value={{ userData, googleUser, updateUser, setFetchAgain, fetchAgain, googleSignIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};

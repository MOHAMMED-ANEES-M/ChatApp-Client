// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUZ42fknaFy2hXsRxz-3203PPpxvx0aYU",
  authDomain: "chatapp-d44bc.firebaseapp.com",
  projectId: "chatapp-d44bc",
  storageBucket: "chatapp-d44bc.appspot.com",
  messagingSenderId: "37359241802",
  appId: "1:37359241802:web:7447f5016bd68f04def4b3",
  measurementId: "G-21X96H9SVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

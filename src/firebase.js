// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq3JC3I2nlTGV_MphIu1AGkx2hcQlEFvc",
  authDomain: "emotion-reader-application.firebaseapp.com",
  databaseURL:
    "https://emotion-reader-application-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "emotion-reader-application",
  storageBucket: "emotion-reader-application.appspot.com",
  messagingSenderId: "244753784080",
  appId: "1:244753784080:web:9f0501463abeda09949995",
  measurementId: "G-5J9MLN342E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// ************************************************
//
// Get a reference to the database service
export const database = getDatabase(app);
// Storage
export const storage = getStorage(app);
// Auth
const auth = getAuth();
//  Sign In
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

//  Sign Up
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Change password
export function changePassword(newPassword) {
  return updatePassword(auth.currentUser, newPassword);
}

// Update Profile
export function updateProfileNew(newProfile) {
  return updateProfile(auth.currentUser, newProfile);
}

// Custom Hook
export function useAuth() {
  const [currentAuth, setCurrentAuth] = useState();
  useEffect(() => {
    const userdata = onAuthStateChanged(auth, (user) => {
      setCurrentAuth(user);
    });
    return userdata;
  }, []);

  return currentAuth;
}
// Log out
export function logOut() {
  return signOut(auth);
}

// ************************************************
// add Reset Password

export function forgotPassword(email) {
  // https://emotion-reader-application.firebaseapp.com/
  return sendPasswordResetEmail(auth, email, {
    url: "https://emotion-reader-application.firebaseapp.com/",
  });
}

// ************************************************
// add Admin

export function addAdmin(email, key) {
  // url: `https://emotion-reader-application.firebaseapp.com/addadmin/${key}`
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `https://emotion-reader-application.firebaseapp.com/addadmin/${key}`,
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.example.ios",
    },
    android: {
      packageName: "com.example.android",
      installApp: true,
      minimumVersion: "12",
    },
    dynamicLinkDomain: "emotionreader.page.link",
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

// ************************************************

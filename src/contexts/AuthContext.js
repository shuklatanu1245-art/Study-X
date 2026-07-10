import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  signUp,
  logIn,
  logOut,
  getUserRole,
  getUserProfile,
} from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides authentication state and helpers.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserData(profile);

          const role = await getUserRole(firebaseUser.uid);
          setUserRole(role);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserData(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign in with email and password.
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    return logIn(email, password);
  };

  /**
   * Register a new account and create the Firestore user document.
   * @param {string} email
   * @param {string} password
   * @param {string} name
   */
  const signup = async (email, password, name) => {
    return signUp(email, password, name);
  };

  /**
   * Sign out the current user.
   */
  const logout = async () => {
    return logOut();
  };

  const value = {
    user,
    userData,
    userRole,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume the AuthContext.
 * @returns {{ user: object|null, userData: object|null, userRole: string|null, loading: boolean, login: Function, signup: Function, logout: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

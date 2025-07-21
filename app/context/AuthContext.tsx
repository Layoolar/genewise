// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../utils/apiClient';

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  country: string;
  tribe: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  email: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (token: string, user: any) => Promise<void>;
  signOut: () => Promise<void>;
  setEmail: (email: string | null) => Promise<void>;
  setAuthToken: (token: string | null) => Promise<void>;
  updateUser: (userData: Partial<UserData>) => Promise<void>;
}

const initialState: AuthState = {
  token: null,
  user: null,
  email: null,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => {},
  signOut: async () => {},
  setEmail: async () => {},
  setAuthToken: async () => {},
  updateUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setAuthToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem('auth_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        await AsyncStorage.removeItem('auth_token');
        delete apiClient.defaults.headers.common['Authorization'];
      }
      setAuthState(prev => ({ ...prev, token }));
    } catch (error) {
      console.error('Failed to set auth token:', error);
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userDataString = await AsyncStorage.getItem('auth_user');
        const emailData = await AsyncStorage.getItem('auth_email');

        let userData: UserData | null = null;
        if (userDataString) {
          const parsedData = JSON.parse(userDataString);
          userData = {
            ...parsedData,
            country: parsedData.country || '',
            tribe: parsedData.tribe || '',
          };
        }

        if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete apiClient.defaults.headers.common['Authorization'];
        }

        setAuthState({
          token,
          user: userData,
          email: emailData || null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load auth data', error);
        setAuthState({
          token: null,
          user: null,
          email: null,
          isLoading: false,
        });
      }
    };

    loadAuthData();
  }, []);

  const signIn = async (token: string, user: any) => {
    try {
      const processedUser: UserData = {
        id: user.id || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        is_verified: !!user.is_verified,
        country: user.country || '',
        tribe: user.tribe || '',
      };

      await setAuthToken(token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(processedUser));
      await AsyncStorage.setItem('auth_email', processedUser.email);

      setAuthState({
        token,
        user: processedUser,
        email: processedUser.email,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to save auth data during sign-in', error);
    }
  };

  const setEmail = async (email: string | null) => {
    try {
      if (email) {
        await AsyncStorage.setItem('auth_email', email);
      } else {
        await AsyncStorage.removeItem('auth_email');
      }
      setAuthState(prev => ({ ...prev, email }));
    } catch (error) {
      console.error('Failed to save email', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'auth_user', 'auth_email']);
      await setAuthToken(null);
      setAuthState({
        token: null,
        user: null,
        email: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to clear auth data', error);
    }
  };

  const updateUser = async (userData: Partial<UserData>) => {
    try {
      setAuthState(prev => {
        if (!prev.user) return prev;

        const updatedUser = {
          ...prev.user,
          ...userData,
        };

        AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));

        return {
          ...prev,
          user: updatedUser,
        };
      });
    } catch (error) {
      console.error('Failed to update user data', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        setEmail,
        setAuthToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
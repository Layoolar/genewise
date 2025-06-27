import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    is_verified: boolean;
}

interface AuthState {
    token: string | null;
    user: UserData | null;
    email: string |  null;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    signIn: (token: string, user: UserData) => Promise<void>
    signOut: () => Promise<void>;
    setEmail: (email: string | null) => Promise<void>;
}

const initialState: AuthState = {
    token: null,
    user: null,
    email: null,
    isLoading: true,
}

export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    signIn: async () => {},
  signOut: async () => {},
  setEmail: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    const loadAuthData = async () => {
        try {
         const token = await AsyncStorage.getItem('auth_token');
         const userDataString = await AsyncStorage.getItem('auth_user');

         let userData = null;
         if (userDataString) {
           userData = JSON.parse(userDataString);
         }

         setAuthState({
          token,
          user: userData,
          email: userData?.email ?? null,
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

  const signIn = async (token: string, user: UserData) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received');
      }

      if (!user || typeof user !== 'object') {
       throw new Error('Invalid user data received');
     }

    await AsyncStorage.multiSet([
      ['auth_token', token],
      ['auth_user', JSON.stringify(user)],
    ]);

    setAuthState({
      token,
      user,
      email: user.email,
      isLoading: false,
    });
   } catch (error) {
    console.error('Failed to save auth data', error);
   }
 };


  const setEmail = async (email: string | null) => {
  try {
    if (email) {
      await AsyncStorage.setItem('auth_email', email);
    } else {
      await AsyncStorage.removeItem('auth_email');
    }

    setAuthState(prev => ({
      ...prev,
      email,
    }));
     console.log('AuthProvider - setEmail called with:', email); 
  } catch (error) {
    console.error('Failed to save email', error);
  }
};

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
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

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signOut, setEmail }}>
         {children}
    </AuthContext.Provider>
  )
}

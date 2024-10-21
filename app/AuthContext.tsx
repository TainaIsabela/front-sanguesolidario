import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';
interface AuthContextType {
  token: string | null;
  saveToken: (userToken: React.SetStateAction<string | null>) => void;
  userId: string | null;
  saveUserId: (userId: React.SetStateAction<string | null>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'));

  const saveToken = (userToken: React.SetStateAction<string | null>) => {
    localStorage.setItem('token', userToken as string);
    setToken(userToken);
  };

  const saveUserId = (userId: React.SetStateAction<string | null>) => {
    localStorage.setItem('userId', userId as string);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, userId, saveUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  useEffect(() => {
    const cachedId = localStorage.getItem('userId');
    const cacheToken = localStorage.getItem('token');


    // se estiver na pagina inicial, não redirecionar
    if (window.location.pathname != '/') {
      if (typeof window !== 'undefined' && (!cachedId || !cacheToken)) {
        window.location.href = '/';
      }
    }
  }, []);
  return useContext(AuthContext);
};
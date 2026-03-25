import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    phone: '+92 321 1234567',
    address: 'Johar Town, Lahore, Pakistan',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  });

  const login = (email: string, password: string) => {
    setUser({
      id: '1',
      name: 'Ayesha Khan',
      email: email,
      phone: '+92 321 1234567',
      address: 'Johar Town, Lahore, Pakistan',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    });
  };

  const signup = (name: string, email: string, password: string) => {
    setUser({
      id: '1',
      name: name,
      email: email,
      phone: '',
      address: '',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    });
  };

  const logout = () => {
    // Clear all user-specific data from localStorage
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
      localStorage.removeItem(`favorites_${user.id}`);
      localStorage.removeItem(`orders_${user.id}`);
    }
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
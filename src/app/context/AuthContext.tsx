import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ADMIN_CREDENTIALS } from '../lib/authConfig';
import {
  clearSession,
  findUserByEmail,
  getSessionUserId,
  isAdminEmail,
  readUsersFromStorage,
  setSessionUserId,
  writeUsersToStorage,
  type StoredClientUser,
} from '../lib/clientAuthStorage';
import { normalizeEmail } from '../lib/authConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

function toPublicUser(row: StoredClientUser): User {
  const { password: _p, ...rest } = row;
  return rest;
}

function readInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  const id = getSessionUserId();
  if (!id) return null;
  const users = readUsersFromStorage();
  const row = users.find((u) => u.id === id);
  if (!row) {
    clearSession();
    return null;
  }
  return toPublicUser(row);
}

export type AuthResult = { success: true } | { success: false; error: string };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthResult;
  signup: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
  updateUser: (updates: Partial<User>) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => AuthResult;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readInitialUser);

  const login = useCallback((email: string, password: string): AuthResult => {
    if (isAdminEmail(email)) {
      return {
        success: false,
        error: 'This email is registered as an admin. Please sign in at the admin page.',
      };
    }

    const users = readUsersFromStorage();
    const row = findUserByEmail(users, email);
    if (!row) {
      return { success: false, error: 'No account found with this email.' };
    }
    if (row.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }

    setSessionUserId(row.id);
    setUser(toPublicUser(row));
    return { success: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string): AuthResult => {
    if (normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email)) {
      return {
        success: false,
        error: 'This email is reserved for admin. Use a different email or admin sign-in.',
      };
    }

    const users = readUsersFromStorage();
    if (findUserByEmail(users, email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newRow: StoredClientUser = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
      phone: '',
      address: '',
      profilePicture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    };

    writeUsersToStorage([...users, newRow]);
    setSessionUserId(newRow.id);
    setUser(toPublicUser(newRow));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
      localStorage.removeItem(`favorites_${user.id}`);
      localStorage.removeItem(`orders_${user.id}`);
    }
    clearSession();
    setUser(null);
  }, [user?.id]);

  const updateUser = useCallback((updates: Partial<User>): boolean => {
    if (!user) return false;

    const users = readUsersFromStorage();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) {
      setUser({ ...user, ...updates });
      return true;
    }

    const nextEmail = updates.email !== undefined ? updates.email.trim() : users[idx].email;
    if (updates.email !== undefined) {
      const conflict = findUserByEmail(
        users.filter((_, i) => i !== idx),
        nextEmail
      );
      if (conflict) {
        return false;
      }
    }

    const merged: StoredClientUser = {
      ...users[idx],
      name: updates.name !== undefined ? updates.name : users[idx].name,
      email: nextEmail,
      phone: updates.phone !== undefined ? updates.phone : users[idx].phone,
      address: updates.address !== undefined ? updates.address : users[idx].address,
      profilePicture:
        updates.profilePicture !== undefined ? updates.profilePicture : users[idx].profilePicture,
    };

    const nextUsers = [...users];
    nextUsers[idx] = merged;
    writeUsersToStorage(nextUsers);
    setUser(toPublicUser(merged));
    return true;
  }, [user]);

  const changePassword = useCallback((currentPassword: string, newPassword: string): AuthResult => {
    if (!user) {
      return { success: false, error: 'You are not signed in.' };
    }
    const users = readUsersFromStorage();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) {
      return { success: false, error: 'Account data not found.' };
    }
    if (users[idx].password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    const nextUsers = [...users];
    nextUsers[idx] = { ...users[idx], password: newPassword };
    writeUsersToStorage(nextUsers);
    return { success: true };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
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

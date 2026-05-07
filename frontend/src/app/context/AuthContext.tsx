import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authApi } from '../lib/api';
import { ADMIN_CREDENTIALS } from '../lib/authConfig';
import { normalizeEmail } from '../lib/authConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

export type AuthResult = { success: true } | { success: false; error: string };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);

  // On mount: verify the stored token is still valid
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    authApi.getMe()
      .then((res) => {
        const fresh = res.data.data as User;
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email)) {
      return {
        success: false,
        error: 'This email is registered as an admin. Please sign in at the admin page.',
      };
    }
    try {
      const res = await authApi.login({ email, password });
      const { token, user: loggedInUser } = res.data.data as { token: string; user: User };
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email)) {
      return {
        success: false,
        error: 'This email is reserved. Use a different email.',
      };
    }
    try {
      const res = await authApi.register({ name, email, password, role: 'customer' });
      const { token, user: newUser } = res.data.data as { token: string; user: User };
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Sign up failed. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>): boolean => {
    if (!user) return false;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return true;
  }, [user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to change password. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

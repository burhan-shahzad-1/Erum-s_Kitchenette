import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../lib/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_KEY = 'cart_guest';
const userCartKey = (userId: string) => `cart_${userId}`;

function readStorage(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function mergeItems(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const merged = [...base];
  incoming.forEach((inc) => {
    const existing = merged.find((i) => i.id === inc.id);
    if (existing) {
      existing.quantity += inc.quantity;
    } else {
      merged.push(inc);
    }
  });
  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readStorage(GUEST_KEY));

  // When user logs in: merge guest cart into their saved cart, then clear guest key.
  // When user logs out: load the guest cart (empty by default).
  useEffect(() => {
    if (user?.id) {
      const userCart = readStorage(userCartKey(user.id));
      const guestCart = readStorage(GUEST_KEY);
      const merged = guestCart.length > 0 ? mergeItems(userCart, guestCart) : userCart;
      setItems(merged);
      localStorage.removeItem(GUEST_KEY);
    } else {
      setItems(readStorage(GUEST_KEY));
    }
  }, [user?.id]);

  // Persist to localStorage on every change — always, guest or logged-in.
  useEffect(() => {
    const key = user?.id ? userCartKey(user.id) : GUEST_KEY;
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, user?.id]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      return existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
    });
    // Sync to backend (fire-and-forget; backend accumulates quantity)
    if (user) {
      cartApi.addItem(item.id, 1).catch(console.error);
    }
  }, [user]);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (user) {
      cartApi.removeItem(id).catch(console.error);
    }
  }, [user]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
    // Backend has no set-quantity endpoint, so remove then re-add with new quantity
    if (user) {
      cartApi.removeItem(id)
        .then(() => cartApi.addItem(id, quantity))
        .catch(console.error);
    }
  }, [user, removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    const key = user?.id ? userCartKey(user.id) : GUEST_KEY;
    localStorage.removeItem(key);
    if (user?.id) {
      cartApi.clear().catch(console.error);
    }
  }, [user]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

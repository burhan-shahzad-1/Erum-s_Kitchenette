import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user?.id) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        try {
          const favArray = JSON.parse(savedFavorites);
          setFavorites(new Set(favArray));
        } catch (error) {
          console.error('Failed to load favorites:', error);
          setFavorites(new Set());
        }
      } else {
        setFavorites(new Set());
      }
    } else {
      // Clear favorites when user logs out
      setFavorites(new Set());
    }
  }, [user?.id]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, user?.id]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(id);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.has(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
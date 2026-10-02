'use client';

import { useState, useEffect } from 'react';
import { Person } from '@/data/types';

const STORAGE_KEY = 'birthday_verse_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Person[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const isFavorite = (id: string): boolean => {
    return favorites.some((p) => p.id === id);
  };

  const toggleFavorite = (person: Person) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === person.id);
      const next = exists
        ? prev.filter((p) => p.id !== person.id)
        : [...prev, person];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e);
      }
      return next;
    });
  };

  return {
    favorites,
    isLoaded,
    isFavorite,
    toggleFavorite,
  };
}

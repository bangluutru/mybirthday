'use client';

import { useState, useEffect } from 'react';
import { Person } from '@/data/types';
import { ALL_PEOPLE } from '@/data/birthdays';

const STORAGE_KEY = 'birthday_verse_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Person[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Backward-compatible: handle either array of string IDs or array of legacy Person objects
          const ids: string[] = parsed
            .map((item: any) => (typeof item === 'string' ? item : item?.id))
            .filter(Boolean);
          // Resolve current fresh Person records from ALL_PEOPLE to prevent stale snapshot drift
          const freshPeople = ids
            .map((id) => ALL_PEOPLE.find((p) => p.id === id))
            .filter(Boolean) as Person[];
          setFavorites(freshPeople);
        }
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
        // Store only person IDs to prevent stale snapshot drift
        const ids = next.map((p) => p.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
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

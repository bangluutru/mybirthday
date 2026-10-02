'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { PersonRow } from '@/components/cards/PersonRow';
import { Bookmark, Sparkles, Compass } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24 text-slate-900">
        <TopBar title={vi.favorites.title} showBack={true} />

        <div className="p-4 flex-1 flex flex-col">
          {!isLoaded ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              Đang tải danh sách...
            </div>
          ) : favorites.length === 0 ? (
            <div className="my-auto py-16 px-6 text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-inner">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-bold text-base text-slate-900">
                  {vi.favorites.emptyTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {vi.favorites.emptyDesc}
                </p>
              </div>
              <Link
                href="/birthday/2/22"
                className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-glow transition-all flex items-center space-x-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>{vi.favorites.exploreCta}</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold text-slate-500">
                  Đã lưu {favorites.length} nhân vật
                </p>
              </div>
              <div className="space-y-2.5">
                {favorites.map((person) => (
                  <PersonRow key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

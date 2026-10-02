'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBirthdayData } from '@/data/birthdays';
import { PersonCategory } from '@/data/types';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { PersonRow } from '@/components/cards/PersonRow';
import { Search, X } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function PeopleExplorerPage() {
  const params = useParams();
  const router = useRouter();

  const month = parseInt(params.month as string) || 2;
  const day = parseInt(params.day as string) || 22;

  const data = useMemo(() => getBirthdayData(month, day), [month, day]);

  const [activeCategory, setActiveCategory] = useState<PersonCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: PersonCategory; label: string }[] = [
    { key: 'all', label: vi.people.categories.all },
    { key: 'scientist', label: vi.people.categories.scientist },
    { key: 'artist', label: vi.people.categories.artist },
    { key: 'actor', label: vi.people.categories.actor },
    { key: 'entrepreneur', label: vi.people.categories.entrepreneur },
    { key: 'athlete', label: vi.people.categories.athlete },
    { key: 'history', label: vi.people.categories.history },
    { key: 'literature', label: vi.people.categories.literature },
    { key: 'music', label: vi.people.categories.music },
  ];

  const filteredPeople = useMemo(() => {
    return data.all.filter((person) => {
      const matchesCategory =
        activeCategory === 'all' || person.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [data.all, activeCategory, searchQuery]);

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24 text-slate-900">
        <TopBar
          title={vi.people.title}
          subtitle={`Ngày ${day} ${data.monthNameVi}`}
          showBack={true}
        />

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={vi.people.searchPlaceholder}
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips matching Screen 04 */}
        <div className="flex items-center space-x-2 py-3 px-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* List of Rich Rows matching Screen 04 */}
        <div className="px-4 space-y-2.5 flex-1">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <PersonRow key={person.id} person={person} />
            ))
          ) : (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm font-medium text-slate-500">
                {vi.people.noResults}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

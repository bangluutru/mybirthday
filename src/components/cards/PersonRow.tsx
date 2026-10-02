'use client';

import React from 'react';
import Link from 'next/link';
import { Person } from '@/data/types';
import { Bookmark } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface PersonRowProps {
  person: Person;
}

export const PersonRow: React.FC<PersonRowProps> = ({ person }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(person.id);

  const yearRange = person.deathDate
    ? `${person.birthYear} – ${new Date(person.deathDate).getFullYear() || person.deathDate.slice(0, 4)}`
    : `${person.birthYear} –`;

  return (
    <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100/90 shadow-sm hover:shadow-md transition-all duration-200 group">
      <Link
        href={`/person/${person.slug}`}
        className="flex items-center space-x-3.5 flex-1 min-w-0"
      >
        {/* Rounded squircle portrait */}
        <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/people/george-washington.png';
            }}
          />
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-bold text-sm text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">
            {person.name}
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            {yearRange}
          </p>
          <p className="text-xs text-slate-700 font-medium line-clamp-1">
            {person.categoryLabel}
            {person.countryName ? ` · ${person.countryName}` : ''}
          </p>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {person.shortDescription}
          </p>
        </div>
      </Link>

      {/* Bookmark Action */}
      <button
        onClick={() => toggleFavorite(person)}
        className={`p-2 rounded-xl transition-all duration-150 active:scale-90 ${
          favorited
            ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
        }`}
        aria-label={favorited ? 'Bỏ lưu' : 'Lưu nhân vật'}
      >
        <Bookmark className={`w-5 h-5 ${favorited ? 'fill-brand-600' : ''}`} />
      </button>
    </div>
  );
};

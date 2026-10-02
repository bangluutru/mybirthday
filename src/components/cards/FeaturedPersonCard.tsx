'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Person } from '@/data/types';
import { Bookmark } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FeaturedPersonCardProps {
  person: Person;
  showBookmark?: boolean;
}

export const FeaturedPersonCard: React.FC<FeaturedPersonCardProps> = ({
  person,
  showBookmark = true,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(person.id);

  const yearRange = person.deathDate
    ? `${person.birthYear}–${new Date(person.deathDate).getFullYear() || person.deathDate.slice(0, 4)}`
    : `${person.birthYear}–`;

  return (
    <div className="relative group flex-shrink-0 w-36 sm:w-40 bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100/80 card-hover-effect flex flex-col">
      <Link href={`/person/${person.slug}`} className="block relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/people/george-washington.png';
          }}
        />
        {showBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(person);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
              favorited
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm'
            }`}
            aria-label="Lưu vào yêu thích"
          >
            <Bookmark className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>
        )}
      </Link>

      <Link href={`/person/${person.slug}`} className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
            {person.name}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">
            {yearRange}
          </p>
          <div className="mt-1 flex items-center space-x-1">
            <span className="text-[11px] font-semibold text-slate-700 line-clamp-1">
              {person.categoryLabel}
            </span>
            {person.countryName && (
              <span className="text-[10px] text-slate-400">· {person.countryName}</span>
            )}
          </div>
        </div>

        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-tight">
          {person.shortDescription}
        </p>
      </Link>
    </div>
  );
};

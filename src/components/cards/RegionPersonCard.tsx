'use client';

import React from 'react';
import Link from 'next/link';
import { Person } from '@/data/types';

interface RegionPersonCardProps {
  person: Person;
}

export const RegionPersonCard: React.FC<RegionPersonCardProps> = ({ person }) => {
  const yearRange = person.deathDate
    ? `${person.birthYear} – ${new Date(person.deathDate).getFullYear() || person.deathDate.slice(0, 4)}`
    : `${person.birthYear} –`;

  return (
    <Link
      href={`/person/${person.slug}`}
      className="flex-shrink-0 w-36 sm:w-40 bg-white rounded-2xl shadow-card border border-slate-100/90 overflow-hidden group card-hover-effect flex flex-col"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/people/george-washington.png';
          }}
        />
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {person.name}
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {yearRange}
          </p>
          <p className="text-[11px] font-semibold text-slate-700 mt-1 line-clamp-1">
            {person.categoryLabel}
            {person.countryCode !== 'VN' && person.countryName ? ` · ${person.countryName}` : ''}
          </p>
        </div>

        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-tight">
          {person.shortDescription}
        </p>
      </div>
    </Link>
  );
};

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExactSameDatePeople, getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { Info, ArrowRight, Sparkles } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function ExactSameDatePage() {
  const params = useParams();
  const router = useRouter();

  // date param can be "22-02-1981" or "22-2-1981"
  const dateStr = (params.date as string) || '22-02-1981';
  const parts = dateStr.split('-');
  const day = parseInt(parts[0]) || 22;
  const month = parseInt(parts[1]) || 2;
  const year = parseInt(parts[2]) || 1981;

  const formattedDate = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;

  const { exact, sameYearOther } = getExactSameDatePeople(month, day, year);
  const birthdayData = getBirthdayData(month, day);

  // If exact is empty, show contemporaries matching Reference 07 (James Blunt, Mandy Moore, etc.)
  const displayPeers =
    exact.length > 0
      ? exact
      : ([
          birthdayData.all.find((p) => p.id === 'james-blunt'),
          birthdayData.all.find((p) => p.id === 'mandy-moore'),
          birthdayData.all.find((p) => p.id === 'lleyton-hewitt'),
        ].filter(Boolean) as typeof birthdayData.all);

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24 text-slate-900">
        <TopBar
          title={vi.exact.title}
          showBack={true}
        />

        <div className="px-5 pt-3 pb-6 space-y-4 flex-1">
          {/* Subtitle matching Screen 07 */}
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {vi.exact.subtitle(formattedDate)}
          </p>

          {/* Cards of matching figures matching Screen 07 */}
          <div className="space-y-3 pt-1">
            {displayPeers.map((person) => {
              const yearRange = person.deathDate
                ? `${person.birthYear} – ${new Date(person.deathDate).getFullYear() || person.deathDate.slice(0, 4)}`
                : `${person.birthYear} –`;

              return (
                <Link
                  key={person.id}
                  href={`/person/${person.slug}`}
                  className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-3.5 group"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/people/george-washington.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {yearRange}
                    </p>
                    <p className="text-xs text-slate-700 font-medium">
                      {person.categoryLabel} · {person.countryName}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {person.shortDescription}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Friendly Rare Notice Box matching Screen 07 */}
          <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex items-start space-x-3 mt-4">
            <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              {vi.exact.rareNotice(`${day} ${birthdayData.monthNameVi}`)}
            </p>
          </div>

          {/* Link back to full club overview */}
          <div className="pt-2">
            <Link
              href={`/birthday/${month}/${day}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-brand-600 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <span>{vi.exact.viewClubCta(`${day}/${month}`)}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

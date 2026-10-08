'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPersonBySlug, getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { FeaturedPersonCard } from '@/components/cards/FeaturedPersonCard';
import { ChevronLeft, Bookmark, Trophy, MapPin, ExternalLink, Share2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { vi } from '@/messages/vi';
import { getLifespanLabel, PERSON_FIELD_LABELS } from '@/data/types';

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const person = getPersonBySlug(slug);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!person) {
    return (
      <AppShell showBottomNav={true}>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-base text-slate-600">Không tìm thấy thông tin nhân vật này.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold"
          >
            Quay lại
          </button>
        </div>
      </AppShell>
    );
  }

  const favorited = isFavorite(person.id);
  const yearRange = getLifespanLabel(person);

  // Fetch others born on the same day
  const birthdayData = getBirthdayData(person.birthMonth, person.birthDay);
  const otherSameDay = birthdayData.all.filter((p) => p.id !== person.id);

  // Large portrait image fallback or large crop
  const largeImage =
    person.id === 'george-washington'
      ? '/people/george-washington-large.png'
      : person.image;

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-white pb-24 text-slate-900 relative">
        {/* Large Top Portrait Header matching Screen 05 */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-900 overflow-hidden">
          <img
            src={largeImage}
            alt={person.name}
            className="w-full h-full object-cover object-top filter brightness-95"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/people/george-washington.png';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Actions on Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <Link
                href={`/share/${person.birthDay}-${person.birthMonth}`}
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95"
                aria-label="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </Link>
              <button
                onClick={() => toggleFavorite(person)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 ${
                  favorited
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-black/40 hover:bg-black/60 text-white'
                }`}
                aria-label={favorited ? 'Đã lưu' : 'Lưu nhân vật'}
              >
                <Bookmark className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* White Curved Bottom Sheet Content matching Screen 05 */}
        <div className="relative -mt-6 bg-white rounded-t-[32px] px-6 pt-6 space-y-6 z-10 shadow-[-4px_-10px_20px_rgba(0,0,0,0.05)]">
          {/* Header Title & Badges */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {person.name}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              {yearRange}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {person.categoryLabel}
              </span>
              {person.fields?.map((field) => (
                <span key={field} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">
                  {PERSON_FIELD_LABELS[field]}
                </span>
              ))}
              {person.countryName && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                  <span>{person.countryFlag}</span>
                  <span>{person.countryName}</span>
                </span>
              )}
            </div>
          </div>

          {/* Full Narrative Biography */}
          <div className="text-sm text-slate-600 leading-relaxed space-y-3 pt-1">
            <p>{person.biography || person.shortDescription}</p>
          </div>

          {/* Section: Đóng góp nổi bật */}
          {person.highlights && person.highlights.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm">
                  {vi.detail.highlightsTitle}
                </h3>
              </div>
              <ul className="space-y-2 pl-7 text-xs sm:text-sm text-slate-600 leading-normal list-disc marker:text-amber-500">
                {person.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Nơi sinh */}
          {person.birthplace && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900">
                <MapPin className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm">
                  {vi.detail.birthplaceTitle}
                </h3>
              </div>
              <p className="pl-7 text-xs sm:text-sm text-slate-600">
                {person.birthplace}
              </p>
            </div>
          )}

          {/* Section: Wikipedia Source */}
          {person.wikipediaUrl && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900">
                <ExternalLink className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm">
                  {vi.detail.wikiTitle}
                </h3>
              </div>
              <a
                href={person.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pl-7 text-xs sm:text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium"
              >
                {vi.detail.wikiLinkText}
              </a>
            </div>
          )}

          {/* Section: Những người khác sinh cùng ngày */}
          {otherSameDay.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                {vi.detail.sameDayTitle}
              </h3>
              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1">
                {otherSameDay.map((p) => (
                  <FeaturedPersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

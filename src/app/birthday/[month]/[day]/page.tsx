'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { FeaturedPersonCard } from '@/components/cards/FeaturedPersonCard';
import { RegionPersonCard } from '@/components/cards/RegionPersonCard';
import { ChevronLeft, ChevronRight, Share2, Sparkles, Calendar, Clock, Users, Gift } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function BirthdayUniversePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const month = parseInt(params.month as string) || 2;
  const day = parseInt(params.day as string) || 22;
  const year = parseInt(searchParams.get('year') || '1981');

  const data = useMemo(() => getBirthdayData(month, day), [month, day]);

  return (
    <AppShell showBottomNav={true}>
      <div className="relative min-h-screen bg-slate-50 pb-24 text-slate-900">
        {/* Top Hero Section with Mountain Sunset matching Screen 03 */}
        <div className="relative min-h-[360px] bg-gradient-to-b from-[#101b33] via-[#2a274c] to-[#603b54] text-white px-5 pt-4 pb-12 overflow-hidden">
          {/* Mountain background image overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
            <img
              src="/backgrounds/mountain-sunset.png"
              alt="Mountain Sunset Background"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Starfield overlay */}
          <div className="absolute inset-0 bg-cosmic-stars opacity-40 pointer-events-none" />

          {/* Top navigation actions */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/birthday')}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
              aria-label="Chọn ngày khác"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <Link
              href={`/share/${day}-${month}`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm text-xs font-semibold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ</span>
            </Link>
          </div>

          {/* Hero Titles matching Screen 03 */}
          <div className="relative z-10 text-center space-y-1">
            <p className="text-sm font-medium text-purple-200 tracking-wide">
              {vi.overview.clubPrefix}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {day} {data.monthNameVi}
            </h1>
            <p className="text-xs text-slate-200/90 max-w-xs mx-auto leading-relaxed pt-1">
              {vi.overview.subtext}
            </p>
          </div>

          {/* 6 Stats Grid matching Screen 03 */}
          <div className="relative z-10 grid grid-cols-3 gap-y-4 gap-x-2 text-center mt-6 pt-2 border-t border-white/10">
            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.total}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statFeatured}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.scientists}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statScientists}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.artists}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statArtists}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.athletes}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statAthletes}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.entrepreneurs}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statEntrepreneurs}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                {data.stats.historical}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {vi.overview.statHistory}
              </div>
            </div>
          </div>
        </div>

        {/* White Curved Body Rising from Bottom matching Screen 03 */}
        <div className="relative -mt-6 bg-slate-50 rounded-t-[32px] pt-6 px-4 space-y-7 z-20">
          {/* Section: Những nhân vật nổi bật nhất (Screen 03) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="text-amber-500 text-lg">⭐</span>
                <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                  {vi.overview.featuredTitle}
                </h2>
              </div>
              <Link
                href={`/birthday/${month}/${day}/people`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-0.5"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Horizontal Scroll Cards */}
            {data.all.length > 0 ? (
              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1 px-1">
                {data.all.slice(0, 7).map((person) => (
                  <FeaturedPersonCard key={person.id} person={person} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-xs text-slate-500">
                Chưa có danh nhân nào được ghi nhận cho ngày {day} {data.monthNameVi}. Dữ liệu đang được tiếp tục xác thực và cập nhật.
              </div>
            )}
          </section>

          {/* Section: Người Việt cùng ngày sinh (Screen 06) */}
          {data.vietnamese.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🇻🇳</span>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    {vi.overview.vietnameseTitle}
                  </h3>
                </div>
                <Link
                  href={`/birthday/${month}/${day}/people`}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1 px-1">
                {data.vietnamese.map((person) => (
                  <RegionPersonCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          )}

          {/* Section: Nhân vật thế giới (Screen 06) */}
          {data.international.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🌏</span>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    {vi.overview.worldTitle}
                  </h3>
                </div>
                <Link
                  href={`/birthday/${month}/${day}/people`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-0.5"
                >
                  <span>{vi.overview.seeMore}</span>
                </Link>
              </div>

              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1 px-1">
                {data.international.slice(3, 9).map((person) => (
                  <RegionPersonCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          )}

          {/* Quick Hub Discovery Banners */}
          <section className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href={`/exact/${day}-${month}-${year}`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  Cùng ngày, cùng năm
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sinh đúng năm {year}
                </p>
              </div>
            </Link>

            <Link
              href={`/day/${month}/${day}`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  Sự kiện lịch sử
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ngày {day}/{month} trong quá khứ
                </p>
              </div>
            </Link>
          </section>

          {/* Share Card Trigger Banner matching Screen 09 entry */}
          <div className="pt-2">
            <Link
              href={`/share/${day}-${month}`}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between shadow-glow group hover:from-brand-500 hover:to-indigo-500 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">
                    Tạo thẻ kỷ niệm ngày sinh
                  </h4>
                  <p className="text-[11px] text-indigo-100 mt-0.5">
                    Tải ảnh đẹp để chia sẻ lên Facebook, Story
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowRight, Dice5, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { vi } from '@/messages/vi';

export default function HomePage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [showDirectPicker, setShowDirectPicker] = useState(false);

  const handleRandomDate = () => {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][randomMonth - 1];
    const randomDay = Math.floor(Math.random() * maxDays) + 1;
    router.push(`/birthday/${randomMonth}/${randomDay}`);
  };

  const handleExplore = () => {
    router.push(`/birthday/${selectedMonth}/${selectedDay}`);
  };

  return (
    <AppShell showBottomNav={false}>
      <div className="relative min-h-screen md:min-h-[844px] bg-cosmic-stars bg-[#070a13] text-white flex flex-col justify-between p-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Hero Typography matching Screen 01 */}
        <div className="relative z-10 pt-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Những <br />
            <span className="bg-gradient-to-r from-purple-200 via-indigo-200 to-pink-200 bg-clip-text text-transparent">
              con người đặc biệt
            </span> <br />
            sinh cùng ngày <br />
            với bạn
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed font-normal">
            {vi.home.subtitle}
          </p>
        </div>

        {/* Center Artwork: Earth Horizon & Constellation Portraits matching Screen 01 */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center">
            {/* Constellation Artwork */}
            <img
              src="/backgrounds/hero-constellation.png"
              alt="Constellation of historical figures"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(79,70,229,0.35)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/backgrounds/hero-space.png';
              }}
            />
          </div>
        </div>

        {/* Bottom Controls matching Screen 01 */}
        <div className="relative z-10 pb-4 space-y-3">
          {/* Quick Date Selector Card */}
          <Link
            href="/birthday"
            className="w-full bg-white/95 hover:bg-white text-slate-700 py-3.5 px-4 rounded-2xl flex items-center space-x-3 shadow-lg backdrop-blur-md transition-all group"
          >
            <Calendar className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1">
              {vi.home.selectDatePrompt}
            </span>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
              22 / 02
            </span>
          </Link>

          {/* Primary CTA Button */}
          <button
            onClick={handleExplore}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-glow flex items-center justify-center space-x-2 transition-all btn-press"
          >
            <span>{vi.home.ctaPrimary}</span>
          </button>

          {/* Secondary Random Button */}
          <button
            onClick={handleRandomDate}
            className="w-full py-2 flex items-center justify-center space-x-2 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Dice5 className="w-4 h-4 text-purple-400" />
            <span>{vi.home.ctaRandom}</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}

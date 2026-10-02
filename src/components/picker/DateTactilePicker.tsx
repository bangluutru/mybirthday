'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronDown, Dice5, Sparkles, ArrowRight } from 'lucide-react';
import { vi } from '@/messages/vi';

interface DateTactilePickerProps {
  initialDay?: number;
  initialMonth?: number;
  initialYear?: number;
}

export const DateTactilePicker: React.FC<DateTactilePickerProps> = ({
  initialDay = 22,
  initialMonth = 2,
  initialYear = 1981,
}) => {
  const router = useRouter();
  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  // Quick preset dates matching Screen 02
  const quickPresets = [
    { label: vi.picker.today, day: new Date().getDate(), month: new Date().getMonth() + 1, year: 2000 },
    { label: '22/02', day: 22, month: 2, year: 1981 },
    { label: '01/01', day: 1, month: 1, year: 1990 },
    { label: '30/04', day: 30, month: 4, year: 1975 },
    { label: '15/08', day: 15, month: 8, year: 1995 },
  ];

  const handleRandomDate = () => {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][randomMonth - 1];
    const randomDay = Math.floor(Math.random() * maxDays) + 1;
    const randomYear = 1950 + Math.floor(Math.random() * 55);

    setDay(randomDay);
    setMonth(randomMonth);
    setYear(randomYear);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push(`/birthday/${month}/${day}?year=${year}`);
  };

  return (
    <div className="relative min-h-[550px] flex flex-col justify-between p-6 pb-28 text-slate-900 overflow-hidden">
      <div className="space-y-6 z-10">
        {/* Title & Subtitle */}
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {vi.picker.title}
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            {vi.picker.subtitle}
          </p>
        </div>

        {/* Date Selector Box matching Screen 02 */}
        <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-500">
            <Calendar className="w-6 h-6 text-brand-600" />
          </div>

          <div className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-slate-800">
            {/* Day Selector */}
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-200"
              aria-label="Chọn ngày"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d < 10 ? `0${d}` : d}
                </option>
              ))}
            </select>

            <span className="text-slate-300">/</span>

            {/* Month Selector */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-200"
              aria-label="Chọn tháng"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m < 10 ? `0${m}` : m}
                </option>
              ))}
            </select>

            <span className="text-slate-300">/</span>

            {/* Year Selector */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-200"
              aria-label="Chọn năm"
            >
              {Array.from({ length: 110 }, (_, i) => 2026 - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Purple CTA Button */}
        <button
          onClick={() => handleSubmit()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-glow flex items-center justify-center space-x-2 transition-all btn-press"
        >
          <span>{vi.picker.ctaSubmit}</span>
        </button>

        {/* Quick Discovery Presets */}
        <div className="pt-4 space-y-3">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {vi.picker.quickTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setDay(preset.day);
                  setMonth(preset.month);
                  setYear(preset.year);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                  day === preset.day && month === preset.month
                    ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-sm'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Random Date Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleRandomDate}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <Dice5 className="w-4 h-4 text-brand-600" />
              <span>{vi.picker.random}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom City Sunset Silhouette illustration matching Screen 02 */}
      <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none opacity-90 overflow-hidden">
        <img
          src="/backgrounds/city-sunset.png"
          alt="Sunset city silhouette"
          className="w-full h-full object-cover object-bottom"
        />
      </div>
    </div>
  );
};

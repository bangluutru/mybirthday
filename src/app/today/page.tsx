'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { didPersonDieOnDate } from '@/data/types';
import { FeaturedPersonCard } from '@/components/cards/FeaturedPersonCard';
import { HistoryTimeline } from '@/components/history/HistoryTimeline';
import { Search, ChevronLeft, Calendar, Dice5, Bookmark, ChevronRight } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function TodayPage() {
  const router = useRouter();

  // Resolve actual local calendar date on client mount to eliminate hydration mismatch
  const [currentDate, setCurrentDate] = useState<{ day: number; month: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate({
      day: now.getDate(),
      month: now.getMonth() + 1,
    });
  }, []);

  const [activeTab, setActiveTab] = useState<'birth' | 'death' | 'event'>('birth');

  const day = currentDate?.day ?? 22;
  const month = currentDate?.month ?? 2;

  const data = useMemo(() => {
    if (!currentDate) return null;
    return getBirthdayData(currentDate.month, currentDate.day);
  }, [currentDate]);

  const handleRandomDate = () => {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][randomMonth - 1];
    const randomDay = Math.floor(Math.random() * maxDays) + 1;
    router.push(`/birthday/${randomMonth}/${randomDay}`);
  };

  const monthNameVi = data?.monthNameVi || `Tháng ${month}`;

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24 text-slate-900">
        {/* Top Header matching Screen 10 */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎂</span>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                  {vi.today.title}
                </h1>
                <p className="text-xs font-bold text-brand-600">
                  {currentDate ? `${day} ${monthNameVi}` : 'Đang xác định ngày...'}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/birthday/${month}/${day}/people`}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </Link>
        </header>

        <div className="p-4 space-y-6">
          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {vi.today.subtitle}
          </p>

          {/* Tabs matching Screen 10: Sinh | Mất | Sự kiện */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('birth')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'birth'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {vi.today.tabs.birth}
            </button>
            <button
              onClick={() => setActiveTab('death')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'death'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {vi.today.tabs.death}
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'event'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {vi.today.tabs.event}
            </button>
          </div>

          {/* Tab Content */}
          {!currentDate || !data ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-xs text-slate-400">
              Đang tải dữ liệu hôm nay...
            </div>
          ) : activeTab === 'birth' ? (
            <div className="space-y-3">
              {data.all.length > 0 ? (
                <div className="flex space-x-3.5 overflow-x-auto no-scrollbar py-1">
                  {data.all.map((person) => (
                    <FeaturedPersonCard key={person.id} person={person} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Chưa có danh nhân nào được ghi nhận cho hôm nay ({day} {monthNameVi})
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Dữ liệu ngày sinh đang được kiểm chứng và liên tục bổ sung. Bạn có thể xem ngày mẫu 22 tháng 2 hoặc khám phá các ngày khác.
                  </p>
                  <Link
                    href="/birthday/2/22"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    <span>Xem ngày mẫu 22 Tháng 2</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === 'death' ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Tưởng niệm các danh nhân qua đời vào ngày {day} {monthNameVi}.
              </p>
              {data.all.filter((p) => didPersonDieOnDate(p, month, day)).length > 0 ? (
                <div className="text-left space-y-3 pt-2">
                  {data.all
                    .filter((p) => didPersonDieOnDate(p, month, day))
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="text-xs text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-slate-400">{p.deathDate}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-3">
                  Chưa có thông tin nhân vật qua đời vào ngày này trong hệ thống.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-2">
              {data.events.length > 0 ? (
                <HistoryTimeline events={data.events} month={month} day={day} />
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Chưa có sự kiện lịch sử nào được ghi nhận cho ngày {day} {monthNameVi}.
                </div>
              )}
            </div>
          )}

          {/* Section: Khám phá thêm matching Screen 10 */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              {vi.today.discoverMoreTitle}
            </h3>

            <div className="space-y-2.5">
              {/* Theo tháng */}
              <Link
                href="/birthday"
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                    {vi.today.byMonthTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {vi.today.byMonthDesc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Ngày ngẫu nhiên */}
              <button
                onClick={handleRandomDate}
                className="w-full text-left p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Dice5 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                    {vi.today.randomDateTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {vi.today.randomDateDesc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Lưu yêu thích */}
              <Link
                href="/favorites"
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                    {vi.today.favoritesTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {vi.today.favoritesDesc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

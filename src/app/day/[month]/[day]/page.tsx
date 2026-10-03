'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { getBirthdayData, getZodiacSign } from '@/data/birthdays';

interface HistoryTimelineItem {
  id: string;
  year: number;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  title: string;
  description?: string;
  image?: string;
  tag?: string;
  tagColor?: string;
  customVisual?: 'olympics' | 'none';
  sourceUrls?: string[];
}

const EVENT_META: Record<string, { label: string; color: string; tag: string; tagColor: string }> = {
  birth: {
    label: 'Nhân vật lịch sử',
    color: 'bg-primary-container text-on-primary',
    tag: 'Nhân vật thế kỷ',
    tagColor: 'bg-primary-fixed text-on-primary-fixed-variant',
  },
  event: {
    label: 'Sự kiện lịch sử',
    color: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    tag: 'Dấu ấn lịch sử',
    tagColor: 'bg-surface-container-high text-secondary',
  },
  discovery: {
    label: 'Khoa học & Khám phá',
    color: 'bg-primary-fixed text-on-primary-fixed-variant',
    tag: 'Đột phá khoa học',
    tagColor: 'bg-surface-container-high text-primary',
  },
  death: {
    label: 'Tưởng niệm',
    color: 'bg-tertiary-container text-on-tertiary',
    tag: 'Dấu ấn lịch sử',
    tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
};

export default function HistoryTimelinePage() {
  const params = useParams();
  const router = useRouter();

  const month = parseInt(params.month as string, 10) || 2;
  const day = parseInt(params.day as string, 10) || 22;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>('1974');
  const [userYearInput, setUserYearInput] = useState<string>('');

  const birthdayData = useMemo(() => getBirthdayData(month, day), [month, day]);
  const rawEvents = birthdayData.events;
  const dayPeople = birthdayData.all;

  const events: HistoryTimelineItem[] = useMemo(() => {
    return rawEvents.map((ev) => {
      const meta = EVENT_META[ev.category] || {
        label: 'Sự kiện lịch sử',
        color: 'bg-surface-container-high text-on-surface',
        tag: 'Dấu ấn lịch sử',
        tagColor: 'bg-surface-container text-outline',
      };
      return {
        id: ev.id,
        year: ev.year,
        category: ev.category,
        categoryLabel: meta.label,
        categoryColor: meta.color,
        title: ev.title,
        description: ev.description,
        image: ev.image,
        tag: meta.tag,
        tagColor: meta.tagColor,
        customVisual: ev.id === 'event-1980' ? 'olympics' : 'none',
        sourceUrls: ev.sourceUrls,
      };
    });
  }, [rawEvents]);

  // Filtering & Sorting
  const filteredEvents = useMemo(() => {
    let result = events.filter((e) => {
      if (activeCategory === 'all') return true;
      return e.category === activeCategory;
    });

    result.sort((a, b) => (sortAscending ? a.year - b.year : b.year - a.year));
    return result;
  }, [events, activeCategory, sortAscending]);

  const years = useMemo(() => events.map((e) => e.year), [events]);
  const minYear = years.length > 0 ? Math.min(...years) : null;
  const maxYear = years.length > 0 ? Math.max(...years) : null;
  const sortLabel = minYear !== null && maxYear !== null
    ? (sortAscending ? `Thời gian (${minYear} → ${maxYear})` : `Gần đây nhất (${maxYear} → ${minYear})`)
    : (sortAscending ? 'Thời gian (cũ → mới)' : 'Gần đây nhất (mới → cũ)');

  const centuriesCount = useMemo(() => {
    return new Set(events.map((e) => Math.floor(e.year / 100) + 1)).size;
  }, [events]);

  const sourcedEventsCount = useMemo(() => {
    return events.filter((e) => (e.sourceUrls?.length ?? 0) > 0).length;
  }, [events]);

  const isPisces = useMemo(() => {
    return getZodiacSign(day, month).startsWith('Song Ngư');
  }, [day, month]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: events.length };
    for (const e of events) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    }
    return counts;
  }, [events]);

  const filterTabs = useMemo(() => {
    const tabs = [{ id: 'all', label: `Tất cả sự kiện (${events.length})` }];
    if (categoryCounts['birth']) {
      tabs.push({ id: 'birth', label: `Nhân vật lịch sử (${categoryCounts['birth']})` });
    }
    if (categoryCounts['event']) {
      tabs.push({ id: 'event', label: `Sự kiện lịch sử (${categoryCounts['event']})` });
    }
    if (categoryCounts['discovery']) {
      tabs.push({ id: 'discovery', label: `Khoa học & Khám phá (${categoryCounts['discovery']})` });
    }
    return tabs;
  }, [events.length, categoryCounts]);

  return (
    <AppShell>
      <div className="flex flex-col w-full pt-20">
        {/* Subtle Astral Ambience Background Effect */}
        <div className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-space-lg lg:py-space-xl flex flex-col gap-space-xl">
          {/* Top Decorative Breadcrumb & Celestial Context Pill */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high/60 pb-space-sm">
            <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Dòng thời gian lịch sử</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold">
                {day} Tháng {month}
              </span>
            </div>

            {/* Quick Date Switcher Portal Tag */}
            <div className="flex items-center gap-space-sm">
              {isPisces && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                  <span className="text-base">♓</span>
                  <span>Chiêm tinh: Song Ngư (19/02 – 20/03)</span>
                </div>
              )}
              <Link
                href={`/birthday/${month}/${day}`}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                <span>Xem nhân vật</span>
              </Link>
            </div>
          </div>

          {/* Editorial Header Block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant self-start">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  history_edu
                </span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  Biên niên sử nhân loại
                </span>
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Dòng sự kiện ngày {day} tháng {month} qua các thế kỷ
              </h1>
              <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant font-light">
                Khám phá các chuyển biến lịch sử vĩ đại, hiệp ước, khởi nguồn phát minh và các mốc son văn hóa thế giới diễn ra đúng vào thời khắc này.
              </p>
            </div>

            {/* Quick Metrics Insight Box */}
            <div className="flex items-center gap-space-md p-space-md rounded-2xl bg-surface-container-low border border-surface-container-high/80 shrink-0">
              <div className="flex flex-col border-r border-outline-variant/40 pr-space-md">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Cột mốc tiêu biểu</span>
                <span className="font-headline-md text-headline-md font-bold text-primary">{events.length}</span>
              </div>
              <div className="flex flex-col border-r border-outline-variant/40 pr-space-md">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Thế kỷ ghi dấu</span>
                <span className="font-headline-md text-headline-md font-bold text-secondary">{centuriesCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Sự kiện có nguồn</span>
                <span className="font-headline-md text-headline-md font-bold text-tertiary">
                  {events.length > 0 ? `${sourcedEventsCount}/${events.length}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Navigation Bar */}
          <div className="w-full bg-surface-container-lowest p-2 rounded-2xl shadow-sm border border-surface-container-high/80 flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {filterTabs.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-space-md py-2 rounded-xl font-label-md text-label-md transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Order Toggle Button */}
            <div className="flex items-center gap-space-xs pl-space-sm">
              <button
                type="button"
                onClick={() => setSortAscending(!sortAscending)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/30 font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                <span>{sortLabel}</span>
              </button>
            </div>
          </div>

          {/* MAIN TWO-COLUMN LAYOUT: Interactive Vertical Timeline + Astral Chronicle Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            {/* LEFT COLUMN: The Interactive Vertical Timeline (7 cols) */}
            <div className="lg:col-span-7 flex flex-col relative">
              {/* Timeline Trunk Guide Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary-container to-surface-dim hidden sm:block" />

              <div className="flex flex-col gap-space-lg">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex flex-col sm:flex-row items-start gap-space-md group"
                  >
                    {/* Node Year Badge on Timeline */}
                    <div className="z-10 flex sm:flex-col items-center justify-center w-12 sm:w-12 h-12 rounded-2xl bg-surface-container-lowest border-2 border-primary shadow-md shrink-0 sm:mt-1 group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                      <span className="font-title-md text-xs sm:text-xs font-black text-primary group-hover:text-on-primary leading-tight">
                        {item.year}
                      </span>
                    </div>

                    {/* Timeline Event Card */}
                    <div className="flex-1 w-full bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_20px_rgba(19,27,46,0.04)] border border-surface-container-high/80 hover:shadow-[0_12px_32px_rgba(79,70,229,0.08)] transition-all flex flex-col gap-space-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${item.categoryColor}`}>
                            {item.categoryLabel}
                          </span>
                          {item.tag && (
                            <span className={`px-2 py-0.5 rounded-md font-label-sm text-[11px] font-semibold ${item.tagColor}`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <span className="font-label-sm text-label-sm text-outline font-medium">
                          {day} Tháng {month}, {item.year}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-title-md sm:text-headline-sm font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>

                      {/* Visual Content: Image or Custom Graphic */}
                      {item.image && (
                        <div className="mt-2 w-full h-44 rounded-2xl overflow-hidden bg-surface-container border border-surface-container-high">
                          <img
                            alt={item.title}
                            src={item.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Graphic Vector representation of Olympic Rings if 1980 */}
                      {item.customVisual === 'olympics' && (
                        <div className="mt-2 w-full p-6 rounded-2xl bg-gradient-to-r from-surface-container-low to-surface-container flex items-center justify-center border border-surface-container-high">
                          <svg className="w-20 h-12" fill="none" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="22" r="14" stroke="#005CC6" strokeWidth="4.5" />
                            <circle cx="50" cy="22" r="14" stroke="#131B2E" strokeWidth="4.5" />
                            <circle cx="80" cy="22" r="14" stroke="#BA1A1A" strokeWidth="4.5" />
                            <circle cx="35" cy="38" r="14" stroke="#8455EF" strokeWidth="4.5" />
                            <circle cx="65" cy="38" r="14" stroke="#3525CD" strokeWidth="4.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="py-16 px-6 text-center flex flex-col items-center gap-4 bg-surface-container-low/40 rounded-3xl border border-surface-container-high/60">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">history_edu</span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-sm">
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        Chưa có sự kiện lịch sử cho ngày {day} Tháng {month}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Dữ liệu sự kiện lịch sử được xác thực cẩn trọng từ các nguồn tin cậy và đang được tiếp tục bổ sung.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Astral Data & Constellation Charting Widget (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
              {/* Nocturnal Astral Overview Card */}
              {isPisces && (
                <div className="w-full rounded-3xl bg-gradient-to-b from-on-surface via-primary to-secondary p-6 sm:p-8 text-on-primary shadow-xl relative overflow-hidden flex flex-col gap-6">
                  {/* Celestial Glowing Orb Background */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold">
                      Thiên văn &amp; Chiêm tinh học
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-bright/20 backdrop-blur-md text-surface-bright font-label-sm text-label-sm font-semibold">
                      Song Ngư (Pisces)
                    </span>
                  </div>

                  {/* Constellation SVG chart widget */}
                  <div className="relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-surface-bright/20 flex flex-col items-center">
                    <svg className="w-full h-36" fill="none" viewBox="0 0 280 140">
                      <line stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" strokeWidth="1.5" x1="40" x2="80" y1="90" y2="60" />
                      <line stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" x1="80" x2="140" y1="60" y2="70" />
                      <line stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" x1="140" x2="190" y1="70" y2="40" />
                      <line stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" strokeWidth="1.5" x1="190" x2="240" y1="40" y2="85" />
                      <line stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" x1="140" x2="150" y1="70" y2="120" />
                      <circle className="animate-pulse" cx="40" cy="90" fill="#C3C0FF" r="4" />
                      <circle cx="80" cy="60" fill="#ffffff" r="3" />
                      <circle cx="140" cy="70" fill="#8455EF" r="5" />
                      <circle cx="190" cy="40" fill="#ffffff" r="4.5" />
                      <circle cx="240" cy="85" fill="#DAD7FF" r="3.5" />
                      <circle cx="150" cy="120" fill="#ffffff" r="3" />
                      <text fill="#C3C0FF" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="145" y="65">
                        Alrescha (Alpha Psc)
                      </text>
                    </svg>
                    <span className="font-label-sm text-xs text-primary-fixed mt-1">
                      Bản đồ chòm sao Song Ngư trên bầu trời phương Bắc
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col gap-2">
                    <h4 className="font-title-md text-title-md text-white font-bold">
                      Trực giác, Bao dung &amp; Đột phá
                    </h4>
                    <p className="font-body-sm text-body-sm text-primary-fixed/90 font-light leading-relaxed">
                      {`Những cá nhân sinh vào ngày ${day} tháng ${month} mang năng lượng dung hòa của chòm sao Song Ngư: khả năng trực cảm sâu sắc, tư duy nhân văn và sức bền bền bỉ qua mọi biến động của lịch sử.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Historical Reflection */}
              <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col gap-3">
                <span className="material-symbols-outlined text-secondary text-[28px]">format_quote</span>
                <p className="font-body-md text-body-md text-on-surface italic font-medium">
                  &ldquo;Mỗi ngày trôi qua đều lưu dấu những chuyển biến thầm lặng định hình nên tương lai của nhân loại.&rdquo;
                </p>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Ghi chú lịch sử
                </span>
              </div>

              {/* Curated Era Highlight Card */}
              {events.length > 0 && (
                <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container-high/80 flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                    Dấu ấn thời gian
                  </span>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    Biên niên sử ngày {day} tháng {month}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {`Các sự kiện được ghi nhận qua nhiều thời kỳ, phản ánh dòng chảy lịch sử và những cột mốc đáng nhớ của ngày ${day}/${month}.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEPARATOR / TRANSITION DIVIDER */}
          <div className="w-full flex items-center gap-space-lg my-space-md">
            <div className="flex-1 h-px bg-surface-container-high" />
            <span className="material-symbols-outlined text-primary text-[24px]">auto_awesome</span>
            <div className="flex-1 h-px bg-surface-container-high" />
          </div>

          {/* BOTTOM SECTION: Những người cùng ngày cùng năm sinh (Exact Same Date) */}
          <div className="flex flex-col gap-space-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                  Trải nghiệm chính xác đến từng năm
                </span>
                <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface font-bold">
                  Cùng ngày, cùng năm sinh: {day} tháng {month}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Khám phá những nhân vật chia sẻ cùng một sinh nhật tuyệt đối với bạn trong cùng một năm sinh.
                </p>
              </div>

              {/* Year selector interactive chiplet */}
              {dayPeople.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {Array.from(new Set(dayPeople.map((p) => p.birthYear.toString())))
                    .slice(0, 4)
                    .map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setSelectedYear(y)}
                        className={`px-3 py-1.5 rounded-xl font-label-md text-label-md transition-all font-semibold ${
                          selectedYear === y
                            ? 'bg-secondary text-white shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        Năm {y}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Celebrities / Luminaries Cards Grid (3 Columns Bento) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {dayPeople.length > 0 ? (
                dayPeople.slice(0, 2).map((person) => (
                  <div
                    key={person.id}
                    className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-surface-container">
                        <img
                          alt={person.name}
                          src={person.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-on-surface/80 backdrop-blur-md text-surface font-label-sm text-xs font-bold">
                          {person.birthDate ? `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${person.birthYear}` : `${person.birthYear}`}
                        </div>
                      </div>
                      <h4 className="font-title-md text-title-md font-bold text-on-surface">{person.name}</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">{person.shortDescription}</p>
                      <p className="text-xs text-on-surface-variant mt-2 line-clamp-3">
                        {person.biography || person.shortDescription}
                      </p>
                    </div>
                    <Link
                      href={`/birthday/${month}/${day}/people?person=${person.slug}`}
                      className="mt-4 text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <span>Xem hồ sơ</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 py-12 px-6 text-center flex flex-col items-center justify-center gap-3 bg-surface-container-low/40 rounded-3xl border border-surface-container-high/60">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">group</span>
                  </div>
                  <div className="flex flex-col gap-1 max-w-sm">
                    <h4 className="font-title-md text-sm text-on-surface font-bold">
                      Chưa có nhân vật xác minh cho ngày {day} Tháng {month}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Dữ liệu nhân vật đang được thẩm định và bổ sung liên tục theo các nguồn lưu trữ chính thống.
                    </p>
                  </div>
                </div>
              )}

              {/* Card 3: Interactive Persona & Cosmic Club Joiner Card */}
              <div className="bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary rounded-3xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-[28px] text-tertiary-fixed-dim">stars</span>
                  <h4 className="font-title-md text-title-md font-bold text-white mt-2">
                    Bạn sinh năm nào?
                  </h4>
                  <p className="text-xs text-primary-fixed mt-1 leading-relaxed">
                    Nhập năm sinh của bạn để hệ thống đối chiếu cơ sở dữ liệu hàng chục nghìn nhân vật sinh chính xác cùng năm với bạn.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="1995"
                      value={userYearInput}
                      onChange={(e) => setUserYearInput(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/60 text-sm font-bold outline-none border border-white/30 focus:border-white"
                    />
                    <Link
                      href={`/exact/${day}-${month}-${userYearInput || '1995'}`}
                      className="px-4 py-2 rounded-xl bg-white text-primary font-label-md text-xs font-bold hover:bg-white/90 transition-colors shadow-sm"
                    >
                      Tìm kiếm
                    </Link>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20 mt-4 text-[11px] text-primary-fixed/80">
                  ⚡ Đối chiếu thuật toán niên biểu tự động
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

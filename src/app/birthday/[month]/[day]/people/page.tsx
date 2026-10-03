'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useFavorites } from '@/hooks/useFavorites';
import { ALL_PEOPLE, getBirthdayData } from '@/data/birthdays';
import { Person } from '@/data/types';

export default function PeopleDirectoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const month = parseInt(params.month as string, 10) || 2;
  const day = parseInt(params.day as string, 10) || 22;
  const initialPersonSlug = searchParams.get('person');

  const { isFavorite, toggleFavorite } = useFavorites();

  const birthdayData = useMemo(() => getBirthdayData(month, day), [month, day]);

  // Directory people strictly born on this date (zero fallback contamination)
  const directoryPeople = useMemo(() => {
    return ALL_PEOPLE.filter((p) => p.birthMonth === month && p.birthDay === day);
  }, [month, day]);

  // Selected Person State
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (initialPersonSlug && directoryPeople.some((p) => p.slug === initialPersonSlug)) {
      return initialPersonSlug;
    }
    return directoryPeople[0]?.slug || '';
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [exactYearOnly, setExactYearOnly] = useState(false);
  const [filterYear, setFilterYear] = useState('1732');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'politics', label: 'Chính trị & Lãnh đạo' },
    { id: 'scientist', label: 'Khoa học & Công nghệ' },
    { id: 'music', label: 'Nghệ thuật & Âm nhạc' },
    { id: 'actor', label: 'Điện ảnh' },
    { id: 'athlete', label: 'Thể thao' },
    { id: 'literature', label: 'Văn học & Triết học' },
  ];

  const countries = [
    { id: 'all', label: 'Tất cả quốc gia' },
    { id: 'VN', label: 'Việt Nam' },
    { id: 'US', label: 'Hoa Kỳ' },
    { id: 'GB', label: 'Vương quốc Anh' },
    { id: 'FR', label: 'Pháp' },
    { id: 'DE', label: 'Đức' },
    { id: 'AU', label: 'Úc' },
    { id: 'KR', label: 'Hàn Quốc' },
  ];

  // Filter logic
  const filteredPeople = useMemo(() => {
    return directoryPeople.filter((person) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = person.name.toLowerCase().includes(q);
        const matchesDesc = (person.shortDescription || '').toLowerCase().includes(q);
        const matchesCountry = (person.countryName || '').toLowerCase().includes(q);
        const matchesOcc = (person.occupation || []).some((o) => o.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCountry && !matchesOcc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'politics' && person.category !== 'politics' && person.category !== 'history') return false;
        if (selectedCategory === 'scientist' && person.category !== 'scientist') return false;
        if (selectedCategory === 'music' && person.category !== 'music' && person.category !== 'artist') return false;
        if (selectedCategory === 'actor' && person.category !== 'actor') return false;
        if (selectedCategory === 'athlete' && person.category !== 'athlete') return false;
        if (selectedCategory === 'literature' && person.category !== 'literature') return false;
      }

      // Country filter
      if (selectedCountry !== 'all' && person.countryCode !== selectedCountry) {
        return false;
      }

      // Exact Year
      if (exactYearOnly && String(person.birthYear) !== filterYear) {
        return false;
      }

      return true;
    });
  }, [directoryPeople, searchQuery, selectedCategory, selectedCountry, exactYearOnly, filterYear]);

  // Selected person object
  const currentPerson: Person | undefined = useMemo(() => {
    const found = directoryPeople.find((p) => p.slug === selectedSlug);
    return found || filteredPeople[0] || directoryPeople[0];
  }, [directoryPeople, selectedSlug, filteredPeople]);

  const saved = currentPerson ? isFavorite(currentPerson.id) : false;

  return (
    <AppShell>
      <div className="flex flex-col w-full pt-20">
        {/* ========================================================================= */}
        {/* Top Astral Breadcrumb & Section Scope Bar                                  */}
        {/* ========================================================================= */}
        <div className="w-full bg-surface-container-low/70 py-space-sm border-b border-surface-container">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="text-outline-variant">/</span>
              <Link href={`/birthday/${month}/${day}`} className="hover:text-primary transition-colors">
                {day} Tháng {month}
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Danh sách nhân vật</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="hidden sm:inline text-on-surface-variant text-xs">
                Chuyển ngày:
              </span>
              <div className="flex items-center gap-1 bg-surface-container-lowest rounded-full px-2.5 py-1 border border-outline-variant/40 text-on-surface text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-primary">event</span>
                <span>{day} Tháng {month}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Primary Desktop Shell: Search, Multi-Tier Filter Console & Stats          */}
        {/* ========================================================================= */}
        <div className="w-full bg-surface-container-lowest shadow-sm py-space-lg border-b border-surface-container-high/60">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex flex-col gap-space-md">
            {/* Primary Search and Quick Settings */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
              <div className="relative flex-1 max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, tác phẩm, sự kiện, quốc gia..."
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary/50 focus:bg-surface-container-lowest rounded-2xl pl-12 pr-10 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Exact Year Toggle & Day/Month quick indicator */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExactYearOnly(!exactYearOnly)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-label-md text-label-md border transition-all ${
                    exactYearOnly
                      ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-outline-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {exactYearOnly ? 'check_circle' : 'filter_vintage'}
                  </span>
                  <span>Chính xác cùng năm ({filterYear})</span>
                </button>

                <Link
                  href={`/day/${month}/${day}`}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md border border-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    timeline
                  </span>
                  <span>Sự kiện lịch sử</span>
                </Link>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${
                    selectedCategory === cat.id
                      ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant/40 hover:text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Country / Geographical Region Tags */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 text-xs">
              <span className="text-on-surface-variant font-medium whitespace-nowrap mr-1">
                Khu vực:
              </span>
              {countries.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCountry(c.id)}
                  className={`px-3 py-1 rounded-lg font-label-sm text-label-sm whitespace-nowrap transition-all ${
                    selectedCountry === c.id
                      ? 'bg-on-surface text-surface font-bold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Master-Detail Desktop Workstation (12 Columns capped at 1360px)           */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            {/* LEFT COLUMN: Directory List (5 Cols) */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Danh sách Danh nhân
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Chọn nhân vật để xem niên biểu &amp; tiểu sử chi tiết
                  </p>
                </div>
                <span className="font-label-md text-label-md text-primary bg-primary-fixed/50 px-3 py-1 rounded-full font-bold">
                  {filteredPeople.length} Mục tuyển chọn
                </span>
              </div>

              {/* People Directory Items */}
              <div className="flex flex-col gap-3">
                {filteredPeople.map((p) => {
                  const isSelected = currentPerson?.slug === p.slug;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedSlug(p.slug)}
                      className={`relative rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'bg-surface-container-high border-primary/30 shadow-md ring-1 ring-primary/20'
                          : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container-high/80'
                      }`}
                    >
                      {/* Active Indicator Pill */}
                      {isSelected && (
                        <div className="absolute -left-1 top-4 bottom-4 w-1.5 bg-primary rounded-full" />
                      )}

                      <div className="flex items-start gap-space-md">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm relative bg-surface-container">
                          <img
                            alt={p.name}
                            src={p.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-label-sm text-label-sm text-secondary font-bold">
                              {p.birthYear} {p.deathDate ? `– ${new Date(p.deathDate).getFullYear()}` : '– nay'}
                            </span>
                            <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                              {p.countryName}
                            </span>
                          </div>
                          <h3 className={`font-title-md text-title-md font-bold mt-0.5 truncate ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {p.name}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            {p.shortDescription || p.biography}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {directoryPeople.length === 0 ? (
                  <div className="text-center py-12 bg-surface-container-low rounded-2xl p-6">
                    <p className="text-on-surface-variant text-sm font-semibold">
                      Chưa có danh nhân nào được ghi nhận cho ngày {day} Tháng {month}.
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Dữ liệu đang tiếp tục được bổ sung và kiểm chứng cẩn trọng.
                    </p>
                    <Link
                      href="/birthday/2/22/people"
                      className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
                    >
                      Xem ngày mẫu 22 Tháng 2
                    </Link>
                  </div>
                ) : filteredPeople.length === 0 ? (
                  <div className="text-center py-12 bg-surface-container-low rounded-2xl p-6">
                    <p className="text-on-surface-variant text-sm">Không tìm thấy nhân vật nào phù hợp tiêu chí.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedCountry('all');
                        setExactYearOnly(false);
                      }}
                      className="mt-3 text-xs font-bold text-primary hover:underline"
                    >
                      Đặt lại tất cả bộ lọc
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* RIGHT COLUMN: Deep Person Dossier (7 Cols) */}
            {currentPerson && (
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-space-lg lg:sticky lg:top-24">
                {/* Main Dossier Card */}
                <div className="bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden border border-surface-container-high/80">
                  {/* Large Visual Banner with Specular Astral Gradient */}
                  <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-gradient-to-tr from-on-surface via-primary to-secondary">
                    <img
                      alt={currentPerson.name}
                      src={currentPerson.image}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Soft Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />

                    {/* Top Floating Actions Inside Banner */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Hồ sơ lịch sử chính thức
                      </span>
                      <div className="flex items-center gap-space-xs">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(currentPerson)}
                          aria-label="Lưu hồ sơ"
                          className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
                            saved
                              ? 'bg-secondary text-white'
                              : 'bg-surface-container-lowest/90 text-on-surface hover:bg-primary-container hover:text-on-primary-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {saved ? 'bookmark_added' : 'bookmark'}
                          </span>
                        </button>
                        <Link
                          href={`/share/2-22`}
                          aria-label="Tạo thẻ chia sẻ"
                          className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[20px]">share</span>
                        </Link>
                      </div>
                    </div>

                    {/* Floating Astrological Sign Over Portrait Foot */}
                    <div className="absolute bottom-4 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-surface-bright/90 backdrop-blur-md border border-outline-variant/30 shadow-sm">
                      <span className="text-xl">♓</span>
                      <span className="font-label-sm text-label-sm font-bold text-secondary">
                        Song Ngư (Pisces)
                      </span>
                    </div>
                  </div>

                  {/* Dossier Body Content */}
                  <div className="p-6 sm:p-8 flex flex-col gap-6">
                    {/* Headline & Role Badges */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">
                          {currentPerson.countryName}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                          {currentPerson.birthYear} – {currentPerson.deathDate ? new Date(currentPerson.deathDate).getFullYear() : 'nay'}
                          {currentPerson.deathDate && ` (Thọ ${new Date(currentPerson.deathDate).getFullYear() - currentPerson.birthYear} tuổi)`}
                        </span>
                      </div>
                      <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface font-extrabold mt-1">
                        {currentPerson.name}
                      </h1>
                      <h3 className="font-title-md text-title-md text-primary font-bold">
                        {(currentPerson.occupation || []).join(' • ') || 'Danh nhân nổi tiếng'}
                      </h3>
                    </div>

                    {/* Deep Narrative Biography */}
                    <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface leading-relaxed">
                      <p>{currentPerson.biography}</p>
                      {currentPerson.highlights && currentPerson.highlights.length > 0 && (
                        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2 mt-2 border border-surface-container-high/60">
                          <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                            Dấu ấn nổi bật
                          </span>
                          <ul className="flex flex-col gap-1.5 text-sm text-on-surface-variant">
                            {currentPerson.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">check_circle</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Key Milestones & Legacy Points Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-1 border border-surface-container-high/60">
                        <span className="font-label-sm text-label-sm text-primary font-bold">Thành tựu cốt lõi</span>
                        <span className="font-body-sm text-xs text-on-surface-variant line-clamp-3">
                          {currentPerson.shortDescription || 'Đóng góp to lớn cho lịch sử và nhân loại.'}
                        </span>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-1 border border-surface-container-high/60">
                        <span className="font-label-sm text-label-sm text-primary font-bold">Nơi sinh & Xuất thân</span>
                        <span className="font-body-sm text-xs text-on-surface-variant line-clamp-3">
                          {currentPerson.birthplace || currentPerson.countryName}
                        </span>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-1 border border-surface-container-high/60">
                        <span className="font-label-sm text-label-sm text-primary font-bold">Tầm ảnh hưởng</span>
                        <span className="font-body-sm text-xs text-on-surface-variant line-clamp-3">
                          Biểu tượng truyền cảm hứng cho nhiều thế hệ trên khắp thế giới.
                        </span>
                      </div>
                    </div>

                    {/* Official Wikipedia Link & Knowledge Hub */}
                    {currentPerson.wikipediaUrl && (
                      <div className="pt-2">
                        <a
                          href={currentPerson.wikipediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-bold transition-colors border border-surface-container-high"
                        >
                          <span className="material-symbols-outlined text-[18px]">menu_book</span>
                          <span>Đọc tài liệu toàn văn trên Wikipedia</span>
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                      </div>
                    )}

                    {/* Historical Resonance On Date */}
                    <div className="p-4 rounded-2xl bg-secondary-fixed/30 border border-secondary-fixed flex gap-3 items-start">
                      <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">
                        auto_awesome
                      </span>
                      <div className="flex flex-col text-sm">
                        <span className="font-label-md text-label-md text-on-secondary-fixed font-bold">
                          Dấu ấn ngày sinh {day} tháng {month}
                        </span>
                        <p className="text-on-surface-variant text-xs mt-0.5">
                          Ngày sinh của {currentPerson.name} là một trong những thời khắc mang tính biểu tượng, gắn liền với di sản văn hóa và lịch sử thế giới.
                        </p>
                      </div>
                    </div>

                    {/* Related Luminaries Born on the Same Date */}
                    <div className="flex flex-col gap-3 pt-2">
                      <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
                        Danh nhân khác cùng ngày sinh
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {directoryPeople
                          .filter((p) => p.slug !== currentPerson.slug)
                          .slice(0, 3)
                          .map((rel) => (
                            <div
                              key={rel.id}
                              onClick={() => setSelectedSlug(rel.slug)}
                              className="group cursor-pointer flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
                            >
                              <img
                                alt={rel.name}
                                src={rel.image}
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-surface-container-high group-hover:scale-105 transition-transform"
                              />
                              <span className="font-label-sm text-xs font-bold text-on-surface mt-1.5 truncate max-w-full">
                                {rel.name}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                {rel.birthYear}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Cosmic Celestial Highlight Banner (Astral Editorial Minimal Signature)    */}
        {/* ========================================================================= */}
        <div className="w-full bg-gradient-to-r from-on-surface via-primary to-secondary py-12 text-on-primary">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-headline-md text-2xl font-bold text-white">
                Bạn muốn kiểm tra xem ai sinh cùng ngày với chính bạn?
              </h2>
              <p className="font-body-sm text-primary-fixed mt-1 max-w-xl">
                Nhập ngày sinh của bạn ngay trên trang chủ BirthdayVerse để khám phá danh sách danh nhân và thẻ kỷ niệm độc bản.
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-2xl bg-surface-bright text-primary font-title-md text-title-md font-bold hover:bg-surface-bright/90 transition-all shadow-lg shrink-0 flex items-center gap-2"
            >
              <span>Tra Cứu Ngày Của Bạn</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

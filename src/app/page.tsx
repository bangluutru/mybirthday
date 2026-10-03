'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useFavorites } from '@/hooks/useFavorites';
import { ALL_PEOPLE } from '@/data/birthdays';

export default function HomePage() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [birthDay, setBirthDay] = useState('22');
  const [birthMonth, setBirthMonth] = useState('2');
  const [birthYear, setBirthYear] = useState('');
  const [activeRegion, setActiveRegion] = useState<'all' | 'vn' | 'world'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Quick Date Select
  const handleQuickDate = (d: string, m: string) => {
    setBirthDay(d);
    setBirthMonth(m);
  };

  const handleExplore = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const d = parseInt(birthDay, 10) || 22;
    const m = parseInt(birthMonth, 10) || 2;
    if (birthYear && birthYear.trim()) {
      router.push(`/birthday/${m}/${d}?year=${encodeURIComponent(birthYear.trim())}`);
    } else {
      router.push(`/birthday/${m}/${d}`);
    }
  };

  // Bespoke Luminaries Data for February 22
  const luminaries = [
    {
      id: 'george-washington',
      slug: 'george-washington',
      name: 'George Washington',
      lifespan: '1732 – 1799',
      roleBadge: 'Chính trị gia • Hoa Kỳ',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Tổng thống đầu tiên của Hợp chúng quốc Hoa Kỳ, nhà lãnh đạo quân sự kiệt xuất trong Chiến tranh Cách mạng Mỹ và là một trong những Người lập quốc vĩ đại nhất.',
      verifiedLabel: 'Được xác thực',
      verifiedIcon: 'verified',
      region: 'world',
      category: 'politics',
      image: '/people/george-washington.png',
      alt: 'Chân dung Tổng thống George Washington',
    },
    {
      id: 'drew-barrymore',
      slug: 'drew-barrymore',
      name: 'Drew Barrymore',
      lifespan: '1975 – nay',
      roleBadge: 'Điện ảnh • Hoa Kỳ',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Nữ diễn viên, nhà sản xuất phim kiêm người dẫn chương trình biểu tượng của Hollywood, khởi đầu từ tác phẩm kinh điển E.T. the Extra-Terrestrial đến loạt phim Charlie’s Angels.',
      verifiedLabel: 'Được xác thực',
      verifiedIcon: 'verified',
      region: 'world',
      category: 'actor',
      image: '/people/drew-barrymore.png',
      alt: 'Chân dung Drew Barrymore',
    },
    {
      id: 'steve-irwin',
      slug: 'steve-irwin',
      name: 'Steve Irwin',
      lifespan: '1962 – 2006',
      roleBadge: 'Bảo tồn hoang dã • Úc',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Huyền thoại bảo tồn thiên nhiên hoang dã người Úc với biệt danh “The Crocodile Hunter”, người truyền cảm hứng mạnh mẽ về tình yêu động vật tới hàng triệu khán giả toàn cầu.',
      verifiedLabel: 'Được xác thực',
      verifiedIcon: 'verified',
      region: 'world',
      category: 'nature',
      image: '/people/steve-irwin.png',
      alt: 'Chân dung Steve Irwin',
    },
    {
      id: 'arthur-schopenhauer',
      slug: 'arthur-schopenhauer',
      name: 'Arthur Schopenhauer',
      lifespan: '1788 – 1860',
      roleBadge: 'Triết học • Đức',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Triết gia vĩ đại người Đức với tác phẩm kinh điển "Thế giới như là ý chí và biểu hiện", đặt nền móng sâu sắc cho triết học hiện đại và tâm lý học thế giới.',
      verifiedLabel: 'Triết gia vĩ đại',
      verifiedIcon: 'workspace_premium',
      region: 'world',
      category: 'literature',
      image: '/people/arthur-schopenhauer.png',
      alt: 'Chân dung Arthur Schopenhauer',
    },
    {
      id: 'heinrich-hertz',
      slug: 'heinrich-hertz',
      name: 'Heinrich Hertz',
      lifespan: '1857 – 1894',
      roleBadge: 'Vật lý học • Đức',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Nhà vật lý học vĩ đại người Đức đã thực nghiệm chứng minh sự tồn tại của sóng điện từ, khai sinh nền viễn thông hiện đại. Tên ông được đặt cho đơn vị tần số quốc tế Hertz (Hz).',
      verifiedLabel: 'Phát minh khoa học',
      verifiedIcon: 'verified',
      region: 'world',
      category: 'science',
      image: '/people/heinrich-hertz.png',
      alt: 'Chân dung Heinrich Hertz',
    },
    {
      id: 'niki-lauda',
      slug: 'niki-lauda',
      name: 'Niki Lauda',
      lifespan: '1949 – 2019',
      roleBadge: 'Tay đua F1 • Áo',
      badgeColor: 'bg-surface-container-high text-primary',
      description:
        'Huyền thoại đua xe Công thức 1 với 3 chức vô địch thế giới, người đã tạo nên màn trở lại thần kỳ sau vụ tai nạn thảm khốc tại Nürburgring năm 1976.',
      verifiedLabel: 'Huyền thoại thể thao',
      verifiedIcon: 'verified',
      region: 'world',
      category: 'sports',
      image: '/people/niki-lauda.png',
      alt: 'Chân dung Niki Lauda',
    },
  ];

  const filteredLuminaries = luminaries.filter((lum) => {
    if (activeRegion !== 'all' && lum.region !== activeRegion) return false;
    if (activeCategory !== 'all' && lum.category !== activeCategory) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* ========================================================================= */}
        {/* HERO SEGMENT: NOCTURNAL COSMIC CONTINUUM WITH EARTH & LUMINARIES          */}
        {/* ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-on-surface via-primary to-background text-on-primary pt-28 pb-32 sm:pb-36 lg:pb-40">
          {/* Starfield & Ambient Nebula Lights */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d8e2ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex flex-col items-center text-center">
            {/* Top Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-bright/10 backdrop-blur-md border border-surface-bright/20 mb-6 text-on-primary-container">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                auto_awesome
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Khám phá vũ trụ sinh nhật của bạn
              </span>
            </div>

            {/* Hero Headline inspired by prompt mobile screenshot */}
            <h1 className="font-display-hero text-3xl sm:text-5xl lg:text-display-hero font-extrabold tracking-tight max-w-4xl text-on-primary">
              Ngày Bạn Sinh Ra Có Một Vũ Trụ Riêng
            </h1>

            <p className="font-body-lg text-body-md sm:text-body-lg text-primary-fixed max-w-2xl mt-4 mb-10 leading-relaxed font-light">
              Khám phá danh nhân, nghệ sĩ, nhà khoa học và các sự kiện lịch sử vĩ đại chia sẻ cùng ngày sinh của bạn trên khắp thế giới.
            </p>

            {/* Centerpiece Montage: Prominent Luminaries over Earth Horizon */}
            <div className="relative w-full max-w-4xl h-56 sm:h-72 md:h-84 flex items-end justify-center mb-8">
              {/* Curved Earth Glow Arc */}
              <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-primary/90 to-transparent rounded-t-[100%] border-t-2 border-surface-bright/40 shadow-[0_-15px_40px_rgba(173,198,255,0.3)] pointer-events-none" />

              {/* Portraits Collage Overlay (Einstein, Barrymore, Jobs, Ngô Bảo Châu, Washington) */}
              <div className="relative z-10 w-full flex items-end justify-center -space-x-4 sm:-space-x-8 px-4">
                {/* Person 1: Albert Einstein */}
                <div className="group relative flex flex-col items-center transition-transform hover:-translate-y-3 duration-300">
                  <img
                    alt="Chân dung Albert Einstein"
                    className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 rounded-2xl object-cover shadow-xl ring-2 ring-surface-bright/20"
                    src="/people/montage-0.png"
                  />
                  <span className="mt-2 text-xs font-medium text-surface-bright/80 hidden sm:block">
                    A. Einstein
                  </span>
                </div>

                {/* Person 2: Drew Barrymore */}
                <div className="group relative flex flex-col items-center transition-transform hover:-translate-y-3 duration-300">
                  <img
                    alt="Chân dung Drew Barrymore"
                    className="w-18 h-22 sm:w-28 sm:h-36 md:w-36 md:h-44 rounded-2xl object-cover shadow-2xl ring-2 ring-surface-bright/30"
                    src="/people/montage-1.png"
                  />
                  <span className="mt-2 text-xs font-medium text-surface-bright/80 hidden sm:block">
                    D. Barrymore
                  </span>
                </div>

                {/* Person 3 (Center Leader): Steve Jobs */}
                <div className="group relative flex flex-col items-center z-20 transition-transform hover:-translate-y-4 duration-300 -mb-2">
                  <div className="relative">
                    <img
                      alt="Chân dung Steve Jobs"
                      className="w-22 h-26 sm:w-32 sm:h-44 md:w-44 md:h-52 rounded-2xl object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-4 ring-tertiary-fixed-dim"
                      src="/people/montage-2.png"
                    />
                    <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold shadow-md">
                      24 Tháng 2
                    </div>
                  </div>
                  <span className="mt-2 text-sm font-bold text-surface-bright hidden sm:block">
                    Steve Jobs
                  </span>
                </div>

                {/* Person 4: Ngô Bảo Châu */}
                <div className="group relative flex flex-col items-center transition-transform hover:-translate-y-3 duration-300">
                  <img
                    alt="Chân dung Ngô Bảo Châu"
                    className="w-18 h-22 sm:w-28 sm:h-36 md:w-36 md:h-44 rounded-2xl object-cover shadow-2xl ring-2 ring-surface-bright/30"
                    src="/people/montage-3.png"
                  />
                  <span className="mt-2 text-xs font-medium text-surface-bright/80 hidden sm:block">
                    Ngô Bảo Châu
                  </span>
                </div>

                {/* Person 5: George Washington */}
                <div className="group relative flex flex-col items-center transition-transform hover:-translate-y-3 duration-300">
                  <img
                    alt="Chân dung George Washington"
                    className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 rounded-2xl object-cover shadow-xl ring-2 ring-surface-bright/20"
                    src="/people/montage-4.png"
                  />
                  <span className="mt-2 text-xs font-medium text-surface-bright/80 hidden sm:block">
                    G. Washington
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* INTERACTIVE DATE PORTAL CARD (Floating Console)                            */}
            {/* ========================================================================= */}
            <div className="w-full max-w-2xl bg-surface-container-lowest text-on-surface rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(19,27,46,0.15)] border border-surface-container-high relative z-30">
              <form onSubmit={handleExplore} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    Chọn Ngày Sinh Của Bạn
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Dữ liệu 365 ngày toàn diện
                  </span>
                </div>

                {/* Input Fields: Day, Month, Year */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  {/* Day Picker */}
                  <div className="col-span-4 flex flex-col gap-1.5 text-left">
                    <label htmlFor="birthDay" className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Ngày
                    </label>
                    <select
                      id="birthDay"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-3.5 py-3 font-title-md text-title-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-semibold cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Picker */}
                  <div className="col-span-5 flex flex-col gap-1.5 text-left">
                    <label htmlFor="birthMonth" className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Tháng
                    </label>
                    <select
                      id="birthMonth"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-3.5 py-3 font-title-md text-title-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-semibold cursor-pointer"
                    >
                      {[
                        'Tháng 1',
                        'Tháng 2',
                        'Tháng 3',
                        'Tháng 4',
                        'Tháng 5',
                        'Tháng 6',
                        'Tháng 7',
                        'Tháng 8',
                        'Tháng 9',
                        'Tháng 10',
                        'Tháng 11',
                        'Tháng 12',
                      ].map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Optional Year */}
                  <div className="col-span-3 flex flex-col gap-1.5 text-left">
                    <label htmlFor="birthYear" className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Năm <span className="text-[10px] text-outline">(Tùy chọn)</span>
                    </label>
                    <input
                      id="birthYear"
                      type="number"
                      min="1800"
                      max="2025"
                      placeholder="1995"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-3.5 py-3 font-title-md text-title-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline font-semibold"
                    />
                  </div>
                </div>

                {/* Main CTA Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-title-md text-title-md font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Khám Phá Ngay Vũ Trụ Của Bạn</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                {/* Quick Discovery Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-surface-container-high/60">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mr-1">
                    Gợi ý nhanh:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      handleQuickDate(String(now.getDate()), String(now.getMonth() + 1));
                    }}
                    className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant transition-colors"
                  >
                    Hôm nay
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate('22', '2')}
                    className="px-3 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm font-semibold hover:bg-secondary-container/25 transition-colors"
                  >
                    22 Tháng 2 (Song Ngư)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate('14', '3')}
                    className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant transition-colors"
                  >
                    14 Tháng 3 (Einstein)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate('28', '10')}
                    className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant transition-colors"
                  >
                    28 Tháng 10 (Bill Gates)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate('19', '5')}
                    className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant transition-colors"
                  >
                    19 Tháng 5 (Bác Hồ)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BIRTHDAY CLUB DASHBOARD & STATISTICS (CLUB 22 THÁNG 2)                    */}
        {/* ========================================================================= */}
        <section className="w-full bg-background pt-20 pb-20">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex flex-col gap-16">
            {/* Club Banner Container with Sunset Warmth Backdrop */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary-container text-on-primary p-6 sm:p-10 shadow-xl">
              {/* Subtle Astral Constellation Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-bright via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">
                      stars
                    </span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
                      Báo Cáo Tổng Hợp Niên Biểu
                    </span>
                  </div>
                  <h2 className="font-headline-xl text-2xl sm:text-headline-xl font-bold tracking-tight text-white">
                    Câu lạc bộ {birthDay} tháng {birthMonth}
                  </h2>
                  <p className="font-body-md text-body-md text-primary-fixed max-w-xl mt-2 font-light">
                    Hội tụ những cá nhân kiệt xuất và những mốc son lịch sử chia sẻ cùng tọa độ thời gian này trong năm.
                  </p>
                </div>

                {/* Zodiac & Celestial Pill */}
                <div className="flex items-center gap-3 bg-surface-bright/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-surface-bright/20 self-start md:self-auto">
                  <span className="text-2xl">♓</span>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md font-bold text-white leading-none">
                      Song Ngư (Pisces)
                    </span>
                    <span className="font-label-sm text-label-sm text-surface-container-high mt-0.5">
                      Cung Nước • Trực giác & Bền bỉ
                    </span>
                  </div>
                </div>
              </div>

              {/* 6 Metrics Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-8">
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Tổng nhân vật</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">183</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Đã xác minh</span>
                </div>
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Nhà khoa học</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">12</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Phát minh & Nobel</span>
                </div>
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Nghệ sĩ & Âm nhạc</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">34</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Điện ảnh & Hội họa</span>
                </div>
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Chính khách</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">28</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Nguyên thủ & Lãnh tụ</span>
                </div>
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Thể thao</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">19</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Nhà vô địch thế giới</span>
                </div>
                <div className="bg-surface-bright/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 border border-surface-bright/10">
                  <span className="font-label-sm text-label-sm text-primary-fixed">Giải Nobel</span>
                  <span className="font-headline-lg text-headline-lg font-extrabold text-white">4</span>
                  <span className="font-label-sm text-[11px] text-surface-container-high">Hòa bình & Khoa học</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MAIN CONTENT: FILTER TABS & CELEBRITIES SHOWCASE                          */}
            {/* ========================================================================= */}
            <div className="flex flex-col gap-6">
              {/* Header row with Section Title & Geographical Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container-high pb-4">
                <div>
                  <h3 className="font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-bold">
                    Những nhân vật nổi bật nhất
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Danh nhân, nghệ sĩ và các nhà lãnh đạo sinh ngày {birthDay} tháng {birthMonth}
                  </p>
                </div>

                {/* Region Filter Pill Tabs (Tất cả, Việt Nam, Thế giới) */}
                <div className="flex items-center p-1 rounded-2xl bg-surface-container-low border border-surface-container-high self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveRegion('all')}
                    className={`px-4 py-1.5 rounded-xl font-label-md text-label-md transition-all ${
                      activeRegion === 'all'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRegion('vn')}
                    className={`px-4 py-1.5 rounded-xl font-label-md text-label-md transition-all ${
                      activeRegion === 'vn'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Việt Nam
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRegion('world')}
                    className={`px-4 py-1.5 rounded-xl font-label-md text-label-md transition-all ${
                      activeRegion === 'world'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Thế giới
                  </button>
                </div>
              </div>

              {/* Category Chip Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: 'all', label: 'Tất cả lĩnh vực' },
                  { id: 'politics', label: 'Chính trị & Lãnh đạo' },
                  { id: 'science', label: 'Khoa học & Công nghệ' },
                  { id: 'music', label: 'Âm nhạc & Nghệ thuật' },
                  { id: 'actor', label: 'Điện ảnh & Truyền thông' },
                  { id: 'sports', label: 'Thể thao' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${
                      activeCategory === cat.id
                        ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant border-surface-container-high hover:border-outline-variant hover:text-on-surface'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 6 Bespoke Luminaries Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLuminaries.map((person) => {
                  const saved = isFavorite(person.id);
                  const fullPerson = ALL_PEOPLE.find((p) => p.id === person.id) || {
                    id: person.id,
                    slug: person.slug,
                    name: person.name,
                    birthDate: '1732-02-22',
                    birthYear: 1732,
                    birthMonth: 2,
                    birthDay: 22,
                    occupation: [person.roleBadge],
                    category: person.category as any,
                    countryCode: person.region === 'vn' ? 'VN' : 'US',
                    countryName: person.region === 'vn' ? 'Việt Nam' : 'Quốc tế',
                    image: person.image,
                    shortDescription: person.description,
                    biography: person.description,
                  };

                  return (
                    <article
                      key={person.id}
                      className="group bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_24px_rgba(19,27,46,0.06)] hover:shadow-[0_16px_36px_rgba(79,70,229,0.12)] transition-all flex flex-col justify-between border border-surface-container-high/60"
                    >
                      <div>
                        {/* Image Frame */}
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-surface-container">
                          <img
                            alt={person.alt}
                            src={person.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Bookmark Action */}
                          <button
                            type="button"
                            aria-label="Lưu vào danh sách"
                            onClick={() => toggleFavorite(fullPerson as any)}
                            className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
                              saved
                                ? 'bg-secondary text-white'
                                : 'bg-surface-container-lowest/80 text-on-surface hover:bg-primary-container hover:text-on-primary-container'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {saved ? 'bookmark_added' : 'bookmark'}
                            </span>
                          </button>
                          {/* Lifespan Tag */}
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-label-sm font-semibold">
                            {person.lifespan}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-md font-label-sm text-label-sm font-bold ${person.badgeColor}`}>
                            {person.roleBadge}
                          </span>
                        </div>

                        {/* Title & Bio */}
                        <Link href={`/birthday/2/22/people?person=${person.slug}`}>
                          <h4 className="font-title-md text-title-md text-on-surface font-bold group-hover:text-primary transition-colors cursor-pointer">
                            {person.name}
                          </h4>
                        </Link>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2">
                          {person.description}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant border-t border-surface-container-high/40">
                        <span className="font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            {person.verifiedIcon}
                          </span>
                          {person.verifiedLabel}
                        </span>
                        <Link
                          href={`/birthday/2/22/people?person=${person.slug}`}
                          className="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-0.5 font-bold"
                        >
                          Chi tiết
                          <span className="material-symbols-outlined text-[16px]">
                            chevron_right
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* View More CTA */}
              <div className="flex justify-center pt-6">
                <Link
                  href="/birthday/2/22/people"
                  className="px-8 py-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold transition-all flex items-center gap-2 shadow-sm border border-surface-container-high"
                >
                  <span>Xem toàn bộ 183 nhân vật sinh ngày 22 tháng 2</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: HISTORICAL EVENTS ON THIS DAY (TIMELINE BENTO)                   */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Timeline Events (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    history_edu
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Sự kiện lịch sử đáng nhớ
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Event 1 */}
                  <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container shrink-0">
                      <span className="font-label-sm text-label-sm font-semibold">Năm</span>
                      <span className="font-title-md text-title-md font-extrabold leading-none">1495</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-title-md text-title-md text-on-surface font-bold">
                        Vasco da Gama đến Ấn Độ
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Đội tàu thám hiểm của nhà hàng hải Vasco da Gama tiến vào vùng biển Nam Á, mở ra tuyến hàng hải trực tiếp từ châu Âu sang phương Đông.
                      </p>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container shrink-0">
                      <span className="font-label-sm text-label-sm font-semibold">Năm</span>
                      <span className="font-title-md text-title-md font-extrabold leading-none">1819</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-title-md text-title-md text-on-surface font-bold">
                        Hiệp ước Adams–Onís
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tây Ban Nha chính thức ký kết chuyển giao toàn bộ vùng lãnh thổ Florida cho Hợp chúng quốc Hoa Kỳ.
                      </p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-highest text-primary shrink-0">
                      <span className="font-label-sm text-label-sm font-semibold">Năm</span>
                      <span className="font-title-md text-title-md font-extrabold leading-none">1980</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-title-md text-title-md text-on-surface font-bold">
                        Phép màu trên băng (Miracle on Ice)
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Đội tuyển khúc côn cầu sinh viên Mỹ đánh bại tuyển Liên Xô hùng mạnh tại Thế vận hội Mùa đông Lake Placid.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/day/2/22"
                  className="font-label-md text-label-md text-primary font-bold flex items-center gap-1 hover:underline mt-1"
                >
                  <span>Khám phá toàn bộ dòng thời gian lịch sử 22 tháng 2</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Right: Social Birthday Share Card Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    share
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Thẻ kỷ niệm Astral
                  </h3>
                </div>

                {/* Virtual Shareable Canvas Card Preview */}
                <div className="w-full rounded-3xl bg-gradient-to-br from-on-surface via-primary to-secondary p-6 text-on-primary shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                  {/* Subtle constellation decor */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-20 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:12px_12px]" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img
                          alt="Logo"
                          className="h-6 w-auto object-contain brightness-0 invert"
                          src="/logo.png"
                        />
                        <span className="font-label-sm text-label-sm tracking-widest uppercase text-primary-fixed">
                          BirthdayVerse
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-surface-bright/20 backdrop-blur-md text-surface-bright font-label-sm text-label-sm">
                        22 Tháng 2
                      </span>
                    </div>

                    <h4 className="font-headline-md text-headline-md font-bold text-white leading-snug">
                      Vũ Trụ Của Tôi
                    </h4>
                    <p className="font-body-sm text-body-sm text-primary-fixed mt-1">
                      Tôi chia sẻ ngày sinh cùng George Washington, Arthur Schopenhauer và Drew Barrymore.
                    </p>
                  </div>

                  {/* Mini Avatars Stack */}
                  <div className="my-6 flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <img
                        alt="Washington"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-bright"
                        src="/people/george-washington.png"
                      />
                      <img
                        alt="Arthur Schopenhauer"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-bright"
                        src="/people/arthur-schopenhauer.png"
                      />
                      <img
                        alt="Drew Barrymore"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-bright"
                        src="/people/drew-barrymore.png"
                      />
                    </div>
                    <span className="font-label-sm text-label-sm text-surface-bright/80">
                      và hơn 180 nhân vật khác
                    </span>
                  </div>

                  {/* Card Footer inside preview */}
                  <div className="pt-4 border-t border-surface-bright/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-primary-fixed">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      <span>Song Ngư • Pisces</span>
                    </div>
                    <span className="font-label-sm text-[10px] text-surface-bright/60">
                      birthdayverse.me
                    </span>
                  </div>
                </div>

                {/* Share Actions */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <Link
                    href="/share/2-22"
                    className="py-3 px-4 rounded-2xl bg-primary text-on-primary font-label-md text-label-md font-bold text-center hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">brush</span>
                    Tạo thẻ chia sẻ
                  </Link>
                  <Link
                    href="/share/2-22"
                    className="py-3 px-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold text-center transition-colors flex items-center justify-center gap-1.5 border border-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Lưu ảnh (PNG)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

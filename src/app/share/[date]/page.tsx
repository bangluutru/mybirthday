'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { AppShell } from '@/components/layout/AppShell';

interface FigureOption {
  id: string;
  name: string;
  role: string;
  image: string;
  birthYear: number;
}

export default function BirthdayCardStudioPage() {
  const params = useParams();
  const router = useRouter();

  // date param like "2-22" or "22-02"
  const dateStr = (params.date as string) || '2-22';
  const parts = dateStr.split('-');
  const paramMonth = parseInt(parts[0], 10) <= 12 ? parseInt(parts[0], 10) : parseInt(parts[1], 10) || 2;
  const paramDay = parseInt(parts[0], 10) > 12 ? parseInt(parts[0], 10) : parseInt(parts[1], 10) || 22;

  // Studio States
  const [activeTheme, setActiveTheme] = useState<'cosmic' | 'royal' | 'minimal' | 'pop'>('cosmic');
  const [activeRatio, setActiveRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [userName, setUserName] = useState('Bạn');
  const [displayDate, setDisplayDate] = useState(`${paramDay} Tháng ${paramMonth}`);
  const [customQuote, setCustomQuote] = useState('Ngày bạn sinh ra có một vũ trụ riêng. Cùng ngày sinh với những con người đặc biệt làm nên lịch sử.');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Available figures to select
  const availableFigures: FigureOption[] = [
    {
      id: 'george-washington',
      name: 'George Washington',
      role: 'Tổng thống đầu tiên của Hoa Kỳ (1732)',
      image: '/people/george-washington.png',
      birthYear: 1732,
    },
    {
      id: 'steve-irwin',
      name: 'Steve Irwin',
      role: 'Nhà bảo tồn hoang dã vĩ đại (1962)',
      image: '/people/steve-irwin.png',
      birthYear: 1962,
    },
    {
      id: 'drew-barrymore',
      name: 'Drew Barrymore',
      role: 'Minh tinh Hollywood & Đạo diễn (1975)',
      image: '/people/drew-barrymore.png',
      birthYear: 1975,
    },
    {
      id: 'arthur-schopenhauer',
      name: 'Arthur Schopenhauer',
      role: 'Triết gia vĩ đại thế kỷ 19 (1788)',
      image: '/people/arthur-schopenhauer.png',
      birthYear: 1788,
    },
    {
      id: 'heinrich-hertz',
      name: 'Heinrich Hertz',
      role: 'Nhà vật lý tìm ra sóng điện từ (1857)',
      image: '/people/heinrich-hertz.png',
      birthYear: 1857,
    },
    {
      id: 'niki-lauda',
      name: 'Niki Lauda',
      role: 'Huyền thoại 3 lần vô địch đua xe F1 (1949)',
      image: '/people/niki-lauda.png',
      birthYear: 1949,
    },
  ];

  const [selectedFigureIds, setSelectedFigureIds] = useState<string[]>([
    'george-washington',
    'steve-irwin',
    'drew-barrymore',
    'arthur-schopenhauer',
  ]);

  const toggleFigure = (id: string) => {
    setSelectedFigureIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 5) return prev; // maximum 5
        return [...prev, id];
      }
    });
  };

  // Export to PNG function
  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `birthdayverse-${paramDay}-${paramMonth}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating card image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Card Theme Style Configurations
  const themeStyles = {
    cosmic: {
      bg: 'bg-gradient-to-br from-[#070a13] via-[#1b1744] to-[#4338ca] text-white',
      border: 'border-indigo-500/30',
      tagBg: 'bg-surface-bright/15 text-primary-fixed',
      accent: 'text-tertiary-fixed-dim',
      footerBorder: 'border-white/15',
      nameColor: 'text-white',
    },
    royal: {
      bg: 'bg-gradient-to-br from-[#1a120b] via-[#3d2314] to-[#78350f] text-amber-50',
      border: 'border-amber-500/30',
      tagBg: 'bg-amber-400/20 text-amber-200',
      accent: 'text-amber-300',
      footerBorder: 'border-amber-400/20',
      nameColor: 'text-amber-100',
    },
    minimal: {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white',
      border: 'border-slate-700/60',
      tagBg: 'bg-white/10 text-slate-200',
      accent: 'text-slate-300',
      footerBorder: 'border-slate-700',
      nameColor: 'text-white',
    },
    pop: {
      bg: 'bg-gradient-to-br from-[#4f46e5] via-[#8455ef] to-[#ff385c] text-white',
      border: 'border-white/30',
      tagBg: 'bg-white/20 text-white font-bold',
      accent: 'text-yellow-200',
      footerBorder: 'border-white/20',
      nameColor: 'text-white',
    },
  };

  const selectedThemeStyle = themeStyles[activeTheme];

  const selectedFiguresList = availableFigures.filter((f) =>
    selectedFigureIds.includes(f.id)
  );

  return (
    <AppShell>
      <div className="flex flex-col w-full pt-20">
        {/* Subtle decorative ambient orbs */}
        <div className="relative w-full overflow-hidden pb-space-xl">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-40 right-10 w-[420px] h-[420px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop pt-space-lg">
            {/* Studio Header Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl pb-4 border-b border-surface-container-high/60">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span className="tracking-wide uppercase">Astral Creator Studio</span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-on-surface-variant font-medium">Bản phát hành chính thức 2026</span>
                </div>
                <h1 className="font-display-hero text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                  Tạo &amp; Tùy Biến Thẻ Chia Sẻ
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant font-light">
                  Thiết kế thẻ kỷ niệm sinh nhật độc bản của bạn cùng các danh nhân chia sẻ cùng ngày sinh.
                </p>
              </div>

              {/* Quick Top Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExporting}
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isExporting ? 'hourglass_empty' : 'download'}
                  </span>
                  <span>{isExporting ? 'Đang tạo ảnh...' : 'Tải Thẻ (PNG)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedLink ? 'check' : 'link'}
                  </span>
                  <span>{copiedLink ? 'Đã chép link!' : 'Sao chép link'}</span>
                </button>
              </div>
            </div>

            {/* Main Studio 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
              {/* ================= LEFT COLUMN: CUSTOMIZATION CONTROLS (7 Cols) ================= */}
              <div className="lg:col-span-7 flex flex-col gap-space-xl">
                {/* Section 1: Themes & Visual Styles */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/80 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                        1
                      </span>
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface font-bold">
                          Phong cách thẩm mỹ (Theme Style)
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Chọn tông màu và không gian thị giác phản ánh cá tính của bạn
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                      4 Lựa chọn
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                    {/* Style 1: Cosmic Galaxy */}
                    <button
                      type="button"
                      onClick={() => setActiveTheme('cosmic')}
                      className={`group text-left p-3.5 rounded-2xl flex flex-col gap-2 transition-all ${
                        activeTheme === 'cosmic'
                          ? 'bg-surface-container-high ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-full h-12 rounded-xl bg-gradient-to-tr from-[#0b0f19] via-[#1e1b4b] to-[#4338ca] flex items-center justify-center text-white shadow-inner">
                        <span className="material-symbols-outlined text-[20px] text-secondary-fixed-dim">
                          nights_stay
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Cosmic Galaxy
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Huyền ảo vô cực
                        </span>
                      </div>
                    </button>

                    {/* Style 2: Royal Heritage */}
                    <button
                      type="button"
                      onClick={() => setActiveTheme('royal')}
                      className={`group text-left p-3.5 rounded-2xl flex flex-col gap-2 transition-all ${
                        activeTheme === 'royal'
                          ? 'bg-surface-container-high ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-full h-12 rounded-xl bg-gradient-to-tr from-[#2d1b08] via-[#4a2e12] to-[#78350f] flex items-center justify-center text-amber-200 shadow-inner">
                        <span className="material-symbols-outlined text-[20px]">castle</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Hoàng gia Di sản
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Trầm ấm kinh điển
                        </span>
                      </div>
                    </button>

                    {/* Style 3: Minimalist */}
                    <button
                      type="button"
                      onClick={() => setActiveTheme('minimal')}
                      className={`group text-left p-3.5 rounded-2xl flex flex-col gap-2 transition-all ${
                        activeTheme === 'minimal'
                          ? 'bg-surface-container-high ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-full h-12 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-slate-200 shadow-inner">
                        <span className="material-symbols-outlined text-[20px]">view_quilt</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Minimal Editorial
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Thanh lịch tối giản
                        </span>
                      </div>
                    </button>

                    {/* Style 4: Modern Pop Art */}
                    <button
                      type="button"
                      onClick={() => setActiveTheme('pop')}
                      className={`group text-left p-3.5 rounded-2xl flex flex-col gap-2 transition-all ${
                        activeTheme === 'pop'
                          ? 'bg-surface-container-high ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-full h-12 rounded-xl bg-gradient-to-tr from-[#ff385c] via-[#8455ef] to-[#005cc6] flex items-center justify-center text-white shadow-inner">
                        <span className="material-symbols-outlined text-[20px]">palette</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Modern Pop Art
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Sôi nổi rực rỡ
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section 2: Person Name, Date & Custom Message */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/80 flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                      2
                    </span>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        Thông tin nhân vật &amp; Thông điệp
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tùy biến tên hiển thị, ngày kỷ niệm và câu tuyên ngôn truyền cảm hứng
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-md">
                    <div className="sm:col-span-7 flex flex-col gap-1.5">
                      <label htmlFor="userNameInput" className="font-label-md text-label-md text-on-surface font-semibold">
                        Tên của bạn
                      </label>
                      <input
                        id="userNameInput"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="VD: Hải Băng, Minh Quân..."
                        className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-5 flex flex-col gap-1.5">
                      <label htmlFor="dateDisplayInput" className="font-label-md text-label-md text-on-surface font-semibold">
                        Ngày sinh hiển thị
                      </label>
                      <input
                        id="dateDisplayInput"
                        type="text"
                        value={displayDate}
                        onChange={(e) => setDisplayDate(e.target.value)}
                        placeholder="22 Tháng 2"
                        className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-12 flex flex-col gap-1.5">
                      <label htmlFor="quoteInput" className="font-label-md text-label-md text-on-surface font-semibold">
                        Thông điệp chia sẻ
                      </label>
                      <textarea
                        id="quoteInput"
                        rows={2}
                        value={customQuote}
                        onChange={(e) => setCustomQuote(e.target.value)}
                        className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Select Historical Figures */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/80 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                        3
                      </span>
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface font-bold">
                          Nhân vật biểu tượng xuất hiện trên thẻ
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Chọn tối đa 4-5 danh nhân đại diện cùng sinh ngày {paramDay} tháng {paramMonth}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                      {selectedFigureIds.length} / {availableFigures.length} đã chọn
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                    {availableFigures.map((fig) => {
                      const isSelected = selectedFigureIds.includes(fig.id);
                      return (
                        <label
                          key={fig.id}
                          className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-surface-container-high border-primary/40 shadow-sm'
                              : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-space-sm min-w-0">
                            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shrink-0 ring-1 ring-outline-variant/30">
                              <img
                                alt={fig.name}
                                src={fig.image}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                                {fig.name}
                              </span>
                              <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                                {fig.role}
                              </span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFigure(fig.id)}
                            className="rounded text-primary w-5 h-5 accent-primary cursor-pointer shrink-0 ml-2"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Export Ratio & Output Format */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/80 flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                      4
                    </span>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        Tỉ lệ khung hình (Aspect Ratio)
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tối ưu kích thước chuẩn cho các nền tảng mạng xã hội phổ biến
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-space-sm">
                    <button
                      type="button"
                      onClick={() => setActiveRatio('1:1')}
                      className={`p-3.5 rounded-2xl text-left flex flex-col items-center sm:items-start gap-2 transition-all border ${
                        activeRatio === '1:1'
                          ? 'bg-surface-container-high border-primary ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center shadow-sm">
                        <div className="w-5 h-5 rounded-sm bg-primary/80" />
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-bold block">
                          Vuông 1:1
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Instagram / Facebook
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRatio('9:16')}
                      className={`p-3.5 rounded-2xl text-left flex flex-col items-center sm:items-start gap-2 transition-all border ${
                        activeRatio === '9:16'
                          ? 'bg-surface-container-high border-primary ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center shadow-sm">
                        <div className="w-3.5 h-6 rounded-sm bg-primary/80" />
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-bold block">
                          Story 9:16
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          TikTok, Reels, Story
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRatio('16:9')}
                      className={`p-3.5 rounded-2xl text-left flex flex-col items-center sm:items-start gap-2 transition-all border ${
                        activeRatio === '16:9'
                          ? 'bg-surface-container-high border-primary ring-2 ring-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center shadow-sm">
                        <div className="w-6 h-3.5 rounded-sm bg-primary/80" />
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-bold block">
                          Banner 16:9
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Facebook Cover / Twitter
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT COLUMN: LIVE PREVIEW CANVAS (5 Cols) ================= */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Bản Xem Trước Trực Tiếp
                  </h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {activeRatio} • {activeTheme.toUpperCase()}
                  </span>
                </div>

                {/* THE RENDERED CANVAS CONTAINER */}
                <div className="w-full flex items-center justify-center p-2 rounded-3xl bg-surface-container-high/50 border border-surface-container-high">
                  <div
                    ref={cardRef}
                    className={`w-full ${
                      activeRatio === '1:1'
                        ? 'aspect-square'
                        : activeRatio === '9:16'
                        ? 'aspect-[9/16]'
                        : 'aspect-[16/9]'
                    } rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all ${
                      selectedThemeStyle.bg
                    } border ${selectedThemeStyle.border}`}
                  >
                    {/* Background star sprinkles */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    {/* Top Card Header */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          alt="Logo"
                          className="h-6 w-auto object-contain brightness-0 invert"
                          src="/logo.png"
                        />
                        <span className="font-label-sm text-xs tracking-widest uppercase font-bold text-white/90">
                          BirthdayVerse
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${selectedThemeStyle.tagBg}`}>
                        {displayDate}
                      </span>
                    </div>

                    {/* Center Content */}
                    <div className="relative z-10 flex flex-col my-auto py-4">
                      <span className="text-xs uppercase tracking-widest font-bold text-white/70">
                        Sinh nhật của {userName || 'Bạn'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
                        Vũ Trụ Cùng Ngày Sinh
                      </h2>
                      <p className="text-xs sm:text-sm text-white/90 mt-2 font-light leading-relaxed max-w-sm">
                        {customQuote}
                      </p>

                      {/* Luminaries Portraits Stack in Preview */}
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {selectedFiguresList.slice(0, 4).map((f) => (
                            <img
                              key={f.id}
                              alt={f.name}
                              src={f.image}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/90 shadow-md"
                            />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">
                            {selectedFiguresList.map((f) => f.name.split(' ').pop()).join(', ')}
                          </span>
                          <span className="text-[11px] text-white/70">
                            và hơn 180 nhân vật lịch sử
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Card Footer */}
                    <div className={`relative z-10 pt-3 border-t ${selectedThemeStyle.footerBorder} flex items-center justify-between text-xs`}>
                      <div className="flex items-center gap-1.5 font-semibold text-white/80">
                        <span className="material-symbols-outlined text-[15px]">stars</span>
                        <span>Song Ngư (Pisces)</span>
                      </div>
                      <span className="text-[11px] text-white/60 font-medium">
                        birthdayverse.me
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Share & Download Buttons matching 09_share_card.png */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={isExporting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-title-md text-title-md font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isExporting ? 'hourglass_empty' : 'download'}
                    </span>
                    <span>{isExporting ? 'Đang tạo thẻ chất lượng cao...' : 'Tải Thẻ (PNG - Độ Phân Giải Cao)'}</span>
                  </button>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-[16px] text-blue-600">share</span>
                      <span>Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">link</span>
                      <span>{copiedLink ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'BirthdayVerse',
                            text: 'Khám phá những người đặc biệt sinh cùng ngày với tôi!',
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          handleCopyLink();
                        }
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                      <span>Khác</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

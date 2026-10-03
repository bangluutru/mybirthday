'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';

interface AppShellProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  showBottomNav?: boolean;
  hideDesktopHeader?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  hideHeader = false,
  hideFooter = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [searchDate, setSearchDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Random Date Navigator
  const handleRandomDate = () => {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][randomMonth - 1];
    const randomDay = Math.floor(Math.random() * maxDays) + 1;
    router.push(`/birthday/${randomMonth}/${randomDay}`);
  };

  // Quick Search by Date (e.g. "25/10" or "22/2" or "22-02")
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDate.trim()) return;

    const parts = searchDate.trim().split(/[\/\-\.\s]+/);
    if (parts.length >= 2) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
        router.push(`/birthday/${m}/${d}`);
        setSearchDate('');
        return;
      }
    }
    // Fallback to searching 22 Feb
    router.push(`/birthday/2/22`);
    setSearchDate('');
  };

  const navLinks = [
    { label: 'Tổng quan', href: '/' },
    { label: 'Danh sách nhân vật', href: '/birthday/2/22/people' },
    { label: 'Sự kiện lịch sử', href: '/day/2/22' },
    { label: 'Thẻ chia sẻ', href: '/share/2-22' },
  ];

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Fixed Astral Header */}
      {!hideHeader && (
        <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(19,27,46,0.05)] border-b border-surface-container-high/60">
          <div className="h-20 max-w-[1360px] mx-auto px-4 md:px-8 lg:px-margin-desktop flex items-center justify-between gap-space-md lg:gap-space-lg">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-space-sm sm:gap-space-md shrink-0 group">
              <img
                alt="BirthdayVerse Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="/logo.png"
              />
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-primary leading-none font-bold">
                  BirthdayVerse
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium tracking-normal mt-0.5">
                  Khám phá người cùng ngày sinh
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-space-xs shrink-0">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-space-md py-space-sm font-label-md text-label-md rounded-xl transition-all ${
                      isActive
                        ? 'text-primary font-bold bg-surface-container-low shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center bg-surface-container-low rounded-full px-space-md py-1.5 gap-space-xs border border-transparent focus-within:border-primary/40 focus-within:bg-surface-container-lowest transition-all"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                calendar_month
              </span>
              <input
                type="text"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant w-44 focus:ring-0"
                placeholder="Ngày / Tháng (VD: 22/2)..."
              />
            </form>

            {/* Actions Bar */}
            <div className="flex items-center gap-space-sm shrink-0">
              {/* Random Button */}
              <button
                type="button"
                onClick={handleRandomDate}
                className="flex items-center gap-1.5 px-3 sm:px-space-md py-2 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all font-label-md text-label-md shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  auto_awesome
                </span>
                <span className="hidden sm:inline">Ngày ngẫu nhiên</span>
              </button>

              {/* Bookmark Button */}
              <Link
                href="/favorites"
                aria-label="Yêu thích"
                className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">
                  bookmark
                </span>
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center scale-90 font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <div className="hidden sm:flex items-center pl-space-xs">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container"
                  src="/people/george-washington.png"
                />
              </div>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
                aria-label="Menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="xl:hidden border-t border-surface-container-high/80 bg-surface/98 backdrop-blur-2xl px-4 py-3 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 gap-2 my-1">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_month</span>
                <input
                  type="text"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Tra cứu ngày / tháng (VD: 22/2)..."
                  className="bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant outline-none w-full"
                />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl font-label-md text-label-md flex items-center justify-between ${
                    pathname === link.href
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {/* Modern Astral Footer */}
      {!hideFooter && (
        <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(19,27,46,0.03)] pt-space-xl pb-space-lg border-t border-surface-container-high/50">
          <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl">
              <div className="lg:col-span-2 flex flex-col gap-space-md pr-space-md">
                <div className="flex items-center gap-space-sm">
                  <img
                    alt="BirthdayVerse Logo"
                    className="h-8 w-auto object-contain"
                    src="/logo.png"
                  />
                  <span className="font-title-md text-title-md text-primary font-bold">
                    BirthdayVerse
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                  Vũ trụ kết nối thời gian và nhân loại. Khám phá những danh nhân, nghệ sĩ lỗi lạc, nhà khoa học kiệt xuất và các sự kiện vĩ đại chia sẻ cùng thời khắc sinh nhật với bạn.
                </p>
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <a
                    aria-label="Chia sẻ vũ trụ"
                    className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-colors"
                    href="/"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      public
                    </span>
                  </a>
                  <a
                    aria-label="Cộng đồng học thuật"
                    className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-colors"
                    href="/birthday/2/22/people"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      group
                    </span>
                  </a>
                  <a
                    aria-label="Kho lưu trữ thiên văn"
                    className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-colors"
                    href="/day/2/22"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      star
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Khám Phá Theo Tháng
                </h3>
                <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22">
                      Tháng 1 - Tháng 3 (Mùa Xuân)
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/4/30">
                      Tháng 4 - Tháng 6 (Mùa Hạ)
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/8/15">
                      Tháng 7 - Tháng 9 (Mùa Thu)
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/10/25">
                      Tháng 10 - Tháng 12 (Mùa Đông)
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/day/2/22">
                      Lịch thiên văn ngày sinh
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Lĩnh Vực Phổ Biến
                </h3>
                <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22/people">
                      Khoa học &amp; Thiên văn
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22/people">
                      Nghệ thuật &amp; Âm nhạc
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22/people">
                      Triết học &amp; Lịch sử
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22/people">
                      Lãnh tụ &amp; Chính trị gia
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/birthday/2/22/people">
                      Văn học &amp; Thi ca
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Dịch Vụ &amp; Trải Nghiệm
                </h3>
                <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/share/2-22">
                      Tạo thiệp sinh nhật Astral
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/day/2/22">
                      Bản đồ sao cá nhân
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/exact/2-22">
                      Cùng ngày cùng năm sinh
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/day/2/22">
                      Bộ dữ liệu niên biểu
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary transition-colors" href="/favorites">
                      Danh sách đã lưu
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-space-lg border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <p>
                © {new Date().getFullYear()} BirthdayVerse. Sinh Nhật Cùng Ai. Nền tảng khám phá niên biểu &amp; nhân vật lịch sử.
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Designed with Astral Editorial Minimal
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BottomNav } from '../navigation/BottomNav';
import { Sparkles, Bookmark, Smartphone, Monitor } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  hideDesktopHeader?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  showBottomNav = true,
  hideDesktopHeader = false,
}) => {
  const pathname = usePathname();
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'editorial'>('mobile');

  const isHome = pathname === '/';

  return (
    <div
      className={`min-h-screen ${
        isHome ? 'bg-[#070a13]' : 'bg-slate-50'
      } md:bg-slate-950 text-slate-900 flex flex-col items-center justify-start antialiased selection:bg-brand-500 selection:text-white`}
    >
      {/* Desktop Top Editorial Header */}
      {!hideDesktopHeader && (
        <header className="hidden md:flex w-full max-w-6xl items-center justify-between py-4 px-6 border-b border-slate-800 text-white z-40 bg-slate-950/80 backdrop-blur-md sticky top-0">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                Birthday Universe
              </span>
              <span className="text-[10px] block text-slate-400 uppercase tracking-widest font-semibold">
                Celebrity & History Explorer
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-brand-400 ${
                pathname === '/' ? 'text-brand-400 font-bold' : 'text-slate-300'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/birthday/2/22"
              className={`transition-colors hover:text-brand-400 ${
                pathname.startsWith('/birthday') ? 'text-brand-400 font-bold' : 'text-slate-300'
              }`}
            >
              22 Tháng 2
            </Link>
            <Link
              href="/today"
              className={`transition-colors hover:text-brand-400 ${
                pathname.startsWith('/today') ? 'text-brand-400 font-bold' : 'text-slate-300'
              }`}
            >
              Hôm nay
            </Link>
            <Link
              href="/favorites"
              className={`flex items-center space-x-1.5 transition-colors hover:text-brand-400 ${
                pathname === '/favorites' ? 'text-brand-400 font-bold' : 'text-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Yêu thích</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center space-x-1 text-xs text-slate-400">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-brand-600 text-white font-medium shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Xem theo khung chuẩn Mobile (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDeviceMode('editorial')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
                  deviceMode === 'editorial'
                    ? 'bg-brand-600 text-white font-medium shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Xem giao diện mở rộng Editorial (Desktop)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Rộng</span>
              </button>
            </div>

            <Link
              href="/birthday"
              className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/40"
            >
              Chọn ngày khác
            </Link>
          </div>
        </header>
      )}

      {/* Main Content Container */}
      <main
        className={`w-full transition-all duration-300 ${
          deviceMode === 'mobile'
            ? 'w-full max-w-full md:max-w-[430px] my-0 md:my-6 md:rounded-[44px] md:shadow-[0_25px_70px_rgba(0,0,0,0.6)] md:border-[10px] md:border-slate-800/90 overflow-hidden'
            : 'w-full max-w-5xl my-0 md:my-8 md:rounded-3xl md:shadow-2xl overflow-hidden'
        } ${isHome ? 'bg-[#070a13]' : 'bg-slate-50'} min-h-screen md:min-h-[844px] relative flex flex-col`}
      >
        {children}

        {/* Mobile Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </main>
    </div>
  );
};

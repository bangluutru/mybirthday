'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, Settings } from 'lucide-react';
import { vi } from '@/messages/vi';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: vi.nav.home,
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: vi.nav.explore,
      href: '/today',
      icon: Compass,
      isActive: pathname.startsWith('/today') || pathname.startsWith('/birthday') || pathname.startsWith('/day'),
    },
    {
      label: vi.nav.favorites,
      href: '/favorites',
      icon: Bookmark,
      isActive: pathname === '/favorites',
    },
    {
      label: vi.nav.settings,
      href: '/settings',
      icon: Settings,
      isActive: pathname === '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] max-w-md mx-auto md:max-w-xl lg:max-w-2xl">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors duration-200 ${
                active ? 'text-brand-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                {active && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-600 rounded-full" />
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

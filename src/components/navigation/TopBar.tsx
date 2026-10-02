'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Search, Bookmark } from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  dark?: boolean;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  transparent = false,
  dark = false,
  className = '',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 h-14 transition-colors ${
        transparent
          ? 'bg-transparent'
          : dark
          ? 'bg-cosmic-950/80 backdrop-blur-md text-white border-b border-slate-800/40'
          : 'bg-white/90 backdrop-blur-md text-slate-900 border-b border-slate-100'
      } ${className}`}
    >
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={handleBack}
            className={`p-2 rounded-full transition-all duration-150 active:scale-90 ${
              dark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : transparent
                ? 'bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {title && (
          <div className="flex flex-col">
            <h1
              className={`text-base font-bold tracking-tight line-clamp-1 ${
                dark || transparent ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h1>
            {subtitle && (
              <span
                className={`text-xs ${
                  dark || transparent ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {rightAction}
      </div>
    </header>
  );
};

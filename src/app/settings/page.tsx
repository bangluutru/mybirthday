'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { Globe, Shield, Trash2, Info, Sparkles, Moon, Smartphone } from 'lucide-react';
import { vi } from '@/messages/vi';

export default function SettingsPage() {
  const handleClearFavorites = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả nhân vật đã lưu không?')) {
      localStorage.removeItem('birthday_verse_favorites_v1');
      window.location.reload();
    }
  };

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24 text-slate-900">
        <TopBar title={vi.nav.settings} showBack={true} />

        <div className="p-4 space-y-5">
          {/* App Branding Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight">
                Your Birthday Universe
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Phiên bản 1.0.0 (PWA Ready)
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-900">
              <Globe className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Ngôn ngữ giao diện
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 px-3 rounded-xl bg-brand-50 border border-brand-300 text-brand-700 font-semibold text-xs text-center shadow-xs">
                🇻🇳 Tiếng Việt
              </button>
              <button
                disabled
                className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs text-center cursor-not-allowed opacity-75"
              >
                🇺🇸 English
              </button>
              <button
                disabled
                className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs text-center cursor-not-allowed opacity-75"
              >
                🇯🇵 日本語
              </button>
            </div>
          </div>

          {/* Storage & Privacy */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-900">
              <Shield className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Dữ liệu & Quyền riêng tư
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mọi dữ liệu yêu thích và tùy chọn ngày sinh được lưu trữ cục bộ trên thiết bị của bạn (Local Storage), hoàn toàn không thu thập thông tin cá nhân.
            </p>
            <button
              onClick={handleClearFavorites}
              className="w-full py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa danh sách yêu thích</span>
            </button>
          </div>

          {/* About & Credits */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-900">
              <Info className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Về ứng dụng
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Birthday Universe được xây dựng để mang đến trải nghiệm khám phá ngày sinh đầy cảm xúc, vinh danh các nhân vật lịch sử, khoa học, nghệ thuật và những sự kiện nhân loại trên thế giới.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

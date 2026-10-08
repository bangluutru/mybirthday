'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { AppShell } from '@/components/layout/AppShell';
import { getLifespanLabel } from '@/data/types';

export default function FavoritesPage() {
  const { favorites, isLoaded, toggleFavorite } = useFavorites();

  return (
    <AppShell>
      <div className="flex flex-col w-full pt-20 min-h-screen">
        <div className="w-full bg-surface-container-low/70 py-space-sm border-b border-surface-container">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold">Danh sách đã lưu</span>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-space-xl flex-1 flex flex-col w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-surface-container-high/60">
            <div>
              <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-bold mb-1">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                <span>Bộ sưu tập cá nhân</span>
              </div>
              <h1 className="font-display-hero text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Những Nhân Vật Bạn Đã Lưu
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-light">
                Danh sách các danh nhân, nghệ sĩ và sự kiện bạn quan tâm để dễ dàng tra cứu lại bất cứ lúc nào.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-primary-fixed/50 text-primary font-label-md text-label-md font-bold self-start md:self-auto">
              {favorites.length} Nhân vật đã lưu
            </span>
          </div>

          {!isLoaded ? (
            <div className="py-24 text-center text-on-surface-variant text-sm">
              Đang tải danh sách nhân vật...
            </div>
          ) : favorites.length === 0 ? (
            <div className="my-auto py-20 px-6 text-center flex flex-col items-center gap-4 bg-surface-container-low/40 rounded-3xl border border-surface-container-high/60 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
              </div>
              <div className="flex flex-col gap-1 max-w-xs">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Chưa có nhân vật nào được lưu
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Nhấn vào biểu tượng bookmark trên thẻ bất kỳ để lưu lại nhân vật bạn yêu thích vào danh sách này.
                </p>
              </div>
              <Link
                href="/birthday/2/22/people"
                className="mt-2 px-6 py-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span>Khám Phá Nhân Vật Ngay</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((person) => (
                <div
                  key={person.id}
                  className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-surface-container">
                      <img
                        alt={person.name}
                        src={person.image}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(person)}
                        title="Bỏ lưu"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                      </button>
                      <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-xs font-semibold">
                        {getLifespanLabel(person)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-label-sm text-xs px-2 py-0.5 rounded bg-surface-container text-primary font-bold">
                        {person.countryName}
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      {person.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                      {person.shortDescription || person.biography}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-xs">
                    <Link
                      href={`/birthday/${person.birthMonth}/${person.birthDay}/people?person=${person.slug}`}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Xem chi tiết hồ sơ</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                    <span className="text-on-surface-variant">
                      {person.birthDay}/{person.birthMonth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

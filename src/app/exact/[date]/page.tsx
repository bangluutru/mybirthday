'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getExactSameDatePeople, getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { getLifespanLabel } from '@/data/types';

export default function ExactSameDatePage() {
  const params = useParams();

  // date param can be "22-02-1981" or "22-2-1981"
  const dateStr = (params.date as string) || '22-2-1974';
  const parts = dateStr.split('-');
  const day = parseInt(parts[0], 10) || 22;
  const month = parseInt(parts[1], 10) || 2;
  const year = parseInt(parts[2], 10) || 1974;

  const formattedDate = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;

  const { exact, sameYearOther } = getExactSameDatePeople(month, day, year);
  const birthdayData = getBirthdayData(month, day);

  const displayPeers = exact;

  return (
    <AppShell>
      <div className="flex flex-col w-full pt-20 min-h-screen">
        <div className="w-full bg-surface-container-low/70 py-space-sm border-b border-surface-container">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href={`/birthday/${month}/${day}`} className="hover:text-primary transition-colors">
              {day} Tháng {month}
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold">Cùng ngày, cùng năm sinh</span>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-space-xl flex-1 flex flex-col w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-surface-container-high/60">
            <div>
              <div className="flex items-center gap-2 text-secondary font-label-md text-label-md font-bold mb-1">
                <span className="material-symbols-outlined text-[20px]">stars</span>
                <span>Khám phá sinh nhật tuyệt đối</span>
              </div>
              <h1 className="font-display-hero text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Sinh Đúng Ngày {formattedDate}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-light">
                Những nhân vật chia sẻ cùng một ngày tháng năm sinh chính xác với bạn trên khắp thế giới.
              </p>
            </div>
            <Link
              href={`/share/${day}-${month}`}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">brush</span>
              <span>Tạo Thẻ Kỷ Niệm</span>
            </Link>
          </div>

          {displayPeers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPeers.map((person) => {
                const yearRange = getLifespanLabel(person);

                return (
                  <div
                    key={person.id}
                    className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container-high/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-surface-container">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-xs font-bold">
                          {formattedDate}
                        </div>
                      </div>
                      <span className="font-label-sm text-xs px-2 py-0.5 rounded bg-surface-container text-primary font-bold">
                        {person.countryName}
                      </span>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold mt-1">
                        {person.name}
                      </h3>
                      <p className="text-xs text-secondary font-semibold mt-0.5">
                        {person.categoryLabel}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        {person.shortDescription || person.biography}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-xs">
                      <Link
                        href={`/birthday/${month}/${day}/people?person=${person.slug}`}
                        className="text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Xem hồ sơ chi tiết</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                      <span className="text-on-surface-variant font-medium">{yearRange}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 px-6 text-center flex flex-col items-center gap-4 bg-surface-container-low/40 rounded-3xl border border-surface-container-high/60 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">event_busy</span>
              </div>
              <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Chưa có nhân vật sinh đúng ngày {formattedDate}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Trùng hợp cả ngày, tháng và năm sinh là một điều kỳ diệu rất hiếm hoi. Dữ liệu đang tiếp tục được bổ sung và cập nhật.
                </p>
              </div>
              <Link
                href={`/birthday/${month}/${day}`}
                className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                Khám phá ngày {day} Tháng {month}
              </Link>
            </div>
          )}

          {/* Friendly Rare Notice Box */}
          <div className="mt-10 p-6 rounded-3xl bg-surface-container-low border border-surface-container-high flex items-start gap-4">
            <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">info</span>
            <div className="flex flex-col gap-1 text-sm text-on-surface-variant">
              <span className="font-title-md text-on-surface font-bold">
                Trùng hợp sinh nhật là một hiện tượng hiếm hoi và thú vị
              </span>
              <p className="leading-relaxed">
                Tỷ lệ hai người ngẫu nhiên cùng chia sẻ chính xác ngày, tháng và năm sinh là khoảng 1 trên 36.500. Dù có danh nhân trùng khớp hay không, ngày bạn chào đời luôn gắn liền với hàng loạt mốc son lịch sử hào hùng cùng ngày trên toàn cầu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

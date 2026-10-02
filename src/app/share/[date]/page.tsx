'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBirthdayData, MONTH_NAMES_VI } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { ShareCardModal } from '@/components/share/ShareCardModal';
import { vi } from '@/messages/vi';

export default function ShareCardPage() {
  const params = useParams();
  const router = useRouter();

  // date param can be "22-02" or "22-2"
  const dateStr = (params.date as string) || '22-02';
  const parts = dateStr.split('-');
  const day = parseInt(parts[0]) || 22;
  const month = parseInt(parts[1]) || 2;

  const monthNameVi = MONTH_NAMES_VI[month] || `tháng ${month}`;

  return (
    <AppShell showBottomNav={false}>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
        <TopBar title={vi.share.title} showBack={true} />
        <div className="flex-1 flex items-center justify-center">
          <ShareCardModal
            month={month}
            day={day}
            monthNameVi={monthNameVi}
            onClose={() => router.back()}
          />
        </div>
      </div>
    </AppShell>
  );
}

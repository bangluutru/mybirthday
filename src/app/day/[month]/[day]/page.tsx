'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getBirthdayData } from '@/data/birthdays';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { HistoryTimeline } from '@/components/history/HistoryTimeline';
import { vi } from '@/messages/vi';

export default function OnThisDayPage() {
  const params = useParams();

  const month = parseInt(params.month as string) || 2;
  const day = parseInt(params.day as string) || 22;

  const data = useMemo(() => getBirthdayData(month, day), [month, day]);

  return (
    <AppShell showBottomNav={true}>
      <div className="min-h-screen bg-white flex flex-col pb-24 text-slate-900">
        <TopBar
          title={vi.history.title(`${day} ${data.monthNameVi}`)}
          showBack={true}
        />

        <div className="flex-1">
          <HistoryTimeline events={data.events} month={month} day={day} />
        </div>
      </div>
    </AppShell>
  );
}

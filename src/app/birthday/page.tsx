'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TopBar } from '@/components/navigation/TopBar';
import { DateTactilePicker } from '@/components/picker/DateTactilePicker';

export default function BirthdayPickerPage() {
  return (
    <AppShell showBottomNav={false}>
      <div className="relative min-h-screen md:min-h-[844px] bg-gradient-to-b from-white via-slate-50 to-amber-50/20 flex flex-col justify-between">
        <TopBar showBack={true} />
        <DateTactilePicker initialDay={22} initialMonth={2} initialYear={1981} />
      </div>
    </AppShell>
  );
}

'use client';

import React, { useState } from 'react';
import { HistoryEvent, HistoryCategory } from '@/data/types';
import { vi } from '@/messages/vi';

interface HistoryTimelineProps {
  events: HistoryEvent[];
  month: number;
  day: number;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ events, month, day }) => {
  const [activeTab, setActiveTab] = useState<HistoryCategory>('event');

  const tabs: { key: HistoryCategory; label: string }[] = [
    { key: 'birth', label: vi.history.tabs.birth },
    { key: 'death', label: vi.history.tabs.death },
    { key: 'event', label: vi.history.tabs.event },
    { key: 'discovery', label: vi.history.tabs.discovery },
  ];

  const filteredEvents = events.filter((ev) => {
    if (activeTab === 'event') return true; // show all or primary
    return ev.category === activeTab;
  });

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 py-3 px-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Timeline List */}
      <div className="relative px-3.5 py-4 space-y-5">
        {/* Continuous vertical timeline guide line */}
        <div className="absolute left-[70px] top-6 bottom-6 w-0.5 bg-slate-200" />

        {filteredEvents.map((item, index) => {
          const isHighlight = item.highlightYear || item.year === 1732;
          return (
            <div
              key={item.id}
              className="relative flex items-start space-x-3 group"
            >
              {/* Year column */}
              <div className="w-12 text-right flex-shrink-0 pt-0.5">
                <span
                  className={`text-xs sm:text-sm font-bold tracking-tight ${
                    isHighlight ? 'text-amber-600' : 'text-slate-700'
                  }`}
                >
                  {item.year}
                </span>
              </div>

              {/* Bullet node on timeline */}
              <div className="relative z-10 flex items-center justify-center flex-shrink-0 mt-1">
                <div
                  className={`w-3 h-3 rounded-full border-2 bg-white ${
                    isHighlight
                      ? 'border-amber-500 bg-amber-500 ring-2 ring-amber-100'
                      : 'border-amber-400 bg-amber-400'
                  }`}
                />
              </div>

              {/* Content box */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Right Vignette Illustration matching Screen 08 */}
              {item.image && (
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 relative rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-0.5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

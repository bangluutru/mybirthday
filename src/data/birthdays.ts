import { BirthdayData, Person, HistoryEvent } from './types';
import { PEOPLE_01 } from './people/01';
import { PEOPLE_02 } from './people/02';
import { PEOPLE_03 } from './people/03';
import { PEOPLE_04 } from './people/04';
import { PEOPLE_05 } from './people/05';
import { PEOPLE_06 } from './people/06';
import { PEOPLE_07 } from './people/07';
import { PEOPLE_08 } from './people/08';
import { PEOPLE_09 } from './people/09';
import { PEOPLE_10 } from './people/10';
import { PEOPLE_11 } from './people/11';
import { PEOPLE_12 } from './people/12';

import { EVENTS_01 } from './events/01';
import { EVENTS_02 } from './events/02';
import { EVENTS_03 } from './events/03';
import { EVENTS_04 } from './events/04';
import { EVENTS_05 } from './events/05';
import { EVENTS_06 } from './events/06';
import { EVENTS_07 } from './events/07';
import { EVENTS_08 } from './events/08';
import { EVENTS_09 } from './events/09';
import { EVENTS_10 } from './events/10';
import { EVENTS_11 } from './events/11';
import { EVENTS_12 } from './events/12';

export const MONTH_NAMES_VI = [
  '',
  'tháng 1',
  'tháng 2',
  'tháng 3',
  'tháng 4',
  'tháng 5',
  'tháng 6',
  'tháng 7',
  'tháng 8',
  'tháng 9',
  'tháng 10',
  'tháng 11',
  'tháng 12',
];

export const ALL_PEOPLE: Person[] = [
  ...PEOPLE_01,
  ...PEOPLE_02,
  ...PEOPLE_03,
  ...PEOPLE_04,
  ...PEOPLE_05,
  ...PEOPLE_06,
  ...PEOPLE_07,
  ...PEOPLE_08,
  ...PEOPLE_09,
  ...PEOPLE_10,
  ...PEOPLE_11,
  ...PEOPLE_12,
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  ...EVENTS_01,
  ...EVENTS_02,
  ...EVENTS_03,
  ...EVENTS_04,
  ...EVENTS_05,
  ...EVENTS_06,
  ...EVENTS_07,
  ...EVENTS_08,
  ...EVENTS_09,
  ...EVENTS_10,
  ...EVENTS_11,
  ...EVENTS_12,
];

export const HISTORY_EVENTS_22_FEB: HistoryEvent[] = HISTORY_EVENTS.filter(
  (e) => e.month === 2 && e.day === 22
);

export function getHistoryEvents(month: number, day: number): HistoryEvent[] {
  return HISTORY_EVENTS.filter((e) => e.month === month && e.day === day);
}

export function getBirthdayData(month: number, day: number): BirthdayData {
  // Filter people strictly for this month and day - no fallback contamination
  const people = ALL_PEOPLE.filter(
    (p) => p.birthMonth === month && p.birthDay === day
  );

  const featured = people.filter((p) => p.isFeatured || (p.notabilityScore && p.notabilityScore >= 94));
  const vietnamese = people.filter((p) => p.countryCode === 'VN' || p.region === 'vietnam');
  const international = people.filter((p) => p.countryCode !== 'VN' && p.region !== 'vietnam');

  const stats = {
    total: people.length,
    scientists: people.filter((p) => p.category === 'scientist').length,
    artists: people.filter((p) => p.category === 'artist' || p.category === 'music').length,
    athletes: people.filter((p) => p.category === 'athlete').length,
    entrepreneurs: people.filter((p) => p.category === 'entrepreneur').length,
    historical: people.filter((p) => p.category === 'history' || p.category === 'politics').length,
  };

  const events = getHistoryEvents(month, day);

  return {
    month,
    day,
    monthNameVi: MONTH_NAMES_VI[month] || `tháng ${month}`,
    stats,
    featured: featured.length > 0 ? featured : people.slice(0, 3),
    vietnamese,
    international,
    all: people,
    events,
  };
}

export function getPersonBySlug(slug: string): Person | undefined {
  return ALL_PEOPLE.find((p) => p.slug === slug);
}

export function getExactSameDatePeople(month: number, day: number, year: number): {
  exact: Person[];
  sameYearOther: Person[];
} {
  const exact = ALL_PEOPLE.filter(
    (p) => p.birthMonth === month && p.birthDay === day && p.birthYear === year
  );
  const sameYearOther = ALL_PEOPLE.filter(
    (p) => p.birthYear === year && (p.birthMonth !== month || p.birthDay !== day)
  );
  return { exact, sameYearOther };
}

export function getZodiacSign(day: number, month: number): string {
  const signs = [
    { name: 'Ma Kết (Capricorn)', endDay: 19 },
    { name: 'Bảo Bình (Aquarius)', endDay: 18 },
    { name: 'Song Ngư (Pisces)', endDay: 20 },
    { name: 'Bạch Dương (Aries)', endDay: 19 },
    { name: 'Kim Ngưu (Taurus)', endDay: 20 },
    { name: 'Song Tử (Gemini)', endDay: 20 },
    { name: 'Cự Giải (Cancer)', endDay: 22 },
    { name: 'Sư Tử (Leo)', endDay: 22 },
    { name: 'Xử Nữ (Virgo)', endDay: 22 },
    { name: 'Thiên Bình (Libra)', endDay: 22 },
    { name: 'Bọ Cạp (Scorpio)', endDay: 21 },
    { name: 'Nhân Mã (Sagittarius)', endDay: 21 },
  ];
  const current = signs[month - 1];
  if (!current) return 'Song Ngư (Pisces)';
  if (day <= current.endDay) return current.name;
  return signs[month % 12].name;
}

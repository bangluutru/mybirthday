export type PersonCategory =
  | 'all'
  | 'scientist'
  | 'artist'
  | 'actor'
  | 'entrepreneur'
  | 'athlete'
  | 'history'
  | 'literature'
  | 'music'
  | 'politics';

export type PersonField =
  | 'technology-engineering'
  | 'medicine-health'
  | 'economics-business'
  | 'education-thought'
  | 'society-law'
  | 'design-creative'
  | 'earth-environment'
  | 'entrepreneurship'
  | 'science-research';

export const PERSON_FIELD_LABELS: Readonly<Record<PersonField, string>> = {
  'technology-engineering': 'Công nghệ & kỹ thuật',
  'medicine-health': 'Y học & sức khỏe',
  'economics-business': 'Kinh tế & kinh doanh',
  'education-thought': 'Giáo dục & tư tưởng',
  'society-law': 'Xã hội & pháp luật',
  'design-creative': 'Thiết kế & sáng tạo',
  'earth-environment': 'Trái đất & môi trường',
  entrepreneurship: 'Khởi nghiệp & doanh nhân',
  'science-research': 'Khoa học & nghiên cứu',
};

export interface Person {
  id: string;
  slug: string;
  name: string;
  nativeName?: string;
  birthDate: string; // YYYY-MM-DD
  deathDate?: string;
  deathDateSourceUrls?: string[];
  deathDatePrecision?: 'year' | 'month' | 'day' | 'presumed-day';
  lifeStatus?: 'living' | 'deceased' | 'unknown';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  occupation: string[];
  category: PersonCategory;
  categoryLabel: string;
  fields?: PersonField[];
  countryCode: string;
  countryName: string;
  countryFlag: string;
  birthplace?: string;
  image: string;
  shortDescription: string;
  biography?: string;
  highlights?: string[];
  wikidataId?: string;
  wikipediaUrl?: string;
  sourceUrls?: string[];
  notabilityScore?: number;
  isFeatured?: boolean;
  region?: 'vietnam' | 'world' | 'asia' | 'west';
  verifiedAt: string;
}

export function getLifespanLabel(person: Pick<Person, 'birthYear' | 'deathDate' | 'deathDatePrecision' | 'lifeStatus'>): string {
  if (person.deathDate && person.deathDatePrecision === 'presumed-day') {
    const [year, month, day] = person.deathDate.split('-');
    return `${person.birthYear} – mất tích từ ${day}/${month}/${year}; ngày mất chưa xác định`;
  }
  if (person.deathDate) return `${person.birthYear} – ${person.deathDate.slice(0, 4)}`;
  if (person.lifeStatus === 'living') return `${person.birthYear} – nay`;
  if (person.lifeStatus === 'deceased') return `${person.birthYear} – đã mất`;
  return String(person.birthYear);
}

export function didPersonDieOnDate(person: Pick<Person, 'deathDate' | 'deathDatePrecision'>, month: number, day: number): boolean {
  if (!person.deathDate || person.deathDatePrecision === 'year' || person.deathDatePrecision === 'month' || person.deathDatePrecision === 'presumed-day') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(person.deathDate) && Number(person.deathDate.slice(5, 7)) === month && Number(person.deathDate.slice(8, 10)) === day;
}

export function getAgeAtDeath(person: Pick<Person, 'birthDate' | 'birthYear' | 'deathDate' | 'deathDatePrecision'>): number | null {
  if (!person.deathDate || person.deathDatePrecision === 'year' || person.deathDatePrecision === 'month' || person.deathDatePrecision === 'presumed-day' || !/^\d{4}-\d{2}-\d{2}$/.test(person.deathDate)) return null;
  const [, birthMonth, birthDay] = person.birthDate.match(/^\d{4}-(\d{2})-(\d{2})$/) || [];
  if (!birthMonth || !birthDay) return null;
  const [deathYear, deathMonth, deathDay] = person.deathDate.split('-').map(Number);
  let age = deathYear - person.birthYear;
  if (deathMonth < Number(birthMonth) || (deathMonth === Number(birthMonth) && deathDay < Number(birthDay))) age--;
  return age >= 0 ? age : null;
}

export type HistoryCategory = 'birth' | 'death' | 'event' | 'discovery';

export interface HistoryEvent {
  id: string;
  month: number;
  day: number;
  year: number;
  category: HistoryCategory;
  title: string;
  description?: string;
  image?: string;
  sourceUrls?: string[];
  highlightYear?: boolean;
  verifiedAt: string;
}

export interface BirthdayStats {
  total: number;
  scientists: number;
  artists: number;
  athletes: number;
  entrepreneurs: number;
  historical: number;
}

export interface BirthdayData {
  month: number;
  day: number;
  monthNameVi: string;
  stats: BirthdayStats;
  featured: Person[];
  vietnamese: Person[];
  international: Person[];
  all: Person[];
  events: HistoryEvent[];
}

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

export interface Person {
  id: string;
  slug: string;
  name: string;
  nativeName?: string;
  birthDate: string; // YYYY-MM-DD
  deathDate?: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  occupation: string[];
  category: PersonCategory;
  categoryLabel: string;
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

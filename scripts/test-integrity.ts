import { ALL_PEOPLE, HISTORY_EVENTS, HISTORY_EVENTS_22_FEB, getBirthdayData } from '../src/data/birthdays';

interface Failure {
  suite: string;
  message: string;
}

const failures: Failure[] = [];

function assert(suite: string, condition: boolean, message: string) {
  if (!condition) {
    failures.push({ suite, message });
    console.error(`  ❌ [FAIL] ${suite}: ${message}`);
  }
}

console.log('============================================================');
console.log('BIRTHDAYVERSE — DATA INTEGRITY & FACTUAL SUITE (BV-001R1)');
console.log('============================================================\n');

// ------------------------------------------------------------
// Deterministic Calendar Validator
// ------------------------------------------------------------
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

// ------------------------------------------------------------
// Test 0: Calendar Validator Unit Tests (Negative & Positive Invariants)
// ------------------------------------------------------------
console.log('Checking Test 0: Deterministic calendar validator negative & positive assertions...');
assert('Test 0 (Negative)', !isValidCalendarDate(2020, 2, 31), 'Must reject 2020-02-31 (Feb 31 impossible)');
assert('Test 0 (Negative)', !isValidCalendarDate(2021, 4, 31), 'Must reject 2021-04-31 (April has 30 days)');
assert('Test 0 (Negative)', !isValidCalendarDate(2023, 2, 29), 'Must reject 2023-02-29 (2023 is not leap year)');
assert('Test 0 (Negative)', !isValidCalendarDate(1900, 2, 29), 'Must reject 1900-02-29 (1900 is not leap year - divisible by 100 but not 400)');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 6, 31), 'Must reject 2022-06-31 (June has 30 days)');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 9, 31), 'Must reject 2022-09-31 (September has 30 days)');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 11, 31), 'Must reject 2022-11-31 (November has 30 days)');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 0, 15), 'Must reject month 0');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 13, 15), 'Must reject month 13');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 5, 0), 'Must reject day 0');
assert('Test 0 (Negative)', !isValidCalendarDate(2022, 5, 32), 'Must reject day 32');

assert('Test 0 (Positive)', isValidCalendarDate(2024, 2, 29), 'Must accept 2024-02-29 (2024 is leap year)');
assert('Test 0 (Positive)', isValidCalendarDate(2000, 2, 29), 'Must accept 2000-02-29 (2000 is leap year - divisible by 400)');
assert('Test 0 (Positive)', isValidCalendarDate(1732, 2, 22), 'Must accept 1732-02-22');
assert('Test 0 (Positive)', isValidCalendarDate(1975, 2, 22), 'Must accept 1975-02-22');
assert('Test 0 (Positive)', isValidCalendarDate(1984, 4, 10), 'Must accept 1984-04-10');
assert('Test 0 (Positive)', isValidCalendarDate(1939, 2, 28), 'Must accept 1939-02-28');

// ------------------------------------------------------------
// Test A: Malformed birthDate & Impossible Calendar Dates
// ------------------------------------------------------------
console.log('Checking Rule A: Malformed birthDate & deterministic calendar validity...');
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
for (const p of ALL_PEOPLE) {
  assert('Rule A', typeof p.birthDate === 'string' && dateRegex.test(p.birthDate), `Person "${p.id}" has invalid birthDate format: "${p.birthDate}"`);
  if (p.birthDate && dateRegex.test(p.birthDate)) {
    const [y, m, d] = p.birthDate.split('-').map(Number);
    assert('Rule A', isValidCalendarDate(y, m, d), `Person "${p.id}" has impossible calendar birthDate: ${p.birthDate}`);
  }

  if (p.deathDate) {
    assert('Rule A', typeof p.deathDate === 'string' && dateRegex.test(p.deathDate), `Person "${p.id}" has invalid deathDate format: "${p.deathDate}"`);
    const [dy, dm, dd] = p.deathDate.split('-').map(Number);
    assert('Rule A', isValidCalendarDate(dy, dm, dd), `Person "${p.id}" has impossible calendar deathDate: ${p.deathDate}`);
    assert('Rule A', p.deathDate >= p.birthDate, `Person "${p.id}" deathDate (${p.deathDate}) precedes birthDate (${p.birthDate})`);
  }
}

// ------------------------------------------------------------
// Test B: birthYear === YEAR(birthDate)
// ------------------------------------------------------------
console.log('Checking Rule B: birthYear matches birthDate...');
for (const p of ALL_PEOPLE) {
  const expectedYear = Number(p.birthDate.slice(0, 4));
  assert('Rule B', p.birthYear === expectedYear, `Person "${p.id}" birthYear (${p.birthYear}) does not match birthDate (${p.birthDate})`);
}

// ------------------------------------------------------------
// Test C: birthMonth === MONTH(birthDate)
// ------------------------------------------------------------
console.log('Checking Rule C: birthMonth matches birthDate...');
for (const p of ALL_PEOPLE) {
  const expectedMonth = Number(p.birthDate.slice(5, 7));
  assert('Rule C', p.birthMonth === expectedMonth, `Person "${p.id}" birthMonth (${p.birthMonth}) does not match birthDate (${p.birthDate})`);
}

// ------------------------------------------------------------
// Test D: birthDay === DAY(birthDate)
// ------------------------------------------------------------
console.log('Checking Rule D: birthDay matches birthDate...');
for (const p of ALL_PEOPLE) {
  const expectedDay = Number(p.birthDate.slice(8, 10));
  assert('Rule D', p.birthDay === expectedDay, `Person "${p.id}" birthDay (${p.birthDay}) does not match birthDate (${p.birthDate})`);
}

// ------------------------------------------------------------
// Test E: Duplicate person IDs
// ------------------------------------------------------------
console.log('Checking Rule E: Unique person IDs...');
const seenIds = new Set<string>();
for (const p of ALL_PEOPLE) {
  assert('Rule E', !seenIds.has(p.id), `Duplicate person ID detected: "${p.id}"`);
  seenIds.add(p.id);
}

// ------------------------------------------------------------
// Test F: Duplicate person Slugs
// ------------------------------------------------------------
console.log('Checking Rule F: Unique person Slugs...');
const seenSlugs = new Set<string>();
for (const p of ALL_PEOPLE) {
  assert('Rule F', !seenSlugs.has(p.slug), `Duplicate slug detected: "${p.slug}"`);
  seenSlugs.add(p.slug);
}

// ------------------------------------------------------------
// Test G: Birthday Query Contamination
// For every getBirthdayData(month, day), every returned person MUST satisfy:
// person.birthMonth === month AND person.birthDay === day
// ------------------------------------------------------------
console.log('Checking Rule G: Birthday query zero contamination across all 366 days...');
const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= daysInMonths[m - 1]; d++) {
    const data = getBirthdayData(m, d);

    // Check all returned lists
    const allReturned = [
      ...data.all,
      ...data.featured,
      ...data.vietnamese,
      ...data.international,
    ];

    for (const p of allReturned) {
      assert(
        'Rule G',
        p.birthMonth === m && p.birthDay === d,
        `Contamination in getBirthdayData(${m}, ${d}): returned person "${p.id}" (${p.name}) with birthMonth=${p.birthMonth}, birthDay=${p.birthDay}`
      );
    }
  }
}

// ------------------------------------------------------------
// Test H: History Events Provenance & Strict Factual Verification
// ------------------------------------------------------------
console.log('Checking Rule H: History events integrity and provenance...');
// Strict assertion: Galileo 1632 event MUST be removed (unverified exact date)
const galileoEvent = HISTORY_EVENTS_22_FEB.find((ev) => ev.id === 'event-1632');
assert('Rule H', !galileoEvent, 'Galileo 1632 event must be removed from Feb 22 (unverified exact date)');

for (const ev of HISTORY_EVENTS_22_FEB) {
  assert('Rule H', typeof ev.year === 'number' && !isNaN(ev.year), `History event "${ev.id}" invalid year: ${ev.year}`);
  assert('Rule H', isValidCalendarDate(ev.year, ev.month, ev.day), `History event "${ev.id}" has impossible date: ${ev.year}-${ev.month}-${ev.day}`);
  assert('Rule H', Boolean(ev.title && ev.title.trim()), `History event "${ev.id}" missing title`);
  assert('Rule H', Boolean(ev.description && ev.description.trim()), `History event "${ev.id}" missing description`);
  assert(
    'Rule H',
    Array.isArray(ev.sourceUrls) && ev.sourceUrls.length > 0 && ev.sourceUrls.every((u) => u.startsWith('http')),
    `History event "${ev.id}" missing valid sourceUrls`
  );
  assert('Rule H', ev.month === 2 && ev.day === 22, `History event "${ev.id}" date is not 22/02: ${ev.month}/${ev.day}`);
}

// Exactly 4 audited and verified events for Feb 22
assert('Rule H', HISTORY_EVENTS_22_FEB.length === 4, `Expected exactly 4 verified Feb 22 history events, found: ${HISTORY_EVENTS_22_FEB.length}`);

// Check non-22-Feb dates have zero fabricated events
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= daysInMonths[m - 1]; d++) {
    if (m === 2 && d === 22) continue;
    const data = getBirthdayData(m, d);
    assert(
      'Rule H',
      data.events.length === 0,
      `Fabricated history events returned for non-benchmark date ${m}/${d}: count=${data.events.length}`
    );
  }
}

// ------------------------------------------------------------
// Test I: Authoritative Source Quality Audit
// ------------------------------------------------------------
console.log('Checking Rule I: Authoritative source provenance for people & events...');
for (const p of ALL_PEOPLE) {
  assert('Rule I', Array.isArray(p.sourceUrls) && p.sourceUrls.length > 0, `Person "${p.id}" has no sourceUrls`);
  if (p.sourceUrls) {
    for (const url of p.sourceUrls) {
      assert('Rule I', typeof url === 'string' && url.startsWith('http'), `Person "${p.id}" has invalid URL: "${url}"`);
      // Reject spam/SEO sites
      const isSeoSite = url.includes('famousbirthdays.com') || url.includes('thefamouspeople.com');
      assert('Rule I', !isSeoSite, `Person "${p.id}" uses disallowed SEO birthday source: "${url}"`);
    }
  }
}
for (const ev of HISTORY_EVENTS) {
  assert('Rule I', Array.isArray(ev.sourceUrls) && ev.sourceUrls.length > 0, `Event "${ev.id}" has no sourceUrls`);
  if (ev.sourceUrls) {
    for (const url of ev.sourceUrls) {
      assert('Rule I', typeof url === 'string' && url.startsWith('http'), `Event "${ev.id}" has invalid URL: "${url}"`);
      const isSeoSite = url.includes('famousbirthdays.com') || url.includes('thefamouspeople.com');
      assert('Rule I', !isSeoSite, `Event "${ev.id}" uses disallowed SEO birthday source: "${url}"`);
    }
  }
}

// ------------------------------------------------------------
// Test J: Birthday stats derived purely from people counts
// ------------------------------------------------------------
console.log('Checking Rule J: Birthday stats derived purely from people counts...');
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= daysInMonths[m - 1]; d++) {
    const data = getBirthdayData(m, d);
    const expectedTotal = data.all.length;
    const expectedScientists = data.all.filter((p) => p.category === 'scientist').length;
    const expectedArtists = data.all.filter((p) => p.category === 'artist' || p.category === 'music').length;
    const expectedAthletes = data.all.filter((p) => p.category === 'athlete').length;
    const expectedEntrepreneurs = data.all.filter((p) => p.category === 'entrepreneur').length;
    const expectedHistorical = data.all.filter((p) => p.category === 'history' || p.category === 'politics').length;

    assert('Rule J', data.stats.total === expectedTotal, `Stats total mismatch on ${m}/${d}: got ${data.stats.total}, expected ${expectedTotal}`);
    assert('Rule J', data.stats.scientists === expectedScientists, `Stats scientists mismatch on ${m}/${d}: got ${data.stats.scientists}, expected ${expectedScientists}`);
    assert('Rule J', data.stats.artists === expectedArtists, `Stats artists mismatch on ${m}/${d}: got ${data.stats.artists}, expected ${expectedArtists}`);
    assert('Rule J', data.stats.athletes === expectedAthletes, `Stats athletes mismatch on ${m}/${d}: got ${data.stats.athletes}, expected ${expectedAthletes}`);
    assert('Rule J', data.stats.entrepreneurs === expectedEntrepreneurs, `Stats entrepreneurs mismatch on ${m}/${d}: got ${data.stats.entrepreneurs}, expected ${expectedEntrepreneurs}`);
    assert('Rule J', data.stats.historical === expectedHistorical, `Stats historical mismatch on ${m}/${d}: got ${data.stats.historical}, expected ${expectedHistorical}`);

    if (m === 2 && d === 22) {
      assert('Rule J', data.stats.total === 16, `Feb 22 stats.total must be 16, got ${data.stats.total}`);
    }
  }
}

// ------------------------------------------------------------
// Test K: Birthday events matching queried date
// ------------------------------------------------------------
console.log('Checking Rule K: Birthday events matching queried date...');
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= daysInMonths[m - 1]; d++) {
    const data = getBirthdayData(m, d);
    for (const ev of data.events) {
      assert('Rule K', ev.month === m && ev.day === d, `Event "${ev.id}" in getBirthdayData(${m}, ${d}) has mismatched date ${ev.month}/${ev.day}`);
    }
    if (m === 2 && d === 22) {
      assert('Rule K', data.events.length === 4, `Feb 22 events count must be 4, got ${data.events.length}`);
    } else {
      assert('Rule K', data.events.length === 0, `Date ${m}/${d} events must be empty, got ${data.events.length}`);
    }
  }
}

// ------------------------------------------------------------
// Test L: Static source scan for banned/hardcoded patterns
// ------------------------------------------------------------
console.log('Checking Rule L: Static source scan for banned/hardcoded patterns...');
import * as fs from 'fs';
import * as path from 'path';

interface BannedPatternRule {
  pattern: string | RegExp;
  label: string;
  appliesTo: (relPath: string) => boolean;
}

const BANNED_PATTERNS: BannedPatternRule[] = [
  { pattern: 'is22Feb', label: 'is22Feb', appliesTo: () => true },
  { pattern: 'Steve Jobs', label: 'Steve Jobs', appliesTo: () => true },
  {
    pattern: 'Einstein',
    label: 'Einstein',
    appliesTo: (relPath) => !relPath.startsWith(path.join('src', 'data')),
  },
  { pattern: 'Vasco da Gama', label: 'Vasco da Gama', appliesTo: () => true },
  { pattern: 'Mark Twain', label: 'Mark Twain', appliesTo: () => true },
  { pattern: /\b183\b/, label: '\\b183\\b', appliesTo: () => true },
  {
    pattern: 'ngày 22 tháng 2',
    label: 'ngày 22 tháng 2',
    appliesTo: (relPath) => relPath.startsWith(path.join('src', 'app', 'day')),
  },
  {
    pattern: '22 tháng 2',
    label: '22 tháng 2',
    appliesTo: (relPath) => relPath.startsWith(path.join('src', 'app', 'day')),
  },
];

function getSourceFiles(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getSourceFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(full);
    }
  }
  return files;
}

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const srcFiles = getSourceFiles(srcDir);

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(projectRoot, file);

  for (const rule of BANNED_PATTERNS) {
    if (!rule.appliesTo(relPath)) {
      continue;
    }

    const matched = rule.pattern instanceof RegExp
      ? rule.pattern.test(content)
      : content.includes(rule.pattern);

    if (matched) {
      assert('Rule L', false, `Banned pattern "${rule.label}" found in ${relPath}`);
    }
  }
}

// ------------------------------------------------------------
// Rule M: Monthly file structure and month alignment
// ------------------------------------------------------------
console.log('Checking Rule M: Monthly file existence and birthMonth/month alignment...');

import { PEOPLE_01 } from '../src/data/people/01';
import { PEOPLE_02 } from '../src/data/people/02';
import { PEOPLE_03 } from '../src/data/people/03';
import { PEOPLE_04 } from '../src/data/people/04';
import { PEOPLE_05 } from '../src/data/people/05';
import { PEOPLE_06 } from '../src/data/people/06';
import { PEOPLE_07 } from '../src/data/people/07';
import { PEOPLE_08 } from '../src/data/people/08';
import { PEOPLE_09 } from '../src/data/people/09';
import { PEOPLE_10 } from '../src/data/people/10';
import { PEOPLE_11 } from '../src/data/people/11';
import { PEOPLE_12 } from '../src/data/people/12';

import { EVENTS_01 } from '../src/data/events/01';
import { EVENTS_02 } from '../src/data/events/02';
import { EVENTS_03 } from '../src/data/events/03';
import { EVENTS_04 } from '../src/data/events/04';
import { EVENTS_05 } from '../src/data/events/05';
import { EVENTS_06 } from '../src/data/events/06';
import { EVENTS_07 } from '../src/data/events/07';
import { EVENTS_08 } from '../src/data/events/08';
import { EVENTS_09 } from '../src/data/events/09';
import { EVENTS_10 } from '../src/data/events/10';
import { EVENTS_11 } from '../src/data/events/11';
import { EVENTS_12 } from '../src/data/events/12';

const ALL_MONTHLY_PEOPLE = [
  { month: 1, people: PEOPLE_01, name: 'PEOPLE_01' },
  { month: 2, people: PEOPLE_02, name: 'PEOPLE_02' },
  { month: 3, people: PEOPLE_03, name: 'PEOPLE_03' },
  { month: 4, people: PEOPLE_04, name: 'PEOPLE_04' },
  { month: 5, people: PEOPLE_05, name: 'PEOPLE_05' },
  { month: 6, people: PEOPLE_06, name: 'PEOPLE_06' },
  { month: 7, people: PEOPLE_07, name: 'PEOPLE_07' },
  { month: 8, people: PEOPLE_08, name: 'PEOPLE_08' },
  { month: 9, people: PEOPLE_09, name: 'PEOPLE_09' },
  { month: 10, people: PEOPLE_10, name: 'PEOPLE_10' },
  { month: 11, people: PEOPLE_11, name: 'PEOPLE_11' },
  { month: 12, people: PEOPLE_12, name: 'PEOPLE_12' },
];

const ALL_MONTHLY_EVENTS = [
  { month: 1, events: EVENTS_01, name: 'EVENTS_01' },
  { month: 2, events: EVENTS_02, name: 'EVENTS_02' },
  { month: 3, events: EVENTS_03, name: 'EVENTS_03' },
  { month: 4, events: EVENTS_04, name: 'EVENTS_04' },
  { month: 5, events: EVENTS_05, name: 'EVENTS_05' },
  { month: 6, events: EVENTS_06, name: 'EVENTS_06' },
  { month: 7, events: EVENTS_07, name: 'EVENTS_07' },
  { month: 8, events: EVENTS_08, name: 'EVENTS_08' },
  { month: 9, events: EVENTS_09, name: 'EVENTS_09' },
  { month: 10, events: EVENTS_10, name: 'EVENTS_10' },
  { month: 11, events: EVENTS_11, name: 'EVENTS_11' },
  { month: 12, events: EVENTS_12, name: 'EVENTS_12' },
];

for (const mData of ALL_MONTHLY_PEOPLE) {
  for (const p of mData.people) {
    assert(
      'Rule M',
      p.birthMonth === mData.month,
      `Person ${p.id} in ${mData.name} has birthMonth ${p.birthMonth}, expected ${mData.month}`
    );
  }
}

for (const mData of ALL_MONTHLY_EVENTS) {
  for (const ev of mData.events) {
    assert(
      'Rule M',
      ev.month === mData.month,
      `Event ${ev.id} in ${mData.name} has month ${ev.month}, expected ${mData.month}`
    );
  }
}

// ------------------------------------------------------------
// Rule N: Provenance and verifiedAt validation
// ------------------------------------------------------------
console.log('Checking Rule N: Provenance and verifiedAt metadata...');
const todayStr = new Date().toISOString().slice(0, 10);

function validateVerifiedAt(id: string, verifiedAt: unknown, entityType: string) {
  assert('Rule N', Boolean(verifiedAt), `${entityType} ${id} must have verifiedAt property`);
  if (typeof verifiedAt !== 'string') {
    assert(
      'Rule N',
      false,
      `${entityType} ${id} verifiedAt must be a string matching YYYY-MM-DD format`
    );
    return;
  }

  assert(
    'Rule N',
    /^\d{4}-\d{2}-\d{2}$/.test(verifiedAt),
    `${entityType} ${id} verifiedAt "${verifiedAt}" must match YYYY-MM-DD format`
  );

  const [y, m, d] = verifiedAt.split('-').map((s: string) => parseInt(s, 10));
  assert(
    'Rule N',
    isValidCalendarDate(y, m, d),
    `${entityType} ${id} verifiedAt "${verifiedAt}" must be a valid calendar date`
  );

  assert(
    'Rule N',
    verifiedAt >= '2026-01-01',
    `${entityType} ${id} verifiedAt "${verifiedAt}" cannot be before 2026-01-01`
  );

  assert(
    'Rule N',
    verifiedAt <= todayStr,
    `${entityType} ${id} verifiedAt "${verifiedAt}" cannot be in the future (today: ${todayStr})`
  );
}

for (const p of ALL_PEOPLE) {
  validateVerifiedAt(p.id, p.verifiedAt, 'Person');
}

for (const ev of HISTORY_EVENTS) {
  validateVerifiedAt(ev.id, ev.verifiedAt, 'HistoryEvent');
}

// ------------------------------------------------------------
// Rule O: Global ID uniqueness & aggregation integrity
// ------------------------------------------------------------
console.log('Checking Rule O: Global ID uniqueness & aggregation integrity...');

const peopleIds = new Set<string>();
for (const p of ALL_PEOPLE) {
  assert('Rule O', !peopleIds.has(p.id), `Duplicate person ID across months: ${p.id}`);
  peopleIds.add(p.id);
}

const eventIds = new Set<string>();
for (const ev of HISTORY_EVENTS) {
  assert('Rule O', !eventIds.has(ev.id), `Duplicate history event ID across months: ${ev.id}`);
  eventIds.add(ev.id);
}

const sumMonthlyPeople = ALL_MONTHLY_PEOPLE.reduce((acc, m) => acc + m.people.length, 0);
assert(
  'Rule O',
  ALL_PEOPLE.length === sumMonthlyPeople,
  `ALL_PEOPLE.length (${ALL_PEOPLE.length}) does not match sum of 12 monthly arrays (${sumMonthlyPeople})`
);

const sumMonthlyEvents = ALL_MONTHLY_EVENTS.reduce((acc, m) => acc + m.events.length, 0);
assert(
  'Rule O',
  HISTORY_EVENTS.length === sumMonthlyEvents,
  `HISTORY_EVENTS.length (${HISTORY_EVENTS.length}) does not match sum of 12 monthly arrays (${sumMonthlyEvents})`
);

// ------------------------------------------------------------
// Rule P: Wikidata provenance for newly added people
// ------------------------------------------------------------
console.log('Checking Rule P: Wikidata provenance for newly added people...');

const OLD_30_PERSON_IDS = new Set([
  'jd-salinger', 'christine-lagarde', 'george-washington', 'drew-barrymore',
  'steve-irwin', 'jules-verne', 'trinh-cong-son', 'enzo-ferrari',
  'elizabeth-taylor', 'james-blunt', 'arthur-schopenhauer', 'robert-baden-powell',
  'heinrich-hertz', 'renato-dulbecco', 'niki-lauda', 'julius-erving',
  'kyle-maclachlan', 'han-hyo-joo', 'nam-joo-hyuk', 'rajon-rondo',
  'lea-salonga', 'michael-chang', 'lleyton-hewitt', 'mandy-moore',
  'carl-friedrich-gauss', 'gal-gadot', 'ngo-bao-chau', 'napoleon-bonaparte',
  'jennifer-lawrence', 'edvard-munch',
]);

function getUrlHostname(urlStr: string): string {
  try {
    return new URL(urlStr).hostname.toLowerCase();
  } catch {
    return '';
  }
}

for (const p of ALL_PEOPLE) {
  // Light check for all people (including old 30 people)
  if (p.wikidataId) {
    assert(
      'Rule P',
      /^Q[1-9]\d*$/.test(p.wikidataId),
      `Person ${p.id} wikidataId "${p.wikidataId}" must match /^Q[1-9]\\d*$/`
    );
  }
  if (p.sourceUrls) {
    for (const u of p.sourceUrls) {
      const h = getUrlHostname(u);
      if (h === 'wikidata.org' || h.endsWith('.wikidata.org')) {
        const expectedWdUrl = p.wikidataId ? `https://www.wikidata.org/wiki/${p.wikidataId}` : null;
        assert(
          'Rule P',
          Boolean(expectedWdUrl && u === expectedWdUrl),
          `Person ${p.id} has wikidata URL "${u}" which does not match wikidataId "${p.wikidataId}"`
        );
      }
    }
  }

  const isOldPerson = OLD_30_PERSON_IDS.has(p.id) && p.verifiedAt === '2026-10-03';
  if (isOldPerson) continue;

  assert(
    'Rule P',
    Boolean(p.wikidataId && /^Q[1-9]\d*$/.test(p.wikidataId)),
    `Person ${p.id} must have valid wikidataId matching /^Q[1-9]\\d*$/, got: "${p.wikidataId}"`
  );

  assert(
    'Rule P',
    Array.isArray(p.sourceUrls) && p.sourceUrls.length >= 2,
    `New person ${p.id} must have at least 2 sourceUrls, got: ${p.sourceUrls?.length}`
  );

  if (p.sourceUrls && p.wikidataId) {
    const expectedWdUrl = `https://www.wikidata.org/wiki/${p.wikidataId}`;
    assert(
      'Rule P',
      p.sourceUrls.includes(expectedWdUrl),
      `New person ${p.id} sourceUrls must contain "${expectedWdUrl}"`
    );

    const hasIndependentSource = p.sourceUrls.some((u) => {
      const h = getUrlHostname(u);
      return h && !h.endsWith('wikipedia.org') && !h.endsWith('wikidata.org') && !h.endsWith('wikimedia.org');
    });

    assert(
      'Rule P',
      hasIndependentSource,
      `New person ${p.id} must have at least 1 independent source outside wikipedia/wikidata/wikimedia`
    );
  }
}

// ------------------------------------------------------------
// Rule Q: Banned domains in sourceUrls
// ------------------------------------------------------------
console.log('Checking Rule Q: Banned domains in sourceUrls...');

const BANNED_SOURCE_DOMAINS = [
  'famousbirthdays.com',
  'thefamouspeople.com',
  'onthisday.com',
  'bornglorious.com',
  'dayofbirth.com',
  'fandom.com',
  'wikia.com',
  'celebsagewiki.com',
  'ranker.com',
  'playback.fm',
];

for (const p of ALL_PEOPLE) {
  if (!p.sourceUrls) continue;
  for (const url of p.sourceUrls) {
    const h = getUrlHostname(url);
    for (const banned of BANNED_SOURCE_DOMAINS) {
      assert('Rule Q', !h.includes(banned), `Person ${p.id} uses banned source domain "${banned}": ${url}`);
    }
  }

  // imdb.com cannot be the sole independent source
  const nonWikiUrls = p.sourceUrls.filter((u) => {
    const h = getUrlHostname(u);
    return h && !h.endsWith('wikipedia.org') && !h.endsWith('wikidata.org') && !h.endsWith('wikimedia.org');
  });
  if (nonWikiUrls.length === 1 && getUrlHostname(nonWikiUrls[0]).includes('imdb.com')) {
    assert('Rule Q', false, `Person ${p.id} cannot use imdb.com as sole independent source`);
  }
}

// ------------------------------------------------------------
// Rule R: Consistency and quality constraints for new people
// ------------------------------------------------------------
console.log('Checking Rule R: Quality and consistency constraints for new people...');

function getExpectedFlag(cc: string): string {
  if (!cc || cc.length !== 2) return '';
  const codePoints = [...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const BANNED_BIOGRAPHY_PHRASES = ['vĩ đại nhất', 'số một thế giới', 'không ai sánh'];

for (const p of ALL_PEOPLE) {
  const isOldPerson = OLD_30_PERSON_IDS.has(p.id) && p.verifiedAt === '2026-10-03';
  if (isOldPerson) continue;

  assert('Rule R', p.slug === p.id, `New person ${p.id} slug "${p.slug}" must match id "${p.id}"`);

  const expectedFlag = getExpectedFlag(p.countryCode);
  assert(
    'Rule R',
    p.countryFlag === expectedFlag,
    `New person ${p.id} countryFlag "${p.countryFlag}" does not match countryCode "${p.countryCode}" (expected "${expectedFlag}")`
  );

  if (p.countryCode === 'VN') {
    assert('Rule R', p.region === 'vietnam', `Person ${p.id} with VN countryCode must have region 'vietnam', got: '${p.region}'`);
  } else {
    assert('Rule R', p.region !== 'vietnam', `Person ${p.id} with non-VN countryCode cannot have region 'vietnam'`);
  }

  assert(
    'Rule R',
    typeof p.shortDescription === 'string' && p.shortDescription.trim().length > 0,
    `New person ${p.id} shortDescription must be non-empty`
  );

  assert(
    'Rule R',
    typeof p.biography === 'string' && p.biography.trim().length > 0,
    `New person ${p.id} biography must be non-empty`
  );

  for (const phrase of BANNED_BIOGRAPHY_PHRASES) {
    assert(
      'Rule R',
      !(p.biography || '').toLowerCase().includes(phrase.toLowerCase()),
      `New person ${p.id} biography contains banned superlative "${phrase}"`
    );
  }

  assert(
    'Rule R',
    Array.isArray(p.highlights) && p.highlights.length >= 2 && p.highlights.length <= 3,
    `New person ${p.id} highlights must have 2-3 items, got: ${p.highlights?.length}`
  );
  if (p.highlights) {
    for (let i = 0; i < p.highlights.length; i++) {
      assert(
        'Rule R',
        typeof p.highlights[i] === 'string' && p.highlights[i].trim().length > 0,
        `New person ${p.id} highlights[${i}] must be non-empty`
      );
    }
  }
}

// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
console.log('\n============================================================');
if (failures.length === 0) {
  console.log('✅ ALL INTEGRITY AUDITS PASSED WITH ZERO VIOLATIONS.');
  console.log(`Verified total people: ${ALL_PEOPLE.length}`);
  console.log(`Verified Feb 22 people: ${getBirthdayData(2, 22).all.length}`);
  console.log(`Verified Feb 22 history events: ${HISTORY_EVENTS_22_FEB.length}`);
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error(`❌ FAILED WITH ${failures.length} VIOLATIONS.`);
  console.log('============================================================\n');
  process.exit(1);
}

import { ALL_PEOPLE, HISTORY_EVENTS, HISTORY_EVENTS_22_FEB, getBirthdayData } from '../src/data/birthdays';
import { isAdultOnDate, isValidIsoDate } from './wikidata-candidates';

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

console.log('Checking Test 0: Dynamic adult-age boundary in Wikidata candidate filter...');
assert('Test 0 (Age)', isAdultOnDate('2008-10-03', '2026-10-03'), 'Must include a person on their 18th birthday');
assert('Test 0 (Age)', !isAdultOnDate('2008-10-04', '2026-10-03'), 'Must exclude a person one day before their 18th birthday');
assert('Test 0 (Age)', isAdultOnDate('2008-10-02', '2026-10-03'), 'Must include a person who turned 18 the previous day');
assert('Test 0 (Date)', !isValidIsoDate('2026-02-29'), 'Candidate as-of date validation must reject impossible calendar dates');
assert('Test 0 (Date)', isValidIsoDate('2024-02-29'), 'Candidate as-of date validation must accept leap day');

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

// A reviewed data record is distinct from the old hardcoded UI fixture.
function withoutReviewedJobsRecord(content: string, relPath: string): string {
  if (relPath !== path.join('src', 'data', 'people', '02.ts')) return content;
  return content.replace(/\{\s*"id": "steve-jobs",[\s\S]*?\n  \}/g, (record) => {
    const person = JSON.parse(record);
    return person.birthDate === '1955-02-24' && person.wikidataId === 'Q19837' ? '' : record;
  });
}
const jobsFixture = '{"id": "steve-jobs", "name": "Steve Jobs", "birthDate": "1955-02-24", "wikidataId": "Q19837"\n  }';
const februaryFile = path.join('src', 'data', 'people', '02.ts');
assert('Rule L positive', !withoutReviewedJobsRecord(jobsFixture, februaryFile).includes('Steve Jobs'), 'Reviewed Jobs record is permitted');
for (const [fixture, location] of [
  [jobsFixture, path.join('src', 'app', 'page.tsx')],
  [jobsFixture.replace('1955-02-24', '1955-02-22'), februaryFile],
  [jobsFixture.replace('Q19837', 'Q0'), februaryFile],
  [jobsFixture + '\nconst label = "Steve Jobs";', februaryFile],
]) assert('Rule L negative', withoutReviewedJobsRecord(fixture, location).includes('Steve Jobs'), 'UI, wrong DOB/QID and unrelated hardcoding remain banned');

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(projectRoot, file);

  for (const rule of BANNED_PATTERNS) {
    if (!rule.appliesTo(relPath)) {
      continue;
    }

    const scanContent = rule.label === 'Steve Jobs'
      ? withoutReviewedJobsRecord(content, relPath) : content;
    const matched = rule.pattern instanceof RegExp
      ? rule.pattern.test(scanContent)
      : scanContent.includes(rule.pattern);

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

// These hosts are archives/research databases, not institutional publishers.
// Approve only the reviewed document and person, never the entire hosting domain.
// Publisher provenance and document hashes are recorded in B004-evidence.json.
const VERIFIED_FOREIGN_VN_DOCUMENTS: Readonly<Record<string, readonly string[]>> = {
  'Q4120045': ['https://ariyajoti.wordpress.com/wp-content/uploads/2013/08/nlm-2013-07-23-red.pdf'],
  'Q57407': ['https://uzo.sakura.ne.jp/burma/nlm/nlm_data/nlm_2012/nlm_11_2012/nlm_29_11_2012.pdf'],
  // OlyMADMen international research database recommended by IOC Olympic Studies Centre.
  // It is not the official IOC database. Only this reviewed DOB record is approved.
  'Q28810222': ['https://www.olympedia.org/athletes/51677'],
};


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
    Array.isArray(p.sourceUrls) && p.sourceUrls.length >= 3,
    `New person ${p.id} must have Wikidata plus at least 2 independent sourceUrls, got: ${p.sourceUrls?.length}`
  );

  if (p.sourceUrls && p.wikidataId) {
    const expectedWdUrl = `https://www.wikidata.org/wiki/${p.wikidataId}`;
    assert(
      'Rule P',
      p.sourceUrls.includes(expectedWdUrl),
      `New person ${p.id} sourceUrls must contain "${expectedWdUrl}"`
    );

    const independentSources = p.sourceUrls.filter((u) => {
      const h = getUrlHostname(u);
      return h && !h.endsWith('wikipedia.org') && !h.endsWith('wikidata.org') && !h.endsWith('wikimedia.org');
    });
    const independentHosts = new Set(independentSources.map(getUrlHostname));
    const institutionalHosts = [
      'britannica.com', 'nobelprize.org', 'olympedia.org', 'loc.gov', 'nps.gov',
      'oscars.org', 'rockhall.com', 'ecb.europa.eu', 'parliament.uk', 'royal.uk',
      'vatican.va', 'carmelitaniscalzi.com', 'therese-de-lisieux.catholique.fr', 'deutsche-biographie.de', 'royalsociety.org',
      'polskabibliotekamuzyczna.pl', 'tolkienestate.com', 'formula1.com', 'innertemplelibrary.org.uk',
      'vpf.vn', 'slnafc.com', 'braillemuseum.org', 'unibo.it', 'dhm.de', 'konrad-adenauer.de',
      'bundestag.de', 'bundespraesident.de', 'poets.org', 'ascsa.edu.gr', 'whitehousehistory.org',
      'graceland.com', 'hawking.org.uk', 'nixonlibrary.gov', 'womenshistory.org', 'dempseycenter.org',
      'usopm.org', 'teriin.org', 'aacr.org', 'parks.ca.gov', 'wbtourism.gov.in', 'ramakrishna.org.sg',
      'academie-francaise.fr', 'uni-wuerzburg.de', 'mathshistory.st-andrews.ac.uk', 'vnanet.vn',
      'schweitzer.org', 'libcat.weber.edu', 'vov.vn', 'thekingcenter.org', 'iwf.sport', 'worldarchery.sport',
      'hoahao.org', 'd23.com', 'ibdb.com', 'hoophall.com', 'nba.com', 'basketball-reference.com',
      'quochoi.vn', 'bnf.fr',
      'museelouisbraille.com', 'archives.iu.edu', 'transcription.si.edu', 'informs.org',
      'bpl.org', 'patrickdempsey.com', 'b.vjst.vn', 'vov.vn', 'voh.com.vn', 'tshaonline.org', 'jfk.org', 'cambridgeppf.org',
      'royalalberthall.com', 'cdlib.org', 'mancity.com', 'goldenglobes.com', 'fcbarcelona.com',
      'mcmaster.ca', 'dfb.de', 'musee-dior-granville.com', 'nac-cna.ca', 'guggenheim.org',
      'grandpalais.fr', 'nls.uk', 'musee-stendhal.bm-grenoble.fr',
      'turismoroma.it', 'auf.org.uy',
      'federicofellini.it', 'fellinimuseum.it', 'designmuseum.org', 'westminster-abbey.org',
      'strindbergsmuseet.se', 'saw-leipzig.de', 'musee-orsay.fr', 'museodelprado.es', 'korea.net',
      'premierleague.com', 'vntaiwan.catholic.org.tw', 'catholic-hierarchy.org', 'nts.org.uk', 'cidob.org',
      'britishlibrary.cn', 'virginiawoolfsociety.org.uk', 'macarthurmemorial.org', 'adb.anu.edu.au',
      'californiamuseum.org', 'nhl.com', 'hhof.com', 'mozarteum.at', 'salzburg.info', 'dhm.de',
      'awm.gov.au', 'pkf.org', 'archives-nationales.culture.gouv.fr', 'prlib.ru', 'tgliamz.ru',
      'ictp.it', 'fdrlibrary.org', 'sok.riksarkivet.se', 'nationalacademies.org', 'oeaw.ac.at',
      'austria.info', 'koninklijkhuis.nl', 'annefrank.org', 'yadvashem-france.org', 'ajpn.org',
      'tempestjapan.com', 'yhent.co.kr', 'ncapec.org', 'ocagames.com', 'the-afc.com',
      'jebentertainment.jp', 'fide.com', 'vnanet.vn', 'vatican.va', 'royalsociety.org', 'bfi.org.uk',
      'enciklopedija.hr', 'lzmk.hr', 'anthonyburgess.org', 'kunaicho.go.jp',
      'badmintonasia.org', 'jamesjoyce.ie', 'ireland.ie', 'president.ie', 'rte.ie', 'icc-cricket.com', 'aynrand.org', 'dallassymphony.org',
      'mendelssohn-stiftung.de', 'mnhs.org', 'vle.lt', 'uefa.com', 'realmadrid.com', 'baseballhall.org',
      'dickensmuseum.com', 'lauraingallswilderhome.com', 'unesco.org', 'afi.com', 'sonymusic.co.jp',
      'adk.de', 'invent.org', 'universalmusic.fr', 'bbaw.de', 'prlib.ru', 'snl.no', 'musees-nationaux-alpesmaritimes.fr', 'sciencemuseumgroup.org.uk', 'millercenter.org',
    ];
    const hasInstitutionalSource = independentSources.some((u) => {
      const h = getUrlHostname(u);
      return h.endsWith('.gov') || h.endsWith('.gov.vn') || h.endsWith('.edu') ||
        h.endsWith('.edu.vn') || h.endsWith('.ac.uk') ||
        institutionalHosts.some((domain) => h === domain || h.endsWith(`.${domain}`)) ||
        (VERIFIED_FOREIGN_VN_DOCUMENTS[p.wikidataId || '']?.includes(u) ?? false);
    });
    const reviewedPublisherExceptions: Readonly<Record<string, readonly string[]>> = {
      // Two independently edited foreign obituaries carry the exact full DOB for this Vietnamese former head of state.
      'Q318458': [
        'https://www.theguardian.com/world/2024/jul/30/nguyen-phu-trong-obituary',
        'https://www.lemonde.fr/en/obituaries/article/2024/07/20/nguyen-phu-trong-symbol-of-vietnamese-authoritarianism-dies-in-hanoi_6691391_15.html',
      ],
    };
    const hasReviewedPublisherException = reviewedPublisherExceptions[p.wikidataId || '']?.some((u) =>
      independentSources.includes(u)
    ) ?? false;

    assert(
      'Rule P',
      independentHosts.size >= 2,
      `New person ${p.id} must have at least 2 independent source hosts, got: ${independentHosts.size}`
    );
    assert(
      'Rule P',
      hasInstitutionalSource || hasReviewedPublisherException,
      `New person ${p.id} must cite at least 1 official or institutional source`
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
// Rule S: Minimum January daily coverage
// ------------------------------------------------------------
console.log('Checking Rule S: January 1-31 minimum daily coverage (>= 3 people)...');

const COVERAGE_EXCEPTIONS_JAN: { day: number; reason: string }[] = [];
for (let day = 1; day <= 31; day++) {
  const count = ALL_PEOPLE.filter((p) => p.birthMonth === 1 && p.birthDay === day).length;
  const exception = COVERAGE_EXCEPTIONS_JAN.find((item) => item.day === day && item.reason.trim());
  assert(
    'Rule S',
    count >= 3 || Boolean(exception),
    `January ${day} has only ${count} verified people; minimum is 3 and no documented exception exists`
  );
}

// ------------------------------------------------------------
// Rule T: Vietnamese/international balance for the January pilot
// ------------------------------------------------------------
console.log('Checking Rule T: January 1-31 additions nationality balance (20%-40% Vietnamese)...');
const NEW_JAN_PEOPLE = ALL_PEOPLE.filter((p) =>
  p.birthMonth === 1 && p.birthDay >= 1 && p.birthDay <= 31 &&
  !(OLD_30_PERSON_IDS.has(p.id) && p.verifiedAt === '2026-10-03')
);
const newVietnameseCount = NEW_JAN_PEOPLE.filter((p) => p.countryCode === 'VN').length;
const newInternationalCount = NEW_JAN_PEOPLE.length - newVietnameseCount;
const vietnameseShare = NEW_JAN_PEOPLE.length === 0 ? 0 : newVietnameseCount / NEW_JAN_PEOPLE.length;
console.log(`  January pilot additions: ${NEW_JAN_PEOPLE.length} total; ${newVietnameseCount} Vietnamese; ${newInternationalCount} international; ${(vietnameseShare * 100).toFixed(1)}% Vietnamese`);
assert('Rule T', NEW_JAN_PEOPLE.length > 0, 'January pilot must include verified additions before balance can be evaluated');
assert(
  'Rule T',
  vietnameseShare >= 0.2 && vietnameseShare <= 0.4,
  `Vietnamese share ${(vietnameseShare * 100).toFixed(1)}% must be within the 20%-40% target`
);

// ------------------------------------------------------------
// Rule U: Foreign institutional source for B004 Vietnamese profiles
// ------------------------------------------------------------
console.log('Checking Rule U: B004 Vietnamese profiles have a verified foreign source...');

// Add a domain only after confirming the publisher is an institution based outside Vietnam.
const VERIFIED_FOREIGN_VN_SOURCE_HOSTS = [
  'the-afc.com', 'worldarchery.sport', 'olympics.com',
  'olympic.org', 'fifa.com', 'fiba.basketball', 'worldathletics.org',
  'badmintonasia.org', 'ittf.com', 'tennisfame.com', 'tempestjapan.com',
  'yhent.co.kr', 'ncapec.org', 'vntaiwan.catholic.org.tw',
  'vatican.va', 'ocagames.com', 'yadvashem-france.org',
];

const B004_VIETNAMESE_PEOPLE = ALL_PEOPLE.filter((p) =>
  p.countryCode === 'VN' && p.birthMonth === 1 && p.birthDay >= 16 && p.birthDay <= 31 &&
  !(OLD_30_PERSON_IDS.has(p.id) && p.verifiedAt === '2026-10-03')
);


function isVerifiedForeignVnSource(qid: string, url: string): boolean {
  const host = getUrlHostname(url);
  return VERIFIED_FOREIGN_VN_SOURCE_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`)) ||
    (VERIFIED_FOREIGN_VN_DOCUMENTS[qid]?.includes(url) ?? false);
}

for (const [qid, urls] of Object.entries(VERIFIED_FOREIGN_VN_DOCUMENTS)) {
  for (const url of urls) {
    assert('Rule U positive', isVerifiedForeignVnSource(qid, url), `Reviewed document must pass: ${url}`);
    assert('Rule U negative', !isVerifiedForeignVnSource('Q0', url), 'Reviewed document must not approve a different person');
    const unrelated = new URL('/unreviewed-page', url).href;
    assert('Rule U negative', !isVerifiedForeignVnSource(qid, unrelated), `Unreviewed archive page must fail: ${unrelated}`);
    assert('Rule U negative', !isVerifiedForeignVnSource(qid, `${url}?unreviewed=1`), 'Unreviewed document variant must fail');
  }
}
assert('Rule U negative', !isVerifiedForeignVnSource('Q57407', 'https://the-afc.com.evil.example/bio'), 'Lookalike institutional host must fail');
assert('Rule U negative', !isVerifiedForeignVnSource('Q57407', 'not-a-url'), 'Malformed source must fail');

for (const p of B004_VIETNAMESE_PEOPLE) {
  const hasForeignInstitutionalSource = (p.sourceUrls || []).some((url) =>
    isVerifiedForeignVnSource(p.wikidataId || '', url)
  );
  assert(
    'Rule U',
    hasForeignInstitutionalSource,
    `B004 Vietnamese person ${p.id} needs an independent foreign institutional source`
  );
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
// Rule V/W: B005 February 1-15 coverage and approved foreign DOB sources
// ------------------------------------------------------------
const B005_BASELINE_IDS = new Set(['jules-verne']);
const B005_NEW_PEOPLE = ALL_PEOPLE.filter(p => p.birthMonth === 2 && p.birthDay <= 15 && !B005_BASELINE_IDS.has(p.id));
for (let day = 1; day <= 15; day++) {
  const people = ALL_PEOPLE.filter(p => p.birthMonth === 2 && p.birthDay === day);
  assert('Rule V', people.length >= 3, `February ${day}: minimum 3 verified profiles; found ${people.length}`);
  assert('Rule V', B005_NEW_PEOPLE.filter(p => p.birthDay === day).length <= 8, `February ${day}: more than 8 B005 additions`);
}
const b005Vietnamese = B005_NEW_PEOPLE.filter(p => p.countryCode === 'VN');
assert('Rule W', B005_NEW_PEOPLE.length > 0 && b005Vietnamese.length / B005_NEW_PEOPLE.length >= 0.05,
  `B005 Vietnamese share must be at least 5%; found ${b005Vietnamese.length}/${B005_NEW_PEOPLE.length}`);
const B005_FOREIGN_DOB_SOURCES: Readonly<Record<string, readonly string[]>> = {
  "Q46900491": [
    "https://badmintonasia.org/wp-content/uploads/2023/12/ar-2018-new.pdf"
  ],
  "Q99778061": [
    "https://assets.the-afc.com/2024_AFC_U23_Asian_Cup/Downloads/Squad_List/AFC-U23-Asian-Cup-Qatar-2024%E2%84%A2---Squad-Lists-%28Updated-April-16%29.pdf"
  ],
  "Q958317": [
    "https://www.ocagames.com/OCA/pdf_CD/16ag/BD/BD000000000000000..C32A.ENG.pdf"
  ]
};
function isApprovedB005DobSource(qid: string, url: string): boolean {
  return B005_FOREIGN_DOB_SOURCES[qid]?.includes(url) ?? false;
}
for (const [qid, urls] of Object.entries(B005_FOREIGN_DOB_SOURCES)) {
  for (const url of urls) {
    assert('Rule W positive', isApprovedB005DobSource(qid, url), 'Reviewed source must pass');
    assert('Rule W negative', !isApprovedB005DobSource('Q0', url), 'Wrong QID must fail');
    assert('Rule W negative', !isApprovedB005DobSource(qid, `${url}?unreviewed=1`), 'Unreviewed query variant must fail');
    assert('Rule W negative', !isApprovedB005DobSource(qid, new URL('/unreviewed',url).href), 'Unreviewed page must fail');
    const spoofed = new URL(url);
    spoofed.hostname += '.evil.example';
    assert('Rule W negative', !isApprovedB005DobSource(qid, spoofed.href), 'Reviewed QID with lookalike host must fail');
    assert('Rule W negative', !isApprovedB005DobSource(qid, 'invalid-url'), 'Reviewed QID with malformed URL must fail');
  }
}
assert('Rule W negative', !isApprovedB005DobSource('Q0', 'https://the-afc.com.evil.example/bio'), 'Lookalike host must fail');
assert('Rule W negative', !isApprovedB005DobSource('Q0', 'invalid-url'), 'Malformed URL must fail');
for (const p of b005Vietnamese) {
  assert('Rule W', (p.sourceUrls || []).some(url => isApprovedB005DobSource(p.wikidataId || '',url)),
    `B005 ${p.id} needs a reviewed exact foreign institutional DOB URL`);
}
console.log(`B005 additions: ${B005_NEW_PEOPLE.length}; Vietnamese: ${b005Vietnamese.length}`);

// Rule X/Y: B006 February 16-29 coverage and reviewed foreign full DOB sources.
const B006_BASELINE_IDS = new Set(["jd-salinger", "christine-lagarde", "bui-hoang-viet-anh", "therese-of-lisieux", "rudolf-clausius", "mily-balakirev", "j-r-r-tolkien", "michael-schumacher", "clement-attlee", "louis-braille", "le-tan-tai", "nguyen-huy-hoang", "umberto-eco", "konrad-adenauer", "frank-walter-steinmeier", "kahlil-gibran", "syd-barrett", "heinrich-schliemann", "millard-fillmore", "lewis-hamilton", "joseph-bonaparte", "elvis-presley", "stephen-hawking", "vo-thi-anh-xuan", "richard-nixon", "simone-de-beauvoir", "joan-baez", "donald-knuth", "robert-woodrow-wilson", "george-foreman", "kailash-satyarthi", "roger-guillemin", "nguyen-hoang-duc", "jack-london", "swami-vivekananda", "charles-perrault", "wilhelm-wien", "sydney-brenner", "patrick-dempsey", "albert-schweitzer", "yukio-mishima", "suboi", "martin-luther-king-jr", "thach-kim-tuan", "do-thi-anh-nguyet", "huynh-phu-so", "kate-moss", "susan-sontag", "dian-fossey", "benjamin-franklin", "muhammad-ali", "michelle-obama", "chung-thi-thanh-lan", "nguyen-sinh-hung", "pep-guardiola", "cary-grant", "hanbin", "edgar-allan-poe", "janis-joplin", "pham-duc-huy", "buzz-aldrin", "federico-fellini", "truong-tan-sang", "nguyen-cong-phuong", "christian-dior", "nguyen-van-mau", "lord-byron", "august-strindberg", "david-hilbert", "stendhal", "edouard-manet", "moon-jae-in", "friedrich-ii-of-prussia", "luis-suarez", "nguyen-huu-long", "robert-burns", "virginia-woolf", "douglas-macarthur", "angela-davis", "wayne-gretzky", "wolfgang-amadeus-mozart", "lewis-carroll", "wilhelm-ii", "nguyen-thi-mai-hung", "jackson-pollock", "colette", "anton-chekhov", "romain-rolland", "abdus-salam", "franklin-d-roosevelt", "olof-palme", "isamu-akasaki", "franz-schubert", "beatrix-of-the-netherlands", "paul-nguyen-cong-anh", "george-washington", "drew-barrymore", "steve-irwin", "jules-verne", "trinh-cong-son", "enzo-ferrari", "elizabeth-taylor", "james-blunt", "arthur-schopenhauer", "robert-baden-powell", "heinrich-hertz", "renato-dulbecco", "niki-lauda", "julius-erving", "kyle-maclachlan", "han-hyo-joo", "nam-joo-hyuk", "rajon-rondo", "lea-salonga", "michael-chang", "lleyton-hewitt", "boris-yeltsin", "leymah-gbowee", "le-duc-phat", "james-joyce", "ayn-rand", "jascha-heifetz", "felix-mendelssohn", "gertrude-stein", "norman-rockwell", "rosa-parks", "charles-lindbergh", "fernand-leger", "cristiano-ronaldo", "neymar", "robert-hofstadter", "ronald-reagan", "bob-marley", "babe-ruth", "charles-dickens", "laura-ingalls-wilder", "vo-nguyen-hoang", "dmitri-mendeleev", "john-williams", "alice-walker", "william-henry-harrison", "carole-king", "bertolt-brecht", "boris-pasternak", "mark-spitz", "thomas-edison", "josiah-willard-gibbs", "henry-fox-talbot", "abraham-lincoln", "charles-darwin", "nguyen-tien-minh", "william-shockley", "peter-gabriel", "peter-gustav-lejeune-dirichlet", "fritz-zwicky", "christian-eriksen", "angel-di-maria", "susan-b-anthony", "ernest-shackleton", "alfred-north-whitehead", "mandy-moore", "carl-friedrich-gauss", "gal-gadot", "ngo-bao-chau", "napoleon-bonaparte", "jennifer-lawrence", "edvard-munch"]);
const B006_NEW_PEOPLE = ALL_PEOPLE.filter(p => p.birthMonth === 2 && p.birthDay >= 16 && p.birthDay <= 29 && !B006_BASELINE_IDS.has(p.id));
for (let day=1; day<=29; day++) {
  assert('Rule X', ALL_PEOPLE.filter(p=>p.birthMonth===2 && p.birthDay===day).length >= 3, `February ${day}: minimum 3 verified people`);
  assert('Rule X', B006_NEW_PEOPLE.filter(p=>p.birthDay===day).length <=8, `February ${day}: maximum 8 B006 additions`);
}
assert('Rule X', !B006_NEW_PEOPLE.some(p=>p.birthDay===22), 'B006 must preserve Feb 22 without adding profiles');
const B006_FOREIGN_DOB_SOURCES: Readonly<Record<string, readonly string[]>> = {
 'Q45344289': ['https://assets.the-afc.com/migration/u/2/U23%20Technical%20Report%202018.pdf'],
 'Q868808': ['https://assets.the-afc.com/migration/a/f/afc-champions-league-2016-preliminary-registration-squad-list-29510'],
};
const isApprovedB006DobSource=(qid:string,url:string):boolean=>B006_FOREIGN_DOB_SOURCES[qid]?.includes(url) ?? false;
assert('Rule Y', B006_NEW_PEOPLE.length >= 35, 'B006 minimum 35 new profiles');
const b006Vietnamese=B006_NEW_PEOPLE.filter(p=>p.countryCode==='VN');
assert('Rule Y', B006_NEW_PEOPLE.length>0 && b006Vietnamese.length/B006_NEW_PEOPLE.length>=0.05, `B006 minimum5% Vietnamese: ${b006Vietnamese.length}/${B006_NEW_PEOPLE.length}`);
for(const [qid,urls] of Object.entries(B006_FOREIGN_DOB_SOURCES)) for(const url of urls){
 assert('Rule Y positive',isApprovedB006DobSource(qid,url),'Reviewed QID/URL must pass');
 const spoof=new URL(url);spoof.hostname+='.evil.example';
 for(const [badQid,badUrl] of [[qid,spoof.href],[qid,'invalid-url'],[qid,url+'?unreviewed=1'],[qid,new URL('/unreviewed',url).href],['Q0',url]])
  assert('Rule Y negative',!isApprovedB006DobSource(badQid,badUrl),'Unreviewed QID/URL must fail');
}
for(const p of b006Vietnamese)assert('Rule Y',(p.sourceUrls||[]).some(u=>isApprovedB006DobSource(p.wikidataId||'',u)), `B006 ${p.id}: reviewed foreign institutional fullDOB required`);
console.log(`B006 additions: ${B006_NEW_PEOPLE.length}; Vietnamese: ${b006Vietnamese.length}`);

// Rule Z/AA: the owner-authorized full March cycle B007.
const B007_BASELINE_IDS = new Set(["jd-salinger", "christine-lagarde", "bui-hoang-viet-anh", "therese-of-lisieux", "rudolf-clausius", "mily-balakirev", "j-r-r-tolkien", "michael-schumacher", "clement-attlee", "louis-braille", "le-tan-tai", "nguyen-huy-hoang", "umberto-eco", "konrad-adenauer", "frank-walter-steinmeier", "kahlil-gibran", "syd-barrett", "heinrich-schliemann", "millard-fillmore", "lewis-hamilton", "joseph-bonaparte", "elvis-presley", "stephen-hawking", "vo-thi-anh-xuan", "richard-nixon", "simone-de-beauvoir", "joan-baez", "donald-knuth", "robert-woodrow-wilson", "george-foreman", "kailash-satyarthi", "roger-guillemin", "nguyen-hoang-duc", "jack-london", "swami-vivekananda", "charles-perrault", "wilhelm-wien", "sydney-brenner", "patrick-dempsey", "albert-schweitzer", "yukio-mishima", "suboi", "martin-luther-king-jr", "thach-kim-tuan", "do-thi-anh-nguyet", "huynh-phu-so", "kate-moss", "susan-sontag", "dian-fossey", "benjamin-franklin", "muhammad-ali", "michelle-obama", "chung-thi-thanh-lan", "nguyen-sinh-hung", "pep-guardiola", "cary-grant", "hanbin", "edgar-allan-poe", "janis-joplin", "pham-duc-huy", "buzz-aldrin", "federico-fellini", "truong-tan-sang", "nguyen-cong-phuong", "christian-dior", "nguyen-van-mau", "lord-byron", "august-strindberg", "david-hilbert", "stendhal", "edouard-manet", "moon-jae-in", "friedrich-ii-of-prussia", "luis-suarez", "nguyen-huu-long", "robert-burns", "virginia-woolf", "douglas-macarthur", "angela-davis", "wayne-gretzky", "wolfgang-amadeus-mozart", "lewis-carroll", "wilhelm-ii", "nguyen-thi-mai-hung", "jackson-pollock", "colette", "anton-chekhov", "romain-rolland", "abdus-salam", "franklin-d-roosevelt", "olof-palme", "isamu-akasaki", "franz-schubert", "beatrix-of-the-netherlands", "paul-nguyen-cong-anh", "george-washington", "drew-barrymore", "steve-irwin", "jules-verne", "trinh-cong-son", "enzo-ferrari", "elizabeth-taylor", "james-blunt", "arthur-schopenhauer", "robert-baden-powell", "heinrich-hertz", "renato-dulbecco", "niki-lauda", "julius-erving", "kyle-maclachlan", "han-hyo-joo", "nam-joo-hyuk", "rajon-rondo", "lea-salonga", "michael-chang", "lleyton-hewitt", "boris-yeltsin", "leymah-gbowee", "le-duc-phat", "james-joyce", "ayn-rand", "jascha-heifetz", "felix-mendelssohn", "gertrude-stein", "norman-rockwell", "rosa-parks", "charles-lindbergh", "fernand-leger", "cristiano-ronaldo", "neymar", "robert-hofstadter", "ronald-reagan", "bob-marley", "babe-ruth", "charles-dickens", "laura-ingalls-wilder", "vo-nguyen-hoang", "dmitri-mendeleev", "john-williams", "alice-walker", "william-henry-harrison", "carole-king", "bertolt-brecht", "boris-pasternak", "mark-spitz", "thomas-edison", "josiah-willard-gibbs", "henry-fox-talbot", "abraham-lincoln", "charles-darwin", "nguyen-tien-minh", "william-shockley", "peter-gabriel", "peter-gustav-lejeune-dirichlet", "fritz-zwicky", "christian-eriksen", "angel-di-maria", "susan-b-anthony", "ernest-shackleton", "alfred-north-whitehead", "john-mcenroe", "valentino-rossi", "francis-galton", "michael-jordan", "otto-stern", "nguyen-van-hoang", "alessandro-volta", "toni-morrison", "svante-arrhenius", "jennifer-doudna", "bui-tan-truong", "ansel-adams", "ludwig-boltzmann", "sidney-poitier", "nina-simone", "harald-v", "w-h-auden", "naruhito", "karl-jaspers", "w-e-b-du-bois", "steve-jobs", "alain-prost", "pierre-auguste-renoir", "george-harrison", "anthony-burgess", "victor-hugo", "johnny-cash", "recep-tayyip-erdogan", "john-steinbeck", "henry-wadsworth-longfellow", "linus-pauling", "frank-gehry", "gioachino-rossini", "pedro-sanchez", "herman-hollerith", "mandy-moore", "carl-friedrich-gauss", "gal-gadot", "ngo-bao-chau", "napoleon-bonaparte", "jennifer-lawrence", "edvard-munch"]);
const B007_ADDED_IDS = new Set<string>(["akira-kurosawa","al-gore","albert-einstein","alexander-graham-bell","andrew-jackson","andrew-lloyd-webber","aretha-franklin","arthur-honegger","ayrton-senna","bela-bartok","bernard-katz","bernardo-bertolucci","bobby-fischer","bruce-willis","carl-philipp-emanuel-bach","daniel-kahneman","dario-fo","dirk-bogarde","edward-albee","edward-calvin-kendall","elton-john","eric-clapton","erich-fromm","ernst-junger","francisco-goya","gabriel-garcia-marquez","georg-cantor","george-gamow","georges-dumezil","glenn-close","glenn-miller","gottlieb-daimler","hans-dietrich-genscher","harry-houdini","henrik-ibsen","ho-tuan-tai","hugo-wolf","jack-kerouac","james-tobin","jerry-lewis","john-garfield","john-major","john-tyler","joseph-fourier","joseph-haydn","joseph-von-eichendorff","joseph-von-fraunhofer","kurt-weill","liza-minnelli","marcel-marceau","mario-vargas-llosa","maurice-ravel","michael-caine","mikhail-gorbachev","mstislav-rostropovich","neil-sedaka","neville-chamberlain","nguyen-huy-hung","nicolaas-bloembergen","nikolai-rimsky-korsakov","oskar-kokoschka","otto-hahn","paul-heyse","percival-lowell","pham-manh-hung","philip-roth","pierre-boulez","piet-mondrian","quentin-tarantino","quincy-jones","rene-descartes","rex-harrison","robert-millikan","ron-howard","rudolf-nureyev","rupert-murdoch","samuel-barber","sharon-stone","spike-lee","stephane-mallarme","steve-mcqueen","tennessee-williams","tomas-masaryk","tran-minh-vuong","trinh-quang-vinh","urbain-le-verrier","valentina-tereshkova","vincent-van-gogh","wernher-von-braun","wilhelm-rontgen","william-hurt","yuri-gagarin","zhores-alferov"]);
const B007_NEW_PEOPLE = ALL_PEOPLE.filter(p => B007_ADDED_IDS.has(p.id));
for (let day=1; day<=31; day++) {
 assert('Rule Z', ALL_PEOPLE.filter(p=>p.birthMonth===3 && p.birthDay===day).length>=3, `March ${day}: at least3 verified people`);
 assert('Rule Z', B007_NEW_PEOPLE.filter(p=>p.birthMonth===3 && p.birthDay===day).length<=8, `March ${day}: at most8 additions`);
}
assert('Rule Z', B007_NEW_PEOPLE.every(p=>p.birthMonth===3), 'B007 additions must be in March');
const B007_FOREIGN_DOB_SOURCES: Readonly<Record<string, readonly string[]>> = {
  "Q18637480": [
    "https://assets.the-afc.com/migration/a/f/afc-asian-cup-uae-2019-technical-report-and-statistics"
  ],
  "Q19594359": [
    "https://assets.the-afc.com/migration/a/f/afc-u-23-championship-2016-qatar---final-registration--28554"
  ],
  "Q19560744": [
    "https://assets.the-afc.com/migration/a/f/afc-u-23-championship-2016-qatar---final-registration--28554"
  ],
  "Q10829872": [
    "https://assets.the-afc.com/migration/a/f/afc-champions-league-2016-preliminary-registration-squad-list-29510"
  ],
  "Q19364879": [
    "https://assets.the-afc.com/migration/a/f/afc-asian-cup-uae-2019-technical-report-and-statistics"
  ]
};
const approvedB007Source=(qid:string,url:string):boolean=>B007_FOREIGN_DOB_SOURCES[qid]?.includes(url) ?? false;
const b007Vietnamese=B007_NEW_PEOPLE.filter(p=>p.countryCode==='VN');
assert('Rule AA', B007_NEW_PEOPLE.length>=93, 'B007 requires at least93 additions');
assert('Rule AA', B007_NEW_PEOPLE.length>0 && b007Vietnamese.length/B007_NEW_PEOPLE.length>=0.05, 'B007 requires at least5% Vietnamese among new IDs');
for(const [qid,urls]of Object.entries(B007_FOREIGN_DOB_SOURCES))for(const url of urls){
 assert('Rule AA positive',approvedB007Source(qid,url),'Exact reviewed source passes');
 const spoof=new URL(url);spoof.hostname+='.evil.example';
 for(const [badQid,badUrl]of [[qid,spoof.href],[qid,'invalid-url'],[qid,url+'?unreviewed=1'],[qid,new URL('/unreviewed',url).href],['Q0',url]])
  assert('Rule AA negative',!approvedB007Source(badQid,badUrl),'Unreviewed QID/URL fails');
}
for(const p of b007Vietnamese)assert('Rule AA',(p.sourceUrls||[]).some(u=>approvedB007Source(p.wikidataId||'',u)), `B007 ${p.id}: exact reviewed foreign fullDOB source required`);
console.log(`B007 additions: ${B007_NEW_PEOPLE.length}; Vietnamese: ${b007Vietnamese.length}`);

// Rule AB/AC: the full April cycle B008.
const B008_ADDED_IDS = new Set<string>(["otto-von-bismarck","wangari-maathai","milan-kundera","hans-christian-andersen","giacomo-casanova","marvin-gaye","marlon-brando","jane-goodall","eddie-murphy","maya-angelou","andrei-tarkovsky","heath-ledger","bette-davis","gregory-peck","tran-le-quoc-toan","james-watson","kurt-georg-kiesinger","rafael-correa","jackie-chan","billie-holiday","joseph-tran-van-toan","kofi-annan","jacques-brel","edmund-husserl","charles-baudelaire","jean-paul-belmondo","elias-lonnrot","hugo-grotius","omar-sharif","joseph-pulitzer","george-canning","andrew-wiles","ferdinand-lassalle","montserrat-caballe","joyce-banda","nguyen-quang-hai","jacques-lacan","samuel-beckett","garry-kasparov","bhimrao-ambedkar","christiaan-huygens","nguyen-phu-trong","emile-durkheim","leonhard-euler","tomas-transtromer","charlie-chaplin","anatole-france","kareem-abdul-jabbar","sirimavo-bandaranaike","karen-blixen","william-holden","leopold-stokowski","wojciech-szczesny","michael-d-higgins","jose-echegaray","mswati-iii","doan-van-hau","joan-miro","gro-harlem-brundtland","jessica-lange","elizabeth-ii","max-weber","iggy-pop","immanuel-kant","jack-nicholson","rita-levi-montalcini","max-planck","halldor-laxness","shirley-temple","barbra-streisand","shirley-maclaine","sachin-tendulkar","al-pacino","ella-fitzgerald","johan-cruyff","ludwig-wittgenstein","eugene-delacroix","i-m-pei","ulysses-s-grant","mary-wollstonecraft","willem-alexander","james-monroe","penelope-cruz","harper-lee","uma-thurman","zubin-mehta","andre-agassi","antonio-guterres","kirsten-dunst","jaroslav-hasek"]);
const B008_NEW_PEOPLE = ALL_PEOPLE.filter(p => B008_ADDED_IDS.has(p.id));
const b008Vietnamese = B008_NEW_PEOPLE.filter(p => p.countryCode === 'VN');
for (let day=1; day<=30; day++) {
  const additions = B008_NEW_PEOPLE.filter(p => p.birthMonth===4 && p.birthDay===day).length;
  const total = ALL_PEOPLE.filter(p => p.birthMonth===4 && p.birthDay===day).length;
  assert('Rule AB', total>=3, `April ${day}: at least 3 verified profiles; found ${total}`);
  assert('Rule AB', additions>=3, `April ${day}: at least 3 B008 additions; found ${additions}`);
  assert('Rule AB', additions<=8, `April ${day}: at most 8 B008 additions; found ${additions}`);
}
assert('Rule AB', B008_NEW_PEOPLE.length===90, `B008 must include exactly 90 new IDs, found ${B008_NEW_PEOPLE.length}`);
assert('Rule AB', new Set(B008_NEW_PEOPLE.map(p=>p.wikidataId)).size===B008_NEW_PEOPLE.length, 'B008 Wikidata IDs must be unique');
assert('Rule AB', B008_NEW_PEOPLE.every(p=>p.birthMonth===4), 'B008 additions must all be born in April');

const B008_FOREIGN_DOB_SOURCES: Readonly<Record<string, readonly string[]>> = {
  'Q7833303': ['https://www.olympedia.org/athletes/124166','https://www.the-sports.org/le-quoc-toan-tran-weightlifting-spf145162.html'],
  'Q16319564': ['https://www.catholic-hierarchy.org/bishop/btvt.html'],
  'Q24689101': ['https://www.the-afc.com/en/national/afc_asian_cup/news/ones_to_watch_nguyen_quang_hai_vietnam.html'],
  'Q318458': ['https://www.theguardian.com/world/2024/jul/30/nguyen-phu-trong-obituary'],
  'Q29311086': ['https://assets.the-afc.com/migration/2/0/20190116%20AC2019%20Final%20Squads.pdf','https://www.transfermarkt.co.uk/van-hau-doan/profil/spieler/484362'],
};
const isApprovedB008ForeignDobSource=(qid:string,url:string):boolean=>B008_FOREIGN_DOB_SOURCES[qid]?.includes(url) ?? false;
assert('Rule AC', B008_NEW_PEOPLE.length>=90, `B008 requires at least 90 additions; found ${B008_NEW_PEOPLE.length}`);
assert('Rule AC', B008_NEW_PEOPLE.length>0 && b008Vietnamese.length/B008_NEW_PEOPLE.length>=0.05, `B008 requires at least 5% Vietnamese; found ${b008Vietnamese.length}/${B008_NEW_PEOPLE.length}`);
assert('Rule AC', b008Vietnamese.length>=5, `B008 requires at least five Vietnamese profiles; found ${b008Vietnamese.length}`);
for (const [qid,urls] of Object.entries(B008_FOREIGN_DOB_SOURCES)) for (const url of urls) {
  assert('Rule AC positive',isApprovedB008ForeignDobSource(qid,url),`Exact reviewed foreign DOB URL must pass: ${url}`);
  const spoof=new URL(url); spoof.hostname += '.evil.example';
  for (const [badQid,badUrl] of [[qid,spoof.href],[qid,'invalid-url'],[qid,url+'?unreviewed=1'],[qid,new URL('/unreviewed',url).href],['Q0',url]])
    assert('Rule AC negative',!isApprovedB008ForeignDobSource(badQid,badUrl),'Unreviewed QID, URL, path, query, lookalike host, or malformed URL must fail');
}
for (const p of b008Vietnamese) assert('Rule AC', (p.sourceUrls||[]).some(u=>isApprovedB008ForeignDobSource(p.wikidataId||'',u)), `B008 ${p.id} requires an exact reviewed foreign full-DOB source`);
console.log(`B008 additions: ${B008_NEW_PEOPLE.length}; Vietnamese: ${b008Vietnamese.length}`);

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

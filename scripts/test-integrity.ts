import { ALL_PEOPLE, HISTORY_EVENTS, HISTORY_EVENTS_22_FEB, getBirthdayData } from '../src/data/birthdays';
import { isAdultOnDate, isValidIsoDate } from './wikidata-candidates';
import { createHash } from 'node:crypto';
import { didPersonDieOnDate, getAgeAtDeath, getLifespanLabel } from '../src/data/types';
import B013_EVIDENCE from '../.ai/evidence/B013.json';
import B014_EVIDENCE from '../.ai/evidence/B014.json';
import { B015_B016_NEW_IDS, runB015B016Integrity } from './test-integrity-b015-b016';
import { BV017_EXPANSION_NEW_IDS } from './test-bv017-expansion-pilot';
import { BV017_JAN1_NEW_IDS, BV017_JAN1_REVIEWED_IDS, runBv017January1BatchIntegrity } from './test-bv017-january-1-batch';
import { BV017_JAN2_NEW_IDS, BV017_JAN2_REVIEWED_IDS, runBv017January2BatchIntegrity } from './test-bv017-january-2-batch';
import { BV017_JAN3_NEW_IDS, BV017_JAN3_REVIEWED_IDS, runBv017January3BatchIntegrity } from './test-bv017-january-3-batch';
import { BV017_JAN4_NEW_IDS, BV017_JAN4_REVIEWED_IDS, runBv017January4BatchIntegrity } from './test-bv017-january-4-batch';
import { BV017_JAN5_NEW_IDS, BV017_JAN5_REVIEWED_IDS, runBv017January5BatchIntegrity } from './test-bv017-january-5-batch';
import { BV017_JAN6_NEW_IDS, BV017_JAN6_REVIEWED_IDS, runBv017January6BatchIntegrity } from './test-bv017-january-6-batch';
import { BV017_JAN7_NEW_IDS, BV017_JAN7_REVIEWED_IDS, runBv017January7BatchIntegrity } from './test-bv017-january-7-batch';
import { BV017_JAN8_NEW_IDS, BV017_JAN8_REVIEWED_IDS, runBv017January8BatchIntegrity } from './test-bv017-january-8-batch';
import { BV017_JAN9_NEW_IDS, BV017_JAN9_REVIEWED_IDS, runBv017January9BatchIntegrity } from './test-bv017-january-9-batch';
import { BV017_JAN10_NEW_IDS, BV017_JAN10_REVIEWED_IDS, runBv017January10BatchIntegrity } from './test-bv017-january-10-batch';
import { BV017_JAN11_NEW_IDS, BV017_JAN11_REVIEWED_IDS, runBv017January11BatchIntegrity } from './test-bv017-january-11-batch';
import { BV017_JAN12_NEW_IDS, BV017_JAN12_REVIEWED_IDS, runBv017January12BatchIntegrity } from './test-bv017-january-12-batch';
import { BV017_JAN13_NEW_IDS, BV017_JAN13_REVIEWED_IDS, runBv017January13BatchIntegrity } from './test-bv017-january-13-batch';
import { BV017_JAN14_NEW_IDS, BV017_JAN14_REVIEWED_IDS, runBv017January14BatchIntegrity } from './test-bv017-january-14-batch';
import { BV017_JAN15_NEW_IDS, BV017_JAN15_REVIEWED_IDS, runBv017January15BatchIntegrity } from './test-bv017-january-15-batch';
import { BV017_JAN16_NEW_IDS, BV017_JAN16_REVIEWED_IDS, runBv017January16BatchIntegrity } from './test-bv017-january-16-batch';
import { BV017_JAN17_NEW_IDS, BV017_JAN17_REVIEWED_IDS, runBv017January17BatchIntegrity } from './test-bv017-january-17-batch';
import { BV017_JAN18_NEW_IDS, BV017_JAN18_REVIEWED_IDS, runBv017January18BatchIntegrity } from './test-bv017-january-18-batch';
import { BV017_JAN19_NEW_IDS, BV017_JAN19_REVIEWED_IDS, runBv017January19BatchIntegrity } from './test-bv017-january-19-batch';
import { BV017_JAN20_NEW_IDS, BV017_JAN20_REVIEWED_IDS, runBv017January20BatchIntegrity } from './test-bv017-january-20-batch';
import { projectPersonBeforeBv017, sourceUrlsBeforeBv017, verifyBv017CorrectionManifest } from './bv017-corrections';

interface Failure {
  suite: string;
  message: string;
}

const failures: Failure[] = [];

// B013 additions are projected out of every previously accepted cycle snapshot.
const B013_NEW_IDS = new Set([
  'edgar-rice-burroughs', 'kirsti-kolle-grondahl', 'per-kirkeby',
  'bodil-kjer', 'kristin-halvorsen', 'kjetil-andre-aamodt',
  'alan-ladd', 'knut-nystedt', 'kjell-magne-bondevik',
  'anton-bruckner', 'bernt-heiberg', 'beyonce',
  'werner-herzog', 'john-carew', 'arthur-koestler',
  'jane-addams', 'franz-josef-strauss', 'ingebjorg-kasin-sandsdalen',
  'sonny-rollins', 'buddy-holly', 'tore-gjelsvik',
  'antonin-dvorak', 'patsy-cline', 'do-hung-dung',
  'otis-redding', 'per-jorgensen', 'frode-andresen',
  'stephen-jay-gould', 'marja-liisa-kirvesniemi', 'pham-thanh-luong',
  'theodor-w-adorno', 'birgitta-trotzig', 'brian-de-palma',
  'maurice-chevalier', 'jesse-owens', 'bjorn-floberg',
  'roald-dahl', 'alex-riel', 'ahmet-necdet-sezer',
  'jan-masaryk', 'astrid-gjertsen', 'filip-nguyen',
  'oliver-stone', 'jessye-norman', 'tommy-lee-jones',
  'lauren-bacall', 'jon-hellesnes', 'vebjorn-rodal',
  'christian-lous-lange', 'hank-williams', 'randi-bratteli',
  'greta-garbo', 'nils-petter-molvaer', 'sveinn-einarsson',
  'mika-waltari', 'william-golding', 'jeremy-irons',
  'sophia-loren', 'bjorn-wiinblad', 'rolf-kirkvaag',
  'gustav-holst', 'leonard-cohen', 'lars-saabye-christensen',
  'fay-weldon', 'nick-cave', 'ha-duc-chinh',
  'aldo-moro', 'ray-charles', 'per-olov-enquist',
  'f-scott-fitzgerald', 'jim-henson', 'nils-collett-vogt',
  'william-faulkner', 'glenn-gould', 'michael-douglas',
  'george-gershwin', 'elisabeth-bang', 'olivia-newton-john',
  'tryggve-andersen', 'arthur-penn', 'gwyneth-paltrow',
  'frances-willard', 'brigitte-bardot', 'liv-dommersnes',
  'lech-walesa', 'jon-fosse', 'do-duy-manh',
  'johan-falkberget', 'truman-capote', 'elie-wiesel',
]);

function assert(suite: string, condition: boolean, message: string) {
  if (!condition) {
    failures.push({ suite, message });
    console.error(`  ❌ [FAIL] ${suite}: ${message}`);
  }
}

verifyBv017CorrectionManifest(ALL_PEOPLE, assert);

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

console.log('Checking Test 0: Unknown life status must not be shown as living...');
assert('Test 0 (Life status)', getLifespanLabel({ birthYear: 1940 }) === '1940', 'Unknown life status must show only the birth year');
assert('Test 0 (Life status)', getLifespanLabel({ birthYear: 1940, lifeStatus: 'living' }) === '1940 – nay', 'Explicit living status may show nay');
assert('Test 0 (Life status)', getLifespanLabel({ birthYear: 1940, lifeStatus: 'deceased' }) === '1940 – đã mất', 'Explicit deceased status without a year must not imply a death year');
assert('Test 0 (Life status)', getLifespanLabel({ birthYear: 1940, deathDate: '2005-12-10' }) === '1940 – 2005', 'A death date must show the recorded death year');
assert('Test 0 (Life status)', ALL_PEOPLE.every((person) => getLifespanLabel(person).includes('nay') === (person.lifeStatus === 'living' && !person.deathDate)), 'Only explicitly living people may be rendered as living');
assert('Test 0 (Life status)', didPersonDieOnDate({ deathDate: '2005-12-10' }, 12, 10), 'Exact death dates must match their death anniversary');
assert('Test 0 (Life status)', !didPersonDieOnDate({ deathDate: '2005' }, 12, 10), 'A death year alone must not be treated as a precise anniversary');
assert('Test 0 (Life status)', !didPersonDieOnDate({ deathDate: '1944-12-15', deathDatePrecision: 'presumed-day' }, 12, 15), 'A missing-in-action date must not be treated as a confirmed death anniversary');
assert('Test 0 (Life status)', getLifespanLabel({ birthYear: 1904, deathDate: '1944-12-15', deathDatePrecision: 'presumed-day' }) === '1904 – mất tích từ 15/12/1944; ngày mất chưa xác định', 'A missing-in-action date must be labeled as missing rather than as a confirmed death date');
assert('Test 0 (Life status)', getAgeAtDeath({ birthYear: 1940, birthDate: '1940-12-01', deathDate: '2005-12-10' }) === 65, 'Exact age at death must account for whether the birthday passed');
assert('Test 0 (Life status)', getAgeAtDeath({ birthYear: 1940, birthDate: '1940-12-01', deathDate: '2005' }) === null, 'Do not estimate age at death from a year-only date');
assert('Test 0 (Life status)', getAgeAtDeath({ birthYear: 1904, birthDate: '1904-03-01', deathDate: '1944-12-15', deathDatePrecision: 'presumed-day' }) === null, 'Do not calculate an exact age from a missing-in-action date');
const glennMiller = ALL_PEOPLE.find((person) => person.id === 'glenn-miller');
assert('Test 0 (Life status)', Boolean(glennMiller && getLifespanLabel(glennMiller).includes('mất tích từ') && !getLifespanLabel(glennMiller).includes('nay')), 'Glenn Miller must not appear as living or have a confirmed death anniversary');

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
  // BV-017 My Tam: exact artist catalog page captured from the France-based Qobuz music service.
  'Q1993589': ['https://www.qobuz.com/us-en/interpreter/my-tam/2642090'],
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

  const isOldPerson = OLD_30_PERSON_IDS.has(p.id)
    && (p.verifiedAt === '2026-10-03' || BV017_JAN1_REVIEWED_IDS.has(p.id) || BV017_JAN2_REVIEWED_IDS.has(p.id) || BV017_JAN3_REVIEWED_IDS.has(p.id) || (BV017_JAN4_REVIEWED_IDS.has(p.id) || BV017_JAN5_REVIEWED_IDS.has(p.id) || BV017_JAN6_REVIEWED_IDS.has(p.id) || BV017_JAN7_REVIEWED_IDS.has(p.id) || BV017_JAN8_REVIEWED_IDS.has(p.id) || BV017_JAN9_REVIEWED_IDS.has(p.id) || BV017_JAN10_REVIEWED_IDS.has(p.id) || BV017_JAN11_REVIEWED_IDS.has(p.id) || BV017_JAN12_REVIEWED_IDS.has(p.id) || BV017_JAN13_REVIEWED_IDS.has(p.id) || BV017_JAN14_REVIEWED_IDS.has(p.id) || BV017_JAN15_REVIEWED_IDS.has(p.id) || BV017_JAN16_REVIEWED_IDS.has(p.id) || BV017_JAN17_REVIEWED_IDS.has(p.id) || BV017_JAN18_REVIEWED_IDS.has(p.id) || BV017_JAN19_REVIEWED_IDS.has(p.id) || BV017_JAN20_REVIEWED_IDS.has(p.id)));
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
      'oscars.org', 'rockhall.com', 'songhall.org', 'ecb.europa.eu', 'parliament.uk', 'royal.uk',
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
      'awm.gov.au', 'pkf.org', 'archives-nationales.culture.gouv.fr', 'prlib.ru', 'paralymp.ru', 'tgliamz.ru',
      'ictp.it', 'fdrlibrary.org', 'sok.riksarkivet.se', 'nationalacademies.org', 'oeaw.ac.at',
      'austria.info', 'koninklijkhuis.nl', 'annefrank.org', 'yadvashem-france.org', 'ajpn.org',
      'tempestjapan.com', 'yhent.co.kr', 'ncapec.org', 'ocagames.com', 'the-afc.com',
      'jebentertainment.jp', 'fide.com', 'vnanet.vn', 'vatican.va', 'royalsociety.org', 'bfi.org.uk',
      'enciklopedija.hr', 'lzmk.hr', 'anthonyburgess.org', 'kunaicho.go.jp', 'treccani.it', 'anu.edu.au',
      'badmintonasia.org', 'jamesjoyce.ie', 'ireland.ie', 'president.ie', 'rte.ie', 'icc-cricket.com', 'aynrand.org', 'dallassymphony.org',
      'mendelssohn-stiftung.de', 'mnhs.org', 'vle.lt', 'uefa.com', 'realmadrid.com', 'baseballhall.org',
      'dickensmuseum.com', 'lauraingallswilderhome.com', 'unesco.org', 'afi.com', 'sonymusic.co.jp',
      'adk.de', 'invent.org', 'universalmusic.fr', 'bbaw.de', 'prlib.ru', 'snl.no', 'musees-nationaux-alpesmaritimes.fr', 'sciencemuseumgroup.org.uk', 'millercenter.org', 'lex.dk', 'kongehuset.dk', 'televisionacademy.com', 'pen-international.org', 'safeguarddefenders.com', 'english-heritage.org.uk', 'theworldgames.org',
      'canadaswalkoffame.com', 'astridlindgren.com', 'worldathletics.org', 'uzathletics.uz', 'idref.fr', 'datos.bne.es', 'deutsche-kinemathek.de',
      // BV-017 pilot publishers: foundations, public archives, universities, and official organizations.
      'bloomberg.org', 'ndl.go.jp', 'fhcm.paris', 'qdnd.vn', 'group.softbank', 'musabi.ac.jp', 'yogananda.org', 'bafta.org',
      'giaophanhatinh.org', 'fondazionepirelli.org', 'gazzettaufficiale.it',
      'computer.org', 'pas.va', 'artplatform.go.jp', 'arttowermito.or.jp',
      'chinhphu.vn', 'baochinhphu.vn',
      'fundacionadp.edu.pe',
      'japan.kantei.go.jp',
      'iima.ac.in', 'iitk.ac.in', 'uni-muenchen.de', 'alvaraalto.fi', 'thebodyshop.in', 'ecnu.edu.cn', 'ygfamily.com',
    ];
    const hasInstitutionalSource = independentSources.some((u) => {
      const h = getUrlHostname(u);
      return h.endsWith('.gov') || h.endsWith('.gov.vn') || h.endsWith('.edu') ||
        h.endsWith('.edu.vn') || h.endsWith('.ac.uk') ||
        institutionalHosts.some((domain) => h === domain || h.endsWith(`.${domain}`)) ||
        (VERIFIED_FOREIGN_VN_DOCUMENTS[p.wikidataId || '']?.includes(u) ?? false);
    });
    const reviewedPublisherExceptions: Readonly<Record<string, readonly string[]>> = {
      // Exact BV-017 January 12 sources reviewed against these identities.
      'Q45765': ['https://jacklondonpark.com/jack-london-books/'],
      'Q134798': ['https://www.shinchosha.co.jp/harukimurakami/author.html'],
      'Q151830': ['https://www.livenation.com/artist/K8vZ9171qI0/melanie-c-events'],
      'Q122127': ['https://www.smithsonianmag.com/smithsonian-institution/paddington-bear-turns-sixty-180970439/'],
      // Two independently edited foreign obituaries carry the exact full DOB for this Vietnamese former head of state.
      'Q318458': [
        'https://www.theguardian.com/world/2024/jul/30/nguyen-phu-trong-obituary',
        'https://www.lemonde.fr/en/obituaries/article/2024/07/20/nguyen-phu-trong-symbol-of-vietnamese-authoritarianism-dies-in-hanoi_6691391_15.html',
      ],
      // Exact B011 pages with direct DOB matches; Rule AF separately requires and locks both sources per profile.
      'Q1159527': ['https://classical.music.apple.com/us/artist/dang-thai-son-1958'],
      'Q5588': ['https://www.museofridakahlo.org.mx/frida/?lang=en'],
      'Q40026': ['https://www.theguardian.com/film/2016/feb/24/sylvester-stallone-profile-creed-rocky'],
      'Q15873': ['https://www.queenonline.com/brian_may'],
      'Q7939157': ['https://www.paralympic.org/sites/default/files/2025-10/Tokyo%202020%20Paralympic%20Games%20-%20Para%20Swimming%20Results.pdf'],
      'Q201825': ['https://www.tff.org/Default.aspx?kisiId=2294024&pageId=526'],
      // Exact B012 direct DOB pages, each paired and locked with a second publisher in Rule AG.
      'Q83566': ['https://s3-us-west-1.amazonaws.com/isabelallende.com/assets/bio/Bio_Isabel-en.pdf'],
      'Q57410': ['https://m.knesset.gov.il/en/about/lexicon/pages/peresshimon.aspx'],
      'Q483118': ['https://www.biography.com/actors/ben-affleck'],
      'Q16977': ['https://www.biography.com/political-figures/deng-xiaoping'],
      'Q483907': ['https://www.biography.com/actors/jack-black'],
      'Q48410': ['https://www.biography.com/actors/richard-gere'],
      'Q5215950': ['https://www.cerezo.jp/team/players/archive/dang_van_lam-2/'],
      'Q7189919': ['https://music.apple.com/us/artist/ph%E1%BA%A1m-qu%E1%BB%B3nh-anh/1757573861'],
      // Exact B013 athlete pages, locked to the reviewed independent publisher pairs in Rule AH.
      'Q22162708': ['https://fbref.com/en/players/4433e9ea/Djo-Hung-Dung'],
      'Q4481043': ['https://fbref.com/en/players/60a6cd31/Pham-Thanh-Luong'],
      'Q56513413': ['https://www.transfermarkt.us/filip-nguyen/profil/spieler/202914'],
      'Q25999788': ['https://www.transfermarkt.com/duc-chinh-ha/profil/spieler/508254'],
      'Q19281994': ['https://www.transfermarkt.de/duy-manh-do/profil/spieler/354784'],
      // B014 reviewed exact DOB pages; Rule AI separately locks each page into its independent source pair.
      'Q173139': ['https://www.skysports.com/football/player/74946/george-weah'],
      'Q464318': ['https://inc.in/leadership/past-party-presidents/annie-besant'],
      'Q1001': ['https://www.gandhismriti.gov.in/more/chronology-mahatma-gandhi'],
      'Q19892123': ['https://www.transfermarkt.com/tien-dung-bui/profil/spieler/407524'],
      'Q133050': ['https://www.biography.com/actors/susan-sarandon'],
      'Q184785': ['https://www.biography.com/authors-writers/anne-rice'],
      'Q36233': ['https://www.hrad.cz/en/president-of-the-cr/former-presidents/vaclav-havel'],
      'Q4724': ['https://www.modernamuseet.se/stockholm/en/exhibitions/moment-le-corbusier/biography/'],
      'Q102124': ['https://www.biography.com/actors/sigourney-weaver'],
      'Q175535': ['https://www.mattdamon.com/bio.html'],
      'Q7934': ['https://www.oregonencyclopedia.org/articles/herbert-frank-and-the-dune-series/'],
      'Q1203': ['https://www.beatlesstory.com/blog/9-dream-john-lennon-and-numerology/'],
      'Q310913': ['https://plumvillage.org/about/thich-nhat-hanh/biography/thich-nhat-hanh-full-biography'],
      'Q9570': ['https://www.biography.com/actor/amitabh-bachchan'],
      'Q129591': ['https://www.biography.com/actors/hugh-jackman'],
      'Q939': ['https://mapa.arquivonacional.gov.br/index.php/component/content/article/395-pedro-de-alcantara-francisco-antonio-joao-carlos-xavier-de-paula-miguel-gabriel-rafael-joaquim-jose-gonzaga-pascoal-cipriano-serafim-de-braganca-e-bourbon-d-pedro-i?Itemid=148&catid=70'],
      'Q7416': ['https://www.margaretthatcher.org/archive/MTobit'],
      'Q9513': ['https://www.presidentofindia.gov.in/dr-apj-abdul-kalam-profile'],
      'Q30875': ['https://www.dib.ie/biography/wilde-oscar-fingal-oflahertie-a9036'],
      'Q6538': ['https://www.hdg.de/lemo/biografie/guenter-grass.html'],
      'Q5608': ['https://www.universal-music.co.jp/eminem/biography/'],
      'Q80596': ['https://www.chipublib.org/arthur-miller-biography/'],
      'Q5921': ['https://www.chuckberry.com/about'],
      'Q54545': ['https://www.wtatennis.com/legends/140007/Martina_Navratilova'],
      'Q209641': ['https://johnlecarre.com/biography/'],
      'Q190220': ['https://sf-encyclopedia.com/entry/pullman_philip'],
      'Q12897': ['https://www.cbf.com.br/selecao-brasileira/noticias/selecao-masculina/campo-de-manha-academia-a-tarde/eterno-pele-completaria-85-anos-nesta-quin-ta-feira'],
      'Q192682': ['https://www.canadaswalkoffame.com/inductees/ryan-reynolds/'],
      'Q160726': ['https://www.biography.com/filmmaker/ang-lee'],
      'Q266613': ['https://www.skysports.com/wayne-rooney'],
      'Q927550': ['https://www.aph.gov.au/~/media/05%20About%20Parliament/54%20Parliamentary%20Depts/544%20Parliamentary%20Library/Handbook/handbook_45th_parliament.pdf'],
      'Q2038': ['https://www.elysee.fr/francois-mitterrand'],
      'Q188492': ['https://www.biography.com/movies-tv/seth-macfarlane'],
      'Q25014': ['https://calperformances.org/learn/program_notes/2005/pn_Cleese.pdf'],
      'Q5284': ['https://www.biography.com/business-leaders/bill-gates'],
      'Q40523': ['https://www.biography.com/actors/julia-roberts'],
      'Q101797': ['https://www.biography.com/actors/winona-ryder'],
      'Q4465': ['https://www.biography.com/movies-tv/peter-jackson'],
      'Q47780': ['https://www.cambridge.org/core/services/aop-cambridge-core/content/view/22231C3B20D5E38E63CD579577FC7F21/S1359135516000348a.pdf/zaha-hadid-1950-2016.pdf'],
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
  !(OLD_30_PERSON_IDS.has(p.id) && (p.verifiedAt === '2026-10-03' || BV017_JAN1_REVIEWED_IDS.has(p.id) || BV017_JAN2_REVIEWED_IDS.has(p.id) || BV017_JAN3_REVIEWED_IDS.has(p.id) || (BV017_JAN4_REVIEWED_IDS.has(p.id) || BV017_JAN5_REVIEWED_IDS.has(p.id) || BV017_JAN6_REVIEWED_IDS.has(p.id) || BV017_JAN7_REVIEWED_IDS.has(p.id) || BV017_JAN8_REVIEWED_IDS.has(p.id) || BV017_JAN9_REVIEWED_IDS.has(p.id) || BV017_JAN10_REVIEWED_IDS.has(p.id) || BV017_JAN11_REVIEWED_IDS.has(p.id) || BV017_JAN12_REVIEWED_IDS.has(p.id) || BV017_JAN13_REVIEWED_IDS.has(p.id) || BV017_JAN14_REVIEWED_IDS.has(p.id) || BV017_JAN15_REVIEWED_IDS.has(p.id) || BV017_JAN16_REVIEWED_IDS.has(p.id) || BV017_JAN17_REVIEWED_IDS.has(p.id) || BV017_JAN18_REVIEWED_IDS.has(p.id) || BV017_JAN19_REVIEWED_IDS.has(p.id) || BV017_JAN20_REVIEWED_IDS.has(p.id)))) &&
  !BV017_EXPANSION_NEW_IDS.has(p.id)
  && !BV017_JAN1_NEW_IDS.has(p.id)
  && !BV017_JAN2_NEW_IDS.has(p.id)
  && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id)
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
// Rule AD: B009 exact May additions, source hosts, and reviewed foreign DOB sources.
// ------------------------------------------------------------
console.log('Checking Rule AD: B009 exact profile set, May coverage, balance, and reviewed sources...');
const B009_APPROVED_PROFILES: Readonly<Record<string, { wikidataId: string; birthDate: string }>> = {
  "arthur-wellesley-1st-duke-of-wellington": {
    "wikidataId": "Q131691",
    "birthDate": "1769-05-01"
  },
  "honore-de-balzac": {
    "wikidataId": "Q9711",
    "birthDate": "1799-05-20"
  },
  "ralph-waldo-emerson": {
    "wikidataId": "Q48226",
    "birthDate": "1803-05-25"
  },
  "robert-browning": {
    "wikidataId": "Q233265",
    "birthDate": "1812-05-07"
  },
  "soren-kierkegaard": {
    "wikidataId": "Q6512",
    "birthDate": "1813-05-05"
  },
  "richard-wagner": {
    "wikidataId": "Q1511",
    "birthDate": "1813-05-22"
  },
  "karl-marx": {
    "wikidataId": "Q9061",
    "birthDate": "1818-05-05"
  },
  "victoria": {
    "wikidataId": "Q9439",
    "birthDate": "1819-05-24"
  },
  "walt-whitman": {
    "wikidataId": "Q81438",
    "birthDate": "1819-05-31"
  },
  "florence-nightingale": {
    "wikidataId": "Q37103",
    "birthDate": "1820-05-12"
  },
  "thomas-henry-huxley": {
    "wikidataId": "Q184366",
    "birthDate": "1825-05-04"
  },
  "henry-dunant": {
    "wikidataId": "Q12091",
    "birthDate": "1828-05-08"
  },
  "johannes-brahms": {
    "wikidataId": "Q7294",
    "birthDate": "1833-05-07"
  },
  "santiago-ramon-y-cajal": {
    "wikidataId": "Q150526",
    "birthDate": "1852-05-01"
  },
  "sigmund-freud": {
    "wikidataId": "Q9215",
    "birthDate": "1856-05-06"
  },
  "l-frank-baum": {
    "wikidataId": "Q207544",
    "birthDate": "1856-05-15"
  },
  "ronald-ross": {
    "wikidataId": "Q102034",
    "birthDate": "1857-05-13"
  },
  "arthur-conan-doyle": {
    "wikidataId": "Q35610",
    "birthDate": "1859-05-22"
  },
  "theodor-herzl": {
    "wikidataId": "Q44003",
    "birthDate": "1860-05-02"
  },
  "j-m-barrie": {
    "wikidataId": "Q81796",
    "birthDate": "1860-05-09"
  },
  "willem-einthoven": {
    "wikidataId": "Q189488",
    "birthDate": "1860-05-21"
  },
  "erik-satie": {
    "wikidataId": "Q187192",
    "birthDate": "1866-05-17"
  },
  "bertrand-russell": {
    "wikidataId": "Q33760",
    "birthDate": "1872-05-18"
  },
  "douglas-fairbanks": {
    "wikidataId": "Q104127",
    "birthDate": "1883-05-23"
  },
  "harry-s-truman": {
    "wikidataId": "Q11613",
    "birthDate": "1884-05-08"
  },
  "alfonso-xiii": {
    "wikidataId": "Q18363",
    "birthDate": "1886-05-17"
  },
  "par-lagerkvist": {
    "wikidataId": "Q93137",
    "birthDate": "1891-05-23"
  },
  "fred-astaire": {
    "wikidataId": "Q100937",
    "birthDate": "1899-05-10"
  },
  "gary-cooper": {
    "wikidataId": "Q93957",
    "birthDate": "1901-05-07"
  },
  "alfred-kastler": {
    "wikidataId": "Q71023",
    "birthDate": "1902-05-03"
  },
  "bob-hope": {
    "wikidataId": "Q94081",
    "birthDate": "1903-05-29"
  },
  "salvador-dali": {
    "wikidataId": "Q5577",
    "birthDate": "1904-05-11"
  },
  "henry-fonda": {
    "wikidataId": "Q19155",
    "birthDate": "1905-05-16"
  },
  "katharine-hepburn": {
    "wikidataId": "Q56016",
    "birthDate": "1907-05-12"
  },
  "laurence-olivier": {
    "wikidataId": "Q55245",
    "birthDate": "1907-05-22"
  },
  "john-wayne": {
    "wikidataId": "Q40531",
    "birthDate": "1907-05-26"
  },
  "james-stewart": {
    "wikidataId": "Q102462",
    "birthDate": "1908-05-20"
  },
  "john-bardeen": {
    "wikidataId": "Q949",
    "birthDate": "1908-05-23"
  },
  "ian-fleming": {
    "wikidataId": "Q82104",
    "birthDate": "1908-05-28"
  },
  "benny-goodman": {
    "wikidataId": "Q46755",
    "birthDate": "1909-05-30"
  },
  "dorothy-hodgkin": {
    "wikidataId": "Q7487",
    "birthDate": "1910-05-12"
  },
  "patrick-white": {
    "wikidataId": "Q129187",
    "birthDate": "1912-05-28"
  },
  "orson-welles": {
    "wikidataId": "Q24829",
    "birthDate": "1915-05-06"
  },
  "john-f-kennedy": {
    "wikidataId": "Q9696",
    "birthDate": "1917-05-29"
  },
  "john-paul-ii": {
    "wikidataId": "Q989",
    "birthDate": "1920-05-18"
  },
  "satyajit-ray": {
    "wikidataId": "Q8873",
    "birthDate": "1921-05-02"
  },
  "sophie-scholl": {
    "wikidataId": "Q76972",
    "birthDate": "1921-05-09"
  },
  "andrei-sakharov": {
    "wikidataId": "Q997",
    "birthDate": "1921-05-21"
  },
  "christopher-lee": {
    "wikidataId": "Q180338",
    "birthDate": "1922-05-27"
  },
  "henry-kissinger": {
    "wikidataId": "Q66107",
    "birthDate": "1923-05-27"
  },
  "malcolm-x": {
    "wikidataId": "Q43303",
    "birthDate": "1925-05-19"
  },
  "david-attenborough": {
    "wikidataId": "Q183337",
    "birthDate": "1926-05-08"
  },
  "agnes-varda": {
    "wikidataId": "Q229990",
    "birthDate": "1928-05-30"
  },
  "audrey-hepburn": {
    "wikidataId": "Q42786",
    "birthDate": "1929-05-04"
  },
  "peter-higgs": {
    "wikidataId": "Q192112",
    "birthDate": "1929-05-29"
  },
  "clint-eastwood": {
    "wikidataId": "Q43203",
    "birthDate": "1930-05-31"
  },
  "james-brown": {
    "wikidataId": "Q5950",
    "birthDate": "1933-05-03"
  },
  "steven-weinberg": {
    "wikidataId": "Q179282",
    "birthDate": "1933-05-03"
  },
  "alexey-leonov": {
    "wikidataId": "Q154269",
    "birthDate": "1934-05-30"
  },
  "dennis-hopper": {
    "wikidataId": "Q102711",
    "birthDate": "1936-05-17"
  },
  "madeleine-albright": {
    "wikidataId": "Q174438",
    "birthDate": "1937-05-15"
  },
  "ian-mckellen": {
    "wikidataId": "Q170510",
    "birthDate": "1939-05-25"
  },
  "joseph-brodsky": {
    "wikidataId": "Q862",
    "birthDate": "1940-05-24"
  },
  "nora-ephron": {
    "wikidataId": "Q214677",
    "birthDate": "1941-05-19"
  },
  "bob-dylan": {
    "wikidataId": "Q392",
    "birthDate": "1941-05-24"
  },
  "george-lucas": {
    "wikidataId": "Q38222",
    "birthDate": "1944-05-14"
  },
  "mary-robinson": {
    "wikidataId": "Q188214",
    "birthDate": "1944-05-21"
  },
  "claudia-goldin": {
    "wikidataId": "Q1097475",
    "birthDate": "1946-05-14"
  },
  "cher": {
    "wikidataId": "Q12003",
    "birthDate": "1946-05-20"
  },
  "billy-joel": {
    "wikidataId": "Q194333",
    "birthDate": "1949-05-09"
  },
  "stevie-wonder": {
    "wikidataId": "Q714",
    "birthDate": "1950-05-13"
  },
  "sally-ride": {
    "wikidataId": "Q49285",
    "birthDate": "1951-05-26"
  },
  "pierce-brosnan": {
    "wikidataId": "Q81520",
    "birthDate": "1953-05-16"
  },
  "bono": {
    "wikidataId": "Q834621",
    "birthDate": "1960-05-10"
  },
  "george-clooney": {
    "wikidataId": "Q23844",
    "birthDate": "1961-05-06"
  },
  "janet-jackson": {
    "wikidataId": "Q131324",
    "birthDate": "1966-05-16"
  },
  "frederik-x-of-denmark": {
    "wikidataId": "Q1004037",
    "birthDate": "1968-05-26"
  },
  "kylie-minogue": {
    "wikidataId": "Q11998",
    "birthDate": "1968-05-28"
  },
  "dennis-bergkamp": {
    "wikidataId": "Q185389",
    "birthDate": "1969-05-10"
  },
  "cate-blanchett": {
    "wikidataId": "Q80966",
    "birthDate": "1969-05-14"
  },
  "tina-fey": {
    "wikidataId": "Q14540",
    "birthDate": "1970-05-18"
  },
  "david-beckham": {
    "wikidataId": "Q10520",
    "birthDate": "1975-05-02"
  },
  "cillian-murphy": {
    "wikidataId": "Q202589",
    "birthDate": "1976-05-25"
  },
  "colin-farrell": {
    "wikidataId": "Q172035",
    "birthDate": "1976-05-31"
  },
  "pham-doan-trang": {
    "wikidataId": "Q51120734",
    "birthDate": "1978-05-27"
  },
  "andrea-pirlo": {
    "wikidataId": "Q43926",
    "birthDate": "1979-05-19"
  },
  "robert-pattinson": {
    "wikidataId": "Q36767",
    "birthDate": "1986-05-13"
  },
  "cesc-fabregas": {
    "wikidataId": "Q17499",
    "birthDate": "1987-05-04"
  },
  "adele": {
    "wikidataId": "Q23215",
    "birthDate": "1988-05-05"
  },
  "duong-thuy-vi": {
    "wikidataId": "Q18415820",
    "birthDate": "1993-05-11"
  },
  "que-ngoc-hai": {
    "wikidataId": "Q18637770",
    "birthDate": "1993-05-15"
  },
  "luong-thi-thu-thuong": {
    "wikidataId": "Q94977310",
    "birthDate": "2000-05-01"
  },
  "khuat-van-khang": {
    "wikidataId": "Q113005949",
    "birthDate": "2003-05-11"
  }
};
const B009_APPROVED_QIDS = new Set(Object.values(B009_APPROVED_PROFILES).map((x) => x.wikidataId));
const B009_NEW_PEOPLE = ALL_PEOPLE.filter((p) => p.birthMonth === 5 && p.verifiedAt === '2026-10-05');
const B009_NEW_IDS = new Set(B009_NEW_PEOPLE.map((p) => p.id));
assert('Rule AD', B009_NEW_PEOPLE.length === 93, `B009 requires exactly 93 new May profiles, found ${B009_NEW_PEOPLE.length}`);
assert('Rule AD', Object.keys(B009_APPROVED_PROFILES).length === 93 && B009_APPROVED_QIDS.size === 93 && B009_NEW_IDS.size === 93, 'B009 approved profile IDs must be exact and unique');
assert('Rule AD', B009_NEW_PEOPLE.every((p) => Object.hasOwn(B009_APPROVED_PROFILES, p.id)), 'B009 additions must match only the approved ID list');
assert('Rule AD', B009_NEW_PEOPLE.length === Object.keys(B009_APPROVED_PROFILES).length, 'B009 must contain every approved ID exactly once');
for (const p of B009_NEW_PEOPLE) {
  const expected = B009_APPROVED_PROFILES[p.id];
  assert('Rule AD', Boolean(expected), `Unapproved B009 ID: ${p.id}`);
  if (expected) {
    assert('Rule AD', p.wikidataId === expected.wikidataId, `B009 ${p.id} expected ${expected.wikidataId}, got ${p.wikidataId}`);
    assert('Rule AD', p.birthDate === expected.birthDate, `B009 ${p.id} expected DOB ${expected.birthDate}, got ${p.birthDate}`);
  }
  assert('Rule AD', p.birthMonth === 5 && /^\d{4}-05-\d{2}$/.test(p.birthDate), `B009 ${p.id} must be a May record`);
  assert('Rule AD', p.birthYear === Number(p.birthDate.slice(0,4)) && p.birthMonth === Number(p.birthDate.slice(5,7)) && p.birthDay === Number(p.birthDate.slice(8,10)), `B009 ${p.id} split date fields must match birthDate`);
}
assert('Rule AD', new Set(B009_NEW_PEOPLE.map((p) => p.wikidataId)).size === 93, 'B009 Wikidata IDs must be unique');
for (let day=1; day<=31; day++) {
  const count = B009_NEW_PEOPLE.filter((p) => p.birthDay === day).length;
  assert('Rule AD', count === 3, `B009 May ${day} must have exactly 3 new profiles, found ${count}`);
}
const b009Vietnamese = B009_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AD', b009Vietnamese.length === 5, `B009 Vietnamese count must be 5, found ${b009Vietnamese.length}`);
assert('Rule AD', b009Vietnamese.length / B009_NEW_PEOPLE.length >= 0.05, `B009 Vietnamese share must be at least 5%; found ${b009Vietnamese.length}/${B009_NEW_PEOPLE.length}`);
const B012_NEW_IDS = new Set([
  'herman-melville',
  'jean-baptiste-lamarck',
  'pierre-bourdieu',
  'james-baldwin',
  'tom-brady',
  'stanley-baldwin',
  'martin-sheen',
  'percy-bysshe-shelley',
  'knut-hamsun',
  'william-rowan-hamilton',
  'neil-armstrong',
  'guy-de-maupassant',
  'john-huston',
  'andy-warhol',
  'alexander-fleming',
  'alfred-tennyson',
  'mata-hari',
  'ralph-bunche',
  'abebe-bikila',
  'paul-dirac',
  'emiliano-zapata',
  'ernest-lawrence',
  'jean-piaget',
  'amedeo-avogadro',
  'tove-jansson',
  'herbert-hoover',
  'antonio-banderas',
  'jorge-amado',
  'pervez-musharraf',
  'aaron-klug',
  'jan-palach',
  'francois-hollande',
  'erwin-schrodinger',
  'pete-sampras',
  'fidel-castro',
  'alfred-hitchcock',
  'hans-christian-orsted',
  'wim-wenders',
  'steve-martin',
  'walter-scott',
  'madonna',
  'charles-bukowski',
  'gabriel-lippmann',
  'robert-de-niro',
  'herta-muller',
  'thierry-henry',
  'roman-polanski',
  'robert-redford',
  'luc-montagnier',
  'bill-clinton',
  'coco-chanel',
  'benjamin-harrison',
  'rajiv-gandhi',
  'salvatore-quasimodo',
  'usain-bolt',
  'augustin-louis-cauchy',
  'wilt-chamberlain',
  'claude-debussy',
  'ray-bradbury',
  'kobe-bryant',
  'gene-kelly',
  'giuseppe-meazza',
  'jorge-luis-borges',
  'paulo-coelho',
  'sean-connery',
  'tim-burton',
  'leonard-bernstein',
  'antoine-lavoisier',
  'guillaume-apollinaire',
  'georg-wilhelm-friedrich-hegel',
  'theodore-dreiser',
  'jose-eduardo-dos-santos',
  'paul-martin',
  'michael-jackson',
  'ingrid-bergman',
  'charlie-parker',
  'ernest-rutherford',
  'warren-buffett',
  'mary-shelley',
  'maria-montessori',
  'isabel-allende',
  'shimon-peres',
  'ben-affleck',
  'luong-cuong',
  'dang-tieu-binh',
  'jack-black',
  'richard-gere',
  'hermann-von-helmholtz',
  'dang-van-lam',
  'nguyen-dinh-bac',
  'pham-quynh-anh',
  'quach-cong-lich',
  'katherine-johnson',
]);
const B014_NEW_IDS = new Set([
  'jimmy-carter',
  'george-weah',
  'annie-besant',
  'mahatma-gandhi',
  'sting',
  'bui-tien-dung',
  'zlatan-ibrahimovic',
  'louis-aragon',
  'gore-vidal',
  'buster-keaton',
  'susan-sarandon',
  'anne-rice',
  'vaclav-havel',
  'denis-diderot',
  'robert-h-goddard',
  'le-corbusier',
  'thor-heyerdahl',
  'hoang-xuan-vinh',
  'niels-bohr',
  'desmond-tutu',
  'henry-a-wallace',
  'sigourney-weaver',
  'matt-damon',
  'frank-herbert',
  'john-lennon',
  'leopold-sedar-senghor',
  'camille-saint-saens',
  'fridtjof-nansen',
  'harold-pinter',
  'xherdan-shaqiri',
  'eleanor-roosevelt',
  'thich-nhat-hanh',
  'amitabh-bachchan',
  'hugh-jackman',
  'pedro-i-cua-brasil',
  'edith-stein',
  'margaret-thatcher',
  'alexandria-ocasio-cortez',
  'paul-simon',
  'dwight-d-eisenhower',
  'roger-moore',
  'usher',
  'friedrich-nietzsche',
  'a-p-j-abdul-kalam',
  'italo-calvino',
  'oscar-wilde',
  'gunter-grass',
  'phan-thi-ha-thanh',
  'eminem',
  'arthur-miller',
  'kimi-raikkonen',
  'henri-bergson',
  'chuck-berry',
  'martina-navratilova',
  'subrahmanyan-chandrasekhar',
  'john-le-carre',
  'philip-pullman',
  'snoop-dogg',
  'arthur-rimbaud',
  'nguyen-tien-linh',
  'alfred-nobel',
  'ursula-k-le-guin',
  'carrie-fisher',
  'doris-lessing',
  'franz-liszt',
  'catherine-deneuve',
  'pele',
  'ryan-reynolds',
  'ang-lee',
  'wayne-rooney',
  'malcolm-turnbull',
  'kevin-kline',
  'pablo-picasso',
  'katy-perry',
  'georges-bizet',
  'hillary-clinton',
  'francois-mitterrand',
  'seth-macfarlane',
  'theodore-roosevelt',
  'sylvia-plath',
  'john-cleese',
  'bill-gates',
  'jonas-salk',
  'julia-roberts',
  'ellen-johnson-sirleaf',
  'winona-ryder',
  'edwin-van-der-sar',
  'diego-maradona',
  'paul-valery',
  'zoran-milanovic',
  'peter-jackson',
  'marcus-rashford',
  'zaha-hadid',
]);
const b010CycleDatedProfiles = ALL_PEOPLE.filter((p) => p.birthMonth === 6 && p.verifiedAt === '2026-10-06');
const b009BaselinePeople = ALL_PEOPLE.filter((p) => p.birthMonth !== 7 && !(p.birthMonth === 6 && p.verifiedAt === '2026-10-06') && !B012_NEW_IDS.has(p.id) && !B013_NEW_IDS.has(p.id) && !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
assert('Rule AD', b009BaselinePeople.length === 478, `B009 baseline must remain 478 after excluding B010 and B011 additions, found ${b009BaselinePeople.length}`);
assert('Rule AD', HISTORY_EVENTS.length === 4, `B009 must preserve all 4 events, found ${HISTORY_EVENTS.length}`);

for (const p of B009_NEW_PEOPLE) {
  const nonWiki = (p.sourceUrls || []).filter((u) => {
    const h = getUrlHostname(u);
    return h && !h.endsWith('wikipedia.org') && !h.endsWith('wikidata.org') && !h.endsWith('wikimedia.org');
  });
  const hosts = new Set(nonWiki.map(getUrlHostname));
  assert('Rule AD', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${p.wikidataId}`) === true, `B009 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AD', hosts.size >= 2, `B009 ${p.id} needs two independent non-Wikidata hosts, found ${hosts.size}`);
}

const B009_FOREIGN_VN_DOB_SOURCES: Readonly<Record<string, readonly {url:string; publisherCountry:string}[]>> = {
  "Q51120734": [
    {
      "url": "https://www.pen-international.org/cases/pham-doan-trang",
      "publisherCountry": "GB"
    },
    {
      "url": "https://safeguarddefenders.com/sites/default/files/pdf/MAGNITSKY%20VN%20Single%20paging.pdf",
      "publisherCountry": "ES"
    }
  ],
  "Q18415820": [
    {
      "url": "https://www.ocagames.com/HZ_Info/AG2022-/en/results/wushu/athlete-profile-n2029194-duong-thuy-vi.htm",
      "publisherCountry": "KW"
    },
    {
      "url": "https://swog2013.theworldgames.org/hide/es/0/Pdf/GetResultbookPdf?filename=Resultbook%2FWushu.pdf",
      "publisherCountry": "CH"
    }
  ],
  "Q18637770": [
    {
      "url": "https://assets.the-afc.com/migration/a/f/afc-asian-cup-uae-2019-technical-report-and-statistics",
      "publisherCountry": "MY"
    },
    {
      "url": "https://www.fotmob.com/en-GB/players/504588/ngoc-hai-que",
      "publisherCountry": "NO"
    }
  ],
  "Q94977310": [
    {
      "url": "https://www.espn.co.uk/football/player/_/id/343026/luong-thi-thu-thuong",
      "publisherCountry": "GB"
    },
    {
      "url": "https://www.ocagames.com/HZ_Info/AG2022-/resAG2022-/pdf/AG2022-/FBL/AG2022-_FBL_C51_FBLWTEAM11------------GPD-000300--.pdf",
      "publisherCountry": "KW"
    }
  ],
  "Q113005949": [
    {
      "url": "https://www.ocagames.com/HZ_Info/AG2022-/resAG2022-/pdf/AG2022-/FBL/AG2022-_FBL_C51_FBLMTEAM11------------GPB-000100--.pdf",
      "publisherCountry": "KW"
    },
    {
      "url": "https://www.fotmob.com/en-GB/players/1478892/khuat-van-khang",
      "publisherCountry": "NO"
    }
  ]
};
function isApprovedB009ForeignDobSource(qid: string, url: string): boolean {
  return B009_FOREIGN_VN_DOB_SOURCES[qid]?.some((source) => source.url === url) ?? false;
}
for (const [qid, sources] of Object.entries(B009_FOREIGN_VN_DOB_SOURCES)) {
  for (const source of sources) {
    const host = getUrlHostname(source.url);
    assert('Rule AD source metadata', source.publisherCountry !== 'VN' && Boolean(host) && !host.endsWith('.vn'), `B009 Vietnamese DOB publisher must be outside Vietnam: ${source.url}`);
    assert('Rule AD source positive', isApprovedB009ForeignDobSource(qid, source.url), `Reviewed foreign source must pass: ${source.url}`);
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource('Q0', source.url), `Foreign source cannot approve a different QID: ${source.url}`);
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource(qid, `${source.url}#unreviewed`), 'Unreviewed fragment must fail');
    const queryVariant = source.url.includes('?') ? `${source.url}&unreviewed=1` : `${source.url}?unreviewed=1`;
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource(qid, queryVariant), 'Unreviewed query variant must fail');
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource(qid, new URL('/unreviewed', source.url).href), 'Unreviewed path must fail');
    const spoof = new URL(source.url); spoof.hostname += '.evil.example';
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource(qid, spoof.href), 'Lookalike host must fail');
    assert('Rule AD source negative', !isApprovedB009ForeignDobSource(qid, 'not-a-url'), 'Malformed URL must fail');
  }
}
for (const p of b009Vietnamese) {
  const sources = B009_FOREIGN_VN_DOB_SOURCES[p.wikidataId || ''] || [];
  assert('Rule AD foreign DOB', sources.length >= 2, `B009 ${p.id} needs two reviewed foreign DOB URLs`);
  for (const source of sources) {
    assert('Rule AD foreign DOB', (p.sourceUrls || []).includes(source.url), `B009 ${p.id} must include reviewed DOB source ${source.url}`);
  }
  for (const url of p.sourceUrls || []) {
    const host = getUrlHostname(url);
    if (host === 'wikidata.org' || host?.endsWith('.wikidata.org')) continue;
    assert('Rule AD foreign DOB', !host?.endsWith('.vn'), `B009 ${p.id} must not use a Vietnam-hosted source: ${url}`);
  }
}
console.log(`B009 additions: ${B009_NEW_PEOPLE.length}; Vietnamese: ${b009Vietnamese.length}; Vietnamese share: ${(b009Vietnamese.length/B009_NEW_PEOPLE.length*100).toFixed(2)}%`);


const B010_APPROVED_PROFILES: Readonly<Record<string, { wikidataId: string; birthDate: string; dobSources: readonly { url: string; publisher: string; publisherCountry?: string; countryProofUrl?: string }[]; additionalSourceUrls?: readonly string[] }>> =
{
  "marilyn-monroe": {
    "wikidataId": "Q4616",
    "birthDate": "1926-06-01",
    "dobSources": [
      {
        "url": "https://snl.no/Marilyn_Monroe",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/monroe-marilyn",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "norman-foster": {
    "wikidataId": "Q104898",
    "birthDate": "1935-06-01",
    "dobSources": [
      {
        "url": "https://snl.no/Norman_Foster",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/foster-norman",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "phan-van-long": {
    "wikidataId": "Q19662437",
    "birthDate": "1996-06-01",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.co.uk/van-long-phan/profil/spieler/573733",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.com/intern/"
      },
      {
        "url": "https://sg.soccerway.com/player/phan-van-long/M1z6otVh/",
        "publisher": "Soccerway / Stats Perform",
        "publisherCountry": "GB",
        "countryProofUrl": "https://www.statsperform.com/legal/special-category-data-policy/"
      }
    ],
    "additionalSourceUrls": [
      "https://www.the-afc.com/en/more/news/afc_u-19_championship_md2_vietnam_1-3_japan.html"
    ]
  },
  "thomas-hardy": {
    "wikidataId": "Q132805",
    "birthDate": "1840-06-02",
    "dobSources": [
      {
        "url": "https://snl.no/Thomas_Hardy",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hardy-thomas",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "johnny-weissmuller": {
    "wikidataId": "Q151284",
    "birthDate": "1904-06-02",
    "dobSources": [
      {
        "url": "https://snl.no/Johnny_Weissmuller",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/weissmuller-johnny",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "sergio-aguero": {
    "wikidataId": "Q119562",
    "birthDate": "1988-06-02",
    "dobSources": [
      {
        "url": "https://snl.no/Sergio_Ag%C3%BCero",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.fcbarcelona.com/en/football/first-team/players/4328/sergio-aguero",
        "publisher": "FC Barcelona"
      }
    ]
  },
  "rafael-nadal": {
    "wikidataId": "Q10132",
    "birthDate": "1986-06-03",
    "dobSources": [
      {
        "url": "https://snl.no/Rafael_Nadal",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/nadal-rafael",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "josephine-baker": {
    "wikidataId": "Q151972",
    "birthDate": "1906-06-03",
    "dobSources": [
      {
        "url": "https://snl.no/Josephine_Baker",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/baker-josephine",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "allen-ginsberg": {
    "wikidataId": "Q6711",
    "birthDate": "1926-06-03",
    "dobSources": [
      {
        "url": "https://snl.no/Allen_Ginsberg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/ginsberg-allen",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "francois-quesnay": {
    "wikidataId": "Q13575",
    "birthDate": "1694-06-04",
    "dobSources": [
      {
        "url": "https://snl.no/Fran%C3%A7ois_Quesnay",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/quesnay-francois",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "bronis-aw-komorowski": {
    "wikidataId": "Q42939",
    "birthDate": "1952-06-04",
    "dobSources": [
      {
        "url": "https://snl.no/Bronis%C5%82aw_Komorowski",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/komorowski-bronislaw",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "lorenzo-insigne": {
    "wikidataId": "Q1756086",
    "birthDate": "1991-06-04",
    "dobSources": [
      {
        "url": "https://snl.no/Lorenzo_Insigne",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.torontofc.ca/players/lorenzo-insigne/",
        "publisher": "Toronto FC"
      }
    ]
  },
  "john-maynard-keynes": {
    "wikidataId": "Q9317",
    "birthDate": "1883-06-05",
    "dobSources": [
      {
        "url": "https://snl.no/John_Maynard_Keynes",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/keynes-john-maynard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "federico-garcia-lorca": {
    "wikidataId": "Q41408",
    "birthDate": "1898-06-05",
    "dobSources": [
      {
        "url": "https://snl.no/Federico_Garc%C3%ADa_Lorca",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/garcia-lorca-federico",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "pham-thi-thao": {
    "wikidataId": "Q2202972",
    "birthDate": "1989-06-05",
    "dobSources": [
      {
        "url": "https://www.ocagames.com/HZ_Info/AG2022-/en/results/rowing/athlete-profile-n2009980-pham-thi-thao.htm",
        "publisher": "Olympic Council of Asia",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/oca-headquarters/"
      },
      {
        "url": "https://digital.la84.org/digital/api/collection/p17103coll8/id/82424/download",
        "publisher": "LA84 Foundation / London 2012 Official Report",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.la84.org/privacy-policy"
      }
    ]
  },
  "thomas-mann": {
    "wikidataId": "Q37030",
    "birthDate": "1875-06-06",
    "dobSources": [
      {
        "url": "https://snl.no/Thomas_Mann",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mann-thomas",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "sukarno": {
    "wikidataId": "Q76127",
    "birthDate": "1901-06-06",
    "dobSources": [
      {
        "url": "https://snl.no/Sukarno",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sukarno",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "karl-ferdinand-braun": {
    "wikidataId": "Q57077",
    "birthDate": "1850-06-06",
    "dobSources": [
      {
        "url": "https://snl.no/Karl_Ferdinand_Braun",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/braun-karl-ferdinand",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "orhan-pamuk": {
    "wikidataId": "Q241248",
    "birthDate": "1952-06-07",
    "dobSources": [
      {
        "url": "https://snl.no/Orhan_Pamuk",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/pamuk-orhan",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "paul-gauguin": {
    "wikidataId": "Q37693",
    "birthDate": "1848-06-07",
    "dobSources": [
      {
        "url": "https://snl.no/Paul_Gauguin",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/gauguin-paul",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "mike-pence": {
    "wikidataId": "Q24313",
    "birthDate": "1959-06-07",
    "dobSources": [
      {
        "url": "https://snl.no/Mike_Pence",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.theguardian.com/us-news/2016/oct/04/mike-pence-tim-kaine-facts-vp-debate-trump-clinton",
        "publisher": "www.theguardian.com"
      }
    ]
  },
  "tim-berners-lee": {
    "wikidataId": "Q80",
    "birthDate": "1955-06-08",
    "dobSources": [
      {
        "url": "https://snl.no/Tim_Berners-Lee",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.w3.org/People/Berners-Lee/Longer.html",
        "publisher": "www.w3.org"
      }
    ]
  },
  "francis-crick": {
    "wikidataId": "Q123280",
    "birthDate": "1916-06-08",
    "dobSources": [
      {
        "url": "https://snl.no/Francis_Crick",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/crick-francis-harry-compton",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "suharto": {
    "wikidataId": "Q44819",
    "birthDate": "1921-06-08",
    "dobSources": [
      {
        "url": "https://snl.no/Suharto",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/suharto",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "johnny-depp": {
    "wikidataId": "Q37175",
    "birthDate": "1963-06-09",
    "dobSources": [
      {
        "url": "https://snl.no/Johnny_Depp",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/depp-johnny",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "bertha-von-suttner": {
    "wikidataId": "Q18456",
    "birthDate": "1843-06-09",
    "dobSources": [
      {
        "url": "https://snl.no/Bertha_von_Suttner",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/suttner-bertha-von",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "george-stephenson": {
    "wikidataId": "Q133614",
    "birthDate": "1781-06-09",
    "dobSources": [
      {
        "url": "https://snl.no/George_Stephenson",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/stephenson-george",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "judy-garland": {
    "wikidataId": "Q11637",
    "birthDate": "1922-06-10",
    "dobSources": [
      {
        "url": "https://snl.no/Judy_Garland",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/garland-judy",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "carlo-ancelotti": {
    "wikidataId": "Q174614",
    "birthDate": "1959-06-10",
    "dobSources": [
      {
        "url": "https://snl.no/Carlo_Ancelotti",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/ancelotti-carlo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "nguyen-van-lai": {
    "wikidataId": "Q48225677",
    "birthDate": "1986-06-10",
    "dobSources": [
      {
        "url": "https://worldathletics.org/athletes/vietnam/van-lai-nguyen-14379365",
        "publisher": "World Athletics",
        "publisherCountry": "MC",
        "countryProofUrl": "https://worldathletics.org/organisation/our-organisation/structure/headquarters"
      },
      {
        "url": "https://www.ocagames.com/OCA/cache/17ag/AT/par.AT.VIE.5106368.html",
        "publisher": "Olympic Council of Asia",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/oca-headquarters/"
      }
    ]
  },
  "richard-strauss": {
    "wikidataId": "Q13894",
    "birthDate": "1864-06-11",
    "dobSources": [
      {
        "url": "https://snl.no/Richard_Strauss",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/strauss-richard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "john-constable": {
    "wikidataId": "Q159297",
    "birthDate": "1776-06-11",
    "dobSources": [
      {
        "url": "https://snl.no/John_Constable",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/constable-john",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "gene-wilder": {
    "wikidataId": "Q191966",
    "birthDate": "1933-06-11",
    "dobSources": [
      {
        "url": "https://snl.no/Gene_Wilder",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.televisionacademy.com/bios/gene-wilder",
        "publisher": "Television Academy"
      }
    ]
  },
  "anne-frank": {
    "wikidataId": "Q4583",
    "birthDate": "1929-06-12",
    "dobSources": [
      {
        "url": "https://snl.no/Anne_Frank",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/frank-anne",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "johanna-spyri": {
    "wikidataId": "Q123053",
    "birthDate": "1827-06-12",
    "dobSources": [
      {
        "url": "https://snl.no/Johanna_Spyri",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/spyri-johanna",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "anthony-eden": {
    "wikidataId": "Q128995",
    "birthDate": "1897-06-12",
    "dobSources": [
      {
        "url": "https://snl.no/Anthony_Eden",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/eden-anthony-robert",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "james-clerk-maxwell": {
    "wikidataId": "Q9095",
    "birthDate": "1831-06-13",
    "dobSources": [
      {
        "url": "https://snl.no/James_Clerk_Maxwell",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/maxwell-james-clerk",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "luis-walter-alvarez": {
    "wikidataId": "Q178344",
    "birthDate": "1911-06-13",
    "dobSources": [
      {
        "url": "https://snl.no/Luis_Walter_Alvarez",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/alvarez-luis-walter",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "paavo-nurmi": {
    "wikidataId": "Q101942",
    "birthDate": "1897-06-13",
    "dobSources": [
      {
        "url": "https://snl.no/Paavo_Nurmi",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/nurmi-paavo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "donald-trump": {
    "wikidataId": "Q22686",
    "birthDate": "1946-06-14",
    "dobSources": [
      {
        "url": "https://snl.no/Donald_Trump",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/trump-donald",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "harriet-beecher-stowe": {
    "wikidataId": "Q102513",
    "birthDate": "1811-06-14",
    "dobSources": [
      {
        "url": "https://snl.no/Harriet_Beecher_Stowe",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/stowe-harriet-beecher",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "karl-landsteiner": {
    "wikidataId": "Q84405",
    "birthDate": "1868-06-14",
    "dobSources": [
      {
        "url": "https://snl.no/Karl_Landsteiner",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/landsteiner-karl",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "edvard-grieg": {
    "wikidataId": "Q80621",
    "birthDate": "1843-06-15",
    "dobSources": [
      {
        "url": "https://snl.no/Edvard_Grieg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/grieg-edvard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "michael-laudrup": {
    "wikidataId": "Q188720",
    "birthDate": "1964-06-15",
    "dobSources": [
      {
        "url": "https://snl.no/Michael_Laudrup",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.transfermarkt.co.uk/michael-laudrup/leistungsdaten/spieler/8023",
        "publisher": "www.transfermarkt.co.uk"
      }
    ]
  },
  "alain-aspect": {
    "wikidataId": "Q364997",
    "birthDate": "1947-06-15",
    "dobSources": [
      {
        "url": "https://snl.no/Alain_Aspect",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/aspect-alain",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "jurgen-klopp": {
    "wikidataId": "Q83106",
    "birthDate": "1967-06-16",
    "dobSources": [
      {
        "url": "https://snl.no/J%C3%BCrgen_Klopp",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/klopp-jurgen",
        "publisher": "brockhaus.de"
      }
    ]
  },
  "stan-laurel": {
    "wikidataId": "Q72869",
    "birthDate": "1890-06-16",
    "dobSources": [
      {
        "url": "https://snl.no/Stan_Laurel",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/stanlio-i-olio",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "tupac-shakur": {
    "wikidataId": "Q6107",
    "birthDate": "1971-06-16",
    "dobSources": [
      {
        "url": "https://snl.no/Tupac_Shakur",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.biography.com/musicians/tupac-shakur",
        "publisher": "Biography.com"
      }
    ]
  },
  "eddy-merckx": {
    "wikidataId": "Q103756",
    "birthDate": "1945-06-17",
    "dobSources": [
      {
        "url": "https://snl.no/Eddy_Merckx",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/merckx-eddy",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "francois-jacob": {
    "wikidataId": "Q218311",
    "birthDate": "1920-06-17",
    "dobSources": [
      {
        "url": "https://snl.no/Fran%C3%A7ois_Jacob",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/jacob-francois",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "william-crookes": {
    "wikidataId": "Q189552",
    "birthDate": "1832-06-17",
    "dobSources": [
      {
        "url": "https://snl.no/William_Crookes",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/crookes-william",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "paul-mccartney": {
    "wikidataId": "Q2599",
    "birthDate": "1942-06-18",
    "dobSources": [
      {
        "url": "https://snl.no/Paul_McCartney",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mccartney-paul",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "kaja-kallas": {
    "wikidataId": "Q11869065",
    "birthDate": "1977-06-18",
    "dobSources": [
      {
        "url": "https://snl.no/Kaja_Kallas",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.valitsus.ee/en/prime-minister-ministers/prime-minister-kaja-kallas",
        "publisher": "Government of Estonia"
      }
    ]
  },
  "lech-kaczynski": {
    "wikidataId": "Q2757",
    "birthDate": "1949-06-18",
    "dobSources": [
      {
        "url": "https://snl.no/Lech_Kaczy%C5%84ski",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kaczynski-lech",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "blaise-pascal": {
    "wikidataId": "Q1290",
    "birthDate": "1623-06-19",
    "dobSources": [
      {
        "url": "https://snl.no/Blaise_Pascal",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/pascal-blaise",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "salman-rushdie": {
    "wikidataId": "Q44306",
    "birthDate": "1947-06-19",
    "dobSources": [
      {
        "url": "https://snl.no/Salman_Rushdie",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rushdie-salman",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "dirk-nowitzki": {
    "wikidataId": "Q44068",
    "birthDate": "1978-06-19",
    "dobSources": [
      {
        "url": "https://snl.no/Dirk_Nowitzki",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.espn.com/nba/player/_/id/609/dirk-nowitzki",
        "publisher": "www.espn.com"
      }
    ]
  },
  "nicole-kidman": {
    "wikidataId": "Q37459",
    "birthDate": "1967-06-20",
    "dobSources": [
      {
        "url": "https://snl.no/Nicole_Kidman",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/kidman-nicole",
        "publisher": "brockhaus.de"
      }
    ]
  },
  "le-van-cong": {
    "wikidataId": "Q26837508",
    "birthDate": "1984-06-20",
    "dobSources": [
      {
        "url": "https://paralymp.ru/upload/iblock/f53/f44zloszr87knyxen4svyg7neyd8hh3a.pdf",
        "publisher": "Russian Paralympic Committee",
        "publisherCountry": "RU",
        "countryProofUrl": "https://paralymp.ru/about/contacts/"
      },
      {
        "url": "https://toyotatimes-sports.toyota/aichi-nagoya-2026/drivepassion/athletes/21043/?source=drivepassion_top",
        "publisher": "Toyota Motor Corporation / Toyota Times Sports",
        "publisherCountry": "JP",
        "countryProofUrl": "https://global.toyota/en/company/profile/overview/"
      }
    ]
  },
  "frank-lampard": {
    "wikidataId": "Q41533",
    "birthDate": "1978-06-20",
    "dobSources": [
      {
        "url": "https://snl.no/Frank_Lampard",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.skysports.com/frank-lampard",
        "publisher": "Sky Sports"
      }
    ]
  },
  "jean-paul-sartre": {
    "wikidataId": "Q9364",
    "birthDate": "1905-06-21",
    "dobSources": [
      {
        "url": "https://snl.no/Jean-Paul_Sartre",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sartre-jean-paul",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "edward-snowden": {
    "wikidataId": "Q13424289",
    "birthDate": "1983-06-21",
    "dobSources": [
      {
        "url": "https://snl.no/Edward_Snowden",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.theguardian.com/world/2014/feb/01/edward-snowden-intelligence-leak-nsa-contractor-extract",
        "publisher": "www.theguardian.com"
      }
    ]
  },
  "francoise-sagan": {
    "wikidataId": "Q1646",
    "birthDate": "1935-06-21",
    "dobSources": [
      {
        "url": "https://snl.no/Fran%C3%A7oise_Sagan",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sagan-francoise",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "meryl-streep": {
    "wikidataId": "Q873",
    "birthDate": "1949-06-22",
    "dobSources": [
      {
        "url": "https://snl.no/Meryl_Streep",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/streep-meryl",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "erich-maria-remarque": {
    "wikidataId": "Q47293",
    "birthDate": "1898-06-22",
    "dobSources": [
      {
        "url": "https://snl.no/Erich_Maria_Remarque",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/remarque-erich-maria",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "vuong-thi-huyen": {
    "wikidataId": "Q24809911",
    "birthDate": "1992-06-22",
    "dobSources": [
      {
        "url": "https://www.pzpc.pl/public/system/files/articles/5675/1660-StarListPackage_GT.pdf",
        "publisher": "Polish Weightlifting Federation",
        "publisherCountry": "PL",
        "countryProofUrl": "https://www.zmbo.pzpc.pl/kontakt"
      },
      {
        "url": "https://www.ocagames.com/orb/books/Jakarta_2018/AG2018_OfficialResultBook_Weightlifting_v1.0.pdf",
        "publisher": "Olympic Council of Asia",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/oca-headquarters/"
      }
    ]
  },
  "jean-anouilh": {
    "wikidataId": "Q179025",
    "birthDate": "1910-06-23",
    "dobSources": [
      {
        "url": "https://snl.no/Jean_Anouilh",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/anouilh-jean",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "alan-turing": {
    "wikidataId": "Q7251",
    "birthDate": "1912-06-23",
    "dobSources": [
      {
        "url": "https://snl.no/Alan_Turing",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/turing-alan-mathison",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "zinedine-zidane": {
    "wikidataId": "Q1835",
    "birthDate": "1972-06-23",
    "dobSources": [
      {
        "url": "https://snl.no/Zinedine_Zidane",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/zidane-zinedine",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "lionel-messi": {
    "wikidataId": "Q615",
    "birthDate": "1987-06-24",
    "dobSources": [
      {
        "url": "https://snl.no/Lionel_Messi",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/messi-lionel",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "julia-kristeva": {
    "wikidataId": "Q159876",
    "birthDate": "1941-06-24",
    "dobSources": [
      {
        "url": "https://snl.no/Julia_Kristeva",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kristeva-julia",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "fred-hoyle": {
    "wikidataId": "Q183397",
    "birthDate": "1915-06-24",
    "dobSources": [
      {
        "url": "https://snl.no/Fred_Hoyle",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hoyle-fred",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "george-orwell": {
    "wikidataId": "Q3335",
    "birthDate": "1903-06-25",
    "dobSources": [
      {
        "url": "https://snl.no/George_Orwell",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/orwell-george",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "george-michael": {
    "wikidataId": "Q130311",
    "birthDate": "1963-06-25",
    "dobSources": [
      {
        "url": "https://snl.no/George_Michael",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.televisionacademy.com/bios/george-michael",
        "publisher": "Television Academy"
      }
    ]
  },
  "sidney-lumet": {
    "wikidataId": "Q51559",
    "birthDate": "1924-06-25",
    "dobSources": [
      {
        "url": "https://snl.no/Sidney_Lumet",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lumet-sidney",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "ariana-grande": {
    "wikidataId": "Q151892",
    "birthDate": "1993-06-26",
    "dobSources": [
      {
        "url": "https://snl.no/Ariana_Grande",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/grande-ariana-20",
        "publisher": "brockhaus.de"
      }
    ]
  },
  "claudio-abbado": {
    "wikidataId": "Q151608",
    "birthDate": "1933-06-26",
    "dobSources": [
      {
        "url": "https://snl.no/Claudio_Abbado",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/abbado-claudio",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "samir-nasri": {
    "wikidataId": "Q1920",
    "birthDate": "1987-06-26",
    "dobSources": [
      {
        "url": "https://snl.no/Samir_Nasri",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.transfermarkt.co.uk/samir-nasri/profil/spieler/18935",
        "publisher": "Transfermarkt"
      }
    ]
  },
  "krzysztof-kieslowski": {
    "wikidataId": "Q55165",
    "birthDate": "1941-06-27",
    "dobSources": [
      {
        "url": "https://snl.no/Krzysztof_Kie%C5%9Blowski",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kieslowski-krzysztof",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "nico-rosberg": {
    "wikidataId": "Q75820",
    "birthDate": "1985-06-27",
    "dobSources": [
      {
        "url": "https://snl.no/Nico_Rosberg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/rosberg-nico-erik",
        "publisher": "brockhaus.de"
      }
    ]
  },
  "gaston-bachelard": {
    "wikidataId": "Q270800",
    "birthDate": "1884-06-27",
    "dobSources": [
      {
        "url": "https://snl.no/Gaston_Bachelard",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bachelard-gaston",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "jean-jacques-rousseau": {
    "wikidataId": "Q6527",
    "birthDate": "1712-06-28",
    "dobSources": [
      {
        "url": "https://snl.no/Jean-Jacques_Rousseau",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rousseau-jean-jacques",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "luigi-pirandello": {
    "wikidataId": "Q1403",
    "birthDate": "1867-06-28",
    "dobSources": [
      {
        "url": "https://snl.no/Luigi_Pirandello",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/pirandello-luigi",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "muhammad-yunus": {
    "wikidataId": "Q43969",
    "birthDate": "1940-06-28",
    "dobSources": [
      {
        "url": "https://snl.no/Muhammad_Yunus",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/yunus-muhammad",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "antoine-de-saint-exupery": {
    "wikidataId": "Q2908",
    "birthDate": "1900-06-29",
    "dobSources": [
      {
        "url": "https://snl.no/Antoine_de_Saint-Exup%C3%A9ry",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/saint-exupery-antoine-de",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "giacomo-leopardi": {
    "wikidataId": "Q172599",
    "birthDate": "1798-06-29",
    "dobSources": [
      {
        "url": "https://snl.no/Giacomo_Leopardi",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/leopardi-giacomo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "giorgio-napolitano": {
    "wikidataId": "Q1220",
    "birthDate": "1925-06-29",
    "dobSources": [
      {
        "url": "https://snl.no/Giorgio_Napolitano",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/napolitano-giorgio",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "mike-tyson": {
    "wikidataId": "Q79031",
    "birthDate": "1966-06-30",
    "dobSources": [
      {
        "url": "https://snl.no/Mike_Tyson",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/tyson-mike",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "michael-phelps": {
    "wikidataId": "Q39562",
    "birthDate": "1985-06-30",
    "dobSources": [
      {
        "url": "https://snl.no/Michael_Phelps",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/phelps-michael",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  },
  "paul-berg": {
    "wikidataId": "Q102379",
    "birthDate": "1926-06-30",
    "dobSources": [
      {
        "url": "https://snl.no/Paul_Berg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/berg-paul",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute"
      }
    ]
  }
};


// ------------------------------------------------------------
// Rule AE: B010 exact June profile set, source allowlist, and foreign-source audit.
// ------------------------------------------------------------
console.log('Checking Rule AE: B010 exact June profile set, balance, reviewed sources, and baseline preservation...');
const B010_NEW_PEOPLE = b010CycleDatedProfiles;
const B010_APPROVED_IDS = new Set(Object.keys(B010_APPROVED_PROFILES));
const B010_APPROVED_QIDS = new Set(Object.values(B010_APPROVED_PROFILES).map((profile) => profile.wikidataId));
assert('Rule AE', B010_NEW_PEOPLE.length === 90, `B010 requires exactly 90 new June profiles, found ${B010_NEW_PEOPLE.length}`);
assert('Rule AE', B010_APPROVED_IDS.size === 90 && B010_APPROVED_QIDS.size === 90, 'B010 approved IDs and QIDs must be exact and unique');
assert('Rule AE', B010_NEW_PEOPLE.every((p) => B010_APPROVED_IDS.has(p.id)), 'B010 additions must match only the approved profile ID list');
assert('Rule AE', B010_NEW_PEOPLE.length === B010_APPROVED_IDS.size, 'B010 must contain every approved profile exactly once');
assert('Rule AE', new Set(B010_NEW_PEOPLE.map((p) => p.wikidataId)).size === 90, 'B010 Wikidata IDs must be unique');

function isApprovedB010DobSource(qid: string, url: string): boolean {
  const profile = Object.values(B010_APPROVED_PROFILES).find((approved) => approved.wikidataId === qid);
  return profile?.dobSources.some((source) => source.url === url) ?? false;
}

function isApprovedB010ContextSource(qid: string, url: string): boolean {
  const profile = Object.values(B010_APPROVED_PROFILES).find((approved) => approved.wikidataId === qid);
  return profile?.additionalSourceUrls?.includes(url) ?? false;
}

for (const p of B010_NEW_PEOPLE) {
  const expected = B010_APPROVED_PROFILES[p.id];
  assert('Rule AE', Boolean(expected), `Unapproved B010 profile ID: ${p.id}`);
  if (!expected) continue;
  assert('Rule AE', p.wikidataId === expected.wikidataId, `B010 ${p.id} expected ${expected.wikidataId}, got ${p.wikidataId}`);
  assert('Rule AE', p.birthDate === expected.birthDate, `B010 ${p.id} expected DOB ${expected.birthDate}, got ${p.birthDate}`);
  assert('Rule AE', p.birthMonth === 6 && /^\d{4}-06-\d{2}$/.test(p.birthDate), `B010 ${p.id} must be a June record`);
  assert('Rule AE', p.birthYear === Number(p.birthDate.slice(0,4)) && p.birthDay === Number(p.birthDate.slice(8,10)), `B010 ${p.id} split date fields must match birthDate`);
  assert('Rule AE', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${p.wikidataId}`) === true, `B010 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AE source', expected.dobSources.length === 2, `B010 ${p.id} must have exactly two reviewed DOB publishers`);
  assert('Rule AE source', new Set(expected.dobSources.map((source) => source.publisher)).size === 2, `B010 ${p.id} DOB publishers must be distinct`);
  assert('Rule AE source', new Set(expected.dobSources.map((source) => getUrlHostname(source.url))).size === 2, `B010 ${p.id} DOB source hosts must be distinct`);
  const approvedUrls = expected.dobSources.map((source) => source.url);
  const approvedContextUrls = expected.additionalSourceUrls || [];
  const nonWikiUrls = sourceUrlsBeforeBv017(p).filter((url) => !url.includes('wikidata.org') && !url.includes('wikipedia.org') && !url.includes('wikimedia.org'));
  const exactApprovedUrls = [...approvedUrls, ...approvedContextUrls];
  assert('Rule AE source', nonWikiUrls.length === exactApprovedUrls.length && exactApprovedUrls.every((url) => nonWikiUrls.includes(url)), `B010 ${p.id} must include exactly its reviewed DOB and contextual non-Wikidata sources`);
  for (const source of expected.dobSources) {
    assert('Rule AE source positive', isApprovedB010DobSource(p.wikidataId || '', source.url), `B010 reviewed source must pass for ${p.id}: ${source.url}`);
    assert('Rule AE source profile', (p.sourceUrls || []).includes(source.url), `B010 ${p.id} must include reviewed source ${source.url}`);
    const sourceHost = getUrlHostname(source.url);
    assert('Rule AE source URL', Boolean(sourceHost) && !sourceHost.endsWith('.vn'), `B010 source must use a valid non-Vietnam host: ${source.url}`);
  }
  if (p.countryCode === 'VN') {
    for (const source of expected.dobSources) {
      assert('Rule AE Vietnamese publisher country', Boolean(source.publisherCountry) && source.publisherCountry !== 'VN', `B010 Vietnamese DOB publisher must be outside Vietnam: ${source.url}`);
      assert('Rule AE Vietnamese country evidence', Boolean(source.countryProofUrl?.startsWith('https://')), `B010 Vietnamese source needs a publisher-country proof URL: ${source.publisher}`);
    }
  }
  for (const url of approvedContextUrls) {
    assert('Rule AE context positive', isApprovedB010ContextSource(p.wikidataId || '', url), `B010 contextual source must pass for ${p.id}: ${url}`);
    assert('Rule AE context profile', (p.sourceUrls || []).includes(url), `B010 ${p.id} must include reviewed contextual source ${url}`);
    const host = getUrlHostname(url);
    assert('Rule AE context URL', Boolean(host) && !host.endsWith('.vn'), `B010 contextual source must use a valid non-Vietnam host: ${url}`);
    assert('Rule AE context negative', !isApprovedB010ContextSource('Q0', url), `Context source must not approve a different QID: ${url}`);
  }
}

for (const [id, expected] of Object.entries(B010_APPROVED_PROFILES)) {
  const profile = B010_NEW_PEOPLE.find((p) => p.id === id);
  assert('Rule AE', Boolean(profile), `Missing approved B010 profile ${id}`);
  if (profile) {
    assert('Rule AE', profile.birthYear === Number(expected.birthDate.slice(0,4)) && profile.birthMonth === 6 && profile.birthDay === Number(expected.birthDate.slice(8,10)), `B010 ${id} has incorrect date components`);
  }
  for (const source of expected.dobSources) {
    const qid = expected.wikidataId;
    assert('Rule AE source positive', isApprovedB010DobSource(qid, source.url), `Reviewed source allowlist must accept ${source.url}`);
    assert('Rule AE source negative', !isApprovedB010DobSource('Q0', source.url), `Source must not approve a different QID: ${source.url}`);
    assert('Rule AE source negative', !isApprovedB010DobSource(qid, `${source.url}#unreviewed`), `Unreviewed source fragment must fail: ${source.url}`);
    const queryVariant = source.url.includes('?') ? `${source.url}&unreviewed=1` : `${source.url}?unreviewed=1`;
    assert('Rule AE source negative', !isApprovedB010DobSource(qid, queryVariant), `Unreviewed source query must fail: ${source.url}`);
    const pathVariant = new URL(source.url);
    pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AE source negative', !isApprovedB010DobSource(qid, pathVariant.href), `Unreviewed source path must fail: ${source.url}`);
    const lookalike = new URL(source.url);
    lookalike.hostname += '.evil.example';
    assert('Rule AE source negative', !isApprovedB010DobSource(qid, lookalike.href), `Lookalike source host must fail: ${source.url}`);
    assert('Rule AE source negative', !isApprovedB010DobSource(qid, 'not-a-url'), 'Malformed source URL must fail');
  }
  for (const url of expected.additionalSourceUrls || []) {
    assert('Rule AE context positive', isApprovedB010ContextSource(expected.wikidataId, url), `Reviewed context allowlist must accept ${url}`);
    assert('Rule AE context negative', !isApprovedB010ContextSource('Q0', url), `Context source must not approve a different QID: ${url}`);
    assert('Rule AE context negative', !isApprovedB010ContextSource(expected.wikidataId, `${url}#unreviewed`), `Unreviewed context fragment must fail: ${url}`);
    const queryVariant = url.includes('?') ? `${url}&unreviewed=1` : `${url}?unreviewed=1`;
    assert('Rule AE context negative', !isApprovedB010ContextSource(expected.wikidataId, queryVariant), `Unreviewed context query must fail: ${url}`);
    const pathVariant = new URL(url);
    pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AE context negative', !isApprovedB010ContextSource(expected.wikidataId, pathVariant.href), `Unreviewed context path must fail: ${url}`);
    const lookalike = new URL(url);
    lookalike.hostname += '.evil.example';
    assert('Rule AE context negative', !isApprovedB010ContextSource(expected.wikidataId, lookalike.href), `Lookalike context host must fail: ${url}`);
    assert('Rule AE context negative', !isApprovedB010ContextSource(expected.wikidataId, 'not-a-url'), 'Malformed context URL must fail');
  }
}

const b010Vietnamese = B010_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AE balance', b010Vietnamese.length === 5, `B010 Vietnamese count must be 5, found ${b010Vietnamese.length}`);
assert('Rule AE balance', b010Vietnamese.length / B010_NEW_PEOPLE.length >= 0.05, `B010 Vietnamese share must be at least 5%; found ${b010Vietnamese.length}/${B010_NEW_PEOPLE.length}`);
assert('Rule AE balance', new Set(b010Vietnamese.map((p) => p.wikidataId)).size === 5, 'B010 Vietnamese QIDs must be unique');
for (const p of b010Vietnamese) {
  const expected = B010_APPROVED_PROFILES[p.id];
  assert('Rule AE Vietnamese', Boolean(expected) && expected.wikidataId === p.wikidataId, `B010 Vietnamese profile must match reviewed QID: ${p.id}`);
  const sources = expected?.dobSources || [];
  assert('Rule AE Vietnamese', sources.length === 2, `B010 Vietnamese ${p.id} requires exactly two reviewed foreign DOB sources`);
  assert('Rule AE Vietnamese', sources.every((source) => source.publisherCountry !== 'VN' && Boolean(source.countryProofUrl)), `B010 Vietnamese ${p.id} requires two sources with verified foreign publisher countries`);
  assert('Rule AE Vietnamese', sources.every((source) => (p.sourceUrls || []).includes(source.url)), `B010 Vietnamese ${p.id} must include both approved DOB URLs`);
}
const b010ScopePeople = ALL_PEOPLE.filter((p) => p.birthMonth !== 7 && !B012_NEW_IDS.has(p.id) && !B013_NEW_IDS.has(p.id) && !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
assert('Rule AE balance', b010ScopePeople.length === 568, `B010 through-June dataset must contain 568 people, found ${b010ScopePeople.length}`);
assert('Rule AE events', HISTORY_EVENTS.length === 4, `B010 must preserve exactly 4 history events, found ${HISTORY_EVENTS.length}`);
const b010CoveredDays = new Set(b010ScopePeople.map((p) => `${p.birthMonth}-${p.birthDay}`));
assert('Rule AE coverage', b010CoveredDays.size === 184, `B010 expected 184 covered calendar days after filling June, found ${b010CoveredDays.size}`);
for (let day = 1; day <= 30; day++) {
  const count = B010_NEW_PEOPLE.filter((p) => p.birthDay === day).length;
  assert('Rule AE coverage', count === 3, `B010 June ${day} must have exactly 3 new profiles, found ${count}`);
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}
function stableSha256(value: unknown): string {
  return createHash('sha256').update(stableSerialize(value)).digest('hex');
}
const b010PreservedPeople = b010ScopePeople.filter((p) => !B010_APPROVED_IDS.has(p.id)).sort((a, b) => a.id.localeCompare(b.id));
assert('Rule AE baseline', stableSha256(b010PreservedPeople.map(projectPersonBeforeBv017)) === 'b79da34cf8a047a586ddbaf10ab8120f28d31dcbfb8d95f4cebe1f05600cc97e', 'All 478 pre-B010 people must remain deep-equal to the locked baseline after the independently verified BV-017 correction projection');
assert('Rule AE baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All 4 history events must remain deep-equal to the locked baseline');
console.log(`B010 additions: ${B010_NEW_PEOPLE.length}; Vietnamese: ${b010Vietnamese.length}; Vietnamese share: ${(b010Vietnamese.length / B010_NEW_PEOPLE.length * 100).toFixed(2)}%; coverage: ${b010CoveredDays.size}/366`);


// ------------------------------------------------------------
// Rule AF: B011 exact July profile set, two direct DOB publishers,
// foreign-publisher evidence for Vietnamese records, and baseline preservation.
// ------------------------------------------------------------
console.log('Checking Rule AF: B011 exact July profile set, source pairs, balance, and baseline preservation...');
const B011_APPROVED_PROFILES: Readonly<Record<string, {
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  category: string;
  occupation: string;
  dobSources: readonly { url: string; publisher: string; publisherCountry: string; countryProofUrl?: string }[];
}>> = {
  "olivia-de-havilland": {
    "wikidataId": "Q95068",
    "birthDate": "1916-07-01",
    "countryCode": "GB",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Olivia_de_Havilland",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/havilland-olivia-de",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "carl-lewis": {
    "wikidataId": "Q131237",
    "birthDate": "1961-07-01",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://snl.no/Carl_Lewis",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lewis-carl",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "george-sand": {
    "wikidataId": "Q3816",
    "birthDate": "1804-07-01",
    "countryCode": "FR",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/George_Sand",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sand-george",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "hermann-hesse": {
    "wikidataId": "Q25973",
    "birthDate": "1877-07-02",
    "countryCode": "DE",
    "category": "literature",
    "occupation": "Nhà văn, nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Hermann_Hesse",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hesse-hermann",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "wis-awa-szymborska": {
    "wikidataId": "Q42552",
    "birthDate": "1923-07-02",
    "countryCode": "PL",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Wis%C5%82awa_Szymborska",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/szymborska-wislawa",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "dang-thai-son": {
    "wikidataId": "Q1159527",
    "birthDate": "1958-07-02",
    "countryCode": "VN",
    "category": "music",
    "occupation": "Nghệ sĩ dương cầm",
    "dobSources": [
      {
        "url": "https://classical.music.apple.com/us/artist/dang-thai-son-1958",
        "publisher": "Apple Music Classical / Apple Inc.",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.apple.com/legal/contact/copyright-infringement.html"
      },
      {
        "url": "https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/dang-thai-son-actually-son-thai-dang",
        "publisher": "Encyclopedia.com / Gale, a Cengage company",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.cengagegroup.com/contact/"
      }
    ]
  },
  "franz-kafka": {
    "wikidataId": "Q905",
    "birthDate": "1883-07-03",
    "countryCode": "CZ",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Franz_Kafka",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kafka-franz",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tom-cruise": {
    "wikidataId": "Q37079",
    "birthDate": "1962-07-03",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Tom_Cruise",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/cruise-tom",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "sebastian-vettel": {
    "wikidataId": "Q42311",
    "birthDate": "1987-07-03",
    "countryCode": "DE",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://snl.no/Sebastian_Vettel",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/vettel-sebastian",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "giuseppe-garibaldi": {
    "wikidataId": "Q539",
    "birthDate": "1807-07-04",
    "countryCode": "IT",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Giuseppe_Garibaldi",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/garibaldi-giuseppe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "gina-lollobrigida": {
    "wikidataId": "Q56009",
    "birthDate": "1927-07-04",
    "countryCode": "IT",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Gina_Lollobrigida",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lollobrigida-gina",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "edi-rama": {
    "wikidataId": "Q316901",
    "birthDate": "1964-07-04",
    "countryCode": "AL",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Edi_Rama",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rama-edvin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "georges-pompidou": {
    "wikidataId": "Q2185",
    "birthDate": "1911-07-05",
    "countryCode": "FR",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Georges_Pompidou",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/pompidou-georges",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jean-cocteau": {
    "wikidataId": "Q83158",
    "birthDate": "1889-07-05",
    "countryCode": "FR",
    "category": "literature",
    "occupation": "Nhà văn, đạo diễn",
    "dobSources": [
      {
        "url": "https://snl.no/Jean_Cocteau",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/cocteau-jean",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "p-t-barnum": {
    "wikidataId": "Q223766",
    "birthDate": "1810-07-05",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://sova.si.edu/record/nmah.ac.0068",
        "publisher": "Smithsonian Institution, National Museum of American History Archives Center",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.biography.com/business-leaders/pt-barnum",
        "publisher": "Biography.com / Hearst",
        "publisherCountry": "US"
      }
    ]
  },
  "frida-kahlo": {
    "wikidataId": "Q5588",
    "birthDate": "1907-07-06",
    "countryCode": "MX",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://www.museofridakahlo.org.mx/frida/?lang=en",
        "publisher": "Museo Frida Kahlo",
        "publisherCountry": "MX"
      },
      {
        "url": "https://www.gob.mx/cultura/prensa/frida-kahlo-creadora-de-una-pintura-personal-y-metaforica",
        "publisher": "Secretaría de Cultura, Gobierno de México",
        "publisherCountry": "MX"
      }
    ]
  },
  "sylvester-stallone": {
    "wikidataId": "Q40026",
    "birthDate": "1946-07-06",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/sylvester-stallone",
        "publisher": "Biography.com / Hearst",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.theguardian.com/film/2016/feb/24/sylvester-stallone-profile-creed-rocky",
        "publisher": "The Guardian",
        "publisherCountry": "GB"
      }
    ]
  },
  "george-w-bush": {
    "wikidataId": "Q207",
    "birthDate": "1946-07-06",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://georgewbush-whitehouse.archives.gov/president/text/biography.html",
        "publisher": "The White House historical archive",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.georgewbushlibrary.gov/bush-family/george-w-bush",
        "publisher": "George W. Bush Presidential Library and Museum, National Archives",
        "publisherCountry": "US"
      }
    ]
  },
  "gustav-mahler": {
    "wikidataId": "Q7304",
    "birthDate": "1860-07-07",
    "countryCode": "AT",
    "category": "music",
    "occupation": "Nhạc sĩ, ca sĩ",
    "dobSources": [
      {
        "url": "https://www.enciklopedija.hr/clanak/mahler-gustav",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/mahler-gustav",
        "publisher": "Brockhaus Enzyklopädie",
        "publisherCountry": "DE"
      }
    ]
  },
  "george-cukor": {
    "wikidataId": "Q56014",
    "birthDate": "1899-07-07",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/George_Cukor",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/cukor-george",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "lion-feuchtwanger": {
    "wikidataId": "Q77024",
    "birthDate": "1884-07-07",
    "countryCode": "DE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Lion_Feuchtwanger",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/feuchtwanger-lion",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "walter-scheel": {
    "wikidataId": "Q2571",
    "birthDate": "1919-07-08",
    "countryCode": "DE",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Walter_Scheel",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/scheel-walter",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "philip-johnson": {
    "wikidataId": "Q183528",
    "birthDate": "1906-07-08",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Philip_Johnson",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/johnson-philip",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "kathe-kollwitz": {
    "wikidataId": "Q142472",
    "birthDate": "1867-07-08",
    "countryCode": "DE",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/K%C3%A4the_Kollwitz",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kollwitz-kathe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tom-hanks": {
    "wikidataId": "Q2263",
    "birthDate": "1956-07-09",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Tom_Hanks",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hanks-tom",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "franz-boas": {
    "wikidataId": "Q76857",
    "birthDate": "1858-07-09",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Franz_Boas",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/boas-franz",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "david-hockney": {
    "wikidataId": "Q159907",
    "birthDate": "1937-07-09",
    "countryCode": "GB",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/David_Hockney",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hockney-david",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "nikola-tesla": {
    "wikidataId": "Q9036",
    "birthDate": "1856-07-10",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Nikola_Tesla",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/tesla-nikola",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alice-munro": {
    "wikidataId": "Q234819",
    "birthDate": "1931-07-10",
    "countryCode": "CA",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Alice_Munro",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/munro-alice",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "nguyen-huy-hoang-swimmer": {
    "wikidataId": "Q56243413",
    "birthDate": "2000-07-10",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://www.ocagames.com/HZ_Info/AG2022-/en/results/swimming/athlete-profile-n2029139-nguyen-huy-hoang.htm",
        "publisher": "Olympic Council of Asia",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/constitution/"
      },
      {
        "url": "https://www.olympedia.org/athletes/2504318",
        "publisher": "Olympedia / International Society of Olympic Historians",
        "publisherCountry": "CH",
        "countryProofUrl": "https://isoh.org/join-isoh/"
      }
    ]
  },
  "yul-brynner": {
    "wikidataId": "Q102813",
    "birthDate": "1920-07-11",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Yul_Brynner",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/brynner-yul",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "john-quincy-adams": {
    "wikidataId": "Q11816",
    "birthDate": "1767-07-11",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://www.nps.gov/adam/jqabio.htm",
        "publisher": "Adams National Historical Park, National Park Service",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.govinfo.gov/content/pkg/GPO-CDOC-108hdoc222/pdf/GPO-CDOC-108hdoc222-4-1.pdf",
        "publisher": "Biographical Directory of the United States Congress / U.S. Government Publishing Office",
        "publisherCountry": "US"
      }
    ]
  },
  "caroline-wozniacki": {
    "wikidataId": "Q30767",
    "birthDate": "1990-07-11",
    "countryCode": "DK",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://www.wtatennis.com/players/313402/caroline-wozniacki",
        "publisher": "Women’s Tennis Association",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.olympedia.org/athletes/117609",
        "publisher": "Olympedia / International Society of Olympic Historians",
        "publisherCountry": "CH"
      }
    ]
  },
  "malala-yousafzai": {
    "wikidataId": "Q32732",
    "birthDate": "1997-07-12",
    "countryCode": "PK",
    "category": "politics",
    "occupation": "Nhà hoạt động giáo dục",
    "dobSources": [
      {
        "url": "https://snl.no/Malala_Yousafzai",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/yousafzai-malala",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "pablo-neruda": {
    "wikidataId": "Q34189",
    "birthDate": "1904-07-12",
    "countryCode": "CL",
    "category": "literature",
    "occupation": "Nhà thơ, nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Pablo_Neruda",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/neruda-pablo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "claude-bernard": {
    "wikidataId": "Q208230",
    "birthDate": "1813-07-12",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Claude_Bernard",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bernard-claude",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "harrison-ford": {
    "wikidataId": "Q81328",
    "birthDate": "1942-07-13",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Harrison_Ford",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/ford-harrison",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "wole-soyinka": {
    "wikidataId": "Q41488",
    "birthDate": "1934-07-13",
    "countryCode": "NG",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Wole_Soyinka",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/soyinka-wole",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ma-ying-jeou": {
    "wikidataId": "Q19216",
    "birthDate": "1950-07-13",
    "countryCode": "TW",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Ma_Ying-jeou",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/ma-ying-jeou",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ingmar-bergman": {
    "wikidataId": "Q7546",
    "birthDate": "1918-07-14",
    "countryCode": "SE",
    "category": "artist",
    "occupation": "Đạo diễn, biên kịch",
    "dobSources": [
      {
        "url": "https://snl.no/Ingmar_Bergman",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bergman-ingmar",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "gustav-klimt": {
    "wikidataId": "Q34661",
    "birthDate": "1862-07-14",
    "countryCode": "AT",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Gustav_Klimt",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/klimt-gustav",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "woody-guthrie": {
    "wikidataId": "Q4061",
    "birthDate": "1912-07-14",
    "countryCode": "US",
    "category": "music",
    "occupation": "Nhạc sĩ, ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Woody_Guthrie",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/guthrie-woody",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "rembrandt": {
    "wikidataId": "Q5598",
    "birthDate": "1606-07-15",
    "countryCode": "NL",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Rembrandt",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rembrandt",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "walter-benjamin": {
    "wikidataId": "Q61078",
    "birthDate": "1892-07-15",
    "countryCode": "DE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Walter_Benjamin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/benjamin-walter",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "vilfredo-pareto": {
    "wikidataId": "Q11031",
    "birthDate": "1848-07-15",
    "countryCode": "IT",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Vilfredo_Pareto",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/pareto-vilfredo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ginger-rogers": {
    "wikidataId": "Q95089",
    "birthDate": "1911-07-16",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Ginger_Rogers",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rogers-ginger",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "miguel-indurain": {
    "wikidataId": "Q105542",
    "birthDate": "1964-07-16",
    "countryCode": "ES",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://snl.no/Miguel_Indur%C3%A1in",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/indurain-miguel",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "frits-zernike": {
    "wikidataId": "Q188293",
    "birthDate": "1888-07-16",
    "countryCode": "NL",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Frits_Zernike",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/zernike-frits",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "angela-merkel": {
    "wikidataId": "Q567",
    "birthDate": "1954-07-17",
    "countryCode": "DE",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Angela_Merkel",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/merkel-angela-dorothea",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "james-cagney": {
    "wikidataId": "Q94041",
    "birthDate": "1899-07-17",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/James_Cagney",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/cagney-james",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "donald-sutherland": {
    "wikidataId": "Q103784",
    "birthDate": "1935-07-17",
    "countryCode": "CA",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Donald_Sutherland",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sutherland-donald",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "nelson-mandela": {
    "wikidataId": "Q8023",
    "birthDate": "1918-07-18",
    "countryCode": "ZA",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Nelson_Mandela",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mandela-nelson-rolihlahla",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "john-glenn": {
    "wikidataId": "Q182642",
    "birthDate": "1921-07-18",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Phi hành gia, chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/John_Glenn",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/glenn-john",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "thomas-kuhn": {
    "wikidataId": "Q184980",
    "birthDate": "1922-07-18",
    "countryCode": "US",
    "category": "history",
    "occupation": "Nhà sử học",
    "dobSources": [
      {
        "url": "https://snl.no/Thomas_Kuhn",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kuhn-thomas",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "edgar-degas": {
    "wikidataId": "Q46373",
    "birthDate": "1834-07-19",
    "countryCode": "FR",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Edgar_Degas",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/degas-hilaire-germain-edgar",
        "publisher": "Brockhaus Enzyklopädie",
        "publisherCountry": "DE"
      }
    ]
  },
  "herbert-marcuse": {
    "wikidataId": "Q60030",
    "birthDate": "1898-07-19",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Triết gia, nhà xã hội học",
    "dobSources": [
      {
        "url": "https://snl.no/Herbert_Marcuse",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/marcuse-herbert",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "brian-may": {
    "wikidataId": "Q15873",
    "birthDate": "1947-07-19",
    "countryCode": "GB",
    "category": "music",
    "occupation": "Nhạc sĩ, ca sĩ",
    "dobSources": [
      {
        "url": "https://www.queenonline.com/brian_may",
        "publisher": "Queen Online",
        "publisherCountry": "GB"
      },
      {
        "url": "https://www.biography.com/musicians/brian-may",
        "publisher": "Biography.com / Hearst",
        "publisherCountry": "US"
      }
    ]
  },
  "gerd-binnig": {
    "wikidataId": "Q76766",
    "birthDate": "1947-07-20",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Gerd_Binnig",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/binnig-gerd",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "natalie-wood": {
    "wikidataId": "Q180919",
    "birthDate": "1938-07-20",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Natalie_Wood",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/wood-natalie",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "richard-owen": {
    "wikidataId": "Q151556",
    "birthDate": "1804-07-20",
    "countryCode": "GB",
    "category": "scientist",
    "occupation": "Nhà sinh vật học, cổ sinh vật học",
    "dobSources": [
      {
        "url": "https://snl.no/Richard_Owen",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/owen-richard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ernest-hemingway": {
    "wikidataId": "Q23434",
    "birthDate": "1899-07-21",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Ernest_Hemingway",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hemingway-ernest",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "robin-williams": {
    "wikidataId": "Q83338",
    "birthDate": "1951-07-21",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Robin_Williams",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/williams-robin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "stefan-lofven": {
    "wikidataId": "Q2740012",
    "birthDate": "1957-07-21",
    "countryCode": "SE",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Stefan_L%C3%B6fven",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lofven-stefan",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "selena-gomez": {
    "wikidataId": "Q83287",
    "birthDate": "1992-07-22",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ, diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/musicians/selena-gomez",
        "publisher": "Biography.com / Hearst",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.universalmusic.fr/artistes/30192124702",
        "publisher": "Universal Music France",
        "publisherCountry": "FR"
      }
    ]
  },
  "arthur-seyss-inquart": {
    "wikidataId": "Q650219",
    "birthDate": "1892-07-22",
    "countryCode": "AT",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Arthur_Seyss-Inquart",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/seyss-inquart-arthur",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "mireille-mathieu": {
    "wikidataId": "Q71452",
    "birthDate": "1946-07-22",
    "countryCode": "FR",
    "category": "music",
    "occupation": "Nhạc sĩ, ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Mireille_Mathieu",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.mireillemathieu.com/biografie/?lang=de",
        "publisher": "Mireille Mathieu official website",
        "publisherCountry": "FR"
      }
    ]
  },
  "sergio-mattarella": {
    "wikidataId": "Q3956186",
    "birthDate": "1941-07-23",
    "countryCode": "IT",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Sergio_Mattarella",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mattarella-sergio",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "vera-rubin": {
    "wikidataId": "Q234888",
    "birthDate": "1928-07-23",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Vera_Rubin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rubin-vera",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "judit-polgar": {
    "wikidataId": "Q183250",
    "birthDate": "1976-07-23",
    "countryCode": "HU",
    "category": "athlete",
    "occupation": "Kỳ thủ cờ vua",
    "dobSources": [
      {
        "url": "https://snl.no/Judit_Polg%C3%A1r",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/polgar-judit",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "simon-bolivar": {
    "wikidataId": "Q8605",
    "birthDate": "1783-07-24",
    "countryCode": "VE",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Sim%C3%B3n_Bol%C3%ADvar",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bolivar-simon",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tran-van-khe": {
    "wikidataId": "Q3541430",
    "birthDate": "1921-07-24",
    "countryCode": "VN",
    "category": "music",
    "occupation": "Nhà nghiên cứu âm nhạc",
    "dobSources": [
      {
        "url": "https://www.enciklopedija.hr/clanak/tran-van-khe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Institute of Lexicography",
        "publisherCountry": "HR",
        "countryProofUrl": "https://www.lzmk.hr/en/about-us/departments"
      },
      {
        "url": "https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/tran-van-khe",
        "publisher": "Encyclopedia.com / Gale, a Cengage company",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.cengagegroup.com/contact/"
      }
    ]
  },
  "nguyen-thi-lua": {
    "wikidataId": "Q7022968",
    "birthDate": "1991-07-24",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Vận động viên vật",
    "dobSources": [
      {
        "url": "https://www.olympedia.org/athletes/124248",
        "publisher": "Olympedia / International Society of Olympic Historians",
        "publisherCountry": "CH",
        "countryProofUrl": "https://isoh.org/join-isoh/"
      },
      {
        "url": "https://digital.la84.org/digital/api/collection/p17103coll8/id/85548/download",
        "publisher": "LA84 Foundation / London 2012 Official Report",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.la84.org/privacy-policy"
      }
    ]
  },
  "elias-canetti": {
    "wikidataId": "Q80064",
    "birthDate": "1905-07-25",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Elias_Canetti",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/canetti-elias",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "rosalind-franklin": {
    "wikidataId": "Q7474",
    "birthDate": "1920-07-25",
    "countryCode": "GB",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://www.rosalindfranklin.edu/about/facts-figures/dr-rosalind-franklin/",
        "publisher": "Rosalind Franklin University of Medicine and Science",
        "publisherCountry": "US"
      },
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb14486659t",
        "publisher": "Bibliothèque nationale de France",
        "publisherCountry": "FR"
      }
    ]
  },
  "john-b-goodenough": {
    "wikidataId": "Q906529",
    "birthDate": "1922-07-25",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/prizes/chemistry/2019/goodenough/facts/",
        "publisher": "Nobel Prize Outreach",
        "publisherCountry": "SE"
      },
      {
        "url": "https://www.nasonline.org/directory-entry/john-b-goodenough-mrh6a9/",
        "publisher": "National Academy of Sciences",
        "publisherCountry": "US"
      }
    ]
  },
  "stanley-kubrick": {
    "wikidataId": "Q2001",
    "birthDate": "1928-07-26",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Đạo diễn phim, nhiếp ảnh gia",
    "dobSources": [
      {
        "url": "https://snl.no/Stanley_Kubrick",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kubrick-stanley",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "mick-jagger": {
    "wikidataId": "Q128121",
    "birthDate": "1943-07-26",
    "countryCode": "GB",
    "category": "music",
    "occupation": "Nhạc sĩ, ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Mick_Jagger",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/jagger-mick",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "vo-thanh-tung": {
    "wikidataId": "Q7939157",
    "birthDate": "1985-07-26",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://tokio2020.rtve.es/paralimpicos/es/resultados/natacion/perfil-de-deportista-n1718428-vo-thanh-tung.htm",
        "publisher": "RTVE, Radiotelevisión Española",
        "publisherCountry": "ES",
        "countryProofUrl": "https://www.rtve.es/contacto/rtve/"
      },
      {
        "url": "https://www.paralympic.org/sites/default/files/2025-10/Tokyo%202020%20Paralympic%20Games%20-%20Para%20Swimming%20Results.pdf",
        "publisher": "International Paralympic Committee",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.paralympic.org/imprint"
      }
    ]
  },
  "hans-fischer": {
    "wikidataId": "Q76604",
    "birthDate": "1881-07-27",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Hans_Fischer",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/fischer-hans",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alexandre-dumas-fils": {
    "wikidataId": "Q169150",
    "birthDate": "1824-07-27",
    "countryCode": "FR",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://www.academie-francaise.fr/les-immortels/alexandre-dumas-fils",
        "publisher": "Académie française",
        "publisherCountry": "FR"
      },
      {
        "url": "https://comedie-francaise.bibli.fr/index.php?id=26&lvl=author_see",
        "publisher": "Comédie-Française, La Grange",
        "publisherCountry": "FR"
      }
    ]
  },
  "marek-hamsik": {
    "wikidataId": "Q201825",
    "birthDate": "1987-07-27",
    "countryCode": "SK",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://www.marek-hamsik.sk/profil",
        "publisher": "Marek Hamšík official website",
        "publisherCountry": "SK"
      },
      {
        "url": "https://www.tff.org/Default.aspx?kisiId=2294024&pageId=526",
        "publisher": "Turkish Football Federation",
        "publisherCountry": "TR"
      }
    ]
  },
  "hugo-chavez": {
    "wikidataId": "Q8440",
    "birthDate": "1954-07-28",
    "countryCode": "VE",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Hugo_Ch%C3%A1vez",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/chavez-hugo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alexis-tsipras": {
    "wikidataId": "Q312015",
    "birthDate": "1974-07-28",
    "countryCode": "GR",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Alexis_Tsipras",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/cipras-aleksis",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "charles-hard-townes": {
    "wikidataId": "Q184566",
    "birthDate": "1915-07-28",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Charles_Hard_Townes",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/townes-charles-hard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "eyvind-johnson": {
    "wikidataId": "Q131326",
    "birthDate": "1900-07-29",
    "countryCode": "SE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Eyvind_Johnson",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/johnson-eyvind",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "harry-mulisch": {
    "wikidataId": "Q927",
    "birthDate": "1927-07-29",
    "countryCode": "NL",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Harry_Mulisch",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mulisch-harry",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "fernando-alonso": {
    "wikidataId": "Q10514",
    "birthDate": "1981-07-29",
    "countryCode": "ES",
    "category": "athlete",
    "occupation": "Vận động viên",
    "dobSources": [
      {
        "url": "https://www.formula1.com/en/drivers/fernando-alonso",
        "publisher": "Formula 1",
        "publisherCountry": "GB"
      },
      {
        "url": "https://www.motorsport.com/driver/fernando-alonso/489/",
        "publisher": "Motorsport Network",
        "publisherCountry": "GB"
      }
    ]
  },
  "henry-ford": {
    "wikidataId": "Q8768",
    "birthDate": "1863-07-30",
    "countryCode": "US",
    "category": "entrepreneur",
    "occupation": "Doanh nhân",
    "dobSources": [
      {
        "url": "https://snl.no/Henry_Ford",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/ford-henry",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "emily-bronte": {
    "wikidataId": "Q80137",
    "birthDate": "1818-07-30",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Emily_Bront%C3%AB",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bronte-emily",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "arnold-schwarzenegger": {
    "wikidataId": "Q2685",
    "birthDate": "1947-07-30",
    "countryCode": "AT",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Arnold_Schwarzenegger",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/schwarzenegger-arnold",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "milton-friedman": {
    "wikidataId": "Q47426",
    "birthDate": "1912-07-31",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Milton_Friedman",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/friedman-milton",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "friedrich-wohler": {
    "wikidataId": "Q58575",
    "birthDate": "1800-07-31",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://snl.no/Friedrich_W%C3%B6hler",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/wohler-friedrich",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jean-dubuffet": {
    "wikidataId": "Q170076",
    "birthDate": "1901-07-31",
    "countryCode": "FR",
    "category": "artist",
    "occupation": "Nghệ sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Jean_Dubuffet",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/dubuffet-jean",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  }
};
const b011ScopePeople = ALL_PEOPLE.filter((p) => !B012_NEW_IDS.has(p.id) && !B013_NEW_IDS.has(p.id) && !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
const B011_NEW_PEOPLE = b011ScopePeople.filter((p) => p.birthMonth === 7);
const B011_APPROVED_IDS = new Set(Object.keys(B011_APPROVED_PROFILES));
const B011_APPROVED_QIDS = new Set(Object.values(B011_APPROVED_PROFILES).map((profile) => profile.wikidataId));
assert('Rule AF', B011_NEW_PEOPLE.length === 93, `B011 requires exactly 93 new July profiles, found ${B011_NEW_PEOPLE.length}`);
assert('Rule AF', B011_APPROVED_IDS.size === 93 && B011_APPROVED_QIDS.size === 93, 'B011 approved IDs and QIDs must be exact and unique');
assert('Rule AF', B011_NEW_PEOPLE.every((p) => B011_APPROVED_IDS.has(p.id)), 'B011 additions must match only the approved profile ID list');
assert('Rule AF', B011_NEW_PEOPLE.length === B011_APPROVED_IDS.size, 'B011 must contain every approved profile exactly once');
assert('Rule AF', new Set(B011_NEW_PEOPLE.map((p) => p.wikidataId)).size === 93, 'B011 Wikidata IDs must be unique');

function isApprovedB011DobSource(qid: string, url: string): boolean {
  return Object.values(B011_APPROVED_PROFILES).some((profile) => profile.wikidataId === qid && profile.dobSources.some((source) => source.url === url));
}

for (const p of B011_NEW_PEOPLE) {
  const expected = B011_APPROVED_PROFILES[p.id];
  assert('Rule AF', Boolean(expected), `Unapproved B011 profile ID: ${p.id}`);
  if (!expected) continue;
  assert('Rule AF', p.wikidataId === expected.wikidataId, `B011 ${p.id} expected ${expected.wikidataId}, got ${p.wikidataId}`);
  assert('Rule AF', p.birthDate === expected.birthDate, `B011 ${p.id} expected DOB ${expected.birthDate}, got ${p.birthDate}`);
  assert('Rule AF', p.birthMonth === 7 && /^\d{4}-07-\d{2}$/.test(p.birthDate), `B011 ${p.id} must be a July record`);
  assert('Rule AF', p.birthYear === Number(p.birthDate.slice(0,4)) && p.birthDay === Number(p.birthDate.slice(8,10)), `B011 ${p.id} split date fields must match birthDate`);
  assert('Rule AF', p.countryCode === expected.countryCode, `B011 ${p.id} nationality must match reviewed mapping`);
  assert('Rule AF', p.category === expected.category, `B011 ${p.id} category must match reviewed mapping`);
  assert('Rule AF', p.occupation?.length === 1 && p.occupation[0] === expected.occupation, `B011 ${p.id} occupation must match reviewed mapping`);
  assert('Rule AF', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${p.wikidataId}`) === true, `B011 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AF source', expected.dobSources.length === 2, `B011 ${p.id} must have exactly two reviewed DOB publishers`);
  assert('Rule AF source', new Set(expected.dobSources.map((source) => source.publisher)).size === 2, `B011 ${p.id} DOB publishers must be distinct`);
  assert('Rule AF source', new Set(expected.dobSources.map((source) => getUrlHostname(source.url))).size === 2, `B011 ${p.id} DOB source hosts must be distinct`);
  const approvedUrls = expected.dobSources.map((source) => source.url);
  const nonWikiUrls = sourceUrlsBeforeBv017(p).filter((url) => !['wikidata.org','www.wikidata.org','wikipedia.org','www.wikipedia.org','wikimedia.org','www.wikimedia.org'].includes(getUrlHostname(url)));
  assert('Rule AF source', nonWikiUrls.length === 2 && approvedUrls.every((url) => nonWikiUrls.includes(url)), `B011 ${p.id} must include exactly its two reviewed non-Wikidata DOB sources`);
  for (const source of expected.dobSources) {
    assert('Rule AF source positive', isApprovedB011DobSource(p.wikidataId || '', source.url), `B011 reviewed source must pass for ${p.id}: ${source.url}`);
    assert('Rule AF source profile', (p.sourceUrls || []).includes(source.url), `B011 ${p.id} must include reviewed source ${source.url}`);
    const host = getUrlHostname(source.url);
    assert('Rule AF source URL', Boolean(host) && !host.endsWith('.vn'), `B011 source must use a valid non-Vietnam host: ${source.url}`);
    assert('Rule AF source negative', !isApprovedB011DobSource('Q0', source.url), `B011 source must not approve a different QID: ${source.url}`);
    assert('Rule AF source negative', !isApprovedB011DobSource(p.wikidataId || '', `${source.url}#unreviewed`), `B011 unreviewed source fragment must fail: ${source.url}`);
    const queryVariant = source.url.includes('?') ? `${source.url}&unreviewed=1` : `${source.url}?unreviewed=1`;
    assert('Rule AF source negative', !isApprovedB011DobSource(p.wikidataId || '', queryVariant), `B011 unreviewed source query must fail: ${source.url}`);
    const pathVariant = new URL(source.url);
    pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AF source negative', !isApprovedB011DobSource(p.wikidataId || '', pathVariant.href), `B011 unreviewed source path must fail: ${source.url}`);
    const lookalike = new URL(source.url);
    lookalike.hostname += '.evil.example';
    assert('Rule AF source negative', !isApprovedB011DobSource(p.wikidataId || '', lookalike.href), `B011 lookalike source host must fail: ${source.url}`);
    assert('Rule AF source negative', !isApprovedB011DobSource(p.wikidataId || '', 'not-a-url'), 'B011 malformed source URL must fail');
  }
}

const b011Vietnamese = B011_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AF balance', b011Vietnamese.length === 5, `B011 Vietnamese count must be 5, found ${b011Vietnamese.length}`);
assert('Rule AF balance', b011Vietnamese.length / B011_NEW_PEOPLE.length >= 0.05, `B011 Vietnamese share must be at least 5%; found ${b011Vietnamese.length}/${B011_NEW_PEOPLE.length}`);
assert('Rule AF balance', new Set(b011Vietnamese.map((p) => p.wikidataId)).size === 5, 'B011 Vietnamese QIDs must be unique');
for (const p of b011Vietnamese) {
  const expected = B011_APPROVED_PROFILES[p.id];
  const sources = expected?.dobSources || [];
  assert('Rule AF Vietnamese', Boolean(expected) && expected.wikidataId === p.wikidataId, `B011 Vietnamese profile must match reviewed QID: ${p.id}`);
  assert('Rule AF Vietnamese', sources.length === 2, `B011 Vietnamese ${p.id} requires exactly two reviewed foreign DOB sources`);
  assert('Rule AF Vietnamese', sources.every((source) => source.publisherCountry !== 'VN' && Boolean(source.countryProofUrl?.startsWith('https://'))), `B011 Vietnamese ${p.id} requires two foreign publishers with official country proof`);
  assert('Rule AF Vietnamese', sources.every((source) => (p.sourceUrls || []).includes(source.url)), `B011 Vietnamese ${p.id} must include both approved DOB URLs`);
}
for (let day = 1; day <= 31; day++) {
  const count = B011_NEW_PEOPLE.filter((p) => p.birthDay === day).length;
  assert('Rule AF coverage', count === 3, `B011 July ${day} must have exactly 3 new profiles, found ${count}`);
}
assert('Rule AF historical snapshot', b011ScopePeople.length === 661, `B011 checkpoint must contain 661 people before B012, found ${b011ScopePeople.length}`);
const b011CoveredDays = new Set(b011ScopePeople.map((p) => `${p.birthMonth}-${p.birthDay}`));
assert('Rule AF coverage', b011CoveredDays.size === 215, `B011 expected 215 covered calendar days after July, found ${b011CoveredDays.size}`);
const b011PreservedPeople = b011ScopePeople.filter((p) => p.birthMonth !== 7).sort((a, b) => a.id.localeCompare(b.id));
assert('Rule AF baseline', b011PreservedPeople.length === 568, `B011 must preserve all 568 non-July baseline people, found ${b011PreservedPeople.length}`);
assert('Rule AF baseline', stableSha256(b011PreservedPeople.map(projectPersonBeforeBv017)) === '7c31cfcf776fa4fcda052ba23f2c4d78883749cb18b80162104bf0b4c09ea674', 'All 568 non-July baseline profiles, including August, must remain deep-equal after the independently verified BV-017 correction projection');
assert('Rule AF baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All 4 history events must remain deep-equal');
console.log(`B011 additions: ${B011_NEW_PEOPLE.length}; Vietnamese: ${b011Vietnamese.length}; Vietnamese share: ${(b011Vietnamese.length / B011_NEW_PEOPLE.length * 100).toFixed(2)}%; coverage: ${b011CoveredDays.size}/366`);

// ------------------------------------------------------------
// Rule AG: B012 exact August profile set, direct DOB source pairs,
// official foreign-publisher evidence for Vietnamese records, and baseline preservation.
// ------------------------------------------------------------
console.log('Checking Rule AG: B012 exact August profile set, source pairs, balance, and baseline preservation...');
const B012_APPROVED_PROFILES: Readonly<Record<string, {
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  category: string;
  occupation: string;
  dobSources: readonly { url: string; publisher: string; publisherCountry: string; countryProofUrl?: string }[];
}>> = {
  "herman-melville": {
    "wikidataId": "Q4985",
    "birthDate": "1819-08-01",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn, nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Herman_Melville",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/melville-herman",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jean-baptiste-lamarck": {
    "wikidataId": "Q82122",
    "birthDate": "1744-08-01",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà tự nhiên học",
    "dobSources": [
      {
        "url": "https://snl.no/Jean-Baptiste_Lamarck",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Jean-Baptiste%20Lamarck",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "pierre-bourdieu": {
    "wikidataId": "Q156268",
    "birthDate": "1930-08-01",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà xã hội học",
    "dobSources": [
      {
        "url": "https://snl.no/Pierre_Bourdieu",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bourdieu-pierre",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "james-baldwin": {
    "wikidataId": "Q273210",
    "birthDate": "1924-08-02",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/James_Baldwin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=James%20Baldwin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tom-brady": {
    "wikidataId": "Q313381",
    "birthDate": "1977-08-03",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Cầu thủ bóng bầu dục Mỹ",
    "dobSources": [
      {
        "url": "https://snl.no/Tom_Brady",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/brady-tom",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "stanley-baldwin": {
    "wikidataId": "Q166635",
    "birthDate": "1867-08-03",
    "countryCode": "GB",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Stanley_Baldwin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/baldwin-stanley",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "martin-sheen": {
    "wikidataId": "Q184572",
    "birthDate": "1940-08-03",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Martin_Sheen",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sheen-martin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "percy-bysshe-shelley": {
    "wikidataId": "Q93343",
    "birthDate": "1792-08-04",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Percy_Bysshe_Shelley",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/shelley-percy-bysshe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "knut-hamsun": {
    "wikidataId": "Q40826",
    "birthDate": "1859-08-04",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Knut_Hamsun",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hamsun-knut",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "william-rowan-hamilton": {
    "wikidataId": "Q11887",
    "birthDate": "1805-08-04",
    "countryCode": "IE",
    "category": "scientist",
    "occupation": "Nhà toán học, nhà thiên văn học",
    "dobSources": [
      {
        "url": "https://snl.no/William_Rowan_Hamilton",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hamilton-william-rowan",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "neil-armstrong": {
    "wikidataId": "Q1615",
    "birthDate": "1930-08-05",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Phi hành gia",
    "dobSources": [
      {
        "url": "https://snl.no/Neil_Armstrong",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/armstrong-neil",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "guy-de-maupassant": {
    "wikidataId": "Q9327",
    "birthDate": "1850-08-05",
    "countryCode": "FR",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Guy_de_Maupassant",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/maupassant-guy-de",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "john-huston": {
    "wikidataId": "Q51575",
    "birthDate": "1906-08-05",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Đạo diễn phim, diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/John_Huston",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/huston-john",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "andy-warhol": {
    "wikidataId": "Q5603",
    "birthDate": "1928-08-06",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Họa sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Andy_Warhol",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/warhol-andy",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alexander-fleming": {
    "wikidataId": "Q37064",
    "birthDate": "1881-08-06",
    "countryCode": "GB",
    "category": "scientist",
    "occupation": "Nhà sinh học",
    "dobSources": [
      {
        "url": "https://snl.no/Alexander_Fleming",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/fleming-alexander",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alfred-tennyson": {
    "wikidataId": "Q173869",
    "birthDate": "1809-08-06",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Alfred_Tennyson",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/tennyson-alfred",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "mata-hari": {
    "wikidataId": "Q82180",
    "birthDate": "1876-08-07",
    "countryCode": "NL",
    "category": "artist",
    "occupation": "Vũ công",
    "dobSources": [
      {
        "url": "https://snl.no/Mata_Hari",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/mata-hari",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ralph-bunche": {
    "wikidataId": "Q213500",
    "birthDate": "1904-08-07",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Nhà ngoại giao",
    "dobSources": [
      {
        "url": "https://snl.no/Ralph_Bunche",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Ralph%20Bunche",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "abebe-bikila": {
    "wikidataId": "Q52596",
    "birthDate": "1932-08-07",
    "countryCode": "ET",
    "category": "athlete",
    "occupation": "Vận động viên điền kinh",
    "dobSources": [
      {
        "url": "https://snl.no/Abebe_Bikila",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bikila-abebe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "paul-dirac": {
    "wikidataId": "Q47480",
    "birthDate": "1902-08-08",
    "countryCode": "GB",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Paul_Dirac",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Paul%20Dirac",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "emiliano-zapata": {
    "wikidataId": "Q41718",
    "birthDate": "1879-08-08",
    "countryCode": "MX",
    "category": "history",
    "occupation": "Nhà cách mạng",
    "dobSources": [
      {
        "url": "https://snl.no/Emiliano_Zapata",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/zapata-emiliano",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ernest-lawrence": {
    "wikidataId": "Q169577",
    "birthDate": "1901-08-08",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Ernest_Lawrence",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Ernest%20Lawrence",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jean-piaget": {
    "wikidataId": "Q123190",
    "birthDate": "1896-08-09",
    "countryCode": "CH",
    "category": "scientist",
    "occupation": "Nhà tâm lý học",
    "dobSources": [
      {
        "url": "https://snl.no/Jean_Piaget",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/piaget-jean",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "amedeo-avogadro": {
    "wikidataId": "Q43476",
    "birthDate": "1776-08-09",
    "countryCode": "IT",
    "category": "scientist",
    "occupation": "Nhà hóa học",
    "dobSources": [
      {
        "url": "https://snl.no/Amedeo_Avogadro",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/avogadro-amedeo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tove-jansson": {
    "wikidataId": "Q102071",
    "birthDate": "1914-08-09",
    "countryCode": "FI",
    "category": "literature",
    "occupation": "Nhà văn, họa sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Tove_Jansson",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Tove%20Jansson",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "herbert-hoover": {
    "wikidataId": "Q35236",
    "birthDate": "1874-08-10",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Herbert_Hoover",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Herbert%20Hoover",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "antonio-banderas": {
    "wikidataId": "Q41548",
    "birthDate": "1960-08-10",
    "countryCode": "ES",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Antonio_Banderas",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/banderas-antonio",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jorge-amado": {
    "wikidataId": "Q184440",
    "birthDate": "1912-08-10",
    "countryCode": "BR",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Jorge_Amado",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/amado-jorge",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "pervez-musharraf": {
    "wikidataId": "Q40495",
    "birthDate": "1943-08-11",
    "countryCode": "PK",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Pervez_Musharraf",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/musharraf-pervez",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "aaron-klug": {
    "wikidataId": "Q190626",
    "birthDate": "1926-08-11",
    "countryCode": "GB",
    "category": "scientist",
    "occupation": "Nhà hóa sinh",
    "dobSources": [
      {
        "url": "https://snl.no/Aaron_Klug",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/klug-aaron",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jan-palach": {
    "wikidataId": "Q192893",
    "birthDate": "1948-08-11",
    "countryCode": "CZ",
    "category": "history",
    "occupation": "Nhà hoạt động",
    "dobSources": [
      {
        "url": "https://snl.no/Jan_Palach",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/palach-jan",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "francois-hollande": {
    "wikidataId": "Q157",
    "birthDate": "1954-08-12",
    "countryCode": "FR",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Fran%C3%A7ois_Hollande",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hollande-francois",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "erwin-schrodinger": {
    "wikidataId": "Q9130",
    "birthDate": "1887-08-12",
    "countryCode": "AT",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Erwin_Schr%C3%B6dinger",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/schrodinger-erwin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "pete-sampras": {
    "wikidataId": "Q9446",
    "birthDate": "1971-08-12",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Vận động viên quần vợt",
    "dobSources": [
      {
        "url": "https://snl.no/Pete_Sampras",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/sampras-pete",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "fidel-castro": {
    "wikidataId": "Q11256",
    "birthDate": "1926-08-13",
    "countryCode": "CU",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Fidel_Castro",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Fidel%20Castro",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "alfred-hitchcock": {
    "wikidataId": "Q7374",
    "birthDate": "1899-08-13",
    "countryCode": "GB",
    "category": "actor",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Alfred_Hitchcock",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hitchcock-alfred",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "hans-christian-orsted": {
    "wikidataId": "Q44412",
    "birthDate": "1777-08-14",
    "countryCode": "DK",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Hans_Christian_%C3%98rsted",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/orsted-hans-christian",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "wim-wenders": {
    "wikidataId": "Q55411",
    "birthDate": "1945-08-14",
    "countryCode": "DE",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Wim_Wenders",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/wenders-wim",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "steve-martin": {
    "wikidataId": "Q16473",
    "birthDate": "1945-08-14",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên, nghệ sĩ hài",
    "dobSources": [
      {
        "url": "https://snl.no/Steve_Martin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/martin-steve",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "walter-scott": {
    "wikidataId": "Q79025",
    "birthDate": "1771-08-15",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn, nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Walter_Scott",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/scott-walter",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "madonna": {
    "wikidataId": "Q1744",
    "birthDate": "1958-08-16",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Madonna_-_popsanger",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/madonna",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "charles-bukowski": {
    "wikidataId": "Q76409",
    "birthDate": "1920-08-16",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn, nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Charles_Bukowski",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bukowski-charles",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "gabriel-lippmann": {
    "wikidataId": "Q133232",
    "birthDate": "1845-08-16",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Gabriel_Lippmann",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lippmann-gabriel",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "robert-de-niro": {
    "wikidataId": "Q36949",
    "birthDate": "1943-08-17",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Robert_De_Niro",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/de-niro-robert",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "herta-muller": {
    "wikidataId": "Q38049",
    "birthDate": "1953-08-17",
    "countryCode": "DE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Herta_M%C3%BCller",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/muller-herta",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "thierry-henry": {
    "wikidataId": "Q45901",
    "birthDate": "1977-08-17",
    "countryCode": "FR",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://snl.no/Thierry_Henry",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/henry-thierry",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "roman-polanski": {
    "wikidataId": "Q51552",
    "birthDate": "1933-08-18",
    "countryCode": "FR",
    "category": "actor",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Roman_Polanski",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/polanski-roman",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "robert-redford": {
    "wikidataId": "Q59215",
    "birthDate": "1936-08-18",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên, đạo diễn",
    "dobSources": [
      {
        "url": "https://snl.no/Robert_Redford",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/redford-robert",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "luc-montagnier": {
    "wikidataId": "Q103598",
    "birthDate": "1932-08-18",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà sinh học",
    "dobSources": [
      {
        "url": "https://snl.no/Luc_Montagnier",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/montagnier-luc",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "bill-clinton": {
    "wikidataId": "Q1124",
    "birthDate": "1946-08-19",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Bill_Clinton",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/clinton-william-jefferson",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "coco-chanel": {
    "wikidataId": "Q45661",
    "birthDate": "1883-08-19",
    "countryCode": "FR",
    "category": "artist",
    "occupation": "Nhà thiết kế thời trang",
    "dobSources": [
      {
        "url": "https://snl.no/Coco_Chanel",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/chanel-coco",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "benjamin-harrison": {
    "wikidataId": "Q35678",
    "birthDate": "1833-08-20",
    "countryCode": "US",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Benjamin_Harrison",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/harrison-benjamin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "rajiv-gandhi": {
    "wikidataId": "Q4593",
    "birthDate": "1944-08-20",
    "countryCode": "IN",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Rajiv_Gandhi",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/gandhi-rajiv",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "salvatore-quasimodo": {
    "wikidataId": "Q83038",
    "birthDate": "1901-08-20",
    "countryCode": "IT",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Salvatore_Quasimodo",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/quasimodo-salvatore",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "usain-bolt": {
    "wikidataId": "Q1189",
    "birthDate": "1986-08-21",
    "countryCode": "JM",
    "category": "athlete",
    "occupation": "Vận động viên điền kinh",
    "dobSources": [
      {
        "url": "https://snl.no/Usain_Bolt",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bolt-usain",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "augustin-louis-cauchy": {
    "wikidataId": "Q8814",
    "birthDate": "1789-08-21",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà toán học",
    "dobSources": [
      {
        "url": "https://snl.no/Augustin_Louis_Cauchy",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Augustin%20Louis%20Cauchy",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "wilt-chamberlain": {
    "wikidataId": "Q182455",
    "birthDate": "1936-08-21",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Cầu thủ bóng rổ",
    "dobSources": [
      {
        "url": "https://snl.no/Wilt_Chamberlain",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/chamberlain-wilt",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "claude-debussy": {
    "wikidataId": "Q4700",
    "birthDate": "1862-08-22",
    "countryCode": "FR",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/Claude_Debussy",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/debussy-claude",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ray-bradbury": {
    "wikidataId": "Q40640",
    "birthDate": "1920-08-22",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Ray_Bradbury",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bradbury-ray",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "kobe-bryant": {
    "wikidataId": "Q25369",
    "birthDate": "1978-08-23",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Cầu thủ bóng rổ",
    "dobSources": [
      {
        "url": "https://snl.no/Kobe_Bryant",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bryant-kobe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "gene-kelly": {
    "wikidataId": "Q73089",
    "birthDate": "1912-08-23",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên, vũ công",
    "dobSources": [
      {
        "url": "https://snl.no/Gene_Kelly",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/kelly-gene",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "giuseppe-meazza": {
    "wikidataId": "Q192131",
    "birthDate": "1910-08-23",
    "countryCode": "IT",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://snl.no/Giuseppe_Meazza",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/meazza-giuseppe",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jorge-luis-borges": {
    "wikidataId": "Q909",
    "birthDate": "1899-08-24",
    "countryCode": "AR",
    "category": "literature",
    "occupation": "Nhà văn, nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Jorge_Luis_Borges",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/borges-jorge-luis",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "paulo-coelho": {
    "wikidataId": "Q12881",
    "birthDate": "1947-08-24",
    "countryCode": "BR",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Paulo_Coelho",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/coelho-paulo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "sean-connery": {
    "wikidataId": "Q4573",
    "birthDate": "1930-08-25",
    "countryCode": "GB",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Sean_Connery",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/connery-sean",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "tim-burton": {
    "wikidataId": "Q56008",
    "birthDate": "1958-08-25",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Tim_Burton",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/burton-tim",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "leonard-bernstein": {
    "wikidataId": "Q152505",
    "birthDate": "1918-08-25",
    "countryCode": "US",
    "category": "music",
    "occupation": "Nhà soạn nhạc, nhạc trưởng",
    "dobSources": [
      {
        "url": "https://snl.no/Leonard_Bernstein",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bernstein-leonard",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "antoine-lavoisier": {
    "wikidataId": "Q39607",
    "birthDate": "1743-08-26",
    "countryCode": "FR",
    "category": "scientist",
    "occupation": "Nhà hóa học",
    "dobSources": [
      {
        "url": "https://snl.no/Antoine_Lavoisier",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Antoine%20Lavoisier",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "guillaume-apollinaire": {
    "wikidataId": "Q133855",
    "birthDate": "1880-08-26",
    "countryCode": "FR",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Guillaume_Apollinaire",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/apollinaire-guillaume",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "georg-wilhelm-friedrich-hegel": {
    "wikidataId": "Q9235",
    "birthDate": "1770-08-27",
    "countryCode": "DE",
    "category": "history",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://snl.no/Georg_Wilhelm_Friedrich_Hegel",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/hegel-georg-wilhelm-friedrich",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "theodore-dreiser": {
    "wikidataId": "Q486096",
    "birthDate": "1871-08-27",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Theodore_Dreiser",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/dreiser-theodore",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "jose-eduardo-dos-santos": {
    "wikidataId": "Q57313",
    "birthDate": "1942-08-28",
    "countryCode": "AO",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Jos%C3%A9_Eduardo_dos_Santos",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/dos-santos-jose-eduardo",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "paul-martin": {
    "wikidataId": "Q128529",
    "birthDate": "1938-08-28",
    "countryCode": "CA",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://snl.no/Paul_Martin",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Paul%20Martin",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "michael-jackson": {
    "wikidataId": "Q2831",
    "birthDate": "1958-08-29",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Michael_Jackson",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/jackson-michael",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ingrid-bergman": {
    "wikidataId": "Q43247",
    "birthDate": "1915-08-29",
    "countryCode": "SE",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Ingrid_Bergman",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/bergman-ingrid",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "charlie-parker": {
    "wikidataId": "Q103767",
    "birthDate": "1920-08-29",
    "countryCode": "US",
    "category": "music",
    "occupation": "Nhạc sĩ saxophone",
    "dobSources": [
      {
        "url": "https://snl.no/Charlie_Parker",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/parker-charlie",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "ernest-rutherford": {
    "wikidataId": "Q9123",
    "birthDate": "1871-08-30",
    "countryCode": "NZ",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://snl.no/Ernest_Rutherford",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/rutherford-ernest",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "warren-buffett": {
    "wikidataId": "Q47213",
    "birthDate": "1930-08-30",
    "countryCode": "US",
    "category": "entrepreneur",
    "occupation": "Nhà đầu tư, doanh nhân",
    "dobSources": [
      {
        "url": "https://snl.no/Warren_Buffett",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Warren%20Buffett",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "mary-shelley": {
    "wikidataId": "Q47152",
    "birthDate": "1797-08-30",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Mary_Shelley",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/Abecedarij?q=Mary%20Shelley",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "maria-montessori": {
    "wikidataId": "Q131117",
    "birthDate": "1870-08-31",
    "countryCode": "IT",
    "category": "scientist",
    "occupation": "Bác sĩ, nhà giáo dục",
    "dobSources": [
      {
        "url": "https://snl.no/Maria_Montessori",
        "publisher": "Store norske leksikon",
        "publisherCountry": "NO"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/montessori-maria",
        "publisher": "Hrvatska enciklopedija / Miroslav Krleža Lexicographical Institute",
        "publisherCountry": "HR"
      }
    ]
  },
  "isabel-allende": {
    "wikidataId": "Q83566",
    "birthDate": "1942-08-02",
    "countryCode": "CL",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://s3-us-west-1.amazonaws.com/isabelallende.com/assets/bio/Bio_Isabel-en.pdf",
        "publisher": "Isabel Allende official biography",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.biography.com/authors-writers/isabel-allende",
        "publisher": "Biography.com",
        "publisherCountry": "US"
      }
    ]
  },
  "shimon-peres": {
    "wikidataId": "Q57410",
    "birthDate": "1923-08-02",
    "countryCode": "IL",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://m.knesset.gov.il/en/about/lexicon/pages/peresshimon.aspx",
        "publisher": "The Knesset",
        "publisherCountry": "IL"
      },
      {
        "url": "https://www.peres-center.org/en/shimon-peres/about/",
        "publisher": "Peres Center for Peace and Innovation",
        "publisherCountry": "IL"
      }
    ]
  },
  "ben-affleck": {
    "wikidataId": "Q483118",
    "birthDate": "1972-08-15",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên, nhà làm phim",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/ben-affleck",
        "publisher": "Biography.com",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.imdb.com/name/nm0000255/bio/",
        "publisher": "IMDb",
        "publisherCountry": "US"
      }
    ]
  },
  "luong-cuong": {
    "wikidataId": "Q18459548",
    "birthDate": "1957-08-15",
    "countryCode": "VN",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://lex.dk/L%C6%B0%C6%A1ng_C%C6%B0%E1%BB%9Dng",
        "publisher": "Lex — Denmark’s National Encyclopedia",
        "publisherCountry": "DK",
        "countryProofUrl": "https://lex.dk/"
      },
      {
        "url": "https://www.iseas.edu.sg/wp-content/uploads/2020/03/ISEAS_Perspective_2020_41.pdf",
        "publisher": "ISEAS — Yusof Ishak Institute",
        "publisherCountry": "SG",
        "countryProofUrl": "https://bookshop.iseas.edu.sg/contacts"
      }
    ]
  },
  "dang-tieu-binh": {
    "wikidataId": "Q16977",
    "birthDate": "1904-08-22",
    "countryCode": "CN",
    "category": "politics",
    "occupation": "Chính khách",
    "dobSources": [
      {
        "url": "https://www.biography.com/political-figures/deng-xiaoping",
        "publisher": "Biography.com",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.encyclopedia.com/people/history/chinese-and-taiwanese-history-biographies/deng-xiaoping",
        "publisher": "Encyclopedia.com",
        "publisherCountry": "US"
      }
    ]
  },
  "jack-black": {
    "wikidataId": "Q483907",
    "birthDate": "1969-08-28",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên, nhạc sĩ",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/jack-black",
        "publisher": "Biography.com",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.imdb.com/name/nm0085312/bio/",
        "publisher": "IMDb",
        "publisherCountry": "US"
      }
    ]
  },
  "richard-gere": {
    "wikidataId": "Q48410",
    "birthDate": "1949-08-31",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/richard-gere",
        "publisher": "Biography.com",
        "publisherCountry": "US"
      },
      {
        "url": "https://www.imdb.com/name/nm0000152/bio/",
        "publisher": "IMDb",
        "publisherCountry": "US"
      }
    ]
  },
  "hermann-von-helmholtz": {
    "wikidataId": "Q60024",
    "birthDate": "1821-08-31",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Nhà vật lý, bác sĩ",
    "dobSources": [
      {
        "url": "https://www.helmholtz-berlin.de/zentrum/historie-hzb/hermann-helmholtz_en.html",
        "publisher": "Helmholtz-Zentrum Berlin",
        "publisherCountry": "DE"
      },
      {
        "url": "https://catalogues.royalsociety.org/CalmView/Record.aspx?id=NA5518&pos=1&src=CalmView.Persons",
        "publisher": "The Royal Society catalogue",
        "publisherCountry": "GB"
      }
    ]
  },
  "dang-van-lam": {
    "wikidataId": "Q5215950",
    "birthDate": "1993-08-13",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.cerezo.jp/team/players/archive/dang_van_lam-2/",
        "publisher": "Cerezo Osaka",
        "publisherCountry": "JP",
        "countryProofUrl": "https://www.cerezo.jp/en/stadium/"
      },
      {
        "url": "https://www.sofascore.com/football/player/dang-van-lam/992817",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/contact"
      }
    ]
  },
  "nguyen-dinh-bac": {
    "wikidataId": "Q121608659",
    "birthDate": "2004-08-19",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.ocagames.com/HZ_Info/AG2022-/en/results/football/athlete-profile-n2028956-nguyen-dinh-bac.htm",
        "publisher": "Olympic Council of Asia — Hangzhou 2022 official athlete profile",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/constitution/"
      },
      {
        "url": "https://www.sofascore.com/football/player/nguyen-dinh-bac/1390130",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/contact"
      }
    ]
  },
  "pham-quynh-anh": {
    "wikidataId": "Q7189919",
    "birthDate": "1984-08-24",
    "countryCode": "VN",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://music.apple.com/us/artist/ph%E1%BA%A1m-qu%E1%BB%B3nh-anh/1757573861",
        "publisher": "Apple Music / Apple Inc.",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.apple.com/legal/contact/copyright-infringement.html"
      },
      {
        "url": "https://www.imdb.com/name/nm7755030/bio/",
        "publisher": "IMDb",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.imdb.com/conditions/"
      }
    ]
  },
  "quach-cong-lich": {
    "wikidataId": "Q56640625",
    "birthDate": "1993-08-27",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Vận động viên điền kinh",
    "dobSources": [
      {
        "url": "https://worldathletics.org/athletes/vietnam/cong-lich-quach-14543357",
        "publisher": "World Athletics",
        "publisherCountry": "MC",
        "countryProofUrl": "https://worldathletics.org/organisation/our-organisation/structure/headquarters"
      },
      {
        "url": "https://www.ocagames.com/orb/theme/books/Jakarta_2018/AG2018_OfficialResultBook_Athletics_v1.1.pdf",
        "publisher": "Olympic Council of Asia — Jakarta 2018 official results book",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/constitution/"
      }
    ]
  },
  "katherine-johnson": {
    "wikidataId": "Q11740",
    "birthDate": "1918-08-26",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà toán học",
    "dobSources": [
      {
        "url": "https://science.nasa.gov/people/katherine-johnson/",
        "publisher": "NASA Science",
        "publisherCountry": "US"
      },
      {
        "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Johnson_Katherine/",
        "publisher": "MacTutor History of Mathematics, University of St Andrews",
        "publisherCountry": "GB"
      }
    ]
  }
};
const B012_APPROVED_IDS = new Set(Object.keys(B012_APPROVED_PROFILES));
const B012_APPROVED_QIDS = new Set(Object.values(B012_APPROVED_PROFILES).map((profile) => profile.wikidataId));
const b012HistoricalPeople = ALL_PEOPLE.filter((p) => !B013_NEW_IDS.has(p.id) && !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
const B012_NEW_PEOPLE = b012HistoricalPeople.filter((p) => B012_APPROVED_IDS.has(p.id));
assert('Rule AG', B012_NEW_IDS.size === 93 && B012_APPROVED_IDS.size === 93, 'B012 exact allowlist must contain 93 unique IDs');
assert('Rule AG', B012_NEW_IDS.size === B012_APPROVED_IDS.size && [...B012_NEW_IDS].every((id) => B012_APPROVED_IDS.has(id)), 'B012 historical projection IDs must exactly match the reviewed allowlist');
assert('Rule AG', B012_NEW_PEOPLE.length === 93, `B012 requires exactly 93 August profiles, found ${B012_NEW_PEOPLE.length}`);
assert('Rule AG', B012_APPROVED_QIDS.size === 93 && new Set(B012_NEW_PEOPLE.map((p) => p.wikidataId)).size === 93, 'B012 QIDs must be exact and unique');
assert('Rule AG', B012_NEW_PEOPLE.every((p) => B012_APPROVED_IDS.has(p.id)), 'B012 additions must match only the approved profile ID list');
assert('Rule AG', B012_NEW_PEOPLE.length === B012_APPROVED_IDS.size, 'B012 must contain every approved profile exactly once');

function isApprovedB012DobSource(qid: string, url: string): boolean {
  return Object.values(B012_APPROVED_PROFILES).some((profile) => profile.wikidataId === qid && profile.dobSources.some((source) => source.url === url));
}

for (const p of B012_NEW_PEOPLE) {
  const expected = B012_APPROVED_PROFILES[p.id];
  assert('Rule AG', Boolean(expected), `Unapproved B012 profile ID: ${p.id}`);
  if (!expected) continue;
  assert('Rule AG', p.wikidataId === expected.wikidataId, `B012 ${p.id} expected ${expected.wikidataId}, got ${p.wikidataId}`);
  assert('Rule AG', p.birthDate === expected.birthDate, `B012 ${p.id} expected DOB ${expected.birthDate}, got ${p.birthDate}`);
  assert('Rule AG', p.birthMonth === 8 && /^\d{4}-08-\d{2}$/.test(p.birthDate), `B012 ${p.id} must be an August record`);
  assert('Rule AG', p.birthYear === Number(p.birthDate.slice(0, 4)) && p.birthDay === Number(p.birthDate.slice(8, 10)), `B012 ${p.id} split date fields must match birthDate`);
  assert('Rule AG', p.countryCode === expected.countryCode, `B012 ${p.id} country must match reviewed mapping`);
  assert('Rule AG', p.category === expected.category, `B012 ${p.id} category must match reviewed mapping`);
  assert('Rule AG', p.occupation?.length === 1 && p.occupation[0] === expected.occupation, `B012 ${p.id} occupation must match reviewed mapping`);
  assert('Rule AG', p.verifiedAt === '2026-10-06', `B012 ${p.id} requires the B012 review date`);
  assert('Rule AG', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${p.wikidataId}`) === true, `B012 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AG source', expected.dobSources.length === 2, `B012 ${p.id} must have exactly two reviewed DOB publishers`);
  assert('Rule AG source', new Set(expected.dobSources.map((source) => source.publisher)).size === 2, `B012 ${p.id} DOB publishers must be distinct`);
  assert('Rule AG source', new Set(expected.dobSources.map((source) => getUrlHostname(source.url))).size === 2, `B012 ${p.id} DOB source hosts must be distinct`);
  const approvedUrls = expected.dobSources.map((source) => source.url);
  const nonWikiUrls = sourceUrlsBeforeBv017(p).filter((url) => !['wikidata.org','www.wikidata.org','wikipedia.org','www.wikipedia.org','wikimedia.org','www.wikimedia.org'].includes(getUrlHostname(url)));
  assert('Rule AG source', nonWikiUrls.length === 2 && approvedUrls.every((url) => nonWikiUrls.includes(url)), `B012 ${p.id} must include exactly its two reviewed non-Wikidata DOB sources`);
  for (const source of expected.dobSources) {
    assert('Rule AG source positive', isApprovedB012DobSource(p.wikidataId || '', source.url), `B012 reviewed source must pass for ${p.id}: ${source.url}`);
    assert('Rule AG source profile', (p.sourceUrls || []).includes(source.url), `B012 ${p.id} must include reviewed source ${source.url}`);
    assert('Rule AG source URL', Boolean(getUrlHostname(source.url)), `B012 source must use a valid host: ${source.url}`);
    assert('Rule AG source negative', !isApprovedB012DobSource('Q0', source.url), `B012 source must not approve a different QID: ${source.url}`);
    assert('Rule AG source negative', !isApprovedB012DobSource(p.wikidataId || '', `${source.url}#unreviewed`), `B012 unreviewed source fragment must fail: ${source.url}`);
    const queryVariant = source.url.includes('?') ? `${source.url}&unreviewed=1` : `${source.url}?unreviewed=1`;
    assert('Rule AG source negative', !isApprovedB012DobSource(p.wikidataId || '', queryVariant), `B012 unreviewed source query must fail: ${source.url}`);
    const pathVariant = new URL(source.url);
    pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AG source negative', !isApprovedB012DobSource(p.wikidataId || '', pathVariant.href), `B012 unreviewed source path must fail: ${source.url}`);
    const lookalike = new URL(source.url);
    lookalike.hostname += '.evil.example';
    assert('Rule AG source negative', !isApprovedB012DobSource(p.wikidataId || '', lookalike.href), `B012 lookalike source host must fail: ${source.url}`);
    assert('Rule AG source negative', !isApprovedB012DobSource(p.wikidataId || '', 'not-a-url'), 'B012 malformed source URL must fail');
  }
}
const b012Vietnamese = B012_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AG balance', b012Vietnamese.length === 5, `B012 Vietnamese count must be 5, found ${b012Vietnamese.length}`);
assert('Rule AG balance', b012Vietnamese.length / B012_NEW_PEOPLE.length >= 0.05, `B012 Vietnamese share must be at least 5%; found ${b012Vietnamese.length}/${B012_NEW_PEOPLE.length}`);
assert('Rule AG balance', new Set(b012Vietnamese.map((p) => p.wikidataId)).size === 5, 'B012 Vietnamese QIDs must be unique');
for (const p of b012Vietnamese) {
  const expected = B012_APPROVED_PROFILES[p.id];
  const sources = expected?.dobSources || [];
  assert('Rule AG Vietnamese', Boolean(expected) && expected.wikidataId === p.wikidataId, `B012 Vietnamese profile must match reviewed QID: ${p.id}`);
  assert('Rule AG Vietnamese', sources.length === 2, `B012 Vietnamese ${p.id} requires exactly two reviewed foreign DOB sources`);
  assert('Rule AG Vietnamese', sources.every((source) => source.publisherCountry !== 'VN' && Boolean(source.countryProofUrl?.startsWith('https://'))), `B012 Vietnamese ${p.id} requires two foreign publishers with official country proof`);
  assert('Rule AG Vietnamese', sources.every((source) => (p.sourceUrls || []).includes(source.url)), `B012 Vietnamese ${p.id} must include both approved DOB URLs`);
}
for (let day = 1; day <= 31; day++) {
  const count = B012_NEW_PEOPLE.filter((p) => p.birthDay === day).length;
  assert('Rule AG coverage', count === 3, `B012 August ${day} must have exactly 3 additions, found ${count}`);
  const total = b012HistoricalPeople.filter((p) => p.birthMonth === 8 && p.birthDay === day).length;
  assert('Rule AG coverage', total <= 8, `B012 August ${day} must not exceed 8 total people, found ${total}`);
}
const b012AugustBaseline = b012HistoricalPeople.filter((p) => p.birthMonth === 8 && !B012_APPROVED_IDS.has(p.id));
assert('Rule AG baseline', b012AugustBaseline.length === 2, `B012 must preserve exactly two baseline August profiles, found ${b012AugustBaseline.length}`);
assert('Rule AG baseline', b012AugustBaseline.some((p) => p.id === 'jennifer-lawrence' && p.birthDate === '1990-08-15') && b012AugustBaseline.some((p) => p.id === 'napoleon-bonaparte' && p.birthDate === '1769-08-15'), 'B012 must retain Jennifer Lawrence and Napoleon Bonaparte on August 15');
assert('Rule AG total', b012HistoricalPeople.length === 754, `B012 expected 754 total people, found ${b012HistoricalPeople.length}`);
const b012CoveredDays = new Set(b012HistoricalPeople.map((p) => `${p.birthMonth}-${p.birthDay}`));
assert('Rule AG coverage', b012CoveredDays.size === 245, `B012 expected 245 covered calendar days, found ${b012CoveredDays.size}`);
const b012AugustDays = new Set(b012HistoricalPeople.filter((p) => p.birthMonth === 8).map((p) => p.birthDay));
assert('Rule AG coverage', b012AugustDays.size === 31, `B012 must cover all 31 August days, found ${b012AugustDays.size}`);
assert('Rule AG coverage', b012HistoricalPeople.filter((p) => p.birthMonth === 8 && p.birthDay === 15).length === 5, 'B012 August 15 must contain the three additions and two preserved baseline profiles');
const b012PreservedPeople = b012HistoricalPeople.filter((p) => !B012_APPROVED_IDS.has(p.id)).sort((a, b) => a.id.localeCompare(b.id));
assert('Rule AG baseline', b012PreservedPeople.length === 661, `B012 must preserve all 661 baseline people, found ${b012PreservedPeople.length}`);
assert('Rule AG baseline', stableSha256(b012PreservedPeople.map(projectPersonBeforeBv017)) === 'bbdbf73293a1e6e861dffd6bab00b1eee0a4639d79ba2eb9594eec1df97c0334', 'All 661 baseline people must remain deep-equal to origin/main before B012 after the independently verified BV-017 correction projection');
assert('Rule AG baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All 4 history events must remain deep-equal to origin/main');
console.log(`B012 additions: ${B012_NEW_PEOPLE.length}; Vietnamese: ${b012Vietnamese.length}; Vietnamese share: ${(b012Vietnamese.length / B012_NEW_PEOPLE.length * 100).toFixed(2)}%; coverage: ${b012CoveredDays.size}/366`);


// ------------------------------------------------------------
// Rule AH: B013 exact September profile set, direct DOB source pairs,
// full Wikidata P31/P569 audit, foreign-publisher evidence, and baseline preservation.
// ------------------------------------------------------------
console.log('Checking Rule AH: B013 September allowlist, evidence, Wikidata claims, and baseline preservation...');
const B013_APPROVED_PROFILES: Readonly<Record<string, {
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  category: string;
  occupation: string;
  dobSources: readonly { url: string; publisher: string; publisherCountry?: string; countryProofUrl?: string }[];
}>> = {
  "edgar-rice-burroughs": {
    "wikidataId": "Q148234",
    "birthDate": "1875-09-01",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Edgar_Rice_Burroughs",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.britannica.com/biography/Edgar-Rice-Burroughs",
        "publisher": "Encyclopaedia Britannica"
      }
    ]
  },
  "kirsti-kolle-grondahl": {
    "wikidataId": "Q462505",
    "birthDate": "1943-09-01",
    "countryCode": "NO",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Kirsti_Kolle_Gr%C3%B8ndahl",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.stortinget.no/no/Representanter-og-komiteer/Representantene/Representantfordeling/Representant/?perid=KKG&tab=Biography",
        "publisher": "Stortinget"
      }
    ]
  },
  "per-kirkeby": {
    "wikidataId": "Q467462",
    "birthDate": "1938-09-01",
    "countryCode": "DK",
    "category": "artist",
    "occupation": "Họa sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Per_Kirkeby",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/31198",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "bodil-kjer": {
    "wikidataId": "Q435317",
    "birthDate": "1917-09-02",
    "countryCode": "DK",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Bodil_Kjer",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/5a65d510aaaf4c398159d2df431e1cd1",
        "publisher": "Filmportal"
      }
    ]
  },
  "kristin-halvorsen": {
    "wikidataId": "Q236621",
    "birthDate": "1960-09-02",
    "countryCode": "NO",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Kristin_Halvorsen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.stortinget.no/no/Representanter-og-komiteer/Representantene/Representantfordeling/Representant/?perid=KHA&tab=Biography",
        "publisher": "Stortinget"
      }
    ]
  },
  "kjetil-andre-aamodt": {
    "wikidataId": "Q2097",
    "birthDate": "1971-09-02",
    "countryCode": "NO",
    "category": "athlete",
    "occupation": "Vận động viên trượt tuyết",
    "dobSources": [
      {
        "url": "https://snl.no/Kjetil_Andr%C3%A9_Aamodt",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.olympedia.org/athletes/99335",
        "publisher": "Olympedia"
      }
    ]
  },
  "alan-ladd": {
    "wikidataId": "Q346280",
    "birthDate": "1913-09-03",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Alan_Ladd",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://encyclopediaofarkansas.net/entries/alan-ladd-2767/",
        "publisher": "Encyclopedia of Arkansas"
      }
    ]
  },
  "knut-nystedt": {
    "wikidataId": "Q515696",
    "birthDate": "1915-09-03",
    "countryCode": "NO",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/Knut_Nystedt",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://theaterencyclopedie.nl/id/01944073-3fe5-7085-907f-80c95c43c1d5",
        "publisher": "TheaterEncyclopedie"
      }
    ]
  },
  "kjell-magne-bondevik": {
    "wikidataId": "Q207655",
    "birthDate": "1947-09-03",
    "countryCode": "NO",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Kjell_Magne_Bondevik",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.stortinget.no/no/Representanter-og-komiteer/Representantene/Representantfordeling/Representant/?perid=KMB&tab=Biography",
        "publisher": "Stortinget"
      }
    ]
  },
  "anton-bruckner": {
    "wikidataId": "Q81752",
    "birthDate": "1824-09-04",
    "countryCode": "AT",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/Anton_Bruckner",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/bruckner-anton",
        "publisher": "Brockhaus"
      }
    ]
  },
  "bernt-heiberg": {
    "wikidataId": "Q11960814",
    "birthDate": "1909-09-04",
    "countryCode": "NO",
    "category": "artist",
    "occupation": "Kiến trúc sư",
    "dobSources": [
      {
        "url": "https://snl.no/Bernt_Heiberg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://lokalhistoriewiki.no/index.php?mobileaction=toggle_view_desktop&title=Bernt_Heiberg",
        "publisher": "Lokalhistoriewiki"
      }
    ]
  },
  "beyonce": {
    "wikidataId": "Q36153",
    "birthDate": "1981-09-04",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.womenshistory.org/education-resources/biographies/beyonce-knowles-carter",
        "publisher": "National Women’s History Museum"
      },
      {
        "url": "https://www.grammy.com/artists/beyonce-knowles/12474/",
        "publisher": "Recording Academy"
      }
    ]
  },
  "werner-herzog": {
    "wikidataId": "Q44131",
    "birthDate": "1942-09-05",
    "countryCode": "DE",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Werner_Herzog",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/herzog-werner",
        "publisher": "Brockhaus"
      }
    ]
  },
  "john-carew": {
    "wikidataId": "Q192986",
    "birthDate": "1979-09-05",
    "countryCode": "NO",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://snl.no/John_Carew",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.premierleague.com/en/players/4101/john-carew/career",
        "publisher": "Premier League"
      }
    ]
  },
  "arthur-koestler": {
    "wikidataId": "Q78494",
    "birthDate": "1905-09-05",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://www.ne.se/uppslagsverk/encyklopedi/l%C3%A5ng/arthur-koestler",
        "publisher": "Nationalencyklopedin"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/koestler-arthur",
        "publisher": "Hrvatska enciklopedija"
      }
    ]
  },
  "jane-addams": {
    "wikidataId": "Q180989",
    "birthDate": "1860-09-06",
    "countryCode": "US",
    "category": "history",
    "occupation": "Nhà hoạt động xã hội",
    "dobSources": [
      {
        "url": "https://snl.no/Jane_Addams",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/6836",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "franz-josef-strauss": {
    "wikidataId": "Q44620",
    "birthDate": "1915-09-06",
    "countryCode": "DE",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Franz_Josef_Strauss",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/strauss-franz-josef",
        "publisher": "Brockhaus"
      }
    ]
  },
  "ingebjorg-kasin-sandsdalen": {
    "wikidataId": "Q6032030",
    "birthDate": "1915-09-06",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Ingebj%C3%B8rg_Kasin_Sandsdalen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.ensie.nl/oosthoek/sandsdalen-ingebjorg-kasin",
        "publisher": "Oosthoek"
      }
    ]
  },
  "sonny-rollins": {
    "wikidataId": "Q299208",
    "birthDate": "1930-09-07",
    "countryCode": "US",
    "category": "music",
    "occupation": "Nhạc sĩ jazz",
    "dobSources": [
      {
        "url": "https://snl.no/Sonny_Rollins",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/rollins-sonny",
        "publisher": "Brockhaus"
      }
    ]
  },
  "buddy-holly": {
    "wikidataId": "Q5977",
    "birthDate": "1936-09-07",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Buddy_Holly",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/holly-buddy",
        "publisher": "Brockhaus"
      }
    ]
  },
  "tore-gjelsvik": {
    "wikidataId": "Q713168",
    "birthDate": "1916-09-07",
    "countryCode": "NO",
    "category": "scientist",
    "occupation": "Nhà địa chất học",
    "dobSources": [
      {
        "url": "https://snl.no/Tore_Gjelsvik",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brage.npolar.no/npolar-xmlui/bitstream/handle/11250/174095/OrheimPR2006.pdf?sequence=1",
        "publisher": "Norsk Polarinstitutt / Brage institutional repository"
      }
    ]
  },
  "antonin-dvorak": {
    "wikidataId": "Q7298",
    "birthDate": "1841-09-08",
    "countryCode": "CZ",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/Anton%C3%ADn_Dvo%C5%99%C3%A1k",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/dvorak-antonin",
        "publisher": "Brockhaus"
      }
    ]
  },
  "patsy-cline": {
    "wikidataId": "Q273080",
    "birthDate": "1932-09-08",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Patsy_Cline",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/0e3ed1762fb94a4581c2cbd8b072a5bf",
        "publisher": "Filmportal"
      }
    ]
  },
  "do-hung-dung": {
    "wikidataId": "Q22162708",
    "birthDate": "1993-09-08",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://fbref.com/en/players/4433e9ea/Djo-Hung-Dung",
        "publisher": "FBref / Sports Reference",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.sports-reference.com/contact.html"
      },
      {
        "url": "https://www.sofascore.com/football/player/do-hung-dung/830573",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/legal-information"
      }
    ]
  },
  "otis-redding": {
    "wikidataId": "Q217839",
    "birthDate": "1941-09-09",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Otis_Redding",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.georgiaencyclopedia.org/articles/arts-culture/otis-redding-1941-1967/",
        "publisher": "New Georgia Encyclopedia"
      }
    ]
  },
  "per-jorgensen": {
    "wikidataId": "Q897522",
    "birthDate": "1952-09-09",
    "countryCode": "NO",
    "category": "music",
    "occupation": "Nhạc sĩ jazz",
    "dobSources": [
      {
        "url": "https://snl.no/Per_J%C3%B8rgensen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://fnma.sceneweb.no/en/artist/24813/Per_J%C3%B8rgensen",
        "publisher": "Sceneweb"
      }
    ]
  },
  "frode-andresen": {
    "wikidataId": "Q511386",
    "birthDate": "1973-09-09",
    "countryCode": "NO",
    "category": "athlete",
    "occupation": "Vận động viên hai môn phối hợp",
    "dobSources": [
      {
        "url": "https://snl.no/Frode_Andresen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.olympedia.org/athletes/99634",
        "publisher": "Olympedia"
      }
    ]
  },
  "stephen-jay-gould": {
    "wikidataId": "Q180619",
    "birthDate": "1941-09-10",
    "countryCode": "US",
    "category": "scientist",
    "occupation": "Nhà cổ sinh vật học",
    "dobSources": [
      {
        "url": "https://snl.no/Stephen_Jay_Gould",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/gould-stephen-jay",
        "publisher": "Brockhaus"
      }
    ]
  },
  "marja-liisa-kirvesniemi": {
    "wikidataId": "Q234498",
    "birthDate": "1955-09-10",
    "countryCode": "FI",
    "category": "athlete",
    "occupation": "Vận động viên trượt tuyết",
    "dobSources": [
      {
        "url": "https://snl.no/Marja-Liisa_Kirvesniemi",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.britannica.com/biography/Marja-Liisa-Hamalainen",
        "publisher": "Encyclopaedia Britannica"
      }
    ]
  },
  "pham-thanh-luong": {
    "wikidataId": "Q4481043",
    "birthDate": "1988-09-10",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://fbref.com/en/players/60a6cd31/Pham-Thanh-Luong",
        "publisher": "FBref / Sports Reference",
        "publisherCountry": "US",
        "countryProofUrl": "https://www.sports-reference.com/contact.html"
      },
      {
        "url": "https://www.transfermarkt.us/thanh-luong-pham/profil/spieler/138131",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      }
    ]
  },
  "theodor-w-adorno": {
    "wikidataId": "Q152388",
    "birthDate": "1903-09-11",
    "countryCode": "DE",
    "category": "scientist",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://snl.no/Theodor_W._Adorno",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/theodor-w-adorno",
        "publisher": "Brockhaus"
      }
    ]
  },
  "birgitta-trotzig": {
    "wikidataId": "Q259238",
    "birthDate": "1929-09-11",
    "countryCode": "SE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Birgitta_Trotzig",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/trotzig-birgitta",
        "publisher": "Hrvatska enciklopedija"
      }
    ]
  },
  "brian-de-palma": {
    "wikidataId": "Q189526",
    "birthDate": "1940-09-11",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Brian_De_Palma",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/de-palma-brian",
        "publisher": "Brockhaus"
      }
    ]
  },
  "maurice-chevalier": {
    "wikidataId": "Q106001",
    "birthDate": "1888-09-12",
    "countryCode": "FR",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Maurice_Chevalier",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/15158",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "jesse-owens": {
    "wikidataId": "Q52651",
    "birthDate": "1913-09-12",
    "countryCode": "US",
    "category": "athlete",
    "occupation": "Vận động viên điền kinh",
    "dobSources": [
      {
        "url": "https://snl.no/Jesse_Owens",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.britannica.com/biography/Jesse-Owens",
        "publisher": "Encyclopaedia Britannica"
      }
    ]
  },
  "bjorn-floberg": {
    "wikidataId": "Q879810",
    "birthDate": "1947-09-12",
    "countryCode": "NO",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Bj%C3%B8rn_Floberg",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/3d0806e95f1d450fb28439092a0a5327",
        "publisher": "Filmportal"
      }
    ]
  },
  "roald-dahl": {
    "wikidataId": "Q25161",
    "birthDate": "1916-09-13",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Roald_Dahl",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/16693",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "alex-riel": {
    "wikidataId": "Q1374501",
    "birthDate": "1940-09-13",
    "countryCode": "DK",
    "category": "music",
    "occupation": "Nghệ sĩ trống jazz",
    "dobSources": [
      {
        "url": "https://snl.no/Alex_Riel",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://lex.dk/Alex_Riel",
        "publisher": "Lex.dk"
      }
    ]
  },
  "ahmet-necdet-sezer": {
    "wikidataId": "Q165487",
    "birthDate": "1941-09-13",
    "countryCode": "TR",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Ahmet_Necdet_Sezer",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.anayasa.gov.tr/tr/baskanvekilleri-ve-uyeler/emekli-ve-gorev-suresi-dolan-uyeler/ahmet-necdet-sezer/",
        "publisher": "T.C. Anayasa Mahkemesi"
      }
    ]
  },
  "jan-masaryk": {
    "wikidataId": "Q315531",
    "birthDate": "1886-09-14",
    "countryCode": "CZ",
    "category": "politics",
    "occupation": "Nhà ngoại giao",
    "dobSources": [
      {
        "url": "https://snl.no/Jan_Masaryk",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://mzv.gov.cz/jnp/cz/o_ministerstvu/struktura/utvary/specializovany_archiv_mzv/kdo_byl_kdo/masaryk_jan.html",
        "publisher": "Ministerstvo zahraničních věcí ČR"
      }
    ]
  },
  "astrid-gjertsen": {
    "wikidataId": "Q4811421",
    "birthDate": "1928-09-14",
    "countryCode": "NO",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Astrid_Gjertsen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.stortinget.no/no/Representanter-og-komiteer/Representantene/Representant/?perid=ASGJ",
        "publisher": "Stortinget"
      }
    ]
  },
  "filip-nguyen": {
    "wikidataId": "Q56513413",
    "birthDate": "1992-09-14",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Thủ môn bóng đá",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.us/filip-nguyen/profil/spieler/202914",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      },
      {
        "url": "https://www.sofascore.com/football/player/nguyen-filip/151931",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/legal-information"
      }
    ]
  },
  "oliver-stone": {
    "wikidataId": "Q179497",
    "birthDate": "1946-09-15",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://www.biography.com/movies-tv/oliver-stone",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.treccani.it/enciclopedia/oliver-stone_%28Enciclopedia-Italiana%29/",
        "publisher": "Treccani"
      }
    ]
  },
  "jessye-norman": {
    "wikidataId": "Q240937",
    "birthDate": "1945-09-15",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ opera",
    "dobSources": [
      {
        "url": "https://snl.no/Jessye_Norman",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/norman-jessye",
        "publisher": "Brockhaus"
      }
    ]
  },
  "tommy-lee-jones": {
    "wikidataId": "Q170587",
    "birthDate": "1946-09-15",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Tommy_Lee_Jones",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/ef441e2971b7485abd49376a8442ffd6",
        "publisher": "Filmportal"
      }
    ]
  },
  "lauren-bacall": {
    "wikidataId": "Q104000",
    "birthDate": "1924-09-16",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Lauren_Bacall",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/bacall-lauren",
        "publisher": "Brockhaus"
      }
    ]
  },
  "jon-hellesnes": {
    "wikidataId": "Q4564029",
    "birthDate": "1939-09-16",
    "countryCode": "NO",
    "category": "scientist",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://snl.no/Jon_Hellesnes",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://forfattarar.sfj.no/writer/jon-hellesnes/",
        "publisher": "Forfattarar frå Sogn og Fjordane"
      }
    ]
  },
  "vebjorn-rodal": {
    "wikidataId": "Q354317",
    "birthDate": "1972-09-16",
    "countryCode": "NO",
    "category": "athlete",
    "occupation": "Vận động viên điền kinh",
    "dobSources": [
      {
        "url": "https://snl.no/Vebj%C3%B8rn_Rodal",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://worldathletics.org/athletes/norway/vebjorn-rodal-14215450",
        "publisher": "World Athletics"
      }
    ]
  },
  "christian-lous-lange": {
    "wikidataId": "Q206446",
    "birthDate": "1869-09-17",
    "countryCode": "NO",
    "category": "politics",
    "occupation": "Nhà ngoại giao",
    "dobSources": [
      {
        "url": "https://snl.no/Christian_Lous_Lange",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/lange-christian-lous",
        "publisher": "Hrvatska enciklopedija"
      }
    ]
  },
  "hank-williams": {
    "wikidataId": "Q206181",
    "birthDate": "1923-09-17",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ nhạc đồng quê",
    "dobSources": [
      {
        "url": "https://snl.no/Hank_Williams",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.countrymusichalloffame.org/hall-of-fame/hank-williams",
        "publisher": "Country Music Hall of Fame"
      }
    ]
  },
  "randi-bratteli": {
    "wikidataId": "Q4968156",
    "birthDate": "1924-09-17",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà báo",
    "dobSources": [
      {
        "url": "https://snl.no/Randi_Bratteli",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://lokalhistoriewiki.no/index.php?mobileaction=toggle_view_desktop&title=Randi_Bratteli",
        "publisher": "Lokalhistoriewiki"
      }
    ]
  },
  "greta-garbo": {
    "wikidataId": "Q5443",
    "birthDate": "1905-09-18",
    "countryCode": "SE",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Greta_Garbo",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/garbo-greta",
        "publisher": "Brockhaus"
      }
    ]
  },
  "nils-petter-molvaer": {
    "wikidataId": "Q738139",
    "birthDate": "1960-09-18",
    "countryCode": "NO",
    "category": "music",
    "occupation": "Nhạc sĩ jazz",
    "dobSources": [
      {
        "url": "https://snl.no/Nils_Petter_Molv%C3%A6r",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.universalmusic.fr/artistes/20000144514",
        "publisher": "Universal Music France"
      }
    ]
  },
  "sveinn-einarsson": {
    "wikidataId": "Q16095583",
    "birthDate": "1934-09-18",
    "countryCode": "IS",
    "category": "artist",
    "occupation": "Đạo diễn sân khấu",
    "dobSources": [
      {
        "url": "https://snl.no/Sveinn_Einarsson",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://leikhusid.is/actors/sveinn-einarsson/",
        "publisher": "Þjóðleikhúsið / Icelandic National Theatre"
      }
    ]
  },
  "mika-waltari": {
    "wikidataId": "Q193111",
    "birthDate": "1908-09-19",
    "countryCode": "FI",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Mika_Waltari",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.hamhelsinki.fi/veistos/mika-waltari-muistolaatta/",
        "publisher": "HAM Helsinki Art Museum"
      }
    ]
  },
  "william-golding": {
    "wikidataId": "Q44183",
    "birthDate": "1911-09-19",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/William_Golding",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/golding-william-gerald",
        "publisher": "Brockhaus"
      }
    ]
  },
  "jeremy-irons": {
    "wikidataId": "Q171745",
    "birthDate": "1948-09-19",
    "countryCode": "GB",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Jeremy_Irons",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.britannica.com/biography/Jeremy-Irons",
        "publisher": "Encyclopaedia Britannica"
      }
    ]
  },
  "sophia-loren": {
    "wikidataId": "Q43252",
    "birthDate": "1934-09-20",
    "countryCode": "IT",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Sophia_Loren",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/loren-sophia",
        "publisher": "Brockhaus"
      }
    ]
  },
  "bjorn-wiinblad": {
    "wikidataId": "Q879860",
    "birthDate": "1918-09-20",
    "countryCode": "DK",
    "category": "artist",
    "occupation": "Nhà thiết kế",
    "dobSources": [
      {
        "url": "https://snl.no/Bj%C3%B8rn_Wiinblad",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://biografiskleksikon.lex.dk/Bj%C3%B8rn_Wiinblad",
        "publisher": "Dansk Biografisk Leksikon / Lex.dk"
      }
    ]
  },
  "rolf-kirkvaag": {
    "wikidataId": "Q7360753",
    "birthDate": "1920-09-20",
    "countryCode": "NO",
    "category": "artist",
    "occupation": "Người dẫn chương trình",
    "dobSources": [
      {
        "url": "https://snl.no/Rolf_Kirkvaag",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://fnma.sceneweb.no/nb/artist/80789/Rolf_Kirkvaag",
        "publisher": "Sceneweb"
      }
    ]
  },
  "gustav-holst": {
    "wikidataId": "Q200867",
    "birthDate": "1874-09-21",
    "countryCode": "GB",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/Gustav_Holst",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/holst-gustav-theodore",
        "publisher": "Brockhaus"
      }
    ]
  },
  "leonard-cohen": {
    "wikidataId": "Q1276",
    "birthDate": "1934-09-21",
    "countryCode": "CA",
    "category": "music",
    "occupation": "Ca sĩ, nhạc sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Leonard_Cohen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/15694",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "lars-saabye-christensen": {
    "wikidataId": "Q366281",
    "birthDate": "1953-09-21",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Lars_Saabye_Christensen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.encyclopedia.com/arts/educational-magazines/saabye-christensen-lars-1953",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "fay-weldon": {
    "wikidataId": "Q239501",
    "birthDate": "1931-09-22",
    "countryCode": "GB",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Fay_Weldon",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/weldon-fay",
        "publisher": "Brockhaus"
      }
    ]
  },
  "nick-cave": {
    "wikidataId": "Q192668",
    "birthDate": "1957-09-22",
    "countryCode": "AU",
    "category": "music",
    "occupation": "Ca sĩ, nhạc sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Nick_Cave",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/859452c646da4eccb575130195c1101e",
        "publisher": "Filmportal"
      }
    ]
  },
  "ha-duc-chinh": {
    "wikidataId": "Q25999788",
    "birthDate": "1997-09-22",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.com/duc-chinh-ha/profil/spieler/508254",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      },
      {
        "url": "https://www.sofascore.com/football/player/ha-duc-chinh/889636",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/legal-information"
      }
    ]
  },
  "aldo-moro": {
    "wikidataId": "Q171834",
    "birthDate": "1916-09-23",
    "countryCode": "IT",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Aldo_Moro",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/moro-aldo",
        "publisher": "Brockhaus"
      }
    ]
  },
  "ray-charles": {
    "wikidataId": "Q544387",
    "birthDate": "1930-09-23",
    "countryCode": "US",
    "category": "music",
    "occupation": "Ca sĩ, nhạc sĩ",
    "dobSources": [
      {
        "url": "https://snl.no/Ray_Charles",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/charles-ray",
        "publisher": "Brockhaus"
      }
    ]
  },
  "per-olov-enquist": {
    "wikidataId": "Q311476",
    "birthDate": "1934-09-23",
    "countryCode": "SE",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Per_Olov_Enquist",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/19750",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "f-scott-fitzgerald": {
    "wikidataId": "Q93354",
    "birthDate": "1896-09-24",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/F._Scott_Fitzgerald",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/21502",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "jim-henson": {
    "wikidataId": "Q191037",
    "birthDate": "1936-09-24",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Nghệ sĩ múa rối",
    "dobSources": [
      {
        "url": "https://snl.no/Jim_Henson",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/58020",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "nils-collett-vogt": {
    "wikidataId": "Q1992327",
    "birthDate": "1864-09-24",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://snl.no/Nils_Collett_Vogt",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://lokalhistoriewiki.no/index.php?mobileaction=toggle_view_desktop&title=Nils_Collett_Vogt_%281864%E2%80%931937%29",
        "publisher": "Lokalhistoriewiki"
      }
    ]
  },
  "william-faulkner": {
    "wikidataId": "Q38392",
    "birthDate": "1897-09-25",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/William_Faulkner",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/faulkner-william-cuthbert",
        "publisher": "Brockhaus"
      }
    ]
  },
  "glenn-gould": {
    "wikidataId": "Q216924",
    "birthDate": "1932-09-25",
    "countryCode": "CA",
    "category": "music",
    "occupation": "Nghệ sĩ piano",
    "dobSources": [
      {
        "url": "https://snl.no/Glenn_Gould",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/24073",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "michael-douglas": {
    "wikidataId": "Q119798",
    "birthDate": "1944-09-25",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Michael_Douglas",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/douglas-michael-kirk",
        "publisher": "Brockhaus"
      }
    ]
  },
  "george-gershwin": {
    "wikidataId": "Q123829",
    "birthDate": "1898-09-26",
    "countryCode": "US",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://snl.no/George_Gershwin",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/gershwin-george",
        "publisher": "Brockhaus"
      }
    ]
  },
  "elisabeth-bang": {
    "wikidataId": "Q4573719",
    "birthDate": "1922-09-26",
    "countryCode": "NO",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Elisabeth_Bang",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://sceneweb.no/nb/artist/19749/Elisabeth_Bang",
        "publisher": "Sceneweb"
      }
    ]
  },
  "olivia-newton-john": {
    "wikidataId": "Q185165",
    "birthDate": "1948-09-26",
    "countryCode": "AU",
    "category": "music",
    "occupation": "Ca sĩ, diễn viên",
    "dobSources": [
      {
        "url": "https://peopleaustralia.anu.edu.au/biography/newtonjohn-dame-olivia-32692",
        "publisher": "People Australia / Australian National University"
      },
      {
        "url": "https://www.nporadio5.nl/muziek/artiesten/9d176c72-1956-41e1-bd4f-0edcc40d00a7/olivia-newton-john",
        "publisher": "NPO Radio 5"
      }
    ]
  },
  "tryggve-andersen": {
    "wikidataId": "Q721693",
    "birthDate": "1866-09-27",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Tryggve_Andersen",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/8588",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "arthur-penn": {
    "wikidataId": "Q41136",
    "birthDate": "1922-09-27",
    "countryCode": "US",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://snl.no/Arthur_Penn",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/bea7d447e42d4ffb91a9188187b89021",
        "publisher": "Filmportal"
      }
    ]
  },
  "gwyneth-paltrow": {
    "wikidataId": "Q34460",
    "birthDate": "1972-09-27",
    "countryCode": "US",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Gwyneth_Paltrow",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://goldenglobes.com/person/gwyneth-paltrow/",
        "publisher": "Golden Globes"
      }
    ]
  },
  "frances-willard": {
    "wikidataId": "Q450197",
    "birthDate": "1839-09-28",
    "countryCode": "US",
    "category": "history",
    "occupation": "Nhà hoạt động xã hội",
    "dobSources": [
      {
        "url": "https://snl.no/Frances_Willard",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.franceswillardmuseum.org/who-is-frances-willard",
        "publisher": "Frances Willard House Museum"
      }
    ]
  },
  "brigitte-bardot": {
    "wikidataId": "Q36268",
    "birthDate": "1934-09-28",
    "countryCode": "FR",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Brigitte_Bardot",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/bardot-brigitte",
        "publisher": "Brockhaus"
      }
    ]
  },
  "liv-dommersnes": {
    "wikidataId": "Q273325",
    "birthDate": "1922-09-28",
    "countryCode": "NO",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://snl.no/Liv_Dommersnes",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://sceneweb.no/nb/artist/20387/Liv_Str%C3%B8msted%20Dommersnes",
        "publisher": "Sceneweb"
      }
    ]
  },
  "lech-walesa": {
    "wikidataId": "Q444",
    "birthDate": "1943-09-29",
    "countryCode": "PL",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://snl.no/Lech_Wa%C5%82%C4%99sa",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/walesa-leszek-lech",
        "publisher": "Brockhaus"
      }
    ]
  },
  "jon-fosse": {
    "wikidataId": "Q443868",
    "birthDate": "1959-09-29",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Jon_Fosse",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://brockhaus.de/ecs/julex/article/fosse-jon",
        "publisher": "Brockhaus"
      }
    ]
  },
  "do-duy-manh": {
    "wikidataId": "Q19281994",
    "birthDate": "1996-09-29",
    "countryCode": "VN",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.de/duy-manh-do/profil/spieler/354784",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      },
      {
        "url": "https://www.goal.com/de/spieler/d-do/3wxucqw1i93q20r564ucn2mdx",
        "publisher": "GOAL Deutschland",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.goal.com/de/kontakt"
      }
    ]
  },
  "johan-falkberget": {
    "wikidataId": "Q721749",
    "birthDate": "1879-09-30",
    "countryCode": "NO",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Johan_Falkberget",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://proleksis.lzmk.hr/20389",
        "publisher": "Proleksis enciklopedija"
      }
    ]
  },
  "truman-capote": {
    "wikidataId": "Q134180",
    "birthDate": "1924-09-30",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Truman_Capote",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/19b4713459ea4c818c162e58af7ddf17",
        "publisher": "Filmportal"
      }
    ]
  },
  "elie-wiesel": {
    "wikidataId": "Q18391",
    "birthDate": "1928-09-30",
    "countryCode": "US",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://snl.no/Elie_Wiesel",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.filmportal.de/person/5e1a6b30aea641cb85121ae1d8ef9a62",
        "publisher": "Filmportal"
      }
    ]
  }
};

const B013_APPROVED_IDS = new Set(Object.keys(B013_APPROVED_PROFILES));
const B013_APPROVED_QIDS = new Set(Object.values(B013_APPROVED_PROFILES).map((profile) => profile.wikidataId));
const B013_NEW_PEOPLE = ALL_PEOPLE.filter((p) => B013_NEW_IDS.has(p.id));
assert('Rule AH', B013_NEW_IDS.size === 90 && B013_APPROVED_IDS.size === 90, 'B013 must lock exactly 90 unique profile IDs');
assert('Rule AH', B013_APPROVED_IDS.size === B013_NEW_IDS.size && [...B013_NEW_IDS].every((id) => B013_APPROVED_IDS.has(id)), 'B013 exact ID allowlist must match the September projection');
assert('Rule AH', B013_NEW_PEOPLE.length === 90 && B013_NEW_PEOPLE.length === B013_APPROVED_IDS.size, `B013 requires exactly 90 approved September profiles, found ${B013_NEW_PEOPLE.length}`);
assert('Rule AH', B013_APPROVED_QIDS.size === 90 && new Set(B013_NEW_PEOPLE.map((p) => p.wikidataId)).size === 90, 'B013 QIDs must be exact and unique');
assert('Rule AH', B013_NEW_PEOPLE.every((p) => B013_APPROVED_IDS.has(p.id)), 'B013 additions must match only the approved profile IDs');

function isApprovedB013DobSource(qid: string, url: string): boolean {
  return Object.values(B013_APPROVED_PROFILES).some((profile) => profile.wikidataId === qid && profile.dobSources.some((source) => source.url === url));
}

const b013EvidenceProfiles = B013_EVIDENCE.profiles as readonly {
  id: string; wikidataId: string; birthDate: string; countryCode: string; category: string; occupation: string;
  dobSources: readonly { url: string; publisher: string; publisherCountry?: string; countryProofUrl?: string }[];
}[];
const b013EvidenceProfilesById = new Map(b013EvidenceProfiles.map((profile) => [profile.id, profile]));
assert('Rule AH evidence', B013_EVIDENCE.schemaVersion === 1 && B013_EVIDENCE.cycle === 'BV-014 / B013', 'B013 evidence file must identify its schema and cycle');
assert('Rule AH evidence', b013EvidenceProfiles.length === 90 && b013EvidenceProfilesById.size === 90, 'B013 evidence must include 90 unique reviewed profiles');

const B013_COUNTRY_PROOF_URLS: Readonly<Record<string, string>> = {
  'FBref / Sports Reference': 'https://www.sports-reference.com/contact.html',
  'Sofascore': 'https://corporate.sofascore.com/legal-information',
  'Transfermarkt': 'https://www.transfermarkt.us/intern/impressum',
  'GOAL Deutschland': 'https://www.goal.com/de/kontakt',
};

for (const p of B013_NEW_PEOPLE) {
  const expected = B013_APPROVED_PROFILES[p.id];
  const evidence = b013EvidenceProfilesById.get(p.id);
  assert('Rule AH', Boolean(expected), `Unapproved B013 profile ID: ${p.id}`);
  if (!expected) continue;
  assert('Rule AH', Boolean(evidence), `B013 evidence is missing profile ${p.id}`);
  assert('Rule AH', p.wikidataId === expected.wikidataId, `B013 ${p.id} expected QID ${expected.wikidataId}, got ${p.wikidataId}`);
  assert('Rule AH', p.birthDate === expected.birthDate && /^\d{4}-09-\d{2}$/.test(p.birthDate), `B013 ${p.id} expected exact September DOB ${expected.birthDate}, got ${p.birthDate}`);
  assert('Rule AH', p.birthMonth === 9 && p.birthYear === Number(p.birthDate.slice(0, 4)) && p.birthDay === Number(p.birthDate.slice(8, 10)), `B013 ${p.id} split date fields must match birthDate`);
  assert('Rule AH', p.countryCode === expected.countryCode && p.category === expected.category, `B013 ${p.id} country/category must match the reviewed mapping`);
  assert('Rule AH', p.occupation?.length === 1 && p.occupation[0] === expected.occupation, `B013 ${p.id} occupation must match the reviewed mapping`);
  assert('Rule AH', p.verifiedAt === '2026-10-07', `B013 ${p.id} requires the B013 review date`);
  assert('Rule AH', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${expected.wikidataId}`) === true, `B013 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AH source', expected.dobSources.length === 2, `B013 ${p.id} must have exactly two reviewed DOB publishers`);
  assert('Rule AH source', new Set(expected.dobSources.map((source) => source.publisher)).size === 2, `B013 ${p.id} publishers must be distinct`);
  assert('Rule AH source', new Set(expected.dobSources.map((source) => getUrlHostname(source.url))).size === 2, `B013 ${p.id} DOB source hosts must be distinct`);
  const nonWikiUrls = sourceUrlsBeforeBv017(p).filter((url) => !['wikidata.org', 'www.wikidata.org', 'wikipedia.org', 'www.wikipedia.org', 'wikimedia.org', 'www.wikimedia.org'].includes(getUrlHostname(url)));
  const approvedUrls = expected.dobSources.map((source) => source.url);
  assert('Rule AH source', nonWikiUrls.length === 2 && approvedUrls.every((url) => nonWikiUrls.includes(url)), `B013 ${p.id} must include exactly its reviewed non-Wikidata DOB pair`);
  assert('Rule AH evidence', evidence?.wikidataId === expected.wikidataId && evidence.birthDate === expected.birthDate && evidence.countryCode === expected.countryCode && evidence.category === expected.category && evidence.occupation === expected.occupation, `B013 evidence mapping must match the allowlist for ${p.id}`);
  assert('Rule AH evidence', JSON.stringify(evidence?.dobSources) === JSON.stringify(expected.dobSources), `B013 source evidence must match the exact pair for ${p.id}`);

  for (const source of expected.dobSources) {
    assert('Rule AH source positive', isApprovedB013DobSource(expected.wikidataId, source.url), `B013 reviewed source must pass for ${p.id}: ${source.url}`);
    assert('Rule AH source profile', (p.sourceUrls || []).includes(source.url), `B013 ${p.id} must include reviewed source ${source.url}`);
    assert('Rule AH source URL', Boolean(getUrlHostname(source.url)), `B013 source must use a valid URL: ${source.url}`);
    const capture = (B013_EVIDENCE.sourceCaptures as unknown as Record<string, { profileId: string; wikidataId: string; expectedBirthDate: string; publisher: string; verificationMethod: string; fullDobAndIdentityReviewed: boolean; browserExcerpt?: string | null; capture?: { status?: number; sha256?: string } | null; localAttempts: readonly unknown[] }>)[source.url];
    assert('Rule AH evidence', Boolean(capture) && capture.profileId === p.id && capture.wikidataId === expected.wikidataId && capture.expectedBirthDate === expected.birthDate && capture.publisher === source.publisher && capture.fullDobAndIdentityReviewed === true, `B013 source evidence must bind the exact profile, DOB, and publisher: ${source.url}`);
    assert('Rule AH evidence', capture?.verificationMethod === 'direct-http' || (capture?.verificationMethod === 'browser-direct' && Boolean(capture.browserExcerpt)), `B013 source requires direct page evidence: ${source.url}`);
    assert('Rule AH source negative', !isApprovedB013DobSource('Q0', source.url), `B013 source must not approve another QID: ${source.url}`);
    assert('Rule AH source negative', !isApprovedB013DobSource(expected.wikidataId, `${source.url}#unreviewed`), `B013 source must reject an unreviewed fragment: ${source.url}`);
    const queryVariant = source.url.includes('?') ? `${source.url}&unreviewed=1` : `${source.url}?unreviewed=1`;
    assert('Rule AH source negative', !isApprovedB013DobSource(expected.wikidataId, queryVariant), `B013 source must reject an unreviewed query: ${source.url}`);
    const pathVariant = new URL(source.url);
    pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AH source negative', !isApprovedB013DobSource(expected.wikidataId, pathVariant.href), `B013 source must reject an unreviewed path: ${source.url}`);
    const lookalike = new URL(source.url);
    lookalike.hostname += '.evil.example';
    assert('Rule AH source negative', !isApprovedB013DobSource(expected.wikidataId, lookalike.href), `B013 source must reject a lookalike host: ${source.url}`);
    assert('Rule AH source negative', !isApprovedB013DobSource(expected.wikidataId, 'not-a-url'), 'B013 source must reject a malformed URL');
  }

  if (p.countryCode === 'VN') {
    assert('Rule AH Vietnamese', expected.dobSources.every((source) => source.publisherCountry && source.publisherCountry !== 'VN' && source.countryProofUrl === B013_COUNTRY_PROOF_URLS[source.publisher]), `B013 Vietnamese ${p.id} needs two foreign publishers with exact official country proof`);
  }
}

const b013Vietnamese = B013_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AH balance', b013Vietnamese.length === 5, `B013 Vietnamese count must be 5, found ${b013Vietnamese.length}`);
assert('Rule AH balance', b013Vietnamese.length / B013_NEW_PEOPLE.length >= 0.05, `B013 Vietnamese share must be at least 5%; found ${b013Vietnamese.length}/${B013_NEW_PEOPLE.length}`);
assert('Rule AH balance', new Set(b013Vietnamese.map((p) => p.wikidataId)).size === 5, 'B013 Vietnamese QIDs must be unique');

const b013EntityAudit = B013_EVIDENCE.wikidataAudit.entities as unknown as Record<string, {
  label: string | null;
  p31: readonly { rank: string; value: string; references: number; qualifiers: readonly unknown[] }[];
  p569: readonly { rank: string; value: { time: string; precision: number; calendar: string; before: number; after: number; timezone: number }; qualifiers: Record<string, readonly { snaktype: string; value: unknown }[]>; references: readonly { hash: string; snaks: Record<string, unknown> }[] }[];
  activeHumanP31: boolean; activeExactGregorianDob: boolean; activePreciseConflicts: readonly unknown[];
}>;
const b013Wikidata = B013_EVIDENCE.wikidataAudit as { retrievedAt: string; endpoint: string; calendarModel: string; entities: Record<string, unknown> };
assert('Rule AH Wikidata', b013Wikidata.retrievedAt === '2026-10-07' && b013Wikidata.endpoint.startsWith('https://www.wikidata.org/w/api.php') && b013Wikidata.calendarModel === 'http://www.wikidata.org/entity/Q1985727', 'B013 Wikidata evidence must identify its live API, retrieval date, and Gregorian calendar');
assert('Rule AH Wikidata', Object.keys(b013EntityAudit).length === 90, 'B013 Wikidata audit must contain all 90 QIDs');
for (const p of B013_NEW_PEOPLE) {
  const expected = B013_APPROVED_PROFILES[p.id];
  if (!expected) continue;
  const entity = b013EntityAudit[expected.wikidataId];
  assert('Rule AH Wikidata', Boolean(entity), `B013 Wikidata audit is missing ${expected.wikidataId}`);
  if (!entity) continue;
  assert('Rule AH Wikidata', entity.activeHumanP31 === true && entity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), `B013 ${p.id} must have an active P31 human claim`);
  assert('Rule AH Wikidata', entity.activeExactGregorianDob === true && entity.activePreciseConflicts.length === 0, `B013 ${p.id} must have an exact Gregorian P569 and no active precise conflict`);
  assert('Rule AH Wikidata', entity.p31.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && Number.isInteger(claim.references) && claim.references >= 0 && Array.isArray(claim.qualifiers)), `B013 ${p.id} P31 rank, references, and qualifiers must be captured`);
  assert('Rule AH Wikidata', entity.p569.length > 0 && entity.p569.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && claim.value.calendar === b013Wikidata.calendarModel && claim.value.precision >= 0 && claim.value.precision <= 14 && claim.qualifiers !== undefined && Array.isArray(claim.references) && claim.references.length > 0 && claim.references.every((reference) => Boolean(reference.hash) && typeof reference.snaks === 'object')), `B013 ${p.id} must preserve every P569 rank, qualifier, calendar, precision, and reference`);
  const activeClaims = entity.p569.filter((claim) => claim.rank !== 'deprecated');
  const exactClaims = activeClaims.filter((claim) => claim.value.precision === 11);
  assert('Rule AH Wikidata', exactClaims.some((claim) => claim.value.time.slice(1, 11) === expected.birthDate), `B013 ${p.id} needs an active exact P569 matching ${expected.birthDate}`);
  assert('Rule AH Wikidata', activeClaims.filter((claim) => claim.value.precision >= 11).every((claim) => claim.value.time.slice(1, 11) === expected.birthDate), `B013 ${p.id} has an active exact or more-precise P569 conflict`);
  assert('Rule AH Wikidata', activeClaims.filter((claim) => claim.value.precision < 11).every((claim) => claim.value.time.slice(1, 5) === expected.birthDate.slice(0, 4)), `B013 ${p.id} has an active coarser P569 with a conflicting year`);
  assert('Rule AH age', isAdultOnDate(expected.birthDate, '2026-10-07'), `B013 ${p.id} must be an adult on 2026-10-07`);
}

const janeAddamsClaims = b013EntityAudit['Q180989']?.p569 || [];
assert('Rule AH Wikidata exception', janeAddamsClaims.some((claim) => claim.rank === 'preferred' && claim.value.precision === 11 && claim.qualifiers.P7452?.some((qualifier) => (qualifier.value as { id?: string }).id === 'Q71536040')), 'Jane Addams preferred exact P569 must retain its reviewed-rank qualifier');
assert('Rule AH Wikidata exception', janeAddamsClaims.some((claim) => claim.rank === 'normal' && claim.value.precision === 9 && claim.value.time.slice(1, 5) === '1860'), 'Jane Addams coarser P569 must remain visible with the same year');
for (const qid of ['Q299208', 'Q4968156']) {
  const claims = b013EntityAudit[qid]?.p569 || [];
  const expectedYear = qid === 'Q299208' ? '1930' : '1924';
  assert('Rule AH Wikidata exception', claims.some((claim) => claim.rank !== 'deprecated' && claim.value.precision === 9 && claim.value.time.slice(1, 5) === expectedYear), `${qid} must retain its same-year coarser P569 claim`);
}
assert('Rule AH Wikidata exception', (b013EntityAudit['Q148234']?.p569 || []).some((claim) => claim.rank === 'deprecated' && claim.value.time.slice(1, 11) === '1875-02-23'), 'Edgar Rice Burroughs old contradictory date must remain marked deprecated in the audit');

for (let day = 1; day <= 30; day++) {
  const additions = B013_NEW_PEOPLE.filter((p) => p.birthDay === day);
  const total = ALL_PEOPLE.filter((p) => p.birthMonth === 9 && p.birthDay === day && !BV017_EXPANSION_NEW_IDS.has(p.id));
  assert('Rule AH coverage', additions.length === 3, `B013 September ${day} must have exactly 3 additions, found ${additions.length}`);
  assert('Rule AH coverage', total.length === 3 && total.length <= 8, `B013 September ${day} must have 3 additions and no more than 8 total people, found ${total.length}`);
}
const b013HistoricalPeople = ALL_PEOPLE.filter((p) => !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
const b013BaselinePeople = b013HistoricalPeople.filter((p) => !B013_NEW_IDS.has(p.id));
assert('Rule AH baseline', b013BaselinePeople.length === 754, `B013 must preserve all 754 baseline people, found ${b013BaselinePeople.length}`);
assert('Rule AH baseline', stableSha256(b013BaselinePeople.sort((a, b) => a.id.localeCompare(b.id)).map(projectPersonBeforeBv017)) === '43e159877b62e4e68ba6fb15763c40cbf660325803896fcf0843edc73702c282', 'All 754 origin/main people must remain deep-equal to the B013 baseline after the independently verified BV-017 correction projection');
assert('Rule AH baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All 4 history events must remain deep-equal to the B013 baseline');
const b013CoveredDays = new Set(b013HistoricalPeople.map((p) => `${p.birthMonth}-${p.birthDay}`));
const b013SeptemberDays = new Set(b013HistoricalPeople.filter((p) => p.birthMonth === 9).map((p) => p.birthDay));
assert('Rule AH total', b013HistoricalPeople.length === 844, `B013 expected 844 total people before B014, found ${b013HistoricalPeople.length}`);
assert('Rule AH coverage', b013CoveredDays.size === 275, `B013 expected 275 covered calendar days, found ${b013CoveredDays.size}`);
assert('Rule AH coverage', b013SeptemberDays.size === 30, `B013 must cover all 30 September days, found ${b013SeptemberDays.size}`);
console.log(`B013 additions: ${B013_NEW_PEOPLE.length}; Vietnamese: ${b013Vietnamese.length}; share: ${(b013Vietnamese.length / B013_NEW_PEOPLE.length * 100).toFixed(2)}%; coverage: ${b013CoveredDays.size}/366`);



// Rule AI: B014 exact October profile set, source captures, Wikidata audit, and baseline preservation.
console.log('Checking Rule AI: B014 October allowlist, evidence, Wikidata claims, and baseline preservation...');

type B014DobSource = { url: string; publisher: string; publisherCountry?: string; countryProofUrl?: string };
type B014ApprovedProfile = {
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  countryName: string;
  category: string;
  occupation: string;
  dobSources: readonly B014DobSource[];
};
const B014_APPROVED_PROFILES: Readonly<Record<string, B014ApprovedProfile>> = {
  "jimmy-carter": {
    "wikidataId": "Q23685",
    "birthDate": "1924-10-01",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.nps.gov/people/james-earl-carter-jr.htm",
        "publisher": "National Park Service"
      },
      {
        "url": "https://www.biography.com/political-figures/jimmy-carter",
        "publisher": "Biography.com"
      }
    ]
  },
  "george-weah": {
    "wikidataId": "Q173139",
    "birthDate": "1966-10-01",
    "countryCode": "LR",
    "countryName": "Liberia",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.skysports.com/football/player/74946/george-weah",
        "publisher": "Sky Sports"
      },
      {
        "url": "https://www.transfermarkt.us/george-weah/profil/spieler/8542",
        "publisher": "Transfermarkt"
      }
    ]
  },
  "annie-besant": {
    "wikidataId": "Q464318",
    "birthDate": "1847-10-01",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "politics",
    "occupation": "Nhà hoạt động vì nữ quyền",
    "dobSources": [
      {
        "url": "https://inc.in/leadership/past-party-presidents/annie-besant",
        "publisher": "Indian National Congress"
      },
      {
        "url": "https://www.secularism.org.uk/annie-besant",
        "publisher": "National Secular Society"
      }
    ]
  },
  "mahatma-gandhi": {
    "wikidataId": "Q1001",
    "birthDate": "1869-10-02",
    "countryCode": "IN",
    "countryName": "Ấn Độ",
    "category": "politics",
    "occupation": "Nhà hoạt động đấu tranh giành độc lập",
    "dobSources": [
      {
        "url": "https://www.gandhismriti.gov.in/more/chronology-mahatma-gandhi",
        "publisher": "Gandhi Smriti"
      },
      {
        "url": "https://culture.gov.in/hi/mahatma-gandhi",
        "publisher": "Ministry of Culture, Government of India"
      }
    ]
  },
  "sting": {
    "wikidataId": "Q483203",
    "birthDate": "1951-10-02",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.sting.com/pages/biography",
        "publisher": "Sting"
      },
      {
        "url": "https://catalogue.royalalberthall.com/Record.aspx?id=DS%2FUK%2F22&pos=1&src=CalmView.Persons",
        "publisher": "Royal Albert Hall"
      }
    ]
  },
  "bui-tien-dung": {
    "wikidataId": "Q19892123",
    "birthDate": "1995-10-02",
    "countryCode": "VN",
    "countryName": "Việt Nam",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.com/tien-dung-bui/profil/spieler/407524",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      },
      {
        "url": "https://www.sofascore.com/football/player/bui-tien-dung/1140343",
        "publisher": "Sofascore",
        "publisherCountry": "HR",
        "countryProofUrl": "https://corporate.sofascore.com/legal-information"
      }
    ]
  },
  "zlatan-ibrahimovic": {
    "wikidataId": "Q46896",
    "birthDate": "1981-10-03",
    "countryCode": "SE",
    "countryName": "Thụy Điển",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://snl.no/Zlatan_Ibrahimovic",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.transfermarkt.com/zlatan-ibrahimovic/profil/spieler/3455",
        "publisher": "Transfermarkt"
      }
    ]
  },
  "louis-aragon": {
    "wikidataId": "Q4128",
    "birthDate": "1897-10-03",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb119347816",
        "publisher": "Bibliothèque nationale de France"
      },
      {
        "url": "https://junior.universalis.fr/encyclopedie/aragon-louis-1897-1982",
        "publisher": "Encyclopædia Universalis"
      }
    ]
  },
  "gore-vidal": {
    "wikidataId": "Q167821",
    "birthDate": "1925-10-03",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://research.hrc.utexas.edu/fasearch/findingaid.cfm?eadid=00522",
        "publisher": "Harry Ransom Center"
      },
      {
        "url": "https://www.biography.com/authors-writers/gore-vidal",
        "publisher": "Biography.com"
      }
    ]
  },
  "buster-keaton": {
    "wikidataId": "Q103949",
    "birthDate": "1895-10-04",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.kansashistory.gov/kansapedia/buster-keaton/18439",
        "publisher": "Kansas Historical Society"
      },
      {
        "url": "https://busterkeaton.org/about-buster/part-1-a-vaudeville-childhood/",
        "publisher": "Buster Keaton official site"
      }
    ]
  },
  "susan-sarandon": {
    "wikidataId": "Q133050",
    "birthDate": "1946-10-04",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/susan-sarandon",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/people/literature-and-arts/film-and-television-biographies/susan-sarandon",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "anne-rice": {
    "wikidataId": "Q184785",
    "birthDate": "1941-10-04",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://www.biography.com/authors-writers/anne-rice",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/arts/educational-magazines/rice-anne-1941",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "vaclav-havel": {
    "wikidataId": "Q36233",
    "birthDate": "1936-10-05",
    "countryCode": "CZ",
    "countryName": "Séc",
    "category": "literature",
    "occupation": "Nhà viết kịch",
    "dobSources": [
      {
        "url": "https://www.hrad.cz/en/president-of-the-cr/former-presidents/vaclav-havel",
        "publisher": "Office of the President of the Czech Republic"
      },
      {
        "url": "https://edu.vaclavhavel.cz/en/vaclav-havel/early-years",
        "publisher": "edu.vaclavhavel.cz"
      }
    ]
  },
  "denis-diderot": {
    "wikidataId": "Q448",
    "birthDate": "1713-10-05",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "literature",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb11900134f",
        "publisher": "Bibliothèque nationale de France"
      },
      {
        "url": "https://www.hachettebnf.fr/auteur/denis-diderot/",
        "publisher": "Hachette BNF"
      }
    ]
  },
  "robert-h-goddard": {
    "wikidataId": "Q182546",
    "birthDate": "1882-10-05",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://siarchives.si.edu/history/featured-topics/stories/robert-h-goddard-american-rocket-pioneer",
        "publisher": "Smithsonian Institution Archives"
      },
      {
        "url": "https://www.eia.gov/kids/history-of-energy/famous-people/goddard.php",
        "publisher": "U.S. Energy Information Administration"
      }
    ]
  },
  "le-corbusier": {
    "wikidataId": "Q4724",
    "birthDate": "1887-10-06",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "artist",
    "occupation": "Kiến trúc sư",
    "dobSources": [
      {
        "url": "https://www.modernamuseet.se/stockholm/en/exhibitions/moment-le-corbusier/biography/",
        "publisher": "Moderna Museet"
      },
      {
        "url": "https://mas.be/en/page/architect-le-corbusier",
        "publisher": "Museum aan de Stroom"
      }
    ]
  },
  "thor-heyerdahl": {
    "wikidataId": "Q133622",
    "birthDate": "1914-10-06",
    "countryCode": "NO",
    "countryName": "Na Uy",
    "category": "history",
    "occupation": "Nhà thám hiểm",
    "dobSources": [
      {
        "url": "https://snl.no/Thor_Heyerdahl",
        "publisher": "Store norske leksikon"
      },
      {
        "url": "https://www.kon-tiki.no/en/about-thor-heyerdahl",
        "publisher": "Kon-Tiki Museum"
      }
    ]
  },
  "hoang-xuan-vinh": {
    "wikidataId": "Q2019283",
    "birthDate": "1974-10-06",
    "countryCode": "VN",
    "countryName": "Việt Nam",
    "category": "athlete",
    "occupation": "Vận động viên bắn súng",
    "dobSources": [
      {
        "url": "https://www.issf-sports.org/athletes/SHVIEM0610197401",
        "publisher": "ISSF",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.issf-sports.org/contact"
      },
      {
        "url": "https://www.ocagames.com/OCA/cache/17ag/SH/par.SH.VIE.5107619.html",
        "publisher": "OCA",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/oca-headquarters/"
      }
    ]
  },
  "niels-bohr": {
    "wikidataId": "Q7085",
    "birthDate": "1885-10-07",
    "countryCode": "DK",
    "countryName": "Đan Mạch",
    "category": "scientist",
    "occupation": "Nhà vật lý",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/laureate/27",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://www.biography.com/scientists/niels-bohr",
        "publisher": "Biography.com"
      }
    ]
  },
  "desmond-tutu": {
    "wikidataId": "Q43033",
    "birthDate": "1931-10-07",
    "countryCode": "ZA",
    "countryName": "Nam Phi",
    "category": "politics",
    "occupation": "Nhà hoạt động xã hội",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/laureate/546",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://www.gov.za/DesmondTutu-biography",
        "publisher": "Government of South Africa"
      }
    ]
  },
  "henry-a-wallace": {
    "wikidataId": "Q251666",
    "birthDate": "1888-10-07",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.millercenter.org/president/fdroosevelt/essays/wallace-1933-secretary-of-agriculture",
        "publisher": "Miller Center"
      },
      {
        "url": "https://www.ans.iastate.edu/about/history/people/henry-wallace",
        "publisher": "Iowa State University"
      }
    ]
  },
  "sigourney-weaver": {
    "wikidataId": "Q102124",
    "birthDate": "1949-10-08",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/sigourney-weaver",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.imdb.com/name/nm0000244/bio/",
        "publisher": "IMDb"
      }
    ]
  },
  "matt-damon": {
    "wikidataId": "Q175535",
    "birthDate": "1970-10-08",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.mattdamon.com/bio.html",
        "publisher": "Matt Damon official site"
      },
      {
        "url": "https://www.biography.com/actors/matt-damon",
        "publisher": "Biography.com"
      }
    ]
  },
  "frank-herbert": {
    "wikidataId": "Q7934",
    "birthDate": "1920-10-08",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://www.oregonencyclopedia.org/articles/herbert-frank-and-the-dune-series/",
        "publisher": "Oregon Encyclopedia"
      },
      {
        "url": "https://www.encyclopedia.com/arts/culture-magazines/herbert-frank-1920-1986",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "john-lennon": {
    "wikidataId": "Q1203",
    "birthDate": "1940-10-09",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.beatlesstory.com/blog/9-dream-john-lennon-and-numerology/",
        "publisher": "The Beatles Story"
      },
      {
        "url": "https://www.universal-music.co.jp/the-beatles/biography/",
        "publisher": "Universal Music Japan"
      }
    ]
  },
  "leopold-sedar-senghor": {
    "wikidataId": "Q154545",
    "birthDate": "1906-10-09",
    "countryCode": "SN",
    "countryName": "Senegal",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.presidence.sn/en/presidence/leopold-sedar-senghor/",
        "publisher": "Presidency of Senegal"
      },
      {
        "url": "https://www.academie-francaise.fr/les-immortels/leopold-sedar-senghor",
        "publisher": "Académie française"
      }
    ]
  },
  "camille-saint-saens": {
    "wikidataId": "Q150445",
    "birthDate": "1835-10-09",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb13899342r",
        "publisher": "Bibliothèque nationale de France"
      },
      {
        "url": "https://www.operadeparis.fr/artistes/camille-saint-saens",
        "publisher": "Opéra national de Paris"
      }
    ]
  },
  "fridtjof-nansen": {
    "wikidataId": "Q72292",
    "birthDate": "1861-10-10",
    "countryCode": "NO",
    "countryName": "Na Uy",
    "category": "history",
    "occupation": "Nhà thám hiểm",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/prizes/peace/1922/nansen/biographical/",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://snl.no/Fridtjof_Nansen",
        "publisher": "Store norske leksikon"
      }
    ]
  },
  "harold-pinter": {
    "wikidataId": "Q41042",
    "birthDate": "1930-10-10",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "literature",
    "occupation": "Nhà viết kịch",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/laureate/801",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://research.hrc.utexas.edu/fasearch/pdf/00108.pdf",
        "publisher": "Harry Ransom Center"
      }
    ]
  },
  "xherdan-shaqiri": {
    "wikidataId": "Q252190",
    "birthDate": "1991-10-10",
    "countryCode": "CH",
    "countryName": "Thụy Sĩ",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://it.uefa.com/euro2024/teams/players/1905360--xherdan-shaqiri/",
        "publisher": "it.uefa.com"
      },
      {
        "url": "https://www.skysports.com/xherdan-shaqiri",
        "publisher": "Sky Sports"
      }
    ]
  },
  "eleanor-roosevelt": {
    "wikidataId": "Q83396",
    "birthDate": "1884-10-11",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Nhà hoạt động nhân quyền",
    "dobSources": [
      {
        "url": "https://www.fdrlibrary.org/er-biography",
        "publisher": "Franklin D. Roosevelt Presidential Library"
      },
      {
        "url": "https://www.nps.gov/people/eleanor-roosevelt.htm",
        "publisher": "National Park Service"
      }
    ]
  },
  "thich-nhat-hanh": {
    "wikidataId": "Q310913",
    "birthDate": "1926-10-11",
    "countryCode": "VN",
    "countryName": "Việt Nam",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://plumvillage.org/about/thich-nhat-hanh/biography/thich-nhat-hanh-full-biography",
        "publisher": "Plum Village",
        "publisherCountry": "FR",
        "countryProofUrl": "https://plumvillage.org/terms-and-conditions"
      },
      {
        "url": "https://www.ebsco.com/research-starters/biography/thich-nhat-hanh",
        "publisher": "EBSCO",
        "publisherCountry": "US",
        "countryProofUrl": "https://about.ebsco.com/offices"
      }
    ]
  },
  "amitabh-bachchan": {
    "wikidataId": "Q9570",
    "birthDate": "1942-10-11",
    "countryCode": "IN",
    "countryName": "Ấn Độ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actor/amitabh-bachchan",
        "publisher": "Biography.com"
      },
      {
        "url": "https://dff.nic.in/images/Documents/49_53Nfacatalogue-%20.pdf",
        "publisher": "National Film Archive of India"
      }
    ]
  },
  "hugh-jackman": {
    "wikidataId": "Q129591",
    "birthDate": "1968-10-12",
    "countryCode": "AU",
    "countryName": "Úc",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/hugh-jackman",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.imdb.com/name/nm0413168/bio/",
        "publisher": "IMDb"
      }
    ]
  },
  "pedro-i-cua-brasil": {
    "wikidataId": "Q939",
    "birthDate": "1798-10-12",
    "countryCode": "BR",
    "countryName": "Brasil",
    "category": "politics",
    "occupation": "Quân chủ",
    "dobSources": [
      {
        "url": "https://mapa.arquivonacional.gov.br/index.php/component/content/article/395-pedro-de-alcantara-francisco-antonio-joao-carlos-xavier-de-paula-miguel-gabriel-rafael-joaquim-jose-gonzaga-pascoal-cipriano-serafim-de-braganca-e-bourbon-d-pedro-i?Itemid=148&catid=70",
        "publisher": "Arquivo Nacional"
      },
      {
        "url": "https://www.camara.leg.br/tv/177173-dom-pedro-i/",
        "publisher": "Chamber of Deputies of Brazil"
      }
    ]
  },
  "edith-stein": {
    "wikidataId": "Q76749",
    "birthDate": "1891-10-12",
    "countryCode": "DE",
    "countryName": "Đức",
    "category": "history",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://press.vatican.va/news_services/liturgy/saints/ns_lit_doc_19981011_edith_stein_en.html",
        "publisher": "Holy See Press Office"
      },
      {
        "url": "https://www.edith-stein-archiv.de/en/edith-steins-lebenschronik",
        "publisher": "Edith Stein Archive"
      }
    ]
  },
  "margaret-thatcher": {
    "wikidataId": "Q7416",
    "birthDate": "1925-10-13",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.margaretthatcher.org/archive/MTobit",
        "publisher": "Margaret Thatcher Foundation"
      },
      {
        "url": "https://www.gov.uk/government/history/past-prime-ministers/margaret-thatcher",
        "publisher": "UK Government"
      }
    ]
  },
  "alexandria-ocasio-cortez": {
    "wikidataId": "Q55223040",
    "birthDate": "1989-10-13",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://history.house.gov/People/Detail/25769805196/",
        "publisher": "U.S. House of Representatives: History, Art & Archives"
      },
      {
        "url": "https://www.govinfo.gov/content/pkg/CDIR-2020-07-22/pdf/CDIR-2020-07-22.pdf",
        "publisher": "U.S. Government Publishing Office"
      }
    ]
  },
  "paul-simon": {
    "wikidataId": "Q4028",
    "birthDate": "1941-10-13",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.biography.com/musicians/paul-simon",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.sonymusic.co.jp/artist/SimonAndGarfunkel/profile/",
        "publisher": "Sony Music Japan"
      }
    ]
  },
  "dwight-d-eisenhower": {
    "wikidataId": "Q9916",
    "birthDate": "1890-10-14",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.eisenhowerlibrary.gov/eisenhowers",
        "publisher": "Dwight D. Eisenhower Presidential Library"
      },
      {
        "url": "https://www.nps.gov/ddem/learn/historyculture/ikebio.htm",
        "publisher": "National Park Service"
      }
    ]
  },
  "roger-moore": {
    "wikidataId": "Q134333",
    "birthDate": "1927-10-14",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.bfi.org.uk/sight-and-sound/news/roger-moore-obituary-star-who-gave-james-bond-martini-dry-wit",
        "publisher": "British Film Institute"
      },
      {
        "url": "https://www.imdb.com/name/nm0000549/bio/",
        "publisher": "IMDb"
      }
    ]
  },
  "usher": {
    "wikidataId": "Q165911",
    "birthDate": "1978-10-14",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.biography.com/musicians/usher",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.sonymusic.co.jp/artist/usher/profile/",
        "publisher": "Sony Music Japan"
      }
    ]
  },
  "friedrich-nietzsche": {
    "wikidataId": "Q9358",
    "birthDate": "1844-10-15",
    "countryCode": "DE",
    "countryName": "Đức",
    "category": "history",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://plato.stanford.edu/archives/win2000/entries/nietzsche/",
        "publisher": "Stanford Encyclopedia of Philosophy"
      },
      {
        "url": "https://iep.utm.edu/nietzsch/",
        "publisher": "Internet Encyclopedia of Philosophy"
      }
    ]
  },
  "a-p-j-abdul-kalam": {
    "wikidataId": "Q9513",
    "birthDate": "1931-10-15",
    "countryCode": "IN",
    "countryName": "Ấn Độ",
    "category": "scientist",
    "occupation": "Nhà khoa học",
    "dobSources": [
      {
        "url": "https://www.presidentofindia.gov.in/dr-apj-abdul-kalam-profile",
        "publisher": "President of India"
      },
      {
        "url": "https://ncert.nic.in/desm/pdf/Rashtriya_Avishkar_Saptah_eng.pdf",
        "publisher": "National Council of Educational Research and Training"
      }
    ]
  },
  "italo-calvino": {
    "wikidataId": "Q154756",
    "birthDate": "1923-10-15",
    "countryCode": "IT",
    "countryName": "Ý",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb11894897x",
        "publisher": "Bibliothèque nationale de France"
      },
      {
        "url": "https://www.treccani.it/enciclopedia/italo-calvino_%28Dizionario-Biografico%29/",
        "publisher": "Treccani"
      }
    ]
  },
  "oscar-wilde": {
    "wikidataId": "Q30875",
    "birthDate": "1854-10-16",
    "countryCode": "IE",
    "countryName": "Ireland",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://www.dib.ie/biography/wilde-oscar-fingal-oflahertie-a9036",
        "publisher": "Dictionary of Irish Biography"
      },
      {
        "url": "https://www.biography.com/authors-writers/oscar-wilde",
        "publisher": "Biography.com"
      }
    ]
  },
  "gunter-grass": {
    "wikidataId": "Q6538",
    "birthDate": "1927-10-16",
    "countryCode": "DE",
    "countryName": "Đức",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://www.hdg.de/lemo/biografie/guenter-grass.html",
        "publisher": "hdg.de"
      },
      {
        "url": "https://thebookerprizes.com/the-booker-library/authors/gunter-grass",
        "publisher": "thebookerprizes.com"
      }
    ]
  },
  "phan-thi-ha-thanh": {
    "wikidataId": "Q2425498",
    "birthDate": "1991-10-16",
    "countryCode": "VN",
    "countryName": "Việt Nam",
    "category": "athlete",
    "occupation": "Vận động viên thể dục dụng cụ",
    "dobSources": [
      {
        "url": "https://www.lequipe.fr/fiche/thi-ha-thanh-phan/94715",
        "publisher": "L’Équipe",
        "publisherCountry": "FR",
        "countryProofUrl": "https://www.lequipe.fr/mentions-legales"
      },
      {
        "url": "https://www.ocagames.com/OCA/cache/17ag/GA/par.GA.VIE.5108185.html",
        "publisher": "OCA",
        "publisherCountry": "KW",
        "countryProofUrl": "https://oca.asia/council/oca-headquarters/"
      }
    ]
  },
  "eminem": {
    "wikidataId": "Q5608",
    "birthDate": "1972-10-17",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Rapper",
    "dobSources": [
      {
        "url": "https://www.universal-music.co.jp/eminem/biography/",
        "publisher": "Universal Music Japan"
      },
      {
        "url": "https://www.eminem.net/biography/",
        "publisher": "eminem.net"
      }
    ]
  },
  "arthur-miller": {
    "wikidataId": "Q80596",
    "birthDate": "1915-10-17",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Nhà viết kịch",
    "dobSources": [
      {
        "url": "https://www.chipublib.org/arthur-miller-biography/",
        "publisher": "Chicago Public Library"
      },
      {
        "url": "https://archives.nypl.org/brg/31015",
        "publisher": "New York Public Library"
      }
    ]
  },
  "kimi-raikkonen": {
    "wikidataId": "Q11192",
    "birthDate": "1979-10-17",
    "countryCode": "FI",
    "countryName": "Phần Lan",
    "category": "athlete",
    "occupation": "Tay đua ô tô",
    "dobSources": [
      {
        "url": "https://www.formula1.com/en/information/drivers-hall-of-fame-kimi-raikkonen.4Ykdt9U76gWO40cNbjaMXf",
        "publisher": "Formula 1"
      },
      {
        "url": "https://www.fia.com/file/61780/download",
        "publisher": "Fédération Internationale de l’Automobile"
      }
    ]
  },
  "henri-bergson": {
    "wikidataId": "Q42156",
    "birthDate": "1859-10-18",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "history",
    "occupation": "Triết gia",
    "dobSources": [
      {
        "url": "https://www.academie-francaise.fr/les-immortels/henri-bergson?election=12-02-1914&fauteuil=7",
        "publisher": "Académie française"
      },
      {
        "url": "https://plato.stanford.edu/entries/bergson/",
        "publisher": "Stanford Encyclopedia of Philosophy"
      }
    ]
  },
  "chuck-berry": {
    "wikidataId": "Q5921",
    "birthDate": "1926-10-18",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Nhạc sĩ",
    "dobSources": [
      {
        "url": "https://www.chuckberry.com/about",
        "publisher": "Chuck Berry official site"
      },
      {
        "url": "https://www.biography.com/musicians/chuck-berry",
        "publisher": "Biography.com"
      }
    ]
  },
  "martina-navratilova": {
    "wikidataId": "Q54545",
    "birthDate": "1956-10-18",
    "countryCode": "CZ",
    "countryName": "Séc",
    "category": "athlete",
    "occupation": "Vận động viên quần vợt",
    "dobSources": [
      {
        "url": "https://www.wtatennis.com/legends/140007/Martina_Navratilova",
        "publisher": "WTA"
      },
      {
        "url": "https://www.martinanavratilova.com/biography",
        "publisher": "Martina Navratilova official site"
      }
    ]
  },
  "subrahmanyan-chandrasekhar": {
    "wikidataId": "Q148109",
    "birthDate": "1910-10-19",
    "countryCode": "IN",
    "countryName": "Ấn Độ",
    "category": "scientist",
    "occupation": "Nhà vật lý thiên văn",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/laureate/122",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://makingscience.royalsociety.org/people/na3455/subrahmanyan-chandrasekhar",
        "publisher": "makingscience.royalsociety.org"
      }
    ]
  },
  "john-le-carre": {
    "wikidataId": "Q209641",
    "birthDate": "1931-10-19",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "literature",
    "occupation": "Tiểu thuyết gia",
    "dobSources": [
      {
        "url": "https://johnlecarre.com/biography/",
        "publisher": "John le Carré official site"
      },
      {
        "url": "https://www.theguardian.com/books/2020/dec/14/john-le-carre-obituary",
        "publisher": "The Guardian"
      }
    ]
  },
  "philip-pullman": {
    "wikidataId": "Q190220",
    "birthDate": "1946-10-19",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://sf-encyclopedia.com/entry/pullman_philip",
        "publisher": "Science Fiction Encyclopedia"
      },
      {
        "url": "https://www.encyclopedia.com/people/social-sciences-and-law/political-science-biographies/philip-pullman",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "snoop-dogg": {
    "wikidataId": "Q6096",
    "birthDate": "1971-10-20",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Rapper",
    "dobSources": [
      {
        "url": "https://www.biography.com/musicians/snoop-dogg",
        "publisher": "Biography.com"
      },
      {
        "url": "https://universalmusic.fr/artistes/20000214636",
        "publisher": "Universal Music France"
      }
    ]
  },
  "arthur-rimbaud": {
    "wikidataId": "Q493",
    "birthDate": "1854-10-20",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://www.poetryfoundation.org/poets/arthur-rimbaud",
        "publisher": "Poetry Foundation"
      },
      {
        "url": "https://snl.no/Arthur_Rimbaud",
        "publisher": "Store norske leksikon"
      }
    ]
  },
  "nguyen-tien-linh": {
    "wikidataId": "Q27899182",
    "birthDate": "1997-10-20",
    "countryCode": "VN",
    "countryName": "Việt Nam",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.transfermarkt.com/tien-linh-nguyen/marktwertverlauf/spieler/432433",
        "publisher": "Transfermarkt",
        "publisherCountry": "DE",
        "countryProofUrl": "https://www.transfermarkt.us/intern/impressum"
      },
      {
        "url": "https://assets.the-afc.com/migration/a/f/afc-champions-league-2016-preliminary-registration-squad-list-29510",
        "publisher": "AFC",
        "publisherCountry": "MY",
        "countryProofUrl": "https://www.the-afc.com/en/more/privacy_policy.html"
      }
    ]
  },
  "alfred-nobel": {
    "wikidataId": "Q23810",
    "birthDate": "1833-10-21",
    "countryCode": "SE",
    "countryName": "Thụy Điển",
    "category": "scientist",
    "occupation": "Nhà hóa học",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/alfred-nobel/",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://www.nobelpeaceprize.org/nobel-peace-prize/history/alfred-nobel",
        "publisher": "Nobel Peace Center"
      }
    ]
  },
  "ursula-k-le-guin": {
    "wikidataId": "Q181659",
    "birthDate": "1929-10-21",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Tiểu thuyết gia",
    "dobSources": [
      {
        "url": "https://poets.org/poet/ursula-k-le-guin",
        "publisher": "Academy of American Poets"
      },
      {
        "url": "https://www.biography.com/writer/ursula-k-le-guin",
        "publisher": "Biography.com"
      }
    ]
  },
  "carrie-fisher": {
    "wikidataId": "Q108941",
    "birthDate": "1956-10-21",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/carrie-fisher",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.televisionacademy.com/bios/carrie-fisher",
        "publisher": "Television Academy"
      }
    ]
  },
  "doris-lessing": {
    "wikidataId": "Q40874",
    "birthDate": "1919-10-22",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "literature",
    "occupation": "Nhà văn",
    "dobSources": [
      {
        "url": "https://thepresidency.gov.za/sites/default/files/2022-07/National%20Orders%20Booklet%202008_0.pdf",
        "publisher": "The Presidency of South Africa"
      },
      {
        "url": "https://www.nobelprize.org/prizes/literature/2007/lessing/facts/",
        "publisher": "Nobel Prize Outreach"
      }
    ]
  },
  "franz-liszt": {
    "wikidataId": "Q41309",
    "birthDate": "1811-10-22",
    "countryCode": "HU",
    "countryName": "Hungary",
    "category": "music",
    "occupation": "Nghệ sĩ dương cầm",
    "dobSources": [
      {
        "url": "https://www.loc.gov/item/n79079048/franz-liszt/",
        "publisher": "loc.gov"
      },
      {
        "url": "https://www.liszt.nl/en/franz-liszt",
        "publisher": "Franz Liszt Society"
      }
    ]
  },
  "catherine-deneuve": {
    "wikidataId": "Q106418",
    "birthDate": "1943-10-22",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://universalmusic.fr/artistes/20000069202",
        "publisher": "Universal Music France"
      },
      {
        "url": "https://www.ina.fr/actualites-ina/album-photo-catherine-deneuve-cinema-anniversaire",
        "publisher": "Institut national de l’audiovisuel"
      }
    ]
  },
  "pele": {
    "wikidataId": "Q12897",
    "birthDate": "1940-10-23",
    "countryCode": "BR",
    "countryName": "Brasil",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.cbf.com.br/selecao-brasileira/noticias/selecao-masculina/campo-de-manha-academia-a-tarde/eterno-pele-completaria-85-anos-nesta-quin-ta-feira",
        "publisher": "cbf.com.br"
      },
      {
        "url": "https://www.santosfc.com.br/a-origem-do-apelido-pele/",
        "publisher": "santosfc.com.br"
      }
    ]
  },
  "ryan-reynolds": {
    "wikidataId": "Q192682",
    "birthDate": "1976-10-23",
    "countryCode": "CA",
    "countryName": "Canada",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.canadaswalkoffame.com/inductees/ryan-reynolds/",
        "publisher": "Canada’s Walk of Fame"
      },
      {
        "url": "https://www.biography.com/actors/ryan-reynolds",
        "publisher": "Biography.com"
      }
    ]
  },
  "ang-lee": {
    "wikidataId": "Q160726",
    "birthDate": "1954-10-23",
    "countryCode": "TW",
    "countryName": "Đài Loan",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://www.biography.com/filmmaker/ang-lee",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/people/literature-and-arts/film-and-television-biographies/ang-lee",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "wayne-rooney": {
    "wikidataId": "Q266613",
    "birthDate": "1985-10-24",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.skysports.com/wayne-rooney",
        "publisher": "Sky Sports"
      },
      {
        "url": "https://www.englandfootball.com/england/mens-senior-team/squad/Legends-profiles/wayne-rooney",
        "publisher": "England Football"
      }
    ]
  },
  "malcolm-turnbull": {
    "wikidataId": "Q927550",
    "birthDate": "1954-10-24",
    "countryCode": "AU",
    "countryName": "Úc",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.aph.gov.au/~/media/05%20About%20Parliament/54%20Parliamentary%20Depts/544%20Parliamentary%20Library/Handbook/handbook_45th_parliament.pdf",
        "publisher": "aph.gov.au"
      },
      {
        "url": "https://primeministers.moadoph.gov.au/prime-ministers/malcolm-turnbull",
        "publisher": "Museum of Australian Democracy"
      }
    ]
  },
  "kevin-kline": {
    "wikidataId": "Q105817",
    "birthDate": "1947-10-24",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.encyclopedia.com/people/literature-and-arts/film-and-television-biographies/kevin-kline",
        "publisher": "Encyclopedia.com"
      },
      {
        "url": "https://goldenglobes.com/person/kevin-kline/",
        "publisher": "Golden Globes"
      }
    ]
  },
  "pablo-picasso": {
    "wikidataId": "Q5593",
    "birthDate": "1881-10-25",
    "countryCode": "ES",
    "countryName": "Tây Ban Nha",
    "category": "artist",
    "occupation": "Họa sĩ",
    "dobSources": [
      {
        "url": "https://web.guggenheim.org/exhibitions/picasso/biography",
        "publisher": "Solomon R. Guggenheim Museum"
      },
      {
        "url": "https://www.museepicassoparis.fr/en/picasso-biography/timeline/",
        "publisher": "Musée national Picasso-Paris"
      }
    ]
  },
  "katy-perry": {
    "wikidataId": "Q42493",
    "birthDate": "1984-10-25",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "music",
    "occupation": "Ca sĩ",
    "dobSources": [
      {
        "url": "https://www.grammy.com/artists/katy-perry/5726/",
        "publisher": "Recording Academy"
      },
      {
        "url": "https://universalmusic.fr/artistes/30204417319",
        "publisher": "Universal Music France"
      }
    ]
  },
  "georges-bizet": {
    "wikidataId": "Q56158",
    "birthDate": "1838-10-25",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "music",
    "occupation": "Nhà soạn nhạc",
    "dobSources": [
      {
        "url": "https://hdwlabs.artsci.wustl.edu/bizet/ref/biography.html",
        "publisher": "Washington University in St. Louis"
      },
      {
        "url": "https://www.operadeparis.fr/artistes/georges-bizet",
        "publisher": "Opéra national de Paris"
      }
    ]
  },
  "hillary-clinton": {
    "wikidataId": "Q6294",
    "birthDate": "1947-10-26",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://history.state.gov/departmenthistory/people/clinton-hillary-rodham",
        "publisher": "history.state.gov"
      },
      {
        "url": "https://www.pbs.org/wgbh/americanexperience/features/clinton-hillary-rodham-clinton-biography/",
        "publisher": "pbs.org"
      }
    ]
  },
  "francois-mitterrand": {
    "wikidataId": "Q2038",
    "birthDate": "1916-10-26",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.elysee.fr/francois-mitterrand",
        "publisher": "Élysée"
      },
      {
        "url": "https://www.assemblee-nationale.fr/gouv_parl/fiches_personnalites/Mitterrand.asp",
        "publisher": "Assemblée nationale"
      }
    ]
  },
  "seth-macfarlane": {
    "wikidataId": "Q188492",
    "birthDate": "1973-10-26",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "artist",
    "occupation": "Nhà biên kịch",
    "dobSources": [
      {
        "url": "https://www.biography.com/movies-tv/seth-macfarlane",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/education/news-wires-white-papers-and-books/macfarlane-seth-1973",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "theodore-roosevelt": {
    "wikidataId": "Q33866",
    "birthDate": "1858-10-27",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.nps.gov/people/life-of-theodore-roosevelt.htm",
        "publisher": "National Park Service"
      },
      {
        "url": "https://www.si.edu/object/roosevelt-theodore-1858-1919:auth_per_fbr_EACP15",
        "publisher": "si.edu"
      }
    ]
  },
  "sylvia-plath": {
    "wikidataId": "Q133054",
    "birthDate": "1932-10-27",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://poets.org/poet/sylvia-plath",
        "publisher": "Academy of American Poets"
      },
      {
        "url": "https://www.history.com/this-day-in-history/October-27/sylvia-plath-is-born",
        "publisher": "history.com"
      }
    ]
  },
  "john-cleese": {
    "wikidataId": "Q25014",
    "birthDate": "1939-10-27",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://calperformances.org/learn/program_notes/2005/pn_Cleese.pdf",
        "publisher": "calperformances.org"
      },
      {
        "url": "https://www.tvencyclopedia.org/tv-encyclopedia-3/cleese-john",
        "publisher": "TV Encyclopedia"
      }
    ]
  },
  "bill-gates": {
    "wikidataId": "Q5284",
    "birthDate": "1955-10-28",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "entrepreneur",
    "occupation": "Doanh nhân",
    "dobSources": [
      {
        "url": "https://www.biography.com/business-leaders/bill-gates",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.computerhistory.org/tdih/october/28/",
        "publisher": "Computer History Museum"
      }
    ]
  },
  "jonas-salk": {
    "wikidataId": "Q200101",
    "birthDate": "1914-10-28",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "scientist",
    "occupation": "Nhà nghiên cứu virus",
    "dobSources": [
      {
        "url": "https://www.salk.edu/about/history-of-salk/jonas-salk/",
        "publisher": "Salk Institute"
      },
      {
        "url": "https://www.jonassalk.org/docs/BioSketch.html",
        "publisher": "Jonas Salk Legacy Foundation"
      }
    ]
  },
  "julia-roberts": {
    "wikidataId": "Q40523",
    "birthDate": "1967-10-28",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/julia-roberts",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/people/literature-and-arts/film-and-television-biographies/julia-roberts",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "ellen-johnson-sirleaf": {
    "wikidataId": "Q43179",
    "birthDate": "1938-10-29",
    "countryCode": "LR",
    "countryName": "Liberia",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.nobelprize.org/prizes/peace/2011/johnson_sirleaf/facts/",
        "publisher": "Nobel Prize Outreach"
      },
      {
        "url": "https://mo.ibrahim.foundation/prize/laureates/ellen-johnson-sirleaf",
        "publisher": "Mo Ibrahim Foundation"
      }
    ]
  },
  "winona-ryder": {
    "wikidataId": "Q101797",
    "birthDate": "1971-10-29",
    "countryCode": "US",
    "countryName": "Hoa Kỳ",
    "category": "actor",
    "occupation": "Diễn viên",
    "dobSources": [
      {
        "url": "https://www.biography.com/actors/winona-ryder",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.encyclopedia.com/people/literature-and-arts/film-and-television-biographies/winona-ryder",
        "publisher": "Encyclopedia.com"
      }
    ]
  },
  "edwin-van-der-sar": {
    "wikidataId": "Q482955",
    "birthDate": "1970-10-29",
    "countryCode": "NL",
    "countryName": "Hà Lan",
    "category": "athlete",
    "occupation": "Thủ môn bóng đá",
    "dobSources": [
      {
        "url": "https://www.premierleague.com/en/players/4058/edwin-van-der-sar/overview",
        "publisher": "Premier League"
      },
      {
        "url": "https://www.onsoranje.nl/toernooien/414/selectie/185184/speler/8558",
        "publisher": "Royal Netherlands Football Association"
      }
    ]
  },
  "diego-maradona": {
    "wikidataId": "Q17515",
    "birthDate": "1960-10-30",
    "countryCode": "AR",
    "countryName": "Argentina",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.biography.com/athletes/diego-maradona",
        "publisher": "Biography.com"
      },
      {
        "url": "https://players.fcbarcelona.com/en/player/501-maradona-diego-armando-maradona-franco",
        "publisher": "FC Barcelona"
      }
    ]
  },
  "paul-valery": {
    "wikidataId": "Q200639",
    "birthDate": "1871-10-30",
    "countryCode": "FR",
    "countryName": "Pháp",
    "category": "literature",
    "occupation": "Nhà thơ",
    "dobSources": [
      {
        "url": "https://www.academie-francaise.fr/les-immortels/paul-valery",
        "publisher": "Académie française"
      },
      {
        "url": "https://catalogue.bnf.fr/ark:/12148/cb119274707",
        "publisher": "Bibliothèque nationale de France"
      }
    ]
  },
  "zoran-milanovic": {
    "wikidataId": "Q57687",
    "birthDate": "1966-10-30",
    "countryCode": "HR",
    "countryName": "Croatia",
    "category": "politics",
    "occupation": "Chính trị gia",
    "dobSources": [
      {
        "url": "https://www.predsjednik.hr/en/president/",
        "publisher": "Office of the President of Croatia"
      },
      {
        "url": "https://www.enciklopedija.hr/clanak/milanovic-zoran/",
        "publisher": "Croatian Encyclopedia"
      }
    ]
  },
  "peter-jackson": {
    "wikidataId": "Q4465",
    "birthDate": "1961-10-31",
    "countryCode": "NZ",
    "countryName": "New Zealand",
    "category": "artist",
    "occupation": "Đạo diễn phim",
    "dobSources": [
      {
        "url": "https://www.biography.com/movies-tv/peter-jackson",
        "publisher": "Biography.com"
      },
      {
        "url": "https://www.ebsco.com/research-starters/biography/peter-jackson",
        "publisher": "EBSCO"
      }
    ]
  },
  "marcus-rashford": {
    "wikidataId": "Q22951255",
    "birthDate": "1997-10-31",
    "countryCode": "GB",
    "countryName": "Vương quốc Anh",
    "category": "athlete",
    "occupation": "Cầu thủ bóng đá",
    "dobSources": [
      {
        "url": "https://www.manutd.com/en/teams/mens-team/marcus-rashford",
        "publisher": "Manchester United"
      },
      {
        "url": "https://www.uefa.com/uefachampionsleague/clubs/players/250088246--marcus-rashford/",
        "publisher": "uefa.com"
      }
    ]
  },
  "zaha-hadid": {
    "wikidataId": "Q47780",
    "birthDate": "1950-10-31",
    "countryCode": "IQ",
    "countryName": "Iraq",
    "category": "artist",
    "occupation": "Kiến trúc sư",
    "dobSources": [
      {
        "url": "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/22231C3B20D5E38E63CD579577FC7F21/S1359135516000348a.pdf/zaha-hadid-1950-2016.pdf",
        "publisher": "Cambridge University Press"
      },
      {
        "url": "https://sammlung.mak.at/en/artist/hadid-zaha_194",
        "publisher": "MAK Collection Online"
      }
    ]
  }
};
const B014_APPROVED_IDS = new Set(Object.keys(B014_APPROVED_PROFILES));
const B014_APPROVED_QIDS = new Set(Object.values(B014_APPROVED_PROFILES).map((profile) => profile.wikidataId));
const B014_NEW_PEOPLE = ALL_PEOPLE.filter((p) => B014_NEW_IDS.has(p.id));
assert('Rule AI', B014_NEW_IDS.size === 93 && B014_APPROVED_IDS.size === 93, 'B014 must lock exactly 93 unique profile IDs');
assert('Rule AI', B014_APPROVED_IDS.size === B014_NEW_IDS.size && [...B014_NEW_IDS].every((id) => B014_APPROVED_IDS.has(id)), 'B014 exact ID allowlist must match the October projection');
assert('Rule AI', B014_NEW_PEOPLE.length === 93 && B014_NEW_PEOPLE.length === B014_APPROVED_IDS.size, `B014 requires exactly 93 approved October profiles, found ${B014_NEW_PEOPLE.length}`);
assert('Rule AI', B014_APPROVED_QIDS.size === 93 && new Set(B014_NEW_PEOPLE.map((p) => p.wikidataId)).size === 93, 'B014 QIDs must be exact and unique');
assert('Rule AI', B014_NEW_PEOPLE.every((p) => B014_APPROVED_IDS.has(p.id)), 'B014 additions must match only the approved profile IDs');
assert('Rule AI', !ALL_PEOPLE.some((p) => !B014_NEW_IDS.has(p.id) && p.wikidataId && B014_APPROVED_QIDS.has(p.wikidataId)), 'B014 QIDs must not duplicate an earlier profile');

function isApprovedB014DobSource(qid: string, url: string): boolean {
  return Object.values(B014_APPROVED_PROFILES).some((profile) => profile.wikidataId === qid && profile.dobSources.some((source) => source.url === url));
}

const b014EvidenceProfiles = B014_EVIDENCE.profiles as readonly {
  id: string; wikidataId: string; birthDate: string; countryCode: string; countryName: string; category: string; occupation: string;
  dobSources: readonly B014DobSource[];
  identityEvidence: {
    wikidataLabel: string; description: string | null; candidateCountryCodes: readonly string[]; candidateCountryNames: readonly string[];
    candidateOccupationTerms: readonly string[]; selectedCountryCode: string; selectedOccupation: string;
    countryEvidenceSourceUrls: readonly string[]; categoryRationale: string;
  };
}[];
const b014EvidenceProfilesById = new Map(b014EvidenceProfiles.map((profile) => [profile.id, profile]));
assert('Rule AI evidence', B014_EVIDENCE.schemaVersion === 1 && B014_EVIDENCE.cycle === 'BV-015 / B014', 'B014 evidence file must identify its schema and cycle');
assert('Rule AI evidence', B014_EVIDENCE.scope.month === 10 && B014_EVIDENCE.scope.profileCount === 93 && B014_EVIDENCE.scope.profilesPerDay === 3, 'B014 evidence must declare the approved October scope');
assert('Rule AI evidence', b014EvidenceProfiles.length === 93 && b014EvidenceProfilesById.size === 93, 'B014 evidence must include 93 unique reviewed profiles');

const B014_COUNTRY_PROOF_URLS: Readonly<Record<string, string>> = {
  'Transfermarkt': 'https://www.transfermarkt.us/intern/impressum',
  'Sofascore': 'https://corporate.sofascore.com/legal-information',
  'ISSF': 'https://www.issf-sports.org/contact',
  'OCA': 'https://oca.asia/council/oca-headquarters/',
  'Plum Village': 'https://plumvillage.org/terms-and-conditions',
  'EBSCO': 'https://about.ebsco.com/offices',
  'L’Équipe': 'https://www.lequipe.fr/mentions-legales',
  'AFC': 'https://www.the-afc.com/en/more/privacy_policy.html',
};

const b014SourceCaptures = B014_EVIDENCE.sourceCaptures as unknown as Record<string, {
  profileId: string; wikidataId: string; expectedBirthDate: string; publisher: string; publisherCountry?: string | null;
  countryProofUrl?: string | null; verificationMethod: string; fullDobAndIdentityReviewed: boolean; browserExcerpt?: string | null;
  capture?: { status?: number | null; sha256?: string | null; exactDate?: boolean } | null;
  localAttempts: readonly unknown[];
}>;
for (const p of B014_NEW_PEOPLE) {
  const expected = B014_APPROVED_PROFILES[p.id];
  const evidence = b014EvidenceProfilesById.get(p.id);
  assert('Rule AI', Boolean(expected), `Unapproved B014 profile ID: ${p.id}`);
  assert('Rule AI evidence', Boolean(evidence), `B014 evidence is missing profile ${p.id}`);
  assert('Rule AI', p.wikidataId === expected.wikidataId, `B014 ${p.id} expected ${expected.wikidataId}, got ${p.wikidataId}`);
  assert('Rule AI', p.birthDate === expected.birthDate && /^\d{4}-10-\d{2}$/.test(p.birthDate), `B014 ${p.id} expected exact October DOB ${expected.birthDate}, got ${p.birthDate}`);
  assert('Rule AI', p.birthMonth === 10 && p.birthYear === Number(p.birthDate.slice(0, 4)) && p.birthDay === Number(p.birthDate.slice(8, 10)), `B014 ${p.id} split date fields must match birthDate`);
  assert('Rule AI', p.countryCode === expected.countryCode && p.countryName === expected.countryName && p.category === expected.category, `B014 ${p.id} country/category must match the reviewed mapping`);
  assert('Rule AI', p.occupation?.length === 1 && p.occupation[0] === expected.occupation, `B014 ${p.id} occupation must match the reviewed mapping`);
  assert('Rule AI', p.verifiedAt === '2026-10-07', `B014 ${p.id} requires the B014 review date`);
  assert('Rule AI', p.sourceUrls?.includes(`https://www.wikidata.org/wiki/${expected.wikidataId}`) === true, `B014 ${p.id} requires its exact Wikidata URL`);
  assert('Rule AI source', expected.dobSources.length === 2, `B014 ${p.id} must have exactly two reviewed DOB publishers`);
  assert('Rule AI source', new Set(expected.dobSources.map((source) => source.publisher)).size === 2, `B014 ${p.id} publishers must be distinct`);
  assert('Rule AI source', new Set(expected.dobSources.map((source) => getUrlHostname(source.url))).size === 2, `B014 ${p.id} DOB source hosts must be distinct`);
  const nonWikiUrls = sourceUrlsBeforeBv017(p).filter((url) => {
    const host = getUrlHostname(url);
    return host && !host.endsWith('wikipedia.org') && !host.endsWith('wikidata.org') && !host.endsWith('wikimedia.org');
  });
  const approvedUrls = expected.dobSources.map((source) => source.url);
  assert('Rule AI source', nonWikiUrls.length === 2 && approvedUrls.every((url) => nonWikiUrls.includes(url)), `B014 ${p.id} must include exactly its two reviewed non-Wikidata DOB sources`);
  assert('Rule AI evidence', evidence?.wikidataId === expected.wikidataId && evidence.birthDate === expected.birthDate && evidence.countryCode === expected.countryCode && evidence.countryName === expected.countryName && evidence.category === expected.category && evidence.occupation === expected.occupation, `B014 evidence identity mapping must match the allowlist for ${p.id}`);
  assert('Rule AI evidence', JSON.stringify(evidence?.dobSources) === JSON.stringify(expected.dobSources), `B014 source evidence must match the exact pair for ${p.id}`);
  assert('Rule AI evidence', evidence?.identityEvidence.selectedCountryCode === expected.countryCode && evidence.identityEvidence.selectedOccupation === expected.occupation && evidence.identityEvidence.candidateOccupationTerms.length > 0 && Boolean(evidence.identityEvidence.wikidataLabel) && Boolean(evidence.identityEvidence.categoryRationale), `B014 ${p.id} requires a Wikidata identity/occupation snapshot and reviewed mapping`);
  assert('Rule AI evidence', evidence?.identityEvidence.countryEvidenceSourceUrls.length === 2 && approvedUrls.every((url) => evidence.identityEvidence.countryEvidenceSourceUrls.includes(url)), `B014 ${p.id} country mapping must retain the reviewed identity-source pair`);
  for (const source of expected.dobSources) {
    assert('Rule AI source positive', isApprovedB014DobSource(expected.wikidataId, source.url), `B014 reviewed source must pass for ${p.id}: ${source.url}`);
    assert('Rule AI source profile', (p.sourceUrls || []).includes(source.url), `B014 ${p.id} must include reviewed source ${source.url}`);
    assert('Rule AI source URL', Boolean(getUrlHostname(source.url)), `B014 source must use a valid URL: ${source.url}`);
    const capture = b014SourceCaptures[source.url];
    assert('Rule AI evidence', Boolean(capture) && capture.profileId === p.id && capture.wikidataId === expected.wikidataId && capture.expectedBirthDate === expected.birthDate && capture.publisher === source.publisher && capture.fullDobAndIdentityReviewed === true, `B014 source evidence must bind the exact profile, DOB, and publisher: ${source.url}`);
    assert('Rule AI evidence', capture?.verificationMethod === 'direct-http' || (capture?.verificationMethod === 'browser-direct' && Boolean(capture.browserExcerpt)), `B014 source requires direct page evidence: ${source.url}`);
    if (capture?.verificationMethod === 'direct-http') {
      assert('Rule AI evidence', capture.capture?.status === 200 && Boolean(capture.capture.sha256) && capture.capture.exactDate === true, `B014 local source capture needs HTTP 200, a body hash, and exact DOB match: ${source.url}`);
    }
    assert('Rule AI source negative', !isApprovedB014DobSource('Q0', source.url), `B014 source must not approve another QID: ${source.url}`);
    assert('Rule AI source negative', !isApprovedB014DobSource(expected.wikidataId, `${source.url}#unreviewed`), `B014 source must reject an unreviewed fragment: ${source.url}`);
    const queryVariant = new URL(source.url); queryVariant.searchParams.set('unreviewed', '1');
    assert('Rule AI source negative', !isApprovedB014DobSource(expected.wikidataId, queryVariant.href), `B014 source must reject an unreviewed query: ${source.url}`);
    const pathVariant = new URL(source.url); pathVariant.pathname = `${pathVariant.pathname.replace(/\/$/, '')}/unreviewed`;
    assert('Rule AI source negative', !isApprovedB014DobSource(expected.wikidataId, pathVariant.href), `B014 source must reject an unreviewed path: ${source.url}`);
    const lookalike = new URL(source.url); lookalike.hostname += '.evil.example';
    assert('Rule AI source negative', !isApprovedB014DobSource(expected.wikidataId, lookalike.href), `B014 lookalike source host must fail: ${source.url}`);
    assert('Rule AI source negative', !isApprovedB014DobSource(expected.wikidataId, 'not-a-url'), 'B014 source must reject a malformed URL');
    if (p.countryCode === 'VN') {
      assert('Rule AI Vietnamese', Boolean(source.publisherCountry && source.publisherCountry !== 'VN' && source.countryProofUrl === B014_COUNTRY_PROOF_URLS[source.publisher]), `B014 Vietnamese ${p.id} needs foreign-publisher country proof: ${source.publisher}`);
      assert('Rule AI Vietnamese', capture.publisherCountry === source.publisherCountry && capture.countryProofUrl === source.countryProofUrl, `B014 ${p.id} source capture must preserve publisher-country proof`);
    }
  }
}

const b014Vietnamese = B014_NEW_PEOPLE.filter((p) => p.countryCode === 'VN');
assert('Rule AI balance', b014Vietnamese.length === 5, `B014 Vietnamese count must be 5, found ${b014Vietnamese.length}`);
assert('Rule AI balance', b014Vietnamese.length / B014_NEW_PEOPLE.length >= 0.05, `B014 Vietnamese share must be at least 5%; found ${b014Vietnamese.length}/${B014_NEW_PEOPLE.length}`);
assert('Rule AI balance', new Set(b014Vietnamese.map((p) => p.wikidataId)).size === 5, 'B014 Vietnamese QIDs must be unique');

const B014_CATEGORY_LABELS: Readonly<Record<string, string>> = { scientist: 'Khoa học', artist: 'Nghệ thuật', actor: 'Điện ảnh', athlete: 'Thể thao', history: 'Lịch sử', literature: 'Văn học', music: 'Âm nhạc', politics: 'Chính trị', entrepreneur: 'Doanh nhân' };
for (const p of B014_NEW_PEOPLE) {
  const expected = B014_APPROVED_PROFILES[p.id];
  assert('Rule AI category', p.categoryLabel === B014_CATEGORY_LABELS[expected.category], `B014 ${p.id} category label must match its category`);
}
for (let day = 1; day <= 31; day++) {
  const additions = B014_NEW_PEOPLE.filter((p) => p.birthDay === day);
  const total = ALL_PEOPLE.filter((p) => p.birthMonth === 10 && p.birthDay === day && !BV017_EXPANSION_NEW_IDS.has(p.id));
  assert('Rule AI coverage', additions.length === 3, `B014 October ${day} must have exactly 3 additions, found ${additions.length}`);
  assert('Rule AI coverage', total.length === 3 && total.length <= 8, `B014 October ${day} must have 3 additions and no more than 8 total people, found ${total.length}`);
}

const b014EntityAudit = B014_EVIDENCE.wikidataAudit.entities as unknown as Record<string, {
  label: string | null;
  p31: readonly { rank: string; value: string; references: number; qualifiers: readonly unknown[] }[];
  p569: readonly { rank: string; value: { time: string; precision: number; calendar: string; before: number; after: number; timezone: number }; qualifiers: Record<string, readonly unknown[]>; references: readonly { hash: string; snaks: Record<string, unknown> }[] }[];
  activeHumanP31: boolean; activeExactGregorianDob: boolean; activePreciseConflicts: readonly unknown[];
}>;
const b014Wikidata = B014_EVIDENCE.wikidataAudit as { retrievedAt: string; endpoint: string; calendarModel: string; entities: Record<string, unknown> };
assert('Rule AI Wikidata', b014Wikidata.retrievedAt === '2026-10-07' && b014Wikidata.endpoint.startsWith('https://www.wikidata.org/w/api.php') && b014Wikidata.calendarModel === 'http://www.wikidata.org/entity/Q1985727', 'B014 Wikidata evidence must identify its API, retrieval date, and Gregorian calendar');
assert('Rule AI Wikidata', Object.keys(b014EntityAudit).length === 93, 'B014 Wikidata audit must contain all 93 QIDs');
for (const p of B014_NEW_PEOPLE) {
  const expected = B014_APPROVED_PROFILES[p.id];
  const entity = b014EntityAudit[expected.wikidataId];
  assert('Rule AI Wikidata', Boolean(entity), `B014 Wikidata audit is missing ${expected.wikidataId}`);
  assert('Rule AI Wikidata', entity.activeHumanP31 === true && entity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), `B014 ${p.id} must have an active P31 human claim`);
  assert('Rule AI Wikidata', entity.activeExactGregorianDob === true && entity.activePreciseConflicts.length === 0, `B014 ${p.id} must have an exact Gregorian P569 and no active precise conflict`);
  assert('Rule AI Wikidata', entity.p31.length > 0 && entity.p31.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && Number.isInteger(claim.references) && claim.references >= 0 && Array.isArray(claim.qualifiers)), `B014 ${p.id} P31 rank, references, and qualifiers must be captured`);
  assert('Rule AI Wikidata', entity.p569.length > 0 && entity.p569.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && claim.value.calendar === b014Wikidata.calendarModel && claim.value.precision >= 0 && claim.value.precision <= 14 && claim.qualifiers !== undefined && Array.isArray(claim.references) && claim.references.every((reference) => Boolean(reference.hash) && typeof reference.snaks === 'object')), `B014 ${p.id} must preserve every P569 rank, qualifier, calendar, precision, and reference`);
  const activeClaims = entity.p569.filter((claim) => claim.rank !== 'deprecated');
  const exactClaims = activeClaims.filter((claim) => claim.value.precision === 11 && claim.value.calendar === b014Wikidata.calendarModel);
  assert('Rule AI Wikidata', exactClaims.some((claim) => claim.value.time.slice(1, 11) === expected.birthDate), `B014 ${p.id} needs an active exact P569 matching ${expected.birthDate}`);
  assert('Rule AI Wikidata', activeClaims.filter((claim) => claim.value.precision >= 11).every((claim) => claim.value.time.slice(1, 11) === expected.birthDate), `B014 ${p.id} has an active exact or more-precise P569 conflict`);
  assert('Rule AI Wikidata', activeClaims.filter((claim) => claim.value.precision < 11).every((claim) => claim.value.time.slice(1, 5) === expected.birthDate.slice(0, 4)), `B014 ${p.id} has an active coarser P569 with a conflicting year`);
  const noReferenceActiveClaims = activeClaims.filter((claim) => claim.references.length === 0);
  assert('Rule AI Wikidata exception', noReferenceActiveClaims.length === 0 || (expected.wikidataId === 'Q129591' && noReferenceActiveClaims.length === 1 && noReferenceActiveClaims[0].value.time.slice(1, 11) === expected.birthDate), `B014 ${p.id} has an active P569 claim without references outside the reviewed Hugh Jackman case`);
  assert('Rule AI age', isAdultOnDate(expected.birthDate, '2026-10-07'), `B014 ${p.id} must be an adult on 2026-10-07`);
}

const b014BaselinePeople = ALL_PEOPLE.filter((p) => !B014_NEW_IDS.has(p.id) && !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id)).sort((a, b) => a.id.localeCompare(b.id));
assert('Rule AI baseline', b014BaselinePeople.length === 844, `B014 must preserve all 844 baseline people, found ${b014BaselinePeople.length}`);
assert('Rule AI baseline', stableSha256(b014BaselinePeople.map(projectPersonBeforeBv017)) === '007bfa829d8fed84bf07d1dd9f555975221c37352b131200afdfe42f2bb614b0', 'All 844 origin/main people must remain deep-equal to the B014 baseline after the independently verified BV-017 correction projection');
assert('Rule AI baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All 4 history events must remain deep-equal to the B014 baseline');
const b014SnapshotPeople = ALL_PEOPLE.filter((p) => !B015_B016_NEW_IDS.has(p.id) && !BV017_EXPANSION_NEW_IDS.has(p.id) && !BV017_JAN1_NEW_IDS.has(p.id) && !BV017_JAN2_NEW_IDS.has(p.id) && !BV017_JAN3_NEW_IDS.has(p.id) && !BV017_JAN4_NEW_IDS.has(p.id) && !BV017_JAN5_NEW_IDS.has(p.id) && !BV017_JAN6_NEW_IDS.has(p.id) && !BV017_JAN7_NEW_IDS.has(p.id) && !BV017_JAN8_NEW_IDS.has(p.id) && !BV017_JAN10_NEW_IDS.has(p.id) && !BV017_JAN9_NEW_IDS.has(p.id) && !BV017_JAN11_NEW_IDS.has(p.id) && !BV017_JAN12_NEW_IDS.has(p.id) && !BV017_JAN13_NEW_IDS.has(p.id) && !BV017_JAN14_NEW_IDS.has(p.id) && !BV017_JAN15_NEW_IDS.has(p.id) && !BV017_JAN16_NEW_IDS.has(p.id) && !BV017_JAN17_NEW_IDS.has(p.id) && !BV017_JAN18_NEW_IDS.has(p.id) && !BV017_JAN19_NEW_IDS.has(p.id) && !BV017_JAN20_NEW_IDS.has(p.id));
const b014CoveredDays = new Set(b014SnapshotPeople.map((p) => `${p.birthMonth}-${p.birthDay}`));
const b014OctoberDays = new Set(b014SnapshotPeople.filter((p) => p.birthMonth === 10).map((p) => p.birthDay));
assert('Rule AI total', b014SnapshotPeople.length === 937, `B014 expected 937 total people, found ${b014SnapshotPeople.length}`);
assert('Rule AI coverage', b014CoveredDays.size === 306, `B014 expected 306 covered calendar days, found ${b014CoveredDays.size}`);
assert('Rule AI coverage', b014OctoberDays.size === 31, `B014 must cover all 31 October days, found ${b014OctoberDays.size}`);
console.log(`B014 additions: ${B014_NEW_PEOPLE.length}; Vietnamese: ${b014Vietnamese.length}; share: ${(b014Vietnamese.length / B014_NEW_PEOPLE.length * 100).toFixed(2)}%; coverage: ${b014CoveredDays.size}/366`);


// ------------------------------------------------------------
runBv017January1BatchIntegrity(assert);
runBv017January2BatchIntegrity(assert);
runBv017January3BatchIntegrity(assert);
runBv017January4BatchIntegrity(assert);
runBv017January5BatchIntegrity(assert);
runBv017January6BatchIntegrity(assert);
runBv017January7BatchIntegrity(assert);
runBv017January8BatchIntegrity(assert);
runBv017January9BatchIntegrity(assert);
runBv017January10BatchIntegrity(assert);
runBv017January11BatchIntegrity(assert);
runBv017January12BatchIntegrity(assert);
runBv017January13BatchIntegrity(assert);
runBv017January14BatchIntegrity(assert);
runBv017January15BatchIntegrity(assert);
runBv017January16BatchIntegrity(assert);
runBv017January17BatchIntegrity(assert);
runBv017January18BatchIntegrity(assert);
runBv017January19BatchIntegrity(assert);
runBv017January20BatchIntegrity(assert);
runB015B016Integrity(assert);

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

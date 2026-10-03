import * as fs from 'fs';
import * as path from 'path';
import {
  ALL_PEOPLE,
  HISTORY_EVENTS,
  getBirthdayData,
  getPersonBySlug,
  getExactSameDatePeople,
  getZodiacSign,
} from '../src/data/birthdays';

const args = process.argv.slice(2);
const omitVerifiedAt = args.includes('--omit-verified-at') || args.includes('--omit') && args.includes('verifiedAt');
const outArg = args.find((a) => !a.startsWith('--') && a !== 'verifiedAt');

if (!outArg) {
  console.error('Usage: npx tsx scripts/snapshot-data.ts <outputPath> [--omit-verified-at]');
  process.exit(1);
}

const outputPath = path.resolve(process.cwd(), outArg);

function cleanPerson(p: any) {
  const copy = { ...p };
  if (omitVerifiedAt) {
    delete copy.verifiedAt;
  }
  return copy;
}

function cleanEvent(e: any) {
  const copy = { ...e };
  if (omitVerifiedAt) {
    delete copy.verifiedAt;
  }
  return copy;
}

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, any> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = sortObjectKeys(obj[key]);
    }
    return sorted;
  }
  return obj;
}

const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days366: any[] = [];
for (let m = 1; m <= 12; m++) {
  const maxDay = DAYS_IN_MONTH[m];
  for (let d = 1; d <= maxDay; d++) {
    const bd = getBirthdayData(m, d);
    days366.push({
      month: m,
      day: d,
      monthNameVi: bd.monthNameVi,
      zodiac: getZodiacSign(d, m),
      stats: bd.stats,
      featuredIds: bd.featured.map((p) => p.id),
      vietnameseIds: bd.vietnamese.map((p) => p.id),
      internationalIds: bd.international.map((p) => p.id),
      allIds: bd.all.map((p) => p.id),
      events: bd.events.map(cleanEvent),
    });
  }
}

const exactDateSamples = [
  { month: 2, day: 22, year: 1974 },
  { month: 2, day: 22, year: 1857 },
  { month: 2, day: 28, year: 1939 },
  { month: 8, day: 15, year: 1769 },
  { month: 12, day: 12, year: 1990 },
].map((sample) => {
  const res = getExactSameDatePeople(sample.month, sample.day, sample.year);
  return {
    ...sample,
    exactIds: res.exact.map((p) => p.id),
    sameYearOtherIds: res.sameYearOther.map((p) => p.id),
  };
});

const personBySlugSamples = ALL_PEOPLE.map((p) => {
  const found = getPersonBySlug(p.slug);
  return {
    slug: p.slug,
    foundId: found ? found.id : null,
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));

const snapshotData = {
  allPeople: ALL_PEOPLE.map(cleanPerson).sort((a: any, b: any) => a.id.localeCompare(b.id)),
  historyEvents: HISTORY_EVENTS.map(cleanEvent),
  days366,
  exactDateSamples,
  personBySlugSamples,
};

const sortedData = sortObjectKeys(snapshotData);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(sortedData, null, 2) + '\n', 'utf-8');

console.log(`Snapshot saved successfully to: ${outputPath} (${omitVerifiedAt ? 'omitted verifiedAt' : 'with verifiedAt'})`);

import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/BV017-january-2-batch.json';
import { ALL_PEOPLE } from '../src/data/birthdays';
import { PERSON_FIELD_LABELS, type PersonField } from '../src/data/types';

type Capture = {
  id: string;
  url: string;
  publisher: string;
  publisherHost: string;
  status: number;
  contentType: string;
  bytesRead: number;
  sha256: string;
  verificationMethod: string;
  excerpt: string;
  excerptSha256: string;
};

type Profile = {
  id: string;
  name: string;
  wikidataId: string;
  birthDate: string;
  lifeStatus: 'living' | 'deceased' | 'unknown';
  deathDate: string | null;
  deathDatePrecision?: 'year' | 'month' | 'day' | 'presumed-day';
  deathDateSourceIds?: readonly string[];
  dobSourceIds: readonly string[];
  statusSourceId?: string;
  careerFactIds: readonly string[];
  countryCode?: string;
  category?: string;
  occupation?: readonly string[];
  fields?: readonly PersonField[];
  fieldEvidence?: readonly { field: PersonField; careerFactIds: readonly string[]; rationale: string }[];
  wikidataCaptureId?: string;
  identityClaims?: {
    label: string;
    p31: readonly { rank: string; value: string; references: number }[];
    p569: readonly { rank: string; value: string; precision: number; calendar: string; references: number }[];
    p570: readonly { rank: string; value: string; precision: number; calendar: string; references: number }[];
    p27: readonly { rank: string; value: string }[];
    selectedCountryQid: string;
    p106: readonly { rank: string; value: string }[];
    selectedOccupationQids: readonly string[];
  };
  sourceUrls: readonly string[];
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};

type CareerFact = { id: string; profileId: string; displayText: string; sourceId: string; evidencePhrase: string };
type JanuaryEvidence = {
  schemaVersion: number;
  cycle: string;
  batch: string;
  sourceCaptures: readonly Capture[];
  legacyProfiles: readonly Profile[];
  newProfiles: readonly Profile[];
  careerFacts: readonly CareerFact[];
};

const evidence = rawEvidence as unknown as JanuaryEvidence;
const EXPECTED_MANIFEST_SHA256 = '252eccfc5c37a1a472f83a9027a951e5bdac8938daa7480f418000bc88033e57';
const GREGORIAN_QID = 'Q1985727';
export const BV017_JAN2_NEW_IDS = new Set(evidence.newProfiles.map((profile) => profile.id));
export const BV017_JAN2_REVIEWED_IDS = new Set([...evidence.legacyProfiles, ...evidence.newProfiles].map((profile) => profile.id));

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stableSerialize).join(',') + ']';
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableSerialize(record[key])).join(',') + '}';
  }
  return JSON.stringify(value) ?? 'null';
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

function hasExactDobExcerpt(capture: Capture, birthDate: string): boolean {
  const [year, month, day] = birthDate.split('-');
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(month) - 1];
  return [
    birthDate,
    `${Number(day)} ${monthName} ${year}`,
    `${monthName} ${Number(day)}, ${year}`,
    `${monthName} ${day}, ${year}`,
    `${Number(day)}. Januar ${year}`,
    `${year} ${month} ${day}`,
    `${day}.${month}.${year}`,
  ].some((dateText) => capture.excerpt.includes(dateText));
}

function hasExactDeathDateExcerpt(capture: Capture, deathDate: string): boolean {
  const [year, month, day] = deathDate.split('-');
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(month) - 1];
  return [
    deathDate,
    `${Number(day)} ${monthName} ${year}`,
    `${monthName} ${Number(day)}, ${year}`,
    `${monthName} ${day}, ${year}`,
    `${year} ${month} ${day}`,
    `${day}.${month}.${year}`,
  ].some((dateText) => capture.excerpt.includes(dateText));
}

export function runBv017January2BatchIntegrity(
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  console.log('Checking Rule AO: evidence-backed BV-017 January 2 review and expansion batch...');
  const stableHash = createHash('sha256').update(stableSerialize(evidence)).digest('hex');
  assert('Rule AO manifest', stableHash === EXPECTED_MANIFEST_SHA256, 'January 2 captures, profile decisions, corrections, and Wikidata extracts must match the pinned review hash');
  assert('Rule AO scope', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017' && evidence.batch === '2026-01-02', 'January 2 batch must identify the active BV-017 cycle and exact calendar date');
  assert('Rule AO scope', evidence.legacyProfiles.length === 3 && evidence.newProfiles.length === 2 && evidence.careerFacts.length === 10, 'January 2 batch must review three existing and add two profiles with two facts each');

  const capturesById = new Map(evidence.sourceCaptures.map((capture) => [capture.id, capture]));
  assert('Rule AO captures', capturesById.size === evidence.sourceCaptures.length && evidence.sourceCaptures.length === 15, 'All fifteen source capture IDs must be unique and retained');
  for (const capture of evidence.sourceCaptures) {
    let validUrl = false;
    try { validUrl = new URL(capture.url).protocol === 'https:'; } catch { validUrl = false; }
    assert('Rule AO captures', capture.status === 200 && capture.bytesRead > 0 && /^[a-f0-9]{64}$/.test(capture.sha256), capture.id + ' must retain a successful body capture, byte count, and SHA-256');
    assert('Rule AO captures', validUrl && hostOf(capture.url) === capture.publisherHost.toLowerCase() && capture.publisher.trim().length > 2, capture.id + ' must identify an HTTPS source and its exact publisher host');
    assert('Rule AO captures', capture.excerpt.trim().length > 20 && sha256(capture.excerpt) === capture.excerptSha256, capture.id + ' reviewed excerpt must match its pinned text hash');
    assert('Rule AO captures', capture.verificationMethod.startsWith('direct-http'), capture.id + ' must identify a direct HTTP capture');
  }

  const factsById = new Map(evidence.careerFacts.map((fact) => [fact.id, fact]));
  const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const profileRows = [...evidence.legacyProfiles, ...evidence.newProfiles];
  const profileIds = new Set(profileRows.map((profile) => profile.id));
  assert('Rule AO identity', profileIds.size === profileRows.length, 'Reviewed January 2 profile IDs must be unique');

  for (const profile of profileRows) {
    const person = peopleById.get(profile.id);
    assert('Rule AO identity', Boolean(person), profile.id + ' must exist in the local people dataset');
    if (!person) continue;
    assert('Rule AO identity', person.name === profile.name && person.wikidataId === profile.wikidataId && person.birthDate === profile.birthDate, profile.id + ' name, Wikidata identity, and exact DOB must match reviewed evidence');
    assert('Rule AO date', person.birthMonth === 1 && person.birthDay === 2 && profile.birthDate.endsWith('-01-02'), profile.id + ' must belong to January 2');
    assert('Rule AO status', (person.lifeStatus ?? 'unknown') === profile.lifeStatus && (person.deathDate ?? null) === profile.deathDate, profile.id + ' local status and death date must match the reviewed decision');

    const dobSources = profile.dobSourceIds.map((id) => capturesById.get(id)).filter((capture): capture is Capture => Boolean(capture));
    assert('Rule AO DOB', dobSources.length === 2 && new Set(dobSources.map((source) => source.publisherHost)).size === 2, profile.id + ' must have two independent retained DOB source hosts');
    for (const source of dobSources) {
      assert('Rule AO DOB', hasExactDobExcerpt(source, profile.birthDate), profile.id + ' DOB capture ' + source.id + ' must state the exact day, month, and year');
      assert('Rule AO sources', profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url) === true, profile.id + ' DOB sources must remain on the profile and in its evidence row');
    }

    if (profile.lifeStatus === 'deceased') {
      assert('Rule AO status', Boolean(profile.deathDate && profile.deathDatePrecision === 'day' && (profile.deathDateSourceIds || []).length > 0), profile.id + ' exact death date requires a dedicated captured source');
      for (const id of profile.deathDateSourceIds || []) {
        const source = capturesById.get(id);
        assert('Rule AO status', Boolean(source && profile.deathDate && hasExactDeathDateExcerpt(source, profile.deathDate) && profile.sourceUrls.includes(source.url) && person.deathDateSourceUrls?.includes(source.url)), profile.id + ' exact death date must appear in a captured source retained on the profile');
      }
    } else {
      assert('Rule AO status', profile.deathDate === null && person.deathDate === undefined, profile.id + ' without a sourced death date must not be assigned one');
    }

    const profileFacts = profile.careerFactIds.map((id) => factsById.get(id)).filter((fact): fact is CareerFact => Boolean(fact));
    assert('Rule AO career facts', profileFacts.length === 2 && profileFacts.every((fact) => fact.profileId === profile.id), profile.id + ' must map exactly two direct career facts to its identity');
    for (const fact of profileFacts) {
      const source = capturesById.get(fact.sourceId);
      assert('Rule AO career facts', Boolean(source && source.status === 200 && source.excerpt.includes(fact.evidencePhrase)), fact.id + ' evidence phrase must appear in its captured publisher excerpt');
      assert('Rule AO career facts', person.highlights?.includes(fact.displayText) === true && fact.displayText.trim().length >= 35, fact.id + ' displayed highlight must match the source-supported fact');
      assert('Rule AO career facts', Boolean(source && profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url)), fact.id + ' source URL must remain on the local profile');
    }

    if (profile.before && profile.after) {
      const current = person as unknown as Record<string, unknown>;
      for (const [field, expected] of Object.entries(profile.after)) {
        assert('Rule AO corrections', stableSerialize(current[field]) === stableSerialize(expected), profile.id + ' current ' + field + ' must match the reviewed correction');
      }
    }

    if (profile.countryCode) {
      assert('Rule AO new profile fields', person.countryCode === profile.countryCode && person.category === profile.category && stableSerialize(person.occupation) === stableSerialize(profile.occupation), profile.id + ' country, category, and occupation must match the evidence row');
      assert('Rule AO fields', stableSerialize(person.fields) === stableSerialize(profile.fields) && (profile.fields || []).every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' field tags must be valid and match the evidence allowlist');
      assert('Rule AO content', person.image === '/people/placeholder.svg' && Boolean(person.biography?.trim() && person.shortDescription?.trim()), profile.id + ' must retain a substantive profile and neutral image placeholder');
      const fieldEvidence = profile.fieldEvidence || [];
      assert('Rule AO fields', fieldEvidence.length === (profile.fields || []).length && fieldEvidence.every((row) => profile.fields?.includes(row.field) && row.rationale.trim().length > 30 && row.careerFactIds.length > 0 && row.careerFactIds.every((id) => profile.careerFactIds.includes(id))), profile.id + ' each multi-field tag must cite related facts and a rationale');

      const identity = profile.identityClaims;
      const wdCapture = capturesById.get(profile.wikidataCaptureId || '');
      const wdPageUrl = 'https://www.wikidata.org/wiki/' + profile.wikidataId;
      assert('Rule AO Wikidata', Boolean(identity && wdCapture && wdCapture.url.endsWith('/' + profile.wikidataId + '.json') && profile.sourceUrls.includes(wdPageUrl) && person.sourceUrls?.includes(wdPageUrl)), profile.id + ' must retain a direct Wikidata entity capture and profile page source');
      if (identity) {
        assert('Rule AO Wikidata', identity.label === profile.name && identity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), profile.id + ' active P31 must identify the matching human');
        assert('Rule AO Wikidata', identity.p569.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P569 must state the exact Gregorian birth date');
        if (profile.deathDate) assert('Rule AO Wikidata', identity.p570.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.deathDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must agree with the independently sourced exact death date');
        assert('Rule AO Wikidata', identity.p27.some((claim) => claim.rank !== 'deprecated' && claim.value === identity.selectedCountryQid) && identity.p106.some((claim) => claim.rank !== 'deprecated' && identity.selectedOccupationQids.includes(claim.value)), profile.id + ' country and occupation must match active P27/P106 claims');
      }
    }
  }

  for (const fact of evidence.careerFacts) {
    assert('Rule AO career facts', profileIds.has(fact.profileId), fact.id + ' must belong to a reviewed January 2 profile');
    assert('Rule AO career facts', fact.evidencePhrase.length > 15 && fact.displayText.length > 30, fact.id + ' must include a specific source phrase and nontrivial displayed claim');
  }
  const jan2People = ALL_PEOPLE.filter((person) => person.birthMonth === 1 && person.birthDay === 2);
  assert('Rule AO daily coverage', jan2People.length === 5 && jan2People.every((person) => profileIds.has(person.id)), 'January 2 must contain exactly five profiles admitted by this reviewed evidence batch');
  assert('Rule AO new IDs', BV017_JAN2_NEW_IDS.size === 2 && evidence.newProfiles.every((profile) => BV017_JAN2_NEW_IDS.has(profile.id)), 'The new-profile exclusion set must contain exactly the two January 2 additions');
}

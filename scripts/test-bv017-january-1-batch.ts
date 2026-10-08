import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/BV017-january-1-batch.json';
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

type ProfileEvidence = {
  id: string;
  name: string;
  wikidataId: string;
  birthDate: string;
  countryCode?: string;
  category?: string;
  occupation?: readonly string[];
  fields?: readonly PersonField[];
  fieldEvidence?: readonly { field: PersonField; careerFactIds: readonly string[]; rationale: string }[];
  lifeStatus: 'living' | 'deceased' | 'unknown';
  deathDate: string | null;
  deathDatePrecision?: 'year' | 'month' | 'day' | 'presumed-day';
  deathDateSourceIds?: readonly string[];
  dobSourceIds: readonly string[];
  statusSourceId: string;
  careerFactIds: readonly string[];
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
  sourceUrls?: readonly string[];
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};

type CareerFact = {
  id: string;
  profileId: string;
  displayText: string;
  sourceId: string;
  evidencePhrase: string;
};

type JanuaryEvidence = {
  schemaVersion: number;
  cycle: string;
  batch: string;
  capturedAt: string;
  sourceCaptures: readonly Capture[];
  legacyProfiles: readonly ProfileEvidence[];
  newProfiles: readonly ProfileEvidence[];
  careerFacts: readonly CareerFact[];
};

const evidence = rawEvidence as unknown as JanuaryEvidence;
const EXPECTED_MANIFEST_SHA256 = '7911b6edf5521971a24f5593198838e9e5bc6e8b23ae3f70858b6a275d519b83';
const GREGORIAN_QID = 'Q1985727';

export const BV017_JAN1_NEW_IDS = new Set(evidence.newProfiles.map((profile) => profile.id));
export const BV017_JAN1_REVIEWED_IDS = new Set([...evidence.legacyProfiles, ...evidence.newProfiles].map((profile) => profile.id));

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stableSerialize).join(',') + ']';
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableSerialize(record[key])).join(',') + '}';
  }
  return JSON.stringify(value) ?? 'null';
}

function stableSha256(value: unknown): string {
  return createHash('sha256').update(stableSerialize(value)).digest('hex');
}

function textSha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

function hasExactDobExcerpt(capture: Capture, birthDate: string): boolean {
  const year = birthDate.slice(0, 4);
  return [
    birthDate,
    `January 1, ${year}`,
    `1 January ${year}`,
    `Jan. 1, ${year}`,
    `01-01-${year}`,
    `1.1.${year}`,
  ].some((dateText) => capture.excerpt.includes(dateText));
}

function hasExactDeathDateExcerpt(capture: Capture, deathDate: string): boolean {
  const [year, month, day] = deathDate.split('-');
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(month) - 1];
  return [deathDate, `${day} ${monthName} ${year}`, `${Number(day)} ${monthName} ${year}`, `${monthName} ${Number(day)}, ${year}`]
    .some((dateText) => capture.excerpt.includes(dateText));
}

function sourceUrlsFor(profile: ProfileEvidence): readonly string[] {
  return profile.sourceUrls || (profile.after?.sourceUrls as readonly string[] | undefined) || [];
}

export function runBv017January1BatchIntegrity(
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  console.log('Checking Rule AN: evidence-backed BV-017 January 1 review and expansion batch...');

  assert('Rule AN schema', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017' && evidence.batch === '2026-01-01', 'January 1 evidence must identify schema 1 and the active BV-017 batch');
  assert('Rule AN manifest hash', stableSha256(evidence) === EXPECTED_MANIFEST_SHA256, 'January 1 source captures, decisions, corrections, facts, and Wikidata extracts must match the pinned review hash');
  assert('Rule AN scope', evidence.legacyProfiles.length === 3 && evidence.newProfiles.length === 2, 'January 1 batch must review the three existing profiles and add exactly two profiles');

  const capturesById = new Map(evidence.sourceCaptures.map((capture) => [capture.id, capture]));
  assert('Rule AN captures', capturesById.size === evidence.sourceCaptures.length && evidence.sourceCaptures.length === 14, 'All fourteen source capture IDs must be unique and retained');
  for (const capture of evidence.sourceCaptures) {
    assert('Rule AN captures', capture.status === 200 && capture.bytesRead > 0 && /^[a-f0-9]{64}$/.test(capture.sha256), capture.id + ' must retain a successful body capture with byte count and SHA-256');
    assert('Rule AN captures', /^https:$/.test(new URL(capture.url).protocol) && hostOf(capture.url) === capture.publisherHost.toLowerCase() && capture.publisher.trim().length > 2, capture.id + ' must use HTTPS and identify the exact publisher host');
    assert('Rule AN captures', capture.excerpt.trim().length > 20 && /^[a-f0-9]{64}$/.test(capture.excerptSha256) && textSha256(capture.excerpt) === capture.excerptSha256, capture.id + ' excerpt must be pinned to its text hash');
    assert('Rule AN captures', capture.verificationMethod.startsWith('direct-http'), capture.id + ' must identify a direct source capture method');
  }

  const factById = new Map(evidence.careerFacts.map((fact) => [fact.id, fact]));
  assert('Rule AN career facts', factById.size === evidence.careerFacts.length && evidence.careerFacts.length === 10, 'Each reviewed or added January 1 profile must have two unique retained career facts');
  const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const profileRows = [...evidence.legacyProfiles, ...evidence.newProfiles];
  const profileIds = new Set(profileRows.map((profile) => profile.id));
  assert('Rule AN identity', profileIds.size === profileRows.length, 'Legacy and new January 1 profile IDs must be unique');

  for (const profile of profileRows) {
    const person = peopleById.get(profile.id);
    assert('Rule AN identity', Boolean(person), profile.id + ' must exist in the local people dataset');
    if (!person) continue;
    assert('Rule AN identity', person.name === profile.name && person.wikidataId === profile.wikidataId && person.birthDate === profile.birthDate, profile.id + ' name, Wikidata identity, and exact DOB must match the reviewed evidence');
    assert('Rule AN calendar date', profile.birthDate.endsWith('-01-01') && person.birthMonth === 1 && person.birthDay === 1, profile.id + ' must belong to January 1');
    assert('Rule AN status', person.lifeStatus === profile.lifeStatus && (person.deathDate ?? null) === profile.deathDate, profile.id + ' local status and death date must match the reviewed decision');

    const dobSources = profile.dobSourceIds.map((sourceId) => capturesById.get(sourceId)).filter((source): source is Capture => Boolean(source));
    assert('Rule AN DOB', dobSources.length === 2 && new Set(dobSources.map((source) => source.publisherHost.toLowerCase())).size === 2, profile.id + ' must have two independent retained DOB source hosts');
    for (const source of dobSources) {
      assert('Rule AN DOB', hasExactDobExcerpt(source, profile.birthDate), profile.id + ' DOB source ' + source.id + ' must state the exact day, month, and year');
      assert('Rule AN sources', person.sourceUrls?.includes(source.url) === true && sourceUrlsFor(profile).includes(source.url), profile.id + ' DOB source URLs must remain on the profile and in the evidence row');
    }

    const statusSource = capturesById.get(profile.statusSourceId);
    assert('Rule AN status', Boolean(statusSource && sourceUrlsFor(profile).includes(statusSource.url) && person.sourceUrls?.includes(statusSource.url)), profile.id + ' status review must use a retained source');
    if (profile.lifeStatus === 'deceased') {
      assert('Rule AN status', Boolean(profile.deathDate && profile.deathDatePrecision === 'day' && (profile.deathDateSourceIds || []).length > 0), profile.id + ' exact death dates require day precision and a dedicated death source');
      for (const sourceId of profile.deathDateSourceIds || []) {
        const source = capturesById.get(sourceId);
        assert('Rule AN status', Boolean(source && profile.deathDate && hasExactDeathDateExcerpt(source, profile.deathDate) && sourceUrlsFor(profile).includes(source.url) && person.deathDateSourceUrls?.includes(source.url)), profile.id + ' exact death date must appear in a captured source retained on the local profile');
      }
    }

    const facts = profile.careerFactIds.map((factId) => factById.get(factId)).filter((fact): fact is CareerFact => Boolean(fact));
    assert('Rule AN career facts', facts.length === 2 && facts.every((fact) => fact.profileId === profile.id), profile.id + ' must map exactly two direct career facts to its own identity');
    for (const fact of facts) {
      const source = capturesById.get(fact.sourceId);
      assert('Rule AN career facts', Boolean(source && source.status === 200 && source.excerpt.includes(fact.evidencePhrase)), fact.id + ' evidence phrase must appear in its captured publisher excerpt');
      assert('Rule AN career facts', person.highlights?.includes(fact.displayText) === true && fact.displayText.trim().length >= 35, fact.id + ' displayed highlight must match the directly captured career fact');
      assert('Rule AN career facts', person.sourceUrls?.includes(source?.url || '') === true && sourceUrlsFor(profile).includes(source?.url || ''), fact.id + ' source URL must remain on the profile');
    }

    if (profile.before && profile.after) {
      const current = person as unknown as Record<string, unknown>;
      for (const [field, expectedValue] of Object.entries(profile.after)) {
        assert('Rule AN legacy corrections', stableSerialize(current[field]) === stableSerialize(expectedValue), profile.id + ' current ' + field + ' must match the reviewed correction');
      }
    }

    if (profile.countryCode) {
      assert('Rule AN new profile fields', person.countryCode === profile.countryCode && person.category === profile.category && stableSerialize(person.occupation) === stableSerialize(profile.occupation), profile.id + ' country, legacy category, and occupation must match the evidence allowlist');
      assert('Rule AN new profile fields', stableSerialize(person.fields) === stableSerialize(profile.fields) && (profile.fields || []).every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' multi-field tags must be valid and match the allowlist');
      assert('Rule AN new profile content', person.image === '/people/placeholder.svg' && Boolean(person.biography?.trim() && person.shortDescription?.trim()), profile.id + ' must retain a substantive sourced profile and neutral image placeholder');

      const fieldEvidence = profile.fieldEvidence || [];
      assert('Rule AN fields', fieldEvidence.length === (profile.fields || []).length && fieldEvidence.every((row) => profile.fields?.includes(row.field) && row.rationale.trim().length > 30 && row.careerFactIds.length > 0 && row.careerFactIds.every((id) => profile.careerFactIds.includes(id))), profile.id + ' every field tag must cite its career facts and rationale');

      const identity = profile.identityClaims;
      const claimsSource = capturesById.get(profile.wikidataCaptureId || '');
      const wikidataPageUrl = 'https://www.wikidata.org/wiki/' + profile.wikidataId;
      assert('Rule AN Wikidata', Boolean(identity && claimsSource && claimsSource.url.endsWith('/' + profile.wikidataId + '.json') && sourceUrlsFor(profile).includes(wikidataPageUrl) && person.sourceUrls?.includes(wikidataPageUrl)), profile.id + ' must retain the audited Wikidata entity capture and page source');
      if (identity) {
        assert('Rule AN Wikidata', identity.label === profile.name && identity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), profile.id + ' P31 must identify a human with the matching entity label');
        assert('Rule AN Wikidata', identity.p569.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P569 must contain the exact Gregorian DOB');
        assert('Rule AN Wikidata', identity.p570.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + (profile.deathDate || '') + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must agree with the independently sourced exact death date');
        assert('Rule AN Wikidata', identity.p27.some((claim) => claim.rank !== 'deprecated' && claim.value === identity.selectedCountryQid) && identity.p106.some((claim) => claim.rank !== 'deprecated' && identity.selectedOccupationQids.includes(claim.value)), profile.id + ' selected country and occupation must match active P27/P106 claims');
      }
    }
  }

  for (const fact of evidence.careerFacts) {
    assert('Rule AN career facts', profileIds.has(fact.profileId), fact.id + ' must belong to a reviewed January 1 profile');
    assert('Rule AN career facts', fact.evidencePhrase.length > 15 && fact.displayText.length > 30, fact.id + ' must state a concrete source phrase and nontrivial displayed claim');
  }

  const jan1People = ALL_PEOPLE.filter((person) => person.birthMonth === 1 && person.birthDay === 1);
  assert('Rule AN daily coverage', jan1People.length === 5 && jan1People.every((person) => profileIds.has(person.id)), 'January 1 must contain exactly five profiles, each admitted by this reviewed evidence batch');
  assert('Rule AN new IDs', BV017_JAN1_NEW_IDS.size === 2 && evidence.newProfiles.every((profile) => BV017_JAN1_NEW_IDS.has(profile.id)), 'The new-profile exclusion set must contain exactly the two January 1 additions');
}

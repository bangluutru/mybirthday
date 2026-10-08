import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/BV017-january-14-batch.json';
import { ALL_PEOPLE } from '../src/data/birthdays';
import { PERSON_FIELD_LABELS, type PersonField } from '../src/data/types';

type Capture = {
  id: string;
  url: string;
  publisher: string;
  publisherHost: string;
  status: number;
  bytesRead: number;
  sha256: string;
  verificationMethod: string;
  excerpt: string;
  excerptSha256: string;
};
type Claim = { rank: string; value: string; precision?: number; calendar?: string; references?: number };
type Profile = {
  id: string;
  name: string;
  wikidataId: string;
  birthDate: string;
  lifeStatus: 'living' | 'deceased' | 'unknown';
  deathDate: string | null;
  deathDatePrecision?: 'day';
  deathDateSourceIds?: readonly string[];
  dobSourceIds: readonly string[];
  statusSourceId?: string;
  careerFactIds: readonly string[];
  countryCode?: string;
  category?: string;
  occupation?: readonly string[];
  birthplace?: string;
  wikidataLabel?: string;
  birthplaceEvidencePhrase?: string;
  fields?: readonly PersonField[];
  fieldEvidence?: readonly { field: PersonField; careerFactIds: readonly string[]; rationale: string }[];
  wikidataCaptureId?: string;
  identityClaims?: {
    label: string;
    p31: readonly Claim[];
    p569: readonly Claim[];
    p570: readonly Claim[];
    p27: readonly Claim[];
    selectedCountryQid: string;
    p106: readonly Claim[];
    selectedOccupationQids: readonly string[];
  };
  sourceUrls: readonly string[];
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};
type Fact = { id: string; profileId: string; displayText: string; sourceId: string; evidencePhrase: string };
type Evidence = {
  schemaVersion: number;
  cycle: string;
  batch: string;
  sourceCaptures: readonly Capture[];
  legacyProfiles: readonly Profile[];
  newProfiles: readonly Profile[];
  careerFacts: readonly Fact[];
  wikidataReview: { conflicts: readonly { profileId: string; property: string }[] };
};

const evidence = rawEvidence as unknown as Evidence;
const EXPECTED_MANIFEST_SHA256 = '4d2f90dcf92d657596ca32c1df733b52ed94f2498de6e207f9cc329c11b8622c';
const GREGORIAN_QID = 'Q1985727';
export const BV017_JAN14_NEW_IDS = new Set(evidence.newProfiles.map((profile) => profile.id));
export const BV017_JAN14_REVIEWED_IDS = new Set([...evidence.legacyProfiles, ...evidence.newProfiles].map((profile) => profile.id));

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

function matchesExactDate(text: string, date: string): boolean {
  const [year, month, day] = date.split('-');
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthNumber - 1];
  const germanMonth = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][monthNumber - 1];
  const germanShortMonth = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'][monthNumber - 1];
  const lower = text.toLocaleLowerCase();
  return [date, `${dayNumber} ${monthName} ${year}`, `${monthName} ${dayNumber}, ${year}`, `${dayNumber}. ${germanMonth} ${year}`, `${dayNumber}. ${germanShortMonth} ${year}`, `${dayNumber} tháng ${monthNumber} năm ${year}`]
    .some((value) => lower.includes(value.toLocaleLowerCase()))
    || new RegExp('(?:^|\\D)0?' + dayNumber + '\\s*[./-]\\s*0?' + monthNumber + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(text)
    || new RegExp(year + '年' + monthNumber + '月' + dayNumber + '日').test(text)
    || new RegExp('(?:大正|昭和|平成|令和)\\s*\\d+年(?:（' + year + '）|\\(' + year + '年?\\))?\\s*' + monthNumber + '月' + dayNumber + '日').test(text)
    || new RegExp('(?:大正|昭和|平成|令和)\\s*\\d+年\\s*' + monthNumber + '月' + dayNumber + '日\\s*[（(]' + year + '年?[）)]').test(text);
}

export function runBv017January14BatchIntegrity(
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  console.log('Checking Rule BA: evidence-backed BV-017 January 14 review and expansion batch...');
  assert('Rule BA manifest', sha256(stableSerialize(evidence)) === EXPECTED_MANIFEST_SHA256, 'January 14 captures and reviewed decisions must match the pinned evidence hash');
  assert('Rule BA scope', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017' && evidence.batch === '2026-01-14', 'Batch must identify the active cycle and January 14');
  assert('Rule BA scope', evidence.legacyProfiles.length === 4 && evidence.newProfiles.length === 1 && evidence.careerFacts.length === 10, 'Batch must review four existing people and add one with two career facts each');

  const captures = new Map(evidence.sourceCaptures.map((capture) => [capture.id, capture]));
  assert('Rule BA captures', captures.size === 25 && captures.size === evidence.sourceCaptures.length, 'All 25 capture IDs must be unique');
  for (const capture of evidence.sourceCaptures) {
    let validUrl = false;
    try { validUrl = new URL(capture.url).protocol === 'https:'; } catch { validUrl = false; }
    assert('Rule BA captures', capture.status === 200 && capture.bytesRead > 0 && /^[a-f0-9]{64}$/.test(capture.sha256), capture.id + ' must retain a successful body capture and SHA-256');
    assert('Rule BA captures', validUrl && new URL(capture.url).hostname.toLowerCase() === capture.publisherHost.toLowerCase() && capture.publisher.trim().length > 2, capture.id + ' must identify the exact HTTPS publisher host');
    assert('Rule BA captures', capture.excerpt.trim().length > 20 && sha256(capture.excerpt) === capture.excerptSha256, capture.id + ' reviewed excerpt must match its hash');
    assert('Rule BA captures', capture.verificationMethod.startsWith('direct-http'), capture.id + ' must identify a direct HTTP capture');
  }

  const rows = [...evidence.legacyProfiles, ...evidence.newProfiles];
  const expectedIds = ['albert-schweitzer', 'yukio-mishima', 'suboi', 'gottfried-silbermann', 'morihiro-hosokawa'].sort();
  assert('Rule BA identity', stableSerialize(rows.map((profile) => profile.id).sort()) === stableSerialize(expectedIds), 'Evidence must bind exactly the five reviewed January 14 profiles');
  const people = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const facts = new Map(evidence.careerFacts.map((fact) => [fact.id, fact]));

  for (const profile of rows) {
    const person = people.get(profile.id);
    assert('Rule BA identity', Boolean(person), profile.id + ' must exist in the local dataset');
    if (!person) continue;
    assert('Rule BA identity', person.name === profile.name && person.wikidataId === profile.wikidataId && person.birthDate === profile.birthDate, profile.id + ' name, QID, and DOB must match reviewed evidence');
    assert('Rule BA date', person.birthMonth === 1 && person.birthDay === 14 && profile.birthDate.endsWith('-01-14'), profile.id + ' must belong to January 14');
    assert('Rule BA status', (person.lifeStatus ?? 'unknown') === profile.lifeStatus && (person.deathDate ?? null) === profile.deathDate, profile.id + ' local status and death date must match the reviewed decision');

    const dobSources = profile.dobSourceIds.map((id) => captures.get(id)).filter((capture): capture is Capture => Boolean(capture));
    assert('Rule BA DOB', dobSources.length === 2 && new Set(dobSources.map((source) => source.publisherHost)).size === 2, profile.id + ' must have two independent DOB publisher hosts');
    for (const source of dobSources) {
      assert('Rule BA DOB', matchesExactDate(source.excerpt, profile.birthDate), profile.id + ' DOB capture ' + source.id + ' must state the exact date');
      assert('Rule BA sources', profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url) === true, profile.id + ' DOB source must remain on the local profile');
    }

    if (profile.lifeStatus === 'deceased') {
      assert('Rule BA status', Boolean(profile.deathDate && profile.deathDatePrecision === 'day' && profile.deathDateSourceIds?.length), profile.id + ' exact death date requires a dedicated source');
      for (const id of profile.deathDateSourceIds || []) {
        const source = captures.get(id);
        assert('Rule BA status', Boolean(source && profile.deathDate && matchesExactDate(source.excerpt, profile.deathDate) && profile.sourceUrls.includes(source.url) && person.deathDateSourceUrls?.includes(source.url)), profile.id + ' exact death date must appear in a retained capture');
      }
      assert('Rule BA status', Boolean(profile.statusSourceId && profile.deathDateSourceIds?.includes(profile.statusSourceId)), profile.id + ' deceased status must bind to its direct death-date source');
    } else {
      assert('Rule BA status', profile.deathDate === null && person.deathDate === undefined, profile.id + ' must remain without an unsourced death date');
    }

    const profileFacts = profile.careerFactIds.map((id) => facts.get(id)).filter((fact): fact is Fact => Boolean(fact));
    assert('Rule BA career facts', profileFacts.length === 2 && profileFacts.every((fact) => fact.profileId === profile.id), profile.id + ' must have two mapped career facts');
    for (const fact of profileFacts) {
      const source = captures.get(fact.sourceId);
      assert('Rule BA career facts', Boolean(source?.excerpt.includes(fact.evidencePhrase)), fact.id + ' evidence phrase must appear in a captured publisher excerpt');
      assert('Rule BA career facts', person.highlights?.includes(fact.displayText) === true && fact.displayText.trim().length >= 35, fact.id + ' displayed highlight must match the reviewed claim');
      assert('Rule BA career facts', Boolean(source && profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url)), fact.id + ' source URL must remain on the profile');
    }

    const fieldEvidence = profile.fieldEvidence || [];
    assert('Rule BA fields', stableSerialize(person.fields || []) === stableSerialize(profile.fields || []) && fieldEvidence.length === (profile.fields || []).length && fieldEvidence.every((row) => profile.fields?.includes(row.field) && row.rationale.trim().length > 30 && row.careerFactIds.length > 0 && row.careerFactIds.every((id) => profile.careerFactIds.includes(id))), profile.id + ' every field tag must cite related reviewed career facts');
    assert('Rule BA fields', (profile.fields || []).every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' must use valid field taxonomy values');

    if (profile.after) {
      const current = person as unknown as Record<string, unknown>;
      for (const [field, expected] of Object.entries(profile.after)) {
        const actual = current[field] === undefined ? null : current[field];
        assert('Rule BA corrections', stableSerialize(actual) === stableSerialize(expected), profile.id + ' current ' + field + ' must match the reviewed correction');
      }
    }

    if (BV017_JAN14_NEW_IDS.has(profile.id)) {
      assert('Rule BA new profile', person.countryCode === profile.countryCode && person.category === profile.category && stableSerialize(person.occupation) === stableSerialize(profile.occupation), profile.id + ' country, category, and occupation must match evidence');
      const birthplaceCapture = profile.dobSourceIds.map((id) => captures.get(id)).find((source) => source?.excerpt.includes(profile.birthplaceEvidencePhrase || ''));
      assert('Rule BA new profile', Boolean(person.image === '/people/placeholder.svg' && person.birthplace === profile.birthplace && birthplaceCapture), profile.id + ' birthplace must match direct source evidence and use a neutral image placeholder');
      assert('Rule BA new profile', Boolean(person.biography?.trim() && person.shortDescription?.trim()), profile.id + ' must retain substantive profile text');
    }

    const claims = profile.identityClaims;
    const wdCapture = captures.get(profile.wikidataCaptureId || '');
    assert('Rule BA Wikidata', Boolean(claims && wdCapture && wdCapture.url.endsWith('/' + profile.wikidataId + '.json') && wdCapture.verificationMethod.startsWith('direct-http-json')), profile.id + ' must retain a direct Wikidata entity snapshot');
    if (claims) {
      const active = (rows: readonly Claim[]) => rows.filter((claim) => claim.rank !== 'deprecated');
      assert('Rule BA Wikidata', claims.label === (profile.wikidataLabel || profile.name) && active(claims.p31).some((claim) => claim.value === 'Q5'), profile.id + ' must have human P31 and matching entity label');
      assert('Rule BA Wikidata', active(claims.p569).some((claim) => claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' must have exact Gregorian P569');
      if (profile.deathDate) assert('Rule BA Wikidata', active(claims.p570).some((claim) => claim.value === '+' + profile.deathDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must agree with independently sourced death date');
      const dobConflicts = active(claims.p569).filter((claim) => claim.value !== '+' + profile.birthDate + 'T00:00:00Z');
      const deathConflicts = profile.deathDate ? active(claims.p570).filter((claim) => claim.value !== '+' + profile.deathDate + 'T00:00:00Z') : [];
      assert('Rule BA Wikidata', dobConflicts.length === 0 && deathConflicts.length === 0, profile.id + ' must have no unresolved active P569/P570 conflicts');
    }
  }

  assert('Rule BA Wikidata', !evidence.wikidataReview.conflicts.some((conflict) => conflict.property === 'P569' || conflict.property === 'P570'), 'January 14 must retain no unresolved active P569/P570 disagreements');
  assert('Rule BA daily coverage', ALL_PEOPLE.filter((person) => person.birthMonth === 1 && person.birthDay === 14).length === 5, 'January 14 must contain exactly five evidence-reviewed profiles');
  assert('Rule BA new IDs', BV017_JAN14_NEW_IDS.size === 1 && evidence.newProfiles.every((profile) => BV017_JAN14_NEW_IDS.has(profile.id)), 'January 14 exclusion set must contain its one addition');
}

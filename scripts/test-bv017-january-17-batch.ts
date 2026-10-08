import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/BV017-january-17-batch.json';
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
  verifiedAt?: string;
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
  reviewNotes?: string;
  birthplaceEvidencePhrase?: string;
  fields?: readonly PersonField[];
  fieldEvidence?: readonly { field: PersonField; careerFactIds: readonly string[]; rationale: string }[];
  wikidataCaptureId?: string;
  excludedSourceIds?: readonly string[];
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
  wikidataReview: { conflicts: readonly { profileId: string; property: string; claimValue: string; resolution: string; reviewNote: string; sourceIds: readonly string[] }[] };
};

const evidence = rawEvidence as unknown as Evidence;
const EXPECTED_MANIFEST_SHA256 = '8229abfaa5037ffa60dcaee9338e1c59b0a67ea850e8bc697686d7789f121b4a';
const GREGORIAN_QID = 'Q1985727';
export const BV017_JAN17_NEW_IDS = new Set(evidence.newProfiles.map((profile) => profile.id));
export const BV017_JAN17_REVIEWED_IDS = new Set([...evidence.legacyProfiles, ...evidence.newProfiles].map((profile) => profile.id));

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
  const englishShortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthNumber - 1];
  const germanMonth = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][monthNumber - 1];
  const germanShortMonth = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'][monthNumber - 1];
  const lower = text.toLocaleLowerCase();
  return [date, `${dayNumber} ${monthName} ${year}`, `${monthName} ${dayNumber}, ${year}`, `${monthName} ${dayNumber}${['th', 'st', 'nd', 'rd'][dayNumber % 10 === 1 && dayNumber !== 11 ? 1 : dayNumber % 10 === 2 && dayNumber !== 12 ? 2 : dayNumber % 10 === 3 && dayNumber !== 13 ? 3 : 0]}, ${year}`, `${dayNumber} ${englishShortMonth} ${year}`, `${dayNumber}. ${germanMonth} ${year}`, `${dayNumber}. ${germanShortMonth} ${year}`, `${dayNumber} tháng ${monthNumber} năm ${year}`]
    .some((value) => lower.includes(value.toLocaleLowerCase()))
    || new RegExp('(?:^|\\D)0?' + dayNumber + '\\s*[./-]\\s*0?' + monthNumber + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(text)
    || new RegExp('(?:^|\\D)0?' + monthNumber + '\\s*[./-]\\s*0?' + dayNumber + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(text)
    || new RegExp('(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\.?\\s+0?' + dayNumber + ',?\\s+' + year,'i').test(text)
    || new RegExp(year + '年' + monthNumber + '月' + dayNumber + '日').test(text)
    || new RegExp(year + '년\\s*0?' + monthNumber + '월\\s*0?' + dayNumber + '일').test(text)
    || new RegExp('(?:大正|昭和|平成|令和)\\s*\\d+年(?:（' + year + '）|\\(' + year + '年?\\))?\\s*' + monthNumber + '月' + dayNumber + '日').test(text)
    || new RegExp('(?:大正|昭和|平成|令和)\\s*\\d+年\\s*' + monthNumber + '月' + dayNumber + '日\\s*[（(]' + year + '年?[）)]').test(text);
}

export function runBv017January17BatchIntegrity(
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  console.log('Checking Rule BD: evidence-backed BV-017 January 17 review and expansion batch...');
  assert('Rule BD manifest', sha256(stableSerialize(evidence)) === EXPECTED_MANIFEST_SHA256, 'January 17 captures and reviewed decisions must match the pinned evidence hash');
  assert('Rule BD scope', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017' && evidence.batch === '2026-01-17', 'Batch must identify the active cycle and January 17');
  assert('Rule BD scope', evidence.legacyProfiles.length === 4 && evidence.newProfiles.length === 1 && evidence.careerFacts.length === 11, 'Batch must review four existing people, add one new person, and map 11 career facts');

  const captures = new Map(evidence.sourceCaptures.map((capture) => [capture.id, capture]));
  assert('Rule BD captures', captures.size === 21 && captures.size === evidence.sourceCaptures.length, 'All 21 capture IDs must be unique');
  for (const capture of evidence.sourceCaptures) {
    let validUrl = false;
    try { validUrl = new URL(capture.url).protocol === 'https:'; } catch { validUrl = false; }
    assert('Rule BD captures', capture.status === 200 && capture.bytesRead > 0 && /^[a-f0-9]{64}$/.test(capture.sha256), capture.id + ' must retain a successful body capture and SHA-256');
    assert('Rule BD captures', validUrl && new URL(capture.url).hostname.toLowerCase() === capture.publisherHost.toLowerCase() && capture.publisher.trim().length > 2, capture.id + ' must identify the exact HTTPS publisher host');
    assert('Rule BD captures', capture.excerpt.trim().length > 20 && sha256(capture.excerpt) === capture.excerptSha256, capture.id + ' reviewed excerpt must match its hash');
    assert('Rule BD captures', capture.verificationMethod.startsWith('direct-http'), capture.id + ' must identify a direct HTTP capture');
  }

  const rows = [...evidence.legacyProfiles, ...evidence.newProfiles];
  const expectedIds = ['benjamin-franklin', 'muhammad-ali', 'michelle-obama', 'chung-thi-thanh-lan', 'anne-bronte'].sort();
  assert('Rule BD identity', stableSerialize(rows.map((profile) => profile.id).sort()) === stableSerialize(expectedIds), 'Evidence must bind exactly the five reviewed January 17 profiles');
  const people = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const facts = new Map(evidence.careerFacts.map((fact) => [fact.id, fact]));

  for (const profile of rows) {
    const person = people.get(profile.id);
    assert('Rule BD identity', Boolean(person), profile.id + ' must exist in the local dataset');
    if (!person) continue;
    assert('Rule BD identity', person.name === profile.name && person.wikidataId === profile.wikidataId && person.birthDate === profile.birthDate, profile.id + ' name, QID, and DOB must match reviewed evidence');
    if (profile.verifiedAt) assert('Rule BD identity', person.verifiedAt === profile.verifiedAt, profile.id + ' verifiedAt must match the evidence capture date in UTC');
    assert('Rule BD date', person.birthMonth === 1 && person.birthDay === 17 && profile.birthDate.endsWith('-01-17'), profile.id + ' must belong to January 17');
    assert('Rule BD status', (person.lifeStatus ?? 'unknown') === profile.lifeStatus && (person.deathDate ?? null) === profile.deathDate, profile.id + ' local status and death date must match the reviewed decision');

    const dobSources = profile.dobSourceIds.map((id) => captures.get(id)).filter((capture): capture is Capture => Boolean(capture));
    const minimumDobSources = profile.id === 'anne-bronte' ? 2 : profile.id === 'chung-thi-thanh-lan' ? 1 : 2;
    assert('Rule BD DOB', dobSources.length >= minimumDobSources && new Set(dobSources.map((source) => source.publisherHost)).size === dobSources.length, profile.id + ' must meet the reviewed minimum DOB evidence count on independent publisher hosts');
    for (const source of dobSources) {
      assert('Rule BD DOB', matchesExactDate(source.excerpt, profile.birthDate), profile.id + ' DOB capture ' + source.id + ' must state the exact date');
      assert('Rule BD sources', profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url) === true, profile.id + ' DOB source must remain on the local profile');
    }
    for (const sourceId of profile.excludedSourceIds || []) {
      const excludedSource = captures.get(sourceId);
      assert('Rule BD sources', Boolean(excludedSource && !profile.sourceUrls.includes(excludedSource.url) && profile.reviewNotes && profile.reviewNotes.trim().length > 40), profile.id + ' excluded source must be captured, removed from the active profile, and explained in review notes');
    }

    if (profile.deathDate) {
      assert('Rule BD status', profile.lifeStatus === 'deceased' && profile.deathDatePrecision === 'day' && Boolean(profile.deathDateSourceIds?.length), profile.id + ' exact death date requires a dedicated source');
      for (const id of profile.deathDateSourceIds || []) {
        const source = captures.get(id);
        assert('Rule BD status', Boolean(source && matchesExactDate(source.excerpt, profile.deathDate) && profile.sourceUrls.includes(source.url) && person.deathDateSourceUrls?.includes(source.url)), profile.id + ' exact death date must appear in a retained capture');
      }
      assert('Rule BD status', Boolean(profile.statusSourceId && profile.deathDateSourceIds?.includes(profile.statusSourceId)), profile.id + ' exact deceased status must bind to a direct death-date source');
    } else if (profile.lifeStatus === 'deceased') {
      const source = captures.get(profile.statusSourceId || '');
      assert('Rule BD status', Boolean(source && profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url) && /assassinated/i.test(source.excerpt)), profile.id + ' deceased status without an exact date requires direct evidence of death');
      assert('Rule BD status', profile.deathDate === null && !profile.deathDateSourceIds?.length && person.deathDate === undefined, profile.id + ' must leave an unresolved exact death day unset');
    } else {
      assert('Rule BD status', profile.deathDate === null && !profile.statusSourceId && person.deathDate === undefined, profile.id + ' must not infer living status or retain an unsourced death date');
    }

    const profileFacts = profile.careerFactIds.map((id) => facts.get(id)).filter((fact): fact is Fact => Boolean(fact));
    assert('Rule BD career facts', profileFacts.length === (profile.id === 'anne-bronte' ? 3 : 2) && profileFacts.every((fact) => fact.profileId === profile.id), profile.id + ' must have the mapped number of reviewed career facts');
    for (const fact of profileFacts) {
      const source = captures.get(fact.sourceId);
      assert('Rule BD career facts', Boolean(source?.excerpt.includes(fact.evidencePhrase)), fact.id + ' evidence phrase must appear in a captured publisher excerpt');
      assert('Rule BD career facts', person.highlights?.includes(fact.displayText) === true && fact.displayText.trim().length >= 35, fact.id + ' displayed highlight must match the reviewed claim');
      assert('Rule BD career facts', Boolean(source && profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url)), fact.id + ' source URL must remain on the profile');
    }

    const fieldEvidence = profile.fieldEvidence || [];
    assert('Rule BD fields', stableSerialize(person.fields || []) === stableSerialize(profile.fields || []) && fieldEvidence.length === (profile.fields || []).length && fieldEvidence.every((row) => profile.fields?.includes(row.field) && row.rationale.trim().length > 30 && row.careerFactIds.length > 0 && row.careerFactIds.every((id) => profile.careerFactIds.includes(id))), profile.id + ' every field tag must cite related reviewed career facts');
    assert('Rule BD fields', (profile.fields || []).every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' must use valid field taxonomy values');

    if (profile.after) {
      const current = person as unknown as Record<string, unknown>;
      for (const [field, expected] of Object.entries(profile.after)) {
        const actual = current[field] === undefined ? null : current[field];
        assert('Rule BD corrections', stableSerialize(actual) === stableSerialize(expected), profile.id + ' current ' + field + ' must match the reviewed correction');
      }
    }

    if (BV017_JAN17_NEW_IDS.has(profile.id)) {
      assert('Rule BD new profile', person.countryCode === profile.countryCode && person.category === profile.category && stableSerialize(person.occupation) === stableSerialize(profile.occupation), profile.id + ' country, category, and occupation must match evidence');
      const birthplaceCapture = profile.dobSourceIds.map((id) => captures.get(id)).find((source) => source?.excerpt.includes(profile.birthplaceEvidencePhrase || ''));
      assert('Rule BD new profile', Boolean(profile.birthplace?.trim() && profile.birthplaceEvidencePhrase?.trim() && person.image === '/people/placeholder.svg' && person.birthplace === profile.birthplace && birthplaceCapture), profile.id + ' birthplace must match direct source evidence and use a neutral image placeholder');
      assert('Rule BD new profile', Boolean(person.biography?.trim() && person.shortDescription?.trim()), profile.id + ' must retain substantive profile text');
    }

    const claims = profile.identityClaims;
    const wdCapture = captures.get(profile.wikidataCaptureId || '');
    assert('Rule BD Wikidata', Boolean(claims && wdCapture && wdCapture.url.endsWith('/' + profile.wikidataId + '.json') && wdCapture.verificationMethod.startsWith('direct-http-json')), profile.id + ' must retain a direct Wikidata entity snapshot');
    if (claims) {
      const active = (rows: readonly Claim[]) => rows.filter((claim) => claim.rank !== 'deprecated');
      assert('Rule BD Wikidata', claims.label === (profile.wikidataLabel || profile.name) && active(claims.p31).some((claim) => claim.value === 'Q5'), profile.id + ' must have human P31 and matching entity label');
      assert('Rule BD Wikidata', active(claims.p569).some((claim) => claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' must have exact Gregorian P569');
      if (profile.deathDate) assert('Rule BD Wikidata', active(claims.p570).some((claim) => claim.value === '+' + profile.deathDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must agree with independently sourced death date');
      const dobConflicts = active(claims.p569).filter((claim) => claim.value !== '+' + profile.birthDate + 'T00:00:00Z');
      const deathConflicts = profile.deathDate ? active(claims.p570).filter((claim) => claim.value !== '+' + profile.deathDate + 'T00:00:00Z') : active(claims.p570);
      assert('Rule BD Wikidata', dobConflicts.length === 0, profile.id + ' must have no unresolved P569 disagreement');
      assert('Rule BD Wikidata', active(claims.p27).some((claim) => claim.value === claims.selectedCountryQid), profile.id + ' selected country must appear in the reviewed P27 snapshot');
      assert('Rule BD Wikidata', claims.selectedOccupationQids.length > 0 && claims.selectedOccupationQids.every((qid) => active(claims.p106).some((claim) => claim.value === qid)), profile.id + ' selected occupation must appear in the reviewed P106 snapshot');
      if (deathConflicts.length) {
        const conflict = evidence.wikidataReview.conflicts.find((row) => row.profileId === profile.id && row.property === 'P570');
        const statusCapture = captures.get(profile.statusSourceId || '');
        assert('Rule BD Wikidata conflict', Boolean(conflict && conflict.resolution === 'date-confirmed' && conflict.claimValue === deathConflicts[0].value && conflict.reviewNote.trim().length > 40 && conflict.sourceIds.some((sourceId) => profile.deathDateSourceIds?.includes(sourceId)) && Boolean(statusCapture && matchesExactDate(statusCapture.excerpt, profile.deathDate || ''))), profile.id + ' competing P570 day must be explicitly resolved against captured exact-date evidence');
        assert('Rule BD Wikidata conflict', profile.lifeStatus === 'deceased' && profile.deathDate !== null, profile.id + ' must retain the independently sourced exact death day selected in conflict review');
      } else {
        assert('Rule BD Wikidata', !evidence.wikidataReview.conflicts.some((row) => row.profileId === profile.id && row.property === 'P570'), profile.id + ' must not have a conflict record without an active P570 disagreement');
      }
    }
  }

  assert('Rule BD Wikidata', evidence.wikidataReview.conflicts.length === 0, 'All active P569 and P570 claims must agree with the evidence review or have an explicit resolution');
  assert('Rule BD daily coverage', ALL_PEOPLE.filter((person) => person.birthMonth === 1 && person.birthDay === 17).length === 5, 'January 17 must contain exactly five evidence-reviewed profiles');
  assert('Rule BD new IDs', BV017_JAN17_NEW_IDS.size === 1 && evidence.newProfiles.every((profile) => BV017_JAN17_NEW_IDS.has(profile.id)), 'January 17 exclusion set must contain its one addition');
}

import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/BV017-january-9-batch.json';
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
  statusEvidenceAsOf?: string;
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
  wikidataReview: { profiles: Record<string, { label: string; p31: readonly { rank: string; value: string; references: number }[]; p569: readonly { rank: string; value: string; precision: number; calendar: string; references: number }[]; p570: readonly { rank: string; value: string; precision: number; calendar: string; references: number }[]; p27: readonly { rank: string; value: string; references: number }[]; p106: readonly { rank: string; value: string; references: number }[] }>; conflicts: readonly { profileId: string; wikidataId: string; property: string; selectedDate: string; activeClaims: readonly { rank: string; date: string; precision: number; references: number }[]; resolution: string }[] };
};

const evidence = rawEvidence as unknown as JanuaryEvidence;
const EXPECTED_MANIFEST_SHA256 = '51176c28526eadfa11e71a9e4dbf1e05449d6a3926e009daa89b2bff7eb5d558';
const GREGORIAN_QID = 'Q1985727';
export const BV017_JAN9_NEW_IDS = new Set(evidence.newProfiles.map((profile) => profile.id));
export const BV017_JAN9_REVIEWED_IDS = new Set([...evidence.legacyProfiles, ...evidence.newProfiles].map((profile) => profile.id));

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
  const abbreviatedMonth = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][Number(month) - 1];
  const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
  return [
    birthDate,
    `${Number(day)} ${monthName} ${year}`,
    `${Number(day)} ${monthName}, ${year}`,
    `${Number(day)}${ordinal} ${monthName} ${year}`,
    `${monthName} ${Number(day)}, ${year}`,
    `${abbreviatedMonth} ${Number(day)}, ${year}`,
    `${abbreviatedMonth.replace('.', '')} ${Number(day)}, ${year}`,
    `${monthName} ${day}, ${year}`,
    `${Number(day)} January, ${year}`,
    `${Number(day)}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(month) - 1]} ${year}`,
    `${year} ${Number(day)}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(month) - 1]}`,
    `${Number(day)}.${Number(month)}.${year}`,
    `${year}/${month}/${day}`,
    `${year} ${month} ${day}`,
    `${day}.${month}.${year}`,
    `${Number(day)}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(month) - 1]} ${year}`,
    `${Number(day)}.${Number(month)}.${year}`,
    `${day}-${month}-${year}`,
    `${Number(day)}-${Number(month)}-${year}`,
    `${day}/${month}/${year}`,
    `${Number(day)}/${Number(month)}/${year}`,
    `${Number(day)}/${month}/${year}`,
    `${monthName} ${Number(day)},${year}`,
    `${Number(day)} janvier ${year}`,
    `${Number(day)} gennaio ${year}`,
    `${Number(day)} gennaio, ${year}`,
  ].some((dateText) => capture.excerpt.includes(dateText))
    || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(capture.excerpt);
}

function hasExactDeathDateExcerpt(capture: Capture, deathDate: string): boolean {
  const [year, month, day] = deathDate.split('-');
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(month) - 1];
  const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
  const germanMonthName = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(month) - 1];
  return [
    deathDate,
    `${Number(day)} ${monthName} ${year}`,
    `${Number(day)} ${monthName}, ${year}`,
    `${Number(day)}${ordinal} ${monthName} ${year}`,
    `${monthName} ${Number(day)}, ${year}`,
    `${monthName} ${day}, ${year}`,
    `${monthName} ${Number(day)} ${year}`,
    `${year} ${month} ${day}`,
    `${day}.${month}.${year}`,
    `${Number(day)}.${Number(month)}.${year}`,
    `${day}/${month}/${year}`,
    `${Number(day)}/${Number(month)}/${year}`,
    `${Number(day)}. ${germanMonthName} ${year}`,
    `${day}. ${germanMonthName} ${year}`,
  ].some((dateText) => capture.excerpt.includes(dateText))
    || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(capture.excerpt);
}

export function runBv017January9BatchIntegrity(
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  console.log('Checking Rule AV: evidence-backed BV-017 January 9 review and expansion batch...');
  const stableHash = createHash('sha256').update(stableSerialize(evidence)).digest('hex');
  assert('Rule AV manifest', stableHash === EXPECTED_MANIFEST_SHA256, 'January 9 captures, profile decisions, corrections, and Wikidata extracts must match the pinned review hash');
  assert('Rule AV scope', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017' && evidence.batch === '2026-01-09', 'January 9 batch must identify the active BV-017 cycle and exact calendar date');
  assert('Rule AV scope', evidence.legacyProfiles.length === 3 && evidence.newProfiles.length === 2 && evidence.careerFacts.length === 10, 'January 9 batch must review three existing and add two profiles with two facts each');

  const capturesById = new Map(evidence.sourceCaptures.map((capture) => [capture.id, capture]));
  assert('Rule AV captures', capturesById.size === evidence.sourceCaptures.length && evidence.sourceCaptures.length === 26, 'All twenty-six source capture IDs must be unique and retained');
  for (const capture of evidence.sourceCaptures) {
    let validUrl = false;
    try { validUrl = new URL(capture.url).protocol === 'https:'; } catch { validUrl = false; }
    assert('Rule AV captures', capture.status === 200 && capture.bytesRead > 0 && /^[a-f0-9]{64}$/.test(capture.sha256), capture.id + ' must retain a successful body capture, byte count, and SHA-256');
    assert('Rule AV captures', validUrl && hostOf(capture.url) === capture.publisherHost.toLowerCase() && capture.publisher.trim().length > 2, capture.id + ' must identify an HTTPS source and its exact publisher host');
    assert('Rule AV captures', capture.excerpt.trim().length > 20 && sha256(capture.excerpt) === capture.excerptSha256, capture.id + ' reviewed excerpt must match its pinned text hash');
    assert('Rule AV captures', capture.verificationMethod.startsWith('direct-http'), capture.id + ' must identify a direct HTTP capture');
  }

  const factsById = new Map(evidence.careerFacts.map((fact) => [fact.id, fact]));
  const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const profileRows = [...evidence.legacyProfiles, ...evidence.newProfiles];
  const profileIds = new Set(profileRows.map((profile) => profile.id));
  assert('Rule AV identity', profileIds.size === profileRows.length, 'Reviewed January 9 profile IDs must be unique');
  assert('Rule AV identity', stableSerialize([...profileIds].sort()) === stableSerialize(['jimmy-page', 'joan-baez', 'karel-capek', 'richard-nixon', 'simone-de-beauvoir'].sort()), 'January 9 evidence must bind exactly the three reviewed legacy profiles and two reviewed additions');

  for (const profile of profileRows) {
    const person = peopleById.get(profile.id);
    assert('Rule AV identity', Boolean(person), profile.id + ' must exist in the local people dataset');
    if (!person) continue;
    assert('Rule AV identity', person.name === profile.name && person.wikidataId === profile.wikidataId && person.birthDate === profile.birthDate, profile.id + ' name, Wikidata identity, and exact DOB must match reviewed evidence');
    assert('Rule AV date', person.birthMonth === 1 && person.birthDay === 9 && profile.birthDate.endsWith('-01-09'), profile.id + ' must belong to January 9');
    assert('Rule AV status', (person.lifeStatus ?? 'unknown') === profile.lifeStatus && (person.deathDate ?? null) === profile.deathDate, profile.id + ' local status and death date must match the reviewed decision');

    const dobSources = profile.dobSourceIds.map((id) => capturesById.get(id)).filter((capture): capture is Capture => Boolean(capture));
    assert('Rule AV DOB', dobSources.length === 2 && new Set(dobSources.map((source) => source.publisherHost)).size === 2, profile.id + ' must have two independent retained DOB source hosts');
    for (const source of dobSources) {
      assert('Rule AV DOB', hasExactDobExcerpt(source, profile.birthDate), profile.id + ' DOB capture ' + source.id + ' must state the exact day, month, and year');
      assert('Rule AV sources', profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url) === true, profile.id + ' DOB sources must remain on the profile and in its evidence row');
    }

    if (profile.lifeStatus === 'deceased') {
      assert('Rule AV status', Boolean(profile.deathDate && profile.deathDatePrecision === 'day' && (profile.deathDateSourceIds || []).length > 0), profile.id + ' exact death date requires a dedicated captured source');
      for (const id of profile.deathDateSourceIds || []) {
        const source = capturesById.get(id);
        assert('Rule AV status', Boolean(source && profile.deathDate && hasExactDeathDateExcerpt(source, profile.deathDate) && profile.sourceUrls.includes(source.url) && person.deathDateSourceUrls?.includes(source.url)), profile.id + ' exact death date must appear in a captured source retained on the profile');
      }
    } else {
      assert('Rule AV status', profile.deathDate === null && person.deathDate === undefined, profile.id + ' without a sourced death date must not be assigned one');
    }

    if (profile.lifeStatus !== 'unknown') {
      const statusSource = capturesById.get(profile.statusSourceId || '');
      assert('Rule AV status', Boolean(statusSource && profile.sourceUrls.includes(statusSource.url) && person.sourceUrls?.includes(statusSource.url)), profile.id + ' living/deceased status must have a directly captured source retained on the profile');
      if (profile.lifeStatus === 'living') {
        const hasCurrentIdentityEvidence = profile.id === 'joan-baez'
          ? Boolean(statusSource && statusSource.excerpt.includes('Joan Baez') && statusSource.excerpt.includes('2026 Newport Folk Festival'))
          : profile.id === 'jimmy-page'
            ? Boolean(statusSource && statusSource.excerpt.includes('Jimmy Page') && statusSource.excerpt.includes('Instagram') && statusSource.excerpt.includes('September 22, 2026'))
            : false;
        const expectedStatusEvidenceDate = profile.id === 'joan-baez' ? '2026' : '2026-09-22';
        assert('Rule AV status', hasCurrentIdentityEvidence && profile.statusEvidenceAsOf === expectedStatusEvidenceDate, profile.id + ' living status must have a recent identity-matched source and an explicit evidence date');
      } else {
        assert('Rule AV status', Boolean(statusSource && profile.deathDateSourceIds?.includes(statusSource.id)), profile.id + ' deceased status must bind to its direct death-date capture');
      }
    }

    const profileFacts = profile.careerFactIds.map((id) => factsById.get(id)).filter((fact): fact is CareerFact => Boolean(fact));
    assert('Rule AV career facts', profileFacts.length === 2 && profileFacts.every((fact) => fact.profileId === profile.id), profile.id + ' must map exactly two direct career facts to its identity');
    const fieldEvidence = profile.fieldEvidence || [];
    assert('Rule AV fields', stableSerialize(person.fields || []) === stableSerialize(profile.fields || []) && fieldEvidence.length === (profile.fields || []).length && fieldEvidence.every((row) => profile.fields?.includes(row.field) && row.rationale.trim().length > 30 && row.careerFactIds.length > 0 && row.careerFactIds.every((id) => profile.careerFactIds.includes(id))), profile.id + ' every assigned field must match the profile and cite related reviewed career facts');
    for (const fact of profileFacts) {
      const source = capturesById.get(fact.sourceId);
      assert('Rule AV career facts', Boolean(source && source.status === 200 && source.excerpt.includes(fact.evidencePhrase)), fact.id + ' evidence phrase must appear in its captured publisher excerpt');
      assert('Rule AV career facts', person.highlights?.includes(fact.displayText) === true && fact.displayText.trim().length >= 35, fact.id + ' displayed highlight must match the source-supported fact');
      assert('Rule AV career facts', Boolean(source && profile.sourceUrls.includes(source.url) && person.sourceUrls?.includes(source.url)), fact.id + ' source URL must remain on the local profile');
    }

    if (profile.after) {
      const current = person as unknown as Record<string, unknown>;
      for (const [field, expected] of Object.entries(profile.after)) {
        const actual = current[field] === undefined ? null : current[field];
        assert('Rule AV corrections', stableSerialize(actual) === stableSerialize(expected), profile.id + ' current ' + field + ' must match the reviewed correction');
      }
    }

    if (BV017_JAN9_NEW_IDS.has(profile.id)) {
      assert('Rule AV new profile fields', person.countryCode === profile.countryCode && person.category === profile.category && stableSerialize(person.occupation) === stableSerialize(profile.occupation), profile.id + ' country, category, and occupation must match the evidence row');
      const birthplaceSource = profile.dobSourceIds.map((id) => capturesById.get(id)).find((source) => source?.excerpt.includes(profile.birthplaceEvidencePhrase || ''));
      assert('Rule AV birthplace', Boolean(profile.birthplace && person.birthplace === profile.birthplace && profile.birthplaceEvidencePhrase && birthplaceSource), profile.id + ' birthplace must match a DOB source excerpt retained in the evidence batch');
      assert('Rule AV fields', stableSerialize(person.fields) === stableSerialize(profile.fields) && (profile.fields || []).every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' field tags must be valid and match the evidence allowlist');
      assert('Rule AV content', person.image === '/people/placeholder.svg' && Boolean(person.biography?.trim() && person.shortDescription?.trim()), profile.id + ' must retain a substantive profile and neutral image placeholder');
      const identity = profile.identityClaims;
      const wdCapture = capturesById.get(profile.wikidataCaptureId || '');
      const wdPageUrl = 'https://www.wikidata.org/wiki/' + profile.wikidataId;
      assert('Rule AV Wikidata', Boolean(identity && wdCapture && wdCapture.url.endsWith('/' + profile.wikidataId + '.json') && profile.sourceUrls.includes(wdPageUrl) && person.sourceUrls?.includes(wdPageUrl)), profile.id + ' must retain a direct Wikidata entity capture and profile page source');
      if (identity) {
        assert('Rule AV Wikidata', identity.label === (profile.wikidataLabel || profile.name) && identity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), profile.id + ' active P31 must identify the matching human');
        assert('Rule AV Wikidata', identity.p569.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P569 must state the exact Gregorian birth date');
        if (profile.deathDate) assert('Rule AV Wikidata', identity.p570.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.deathDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must agree with the independently sourced exact death date');
        assert('Rule AV Wikidata', identity.p27.some((claim) => claim.rank !== 'deprecated' && claim.value === identity.selectedCountryQid) && identity.p106.some((claim) => claim.rank !== 'deprecated' && identity.selectedOccupationQids.includes(claim.value)), profile.id + ' country and occupation must match active P27/P106 claims');
      }
    }
  }

  const wikidataConflictsByProfile = new Map(evidence.wikidataReview.conflicts.map((row) => [row.profileId, row]));
  assert('Rule AV Wikidata', evidence.wikidataReview.conflicts.length === 0, 'January 9 audit must retain an explicit review row for every active P569 disagreement; none are expected for this batch');
  for (const profile of profileRows) {
    const identity = profile.identityClaims;
    const capture = capturesById.get(profile.wikidataCaptureId || '');
    assert('Rule AV Wikidata', Boolean(identity && capture && capture.url.endsWith('/' + profile.wikidataId + '.json') && capture.verificationMethod.startsWith('direct-http-json')), profile.id + ' must retain a direct entity capture and a parsed P31/P569/P570/P27/P106 audit');
    if (!identity) continue;
    const activeP31 = identity.p31.filter((claim) => claim.rank !== 'deprecated');
    const activeP569 = identity.p569.filter((claim) => claim.rank !== 'deprecated');
    assert('Rule AV Wikidata', activeP31.some((claim) => claim.value === 'Q5'), profile.id + ' active P31 must identify a human');
    assert('Rule AV Wikidata', activeP569.some((claim) => claim.value === '+' + profile.birthDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' must have an active precise Gregorian P569 matching the source-verified DOB');
    if (profile.deathDate) assert('Rule AV Wikidata', identity.p570.some((claim) => claim.rank !== 'deprecated' && claim.value === '+' + profile.deathDate + 'T00:00:00Z' && claim.precision === 11 && claim.calendar === GREGORIAN_QID), profile.id + ' P570 must match the source-verified death date');
    const disagreements = activeP569.filter((claim) => claim.value !== '+' + profile.birthDate + 'T00:00:00Z');
    const conflict = wikidataConflictsByProfile.get(profile.id);
    assert('Rule AV Wikidata', disagreements.length === (conflict ? 1 : 0), profile.id + ' every active P569 disagreement must have exactly one explicit resolution row');
    if (conflict) {
      assert('Rule AV Wikidata conflict', conflict.wikidataId === profile.wikidataId && conflict.property === 'P569' && conflict.selectedDate === profile.birthDate && conflict.activeClaims.length === activeP569.length, profile.id + ' P569 conflict review must bind the QID, selected date, and all active claims');
      assert('Rule AV Wikidata conflict', conflict.activeClaims.some((claim) => claim.date === profile.birthDate && claim.precision === 11) && conflict.activeClaims.some((claim) => claim.date.startsWith(profile.birthDate.slice(0, 4) + '-') && claim.precision === 9) && conflict.resolution.includes('year-precision'), profile.id + ' P569 review must retain the exact day claim and document the year-only claim');
    }
  }

  for (const fact of evidence.careerFacts) {
    assert('Rule AV career facts', profileIds.has(fact.profileId), fact.id + ' must belong to a reviewed January 9 profile');
    assert('Rule AV career facts', fact.evidencePhrase.length > 15 && fact.displayText.length > 30, fact.id + ' must include a specific source phrase and nontrivial displayed claim');
  }
  const jan9People = ALL_PEOPLE.filter((person) => person.birthMonth === 1 && person.birthDay === 9);
  assert('Rule AV daily coverage', jan9People.length === 5 && jan9People.every((person) => profileIds.has(person.id)), 'January 9 must contain exactly five profiles admitted by this reviewed evidence batch');
  assert('Rule AV new IDs', BV017_JAN9_NEW_IDS.size === 2 && evidence.newProfiles.every((profile) => BV017_JAN9_NEW_IDS.has(profile.id)), 'The new-profile exclusion set must contain exactly the two January 9 additions');
}

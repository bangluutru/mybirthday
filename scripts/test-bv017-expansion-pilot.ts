import { createHash } from 'node:crypto';
import rawExpansionPilot from '../.ai/evidence/BV017-expansion-pilot.json';
import { ALL_PEOPLE } from '../src/data/birthdays';
import { PERSON_FIELD_LABELS, type PersonField } from '../src/data/types';
import { projectPersonBeforeJanuary14 } from './bv017-corrections';
import { BV017_JAN14_NEW_IDS } from './test-bv017-january-14-batch';
import { BV017_JAN15_NEW_IDS } from './test-bv017-january-15-batch';
import { BV017_JAN16_NEW_IDS } from './test-bv017-january-16-batch';
import { BV017_JAN17_NEW_IDS } from './test-bv017-january-17-batch';
import { BV017_JAN18_NEW_IDS } from './test-bv017-january-18-batch';
import { BV017_JAN19_NEW_IDS } from './test-bv017-january-19-batch';
import { BV017_JAN20_NEW_IDS } from './test-bv017-january-20-batch';
import { BV017_JAN21_NEW_IDS } from './test-bv017-january-21-batch';
import { BV017_JAN22_NEW_IDS } from './test-bv017-january-22-batch';
import { BV017_JAN23_NEW_IDS } from './test-bv017-january-23-batch';
import { BV017_JAN24_NEW_IDS } from './test-bv017-january-24-batch';
import { BV017_JAN25_NEW_IDS } from './test-bv017-january-25-batch';
import { BV017_JAN26_NEW_IDS } from './test-bv017-january-26-batch';
import { BV017_JAN27_NEW_IDS } from './test-bv017-january-27-batch';

type PilotCapture = {
  status: number | null;
  contentType?: string;
  bytesRead?: number;
  sha256?: string;
  excerptSha256?: string;
  verificationMethod: string;
  nameMatched?: boolean;
  claimTextMatched?: boolean;
};

type PilotDobSource = {
  url: string;
  publisher: string;
  publisherHost: string;
  sourceIndex: number;
  capture: PilotCapture;
  dateExcerpt: string;
  dateExcerptSha256: string;
  exactDate: boolean;
  dateMatchMethod: string;
};

type PilotClaim = {
  statementId?: string;
  rank: string;
  snaktype?: string;
  value?: {
    qid?: string;
    time?: string;
    precision?: number;
    calendar?: string;
  } | null;
  referenceCount?: number;
  referenceUrls?: readonly string[];
};

type PilotStatusEvidence = {
  status: 'living' | 'deceased' | 'unknown';
  url: string | null;
  publisher: string | null;
  publicationDate?: string;
  capturedAt?: string;
  excerpt?: string;
  rationale?: string;
  statementIds?: readonly string[];
  activeP570Claims?: readonly PilotClaim[];
  capture?: PilotCapture;
};

type PilotProfile = {
  id: string;
  name: string;
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  countryName: string;
  category: string;
  occupation: string;
  fields: readonly PersonField[];
  lifeStatus: 'living' | 'deceased' | 'unknown';
  deathDate: string | null;
  sourceUrls: readonly string[];
  dobSources: readonly PilotDobSource[];
  fieldEvidence: readonly {
    field: PersonField;
    careerFactIds: readonly string[];
    rationale: string;
  }[];
  careerFactIds: readonly string[];
  institutionalSourceEvidence?: readonly {
    url: string;
    publisher: string;
    publisherHost: string;
    rationale: string;
    capture: {
      status: number;
      sha256: string;
      bytesRead: number;
      verificationMethod: string;
      capturedAt: string;
    };
    excerpt: string;
    excerptSha256: string;
  }[];
  statusEvidence: readonly PilotStatusEvidence[];
  identityEvidence: {
    wikidataLabel: string | null;
    selectedCountryCode: string;
    selectedOccupation: string;
    allowedCountryQids: readonly string[];
    countryClaims: readonly PilotClaim[];
    occupationClaims: readonly PilotClaim[];
    p31Claims: readonly PilotClaim[];
    p569Claims: readonly PilotClaim[];
    p570Claims: readonly PilotClaim[];
    countryEvidenceSourceUrls: readonly string[];
  };
};

type PilotCareerFact = {
  id: string;
  wikidataId: string;
  factId: string;
  field: string;
  displayText: string;
  sourceUrl: string;
  sourceText: string;
  evidencePhrase: string;
  excerpt: string;
  capture: PilotCapture;
};

type PilotEvidence = {
  schemaVersion: number;
  cycle: string;
  generatedAt: string;
  scope: {
    profileCount: number;
    months: readonly number[];
    profilesPerMonth: number;
    profilesPerDay: number;
    categoryPreserved: boolean;
    fieldCount: number;
  };
  summary: {
    profileCount: number;
    deceased: number;
    living: number;
    unknown: number;
    vietNamese: number;
    unitedStates: number;
    careerFacts: number;
    fieldAssignments: number;
    fieldCounts: Record<string, number>;
    p570ConflictsWithStatusOnly: number;
    sourceCaptureCount: number;
    priorityFieldProfileCount: number;
    entrepreneurialProfiles: number;
    sportsOnlyProfileCount: number;
    unitedStatesSharePercent: number;
    vietnameseSharePercent: number;
  };
  profileIdQidDobFieldManifest: readonly {
    id: string;
    wikidataId: string;
    birthDate: string;
    countryCode: string;
    category: string;
    occupation: string;
    fields: readonly PersonField[];
    lifeStatus: 'living' | 'deceased' | 'unknown';
  }[];
  wikidataSnapshot: {
    endpoint: string;
    retrievedAt: string;
    entityCount: number;
    propertiesAudited: readonly string[];
    entities: Record<string, unknown>;
  };
  statusCaptures: readonly {
    id: string;
    url: string;
    publisherHost: string;
    status: number | null;
    bytesRead: number;
    sha256?: string;
    excerpt: string;
    excerptSha256: string;
    verificationMethod: string;
    capturedAt: string;
  }[];
  profiles: readonly PilotProfile[];
  careerFacts: readonly PilotCareerFact[];
};

const evidence = rawExpansionPilot as unknown as PilotEvidence;
const EXPECTED_IDENTITY_SHA256 = '6a7342031ec09abd8cb442fe214af9a33c2267edc576f61d12465567a620258a';
const EXPECTED_DOB_SOURCES_SHA256 = '57dbbe178517838812740368549f876002d628042ef46ab30710b0fc1c9a9569';
const EXPECTED_CAREER_AND_FIELDS_SHA256 = '7fad3dbc0b394fa9564c0e6cff222c65885b3ccb5726d0f85c32b6f085d6d1b7';
const EXPECTED_STATUSES_SHA256 = '3b82cc2b71f63540b165cc68a380f0724f6c107774c0b8043755bd3b43e0884f';
const EXPECTED_CLAIMS_SHA256 = '234f8df50afb7213a22dce1b23b5982770b12967b7de3ba2ba334d0f7d5ddc81';
const EXPECTED_STATUS_CAPTURES_SHA256 = '421072a9ec6251062e3a5b14d8dc7fbfc3e67702d607e6972c5da6cfa5f63e0b';
const EXPECTED_INSTITUTIONAL_SOURCES_SHA256 = 'db8ba1efca395096d8bb8e8725448d17b7afa93578d0e254ca1575a9d862f864';
const GREGORIAN = 'http://www.wikidata.org/entity/Q1985727';

export const BV017_EXPANSION_NEW_IDS = new Set(evidence.profiles.map((profile) => profile.id));

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

function hostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function isApprovedExpansionDobSource(profile: PilotProfile, qid: string, candidateUrl: string): boolean {
  try {
    const parsed = new URL(candidateUrl);
    return parsed.protocol === 'https:'
      && !parsed.username
      && !parsed.password
      && profile.wikidataId === qid
      && profile.dobSources.some((source) => source.url === candidateUrl);
  } catch {
    return false;
  }
}

export function runBv017ExpansionPilotIntegrity(assert: (suite: string, condition: boolean, message: string) => void): void {
  console.log('Checking Rule AM: BV-017 30-profile multi-field expansion pilot, source evidence, Wikidata audit, and source allowlist...');

  assert('Rule AM schema', evidence.schemaVersion === 1 && evidence.cycle === 'BV-017', 'Expansion evidence must identify schema 1 and cycle BV-017');
  assert('Rule AM scope', evidence.scope.profileCount === 30 && evidence.scope.months.join(',') === '1,2,3,4,5,6,7,8,9,10' && evidence.scope.profilesPerMonth === 3 && evidence.scope.profilesPerDay === 1, 'Pilot must remain exactly 30 additions, three per month across January–October');
  assert('Rule AM scope', evidence.scope.categoryPreserved && evidence.scope.fieldCount === Object.keys(PERSON_FIELD_LABELS).length, 'Pilot must retain a separate legacy category and exercise the entire field taxonomy');
  assert('Rule AM allowlist', evidence.profiles.length === 30 && BV017_EXPANSION_NEW_IDS.size === 30 && new Set(evidence.profiles.map((profile) => profile.wikidataId)).size === 30, 'Pilot must contain 30 unique profile IDs and Wikidata IDs');
  assert('Rule AM allowlist', stableSha256(evidence.profileIdQidDobFieldManifest) === EXPECTED_IDENTITY_SHA256, 'Profile identity, date, country, category, occupation, fields, and status must match the pinned allowlist');
  assert('Rule AM source hashes', stableSha256(evidence.profiles.map(({ id, dobSources }) => ({ id, dobSources }))) === EXPECTED_DOB_SOURCES_SHA256, 'DOB source pairs, publisher identities, capture hashes, and reviewed excerpts must match their pinned manifest');
  assert('Rule AM content hashes', stableSha256({
    facts: evidence.careerFacts,
    fieldAssignments: evidence.profiles.map(({ id, fields, fieldEvidence, careerFactIds }) => ({ id, fields, fieldEvidence, careerFactIds })),
  }) === EXPECTED_CAREER_AND_FIELDS_SHA256, 'Career facts and field-to-fact mappings must match their pinned review hash');
  assert('Rule AM status hashes', stableSha256(evidence.profiles.map(({ id, lifeStatus, statusEvidence }) => ({ id, lifeStatus, statusEvidence }))) === EXPECTED_STATUSES_SHA256, 'Life-status decisions and supporting evidence must match their pinned review hash');
  assert('Rule AM Wikidata hashes', stableSha256(evidence.profiles.map(({ id, identityEvidence }) => ({ id, identityEvidence }))) === EXPECTED_CLAIMS_SHA256, 'Retained P31/P569/P570/P27/P106 claim details must match their pinned review hash');
  assert('Rule AM status captures', stableSha256(evidence.statusCaptures) === EXPECTED_STATUS_CAPTURES_SHA256, 'Current living-status captures must match their pinned review hash');
  const institutionalSourceRows = evidence.profiles
    .filter((profile) => profile.institutionalSourceEvidence?.length)
    .map(({ id, institutionalSourceEvidence }) => ({ id, institutionalSourceEvidence }));
  assert('Rule AM institutional sources', stableSha256(institutionalSourceRows) === EXPECTED_INSTITUTIONAL_SOURCES_SHA256, 'Additional official institutional sources and direct captures must match their pinned evidence hash');

  const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
  const factsById = new Map<string, PilotCareerFact>();
  for (const fact of evidence.careerFacts) {
    assert('Rule AM career facts', !factsById.has(fact.factId), fact.factId + ' must be unique');
    factsById.set(fact.factId, fact);
  }
  assert('Rule AM career facts', evidence.careerFacts.length === 60 && factsById.size === 60, 'Every pilot profile must have two directly captured career facts');
  assert('Rule AM career facts', evidence.summary.careerFacts === evidence.careerFacts.length, 'Summary fact count must match the retained fact manifest');

  const expectedById = new Map(evidence.profiles.map((profile) => [profile.id, profile]));
  const fieldCounts = new Map<PersonField, number>();
  const countryCounts = new Map<string, number>();
  const lifeStatusCounts = { living: 0, deceased: 0, unknown: 0 };
  const profileIdsByMonth = new Map<number, PilotProfile[]>();

  for (const profile of evidence.profiles) {
    const person = peopleById.get(profile.id);
    assert('Rule AM data rows', Boolean(person), profile.id + ' must exist in the local people data');
    if (!person) continue;
    const personAtPilotReview = projectPersonBeforeJanuary14(person);

    const date = profile.birthDate;
    const expectedQidUrl = 'https://www.wikidata.org/wiki/' + profile.wikidataId;
    assert('Rule AM identity', person.wikidataId === profile.wikidataId && person.slug === profile.id && person.birthDate === date, profile.id + ' ID, QID, and exact birth date must match the allowlist');
    assert('Rule AM identity', /^\d{4}-\d{2}-\d{2}$/.test(date) && person.birthYear === Number(date.slice(0, 4)) && person.birthMonth === Number(date.slice(5, 7)) && person.birthDay === Number(date.slice(8, 10)), profile.id + ' split birth-date fields must match the full Gregorian date');
    assert('Rule AM identity', person.countryCode === profile.countryCode && person.countryName === profile.countryName && person.category === profile.category && person.occupation?.length === 1 && person.occupation[0] === profile.occupation, profile.id + ' country, legacy category, and occupation must match reviewed identity evidence');
    assert('Rule AM identity', personAtPilotReview.lifeStatus === profile.lifeStatus && personAtPilotReview.deathDate === undefined && profile.deathDate === null, profile.id + ' life status must be explicit without adding an unreviewed death date at the pilot review point');
    assert('Rule AM identity', person.sourceUrls?.includes(expectedQidUrl) === true && profile.sourceUrls.includes(expectedQidUrl), profile.id + ' must retain the exact Wikidata source URL');
    assert('Rule AM content', Boolean(person.shortDescription?.trim() && person.biography?.trim() && person.highlights?.length === 2 && person.highlights.every((highlight) => highlight.trim().length >= 35)), profile.id + ' requires a substantive biography and two nontrivial highlights');
    assert('Rule AM content', person.fields?.join('|') === profile.fields.join('|'), profile.id + ' local field tags must match the reviewed pilot mapping');
    assert('Rule AM content', Boolean(person.image) && person.image === '/people/placeholder.svg', profile.id + ' must use the neutral placeholder until an image has verified reuse rights');

    for (const source of profile.institutionalSourceEvidence || []) {
      assert('Rule AM institutional sources', source.publisher.trim().length > 0 && hostname(source.url) === source.publisherHost.toLowerCase(), profile.id + ' institutional source must identify its exact publisher host');
      assert('Rule AM institutional sources', person.sourceUrls?.includes(source.url) === true && profile.sourceUrls.includes(source.url), profile.id + ' institutional source must be retained on the local profile and evidence row');
      assert('Rule AM institutional sources', source.capture.status === 200 && source.capture.verificationMethod === 'direct-http' && /^[a-f0-9]{64}$/.test(source.capture.sha256) && source.capture.bytesRead > 0, profile.id + ' institutional source must retain a successful, hashed HTTP body capture');
      assert('Rule AM institutional sources', source.excerpt.trim().length >= 30 && textSha256(source.excerpt) === source.excerptSha256 && source.rationale.trim().length > 20, profile.id + ' institutional source excerpt and rationale must be pinned');
    }

    const month = Number(date.slice(5, 7));
    const rows = profileIdsByMonth.get(month) || [];
    rows.push(profile);
    profileIdsByMonth.set(month, rows);
    countryCounts.set(profile.countryCode, (countryCounts.get(profile.countryCode) || 0) + 1);
    lifeStatusCounts[profile.lifeStatus]++;

    const fieldSet = new Set(profile.fields);
    assert('Rule AM fields', profile.fields.length > 0 && fieldSet.size === profile.fields.length && profile.fields.every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), profile.id + ' field tags must be known and unique');
    for (const field of profile.fields) fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1);
    assert('Rule AM fields', profile.fieldEvidence.length === profile.fields.length && profile.fields.every((field) => profile.fieldEvidence.some((entry) => entry.field === field)), profile.id + ' must have evidence for every assigned field');

    const profileFacts = profile.careerFactIds.map((factId) => factsById.get(factId)).filter((fact): fact is PilotCareerFact => Boolean(fact));
    assert('Rule AM career facts', profileFacts.length === 2 && profileFacts.every((fact) => fact.id === profile.id && fact.wikidataId === profile.wikidataId), profile.id + ' must map two career facts to its exact person and QID');
    assert('Rule AM career facts', profileFacts.every((fact) => personAtPilotReview.highlights?.includes(fact.displayText)), profile.id + ' displayed highlights must be the retained sourced career facts at the pilot review point');
    for (const fact of profileFacts) {
      const capture = fact.capture;
      assert('Rule AM career facts', fact.field === 'career' && Boolean(fact.sourceUrl && fact.sourceText && fact.evidencePhrase), fact.factId + ' must identify a source, source phrase, and career claim');
      assert('Rule AM career facts', fact.evidencePhrase.toLocaleLowerCase().includes(fact.sourceText.toLocaleLowerCase()) && fact.excerpt.toLocaleLowerCase().includes(fact.evidencePhrase.toLocaleLowerCase()), fact.factId + ' evidence phrase must appear in the retained publisher excerpt');
      assert('Rule AM career facts', capture.status === 200 && Boolean(capture.sha256 && /^[a-f0-9]{64}$/.test(capture.sha256)) && capture.excerptSha256 === textSha256(fact.excerpt) && capture.claimTextMatched === true, fact.factId + ' must have a successful publisher capture and matching excerpt hash');
      assert('Rule AM career facts', person.sourceUrls?.includes(fact.sourceUrl) === true && profile.sourceUrls.includes(fact.sourceUrl), fact.factId + ' source must remain on the profile');
    }

    for (const mapping of profile.fieldEvidence) {
      const referencedFacts = mapping.careerFactIds.map((factId) => factsById.get(factId));
      assert('Rule AM fields', mapping.rationale.trim().length > 20 && referencedFacts.length > 0 && referencedFacts.every((fact) => fact?.id === profile.id), profile.id + ' ' + mapping.field + ' mapping must cite its career facts and rationale');
    }

    assert('Rule AM DOB sources', profile.dobSources.length === 2, profile.id + ' must have exactly two retained DOB sources');
    assert('Rule AM DOB sources', new Set(profile.dobSources.map((source) => source.publisherHost.toLowerCase())).size === 2, profile.id + ' DOB sources must have independent publisher hosts');
    for (const source of profile.dobSources) {
      const parsed = (() => {
        try { return new URL(source.url); } catch { return null; }
      })();
      assert('Rule AM source allowlist', isApprovedExpansionDobSource(profile, profile.wikidataId, source.url), profile.id + ' approved DOB source must pass the exact HTTPS allowlist');
      assert('Rule AM DOB sources', parsed?.protocol === 'https:' && !parsed.username && !parsed.password && hostname(source.url) === source.publisherHost.toLowerCase(), profile.id + ' source URL must be HTTPS and match its recorded host');
      assert('Rule AM DOB sources', source.capture.status === 200 && Boolean(source.capture.sha256 && /^[a-f0-9]{64}$/.test(source.capture.sha256)) && (source.capture.bytesRead || 0) > 0, profile.id + ' source must retain a successful body capture and SHA-256');
      assert('Rule AM DOB sources', source.exactDate && source.dateExcerpt.trim().length > 40 && source.dateExcerptSha256 === textSha256(source.dateExcerpt), profile.id + ' exact DOB excerpt must have a verified date and pinned excerpt hash');
      assert('Rule AM DOB sources', person.sourceUrls?.includes(source.url) === true && profile.sourceUrls.includes(source.url), profile.id + ' DOB source URL must be retained on the profile');

      if (source.dateMatchMethod === 'manual-reviewed-context') {
        assert('Rule AM controlled exceptions', profile.id === 'shibusawa-eiichi' && source.sourceIndex === 2 && source.dateExcerpt.includes('1840') && source.dateExcerpt.includes('March 16th'), 'Only Shibusawa’s dated chronology row may use manual context review');
      } else if (source.dateMatchMethod === 'pdf-text-extract') {
        assert('Rule AM controlled exceptions', profile.id === 'amelia-earhart' && source.sourceIndex === 2 && source.dateExcerpt.includes('Amelia Mary Earhart') && source.dateExcerpt.includes('July 24, 1897'), 'Only Earhart’s NASA PDF may use extracted PDF text for DOB matching');
      } else if (source.dateMatchMethod === 'direct-http+browser-search') {
        assert('Rule AM controlled exceptions', profile.id === 'frank-lloyd-wright' && source.sourceIndex === 2 && source.dateExcerpt.includes('Frank Lloyd Wright') && source.dateExcerpt.includes('June 8, 1867'), 'Only the Guggenheim finding aid may use its official indexed excerpt for the date');
      } else {
        assert('Rule AM DOB sources', source.dateMatchMethod === 'direct-http' && source.capture.verificationMethod === 'direct-http', profile.id + ' ordinary DOB sources must have a direct exact-date match');
      }
      assert('Rule AM source allowlist negatives', !isApprovedExpansionDobSource(profile, 'Q0', source.url), profile.id + ' allowlist must reject a mismatched QID');
      assert('Rule AM source allowlist negatives', !isApprovedExpansionDobSource(profile, profile.wikidataId, 'https://evil.example/not-a-source'), profile.id + ' allowlist must reject an unlisted HTTPS publisher');
      assert('Rule AM source allowlist negatives', !isApprovedExpansionDobSource(profile, profile.wikidataId, source.url.replace(/^https:/, 'http:')), profile.id + ' allowlist must reject an HTTP downgrade');
      assert('Rule AM source allowlist negatives', !isApprovedExpansionDobSource(profile, profile.wikidataId, 'https://user:pass@' + source.publisherHost + '/'), profile.id + ' allowlist must reject URL credentials');
    }

    const identity = profile.identityEvidence;
    assert('Rule AM Wikidata', identity.wikidataLabel === profile.name || Boolean(identity.wikidataLabel && profile.name.includes(identity.wikidataLabel)), profile.id + ' Wikidata label must identify the selected profile');
    assert('Rule AM Wikidata', identity.countryEvidenceSourceUrls.length >= 2 && identity.countryEvidenceSourceUrls.every((url) => profile.dobSources.some((source) => source.url === url)), profile.id + ' country evidence must point to retained identity sources');
    assert('Rule AM Wikidata', identity.countryClaims.some((claim) => ['normal', 'preferred'].includes(claim.rank) && Boolean(claim.value?.qid && identity.allowedCountryQids.includes(claim.value.qid))), profile.id + ' country code must agree with an active P27 claim for its national or historical state');
    assert('Rule AM Wikidata', identity.occupationClaims.some((claim) => ['normal', 'preferred'].includes(claim.rank) && Boolean(claim.value?.qid)), profile.id + ' must retain an active Wikidata occupation claim');
    assert('Rule AM Wikidata', identity.p31Claims.some((claim) => ['normal', 'preferred'].includes(claim.rank) && claim.value?.qid === 'Q5'), profile.id + ' must be an instance of human (P31=Q5)');

    const activeP569 = identity.p569Claims.filter((claim) => claim.rank === 'normal' || claim.rank === 'preferred');
    const exactP569 = activeP569.filter((claim) => claim.value?.precision === 11 && claim.value.calendar === GREGORIAN);
    const expectedTime = '+' + profile.birthDate + 'T00:00:00Z';
    assert('Rule AM Wikidata', exactP569.length === 1 && exactP569[0].value?.time === expectedTime, profile.id + ' must have one exact active Gregorian P569 claim matching the local DOB');
    assert('Rule AM Wikidata', activeP569.filter((claim) => (claim.value?.precision || 0) >= 11).every((claim) => claim.value?.time === expectedTime), profile.id + ' has a conflicting active exact P569 claim');
    assert('Rule AM Wikidata', activeP569.filter((claim) => (claim.value?.precision || 0) < 11).every((claim) => claim.value?.time?.slice(1, 5) === profile.birthDate.slice(0, 4)), profile.id + ' has an inconsistent coarser P569 year claim');
    assert('Rule AM Wikidata', identity.p569Claims.every((claim) => ['normal', 'preferred', 'deprecated'].includes(claim.rank)), profile.id + ' P569 ranks must be preserved in the audit');

    const activeP570 = identity.p570Claims.filter((claim) => claim.rank === 'normal' || claim.rank === 'preferred');
    if (profile.lifeStatus === 'deceased') {
      const recorded = profile.statusEvidence[0];
      const evidenceClaims = recorded?.activeP570Claims || [];
      assert('Rule AM life status', activeP570.length > 0 && recorded?.status === 'deceased' && stableSha256(evidenceClaims) === stableSha256(activeP570), profile.id + ' deceased status must be supported by retained active P570 claims');
      assert('Rule AM life status', (recorded?.statementIds || []).join('|') === evidenceClaims.map((claim) => claim.statementId).join('|'), profile.id + ' status evidence must list the active P570 statement IDs');
    } else if (profile.lifeStatus === 'living') {
      const recorded = profile.statusEvidence[0];
      const statusCapture = evidence.statusCaptures.find((capture) => capture.url === recorded?.url);
      const excerptHashValid = Boolean(recorded?.excerpt && recorded.capture?.excerptSha256 === textSha256(recorded.excerpt));
      const directCaptureValid = recorded?.capture?.verificationMethod === 'direct-http'
        && recorded.capture.status === 200
        && Boolean(recorded.capture.sha256 && /^[a-f0-9]{64}$/.test(recorded.capture.sha256))
        && statusCapture?.sha256 === recorded.capture.sha256;
      const browserCaptureValid = recorded?.capture?.verificationMethod === 'browser-search'
        && recorded.capture.status === null
        && Boolean(recorded.capture.excerptSha256)
        && statusCapture?.verificationMethod === 'browser-search';
      assert('Rule AM life status', activeP570.length === 0 && recorded?.status === 'living' && Boolean(recorded.url && recorded.capturedAt?.startsWith('2026-10-08')) && excerptHashValid && (directCaptureValid || browserCaptureValid), profile.id + ' living status must have a current captured or indexed publisher source and no active P570 claim');
      assert('Rule AM life status', person.sourceUrls?.includes(recorded?.url || '') === true, profile.id + ' living-status source must remain on the local profile');
    } else {
      assert('Rule AM life status', profile.id === 'nguyen-thi-binh' && activeP570.length === 0 && profile.statusEvidence[0]?.status === 'unknown', 'Only Nguyễn Thị Bình may remain unknown; missing P570 must not be treated as living');
    }

    const collisions = ALL_PEOPLE.filter((candidate) => candidate.id !== profile.id && candidate.wikidataId === profile.wikidataId);
    assert('Rule AM identity', collisions.length === 0, profile.id + ' Wikidata ID must not duplicate another local profile');
    const dayCount = ALL_PEOPLE.filter((candidate) => candidate.birthMonth === month && candidate.birthDay === Number(date.slice(8, 10))).length;
    const laterSameDayAdditions = ALL_PEOPLE.filter((candidate) => candidate.birthMonth === month && candidate.birthDay === Number(date.slice(8, 10)) && (BV017_JAN14_NEW_IDS.has(candidate.id) || BV017_JAN15_NEW_IDS.has(candidate.id) || BV017_JAN16_NEW_IDS.has(candidate.id) || BV017_JAN17_NEW_IDS.has(candidate.id) || BV017_JAN18_NEW_IDS.has(candidate.id) || BV017_JAN19_NEW_IDS.has(candidate.id) || BV017_JAN20_NEW_IDS.has(candidate.id) || BV017_JAN21_NEW_IDS.has(candidate.id) || BV017_JAN22_NEW_IDS.has(candidate.id) || BV017_JAN23_NEW_IDS.has(candidate.id) || BV017_JAN24_NEW_IDS.has(candidate.id) || BV017_JAN25_NEW_IDS.has(candidate.id) || BV017_JAN26_NEW_IDS.has(candidate.id) || BV017_JAN27_NEW_IDS.has(candidate.id))).length;
    const newDayCount = evidence.profiles.filter((candidate) => candidate.birthDate.slice(5) === date.slice(5)).length;
    assert('Rule AM coverage', newDayCount === 1 && dayCount - laterSameDayAdditions === 4, profile.id + ' must add one person to a previously three-person birthday and remain below the day cap at pilot review');
  }

  assert('Rule AM identity', expectedById.size === evidence.profiles.length, 'No duplicate identity rows may remain in the allowlist');
  for (let month = 1; month <= 10; month++) {
    assert('Rule AM monthly pilot', (profileIdsByMonth.get(month) || []).length === 3, 'Month ' + month + ' must contain exactly three pilot additions');
    assert('Rule AM monthly pilot', ALL_PEOPLE.filter((person) => person.birthMonth === month && BV017_EXPANSION_NEW_IDS.has(person.id)).length === 3, 'Local month ' + month + ' must contain exactly three allowlisted pilot profiles');
  }
  assert('Rule AM monthly pilot', evidence.profiles.every((profile) => {
    const month = Number(profile.birthDate.slice(5, 7));
    return month >= 1 && month <= 10;
  }) && !ALL_PEOPLE.some((person) => BV017_EXPANSION_NEW_IDS.has(person.id) && (person.birthMonth === 11 || person.birthMonth === 12)), 'Pilot additions must not expand the previously completed November/December months');

  const knownFields = Object.keys(PERSON_FIELD_LABELS) as PersonField[];
  assert('Rule AM fields', fieldCounts.size === knownFields.length && knownFields.every((field) => fieldCounts.has(field)), 'Pilot must exercise every value in the multi-field taxonomy');
  assert('Rule AM fields', evidence.summary.fieldAssignments === evidence.profiles.reduce((sum, profile) => sum + profile.fields.length, 0), 'Summary field assignments must match the profile allowlist');
  for (const field of knownFields) {
    assert('Rule AM fields', evidence.summary.fieldCounts[field] === fieldCounts.get(field), field + ' summary count must match the tagged profiles');
  }

  const vietnamese = countryCounts.get('VN') || 0;
  const unitedStates = countryCounts.get('US') || 0;
  const entrepreneurs = evidence.profiles.filter((profile) => profile.fields.includes('entrepreneurship')).length;
  const priorityProfileCount = evidence.profiles.filter((profile) => profile.fields.length > 0).length;
  const sportsOnly = evidence.profiles.filter((profile) => profile.category === 'athlete').length;
  assert('Rule AM diversity', vietnamese === 3 && evidence.summary.vietNamese === 3 && evidence.summary.vietnameseSharePercent === 10, 'Pilot must retain three Vietnamese profiles, a 10 percent share, without a quota substitution');
  assert('Rule AM diversity', unitedStates === 9 && evidence.summary.unitedStates === 9 && unitedStates / evidence.profiles.length <= 0.3, 'United States profiles must not exceed 30 percent of the pilot');
  assert('Rule AM diversity', priorityProfileCount === 30 && evidence.summary.priorityFieldProfileCount === 30 && entrepreneurs === 8 && evidence.summary.entrepreneurialProfiles === 8, 'Pilot must quantify priority fields and entrepreneurial coverage without claiming the later 50-founder target is complete');
  assert('Rule AM diversity', sportsOnly === 0 && evidence.summary.sportsOnlyProfileCount === 0, 'Pilot must not add a sports-only profile to satisfy a quota');

  const statusIds = evidence.statusCaptures.map((capture) => capture.id);
  assert('Rule AM status captures', statusIds.length === 4 && new Set(statusIds).size === 4, 'Exactly four current-source captures must support the four living profiles');
  assert('Rule AM status captures', evidence.statusCaptures.every((capture) => capture.capturedAt.startsWith('2026-10-08') && capture.excerptSha256 === textSha256(capture.excerpt)), 'Current-status source captures must retain their capture date and excerpt hashes');
  assert('Rule AM statuses', lifeStatusCounts.living === 4 && lifeStatusCounts.deceased === 25 && lifeStatusCounts.unknown === 1, 'Pilot life-status totals must remain 4 living, 25 deceased, and 1 unknown');
  assert('Rule AM statuses', evidence.summary.p570ConflictsWithStatusOnly === 1, 'The single multi-date P570 status case must be retained without assigning a local death date');
  assert('Rule AM total', ALL_PEOPLE.length === 1200 && ALL_PEOPLE.filter((person) => BV017_EXPANSION_NEW_IDS.has(person.id)).length === 30, 'The full local dataset must contain 1,200 profiles including this 30-person pilot and the January 1-27 batches');
}

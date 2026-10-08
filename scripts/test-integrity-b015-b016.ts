import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/B015-B016.json';
import rawContentEvidence from '../.ai/evidence/BV017-content-evidence.json';
import rawDeathVerification from '../.ai/evidence/BV017-death-verification.json';
import rawFieldsPilot from '../.ai/evidence/BV017-fields-pilot.json';
import { ALL_PEOPLE, HISTORY_EVENTS } from '../src/data/birthdays';
import { PERSON_FIELD_LABELS, type PersonField } from '../src/data/types';
import { isAdultOnDate } from './wikidata-candidates';
import { projectPersonBeforeBv017, sourceUrlsBeforeBv017, verifyBv017CorrectionManifest } from './bv017-corrections';
import { BV017_EXPANSION_NEW_IDS, runBv017ExpansionPilotIntegrity } from './test-bv017-expansion-pilot';
import { BV017_JAN1_NEW_IDS } from './test-bv017-january-1-batch';
import { BV017_JAN2_NEW_IDS } from './test-bv017-january-2-batch';
import { BV017_JAN3_NEW_IDS } from './test-bv017-january-3-batch';
import { BV017_JAN4_NEW_IDS } from './test-bv017-january-4-batch';
import { BV017_JAN5_NEW_IDS } from './test-bv017-january-5-batch';
import { BV017_JAN6_NEW_IDS } from './test-bv017-january-6-batch';
import { BV017_JAN7_NEW_IDS } from './test-bv017-january-7-batch';
import { BV017_JAN8_NEW_IDS } from './test-bv017-january-8-batch';
import { BV017_JAN9_NEW_IDS } from './test-bv017-january-9-batch';
import { BV017_JAN10_NEW_IDS } from './test-bv017-january-10-batch';
import { BV017_JAN11_NEW_IDS } from './test-bv017-january-11-batch';
import { BV017_JAN12_NEW_IDS } from './test-bv017-january-12-batch';
import { BV017_JAN13_NEW_IDS } from './test-bv017-january-13-batch';
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

type DobSource = { url: string; publisher: string; publisherCountry?: string | null; countryProofUrl?: string | null };
type EvidenceProfile = {
  id: string;
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  countryName: string;
  category: string;
  occupation: string;
  deathDate?: string;
  deathDatePrecision?: 'year' | 'month' | 'day' | 'presumed-day';
  deathDateSources?: readonly string[];
  deathDateEvidence?: readonly {
    url: string;
    publisher: string;
    dateText: string;
    excerpt: string;
    articlePublishedAt?: string;
    dateDerivation?: string;
    capture: { status: number; sha256?: string; excerptSha256?: string; bytesRead?: number; exactDate: boolean; nameMatched: boolean; verificationMethod: string };
  }[];
  lifeStatus?: 'living' | 'deceased' | 'unknown';
  dobSources: readonly DobSource[];
  supportingSources?: readonly { url: string; publisher: string; scope: string; browserExcerpt: string }[];
  identityEvidence: {
    wikidataLabel: string | null;
    selectedCountryCode: string;
    selectedOccupation: string;
    candidateOccupationTerms: readonly { qid: string; english: string; vietnamese: string | null }[];
    categoryRationale: string;
    countryEvidenceSourceUrls: readonly string[];
  };
};
type DeathEvidence = NonNullable<EvidenceProfile['deathDateEvidence']>[number] & {
  articlePublishedAt?: string;
  dateDerivation?: string;
};
type ClaimReference = { hash: string; snaks: Record<string, unknown> };
type P31Claim = {
  rank: string;
  value: string;
  references: number;
  referenceDetails: readonly ClaimReference[];
  qualifiers: Record<string, readonly unknown[]>;
};
type P569Claim = {
  rank: string;
  value: { time: string; precision: number; calendar: string; before: number; after: number; timezone: number };
  qualifiers: Record<string, readonly unknown[]>;
  references: readonly ClaimReference[];
};
type WikidataEntityAudit = {
  label: string | null;
  p31: readonly P31Claim[];
  p569: readonly P569Claim[];
  activeHumanP31: boolean;
  activeExactGregorianDob: boolean;
  activePreciseConflicts: readonly unknown[];
  activeCoarserYearConflicts: readonly unknown[];
  activeClaimsWithoutReferences: readonly { rank: string; value: { time: string } }[];
};
type EvidenceFile = {
  schemaVersion: number;
  cycle: string;
  capturedAt: string;
  scope: {
    months: readonly number[];
    profileCount: number;
    profilesPerDay: number;
    vietnamesePerMonth: number;
    novemberNewProfiles: number;
    decemberNewProfiles: number;
    decemberBaselineProfiles: number;
  };
  wikidataAudit: {
    retrievedAt: string;
    endpoint: string;
    calendarModel: string;
    entities: Record<string, WikidataEntityAudit>;
  };
  profiles: readonly EvidenceProfile[];
  sourceCaptures: Record<string, {
    profileId: string;
    wikidataId: string;
    expectedBirthDate: string;
    publisher: string;
    publisherCountry?: string | null;
    countryProofUrl?: string | null;
    verificationMethod: string;
    fullDobAndIdentityReviewed: boolean;
    browserExcerpt?: string | null;
    capture?: { status?: number | null; sha256?: string | null; exactDate?: boolean; excerpt?: string } | null;
  }>;
};
type ContentEvidenceFile = {
  schemaVersion: number;
  cycle: string;
  factCount: number;
  facts: readonly {
    id: string;
    wikidataId: string;
    factId: string;
    field: string;
    awardQid?: string;
    awardLabel?: string;
    displayText: string;
    sourceUrl: string;
    referenceUrls?: readonly string[];
    sourceText: string;
    evidencePhrase: string;
    excerpt: string;
    capture: { status: number; sha256?: string; excerptSha256?: string; bytesRead: number; nameMatched: boolean; claimTextMatched: boolean; yearMatched: boolean; verificationMethod: string };
  }[];
};
type DeathVerificationFile = {
  newProfileUpdates: Record<string, {
    deathDate: string;
    lifeStatus: 'deceased';
    deathDateSourceUrls: readonly string[];
    deathDatePrecision: 'day';
    deathDateEvidence?: readonly DeathEvidence[];
    rationale?: string;
  }>;
};
type FieldsPilotProfile = {
  id: string;
  fields: readonly PersonField[];
  fieldEvidence: readonly {
    field: PersonField;
    occupationClaims: readonly { qid: string; english: string; vietnamese: string | null }[];
    careerFactIds: readonly string[];
    rationale: string;
  }[];
};
type FieldsPilotFile = {
  schemaVersion: number;
  cycle: string;
  generatedAt: string;
  scope: { profileCount: number; months: readonly number[]; fieldCount: number; categoryPreserved: boolean };
  methodology: string;
  profiles: readonly FieldsPilotProfile[];
};

const evidence = rawEvidence as unknown as EvidenceFile;
const contentEvidence = rawContentEvidence as unknown as ContentEvidenceFile;
const deathVerification = rawDeathVerification as unknown as DeathVerificationFile;
const fieldsPilot = rawFieldsPilot as unknown as FieldsPilotFile;
const REVIEWED_PROFILE_MANIFEST_SHA256 = '0d1b8cbacc7283b4f812a39cbbe161e8afda2f71764790a09f7ffd56bc547cc6';
const BV017_CONTENT_FACTS_SHA256 = 'f6414d1f75f954959888969a8fe49255c0b3a110e61bb4f05565b2e561e0fdf2';
const BV017_FIELDS_PILOT_SHA256 = '907e2ea406fe097ec4130624859e31eab5d2035e22a564188e3ef9cefa295f08';
const REVIEWED_DEATH_MANIFEST_SHA256 = '7192c375a219ab00bbe5a9e30c7e7a5455f3230e5e1dbe9cd419d7328c0aaa73';
const REVIEWED_DEATH_EVIDENCE_SHA256 = '0aaeeb869b70a7027e25d72be7f5d5f49724ee38b30b1876215a67526c56c7ea';
const REVIEWED_NEW_PROFILE_DEATH_UPDATES_SHA256 = '78c1de0b37b3f85ca5392eed01cf5561511f28524c8bff939005e254d2b2254f';
export const B015_B016_NEW_IDS = new Set(evidence.profiles.map((profile) => profile.id));

export function isApprovedDobSource(profile: EvidenceProfile, qid: string, candidateUrl: string): boolean {
  try {
    const parsed = new URL(candidateUrl);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password && profile.wikidataId === qid && profile.dobSources.some((source) => source.url === candidateUrl);
  } catch {
    return false;
  }
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

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

export function runB015B016Integrity(assert: (suite: string, condition: boolean, message: string) => void): void {
  console.log('Checking Rule AJ: B015+B016 November/December allowlist, evidence, Wikidata claims, and baseline preservation...');
  verifyBv017CorrectionManifest(ALL_PEOPLE, assert);

  const approvedProfiles = new Map(evidence.profiles.map((profile) => [profile.id, profile]));
  const contentFactsById = new Map<string, ContentEvidenceFile['facts'][number][]>();
  for (const fact of contentEvidence.facts) {
    const facts = contentFactsById.get(fact.id) || [];
    facts.push(fact);
    contentFactsById.set(fact.id, facts);
  }
  assert('Rule AK content evidence', contentEvidence.schemaVersion === 1 && contentEvidence.cycle === 'BV-017', 'Career-content evidence must identify schema 1 and cycle BV-017');
  assert('Rule AK content evidence', contentEvidence.factCount === contentEvidence.facts.length && stableSha256(contentEvidence.facts) === BV017_CONTENT_FACTS_SHA256, 'Directly captured career facts must match their separately pinned SHA-256');
  assert('Rule AK content evidence', new Set(contentEvidence.facts.map((fact) => fact.factId)).size === contentEvidence.facts.length, 'Career-content evidence fact IDs must be unique');
  console.log('Checking Rule AL: BV-017 multi-valued field taxonomy pilot and evidence references...');
  assert('Rule AL field taxonomy', fieldsPilot.schemaVersion === 1 && fieldsPilot.cycle === 'BV-017' && fieldsPilot.scope.profileCount === 40 && fieldsPilot.scope.months.join(',') === '11,12' && fieldsPilot.scope.fieldCount === Object.keys(PERSON_FIELD_LABELS).length && fieldsPilot.scope.categoryPreserved, 'The field-tag pilot must declare 40 November/December profiles, all taxonomy fields, and unchanged legacy categories');
  assert('Rule AL field taxonomy', fieldsPilot.profiles.length === 40 && new Set(fieldsPilot.profiles.map((profile) => profile.id)).size === 40 && stableSha256(fieldsPilot.profiles) === BV017_FIELDS_PILOT_SHA256, 'The 40 reviewed field mappings must be unique and match their pinned review hash');
  const pilotFields = new Set<PersonField>();
  const pilotProfileIds = new Set(fieldsPilot.profiles.map((profile) => profile.id));
  for (const pilotProfile of fieldsPilot.profiles) {
    const person = ALL_PEOPLE.find((candidate) => candidate.id === pilotProfile.id);
    const reviewed = evidence.profiles.find((candidate) => candidate.id === pilotProfile.id);
    assert('Rule AL field taxonomy', Boolean(person && reviewed), pilotProfile.id + ' pilot mapping must target a reviewed November/December profile');
    if (!person || !reviewed) continue;
    assert('Rule AL field taxonomy', person.birthMonth === 11 || person.birthMonth === 12, pilotProfile.id + ' pilot must span the two reviewed data months');
    assert('Rule AL field taxonomy', stableSha256(person.fields || []) === stableSha256(pilotProfile.fields), pilotProfile.id + ' profile tags must match the reviewed pilot manifest');
    assert('Rule AL field taxonomy', pilotProfile.fields.length > 0 && new Set(pilotProfile.fields).size === pilotProfile.fields.length && pilotProfile.fields.every((field) => Object.hasOwn(PERSON_FIELD_LABELS, field)), pilotProfile.id + ' fields must be known unique taxonomy values');
    const evidenceFields = new Set(pilotProfile.fieldEvidence.map((entry) => entry.field));
    assert('Rule AL field taxonomy', pilotProfile.fieldEvidence.length === pilotProfile.fields.length && pilotProfile.fields.every((field) => evidenceFields.has(field)), pilotProfile.id + ' must provide evidence for every assigned field');
    const occupationTerms = reviewed.identityEvidence.candidateOccupationTerms;
    for (const fieldEvidence of pilotProfile.fieldEvidence) {
      pilotFields.add(fieldEvidence.field);
      const sourceClaimsMatch = fieldEvidence.occupationClaims.length > 0 && fieldEvidence.occupationClaims.every((claim) => occupationTerms.some((term) => term.qid === claim.qid && term.english === claim.english && term.vietnamese === claim.vietnamese));
      const careerFactsMatch = fieldEvidence.careerFactIds.length > 0 && fieldEvidence.careerFactIds.every((factId) => contentFactsById.get(pilotProfile.id)?.some((fact) => fact.factId === factId && fact.field === 'source-bio'));
      assert('Rule AL field taxonomy', sourceClaimsMatch || careerFactsMatch, pilotProfile.id + ' ' + fieldEvidence.field + ' must cite a retained occupation claim or directly captured career fact');
      assert('Rule AL field taxonomy', Boolean(fieldEvidence.rationale.trim()), pilotProfile.id + ' ' + fieldEvidence.field + ' needs a concise mapping rationale');
    }
  }
  assert('Rule AL field taxonomy', pilotFields.size === Object.keys(PERSON_FIELD_LABELS).length && Object.keys(PERSON_FIELD_LABELS).every((field) => pilotFields.has(field as PersonField)), 'The pilot must exercise every field taxonomy value');
  assert('Rule AL field taxonomy', [...pilotProfileIds].every((id) => B015_B016_NEW_IDS.has(id)), 'The pilot may tag only profiles in the reviewed 183-person source set');
  const approvedQids = new Set(evidence.profiles.map((profile) => profile.wikidataId));
  const reviewedIdentityManifest = evidence.profiles.map(({ id, wikidataId, birthDate, dobSources }) => ({ id, wikidataId, birthDate, dobSources }));
  assert('Rule AJ allowlist', stableSha256(reviewedIdentityManifest) === REVIEWED_PROFILE_MANIFEST_SHA256, 'Reviewed ID→QID→DOB→source manifest must match its separately pinned review hash');
  const reviewedDeathManifest = evidence.profiles.filter((profile) => Boolean(profile.deathDate)).map(({ id, wikidataId, deathDate, deathDatePrecision, deathDateSources, lifeStatus }) => ({ id, wikidataId, deathDate, deathDatePrecision, deathDateSources, lifeStatus }));
  assert('Rule AJ life status', stableSha256(reviewedDeathManifest) === REVIEWED_DEATH_MANIFEST_SHA256, 'Reviewed death-date manifest must match its separately pinned review hash');
  const reviewedDeathEvidenceManifest = evidence.profiles.filter((profile) => Boolean(profile.deathDate)).map(({ id, wikidataId, deathDate, deathDatePrecision, deathDateSources, deathDateEvidence }) => ({ id, wikidataId, deathDate, deathDatePrecision, deathDateSources, deathDateEvidence }));
  assert('Rule AJ life status', stableSha256(reviewedDeathEvidenceManifest) === REVIEWED_DEATH_EVIDENCE_SHA256, 'Reviewed death-date captures, snippets, and hashes must match their separately pinned review hash');
  assert('Rule AJ life status', stableSha256(deathVerification.newProfileUpdates) === REVIEWED_NEW_PROFILE_DEATH_UPDATES_SHA256, 'Reviewed B015/B016 life-status corrections must match their separately pinned review hash');
  const additions = ALL_PEOPLE.filter((person) => B015_B016_NEW_IDS.has(person.id));
  assert('Rule AJ', evidence.schemaVersion === 1 && evidence.cycle === 'BV-016 / B015+B016', 'Evidence must identify schema 1 and cycle BV-016 / B015+B016');
  assert('Rule AJ', evidence.scope.months.join(',') === '11,12' && evidence.scope.profileCount === 183 && evidence.scope.profilesPerDay === 3, 'Evidence must declare exactly 183 November/December profiles at three per day');
  assert('Rule AJ', evidence.scope.vietnamesePerMonth === 5 && evidence.scope.novemberNewProfiles === 90 && evidence.scope.decemberNewProfiles === 93 && evidence.scope.decemberBaselineProfiles === 1, 'Evidence must declare monthly profile and Vietnamese targets plus the December baseline');
  assert('Rule AJ', B015_B016_NEW_IDS.size === 183 && approvedProfiles.size === 183 && additions.length === 183, 'Exactly 183 unique allowlisted profiles must be present');
  assert('Rule AJ', approvedQids.size === 183 && new Set(additions.map((person) => person.wikidataId)).size === 183, 'The allowlist must contain 183 unique Wikidata IDs');
  assert('Rule AJ', additions.every((person) => approvedProfiles.has(person.id)), 'Every addition must be in the exact reviewed profile allowlist');
  assert('Rule AJ', !ALL_PEOPLE.some((person) => !B015_B016_NEW_IDS.has(person.id) && person.wikidataId && approvedQids.has(person.wikidataId)), 'No allowlisted Wikidata ID may duplicate a baseline profile');

  const countryProofUrls: Readonly<Record<string, string>> = {
    'Asian Football Confederation (AFC)': 'https://www.the-afc.com/en/more/privacy_policy.html',
    'Transfermarkt': 'https://www.transfermarkt.us/intern/impressum',
    'Olympic Council of Asia': 'https://oca.asia/council/oca-headquarters/',
    'L’Équipe': 'https://www.lequipe.fr/mentions-legales',
    'Volleyball World': 'https://en.volleyballworld.com/terms-of-service',
    'Badminton Asia': 'https://badmintonasia.org/about-badminton-asia/',
    'The Gymternet': 'https://thegymter.net/about/',
    'World Athletics': 'https://worldathletics.org/organisation/our-organisation/structure/headquarters',
    'Uzbekistan Athletics': 'https://uzathletics.uz/',
    'Asian Volleyball Confederation': 'https://asianvolleyball.net/new/headquarters/',
    'Asian Weightlifting Federation': 'https://awf.sport/focus-on-awf/',
    'International Weightlifting Federation': 'https://iwf.sport/focus-on-iwf/secretariat/',
    'Sofascore': 'https://corporate.sofascore.com/legal-information',
    'ESPN': 'https://espnpressroom.com/about/',
  };
  assert('Rule AJ evidence', Object.keys(evidence.sourceCaptures).length === 366, 'All 366 exact DOB source captures must be retained');
  const categoryLabels: Readonly<Record<string, string>> = {
    scientist: 'Khoa học', artist: 'Nghệ thuật', actor: 'Điện ảnh', athlete: 'Thể thao',
    history: 'Lịch sử', literature: 'Văn học', music: 'Âm nhạc', politics: 'Chính trị', entrepreneur: 'Doanh nhân',
  };
  const allSourceUrls: string[] = [];
  for (const person of additions) {
    const expected = approvedProfiles.get(person.id);
    assert('Rule AJ', Boolean(expected), 'Unexpected profile ID: ' + person.id);
    if (!expected) continue;
    assert('Rule AJ', person.wikidataId === expected.wikidataId, person.id + ' QID must match the exact allowlist');
    assert('Rule AJ', person.birthDate === expected.birthDate && /^\d{4}-(11|12)-\d{2}$/.test(person.birthDate), person.id + ' full DOB must match the exact allowlist');
    assert('Rule AJ', person.birthYear === Number(person.birthDate.slice(0, 4)) && person.birthMonth === Number(person.birthDate.slice(5, 7)) && person.birthDay === Number(person.birthDate.slice(8, 10)), person.id + ' split DOB fields must match');
    assert('Rule AJ', person.slug === person.id && person.countryCode === expected.countryCode && person.countryName === expected.countryName && person.category === expected.category, person.id + ' slug, country, and category must match');
    assert('Rule AJ', person.occupation?.length === 1 && person.occupation[0] === expected.occupation, person.id + ' occupation must match');
    assert('Rule AJ life status', person.deathDate === expected.deathDate && person.lifeStatus === expected.lifeStatus, person.id + ' recorded life status and death date must match reviewed evidence');
    assert('Rule AJ life status', person.deathDatePrecision === expected.deathDatePrecision, person.id + ' death-date precision must match reviewed evidence');
    assert('Rule AJ life status', person.lifeStatus !== 'living' || Boolean(person.deathDate === undefined), person.id + ' life status must be represented consistently');
    assert('Rule AJ life status', !person.deathDate || (person.lifeStatus === 'deceased' && (expected.deathDateSources || []).length > 0 && expected.deathDateSources!.join('|') === (person.deathDateSourceUrls || []).join('|') && expected.deathDateSources!.every((url) => person.sourceUrls?.includes(url))), person.id + ' death date requires deceased status and retained source URLs');
    if (person.deathDate) {
      const deathEvidence = expected.deathDateEvidence || [];
      assert('Rule AJ life status', expected.deathDatePrecision === 'day' && deathEvidence.length === (expected.deathDateSources || []).length && deathEvidence.every((capture) => {
        const directHttpCapture = ['direct-http', 'direct-http+publication-date-weekday'].includes(capture.capture.verificationMethod)
          && Boolean(capture.capture.sha256 && /^[a-f0-9]{64}$/.test(capture.capture.sha256));
        const browserCapture = capture.capture.verificationMethod === 'browser-direct'
          && Boolean(capture.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(capture.capture.excerptSha256)
            && createHash('sha256').update(capture.excerpt).digest('hex') === capture.capture.excerptSha256);
        const datedWeekdayDerivation = capture.capture.verificationMethod !== 'direct-http+publication-date-weekday'
          || Boolean(capture.articlePublishedAt && capture.dateDerivation && capture.dateDerivation.includes('Wednesday night'));
        return Boolean(capture.url && capture.publisher && capture.dateText
          && capture.excerpt.toLocaleLowerCase().includes(capture.dateText.toLocaleLowerCase())
          && capture.capture.status === 200 && capture.capture.exactDate && capture.capture.nameMatched
          && (directHttpCapture || browserCapture) && datedWeekdayDerivation && (expected.deathDateSources || []).includes(capture.url));
      }), person.id + ' death date must have a date-specific, identity-matched retained publisher capture');
    }
    assert('Rule AJ', person.categoryLabel === categoryLabels[expected.category], person.id + ' category label must match');
    assert('Rule AJ', person.verifiedAt === '2026-10-07' && Boolean(person.shortDescription && person.biography) && Array.isArray(person.highlights) && person.highlights.length >= 2, person.id + ' requires dated biography and at least two highlights');
    assert('Rule AJ', person.sourceUrls?.includes('https://www.wikidata.org/wiki/' + expected.wikidataId) === true, person.id + ' must include the exact Wikidata URL');
    assert('Rule AJ source', expected.dobSources.length === 2 && new Set(expected.dobSources.map((source) => source.publisher)).size === 2, person.id + ' requires two distinct DOB publishers');
    assert('Rule AJ source', new Set(expected.dobSources.map((source) => hostname(source.url))).size === 2, person.id + ' requires two distinct source hosts');
    const approvedUrls = expected.dobSources.map((source) => source.url);
    allSourceUrls.push(...approvedUrls);
    const nonWikiUrls = sourceUrlsBeforeBv017(person).filter((url) => {
      const host = hostname(url);
      return host && !host.endsWith('wikipedia.org') && !host.endsWith('wikidata.org') && !host.endsWith('wikimedia.org');
    });
    const supportingSources = expected.supportingSources || [];
    const contentFacts = contentFactsById.get(person.id) || [];
    const contentUrls = contentFacts.map((fact) => fact.sourceUrl);
    for (const fact of contentFacts) {
      if (fact.field === 'P166') {
        assert('Rule AK content evidence', Boolean(fact.wikidataId === expected.wikidataId && fact.awardQid && fact.awardLabel && fact.referenceUrls?.includes(fact.sourceUrl)), person.id + ' career fact must map to its reviewed P166 award and reference URL');
      } else {
        assert('Rule AK content evidence', fact.field === 'source-bio' && fact.wikidataId === expected.wikidataId, person.id + ' biography fact must map to the reviewed person and source');
      }
      assert('Rule AK content evidence', Boolean(person.biography?.includes(fact.displayText) && person.highlights?.includes(fact.displayText)), person.id + ' biography and highlights must contain the exact reviewed, source-backed career fact');
      const directHttpCapture = fact.capture.verificationMethod === 'direct-http'
        && Boolean(fact.capture.sha256 && /^[a-f0-9]{64}$/.test(fact.capture.sha256) && fact.capture.bytesRead > 0);
      const browserCapture = fact.capture.verificationMethod === 'browser-direct'
        && Boolean(fact.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(fact.capture.excerptSha256)
          && createHash('sha256').update(fact.excerpt).digest('hex') === fact.capture.excerptSha256
          && fact.capture.bytesRead === Buffer.byteLength(fact.excerpt, 'utf8'));
      assert('Rule AK content evidence', (person.sourceUrls || []).includes(fact.sourceUrl) && fact.capture.status === 200 && fact.capture.bytesRead > 0 && fact.capture.nameMatched && fact.capture.claimTextMatched && (directHttpCapture || browserCapture) && Boolean(fact.sourceText && fact.evidencePhrase && fact.excerpt.includes(fact.evidencePhrase)), person.id + ' career fact must retain an identity-matched, hashed direct or browser capture containing its supporting phrase');
    }
    const expectedSourceUrls = [...new Set(['https://www.wikidata.org/wiki/' + expected.wikidataId, ...approvedUrls, ...supportingSources.map((source) => source.url), ...(expected.deathDateSources || []), ...contentUrls])];
    assert('Rule AJ source', person.sourceUrls?.length === expectedSourceUrls.length && expectedSourceUrls.every((url) => person.sourceUrls?.includes(url)) && (person.sourceUrls || []).every((url) => expectedSourceUrls.includes(url)), person.id + ' source URLs must match the exact DOB pair and reviewed institutional support');
    assert('Rule AJ source', nonWikiUrls.length === 2 + supportingSources.length && [...approvedUrls, ...supportingSources.map((source) => source.url)].every((url) => nonWikiUrls.includes(url)), person.id + ' must include exactly its approved DOB pair and any reviewed institutional support');
    for (const support of supportingSources) {
      assert('Rule AJ evidence', Boolean(hostname(support.url) && support.publisher && support.scope && support.browserExcerpt), person.id + ' institutional support must retain URL, publisher, purpose, and excerpt');
      assert('Rule AJ evidence', (person.sourceUrls || []).includes(support.url), person.id + ' is missing reviewed institutional support ' + support.url);
    }
    assert('Rule AJ evidence', expected.identityEvidence.selectedCountryCode === expected.countryCode && expected.identityEvidence.selectedOccupation === expected.occupation && expected.identityEvidence.candidateOccupationTerms.length > 0 && expected.identityEvidence.candidateOccupationTerms.every((term) => Boolean(term.qid && term.english) && (term.vietnamese === null || typeof term.vietnamese === 'string')) && Boolean(expected.identityEvidence.wikidataLabel && expected.identityEvidence.categoryRationale), person.id + ' identity and role mapping must retain typed Wikidata rationale');
    assert('Rule AJ evidence', expected.identityEvidence.countryEvidenceSourceUrls.length === 2 && approvedUrls.every((url) => expected.identityEvidence.countryEvidenceSourceUrls.includes(url)), person.id + ' country mapping must retain both reviewed sources');

    for (const source of expected.dobSources) {
      const capture = evidence.sourceCaptures[source.url];
      assert('Rule AJ source positive', isApprovedDobSource(expected, expected.wikidataId, source.url), 'Exact source URL must map to its reviewed QID: ' + source.url);
      assert('Rule AJ evidence', Boolean(capture) && capture.profileId === person.id && capture.wikidataId === expected.wikidataId && capture.expectedBirthDate === expected.birthDate && capture.publisher === source.publisher && capture.fullDobAndIdentityReviewed === true, 'Capture must bind the exact ID, QID, date, and publisher: ' + source.url);
      assert('Rule AJ evidence', capture?.verificationMethod === 'direct-http' || (capture?.verificationMethod === 'browser-direct' && Boolean(capture.browserExcerpt)), 'Capture must use direct HTTP or include a reviewed browser excerpt: ' + source.url);
      if (capture?.verificationMethod === 'direct-http') {
        assert('Rule AJ evidence', capture.capture?.status === 200 && Boolean(capture.capture.sha256) && capture.capture.exactDate === true, 'Direct HTTP capture must retain status, body hash, and exact date: ' + source.url);
      }
      assert('Rule AJ source negative', !isApprovedDobSource(expected, 'Q0', source.url), 'Source validator must reject a mismatched QID: ' + source.url);
      assert('Rule AJ source negative', !isApprovedDobSource(expected, expected.wikidataId, source.url + '#unreviewed'), 'Source validator must reject an unreviewed fragment: ' + source.url);
      const queryVariant = new URL(source.url);
      queryVariant.searchParams.set('unreviewed', '1');
      assert('Rule AJ source negative', !isApprovedDobSource(expected, expected.wikidataId, queryVariant.href), 'Source validator must reject an unreviewed query: ' + source.url);
      const pathVariant = new URL(source.url);
      pathVariant.pathname = pathVariant.pathname.replace(/\/$/, '') + '/unreviewed';
      assert('Rule AJ source negative', !isApprovedDobSource(expected, expected.wikidataId, pathVariant.href), 'Source validator must reject an appended path: ' + source.url);
      const lookalike = new URL(source.url);
      lookalike.hostname += '.evil.example';
      assert('Rule AJ source negative', !isApprovedDobSource(expected, expected.wikidataId, lookalike.href), 'Source validator must reject a lookalike hostname: ' + source.url);
      assert('Rule AJ source negative', !isApprovedDobSource(expected, expected.wikidataId, 'not-a-url'), 'Source validator must reject malformed URLs');
      if (person.countryCode === 'VN') {
        assert('Rule AJ Vietnamese', Boolean(source.publisherCountry && source.publisherCountry !== 'VN' && source.countryProofUrl === countryProofUrls[source.publisher]), person.id + ' requires non-Vietnamese publisher proof for ' + source.publisher);
        assert('Rule AJ Vietnamese', capture.publisherCountry === source.publisherCountry && capture.countryProofUrl === source.countryProofUrl, person.id + ' capture must preserve publisher-country proof');
      }
    }
  }
  for (const [id, update] of Object.entries(deathVerification.newProfileUpdates)) {
    const expected = approvedProfiles.get(id);
    assert('Rule AJ life status', Boolean(expected), id + ' death correction must target a reviewed B015/B016 profile');
    if (!expected) continue;
    assert('Rule AJ life status', update.deathDate === expected.deathDate && update.lifeStatus === expected.lifeStatus && update.deathDatePrecision === expected.deathDatePrecision, id + ' death correction map must match the profile allowlist');
    assert('Rule AJ life status', update.deathDateSourceUrls.length > 0 && update.deathDateSourceUrls.every((url) => [
      ...expected.dobSources.map((source) => source.url),
      ...(expected.supportingSources || []).map((source) => source.url),
      ...(expected.deathDateSources || []),
    ].includes(url)), id + ' death correction URLs must resolve to reviewed profile sources');
    if (update.deathDateEvidence) {
      assert('Rule AJ life status', stableSha256(update.deathDateEvidence) === stableSha256(expected.deathDateEvidence || []), id + ' death correction map must retain the same reviewed evidence as the profile allowlist');
      assert('Rule AJ life status', Boolean(update.rationale), id + ' newly reviewed death correction must explain its evidence and capture hash scope');
    }
  }
  assert('Rule AJ source', allSourceUrls.length === 366 && new Set(allSourceUrls).size === 366, 'All 366 independent DOB source URLs must be unique');

  const november = additions.filter((person) => person.birthMonth === 11);
  const december = additions.filter((person) => person.birthMonth === 12);
  const novemberVietnamese = november.filter((person) => person.countryCode === 'VN');
  const decemberVietnamese = december.filter((person) => person.countryCode === 'VN');
  assert('Rule AJ balance', november.length === 90 && december.length === 93, 'Require 90 November and 93 December additions');
  assert('Rule AJ balance', novemberVietnamese.length === 5 && decemberVietnamese.length === 5, 'Require exactly five Vietnamese profiles in each month');
  assert('Rule AJ balance', novemberVietnamese.length / november.length >= 0.05 && decemberVietnamese.length / december.length >= 0.05, 'Each month must meet the five-percent Vietnamese minimum');
  for (let day = 1; day <= 30; day++) {
    const additionsForDay = november.filter((person) => person.birthDay === day);
    const totalForDay = ALL_PEOPLE.filter((person) => person.birthMonth === 11 && person.birthDay === day);
    assert('Rule AJ coverage', additionsForDay.length === 3 && totalForDay.length === 3 && totalForDay.length <= 8, 'November ' + day + ' must contain three additions and at most eight total profiles');
  }
  for (let day = 1; day <= 31; day++) {
    const additionsForDay = december.filter((person) => person.birthDay === day);
    const totalForDay = ALL_PEOPLE.filter((person) => person.birthMonth === 12 && person.birthDay === day);
    const expectedTotal = day === 12 ? 4 : 3;
    assert('Rule AJ coverage', additionsForDay.length === 3 && totalForDay.length === expectedTotal && totalForDay.length <= 8, 'December ' + day + ' must contain three additions and ' + expectedTotal + ' total profiles');
  }

  const audit = evidence.wikidataAudit;
  const calendar = 'http://www.wikidata.org/entity/Q1985727';
  assert('Rule AJ Wikidata', audit.retrievedAt === '2026-10-07' && audit.endpoint.startsWith('https://www.wikidata.org/w/api.php') && audit.calendarModel === calendar, 'Wikidata audit must identify its endpoint, retrieval date, and Gregorian calendar');
  assert('Rule AJ Wikidata', Object.keys(audit.entities).length === 183, 'Wikidata audit must include all 183 QIDs');
  const noReferenceQids: string[] = [];
  for (const person of additions) {
    const expected = approvedProfiles.get(person.id);
    if (!expected) continue;
    const entity = audit.entities[expected.wikidataId];
    assert('Rule AJ Wikidata', Boolean(entity), 'Wikidata audit is missing ' + expected.wikidataId);
    if (!entity) continue;
    assert('Rule AJ Wikidata', entity.activeHumanP31 && entity.p31.some((claim) => claim.rank !== 'deprecated' && claim.value === 'Q5'), person.id + ' must be P31 human');
    assert('Rule AJ Wikidata', entity.activeExactGregorianDob && entity.activePreciseConflicts.length === 0 && entity.activeCoarserYearConflicts.length === 0, person.id + ' must have exact Gregorian P569 without active conflicts');
    assert('Rule AJ Wikidata', entity.p31.length > 0 && entity.p31.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && Number.isInteger(claim.references) && claim.references >= 0 && Array.isArray(claim.referenceDetails) && claim.referenceDetails.length === claim.references && claim.referenceDetails.every((reference) => Boolean(reference.hash) && typeof reference.snaks === 'object') && claim.qualifiers !== undefined && typeof claim.qualifiers === 'object'), person.id + ' P31 ranks, qualifiers, and reference details must be preserved');
    assert('Rule AJ Wikidata', entity.p569.length > 0 && entity.p569.every((claim) => ['preferred', 'normal', 'deprecated'].includes(claim.rank) && claim.value.calendar === calendar && claim.value.precision >= 0 && claim.value.precision <= 14 && Number.isInteger(claim.value.before) && Number.isInteger(claim.value.after) && Number.isInteger(claim.value.timezone) && claim.qualifiers !== undefined && typeof claim.qualifiers === 'object' && Array.isArray(claim.references) && claim.references.every((reference) => Boolean(reference.hash) && typeof reference.snaks === 'object')), person.id + ' P569 ranks, qualifiers, calendar, precision, and references must be preserved');
    const activeClaims = entity.p569.filter((claim) => claim.rank !== 'deprecated');
    const exactClaims = activeClaims.filter((claim) => claim.value.precision === 11 && claim.value.calendar === calendar);
    assert('Rule AJ Wikidata', exactClaims.some((claim) => claim.value.time.slice(1, 11) === expected.birthDate), person.id + ' must have exact Gregorian precision-11 DOB ' + expected.birthDate);
    assert('Rule AJ Wikidata', activeClaims.filter((claim) => claim.value.precision >= 11).every((claim) => claim.value.time.slice(1, 11) === expected.birthDate), person.id + ' has an active exact or more-precise DOB conflict');
    assert('Rule AJ Wikidata', activeClaims.filter((claim) => claim.value.precision < 11).every((claim) => claim.value.time.slice(1, 5) === expected.birthDate.slice(0, 4)), person.id + ' has an active coarser P569 year conflict');
    const noReferenceClaims = activeClaims.filter((claim) => claim.references.length === 0);
    if (noReferenceClaims.length) noReferenceQids.push(expected.wikidataId);
    assert('Rule AJ Wikidata audit', noReferenceClaims.length === entity.activeClaimsWithoutReferences.length && noReferenceClaims.every((claim) => entity.activeClaimsWithoutReferences.some((reported) => reported.rank === claim.rank && reported.value.time === claim.value.time)), person.id + ' must report every active P569 claim without references');
    assert('Rule AJ age', isAdultOnDate(expected.birthDate, '2026-10-07'), person.id + ' must be an adult on the review date');
  }
  assert('Rule AJ Wikidata audit', noReferenceQids.sort().join(',') === 'Q11891308,Q121028378,Q137214005', 'The three active P569 claims without references must remain explicitly recorded');

  const baselinePeople = ALL_PEOPLE.filter((person) => !B015_B016_NEW_IDS.has(person.id) && !BV017_EXPANSION_NEW_IDS.has(person.id) && !BV017_JAN1_NEW_IDS.has(person.id) && !BV017_JAN2_NEW_IDS.has(person.id) && !BV017_JAN3_NEW_IDS.has(person.id) && !BV017_JAN4_NEW_IDS.has(person.id) && !BV017_JAN5_NEW_IDS.has(person.id) && !BV017_JAN6_NEW_IDS.has(person.id) && !BV017_JAN7_NEW_IDS.has(person.id) && !BV017_JAN8_NEW_IDS.has(person.id) && !BV017_JAN9_NEW_IDS.has(person.id) && !BV017_JAN10_NEW_IDS.has(person.id) && !BV017_JAN11_NEW_IDS.has(person.id) && !BV017_JAN12_NEW_IDS.has(person.id) && !BV017_JAN13_NEW_IDS.has(person.id) && !BV017_JAN14_NEW_IDS.has(person.id) && !BV017_JAN15_NEW_IDS.has(person.id) && !BV017_JAN16_NEW_IDS.has(person.id) && !BV017_JAN17_NEW_IDS.has(person.id) && !BV017_JAN18_NEW_IDS.has(person.id) && !BV017_JAN19_NEW_IDS.has(person.id) && !BV017_JAN20_NEW_IDS.has(person.id) && !BV017_JAN21_NEW_IDS.has(person.id) && !BV017_JAN22_NEW_IDS.has(person.id) && !BV017_JAN23_NEW_IDS.has(person.id) && !BV017_JAN24_NEW_IDS.has(person.id) && !BV017_JAN25_NEW_IDS.has(person.id) && !BV017_JAN26_NEW_IDS.has(person.id) && !BV017_JAN27_NEW_IDS.has(person.id)).sort((a, b) => a.id.localeCompare(b.id));
  assert('Rule AJ baseline', baselinePeople.length === 937, 'Preserve all 937 baseline people');
  assert('Rule AJ baseline', stableSha256(baselinePeople.map(projectPersonBeforeBv017)) === '889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa', 'All 937 baseline people must remain deep-equal after the independently verified BV-017 correction projection');
  assert('Rule AJ baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All four baseline history events must remain deep-equal');
  const coveredDays = new Set(ALL_PEOPLE.map((person) => person.birthMonth + '-' + person.birthDay));
  assert('Rule AJ total', ALL_PEOPLE.length === 1200, 'Expected 1,200 total people after the 30-profile BV-017 pilot and January 1-27 batches');
  assert('Rule AJ coverage', coveredDays.size === 366, 'Expected 366 covered calendar days');
  console.log('B015+B016 additions: ' + additions.length + '; Vietnamese: November ' + novemberVietnamese.length + ', December ' + decemberVietnamese.length + '; active P569 claims without references: ' + noReferenceQids.length + '; coverage: ' + coveredDays.size + '/366');
  runBv017ExpansionPilotIntegrity(assert);
}

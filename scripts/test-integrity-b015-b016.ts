import { createHash } from 'node:crypto';
import rawEvidence from '../.ai/evidence/B015-B016.json';
import { ALL_PEOPLE, HISTORY_EVENTS } from '../src/data/birthdays';
import { isAdultOnDate } from './wikidata-candidates';

type DobSource = { url: string; publisher: string; publisherCountry?: string | null; countryProofUrl?: string | null };
type EvidenceProfile = {
  id: string;
  wikidataId: string;
  birthDate: string;
  countryCode: string;
  countryName: string;
  category: string;
  occupation: string;
  dobSources: readonly DobSource[];
  supportingSources?: readonly { url: string; publisher: string; scope: string; browserExcerpt: string }[];
  identityEvidence: {
    wikidataLabel: string | null;
    selectedCountryCode: string;
    selectedOccupation: string;
    candidateOccupationTerms: readonly string[];
    categoryRationale: string;
    countryEvidenceSourceUrls: readonly string[];
  };
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
    capture?: { status?: number | null; sha256?: string | null; exactDate?: boolean } | null;
  }>;
};

const evidence = rawEvidence as unknown as EvidenceFile;
export const B015_B016_NEW_IDS = new Set(evidence.profiles.map((profile) => profile.id));

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

  const approvedProfiles = new Map(evidence.profiles.map((profile) => [profile.id, profile]));
  const approvedQids = new Set(evidence.profiles.map((profile) => profile.wikidataId));
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
    assert('Rule AJ', person.categoryLabel === categoryLabels[expected.category], person.id + ' category label must match');
    assert('Rule AJ', person.verifiedAt === '2026-10-07' && Boolean(person.shortDescription && person.biography) && Array.isArray(person.highlights) && person.highlights.length >= 2, person.id + ' requires dated biography and at least two highlights');
    assert('Rule AJ', person.sourceUrls?.includes('https://www.wikidata.org/wiki/' + expected.wikidataId) === true, person.id + ' must include the exact Wikidata URL');
    assert('Rule AJ source', expected.dobSources.length === 2 && new Set(expected.dobSources.map((source) => source.publisher)).size === 2, person.id + ' requires two distinct DOB publishers');
    assert('Rule AJ source', new Set(expected.dobSources.map((source) => hostname(source.url))).size === 2, person.id + ' requires two distinct source hosts');
    const approvedUrls = expected.dobSources.map((source) => source.url);
    allSourceUrls.push(...approvedUrls);
    const nonWikiUrls = (person.sourceUrls || []).filter((url) => {
      const host = hostname(url);
      return host && !host.endsWith('wikipedia.org') && !host.endsWith('wikidata.org') && !host.endsWith('wikimedia.org');
    });
    const supportingSources = expected.supportingSources || [];
    const expectedSourceUrls = ['https://www.wikidata.org/wiki/' + expected.wikidataId, ...approvedUrls, ...supportingSources.map((source) => source.url)];
    assert('Rule AJ source', person.sourceUrls?.length === expectedSourceUrls.length && expectedSourceUrls.every((url) => person.sourceUrls?.includes(url)) && (person.sourceUrls || []).every((url) => expectedSourceUrls.includes(url)), person.id + ' source URLs must match the exact DOB pair and reviewed institutional support');
    assert('Rule AJ source', nonWikiUrls.length === 2 + supportingSources.length && [...approvedUrls, ...supportingSources.map((source) => source.url)].every((url) => nonWikiUrls.includes(url)), person.id + ' must include exactly its approved DOB pair and any reviewed institutional support');
    for (const support of supportingSources) {
      assert('Rule AJ evidence', Boolean(hostname(support.url) && support.publisher && support.scope && support.browserExcerpt), person.id + ' institutional support must retain URL, publisher, purpose, and excerpt');
      assert('Rule AJ evidence', (person.sourceUrls || []).includes(support.url), person.id + ' is missing reviewed institutional support ' + support.url);
    }
    assert('Rule AJ evidence', expected.identityEvidence.selectedCountryCode === expected.countryCode && expected.identityEvidence.selectedOccupation === expected.occupation && expected.identityEvidence.candidateOccupationTerms.length > 0 && Boolean(expected.identityEvidence.wikidataLabel && expected.identityEvidence.categoryRationale), person.id + ' identity and role mapping must retain Wikidata rationale');
    assert('Rule AJ evidence', expected.identityEvidence.countryEvidenceSourceUrls.length === 2 && approvedUrls.every((url) => expected.identityEvidence.countryEvidenceSourceUrls.includes(url)), person.id + ' country mapping must retain both reviewed sources');

    for (const source of expected.dobSources) {
      const capture = evidence.sourceCaptures[source.url];
      assert('Rule AJ source positive', evidence.profiles.some((profile) => profile.wikidataId === expected.wikidataId && profile.dobSources.some((candidate) => candidate.url === source.url)), 'Exact source URL must map to its reviewed QID: ' + source.url);
      assert('Rule AJ evidence', Boolean(capture) && capture.profileId === person.id && capture.wikidataId === expected.wikidataId && capture.expectedBirthDate === expected.birthDate && capture.publisher === source.publisher && capture.fullDobAndIdentityReviewed === true, 'Capture must bind the exact ID, QID, date, and publisher: ' + source.url);
      assert('Rule AJ evidence', capture?.verificationMethod === 'direct-http' || (capture?.verificationMethod === 'browser-direct' && Boolean(capture.browserExcerpt)), 'Capture must use direct HTTP or include a reviewed browser excerpt: ' + source.url);
      if (capture?.verificationMethod === 'direct-http') {
        assert('Rule AJ evidence', capture.capture?.status === 200 && Boolean(capture.capture.sha256) && capture.capture.exactDate === true, 'Direct HTTP capture must retain status, body hash, and exact date: ' + source.url);
      }
      assert('Rule AJ source negative', !evidence.profiles.some((profile) => profile.wikidataId === 'Q0' && profile.dobSources.some((candidate) => candidate.url === source.url)), 'Source must reject a mismatched QID: ' + source.url);
      assert('Rule AJ source negative', !expected.dobSources.some((candidate) => candidate.url === source.url + '#unreviewed'), 'Source must reject an unreviewed fragment: ' + source.url);
      const queryVariant = new URL(source.url);
      queryVariant.searchParams.set('unreviewed', '1');
      assert('Rule AJ source negative', !expected.dobSources.some((candidate) => candidate.url === queryVariant.href), 'Source must reject an unreviewed query: ' + source.url);
      const pathVariant = new URL(source.url);
      pathVariant.pathname = pathVariant.pathname.replace(/\/$/, '') + '/unreviewed';
      assert('Rule AJ source negative', !expected.dobSources.some((candidate) => candidate.url === pathVariant.href), 'Source must reject an appended path: ' + source.url);
      const lookalike = new URL(source.url);
      lookalike.hostname += '.evil.example';
      assert('Rule AJ source negative', !expected.dobSources.some((candidate) => candidate.url === lookalike.href), 'Source must reject a lookalike hostname: ' + source.url);
      assert('Rule AJ source negative', !expected.dobSources.some((candidate) => candidate.url === 'not-a-url'), 'Source must reject malformed URLs');
      if (person.countryCode === 'VN') {
        assert('Rule AJ Vietnamese', Boolean(source.publisherCountry && source.publisherCountry !== 'VN' && source.countryProofUrl === countryProofUrls[source.publisher]), person.id + ' requires non-Vietnamese publisher proof for ' + source.publisher);
        assert('Rule AJ Vietnamese', capture.publisherCountry === source.publisherCountry && capture.countryProofUrl === source.countryProofUrl, person.id + ' capture must preserve publisher-country proof');
      }
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

  const baselinePeople = ALL_PEOPLE.filter((person) => !B015_B016_NEW_IDS.has(person.id)).sort((a, b) => a.id.localeCompare(b.id));
  assert('Rule AJ baseline', baselinePeople.length === 937, 'Preserve all 937 baseline people');
  assert('Rule AJ baseline', stableSha256(baselinePeople) === '889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa', 'All 937 baseline people must remain deep-equal');
  assert('Rule AJ baseline', stableSha256(HISTORY_EVENTS) === '6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07', 'All four baseline history events must remain deep-equal');
  const coveredDays = new Set(ALL_PEOPLE.map((person) => person.birthMonth + '-' + person.birthDay));
  assert('Rule AJ total', ALL_PEOPLE.length === 1120, 'Expected 1120 total people after B015+B016');
  assert('Rule AJ coverage', coveredDays.size === 366, 'Expected 366 covered calendar days');
  console.log('B015+B016 additions: ' + additions.length + '; Vietnamese: November ' + novemberVietnamese.length + ', December ' + decemberVietnamese.length + '; active P569 claims without references: ' + noReferenceQids.length + '; coverage: ' + coveredDays.size + '/366');
}

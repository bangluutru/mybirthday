import { createHash } from 'node:crypto';
import rawDeathVerification from '../.ai/evidence/BV017-death-verification.json';
import rawBaselineProjection from '../.ai/evidence/BV017-baseline-projection.json';
import rawDataAudit from '../.ai/evidence/BV017-data-audit.json';
import rawB015B016 from '../.ai/evidence/B015-B016.json';
import rawQualityCorrections from '../.ai/evidence/BV017-quality-corrections.json';
import rawJanuary1Batch from '../.ai/evidence/BV017-january-1-batch.json';
import rawJanuary2Batch from '../.ai/evidence/BV017-january-2-batch.json';
import rawJanuary3Batch from '../.ai/evidence/BV017-january-3-batch.json';
import rawJanuary4Batch from '../.ai/evidence/BV017-january-4-batch.json';
import rawJanuary5Batch from '../.ai/evidence/BV017-january-5-batch.json';
import rawJanuary6Batch from '../.ai/evidence/BV017-january-6-batch.json';
import rawJanuary7Batch from '../.ai/evidence/BV017-january-7-batch.json';
import rawJanuary8Batch from '../.ai/evidence/BV017-january-8-batch.json';
import rawJanuary9Batch from '../.ai/evidence/BV017-january-9-batch.json';
import rawJanuary10Batch from '../.ai/evidence/BV017-january-10-batch.json';
import rawJanuary11Batch from '../.ai/evidence/BV017-january-11-batch.json';
import rawJanuary12Batch from '../.ai/evidence/BV017-january-12-batch.json';
import rawJanuary13Batch from '../.ai/evidence/BV017-january-13-batch.json';
import rawJanuary14Batch from '../.ai/evidence/BV017-january-14-batch.json';
import rawJanuary15Batch from '../.ai/evidence/BV017-january-15-batch.json';
import rawJanuary16Batch from '../.ai/evidence/BV017-january-16-batch.json';
import rawJanuary17Batch from '../.ai/evidence/BV017-january-17-batch.json';
import rawReviewSample from '../.ai/evidence/BV017-review-sample.json';
import rawDuplicateHighlightReview from '../.ai/evidence/BV017-duplicate-highlight-review.json';

type PersonLike = {
  id: string;
  name: string;
  birthDate: string;
  birthMonth: number;
  category: string;
  countryCode: string;
  shortDescription: string;
  sourceUrls?: readonly string[];
  deathDate?: string;
  deathDatePrecision?: string;
  deathDateSourceUrls?: readonly string[];
  lifeStatus?: string;
  biography?: string;
  highlights?: readonly string[];
};

type Correction = {
  id: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

type BaselineProjectionProfile = {
  id: string;
  before: Record<string, unknown>;
  remove: readonly string[];
};

type CapturedSourceEvidence = {
  url: string;
  dateText: string;
  excerpt: string;
  capture: {
    status: number;
    sha256: string;
    exactDate: boolean;
    nameMatched: boolean;
    verificationMethod: string;
  };
};

type ConflictReview = {
  id: string;
  resolution: 'date-confirmed' | 'exact-day-unresolved' | 'event-date-not-confirmed';
  deathDate: string | null;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  reviewNote: string;
  sourceEvidence: readonly CapturedSourceEvidence[];
};

type QualityFactEvidence = {
  id: string;
  displayText: string;
  sourceUrl: string;
  publisher: string;
  pageTitle: string;
  sourceText: string;
  sourceSentence: string;
  sourceSentenceSha256: string;
  candidateIndex: number;
  editorialOverride?: boolean;
  capture: {
    status: number;
    sha256?: string;
    excerptSha256?: string;
    bytesRead: number;
    nameMatched: boolean;
    claimTextMatched: boolean;
    identityMatchBasis?: string;
    verificationMethod: string;
  };
};

type ReviewedSampleProfile = {
  id: string;
  name: string;
  month: number;
  birthDate: string;
  sampleStratum: 'BV017-738' | 'B015-B016' | 'legacy-unmanifested';
  reviewedClaim: string;
  source: {
    sourceUrl: string;
    publisher: string;
    pageTitle: string;
    sourceSentence: string;
    sourceText: string;
    capture: {
      status: number;
      sha256?: string;
      excerptSha256?: string;
      bytesRead: number;
      nameMatched: boolean;
      claimTextMatched: boolean;
      identityMatchBasis?: string;
      verificationMethod: string;
    };
  };
  sourceSentenceSha256: string;
  assessment: string;
  currentProfile: {
    name: string;
    birthDate: string;
    category: string;
    countryCode: string;
    shortDescription: string;
    biography: string;
    highlights: readonly string[];
    sourceUrls: readonly string[];
  };
};

type DuplicateHighlightReview = {
  id: string;
  name: string;
  highlight: string;
  shortDescription: string;
  sourceUrl: string;
  publisher: string;
  sourceText: string;
  displayText: string;
  capture: {
    status: number;
    sha256?: string;
    excerptSha256?: string;
    bytesRead: number;
    nameMatched?: boolean;
    claimTextMatched?: boolean;
    identityMatchBasis?: string;
    verificationMethod: string;
  };
  assessment: string;
  disposition: string;
};

const deathVerification = rawDeathVerification as unknown as {
  baselineCorrections: readonly (Correction & {
    deathDateEvidence?: readonly CapturedSourceEvidence[];
    reviewNote?: string;
  })[];
  conflictReviews: readonly ConflictReview[];
};
const baselineCorrections = deathVerification.baselineCorrections;
const conflictReviews = deathVerification.conflictReviews;
const baselineProjection = rawBaselineProjection as unknown as {
  schemaVersion: number;
  cycle: string;
  baselineCommit: string;
  scope: { baselinePeople: number; changedProfiles: number; changedFields: number };
  profiles: readonly BaselineProjectionProfile[];
};
const baselineProjectionById = new Map(baselineProjection.profiles.map((profile) => [profile.id, profile]));
const correctionsById = new Map(baselineCorrections.map((correction) => [correction.id, correction]));
const conflictReviewsById = new Map(conflictReviews.map((review) => [review.id, review]));
const dataAudit = rawDataAudit as unknown as { people: readonly { id: string; activeDeathDates: readonly string[] }[] };
const recentEvidence = rawB015B016 as unknown as { profiles: readonly { id: string; wikidataId: string; dobSources: readonly { url: string }[]; supportingSources?: readonly { url: string }[] }[] };
const preDeathSourceUrlsById = new Map(recentEvidence.profiles.map((profile) => [profile.id, [
  'https://www.wikidata.org/wiki/' + profile.wikidataId,
  ...profile.dobSources.map((source) => source.url),
  ...(profile.supportingSources || []).map((source) => source.url),
]]));
const BV017_CORRECTION_MANIFEST_SHA256 = '5836da6c67d0da18987d454e6c8aa790eae7e52067142c1d2c902536dd276c74';
const BV017_BASELINE_PROJECTION_SHA256 = 'e422a2e83e2cd358a4506b9d2bb2ba3661802bb30d1bb4c67c135a33001b21f0';
const qualityManifest = rawQualityCorrections as unknown as {
  cycle: string;
  reviewMethod: string;
  scope: {
    initialQualityBacklogCount: number;
    reviewedFactsApplied: number;
    categoryOnlyHighlightsReplaced: number;
    occupationOnlyHighlightsReplaced: number;
    duplicateSummaryHighlightsReplaced: number;
    editorialSampleOverridesApplied?: number;
  };
  facts: readonly QualityFactEvidence[];
  corrections: readonly Correction[];
};
const qualityFacts = qualityManifest.facts;
const qualityCorrections = qualityManifest.corrections;
const qualityCorrectionsById = new Map(qualityCorrections.map((correction) => [correction.id, correction]));
const qualityFactsById = new Map(qualityFacts.map((fact) => [fact.id, fact]));
const BV017_QUALITY_MANIFEST_SHA256 = 'b9b71334f79453b3f798a5e29b9ce0e7ec92a7782f3bac187af45478997f7ba4';
const january1Batch = rawJanuary1Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown> }[] };
const january1LegacyById = new Map(january1Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january2Batch = rawJanuary2Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown> }[] };
const january2LegacyById = new Map(january2Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january3Batch = rawJanuary3Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown> }[] };
const january3LegacyById = new Map(january3Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january4Batch = rawJanuary4Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown> }[] };
const january4LegacyById = new Map(january4Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january5Batch = rawJanuary5Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january5LegacyById = new Map(january5Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january6Batch = rawJanuary6Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january6LegacyById = new Map(january6Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january7Batch = rawJanuary7Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january7LegacyById = new Map(january7Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january8Batch = rawJanuary8Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january8LegacyById = new Map(january8Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january9Batch = rawJanuary9Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january9LegacyById = new Map(january9Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january10Batch = rawJanuary10Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january10LegacyById = new Map(january10Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january11Batch = rawJanuary11Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january11LegacyById = new Map(january11Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january12Batch = rawJanuary12Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january12LegacyById = new Map(january12Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january13Batch = rawJanuary13Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january13LegacyById = new Map(january13Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january14Batch = rawJanuary14Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january14LegacyById = new Map(january14Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january15Batch = rawJanuary15Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january15LegacyById = new Map(january15Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january16Batch = rawJanuary16Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january16LegacyById = new Map(january16Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const january17Batch = rawJanuary17Batch as unknown as { legacyProfiles: readonly { id: string; before: Record<string, unknown>; after: Record<string, unknown> }[] };
const january17LegacyById = new Map(january17Batch.legacyProfiles.map((profile) => [profile.id, profile]));
const bv017ReviewSample = rawReviewSample as unknown as {
  schemaVersion: number;
  cycle: string;
  reviewMethod: string;
  scope: {
    profileCount: number;
    strata: Record<string, number>;
    monthsCovered: number[];
    assessmentCounts: Record<string, number>;
    reviewedClaimOnly: boolean;
  };
  profiles: readonly ReviewedSampleProfile[];
};
const bv017DuplicateReview = rawDuplicateHighlightReview as unknown as {
  schemaVersion: number;
  cycle: string;
  scope: {
    profileCount: number;
    repeatingShortDescriptionHighlights: number;
    sourceSupportedFacts: number;
    distinctSecondFactSelected: number;
  };
  profiles: readonly DuplicateHighlightReview[];
};
const BV017_REVIEW_SAMPLE_SHA256 = 'afe62a6d7188d14513d4ea491cf39faffa3ae5a62389fb59300d37163c048737';
const BV017_DUPLICATE_REVIEW_SHA256 = '0523260c3371d282aa638af67cdb29e36633bbe2d0436904aedcff564f08b961';

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

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function matchesRecordedValue(person: PersonLike, field: string, expected: unknown): boolean {
  const record = person as unknown as Record<string, unknown>;
  if (expected === null) return !Object.prototype.hasOwnProperty.call(person, field);
  return Object.prototype.hasOwnProperty.call(person, field) && stableSerialize(record[field]) === stableSerialize(expected);
}

function projectPersonBeforeJanuary8(person: PersonLike): PersonLike {
  const result = { ...person } as Record<string, unknown>;
  const january17Before = january17LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january17Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january16Before = january16LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january16Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january14Before = january14LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january14Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january13Before = january13LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january13Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january12Before = january12LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january12Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january11Before = january11LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january11Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january10Before = january10LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january10Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const january9Before = january9LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january9Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const before = january8LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  return result as PersonLike;
}

/** Restore only the independently pinned BV-017 changes when evaluating older cycle snapshots. */
export function projectPersonBeforeBv017<T extends PersonLike>(person: T): T {
  const result = { ...person } as Record<string, unknown>;
  const baseline = baselineProjectionById.get(person.id);
  if (baseline) {
    for (const [field, value] of Object.entries(baseline.before)) result[field] = cloneValue(value);
    for (const field of baseline.remove) delete result[field];
    const january17Before = january17LegacyById.get(person.id)?.before;
    for (const [field, value] of Object.entries(january17Before || {})) {
      if (Object.hasOwn(baseline.before, field) || baseline.remove.includes(field)) continue;
      if (value === null) delete result[field];
      else result[field] = cloneValue(value);
    }
    const january16Before = january16LegacyById.get(person.id)?.before;
    for (const [field, value] of Object.entries(january16Before || {})) {
      if (Object.hasOwn(baseline.before, field) || baseline.remove.includes(field)) continue;
      if (value === null) delete result[field];
      else result[field] = cloneValue(value);
    }
    const january15Before = january15LegacyById.get(person.id)?.before;
    for (const [field, value] of Object.entries(january15Before || {})) {
      if (Object.hasOwn(baseline.before, field) || baseline.remove.includes(field)) continue;
      if (value === null) delete result[field];
      else result[field] = cloneValue(value);
    }
    const january14Before = january14LegacyById.get(person.id)?.before;
    for (const [field, value] of Object.entries(january14Before || {})) {
      if (Object.hasOwn(baseline.before, field) || baseline.remove.includes(field)) continue;
      if (value === null) delete result[field];
      else result[field] = cloneValue(value);
    }
    return result as T;
  }
  const priorFieldSets = [
    january17LegacyById.get(person.id)?.before,
    january16LegacyById.get(person.id)?.before,
    january15LegacyById.get(person.id)?.before,
    january14LegacyById.get(person.id)?.before,
    january13LegacyById.get(person.id)?.before,
    january12LegacyById.get(person.id)?.before,
    january11LegacyById.get(person.id)?.before,
    january10LegacyById.get(person.id)?.before,
    january9LegacyById.get(person.id)?.before,
    january8LegacyById.get(person.id)?.before,
    january7LegacyById.get(person.id)?.before,
    january6LegacyById.get(person.id)?.before,
    january5LegacyById.get(person.id)?.before,
    january4LegacyById.get(person.id)?.before,
    january3LegacyById.get(person.id)?.before,
    january2LegacyById.get(person.id)?.before,
    january1LegacyById.get(person.id)?.before,
    qualityCorrectionsById.get(person.id)?.before,
    correctionsById.get(person.id)?.before ?? conflictReviewsById.get(person.id)?.before,
  ];
  for (const before of priorFieldSets) {
    if (!before) continue;
    for (const [field, value] of Object.entries(before)) {
      if (value === null) delete result[field];
      else result[field] = cloneValue(value);
    }
  }
  return result as T;
}

/** Restore only January 14 edits when an earlier BV-017 review fixture must be checked. */
export function projectPersonBeforeJanuary14<T extends PersonLike>(person: T): T {
  const result = { ...person } as Record<string, unknown>;
  const january17Before = january17LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(january17Before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  const before = january14LegacyById.get(person.id)?.before;
  for (const [field, value] of Object.entries(before || {})) {
    if (value === null) delete result[field];
    else result[field] = cloneValue(value);
  }
  return result as T;
}

/** Return URLs as they appeared to historical source-pair checks before death-source additions. */
export function sourceUrlsBeforeBv017(person: PersonLike): readonly string[] {
  const before = correctionsById.get(person.id)?.before
    ?? conflictReviewsById.get(person.id)?.before;
  if (before && Array.isArray(before.sourceUrls)) {
    return before.sourceUrls as string[];
  }
  const qualityBefore = qualityCorrectionsById.get(person.id)?.before;
  if (qualityBefore && Array.isArray(qualityBefore.sourceUrls)) return qualityBefore.sourceUrls as string[];
  const january9Before = january9LegacyById.get(person.id)?.before;
  const january10Before = january10LegacyById.get(person.id)?.before;
  const january11Before = january11LegacyById.get(person.id)?.before;
  const january13Before = january13LegacyById.get(person.id)?.before;
  const january15Before = january15LegacyById.get(person.id)?.before;
  const january16Before = january16LegacyById.get(person.id)?.before;
  const january17Before = january17LegacyById.get(person.id)?.before;
  if (january17Before && Array.isArray(january17Before.sourceUrls)) return january17Before.sourceUrls as string[];
  if (january16Before && Array.isArray(january16Before.sourceUrls)) return january16Before.sourceUrls as string[];
  const january14Before = january14LegacyById.get(person.id)?.before;
  const january12Before = january12LegacyById.get(person.id)?.before;
  if (january15Before && Array.isArray(january15Before.sourceUrls)) return january15Before.sourceUrls as string[];
  if (january14Before && Array.isArray(january14Before.sourceUrls)) return january14Before.sourceUrls as string[];
  if (january13Before && Array.isArray(january13Before.sourceUrls)) return january13Before.sourceUrls as string[];
  if (january12Before && Array.isArray(january12Before.sourceUrls)) return january12Before.sourceUrls as string[];
  if (january11Before && Array.isArray(january11Before.sourceUrls)) return january11Before.sourceUrls as string[];
  if (january10Before && Array.isArray(january10Before.sourceUrls)) return january10Before.sourceUrls as string[];
  if (january9Before && Array.isArray(january9Before.sourceUrls)) return january9Before.sourceUrls as string[];
  const january8Before = january8LegacyById.get(person.id)?.before;
  if (january8Before && Array.isArray(january8Before.sourceUrls)) return january8Before.sourceUrls as string[];
  const january7Before = january7LegacyById.get(person.id)?.before;
  if (january7Before && Array.isArray(january7Before.sourceUrls)) return january7Before.sourceUrls as string[];
  const january6Before = january6LegacyById.get(person.id)?.before;
  if (january6Before && Array.isArray(january6Before.sourceUrls)) {
    return january6Before.sourceUrls as string[];
  }
  const januaryBefore = january1LegacyById.get(person.id)?.before;
  if (januaryBefore && Array.isArray(januaryBefore.sourceUrls)) {
    return januaryBefore.sourceUrls as string[];
  }
  const january2Before = january2LegacyById.get(person.id)?.before;
  if (january2Before && Array.isArray(january2Before.sourceUrls)) {
    return january2Before.sourceUrls as string[];
  }
  const january3Before = january3LegacyById.get(person.id)?.before;
  if (january3Before && Array.isArray(january3Before.sourceUrls)) {
    return january3Before.sourceUrls as string[];
  }
  const january4Before = january4LegacyById.get(person.id)?.before;
  if (january4Before && Array.isArray(january4Before.sourceUrls)) {
    return january4Before.sourceUrls as string[];
  }
  const january5Before = january5LegacyById.get(person.id)?.before;
  if (january5Before && Array.isArray(january5Before.sourceUrls)) {
    return january5Before.sourceUrls as string[];
  }
  if (correctionsById.has(person.id) || conflictReviewsById.has(person.id)) return person.sourceUrls || [];
  return preDeathSourceUrlsById.get(person.id)
    || person.sourceUrls
    || [];
}

export function verifyBv017CorrectionManifest(
  people: readonly PersonLike[],
  assert: (suite: string, condition: boolean, message: string) => void,
): void {
  assert(
    'Rule AK baseline projection',
    baselineProjection.schemaVersion === 1
      && baselineProjection.cycle === 'BV-017'
      && baselineProjection.baselineCommit === '0d67324a3bd251ce4960a418c4ea291c86238f63'
      && baselineProjection.scope.baselinePeople === 1120
      && baselineProjection.scope.changedProfiles === baselineProjection.profiles.length
      && baselineProjection.scope.changedFields === baselineProjection.profiles.reduce((count, profile) => count + Object.keys(profile.before).length + profile.remove.length, 0)
      && baselineProjectionById.size === baselineProjection.profiles.length
      && stableSha256(baselineProjection) === BV017_BASELINE_PROJECTION_SHA256,
    'BV-017 historical projection must match its pinned delta from the 1,120-person baseline commit',
  );
  assert(
    'Rule AK baseline corrections',
    stableSha256(baselineCorrections) === BV017_CORRECTION_MANIFEST_SHA256,
    'BV-017 baseline correction manifest must match its separately pinned SHA-256',
  );
  assert(
    'Rule AK baseline corrections',
    correctionsById.size === baselineCorrections.length,
    'BV-017 baseline correction IDs must be unique',
  );

  assert(
    'Rule BV-017 quality corrections',
    qualityManifest.cycle === 'BV-017'
      && qualityManifest.reviewMethod.includes('hashed direct HTTP captures')
      && qualityManifest.reviewMethod.includes('paraphrases checked')
      && stableSha256({ facts: qualityFacts, corrections: qualityCorrections }) === BV017_QUALITY_MANIFEST_SHA256,
    'BV-017 quality corrections must match the pinned human-reviewed evidence manifest',
  );
  assert(
    'Rule BV-017 quality corrections',
    qualityCorrectionsById.size === qualityCorrections.length
      && qualityFactsById.size === qualityFacts.length
      && qualityFacts.length === qualityCorrections.length
      && qualityManifest.scope.reviewedFactsApplied === qualityFacts.length,
    'BV-017 reviewed quality facts and profile corrections must have one unique, matching entry per profile',
  );
  assert(
    'Rule BV-017 quality corrections',
    qualityManifest.scope.editorialSampleOverridesApplied === qualityFacts.filter((fact) => fact.editorialOverride).length,
    'BV-017 sample-discovered editorial overrides must match their explicitly reviewed evidence records',
  );

  assert(
    'Rule BV-017 stratified review sample',
    bv017ReviewSample.schemaVersion === 1
      && bv017ReviewSample.cycle === 'BV-017'
      && bv017ReviewSample.scope.profileCount === 141
      && bv017ReviewSample.profiles.length === 141
      && bv017ReviewSample.scope.strata['BV017-738'] === 108
      && bv017ReviewSample.scope.strata['B015-B016'] === 20
      && bv017ReviewSample.scope.strata['legacy-unmanifested'] === 13
      && bv017ReviewSample.scope.monthsCovered.join(',') === '1,2,3,4,5,6,7,8,9,10,11,12'
      && bv017ReviewSample.scope.reviewedClaimOnly
      && stableSha256({ scope: bv017ReviewSample.scope, profiles: bv017ReviewSample.profiles }) === BV017_REVIEW_SAMPLE_SHA256,
    'BV-017 review sample must retain the pinned 141-profile, three-stratum, all-month evidence set',
  );
  assert(
    'Rule BV-017 stratified review sample',
    new Set(bv017ReviewSample.profiles.map((row) => row.id)).size === bv017ReviewSample.profiles.length,
    'BV-017 review sample profile IDs must be unique',
  );
  const sampleCorrectionIds = bv017ReviewSample.profiles
    .filter((row) => row.assessment === 'corrected-from-sample-finding')
    .map((row) => row.id)
    .sort();
  const editorialCorrectionIds = qualityFacts.filter((fact) => fact.editorialOverride).map((fact) => fact.id).sort();
  assert(
    'Rule BV-017 stratified review sample',
    stableSerialize(sampleCorrectionIds) === stableSerialize(editorialCorrectionIds),
    'All sample-discovered profile corrections must be represented in the review sample and vice versa',
  );

  assert(
    'Rule BV-017 duplicate-summary review',
    bv017DuplicateReview.schemaVersion === 1
      && bv017DuplicateReview.cycle === 'BV-017'
      && bv017DuplicateReview.scope.profileCount === 47
      && bv017DuplicateReview.scope.repeatingShortDescriptionHighlights === 47
      && bv017DuplicateReview.scope.sourceSupportedFacts === 47
      && bv017DuplicateReview.scope.distinctSecondFactSelected === 0
      && bv017DuplicateReview.profiles.length === 47
      && stableSha256({ scope: bv017DuplicateReview.scope, profiles: bv017DuplicateReview.profiles }) === BV017_DUPLICATE_REVIEW_SHA256,
    'The 47 repeated-summary highlights must retain their separately pinned source review and explicit editorial disposition',
  );

  const peopleById = new Map(people.map((person) => [person.id, person]));
  assert(
    'Rule BV-017 duplicate-summary review',
    new Set(bv017DuplicateReview.profiles.map((row) => row.id)).size === bv017DuplicateReview.profiles.length
      && people.filter((person) => person.highlights?.length === 2 && person.highlights[1] === person.shortDescription).length === 47,
    'The duplicate-summary evidence must cover every and only the 47 live highlights that repeat shortDescription',
  );
  for (const row of bv017ReviewSample.profiles) {
    const person = peopleById.get(row.id);
    const samplePerson = person ? projectPersonBeforeJanuary8(person) : undefined;
    const capture = row.source.capture;
    const directHttpCapture = capture.verificationMethod === 'direct-http'
      && Boolean(capture.sha256 && /^[a-f0-9]{64}$/.test(capture.sha256));
    const browserExcerptCapture = capture.verificationMethod === 'browser-direct'
      && Boolean(capture.excerptSha256 && /^[a-f0-9]{64}$/.test(capture.excerptSha256))
      && capture.excerptSha256 === createHash('sha256').update(row.source.sourceText).digest('hex')
      && capture.bytesRead === Buffer.byteLength(row.source.sourceText, 'utf8');
    assert(
      'Rule BV-017 stratified review sample evidence',
      Boolean(person)
        && row.name === person?.name
        && row.birthDate === person?.birthDate
        && row.month === person?.birthMonth
        && row.source.sourceUrl.startsWith('https://')
        && (samplePerson?.sourceUrls || []).includes(row.source.sourceUrl)
        && row.source.sourceSentence.length >= 30
        && row.source.sourceText.includes(row.source.sourceSentence)
        && createHash('sha256').update(row.source.sourceSentence).digest('hex') === row.sourceSentenceSha256
        && capture.status === 200
        && capture.bytesRead > 0
        && (capture.nameMatched || Boolean(capture.identityMatchBasis?.trim()))
        && capture.claimTextMatched
        && (directHttpCapture || browserExcerptCapture),
      row.id + ' review sample fact must bind to an identity-matched, hashed source excerpt',
    );
    if (person) {
      const samplePerson = projectPersonBeforeJanuary8(person);
      const current = {
        name: samplePerson.name,
        birthDate: samplePerson.birthDate,
        category: samplePerson.category,
        countryCode: samplePerson.countryCode,
        shortDescription: samplePerson.shortDescription,
        biography: samplePerson.biography || '',
        highlights: samplePerson.highlights || [],
        sourceUrls: samplePerson.sourceUrls || [],
      };
      assert(
        'Rule BV-017 stratified review sample snapshot',
        stableSerialize(current) === stableSerialize(row.currentProfile),
        row.id + ' review sample snapshot must match the current profile data',
      );
    }
  }
  for (const row of bv017DuplicateReview.profiles) {
    const person = peopleById.get(row.id);
    const directHttpCapture = row.capture.verificationMethod === 'direct-http'
      && Boolean(row.capture.sha256 && /^[a-f0-9]{64}$/.test(row.capture.sha256));
    const browserExcerptCapture = row.capture.verificationMethod === 'browser-direct'
      && Boolean(row.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(row.capture.excerptSha256))
      && row.capture.excerptSha256 === createHash('sha256').update(row.sourceText).digest('hex')
      && row.capture.bytesRead === Buffer.byteLength(row.sourceText, 'utf8');
    assert(
      'Rule BV-017 duplicate-summary review evidence',
      Boolean(person)
        && row.name === person?.name
        && row.highlight === person?.highlights?.[1]
        && row.shortDescription === person?.shortDescription
        && row.highlight === row.shortDescription
        && row.displayText === row.shortDescription
        && row.sourceUrl.startsWith('https://')
        && (person?.sourceUrls || []).includes(row.sourceUrl)
        && row.capture.status === 200
        && row.capture.bytesRead > 0
        && (row.capture.nameMatched || Boolean(row.capture.identityMatchBasis?.trim()))
        && row.capture.claimTextMatched === true
        && (directHttpCapture || browserExcerptCapture),
      row.id + ' repeated-summary highlight must have an identity-matched source fact and exact HTTP/browser capture',
    );
  }
  const categoryOnlyReplacementCount = qualityCorrections.filter((correction) => {
    const before = correction.before.highlights;
    const after = correction.after.highlights;
    return Array.isArray(before)
      && before.length === 2
      && before[0].startsWith('Sinh ngày ')
      && before[1].startsWith('Lĩnh vực hoạt động: ')
      && stableSerialize(before) !== stableSerialize(after);
  }).length;
  const duplicateSummaryReplacementCount = qualityCorrections.filter((correction) => {
    const person = peopleById.get(correction.id);
    const before = correction.before.highlights;
    const after = correction.after.highlights;
    return Boolean(person
      && Array.isArray(before)
      && before.length === 2
      && (before[1] === correction.before.biography || before[1] === person.shortDescription)
      && stableSerialize(before) !== stableSerialize(after));
  }).length;
  const occupationOnlyReplacementCount = qualityCorrections.filter((correction) => {
    const before = correction.before.highlights;
    const after = correction.after.highlights;
    return Array.isArray(before)
      && before.length === 2
      && before[1].startsWith('Nghề nghiệp được ghi nhận: ')
      && stableSerialize(before) !== stableSerialize(after);
  }).length;
  assert(
    'Rule BV-017 quality corrections',
    qualityManifest.scope.categoryOnlyHighlightsReplaced === categoryOnlyReplacementCount
      && qualityManifest.scope.occupationOnlyHighlightsReplaced === occupationOnlyReplacementCount
      && qualityManifest.scope.duplicateSummaryHighlightsReplaced === duplicateSummaryReplacementCount,
    'BV-017 quality correction counts must match the exact category-only, occupation-only, and duplicate-summary highlight replacements',
  );

  for (const correction of baselineCorrections) {
    const person = peopleById.get(correction.id);
    assert('Rule AK baseline corrections', Boolean(person), 'Missing corrected baseline profile ' + correction.id);
    if (!person) continue;
    const qualityAfter = qualityCorrectionsById.get(correction.id)?.after;
    const january17After = january17LegacyById.get(correction.id)?.after;
    const january16After = january16LegacyById.get(correction.id)?.after;
    const january15After = january15LegacyById.get(correction.id)?.after;
    const january14After = january14LegacyById.get(correction.id)?.after;
    const january13After = january13LegacyById.get(correction.id)?.after;
    const january12After = january12LegacyById.get(correction.id)?.after;
    const january11After = january11LegacyById.get(correction.id)?.after;
    const january10After = january10LegacyById.get(correction.id)?.after;
    const january9After = january9LegacyById.get(correction.id)?.after;
    const january8After = january8LegacyById.get(correction.id)?.after;
    const january7After = january7LegacyById.get(correction.id)?.after;
    const january6After = january6LegacyById.get(correction.id)?.after;
    const january5After = january5LegacyById.get(correction.id)?.after;
    for (const [field, expected] of Object.entries(correction.after)) {
      const finalExpected = january17After && Object.prototype.hasOwnProperty.call(january17After, field)
        ? january17After[field]
        : january16After && Object.prototype.hasOwnProperty.call(january16After, field)
        ? january16After[field]
        : january15After && Object.prototype.hasOwnProperty.call(january15After, field)
        ? january15After[field]
        : january14After && Object.prototype.hasOwnProperty.call(january14After, field)
        ? january14After[field]
        : january13After && Object.prototype.hasOwnProperty.call(january13After, field)
        ? january13After[field]
        : january12After && Object.prototype.hasOwnProperty.call(january12After, field)
        ? january12After[field]
        : january11After && Object.prototype.hasOwnProperty.call(january11After, field)
        ? january11After[field]
        : january10After && Object.prototype.hasOwnProperty.call(january10After, field)
        ? january10After[field]
        : january9After && Object.prototype.hasOwnProperty.call(january9After, field)
        ? january9After[field]
        : january8After && Object.prototype.hasOwnProperty.call(january8After, field)
        ? january8After[field]
        : january7After && Object.prototype.hasOwnProperty.call(january7After, field)
        ? january7After[field]
        : january6After && Object.prototype.hasOwnProperty.call(january6After, field)
        ? january6After[field]
        : january5After && Object.prototype.hasOwnProperty.call(january5After, field)
          ? january5After[field]
        : qualityAfter && Object.prototype.hasOwnProperty.call(qualityAfter, field)
          ? qualityAfter[field]
          : expected;
      assert(
        'Rule AK baseline corrections',
        matchesRecordedValue(person, field, finalExpected),
        correction.id + ' ' + field + ' must match its exact BV-017 after-value',
      );
    }
    const deathUrls = Array.isArray(correction.after.deathDateSourceUrls) ? correction.after.deathDateSourceUrls as string[] : [];
    const captures = correction.deathDateEvidence || [];
    const reviewNote = (correction as Correction & { reviewNote?: string }).reviewNote || '';
    assert('Rule AK death evidence', deathUrls.length > 0 && captures.length === deathUrls.length, correction.id + ' must retain one exact death-date capture for every reviewed source');
    for (const capture of captures) {
      assert(
        'Rule AK death evidence',
        deathUrls.includes(capture.url) && (person.sourceUrls || []).includes(capture.url),
        correction.id + ' death evidence URL must be retained in both deathDateSourceUrls and sourceUrls',
      );
      assert(
        'Rule AK death evidence',
        capture.capture.status === 200
          && /^[a-f0-9]{64}$/.test(capture.capture.sha256)
          && capture.capture.exactDate
          && capture.capture.nameMatched
          && ['direct-http', 'direct-http+publication-date-weekday'].includes(capture.capture.verificationMethod)
          && capture.dateText.length > 0
          && capture.excerpt.toLocaleLowerCase().includes(capture.dateText.toLocaleLowerCase()),
        correction.id + ' death evidence must bind a captured exact date and identity to a hashed direct page excerpt',
      );
      if (capture.capture.verificationMethod === 'direct-http+publication-date-weekday') {
        assert(
          'Rule AK death evidence derivation',
          Boolean(capture.url.includes('1994-07-08') || correction.reviewNote?.includes('ngày 6/7/1994')),
          correction.id + ' weekday-derived date must retain an explicit dated-article derivation note',
        );
      }
    }
    if (correction.after.deathDatePrecision === 'presumed-day') {
      assert(
        'Rule AK presumed death date',
        correction.after.lifeStatus === 'deceased'
          && deathUrls.length >= 2
          && reviewNote.includes('không nguồn nào xác nhận tử vong đúng ngày đó'),
        correction.id + ' presumed-day must remain distinguished from a confirmed exact death date with a clear review note and two direct sources',
      );
    }
  }

  for (const fact of qualityFacts) {
    const person = peopleById.get(fact.id);
    const correction = qualityCorrectionsById.get(fact.id);
    assert('Rule BV-017 quality evidence', Boolean(person && correction), fact.id + ' must have a profile and exactly one correction');
    const directHttpCapture = fact.capture.verificationMethod === 'direct-http'
      && Boolean(fact.capture.sha256 && /^[a-f0-9]{64}$/.test(fact.capture.sha256));
    const browserExcerptCapture = fact.capture.verificationMethod === 'browser-direct'
      && Boolean(fact.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(fact.capture.excerptSha256))
      && fact.capture.excerptSha256 === createHash('sha256').update(fact.sourceText).digest('hex')
      && fact.capture.bytesRead === Buffer.byteLength(fact.sourceText, 'utf8');
    assert(
      'Rule BV-017 quality evidence',
      fact.capture.status === 200
        && (directHttpCapture || browserExcerptCapture)
        && fact.capture.bytesRead > 0
        && (fact.capture.nameMatched || Boolean(fact.capture.identityMatchBasis?.trim()))
        && fact.capture.claimTextMatched
        && fact.sourceUrl.startsWith('https://')
        && fact.sourceSentence.length >= 35
        && fact.sourceText === fact.sourceSentence
        && createHash('sha256').update(fact.sourceSentence).digest('hex') === fact.sourceSentenceSha256,
      fact.id + ' must bind the reviewed fact to an identity-matched hashed HTTP capture or exact browser excerpt',
    );
    if (!person || !correction) continue;
    assert(
      'Rule BV-017 quality evidence',
      (projectPersonBeforeJanuary8(person).sourceUrls || []).includes(fact.sourceUrl),
      fact.id + ' reviewed content source URL must remain available in the profile source list',
    );
    assert(
      'Rule BV-017 quality corrections',
      matchesRecordedValue(projectPersonBeforeJanuary8(person), 'biography', correction.after.biography)
        && matchesRecordedValue(projectPersonBeforeJanuary8(person), 'highlights', correction.after.highlights)
        && (!correction.after.shortDescription || matchesRecordedValue(projectPersonBeforeJanuary8(person), 'shortDescription', correction.after.shortDescription))
        && (!correction.after.sourceUrls || matchesRecordedValue(projectPersonBeforeJanuary8(person), 'sourceUrls', correction.after.sourceUrls)),
      fact.id + ' live profile content must match the pinned reviewed after-values',
    );
    const afterBiography = correction.after.biography;
    assert(
      'Rule BV-017 quality corrections',
      typeof afterBiography === 'string' && afterBiography.includes(fact.displayText),
      fact.id + ' reviewed Vietnamese fact must appear verbatim in the biography',
    );
    const beforeHighlights = correction.before.highlights;
    const afterHighlights = correction.after.highlights;
    if (fact.editorialOverride) {
      assert(
        'Rule BV-017 quality corrections',
        Array.isArray(afterHighlights)
          && afterHighlights.includes(fact.displayText)
          && typeof correction.after.biography === 'string'
          && correction.after.biography.includes(fact.displayText),
        fact.id + ' sample-discovered editorial correction must use the reviewed fact in biography and highlights',
      );
      continue;
    }
    const replacedCategory = Array.isArray(beforeHighlights)
      && beforeHighlights[1]?.startsWith('Lĩnh vực hoạt động: ');
    const replacedDuplicateSummary = Array.isArray(beforeHighlights)
      && beforeHighlights.length === 2
      && (beforeHighlights[1] === correction.before.biography || beforeHighlights[1] === person.shortDescription);
    const replacedOccupationOnly = Array.isArray(beforeHighlights)
      && beforeHighlights.length === 2
      && (beforeHighlights[1].startsWith('Nghề nghiệp được ghi nhận: ')
        || beforeHighlights[1].startsWith('Được ghi nhận với vai trò '));
    if (replacedCategory || replacedDuplicateSummary || replacedOccupationOnly) {
      assert(
        'Rule BV-017 quality corrections',
        Array.isArray(afterHighlights)
          && afterHighlights.length === 2
          && afterHighlights[0] === beforeHighlights?.[0]
          && afterHighlights[1] === fact.displayText
          && !afterHighlights.some((highlight) => highlight.startsWith('Lĩnh vực hoạt động: ')),
        fact.id + ' low-information category or duplicate-summary highlight must be replaced by the reviewed, sourced fact',
      );
    } else {
      assert(
        'Rule BV-017 quality corrections',
        stableSerialize(afterHighlights) === stableSerialize(beforeHighlights),
        fact.id + ' existing substantive highlights must remain unchanged',
      );
    }
  }

  assert(
    'Rule AK P570 conflict reviews',
    conflictReviewsById.size === conflictReviews.length,
    'BV-017 P570 conflict review IDs must be unique',
  );
  const activeConflictIds = new Set(dataAudit.people
    .filter((claim) => claim.activeDeathDates.length > 1)
    .map((claim) => claim.id));
  assert(
    'Rule AK P570 conflict reviews',
    conflictReviews.length === activeConflictIds.size
      && [...activeConflictIds].every((id) => conflictReviewsById.has(id)),
    'Every multi-date active P570 profile in the captured audit must have exactly one review record',
  );

  for (const review of conflictReviews) {
    const person = peopleById.get(review.id);
    const correction = correctionsById.get(review.id);
    assert('Rule AK P570 conflict reviews', activeConflictIds.has(review.id), review.id + ' is not a multi-date P570 profile in the audit snapshot');
    assert('Rule AK P570 conflict reviews', Boolean(person), 'Missing reviewed P570 profile ' + review.id);
    assert('Rule AK P570 conflict reviews', review.reviewNote.trim().length > 0, review.id + ' conflict resolution must include a reason');
    if (!person) continue;

    const hasCapturedIdentitySource = review.sourceEvidence.some((source) =>
      source.url.length > 0
      && source.capture.status === 200
      && /^[a-f0-9]{64}$/.test(source.capture.sha256)
      && source.capture.nameMatched
      && source.dateText.length > 0
      && source.excerpt.toLocaleLowerCase().includes(source.dateText.toLocaleLowerCase()),
    );
    assert(
      'Rule AK P570 conflict evidence',
      hasCapturedIdentitySource,
      review.id + ' must retain at least one hashed direct source capture tied to the person and review evidence',
    );
    for (const source of review.sourceEvidence) {
      assert(
        'Rule AK P570 conflict evidence',
        (person.sourceUrls || []).includes(source.url),
        review.id + ' reviewed source URL must be retained on the person profile',
      );
    }

    if (review.resolution === 'date-confirmed') {
      assert(
        'Rule AK P570 conflict resolution',
        Boolean(correction)
          && review.deathDate !== null
          && review.deathDate === person.deathDate
          && correction?.after.deathDate === review.deathDate
          && person.lifeStatus === 'deceased'
          && person.deathDatePrecision === 'day'
          && (person.deathDateSourceUrls || []).length > 0,
        review.id + ' confirmed date must agree across person record, review and baseline correction',
      );
    } else if (review.resolution === 'exact-day-unresolved') {
      assert(
        'Rule AK P570 conflict resolution',
        !correction
          && review.deathDate === null
          && person.lifeStatus === 'deceased'
          && !Object.prototype.hasOwnProperty.call(person, 'deathDate')
          && !Object.prototype.hasOwnProperty.call(person, 'deathDatePrecision')
          && !Object.prototype.hasOwnProperty.call(person, 'deathDateSourceUrls')
          && review.sourceEvidence.some((source) => source.capture.status === 200 && !source.capture.exactDate),
        review.id + ' unresolved exact day must retain deceased status without an invented death date or date-source URL',
      );
    } else {
      assert(
        'Rule AK P570 conflict resolution',
        review.resolution === 'event-date-not-confirmed'
          && Boolean(correction)
          && review.deathDate === person.deathDate
          && person.lifeStatus === 'deceased'
          && person.deathDatePrecision === 'presumed-day'
          && review.reviewNote.toLocaleLowerCase().includes('không nguồn nào xác nhận tử vong đúng ngày đó'),
        review.id + ' event date must remain explicitly distinguished from an exact death date',
      );
    }
  }
}

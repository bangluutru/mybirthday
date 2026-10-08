import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { ALL_PEOPLE } from '../src/data/birthdays';
import type { Person } from '../src/data/types';

type WikidataAuditPerson = {
  id: string;
  activeDeathDates: string[];
  localLifeStatus?: string | null;
  localDeathDate?: string | null;
  [key: string]: unknown;
};

type WikidataAudit = {
  schemaVersion: number;
  cycle: string;
  retrievedAt: string;
  summary: Record<string, number | string>;
  people: WikidataAuditPerson[];
};

const root = process.cwd();
const auditPath = `${root}/.ai/evidence/BV017-data-audit.json`;
const newProfilesPath = `${root}/.ai/evidence/B015-B016.json`;
const deathEvidencePath = `${root}/.ai/evidence/BV017-death-verification.json`;
const contentEvidencePath = `${root}/.ai/evidence/BV017-content-evidence.json`;
const qualityCapturesPath = `${root}/.ai/evidence/BV017-quality-captures.json`;
const qualityCorrectionsPath = `${root}/.ai/evidence/BV017-quality-corrections.json`;
const expansionPilotPath = `${root}/.ai/evidence/BV017-expansion-pilot.json`;
const qualityAuditPath = `${root}/.ai/evidence/BV017-quality-audit.json`;
const audit = JSON.parse(readFileSync(auditPath, 'utf8')) as WikidataAudit;
const newProfilesEvidence = JSON.parse(readFileSync(newProfilesPath, 'utf8')) as {
  profiles: {
    id: string;
    wikidataId: string;
    birthDate: string;
    deathDate?: string;
    deathDateEvidence?: { capture: { status: number; sha256?: string; excerptSha256?: string; exactDate: boolean; nameMatched: boolean; verificationMethod: string } }[];
  }[];
};
const deathEvidence = JSON.parse(readFileSync(deathEvidencePath, 'utf8')) as {
  retrievedAt: string;
  verifiedPeopleCount: number;
  baselineCorrections: { id: string; reviewNote?: string; after: { deathDatePrecision?: string } }[];
  conflictReviews: { id: string; resolution: string; reviewNote: string }[];
};
const contentEvidence = JSON.parse(readFileSync(contentEvidencePath, 'utf8')) as {
  facts: { id: string; sourceUrl: string; displayText: string; capture: { status: number; sha256: string } }[];
};
const qualityCaptures = JSON.parse(readFileSync(qualityCapturesPath, 'utf8')) as {
  captures: { id: string; sourceText?: string; capture?: { status?: number; sha256?: string; excerptSha256?: string; bytesRead?: number; nameMatched?: boolean; identityMatchBasis?: string; claimTextMatched?: boolean; verificationMethod?: string } }[];
};
const qualityCorrections = JSON.parse(readFileSync(qualityCorrectionsPath, 'utf8')) as {
  scope: {
    initialQualityBacklogCount: number;
    reviewedFactsApplied: number;
    categoryOnlyHighlightsReplaced: number;
    duplicateSummaryHighlightsReplaced: number;
  };
  facts: { id: string }[];
  corrections: { id: string; before: { highlights?: string[] | null }; after: { highlights?: string[] | null } }[];
};
const expansionPilot = JSON.parse(readFileSync(expansionPilotPath, 'utf8')) as {
  profiles: { id: string }[];
  careerFacts: { id: string; capture: { status: number; sha256: string } }[];
};

const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
const newProfileIds = new Set(newProfilesEvidence.profiles.map((profile) => profile.id));
const expansionPilotIds = new Set(expansionPilot.profiles.map((profile) => profile.id));
const directlyCapturedExpansionFactIds = new Set(expansionPilot.careerFacts
  .filter((fact) => fact.capture.status === 200 && /^[a-f0-9]{64}$/.test(fact.capture.sha256))
  .map((fact) => fact.id));
const expansionPilotProfilesWithCareerFacts = new Set(directlyCapturedExpansionFactIds);
const contentEvidenceById = new Map(contentEvidence.facts.map((fact) => [fact.id, fact]));
const qualityFactIds = new Set(qualityCorrections.facts.map((fact) => fact.id));
const qualityCaptureById = new Map(qualityCaptures.captures.map((capture) => [capture.id, capture]));
const hasValidQualityCapture = (id: string): boolean => {
  const row = qualityCaptureById.get(id);
  const capture = row?.capture;
  const rawCaptureValid = capture?.verificationMethod === 'direct-http'
    && Boolean(capture.sha256 && /^[a-f0-9]{64}$/.test(capture.sha256));
  const excerptCaptureValid = capture?.verificationMethod === 'browser-direct'
    && Boolean(row?.sourceText && capture.excerptSha256 && /^[a-f0-9]{64}$/.test(capture.excerptSha256))
    && capture.excerptSha256 === createHash('sha256').update(row?.sourceText ?? '').digest('hex')
    && capture.bytesRead === Buffer.byteLength(row?.sourceText ?? '', 'utf8');
  return capture?.status === 200
    && Boolean((capture.nameMatched || capture.identityMatchBasis?.trim()) && capture.claimTextMatched)
    && (rawCaptureValid || excerptCaptureValid);
};
const directlyReviewedQualityIds = new Set(qualityCorrections.facts.filter((fact) => hasValidQualityCapture(fact.id)).map((fact) => fact.id));
const directlyCapturedNewDeathIds = new Set(newProfilesEvidence.profiles
  .filter((profile) => Boolean(profile.deathDate) && (profile.deathDateEvidence || []).some((item) =>
    item.capture.status === 200 && item.capture.exactDate && item.capture.nameMatched
      && (Boolean(item.capture.sha256 && /^[a-f0-9]{64}$/.test(item.capture.sha256))
        || Boolean(item.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(item.capture.excerptSha256))),
  ))
  .map((profile) => profile.id));
const conflictReviewById = new Map(deathEvidence.conflictReviews.map((review) => [review.id, review]));
const reviewedConflictIds = deathEvidence.conflictReviews.map((review) => review.id).sort();
const reviewedConflictIdSet = new Set(reviewedConflictIds);
const correctionEvidenceIds = new Set(deathEvidence.baselineCorrections.map((correction) => correction.id));
deathEvidence.verifiedPeopleCount = new Set([...correctionEvidenceIds, ...directlyCapturedNewDeathIds]).size;

function hasDateOnlyBiography(person: Person): boolean {
  if (!person.biography) return false;
  const date = `${person.birthDay} tháng ${person.birthMonth} năm ${person.birthYear}`;
  return person.biography.includes(`sinh ngày ${date}`);
}

function hasCategoryOnlyHighlights(person: Person): boolean {
  return Boolean(person.highlights?.length === 2
    && person.highlights[0].startsWith('Sinh ngày ')
    && person.highlights[1].startsWith('Lĩnh vực hoạt động: '));
}

function hasGenericRoleBiography(person: Person): boolean {
  return Boolean(person.biography?.startsWith(`${person.name} được biết đến với vai trò `) && person.biography.endsWith('.'));
}

function hasRoleOnlyHighlights(person: Person): boolean {
  return Boolean(person.highlights?.length === 2 && person.highlights[1].startsWith('Được ghi nhận với vai trò '));
}

function hasDuplicateSummaryHighlight(person: Person): boolean {
  return Boolean(person.highlights?.length === 2 && person.highlights[1] === person.shortDescription);
}

function isSimpleOneSentenceBio(person: Person): boolean {
  if (!person.biography) return true;
  return person.biography === person.shortDescription
    || person.biography === `${person.name} là ${person.occupation[0]} người ${person.countryName}.`;
}

for (const claim of audit.people) {
  const local = peopleById.get(claim.id);
  if (!local) throw new Error(`Wikidata audit row has no local person: ${claim.id}`);
  claim.localLifeStatus = local.lifeStatus ?? null;
  claim.localDeathDate = local.deathDate ?? null;
  claim.localDeathDatePrecision = local.deathDatePrecision ?? null;
  claim.localDeathDateSourceUrls = local.deathDateSourceUrls ?? [];
  claim.localLifeStatusExplicit = Object.prototype.hasOwnProperty.call(local, 'lifeStatus');
  const conflictReview = conflictReviewById.get(local.id);
  claim.deathConflictReview = conflictReview?.resolution
    ?? (claim.activeDeathDates.length > 1 ? 'unreviewed' : 'not-a-multiple-date-conflict');
}

for (const review of deathEvidence.conflictReviews) {
  const claim = audit.people.find((person) => person.id === review.id);
  if (!claim || claim.activeDeathDates.length < 2) {
    throw new Error(`Expected a multi-date active P570 conflict for reviewed profile ${review.id}`);
  }
}

const people = ALL_PEOPLE.map((person) => {
  const explicit = Object.prototype.hasOwnProperty.call(person, 'lifeStatus');
  const exactSimpleBio = isSimpleOneSentenceBio(person);
  const dateOnlyBio = hasDateOnlyBiography(person);
  const categoryOnlyHighlights = hasCategoryOnlyHighlights(person);
  const deathSourceCount = person.deathDateSourceUrls?.length ?? 0;
  return {
    id: person.id,
    name: person.name,
    birthMonth: person.birthMonth,
    birthDay: person.birthDay,
    category: person.category,
    fields: person.fields ?? [],
    countryCode: person.countryCode,
    isB015B016Addition: newProfileIds.has(person.id),
    isBV017ExpansionPilotAddition: expansionPilotIds.has(person.id),
    biographyTemplatePattern: exactSimpleBio || dateOnlyBio || hasGenericRoleBiography(person),
    biographyContainsGeneratedBirthSentence: dateOnlyBio,
    biographyGenericRoleTemplate: hasGenericRoleBiography(person),
    biographyMissingOrBlank: !person.biography?.trim(),
  highlightsOnlyBirthDateAndBroadCategory: categoryOnlyHighlights,
  highlightsOnlyBirthDateAndRoleTemplate: hasRoleOnlyHighlights(person),
  highlightsRepeatingShortDescription: hasDuplicateSummaryHighlight(person),
    hasDirectlyCapturedCareerFact: contentEvidenceById.has(person.id) || qualityFactIds.has(person.id) || expansionPilotProfilesWithCareerFacts.has(person.id),
    lifeStatusExplicit: explicit,
    lifeStatus: person.lifeStatus ?? null,
    deathDate: person.deathDate ?? null,
    deathDatePrecision: person.deathDatePrecision ?? null,
    deathDateHasDedicatedSourceUrls: deathSourceCount > 0,
    deathDateSourceCount: deathSourceCount,
    sourceUrlCount: person.sourceUrls?.length ?? 0,
  };
});

const counts = {
  people: people.length,
  profilesWithExplicitLifeStatus: people.filter((person) => person.lifeStatusExplicit).length,
  profilesWithUnknownOrMissingLifeStatus: people.filter((person) => !person.lifeStatus || person.lifeStatus === 'unknown').length,
  explicitlyLiving: people.filter((person) => person.lifeStatus === 'living').length,
  explicitlyDeceased: people.filter((person) => person.lifeStatus === 'deceased').length,
  deathDatesRecorded: people.filter((person) => person.deathDate !== null).length,
  deathDatesWithoutDedicatedSourceUrls: people.filter((person) => person.deathDate !== null && !person.deathDateHasDedicatedSourceUrls).length,
  profilesWithBiographyOrHighlightTemplatePattern: people.filter((person) => person.biographyTemplatePattern || person.highlightsOnlyBirthDateAndBroadCategory || person.highlightsOnlyBirthDateAndRoleTemplate).length,
  simpleBiographyTemplatePatterns: people.filter((person) => person.biographyTemplatePattern).length,
  genericRoleTemplateBiographies: people.filter((person) => person.biographyGenericRoleTemplate).length,
  genericRoleTemplateHighlights: people.filter((person) => person.highlightsOnlyBirthDateAndRoleTemplate).length,
  biographiesContainingGeneratedBirthSentence: people.filter((person) => person.biographyContainsGeneratedBirthSentence).length,
  biographiesMissingOrBlank: people.filter((person) => person.biographyMissingOrBlank).length,
  highlightsWithOnlyBirthDateAndBroadCategory: people.filter((person) => person.highlightsOnlyBirthDateAndBroadCategory).length,
  highlightsRepeatingShortDescription: people.filter((person) => person.highlightsRepeatingShortDescription).length,
  b015B016Profiles: people.filter((person) => person.isB015B016Addition).length,
  bv017ExpansionPilotProfiles: people.filter((person) => person.isBV017ExpansionPilotAddition).length,
  bv017ExpansionPilotCareerFacts: directlyCapturedExpansionFactIds.size,
  bv017ExpansionPilotProfilesWithDirectlyCapturedCareerFact: people.filter((person) => person.isBV017ExpansionPilotAddition && person.hasDirectlyCapturedCareerFact).length,
  b015B016BiographiesContainingGeneratedBirthSentence: people.filter((person) => person.isB015B016Addition && person.biographyContainsGeneratedBirthSentence).length,
  b015B016CategoryOnlyHighlights: people.filter((person) => person.isB015B016Addition && person.highlightsOnlyBirthDateAndBroadCategory).length,
  b015B016ProfilesWithoutThreeSourceUrls: people.filter((person) => person.isB015B016Addition && person.sourceUrlCount < 3).length,
  profilesWithDirectlyCapturedCareerFact: people.filter((person) => person.hasDirectlyCapturedCareerFact).length,
  b015B016ProfilesWithDirectlyCapturedCareerFact: people.filter((person) => person.isB015B016Addition && person.hasDirectlyCapturedCareerFact).length,
  initialLowInformationQualityBacklog: qualityCorrections.scope.initialQualityBacklogCount,
  profilesWithReviewedBV017QualityFacts: directlyReviewedQualityIds.size,
  categoryOnlyHighlightsReplacedWithReviewedFacts: qualityCorrections.scope.categoryOnlyHighlightsReplaced,
  duplicateSummaryHighlightsReplacedWithReviewedFacts: qualityCorrections.scope.duplicateSummaryHighlightsReplaced,
  lowInformationQualityBacklogRemaining: people.filter((person) => person.biographyTemplatePattern || person.highlightsOnlyBirthDateAndBroadCategory || person.highlightsOnlyBirthDateAndRoleTemplate).length,
  remainingBacklogWithValidDirectCapture: people.filter((person) => (person.biographyTemplatePattern || person.highlightsOnlyBirthDateAndBroadCategory || person.highlightsOnlyBirthDateAndRoleTemplate) && hasValidQualityCapture(person.id)).length,
  remainingBacklogWithoutValidDirectCapture: people.filter((person) => (person.biographyTemplatePattern || person.highlightsOnlyBirthDateAndBroadCategory || person.highlightsOnlyBirthDateAndRoleTemplate) && !hasValidQualityCapture(person.id)).length,
  qualityProfilesWithValidDirectCapture: qualityCaptures.captures.filter((capture) => hasValidQualityCapture(capture.id)).length,
  presumedDayDeathDates: people.filter((person) => person.deathDatePrecision === 'presumed-day').length,
  unresolvedP570MultiDateProfiles: deathEvidence.conflictReviews.filter((review) => review.resolution === 'exact-day-unresolved').length,
  unreviewedP570MultiDateProfiles: audit.people.filter((person) => person.activeDeathDates.length > 1 && !reviewedConflictIdSet.has(person.id)).length,
  directlyCapturedDeathEvidencePeople: deathEvidence.verifiedPeopleCount,
  reviewedP570ConflictProfiles: reviewedConflictIds.length,
  p570ConflictsResolvedToExactDate: deathEvidence.conflictReviews.filter((review) => review.resolution === 'date-confirmed').length,
  p570ConflictsWithEventDateOnly: deathEvidence.conflictReviews.filter((review) => review.resolution === 'event-date-not-confirmed').length,
  profilesWithFieldTags: people.filter((person) => person.fields.length > 0).length,
  fieldTagAssignments: people.reduce((sum, person) => sum + person.fields.length, 0),
};

const fieldCounts = Object.fromEntries([...new Set(people.flatMap((person) => person.fields))]
  .sort()
  .map((field) => [field, people.filter((person) => person.fields.includes(field)).length]));

const categoryCounts = Object.fromEntries([...new Set(people.map((person) => person.category))]
  .sort()
  .map((category) => [category, people.filter((person) => person.category === category).length]));
const countryCounts = Object.fromEntries([...new Set(people.map((person) => person.countryCode))]
  .sort()
  .map((countryCode) => [countryCode, people.filter((person) => person.countryCode === countryCode).length]));

const report = {
  schemaVersion: 1,
  cycle: 'BV-017',
  generatedAt: new Date().toISOString(),
  source: 'ALL_PEOPLE and BV017 evidence manifests; this is a local-field audit, not a claim that every profile was independently re-researched.',
  summary: counts,
  categoryCounts,
  fieldCounts,
  countryCounts,
  reviewedP570ConflictIds: reviewedConflictIds,
  limitations: [
    'Unknown or omitted lifeStatus is not evidence that a person is living.',
    'A recorded deathDate without deathDateSourceUrls has not been independently re-confirmed in this cycle.',
    'Template-pattern checks identify low-information text; a non-template biography is not automatically factual or source-verified.',
    'Short-description duplicate highlights are audited separately; they are replaced only when the reviewed BV-017 fact is supported by a valid direct capture.',
    'Wikidata P570 conflicts remain present in the source snapshot even when an independent source review resolved the local display date.',
    'The 15 December 1944 Glenn Miller date records the missing-in-action event, not a confirmed exact date of death.',
    'Five reviewed P570 profiles are explicitly deceased but have no local deathDate because the day remains disputed or cannot be determined from available evidence.',
    'BV-017 quality facts are included only for profiles with a reviewed sentence from an identity- and claim-matched hashed direct capture; the remaining low-information profiles still require review or better source captures.',
  ],
  people,
};

audit.retrievedAt = deathEvidence.retrievedAt;
audit.summary.deathDatesDirectlyConfirmedByPublisherCapture = deathEvidence.verifiedPeopleCount;
audit.summary.deathDatesDirectlyConfirmedInBaseline = deathEvidence.baselineCorrections.filter((correction) => !newProfileIds.has(correction.id)).length;
audit.summary.deathDatesDirectlyConfirmedInB015B016 = directlyCapturedNewDeathIds.size;
audit.summary.reviewedP570ConflictProfiles = reviewedConflictIds.length;
audit.summary.unresolvedP570MultiDateProfiles = counts.unresolvedP570MultiDateProfiles;
audit.summary.unreviewedP570MultiDateProfiles = counts.unreviewedP570MultiDateProfiles;
audit.summary.p570ConflictsResolvedToExactDate = counts.p570ConflictsResolvedToExactDate;
audit.summary.p570ConflictsWithEventDateOnly = counts.p570ConflictsWithEventDateOnly;
writeFileSync(deathEvidencePath, `${JSON.stringify(deathEvidence, null, 2)}\n`);
writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
writeFileSync(qualityAuditPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ dataAudit: auditPath, qualityAudit: qualityAuditPath, summary: counts }, null, 2));

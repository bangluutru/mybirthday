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
const january1BatchPath = `${root}/.ai/evidence/BV017-january-1-batch.json`;
const january2BatchPath = `${root}/.ai/evidence/BV017-january-2-batch.json`;
const january3BatchPath = `${root}/.ai/evidence/BV017-january-3-batch.json`;
const january4BatchPath = `${root}/.ai/evidence/BV017-january-4-batch.json`;
const january5BatchPath = `${root}/.ai/evidence/BV017-january-5-batch.json`;
const january6BatchPath = `${root}/.ai/evidence/BV017-january-6-batch.json`;
const january7BatchPath = `${root}/.ai/evidence/BV017-january-7-batch.json`;
const january8BatchPath = `${root}/.ai/evidence/BV017-january-8-batch.json`;
const january9BatchPath = `${root}/.ai/evidence/BV017-january-9-batch.json`;
const january10BatchPath = `${root}/.ai/evidence/BV017-january-10-batch.json`;
const january11BatchPath = `${root}/.ai/evidence/BV017-january-11-batch.json`;
const january12BatchPath = `${root}/.ai/evidence/BV017-january-12-batch.json`;
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
const january1Batch = JSON.parse(readFileSync(january1BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; careerFactIds: string[] }[];
  newProfiles: { id: string; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string; capture?: { status: number; sha256: string } }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january2Batch = JSON.parse(readFileSync(january2BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; careerFactIds: string[] }[];
  newProfiles: { id: string; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january3Batch = JSON.parse(readFileSync(january3BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; careerFactIds: string[] }[];
  newProfiles: { id: string; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january4Batch = JSON.parse(readFileSync(january4BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; careerFactIds: string[] }[];
  newProfiles: { id: string; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january5Batch = JSON.parse(readFileSync(january5BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january6Batch = JSON.parse(readFileSync(january6BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january7Batch = JSON.parse(readFileSync(january7BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january8Batch = JSON.parse(readFileSync(january8BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january9Batch = JSON.parse(readFileSync(january9BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january10Batch = JSON.parse(readFileSync(january10BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january11Batch = JSON.parse(readFileSync(january11BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};
const january12Batch = JSON.parse(readFileSync(january12BatchPath, 'utf8')) as {
  legacyProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  newProfiles: { id: string; lifeStatus: string; deathDate: string | null; deathDateSourceIds?: string[]; careerFactIds: string[] }[];
  careerFacts: { id: string; profileId: string; sourceId: string; evidencePhrase: string }[];
  sourceCaptures: { id: string; status: number; sha256: string; excerpt: string; excerptSha256: string }[];
};

const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
const newProfileIds = new Set(newProfilesEvidence.profiles.map((profile) => profile.id));
const expansionPilotIds = new Set(expansionPilot.profiles.map((profile) => profile.id));
const directlyCapturedExpansionFactIds = new Set(expansionPilot.careerFacts
  .filter((fact) => fact.capture.status === 200 && /^[a-f0-9]{64}$/.test(fact.capture.sha256))
  .map((fact) => fact.id));
const expansionPilotProfilesWithCareerFacts = new Set(directlyCapturedExpansionFactIds);
const janSourceById = new Map(january1Batch.sourceCaptures.map((source) => [source.id, source]));
const janFactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january1Batch.careerFacts) {
  const source = janSourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = janFactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  janFactIdsByProfile.set(fact.profileId, factIds);
}
const january1ReviewedProfileIds = new Set([...january1Batch.legacyProfiles, ...january1Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january1Batch.careerFacts.some((fact) => fact.id === factId && janFactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan2SourceById = new Map(january2Batch.sourceCaptures.map((source) => [source.id, source]));
const jan2FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january2Batch.careerFacts) {
  const source = jan2SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan2FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan2FactIdsByProfile.set(fact.profileId, factIds);
}
const january2ReviewedProfileIds = new Set([...january2Batch.legacyProfiles, ...january2Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january2Batch.careerFacts.some((fact) => fact.id === factId && jan2FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan3SourceById = new Map(january3Batch.sourceCaptures.map((source) => [source.id, source]));
const jan3FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january3Batch.careerFacts) {
  const source = jan3SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan3FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan3FactIdsByProfile.set(fact.profileId, factIds);
}
const january3ReviewedProfileIds = new Set([...january3Batch.legacyProfiles, ...january3Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january3Batch.careerFacts.some((fact) => fact.id === factId && jan3FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan4SourceById = new Map(january4Batch.sourceCaptures.map((source) => [source.id, source]));
const jan4FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january4Batch.careerFacts) {
  const source = jan4SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan4FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan4FactIdsByProfile.set(fact.profileId, factIds);
}
const january4ReviewedProfileIds = new Set([...january4Batch.legacyProfiles, ...january4Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january4Batch.careerFacts.some((fact) => fact.id === factId && jan4FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan5SourceById = new Map(january5Batch.sourceCaptures.map((source) => [source.id, source]));
const jan5FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january5Batch.careerFacts) {
  const source = jan5SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan5FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan5FactIdsByProfile.set(fact.profileId, factIds);
}
const january5ReviewedProfileIds = new Set([...january5Batch.legacyProfiles, ...january5Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january5Batch.careerFacts.some((fact) => fact.id === factId && jan5FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan6SourceById = new Map(january6Batch.sourceCaptures.map((source) => [source.id, source]));
const jan6FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january6Batch.careerFacts) {
  const source = jan6SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan6FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan6FactIdsByProfile.set(fact.profileId, factIds);
}
const january6ReviewedProfileIds = new Set([...january6Batch.legacyProfiles, ...january6Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january6Batch.careerFacts.some((fact) => fact.id === factId && jan6FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan7SourceById = new Map(january7Batch.sourceCaptures.map((source) => [source.id, source]));
const jan7FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january7Batch.careerFacts) {
  const source = jan7SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan7FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan7FactIdsByProfile.set(fact.profileId, factIds);
}
const january7ReviewedProfileIds = new Set([...january7Batch.legacyProfiles, ...january7Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january7Batch.careerFacts.some((fact) => fact.id === factId && jan7FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan8SourceById = new Map(january8Batch.sourceCaptures.map((source) => [source.id, source]));
const jan8FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january8Batch.careerFacts) {
  const source = jan8SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan8FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan8FactIdsByProfile.set(fact.profileId, factIds);
}
const january8ReviewedProfileIds = new Set([...january8Batch.legacyProfiles, ...january8Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january8Batch.careerFacts.some((fact) => fact.id === factId && jan8FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan9SourceById = new Map(january9Batch.sourceCaptures.map((source) => [source.id, source]));
const jan9FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january9Batch.careerFacts) {
  const source = jan9SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan9FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan9FactIdsByProfile.set(fact.profileId, factIds);
}
const january9ReviewedProfileIds = new Set([...january9Batch.legacyProfiles, ...january9Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january9Batch.careerFacts.some((fact) => fact.id === factId && jan9FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan10SourceById = new Map(january10Batch.sourceCaptures.map((source) => [source.id, source]));
const jan10FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january10Batch.careerFacts) {
  const source = jan10SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan10FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan10FactIdsByProfile.set(fact.profileId, factIds);
}
const january10ReviewedProfileIds = new Set([...january10Batch.legacyProfiles, ...january10Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january10Batch.careerFacts.some((fact) => fact.id === factId && jan10FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan11SourceById = new Map(january11Batch.sourceCaptures.map((source) => [source.id, source]));
const jan11FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january11Batch.careerFacts) {
  const source = jan11SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan11FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan11FactIdsByProfile.set(fact.profileId, factIds);
}
const january11ReviewedProfileIds = new Set([...january11Batch.legacyProfiles, ...january11Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january11Batch.careerFacts.some((fact) => fact.id === factId && jan11FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
const jan12SourceById = new Map(january12Batch.sourceCaptures.map((source) => [source.id, source]));
const jan12FactIdsByProfile = new Map<string, Set<string>>();
for (const fact of january12Batch.careerFacts) {
  const source = jan12SourceById.get(fact.sourceId);
  if (source?.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
    || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')
    || !source.excerpt.includes(fact.evidencePhrase)) continue;
  const factIds = jan12FactIdsByProfile.get(fact.profileId) || new Set<string>();
  factIds.add(fact.id);
  jan12FactIdsByProfile.set(fact.profileId, factIds);
}
const january12ReviewedProfileIds = new Set([...january12Batch.legacyProfiles, ...january12Batch.newProfiles]
  .filter((profile) => profile.careerFactIds.length === 2 && profile.careerFactIds.every((factId) => january12Batch.careerFacts.some((fact) => fact.id === factId && jan12FactIdsByProfile.get(profile.id)?.has(factId))))
  .map((profile) => profile.id));
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
const january5SourcesById = new Map(january5Batch.sourceCaptures.map((source) => [source.id, source]));
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const directlyCapturedJanuary5DeathIds = new Set(january5Batch.newProfiles
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = january5SourcesById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      return [profile.deathDate || '', `${monthName} ${Number(day)}, ${year}`, `${Number(day)} ${monthName} ${year}`, `${Number(day)}.${Number(month)}.${year}`]
        .some((dateText) => source.excerpt.includes(dateText));
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary6DeathIds = new Set([...january6Batch.legacyProfiles, ...january6Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan6SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      return [profile.deathDate || '', `${monthName} ${Number(day)}, ${year}`, `${Number(day)} ${monthName} ${year}`, `${Number(day)}.${Number(month)}.${year}`]
        .some((dateText) => source.excerpt.includes(dateText));
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary7DeathIds = new Set([...january7Batch.legacyProfiles, ...january7Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan7SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      return [profile.deathDate || '', `${monthName} ${Number(day)}, ${year}`, `${monthName} ${Number(day)} ${year}`, `${Number(day)} ${monthName}, ${year}`, `${day}/${month}/${year}`, `${Number(day)}/${Number(month)}/${year}`, `${Number(day)}.${Number(month)}.${year}`]
        .some((dateText) => source.excerpt.includes(dateText));
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary8DeathIds = new Set([...january8Batch.legacyProfiles, ...january8Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan8SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      const germanMonthName = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(month) - 1];
      const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
      return [profile.deathDate || '', `${monthName} ${Number(day)}, ${year}`, `${Number(day)} ${monthName} ${year}`, `${Number(day)}${ordinal} ${monthName} ${year}`, `${Number(day)}. ${germanMonthName} ${year}`, `${day}. ${germanMonthName} ${year}`, `${Number(day)}.${Number(month)}.${year}`]
        .some((dateText) => source.excerpt.includes(dateText));
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary9DeathIds = new Set([...january9Batch.legacyProfiles, ...january9Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan9SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      return source.excerpt.includes(profile.deathDate || '')
        || source.excerpt.includes(`${monthName} ${Number(day)}, ${year}`)
        || source.excerpt.includes(`${Number(day)} ${monthName} ${year}`)
        || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(source.excerpt);
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary10DeathIds = new Set([...january10Batch.legacyProfiles, ...january10Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan10SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
      return [profile.deathDate || '', `${Number(day)} ${monthName} ${year}`, `${monthName} ${Number(day)}, ${year}`, `${Number(day)}${ordinal} ${monthName} ${year}`]
        .some((dateText) => source.excerpt.toLocaleLowerCase().includes(dateText.toLocaleLowerCase()))
        || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(source.excerpt);
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary11DeathIds = new Set([...january11Batch.legacyProfiles, ...january11Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan11SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
      return [profile.deathDate || '', `${Number(day)} ${monthName} ${year}`, `${monthName} ${Number(day)}, ${year}`, `${Number(day)}${ordinal} ${monthName} ${year}`]
        .some((dateText) => source.excerpt.toLocaleLowerCase().includes(dateText.toLocaleLowerCase()))
        || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(source.excerpt);
    }))
  .map((profile) => profile.id));
const directlyCapturedJanuary12DeathIds = new Set([...january12Batch.legacyProfiles, ...january12Batch.newProfiles]
  .filter((profile) => Boolean(profile.deathDate && profile.lifeStatus === 'deceased')
    && (profile.deathDateSourceIds || []).some((sourceId) => {
      const source = jan12SourceById.get(sourceId);
      if (!source || source.status !== 200 || !/^[a-f0-9]{64}$/.test(source.sha256)
        || source.excerptSha256 !== createHash('sha256').update(source.excerpt).digest('hex')) return false;
      const [year, month, day] = (profile.deathDate || '').split('-');
      const monthName = monthNames[Number(month) - 1];
      const ordinal = Number(day) === 1 ? 'st' : Number(day) === 2 ? 'nd' : Number(day) === 3 ? 'rd' : 'th';
      return [profile.deathDate || '', `${Number(day)} ${monthName} ${year}`, `${monthName} ${Number(day)}, ${year}`, `${Number(day)}${ordinal} ${monthName} ${year}`, `${Number(day)} ${monthName}, ${year}`]
        .some((dateText) => source.excerpt.toLocaleLowerCase().includes(dateText.toLocaleLowerCase()))
        || new RegExp('(?:^|\\D)' + Number(day) + '\\s*[./-]\\s*' + Number(month) + '\\s*[./-]\\s*' + year + '(?:\\D|$)').test(source.excerpt);
    }))
  .map((profile) => profile.id));
const conflictReviewById = new Map(deathEvidence.conflictReviews.map((review) => [review.id, review]));
const reviewedConflictIds = deathEvidence.conflictReviews.map((review) => review.id).sort();
const reviewedConflictIdSet = new Set(reviewedConflictIds);
const correctionEvidenceIds = new Set(deathEvidence.baselineCorrections.map((correction) => correction.id));
deathEvidence.verifiedPeopleCount = new Set([...correctionEvidenceIds, ...directlyCapturedNewDeathIds, ...directlyCapturedJanuary5DeathIds, ...directlyCapturedJanuary6DeathIds, ...directlyCapturedJanuary7DeathIds, ...directlyCapturedJanuary8DeathIds, ...directlyCapturedJanuary9DeathIds, ...directlyCapturedJanuary10DeathIds, ...directlyCapturedJanuary11DeathIds, ...directlyCapturedJanuary12DeathIds]).size;

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
    isBV017January6Reviewed: january6ReviewedProfileIds.has(person.id),
    isBV017January7Reviewed: january7ReviewedProfileIds.has(person.id),
    isBV017January8Reviewed: january8ReviewedProfileIds.has(person.id),
    isBV017January9Reviewed: january9ReviewedProfileIds.has(person.id),
    isBV017January10Reviewed: january10ReviewedProfileIds.has(person.id),
    isBV017January11Reviewed: january11ReviewedProfileIds.has(person.id),
    isBV017January12Reviewed: january12ReviewedProfileIds.has(person.id),
    biographyTemplatePattern: exactSimpleBio || dateOnlyBio || hasGenericRoleBiography(person),
    biographyContainsGeneratedBirthSentence: dateOnlyBio,
    biographyGenericRoleTemplate: hasGenericRoleBiography(person),
    biographyMissingOrBlank: !person.biography?.trim(),
  highlightsOnlyBirthDateAndBroadCategory: categoryOnlyHighlights,
  highlightsOnlyBirthDateAndRoleTemplate: hasRoleOnlyHighlights(person),
  highlightsRepeatingShortDescription: hasDuplicateSummaryHighlight(person),
    hasDirectlyCapturedCareerFact: contentEvidenceById.has(person.id) || qualityFactIds.has(person.id) || expansionPilotProfilesWithCareerFacts.has(person.id) || january1ReviewedProfileIds.has(person.id) || january2ReviewedProfileIds.has(person.id) || january3ReviewedProfileIds.has(person.id) || january4ReviewedProfileIds.has(person.id) || january5ReviewedProfileIds.has(person.id) || january6ReviewedProfileIds.has(person.id) || january7ReviewedProfileIds.has(person.id) || january8ReviewedProfileIds.has(person.id) || january9ReviewedProfileIds.has(person.id) || january10ReviewedProfileIds.has(person.id) || january11ReviewedProfileIds.has(person.id) || january12ReviewedProfileIds.has(person.id),
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
  bv017January1ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january1ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January1CareerFacts: january1Batch.careerFacts.length,
  bv017January2ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january2ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January2CareerFacts: january2Batch.careerFacts.length,
  bv017January3ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january3ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January3CareerFacts: january3Batch.careerFacts.length,
  bv017January4ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january4ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January4CareerFacts: january4Batch.careerFacts.length,
  bv017January5ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january5ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January5CareerFacts: january5Batch.careerFacts.length,
  bv017January6ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january6ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January6CareerFacts: january6Batch.careerFacts.length,
  bv017January6ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary6DeathIds.size,
  bv017January7ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january7ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January7CareerFacts: january7Batch.careerFacts.length,
  bv017January7ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary7DeathIds.size,
  bv017January8ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january8ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January8CareerFacts: january8Batch.careerFacts.length,
  bv017January8ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary8DeathIds.size,
  bv017January9ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january9ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January9CareerFacts: january9Batch.careerFacts.length,
  bv017January9ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary9DeathIds.size,
  bv017January10ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january10ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January10CareerFacts: january10Batch.careerFacts.length,
  bv017January10ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary10DeathIds.size,
  bv017January11ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january11ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January11CareerFacts: january11Batch.careerFacts.length,
  bv017January11ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary11DeathIds.size,
  bv017January12ReviewedProfilesWithDirectlyCapturedCareerFacts: people.filter((person) => january12ReviewedProfileIds.has(person.id) && person.hasDirectlyCapturedCareerFact).length,
  bv017January12CareerFacts: january12Batch.careerFacts.length,
  bv017January12ProfilesWithDirectlyCapturedDeathDate: directlyCapturedJanuary12DeathIds.size,
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
audit.summary.deathDatesDirectlyConfirmedInBV017January5 = directlyCapturedJanuary5DeathIds.size;
audit.summary.deathDatesDirectlyConfirmedInBV017January10 = directlyCapturedJanuary10DeathIds.size;
audit.summary.deathDatesDirectlyConfirmedInBV017January11 = directlyCapturedJanuary11DeathIds.size;
audit.summary.deathDatesDirectlyConfirmedInBV017January12 = directlyCapturedJanuary12DeathIds.size;
audit.summary.reviewedP570ConflictProfiles = reviewedConflictIds.length;
audit.summary.unresolvedP570MultiDateProfiles = counts.unresolvedP570MultiDateProfiles;
audit.summary.unreviewedP570MultiDateProfiles = counts.unreviewedP570MultiDateProfiles;
audit.summary.p570ConflictsResolvedToExactDate = counts.p570ConflictsResolvedToExactDate;
audit.summary.p570ConflictsWithEventDateOnly = counts.p570ConflictsWithEventDateOnly;
writeFileSync(deathEvidencePath, `${JSON.stringify(deathEvidence, null, 2)}\n`);
writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
writeFileSync(qualityAuditPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ dataAudit: auditPath, qualityAudit: qualityAuditPath, summary: counts }, null, 2));

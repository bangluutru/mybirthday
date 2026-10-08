import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { ALL_PEOPLE } from '../src/data/birthdays';
import type { Person } from '../src/data/types';

type Capture = {
  id: string;
  name: string;
  url: string;
  publisher: string;
  pageTitle: string;
  sourceText: string;
  candidateSentences: string[];
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

type ReviewFact = {
  id: string;
  candidateIndex: number;
  displayText: string;
  biographyOverride?: string;
  highlightsOverride?: readonly string[];
  shortDescriptionOverride?: string;
  editorialOverride?: boolean;
};
type ProfileCorrection = {
  id: string;
  before: { biography: string | null; highlights: readonly string[] | null; shortDescription?: string; sourceUrls?: readonly string[] };
  after: { biography: string; highlights: readonly string[] | null; shortDescription?: string; sourceUrls?: readonly string[] };
};

function hasCategoryOnlyHighlight(highlights: readonly string[] | null): boolean {
  return Boolean(highlights?.length === 2
    && highlights[0].startsWith('Sinh ngày ')
    && highlights[1].startsWith('Lĩnh vực hoạt động: '));
}

function hasDuplicateSummaryHighlight(
  highlights: readonly string[] | null,
  biography: string | null,
  shortDescription: string,
): boolean {
  return Boolean(highlights?.length === 2
    && (highlights[1] === shortDescription || highlights[1] === biography));
}

function hasOccupationOnlyHighlight(highlights: readonly string[] | null): boolean {
  return Boolean(highlights?.length === 2 && highlights[1].startsWith('Nghề nghiệp được ghi nhận: '));
}

function hasRoleOnlyHighlight(highlights: readonly string[] | null): boolean {
  return Boolean(highlights?.length === 2 && highlights[1].startsWith('Được ghi nhận với vai trò '));
}

function isGenericRoleBiography(biography: string | null | undefined): boolean {
  return Boolean(biography?.includes(' được biết đến với vai trò ')
    && biography.endsWith('.'));
}

function replaceLowInformationHighlight(
  highlights: readonly string[] | null,
  fact: string,
  replace: boolean,
): readonly string[] | null {
  return replace && highlights?.length === 2 ? [highlights[0], fact] : highlights;
}

const root = process.cwd();
const reviewPath = join(root, '.ai/evidence/BV017-quality-fact-review.json');
const capturePath = join(root, '.ai/evidence/BV017-quality-captures.json');
const outputPath = join(root, '.ai/evidence/BV017-quality-corrections.json');

const review = JSON.parse(readFileSync(reviewPath, 'utf8')) as {
  schemaVersion: number;
  cycle: string;
  reviewedAt: string;
  reviewMethod: string;
  facts: ReviewFact[];
};
const captureFile = JSON.parse(readFileSync(capturePath, 'utf8')) as {
  scope: { targetIds: string[] };
  captures: Capture[];
};
const existing = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, 'utf8')) as {
    scope: { initialQualityBacklogCount: number };
    facts: Array<Record<string, unknown> & { id: string }>;
    corrections: ProfileCorrection[];
  }
  : null;

if (review.schemaVersion !== 1 || review.cycle !== 'BV-017') throw new Error('Unexpected fact-review manifest schema or cycle');
const capturesById = new Map(captureFile.captures.map((capture) => [capture.id, capture]));
const qualityTargetIds = new Set(captureFile.scope.targetIds);
const peopleById = new Map(ALL_PEOPLE.map((person) => [person.id, person]));
if (peopleById.size !== ALL_PEOPLE.length) throw new Error('Local people IDs must be unique');

const seenIds = new Set<string>();
const reviewedCorrections: ProfileCorrection[] = [];
const newCorrections: ProfileCorrection[] = [];
const sourceBeforeById = new Map<string, { biography: string; highlights: readonly string[] | null; shortDescription?: string; sourceUrls?: readonly string[] }>();
const facts: Array<{
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
  capture: Capture['capture'];
}> = [];
const existingFactsById = new Map((existing?.facts ?? []).map((fact) => [fact.id, fact]));
const existingCorrectionsById = new Map((existing?.corrections ?? []).map((correction) => [correction.id, correction]));

for (const oldId of existingFactsById.keys()) {
  if (!review.facts.some((fact) => fact.id === oldId)) {
    throw new Error(`Reviewed fact ${oldId} was removed; incremental corrections must remain append-only`);
  }
}

for (const fact of review.facts) {
  if (seenIds.has(fact.id)) throw new Error(`Duplicate reviewed fact ID ${fact.id}`);
  seenIds.add(fact.id);

  const person = peopleById.get(fact.id) as Person | undefined;
  const capture = capturesById.get(fact.id);
  if (!person || !capture) throw new Error(`Missing profile or capture for ${fact.id}`);
  if (!qualityTargetIds.has(fact.id)) {
    throw new Error(`${fact.id} was not in the captured BV-017 content-quality backlog`);
  }
  if (!Number.isInteger(fact.candidateIndex) || fact.candidateIndex < 0 || fact.candidateIndex >= capture.candidateSentences.length) {
    throw new Error(`${fact.id} has an invalid source sentence index`);
  }
  const rawCaptureValid = capture.capture.verificationMethod === 'direct-http'
    && Boolean(capture.capture.sha256 && /^[a-f0-9]{64}$/.test(capture.capture.sha256));
  const excerptCaptureValid = capture.capture.verificationMethod === 'browser-direct'
    && Boolean(capture.capture.excerptSha256 && /^[a-f0-9]{64}$/.test(capture.capture.excerptSha256))
    && capture.capture.excerptSha256 === createHash('sha256').update(capture.sourceText).digest('hex')
    && capture.capture.bytesRead === Buffer.byteLength(capture.sourceText, 'utf8');
  if (capture.capture.status !== 200
      || (!rawCaptureValid && !excerptCaptureValid)
      || (!capture.capture.nameMatched && !capture.capture.identityMatchBasis)
      || !capture.capture.claimTextMatched) {
    throw new Error(`${fact.id} does not have a valid identity- and claim-matched direct page capture`);
  }
  const sourceSentence = capture.candidateSentences[fact.candidateIndex].trim();
  if (sourceSentence.length < 35 || fact.displayText.trim().length < 30) {
    throw new Error(`${fact.id} source or reviewed Vietnamese fact is too short to add useful profile information`);
  }

  const oldCorrection = existingCorrectionsById.get(fact.id);
  const beforeBiography = oldCorrection ? oldCorrection.before.biography : person.biography?.trim() ?? null;
  const beforeHighlights = oldCorrection ? oldCorrection.before.highlights : (person.highlights ? [...person.highlights] : null);
  const sourceUrlsBefore = person.sourceUrls ? [...person.sourceUrls] : [];
  const sourceUrlsAfter = sourceUrlsBefore.includes(capture.url) ? sourceUrlsBefore : [...sourceUrlsBefore, capture.url];
  const sourceUrlsChanged = JSON.stringify(sourceUrlsBefore) !== JSON.stringify(sourceUrlsAfter);
  const date = `${person.birthDay} tháng ${person.birthMonth} năm ${person.birthYear}`;
  const generatedBirthBiography = Boolean(beforeBiography
    && ((beforeBiography.startsWith(`${person.name} sinh ngày ${date} và được ghi nhận với vai trò `) && beforeBiography.endsWith('.'))
      || (beforeBiography.startsWith(`${person.name} là `) && beforeBiography.endsWith(`, sinh ngày ${date}.`))
      || isGenericRoleBiography(beforeBiography)));
  const biographyWithoutGeneratedBirthSentence = generatedBirthBiography ? null : beforeBiography;
  const improvedBiography = biographyWithoutGeneratedBirthSentence
    ? `${biographyWithoutGeneratedBirthSentence} ${fact.displayText.trim()}`
    : fact.displayText.trim();
  const replaceHighlight = hasCategoryOnlyHighlight(beforeHighlights)
    || hasOccupationOnlyHighlight(beforeHighlights)
    || hasRoleOnlyHighlight(beforeHighlights)
    || hasDuplicateSummaryHighlight(beforeHighlights, beforeBiography, person.shortDescription);
  const improvedHighlights = replaceLowInformationHighlight(beforeHighlights, fact.displayText.trim(), replaceHighlight);
  const reviewedBiography = fact.biographyOverride?.trim() || improvedBiography;
  const reviewedHighlights = fact.highlightsOverride ? [...fact.highlightsOverride] : improvedHighlights;
  const reviewedShortDescription = fact.shortDescriptionOverride?.trim();
  if (oldCorrection) {
    const updatedCorrection: ProfileCorrection = {
      id: fact.id,
      before: oldCorrection.before,
      after: {
        biography: reviewedBiography,
        highlights: reviewedHighlights,
        ...(reviewedShortDescription ? { shortDescription: reviewedShortDescription } : {}),
        ...(oldCorrection.after.sourceUrls || sourceUrlsChanged ? { sourceUrls: sourceUrlsAfter } : {}),
      },
    };
    if ((person.biography !== oldCorrection.after.biography && person.biography !== reviewedBiography)
        || (JSON.stringify(person.highlights ?? null) !== JSON.stringify(oldCorrection.after.highlights)
          && JSON.stringify(person.highlights ?? null) !== JSON.stringify(reviewedHighlights))
        || (oldCorrection.after.shortDescription
          && person.shortDescription !== oldCorrection.after.shortDescription
          && person.shortDescription !== reviewedShortDescription)) {
      throw new Error(`Current source values no longer match the existing pinned correction for ${fact.id}`);
    }
    reviewedCorrections.push(updatedCorrection);
    if (person.biography !== reviewedBiography
        || JSON.stringify(person.highlights ?? null) !== JSON.stringify(reviewedHighlights)
        || (reviewedShortDescription && person.shortDescription !== reviewedShortDescription)) {
      newCorrections.push(updatedCorrection);
      sourceBeforeById.set(fact.id, {
        biography: person.biography ?? '',
        highlights: person.highlights ? [...person.highlights] : null,
        ...(reviewedShortDescription ? { shortDescription: person.shortDescription } : {}),
        sourceUrls: sourceUrlsBefore,
      });
    }
    facts.push({
      id: fact.id,
      displayText: fact.displayText.trim(),
      sourceUrl: capture.url,
      publisher: capture.publisher,
      pageTitle: capture.pageTitle,
      sourceText: sourceSentence,
      sourceSentence,
      sourceSentenceSha256: createHash('sha256').update(sourceSentence).digest('hex'),
      candidateIndex: fact.candidateIndex,
      ...(fact.editorialOverride ? { editorialOverride: true } : {}),
      capture: capture.capture,
    });
    continue;
  }

  const biography = reviewedBiography;
  const highlights = reviewedHighlights;

  const correction: ProfileCorrection = {
    id: fact.id,
    before: {
      biography: beforeBiography,
      highlights: beforeHighlights,
      ...(reviewedShortDescription && reviewedShortDescription !== person.shortDescription
        ? { shortDescription: person.shortDescription }
        : {}),
      ...(sourceUrlsChanged ? { sourceUrls: sourceUrlsBefore } : {}),
    },
    after: {
      biography,
      highlights,
      ...(reviewedShortDescription && reviewedShortDescription !== person.shortDescription
        ? { shortDescription: reviewedShortDescription }
        : {}),
      ...(sourceUrlsChanged ? { sourceUrls: sourceUrlsAfter } : {}),
    },
  };
  reviewedCorrections.push(correction);
  newCorrections.push(correction);
  sourceBeforeById.set(fact.id, {
    biography: person.biography ?? '',
    highlights: person.highlights ? [...person.highlights] : null,
    ...(reviewedShortDescription && reviewedShortDescription !== person.shortDescription
      ? { shortDescription: person.shortDescription }
      : {}),
    ...(sourceUrlsChanged ? { sourceUrls: sourceUrlsBefore } : {}),
  });
  facts.push({
    id: fact.id,
    displayText: fact.displayText.trim(),
    sourceUrl: capture.url,
    publisher: capture.publisher,
    pageTitle: capture.pageTitle,
    sourceText: capture.sourceText,
    sourceSentence,
    sourceSentenceSha256: createHash('sha256').update(sourceSentence).digest('hex'),
    candidateIndex: fact.candidateIndex,
    ...(fact.editorialOverride ? { editorialOverride: true } : {}),
    capture: capture.capture,
  });
}

const sourceFiles = Array.from({ length: 12 }, (_, i) => join(root, `src/data/people/${String(i + 1).padStart(2, '0')}.ts`));
const correctionsById = new Map(newCorrections.map((correction) => [correction.id, correction]));
const changesByFile = new Map<string, Array<{ start: number; end: number; text: string }>>();
const foundIds = new Set<string>();

function property(object: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  const member = object.properties.find((candidate): candidate is ts.PropertyAssignment =>
    ts.isPropertyAssignment(candidate)
    && ((ts.isIdentifier(candidate.name) && candidate.name.text === name)
      || (ts.isStringLiteral(candidate.name) && candidate.name.text === name)),
  );
  return member;
}

function readString(node: ts.Expression | undefined): string | undefined {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined;
}

function quote(value: string): string {
  return JSON.stringify(value);
}

for (const path of sourceFiles) {
  const text = readFileSync(path, 'utf8');
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits: Array<{ start: number; end: number; text: string }> = [];

  const visit = (node: ts.Node): void => {
    if (ts.isObjectLiteralExpression(node)) {
      const id = readString(property(node, 'id')?.initializer);
      const correction = id ? correctionsById.get(id) : undefined;
      if (correction) {
        if (foundIds.has(id!)) throw new Error(`Duplicate source object for ${id}`);
        foundIds.add(id!);
        const biographyProperty = property(node, 'biography');
        if (!biographyProperty) throw new Error(`Missing biography property for ${id}`);
        const currentBiography = readString(biographyProperty.initializer) ?? '';
        const expectedBefore = sourceBeforeById.get(id!)?.biography ?? correction.before.biography ?? '';
        if (currentBiography !== expectedBefore) throw new Error(`Biography changed after review for ${id}`);
        if (currentBiography !== correction.after.biography) {
          edits.push({ start: biographyProperty.initializer.getStart(source), end: biographyProperty.initializer.getEnd(), text: quote(correction.after.biography) });
        }

        if (correction.after.highlights) {
          const highlightProperty = property(node, 'highlights');
          if (!highlightProperty || !ts.isArrayLiteralExpression(highlightProperty.initializer)) {
            throw new Error(`Missing literal highlights array for ${id}`);
          }
          const arrayText = `[${correction.after.highlights.map(quote).join(', ')}]`;
          const currentElements = highlightProperty.initializer.elements.map((element) => readString(element as ts.Expression) ?? '');
          const expectedElements = sourceBeforeById.get(id!)?.highlights ?? correction.before.highlights ?? [];
          if (JSON.stringify(currentElements) !== JSON.stringify(expectedElements)) throw new Error(`Highlights changed after review for ${id}`);
          if (JSON.stringify(currentElements) !== JSON.stringify(correction.after.highlights)) {
            edits.push({ start: highlightProperty.initializer.getStart(source), end: highlightProperty.initializer.getEnd(), text: arrayText });
          }
        }

        if (correction.after.sourceUrls) {
          const sourceUrlsProperty = property(node, 'sourceUrls');
          if (!sourceUrlsProperty || !ts.isArrayLiteralExpression(sourceUrlsProperty.initializer)) {
            throw new Error(`Missing literal sourceUrls array for ${id}`);
          }
          const currentSourceUrls = sourceUrlsProperty.initializer.elements.map((element) => readString(element as ts.Expression) ?? '');
          const expectedSourceUrls = sourceBeforeById.get(id!)?.sourceUrls ?? correction.before.sourceUrls;
          if (expectedSourceUrls && JSON.stringify(currentSourceUrls) !== JSON.stringify(expectedSourceUrls)) {
            throw new Error(`Source URLs changed after review for ${id}`);
          }
          if (JSON.stringify(currentSourceUrls) !== JSON.stringify(correction.after.sourceUrls)) {
            const sourceUrlsText = `[${correction.after.sourceUrls.map(quote).join(', ')}]`;
            edits.push({ start: sourceUrlsProperty.initializer.getStart(source), end: sourceUrlsProperty.initializer.getEnd(), text: sourceUrlsText });
          }
        }

        if (correction.after.shortDescription) {
          const shortDescriptionProperty = property(node, 'shortDescription');
          if (!shortDescriptionProperty) throw new Error(`Missing shortDescription property for ${id}`);
          const currentShortDescription = readString(shortDescriptionProperty.initializer) ?? '';
          const expectedShortDescription = sourceBeforeById.get(id!)?.shortDescription
            ?? correction.before.shortDescription;
          if (expectedShortDescription !== undefined && currentShortDescription !== expectedShortDescription) {
            throw new Error(`shortDescription changed after review for ${id}`);
          }
          if (currentShortDescription !== correction.after.shortDescription) {
            edits.push({ start: shortDescriptionProperty.initializer.getStart(source), end: shortDescriptionProperty.initializer.getEnd(), text: quote(correction.after.shortDescription) });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (edits.length) changesByFile.set(path, edits);
}

if (foundIds.size !== newCorrections.length) {
  const missing = newCorrections.map((correction) => correction.id).filter((id) => !foundIds.has(id));
  throw new Error(`Could not locate source object(s): ${missing.join(', ')}`);
}

const output = {
  schemaVersion: 1,
  cycle: 'BV-017',
  reviewedAt: review.reviewedAt,
  reviewMethod: review.reviewMethod,
  scope: {
    initialQualityBacklogCount: existing?.scope.initialQualityBacklogCount
      ?? captureFile.scope.targetIds.length,
    reviewedFactsApplied: facts.length,
    categoryOnlyHighlightsReplaced: reviewedCorrections.filter((correction) =>
      hasCategoryOnlyHighlight(correction.before.highlights)
        && JSON.stringify(correction.before.highlights) !== JSON.stringify(correction.after.highlights),
    ).length,
    genericRoleBiographiesReplaced: reviewedCorrections.filter((correction) => isGenericRoleBiography(correction.before.biography)).length,
    editorialSampleOverridesApplied: reviewedCorrections.filter((correction) => Boolean(review.facts.find((fact) => fact.id === correction.id && fact.editorialOverride))).length,
    roleOnlyHighlightsReplaced: reviewedCorrections.filter((correction) => hasRoleOnlyHighlight(correction.before.highlights)).length,
    occupationOnlyHighlightsReplaced: reviewedCorrections.filter((correction) =>
      hasOccupationOnlyHighlight(correction.before.highlights)
        && JSON.stringify(correction.before.highlights) !== JSON.stringify(correction.after.highlights),
    ).length,
    duplicateSummaryHighlightsReplaced: reviewedCorrections.filter((correction) => {
      const person = peopleById.get(correction.id);
      return Boolean(person
        && hasDuplicateSummaryHighlight(correction.before.highlights, correction.before.biography, person.shortDescription)
        && JSON.stringify(correction.before.highlights) !== JSON.stringify(correction.after.highlights));
    }).length,
  },
  facts,
  corrections: reviewedCorrections,
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
for (const [path, edits] of changesByFile) {
  let text = readFileSync(path, 'utf8');
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  }
  writeFileSync(path, text);
}

console.log(JSON.stringify({
  correctionsEvidence: outputPath,
  factsApplied: facts.length,
  profilesWithCategoryOnlyHighlightReplaced: output.scope.categoryOnlyHighlightsReplaced,
  changedFiles: [...changesByFile.keys()].map((path) => path.replace(`${root}/`, '')),
}, null, 2));

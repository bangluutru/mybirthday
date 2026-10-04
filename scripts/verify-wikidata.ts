import { ALL_PEOPLE } from '../src/data/birthdays';

const USER_AGENT = 'BirthdayVerse-data/1.0 (haibangtran@gmail.com)';

interface WikidataDobResult {
  qid: string;
  birthDate: string;
  precision: number;
  calendar: string;
}

async function queryWikidataBatch(qids: string[]): Promise<Map<string, WikidataDobResult[]>> {
  const valuesClause = qids.map((q) => `wd:${q}`).join(' ');
  const sparql = `
SELECT ?p ?dob ?precision ?calendar WHERE {
  VALUES ?p { ${valuesClause} }
  ?p p:P569 ?st .
  ?st psv:P569 ?v .
  ?v wikibase:timeValue ?dob ; wikibase:timePrecision ?precision ; wikibase:timeCalendarModel ?calendar .
}
`;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/sparql-results+json',
    },
    signal: controller.signal,
  });

  clearTimeout(timer);

  if (!res.ok) {
    throw new Error(`Wikidata HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const map = new Map<string, WikidataDobResult[]>();

  for (const b of data?.results?.bindings || []) {
    const uri = b.p?.value || '';
    const qid = uri.split('/').pop() || '';
    const dobRaw = b.dob?.value || '';
    const birthDate = dobRaw.slice(0, 10);
    const precision = parseInt(b.precision?.value || '0', 10);
    const calendar = b.calendar?.value || '';

    const list = map.get(qid) || [];
    list.push({ qid, birthDate, precision, calendar });
    map.set(qid, list);
  }

  return map;
}

async function main() {
  const args = process.argv.slice(2);
  let filterMonth: number | null = null;
  let filterOnlyAfter: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--month' && args[i + 1]) {
      filterMonth = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--only-after' && args[i + 1]) {
      filterOnlyAfter = args[i + 1];
      i++;
    }
  }

  let peopleToVerify = ALL_PEOPLE.filter((p) => Boolean(p.wikidataId));

  if (filterMonth !== null) {
    if (!Number.isInteger(filterMonth) || filterMonth < 1 || filterMonth > 12) {
      throw new Error(`Invalid --month value: ${filterMonth}; expected 1-12`);
    }
    peopleToVerify = peopleToVerify.filter((p) => p.birthMonth === filterMonth);
  }
  if (filterOnlyAfter !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(filterOnlyAfter)) {
      throw new Error(`Invalid --only-after date: ${filterOnlyAfter}; expected YYYY-MM-DD`);
    }
    peopleToVerify = peopleToVerify.filter((p) => p.verifiedAt && p.verifiedAt > filterOnlyAfter!);
  }

  console.log('========================================================================================');
  console.log(`BIRTHDAYVERSE — WIKIDATA VERIFICATION AUDIT (${peopleToVerify.length} people)`);
  console.log('========================================================================================\n');

  const BATCH_SIZE = 50;
  const batches: (typeof peopleToVerify)[] = [];
  for (let i = 0; i < peopleToVerify.length; i += BATCH_SIZE) {
    batches.push(peopleToVerify.slice(i, i + BATCH_SIZE));
  }

  let matchCount = 0;
  let mismatchCount = 0;
  let missingCount = 0;
  const mismatches: { id: string; name: string; qid: string; localDob: string; wdDobs: string[] }[] = [];

  for (let bIdx = 0; bIdx < batches.length; bIdx++) {
    const batch = batches[bIdx];
    const qids = Array.from(new Set(batch.map((p) => p.wikidataId!)));

    if (bIdx > 0) {
      // Sleep >= 2s between requests as mandated
      await new Promise((r) => setTimeout(r, 2200));
    }

    console.log(`Auditing batch ${bIdx + 1}/${batches.length} (${qids.length} QIDs)...`);
    const resultsMap = await queryWikidataBatch(qids);

    for (const p of batch) {
      const results = resultsMap.get(p.wikidataId!) || [];
      if (results.length === 0) {
        missingCount++;
        console.warn(`  ⚠️ [MISSING] Person ${p.id} (${p.wikidataId}) has no P569 on Wikidata`);
        continue;
      }

      // Check if any P569 claim matches local birthDate with precision 11 (day)
      const matchingClaim = results.find((r) =>
        r.birthDate === p.birthDate && r.precision === 11 &&
        r.calendar === 'http://www.wikidata.org/entity/Q1985727'
      );

      if (matchingClaim) {
        matchCount++;
      } else {
        mismatchCount++;
        const wdDobs = results.map((r) => `${r.birthDate} (prec=${r.precision}, calendar=${r.calendar})`);
        mismatches.push({
          id: p.id,
          name: p.name,
          qid: p.wikidataId!,
          localDob: p.birthDate,
          wdDobs,
        });
        console.error(
          `  ❌ [MISMATCH] ${p.name} (${p.id}, ${p.wikidataId}): local="${p.birthDate}" vs Wikidata=${JSON.stringify(wdDobs)}`
        );
      }
    }
  }

  console.log('\n========================================================================================');
  console.log(`SUMMARY: ${matchCount} MATCHED | ${mismatchCount} MISMATCHED | ${missingCount} NO P569 DATA`);
  console.log('========================================================================================\n');

  if (mismatchCount > 0 || missingCount > 0) {
    if (mismatchCount > 0) {
      console.error('Mismatches detected:');
      for (const m of mismatches) {
        console.error(`- ${m.name} (${m.id}, ${m.qid}): local ${m.localDob} != Wikidata ${m.wdDobs.join(', ')}`);
      }
    }
    if (missingCount > 0) {
      console.error(`Missing P569 data detected: ${missingCount} people`);
    }
    process.exit(1);
  } else {
    console.log('✅ ALL AUDITED PEOPLE PERFECTLY MATCH WIKIDATA GREGORIAN BIRTH DATES.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error verifying Wikidata dates:', err);
  process.exit(1);
});

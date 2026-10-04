import * as fs from 'fs';
import * as path from 'path';

interface WikidataBinding {
  p?: { value: string };
  pLabel?: { value: string };
  pDescription?: { value: string };
  dob?: { value: string };
  dod?: { value: string };
  sl?: { value: string };
  cLabel?: { value: string };
  cCode?: { value: string };
  occLabel?: { value: string };
}

export interface CandidatePerson {
  qid: string;
  name: string;
  description: string;
  birthDate: string;
  deathDate?: string;
  sitelinks: number;
  countryCodes: string[];
  countryNames: string[];
  occupations: string[];
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const normalized = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
  return normalized === value;
}

export function isAdultOnDate(birthDate: string, asOfDate: string): boolean {
  if (!isValidIsoDate(birthDate) || !isValidIsoDate(asOfDate)) return false;
  const [asOfYear, asOfMonth, asOfDay] = asOfDate.split('-').map(Number);
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
  const age = asOfYear - birthYear - (
    asOfMonth < birthMonth || (asOfMonth === birthMonth && asOfDay < birthDay) ? 1 : 0
  );
  return age >= 18;
}

const USER_AGENT = 'BirthdayVerse-data/1.0 (haibangtran@gmail.com)';

async function queryWikidata(sparql: string, retryCount = 2): Promise<any> {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
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
      return data;
    } catch (err: any) {
      if (attempt === retryCount) {
        throw err;
      }
      console.error(`Attempt ${attempt + 1} failed: ${err.message}. Retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

export async function fetchCandidates(
  month: number,
  day: number,
  threshold = 60,
  vnOnly = false,
  asOfDate = new Date().toISOString().slice(0, 10)
): Promise<CandidatePerson[]> {
  const vnFilter = vnOnly ? '?p wdt:P27 wd:Q881 .\n' : '';
  const sparql = `
SELECT ?p ?pLabel ?pDescription ?dob ?dod ?sl ?cLabel ?cCode ?occLabel WHERE {
  ?p wdt:P31 wd:Q5 ; p:P569 ?st .
  ${vnFilter}  ?st psv:P569 ?v .
  ?v wikibase:timeValue ?dob ; wikibase:timePrecision 11 ; wikibase:timeCalendarModel wd:Q1985727 .
  FILTER(MONTH(?dob)=${month} && DAY(?dob)=${day} && YEAR(?dob)>=1583)
  ?p wikibase:sitelinks ?sl . FILTER(?sl >= ${threshold})
  OPTIONAL { ?p wdt:P27 ?c . OPTIONAL { ?c wdt:P297 ?cCode } }
  OPTIONAL { ?p wdt:P106 ?occ }
  OPTIONAL {
    ?p p:P570 ?dst .
    ?dst psv:P570 ?dv .
    ?dv wikibase:timeValue ?dod ; wikibase:timePrecision 11 .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "vi,en". }
} ORDER BY DESC(?sl) LIMIT 100
`;

  const raw = await queryWikidata(sparql);
  const bindings: WikidataBinding[] = raw?.results?.bindings || [];

  // Group by QID
  const candidateMap = new Map<string, CandidatePerson>();

  if (!isValidIsoDate(asOfDate)) {
    throw new Error(`Invalid --as-of calendar date: ${asOfDate}`);
  }

  for (const b of bindings) {
    const uri = b.p?.value || '';
    const qid = uri.split('/').pop() || '';
    if (!qid.startsWith('Q')) continue;

    const dobRaw = b.dob?.value || '';
    const birthDate = dobRaw.slice(0, 10);
    if (!isValidIsoDate(birthDate)) continue;

    // Filter out people younger than 18 on the execution date.
    if (!isAdultOnDate(birthDate, asOfDate)) continue;

    const dodRaw = b.dod?.value;
    const deathDate = dodRaw ? dodRaw.slice(0, 10) : undefined;
    // Filter out death before birth
    if (deathDate && deathDate < birthDate) continue;

    const sitelinks = parseInt(b.sl?.value || '0', 10);
    const name = b.pLabel?.value || qid;
    const description = b.pDescription?.value || '';
    const cCode = b.cCode?.value;
    const cName = b.cLabel?.value;
    const occ = b.occLabel?.value;

    let candidate = candidateMap.get(qid);
    if (!candidate) {
      candidate = {
        qid,
        name,
        description,
        birthDate,
        deathDate,
        sitelinks,
        countryCodes: [],
        countryNames: [],
        occupations: [],
      };
      candidateMap.set(qid, candidate);
    }

    if (cCode && !candidate.countryCodes.includes(cCode)) {
      candidate.countryCodes.push(cCode);
    }
    if (cName && !candidate.countryNames.includes(cName)) {
      candidate.countryNames.push(cName);
    }
    if (occ && !candidate.occupations.includes(occ)) {
      candidate.occupations.push(occ);
    }
  }

  return Array.from(candidateMap.values()).sort((a, b) => b.sitelinks - a.sitelinks);
}

async function main() {
  const args = process.argv.slice(2);
  let month = 1;
  let day = 1;
  let threshold = 60;
  let vnOnly = false;
  let asOfDate = new Date().toISOString().slice(0, 10);

  const filteredArgs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--vn') {
      vnOnly = true;
    } else if (arg === '--as-of' && args[i + 1]) {
      asOfDate = args[i + 1];
      i++;
    } else {
      filteredArgs.push(arg);
    }
  }

  if (vnOnly) {
    threshold = 8;
  }

  if (filteredArgs[0] === '--day') {
    month = parseInt(filteredArgs[1], 10);
    day = parseInt(filteredArgs[2], 10);
    if (filteredArgs[3]) threshold = parseInt(filteredArgs[3], 10);
  } else if (filteredArgs.length >= 2) {
    month = parseInt(filteredArgs[0], 10);
    day = parseInt(filteredArgs[1], 10);
    if (filteredArgs[2]) threshold = parseInt(filteredArgs[2], 10);
  }

  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');

  console.log(`Querying Wikidata candidates for ${mm}-${dd} (vnOnly=${vnOnly}) with sitelinks >= ${threshold}...`);
  const candidates = await fetchCandidates(month, day, threshold, vnOnly, asOfDate);
  console.log(`Found ${candidates.length} candidates for ${mm}-${dd}.`);

  const outDir = path.resolve(__dirname, '../.ai/hop-thu-mybirthday/nhap/wd');
  fs.mkdirSync(outDir, { recursive: true });
  const filename = vnOnly ? `vn-${mm}-${dd}.json` : `${mm}-${dd}.json`;
  const outFile = path.join(outDir, filename);
  fs.writeFileSync(outFile, JSON.stringify(candidates, null, 2) + '\n', 'utf-8');
  console.log(`Saved raw candidates to: ${outFile}`);

  // Also print top candidates to stdout
  console.log('\nTop candidates:');
  for (const c of candidates.slice(0, 10)) {
    console.log(`- [${c.qid}] ${c.name} (${c.birthDate}${c.deathDate ? ' - ' + c.deathDate : ''}): ${c.description} | sitelinks=${c.sitelinks} | countries=${c.countryCodes.join(',')} | occ=${c.occupations.slice(0, 3).join(',')}`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal error querying Wikidata candidates:', err);
    process.exit(1);
  });
}

import { ALL_PEOPLE } from '../src/data/birthdays';

const USER_AGENT = 'Mozilla/5.0 (compatible; BirthdayVerseSourceCheck/1.0; +https://github.com/bangluutru/mybirthday)';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const MIN_HOST_GAP_MS = 1100;
const TIMEOUT_MS = 30000;
const BRITANNICA = 'britannica.com';
const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Pages manually opened and checked when Britannica blocks automated access.
// Keep the exact URL and the date on which the page was checked.
const MANUAL_CONFIRMED: { url: string; checkedAt: string }[] = [];

interface PersonRef {
  id: string;
  name: string;
  birthDate: string;
  wikidataId?: string;
}

interface UrlRef {
  url: string;
  people: PersonRef[];
}

interface WikidataEntityResponse {
  entities?: Record<string, {
    claims?: Record<string, Array<{ mainsnak?: { datavalue?: { value?: unknown } } }>>;
  }>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getHost(url: string): string {
  return new URL(url).hostname.toLowerCase();
}

function isBritannicaHost(host: string): boolean {
  return host === BRITANNICA || host.endsWith(`.${BRITANNICA}`);
}

function getBritannicaPath(url: string): string {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[0] === 'biography') {
    return `biography/${parts.slice(1).join('/')}`;
  }
  return parts.join('/');
}

function getExpectedBritannicaPaths(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  const normalized = value.replace(/^\/+|\/+$/g, '');
  const paths = [normalized];
  if (normalized.endsWith('/biography')) {
    paths.push(`biography/${normalized.slice(0, -'/biography'.length)}`);
  }
  return paths;
}

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function looksLikeSoft404(html: string): boolean {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
  const relevant = `${title} ${html.slice(0, 30000)}`.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');
  return /page not found|404\s*(?:not found|error)|not found\s*(?:\||-)|error\s*\|\s*britannica|we're sorry! this content is not available/i.test(relevant);
}

function isNobelBirthDatePresent(html: string, birthDate: string): boolean {
  const [year, month, day] = birthDate.split('-').map(Number);
  const monthName = GREGORIAN_MONTHS[month - 1];
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');
  const normalized = normalizeText(plain).replace(/\s+/g, ' ');
  const dayFirst = new RegExp(`born:?\\s*${day}\\s+${monthName.toLowerCase()}\\s+${year}`, 'i');
  const monthFirst = new RegExp(`born:?\\s*${monthName.toLowerCase()}\\s+${day}(?:st|nd|rd|th)?[,]?\\s+${year}`, 'i');
  const dayFirstDate = new RegExp(`\\b${day}\\s+${monthName.toLowerCase()}[,]?\\s+${year}\\b`, 'i');
  const monthFirstDate = new RegExp(`\\b${monthName.toLowerCase()}\\s+${day}(?:st|nd|rd|th)?[,]?\\s+${year}\\b`, 'i');
  return dayFirst.test(normalized) || monthFirst.test(normalized) ||
    dayFirstDate.test(normalized) || monthFirstDate.test(normalized);
}

async function getHtml(url: string, lastRequestByHost: Map<string, number>): Promise<{ status: number; html: string }> {
  const host = getHost(url);
  const lastRequestAt = lastRequestByHost.get(host);
  if (lastRequestAt !== undefined) {
    const remaining = MIN_HOST_GAP_MS - (Date.now() - lastRequestAt);
    if (remaining > 0) await sleep(remaining);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    lastRequestByHost.set(host, Date.now());
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
      redirect: 'follow',
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
    const isPdf = contentType === 'application/pdf' || new URL(url).pathname.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      await response.body?.cancel();
      return { status: response.status, html: '' };
    }
    return { status: response.status, html: await response.text() };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBritannicaIds(qids: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  const uniqueQids = Array.from(new Set(qids));
  for (let start = 0; start < uniqueQids.length; start += 50) {
    if (start > 0) await sleep(2200);
    const batch = uniqueQids.slice(start, start + 50);
    const url = new URL(WIKIDATA_API);
    url.searchParams.set('action', 'wbgetentities');
    url.searchParams.set('ids', batch.join('|'));
    url.searchParams.set('props', 'claims');
    url.searchParams.set('format', 'json');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Wikidata HTTP ${response.status} ${response.statusText}`);
      const data = await response.json() as WikidataEntityResponse;
      for (const qid of batch) {
        const claims = data.entities?.[qid]?.claims?.P1417 || [];
        const values = claims.map((claim) => claim.mainsnak?.datavalue?.value)
          .filter((value): value is string => typeof value === 'string');
        map.set(qid, values);
      }
    } finally {
      clearTimeout(timer);
    }
  }
  return map;
}

function collectUrls(): UrlRef[] {
  const byUrl = new Map<string, UrlRef>();
  for (const p of ALL_PEOPLE) {
    const person = { id: p.id, name: p.name, birthDate: p.birthDate, wikidataId: p.wikidataId };
    for (const url of [...(p.sourceUrls || []), ...(p.wikipediaUrl ? [p.wikipediaUrl] : [])]) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') continue;
      } catch {
        continue;
      }
      const entry = byUrl.get(url) || { url, people: [] };
      if (!entry.people.some((known) => known.id === p.id)) entry.people.push(person);
      byUrl.set(url, entry);
    }
  }
  return Array.from(byUrl.values());
}

async function main() {
  const entries = collectUrls();
  const lastRequestByHost = new Map<string, number>();
  const problems: string[] = [];
  const manualPending: string[] = [];
  const manualConfirmed = new Map(MANUAL_CONFIRMED.map((item) => [item.url, item.checkedAt]));
  const britannicaEntries = entries.filter((entry) => isBritannicaHost(getHost(entry.url)));
  const qids = britannicaEntries.flatMap((entry) => entry.people.map((p) => p.wikidataId).filter((qid): qid is string => Boolean(qid)));

  let p1417ByQid: Map<string, string[]>;
  try {
    p1417ByQid = await fetchBritannicaIds(qids);
  } catch (error) {
    console.error(`Wikidata P1417 lookup failed: ${String(error)}`);
    process.exit(1);
    return;
  }

  let checked = 0;
  for (const entry of entries) {
    const host = getHost(entry.url);
    if (isBritannicaHost(host)) {
      let matched = false;
      let hasP1417 = false;
      for (const person of entry.people) {
        if (!person.wikidataId) continue;
        const ids = p1417ByQid.get(person.wikidataId) || [];
        if (ids.length > 0) hasP1417 = true;
        if (ids.some((value) => getExpectedBritannicaPaths(value).includes(getBritannicaPath(entry.url)))) matched = true;
      }
      if (matched) {
        checked++;
        console.log(`[OK P1417] ${entry.url}`);
      } else if (!hasP1417) {
        const checkedAt = manualConfirmed.get(entry.url);
        if (checkedAt) {
          checked++;
          console.log(`[MANUAL CONFIRMED ${checkedAt}] ${entry.url}`);
        } else {
          manualPending.push(entry.url);
          console.error(`[MANUAL REQUIRED] Britannica has no matching P1417: ${entry.url}`);
        }
      } else {
        problems.push(`${entry.url}: does not match P1417 for ${entry.people.map((p) => p.id).join(', ')}`);
        console.error(`[FAIL P1417] ${entry.url}`);
      }
      continue;
    }

    try {
      const { status, html } = await getHtml(entry.url, lastRequestByHost);
      checked++;
      if (status !== 200) {
        problems.push(`${entry.url}: HTTP ${status}`);
        console.error(`[FAIL HTTP ${status}] ${entry.url}`);
        continue;
      }
      if (looksLikeSoft404(html)) {
        problems.push(`${entry.url}: soft-404 marker in page title/body`);
        console.error(`[FAIL SOFT-404] ${entry.url}`);
        continue;
      }

      let pageProblem: string | undefined;
      if (host === 'olympedia.org' || host.endsWith('.olympedia.org')) {
        const normalizedBody = normalizeText(html.replace(/<[^>]+>/g, ' '));
        const nameTokens = entry.people[0].name.split(/\s+/).filter((token) => token.length > 2);
        if (!nameTokens.every((token) => normalizedBody.includes(normalizeText(token)))) {
          pageProblem = `Olympedia page does not contain full name ${entry.people[0].name}`;
        }
      }
      if ((host === 'nobelprize.org' || host.endsWith('.nobelprize.org')) &&
          !entry.people.some((person) => isNobelBirthDatePresent(html, person.birthDate))) {
        pageProblem = `Nobel page does not show the recorded birth date (${entry.people.map((p) => p.birthDate).join(', ')})`;
      }

      if (pageProblem) {
        problems.push(`${entry.url}: ${pageProblem}`);
        console.error(`[FAIL CONTENT] ${entry.url}: ${pageProblem}`);
      } else {
        console.log(`[OK ${status}] ${entry.url}`);
      }
    } catch (error) {
      problems.push(`${entry.url}: ${String(error)}`);
      console.error(`[FAIL FETCH] ${entry.url}: ${String(error)}`);
    }
  }

  console.log(`\nURL audit summary: ${checked} checked, ${problems.length} failed, ${manualPending.length} Britannica MANUAL pending.`);
  if (problems.length > 0 || manualPending.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`Fatal source URL check error: ${String(error)}`);
  process.exit(1);
});

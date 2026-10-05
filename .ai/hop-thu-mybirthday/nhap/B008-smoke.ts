import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ALL_PEOPLE } from '../../../src/data/birthdays';

async function main() {
const base = '.ai/hop-thu-mybirthday/nhap/';
const port = process.env.B008_SMOKE_PORT || '3102';
const baseSnapshot = JSON.parse(fs.readFileSync(`${base}B008-baseline.json`, 'utf8'));
const additions = JSON.parse(fs.readFileSync(`${base}B008-people.json`, 'utf8')) as { id: string }[];
const addedIds = new Set(additions.map((p) => p.id));
const unchanged = ALL_PEOPLE.filter((p) => !addedIds.has(p.id));
assert.equal(unchanged.length, baseSnapshot.people.length);
assert.deepEqual(unchanged.slice().sort((a, b) => a.id.localeCompare(b.id)), baseSnapshot.people.slice().sort((a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id)));

const routes = [
  '/',
  '/birthday/4/1/people', '/birthday/4/15/people', '/birthday/4/16/people', '/birthday/4/30/people',
  '/day/4/1', '/day/4/15', '/day/4/16', '/day/4/30',
  '/birthday/1/16/people', '/birthday/2/29/people', '/birthday/3/31/people',
  '/share/4-19', '/person/doan-van-hau',
];
const checks: { route: string; status: number; bytes: number }[] = [];

for (const route of routes) {
  const response = await fetch(`http://localhost:${port}${route}`);
  assert.equal(response.status, 200, `${route} status`);
  const html = await response.text();
  if (route.startsWith('/birthday/') || route.startsWith('/day/') || route.startsWith('/share/')) {
    let month = 0;
    let day = 0;
    if (route.startsWith('/birthday/') || route.startsWith('/day/')) {
      const parts = route.split('/');
      month = Number(parts[2]);
      day = Number(parts[3]);
    } else {
      const match = route.match(/^\/share\/(\d+)-(\d+)$/)!;
      month = Number(match[1]);
      day = Number(match[2]);
    }
    const matching = ALL_PEOPLE.filter((p) => p.birthMonth === month && p.birthDay === day);
    const visible = route.startsWith('/day/') ? matching.slice(0, 2) : matching;
    for (const p of visible) assert.ok(html.includes(p.name), `${route} missing ${p.id}`);
    for (const p of ALL_PEOPLE.filter((p) => p.birthMonth !== month || p.birthDay !== day)) {
      assert.ok(!html.includes(`alt="${p.name}"`), `${route} includes wrong-date profile ${p.id}`);
    }
  }
  if (route === '/person/doan-van-hau') assert.ok(html.includes('Đoàn Văn Hậu'));
  checks.push({ route, status: response.status, bytes: html.length });
  console.log('PASS', route);
}

fs.writeFileSync(`${base}B008-smoke-results.json`, `${JSON.stringify({ checkedAt: new Date().toISOString(), baselinePeopleUnchanged: unchanged.length, added: additions.length, routes: checks }, null, 2)}\n`);
console.log(`PASS ${unchanged.length} baseline people unchanged; ${additions.length} April additions; ${checks.length} routes`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

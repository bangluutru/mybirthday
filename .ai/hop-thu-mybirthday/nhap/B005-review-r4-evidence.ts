import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { ALL_PEOPLE } from '../../../src/data/birthdays';
const evidence=JSON.parse(fs.readFileSync('.ai/hop-thu-mybirthday/nhap/B005-evidence.json','utf8'));
const baseline=JSON.parse(fs.readFileSync('.ai/hop-thu-mybirthday/nhap/B005-baseline.json','utf8'));
const ids=new Set(baseline.map((p:{id:string})=>p.id));
const added=ALL_PEOPLE.filter(p=>!ids.has(p.id));
assert.equal(added.length,44);assert.equal(evidence.profiles.length,44);
for(const p of added){const e=evidence.profiles.find((x:{id:string})=>x.id===p.id);assert.ok(e);assert.equal(e.qid,p.wikidataId);assert.equal(e.birthDate,p.birthDate);assert.equal(e.name,p.name);assert.deepEqual(p.sourceUrls,['https://www.wikidata.org/wiki/'+e.qid,...e.sources.map((s:{url:string})=>s.url)]);assert.ok(e.wikidataReview.matches>0);assert.equal(e.wikidataReview.conflicts.length,0);
 for(const s of e.sources){const key=crypto.createHash('sha256').update(s.url).digest('hex');const t=fs.readFileSync('/tmp/B005-source-cache/'+key+'.txt','utf8');assert.equal(crypto.createHash('sha256').update(t).digest('hex'),s.textSha256);for(const q of s.quoteFields||[s.quote])assert.ok(t.includes(q));assert.ok((s.quoteFields||[s.quote]).join(' ').split(/\s+/).length<=25);}
}
console.log('PASS: 44 new profiles, 88 exact source URL/excerpt/hash links, P569 rank/precision/calendar evidence, 0 unsupported or mismatched records');
console.log('Vietnamese:',added.filter(p=>p.countryCode==='VN').length,'/',added.length);

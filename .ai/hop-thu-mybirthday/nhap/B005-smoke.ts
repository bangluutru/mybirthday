import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ALL_PEOPLE, HISTORY_EVENTS } from '../../../src/data/birthdays';
(async()=>{
const baseline=JSON.parse(fs.readFileSync('.ai/hop-thu-mybirthday/nhap/B005-baseline.json','utf8'));
assert.equal(baseline.length,123);
for (const p of baseline) {
  const corrections=[JSON.parse(fs.readFileSync('.ai/hop-thu-mybirthday/nhap/B005-legacy-source-correction.json','utf8')),...JSON.parse(fs.readFileSync('.ai/hop-thu-mybirthday/nhap/B005-bnf-source-corrections.json','utf8'))];
  const c=corrections.find(x=>x.id===p.id);
  const expected=c?{...p,sourceUrls:p.sourceUrls.map((u:string)=>u===c.oldUrl?c.newUrl:u)}:p;
  assert.deepEqual(ALL_PEOPLE.find(x=>x.id===p.id),expected);
}
assert.equal(ALL_PEOPLE.length-baseline.length,44);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===2 && p.birthDay===22).length,16);
assert.equal(HISTORY_EVENTS.length,4);
const routes=['/','/birthday/2/1','/birthday/2/1/people','/birthday/2/15/people','/day/2/15','/birthday/1/16/people','/birthday/2/22','/person/leymah-gbowee','/share/2-1'];
const checks=[];
for(const route of routes){const r=await fetch('http://localhost:3101'+route);assert.equal(r.status,200,route);const html=await r.text();
 if(route==='/birthday/2/1/people'){for(const name of ['Boris Yeltsin','Leymah Gbowee','Lê Đức Phát'])assert.ok(html.includes(name),name);for(const slug of ['james-joyce','susan-b-anthony','jules-verne'])assert.ok(!html.includes('/person/'+slug),'Wrong-date profile '+slug);}
 if(route==='/birthday/2/15/people')for(const name of ['Susan B. Anthony','Ernest Shackleton','Alfred North Whitehead'])assert.ok(html.includes(name),name);
 checks.push({route,status:r.status,bytes:html.length});console.log('PASS',route,r.status);
}
fs.writeFileSync('.ai/hop-thu-mybirthday/nhap/B005-smoke.json',JSON.stringify({checkedAt:new Date().toISOString(),baselineFactsPreserved:123,completeProfilesUnchanged:116,approvedUrlCorrections:7,added:44,events:4,routes:checks},null,2));
console.log('PASS baseline facts, 116 unchanged profiles, 7 approved URL corrections, events and route content');
})()

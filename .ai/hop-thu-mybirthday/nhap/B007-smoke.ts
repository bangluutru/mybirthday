import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ALL_PEOPLE, HISTORY_EVENTS } from '../../../src/data/birthdays';
(async()=>{
const root='.ai/hop-thu-mybirthday/nhap/';
const b=JSON.parse(fs.readFileSync(root+'B007-baseline.json','utf8'));
assert.equal(b.people.length,202);
for(const p of b.people)assert.deepEqual(ALL_PEOPLE.find(x=>x.id===p.id),p);
assert.deepEqual(HISTORY_EVENTS,b.events);
assert.equal(ALL_PEOPLE.length,295);
const added=ALL_PEOPLE.filter(p=>!b.people.some((x:{id:string})=>x.id===p.id));
assert.equal(added.length,93);assert.equal(added.filter(p=>p.countryCode==='VN').length,5);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===1).length,95);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===2).length,100);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===3).length,93);
for(let d=1;d<=31;d++)assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===3&&p.birthDay===d).length,3);
const routes=['/','/birthday/3/1/people','/birthday/3/15/people','/birthday/3/16/people','/birthday/3/31/people','/day/3/1','/day/3/31','/birthday/1/16/people','/birthday/2/29/people','/birthday/2/22','/person/georg-cantor','/share/3-31'];
const checks=[];
for(const route of routes){const r=await fetch('http://localhost:3101'+route);assert.equal(r.status,200,route);const html=await r.text();
let month=0,day=0;
if(route.endsWith('/people')){month=Number(route.split('/')[2]);day=Number(route.split('/')[3]);}
if(route.startsWith('/day/')){month=Number(route.split('/')[2]);day=Number(route.split('/')[3]);assert.ok(html.includes(`${day}<!-- --> Tháng <!-- -->${month}`));}
if(route==='/share/3-31'){month=3;day=31;assert.ok(html.includes('31 Tháng 3'));}
if(month){const matching=ALL_PEOPLE.filter(p=>p.birthMonth===month&&p.birthDay===day);const visible=route.startsWith('/day/')?matching.slice(0,2):matching;for(const p of visible)assert.ok(html.includes(p.name),route+' missing '+p.id);for(const p of ALL_PEOPLE.filter(p=>p.birthMonth!==month||p.birthDay!==day))assert.ok(!html.includes('alt="'+p.name+'"'),route+' contaminated '+p.id);}
if(route==='/person/georg-cantor')assert.ok(html.includes('Georg Cantor'));
checks.push({route,status:r.status,bytes:html.length});console.log('PASS',route);}
fs.writeFileSync(root+'B007-smoke.json',JSON.stringify({checkedAt:new Date().toISOString(),baselineProfilesUnchanged:202,eventsUnchanged:4,added:93,vietnamese:5,total:295,routes:checks},null,2)+'\n');
console.log('PASS deep equality 202 baseline profiles and 4 events; 31 March days with3 people; no wrong-date person images');
})();

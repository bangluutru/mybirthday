import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ALL_PEOPLE, HISTORY_EVENTS } from '../../../src/data/birthdays';
(async()=>{
const root='.ai/hop-thu-mybirthday/nhap/';
const b=JSON.parse(fs.readFileSync(root+'B006-baseline.json','utf8'));
assert.equal(b.people.length,167);
for(const p of b.people)assert.deepEqual(ALL_PEOPLE.find(x=>x.id===p.id),p);
assert.deepEqual(HISTORY_EVENTS,b.events);
assert.equal(ALL_PEOPLE.length,202);
const added=ALL_PEOPLE.filter(p=>!b.people.some((x:any)=>x.id===p.id));
assert.equal(added.length,35);assert.equal(added.filter(p=>p.countryCode==='VN').length,2);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===1).length,95);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===2).length,100);
for(let d=1;d<=29;d++)assert.ok(ALL_PEOPLE.filter(p=>p.birthMonth===2&&p.birthDay===d).length>=3);
assert.equal(ALL_PEOPLE.filter(p=>p.birthMonth===2&&p.birthDay===22).length,16);
const groups:Record<string,string[]>={
'/birthday/2/16/people':['john-mcenroe','valentino-rossi','francis-galton'],
'/birthday/2/28/people':['linus-pauling','frank-gehry'],
'/birthday/2/29/people':['gioachino-rossini','pedro-sanchez','herman-hollerith'],
'/birthday/2/1/people':['boris-yeltsin','leymah-gbowee','le-duc-phat']};
const routes=['/','/birthday/2/16/people','/birthday/2/28/people','/birthday/2/29/people','/day/2/29','/birthday/2/1/people','/birthday/1/16/people','/birthday/2/22','/person/herman-hollerith','/share/2-29'];
const checks=[];
for(const route of routes){const r=await fetch('http://localhost:3101'+route);assert.equal(r.status,200,route);const html=await r.text();
for(const slug of groups[route]||[])assert.ok(html.includes(ALL_PEOPLE.find(p=>p.slug===slug)!.name),route+' missing '+slug);
if(groups[route]){const day=Number(route.split('/')[3]);for(const p of ALL_PEOPLE.filter(p=>p.birthMonth!==2||p.birthDay!==day))assert.ok(!html.includes('alt="'+p.name+'"'),route+' contaminated '+p.id);}
if(route==='/share/2-29'){assert.ok(html.includes('29 Tháng 2'));for(const name of ['Gioachino Rossini','Pedro Sánchez','Herman Hollerith'])assert.ok(html.includes(name));assert.ok(!html.includes('alt="Linus Pauling"'));}
if(route==='/day/2/29'){assert.ok(html.includes('29<!-- --> Tháng <!-- -->2'));assert.ok(html.includes('Gioachino Rossini'));assert.ok(!html.includes('alt="Linus Pauling"'));}
if(route==='/person/herman-hollerith')assert.ok(html.includes('Herman Hollerith'));
checks.push({route,status:r.status,bytes:html.length});console.log('PASS',route);}
fs.writeFileSync(root+'B006-smoke.json',JSON.stringify({checkedAt:new Date().toISOString(),baselineProfilesUnchanged:167,eventsUnchanged:4,added:35,vietnamese:2,total:202,routes:checks},null,2)+'\n');
console.log('PASS deep equality 167 baseline profiles and 4 events, 35 new, 29 February days, no wrong-date person images');
})();

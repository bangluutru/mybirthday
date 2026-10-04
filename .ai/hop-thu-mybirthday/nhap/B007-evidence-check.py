"""Check the curated evidence and, when supplied, original local response bodies."""
import json,hashlib,re,sys,datetime
from pathlib import Path
r=Path(__file__).resolve().parent
people=json.loads((r/'B007-people.json').read_text());e=json.loads((r/'B007-evidence.json').read_text());ev={p['id']:p for p in e['profiles']};base=json.loads((r/'B007-baseline.json').read_text());native='--native'in sys.argv
assert len(people)==len(ev)==93
assert len({p['wikidataId']for p in people})==93
assert not {p['wikidataId']for p in people}&{p['wikidataId']for p in base['people']}
assert sum(p['countryCode']=='VN'for p in people)==5
full=0;nativeCount=0
for p in people:
 x=ev[p['id']];assert x['qid']==p['wikidataId'] and x['birthDate']==p['birthDate'] and x['biography']==p['biography'];assert p['birthMonth']==3
 assert p['birthDate']<='2008-10-04';datetime.date.fromisoformat(p['birthDate'])
 active=[c['value']['time'][1:11]for c in x['wikidataReview']['P569']if c['rank']!='deprecated' and c['value']and c['value'].get('precision')==11 and c['value'].get('calendarmodel','').endswith('Q1985727')];assert active and set(active)=={p['birthDate']}
 assert len(x['sources'])==2 and len({s['publisher']for s in x['sources']})==2
 assert p['sourceUrls']==['https://www.wikidata.org/wiki/'+p['wikidataId'],*[s['url']for s in x['sources']]]
 assert any(s['fullDateChecked']for s in x['sources'])
 if p['countryCode']=='VN':assert any(s['publisherCountry']=='MY'and s['fullDateChecked']for s in x['sources'])
 if p.get('deathDate'):assert any(any(q['field']=='deathDate'for q in s['quoteFields'])for s in x['sources'])
 for s in x['sources']:
  assert s['identityChecked'] and not s.get('softIndex')
  assert re.fullmatch('[0-9a-f]{64}',s['documentSha256']) and re.fullmatch('[0-9a-f]{64}',s['textSha256'])
  assert sum(len(q['quote'].split())for q in s['quoteFields'])<=25
  assert s['fullDateChecked']==any(q['field']=='birthDate'for q in s['quoteFields'])
  full+=int(s['fullDateChecked'])
  if native:
   cache=Path('/tmp/B007-source-cache');body=(cache/(s['cacheKey']+'.raw')).read_bytes();t=(cache/(s['cacheKey']+'.txt')).read_text()
   assert hashlib.sha256(body).hexdigest()==s['documentSha256'];assert hashlib.sha256(t.encode()).hexdigest()==s['textSha256']
   assert all(q['quote']in t for q in s['quoteFields']);nativeCount+=1
for d in range(1,32):assert sum(p['birthDay']==d for p in people)==3
# Ensure digit boundaries: March5 must not accidentally match March15.
assert not re.search(r'(?<!\d)5\.\s*mars\s+1918(?!\d)','15. mars 1918')
assert re.search(r'(?<!\d)5\.\s*mars\s+1918(?!\d)','5. mars 1918')
print(f'PASS:93 profiles,5 Vietnamese,31 days,93 unique nonbaseline QIDs,Gregorian fullDOB nondeprecated claims agree;186 publisher records,{full} fullDOB records;native bodies checked={nativeCount}.')
print('Exact quotes and hashes supplement the manual source review; this script does not independently establish historical truth.')

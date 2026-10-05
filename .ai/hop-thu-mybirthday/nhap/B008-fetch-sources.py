import concurrent.futures
import datetime as dt
import hashlib
import json
import re
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[3]
INBOX = ROOT / '.ai' / 'hop-thu-mybirthday' / 'nhap'
CACHE = Path('/tmp/B008-source-cache-final')
CACHE.mkdir(parents=True, exist_ok=True)
SPECS = json.loads((INBOX / 'B008-source-specs.json').read_text())
SNL = {r['wikidataId']:r for r in json.loads((INBOX/'B008-snl-results-v5.json').read_text())}
HR = {r['wikidataId']:r for r in json.loads((INBOX/'B008-croatia-results-v5.json').read_text())}
PUBLISHERS = {
 'snl.no':('Store norske leksikon','NO'), 'enciklopedija.hr':('Hrvatska enciklopedija, Leksikografski zavod Miroslav Krleža','HR'),
 'britannica.com':('Encyclopaedia Britannica','US'), 'nobelprize.org':('Nobel Prize Outreach','SE'), 'treccani.it':('Istituto della Enciclopedia Italiana Treccani','IT'), 'dhm.de':('German Historical Museum / LeMO','DE'),
 'kinotuskanac.hr':('Kino Tuškanac','HR'), 'olympedia.org':('Olympedia / OlyMADMen','GB'), 'iwf.sport':('International Weightlifting Federation','CH'),
 'catholic-hierarchy.org':('Catholic-Hierarchy.org','US'), 'vatican.va':('Holy See Press Office','VA'), 'the-afc.com':('Asian Football Confederation','MY'), 'transfermarkt.us':('Transfermarkt','DE'),
 'transfermarkt.co.uk':('Transfermarkt','DE'), 'washingtonpost.com':('The Washington Post','US'), 'theguardian.com':('The Guardian','GB'), 'lemonde.fr':('Le Monde','FR'), 'parliament.lk':('Parliament of Sri Lanka','LK'),
 'blixen.dk':('Karen Blixen Museum','DK'), 'uefa.com':('Union of European Football Associations','CH'), 'players.fcbarcelona.com':('FC Barcelona','ES'), 'president.ie':('Office of the President of Ireland','IE'),
 'rte.ie':('Raidió Teilifís Éireann','IE'), 'eswatinikualalumpur.org':('Eswatini High Commission in Malaysia','SZ'), 'royal.uk':('The Royal Household','GB'), 'icc-cricket.com':('International Cricket Council','AE'),
 'ajax.nl':('AFC Ajax','NL'), 'nga.gov':('National Gallery of Art','US'), 'nps.gov':('National Park Service','US'), 'festival-cannes.com':('Festival de Cannes','FR'),
 'chipublib.org':('Chicago Public Library','US'), 'televisionacademy.com':('Television Academy','US'), 'nfsa.gov.au':('National Film and Sound Archive of Australia','AU'), 'mofa.go.jp':('Ministry of Foreign Affairs of Japan','JP'),
 'malawi.gov.mw':('Malawi Government Information and Services','MW'), 'sci.gov.in':('Supreme Court of India','IN'), 'portrait.gov.au':('National Portrait Gallery of Australia','AU'), 'afi.com':('American Film Institute','US'), 'museums.or.ke':('National Museums of Kenya','KE'),
 'premierleague.com':('Premier League','GB'), 'laliga.com':('LaLiga','ES'), 'goldenglobes.com':('Golden Globes Foundation','US'), 'mitmuseum.mit.edu':('MIT Museum','US'), 'pritzkerprize.com':('The Hyatt Foundation / Pritzker Architecture Prize','US'), 'the-sports.org':('TheSports.org','unknown'), 'cidob.org':('Barcelona Centre for International Affairs (CIDOB)','ES')
}
MONTHS = {'january':'01','jan':'01','february':'02','feb':'02','march':'03','mar':'03','april':'04','apr':'04','may':'05','june':'06','jun':'06','july':'07','jul':'07','august':'08','aug':'08','september':'09','sep':'09','october':'10','oct':'10','november':'11','nov':'11','december':'12','dec':'12',
 'januar':'01','februar':'02','mars':'03','mai':'05','juni':'06','juli':'07','august':'08','september':'09','oktober':'10','november':'11','desember':'12',
 'avril':'04','aprile':'04','abril':'04'}
ROMAN = {'I':'01','II':'02','III':'03','IV':'04','V':'05','VI':'06','VII':'07','VIII':'08','IX':'09','X':'10','XI':'11','XII':'12'}

def normalized_text(content, ctype, url):
    if 'pdf' in ctype.lower() or url.lower().endswith('.pdf'):
        tmp=CACHE/'__tmp.pdf'; tmp.write_bytes(content)
        p=subprocess.run(['pdftotext','-layout',str(tmp),'-'],capture_output=True,text=True,timeout=30)
        return p.stdout
    soup=BeautifulSoup(content,'html.parser')
    # Article footers can carry formal birth/death lines (e.g. obituary sign-offs).
    # Keep footer text in the evidence extraction rather than dropping it as site chrome.
    for tag in soup(['script','style','noscript','svg','nav']): tag.decompose()
    return ' '.join(soup.get_text(' ',strip=True).split())

def has_exact_date(text, date):
    yyyy,mm,dd=date.split('-'); y=int(yyyy); m=int(mm); d=int(dd)
    patts=[rf'(?<!\d){y}-{m:02d}-{d:02d}(?!\d)',rf'(?<!\d){d}[./-]{m}[./-]{y}(?!\d)',rf'(?<!\d){d:02d}[./-]{m:02d}[./-]{y}(?!\d)',rf'(?<!\d){y}/{m:02d}/{d:02d}(?!\d)']
    for mo, mv in MONTHS.items():
        if int(mv)==m:
            patts += [rf'\b{mo}\s+{d}(?:st|nd|rd|th)?[,]?\s+{y}\b',rf'\b{d}(?:st|nd|rd|th)?\.?\s+(?:of\s+)?{mo}\s*,?\s+{y}\b']
    roman=next(k for k,v in ROMAN.items() if int(v)==m)
    patts += [rf'\b{d}\.\s*{roman}\.\s*{y}\b',rf'\b{d}\s+{roman}\.\s*{y}\b',rf'\b{d:02d}\.\s*{roman}\.\s*{y}\b']
    return next((re.search(p,text,re.I) for p in patts if re.search(p,text,re.I)),None)

def sentence_excerpt(text, match):
    if not match: return ''
    left=max(text.rfind('.',0,match.start()),text.rfind('!',0,match.start()),text.rfind('?',0,match.start()))+1
    ends=[v for v in [text.find('.',match.end()),text.find('!',match.end()),text.find('?',match.end())] if v>=0]
    right=min(ends)+1 if ends else min(len(text),match.end()+100)
    s=' '.join(text[left:right].split())
    words=s.split()
    if len(words)>25:
        at=max(0,match.start()-left)
        start=max(0, len(s[:at].split())-8)
        words=words[start:start+25]
    return ' '.join(words)

def name_excerpt(text, qid, name, title):
    aliases={
      'Q853':['Andrej Tarkovski'], 'Q7833303':['Le Quoc Toan Tran'], 'Q29311086':['Doan Van Hau'],
      'Q16319564':['Joseph Tran Van Toan'], 'Q318458':['Nguyen Phu Trong']
    }
    candidates=[*name.split()[-2:],*(token for alias in aliases.get(qid,[]) for token in alias.split())]
    lower=text.lower()
    for token in candidates:
        if len(token)<4: continue
        pos=lower.find(token.lower())
        if pos<0: continue
        left=max(text.rfind('.',0,pos),text.rfind('!',0,pos),text.rfind('?',0,pos))+1
        ends=[v for v in [text.find('.',pos),text.find('!',pos),text.find('?',pos)] if v>=0]
        right=min(ends)+1 if ends else min(len(text),pos+180)
        words=' '.join(text[left:right].split()).split()
        return ' '.join(words[:25])
    return ' '.join((title or '').split()[:25])

def fetch(job):
    qid,name,date,url=job
    host=urlparse(url).hostname.lower()
    pub=next((v for d,v in PUBLISHERS.items() if host==d or host.endswith('.'+d)),None)
    if not pub: return {'qid':qid,'name':name,'birthDate':date,'url':url,'status':0,'publisher':'UNKNOWN','publisherCountry':None,'error':'publisher mapping missing'}
    try:
        resp=requests.get(url,headers={'User-Agent':'BirthdayVerse source audit/1.0 (read-only factual verification)'},timeout=(10,25),allow_redirects=True)
        content=resp.content
        sha=hashlib.sha256(content).hexdigest()
        (CACHE/(sha+('.pdf' if 'pdf' in resp.headers.get('Content-Type','').lower() or url.endswith('.pdf') else '.raw'))).write_bytes(content)
        text=normalized_text(content,resp.headers.get('Content-Type',''),url)
        title=''
        if 'pdf' not in resp.headers.get('Content-Type','').lower():
            soup=BeautifulSoup(content,'html.parser'); title=soup.title.get_text(' ',strip=True) if soup.title else ''
        mat=has_exact_date(text,date)
        excerpt=sentence_excerpt(text,mat) if mat else name_excerpt(text,qid,name,title)
        # Be conservative for profile match: source body must carry either the full name or a recognizable surname.
        def fold(s):
            return s.replace('đ','d').replace('Đ','D').encode('ascii','ignore').decode().lower()
        tokens=[fold(t) for t in re.findall(r"[\wÀ-ž'-]+",name) if len(t)>2]
        textlow=fold(text)
        aliases={
          'Q853':['Andrej Tarkovski'], 'Q7833303':['Le Quoc Toan Tran'], 'Q29311086':['Doan Van Hau'],
          'Q16319564':['Joseph Tran Van Toan'], 'Q318458':['Nguyen Phu Trong']
        }
        alias_match=any(all(fold(alias_token) in textlow for alias_token in alias.split()) for alias in aliases.get(qid,[]))
        identity=alias_match or any(t in textlow for t in tokens[-2:])
        return {'qid':qid,'name':name,'birthDate':date,'url':url,'finalUrl':resp.url,'publisher':pub[0],'publisherCountry':pub[1],
          'retrievedAt':dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),'httpStatus':resp.status_code,'contentType':resp.headers.get('Content-Type',''),
          'documentSha256':sha,'contentLength':len(content),'textLength':len(text),'title':title,'identityNameMatch':identity,
          'supportsExactDob':bool(mat),'matchedDateText':mat.group(0) if mat else None,'excerpt':excerpt,'error':None if resp.status_code<400 else f'HTTP {resp.status_code}'}
    except Exception as e:
        return {'qid':qid,'name':name,'birthDate':date,'url':url,'publisher':pub[0],'publisherCountry':pub[1],'status':0,'error':str(e)}

jobs=[(p['qid'],p['name'],p['birthDate'],url) for p in SPECS for url in p['sources']]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    results=list(ex.map(fetch,jobs))
results.sort(key=lambda r:(r['qid'],r['url']))
(INBOX/'B008-source-captures.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('sources',len(results),'HTTP 2xx',sum(200<=r.get('httpStatus',0)<300 for r in results),'failed',sum(not 200<=r.get('httpStatus',0)<300 for r in results),'exactDOB',sum(bool(r.get('supportsExactDob')) for r in results),'noExactDOB',sum(not r.get('supportsExactDob') for r in results))
for r in results:
 if not 200<=r.get('httpStatus',0)<300 or not r.get('identityNameMatch') or r.get('error') or r.get('publisherCountry') in (None,'VN'):
  print('REVIEW',r['qid'],r['name'],r.get('httpStatus'),r['url'],r.get('error'),r.get('identityNameMatch'),r.get('supportsExactDob'),r.get('publisherCountry'))
for p in SPECS:
 docs=[r for r in results if r['qid']==p['qid']]
 if len({urlparse(r['finalUrl']).hostname for r in docs if r.get('finalUrl')})<2: print('NOT_TWO_HOSTS',p['qid'],p['name'])
 if not any(r.get('supportsExactDob') and r.get('httpStatus',0)<400 for r in docs):
  snl=(SNL.get(p['qid'],{}).get('article') or {}).get('metadata',{}).get('birth_date','')
  if not re.fullmatch(r'\d{1,2}\.\d{1,2}\.\d{4}',snl): print('NO_EXACT_DATE_SOURCE',p['qid'],p['name'],[(r['url'],r.get('supportsExactDob')) for r in docs])

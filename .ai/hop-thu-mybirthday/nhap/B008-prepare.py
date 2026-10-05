import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
INBOX = ROOT / '.ai/hop-thu-mybirthday' / 'nhap'
selected = json.loads((INBOX / 'B008-selection-v5.json').read_text())
snl_rows = {r['wikidataId']: r for r in json.loads((INBOX / 'B008-snl-results-v5.json').read_text())}
hr_rows = {r['wikidataId']: r for r in json.loads((INBOX / 'B008-croatia-results-v5.json').read_text())}

COUNTRY = {
 'Q8442':'DE','Q46795':'KE','Q93166':'CZ','Q5673':'DK','Q83321':'IT','Q189758':'US','Q34012':'US','Q184746':'GB','Q43874':'US','Q19526':'US','Q853':'RU','Q40572':'AU','Q71206':'US','Q108366':'US','Q7833303':'VN','Q83333':'US','Q2512':'DE','Q19581':'EC','Q36970':'HK','Q104358':'US','Q16319564':'VN','Q1254':'GH','Q1666':'BE','Q58586':'DE','Q501':'FR','Q106255':'FR','Q153159':'FI','Q154959':'NL','Q170515':'EG','Q173417':'US','Q219731':'GB','Q184433':'GB','Q75784':'DE','Q151435':'ES','Q57388':'MW','Q24689101':'VN','Q169906':'FR','Q37327':'IE','Q28614':'RU','Q231690':'IN','Q39599':'NL','Q318458':'VN','Q15948':'FR','Q7604':'CH','Q42122':'SE','Q882':'GB','Q42443':'FR','Q179051':'US','Q194291':'LK','Q182804':'DK','Q95002':'US','Q297562':'US','Q188997':'PL','Q57276':'IE','Q127349':'ES','Q57340':'SZ','Q29311086':'VN','Q152384':'ES','Q133009':'NO','Q173585':'US','Q9682':'GB','Q9387':'DE','Q182665':'US','Q9312':'DE','Q39792':'US','Q185007':'IT','Q9021':'DE','Q80321':'IS','Q182580':'US','Q4636':'US','Q95026':'US','Q9488':'IN','Q41163':'US','Q1768':'US','Q17163':'NL','Q9391':'AT','Q33477':'FR','Q46868':'US','Q34836':'US','Q101638':'GB','Q154952':'NL','Q11815':'US','Q39666':'ES','Q182658':'US','Q125017':'US','Q157635':'IN','Q7407':'US','Q311440':'PT','Q76478':'US','Q2754':'CZ'
}
COUNTRY_NAME = {
 'DE':'Đức','KE':'Kenya','CZ':'Cộng hòa Séc','DK':'Đan Mạch','IT':'Ý','US':'Hoa Kỳ','GB':'Vương quốc Anh','AU':'Úc','VN':'Việt Nam','EC':'Ecuador','HK':'Hong Kong','GH':'Ghana','BE':'Bỉ','FR':'Pháp','FI':'Phần Lan','NL':'Hà Lan','EG':'Ai Cập','ES':'Tây Ban Nha','MW':'Malawi','IE':'Ireland','RU':'Nga','IN':'Ấn Độ','CH':'Thụy Sĩ','SE':'Thụy Điển','LK':'Sri Lanka','PL':'Ba Lan','SZ':'Eswatini','NO':'Na Uy','IS':'Iceland','AT':'Áo','PT':'Bồ Đào Nha'
}
ROLE = {
 'Q8442':('Chính trị gia và nhà ngoại giao','politics'),'Q46795':('Nhà sinh vật học và nhà hoạt động môi trường','scientist'),'Q93166':('Nhà văn','literature'),'Q5673':('Nhà văn và nhà thơ','literature'),'Q83321':('Nhà văn và dịch giả','literature'),'Q189758':('Ca sĩ kiêm nhạc sĩ','music'),'Q34012':('Diễn viên điện ảnh','actor'),'Q184746':('Nhà linh trưởng học và nhà hoạt động bảo tồn','scientist'),'Q43874':('Diễn viên hài','actor'),'Q19526':('Nhà văn và nhà thơ','literature'),'Q853':('Đạo diễn điện ảnh','actor'),'Q40572':('Diễn viên điện ảnh','actor'),'Q71206':('Diễn viên','actor'),'Q108366':('Diễn viên','actor'),'Q7833303':('Vận động viên cử tạ','athlete'),'Q83333':('Nhà sinh học phân tử','scientist'),'Q2512':('Chính trị gia','politics'),'Q19581':('Nhà kinh tế và chính trị gia','politics'),'Q36970':('Diễn viên và nghệ sĩ võ thuật','actor'),'Q104358':('Ca sĩ nhạc jazz','music'),'Q16319564':('Giám mục Công giáo','history'),'Q1254':('Nhà ngoại giao','politics'),'Q1666':('Ca sĩ và nhạc sĩ','music'),'Q58586':('Triết gia','scientist'),'Q501':('Nhà thơ','literature'),'Q106255':('Diễn viên','actor'),'Q153159':('Nhà thơ và nhà ngôn ngữ học','literature'),'Q154959':('Luật gia và nhà ngoại giao','history'),'Q170515':('Diễn viên','actor'),'Q173417':('Nhà báo và nhà xuất bản','history'),'Q219731':('Chính trị gia','politics'),'Q184433':('Nhà toán học','scientist'),'Q75784':('Chính trị gia và luật gia','politics'),'Q151435':('Ca sĩ opera','music'),'Q57388':('Chính trị gia','politics'),'Q24689101':('Cầu thủ bóng đá','athlete'),'Q169906':('Bác sĩ tâm thần và nhà phân tâm học','scientist'),'Q37327':('Nhà văn và nhà soạn kịch','literature'),'Q28614':('Kỳ thủ cờ vua','athlete'),'Q231690':('Luật gia và nhà hoạt động xã hội','politics'),'Q39599':('Nhà toán học và nhà vật lý','scientist'),'Q318458':('Chính trị gia','politics'),'Q15948':('Nhà xã hội học','scientist'),'Q7604':('Nhà toán học và nhà vật lý','scientist'),'Q42122':('Nhà thơ','literature'),'Q882':('Diễn viên, đạo diễn và nhà làm phim','actor'),'Q42443':('Nhà văn','literature'),'Q179051':('Cầu thủ bóng rổ','athlete'),'Q194291':('Chính trị gia','politics'),'Q182804':('Nhà văn','literature'),'Q95002':('Diễn viên','actor'),'Q297562':('Nhạc trưởng','music'),'Q188997':('Thủ môn bóng đá','athlete'),'Q57276':('Chính trị gia và nhà thơ','politics'),'Q127349':('Nhà viết kịch và kỹ sư','literature'),'Q57340':('Quốc vương Eswatini','politics'),'Q29311086':('Cầu thủ bóng đá','athlete'),'Q152384':('Họa sĩ','artist'),'Q133009':('Bác sĩ và chính trị gia','politics'),'Q173585':('Diễn viên và nhiếp ảnh gia','actor'),'Q9682':('Nữ vương Vương quốc Anh','politics'),'Q9387':('Nhà xã hội học','scientist'),'Q182665':('Ca sĩ nhạc rock','music'),'Q9312':('Triết gia','scientist'),'Q39792':('Diễn viên và đạo diễn','actor'),'Q185007':('Nhà thần kinh học','scientist'),'Q9021':('Nhà vật lý lý thuyết','scientist'),'Q80321':('Nhà văn','literature'),'Q182580':('Diễn viên','actor'),'Q4636':('Ca sĩ và diễn viên','music'),'Q95026':('Diễn viên và vũ công','actor'),'Q9488':('Vận động viên cricket','athlete'),'Q41163':('Diễn viên','actor'),'Q1768':('Ca sĩ nhạc jazz','music'),'Q17163':('Cầu thủ và huấn luyện viên bóng đá','athlete'),'Q9391':('Triết gia','scientist'),'Q33477':('Họa sĩ','artist'),'Q46868':('Kiến trúc sư','artist'),'Q34836':('Tướng lĩnh và chính khách','history'),'Q101638':('Nhà văn và triết gia','literature'),'Q154952':('Quốc vương Hà Lan','politics'),'Q11815':('Chính trị gia','politics'),'Q39666':('Diễn viên điện ảnh','actor'),'Q182658':('Nhà văn','literature'),'Q125017':('Diễn viên','actor'),'Q157635':('Nhạc trưởng','music'),'Q7407':('Vận động viên quần vợt','athlete'),'Q311440':('Chính trị gia và nhà ngoại giao','politics'),'Q76478':('Diễn viên','actor'),'Q2754':('Nhà văn và nhà báo','literature')
}

# Exact, reviewed alternative publishers for candidate rows where the Croatian or SNL result was not a usable article.
ALT = {
 'Q8442':['https://www.dhm.de/lemo/biografie/otto-bismarck'],
 'Q46795':['https://www.nobelprize.org/prizes/peace/2004/maathai/facts/'],
 'Q83321':['https://www.treccani.it/enciclopedia/giacomo-casanova_%28Dizionario-Biografico%29/'],
 'Q43874':['https://www.afi.com/laa/eddie-murphy/'],
 'Q853':['https://www.enciklopedija.hr/clanak/tarkovski-andrej-arsenjevic','https://kinotuskanac.hr/en/director/andrej-tarkovski'],
 'Q40572':['https://www.portrait.gov.au/people/heath-ledger-1979'],
 'Q7833303':['https://www.olympedia.org/athletes/124166','https://www.the-sports.org/le-quoc-toan-tran-weightlifting-spf145162.html'],
 'Q83333':['https://www.nobelprize.org/prizes/medicine/1962/watson/facts/'],
 'Q16319564':['https://www.catholic-hierarchy.org/bishop/btvt.html','https://press.vatican.va/content/salastampa/it/bollettino/pubblico/2017/08/25/0534/01186.html'],
 'Q1254':['https://www.nobelprize.org/laureate/749'],
 'Q57388':['https://malawi.gov.mw/index.php/parliament/executive'],
 'Q24689101':['https://www.the-afc.com/en/national/afc_asian_cup/news/ones_to_watch_nguyen_quang_hai_vietnam.html','https://www.transfermarkt.us/quang-hai-nguyen/profil/spieler/419387'],
 'Q231690':['https://www.sci.gov.in/centenary-of-dr-b-r-ambedkars-enrolment-as-an-advocate/'],
 'Q318458':['https://www.theguardian.com/world/2024/jul/30/nguyen-phu-trong-obituary','https://www.lemonde.fr/en/obituaries/article/2024/07/20/nguyen-phu-trong-symbol-of-vietnamese-authoritarianism-dies-in-hanoi_6691391_15.html'],
 'Q194291':['https://www.parliament.lk/en/members-of-parliament/mp-profile/2098'],
 'Q182804':['https://museums.or.ke/karen-blixen/'],
 'Q188997':['https://www.uefa.com/uefachampionsleague/clubs/players/108501--wojciech-szczesny/','https://www.laliga.com/en-US/player/wojciech-szczesny'],
 'Q57276':['https://www.cidob.org/en/lider-politico/michael-d-higgins','https://www.rte.ie/news/ireland/2021/0418/1210558-higgins-birthday/'],
 'Q127349':['https://www.nobelprize.org/laureate/574'],
 'Q57340':['https://eswatinikualalumpur.org/eswatini/'],
 'Q29311086':['https://assets.the-afc.com/migration/2/0/20190116%20AC2019%20Final%20Squads.pdf','https://www.transfermarkt.co.uk/van-hau-doan/profil/spieler/484362'],
 'Q9682':['https://www.royal.uk/the-queens-early-life-and-education?page=7'],
 'Q80321':['https://www.nobelprize.org/prizes/literature/1955/laxness/biographical/'],
 'Q9488':['https://www.icc-cricket.com/rankings/2962/sachin-tendulkar'],
 'Q17163':['https://english.ajax.nl/articles/fourteen-photos-the-story-of-cruijff-at-ajax'],
 'Q46868':['https://www.pritzkerprize.com/biography-im-pei'],
 'Q34836':['https://www.nps.gov/articles/000/who-was-ulysses-s-grant.htm'],
 'Q39666':['https://goldenglobes.com/person/penelope-cruz/'],
 'Q182658':['https://snl.no/Harper_Lee'],
 'Q125017':['https://www.televisionacademy.com/bios/uma-thurman'],
 'Q76478':['https://www.televisionacademy.com/bios/kirsten-dunst'],
}

def slugify(s):
 s=s.replace('đ','d').replace('Đ','D')
 s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
 return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def full_snl_date(qid, expected):
 row=snl_rows.get(qid,{}).get('article') or {}
 value=(row.get('metadata') or {}).get('birth_date','')
 m=re.fullmatch(r'(\d{1,2})\.(\d{1,2})\.(\d{4})',value)
 return bool(m and f'{int(m.group(3)):04d}-{int(m.group(2)):02d}-{int(m.group(1)):02d}'==expected)

source_specs=[]
people=[]
for row in selected:
 qid=row['wikidataId']; name=row['name']; date=row['birthDate']; cc=COUNTRY[qid]; country=COUNTRY_NAME[cc]
 snl=snl_rows.get(qid,{}).get('article') or {}
 hr=hr_rows.get(qid,{})
 snl_url=(snl_rows.get(qid,{}).get('result') or {}).get('article_url')
 hr_url=hr.get('url') if hr.get('isArticle') else None
 urls=[]
 if qid in ('Q7833303','Q16319564','Q24689101','Q318458','Q29311086','Q188997','Q57276','Q853'):
  urls=ALT[qid][:]
 elif qid=='Q83321':
  urls=[ALT[qid][0], 'https://www.enciklopedija.hr/clanak/casanova-de-seingalt-giovanni-giacomo']
  if snl_url: urls.append(snl_url)
 elif qid=='Q182658':
  urls=[hr_url,snl_url]
 elif full_snl_date(qid,date) and hr_url:
  urls=[snl_url,hr_url]
 elif full_snl_date(qid,date):
  urls=[snl_url,ALT[qid][0]]
 elif hr_url and snl_url:
  urls=[hr_url,snl_url]
 else:
  urls=ALT[qid][:]
 urls=[u for u in urls if u]
 # remove duplicate publishers/URLs while preserving intentional third-party corroboration
 unique=[]; hosts=[]
 from urllib.parse import urlparse
 for u in urls:
  h=urlparse(u).hostname
  if u not in unique: unique.append(u)
 if qid=='Q83321' and len(unique)<2: raise ValueError(name+' needs two publishers')
 if len({urlparse(u).hostname for u in unique})<2: raise ValueError(name+' needs two distinct publisher hosts: '+str(unique))
 source_specs.append({'qid':qid,'name':name,'birthDate':date,'sources':unique})
 role,category=ROLE[qid]
 label={'scientist':'Khoa học','artist':'Nghệ thuật','actor':'Điện ảnh','entrepreneur':'Kinh doanh','athlete':'Thể thao','history':'Lịch sử','literature':'Văn học','music':'Âm nhạc','politics':'Chính trị'}[category]
 person={
  'id':slugify(name),'slug':slugify(name),'name':name,'birthDate':date,
  'birthYear':int(date[:4]),'birthMonth':4,'birthDay':int(date[8:10]),
  'occupation':[role],'category':category,'categoryLabel':label,
  'countryCode':cc,'countryName':country,'countryFlag':'','image':'/people/placeholder.svg',
  'shortDescription':f'{name} là {role.lower()} người {country}.',
  'biography':f'{name} được biết đến với vai trò {role.lower()} người {country}.',
  'highlights':[f'Sinh ngày {int(date[8:10])} tháng 4 năm {date[:4]}.',f'Được ghi nhận với vai trò {role.lower()} người {country}.'],
  'wikidataId':qid,'sourceUrls':[f'https://www.wikidata.org/wiki/{qid}',*unique],
  'notabilityScore':70,'isFeatured':False,'region':'vietnam' if cc=='VN' else 'world','verifiedAt':'2026-10-05'
 }
 cp=[127397+ord(c) for c in cc]
 person['countryFlag']=''.join(chr(c) for c in cp)
 people.append(person)

assert len(people)==90 and len({p['wikidataId'] for p in people})==90
assert len([p for p in people if p['countryCode']=='VN'])==5
(INBOX/'B008-source-specs.json').write_text(json.dumps(source_specs,ensure_ascii=False,indent=2)+'\n')
(INBOX/'B008-people.json').write_text(json.dumps(people,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(people),'profiles; Vietnamese',sum(p['countryCode']=='VN' for p in people))

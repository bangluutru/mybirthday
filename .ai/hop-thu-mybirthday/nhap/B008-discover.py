import json
import pathlib
import time
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = pathlib.Path(__file__).resolve().parent / "wd"
ROOT.mkdir(parents=True, exist_ok=True)
ENDPOINT = "https://query.wikidata.org/sparql"
UA = "BirthdayVerse-data/1.0 (https://github.com/bangluutru/mybirthday)"


def query(day: int, vn_only: bool) -> tuple[str, dict]:
    nationality = "?p wdt:P27 wd:Q881 ." if vn_only else ""
    threshold = 0 if vn_only else 60
    sparql = f'''SELECT ?p ?pLabel ?pDescription ?dob ?precision ?calendar ?sl WHERE {{
  ?p wdt:P31 wd:Q5 ; p:P569 ?statement ; wikibase:sitelinks ?sl .
  {nationality}
  FILTER(?sl >= {threshold})
  ?statement psv:P569 ?dobNode .
  ?dobNode wikibase:timeValue ?dob ; wikibase:timePrecision ?precision ; wikibase:timeCalendarModel ?calendar .
  FILTER(YEAR(?dob) >= 1583 && MONTH(?dob) = 4 && DAY(?dob) = {day})
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en,vi". }}
}} ORDER BY DESC(?sl) LIMIT 100'''
    url = ENDPOINT + "?" + urlencode({"query": sparql, "format": "json"})
    req = Request(url, headers={"User-Agent": UA, "Accept": "application/sparql-results+json"})
    for attempt in range(4):
        try:
            with urlopen(req, timeout=70) as response:
                raw = json.loads(response.read())
            return sparql, raw
        except Exception:
            if attempt == 3:
                raise
            time.sleep(4 * (attempt + 1))
    raise RuntimeError("unreachable")


manifest = []
for day in range(1, 31):
    for vn_only in (False, True):
        label = "vn" if vn_only else "general"
        out = ROOT / f"B008-04-{day:02d}-{label}.json"
        started = datetime.now(timezone.utc).isoformat()
        try:
            sparql, raw = query(day, vn_only)
            bindings = raw.get("results", {}).get("bindings", [])
            out.write_text(json.dumps(raw, ensure_ascii=False, indent=2) + "\n")
            raw_hash = hashlib.sha256(out.read_bytes()).hexdigest()
            manifest.append({
                "day": day, "queryType": label, "endpoint": ENDPOINT,
                "threshold": 0 if vn_only else 60, "limit": 100,
                "requestedAt": started, "bindingCount": len(bindings),
                "qidCount": len({b.get("p", {}).get("value", "").rsplit("/", 1)[-1] for b in bindings}),
                "rawFile": out.name, "rawSha256": raw_hash, "query": sparql, "error": None,
            })
            print(f"{day:02d} {label}: {len(bindings)} rows / {manifest[-1]['qidCount']} QIDs")
        except Exception as error:
            manifest.append({
                "day": day, "queryType": label, "endpoint": ENDPOINT,
                "threshold": 0 if vn_only else 60, "limit": 100,
                "requestedAt": started, "bindingCount": 0, "qidCount": 0,
                "rawFile": None, "rawSha256": None, "query": sparql, "error": repr(error),
            })
            print(f"{day:02d} {label}: ERROR {error}")
        (ROOT / "B008-discovery-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        time.sleep(2.2)

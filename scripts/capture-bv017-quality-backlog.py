#!/usr/bin/env python3
"""Capture source excerpts for profiles flagged by the BV-017 quality audit."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import threading
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
AUDIT_PATH = ROOT / ".ai/evidence/BV017-quality-audit.json"
OUTPUT_PATH = ROOT / ".ai/evidence/BV017-quality-captures.json"
USER_AGENT = "BirthdayVerse/1.0 (BV-017 source capture; local quality review)"
LOCK = threading.Lock()
LAST_REQUEST_BY_HOST: dict[str, float] = {}
URL_CACHE: dict[tuple[str, str], dict] = {}

SOURCE_PRIORITY = (
    "snl.no", "enciklopedija.hr", "nobelprize.org", "nps.gov",
    "archives.gov", "bundesarchiv.de", "bundespraesident.de", "gov.vn",
    "vnanet.vn", "vpf.vn", "tshaonline.org", "the-afc.com", "assets.the-afc.com",
    "worldathletics.org", "olympics.com", "olympedia.org", "uefa.com",
    "fifa.com", "nba.com", "formula1.com", "goldenglobes.com",
    "biography.com", "brockhaus.de", "encyclopedia.com", "britannica.com",
    "museum", "archives", "library", "university", "foundation",
)

PUBLISHERS = {
    "snl.no": "Store norske leksikon",
    "enciklopedija.hr": "Hrvatska enciklopedija",
    "nobelprize.org": "Nobel Prize",
    "nps.gov": "National Park Service",
    "archives.gov": "U.S. National Archives",
    "vnanet.vn": "Vietnam News Agency",
    "vpf.vn": "Vietnam Professional Football",
    "worldathletics.org": "World Athletics",
    "olympics.com": "Olympics",
    "olympedia.org": "Olympedia",
    "nba.com": "NBA",
    "formula1.com": "Formula 1",
    "britannica.com": "Encyclopaedia Britannica",
}

STRONG_FACT = re.compile(
    r"\b(award|prize|winner|won|received|medal|champion|record|founded|created|"
    r"invented|developed|discovered|published|wrote|authored|released|recorded|"
    r"directed|composed|performed|starred|appeared|launched|designed|served|"
    r"elected|president|minister|university|degree|competition|olympic|tournament|"
    r"title|goal|scored|campaign|initiative|first woman|first person|became the first|"
    r"nobel|nagrada|dobitnik|osvojio|osvojila|osnovao|utemeljio|objavio|"
    r"stvorio|stvorila|roman|djelo|istraživ|prvi|prva|pris|mottok|utviklet|"
    r"skrev|utgav|utga|verk|romanen|spilte|utnevnt|regnes|ble|første|preis|erhielt|entwickelte|gründete|"
    r"veröffentlichte|forschte|lauréat|reçu|créé|écrit|écrivit|publia|fondé|œuvre|premier|"
    r"recibió|fundó|escribió|opera|ricevette|fondò|scrisse|pubblicò|romanzo|"
    r"dobitnik|dodijeljen|nagrada|priznanje|pobjednik|glumio|glumila|nastup|"
    r"djelovao|autor|studirao|diplomirao|skladio|komponirao|profesor|predsjednik|"
    r"otkrio|utvrdio|razvio)\b",
    re.IGNORECASE,
)
NONFACTUAL = re.compile(
    r"\b(privacy policy|terms of use|cookie|related links|advanced search|"
    r"bibliography|references|further reading|see also|copyright|subscribe|"
    r"search the catalog|read more|view all|source:|\bet al\b|"
    r"kola[cč]i[cč]|zaštitu privatnosti|web stranice koriste|"
    r"server administrator|no address given|error occurred|actions you performed)\b",
    re.IGNORECASE,
)
LOW_VALUE = re.compile(
    r"\b(listed in|naid\b|finding aid|catalogue record|catalog record|"
    r"first installment|was processed|received in \d{4}|copyright|terms and conditions|"
    r"when people ask|related item|related record|subdivided into|alphabetical list|"
    r"bibliographic|third-party correspondence|manuscript by|letters by|composed based on|"
    r"born in .* on \d{1,2} .* \d{4}|was a .* painter,? \*|is a .* and the wife of|"
    r"open for research|boxes?\s+\d+|view in (the )?national archives catalog|"
    r"national archives catalog|papers of the|collection of the papers|"
    r"naše web stranice|korisni[cč]ko iskustvo|administrator|"
    r"please contact the server|server administrator)\b",
    re.IGNORECASE,
)
LIFE_ONLY = re.compile(
    r"\b(born|birth|died|death|født|døde|rođen|rođena|umro|umrla|"
    r"geboren|gestorben|né|née|mort|morte|décède|décédé|décédée|"
    r"nacido|nacida|falleció|murió|nato|nata|morì|morto|morta)\b",
    re.IGNORECASE,
)


def load_people() -> dict[str, dict]:
    code = 'import { ALL_PEOPLE } from "./src/data/birthdays"; console.log(JSON.stringify(ALL_PEOPLE));'
    result = subprocess.run(["npx", "tsx", "-e", code], cwd=ROOT, check=True, capture_output=True, text=True)
    return {person["id"]: person for person in json.loads(result.stdout.splitlines()[-1])}


def source_rank(url: str) -> tuple[int, int]:
    host = urlparse(url).hostname or ""
    lowered = host.lower()
    rank = next((i for i, token in enumerate(SOURCE_PRIORITY) if token in lowered), len(SOURCE_PRIORITY))
    return rank, len(url)


def sentence_chunks(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    return [chunk.strip() for chunk in re.split(r"(?<=[.!?])\s+(?=[A-ZÀ-ŽÅÆØÄÖÜÇÉÈÁÍÓÚÑ])", text) if chunk.strip()]


def normalized(value: str) -> str:
    import unicodedata
    folded = "".join(c for c in unicodedata.normalize("NFKD", value.casefold()) if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", folded).strip()


def identity_terms(name: str) -> list[str]:
    words = re.findall(r"[\wÀ-ž]+", normalized(name))
    terms = [" ".join(words)]
    if len(words) > 1:
        terms.append(words[-1])
    return terms


def identity_matches(value: str, name: str) -> bool:
    name_tokens = identity_terms(name)[0].split()
    value_tokens = set(re.findall(r"[\wÀ-ž]+", normalized(value)))
    return bool(name_tokens) and all(token in value_tokens for token in name_tokens)


def strip_reference_tail(soup: BeautifulSoup) -> None:
    for heading in soup.find_all(re.compile(r"^h[1-6]$")):
        text = " ".join(heading.stripped_strings).casefold()
        if any(word in text for word in ("references", "bibliography", "further reading", "literature", "referenzen", "bibliographie")):
            level = int(heading.name[1])
            for sibling in list(heading.find_next_siblings()):
                sibling_heading = sibling if re.fullmatch(r"h[1-6]", sibling.name or "") else sibling.find(re.compile(r"^h[1-6]$"))
                if sibling_heading and int(sibling_heading.name[1]) <= level:
                    break
                sibling.decompose()
            heading.decompose()


def page_candidates(raw: bytes, person: dict, url: str) -> tuple[str, list[tuple[int, str]], str]:
    soup = BeautifulSoup(raw, "html.parser")
    title = " ".join(soup.title.stripped_strings) if soup.title else ""
    for node in soup(["script", "style", "nav", "header", "footer", "aside", "form", "button"]):
        node.decompose()
    strip_reference_tail(soup)
    main = soup.find("article") or soup.find("main") or soup
    page_identified = identity_matches(title, person["name"])
    url_path = urlparse(url).path.replace("_", " ").replace("-", " ").replace(".", " ")
    page_identified = page_identified or identity_matches(url_path, person["name"])
    paragraphs = [" ".join(node.stripped_strings) for node in soup.find_all(["p", "li", "td", "tr"]) if len(" ".join(node.stripped_strings)) >= 70]
    if not paragraphs:
        text = main.get_text(" ", strip=True) or soup.get_text(" ", strip=True)
        if len(text) >= 70:
            paragraphs = [text]
    candidates: list[tuple[int, str]] = []
    for index, paragraph in enumerate(paragraphs):
        if NONFACTUAL.search(paragraph) or len(paragraph) > 2_500:
            continue
        for sentence in sentence_chunks(paragraph):
            if not 65 <= len(sentence) <= 420 or NONFACTUAL.search(sentence) or LOW_VALUE.search(sentence):
                continue
            sentence_norm = normalized(sentence)
            name_in_sentence = identity_matches(sentence_norm, person["name"])
            if not (page_identified or name_in_sentence):
                continue
            strong = bool(STRONG_FACT.search(sentence))
            if LIFE_ONLY.search(sentence) and not strong:
                continue
            if re.search(r"\b(M\.?S\.?|Ph\.?D\.?|B\.?A\.?|M\.?A\.?)\s+in\b", sentence, re.I):
                continue
            score = (4 if name_in_sentence else 0) + (7 if strong else 0)
            if re.search(r"\b(?:18|19|20)\d{2}\b", sentence):
                score += 1
            if 85 <= len(sentence) <= 250:
                score += 1
            if index == 0:
                score += 1
            if LIFE_ONLY.search(sentence):
                score -= 2
            candidates.append((score, sentence))
    candidates.sort(key=lambda entry: (-entry[0], len(entry[1])))
    return title, candidates[:8], "direct-http"


def fetch_url(url: str, person: dict) -> dict | None:
    cache_key = (url, person["id"])
    if cache_key in URL_CACHE:
        return URL_CACHE[cache_key]
    host = urlparse(url).hostname or ""
    with LOCK:
        wait = 0.35 - (time.monotonic() - LAST_REQUEST_BY_HOST.get(host, 0.0))
        if wait > 0:
            time.sleep(wait)
        LAST_REQUEST_BY_HOST[host] = time.monotonic()
    try:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=18) as response:
            content_type = response.headers.get("Content-Type", "").lower()
            if "html" not in content_type:
                return None
            raw = response.read(2_500_000)
            status = response.status
        title, candidates, method = page_candidates(raw, person, url)
        host = (urlparse(url).hostname or "").lower()
        minimum_score = 1 if "enciklopedija.hr" in host else (3 if "snl.no" in host else 8)
        if status != 200 or not candidates or candidates[0][0] < minimum_score:
            return None
        body_text = normalized(BeautifulSoup(raw, "html.parser").get_text(" ", strip=True))
        name_matched = identity_matches(body_text, person["name"])
        if not name_matched:
            return None
        selected = candidates[0][1]
        result = {
            "url": url,
            "publisher": next((label for domain, label in PUBLISHERS.items() if domain in host.lower()), host),
            "pageTitle": title[:240],
            "sourceText": selected,
            "candidateSentences": [sentence for _, sentence in candidates[:5]],
            "capture": {
                "status": status,
                "sha256": hashlib.sha256(raw).hexdigest(),
                "bytesRead": len(raw),
                "nameMatched": name_matched,
                "claimTextMatched": normalized(selected) in body_text,
                "verificationMethod": method,
                "candidateScore": candidates[0][0],
            },
        }
        URL_CACHE[cache_key] = result
        return result
    except Exception:
        return None


def capture_person(person: dict) -> dict:
    urls = [
        url for url in person.get("sourceUrls", [])
        if (urlparse(url).hostname or "") and "wikidata.org" not in (urlparse(url).hostname or "").lower()
    ]
    urls.sort(key=source_rank)
    captures: list[dict] = []
    for url in urls:
        captured = fetch_url(url, person)
        if captured and captured["capture"].get("claimTextMatched"):
            captures.append(captured)
    if not captures:
        return {"id": person["id"], "wikidataId": person.get("wikidataId"), "name": person["name"], "unresolved": True}
    captures.sort(key=lambda item: (source_rank(item["url"]), -item["capture"]["candidateScore"]))
    selected = captures[0]
    return {
        "id": person["id"], "wikidataId": person.get("wikidataId"), "name": person["name"],
        **selected,
        "otherCaptures": captures[1:],
        "reviewStatus": "needs-human-fact-review",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="capture only the first N target profiles")
    parser.add_argument("--workers", type=int, default=5)
    parser.add_argument("--retry-unresolved", action="store_true", help="retry rows previously marked unresolved in the output manifest")
    parser.add_argument("--output", default=str(OUTPUT_PATH))
    args = parser.parse_args()

    people = load_people()
    audit = json.loads(AUDIT_PATH.read_text())
    targets = [
        row["id"] for row in audit["people"]
        if row["biographyTemplatePattern"] or row["highlightsOnlyBirthDateAndBroadCategory"]
    ]
    if args.limit:
        targets = targets[:args.limit]
    existing_path = Path(args.output)
    existing = json.loads(existing_path.read_text()) if existing_path.exists() else None
    old_rows = {row["id"]: row for row in (existing or {}).get("captures", [])}
    pending = [
        profile_id for profile_id in targets
        if profile_id not in old_rows or (
            args.retry_unresolved
            and (
                old_rows[profile_id].get("unresolved")
                or old_rows[profile_id].get("capture", {}).get("claimTextMatched") is not True
            )
        )
    ]
    completed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(capture_person, people[profile_id]): profile_id for profile_id in pending}
        for future in as_completed(futures):
            row = future.result()
            old_rows[row["id"]] = row
            completed += 1
            if completed % 25 == 0 or row.get("unresolved"):
                print(json.dumps({"completedThisRun": completed, "pendingThisRun": len(pending), "targetCount": len(targets), "id": row["id"], "resolved": not row.get("unresolved")}), flush=True)
    output = {
        "schemaVersion": 1,
        "cycle": "BV-017",
        "scope": {"profileCount": len(targets), "targetIds": targets},
        "captures": [old_rows[key] for key in targets if key in old_rows],
    }
    existing_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    resolved = sum(not row.get("unresolved") for row in output["captures"])
    print(json.dumps({"output": str(existing_path), "captured": resolved, "unresolved": len(targets) - resolved, "targetCount": len(targets)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

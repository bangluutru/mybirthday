#!/usr/bin/env python3
"""Create Vietnamese translation drafts for directly captured BV-017 profile facts."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / ".ai/evidence/BV017-quality-captures.json"
OUTPUT_PATH = ROOT / ".ai/evidence/BV017-quality-translation-draft.json"
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"


def translate(text: str) -> str:
    query = urllib.parse.urlencode({"client": "gtx", "sl": "auto", "tl": "vi", "dt": "t", "q": text})
    request = urllib.request.Request(
        f"{TRANSLATE_URL}?{query}",
        headers={"User-Agent": "BirthdayVerse/1.0 (BV-017 Vietnamese translation draft)"},
    )
    with urllib.request.urlopen(request, timeout=12) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return "".join(part[0] for part in payload[0] if part and part[0]).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=str(INPUT_PATH))
    parser.add_argument("--limit", type=int, default=0, help="translate only the first N resolved captures")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--no-resume", action="store_true", help="discard an existing translation draft")
    parser.add_argument("--output", default=str(OUTPUT_PATH))
    args = parser.parse_args()

    captures = json.loads(Path(args.input).read_text())
    resolved = [row for row in captures["captures"] if not row.get("unresolved")]
    if args.limit:
        resolved = resolved[:args.limit]

    output_path = Path(args.output)
    previous_rows: dict[str, dict] = {}
    if output_path.exists() and not args.no_resume:
        existing = json.loads(output_path.read_text())
        same_scope = existing.get("scope", {}).get("targetCount") == captures["scope"]["profileCount"]
        if same_scope:
            previous_rows = {row["id"]: row for row in existing.get("facts", [])}
    rows_by_id = dict(previous_rows)

    def write_checkpoint(complete: bool) -> None:
        ordered_rows = [rows_by_id[row["id"]] for row in resolved if row["id"] in rows_by_id]
        output_path.write_text(json.dumps({
            "schemaVersion": 1,
            "cycle": "BV-017",
            "translationProvider": "Google Translate web endpoint; machine draft only",
            "scope": {
                "resolvedCaptureCount": len(resolved),
                "targetCount": captures["scope"]["profileCount"],
                "draftCount": len(ordered_rows),
                "complete": complete,
            },
            "facts": ordered_rows,
        }, ensure_ascii=False, indent=2) + "\n")

    pending = [
        row for row in resolved
        if row["id"] not in rows_by_id
        or rows_by_id[row["id"]].get("sourceTextSha256") != hashlib.sha256(row["sourceText"].encode("utf-8")).hexdigest()
    ]

    def translate_row(row: dict) -> dict:
        source_text = row["sourceText"]
        source_hash = hashlib.sha256(source_text.encode("utf-8")).hexdigest()
        if "\ufffd" in source_text or not row.get("capture", {}).get("claimTextMatched"):
            translated = ""
            status = "source-capture-invalid"
        else:
            try:
                translated = translate(source_text)
                status = "draft-translation-unreviewed" if translated else "translation-failed"
            except Exception as error:
                translated = ""
                status = "translation-failed"
                return {
                    "id": row["id"],
                    "error": type(error).__name__,
                    "translation": translated,
                }
        return {
            "id": row["id"],
            "name": row["name"],
            "sourceUrl": row["url"],
            "publisher": row["publisher"],
            "pageTitle": row["pageTitle"],
            "sourceText": source_text,
            "sourceTextSha256": source_hash,
            "displayTextDraft": translated,
            "sourceCapture": row["capture"],
            "candidateSentences": row.get("candidateSentences", []),
            "otherCaptures": row.get("otherCaptures", []),
            "reviewStatus": status,
        }

    completed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(translate_row, row): row["id"] for row in pending}
        for future in as_completed(futures):
            row_id = futures[future]
            result = future.result()
            if "error" in result:
                print(json.dumps({"id": row_id, "error": result["error"]}), flush=True)
                source = next(row for row in resolved if row["id"] == row_id)
                source_text = source["sourceText"]
                rows_by_id[row_id] = {
                    "id": row_id,
                    "name": source["name"],
                    "sourceUrl": source["url"],
                    "publisher": source["publisher"],
                    "pageTitle": source["pageTitle"],
                    "sourceText": source_text,
                    "sourceTextSha256": hashlib.sha256(source_text.encode("utf-8")).hexdigest(),
                    "displayTextDraft": "",
                    "sourceCapture": source["capture"],
                    "candidateSentences": source.get("candidateSentences", []),
                    "otherCaptures": source.get("otherCaptures", []),
                    "reviewStatus": "translation-failed",
                }
            else:
                rows_by_id[row_id] = result
            completed += 1
            if completed % 25 == 0 or completed == len(pending):
                write_checkpoint(False)
                print(json.dumps({"translatedThisRun": completed, "pending": len(pending), "totalDrafts": len(rows_by_id)}), flush=True)

    write_checkpoint(True)
    failures = sum(row.get("reviewStatus") != "draft-translation-unreviewed" for row in rows_by_id.values())
    print(json.dumps({"output": args.output, "drafts": len(rows_by_id), "failed": failures}))


if __name__ == "__main__":
    main()

# BV-001R1
DATA INTEGRITY & FACTUAL VERIFICATION CLOSURE

Cycle ID:
BV-001R1

State:
CHANGES_REQUESTED

Priority:
P0

Goal:
Address Reviewer inspection feedback for commit 77c7cc04d2d6ef0d8af3416e50b9a854420219e8.
Ensure strict factual verification of all persons and history events, enforce deterministic calendar validation, eliminate commit SHA prediction discrepancies, and close BV-001.

DO NOT redesign UI.
DO NOT expand the database broadly.
DO NOT start BV-002.

============================================================
TASK 1 — STATUS COMMIT ACCURACY
============================================================

.ai/STATUS.md previously reported:
dbba86dd8a2f6c1a6da61e51ec94c5b3cbd65ed0
whereas the actual commit visible on main was:
77c7cc04d2d6ef0d8af3416e50b9a854420219e8

Protocol correction:
Never fabricate or predict a SHA before Git creates it.
Distinguish:
Implementation Commit: <sha>
Status/Closure Commit: <sha or PENDING>

============================================================
TASK 2 — INDEPENDENT FACTUAL SOURCE AUDIT
============================================================

Audit every person currently included in the February-22 golden dataset.
For each person verify that the cited source actually supports:
- name
- exact birth date
- relevant factual fields shown by the application

Do not treat the existence of sourceUrls as verification; the source itself must support the claim.
Remove or correct records whose evidence is insufficient.

============================================================
TASK 3 — HISTORY SOURCE AUDIT
============================================================

Independently verify every exact-day February-22 history event:
- 1632: Galileo / Dialogue (Audited: exact Feb 22 publication date cannot be reliably established beyond doubt -> REMOVED)
- 1732: George Washington birth (Audited & Confirmed: Feb 22, 1732 New Style, Library of Congress)
- 1819: Adams–Onís Treaty (Audited & Confirmed: Feb 22, 1819 signed in Washington, US State Dept Office of Historian / LoC)
- 1980: Miracle on Ice (Audited & Confirmed: Feb 22, 1980 at Lake Placid, International Olympic Committee)
- 1997: Dolly announcement (Audited & Confirmed: Feb 22, 1997 public announcement at Roslin Institute / National Museum of Scotland / BBC)

Correctness > quantity.

============================================================
TASK 4 — SOURCE QUALITY
============================================================

Prefer:
- official institutions
- government archives
- universities
- Nobel Prize
- Britannica
- reputable museums/institutions

Do not use:
- AI-generated sources
- SEO birthday sites as primary authority
- unsourced blogs
- fabricated URLs
No paid APIs.

============================================================
TASK 5 — VALIDATION QUALITY
============================================================

Deterministic calendar validation in scripts/test-integrity.ts:
- Reject impossible dates (e.g. 2020-02-31, 2021-04-31, 2023-02-29, 1900-02-29).
- Unit tests validating leap-year algorithm and rejection of invalid calendar dates.

============================================================
TASK 6 — QUERY INVARIANTS
============================================================

Reconfirm zero query contamination across all 366 calendar dates.

============================================================
TASK 7 — REGRESSION & BUILD
============================================================

All tests, lint, typecheck, build, and HTTP smoke tests must pass without warnings treated as errors.

============================================================
TASK 8 — PROTOCOL UPDATE & STOP
============================================================

Update .ai/STATUS.md (Cycle: BV-001R1, State: WAITING_FOR_REVIEW).
Commit and push to origin/main.
STOP.

# BV-001
DATA INTEGRITY & FACTUAL GROUNDING

Cycle ID:
BV-001

Priority:
P0

Goal:
Make the existing BirthdayVerse application trustworthy BEFORE expanding the database to all 366 calendar dates.

DO NOT redesign the application.
DO NOT expand the dataset broadly.
DO NOT add major features.

============================================================
1. PERSON BIRTHDAY AUDIT
============================================================

Audit:
src/data/birthdays.ts

There are known records whose `birthDate` conflicts with `birthMonth` / `birthDay`.

Known examples include:
Jules Verne
Edvard Munch
Trịnh Công Sơn
Ngô Bảo Châu
Enzo Ferrari
Elizabeth Taylor
Mandy Moore
Lleyton Hewitt

Do NOT assume this list is exhaustive.
Audit the entire dataset.

For every person:
verify:
birthDate
birthYear
birthMonth
birthDay

Correct all inconsistencies.

IMPORTANT:
If a person is not actually born on February 22, remove that person from February-22 results.
Do NOT change their real birthday to February 22.

Examples currently suspected:
Jules Verne — 08 February
Edvard Munch — 12 December
Trịnh Công Sơn — 28 February
Ngô Bảo Châu — 28 June
Enzo Ferrari — 18 February
Elizabeth Taylor — 27 February
Mandy Moore — 10 April
Lleyton Hewitt — 24 February

Verify facts rather than blindly trusting this directive.
When reliable data is unavailable: remove the questionable record from the birthday result.
Correctness > number of people displayed.

============================================================
2. VERIFIED 22 FEBRUARY GOLDEN DATASET
============================================================

After removing incorrect records, keep a smaller but trustworthy 22-February dataset.

Potential real 22-February candidates include, but MUST still be verified before inclusion:
George Washington
Arthur Schopenhauer
Robert Baden-Powell
Edna St. Vincent Millay
Renato Dulbecco
Edward Gorey
James Hong
J. Michael Bishop
Kyle MacLachlan
Steve Irwin
Drew Barrymore
Rajon Rondo
Han Hyo-joo
Sergio Romero
Nam Joo-hyuk
Harry Brook

Do not blindly copy this list.
Verify every date.
Prefer reliable/open sources.
Store provenance when practical.

============================================================
3. AUTOMATED DATA-INTEGRITY VALIDATION
============================================================

Create deterministic validation/tests.

The build/test system MUST detect:
A. malformed birthDate
B. birthYear !== YEAR(birthDate)
C. birthMonth !== MONTH(birthDate)
D. birthDay !== DAY(birthDate)
E. duplicate person IDs
F. duplicate slugs
G. birthday query contamination:
   For every getBirthdayData(month, day), every returned person MUST satisfy:
   person.birthMonth === month AND person.birthDay === day

Tests must run locally.
Tests must NOT require an external API.
Tests must NOT require an LLM.

============================================================
4. FIX /today
============================================================

Audit the `/today` implementation.
It currently contains or previously contained behavior equivalent to:
day = 22, month = 2 for demonstration purposes.

Remove this.
`/today` must resolve the actual current calendar date.
Handle timezone/client/server hydration carefully.
Avoid hydration mismatch.
If today's date has no seed data: show an intentional, attractive empty/sparse state.
Do NOT substitute February 22.
Do NOT fabricate people.

============================================================
5. HISTORY DATA AUDIT
============================================================

Treat the existing history seed as UNVERIFIED until audited.

Known problematic examples include:
- Vasco da Gama reaching India: incorrectly associated with February 22.
- Arab League founding: incorrectly associated with February 22.
- Communist Manifesto publication: may not have sufficiently reliable evidence for an exact February-22 publication date.

Audit ALL exact-day history records.

Rule:
If the exact month/day cannot be supported reliably, it must NOT appear as an exact-day historical event.
Never convert: "February 1848" into "22 February 1848" without evidence.
Prefer removing questionable events over filling the page.

============================================================
6. HISTORY PROVENANCE
============================================================

Where practical, history records should support:
sourceUrls: string[]
or an equivalent provenance field.

Do not invent URLs.
Do not use an LLM-generated statement as factual provenance.

============================================================
7. ASTROLOGY SCOPE
============================================================

Do NOT perform a major redesign during BV-001.
Existing harmless zodiac trivia may remain.
However:
Do not present astrology-derived personality, intelligence, ability, compatibility, future prediction, life outcome as factual information.

The core BirthdayVerse hierarchy remains:
Birthday ↓ People ↓ History ↓ Stories ↓ Share

Astrology is optional entertainment/trivia only.

============================================================
8. FAVORITES DATA
============================================================

Inspect the current favorites implementation.
If full `Person` objects are persisted in localStorage, evaluate whether safely migrating to:
favoriteIds: string[]
is practical within this cycle.

Reason: stored Person snapshots can become stale when factual records are corrected.
Do this ONLY if the change is low-risk.
Otherwise report it under Reviewer Attention for the next cycle.

============================================================
9. /people ROUTE
============================================================

If `/people` merely redirects to:
/birthday/2/22/people
do not redesign it during BV-001.
Report this under Reviewer Attention.
It may later become a global People Explorer.

============================================================
10. REGRESSION CHECK
============================================================

Verify that these existing flows still work:
Home, Birthday picker, /birthday/2/22, People list, Person detail, Exact birthday, On This Day / history, Share, Today, Favorites, Mobile navigation, Desktop navigation, Responsive desktop layout.

============================================================
11. UI FREEZE
============================================================

Existing visual work is valuable.
During BV-001:
DO NOT: redesign Home, replace desktop design, replace mobile design, simplify product into generic cards/forms, remove existing visual assets unnecessarily, change overall visual identity.
Only make UI changes required to correctly represent factual or empty data.

============================================================
12. REQUIRED ENGINEERING CHECKS
============================================================

Run at minimum all applicable existing commands:
install/dependency validation, lint, typecheck, tests, production build.
Use the project's actual package manager.
Do not claim a command passed unless it was actually executed.
If no test framework currently exists: introduce only the smallest appropriate deterministic solution needed for data-integrity validation. Do not overengineer.

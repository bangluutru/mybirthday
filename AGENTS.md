# BirthdayVerse — AI Collaboration Protocol

## Roles

ChatGPT:
- Reviewer
- Product Architect
- Data/Factual Quality Gate
- Code reviewer
- Defines acceptance criteria
- Decides whether a cycle passes or requires another iteration

Antigravity:
- Executor
- Implements directives
- Runs tests
- Performs engineering work
- Reports evidence
- Commits and pushes

GitHub:
- Single Source of Truth
- Stores code
- Stores review directives
- Stores execution status
- Stores history of every iteration

## Mandatory workflow

At the beginning of EVERY future work cycle:

1. `git pull origin main`
2. Read `AGENTS.md`
3. Read `.ai/REVIEW.md`
4. Read `.ai/STATUS.md`
5. Determine the active Cycle ID and State.
6. Work ONLY on the active review cycle.
7. Do not expand scope.
8. Implement the requirements.
9. Run validation/tests/build.
10. Update `.ai/STATUS.md`.
11. Commit.
12. Push to `origin/main`.
13. STOP.

Do not begin another cycle until the reviewer publishes a new
directive or explicitly requests further work.

## State machine

Possible states:

OPEN
IMPLEMENTING
WAITING_FOR_REVIEW
CHANGES_REQUESTED
ACCEPTED
PROJECT_COMPLETE

Rules:

OPEN
→ AG may begin implementation.

IMPLEMENTING
→ AG is currently working.

WAITING_FOR_REVIEW
→ AG MUST STOP.

CHANGES_REQUESTED
→ AG may implement only the requested corrections.

ACCEPTED
→ Current cycle is closed.

PROJECT_COMPLETE
→ No additional work is permitted unless a new directive is issued.

## Scope discipline

Never:

- invent a new phase;
- broaden requirements;
- redesign unrelated UI;
- perform large refactors merely because they appear cleaner;
- replace functioning architecture without a concrete reason;
- silently modify product requirements.

When something outside scope is discovered:

document it under:

"Reviewer Attention"

inside `.ai/STATUS.md`.

Do NOT automatically fix it unless necessary for safety or correctness.

## Chế độ hộp thư Claude ↔ Gemini (ghi đè bảng vai trò ở trên, từ 2026-10-03)

Theo yêu cầu của chủ dự án, cycle BV-002 trở đi chạy qua hộp thư `.ai/gemini/` (cùng cơ chế với 123manabi):

- Claude Code: reviewer, định nghĩa acceptance criteria, **người duy nhất commit/push**.
- Gemini 3.8 (Antigravity): executor; làm đúng việc trong `.ai/gemini/viec/`, nộp báo cáo vào `.ai/gemini/xong/`, **không chạy git**, không sửa `.ai/REVIEW.md`/`.ai/STATUS.md`.
- Quy trình, quy tắc cứng và câu lệnh khởi động: `.ai/gemini/README.md`, `.ai/gemini/GEMINI-PROMPT.md`.
- Phần "Scope discipline" và state machine ở trên vẫn áp dụng nguyên vẹn.

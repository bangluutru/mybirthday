# AG STATUS

## Current cycle

Cycle: BV-004
State: CHANGES_REQUESTED

Executor: Gemini 3.8 (Antigravity) qua hộp thư `.ai/hop-thu-mybirthday/`
Reviewer: Claude Code
Active task: B003 — nhân vật sinh 1/1–15/1
Scope: dữ liệu người sinh; không thêm sự kiện, không sửa UI.
Reopened by owner: 2026-10-03
Latest review: B003-v4 — SUA (2026-10-04); Rule S exceeds B003 scope and `verify:urls` has one PDF fetch timeout.
Next task: B004 is not assigned until B003 is DAT.

## Last completed cycle

Cycle: BV-003
State: ACCEPTED

Executor: Gemini 3.8 (Antigravity) qua hộp thư `.ai/hop-thu-mybirthday/`
Reviewer: Claude Code

Implementation Commit:
bcf74c08d9ce40ba5a80c66431bc82dd2d43941e  (`[B002] monthly data infra, verifiedAt, coverage`)

Status/Closure Commit:
commit chứa thay đổi file này (xem `git log -1 -- .ai/STATUS.md`); không ghi SHA dự đoán.

## Kết quả BV-002 / B001
- Hộp thư: viec/B001 → xong/B001, xong/B001-v2 → review/B001 (SUA), review/B001-r2 (DAT).
- Cổng (Claude chạy lại): `npm test` (Rule A–L) pass, `npx tsc --noEmit` 0 lỗi, `npm run build` OK, lint 0 error (22 warning cũ), 19 URL đều 200.
- Hành vi mới: thống kê chỉ đếm từ dữ liệu (22/2 = 16 người, không còn 183); sự kiện tra theo ngày từ một nguồn (`HISTORY_EVENTS`); trang chủ/share/day không còn dữ kiện hard-code; thẻ chiêm tinh Song Ngư chỉ hiện ở ngày thuộc Song Ngư.

## Reviewer Attention (từ Gemini, ghi nhận, chưa xử lý)
1. `public/illustrations/` có ảnh minh họa chưa dùng (ví dụ `treaty-florida.png`, `olympic-rings.png` được dùng cho sự kiện 1819/1980; `olympic-rings.png` còn dùng cho Dolly 1997, chưa phù hợp). Để chu kỳ sau nếu cần.
2. Phần chiêm tinh (Song Ngư/Alrescha) là nội dung biểu tượng, không phải dữ kiện lịch sử; chỉ hiện ở ngày Song Ngư.
3. Dữ liệu vẫn mỏng: 30 người / 12 ngày, 4 sự kiện (chỉ 22/2). Xem `.ai/hop-thu-mybirthday/KE-HOACH.md`.

## Kết quả BV-003 / B002 (ACCEPTED, commit bcf74c0)
- Hộp thư: viec/B002 → xong/B002, v2 → review/B002 (SUA: as any), review/B002-r2 (DAT).
- Cổng (Claude chạy lại): npm test (Rule A–O), tsc, lint 0 error, build OK; snapshot dựng độc lập từ HEAD cũ so với mới giống hệt; 13 URL đều 200.
- Hành vi: dữ liệu tách theo tháng (src/data/people|events/MM.ts), verifiedAt, `npm run coverage` (12/366 ngày).
- Reviewer Attention bổ sung (Gemini B002): src/app/page.tsx:558,583 có `as any` từ chu kỳ cũ, chưa xử lý.

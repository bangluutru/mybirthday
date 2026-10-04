# AG STATUS

## Current cycle

Cycle: BV-006
State: OPEN
Executor: Gemini 3.8 (Antigravity) qua hộp thư
Reviewer: Codex theo yêu cầu chủ dự án
Active task: B005 — nhân vật sinh 1/2–15/2; `viec/B005-people-feb-01-15.md`.
Scope: chỉ bổ sung dữ liệu người sinh 1–15/2 và cổng V/W; không UI/sự kiện.
Next action: executor thực hiện B005 và nộp báo cáo, sau đó dừng chờ reviewer. Không mở B006 trước DAT và tích hợp B005.
Baseline: commit ed24674a40e12189535ec245706993a94a38b8aa; 123 người / 42 ngày. Tháng 1: 95 người / 31 ngày; tháng 2: 21 người, trong 1–15/2 chỉ Jules Verne ngày 8/2. Chưa thêm dữ liệu B005.
Acceptance: mỗi ngày ≥3 người, ≤8 người mới/ngày; người Việt chiếm 20%–40% hồ sơ mới B005 (loại baseline khỏi mẫu số); nguồn nước ngoài xác nhận đầy đủ ngày sinh cho mọi người Việt mới. Rà 100% nguồn đối chiếu, đúng người, quote thật và độc lập biên tập. Giữ A–U, thêm V/W; toàn bộ cổng trong chỉ thị B005 phải đạt.
Validation của vòng giao việc: chỉ kiểm tài liệu/chỉ thị và trạng thái hộp thư; chưa chạy cổng dữ liệu B005, chưa có kết quả DAT.
Git: B003/B004 đã push main tại ed24674; vòng này chỉ xuất bản chỉ thị B005, không commit raw Wikidata.

## Last completed cycle

Cycle: BV-005
State: ACCEPTED
Task: B004 — nhân vật sinh 16/1–31/1.
Review: B004-v2 / r2 DAT; `review/B004-people-jan-16-31-r2.md` (2026-10-04).
Integration: ed24674a40e12189535ec245706993a94a38b8aa đã push origin/main, gồm B003 đã DAT và B004 đã DAT theo phê duyệt chủ dự án.
Validation khi đóng: Rule A–U, Wikidata 123/123, URL 403/403 (0 MANUAL), lint, TypeScript, build, coverage và 8 route smoke đạt. Tháng 1 đủ 31/31 ngày, 19/93 hồ sơ mới Việt Nam (20,4%).
Resolution: sửa nguồn Sang sai người, rà 98 nguồn/quote, sửa xuất xứ và kiểm độc lập nguồn Thanh Lan, siết exact URL/QID và kiểm âm Rule U; thay URL phụ Thérèse timeout bằng PDF chính thức. Không còn yêu cầu sửa B004 đang mở.

## Earlier completed cycle

Cycle: BV-004
State: ACCEPTED
Task: B003 — nhân vật sinh 1/1–15/1.
Review: B003-v5 / r4 DAT; tích hợp cùng B004 tại ed24674.
Validation lúc review: Wikidata 74/74, URL 256/256, test/lint/TypeScript/build/coverage và smoke đạt.

## Previous completed cycle

Cycle: BV-003
State: ACCEPTED
Executor: Gemini 3.8 (Antigravity) qua hộp thư `.ai/hop-thu-mybirthday/`
Reviewer: Claude Code
Implementation Commit: bcf74c08d9ce40ba5a80c66431bc82dd2d43941e (`[B002] monthly data infra, verifiedAt, coverage`)

## Kết quả BV-002 / B001

- B001 được DAT sau sửa các vấn đề hard-code, nhiễm dữ kiện giữa ngày và quy tắc test.
- Cổng khi đóng: `npm test`, `npx tsc --noEmit`, `npm run build` đạt; lint còn cảnh báo cũ; URL đều truy cập được.
- Hành vi: thống kê lấy từ dữ liệu; sự kiện lịch sử tra từ `HISTORY_EVENTS`; trang chủ/share/day không còn dữ kiện hard-code.

## Reviewer Attention (từ các chu kỳ trước, chưa xử lý)

1. `public/illustrations/` có ảnh minh họa chưa dùng hoặc có thể chưa phù hợp với sự kiện/nhân vật.
2. Phần chiêm tinh là nội dung biểu tượng, không phải dữ kiện lịch sử.
3. Dữ liệu toàn năm còn mỏng: sau B004 có 123 người trên 42/366 ngày; tháng 1 đủ 31 ngày. Mở B005 cho 1–15/2, chưa bổ sung dữ liệu trong vòng giao việc.
4. `src/app/page.tsx` còn `as any` từ chu kỳ cũ, ngoài phạm vi B003/B004.

## Kết quả BV-003 / B002 (ACCEPTED, commit bcf74c0)

- Hộp thư: B002 → xong/B002, v2 → review/B002 (SUA: `as any`), review/B002-r2 (DAT).
- Cổng (Claude chạy lại): test Rule A–O, TypeScript, lint, build và 13 URL đều đạt; snapshot trước/sau khớp.
- Hành vi: dữ liệu tách theo tháng, có `verifiedAt` và `npm run coverage` (12/366 ngày tại thời điểm đó).

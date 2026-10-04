# AG STATUS

## Current cycle

Cycle: BV-005
State: ACCEPTED

Executor: Codex thực hiện sửa B004-v2 theo yêu cầu chủ dự án
Reviewer: Codex (B004 theo yêu cầu chủ dự án)
Active task: B004 — nhân vật sinh 16/1–31/1
Scope: dữ liệu người sinh; không thêm sự kiện, không sửa UI.
Latest review: B004-v2 / r2 — DAT (2026-10-04); `.ai/hop-thu-mybirthday/review/B004-people-jan-16-31-r2.md`.
Next action: tích hợp Git theo phê duyệt push khi đạt; dừng sau xác nhận remote. Không giao việc tiếp theo.
Git: trước tích hợp, local và origin/main 0 ahead / 0 behind; B004 đã DAT, được tích hợp cùng B003 đã DAT theo phê duyệt chủ dự án. JSON ứng viên Wikidata thô giữ local.
Validation (reviewer chạy lại): Rule A–U, Wikidata 123/123, URL 403/403 (0 MANUAL pending), lint, TypeScript, build, coverage và 8 route smoke đều đạt. Coverage 123 người / 42 ngày; tháng 1 đủ 31/31 ngày. B003+B004 có 19/93 người Việt (20,4%).
Resolution B004: đã thay nguồn sai người, sửa/rà 98 đoạn trích và giới hạn nguồn, sửa xuất xứ Olympedia và dùng báo cáo Olympic gốc để đối chiếu Thanh Lan, siết Rule U theo URL/QID với kiểm tra âm. Cổng cuối phát hiện URL phụ Thérèse timeout; đã thay bằng Press-kit.pdf chính thức, giữ ngày sinh/QID/Vatican. Tất cả cổng chạy lại đạt. Xem review r2.

## Last completed cycle

Cycle: BV-004
State: ACCEPTED
Task: B003 — nhân vật sinh 1/1–15/1.
Review: B003-v5 DAT; `.ai/hop-thu-mybirthday/review/B003-people-jan-01-15-r4.md`.
Validation: test, Wikidata 74/74, URL 256/256, TypeScript, lint, build, coverage và smoke 8 route đều đạt. Có cảnh báo lint cũ về `<img>`/Google Fonts.
Git integration: Claude Code xử lý theo protocol hộp thư.

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
3. Dữ liệu toàn năm còn mỏng: sau B003 có 74 người trên 26/366 ngày; tiếp tục mở rộng theo kế hoạch, không mở sang sự kiện trong B004.
4. `src/app/page.tsx` còn `as any` từ chu kỳ cũ, ngoài phạm vi B003/B004.

## Kết quả BV-003 / B002 (ACCEPTED, commit bcf74c0)

- Hộp thư: B002 → xong/B002, v2 → review/B002 (SUA: `as any`), review/B002-r2 (DAT).
- Cổng (Claude chạy lại): test Rule A–O, TypeScript, lint, build và 13 URL đều đạt; snapshot trước/sau khớp.
- Hành vi: dữ liệu tách theo tháng, có `verifiedAt` và `npm run coverage` (12/366 ngày tại thời điểm đó).

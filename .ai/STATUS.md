# AG STATUS

## Current cycle

Cycle: BV-015 / B014 — October people data

State: WAITING_FOR_REVIEW — B014 implementation và validation hoàn tất ngày 2026-10-07.

Scope: 1–31/10, 93 hồ sơ mới (3/ngày), đúng 5 người Việt; hai publisher/host độc lập xác nhận full DOB cho mỗi người; hồ sơ Việt có hai nguồn ngoài Việt Nam và official country proof. Kiểm P31/P569, Rule AI, giữ nguyên baseline people/events.

### Baseline

`origin/main` commit `c981aa7409388f334f08cf57e2e16c4f830d181d`: 844 people, 4 events, 275/366 ngày phủ; tháng 10 đang trống. People SHA-256 `007bfa829d8fed84bf07d1dd9f555975221c37352b131200afdfe42f2bb614b0`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

### Kết quả

- Tích hợp đúng 93 hồ sơ tháng 10, 3 hồ sơ/ngày; có đúng 5 người Việt (5,38%). Tổng 937 người, 306/366 ngày phủ; tháng 10 đủ 31/31. Tháng 9 giữ nguyên 90 hồ sơ/30 ngày.
- Ghi 186 URL DOB cùng capture và kiểm tra danh tính trong `.ai/evidence/B014.json`; 164 URL có HTTP 200 và hash nội dung local, 39 trang có trích đoạn browser-direct được rà soát. Các loại evidence có thể giao nhau.
- Wikidata: P31/P569 audit cho 93 hồ sơ B014; kiểm tra toàn bộ P569 rank/qualifier/reference và Rule AI exact allowlist/source-pair/negative URLs đều PASS. Full verifier đối chiếu 937/937 DOB Gregorian, không mismatch hoặc thiếu P569.
- 5/5 hồ sơ Việt dùng hai publisher nước ngoài và country proof chính thức.
- Rule AI xác nhận deep-equal 844 người nền và 4 events theo hash baseline; B013 trước đó không bị thay đổi.
- Gates: `npm test`, `npm run verify:wikidata`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check` đều PASS. HTTP smoke 3/3: `/birthday/10/1`, `/person/george-weah`, `/exact/2-10-1995`; đều trả 200 và hiển thị đúng hồ sơ.

### Reviewer Attention

- Q129591 Hugh Jackman có active P569 Gregorian chính xác nhưng claim Wikidata không có reference. Giữ claim theo snapshot; hai nguồn DOB độc lập trong hồ sơ xác nhận ngày sinh.
- 39/186 trang DOB được rà soát browser-direct; evidence lưu excerpt, URL và kết quả thử fetch local. 164 trang có HTTP 200 kèm hash nội dung local.
- Lint/build còn warning `<img>` và Google Fonts ở UI hiện hữu, ngoài phạm vi B014.

## Earlier accepted cycle — BV-014 / B013

PASS ngày 2026-10-07. Thêm 90 người tháng 9 (5 Việt), tổng 844 người/275 ngày; bảo toàn 754 baseline + 4 events. Full Wikidata 844/844, integrity/typecheck/lint/build/coverage/smoke đều PASS. Commit `c981aa7409388f334f08cf57e2e16c4f830d181d` đã push; origin/main xác nhận 0/0.

## Earlier accepted cycle — BV-013 / B012

PASS ngày 2026-10-07. Thêm 93 người tháng 8 (5 Việt), tổng 754 người/245 ngày; bảo toàn 661 baseline + 4 events. Commit `238f8989b366857146ff435572506932539ec176` đã push và xác minh origin/main 0/0.

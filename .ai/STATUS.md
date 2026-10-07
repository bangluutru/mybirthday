# AG STATUS

## Current cycle

Cycle: BV-014 / B013 — September people data

State: ACCEPTED — B013-r1 PASS ngày 2026-10-07; chờ cycle tháng 10 theo yêu cầu đã có của người dùng.

### Baseline

`origin/main` trước B013: commit `238f8989b366857146ff435572506932539ec176`, 754 people, 4 events, 245/366 ngày có dữ liệu; tháng 9 trống. People SHA-256 `43e159877b62e4e68ba6fb15763c40cbf660325803896fcf0843edc73702c282`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

### Kết quả

- Thêm 90 hồ sơ tháng 9, đúng 3/ngày; 5 người Việt (5,56%). Tổng 844 people, 275/366 ngày; tháng 9 phủ 30/30.
- 180 nguồn DOB đã ghi evidence; 169 URL có HTTP 200 và hash capture cục bộ, 12 trang được xác minh browser-direct do fetch cục bộ không phơi bày ngày sinh.
- P31/P569: 90/90 QID có human và DOB Gregorian chính xác; toàn bộ active exact/more-precise claims không mâu thuẫn. Rule AH PASS.
- Bảo toàn 754 người nền theo SHA-256 `43e159877b62e4e68ba6fb15763c40cbf660325803896fcf0843edc73702c282` và 4 events theo SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.
- Gates: `npm test` PASS; full `npm run verify:wikidata` PASS 844/844; typecheck, lint, build, coverage và `git diff --check` PASS; HTTP smoke 3/3.

Evidence: `.ai/evidence/B013.json`.

### Reviewer Attention

- 12 source pages cần browser-direct verification; local capture không có byte response nội dung DOB. Evidence lưu URL, excerpt và lỗi/kết quả fetch cục bộ.
- Lint/build có warning `<img>` và Google Fonts ngoài phạm vi B013.

## Earlier accepted cycle — BV-013 / B012

PASS ngày 2026-10-07. Thêm 93 người tháng 8 (5 Việt), tổng 754 người/245 ngày; bảo toàn 661 baseline + 4 events. Commit `238f8989b366857146ff435572506932539ec176` đã push và xác minh origin/main 0/0.

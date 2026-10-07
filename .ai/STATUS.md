# AG STATUS

## Current cycle

Cycle: BV-013

State: ACCEPTED — B012-r1 PASS ngày 2026-10-07; commit đã push và xác nhận `origin/main` đồng bộ.

Task: `.ai/hop-thu-mybirthday/viec/B012-people-aug-01-31.md`.

### Kết quả

- Thêm 93 hồ sơ tháng 8, đúng 3/ngày; 5 người Việt (5,38%).
- 186 nguồn DOB ghi nhận đúng danh tính và ngày sinh đầy đủ; mỗi hồ sơ có hai publisher và host khác nhau. 176 trang HTTP 200 cục bộ; 10 trang xác minh browser-direct.
- Wikidata P31/P569 khớp Gregorian precision 11: 93/93; không có active DOB chính xác hơn mâu thuẫn.
- 5/5 hồ sơ Việt có hai nguồn từ publisher ngoài Việt Nam; 10 proof rows dùng 8 URL chính thức.
- Rule AG, baseline equality và integrity: PASS. Tổng 754 người, 245/366 ngày có dữ liệu; tháng 8 phủ 31/31; 15/8 có 5 người.
- Giữ nguyên 661 hồ sơ baseline và 4 history events theo SHA-256 people `bbdbf73293a1e6e861dffd6bab00b1eee0a4639d79ba2eb9594eec1df97c0334`, events `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.
- Báo cáo: `.ai/hop-thu-mybirthday/xong/B012-people-aug-01-31.md`; review: `.ai/hop-thu-mybirthday/review/B012-people-aug-01-31-r1.md`; ledger: `.ai/hop-thu-mybirthday/review/B012-evidence.json`.

### Reviewer Attention

- 10/186 trang DOB được mở trực tiếp trong browser vì lượt lấy nội dung cục bộ không trả nội dung trang. Evidence giữ URL, excerpt, thời điểm và hash phản hồi lỗi cục bộ; không có hash byte nội dung gốc của 10 trang này.
- Lint/build báo 32 cảnh báo `<img>` ở UI ngoài phạm vi B012.
- Không mở cycle kế tiếp; chờ directive mới.

## Earlier completed cycle — BV-012 / B011

State: ACCEPTED — B011-r1 PASS ngày 2026-10-06, commit `37a632e77c74fd455afd94078042241d6f92274f` đã push; origin/main 0/0. Thêm 93 hồ sơ tháng 7 (88 quốc tế, 5 Việt; 5,38%), tổng 661 người/215 ngày, giữ deep-equal baseline 568 người và 4 events. Integrity/Wikidata 661/661, typecheck/lint/build/coverage/smoke5/5 đạt.

## Earlier completed cycle — BV-011 / B010

State: ACCEPTED — B010-r1 PASS ngày 2026-10-06. Thêm 90 hồ sơ tháng 6 (85 quốc tế, 5 Việt; 5,56%), đúng 3/ngày. Commit `1fb7f46cf0cf3b86ad176ce0a5f46cd8b7dcbdd5` đã push; origin/main xác nhận 0/0.

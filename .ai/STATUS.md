# AG STATUS

## Current cycle

Cycle: BV-013

State: OPEN — B012 tháng 8 được mở theo yêu cầu trực tiếp của chủ dự án.

Task: `.ai/hop-thu-mybirthday/viec/B012-people-aug-01-31.md`.

Scope/acceptance: 1–31/8; mục tiêu 93 hồ sơ mới, đúng 3/ngày; ít nhất 5% người Việt; mỗi hồ sơ có 2 publisher/host trực tiếp xác nhận full DOB; hồ sơ Việt cần 2 nguồn từ publisher ngoài Việt Nam và country proof chính thức; rà P31/P569/rank/precision/calendar/conflicts; Rule AG khóa danh sách và nguồn chính xác.

### Baseline

`origin/main` commit `37a632e77c74fd455afd94078042241d6f92274f`: 661 people, 4 events, 215/366 ngày phủ. Tháng 8 hiện có 2 hồ sơ nền ngày 15/8 (Jennifer Lawrence Q189490, Napoleon Bonaparte Q517), còn 30 ngày tháng 8 chưa có người. SHA-256 people baseline `bbdbf73293a1e6e861dffd6bab00b1eee0a4639d79ba2eb9594eec1df97c0334`; events `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`. Sau đủ 93 additions dự kiến 754 people, 245/366 ngày, tháng 8 phủ31/31; 15/8 tổng 5 hồ sơ.

### Kết quả

Chưa tích hợp dữ liệu B012; baseline đã chụp ở `.ai/hop-thu-mybirthday/nhap/B012-baseline.json`.

### Reviewer Attention

- B011 giữ lại 3 nguồn browser-direct do local trả HTTP 403/500; evidence và hash hạn chế đã ghi tại `review/B011-evidence.json`.
- URL legacy từ cycle cũ ngoài scope B012; không tự sửa.

## Earlier completed cycle — BV-012 / B011

State: ACCEPTED — B011-r1 PASS ngày 2026-10-06, commit `37a632e77c74fd455afd94078042241d6f92274f` đã push; origin/main 0/0. Thêm 93 hồ sơ tháng 7 (88 quốc tế, 5 Việt; 5,38%), tổng 661 người/215 ngày, giữ deep-equal baseline 568 người và 4 events. Integrity/Wikidata 661/661, typecheck/lint/build/coverage/smoke5/5 đạt.

## Earlier completed cycle — BV-011 / B010

State: ACCEPTED — B010-r1 PASS ngày 2026-10-06. Thêm 90 hồ sơ tháng 6 (85 quốc tế, 5 Việt; 5,56%), đúng 3/ngày. Commit `1fb7f46cf0cf3b86ad176ce0a5f46cd8b7dcbdd5` đã push; origin/main xác nhận 0/0.

# BV-013 — B012: dữ liệu tháng 8

State: ACCEPTED — B012-r1 PASS ngày 2026-10-07; cycle hoàn tất và đã đồng bộ `origin/main`.
Reviewer/executor: Codex theo yêu cầu trực tiếp của chủ dự án.
Task: `.ai/hop-thu-mybirthday/viec/B012-people-aug-01-31.md`.
Baseline: `origin/main` commit `37a632e77c74fd455afd94078042241d6f92274f` — 661 people, 4 events, 215/366 ngày có dữ liệu.

## Kết quả review

- Thêm đúng 93 hồ sơ mới, 3/ngày từ 1–31/8; 5 người Việt (5,38%).
- 186/186 trang DOB ghi nhận danh tính và ngày sinh đầy đủ; mỗi hồ sơ dùng hai publisher và host khác nhau. 176 trang trả HTTP 200 khi lấy trực tiếp; 10 trang được xác minh bằng browser-direct do lượt lấy cục bộ không có nội dung trang.
- 93/93 Wikidata entities có P31 human và P569 Gregorian precision 11 khớp; không có active DOB chính xác hơn mâu thuẫn.
- 5/5 hồ sơ Việt có hai publisher ngoài Việt Nam; 10 proof rows trỏ tới 8 URL chính thức về vị trí publisher.
- Rule AG khóa ID/QID/DOB/source pair/category/occupation/country và negative URL cases. Baseline 661 people cùng 4 events giữ nguyên theo hash.
- Kết quả: 754 người, 245/366 ngày có dữ liệu, tháng 8 đủ 31/31; 15/8 có tổng 5 người.
- Evidence, executor report và review: `.ai/hop-thu-mybirthday/review/B012-evidence.json`, `.ai/hop-thu-mybirthday/xong/B012-people-aug-01-31.md`, `.ai/hop-thu-mybirthday/review/B012-people-aug-01-31-r1.md`.

Reviewer Attention: 10 trang được xác minh browser-direct không có byte nội dung trang/hash nội dung cục bộ; evidence ghi URL, excerpt, thời điểm, chế độ xác minh và hash phản hồi lỗi tải cục bộ. Lint/build vẫn có 32 cảnh báo `<img>` từ UI ngoài phạm vi. Không mở cycle kế tiếp trong lần này.

## Earlier completed cycle — BV-012 / B011

State: ACCEPTED — B011-r1 PASS; commit `37a632e77c74fd455afd94078042241d6f92274f` đã push và `origin/main` xác nhận 0/0. Thêm 93 hồ sơ tháng 7 (88 quốc tế, 5 Việt; 5,38%), coverage 215/366; giữ nguyên 568 hồ sơ nền và 4 events. Evidence/review: `review/B011-evidence.json`, `review/B011-people-jul-01-31-r1.md`; validation gồm integrity, Wikidata 661/661, tsc/lint/build/coverage và smoke 5/5.

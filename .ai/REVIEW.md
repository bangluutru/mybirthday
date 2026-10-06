# BV-013 — B012: dữ liệu tháng 8

State: OPEN — directive B012 mở ngày 2026-10-06 sau khi B011 pass và remote đồng bộ.
Reviewer/executor: Codex theo yêu cầu trực tiếp của chủ dự án.
Task: `.ai/hop-thu-mybirthday/viec/B012-people-aug-01-31.md`.
Baseline: `origin/main` commit `37a632e77c74fd455afd94078042241d6f92274f` — 661 people, 4 events, 215/366 ngày có dữ liệu. Tháng 8 đã có Jennifer Lawrence và Napoleon Bonaparte cùng ngày 15/8; các ngày khác trống.

## Acceptance

Thêm 93 hồ sơ mới (3/ngày) cho 1–31/8, ít nhất 5% người Việt; mỗi hồ sơ có hai publisher/host trực tiếp khác nhau xác nhận DOB đầy đủ; hồ sơ Việt có hai nguồn publisher ngoài Việt Nam cùng country proof chính thức. Kiểm P31/P569/rank/precision/calendar/claims/conflicts; metadata country/role có nguồn. Rule AG khóa ID/QID/DOB/source pair/category/occupation/country và negative URL cases. Bảo toàn deep-equal toàn bộ 661 người nền và 4 events. Kết quả dự kiến: 754 người, 245/366 ngày, tháng 8 31/31; ngày 15 có tổng 5 hồ sơ.

Next step: chỉ làm B012 tháng 8. Không mở chu kỳ khác cho tới khi review, commit/push và remote verification xong.

## Earlier completed cycle — BV-012 / B011

State: ACCEPTED — B011-r1 PASS; commit `37a632e77c74fd455afd94078042241d6f92274f` đã push và `origin/main` xác nhận 0/0. Thêm 93 hồ sơ tháng 7 (88 quốc tế, 5 Việt; 5,38%), coverage 215/366; giữ nguyên 568 hồ sơ nền và 4 events. Evidence/review: `review/B011-evidence.json`, `review/B011-people-jul-01-31-r1.md`; validation gồm integrity, Wikidata 661/661, tsc/lint/build/coverage và smoke 5/5.

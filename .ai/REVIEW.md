# BV-012 — B011: dữ liệu tháng 7

State: ACCEPTED — B011-r1 PASS ngày 2026-10-06; duyệt phát hành 93 hồ sơ tháng 7.
Reviewer/executor: Codex theo yêu cầu trực tiếp của chủ dự án.
Task: `.ai/hop-thu-mybirthday/viec/B011-people-jul-01-31.md`.
Review: `.ai/hop-thu-mybirthday/review/B011-people-jul-01-31-r1.md`.
Evidence: `.ai/hop-thu-mybirthday/review/B011-evidence.json`.

## Acceptance

PASS — thêm đúng 93 hồ sơ mới, 3/ngày, có 5/93 người Việt (5,38%). Mỗi hồ sơ có hai publisher và host trực tiếp khác nhau, đối chiếu đủ danh tính và ngày/tháng/năm. 183/186 trang tải trực tiếp HTTP 200; ba trang không tải được cục bộ (hai HTTP 403, một HTTP 500) đã được mở trực tiếp trên trang publisher và xác nhận đúng tên cùng ngày sinh, có ghi rõ giới hạn hash trang trong ledger. P31 human và P569 Gregorian precision 11 khớp 93/93; không có claim ngày đang hoạt động chính xác hơn bị mâu thuẫn. Hồ sơ Việt có đủ 10 bằng chứng chính thức cho địa điểm publisher ngoài Việt Nam.

Rule AF khóa exact ID/QID/DOB/source pairs và negative URL cases. Giữ deep-equal 568 hồ sơ nền và 4 events; tổng 661 hồ sơ, độ phủ 215/366 ngày, tháng 7 đủ 31/31 ngày.

Validation: `npm test`, `npm run verify:wikidata` (661/661), `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, smoke 5/5 routes đạt. Lint/build có 32 cảnh báo `<img>` đã có ở các tệp ngoài phạm vi; không có lỗi.

Next step: commit/push đúng các tệp B011 được duyệt và xác nhận `origin/main` đồng bộ. Sau xác nhận, mở B012 tháng 8 theo yêu cầu trực tiếp của chủ dự án.

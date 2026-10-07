# BV-014 — B013: dữ liệu tháng 9

State: ACCEPTED — B013-r1 PASS ngày 2026-10-07. Người dùng yêu cầu trực tiếp mở rộng tháng 9 và 10; B013 xử lý riêng tháng 9 trước.
Reviewer/executor: Codex làm trực tiếp trên repository theo yêu cầu của người dùng; không qua hộp thư.
Baseline: `origin/main` commit `238f8989b366857146ff435572506932539ec176` — 754 people, 4 events, 245/366 ngày có dữ liệu; tháng 9 trống.
Baseline people SHA-256 `43e159877b62e4e68ba6fb15763c40cbf660325803896fcf0843edc73702c282`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

## Acceptance — B013

- Thêm đúng 90 hồ sơ mới, 3 hồ sơ mỗi ngày từ 1–30/9; không trùng ID/QID; không quá 8 hồ sơ/ngày.
- Ít nhất 5/90 người Việt; mỗi hồ sơ Việt có hai nguồn full DOB từ publisher ngoài Việt Nam và country proof chính thức.
- Mỗi hồ sơ có hai trang publisher trực tiếp, publisher/host khác nhau, cùng xác nhận danh tính và ngày sinh đầy đủ.
- Kiểm Wikidata P31/P569: human, claims active và deprecated, rank, qualifiers, references, calendar/precision; DOB Gregorian precision 11, không có active exact/more precise conflict; kiểm tuổi trưởng thành.
- Tên, nghề, category, country code có căn cứ; không thêm birthplace/thành tích chưa xác minh.
- Rule AH khóa allowlist `ID → QID → DOB → source pair → category/occupation/country` và negative URL cases.
- Bảo toàn deep-equal 754 người nền và 4 events theo hash baseline.
- Cổng: `npm test`, `npm run verify:wikidata`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`, HTTP smoke 3 route.

## Kết quả review — B013-r1 PASS

- Thêm 90 hồ sơ, đúng 3/ngày; có 5 người Việt, tỷ lệ 5,56%; tháng 9 đủ 30/30 ngày.
- Ghi 180 URL DOB cùng capture metadata trong `.ai/evidence/B013.json`; 169 URL có phản hồi HTTP 200 kèm hash nội dung cục bộ; 12 trang được đối chiếu browser-direct do lượt lấy cục bộ không phơi bày ngày sinh.
- 90/90 QID có P31 human và P569 Gregorian ngày/tháng/năm khớp. Đã giữ đầy đủ rank/qualifier/reference; các claim năm-only cùng năm, claim cũ của Edgar Rice Burroughs deprecated.
- 5/5 hồ sơ Việt dùng hai publisher nước ngoài và country proof chính thức.
- Rule AH và `npm test` PASS; giữ nguyên 754 hồ sơ nền, hash `43e159877b62e4e68ba6fb15763c40cbf660325803896fcf0843edc73702c282`; 4 events giữ nguyên.
- Kết quả: 844 people, 275/366 ngày có dữ liệu, tháng 9 30/30.
- `npm run verify:wikidata`: 844/844 khớp; `npx tsc --noEmit`, lint, build, coverage và `git diff --check` PASS. HTTP smoke: 3/3 route tháng 9, hồ sơ người và ngày sinh chính xác trả 200, hiển thị đúng hồ sơ.

Reviewer Attention: một số source page xác minh browser-direct không có byte nội dung trang trong capture cục bộ; trạng thái, URL và excerpt browser được giữ trong evidence. Lint/build còn cảnh báo `<img>` và Google Fonts ở UI ngoài phạm vi.

## Earlier accepted cycle — BV-013 / B012

B012-r1 PASS ngày 2026-10-07; thêm 93 hồ sơ tháng 8 (88 quốc tế/5 Việt, 5,38%), đủ 3/ngày. 186 nguồn DOB; 176 HTTP 200 cục bộ và 10 browser-direct; 10 proof rows từ 8 URL chính thức. P31/P569 93/93; baseline 661 people + 4 events giữ nguyên. Tổng 754 người/245 ngày, tháng 8 đủ 31/31. Commit `238f8989b366857146ff435572506932539ec176` đã push; `origin/main` đồng bộ.

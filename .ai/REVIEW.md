# BV-016 — B015+B016: dữ liệu tháng 11 và 12

State: OPEN — chỉ thị trực tiếp của người dùng ngày 2026-10-07; tiếp tục mở rộng dữ liệu tháng 11 và tháng 12.
Reviewer/executor: Codex làm trực tiếp trên repository theo yêu cầu của người dùng; không qua hộp thư.
Baseline: `origin/main` commit `de3ade7bf757a12c8ab2c191f9c02531f62971c7` — 937 people, 4 events, 306/366 ngày có dữ liệu; tháng 11 trống, tháng 12 có 1 hồ sơ (Edvard Munch, 12/12).
Baseline people SHA-256 `889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

## Acceptance — B015+B016

- Thêm đúng 90 hồ sơ mới (3/ngày) từ 1–30/11 và 93 hồ sơ mới (3/ngày) từ 1–31/12; không trùng ID/QID và không quá 8 hồ sơ cuối cùng cho bất kỳ ngày sinh nào.
- Mỗi tháng có đúng 5 người Việt; hồ sơ Việt có hai nguồn DOB từ publisher ngoài Việt Nam và country proof chính thức.
- Mỗi hồ sơ mới có hai publisher/host độc lập, mỗi trang xác nhận đúng danh tính và ngày/tháng/năm sinh đầy đủ; kiểm tra phụ thuộc publisher và ngày mâu thuẫn.
- Wikidata P31 human; kiểm toàn bộ P569 claims, rank, qualifiers, references, calendar/precision; có active DOB Gregorian precision 11, không có active exact/more-precise conflict; kiểm tuổi trưởng thành.
- Tên, nghề, category và country code có căn cứ; không thêm birthplace/thành tích chưa xác minh; có biography và 2–3 highlights theo convention hiện hành.
- Thêm Rule AJ exact allowlist `ID → QID → DOB → source pair → category/occupation/country` cùng negative URL checks; không nới rule cũ.
- Bảo toàn deep-equal 937 người nền và 4 events theo baseline.
- Kết quả dự kiến: 1.120 people, 366/366 ngày có dữ liệu; tháng 11 có 90 hồ sơ mới, tháng 12 có 94 hồ sơ tổng cộng (1 nền + 93 mới).
- Cổng: `npm test`, `npm run verify:wikidata`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`, HTTP smoke cho route tháng 11, tháng 12, person và exact-date.

## Earlier cycles

- BV-015 / B014: tháng 10, 93 hồ sơ mới, 5 người Việt; implementation và validation đã push trong commit `de3ade7bf757a12c8ab2c191f9c02531f62971c7`; status trước chỉ thị mới là WAITING_FOR_REVIEW.
- BV-014 / B013: tháng 9 PASS, 90 hồ sơ mới, 5 người Việt; commit `c981aa7409388f334f08cf57e2e16c4f830d181d`.
- BV-013 / B012: tháng 8 PASS, 93 hồ sơ mới, 5 người Việt; commit `238f8989b366857146ff435572506932539ec176`.

Reviewer Attention B013/B014: xem `.ai/STATUS.md`; B014 evidence tại `.ai/evidence/B014.json` nêu Hugh Jackman P569 không có Wikidata reference và các trang browser-direct. Lint/build có warning UI `<img>`/Google Fonts ngoài phạm vi.

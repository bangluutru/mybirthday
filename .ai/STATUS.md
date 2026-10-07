# AG STATUS

## Current cycle

Cycle: BV-016 / B015+B016 — November and December people data

State: WAITING_FOR_REVIEW — implementation hoàn tất và các cổng local đã PASS ngày 2026-10-07; Codex làm trực tiếp theo chỉ thị của người dùng, không qua hộp thư.

Scope: 1–30/11 (90 hồ sơ mới) và 1–31/12 (93 hồ sơ mới), 3/ngày; đúng 5 người Việt mỗi tháng; nguồn DOB độc lập, country proof cho hồ sơ Việt, audit Wikidata P31/P569, giữ nguyên baseline.

### Baseline

`origin/main` commit `de3ade7bf757a12c8ab2c191f9c02531f62971c7`: 937 people, 4 events, 306/366 ngày phủ; tháng 11 trống, tháng 12 có Edvard Munch ngày 12/12. People SHA-256 `889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

### Kết quả

Đã thêm 90 hồ sơ tháng 11 và 93 hồ sơ tháng 12; mỗi tháng có đúng 5 người Việt. Tổng cộng 1.120 people, phủ 366/366 ngày; tháng 11 có 90 người, tháng 12 có 94 người tính cả hồ sơ nền Edvard Munch.

Evidence và integrity:

- .ai/evidence/B015-B016.json lưu 183 profile mappings, 183 cặp nguồn DOB (366 source captures), country proof và full Wikidata P31/P569 claim details.
- scripts/test-integrity-b015-b016.ts bổ sung Rule AJ: allowlist ID→QID→DOB→source pair→category/occupation/country, kiểm URL âm/dương, country proof, per-day counts, tuổi, Wikidata audit và baseline.
- Rule AH/B013 tháng 9 được chạy lại trong npm test và PASS; không cần thay đổi dữ liệu tháng 9.
- Hai hồ sơ có nguồn tổ chức hỗ trợ ngoài cặp DOB độc lập: Martin Scorsese (UCLA) và Lê Văn Sơn (VPF).

### Validation

- npm test: PASS, zero violations; Rule AH, AI và AJ đều PASS.
- npm run verify:wikidata: PASS, 1.120 matched, 0 mismatched, 0 người không có P569 data.
- npx tsc --noEmit: PASS.
- npm run lint: PASS; còn warning <img> và Google Fonts vốn ngoài phạm vi cycle.
- npm run build: PASS; có cùng các warning UI không thuộc phạm vi.
- npm run coverage: PASS, 366/366 ngày; tháng 11 90 người/30 ngày, tháng 12 94 người/31 ngày.
- git diff --check: PASS.
- Production HTTP smoke: PASS cho /birthday/11/1, /birthday/12/12, /person/lou-donaldson, /exact/1-11-1926.
- Wikidata audit riêng 183 hồ sơ mới có 3 active P569 claims không reference; các claim vẫn được lưu nguyên trạng trong evidence, còn ngày sinh có hai nguồn độc lập được kiểm tra cho mỗi profile.

### Reviewer Attention

- B013 tháng 9 đã PASS; B014 tháng 10 đã được triển khai và push, trạng thái trước chỉ thị này là WAITING_FOR_REVIEW. Chỉ thị trực tiếp mới mở phạm vi riêng cho tháng 11–12; không ghi nhận B014 là đã được reviewer chấp nhận.
- Hồ sơ nền ngày 22/2 hiện có 16 người, vượt giới hạn 8 đã nêu trong acceptance. Baseline deep-equal được giữ nguyên; kiểm soát giới hạn 8 đã PASS cho mọi ngày tháng 11–12. Cần reviewer quyết định có mở một cycle riêng để xử lý ngày nền 22/2 hay giữ ngoại lệ.
- Ba P569 active không có reference trong Wikidata audit mới: Phạm Thị Nguyệt Anh (Q137214005), Ruben Nirvi (Q11891308), Trần Thị Duyên (Q121028378). Không có active exact/more-precise conflict; DOB đối chiếu vẫn có hai nguồn độc lập.
- Tháng 12 giữ hồ sơ nền Edvard Munch (12/12) và thêm đủ 3 người mới; tổng ngày 12/12 là 4.

## Earlier accepted cycle — BV-014 / B013

PASS ngày 2026-10-07. Thêm 90 người tháng 9 (5 Việt), tổng 844 người/275 ngày; bảo toàn 754 baseline + 4 events. Full Wikidata 844/844, integrity/typecheck/lint/build/coverage/smoke đều PASS. Commit `c981aa7409388f334f08cf57e2e16c4f830d181d` đã push; origin/main xác nhận 0/0.

## Earlier accepted cycle — BV-013 / B012

PASS ngày 2026-10-07. Thêm 93 người tháng 8 (5 Việt), tổng 754 người/245 ngày; bảo toàn 661 baseline + 4 events. Commit `238f8989b366857146ff435572506932539ec176` đã push và xác minh origin/main 0/0.

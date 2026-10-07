# B012-r1 — Review dữ liệu tháng 8

**Cycle:** BV-013

**Ngày review:** 2026-10-07

**Kết quả:** PASS — duyệt phát hành

## Tiêu chí và kết quả

| Tiêu chí | Kết quả |
|---|---|
| Phạm vi 1–31/8 | 93 hồ sơ mới, đúng 3 hồ sơ mỗi ngày; ngày 15 có 5 người kể cả 2 hồ sơ nền |
| Cân bằng | 5 người Việt/93 hồ sơ = 5,38% |
| ID và Wikidata | 93 ID/QID duy nhất; P31 human và P569 Gregorian precision 11 khớp 93/93 |
| Kiểm claim | Rà mọi P569 đang hoạt động cùng rank, qualifier, reference, precision và lịch; 0 active DOB chính xác hơn mâu thuẫn |
| Hai nguồn DOB | 186 trang; từng người có hai publisher/host khác nhau, xác nhận identity và full DOB |
| Nguồn Việt | 5/5 có hai nguồn publisher ngoài Việt Nam; 10 proof rows tham chiếu 8 URL chính thức |
| Metadata | Country dựa trên P27/mô tả và mapping được lưu; nghề/category được khóa trong Rule AG; không thêm birthplace/thành tích chưa xác minh |
| Rule AG | Khóa ID/QID/DOB/source pair/category/occupation/country; kiểm âm/dương cho QID, fragment, query, path, lookalike host và malformed URL |
| Bảo toàn baseline | 661 hồ sơ baseline deep-equal và 4 events deep-equal theo SHA-256 |
| Độ phủ | Sau cập nhật 754 người, 245/366 ngày; tháng 8 đủ 31/31 |

## Nguồn cần lưu ý

176/186 trang DOB trả HTTP 200 trong lượt lấy nội dung cục bộ. 10 trang còn lại được mở trực tiếp bằng browser và đối chiếu nội dung publisher; bản evidence ghi URL, publisher, excerpt ngắn, thời điểm và `captureMode`. Không có hash byte nội dung gốc cho 10 trang này; hash phản hồi lỗi cục bộ được lưu riêng. Giới hạn này không làm thiếu xác minh trực tiếp danh tính/ngày sinh nhưng cần giữ rõ khi tái sử dụng ledger.

Các excerpt nguồn tối đa 14 từ. 10 trang proof quốc gia/vị trí publisher cho 5 hồ sơ Việt được gắn country proof chính thức; ledger có 8 URL proof duy nhất.

## Kỹ thuật

- Integrity Rules A–AG: PASS, 0 vi phạm.
- Wikidata 754/754 khớp, 0 mismatch/thiếu P569.
- TypeScript, lint, production build, coverage và HTTP smoke 6/6: PASS.
- `git diff --check`: PASS.
- Lint/build còn 32 cảnh báo `<img>` đã tồn tại trong UI ngoài scope B012.

## Quyết định

B012 đạt acceptance; duyệt commit và push. Sau xác nhận `origin/main` đồng bộ, đóng BV-013 và dừng; không mở B013 trong cycle này.

Ledger đầy đủ: [`B012-evidence.json`](B012-evidence.json). Executor report: [`B012-people-aug-01-31.md`](../xong/B012-people-aug-01-31.md).

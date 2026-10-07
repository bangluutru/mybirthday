# B012 — báo cáo hoàn thành dữ liệu tháng 8

**Cycle:** BV-013

**Kết quả:** Hoàn tất, review r1 PASS

**Ngày:** 2026-10-07

## Thay đổi

- `src/data/people/08.ts`: thêm 93 hồ sơ, đúng 3/ngày trong 1–31/8; 5 người Việt (5,38%). Giữ nguyên hai hồ sơ nền Jennifer Lawrence và Napoleon Bonaparte ngày 15/8.
- `scripts/test-integrity.ts`: thêm Rule AG khóa chính xác hồ sơ B012, nguồn DOB, metadata, tỉ lệ Việt, phân bố ngày và baseline. Điều chỉnh projection các invariant lịch sử để chỉ loại 93 ID B012, không nới tiêu chí cũ.
- `review/B012-evidence.json`: lưu 93 hồ sơ Wikidata, 186 capture nguồn DOB, publisher-country proofs và metadata lựa chọn.
- Không sửa UI, events, ảnh, dependencies hoặc dữ liệu ngoài tháng 8.

## Đối chiếu dữ kiện

- 93/93 entity có P31=human và P569 khớp ngày sinh Gregorian precision 11. Đã rà rank, qualifier, references và toàn bộ P569 đang hoạt động; không có DOB chính xác hơn mâu thuẫn. Các claim năm-only và qualifier không xác định lịch được giữ nguyên trong ledger để reviewer thấy toàn bộ bối cảnh.
- 186/186 trang publisher trực tiếp xác nhận đúng danh tính và ngày/tháng/năm sinh; mỗi hồ sơ có hai publisher và host khác nhau. 176 trang lấy được HTTP 200; 10 trang xác minh bằng browser-direct khi lượt lấy cục bộ không trả nội dung trang. Các excerpt tối đa 14 từ, kèm SHA-256 excerpt. Với 10 trang browser-direct, evidence lưu URL, thời gian, excerpt và hash phản hồi tải lỗi cục bộ; không có hash byte nội dung gốc.
- 5/5 hồ sơ Việt có hai nguồn DOB từ publisher ngoài Việt Nam. 10 proof rows trỏ đến 8 URL chính thức về địa điểm publisher.
- Country hiển thị được đối chiếu P27 và mô tả; nghề/category dùng vai trò tổng quát. Không bổ sung birthplace hoặc thành tích chưa xác minh.
- Rule AG khóa exact ID→QID→DOB→source pair→category/occupation/country và negative URL cases. Toàn bộ 661 hồ sơ baseline và 4 events giữ nguyên theo hash đã chốt ở task.

## Validation

- `npm test`: PASS — Rules A–AG, 0 violation; 754 people, 4 events.
- `npm run verify:wikidata`: PASS — 754 matched, 0 mismatched, 0 thiếu P569.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS; giữ 32 cảnh báo `<img>` ở UI ngoài phạm vi.
- `npm run build`: PASS; cùng 32 cảnh báo lint ngoài phạm vi.
- `npm run coverage`: PASS — 245/366 ngày; tháng 8 đủ 31/31.
- HTTP smoke: PASS 6/6 — `/`, `/birthday/8/1`, `/birthday/8/1/people`, `/birthday/8/15`, `/person/katherine-johnson`, `/exact/1918-08-26`.
- `git diff --check`: PASS.

## Kết quả dữ liệu

- B012: 93 additions, 5 Việt (5,38%), 3 hồ sơ mỗi ngày.
- Toàn bộ: 754 người, 245/366 ngày có dữ liệu; tháng 8 31/31 ngày; ngày 15/8 có 5 người.
- Baseline B011: 661 hồ sơ và 4 events giữ nguyên deep-equal.

Evidence/review: [`B012-evidence.json`](../review/B012-evidence.json), [`B012-people-aug-01-31-r1.md`](../review/B012-people-aug-01-31-r1.md).

KET_QUA: DAT

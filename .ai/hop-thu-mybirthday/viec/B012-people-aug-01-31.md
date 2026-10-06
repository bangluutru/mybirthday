# B012 — mở rộng hồ sơ người sinh tháng 8 (1–31/8)

**Cycle:** BV-013

**Ngày mở:** 06/10/2026

**Trạng thái:** OPEN

**Reviewer/executor:** Codex theo yêu cầu trực tiếp của chủ dự án tiếp tục mở tháng 8 sau khi B011 pass và xác nhận remote.

## Mục tiêu và phạm vi

Bổ sung hồ sơ người sinh tháng 8, sau khi nghiên cứu và đối chiếu nguồn từng người. Mục tiêu 3 hồ sơ mới/ngày (93 hồ sơ). Ưu tiên độ chính xác; ngày nào chưa đủ người qua xác minh thì báo thiếu, không bù bằng nguồn yếu. Dữ liệu tháng 8 hiện có 2 hồ sơ nền vào 15/8 (Jennifer Lawrence, Napoleon Bonaparte), nên ngày đó sẽ có 5 người sau khi thêm 3; không vượt 8 hồ sơ/ngày khi tính cả nền.

| Hạng mục | Điều kiện nghiệm thu |
|---|---|
| Độ phủ | Đúng 3 hồ sơ mới/ngày từ 1–31/8; tổng 93; không trùng QID/ID với baseline. Tính cả hai người nền, mỗi ngày không quá 8 hồ sơ. |
| Cân bằng | Ít nhất 5 người Việt trong 93 hồ sơ (5,38% nếu đủ 93); ghi rõ tỷ lệ. |
| Wikidata | P31 là human; rà mọi P569 đang hoạt động, rank, qualifier/reference; DOB lịch Gregorian, precision 11; loại mọi exact/more precise conflict. Sàng lọc tuổi trưởng thành riêng khi còn sống. |
| Đối chiếu DOB | Mỗi hồ sơ có ít nhất hai trang publisher trực tiếp, khác publisher và host, xác nhận đúng danh tính cùng ngày/tháng/năm sinh đầy đủ; mở nội dung, rà ngày mâu thuẫn và khả năng sao chép nguồn. |
| Hồ sơ Việt | Ít nhất 5 người Việt; mỗi hồ sơ có hai nguồn DOB từ publisher ngoài Việt Nam; vị trí publisher có trang chính thức chứng minh. Không suy vị trí từ domain/ngôn ngữ. |
| Metadata | Tên, nghề, category và country code dựa trên P27/mô tả và nguồn phù hợp; không thêm birthplace/thành tích chưa xác minh. |
| Rule AG | Khóa exact allowlist `ID → QID → DOB → source pair → category/occupation/country`; đúng August, 3/ngày, ≥5% Việt; publisher/host phân biệt; country proof cho hồ sơ Việt; negative URL tests cho QID/fragment/query/path/lookalike/malformed. Không nới Rules A–AF. |
| Bảo toàn | Baseline origin/main `37a632e77c74fd455afd94078042241d6f92274f`: 661 people, 4 events, 215/366 covered days. Có 2 hồ sơ nền ngày 15/8. Toàn bộ 661 hồ sơ và 4 events phải deep-equal sau B012. Baseline people SHA-256 `bbdbf73293a1e6e861dffd6bab00b1eee0a4639d79ba2eb9594eec1df97c0334`; events SHA-256 `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`. |
| Kết quả dự kiến | Nếu đủ 93: 754 people, 245/366 ngày có dữ liệu, tháng 8 31/31. Ngày 15/8 có 5 hồ sơ. |
| Cổng kỹ thuật | `npm test`, `npm run verify:wikidata`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`, HTTP smoke routes; lỗi legacy ngoài scope phải tách rõ. |

## Kế hoạch

1. Baseline B011 đã xác nhận trên `origin/main`; giữ snapshot/hashes và hai hồ sơ 15/8.
2. Khám phá ứng viên theo từng ngày từ Wikidata, tách query quốc tế và Việt; lưu thời điểm, endpoint, raw claims, QID và hash. Candidate discovery không được coi là sự thật đã xác minh.
3. Rà từng entity: P31/P569, tất cả claim active, rank/qualifier/reference/calendar/precision/conflict; đánh giá adult status nếu còn sống.
4. Dựng source ledger trước khi tích hợp: hai trang publisher trực tiếp, URL/final URL, status/content type, exact DOB, identity evidence, excerpt ≤25 từ/trang, SHA-256, retrieval time; ghi publisher-country evidence cho toàn bộ hồ sơ Việt.
5. Rà trùng tên, DOB conflict, khả năng nguồn cùng sao chép bản ghi gốc, và các claim khác biệt. Bỏ ứng viên không đủ nguồn độc lập/chắc chắn.
6. Chỉ sau factual audit mới sửa `src/data/people/08.ts`, thêm Rule AG và lưu evidence/reports B012.
7. Chạy đủ validation, cập nhật reviewer status/report, push phần đạt, xác nhận `origin/main` 0/0; sau đó dừng.

## Phạm vi tệp

- `src/data/people/08.ts`
- `scripts/test-integrity.ts` (chỉ Rule AG và những điều chỉnh baseline test cần để giữ nguyên invariant)
- `.ai/hop-thu-mybirthday/nhap/` cho baseline/discovery/captures/logs cục bộ
- `.ai/hop-thu-mybirthday/xong/B012-people-aug-01-31.md`
- `.ai/hop-thu-mybirthday/review/B012-people-aug-01-31-r1.md` và evidence ledger
- `.ai/REVIEW.md`, `.ai/STATUS.md`, `.ai/hop-thu-mybirthday/KE-HOACH.md`, `.ai/hop-thu-mybirthday/nhat-ky.md`

Không sửa UI, events, ảnh, dependencies hoặc dữ liệu ngoài tháng 8 trong B012.

## Dừng

Không nhập hồ sơ nào trước khi entity Wikidata, cặp DOB sources và metadata của hồ sơ đó đạt factual review. Chỉ mở cycle sau khi B011 đã push và remote đồng bộ; điều kiện này đã đạt ở commit `37a632e`.

# B003 — Báo cáo sửa theo review (v5)

Chu kỳ: BV-004 · Executor: Codex theo yêu cầu trực tiếp của chủ dự án
Phạm vi: chỉ sửa hai điểm B003-v4 bị review yêu cầu và một URL lỗi phát hiện trong lần kiểm cuối; không thêm nhân vật, không mở rộng ngày.
Ngày hoàn tất: 2026-10-04 UTC.

## Đã sửa theo review

1. Rule S trong `scripts/test-integrity.ts` chỉ kiểm các ngày 1–15/1 (`day <= 15`), đúng phạm vi B003. Các ngày 16–31 được để cho B004.
2. `scripts/check-source-urls.ts` nhận diện PDF theo Content-Type hoặc phần mở rộng `.pdf`, hủy body và vẫn kiểm HTTP status mà không đọc toàn bộ tệp thành HTML. Lakers Media Guide hiện trả HTTP 200 và không còn timeout.
3. Lượt URL audit ban đầu tiếp tục phát hiện URL timeline phụ của Albert Schweitzer không fetch được. Đã bỏ URL lỗi, giữ nguồn Nobel Prize, thêm trang của Stiftung Albert-Schweitzer-Werk đã mở và xác nhận ngày `14. Januar 1875`; evidence được bổ sung. Các nguồn độc lập khớp ngày sinh với Wikidata. [Nobel Prize](https://www.nobelprize.org/prizes/peace/1952/schweitzer/biographical/) · [Stiftung Albert-Schweitzer-Werk](https://www.albert-schweitzer.ch/albert-und-helene-schweitzer/albert-schweitzer)

## Kết quả cổng cuối

- `npm test`: PASS, 0 vi phạm; 74 hồ sơ. Rule S chỉ áp dụng 1–15/1. Tỷ lệ bổ sung tháng 1: 44 người, 9 Việt Nam, 35 quốc tế (20,5% Việt Nam).
- `npm run verify:urls`: PASS — 256 URL kiểm tra, 0 lỗi, 0 Britannica MANUAL đang chờ.
- `npm run verify:wikidata`: PASS — 74 khớp, 0 lệch, 0 thiếu P569.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS, 0 lỗi; còn cảnh báo `<img>`/Google Fonts có từ trước, ngoài phạm vi.
- `npm run build`: PASS, production build và các route được tạo thành công; giữ nguyên các cảnh báo lint nêu trên.
- `npm run coverage`: PASS — 74 người trên 26/366 ngày; tháng 1 có dữ liệu 15/31 ngày, tổng 46 hồ sơ.
- Evidence audit: 54/54 bản ghi có QID khớp hồ sơ, URL có trong `sourceUrls`, quote không rỗng.
- Smoke production: 8/8 route trả HTTP 200 (`/`, `/birthday/1/2`, `/birthday/1/2/people`, `/birthday/1/15/people`, `/day/1/2`, `/birthday/2/22`, `/person/rudolf-clausius`, `/share/2-1`). Trang 2/1 có Rudolf Clausius và không chứa J. R. R. Tolkien của 3/1.

## Phạm vi và Reviewer Attention

- Không sửa dữ liệu ngày sinh ngoài URL phụ của Albert Schweitzer; không thêm người, sự kiện hay UI.
- Cảnh báo lint cũ và độ phủ toàn năm 26/366 vẫn ngoài phạm vi B003.
- Dữ liệu mới B003 vẫn cân đối: 9 người Việt Nam và 35 người nước ngoài.

## FILES

scripts/test-integrity.ts
scripts/check-source-urls.ts
src/data/people/01.ts
.ai/hop-thu-mybirthday/nhap/B003-evidence.json
.ai/hop-thu-mybirthday/xong/B003-people-jan-01-15-v5.md
.ai/hop-thu-mybirthday/nhat-ky.md
.ai/hop-thu-mybirthday/gemini.lock (đã xóa khi bàn giao)

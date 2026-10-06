# B011 — báo cáo hoàn thành tháng 7

**Cycle:** BV-012

**Kết quả:** Hoàn tất, nộp factual review r1

**Ngày:** 2026-10-06

## Thay đổi

- `src/data/people/07.ts`: thêm 93 hồ sơ (3/ngày); 5 người Việt (5,38%). Hồ sơ Nguyễn Huy Hoàng sinh 2000 dùng slug `nguyen-huy-hoang-swimmer` để phân biệt với hồ sơ huấn luyện viên sinh 1981 đã có trong tháng 1.
- `scripts/test-integrity.ts`: thêm Rule AF để khóa ID/QID/DOB/source pairs, tỷ lệ Việt, 3/ngày, nguồn nước ngoài, negative URL cases và baseline. Điều chỉnh phạm vi baseline Rules AD/AE để bỏ phần tháng 7 mới thêm nhưng vẫn kiểm tra đúng các cycle cũ.
- Evidence/review được nộp trong `.ai/hop-thu-mybirthday/review/`.

## Đối chiếu dữ kiện

- 93/93 entity có P31=human và claim P569 ngày sinh Gregorian precision 11 khớp; rà rank cùng mọi claim P569 đang hoạt động, không có ngày chính xác hơn mâu thuẫn.
- 186 trang DOB, mỗi người có hai publisher và host khác nhau. 183 trang tải HTTP 200 và khớp tên/ngày sinh trực tiếp. Hai trang trả HTTP 403 (Smithsonian SOVA cho P. T. Barnum và NAS cho John B. Goodenough), một trang trả HTTP 500 (Universal Music France cho Selena Gomez); cả ba được mở trực tiếp trên trang publisher và đối chiếu đúng tên/ngày sinh. Không có response hash nội dung cho ba trang này; giữ hash của phản hồi lỗi cục bộ.
- 5/5 hồ sơ Việt có hai publisher ngoài Việt Nam; 10 trang chính thức xác nhận quốc gia/vị trí publisher.
- Quốc gia đối chiếu P27 và mô tả; nghề/phân loại dùng vai trò tổng quát có căn cứ và được Rule AF khóa. Không thêm birthplace hoặc thành tích chưa kiểm chứng.
- Bảo toàn deep-equal 568 hồ sơ nền, gồm hai hồ sơ tháng 8 và hồ sơ tháng 12, cùng 4 history events.

## Validation

- `npm test`: PASS — Rules A–AF, 0 violation.
- `npm run verify:wikidata`: PASS — 661 matched, 0 mismatched, 0 missing P569.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS; có 32 cảnh báo `<img>` ở các tệp ngoài phạm vi.
- `npm run build`: PASS; có cùng 32 cảnh báo lint `<img>` ở các tệp ngoài phạm vi.
- `npm run coverage`: PASS — 215/366 ngày, tháng 7 31/31.
- Smoke routes: PASS 5/5 (`/`, `/birthday/7/1`, `/birthday/7/1/people`, `/person/nguyen-huy-hoang-swimmer`, `/exact/1991-07-24`).
- `git diff --cached --check`: PASS — không có whitespace lỗi trong các tệp B011 được stage.

## Files in scope

- `src/data/people/07.ts`
- `scripts/test-integrity.ts`
- `.ai/REVIEW.md`, `.ai/STATUS.md`
- `.ai/hop-thu-mybirthday/KE-HOACH.md`, `nhat-ky.md`
- `viec/B011-people-jul-01-31.md`, `xong/B011-people-jul-01-31.md`, `review/B011-people-jul-01-31-r1.md`, `review/B011-evidence.json`

Không sửa UI, events, ảnh, package/dependency hay dữ liệu tháng khác.

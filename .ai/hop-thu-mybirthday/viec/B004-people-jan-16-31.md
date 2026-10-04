# B004 — Làm giàu dữ liệu: nhân vật sinh 16/1 → 31/1

Chu kỳ: BV-005 · Ưu tiên: P1 · Reviewer: Claude Code · Executor: Gemini 3.8 (Antigravity)
Điều kiện giao: B003 đã DAT trong review `B003-people-jan-01-15-r4.md`.

## 0. Phạm vi

Tiếp tục pilot Wikidata đã được duyệt ở B003. Bổ sung nhân vật có ngày sinh từ **16/1 đến 31/1** vào cuối `src/data/people/01.ts`; không thêm sự kiện, không sửa UI, không sửa các hồ sơ B003 ngày 1–15/1 hay dữ liệu tháng khác. Không mở rộng sang tháng 2.

Mục tiêu mỗi ngày: **3–8 người mới đã qua đủ kiểm chứng** (hiện các ngày 16–31/1 chưa có hồ sơ). Đúng sự thật quan trọng hơn số lượng; không ép dữ liệu nếu không đủ nguồn, ghi rõ ngày và lý do.

## 1. Quy trình dữ liệu

Cho từng ngày 16–31/1, theo thứ tự:

1. Dùng lại `scripts/wikidata-candidates.ts`, ví dụ `npx tsx scripts/wikidata-candidates.ts --day 1 16`; lưu JSON thô vào `.ai/hop-thu-mybirthday/nhap/wd/01-16.json`. Tuân thủ giới hạn/tạm nghỉ mà script và B003 đã thiết lập; không gọi song song hay dùng API trả phí.
2. Lọc người thật có ngày chính xác theo lịch Gregorian, tuổi trưởng thành, không trùng QID/slug. Chọn tối đa 8 người/ngày, đa dạng nghề và quốc gia.
3. Mỗi người phải khớp cả ba lớp: Wikidata Gregorian chính xác ngày; trang độc lập chính thống thực sự mở và nêu đúng ngày; nguồn và Wikidata nhất quán. Ghi quote, URL và thời điểm xác nhận trong `.ai/hop-thu-mybirthday/nhap/B004-evidence.json`. Nếu không mở được nguồn, có bất đồng, hay thiếu bằng chứng thì loại và ghi lý do.
4. Mỗi hồ sơ mới phải qua Rule P: QID hợp lệ; có URL Wikidata cùng ít nhất hai URL độc lập trên ít nhất hai host độc lập; trong các nguồn độc lập có ít nhất một nguồn chính thống/thể chế. Giữ nguyên Rule Q/R và các quy tắc A–O.
5. Giữ cơ cấu Việt Nam và quốc tế cân đối. Sau B004, tỷ lệ người Việt Nam trong **toàn bộ hồ sơ mới tháng 1 (B003 + B004)** phải nằm trong khoảng 20%–40%; test Rule T phải tính trên ngày 1–31/1, không chỉ nửa đầu tháng. Không sửa/ngụy tạo hồ sơ B003 để đạt tỷ lệ.
6. Với mỗi nhân vật Việt Nam mới, phải có ít nhất một nguồn độc lập chính thống/thể chế đặt ngoài Việt Nam và nguồn đó phải ghi rõ ngày sinh. Ưu tiên dùng hai nguồn độc lập đều ở ngoài Việt Nam; nếu nguồn đối chiếu thứ hai ở Việt Nam, ghi lý do trong evidence. Xác định quốc gia theo tổ chức phát hành/đơn vị chủ quản, không chỉ dựa vào đuôi tên miền. Trong `.ai/hop-thu-mybirthday/nhap/B004-evidence.json`, ghi `publisher` và `publisherCountry` cho nguồn độc lập của người Việt để reviewer kiểm tra được xuất xứ.

## 2. Test và tài liệu

- Baseline sau B003: chạy `npm test`, `npm run coverage`, `npx tsc --noEmit`.
- Mở rộng Rule S trong `scripts/test-integrity.ts` để kiểm 1–31/1; giữ ngoại lệ rỗng trừ khi có lý do rõ ràng. Cập nhật Rule T tính toàn bộ bổ sung tháng 1 và giữ ngưỡng 20%–40%. Thêm Rule U fail-closed cho B004: mỗi hồ sơ Việt Nam ngày 16–31/1 phải có host ngoài Việt Nam trong danh sách nguồn tổ chức đã kiểm chứng; cập nhật danh sách host theo từng nguồn nước ngoài được reviewer chấp nhận.
- Trước khi thêm hồ sơ, chạy `npm test` để xác nhận Rule S thất bại ở các ngày 16–31/1; lưu đầu ra thật vào `.ai/hop-thu-mybirthday/nhap/B004-test-fail.txt`.
- Cập nhật README chỉ ở số lượng/độ phủ mới và hướng dẫn quy trình nếu số liệu đã thay đổi; không biên tập lại nội dung khác.
- Báo cáo 16 ngày: ngưỡng Wikidata, số ứng viên, số thêm, tổng người/ngày và ghi chú. Báo cáo danh sách QID, ngày sinh, nguồn đã mở và quote, người loại cùng lý do.

## 3. Cổng cuối bắt buộc

Chạy tuần tự, ghi đầu ra thật trong báo cáo:

- `npm test` — Rule A–U pass, không có lỗi coverage 1–31/1, cơ cấu quốc tịch hay nguồn nước ngoài cho hồ sơ Việt Nam.
- `npm run verify:wikidata` — toàn bộ `ALL_PEOPLE`, không mismatch hoặc thiếu ngày sinh.
- `npm run verify:urls` — toàn bộ URL, 0 lỗi và 0 Britannica MANUAL pending.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run coverage`.
- Smoke sau build: `/`, `/birthday/1/16`, `/birthday/1/16/people`, `/birthday/1/31/people`, `/day/1/31`, `/birthday/2/22`, `/person/<slug mới>`, `/share/1-16` đều HTTP 200. Trang 16/1 phải chứa người mới và không lẫn người ngày khác.
- Kiểm tra evidence: từng dòng có QID tồn tại, URL nằm trong nguồn của đúng hồ sơ, quote không rỗng.

## 4. Tệp được phép sửa/tạo

Sửa:

- `src/data/people/01.ts` (chỉ append hồ sơ ngày 16–31/1)
- `scripts/test-integrity.ts` (mở rộng Rule S/T cho tháng 1)
- `README.md` (chỉ số liệu và mô tả quy trình cần cập nhật)

Tạo/cập nhật tạm và báo cáo:

- `.ai/hop-thu-mybirthday/nhap/B004-*` và `.ai/hop-thu-mybirthday/nhap/wd/01-16.json` … `01-31.json` (không commit dữ liệu thô)
- `.ai/hop-thu-mybirthday/xong/B004-people-jan-16-31.md` (lần sửa sau dùng `-v2`, `-v3`…)
- `.ai/hop-thu-mybirthday/nhat-ky.md`, `.ai/hop-thu-mybirthday/gemini.lock`

Không sửa package/lock, `AGENTS.md`, `.ai/REVIEW.md`, `.ai/STATUS.md`, `viec/`, `review/`, UI, sự kiện, hay các hồ sơ ngoài phạm vi.

## 5. Bàn giao

Nộp báo cáo, ghi nhật ký và dừng. Không chạy Git, không commit/push. Claude Code review và là người duy nhất tích hợp Git theo protocol hộp thư.

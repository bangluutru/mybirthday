# B008 review r1 — dữ liệu toàn tháng 4

Đã rà BV-009 / B008 theo chỉ thị mở rộng tháng 4 và yêu cầu giữ tối thiểu 5% hồ sơ Việt.

## Acceptance

- 90 hồ sơ mới, đủ 30 ngày, đúng 3/ngày, không quá 8/ngày; 93 người trên 30/30 ngày tháng 4: **đạt**.
- 5/90 người Việt (5,56%), 85 người quốc tế. Mỗi hồ sơ Việt có ít nhất một nguồn nước ngoài ghi đủ DOB: **đạt**.
- 90/90 có Wikidata và ít nhất hai host nhà xuất bản ngoài Wiki; 181/181 trang được lấy trực tiếp, HTTP 200, khớp danh tính; từng hồ sơ có nguồn full DOB: **đạt**.
- P31 là người; P569 có một giá trị chính xác Gregorian đang hoạt động khớp dữ liệu cho 90/90. 10 giá trị P569 chỉ ghi năm cùng năm, không tạo mâu thuẫn: **đạt**.
- Baseline 295 hồ sơ và 4 sự kiện giữ nguyên bằng deep equality. Tổng 385 người; độ phủ 124/366 ngày; tháng 4 30/30 ngày: **đạt**.
- Rules A–AC, Wikidata 385/385, TypeScript, lint, build, coverage, diff check và smoke 14/14: **đạt**.
- URL scan snapshot: 1.181 checked / 16 failed / 0 Britannica manual. Đối chiếu final source list xác nhận 16 URL fail đã bị loại/thay; 181 nguồn ngoài Wiki B008 cuối đều tải trực tiếp HTTP 200. B007 trước đó có URL 916/916: **đạt sau cập nhật nguồn**.

## Ghi nhận chất lượng

- Bằng chứng nguồn, ranks/references Wikidata, hash tài liệu, trích đoạn giới hạn 25 từ và danh sách loại ứng viên nằm trong `nhap/B008-evidence.json`, `nhap/B008-source-captures.json` và `nhap/B008-excluded.json`.
- Trích đoạn Le Monde cho Nguyễn Phú Trọng không hiện DOB trong lần tải trực tiếp; Guardian có dòng tiểu sử đủ ngày nên là nguồn DOB đã duyệt. Le Monde chỉ được tính là publisher thứ hai, không được tính làm xác nhận DOB.
- Quốc gia nhà xuất bản TheSports.org chưa xác định; hồ sơ Quốc Toàn có DOB nước ngoài xác nhận từ Olympedia (GB), vì vậy không dựa vào TheSports để thỏa điều kiện nguồn nước ngoài.
- Query discovery có `LIMIT 100`, là mẫu khám phá có giới hạn chứ không phải thống kê toàn bộ mọi người sinh tháng 4.
- 32 cảnh báo lint hiện tại nằm ở `<img>`/font có sẵn; không có thay đổi UI trong B008.

## Quyết định

**DAT.** Tiêu chí B008 và các cổng kiểm tra đều đạt. Người dùng đã cho phép push sau khi đạt; có thể commit đúng allowlist B008, đẩy `origin/main`, xác nhận remote đồng bộ rồi dừng. Không mở tháng 5 trong cycle này.

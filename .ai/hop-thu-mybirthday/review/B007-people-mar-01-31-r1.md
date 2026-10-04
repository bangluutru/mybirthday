KET_QUA: DAT

# B007 review r1 — dữ liệu toàn tháng 3

Đã rà kết quả BV-008 / B007 theo chỉ thị ngày 04/10/2026. Đạt để tích hợp và phát hành.

## Acceptance

- 93 hồ sơ mới, đủ 31 ngày, 3/ngày, không quá 8/ngày: **đạt**.
- 5/93 hồ sơ Việt (5,38%), còn lại 88 quốc tế; nguồn AFC ngoài Việt Nam có ngày sinh đủ cho 5 người: **đạt**.
- Mỗi người có Wikidata và hai nhà xuất bản độc lập ngoài Wiki; 100% tài liệu gốc được rà về danh tính/ngày/nội dung đã nhập: **đạt**. Sáu trang SNL chỉ nêu năm sinh nhưng nguồn thứ hai xác nhận đủ ngày và giới hạn đã được đánh dấu.
- P569 Gregorian precision 11, toàn bộ khai báo đủ ngày còn hiệu lực nhất quán: **đạt**. `verify:wikidata` 295/295.
- Bảo toàn 202 hồ sơ baseline và 4 sự kiện, test Rules A–AA, TypeScript, lint, build, coverage, URL và smoke: **đạt**.
- `verify:urls`: 916/916, 0 lỗi, 0 mục Britannica manual.

## Ghi nhận sự thật và giới hạn

- Có một mâu thuẫn P570 cho Bernardo Bertolucci: Wikidata hiện để 22/11/2018, hai hồ sơ tiểu sử gốc SNL và Hrvatska cùng ghi 26/11/2018. Ngày mất được chọn theo hai tiểu sử; P570 thô giữ nguyên trong evidence và mâu thuẫn nêu trong báo cáo. Ngày sinh không có mâu thuẫn.
- AFC/VPF có thể dùng chung hồ sơ đăng ký cầu thủ, do đó không được tính là hai cuộc điều tra DOB độc lập; điều này đã công khai. Tuy vậy, nguồn AFC nước ngoài có đủ DOB cho cả năm hồ sơ Việt và trang VPF là nguồn xác nhận thứ hai.
- Candidate queries đều có giới hạn LIMIT 100; một số lần gọi Wikidata search trả 429 rồi được thay bằng lô entity lookups thành công. Báo cáo không tuyên bố candidate list là đầy đủ tuyệt đối.
- 5 cảnh báo lint `<img>` nằm trong component cũ, không do vòng B007 thêm.
- Reviewer Attention còn dòng “hàng chục nghìn nhân vật” ở giao diện, ngoài phạm vi vòng này.

## Quyết định

**DAT.** B007 thỏa chỉ thị, evidence và toàn bộ cổng xác nhận. Người dùng đã cho phép push sau khi đạt; có thể commit các tệp được báo cáo cho phép, push `origin/main`, xác nhận remote đồng bộ và dừng sau vòng này. Không mở tháng 4.

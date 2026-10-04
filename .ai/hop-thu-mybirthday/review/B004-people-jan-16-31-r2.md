KET_QUA: DAT

# B004-v2 — Review r2 (BV-005)

2026-10-04 · Codex, theo yêu cầu chủ dự án sửa đến khi đạt và push khi pass.

## Đối chiếu review r1

1. Trương Tấn Sang: URL sai người đã bị loại. Báo The Japan Times ngày 17/3/2014 (trang 6, Brief profile of President Sang) ghi 21/1/1949, khớp nguồn báo Myanmar và Wikidata. Cặp nguồn hiện hành là hai nhà xuất bản nước ngoài.
2. Đã rà toàn bộ 98 nguồn của 49 hồ sơ. Evidence dùng đoạn trích gốc, vai trò `supports` và giới hạn. Bốn nguồn Michelle Obama/Cary Grant/Pollock/Akasaki không còn bị ghi thành xác nhận ngày sinh đầy đủ. Tất cả 49 nguồn chính có ngày sinh đầy đủ; 42 nguồn phụ xác nhận đủ ngày, 6 chỉ danh tính/năm sinh, một suy ra năm từ mốc 100 tuổi và được ghi rõ. Không đánh đồng nguồn chỉ danh tính với xác nhận ngày sinh.
3. Olympedia được ghi đúng là database của nhóm nghiên cứu quốc tế OlyMADMen, có dẫn tự mô tả và giới thiệu chính thức của Olympic Studies Centre. Không gán ISOH/Thụy Sĩ là đơn vị phát hành, không gọi database chính thức IOC. Reviewer chấp nhận nguồn nghiên cứu nước ngoài được OSC khuyến nghị ở bản ghi cụ thể của Chung Thị Thanh Lan; không suy rộng quyền chấp nhận cho cả host. Nguồn phụ là báo cáo gốc Moscow 1980 của ban tổ chức, LA84 số hóa, trang bản số hóa 474 / số in 477, xác nhận danh tính/đoàn Việt Nam. Không dùng trang của người cùng đóng góp database làm nguồn đối chiếu độc lập.
4. Rule U chỉ chấp nhận URL bản sao/bản ghi đã kiểm chứng và đúng QID. Hai báo PDF có publisher và SHA-256. Kiểm tra dương/âm thực sự chạy trong npm test: URL đúng đạt; khác người, trang bất kỳ cùng host, query string chưa duyệt, host giả và URL hỏng đều thất bại.
5. Báo cáo v2 ghi lại 48 lần truy vấn thực tế và thời gian. Bộ cuối dùng ngưỡng chung 60, Việt Nam 0 (đã chạy thử 8); 49/49 hồ sơ có trong ứng viên lấy lại. Không suy đoán tham số lịch sử v1. README đã sửa Rules A–U.

## Sửa cần thiết phát sinh ở cổng toàn bộ dữ liệu

Nguồn đối chiếu Carmélites của Thérèse (B003 đã DAT) timeout qua hai lần chạy verify:urls và một lần mở trực tiếp. Theo yêu cầu sửa đến khi đạt, chỉ URL này được thay bằng Press-kit.pdf chính thức của Sanctuaire de Lisieux, ghi 2 January 1873. Ngày sinh, QID và nguồn Vatican giữ nguyên. Bằng chứng bổ sung trong B003-evidence.json. Không thêm hồ sơ hay sửa các nội dung B003 khác.

## Nghiệm thu bản cuối

- Test Rule A–U: 0 vi phạm, gồm các kiểm tra âm về nguồn.
- Wikidata: 123 MATCHED, 0 MISMATCHED, 0 NO P569; lịch Gregorian, độ chính xác theo ngày.
- URL: 403 checked, 0 failed, 0 Britannica MANUAL pending (sau thay nguồn timeout).
- Lint, TypeScript, build, coverage: đạt. Cảnh báo lint ảnh/phông chữ cũ vẫn tồn tại.
- Smoke sau build: 8/8 route của việc B004 HTTP 200; trang 16/1 có Kate Moss và không lẫn Benjamin Franklin.
- Evidence: 49/49 QID/ngày sinh/URL liên kết đúng dữ liệu; 98/98 nguồn đã đọc/đối chiếu (95 từ văn bản, 3 trong trình duyệt: McMaster/Guggenheim/Léonore).
- B004 giữ 49 người mới: 10 Việt Nam, 39 quốc tế. B003+B004: 93 người mới, 19 Việt Nam (20,4%). Tháng 1 đủ 31/31 ngày, mỗi ngày ít nhất 3 người. Toàn dự án 123 người / 42 ngày; tháng 1 có 95 người.
- git diff --check: đạt; GitHub chưa có thay đổi đồng thời tại thời điểm kiểm trước tích hợp.

## Quyết định

B004-v2 **DAT**; BV-005 **ACCEPTED**. Chủ dự án đã phê duyệt push khi đạt: tích hợp bản B004 này cùng dữ liệu nền B003 đã DAT và các tệp phụ thuộc trong FILES của v2. Không đưa JSON ứng viên Wikidata thô vào Git. Chưa mở/giao B005; dừng sau commit/push và xác nhận remote.

Bằng chứng hiện hành: `nhap/B004-evidence.json`, `nhap/B004-source-review.json`, `nhap/B004-query-rerun.json`, `xong/B004-people-jan-16-31-v2.md`. Test/HTTP 200 hỗ trợ kiểm tra kỹ thuật; quyết định dữ kiện dựa thêm vào nội dung nguồn đã đọc, không hứa mọi thông tin trên các website nguồn đều đúng.

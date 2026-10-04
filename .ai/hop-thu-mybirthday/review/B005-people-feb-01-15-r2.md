KET_QUA: SUA

# B005 review r2 — sửa nguồn phụ và hoàn tất cổng

Chủ dự án yêu cầu duyệt lại, push khi đạt, rồi tiếp tục mở rộng nếu không còn báo cáo chờ duyệt; 2026-10-04.

B005 đạt kiểm dữ liệu/ngày sinh 167/167, nguồn 44 người / 88 trích dẫn, lint, TypeScript, build, smoke 9/9 và bảo toàn baseline. Ba URL BnF đã truy cập lại được; không sửa BnF.

Lượt toàn bộ không retry: 534 checked / 1 failed (Virginia Woolf Society) / 0 MANUAL. Lượt có retry lỗi kết nối: 533 checked / 2 failed (Virginia Woolf Society và Mozarteum, lỗi đọc response) / 0 MANUAL. Chưa DAT, chưa push, chưa mở B006.

## Chỉ thị sửa cụ thể trong BV-006

1. Cho phép đúng một thay đổi bổ sung trong `src/data/people/01.ts`: hồ sơ `virginia-woolf` / Q40909, thay URL phụ `https://virginiawoolfsociety.org.uk/resources/virginia-woolf-a-short-biography/` bằng `https://snl.no/Virginia_Woolf`. Nguồn SNL do Giáo sư Tone Selboe / Đại học Oslo viết, đã mở và ghi `25. januar 1882`; khớp Wikidata và British Library. Ghi bằng chứng nguồn thay thế dưới `nhap/B005-*`. Không đổi trường dữ kiện nào hay nguồn khác của tháng 1.
2. Mozarteum đã có HTTP 200 ở lượt đầu: thử lại toàn bộ GET gồm đọc body, không thay URL hoặc dữ kiện Mozart vì một timeout. Được dùng helper kiểm tra HTTP thật dưới `nhap/B005-*` với tối đa 3 lần thử cho lỗi kết nối/502–504; không mock, không dùng cache làm response, không whitelist, không bỏ kiểm status/nội dung/P1417.
3. Chạy lại cổng toàn bộ trên snapshot cuối tới 0 lỗi/0 MANUAL; không ghi PASS từ tổng hợp các lượt khác nhau. Chạy lại test/tsc/lint/build/smoke và so sánh baseline, chỉ cho ngoại lệ exact URL phụ Woolf được phép ở (1).
4. Nộp v2 rồi reviewer kiểm trước DAT. Chỉ khi DAT mới commit/push, kiểm trạng thái hộp thư và mở B006 theo yêu cầu chủ dự án.

Đây là sửa nguồn phụ để hoàn tất cổng chất lượng trong BV-006, không mở lại yêu cầu sản phẩm hoặc dữ kiện B003/B004.

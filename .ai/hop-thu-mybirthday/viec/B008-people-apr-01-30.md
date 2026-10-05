# B008 — mở rộng hồ sơ người sinh tháng 4 (1–30/4)

**Cycle:** BV-009 · **Ngày mở:** 05/10/2026 · **Trạng thái:** ACCEPTED (B008-r1 DAT).

## 1. Phạm vi và mục tiêu

Chủ dự án yêu cầu tiếp tục mở rộng dữ liệu sang tháng 4. B007 đã DAT và được đẩy lên `origin/main` ở commit `20ec06a1df2227ddcb64561e874fbc025f6239ef`.

| Hạng mục | Điều kiện đạt |
|---|---|
| Ngày mới | Cả 30 ngày từ 1 đến 30/4; ít nhất 3 người/ngày, tối đa 8 hồ sơ B008/ngày |
| Hồ sơ mới | Ít nhất 90 người (30 × 3), tất cả sinh trong tháng 4 |
| Tỷ lệ người Việt | Ít nhất 5% trong IDs mới; khi có đúng90 hồ sơ, cần tối thiểu5 người Việt |
| Nguồn | Mỗi hồ sơ có Wikidata và hai nhà xuất bản ngoài Wiki khác nhau; ít nhất một nguồn ngoài Wiki ghi đủ ngày/tháng/năm sinh |
| Nguồn người Việt | Mỗi hồ sơ Việt có ít nhất một đơn vị phát hành ngoài Việt Nam xác nhận đủ ngày sinh; ưu tiên hai nguồn nước ngoài; ghi rõ phụ thuộc/chung gốc nếu có |
| Bảo toàn | Giữ nguyên toàn bộ295 hồ sơ đang có và4 sự kiện lịch sử |
| Kết quả tối thiểu | 385 hồ sơ; ít nhất124/366 ngày có người nếu đạt đúng90 người mới và ba/ngày. Baseline đã có hồ sơ vào 10/4 và 30/4; kết quả cuối lấy từ coverage thực tế |

Phân bổ nghiên cứu theo hai phần 1–15/4 và16–30/4, tuần tự trong cùng vòng. Đây là hai đợt tìm kiếm nội bộ, không phải hai vòng review. Ưu tiên đa dạng quốc gia/nghề nghiệp; không ép danh mục ngoài ngưỡng bằng chứng. Không thêm dữ liệu tháng khác, sự kiện, sửa UI, ảnh, dependency hay logic ngoài các cổng dữ liệu cần thiết.

## 2. Quy trình

1. Đồng bộ `main`, đọc protocol/review/status, xác nhận B007 đã đóng và không có DUNG/khóa thực thi. Chụp baseline295 hồ sơ+4 sự kiện; chạy test, TypeScript, coverage baseline.
2. Truy vấn có giới hạn theo từng ngày April: danh sách chung threshold60 và candidate Việt Nam threshold0, LIMIT100. Lưu endpoint, query, ngày giờ, số bindings/QID, và kết quả thô tại `nhap/wd/B008-*`. Đây là mẫu sàng lọc, không khẳng định đầy đủ tất cả người sinh tháng4.
3. Xem toàn bộ P569, rank, references, P31; chỉ chấp nhận người thật và Gregorian precision11. Không dùng năm-only, Julian, lịch khác hoặc ngày khai sinh xung đột. Cần kiểm tra ngày tuổi người sống đã trưởng thành.
4. Mở HTML/PDF thực tế của hai nhà xuất bản; xác nhận đúng người và ngày sinh. Kiểm tra nghề nghiệp, quốc gia/xuất xứ và mọi claim nhập vào. Không dùng SEO birthday, sai trang, trang mềm/chỉ mục hoặc bài sao chép. Lưu URL chính xác, nhà xuất bản/quốc gia, thời điểm lấy, SHA-256, vị trí/trích dẫn gốc tối đa25 từ/trang; đánh dấu nguồn chỉ ghi năm và lưu toàn bộ trường P569 trong evidence. Mỗi người Việt cần nguồn ngoài Việt Nam đủDOB. Không tự xếp AFC/VPF, hoặc nguồn cùng kho/người biên soạn, thành hai xác nhận độc lập nếu có thể dùng chung hồ sơ.
5. Chỉ thêm B008 vào `src/data/people/04.ts`. Thêm Rule AB cho ngày/giới hạn thêm và Rule AC cho tối thiểu90, tối thiểu5%Việt, exactURL/QID của nguồn Việt nước ngoài, cùng test dương/âm (saiQID,URL,query,path,host giả,URL hỏng). A–AA không nới.
6. Rà 100% nguồn và lời mô tả, viết báo cáo ứng viên bị loại/mâu thuẫn; so sâu equality baseline295+4; test A–AC, Wikidata toàn bộ, URL toàn bộ, TypeScript, lint, build, coverage, smoke sản phẩm. Smoke các ngày1/15/16/30 tháng4 và regression tháng1,2,3 cùng share.
7. Chỉ đặt review DAT khi sự thật lẫn cổng đạt. Cập nhật README/status/báo cáo, stage đúng allowlist B008, kiểm diff; commit và push `origin/main` theo phê duyệt thường trực của chủ dự án; fetch xác nhận0/0 rồi dừng, không mở tháng5.

## 3. Tệp được phép

`src/data/people/04.ts`, `scripts/test-integrity.ts`, `README.md`, `.ai/REVIEW.md`, `.ai/STATUS.md`, `.ai/hop-thu-mybirthday/KE-HOACH.md`, `nhat-ky.md`, chỉ thị/báo cáo/review B008 và evidence/log/manifest/B008 trong `nhap/`. Raw responses `nhap/wd/B008-*` và HTML/PDF cache giữ local; không stage scratch B005–B007 hay nội dung tải nguyên bản.

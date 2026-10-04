KET_QUA: SUA

# B005 / BV-006 — Review r1

Ngày 2026-10-04; reviewer: Codex theo yêu cầu thực hiện trực tiếp của chủ dự án.

## Đạt

- 44 hồ sơ mới, 3 Việt Nam (6,818% ≥5%), 41 quốc tế, 14 quốc gia. Đủ 3 người/ngày 1–15/2.
- Rà 44 P569 có rank/calendar/precision; không có xung đột Gregorian không deprecated trong danh sách đã giữ.
- Rà 88 nguồn ngoài Wiki, quote và publisher. Ba người Việt có exact tài liệu nước ngoài xác nhận đủ ngày sinh; tài liệu PDF Đức Phát được kiểm đúng hàng và trang.
- A–W, Wikidata toàn bộ 167/167, lint/TypeScript/build/coverage, smoke 9/9, deep comparison 123 hồ sơ cũ và `git diff --check` đạt.
- Loại ứng viên có xung đột; thay endpoint chuyển trang chủ, cookie-only, 403 hoặc timeout của các hồ sơ B005. Không nới gate hoặc tự cho ngoại lệ nguồn.

## Chưa đạt — cổng URL toàn bộ

Lượt `npm run verify:urls` kiểm 531 URL, lỗi 5, MANUAL pending 0. Hai URL trong B005 (Talbot/Royal Society, Lincoln/Abraham Lincoln Association) được thay bằng Science Museum Group và Miller Center UVA, đã mở nội dung và thử HTTP thật. Carole King đổi từ homepage sang bài Rock Hall để tăng độc lập biên tập.

Kiểm tra bổ sung dữ liệu cuối: 132/132 URL B005 trả HTTP 200, 0 lỗi (`nhap/B005-new-url-audit-final.txt`). Rà nội dung 88 nguồn ngoài Wiki đạt; bản dựng và smoke sau thay URL đạt.

Ba URL BnF tháng 1 còn timeout local: `cb119255047`, `cb119298072`, `cb11922460q`. Không được đổi kết quả cổng thành PASS từ việc mở được hai nội dung qua web tool. Các URL này ngoài FILES của B005; giữ nguyên baseline, ghi Reviewer Attention.

## Yêu cầu trước DAT

1. Cổng toàn bộ `npm run verify:urls` trên dữ liệu cuối phải đạt 0 lỗi / 0 MANUAL. Thử lại khi kết nối nguồn ổn định; nếu phải thay URL cũ thì cần chỉ thị sửa đích danh trong BV-006 trước khi đụng hồ sơ tháng 1.
2. Khi sửa nguồn cũ, bảo toàn mọi trường dữ kiện của baseline và lưu bằng chứng nguồn thay thế; chạy lại mọi cổng liên quan.
3. Không commit/push dữ liệu, không giao B006 trước DAT.

Các lỗi transport được ghi nguyên trạng trong `nhap/B005-url-audit.txt`, `nhap/B005-new-url-audit*.txt` và `nhap/B005-legacy-url-attention.json`. Không coi lỗi truy cập là bằng chứng thông tin ngày sinh sai.

# B005 — Kết quả triển khai ngày 1–15/2

Cycle BV-006; executor và reviewer: Codex theo yêu cầu chủ dự án ngày 2026-10-04.

## Dữ liệu đã bổ sung

- 44 hồ sơ mới: 3 Việt Nam / 41 quốc tế; 6,818% ≥5% (làm tròn lên từ 2,2 hồ sơ). 14 quốc gia.
- Tổng local: 167 người / 56 ngày có dữ liệu; tháng 1: 95 người / 31 ngày; tháng 2: 65 người / 20 ngày.
- Mỗi ngày 1–15/2 có 3 người. Ngày 8/2 thêm 2 người và giữ Jules Verne cũ.
- Ba người Việt: Lê Đức Phát (1/2/1998), Võ Nguyên Hoàng (7/2/2002), Nguyễn Tiến Minh (12/2/1983). Ngày sinh được xác nhận lần lượt bởi Badminton Asia, AFC và ban tổ chức Asian Games 2010.

## Kết quả từng ngày

| Ngày | Ứng viên chung / VN (QID duy nhất) | Dòng thô chung / VN | Thêm VN / quốc tế | Tổng/ngày | Ngưỡng chung / VN |
|---|---:|---:|---:|---:|---:|
| 1/2 | 11 / 21 | 100 / 49 | 1 / 2 | 3 | 60 / 0 |
| 2/2 | 3 / 19 | 100 / 28 | 0 / 3 | 3 | 60 / 0 |
| 3/2 | 12 / 17 | 100 / 22 | 0 / 3 | 3 | 60 / 0 |
| 4/2 | 13 / 7 | 100 / 8 | 0 / 3 | 3 | 60 / 0 |
| 5/2 | 12 / 16 | 82 / 34 | 0 / 3 | 3 | 60 / 0 |
| 6/2 | 11 / 7 | 100 / 10 | 0 / 3 | 3 | 60 / 0 |
| 7/2 | 11 / 12 | 94 / 14 | 1 / 2 | 3 | 60 / 0 |
| 8/2 | 8 / 11 | 100 / 13 | 0 / 2 | 3 | 60 / 0 |
| 9/2 | 12 / 11 | 100 / 13 | 0 / 3 | 3 | 60 / 0 |
| 10/2 | 7 / 20 | 100 / 24 | 0 / 3 | 3 | 60 / 0 |
| 11/2 | 13 / 7 | 100 / 9 | 0 / 3 | 3 | 60 / 0 |
| 12/2 | 13 / 21 | 100 / 25 | 1 / 2 | 3 | 60 / 0 |
| 13/2 | 11 / 6 | 100 / 7 | 0 / 3 | 3 | 60 / 0 |
| 14/2 | 14 / 9 | 100 / 15 | 0 / 3 | 3 | 60 / 0 |
| 15/2 | 5 / 17 | 100 / 23 | 0 / 3 | 3 | 60 / 0 |

Không có ngoại lệ độ phủ. Truy vấn mỗi ngày LIMIT 100 là tập ứng viên giới hạn; không tuyên bố đã liệt kê toàn bộ người sinh ngày đó. Bổ sung truy vấn nhãn chính xác cho người bị hụt bởi giới hạn join nghề/quốc tịch; lưu nguyên query, số bindings, thời gian thật.

## Bằng chứng và kiểm chéo

- `nhap/B005-evidence.json`: 44 người, QID, toàn bộ P569/rank/calendar, exact URL, publisher/publisherCountry, excerpt nguyên ngữ, vị trí, hash và thời điểm kiểm.
- `nhap/B005-source-review.json`: rà 88 nguồn ngoài Wiki. Nguồn chỉ nêu năm/nhận dạng được đánh dấu đúng; không gọi là đủ ngày sinh.
- `nhap/B005-excluded.json`: loại Langston Hughes vì mâu thuẫn năm sinh; Segrè vì hai P569 không deprecated khác ngày; Clark Gable vì nguồn chính thống không truy cập được bằng transport kiểm tra. Không chấp nhận endpoint Academy chuyển về trang chủ hoặc Guggenheim chỉ có cookie.
- Mendeleev: nguồn thư viện ghi rõ 27/1 lịch Julian tương ứng 8/2 Gregorian; P569 7/2 deprecated được lưu đầy đủ, không giấu.
- Lê Đức Phát: báo cáo Badminton Asia PDF trang vật lý 35 / trang in 68 / hàng 19, số BWF 69345. Ngày và năm xuống hai dòng; trích từng trường và kiểm cùng hàng, không ghép thành quote giả.
- Võ Nguyên Hoàng: AFC PDF trang 16, Việt Nam hàng 10. VPF là nguồn đăng ký trong nước riêng; hai đơn vị có thể cùng nhận thông tin đăng ký liên đoàn, không tuyên bố hai điều tra ngày sinh độc lập.
- Nguyễn Tiến Minh: danh sách chính thức Guangzhou 2010 PDF trang 4; đơn vị phát hành ở Trung Quốc, host OCA ở Kuwait. Olympedia là OlyMADMen research database, không gọi là nguồn IOC sở hữu.
- Hai nguồn Việt Nam được dùng làm nguồn phụ cho Đức Phát/Nguyên Hoàng vì báo cáo thể thao/đăng ký câu lạc bộ hỗ trợ nhận dạng và hoạt động; nguồn đầy đủ ngày sinh vẫn ở ngoài Việt Nam.

## Cổng kỹ thuật

- PASS: integrity A–W (0 lỗi); Wikidata toàn bộ 167 MATCHED / 0 MISMATCHED / 0 NO P569; kiểm tra chọn riêng 44 người với rank: 0 xung đột Gregorian không deprecated.
- PASS: lint (còn cảnh báo `<img>` cũ), TypeScript, build, coverage, `git diff --check`.
- PASS: 132 URL của dữ liệu mới trên snapshot cuối; đã rà nội dung 88 nguồn ngoài Wiki.
- PASS: smoke 9/9 route HTTP 200; trang 1/2 chứa đúng 3 người mới và không có link người ngày khác; trang 15/2 đúng 3 người.
- PASS: so sánh nguyên hồ sơ baseline 123/123 bằng deep equality; 22/2 vẫn 16 người, 4 sự kiện. Không sửa tệp sự kiện.

## Chỗ không chắc / Reviewer Attention

Cổng `npm run verify:urls` toàn bộ đã hoàn tất: 531 URL / 5 lỗi / 0 MANUAL trong snapshot ban đầu. Đã thay 2 URL của B005 đúng phạm vi và thay homepage Carole bằng bài Rock Hall. Kiểm bổ sung dữ liệu cuối `B005-new-url-audit-final.txt`: 132/132 URL B005 HTTP 200, 0 lỗi. Cổng toàn bộ chưa được gọi PASS. Ba URL BnF tháng 1 timeout trong lượt toàn bộ và lượt thử lại local, mặc dù nội dung mở được qua công cụ duyệt web. Không sửa hồ sơ tháng 1 nằm ngoài FILES của B005; không coi web opening là npm verify:urls đã pass.

## FILES thực tế

- `src/data/people/02.ts`: append 44 hồ sơ, giữ baseline.
- `scripts/test-integrity.ts`: bổ sung V/W, exact foreign DOB URL/QID và kiểm âm; thêm các publisher chính thống đã rà vào Rule P, giữ assertion A–U.
- `README.md`: số liệu thực tế và A–W.
- `.ai/REVIEW.md`, `.ai/STATUS.md`, `viec/B005-people-feb-01-15.md`, `KE-HOACH.md`, `nhat-ky.md`: tài liệu reviewer / điều chỉnh chủ dự án.
- `nhap/B005-*`: baseline, query manifest, evidence, review, exclusion, validation outputs; helper/raw JSON là local, không chuẩn bị commit raw `nhap/wd/`.
- `xong/B005-people-feb-01-15.md` và review tương ứng.

## Git / việc tiếp theo

Review r1: SUA do 3 URL BnF legacy timeout. Chưa commit/push cho tới khi DAT và cổng toàn bộ đạt. Không giao B006.

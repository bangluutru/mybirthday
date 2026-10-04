# B005-v2 — báo cáo sửa và kiểm tra lại

Cycle BV-006. Ngày 2026-10-04. Codex thực hiện/review/tích hợp theo yêu cầu trực tiếp chủ dự án.

## Kết quả

44 hồ sơ mới, 3 Việt Nam /41 quốc tế (6,818%, làm tròn tối thiểu5%); 14 quốc gia. Tổng167 người /56 ngày có dữ liệu; tháng1 có95 người /31 ngày; tháng2 có65 người /20 ngày. Ngày1–15/2 mỗi ngày3 người. Ngày22/2 vẫn16 người +4 sự kiện.

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

## Sửa theo review r2–r4

- Woolf: URL phụ Virginia Woolf Society timeout thay SNL, đủ25/1/1882. Baseline facts giữ nguyên.
- Brecht mới B005: adk.de HTTP502 sau3 lần GET thay SNL, đủ10/2/1898. Evidence/hash/source-review cùng URL hiện tại.
- Sáu URL BnF lỗi truy cập luân phiên thay đúng nguồn được duyệt r4: Beauvoir, Perrault, Stendhal, Colette, Rolland bằng bài tiểu sử SNL; Mishima bằng bảo tàng văn học chính thức Nhật Bản, đầy đủ14/1/1925. Không dùng SNL Mishima chỉ ghi năm hoặc trang Colette về tên riêng. Evidence exactURL/quote/hash/tác giả trong B005-bnf-source-corrections.json.
- PublisherCountry của hai host cá nhân Bob Marley và Heifetz đểunknown vì chưa đủ chứng cứ về đơn vị chủ quản; không suy từ quốc tịch nhân vật.
- Kiểm âm RuleW dùng đúngQID đã duyệt với host giả/URL hỏng/query lạ, không chỉ QID chưa duyệt.

## Cổng cuối (r5 kỹ thuật, r6 URL)

PASS integrityA–W; Wikidata167MATCHED/0MISMATCH/0missing; URL535checked/0failed/0MANUAL; TypeScript; lint (cảnh báo img cũ); build; coverage;9/9 smoke;diffcheck. Evidence44 người/88 nguồn ngoài Wiki liên kết đúngQID/DOB/URL/excerpt/hash,0unsupported. Kiểm máy cấu trúc/hash bổ sung việc đọc và đối chiếu nguồn, không thay thế kiểm sự thật.

123 hồ sơ gốc bảo toàn mọi dữ kiện;116 hồ sơ giữ nguyên toàn bộ,7 hồ sơ chỉ đổi đúngURL đã duyệt. Deep equality cho123 hồ sơ với danh sách7 thayURL cụ thể;4 sự kiện không đổi. Không sửaUI/package/lock.

URL r6 cuối dùng B005-http-complete-retry.cjs: GET thật tối đa3 lần khi timeout/lỗi500/502/503/504, đọc body thật, giữ status và checks gốc; không cache/mock/whitelist. scripts/check-source-urls.ts không sửa. Các lượt lỗi r1–r5 vẫn lưu để truy vết. NguồnPDF có chứng cứ trích trang/hash ở evidence; HTTP200 không tự chứng minh claim.

## FILES thực tế

Danh sách chính xác56 tệp tích hợp ở nhap/B005-release-files.json: src/data/people/01.ts (7 URL-only),02.ts (44append),scripts/test-integrity.ts,README; các tài liệu reviewer/task/status, báo cáo và review; baseline/query/evidence/exclusion/source-review, helperHTTP và smoke, log r5 kỹ thuật /r6 URL và lịch sử lỗi. Raw nhap/wd/, toàn bộHTML/PDF cache và dump fetch trung gian không tích hợp.

## Giới hạn / tiếp theo

Chưa phủ toàn tháng2/toàn năm. Cảnh báo img cũ ngoài phạm vi. Nguồn phụ thể thao có thể cùng nhận dữ kiện đăng ký liên đoàn, đã ghi rõ giới hạn; không gọi hai cuộc điều traDOB độc lập. Git chỉ push sau reviewerDAT; B006 chỉ giao sau B005 đã tích hợp và hộp thư không còn báo cáo cần duyệt.

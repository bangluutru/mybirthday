# B005 — Làm giàu dữ liệu: nhân vật sinh 1/2 → 15/2

Chu kỳ: BV-006 · Ưu tiên: P1 · Reviewer: Codex theo yêu cầu chủ dự án · Executor: Codex theo yêu cầu thực hiện trực tiếp ngày 2026-10-04
Điều kiện giao: B004-v2 DAT (review r2), B003/B004 đã tích hợp tại `ed24674a40e12189535ec245706993a94a38b8aa`. Chủ dự án yêu cầu tiếp tục mở rộng sang tháng khác ngày 2026-10-04.

## 0. Phạm vi và đích đạt

Bổ sung nhân vật sinh **1–15/2** vào `src/data/people/02.ts`, dùng lại hạ tầng Wikidata hiện có. Theo KE-HOACH.md, B004 từng có nguồn sai nên chuyển sang mỗi việc nửa tháng. Chỉ một việc đang mở; nửa sau tháng 2 được giao sau B005 DAT và tích hợp Git.

Baseline: 123 người / 42 ngày có dữ liệu; tháng 1 có 95 người và đủ 31/31 ngày. Tháng 2 có 21 người, trong phạm vi 1–15/2 chỉ có Jules Verne (8/2). Giữ nguyên toàn bộ hồ sơ cũ. Đích: **ít nhất 3 người đã kiểm chứng/ngày**, tối đa 8 người mới/ngày; cần tối thiểu 44 hồ sơ mới nếu mọi ngày đạt. Đây là đích, không phải số liệu đã hoàn thành. Không ép dữ liệu: ngày thiếu nguồn phải báo thiếu và chờ review, không tự thêm ngoại lệ để test đạt.

Tỷ lệ người Việt **tối thiểu 5% trong hồ sơ mới của riêng B005**; không tính Jules Verne hay hồ sơ tháng 1 vào mẫu số. Với 44 hồ sơ mới, cần ít nhất 3 người Việt (làm tròn lên số nguyên). Đa dạng quốc gia và nghề nghiệp trong nhóm quốc tế; không yêu cầu người Việt ở mọi ngày nếu không có nguồn chắc chắn. Không thêm hồ sơ ngày 16–29/2, tháng khác, sự kiện, ảnh mới hay sửa UI.

## 1. Thu thập và kiểm tra chéo

1. Truy vấn từng ngày bằng `scripts/wikidata-candidates.ts`: một lượt chung và một lượt riêng Việt Nam. Ghi tham số thực tế cho từng lượt: month, day, threshold, vnOnly, asOfDate, thời điểm chạy, số dòng thô, số QID duy nhất. Ngưỡng gợi ý chung 60, Việt Nam 0; nếu thay đổi phải lưu lượt mới, không điền lại lịch sử từ mặc định. Không truy vấn song song; giữ giới hạn script. Raw JSON ở `nhap/wd/`, không commit.
2. Chỉ chọn người thật, đã trưởng thành hoặc đã mất, ngày Gregorian với precision 11; loại trùng QID/id/slug toàn bộ dữ liệu. Không suy đoán từ năm sinh, lịch âm hay ngày xuất bản bài viết.
3. Mỗi người mới: URL Wikidata + ít nhất hai nguồn đối chiếu độc lập trên hai host khác nhau; ít nhất một nguồn chính thống/thể chế nêu **đầy đủ ngày/tháng/năm sinh**. Wikidata và nguồn này phải khớp. Phải mở nội dung thực tế, kiểm đúng người, không lấy HTTP 200 hoặc kết quả tìm kiếm làm bằng chứng đã xác minh. Bất đồng, lỗi mềm, trang sai người, không mở được: loại khỏi danh sách, ghi lý do.
4. Mỗi người Việt mới: ít nhất một nguồn chính thống/thể chế của đơn vị **ngoài Việt Nam**, nêu đầy đủ ngày sinh. Ưu tiên cả hai nguồn đối chiếu ở ngoài Việt Nam; nếu nguồn thứ hai tại Việt Nam, giải thích lý do. `publisherCountry` theo tổ chức phát hành/đơn vị chủ quản, không theo đuôi miền hoặc ngôn ngữ trang.
5. Hai host không tự chứng minh độc lập biên tập: ghi đơn vị chủ quản, tác giả/nguồn gốc dữ liệu nếu có. Không dùng các bản sao cùng một bài hoặc cùng cơ sở dữ liệu làm hai xác nhận độc lập. Đặc biệt Olympedia/Sports Reference/bản tổng hợp Herman de Wael phải kiểm nguồn chung; không gọi Olympedia là cơ sở dữ liệu chính thức của IOC hoặc mặc định do ISOH sở hữu.
6. Ghi `B005-evidence.json` cho **tất cả** người mới: id, QID, full DOB, verifiedAt; mỗi nguồn có exact URL, publisher, publisherCountry, thời điểm mở, supports (`full-birth-date`, `birth-year`, `identity`, hoặc claim cụ thể), quote nguyên ngữ, quoteType và vị trí trang/đoạn. Không đặt diễn giải tiếng Việt vào trường quote; bản dịch để riêng. Trích ngắn đúng nguyên bản, không quá 25 từ từ một trang cho một hồ sơ. Nguồn chỉ nêu năm/nhận dạng không được đánh dấu full-birth-date.
7. Tiểu sử, nơi sinh, nghề, highlights cũng phải được nguồn hỗ trợ; lược bỏ nội dung không có bằng chứng, không dùng AI/blog sinh nhật SEO làm nguồn. Dùng placeholder hiện có.
8. Với PDF bản sao trên host cá nhân: không cho phép cả host. Chỉ đề xuất exact URL + QID, kèm chứng cứ tài liệu gốc/đơn vị xuất bản và hash tài liệu. Reviewer duyệt từng tài liệu trước DAT; không tự coi một host mới là nguồn đã duyệt.

## 2. Cổng kiểm tra và bảo vệ dữ liệu đã duyệt

- Chạy baseline `npm test`, `npm run coverage`, `npx tsc --noEmit`; lưu đầu ra thật trước khi sửa. Lưu danh sách id/QID/ngày và tổng theo ngày của baseline để đối chiếu sau.
- Giữ nguyên Rule A–U và các cổng tháng 1: 31 ngày ≥3 người; 93 bổ sung có 19 người Việt (20,4%). Không nới điều kiện nguồn, không đổi `verifiedAt` của hồ sơ cũ để né Rule P.
- Thêm Rule V: ngày 1–15/2 ≥3 người; tối đa 8 hồ sơ mới/ngày; mẫu mới tính theo id loại trừ baseline, không dựa riêng vào ngày verifiedAt. Chạy test trước khi thêm dữ liệu và lưu thất bại thực tế do thiếu độ phủ.
- Thêm Rule W: cơ cấu Việt Nam tối thiểu 5% trên hồ sơ mới B005; kiểm nguồn nước ngoài cho tất cả người Việt mới, dùng lại helper đang có. Không whitelist host cá nhân/cơ sở dữ liệu tổng hợp; tài liệu cần duyệt theo exact URL/QID. Thêm kiểm tra âm cho QID sai, URL chưa duyệt, biến thể query, host giả và URL hỏng. Kiểm máy chỉ kiểm cấu trúc, reviewer vẫn mở nguồn kiểm sự thật.
- Không sửa hằng số người 22/2 trong B005 vì ngày này ngoài phạm vi. B006 sẽ xử lý khi bổ sung 16–29/2, bao gồm 29/2. Giữ 16 người và 4 sự kiện ngày 22/2 trong đợt này.
- README chỉ cập nhật số liệu thực tế/độ phủ và các quy tắc kiểm mới, không tuyên bố đã phủ toàn tháng 2 hoặc toàn năm.

## 3. Cổng cuối bắt buộc

Chạy tuần tự và ghi kết quả thật:

- `npm test` (A–W đạt, không có ngoại lệ độ phủ chưa được reviewer duyệt).
- `npm run verify:wikidata`: toàn bộ ALL_PEOPLE, 0 mismatch/thiếu ngày.
- `npm run verify:urls`: toàn bộ URL, 0 lỗi và 0 MANUAL pending. Nguồn không mở được không được xem là đã kiểm sự thật.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run coverage`.
- Smoke sau build: `/`, `/birthday/2/1`, `/birthday/2/1/people`, `/birthday/2/15/people`, `/day/2/15`, `/birthday/1/16/people`, `/birthday/2/22`, `/person/<slug mới>`, `/share/2-1`: HTTP 200; nội dung 1/2 có hồ sơ mới đúng ngày, không lẫn ngày khác; ngày 22/2 giữ baseline.
- So sánh dữ liệu baseline: hồ sơ cũ và sự kiện không đổi. Evidence phải đủ mỗi người và URL thuộc đúng hồ sơ. Rà **100% nguồn đối chiếu** và lưu `B005-source-review.json` với nội dung có/không hỗ trợ claim; không chỉ kiểm một mẫu.
- `git diff --check` do reviewer thực hiện khi tích hợp; Gemini không chạy Git.

## 4. FILES được phép sửa/tạo

Sửa:
- `src/data/people/02.ts`: chỉ append hồ sơ 1–15/2.
- `scripts/test-integrity.ts`: thêm V/W và registry exact URL/QID cần thiết; bảo toàn A–U và các assertion đã duyệt, không refactor lớn.
- `README.md`: số liệu và mô tả cổng liên quan.

Tạo:
- `.ai/hop-thu-mybirthday/nhap/B005-*`: baseline, manifest truy vấn, evidence, source-review, danh sách loại, đầu ra test và URL.
- `.ai/hop-thu-mybirthday/nhap/wd/02-01*.json` … `02-15*.json`: raw local, không commit.
- `.ai/hop-thu-mybirthday/xong/B005-people-feb-01-15.md`; sửa lần sau dùng `-v2`, `-v3`…
- Nhật ký và `gemini.lock` theo protocol.

Không sửa tệp khác, package/lock, REVIEW/STATUS, AGENTS, viec/review, script truy vấn/URL, UI hay dữ liệu ngoài phạm vi. Cổng toàn bộ dữ liệu phát hiện nguồn cũ lỗi thì ghi Reviewer Attention và chờ chỉ thị sửa cụ thể; không tự mở rộng FILES.

## 5. Bàn giao và quyết định DAT

Báo cáo phải có FILES thực tế; bảng đủ 15 ngày (ứng viên chung/VN, số thêm VN/quốc tế, tổng/ngày, ngưỡng và lý do thiếu); QID/DOB/nguồn từng người; tỷ lệ đúng mẫu số; danh sách loại; kết quả thật của mọi cổng; chỗ không chắc và Reviewer Attention.

Nếu thiếu nguồn hoặc cơ cấu/độ phủ chưa đạt, báo cáo trung thực để nhận SUA; không giả bằng chứng và không tự giảm đích. Nộp xong thì dừng, không Git. Reviewer kiểm chéo ngày sinh và tính độc lập từng hồ sơ, chỉ DAT khi cổng kỹ thuật **và** bằng chứng nguồn đều đạt; chỉ tích hợp dữ liệu sau DAT. Không bắt đầu nửa sau tháng 2 trước chỉ thị mới.

Điều chỉnh chủ dự án 2026-10-04: tỷ lệ hồ sơ mới B005 tối thiểu 5% người Việt; Codex trực tiếp thực hiện, kiểm tra và tích hợp sau DAT. Không thay đổi bằng chứng hay tiêu chí đóng tháng 1.

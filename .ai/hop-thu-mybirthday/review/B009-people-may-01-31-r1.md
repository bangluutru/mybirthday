# B009 review r1 — dữ liệu tháng 5

Ngày review: 06/10/2026. Cycle: BV-010. Reviewer: Codex, theo yêu cầu trực tiếp của chủ dự án review phần đạt và push Git.

## Kết quả dữ liệu

**DAT đối với tập bổ sung B009.** Chấp nhận 93 hồ sơ vào `PEOPLE_05`: đúng 3 hồ sơ/ngày trên 31/31 ngày; 88 quốc tế và 5 Việt Nam (5,38%). Tổng 478 người, 155/366 ngày phủ. 385 hồ sơ cũ và 4 sự kiện giữ nguyên bằng deep equality.

- Rà lại 191 tài liệu ngoài Wiki của cả 93 người; nguồn xác nhận đầy đủ DOB khớp danh tính và Wikidata. Mỗi người có ít nhất hai nhà xuất bản khác nhau. Không phát hiện sao chép trực tiếp giữa các trang được dùng.
- Lấy lại claims Wikidata tại vòng review: 93/93 P31 human; P569 đang hoạt động có ngày Gregorian precision 11 đúng DOB; không có claim precision-day trở lên mâu thuẫn. Kiểm tra Wikidata toàn database: 478 khớp, 0 sai khác, 0 thiếu.
- Hai nguồn DOB của mỗi hồ sơ Việt đều do tổ chức ngoài Việt Nam phát hành. Quốc gia publisher được ghi theo tổ chức/ấn bản, không suy ra từ quốc tịch nhân vật hoặc ngôn ngữ bài viết.
- Không xác nhận độc lập về quy trình thu thập thông tin gốc: các nguồn thể thao OCA/IWGA/AFC/ESPN/FotMob có thể dùng chung dữ liệu đăng ký vận động viên. Hai nhà xuất bản và các giải đấu khác nhau là kiểm chéo nội dung đã công bố, không tương đương hai hồ sơ hộ tịch độc lập. Giới hạn này được công khai trong ledger và báo cáo.

## Sửa sau khi review

1. Robert Pattinson: excerpt tự động từ Almanac lấy nhầm mục Lena Dunham có cùng DOB. Đọc lại mục **PATTINSON, ROBERT**, xác nhận London, 13/5/1986. Sửa excerpt trong ledger; dữ kiện/URL trong database đúng nên giữ nguyên.
2. Lương Thị Thu Thương: PDF OCA bị đảo cột khi trích text. Đối chiếu hàng số 2, `LUONG Thi Thu Thuong`, DF, 1 MAY 2000; ledger dùng đoạn đúng hàng thay cho cụm DOB rời tên.
3. Sửa metadata Safeguard Defenders từ SE thành ES theo [trụ sở Madrid do tổ chức công bố](https://safeguarddefenders.com/en/home). ESPN UK là ấn bản UK; ledger ghi ESPN US/UK edition, không coi tên miền là bằng chứng pháp nhân.
4. UEFA Cesc Fàbregas timeout với User-Agent reviewer; tải lại bằng User-Agent của checker production trả 200 và xác nhận 4/5/1987. [Bài UEFA](https://www.uefa.com/under17/news/0252-0cda5c854055-44e524ba9f27-1000--2004-cesc-fabregas/) cũng được mở trực tiếp bằng công cụ web để đối chiếu danh tính/DOB.
5. Sửa đường dẫn evidence `nhap/wd/` và mô tả trường `birthplace` trong báo cáo executor cho khớp file thực tế.

## Cổng kiểm tra độc lập

- `npm test`: Rules A–AD, 0 vi phạm, 478 người; chạy lại sau sửa metadata ES.
- `npx tsc --noEmit`: đạt, chạy lại sau sửa metadata.
- `npm run verify:wikidata`: 478/478 khớp.
- `npm run lint`, `npm run build`: exit 0. Còn cảnh báo ảnh/font có sẵn; không sửa UI.
- `npm run coverage`: tháng 5 93 người/31 ngày; tổng 478/155 ngày.
- Smoke build production tại localhost:3011: 26/26 route trả 200; kiểm nội dung các trang SSR có tên mong đợi, gồm 5 hồ sơ Việt. Có ngày hồi quy tháng 1–4 và 29/2. Route client chỉ được xác nhận HTTP, không coi là kiểm tương tác trình duyệt.
- Baseline: 385 người + 4 sự kiện giống hệt; `git diff --check` đạt.
- URL checker tháng 5 chạy đúng code `scripts/check-source-urls.ts`, chỉ đổi import sang `PEOPLE_05` trong bản sao cục bộ. **286 checked / 0 failed / 0 manual pending**. Kết quả cuối được lưu trong `B009-validation.json`.

## Phạm vi nghiệm thu và Reviewer Attention

Reviewer chốt cổng URL cho **phần B009 được phát hành**; không tuyên bố cổng URL toàn ứng dụng đã đạt. Đây là quyết định phạm vi review theo yêu cầu chủ dự án chọn kết quả đạt để tích hợp; không hạ điều kiện xác minh DOB của bất kỳ hồ sơ B009 nào.

Snapshot quét toàn ứng dụng: 1.471 URL, 6 lỗi. Lỗi President.ie thuộc B009 đã được thay bằng SNL; 5 lỗi ở dữ liệu cũ vẫn tồn tại trong snapshot: James Joyce API (502), The-Sports của Trần Lê Quốc Toàn (403), Supreme Court of India của Ambedkar (403), Le Monde của Nguyễn Phú Trọng (402), Nobel biographical của Halldór Laxness (không xác nhận exact DOB). Chưa sửa nguồn tháng khác, chưa khẳng định các lỗi đó đã biến mất. Cần một chỉ thị nguồn cũ riêng nếu muốn cổng toàn ứng dụng sạch.

Nội dung UI “hàng chục nghìn nhân vật” chưa tương xứng với 478 hồ sơ; ngoài phạm vi B009.

## Bằng chứng và quyết định Git

Ledger có 93 QID/DOB, 191 URL/publisher, excerpt ngắn, hash tài liệu, claims Wikidata, so sánh baseline và smoke: `review/B009-evidence.json`. Hash SHA-256 của `05.ts` được gắn với review; giữ HTML/PDF và response nguyên bản cục bộ, không đưa vào Git.

**ACCEPTED cho B009.** Chỉ stage database tháng 5, Rule AD, task/báo cáo/review/ledger/validation và tài liệu trạng thái liên quan. Chủ dự án đã cho phép push khi phần dữ liệu đạt; commit/push `origin/main`, xác nhận remote rồi dừng. Chưa mở tháng 6 hay chu kỳ mới.

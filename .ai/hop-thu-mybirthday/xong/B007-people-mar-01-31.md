# B007 — Báo cáo hoàn thành dữ liệu tháng 3

**Cycle:** BV-008 · **Ngày báo cáo:** 05/10/2026 · **Trạng thái:** DAT. Chủ dự án đã yêu cầu lập kế hoạch và thực hiện; cho phép push khi đạt tiêu chí.

## Kết quả

- Thêm **93 hồ sơ** mới, đúng **3 người cho mỗi ngày 1–31/3**; không có ngày nào vượt quá giới hạn 8 người/ngày.
- Có **5 người Việt (5,38%)** và 88 người quốc tế. Người Việt được chia ở ngày 2, 3, 16, 17, 28/3. Cả 5 hồ sơ có ngày sinh đầy đủ trong danh sách thi đấu AFC do cơ quan bóng đá quốc tế phát hành; trang VPF trong nước là nguồn đối chiếu thứ hai.
- Sau cập nhật có **295 người, 4 sự kiện, 96/366 ngày có nhân vật (26,2%)**. Tháng 1: 95 người/31 ngày; tháng 2: 100 người/29 ngày; tháng 3: 93 người/31 ngày. Còn 270 ngày trống trên cả năm.
- Phân bố hồ sơ mới: 20 quốc gia; Mỹ 32, Đức 14, Anh 9, Pháp 8, Nga 7, Việt Nam 5, Áo 3, Ý 2, Hà Lan 2 và 10 quốc gia khác mỗi nơi một hồ sơ.

## Kiểm tra chéo dữ kiện

- Đã rà toàn bộ **93/93 người và 186/186 tài liệu nguồn** trên nội dung HTML/PDF gốc, đối chiếu danh tính, ngày sinh, nghề nghiệp và quốc gia/xuất xứ được ghi trong mô tả. Mỗi hồ sơ trỏ tới hai nhà xuất bản ngoài Wiki khác nhau và Wikidata.
- Có 180/186 tài liệu nêu đủ ngày/tháng/năm sinh; sáu trang SNL chỉ cho năm sinh, nhưng nguồn độc lập còn lại của mỗi hồ sơ xác nhận đủ ngày. Trích dẫn nguyên ngữ, vị trí tìm thấy và SHA-256 của từng tệp gốc được lưu trong evidence để kiểm tra lại. Giới hạn 25 từ trích dẫn trên mỗi nguồn/hồ sơ được giữ.
- Kiểm tra 93 bộ khai báo P569: đều là ngày Gregorian đủ chính xác, và mọi khai báo đủ ngày không deprecated đều trùng dữ liệu tích hợp. `verify:wikidata` kiểm tra cả kho 295 hồ sơ: **295 khớp, 0 lệch, 0 thiếu**.
- Với 5 người Việt, AFC và VPF có thể dựa trên cùng dữ liệu đăng ký cầu thủ; báo cáo không xem đây là hai cuộc điều tra ngày sinh độc lập. AFC là nguồn nước ngoài nêu đủ ngày sinh cho từng người; VPF bổ sung đối chiếu nội địa.
- Trường hợp Bernardo Bertolucci được ghi rõ: hai bách khoa thư SNL và Hrvatska đều cho ngày mất 26/11/2018; P570 Wikidata hiện ghi 22/11/2018. Dữ liệu ngày mất theo hai nguồn tiểu sử đối chiếu, còn mâu thuẫn P570 được giữ nguyên trong hồ sơ review để người dùng sau biết rõ.

## Từ chối ứng viên và nguồn sai

- Không tích hợp ứng viên có P569 Gregorian đủ ngày mâu thuẫn (Rosa Luxemburg, Robert Frost) hoặc chỉ có ngày Julian/khai báo Gregorian deprecated hay năm-only (Modest Mussorgsky, Maxim Gorky).
- Không tích hợp Lê Ngọc Bảo: trang AFC/VPF cho 29/3/1998 nhưng Wikidata đủ ngày ghi 27/3/1998.
- Loại Nat King Cole vì nguồn đối chiếu mâu thuẫn năm sinh; thay ứng viên có ngày mất mâu thuẫn hoặc khoảng ngày không giải quyết được (Jean Harlow, Marcello Malpighi, Sully Prudhomme, Vannevar Bush, Vivaldi, Rudolf Diesel).
- Loại trang Croatian mềm/chỉ mục và bài sai người; thay các kết quả tìm kiếm không phải hồ sơ cá nhân. James Tobin có một SNL ghi ngày 15/3 trong khi Nobel và Hrvatska ghi 5/3; bộ so khớp ngày có ranh giới chữ số, tránh hiểu nhầm số 5 nằm trong 15.
- Các endpoint Wikidata search đầu tiên có một số lỗi giới hạn 429; các lô wbgetentities thay thế thành công 93/93 và 62 truy vấn candidate theo ngày hoàn tất. Danh sách candidate được giới hạn bởi `LIMIT 100`, nên đây là các mẫu sàng lọc có ranh giới, không phải khẳng định đã thấy mọi người sinh tháng 3.

## Kiểm tra ứng dụng

- `npm test`: Rules A–AA đạt, 0 vi phạm; kiểm tra trước tích hợp chủ ý thất bại với 33 lỗi ở Rule Z/AA, đúng theo dự kiến.
- `verify:wikidata`: 295/295; `verify:urls`: **916 URL/916 đạt, 0 lỗi, 0 Britannica cần xác nhận thủ công**.
- TypeScript, lint, build và coverage đều hoàn tất. Lint chỉ còn 5 cảnh báo `<img>` có sẵn ở AppShell, DateTactilePicker và ShareCardModal.
- Smoke production 12/12 URL HTTP 200: trang chủ, trang nhân vật và ngày 1/15/16/31 tháng 3, share 31/3, các regression ngày 16/1, 29/2 và 22/2. Deep equality xác nhận đủ 202 hồ sơ baseline và cả 4 sự kiện được giữ nguyên. Các trang `/day` đang hiển thị tối đa hai nhân vật như thiết kế sẵn; dữ liệu truy vấn có đủ ba.
- Kiểm tra evidence native xác thực SHA-256 và trích dẫn của 186 tài liệu gốc; phép kiểm này bổ sung, không thay cho rà soát sự thật bằng người.

## Tệp trong phạm vi

`src/data/people/03.ts`, `scripts/test-integrity.ts`, `README.md`, `.ai/REVIEW.md`, `.ai/STATUS.md`, `.ai/hop-thu-mybirthday/KE-HOACH.md`, `.ai/hop-thu-mybirthday/nhat-ky.md`, chỉ thị và báo cáo B007; baseline, manifest/truy vấn tóm tắt, evidence, danh sách từ chối, các log kiểm tra và smoke report đã chọn lọc. Raw Wikidata và HTML/PDF nguyên bản được giữ ngoài Git.

**Reviewer Attention:** dòng giao diện cũ nói “hàng chục nghìn nhân vật” chưa khớp quy mô 295 hồ sơ. Giữ ngoài phạm vi vòng dữ liệu tháng 3.

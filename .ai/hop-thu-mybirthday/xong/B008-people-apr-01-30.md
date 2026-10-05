# B008 — Báo cáo hoàn thành dữ liệu tháng 4

**Cycle:** BV-009 · **Ngày báo cáo:** 05/10/2026 · **Trạng thái:** DAT. Chủ dự án đã yêu cầu mở rộng và cho phép đẩy Git nếu đạt review.

## Kết quả

- Thêm **90 hồ sơ mới**, đúng **3 hồ sơ cho mỗi ngày 1–30/4**. Ba hồ sơ tháng 4 đã có từ baseline được giữ nguyên; sau cập nhật tháng 4 có **93 người trên 30/30 ngày**.
- Có **5 người Việt (5,56%)** và **85 người quốc tế**. Hồ sơ Việt trải ở ngày 5, 7, 12, 14 và 19/4; cả năm người đều được đối chiếu bằng ít nhất một nhà xuất bản ngoài Việt Nam có ngày sinh đầy đủ.
- Tổng cơ sở dữ liệu có **385 người, 4 sự kiện và 124/366 ngày có nhân vật (33,9%)**. Baseline 295 hồ sơ từng phủ 96 ngày, trong đó hai ngày tháng 4 đã có người; vì vậy tháng 4 đầy đủ làm độ phủ tăng thêm 28 ngày. Còn 242 ngày trống.
- Tháng 1: 95 người/31 ngày; tháng 2: 100 người/29 ngày; tháng 3: 93 người/31 ngày; tháng 4: 93 người/30 ngày. Tháng 4 mới có 90 hồ sơ B008; mỗi ngày nhận đúng 3 hồ sơ mới.

## Kiểm tra chéo dữ kiện

- Đã rà **90/90 hồ sơ và 181/181 trang nguồn ngoài Wiki** từ nội dung tải trực tiếp. Tất cả trang trả HTTP 200, nhận diện đúng nhân vật, có tiêu đề/trích đoạn và SHA-256; trích đoạn không vượt quá 25 từ/trang. Mỗi hồ sơ có ít nhất hai nhà xuất bản ngoài Wiki ở hai host khác nhau.
- **166/181** trang nêu đủ ngày, tháng, năm sinh. 15 trang còn lại là nguồn bổ sung về danh tính/tiểu sử; **mọi hồ sơ trong 90/90 hồ sơ đều có ít nhất một nguồn ngoài Wiki khác ghi đủ ngày sinh**. Evidence lưu nội dung xác nhận, host/quốc gia nhà xuất bản, thời điểm lấy, hash, rank, độ chính xác lịch, calendar model và references P569.
- P31 xác nhận 90/90 là người. Mỗi P569 có đúng một giá trị đầy đủ Gregorian đang hoạt động khớp ngày tích hợp; không có giá trị đủ ngày khác lịch gây mâu thuẫn. Mười hồ sơ còn có thêm khai báo P569 chỉ ghi năm; các khai báo này cùng năm với ngày chính xác và không phủ định ngày/tháng.
- `verify:wikidata`: **385 khớp / 0 lệch / 0 thiếu DOB**. Bốn sự kiện lịch sử giữ nguyên.
- Năm hồ sơ Việt:

| Nhân vật | Ngày sinh | Nguồn ngoài Việt Nam ghi đủ ngày |
|---|---|---|
| Trần Lê Quốc Toàn | 05/04/1989 | [Olympedia](https://www.olympedia.org/athletes/124166) |
| Joseph Trần Văn Toản | 07/04/1955 | [Catholic-Hierarchy](https://www.catholic-hierarchy.org/bishop/btvt.html) |
| Nguyễn Quang Hải | 12/04/1997 | [Liên đoàn Bóng đá châu Á](https://www.the-afc.com/en/national/afc_asian_cup/news/ones_to_watch_nguyen_quang_hai_vietnam.html) |
| Nguyễn Phú Trọng | 14/04/1944 | [The Guardian](https://www.theguardian.com/world/2024/jul/30/nguyen-phu-trong-obituary) |
| Đoàn Văn Hậu | 19/04/1999 | [Danh sách đội tuyển AFC 2019 (PDF)](https://assets.the-afc.com/migration/2/0/20190116%20AC2019%20Final%20Squads.pdf) và [Transfermarkt](https://www.transfermarkt.co.uk/van-hau-doan/profil/spieler/484362) |

- Đối chiếu thêm bằng publisher thứ hai: Olympedia/TheSports cho Quốc Toàn (quốc gia nhà xuất bản TheSports chưa xác định; không dùng để chứng minh nguồn nước ngoài); thông cáo Tòa Thánh cho Joseph; Transfermarkt cho Quang Hải; Le Monde cho Nguyễn Phú Trọng; Transfermarkt cho Văn Hậu. Ngày sinh Nguyễn Phú Trọng được chấp nhận theo dòng tiểu sử đầy đủ trên Guardian; trang Le Monde trực tiếp được giữ làm nguồn báo chí thứ hai nhưng bản tải tự động không lộ ngày sinh, vì vậy không tính là nguồn DOB.
- Từ chối/điều chỉnh các ứng viên có rủi ro lịch hoặc xung đột ngày như Haydn, Gogol, Prokofiev, Zola, Verdi, Victoria Beckham, Julie Christie, Thomas Jefferson, Mary Pickford, David Ricardo và Michelle Pfeiffer. Sửa nhầm định danh: Q182658 là Harper Lee, không phải Terry Pratchett. Danh sách và lý do được ghi tại `nhap/B008-excluded.json`; lịch sử lựa chọn v1–v5 được giữ để đối chiếu.
- Discovery gồm 60 truy vấn Wikidata có giới hạn (hai biến thể/ngày, `LIMIT 100`); đây là mẫu sàng lọc, không phải khẳng định đã tìm hết mọi người sinh tháng 4.

## Kiểm tra ứng dụng

- `npm test`: Rules A–AC đạt, 0 vi phạm; xác nhận 90 hồ sơ B008 và 5 người Việt.
- TypeScript, lint, build, coverage và `git diff --check`: đạt. Lint còn 32 cảnh báo `<img>`/font trong giao diện có sẵn; vòng này không sửa UI.
- `verify:urls` quét 1.181 URL của snapshot trước lần thay nguồn cuối, ghi 16 lỗi và 0 mục Britannica chờ xác nhận. Đối chiếu với danh sách cuối cho thấy không URL lỗi nào còn được trích dẫn; trang Tổng thống Ireland trả 403 đã được thay bằng hồ sơ CIDOB. Toàn bộ 181 URL B008 cuối cùng được tải lại trực tiếp và đạt HTTP 200. Vòng B007 trước đó xác nhận 916/916 URL.
- Smoke trên bản build cuối đạt **14/14 route HTTP 200**: trang chủ, tra cứu/birthday và `/day` các ngày 1, 15, 16, 30/4; regression 16/1, 29/2, 31/3; share 19/4; hồ sơ `/person/doan-van-hau`. Deep equality xác nhận 295 hồ sơ baseline và 4 sự kiện không đổi; không có người sai ngày trên các route đã thử.

## Tệp và evidence

- Dữ liệu: `src/data/people/04.ts`; cổng: `scripts/test-integrity.ts`; thống kê: `README.md`.
- Báo cáo rà soát: `.ai/hop-thu-mybirthday/review/B008-people-apr-01-30-r1.md`.
- Evidence gọn có ranks/references và kết quả source capture: `nhap/B008-evidence.json`; danh sách loại: `nhap/B008-excluded.json`; manifest 60 truy vấn: `nhap/wd/B008-discovery-manifest.json`; URL audit: `nhap/B008-url-review.txt`.
- Raw payload Wikidata, HTML/PDF cache và scratch B005–B007 không được đưa vào commit.

## Reviewer Attention

Văn bản giao diện cũ nói “hàng chục nghìn nhân vật” vẫn chưa phù hợp quy mô 385 hồ sơ; nằm ngoài phạm vi mở rộng dữ liệu B008.

KET_QUA: DAT

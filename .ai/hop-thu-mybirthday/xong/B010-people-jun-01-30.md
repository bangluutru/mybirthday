# B010 — báo cáo mở rộng dữ liệu tháng 6

**Cycle:** BV-011
**Ngày:** 06/10/2026
**Trạng thái:** Đạt review r1; sẵn sàng phát hành lên `origin/main` theo chỉ thị trước của chủ dự án.

## Kết quả dữ liệu

- Thêm 90 hồ sơ mới, đúng 3 người cho từng ngày 1–30/6. Ngày 28 giữ nguyên hồ sơ nền Ngô Bảo Châu và có thêm đúng 3 người mới.
- Có 5 người Việt và 85 người quốc tế (5,56%). Tổng đạt 568 người; độ phủ đạt 184/366 ngày, trong đó tháng 6 là 30/30 ngày. Giữ nguyên 4 sự kiện lịch sử.
- Chỉ sửa `src/data/people/06.ts` và Rule AE trong `scripts/test-integrity.ts`; không đổi giao diện, ảnh, dữ liệu tháng khác, events hoặc dependencies.

## Kiểm tra nguồn và định danh

- 90/90 người có P31=human và một claim P569 Gregorian độ chính xác ngày (precision 11) khớp ngày sinh đã nhập. Không có claim P569 chính xác/chi tiết hơn đang hoạt động nào mâu thuẫn. Ba người có thêm claim năm sinh precision thấp hơn nhưng cùng năm, không xung đột.
- Đối chiếu trực tiếp 180 trang DOB ngoài Wikidata: 180/180 HTTP 200, đúng danh tính và hiện ngày/tháng/năm sinh đầy đủ; mỗi hồ sơ có hai publisher/host khác nhau. Không khẳng định hai publisher khác nhau đồng nghĩa nguồn dữ liệu gốc độc lập; một số trang thể thao có thể cùng dựa trên đăng ký/roster.
- Bộ ứng viên từ Wikidata dùng để khám phá và sàng lọc, không được diễn giải là danh sách đầy đủ mọi người sinh trong tháng.
- Loại Joseph Kabila vì chính tiểu sử tham chiếu ghi nhận nghi vấn về DOB công bố; thay bằng Bronisław Komorowski với hai hồ sơ bách khoa khớp ngày chính xác.
- Phan Văn Long có thêm [bài AFC về trận U-19 Việt Nam–Nhật Bản](https://www.the-afc.com/en/more/news/afc_u-19_championship_md2_vietnam_1-3_japan.html) để Rule P nhận diện nguồn tổ chức. Trang này chỉ chứng minh ngữ cảnh cầu thủ, không được tính là nguồn DOB. Quy chế AFC 2025 ghi trụ sở tại Kuala Lumpur, Malaysia; bằng chứng trong ledger dẫn đúng điều khoản và trang PDF. [AFC Statutes 2025](https://assets.the-afc.com/downloads/mission-and-statutes/AFC-Statutes-Edition-2025-%28ENG%29.pdf)

### Năm hồ sơ Việt Nam và nguồn DOB nước ngoài

| Hồ sơ | Nguồn DOB 1 | Nguồn DOB 2 |
|---|---|---|
| Phan Văn Long | [Transfermarkt (Đức)](https://www.transfermarkt.co.uk/van-long-phan/profil/spieler/573733) | [Soccerway / Stats Perform (Anh)](https://sg.soccerway.com/player/phan-van-long/M1z6otVh/) |
| Phạm Thị Thảo | [Olympic Council of Asia (Kuwait)](https://www.ocagames.com/HZ_Info/AG2022-/en/results/rowing/athlete-profile-n2009980-pham-thi-thao.htm) | [LA84 Foundation / London 2012 Official Report (Hoa Kỳ)](https://digital.la84.org/digital/api/collection/p17103coll8/id/82424/download) |
| Nguyễn Văn Lai | [World Athletics (Monaco)](https://worldathletics.org/athletes/vietnam/van-lai-nguyen-14379365) | [Olympic Council of Asia (Kuwait)](https://www.ocagames.com/OCA/cache/17ag/AT/par.AT.VIE.5106368.html) |
| Lê Văn Công | [Russian Paralympic Committee (Nga)](https://paralymp.ru/upload/iblock/f53/f44zloszr87knyxen4svyg7neyd8hh3a.pdf) | [Toyota Times Sports (Nhật Bản)](https://toyotatimes-sports.toyota/aichi-nagoya-2026/drivepassion/athletes/21043/?source=drivepassion_top) |
| Vương Thị Huyền | [Polish Weightlifting Federation (Ba Lan)](https://www.pzpc.pl/public/system/files/articles/5675/1660-StarListPackage_GT.pdf) | [Olympic Council of Asia (Kuwait)](https://www.ocagames.com/orb/books/Jakarta_2018/AG2018_OfficialResultBook_Weightlifting_v1.0.pdf) |

Quốc gia publisher được đối chiếu bằng trang pháp lý/liên hệ/trụ sở của chính tổ chức, không suy ra từ domain hoặc ngôn ngữ. URL và bằng chứng quốc gia nằm trong `review/B010-evidence.json`.

## Quy tắc chống hồi quy và kiểm tra

Rule AE khóa đúng 90 ID/QID/ngày, 3/ngày, đúng hai DOB URL đã duyệt cho mỗi hồ sơ cùng một URL ngữ cảnh phụ duyệt riêng nếu có, 5 người Việt với hai nguồn nước ngoài và coverage 184 ngày. Có kiểm tra âm cho sai QID, sai fragment/query/path, host giả và URL hỏng. So sánh canonical sâu giữ nguyên toàn bộ 478 hồ sơ nền và 4 events.

- `npm test`: đạt, 0 vi phạm; 568 hồ sơ.
- `npm run verify:wikidata`: 568 khớp, 0 sai khác, 0 thiếu P569.
- `npx tsc --noEmit`: đạt.
- `npm run lint`: đạt; còn cảnh báo `<img>` và font đã tồn tại ngoài phạm vi B010.
- `npm run build`: đạt; static/dynamic routes được biên dịch thành công, cùng các cảnh báo lint cũ.
- `npm run coverage`: 184/366 ngày (50,3%); tháng 6 đạt 30/30.
- Smoke production local: 9/9 route chính trả HTTP 200 và có nội dung kỳ vọng (trang chủ, ngày sinh 1/15/16/30 tháng 6, tra ngày, ngày sinh chính xác, hồ sơ Phan Văn Long, trang share).
- `git diff --check`: đạt.
- `npm run verify:urls`: kiểm 1.734 URL, báo 12 lỗi ban đầu và 0 Britannica manual pending. Hai trang Wikidata của Thomas Mann (Q37030) và Edward Snowden (Q13424289) timeout trong lượt quét nhưng đều trả HTTP 200 khi thử lại trực tiếp; các URL DOB/context B010 còn lại cũng đều HTTP 200. 10 lỗi còn lại thuộc dữ liệu cũ/ngoài scope; không sửa tháng khác và không tuyên bố URL toàn ứng dụng sạch.

## Bằng chứng và giới hạn

Ledger `review/B010-evidence.json` giữ 90 P31/P569, 180 URL DOB với publisher, HTTP/content type, final URL, thời điểm, SHA-256, ngày khớp và trích đoạn không quá 25 từ; có thêm AFC context-only và trang chứng minh trụ sở publisher. HTML/PDF phản hồi đầy đủ, truy vấn và các captures gốc vẫn ở `.ai/hop-thu-mybirthday/nhap/`, không đưa vào Git.

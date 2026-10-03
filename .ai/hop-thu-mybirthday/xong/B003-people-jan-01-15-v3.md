# B003 — Báo cáo (v3)

Cycle: BV-004 · Executor: Gemini 3.8 (Antigravity) · Reviewer: Claude Code
Phạm vi: bổ sung và kiểm chứng hồ sơ sinh từ 01/01 đến 15/01 theo việc B003 và review r2.
Thời điểm bàn giao: 2026-10-03 UTC.

## 1. Tóm tắt

- Bổ sung 44 hồ sơ mới cho 15 ngày đầu tháng 1; 9 người Việt Nam và 35 người nước ngoài. Tỷ lệ Việt Nam là 20,5%, trong ngưỡng Rule T 20–40%.
- Mỗi ngày trong phạm vi có ít nhất 3 hồ sơ; ngày 01/01 có 3, ngày 02–14/01 có 3/ngày, ngày 15/01 có 4.
- Tổng dữ liệu sau thay đổi: 74 người trên 26/366 ngày (7,1%); tháng 1 có 46 người trên 15/31 ngày; ngày 22/02 có 16 người; 4 sự kiện lịch sử.
- Đã bổ sung bằng chứng trích dẫn nguyên văn cho 44 hồ sơ mới và 3 hồ sơ cũ được chỉnh URL theo review r2. Bằng chứng có 47 dòng trong nhap/B003-evidence.json.
- Cổng kiểm tra nguồn toàn kho đã kiểm 257 URL nhưng thoát mã 1 vì 9 lỗi thuộc URL của hồ sơ cũ. Các URL dùng làm bằng chứng độc lập cho 44 hồ sơ mới đều qua kiểm tra. Các URL cũ còn lỗi được liệt kê ở Reviewer Attention.

## 2. Baseline

Trước khi thực hiện vòng này: 30 người, dữ liệu nhân vật xuất hiện trên 12/366 ngày. Hai hồ sơ đã có trong ngày 01/01; các ngày 02–15/01 chưa đủ ngưỡng tối thiểu 3 hồ sơ/ngày.

## 3. Kiểm tra mới trước khi thêm dữ liệu

Đã lưu đầu ra thật tại nhap/B003-test-fail.txt. Chạy npm test trước khi thêm dữ liệu báo 17 vi phạm: 15 vi phạm Rule S (01/01 có 2 người, các ngày 02–15 có 0 người) và 2 vi phạm Rule T (chưa có hồ sơ bổ sung để tính cân bằng, tỷ lệ Việt Nam là 0%). Quy tắc P/Q/R không có vi phạm ở baseline.

## 4. Bảng theo ngày

Ngưỡng truy vấn: ứng viên quốc tế có sitelinks ≥ 60; ứng viên Việt Nam có sitelinks ≥ 8. Số ứng viên là số kết quả thô của hai truy vấn riêng (quốc tế / Việt Nam), không phải số đã khử trùng lặp giữa hai truy vấn.

| Ngày | Ứng viên quốc tế / Việt Nam | Thêm mới | Tổng hồ sơ ngày | Ghi chú |
|---|---:|---:|---:|---|
| 01/01 | 17 / 6 | 1 | 3 | |
| 02/01 | 8 / 0 | 3 | 3 | |
| 03/01 | 12 / 2 | 3 | 3 | |
| 04/01 | 10 / 3 | 3 | 3 | |
| 05/01 | 7 / 0 | 3 | 3 | |
| 06/01 | 10 / 0 | 3 | 3 | |
| 07/01 | 15 / 0 | 3 | 3 | |
| 08/01 | 14 / 1 | 3 | 3 | |
| 09/01 | 7 / 1 | 3 | 3 | |
| 10/01 | 10 / 1 | 3 | 3 | Võ Thị Thắng bị loại do nguồn chính thống mâu thuẫn ngày sinh; xem mục 6. |
| 11/01 | 14 / 2 | 3 | 3 | |
| 12/01 | 12 / 0 | 3 | 3 | |
| 13/01 | 9 / 0 | 3 | 3 | |
| 14/01 | 8 / 1 | 3 | 3 | |
| 15/01 | 9 / 4 | 4 | 4 | |
| **Tổng** | — | **44** | **46 hồ sơ tháng 1** | **15/15 ngày đạt Rule S** |

Số liệu truy vấn gốc: nhap/B003-candidate-queries.log, nhap/B003-vietnamese-queries.log và 30 tệp JSON trong nhap/wd/.

## 5. Bảng 44 hồ sơ mới

Mỗi dòng có QID và ngày sinh đối chiếu Wikidata; nguồn liên kết là trang độc lập đã mở và có câu ngày sinh trong nhap/B003-evidence.json. Trường sitelinks lấy từ JSON ứng viên theo QID. Hồ sơ dữ liệu cũng chứa URL Wikidata và ít nhất một nguồn độc lập thứ hai ngoài nguồn trích dẫn ở bảng.

| Ngày | QID | Tên | Ngày sinh | Quốc tịch | Sitelinks | Nguồn độc lập có trích dẫn |
|---|---|---|---|---|---:|---|
| 01/01 | Q97159587 | Bùi Hoàng Việt Anh | 1999-01-01 | VN | 11 | [AFC](https://assets.the-afc.com/2023_AFC_Asian_Cup/Squad_Lists/AFC-Asian-Cup-Qatar%E2%84%A2-2023-Squad-Lists.pdf) |
| 02/01 | Q181715 | Thérèse of Lisieux | 1873-01-02 | FR | 88 | [Vatican](https://www.vatican.va/news_services/liturgy/documents/ns_lit_doc_19101997_stherese_en.html) |
| 02/01 | Q30693 | Rudolf Clausius | 1822-01-02 | DE | 80 | [Deutsche Biographie](https://www.deutsche-biographie.de/gnd116540486.html?language=en) |
| 02/01 | Q185040 | Mily Balakirev | 1837-01-02 | RU | 67 | [Polish Music Library](https://polskabibliotekamuzyczna.pl/encyklopedia/balakiriew-2/?lang=en) |
| 03/01 | Q892 | J. R. R. Tolkien | 1892-01-03 | GB | 205 | [Tolkien Estate](https://www.tolkienestate.com/es/vida/biography/) |
| 03/01 | Q9671 | Michael Schumacher | 1969-01-03 | DE | 171 | [Formula 1](https://www.formula1.com/en/information/drivers-hall-of-fame-michael-schumacher.7KdX5nJlTG55vR5JQSbZ21) |
| 03/01 | Q129006 | Clement Attlee | 1883-01-03 | GB | 107 | [GOV.UK](https://www.gov.uk/government/history/past-prime-ministers/clement-attlee) |
| 04/01 | Q93182 | Louis Braille | 1809-01-04 | FR | 89 | [Library of Congress](https://www.loc.gov/exhibits/louis-braille/overview.html) |
| 04/01 | Q926038 | Lê Tấn Tài | 1984-01-04 | VN | 11 | [Tuổi Trẻ](https://tuoitre.vn/le-tan-tai-tro-lai-san-co-20220207150434672.htm) |
| 04/01 | Q926022 | Nguyễn Huy Hoàng | 1981-01-04 | VN | 10 | [SLNA FC](https://www.slnafc.com/tin-tuc/danh-sach-hlv-vdv-u19-slna-tham-gia-vong-loai-giai-vo-dich-u19-quoc-gia-nam-2024-7826) |
| 05/01 | Q12807 | Umberto Eco | 1932-01-05 | IT | 151 | [University of Bologna](https://www.unibo.it/en/university/the-university-of-bologna-mourns-the-death-of-umberto-eco) |
| 05/01 | Q2492 | Konrad Adenauer | 1876-01-05 | DE | 147 | [Bundesarchiv](https://www.bundesarchiv.de/konrad-adenauer/) |
| 05/01 | Q76658 | Frank-Walter Steinmeier | 1956-01-05 | DE | 115 | [Bundestag](https://www.bundestag.de/webarchiv/abgeordnete/biografien18/S/steinmeier_frank_walter-258964) |
| 06/01 | Q47737 | Kahlil Gibran | 1883-01-06 | LB | 158 | [Poets.org](https://poets.org/poet/kahlil-gibran) |
| 06/01 | Q173061 | Syd Barrett | 1946-01-06 | GB | 74 | [Syd Barrett official site](https://www.sydbarrett.com/syds-life/) |
| 06/01 | Q57106 | Heinrich Schliemann | 1822-01-06 | DE | 74 | [Indiana University Archives](https://archives.iu.edu/html/InU-Li-VAD7007.html) |
| 07/01 | Q12306 | Millard Fillmore | 1800-01-07 | US | 141 | [U.S. House History](https://history.house.gov/People/Detail/13119) |
| 07/01 | Q9673 | Lewis Hamilton | 1985-01-07 | GB | 116 | [Formula 1](https://www.formula1.com/en/drivers/lewis-hamilton) |
| 07/01 | Q7726 | Joseph Bonaparte | 1768-01-07 | FR | 70 | [Napoleon.org](https://www.napoleon.org/en/history-of-the-two-empires/biographies/bonaparte-joseph) |
| 08/01 | Q303 | Elvis Presley | 1935-01-08 | US | 216 | [Graceland](https://www.graceland.com/elvis-faq) |
| 08/01 | Q17714 | Stephen Hawking | 1942-01-08 | GB | 201 | [University of Cambridge](https://www.cam.ac.uk/stories/stephen-hawking) |
| 08/01 | Q24957799 | Võ Thị Ánh Xuân | 1970-01-08 | VN | 29 | [National Assembly](https://quochoi.vn/UserControls/Publishing/News/BinhLuan/pFormPrint.aspx?ItemID=54121&UrlListProcess=%2Fcontent%2Ftintuc%2FLists%2FNews) |
| 09/01 | Q9588 | Richard Nixon | 1913-01-09 | US | 190 | [U.S. National Archives](https://www.archives.gov/presidential-libraries/events/centennials/nixon/biography.html) |
| 09/01 | Q7197 | Simone de Beauvoir | 1908-01-09 | FR | 187 | [BnF](https://catalogue.bnf.fr/ark:/12148/cb11890854p) |
| 09/01 | Q131725 | Joan Baez | 1941-01-09 | US | 103 | [John F. Kennedy Presidential Library](https://jfk.org/wp-content/uploads/TSFM_Summer-Fun_Women-of-the-1960s_09-20.pdf) |
| 10/01 | Q17457 | Donald Knuth | 1938-01-10 | US | 95 | [Stanford CV](https://cs.stanford.edu/~knuth/vita.pdf) |
| 10/01 | Q171034 | Robert Woodrow Wilson | 1936-01-10 | US | 82 | [Nobel Prize](https://www.nobelprize.org/laureate/112) |
| 10/01 | Q213919 | George Foreman | 1949-01-10 | US | 67 | [Handbook of Texas](https://www.tshaonline.org/handbook/entries/foreman-george-edward-big-george) |
| 11/01 | Q3442375 | Kailash Satyarthi | 1954-01-11 | IN | 81 | [Nobel Prize](https://www.nobelprize.org/prizes/peace/2014/satyarthi/biographical/) |
| 11/01 | Q242169 | Roger Guillemin | 1924-01-11 | FR | 60 | [AACR](https://www.aacr.org/professionals/membership/aacr-academy/fellows/roger-c-l-guillemin-md-phd/) |
| 11/01 | Q61613045 | Nguyễn Hoàng Đức | 1998-01-11 | VN | 12 | [Vietnam News Agency](https://nvsk.vnanet.vn/nguyen-hoang-duc-6804.vna) |
| 12/01 | Q45765 | Jack London | 1876-01-12 | US | 146 | [California State Parks](https://www.parks.ca.gov/pages/478/files/JackLondonBrochure2008.pdf) |
| 12/01 | Q47478 | Swami Vivekananda | 1863-01-12 | IN | 137 | [Ramakrishna Mission Singapore](https://www.ramakrishna.org.sg/AboutUs/SwamiVivekananda) |
| 12/01 | Q128460 | Charles Perrault | 1628-01-12 | FR | 108 | [BnF](https://catalogue.bnf.fr/ark:/12148/cb119192165.public) |
| 13/01 | Q57068 | Wilhelm Wien | 1864-01-13 | DE | 96 | [University of Würzburg](https://www.uni-wuerzburg.de/uniarchiv/persoenlichkeiten/gelehrtentafeln/wilhelm-wien/) |
| 13/01 | Q234463 | Sydney Brenner | 1927-01-13 | ZA | 71 | [Nobel Prize](https://www.nobelprize.org/prizes/medicine/2002/brenner/cv/) |
| 13/01 | Q212518 | Patrick Dempsey | 1966-01-13 | US | 62 | [Biography.com](https://www.biography.com/actors/patrick-dempsey) |
| 14/01 | Q49325 | Albert Schweitzer | 1875-01-14 | DE | 122 | [Nobel Prize](https://www.nobelprize.org/prizes/peace/1952/schweitzer/biographical/) |
| 14/01 | Q134456 | Yukio Mishima | 1925-01-14 | JP | 110 | [BnF](https://catalogue.bnf.fr/ark:/12148/cb119162858) |
| 14/01 | Q16233605 | Suboi | 1990-01-14 | VN | 8 | [VOH](https://voh.com.vn/tieu-su-sao/tieu-su-rapper-suboi-373884.html) |
| 15/01 | Q8027 | Martin Luther King Jr. | 1929-01-15 | US | 248 | [Nobel Prize](https://www.nobelprize.org/prizes/peace/1964/king/biographical/) |
| 15/01 | Q3302807 | Thạch Kim Tuấn | 1994-01-15 | VN | 16 | [Olympedia](https://www.olympedia.org/athletes/136482) |
| 15/01 | Q86013459 | Đỗ Thị Ánh Nguyệt | 2001-01-15 | VN | 11 | [World Archery](https://extranet.worldarchery.sport/documents/index.php/Events/World_Cup/2024/1_Shanghai/BOOK.pdf) |
| 15/01 | Q5951484 | Huỳnh Phú Sổ | 1920-01-15 | VN | 10 | [Vietnam Journal of Science and Technology](https://b.vjst.vn/index.php/ban_b/article/download/582/576/2257) |

## 6. Người bị loại

Võ Thị Thắng (Q10833281) không được thêm vào dữ liệu. Tư liệu của Đảng Cộng sản ghi ngày sinh 10-12-1945, trong khi Bảo tàng Lịch sử Quân sự Việt Nam ghi 10/1/1945. Vì hai nguồn chính thống bất đồng, không tự chọn một ngày:

- [Tư liệu Văn kiện Đảng](https://tulieuvankien.dangcongsan.vn/bo-chinh-tri-ban-bi-thu-ban-chap-hanh-trung-uong/ban-chap-hanh-trung-uong/khoa-ix/vo-thi-thang4.html?categoryId=104000034) ghi 10-12-1945.
- [Bảo tàng Lịch sử Quân sự Việt Nam](https://btlsqsvn.mod.gov.vn/tin-tuc/chi-tiet/nu-cuoi-chien-thang-vo-thi-thang-dau-an-bat-khuat-cua-mot-the-he-anh-dung-ea56617a-2ebf-4862-9654-e77eada59fb0) ghi 10/1/1945.

Các ứng viên khác không đạt đủ tiêu chí nguồn, định danh, độ chính xác hoặc nhất quán ngày sinh không được đưa vào 44 hồ sơ. Không dùng ứng viên loại làm dữ liệu ứng dụng.

## 7. Bằng chứng nguồn (R-A)

nhap/B003-evidence.json có 47 bản ghi: 44 hồ sơ mới trong bảng trên và 3 hồ sơ cũ được review r2 cho phép sửa URL/bằng chứng. Mỗi bản ghi có QID, tên, URL đã mở, câu trích nguyên văn chứa ngày sinh và fetchedAt. Kiểm tra tự động xác nhận URL bằng chứng của 44 hồ sơ mới nằm trong sourceUrls hoặc wikipediaUrl của hồ sơ tương ứng.

Ba hồ sơ cũ có cập nhật hẹp theo review:
- Julius Erving: sửa URL Wikipedia lỗi; ghi bằng chứng từ Naismith Basketball Hall of Fame.
- Rajon Rondo: sửa URL Wikipedia lỗi; giữ nguồn ngày sinh Basketball-Reference, nhưng máy chủ trả HTTP 403 trong lần kiểm toàn kho nên cần reviewer kiểm tra thủ công.
- Lea Salonga: sửa URL Wikipedia và loại URL IBDB lỗi khỏi sourceUrls; giữ D23 làm nguồn độc lập.

## 8. verify:wikidata

Lệnh npm run verify:wikidata đã chạy cho toàn bộ 74 hồ sơ:

BIRTHDAYVERSE — WIKIDATA VERIFICATION AUDIT (74 people)
SUMMARY: 74 MATCHED | 0 MISMATCHED | 0 NO P569 DATA
ALL AUDITED PEOPLE PERFECTLY MATCH WIKIDATA GREGORIAN BIRTH DATES.
Exit code: 0

## 9. Kết quả cổng và coverage

- npm test: PASS; Rules 0, A–T không có vi phạm. Tổng 74 người; 16 hồ sơ 22/02; 4 sự kiện lịch sử ngày 22/02. Rule S đạt 15/15 ngày; Rule T đạt 44 bổ sung, gồm 9 VN + 35 quốc tế = 20,5%.
- npm run lint: PASS, exit 0; chỉ còn các cảnh báo sẵn có của Next về thẻ img và Google Fonts, không có lỗi.
- npx tsc --noEmit: PASS, exit 0, không có lỗi TypeScript.
- npm run build: PASS, exit 0; build production và tạo các route tĩnh thành công.
- npm run coverage: 26/366 ngày có người (7,1%); tháng 1 là 15/31 ngày, 46 người; tổng 74 người; 4 sự kiện.
- npm run verify:urls: CHƯA ĐẠT, exit 1. Kiểm tra 257 URL; 9 lỗi thuộc hồ sơ cũ, chi tiết ở mục 11. Không ghi nhận lỗi URL cho 44 nguồn bằng chứng độc lập của hồ sơ mới.

## 10. Smoke HTTP

Chạy ứng dụng từ production build. Tám đường dẫn đều trả HTTP 200:

- /
- /birthday/1/2
- /birthday/1/2/people
- /birthday/1/15/people
- /day/1/2
- /birthday/2/22
- /person/rudolf-clausius
- /share/2-1

Trang /birthday/1/2/people có hồ sơ mới thuộc ngày 02/01, không chứa hồ sơ từ ngày khác, ảnh placeholder tải được. public/people/placeholder.svg là XML hợp lệ.

## 11. Tự review theo Rules P–T và yêu cầu R1–R5

- Rule P: hồ sơ mới có QID định dạng chuẩn, URL Wikidata khớp QID và ít nhất một nguồn ngoài Wikimedia; các hồ sơ mới có ít nhất hai host độc lập ngoài Wikidata.
- Rule Q: không có domain nguồn bị cấm.
- Rule R: hồ sơ mới có slug/id, cờ quốc gia/region nhất quán, mô tả và tiểu sử không rỗng, 2–3 highlights; cụm từ cấm không xuất hiện.
- Rule S: 15/15 ngày đạt tối thiểu 3 người, không thêm ngoại lệ.
- Rule T: 9/44 người Việt Nam, 35/44 người nước ngoài; 20,5%, nằm trong 20–40%.
- R1: lưu kết quả truy vấn theo ngày, chạy kiểm tra Wikidata toàn bộ 74 QID; 74/74 khớp.
- R2: placeholder trung tính; đã kiểm tra XML và HTML trang sử dụng.
- R3: giữ Rules A–O, thêm kiểm tra P/Q/R/S/T; lưu đầu ra pre-data fail 17 lỗi và sau thay đổi pass.
- R4: thêm hồ sơ vào dữ liệu tháng 1; chỉ sửa ba URL hồ sơ cũ mà review r2 nêu cụ thể. Không đổi sự kiện hay UI.
- R5: README phản ánh số lượng hiện tại, độ phủ và quy trình bổ sung theo Wikidata + nguồn chính thống.

## 12. Reviewer Attention

Máy kiểm URL toàn kho hiện báo 9 URL cũ. Các URL này không thuộc 44 hồ sơ mới; ngoài các sửa URL cũ được review r2 cho phép, dữ liệu ngoài phạm vi không bị sửa. Vui lòng quyết định sửa nguồn, thay thế nguồn hoặc xác nhận trường hợp chặn truy cập thủ công ở chu kỳ thích hợp:

1. Washington: https://www.loc.gov/item/today-in-history/february-22 — HTTP 403.
2. James Blunt: https://www.allmusic.com/artist/james-blunt-mn0000778408#biography — HTTP 403.
3. Robert Baden-Powell: https://www.scout.org/who-we-are/our-history/founder — HTTP 404.
4. Renato Dulbecco: https://www.nobelprize.org/prizes/medicine/1975/dulbecco/biographical/ — bộ kiểm tra không tìm được ngày sinh 22/02/1914 trong nội dung trả về; cần đối chiếu thủ công.
5. Julius Erving: https://www.nba.com/history/legends/profiles/julius-erving — HTTP 403.
6. Rajon Rondo: https://www.nba.com/stats/player/200765 — HTTP 403.
7. Rajon Rondo: https://www.basketball-reference.com/players/r/rondora01.html — HTTP 403.
8. Michael Chang: https://www.atptour.com/en/players/michael-chang/c274/overview — HTTP 403.
9. Lleyton Hewitt: https://www.atptour.com/en/players/lleyton-hewitt/h432/overview — HTTP 403.

Đây là các lỗi kiểm tra URL toàn kho; chưa có kết luận rằng mọi URL 403/404 là dữ kiện sinh nhật sai. Cổng verify:urls vẫn chưa pass và cần reviewer quyết định hướng xử lý.

## 13. FILES

src/data/people/01.ts
src/data/people/02.ts
scripts/test-integrity.ts
scripts/check-source-urls.ts
package.json
README.md
.ai/hop-thu-mybirthday/nhap/B003-evidence.json
.ai/hop-thu-mybirthday/nhap/B003-test-fail.txt
.ai/hop-thu-mybirthday/nhap/B003-candidate-queries.log
.ai/hop-thu-mybirthday/nhap/B003-vietnamese-queries.log
.ai/hop-thu-mybirthday/nhap/wd/01-01.json through .ai/hop-thu-mybirthday/nhap/wd/01-15.json
.ai/hop-thu-mybirthday/nhap/wd/vn-01-01.json through .ai/hop-thu-mybirthday/nhap/wd/vn-01-15.json
.ai/hop-thu-mybirthday/xong/B003-people-jan-01-15-v3.md
.ai/hop-thu-mybirthday/nhat-ky.md
.ai/hop-thu-mybirthday/gemini.lock

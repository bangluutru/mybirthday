# B004-v2 — sửa theo review r1

Chu kỳ BV-005 · Codex thực hiện theo yêu cầu trực tiếp của chủ dự án · 2026-10-04

## Phạm vi và kết quả

- Giữ nguyên 49 hồ sơ B004 (10 Việt Nam, 39 quốc tế), ngày sinh và QID. Chỉ thay hai URL đối chiếu, sửa evidence và cơ chế kiểm nguồn; không thêm người, sự kiện, UI hay tháng khác.
- Toàn bộ bổ sung tháng 1: 93 người, 19 Việt Nam và 74 quốc tế (20,4%). Tháng 1: 95 người, đủ 31/31 ngày. Toàn dự án: 123 người trên 42/366 ngày (11,5%).

## Đã sửa đủ review r1

1. Trương Tấn Sang: bỏ URL VNA mở nhầm Mai Thúc Lân; thay bằng The Japan Times, số ngày 17/3/2014, trang 6, mục Brief profile of President Sang. Ngày 21/1/1949 khớp báo Myanmar và Wikidata. Cả hai nhà xuất bản ở ngoài Việt Nam.
2. Rà 98 nguồn của 49 hồ sơ: thay lời diễn giải bằng đoạn trích gốc ngắn; ghi `quoteType`, `supports`, giới hạn và ngữ cảnh. Michelle Obama, Cary Grant, Pollock, Akasaki không còn khẳng định nguồn phụ ghi đủ ngày sinh. Nguồn chính của cả 49 hồ sơ xác nhận đủ ngày; 42 nguồn phụ xác nhận đủ ngày, 6 nguồn phụ chỉ danh tính/năm sinh và một nguồn dùng mốc 100 tuổi (Salam) được đánh dấu suy luận.
3. Chung Thị Thanh Lan: sửa publisher thành OlyMADMen, quốc gia thành nhóm nghiên cứu quốc tế ngoài Việt Nam; dẫn trang About, lời giới thiệu của nhóm biên soạn và newsletter Olympic Studies Centre. Không gọi Olympedia là cơ sở dữ liệu chính thức IOC. Nguồn phụ đổi sang báo cáo gốc Moscow 1980 của ban tổ chức, số hóa bởi LA84; chỉ xác nhận danh tính/đoàn Việt Nam, không nhận là nguồn ngày sinh. Báo cáo năm 1981 độc lập về xuất bản với database sử gia hiện đại.
4. Rule U: bỏ quyền chấp nhận mọi URL trên WordPress/Sakura/Olympedia; chỉ duyệt URL tài liệu/bản ghi cụ thể gắn với đúng QID. Hai PDF báo Myanmar có nhà xuất bản và SHA-256 trong evidence. Rule P dùng cùng tài liệu đã duyệt để nhận diện nguồn thể chế sau host lưu bản sao. Kiểm tra dương/âm: tài liệu đúng đạt; khác người, trang bất kỳ, biến thể query string, host giả và URL hỏng đều bị từ chối.
5. README sửa mô tả Rules A–U. Ghi ngưỡng truy vấn thực tế qua lần lấy lại có nhật ký tham số; không suy đoán tham số lần nộp v1.

## Bằng chứng

- [Evidence hiện hành — 49 QID, ngày sinh, URL, trích đoạn, nhà xuất bản/quốc gia](../nhap/B004-evidence.json).
- [Rà nội dung 98 nguồn](../nhap/B004-source-review.json): 95 khớp văn bản đã mở sau chuẩn hóa khoảng trắng/PDF theo cột; 3 nguồn đã đọc lại trong trình duyệt (McMaster, Guggenheim, Léonore); 0 chưa giải quyết.
- Kiểm liên kết độc lập: 49/49 QID/ngày sinh/URL khớp hồ sơ; 49/49 có trong tập ứng viên lấy lại. Trích đoạn tiếng gốc, không dùng bản dịch diễn giải làm quote.
- Báo cáo v1 là lịch sử trước sửa; các lời ghi nguồn bị review r1 chỉ ra đã được thay thế trong evidence và báo cáo v2 này.

## Truy vấn ứng viên thực tế của v2

Lần v1 không lưu tham số truy vấn đầy đủ; không xác nhận ngưỡng lịch sử từ mặc định. Trong v2 đã lấy lại tuần tự đủ 16 ngày, với mốc trưởng thành `--as-of 2026-10-04`: truy vấn chung `--day 1 D 60`; truy vấn Việt Nam `--vn --day 1 D 0`. Giữ kiểm lịch Gregorian/precision-day/người trưởng thành trong script. Có chạy thử ngưỡng Việt Nam 8, nhưng ngưỡng này bỏ sót ứng viên đã kiểm chứng nên bộ cuối dùng 0. Tất cả 48 lần chạy, ngưỡng, thời gian và số kết quả được ghi ở [nhật ký truy vấn](../nhap/B004-query-rerun.json). Ngưỡng 0 chỉ mở rộng danh sách để rà; không miễn cổng nguồn hay điều kiện chấp nhận.

| Ngày | Ứng viên chung (≥60) | Việt Nam (≥0) | Thêm | VN | Quốc tế |
|---|---:|---:|---:|---:|---:|
| 16/1 | 11 | 8 | 3 | 0 | 3 |
| 17/1 | 11 | 4 | 4 | 1 | 3 |
| 18/1 | 14 | 10 | 3 | 1 | 2 |
| 19/1 | 13 | 12 | 3 | 1 | 2 |
| 20/1 | 12 | 17 | 3 | 1 | 2 |
| 21/1 | 11 | 12 | 3 | 2 | 1 |
| 22/1 | 5 | 6 | 3 | 1 | 2 |
| 23/1 | 7 | 6 | 3 | 0 | 3 |
| 24/1 | 7 | 13 | 3 | 0 | 3 |
| 25/1 | 14 | 10 | 3 | 1 | 2 |
| 26/1 | 13 | 9 | 3 | 0 | 3 |
| 27/1 | 10 | 11 | 3 | 0 | 3 |
| 28/1 | 11 | 14 | 3 | 1 | 2 |
| 29/1 | 11 | 3 | 3 | 0 | 3 |
| 30/1 | 17 | 8 | 3 | 0 | 3 |
| 31/1 | 16 | 4 | 3 | 1 | 2 |

Tổng dòng kết quả: 183 chung, 147 Việt Nam. JSON ứng viên thô ở `nhap/wd/` phục vụ tái kiểm, không đưa vào Git. Các ứng viên chưa chọn chưa được thẩm định đủ nguồn trong chu kỳ này; không khẳng định ngày sinh của họ sai.

## QID và ngày sinh được giữ

- Q212531 — Kate Moss — 1974-01-16
- Q152824 — Susan Sontag — 1933-01-16
- Q234224 — Dian Fossey — 1932-01-16
- Q34969 — Benjamin Franklin — 1706-01-17
- Q36107 — Muhammad Ali — 1942-01-17
- Q13133 — Michelle Obama — 1964-01-17
- Q28810222 — Chung Thị Thanh Lan — 1962-01-17
- Q4120045 — Nguyễn Sinh Hùng — 1946-01-18
- Q164038 — Josep Guardiola — 1971-01-18
- Q83410 — Cary Grant — 1904-01-18
- Q104434346 — Hanbin — 1998-01-19
- Q16867 — Edgar Allan Poe — 1809-01-19
- Q1514 — Janis Joplin — 1943-01-19
- Q22162740 — Phạm Đức Huy — 1995-01-20
- Q2252 — Buzz Aldrin — 1930-01-20
- Q7371 — Federico Fellini — 1920-01-20
- Q57407 — Trương Tấn Sang — 1949-01-21
- Q18045362 — Nguyễn Công Phượng — 1995-01-21
- Q159694 — Christian Dior — 1905-01-21
- Q1678059 — Giacôbê Nguyễn Văn Mầu — 1914-01-22
- Q5679 — Lord Byron — 1788-01-22
- Q7724 — August Strindberg — 1849-01-22
- Q41585 — David Hilbert — 1862-01-23
- Q502 — Stendhal — 1783-01-23
- Q40599 — Édouard Manet — 1832-01-23
- Q21001 — Moon Jae-in — 1953-01-24
- Q33550 — Friedrich II của Phổ — 1712-01-24
- Q26517 — Luis Alberto Suárez — 1987-01-24
- Q15791820 — Anphongsô Nguyễn Hữu Long — 1953-01-25
- Q81960 — Robert Burns — 1759-01-25
- Q40909 — Virginia Woolf — 1882-01-25
- Q127417 — Douglas MacArthur — 1880-01-26
- Q160456 — Angela Davis — 1944-01-26
- Q209518 — Wayne Gretzky — 1961-01-26
- Q254 — Wolfgang Amadeus Mozart — 1756-01-27
- Q38082 — Lewis Carroll — 1832-01-27
- Q2677 — Wilhelm II, Hoàng đế Đức — 1859-01-27
- Q1984355 — Nguyễn Thị Mai Hưng — 1994-01-28
- Q37571 — Jackson Pollock — 1912-01-28
- Q218679 — Colette — 1873-01-28
- Q5685 — Anton Pavlovich Chekhov — 1860-01-29
- Q47162 — Romain Rolland — 1866-01-29
- Q28189 — Abdus Salam — 1926-01-29
- Q8007 — Franklin D. Roosevelt — 1882-01-30
- Q53713 — Olof Palme — 1927-01-30
- Q1673706 — Akasaki Isamu — 1929-01-30
- Q7312 — Franz Schubert — 1797-01-31
- Q29574 — Beatrix của Hà Lan — 1938-01-31
- Q22907663 — Paul Nguyễn Công Anh — 1919-01-31

## Các ứng viên chưa chấp nhận trong lần lấy lại

Lý do chung: chưa có bộ bằng chứng nguồn được thẩm định trong B004; không bổ sung ngoài 49 hồ sơ đã giao. Danh sách theo QID dưới đây giữ việc loại/chưa chọn minh bạch.
- 16/1: Q10770658, Q10800034, Q10800744, Q10802076, Q10829290, Q11270, Q11617, Q135107983, Q167240, Q194187, Q1993589, Q2551, Q26262599, Q296244, Q56605830, Q776878
- 17/1: Q121238506, Q134982, Q170800, Q222818, Q373895, Q40504, Q44520, Q45589477, Q49484, Q7180372, Q80048
- 18/1: Q10769092, Q10828151, Q117354822, Q11930, Q124054744, Q137844207, Q15975, Q1728820, Q173767, Q184226, Q188120, Q207036, Q20895236, Q26372, Q44158, Q5295739, Q65428995, Q7022935, Q7351526, Q77178, Q78869
- 19/1: Q10510, Q107441, Q10809981, Q10833675, Q116796525, Q12348981, Q1259, Q12718, Q130635717, Q16012110, Q16156825, Q165557, Q179995, Q180453, Q27899223, Q295431, Q35548, Q5398534, Q7173106, Q7833316, Q9041, Q97845869
- 20/1: Q103052129, Q10768893, Q10793925, Q10806918, Q11668, Q116729648, Q116800224, Q134194717, Q137101695, Q159552, Q16480446, Q180455, Q191027, Q20127376, Q201853, Q2071, Q26921035, Q2904131, Q36234, Q45450689, Q53747, Q63119556, Q6507064, Q66499293, Q675, Q983685
- 21/1: Q109422753, Q109431360, Q114834007, Q115277202, Q119352635, Q130853, Q137804819, Q16148978, Q162005, Q196219, Q216124, Q24958645, Q273256, Q280098, Q33084253, Q461156, Q52924, Q59781815, Q6704601
- 22/1: Q10772417, Q125699408, Q141619315, Q29311937, Q34628, Q8003, Q83003, Q95628693
- 23/1: Q10746114, Q10799232, Q10829453, Q10833798, Q10841526, Q132701, Q26921027, Q76179, Q8003, Q83003
- 24/1: Q10748204, Q10810229, Q10840144, Q121507, Q122310301, Q136709291, Q150471, Q2538, Q27899228, Q30920457, Q30921861, Q32319730, Q5278301, Q56752552, Q6686847, Q70326, Q7268856
- 25/1: Q10779889, Q10787909, Q1156162, Q119665155, Q120434174, Q121507, Q134942, Q1480, Q151929, Q162043, Q17500, Q35109, Q3874799, Q43393, Q512, Q5227086, Q56061106, Q80222, Q86012031, Q98398638
- 26/1: Q10769949, Q126895972, Q133540637, Q135447646, Q135933435, Q166234, Q16919336, Q184571, Q190302, Q191095, Q19661252, Q41871, Q46052, Q483325, Q52927, Q65172363, Q7022896, Q79983, Q80504
- 27/1: Q117561567, Q124693351, Q124707241, Q125897589, Q127286041, Q127348343, Q133318, Q135379796, Q137758863, Q157655, Q16193885, Q211785, Q230004, Q348497, Q60070, Q61132906, Q86006739, Q867406
- 28/1: Q103285, Q10807043, Q110010954, Q110490353, Q116847509, Q117449531, Q127416661, Q135661343, Q136750673, Q155961, Q16158905, Q164765, Q170419, Q171421, Q179695, Q18019958, Q329, Q4120043, Q483771, Q68060, Q7023079, Q85866708
- 29/1: Q103591, Q1155829, Q123953926, Q138148908, Q152378, Q185832, Q200136, Q254032, Q35041, Q463945, Q55800
- 30/1: Q116205526, Q122841354, Q130619388, Q140697742, Q144622, Q150943, Q15436584, Q154782, Q173028, Q177310, Q18921613, Q191045, Q27087846, Q30920002, Q347879, Q45772, Q48259, Q487459, Q57464, Q57558, Q7088045, Q92614
- 31/1: Q107656, Q135661251, Q140463700, Q152437, Q180962, Q184286, Q188671, Q189465, Q189729, Q229625, Q232104, Q2594, Q43432, Q44286, Q59381180, Q80095, Q86012872

## Nghiệm thu cuối (đầu ra thực tế)

- `npm test`: PASS, Rule A–U và kiểm tra âm mới, 0 vi phạm.
- `npm run verify:wikidata`: 123 MATCHED, 0 MISMATCHED, 0 NO P569.
- `npm run verify:urls`: 403 URL, 0 lỗi, 0 Britannica MANUAL pending.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run coverage`: PASS. Lint còn cảnh báo ảnh/phông chữ có sẵn.
- Smoke sau build: 8/8 route HTTP 200; ngày 16/1 có Kate Moss, không chứa Benjamin Franklin.

  - `/`: 200
  - `/birthday/1/16`: 200
  - `/birthday/1/16/people`: 200
  - `/birthday/1/31/people`: 200
  - `/day/1/31`: 200
  - `/birthday/2/22`: 200
  - `/person/kate-moss`: 200
  - `/share/1-16`: 200

## FILES (tích hợp B003 đã DAT và B004 sau review)

Dữ liệu nền B003 và các sửa URL/kiểm tra đi kèm đã được chấp nhận ở B003-v5; chúng còn ở working tree, nên bản tích hợp tháng 1 cần các tệp phụ thuộc sau. Ngoại lệ cần thiết cho cổng cuối: thay một URL đối chiếu của Thérèse trong B003 sau ba lần timeout; ngày sinh/QID/nguồn Vatican giữ nguyên, bằng chứng bổ sung ở B003-evidence.json.

src/data/people/01.ts
src/data/people/02.ts
scripts/test-integrity.ts
scripts/check-source-urls.ts
scripts/verify-wikidata.ts
scripts/wikidata-candidates.ts
package.json
README.md
.ai/REVIEW.md
.ai/STATUS.md
.ai/hop-thu-mybirthday/nhat-ky.md
.ai/hop-thu-mybirthday/viec/B004-people-jan-16-31.md
.ai/hop-thu-mybirthday/review/B003-people-jan-01-15-r4.md
.ai/hop-thu-mybirthday/review/B004-people-jan-16-31-r1.md
.ai/hop-thu-mybirthday/review/B004-people-jan-16-31-r2.md
.ai/hop-thu-mybirthday/xong/B003-people-jan-01-15-v5.md
.ai/hop-thu-mybirthday/xong/B004-people-jan-16-31.md
.ai/hop-thu-mybirthday/xong/B004-people-jan-16-31-v2.md
.ai/hop-thu-mybirthday/nhap/B003-evidence.json
.ai/hop-thu-mybirthday/nhap/B004-evidence.json
.ai/hop-thu-mybirthday/nhap/B004-source-review.json
.ai/hop-thu-mybirthday/nhap/B004-query-rerun.json
.ai/hop-thu-mybirthday/nhap/B003-test-fail.txt
.ai/hop-thu-mybirthday/nhap/B004-test-fail.txt
.ai/hop-thu-mybirthday/nhap/B004-url-audit.txt

## Reviewer Attention

- Lần verify:urls đầu có 1 timeout Carmélites; lần kiểm lại và mở trực tiếp cũng timeout. Đã thay riêng nguồn phụ Thérèse bằng Press-kit.pdf của Sanctuaire de Lisieux, xác nhận nguyên văn 2/1/1873; chạy lại toàn bộ cổng trên bản sửa cuối.
- Độ phủ toàn năm vẫn 42/366; B004 chỉ hoàn tất tháng 1, không tự mở chu kỳ tiếp theo.
- URL HTTP 200 và test cấu trúc không tự chứng minh sự thật. Nguồn chỉ đối chiếu danh tính/năm sinh đã ghi đúng giới hạn.
- Các cảnh báo lint cũ, ảnh minh họa và phần chiêm tinh vẫn thuộc các mục tồn tại trước, ngoài B004.

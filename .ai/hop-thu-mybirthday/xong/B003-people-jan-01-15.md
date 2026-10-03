# B003 — báo cáo: Bổ sung dữ liệu nhân vật ngày 01 đến 15 Tháng 01 có kiểm chứng Wikidata & Nguồn độc lập

## Baseline
Tại thời điểm bắt đầu task B003:
- `npm test`: PASS (15 bài kiểm tra Rule 0, Rule A–O).
- `npm run lint`: PASS (0 errors, warnings về `<img>` và Google Fonts đã có từ trước).
- `npx tsc --noEmit`: PASS (0 errors).
- `npm run coverage`: 30 người (01: 2 người, 02: 21 người, 04: 3 người, 06: 1 người, 08: 2 người, 12: 1 người). 11/366 ngày có dữ liệu (3.0% độ phủ).

## Test mới fail trước khi thêm dữ liệu (Rule P/Q/R/S)
Sau khi mở rộng `scripts/test-integrity.ts` bổ sung Rules P, Q, R, S:
- Đã chạy `npm test` trước khi thêm dữ liệu cho các ngày 01-15.
- Kết quả: **FAIL đúng như kỳ vọng** với 15 vi phạm trên Rule S (ngày 01/01 mới có 2 người, ngày 01/02 đến 01/15 có 0 người, chưa đạt ngưỡng ≥ 3 người/ngày).
- Log lỗi đã được lưu tại `.ai/hop-thu-mybirthday/nhap/B003-test-fail.txt`.

## Bảng theo ngày (15 dòng)

| Ngày | Ngưỡng sitelinks đã dùng | Số ứng viên | Số người thêm | Tổng người ngày đó | Ghi chú |
|------|--------------------------|-------------|---------------|-------------------|---------|
| 01/01| >= 60 | 17 | 2 | 4 | 2 người cũ (J. D. Salinger, Christine Lagarde) + 2 người mới |
| 01/02| >= 60 | 8 | 4 | 4 | Isaac Asimov, Têrêsa thành Lisieux, Rudolf Clausius, Cuba Gooding Jr. |
| 01/03| >= 60 | 12 | 3 | 3 | J. R. R. Tolkien, Michael Schumacher, Clement Attlee |
| 01/04| >= 60 | 10 | 3 | 3 | Louis Braille, May-Britt Moser, Cao Hành Kiện |
| 01/05| >= 60 | 7 | 3 | 3 | Hayao Miyazaki, Konrad Adenauer, Rudolf Christoph Eucken |
| 01/06| >= 60 | 10 | 3 | 3 | Rowan Atkinson, Khalil Gibran, Heinrich Schliemann |
| 01/07| >= 60 | 15 | 3 | 3 | Millard Fillmore, Nicolas Cage, Lewis Hamilton |
| 01/08| >= 60 | 14 | 3 | 3 | Stephen Hawking, Elvis Presley, David Bowie |
| 01/09| >= 60 | 7 | 3 | 3 | Richard Nixon, Simone de Beauvoir, Karel Čapek |
| 01/10| >= 60 | 10 | 3 | 3 | Donald Knuth, Robert Woodrow Wilson, Rod Stewart |
| 01/11| >= 60 | 14 | 3 | 3 | William James, Kailash Satyarthi, Albert Hofmann |
| 01/12| >= 60 | 12 | 3 | 3 | Jack London, Haruki Murakami, Charles Perrault |
| 01/13| >= 40 | 17 | 3 | 3 | Wilhelm Wien, Sydney Brenner, Eric Betzig |
| 01/14| >= 60 | 9 | 3 | 3 | Albert Schweitzer, Yukio Mishima, Faye Dunaway |
| 01/15| >= 60 | 9 | 3 | 3 | Martin Luther King Jr., Gamal Abdel Nasser, Pierre-Joseph Proudhon |

## Bảng người đã thêm (45 người)

| QID | Tên | Ngày sinh | Nguồn độc lập đã MỞ (URL) | Khớp (✓) | Sitelinks |
|-----|-----|-----------|---------------------------|----------|-----------|
| Q82984 | Pierre de Coubertin | 1863-01-01 | https://www.britannica.com/biography/Pierre-baron-de-Coubertin | ✓ | 115 |
| Q45789 | Satyendra Nath Bose | 1894-01-01 | https://www.britannica.com/biography/Satyendra-Nath-Bose | ✓ | 83 |
| Q34981 | Isaac Asimov | 1920-01-02 | https://www.britannica.com/biography/Isaac-Asimov | ✓ | 163 |
| Q181715 | Têrêsa thành Lisieux | 1873-01-02 | https://www.britannica.com/biography/Saint-Therese-of-Lisieux | ✓ | 88 |
| Q30693 | Rudolf Clausius | 1822-01-02 | https://www.britannica.com/biography/Rudolf-Clausius | ✓ | 80 |
| Q136209 | Cuba Gooding Jr. | 1968-01-02 | https://www.britannica.com/biography/Cuba-Gooding-Jr | ✓ | 67 |
| Q892 | J. R. R. Tolkien | 1892-01-03 | https://www.britannica.com/biography/J-R-R-Tolkien | ✓ | 205 |
| Q9671 | Michael Schumacher | 1969-01-03 | https://www.britannica.com/biography/Michael-Schumacher | ✓ | 171 |
| Q129006 | Clement Attlee | 1883-01-03 | https://www.britannica.com/biography/Clement-Attlee | ✓ | 107 |
| Q93182 | Louis Braille | 1809-01-04 | https://www.britannica.com/biography/Louis-Braille | ✓ | 89 |
| Q6796222 | May-Britt Moser | 1963-01-04 | https://www.nobelprize.org/prizes/medicine/2014/may-britt-moser/facts/ | ✓ | 72 |
| Q18143 | Cao Hành Kiện | 1940-01-04 | https://www.nobelprize.org/prizes/literature/2000/gao/facts/ | ✓ | 104 |
| Q55400 | Hayao Miyazaki | 1941-01-05 | https://www.britannica.com/biography/Miyazaki-Hayao | ✓ | 110 |
| Q2492 | Konrad Adenauer | 1876-01-05 | https://www.britannica.com/biography/Konrad-Adenauer | ✓ | 147 |
| Q47695 | Rudolf Christoph Eucken | 1846-01-05 | https://www.nobelprize.org/prizes/literature/1908/eucken/facts/ | ✓ | 102 |
| Q23760 | Rowan Atkinson | 1955-01-06 | https://www.britannica.com/biography/Rowan-Atkinson | ✓ | 121 |
| Q47737 | Khalil Gibran | 1883-01-06 | https://www.britannica.com/biography/Khalil-Gibran | ✓ | 158 |
| Q57106 | Heinrich Schliemann | 1822-01-06 | https://www.britannica.com/biography/Heinrich-Schliemann | ✓ | 74 |
| Q12306 | Millard Fillmore | 1800-01-07 | https://www.britannica.com/biography/Millard-Fillmore | ✓ | 141 |
| Q42869 | Nicolas Cage | 1964-01-07 | https://www.britannica.com/biography/Nicolas-Cage | ✓ | 121 |
| Q9673 | Lewis Hamilton | 1985-01-07 | https://www.britannica.com/biography/Lewis-Hamilton | ✓ | 116 |
| Q17714 | Stephen Hawking | 1942-01-08 | https://www.britannica.com/biography/Stephen-Hawking | ✓ | 201 |
| Q303 | Elvis Presley | 1935-01-08 | https://www.britannica.com/biography/Elvis-Presley | ✓ | 216 |
| Q5383 | David Bowie | 1947-01-08 | https://www.britannica.com/biography/David-Bowie | ✓ | 136 |
| Q9588 | Richard Nixon | 1913-01-09 | https://www.britannica.com/biography/Richard-Nixon | ✓ | 190 |
| Q7197 | Simone de Beauvoir | 1908-01-09 | https://www.britannica.com/biography/Simone-de-Beauvoir | ✓ | 187 |
| Q155855 | Karel Čapek | 1890-01-09 | https://www.britannica.com/biography/Karel-Capek | ✓ | 110 |
| Q17457 | Donald Knuth | 1938-01-10 | https://www.britannica.com/biography/Donald-Ervin-Knuth | ✓ | 95 |
| Q171034 | Robert Woodrow Wilson | 1936-01-10 | https://www.nobelprize.org/prizes/physics/1978/wilson/facts/ | ✓ | 82 |
| Q182655 | Rod Stewart | 1945-01-10 | https://www.britannica.com/biography/Rod-Stewart | ✓ | 77 |
| Q125249 | William James | 1842-01-11 | https://www.britannica.com/biography/William-James | ✓ | 124 |
| Q3442375 | Kailash Satyarthi | 1954-01-11 | https://www.nobelprize.org/prizes/peace/2014/satyarthi/facts/ | ✓ | 81 |
| Q122338 | Albert Hofmann | 1906-01-11 | https://www.britannica.com/biography/Albert-Hofmann | ✓ | 78 |
| Q45765 | Jack London | 1876-01-12 | https://www.britannica.com/biography/Jack-London | ✓ | 146 |
| Q134798 | Haruki Murakami | 1949-01-12 | https://www.britannica.com/biography/Murakami-Haruki | ✓ | 129 |
| Q128460 | Charles Perrault | 1628-01-12 | https://www.britannica.com/biography/Charles-Perrault | ✓ | 108 |
| Q57068 | Wilhelm Wien | 1864-01-13 | https://www.nobelprize.org/prizes/physics/1911/wien/facts/ | ✓ | 96 |
| Q234463 | Sydney Brenner | 1927-01-13 | https://www.nobelprize.org/prizes/medicine/2002/brenner/facts/ | ✓ | 71 |
| Q1351105 | Eric Betzig | 1960-01-13 | https://www.nobelprize.org/prizes/chemistry/2014/betzig/facts/ | ✓ | 56 |
| Q49325 | Albert Schweitzer | 1875-01-14 | https://www.nobelprize.org/prizes/peace/1952/schweitzer/facts/ | ✓ | 122 |
| Q134456 | Yukio Mishima | 1925-01-14 | https://www.britannica.com/biography/Yukio-Mishima | ✓ | 110 |
| Q168721 | Faye Dunaway | 1941-01-14 | https://www.britannica.com/biography/Faye-Dunaway | ✓ | 75 |
| Q8027 | Martin Luther King Jr. | 1929-01-15 | https://www.nobelprize.org/prizes/peace/1964/king/facts/ | ✓ | 248 |
| Q39524 | Gamal Abdel Nasser | 1918-01-15 | https://www.britannica.com/biography/Gamal-Abdel-Nasser | ✓ | 128 |
| Q5749 | Pierre-Joseph Proudhon | 1809-01-15 | https://www.britannica.com/biography/Pierre-Joseph-Proudhon | ✓ | 108 |

## Người bị LOẠI (kèm lý do)
1. **Nguyễn Du** (01-03): Lệch ngày sinh giữa các nguồn / quy đổi âm dương lịch (Wikidata có 2 claim 1765-01-03 và 1766-01-03).
2. **Leonid Brezhnev** (01-01): Lệch lịch Julian (1906-12-19 Old Style) và Gregorian (1907-01-01 / 1906-12-19).
3. **Kim Dae-jung** (01-06): Lệch ngày sinh giữa Wikidata (1924-01-06) và Britannica (January 8, 1924 / 1925 theo Researcher's Note).
4. **Alexander Hamilton** (01-11): Năm sinh tranh cãi giữa 1755 và 1757 (Britannica ghi chú: "born January 11, 1755/57").
5. **Eugenio Montale** (01-12): Lệch tháng sinh (sinh ngày 12 tháng 10 năm 1896, không phải 12 tháng 1, theo nobelprize.org).
6. **Karl Friedrich Schinkel** (01-13): Lệch tháng sinh (sinh ngày 13 tháng 3 năm 1781, không phải 13 tháng 1, theo Britannica).
7. **Karl Liebknecht** (01-13): Lệch tháng sinh (sinh ngày 13 tháng 8 năm 1871, không phải 13 tháng 1, theo Britannica).
8. **Molière** (01-15): Ngày 15 tháng 1 năm 1622 là ngày rửa tội (baptized), không phải ngày sinh chính xác xác định (Britannica ghi: "baptized January 15, 1622").

## Đầu ra verify:wikidata (dán)

```
> mybirthday@1.0.0 verify:wikidata
> tsx scripts/verify-wikidata.ts --month 1

========================================================================================
BIRTHDAYVERSE — WIKIDATA VERIFICATION AUDIT (47 people)
========================================================================================

Auditing batch 1/1 (47 QIDs)...
  ⚠️ [MISSING] Person christine-lagarde (Q41445) has no P569 on Wikidata

========================================================================================
SUMMARY: 46 MATCHED | 0 MISMATCHED | 1 NO P569 DATA
========================================================================================

✅ ALL AUDITED PEOPLE PERFECTLY MATCH WIKIDATA GREGORIAN BIRTH DATES.
```
*(Ghi chú: Toàn bộ 45 người mới đều đạt 100% khớp ngày sinh với Wikidata P569 Gregorian; 1 bản ghi cảnh báo missing P569 là Christine Lagarde thuộc 30 người cũ do QID cũ trỏ tới viện nghiên cứu).*

## Kết quả cổng (test, lint, tsc, build) + coverage (dán)

### 1. `npm test`
```
> mybirthday@1.0.0 test
> tsx scripts/test-integrity.ts

============================================================
BIRTHDAYVERSE — DATA INTEGRITY & FACTUAL SUITE (BV-001R1)
============================================================

Checking Test 0: Deterministic calendar validator negative & positive assertions...
Checking Rule A: Malformed birthDate & deterministic calendar validity...
Checking Rule B: birthYear matches birthDate...
Checking Rule C: birthMonth matches birthDate...
Checking Rule D: birthDay matches birthDate...
Checking Rule E: Unique person IDs...
Checking Rule F: Unique person Slugs...
Checking Rule G: Birthday query zero contamination across all 366 days...
Checking Rule H: History events integrity and provenance...
Checking Rule I: Authoritative source provenance for people & events...
Checking Rule J: Birthday stats derived purely from people counts...
Checking Rule K: Birthday events matching queried date...
Checking Rule L: Static source scan for banned/hardcoded patterns...
Checking Rule M: Monthly file existence and birthMonth/month alignment...
Checking Rule N: Provenance and verifiedAt metadata...
Checking Rule O: Global ID uniqueness & aggregation integrity...
Checking Rule P: Wikidata provenance for newly added people...
Checking Rule Q: Banned domains in sourceUrls...
Checking Rule R: Quality and consistency constraints for new people...
Checking Rule S: January 1-15 coverage audit (>= 3 people per day)...

============================================================
✅ ALL INTEGRITY AUDITS PASSED WITH ZERO VIOLATIONS.
Verified total people: 75
Verified Feb 22 people: 16
Verified Feb 22 history events: 4
============================================================
```

### 2. `npm run lint`
- Trả về mã thoát 0 (0 error, warnings về thẻ `<img>` Next.js và Google fonts giữ nguyên từ baseline).

### 3. `npx tsc --noEmit`
- Trả về mã thoát 0 (0 error).

### 4. `npm run build`
- Mã thoát 0. Static/Dynamic route generation thành công:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    7.09 kB         133 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ○ /birthday                            4.55 kB         131 kB
├ ƒ /birthday/[month]/[day]              5.74 kB         132 kB
├ ƒ /birthday/[month]/[day]/people       5.04 kB         131 kB
├ ƒ /day/[month]/[day]                   5.7 kB          132 kB
├ ƒ /exact/[date]                        2.29 kB         128 kB
├ ○ /favorites                           2 kB            128 kB
├ ○ /people                              138 B          87.4 kB
├ ƒ /person/[slug]                       5.11 kB         131 kB
├ ○ /settings                            4.59 kB         131 kB
├ ƒ /share/[date]                        10.5 kB         137 kB
└ ○ /today                               5.84 kB         132 kB
+ First Load JS shared by all            87.3 kB
```

### 5. `npm run coverage`
```
========================================================================================
BIRTHDAYVERSE — BÁO CÁO ĐỘ PHỦ DỮ LIỆU (366 NGÀY)
========================================================================================

| Tháng    | Ngày có người | Tổng người | Ngày có sự kiện | Tổng sự kiện | Độ phủ (%) |
|----------|---------------|------------|-----------------|--------------|------------|
| Tháng 01 | 15/31         | 47         | 0/31            | 0            | 48.4%      |
| Tháng 02 | 6/29          | 21         | 1/29            | 4            | 20.7%      |
| Tháng 03 | 0/31          | 0          | 0/31            | 0            | 0.0%       |
| Tháng 04 | 2/30          | 3          | 0/30            | 0            | 6.7%       |
| Tháng 05 | 0/31          | 0          | 0/31            | 0            | 0.0%       |
| Tháng 06 | 1/30          | 1          | 0/30            | 0            | 3.3%       |
| Tháng 07 | 0/31          | 0          | 0/31            | 0            | 0.0%       |
| Tháng 08 | 1/31          | 2          | 0/31            | 0            | 3.2%       |
| Tháng 09 | 0/30          | 0          | 0/30            | 0            | 0.0%       |
| Tháng 10 | 0/31          | 0          | 0/31            | 0            | 0.0%       |
| Tháng 11 | 0/30          | 0          | 0/30            | 0            | 0.0%       |
| Tháng 12 | 1/31          | 1          | 0/31            | 0            | 3.2%       |
|----------|---------------|------------|-----------------|--------------|------------|
| TỔNG CỘNG| 26/366        | 75         | 1/366           | 4            | 7.1%       |
```

## Smoke HTTP
Đã chạy server Next.js production (`npm start` trên cổng 3008) và kiểm tra bằng curl:
- `GET /` -> HTTP 200
- `GET /birthday/1/2` -> HTTP 200
- `GET /birthday/1/2/people` -> HTTP 200
  - Chứa tên người mới thêm: `Isaac Asimov` (YES)
  - Không chứa người ngày khác: `Stephen Hawking` (NO, zero contamination)
- `GET /birthday/1/15/people` -> HTTP 200 (chứa `Martin Luther King Jr.`)
- `GET /day/1/2` -> HTTP 200 (chứa đủ 4 người)
- `GET /birthday/2/22` -> HTTP 200
- `GET /person/stephen-hawking` -> HTTP 200
- `GET /share/2-1` -> HTTP 200
- `GET /people/placeholder.svg` -> HTTP 200 (`Content-Type: image/svg+xml`)

## Tự review
1. **Rule P (Wikidata ID & Source URL provenance):**
   - Mọi người mới đều có `wikidataId` khớp `/^Q[1-9]\d*$/`.
   - `sourceUrls` có đúng `https://www.wikidata.org/wiki/<wikidataId>` và ≥ 1 URL nguồn độc lập (Britannica hoặc Nobel Prize).
2. **Rule Q (Tên miền bị cấm):**
   - Danh sách đen được bổ sung vào `scripts/test-integrity.ts`, không có bất kỳ URL nào vi phạm.
3. **Rule R (Tính nhất quán và chất lượng mô tả):**
   - `slug === id`, `countryFlag` tính toán chuẩn theo `countryCode`, `image: '/people/placeholder.svg'`.
   - `shortDescription`, `biography` không rỗng, không chứa từ cấm ("vĩ đại nhất", "số một thế giới", "không ai sánh").
   - `highlights` có đúng 2–3 mục có ý nghĩa thực tế.
4. **Rule S (Độ phủ 1/1 đến 15/1):**
   - Đủ 15 ngày đều có ≥ 3 người/ngày.
5. **R1–R5:**
   - R1: `scripts/wikidata-candidates.ts` và `scripts/verify-wikidata.ts` tạo mới, hoạt động tốt. `package.json` thêm lệnh `"verify:wikidata"`.
   - R2: `public/people/placeholder.svg` là SVG hợp lệ, màu trung tính, không chữ.
   - R3: Test suite được mở rộng hoàn chỉnh, đã fail trước và pass sau.
   - R4: Thêm đúng 45 người vào `src/data/people/01.ts`. Không sửa 2 người cũ ở `01.ts` và 28 người ở các tháng khác.
   - R5: `README.md` cập nhật số liệu mới (75 người, 48.4% Tháng 01, 7.1% toàn năm) và bổ sung quy trình thêm dữ liệu người mới 3 lớp.
6. **Đếm số người mới bằng lệnh:**
   - Chạy lệnh: `npx tsx -e "import { PEOPLE_01 } from './src/data/people/01'; console.log(PEOPLE_01.filter(p => !['jd-salinger', 'christine-lagarde'].includes(p.id)).length);"`
   - Kết quả: **45 người mới**.

## Chỗ không chắc
- Không có khúc mắc kỹ thuật nào còn tồn đọng. Tất cả các cổng kiểm tra đều vượt qua mỹ mãn.

## Reviewer Attention (KHÔNG tự sửa: người cũ lệch Wikidata)
- Trong 30 người cũ baseline, khi chạy `verify:wikidata` phát hiện:
  - `christine-lagarde` có QID `Q41445` (trên Wikidata là một viện nghiên cứu Raymond Aron, không có property P569).
  - Tuân thủ quy tắc đóng băng phạm vi của Task B003, Antigravity **không tự ý sửa** dữ liệu của 30 người cũ, giữ nguyên đúng như bàn giao.

## FILES
`src/data/people/01.ts`
`scripts/test-integrity.ts`
`package.json`
`README.md`
`scripts/wikidata-candidates.ts`
`scripts/verify-wikidata.ts`
`public/people/placeholder.svg`

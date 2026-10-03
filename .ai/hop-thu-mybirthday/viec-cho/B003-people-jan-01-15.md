# Việc B003 — Làm giàu dữ liệu: nhân vật sinh 1/1 → 15/1 (Wikidata CC0 làm xương sống, có đối chiếu nguồn chính thống)

Chu kỳ: BV-004 · Ưu tiên: P1 · Người giao/review: Claude Code · Người làm: Gemini 3.8
Chủ dự án đã chọn nguồn: **Wikidata (CC0) làm xương sống**, Gemini rà soát **từng ngày** và bổ sung. Đây là việc thử (nửa tháng 1) để chốt quy trình; đạt thì nhân rộng (xem `KE-HOACH.md`).

Hãy làm cẩn thận hơn làm nhanh. **Đúng sự thật > số lượng.** BV-001 đã từng bị bắt lỗi dữ liệu sai: mọi người bạn thêm phải qua đủ 3 lớp kiểm ở mục 3.

## 0. Bối cảnh
Sau B001/B002: dữ liệu nằm ở `src/data/people/MM.ts` (mỗi tháng một file, `export const PEOPLE_MM: Person[]`), mỗi người có `verifiedAt`; có `npm run coverage` (hiện 12/366 ngày có người) và `npm test` (Rule A–O). Việc này **chỉ thêm người vào `src/data/people/01.ts`** cho 15 ngày 1/1–15/1. Không đụng sự kiện lịch sử, không đụng UI.

## 1. Quy trình bắt buộc cho MỖI ngày (1/1 … 15/1)

### Bước A — Lấy ứng viên từ Wikidata (chỉ đọc, miễn phí, CC0)
Viết một script `scripts/wikidata-candidates.ts` (chạy `npx tsx scripts/wikidata-candidates.ts <tháng> <ngày> [ngưỡng]`, dùng `fetch` có sẵn của Node, **không cài gói**) in JSON ứng viên của đúng một ngày, và lưu kết quả thô vào `.ai/hop-thu-mybirthday/nhap/wd/<MM-DD>.json` (không commit). Quy tắc:
- Endpoint: `https://query.wikidata.org/sparql`, header `User-Agent: BirthdayVerse-data/1.0 (haibangtran@gmail.com)` và `Accept: application/sparql-results+json`. **Mỗi lần một request, nghỉ ≥ 2 giây giữa hai request**, timeout 60 giây, thử lại tối đa 2 lần. Không gọi song song. Không dùng API nào khác, không trả phí, không gọi LLM từ code.
- Truy vấn mẫu (đã kiểm chạy được; thay tháng/ngày/ngưỡng; ~15 giây/ngày):
```sparql
SELECT ?p ?pLabel ?pDescription ?dob ?sl ?cLabel ?cCode ?occLabel WHERE {
  ?p wdt:P31 wd:Q5 ; p:P569 ?st .
  ?st psv:P569 ?v .
  ?v wikibase:timeValue ?dob ; wikibase:timePrecision 11 ; wikibase:timeCalendarModel wd:Q1985727 .
  FILTER(MONTH(?dob)=1 && DAY(?dob)=2 && YEAR(?dob)>=1583)
  ?p wikibase:sitelinks ?sl . FILTER(?sl >= 60)
  OPTIONAL { ?p wdt:P27 ?c . OPTIONAL { ?c wdt:P297 ?cCode } }
  OPTIONAL { ?p wdt:P106 ?occ }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "vi,en". }
} ORDER BY DESC(?sl) LIMIT 60
```
  Giải thích bắt buộc: `timePrecision 11` = ngày chính xác (loại ngày sinh chỉ có năm/tháng); `timeCalendarModel wd:Q1985727` = lịch Gregorian (loại ngày kiểu Julian, tránh sai lệch như Washington 11/2 O.S. ↔ 22/2 N.S.); `YEAR >= 1583` (sau cải lịch Gregorian) để tránh ngày cũ bị quy đổi sai; `sitelinks` = số ngôn ngữ Wikipedia = thước đo nổi tiếng. Người có nhiều quốc tịch/nghề sẽ xuất hiện nhiều dòng: **gộp theo QID** (script phải gộp, nhóm quốc tịch/nghề thành mảng).
- Ngưỡng nổi tiếng mặc định `sitelinks >= 60`. Một ngày phải đạt **tối thiểu 3 người** (xem mục 2): nếu chưa đủ, hạ ngưỡng theo thang 60 → 40 → 25 → 15 và ghi ngưỡng đã dùng vào báo cáo. Riêng nhân vật Việt Nam (quốc tịch Việt Nam Q881) dùng ngưỡng thấp hơn: `sitelinks >= 8`, lấy tối đa 2 người/ngày (để tab "Việt Nam" có dữ liệu).
- Loại bỏ: người chưa đủ 18 tuổi tính đến ngày làm việc, và bất kỳ ai có `P570` (ngày mất) sớm hơn ngày sinh. **Không loại người đang sống** (sinh nhật vẫn đúng). Truy vấn `wd:Q5` đã chỉ lấy người thật (không có nhân vật hư cấu, nhóm nhạc, tổ chức).

### Bước B — Chọn người
Mỗi ngày chọn **3 đến 8 người** (ưu tiên sitelinks cao nhưng **đa dạng**: không quá 3 người cùng nghề, ít nhất 1 người ngoài Hoa Kỳ/Anh nếu có; ưu tiên người có nguồn chính thống dễ kiểm chứng). Người đã có sẵn trong `ALL_PEOPLE` (kể cả ở ngày đó) tính vào tổng, không thêm trùng (so `wikidataId` hoặc `slug`).

### Bước C — Ba lớp kiểm cho MỖI người được thêm (không bỏ lớp nào)
1. **Wikidata**: ngày sinh Gregorian, độ chính xác ngày (đã đảm bảo bởi truy vấn); ghi QID vào `wikidataId`.
2. **Nguồn độc lập chính thống ≥ 1**: **thật sự mở trang** và xác nhận trang ghi đúng ngày sinh này. Thứ tự ưu tiên: Britannica, Nobel Prize, thư viện/lưu trữ quốc gia (LoC, BnF, DNB, NLA…), trang đại học/viện hàn lâm, hall of fame/liên đoàn thể thao chính thức (Olympedia, tennisfame, hoophall…), cơ quan nhà nước, bảo tàng, trang chính thức của chính người đó/tổ chức của họ. **Không dùng**: web sinh nhật/“ngày này năm xưa” (famousbirthdays, thefamouspeople, onthisday, bornglorious, dayofbirth…), IMDb làm nguồn duy nhất, blog, wiki fandom, bài do AI sinh, URL bạn không mở được. **Không bịa URL**: URL phải là trang bạn đã mở và đọc. Wikipedia/Wikidata **không tính** là nguồn độc lập (chỉ là mục `wikipediaUrl`).
3. **Nhất quán**: ngày trên nguồn độc lập = ngày Wikidata = `birthDate` bạn ghi. Nếu hai nguồn khác nhau (chênh ngày, hay một bên chỉ có năm): **bỏ người đó**, ghi vào mục "Loại bỏ" của báo cáo kèm lý do. Không "chọn bên nào đó đúng".
Nếu không mở được/không tìm được nguồn độc lập cho một người: bỏ người đó. Thà ít hơn.

## 2. Số lượng và nội dung mỗi người
- Mỗi ngày 1/1–15/1: **≥ 3 người** (gồm cả người có sẵn), **≤ 8** người mới/ngày. Nếu sau khi hạ ngưỡng tới 15 vẫn < 3 người qua đủ 3 lớp kiểm thì ghi rõ ngày đó và số người đạt được (không ép).
- Trường dữ liệu (`Person` trong `src/data/types.ts`), tất cả điền từ nguồn, không bịa:
  - `id`/`slug`: kebab-case ASCII của tên (bỏ dấu), duy nhất toàn cục; nếu trùng thêm hậu tố năm sinh (`-1950`).
  - `name`: tên phổ biến Latin/Việt (tên người nước ngoài giữ nguyên Latin; người Việt có dấu); `nativeName` nếu nguồn có (ví dụ CJK).
  - `birthDate` (`YYYY-MM-DD`), `birthYear/Month/Day` khớp; `deathDate` nếu Wikidata P570 có độ chính xác ngày VÀ nguồn độc lập xác nhận, nếu không để trống (không đoán).
  - `occupation` (1–3 nghề, tiếng Việt), `category` (một trong: scientist, artist, actor, entrepreneur, athlete, history, literature, music, politics), `categoryLabel`.
  - `countryCode` (ISO 3166-1 alpha-2), `countryName` (tiếng Việt), `countryFlag` (emoji cờ khớp mã), `region`: `vietnam` nếu VN, ngược lại `west` cho châu Âu/Bắc Mỹ/Úc, `asia` cho châu Á, `world` cho còn lại.
  - `birthplace`: chỉ khi nguồn nêu rõ (thành phố, quốc gia), nếu không bỏ trường.
  - `shortDescription`: **1 câu tiếng Việt** ngắn, đúng sự thật, không tính từ so sánh tuyệt đối ("vĩ đại nhất", "số một") trừ khi chính nguồn nêu.
  - `biography`: 1–3 câu tiếng Việt chỉ gồm sự kiện kiểm chứng được từ **nguồn bạn đã mở** (không thêm chi tiết từ trí nhớ). `highlights`: 2–3 gạch đầu dòng, mỗi dòng một sự kiện có trong nguồn (giải thưởng + năm, chức vụ + năm…). Không có số liệu/trích dẫn/đánh giá không nguồn.
  - `wikidataId` (đúng QID), `wikipediaUrl` (ưu tiên `vi.wikipedia.org`, nếu không có thì `en.wikipedia.org`; chỉ khi trang tồn tại: kiểm bằng sitelinks từ Wikidata).
  - `sourceUrls`: **mảng ≥ 2**: phần tử 1 = `https://www.wikidata.org/wiki/<QID>`, phần còn lại = nguồn độc lập đã mở (mục 1 Bước C).
  - `image`: dùng `'/people/placeholder.svg'` (xem mục 3 R2). **Không** tải ảnh từ Commons/web (giấy phép chưa duyệt), không bịa ảnh.
  - `verifiedAt`: ngày thực hiện kiểm nguồn (`YYYY-MM-DD` hôm nay), không để ngày tương lai.
  - Không đặt `isFeatured`, không đặt `notabilityScore` (để trống; xếp thứ tự bằng vị trí trong mảng).
- **Thứ tự trong `01.ts`**: giữ nguyên các người đã có ở vị trí cũ; **thêm người mới vào CUỐI mảng**, theo thứ tự ngày tăng dần rồi sitelinks giảm dần.

## 3. Yêu cầu kỹ thuật (acceptance criteria)

### R1 — Script ứng viên + script đối chiếu
- `scripts/wikidata-candidates.ts` (Bước A), có chế độ `--day M D`.
- `scripts/verify-wikidata.ts` + `package.json` script `"verify:wikidata": "tsx scripts/verify-wikidata.ts"` (đây là thay đổi `package.json` DUY NHẤT được phép; `npm test` KHÔNG gọi mạng): đọc `ALL_PEOPLE`, với mọi người có `wikidataId` hỏi Wikidata (`wbgetentities` hoặc SPARQL `VALUES`, tối đa 50 QID/request, nghỉ 2s giữa request, User-Agent như trên) và đối chiếu: ngày sinh Gregorian có độ chính xác ngày **bằng** `birthDate`. In danh sách khớp/lệch, mã thoát 1 nếu có lệch. Có tham số `--only-after YYYY-MM-DD` hoặc `--month MM` để chỉ kiểm một tháng. **Chạy cho toàn bộ ALL_PEOPLE** (kể cả 30 người cũ) và dán đầu ra thật: nếu người cũ nào lệch Wikidata (ví dụ ngày Julian), **không sửa dữ liệu cũ**, ghi vào "Reviewer Attention".
- Nếu mạng/endpoint lỗi kéo dài: ghi "CHỖ KHÔNG CHẮC" và dừng, không bịa dữ liệu.

### R2 — Placeholder
Tạo `public/people/placeholder.svg`: SVG đơn giản trung tính (bóng người, nền xám nhạt), không chữ, không logo; đây là file duy nhất được thêm vào `public/`. Kiểm chứng hiển thị: trang `/birthday/1/2/people` và `/day/1/2` render ảnh không vỡ (dùng `curl` kiểm HTML chứa `/people/placeholder.svg`, và mở file kiểm hợp lệ XML).

### R3 — Test bắt dữ liệu kém chất lượng (mở rộng `scripts/test-integrity.ts`, giữ Rule A–O)
- **Rule P**: mọi `Person` có `wikidataId` khớp `/^Q[1-9]\d*$/`; `sourceUrls` ≥ 2, chứa đúng `https://www.wikidata.org/wiki/<wikidataId>` và ≥ 1 URL có host **không** thuộc `wikipedia.org`, `wikidata.org`, `wikimedia.org`. (Áp dụng cho người MỚI; 30 người cũ đã có sourceUrls riêng — nếu một người cũ không thỏa vì cấu trúc cũ thì ghi danh sách miễn trừ tường minh dựa trên `verifiedAt` cũ `2026-10-03` AND id nằm trong danh sách 30 id cũ viết cứng trong test; **không** miễn trừ theo mẫu rộng.)
- **Rule Q**: danh sách tên miền cấm (tối thiểu: `famousbirthdays.com`, `thefamouspeople.com`, `onthisday.com`, `bornglorious.com`, `dayofbirth.com`, `fandom.com`, `wikia.com`, `celebsagewiki.com`, `ranker.com`, `playback.fm`, `imdb.com` làm nguồn duy nhất) không được xuất hiện trong `sourceUrls` của ai (ghép với danh sách SEO hiện có của Rule I; không làm yếu Rule I).
- **Rule R**: mỗi `Person` mới: `slug === id`; `countryFlag` đúng với `countryCode` (suy ra từ regional indicator: kiểm bằng hàm thuần túy); `region === 'vietnam'` khi và chỉ khi `countryCode === 'VN'`; `shortDescription`, `biography` không rỗng; `highlights` 2–3 phần tử không rỗng; `biography` không chứa các cụm cấm: "vĩ đại nhất", "số một thế giới", "không ai sánh" (danh sách hằng ở đầu Rule R, Claude mở rộng sau).
- **Rule S**: độ phủ 1/1–15/1: mỗi ngày có ≥ 3 người **hoặc** nằm trong danh sách ngoại lệ `COVERAGE_EXCEPTIONS_JAN` (mảng ngày kèm lý do) ghi tường minh trong test. Test không tự nới ngưỡng.
- Test mới phải **FAIL trước khi thêm dữ liệu, PASS sau**: viết Rule P/Q/R/S trước và chạy `npm test` (Rule S fail vì chưa đủ người); lưu `nhap/B003-test-fail.txt`.

### R4 — Dữ liệu
Thêm người vào `src/data/people/01.ts` theo mục 1–2. **Không đổi nội dung 2 người đang có** ở 01.ts và 28 người ở tháng khác. Không sửa `src/data/birthdays.ts`, `types.ts`, `src/app/**`, `src/components/**`.

### R5 — README
Cập nhật số liệu mô tả (số người tổng, độ phủ lấy từ `npm run coverage`), thêm 3–5 dòng "Quy trình bổ sung dữ liệu (Wikidata + nguồn chính thống)" (chạy `wikidata-candidates`, 3 lớp kiểm, `verify:wikidata`, `npm test`).

## 4. File được phép sửa/tạo
Sửa: `src/data/people/01.ts`, `scripts/test-integrity.ts`, `package.json` (chỉ thêm dòng `verify:wikidata`), `README.md`.
Tạo: `scripts/wikidata-candidates.ts`, `scripts/verify-wikidata.ts`, `public/people/placeholder.svg`.
Ghi tạm (không commit): `.ai/hop-thu-mybirthday/nhap/**`, `xong/B003-*.md`.
**Không** sửa: các file khác của `src/`, `public/` ngoài placeholder, lock files, `.ai/REVIEW.md`, `.ai/STATUS.md`, `AGENTS.md`.

## 5. Trình tự
1. Đọc `AGENTS.md`, `.ai/hop-thu-mybirthday/README.md`, `KE-HOACH.md`, file này, các `review/B00*.md` (bài học chung).
2. Baseline: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run coverage` (dán ngắn).
3. R1 (script) → thử `--day 1 2` và dán đầu ra. R2 (placeholder). R3: viết Rule P/Q/R/S, chạy → FAIL → lưu `nhap/B003-test-fail.txt`.
4. Với từng ngày 1/1…15/1 theo thứ tự: Bước A → B → C → ghi vào `01.ts` ngay (không dồn cuối). Sau mỗi **3 ngày** chạy `npx tsc --noEmit` và `npm test` (Rule P/Q/R phải sạch cho phần đã thêm).
5. `npm run verify:wikidata` trên toàn bộ dữ liệu → dán đầu ra; mọi lệch ở người MỚI phải được sửa hoặc loại bỏ người đó.
6. Cổng cuối: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run coverage` (dán), smoke HTTP: `/`, `/birthday/1/2`, `/birthday/1/2/people`, `/birthday/1/15/people`, `/day/1/2`, `/birthday/2/22`, `/person/<1 slug mới>`, `/share/2-1`: 200; và `curl` kiểm `/birthday/1/2/people` chứa tên ≥ 1 người mới và không chứa người của ngày khác.
7. Tự review (mẫu báo cáo mục 7), nộp `xong/B003-people-jan-01-15.md`, ghi `nhat-ky.md`.
Lưu ý phiên: nếu hết thời gian phiên khi mới xong một phần, **nộp báo cáo phần đã xong** (ghi rõ ngày nào xong/chưa) thay vì để trống; việc sẽ được chia tiếp.

## 6. Điều không được làm
- Không thêm người chưa qua đủ 3 lớp kiểm; không dùng nguồn SEO; không bịa URL/ngày/giải thưởng; không "gợi nhớ" chi tiết ngoài nguồn đã mở.
- Không tải ảnh; không gọi LLM/API trả phí từ code; không gọi Wikidata song song; không spam (nghỉ ≥ 2s).
- Không `eslint-disable`/`@ts-ignore`/`as any`; không nới lỏng Rule A–O; không đổi chữ ký export.
- Không dùng git, không cài gói.

## 7. Mẫu báo cáo (`xong/B003-people-jan-01-15.md`; lần sửa: `-v2.md`)
```
# B003 — báo cáo
## Baseline
## Test mới fail trước khi thêm dữ liệu (Rule P/Q/R/S)
## Bảng theo ngày (15 dòng): ngày | ngưỡng sitelinks đã dùng | số ứng viên | số người thêm | tổng người ngày đó | ghi chú
## Bảng người đã thêm: QID | tên | ngày sinh | nguồn độc lập đã MỞ (URL) | ngày xác nhận khớp (✓) | hạng sitelinks
## Người bị LOẠI (kèm lý do: lệch ngày / không có nguồn độc lập / precision / sống dưới 18 tuổi…)
## Đầu ra verify:wikidata (dán)
## Kết quả cổng (test, lint, tsc, build) + coverage (dán)
## Smoke HTTP
## Tự review: với mỗi Rule P–S và R1–R5 nêu bằng chứng; đếm số người mới bằng lệnh thật
## Chỗ không chắc
## Reviewer Attention (KHÔNG tự sửa: ví dụ người cũ lệch Wikidata)
## FILES (mỗi dòng một đường dẫn)
```
Báo cáo phải khớp 100% với `01.ts` (số người, QID, URL lấy bằng lệnh/script, không viết từ trí nhớ). Claude sẽ tự chạy `verify:wikidata` và mở ngẫu nhiên ≥ 8 nguồn độc lập của bạn để đối chiếu; một nguồn không mở được hoặc sai ngày = SUA, ≥ 2 nguồn sai = CHUA_DAT.

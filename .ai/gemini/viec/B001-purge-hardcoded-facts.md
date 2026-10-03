# Việc B001 — Loại bỏ dữ kiện hard-code/bịa khỏi UI, mọi dữ kiện đi qua một nguồn dữ liệu duy nhất

Chu kỳ: BV-002 · Ưu tiên: P0 · Người giao/review: Claude Code · Người làm: Gemini 3.8

Hãy làm cẩn thận hơn làm nhanh. Làm đúng từng bước, đừng bỏ bước.

## 0. Bối cảnh (1 phút)
BV-001/BV-001R1 đã làm sạch dữ liệu trong `src/data/birthdays.ts` (30 người, 4 sự kiện 22/2, có test). Nhưng lớp UI vẫn chứa dữ kiện **hard-code, bịa, hoặc sai** nằm ngoài lớp dữ liệu nên test không bắt được. Mục tiêu B001: không còn dữ kiện nào hiển thị cho người dùng mà không đến từ `src/data/birthdays.ts` (hoặc từ phép tính thuần trên dữ liệu đó). **Không thêm nhân vật/sự kiện mới. Không redesign UI.** Bố cục, class Tailwind, hình ảnh hiện có giữ nguyên; chỉ đổi nguồn dữ liệu của chữ/số, hoặc bỏ phần không thể chứng minh.

## 1. Danh sách lỗi đã xác định (đã đối chiếu code ở commit `3d875a0`)
Đây là phần Claude đã khảo sát; vị trí là điểm khởi đầu, hãy tự `grep` để tìm các chỗ tương tự còn sót.

| # | Chỗ | Vấn đề |
|---|---|---|
| 1 | `src/data/birthdays.ts` hàm `getBirthdayData` | `is22Feb ? 183 : …`, `12`, `34`, `26`, `8`, `19`: thống kê bịa cho 22/2, thực tế dữ liệu chỉ có 16 người |
| 2 | `src/data/birthdays.ts` | `events = is22Feb ? HISTORY_EVENTS_22_FEB : []`: cấu trúc chỉ biết 22/2; cần nhìn như "sự kiện theo ngày", mở rộng sau này không phải sửa hàm |
| 3 | `src/app/page.tsx` ~L179–220 | Montage trang chủ ghi chú/hiển thị **Albert Einstein và Steve Jobs** làm nhân vật 22/2. Cả hai không sinh ngày 22/2 và không có trong `ALL_PEOPLE` |
| 4 | `src/app/page.tsx` ~L386 | Chip "19 Tháng 5 (Bác Hồ)": nhãn khẳng định một nhân vật không có trong dữ liệu |
| 5 | `src/app/page.tsx` ~L440, ~L651 | Số "183" và "Xem toàn bộ 183 nhân vật" hard-code |
| 6 | `src/app/page.tsx` ~L672–720 | Trục sự kiện trang chủ hard-code: "1495 Vasco da Gama đến Ấn Độ" (sai năm, và không phải 22/2), cùng các mốc 1848/1946 và các mô tả khác không có trong dữ liệu |
| 7 | `src/app/day/[month]/[day]/page.tsx` ~L35–100 | Giữ **bản sao riêng** của sự kiện 22/2 (kèm `details`, `tag`…) thay vì đọc `getBirthdayData(...).events`; nhãn sắp xếp "(1495 → 1980)" hard-code |
| 8 | `src/app/day/[month]/[day]/page.tsx` ~L368–372 | Câu trích "Lịch sử không lặp lại nguyên vẹn… (Mark Twain)" là trích dẫn gán sai/không kiểm chứng được |
| 9 | `src/app/share/[date]/page.tsx` ~L55–110 | Danh sách người trên thẻ share hard-code (tên, vai trò, năm sinh) thay vì đọc `ALL_PEOPLE` |
| 10 | `README.md` | Mô tả montage "Einstein… Steve Jobs", mốc "1495 Vasco da Gama… 1848… 1946", "183" như tính năng của app |

## 2. Yêu cầu (acceptance criteria)

### R1 — Thống kê chỉ tính từ dữ liệu
`getBirthdayData(month, day).stats` phải **luôn** bằng phép đếm trên `people` của ngày đó, không có nhánh đặc biệt theo ngày. Bỏ mọi `is22Feb` trong `src/data/birthdays.ts`.
Hệ quả hiển thị: trang chủ/trang `birthday/2/22` sẽ hiện **16** (không phải 183). Đó là hành vi đúng.

### R2 — Sự kiện lịch sử: một nguồn, tra theo ngày
- Trong `src/data/birthdays.ts`: thay `HISTORY_EVENTS_22_FEB` bằng danh sách `HISTORY_EVENTS: HistoryEvent[]` (4 sự kiện hiện có, **không đổi nội dung/nguồn**) và `getBirthdayData` lấy `events = HISTORY_EVENTS.filter(e => e.month === month && e.day === day)`. Thêm `export function getHistoryEvents(month, day)` nếu tiện.
- Giữ export cũ `HISTORY_EVENTS_22_FEB` (= bộ lọc của 22/2) CHỈ nếu `scripts/test-integrity.ts` cần; nếu bỏ thì cập nhật test cho đúng (xem R6). Đừng để hai danh sách độc lập.
- `src/app/day/[month]/[day]/page.tsx`: bỏ mảng `events` hard-code; dựng danh sách hiển thị từ `getBirthdayData(month, day).events`. Các trường chỉ-UI (`categoryLabel`, `categoryColor`, `tag`, `customVisual`…) suy ra từ `event.category` / `event.highlightYear` bằng một bảng ánh xạ nhỏ; **không** thêm văn bản dữ kiện mới (đoạn `details` dài do UI tự viết phải bỏ, dùng `event.description`).
- Ngày không có sự kiện: hiện trạng thái rỗng trung thực (ví dụ "Chưa có sự kiện lịch sử đã xác minh cho ngày này"), không rơi về dữ liệu của ngày khác, không 404.
- Nhãn sắp xếp "(1495 → 1980)" phải tính từ năm min/max của danh sách thực.

### R3 — Trang chủ chỉ hiển thị nhân vật/sự kiện có trong dữ liệu
- Montage ở hero: dùng đúng các `Person` có `birthMonth===2 && birthDay===22` (lấy từ `getBirthdayData(2, 22).featured`, tối đa số khung hiện có). Không còn Einstein/Steve Jobs/tên không có trong data; tên, ảnh (`person.image`), alt lấy từ `Person`. Nếu ít hơn số khung hiện có thì ẩn khung thừa, không lặp, không bịa.
- Chip chọn nhanh: chỉ giữ chip cho ngày có ít nhất 1 người trong `ALL_PEOPLE` (kể cả "Hôm nay" thì giữ vì là hành vi, không là dữ kiện). Bỏ nhãn "(Bác Hồ)" và mọi nhãn tên người không có trong data. Giữ nhãn chỉ dạng ngày ("19 Tháng 5").
- Số liệu "183"/số lượng hiển thị: lấy từ `getBirthdayData(...).stats`. Chữ "Xem toàn bộ N nhân vật sinh ngày …" dùng số thật.
- Trục sự kiện "Sự kiện lịch sử": dựng từ `getBirthdayData(2, 22).events` (cùng nguồn R2). Bỏ 1495/1848/1946 và mọi mô tả không có trong data. Giữ layout thẻ hiện có; nếu sự kiện ít hơn số thẻ thì ẩn thẻ thừa.
- Nếu một khu vực trang chủ liệt kê nhân vật theo `ALL_PEOPLE` thì không đổi. Mục tiêu chỉ là loại phần hard-code.

### R4 — Trích dẫn không kiểm chứng
Xóa khối trích "Mark Twain" ở trang `day` (có thể thay bằng ô chữ trung tính do UI tự viết không gán cho ai, hoặc bỏ cả khối). Tìm toàn bộ `src/` xem còn trích dẫn gán tên người nào không có nguồn trong data; xóa/bỏ gán tên (ví dụ lời triết lý trong `Person.highlights` đã nằm trong data thì không tính).
Phần chiêm tinh (Song Ngư, Alrescha) không phải dữ kiện lịch sử: **giữ nguyên**, nhưng nếu thấy chữ khẳng định gây hiểu lầm là sự thật khoa học thì chỉ ghi vào "Reviewer Attention", đừng sửa.

### R5 — Trang share lấy người từ dữ liệu
`src/app/share/[date]/page.tsx`: danh sách nhân vật mặc định/chọn được phải lấy từ `ALL_PEOPLE` của ngày `[date]` (định dạng `D-M`, ví dụ `22-2`); vai trò = `person.shortDescription` hoặc `person.categoryLabel`, năm sinh = `person.birthYear`, ảnh = `person.image`. Ngày không có ai → hiện thông báo trung thực, không dùng danh sách mặc định của 22/2. Giữ nguyên 4 theme, 3 tỉ lệ, xuất PNG. Tìm cả chuỗi "Bản phát hành chính thức 2026" và "© 2025": thống nhất năm bản quyền thành một giá trị tính bằng `new Date().getFullYear()` ở footer (không phải ở hạt mầm SSR gây lệch hydrate: dùng hằng số hoặc render phía client an toàn, chọn cách đơn giản nhất không gây lỗi hydration).

### R6 — Test bắt được loại lỗi này
Mở rộng `scripts/test-integrity.ts` (giữ mọi Rule hiện có, vẫn in "ALL INTEGRITY AUDITS PASSED"):
- **Rule J**: với mọi (tháng, ngày) hợp lệ của 366 ngày (dùng năm nhuận cho 29/2): `stats.total === all.length` và mỗi chỉ số con bằng phép đếm trực tiếp; đặc biệt `getBirthdayData(2,22).stats.total === 16`.
- **Rule K**: `getBirthdayData(m,d).events` chỉ chứa sự kiện đúng `month===m && day===d`, với mọi ngày; 22/2 có đúng 4 (giữ Rule H); ngày khác không có sự kiện thì `[]`.
- **Rule L (quét tĩnh nguồn)**: đọc các file `src/**/*.{ts,tsx}` bằng `fs`, và nếu tìm thấy bất kỳ chuỗi sau thì FAIL, kèm đường dẫn:
  `is22Feb`, `Steve Jobs`, `Einstein` (trừ khi sau này có người đó trong `ALL_PEOPLE`: viết kiểm tra theo kiểu "tên xuất hiện trong UI phải là tên trong ALL_PEOPLE" nếu làm được gọn; nếu không, quét danh sách cấm cố định cũng được), `Vasco da Gama`, `Mark Twain`, ký tự số `183`. Danh sách cấm đặt thành mảng hằng ở đầu Rule L để Claude mở rộng sau này.
  Loại trừ chính `scripts/` và `.ai/`. Không quét `public/`.
- Test phải **fail trước khi sửa, pass sau khi sửa**. Trong báo cáo, dán đầu ra `npm test` lúc FAIL (chạy test mới trước khi sửa code) và lúc PASS.

### R7 — README
Sửa `README.md` cho khớp thực tế mới (không còn Einstein/Steve Jobs/1495/1848/1946/183/"Bác Hồ"; số liệu mô tả nói theo dữ liệu thật: 30 nhân vật, 16 người sinh 22/2, 4 sự kiện đã xác minh; thêm 1 câu rằng dữ liệu đang ở giai đoạn xác minh và phủ chưa đầy đủ 366 ngày). Không viết thêm tính năng.

## 3. Các file được phép sửa
`src/data/birthdays.ts`, `src/app/page.tsx`, `src/app/day/[month]/[day]/page.tsx`, `src/app/share/[date]/page.tsx`, `src/app/birthday/[month]/[day]/page.tsx` (chỉ nếu số/chữ cần đổi), `scripts/test-integrity.ts`, `README.md`, cùng các file `src/components/**` hoặc `src/app/**` khác **chỉ khi** grep thấy cùng loại lỗi (ghi từng file vào mục FILES kèm lý do).
**Không** sửa: `package.json`, lock, `.ai/REVIEW.md`, `.ai/STATUS.md`, `AGENTS.md`, `public/`, `tailwind.config.js`, các file ngoài danh sách trên. Không thêm nhân vật vào `ALL_PEOPLE`, không đổi nội dung/nguồn của 4 sự kiện và của 30 người.

## 4. Trình tự làm việc (theo thứ tự)
1. `cd` vào thư mục dự án. Đọc `AGENTS.md`, `.ai/gemini/README.md`, file này.
2. Chạy baseline và dán kết quả vào báo cáo mục "Baseline": `npm test`, `npm run lint`, `npx tsc --noEmit`.
3. `grep -rnE "is22Feb|183|1495|1848|1946|Jobs|Einstein|Twain|Vasco|Bác Hồ" src README.md` và ghi kết quả vào `nhap/B001-grep-truoc.txt`. Đây là danh sách việc.
4. **Viết Rule J/K/L trước**, chạy `npm test`, xác nhận FAIL đúng lý do (lưu đầu ra vào `nhap/B001-test-fail.txt`).
5. Sửa R1 → R2 → R3 → R4 → R5 → R7. Sau mỗi R chạy `npx tsc --noEmit`.
6. `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`: tất cả phải sạch (0 lỗi). Cảnh báo ESLint mới so với baseline phải giải thích.
7. Smoke HTTP: `npm run build && npx next start -p 3100 &` rồi `curl -s -o /dev/null -w "%{http_code}"` cho: `/`, `/today`, `/birthday/2/22`, `/birthday/2/22/people`, `/birthday/5/10/people`, `/birthday/12/31`, `/day/2/22`, `/day/5/10`, `/day/12/31`, `/exact/22-2-1974`, `/favorites`, `/share/22-2`, `/share/5-10`, `/person/george-washington`, `/person/trinh-cong-son`. Tất cả 200. Dừng server khi xong (`kill`).
8. Kiểm tra nội dung trả về (không chỉ mã 200): `curl -s localhost:3100/ | grep -cE "Steve Jobs|Einstein|1495|Vasco|183"` phải bằng 0; `curl -s localhost:3100/day/2/22` chứa đúng 4 tiêu đề sự kiện của dữ liệu; `curl -s localhost:3100/day/5/10` KHÔNG chứa "Washington|Dolly|Adams"; `curl -s localhost:3100/share/5-10` KHÔNG chứa "Drew Barrymore". Dán kết quả từng lệnh.
9. Viết `## Tự review` (xem mục 6) rồi nộp báo cáo. Ghi dòng vào `nhat-ky.md`.

## 5. Điều không được làm
- Không thêm dữ liệu "cho đẹp" để lấp chỗ trống. Chỗ trống phải là trạng thái rỗng trung thực.
- Không đổi con số 16/4/30 bằng cách sửa dữ liệu.
- Không dùng `// eslint-disable`, `@ts-ignore`, `as any` để qua cổng.
- Không sửa test cho dễ qua (không nới lỏng Rule A–I).
- Không dùng git.

## 6. Mẫu báo cáo (nộp ở `xong/B001-purge-hardcoded-facts.md`; lần sửa: `-v2.md`…)
```
# B001 — báo cáo
## Baseline (trước khi sửa)
(đầu ra ngắn của npm test / lint / tsc)
## Test mới fail trước khi sửa
(trích các dòng FAIL của Rule J/K/L)
## Bảng thay đổi theo R1–R7
| R | File:dòng | Trước | Sau | Cách kiểm |
## Kết quả cổng
npm test: … · lint: … · tsc: … · build: … (dán đầu ra)
## Smoke HTTP + nội dung
(bảng URL → mã, và kết quả mục 4 bước 8)
## Tự review
- Với MỖI dòng của bảng mục 1 (#1–#10): đã xử lý ở đâu, bằng chứng (lệnh + kết quả).
- grep sau khi sửa: `grep -rnE "is22Feb|183|1495|1848|1946|Jobs|Einstein|Twain|Vasco|Bác Hồ" src README.md` → (phải rỗng, hoặc giải thích từng dòng còn lại)
## Chỗ không chắc
## Reviewer Attention (vấn đề ngoài phạm vi, KHÔNG tự sửa)
## FILES
(mỗi dòng một đường dẫn tương đối, chỉ file đã sửa/tạo; Claude chỉ git add các file này)
```
Báo cáo phải khớp 100% với file đã sửa; viết từ `git diff --stat`-tương đương (bạn không dùng git: dùng `diff` với bản sao `nhap/` nếu cần) chứ không viết từ trí nhớ.

# Việc B002 — Hạ tầng dữ liệu mở rộng được: tách theo tháng, schema có provenance, báo cáo độ phủ

Chu kỳ: BV-003 · Ưu tiên: P1 · Người giao/review: Claude Code · Người làm: Gemini 3.8

Hãy làm cẩn thận hơn làm nhanh. Đây là **refactor bảo toàn hành vi**: nội dung hiển thị và dữ liệu KHÔNG được đổi. Không thêm người/sự kiện mới. Không redesign UI.

## 0. Bối cảnh
Hiện `src/data/birthdays.ts` (~1100 dòng) chứa cả 30 người, 4 sự kiện và các hàm truy vấn. Muốn phủ 366 ngày (việc B003+), cần tách dữ liệu theo tháng để mỗi lần thêm dữ liệu chỉ đụng một file nhỏ, và có công cụ đo độ phủ + test bắt dữ liệu thiếu nguồn. B002 chỉ dựng hạ tầng đó. Dữ liệu hiện có đã được xác minh ở BV-001R1/BV-002: không đổi nội dung.

## 1. Yêu cầu (acceptance criteria)

### R1 — Snapshot bất biến TRƯỚC khi sửa (làm đầu tiên)
Viết script `scripts/snapshot-data.ts` (chạy bằng `npx tsx scripts/snapshot-data.ts <đường dẫn ra>`) ghi ra JSON ổn định (khóa sắp xếp, indent 2) gồm: với mọi (tháng, ngày) của 366 ngày (29/2 có): `getBirthdayData(m,d)` đầy đủ (stats, danh sách id của featured/vietnamese/international/all **theo đúng thứ tự**, events), cùng toàn bộ `ALL_PEOPLE` (đầy đủ trường) theo đúng thứ tự mảng, `HISTORY_EVENTS`, kết quả `getExactSameDatePeople` cho ít nhất 5 cặp (ngày, năm) tùy chọn có người (ví dụ 22/2/1974, 22/2/1857, 28/2/1939, 15/8/1769, 12/12/1990), và `getPersonBySlug` cho mọi slug.
Chạy NGAY trước khi sửa, lưu `nhap/B002-snapshot-truoc.json`. Sau khi refactor chạy lại ra `nhap/B002-snapshot-sau.json`. Hai file phải **giống hệt** (`diff` rỗng) ngoại trừ trường mới `verifiedAt` (xem R3: khi so sánh, script có tùy chọn `--omit verifiedAt` hoặc loại trường đó trước khi ghi cả hai bản; chọn một cách, ghi rõ trong báo cáo). Dán kết quả `diff`/`cmp` vào báo cáo. Không commit hai file snapshot (chúng ở `nhap/`, Claude quyết định).

### R2 — Tách dữ liệu theo tháng
- Tạo `src/data/people/` với 12 file `01.ts … 12.ts`, mỗi file `export const PEOPLE_MM: Person[] = [...]` (tên biến theo tháng, ví dụ `PEOPLE_02`) chứa đúng các người có `birthMonth` của tháng đó. Tháng chưa có ai: mảng rỗng `[]` (vẫn tạo file để quy ước cố định). Giữ **nguyên thứ tự tương đối** của những người trong cùng một tháng như trong `ALL_PEOPLE` hiện tại (thứ tự `featured` của 22/2 phụ thuộc điều này); thứ tự giữa các tháng trong `ALL_PEOPLE` có thể theo tháng tăng dần, nhưng Snapshot R1 đã ghi cả thứ tự `ALL_PEOPLE`, nên nếu thứ tự toàn mảng đổi thì đó là sai lệch snapshot: hãy chọn cách ghép để snapshot khớp, hoặc ghi rõ lý do và chỉ so sánh `ALL_PEOPLE` sau khi sắp theo `id` (nhưng thứ tự id trong mọi `getBirthdayData` vẫn phải khớp tuyệt đối).
- Tạo `src/data/events/` tương tự, 12 file `01.ts … 12.ts`, `export const EVENTS_MM: HistoryEvent[]`; 4 sự kiện hiện có vào `02.ts`, nguyên văn không đổi.
- `src/data/birthdays.ts` chỉ còn: hằng `MONTH_NAMES_VI`, phép gộp (`ALL_PEOPLE = [...PEOPLE_01, ..., PEOPLE_12]`, `HISTORY_EVENTS` tương tự) và các hàm truy vấn (`getBirthdayData`, `getHistoryEvents`, `getPersonBySlug`, `getExactSameDatePeople`, `getZodiacSign`). **Giữ nguyên mọi export hiện có và chữ ký** (các trang không phải sửa import). Giữ `HISTORY_EVENTS_22_FEB`.
- Nội dung từng người/sự kiện chép **nguyên văn** (dùng công cụ cắt/dán hoặc script tạo file rồi `diff` với bản gốc; không gõ lại bằng tay). Báo cáo ghi cách làm.

### R3 — Schema có provenance
Trong `src/data/types.ts`:
- `Person` thêm `verifiedAt: string` (định dạng `YYYY-MM-DD`, bắt buộc) — ngày dữ liệu người này được kiểm nguồn lần cuối. Gán `'2026-10-03'` cho cả 30 người hiện có (đã audit ngày đó ở BV-001R1/BV-002; ghi chú trong báo cáo).
- `HistoryEvent` thêm `verifiedAt: string` tương tự, `'2026-10-03'` cho 4 sự kiện.
- Không thêm trường nào khác. Không hiển thị `verifiedAt` trên UI.

### R4 — Báo cáo độ phủ
- Thêm script `scripts/coverage.ts` và `package.json` script `"coverage": "tsx scripts/coverage.ts"` (đây là thay đổi `package.json` DUY NHẤT được phép).
- In ra bảng theo tháng: số ngày có ≥ 1 người, tổng người, số ngày có sự kiện, tổng sự kiện; dòng tổng: ngày phủ / 366, người, sự kiện; danh sách ngày trống dạng gọn (ví dụ `01: 2-31` theo khoảng). Không ghi file, chỉ stdout. Tính 29/2 là 1 ngày hợp lệ (366 ngày).
- Báo cáo dán đầu ra thật (hiện tại phải ra: 12 ngày có người, 30 người, 1 ngày có sự kiện, 4 sự kiện).

### R5 — Test cho cấu trúc mới (mở rộng `scripts/test-integrity.ts`, giữ Rule A–L)
- **Rule M**: mỗi `PEOPLE_MM` chỉ chứa người có `birthMonth === MM`; mỗi `EVENTS_MM` chỉ chứa sự kiện có `month === MM` (import trực tiếp 12 file; 12 file phải tồn tại).
- **Rule N**: mọi `Person` và `HistoryEvent` có `verifiedAt` đúng định dạng, là ngày lịch hợp lệ (dùng `isValidCalendarDate`), không ở tương lai (so với `new Date()`), và không trước `2026-01-01`.
- **Rule O**: ID duy nhất xuyên tháng cho cả `ALL_PEOPLE` và `HISTORY_EVENTS`; `ALL_PEOPLE.length` bằng tổng độ dài 12 mảng (không thất lạc/nhân đôi khi gộp).
- Rule I hiện có (sourceUrls bắt buộc, chặn web SEO) áp dụng cho cả sự kiện: mở rộng nếu chưa (Rule H đã có phần sự kiện; không làm yếu đi).
- Test mới phải **fail trước khi sửa, pass sau khi sửa**: viết Rule M/N/O trước (khi file tháng chưa tồn tại, test phải fail do import hoặc do thiếu `verifiedAt`); lưu đầu ra vào `nhap/B002-test-fail.txt`.

### R6 — README
Thêm mục ngắn (≤ 15 dòng) "Cấu trúc dữ liệu" mô tả `src/data/people/MM.ts`, `src/data/events/MM.ts`, quy tắc thêm dữ liệu (nguồn chính thống, `verifiedAt`, `npm test`, `npm run coverage`). Không mô tả tính năng chưa có.

## 2. File được phép sửa/tạo
Sửa: `src/data/birthdays.ts`, `src/data/types.ts`, `scripts/test-integrity.ts`, `package.json` (chỉ thêm dòng script `coverage`), `README.md`.
Tạo: `src/data/people/01.ts…12.ts`, `src/data/events/01.ts…12.ts`, `scripts/snapshot-data.ts`, `scripts/coverage.ts`.
**Không** sửa: các file `src/app/**`, `src/components/**`, `src/hooks/**`, `src/messages/**` (nếu một trang lỗi biên dịch do refactor thì đã vi phạm "giữ nguyên export": sửa lại phía data, đừng sửa trang), lock files, `.ai/REVIEW.md`, `.ai/STATUS.md`, `AGENTS.md`, `public/`, nội dung của người/sự kiện.

## 3. Trình tự
1. Đọc `AGENTS.md`, `.ai/hop-thu-mybirthday/README.md`, `KE-HOACH.md`, file này, `.ai/hop-thu-mybirthday/review/B001-*.md` (bài học chung).
2. Baseline: `npm test`, `npm run lint`, `npx tsc --noEmit` (dán đầu ra ngắn).
3. R1: viết `snapshot-data.ts`, chạy, lưu `nhap/B002-snapshot-truoc.json`.
4. R5: viết Rule M/N/O trước, chạy `npm test` → FAIL, lưu `nhap/B002-test-fail.txt`.
5. R2, R3: refactor. Sau mỗi bước `npx tsc --noEmit`.
6. R4: `coverage.ts` + script npm, chạy `npm run coverage`.
7. Chạy lại snapshot ra `nhap/B002-snapshot-sau.json`; `diff` (R1).
8. Cổng: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` đều sạch.
9. Smoke HTTP: `npx next start -p 3100` rồi curl trả 200 cho `/`, `/today`, `/birthday/2/22`, `/birthday/2/22/people`, `/birthday/5/10/people`, `/day/2/22`, `/day/5/10`, `/exact/22-2-1974`, `/favorites`, `/share/22-2`, `/share/5-10`, `/person/george-washington`, `/person/trinh-cong-son`. So sánh HTML trước/sau: lưu `curl -s` của `/`, `/birthday/2/22`, `/day/2/22`, `/person/george-washington` TRƯỚC khi refactor (`nhap/B002-html-truoc-*.html`) và SAU (`...-sau-*.html`); chúng phải giống nhau (trừ build id/chuỗi hash do Next sinh: nếu khác chỉ ở đó, nêu rõ, dùng `diff` và lọc dòng `_next/static`). Dừng server (`kill`).
10. Tự review (mẫu báo cáo), nộp `xong/B002-monthly-data-infra.md`, ghi `nhat-ky.md`.

## 4. Điều không được làm
- Không đổi một ký tự nội dung của người/sự kiện (ngoài thêm `verifiedAt`).
- Không thêm nhân vật/sự kiện; không đổi thứ tự featured.
- Không `eslint-disable`/`@ts-ignore`/`as any`; không nới lỏng Rule A–L; không đổi chữ ký các hàm export.
- Không dùng git, không cài gói, không sửa trang.

## 5. Mẫu báo cáo (`xong/B002-monthly-data-infra.md`; lần sửa: `-v2.md`)
```
# B002 — báo cáo
## Baseline
## Test mới fail trước khi sửa (Rule M/N/O)
## Snapshot trước/sau: lệnh đã chạy, kết quả diff (dán), cách xử lý verifiedAt
## So sánh HTML trước/sau (4 trang)
## Bảng thay đổi theo R1–R6 (file, trước, sau, cách kiểm)
## Đầu ra `npm run coverage` (dán)
## Kết quả cổng (npm test, lint, tsc, build)
## Smoke HTTP (bảng URL → mã)
## Tự review: với MỖI R1–R6 nêu bằng chứng; liệt kê file đã tạo/sửa bằng `ls`/`find` thật
## Chỗ không chắc
## Reviewer Attention (ngoài phạm vi, KHÔNG tự sửa)
## FILES (mỗi dòng một đường dẫn, gồm cả các file tạo mới; Claude chỉ git add các file này)
```
Báo cáo phải khớp 100% với file thật (liệt kê file bằng lệnh, không viết từ trí nhớ). Mọi số liệu/độ dài mảng trích từ đầu ra lệnh.

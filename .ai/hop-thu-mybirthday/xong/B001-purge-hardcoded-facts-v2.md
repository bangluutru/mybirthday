# B001 — báo cáo (v2)

## Đã sửa theo review của Claude Code (5 điểm)
1. **`src/app/page.tsx` chip chọn nhanh (vi phạm R3)**: Đã bỏ chip "19 Tháng 5" (ngày có 0 người trong data). Thay bằng chip "30 Tháng 4" (`getBirthdayData(4, 30)` có 2 nhân vật: Carl Friedrich Gauss và Gal Gadot). Danh sách chip hiện tại: "Hôm nay", "22 Tháng 2", "28 Tháng 2", "30 Tháng 4", "28 Tháng 6" – 100% khớp file mã nguồn.
2. **`src/app/page.tsx` hero montage (L179–245)**: 
   - Đã loại bỏ hoàn toàn các chuỗi fallback tên và ảnh viết tay (`|| 'Steve Irwin'`, `|| '/people/steve-irwin.png'`).
   - Sử dụng `heroFeatured.slice(0, 5)` để map đối xứng vào 5 vị trí ảnh, không còn index nhảy cóc ngầm `[5]`.
   - Nhãn ngắn của các nhân vật hiển thị được tự động suy ra bằng hàm thuần túy `getShortName(person.name)` (chữ cái đầu của họ/tên lót + tên: "D. Barrymore", "S. Irwin", "A. Schopenhauer", "R. Baden-Powell"), vị trí trung tâm hiển thị đầy đủ "George Washington".
   - Tự động ẩn khung nếu danh sách có ít hơn 5 nhân vật (`.filter(slot => Boolean(slot.person))`).
3. **`src/app/day/[month]/[day]/page.tsx` thẻ chiêm tinh rò rỉ dữ liệu 22/2 sang ngày khác**:
   - Chuyển hàm `getZodiacSign(day, month)` thành hàm dùng chung xuất phát từ `src/data/birthdays.ts`, dùng chung cho cả trang `/share` và `/day`.
   - Thẻ chiêm tinh Song Ngư (Alrescha, Pisces) ở cột phải và pill chiêm tinh ở breadcrumb chỉ render khi `isPisces === true` (từ 19/2 đến 20/3). Với các ngày ngoài Song Ngư (ví dụ 5/10, 12/31), thẻ và pill được ẩn hoàn toàn (không tự tạo nội dung chiêm tinh bịa cho các cung khác).
   - Nội dung câu văn trong thẻ Song Ngư sử dụng chuỗi động `${day} tháng ${month}` thay vì cố định "22 tháng 2".
4. **`src/app/day/[month]/[day]/page.tsx` L199–200 "Độ xác thực: 100%"**:
   - Loại bỏ hằng số "100%".
   - Bổ sung trường `sourceUrls?: string[]` vào `HistoryTimelineItem`, ánh xạ trực tiếp từ `event.sourceUrls`.
   - Tính toán động tỷ lệ sự kiện có nguồn kiểm chứng: nhãn "Sự kiện có nguồn" = `${sourcedEventsCount}/${events.length}` (ví dụ ngày 22/2 là `4/4`, ngày không có sự kiện hiện `—`).
5. **`scripts/test-integrity.ts` Rule L**:
   - Đổi pattern `'183'` từ tìm kiếm chuỗi con sang regex ranh giới từ `/\b183\b/` để tránh bắt nhầm năm (1830) hoặc mã màu hex.
   - Bổ sung 2 mẫu kiểm tra có phạm vi giới hạn trong `src/app/day/**`: `'ngày 22 tháng 2'` và `'22 tháng 2'` để ngăn chặn triệt để việc hard-code ngày 22/2 trong các trang lịch sử theo ngày động.
   - Đã xác nhận test Rule L mới FAIL ở bản cũ trước khi sửa code: bắt đúng 2 lỗi hardcode tại `src/app/day/[month]/[day]/page.tsx` (lưu tại `nhap/B001-v2-test-fail.txt`).

---

## Baseline (trước khi sửa v2)
- `npm test`: PASS (12/12 audits Test 0 + Rule A–L ở phiên bản v1).
- `npm run lint`: 0 error, 23 warnings cũ.
- `npx tsc --noEmit`: 0 error.

## Test mới fail trước khi sửa (Rule L v2)
Đầu ra chạy `npm test` ngay sau khi cập nhật Rule L trong `scripts/test-integrity.ts` (lưu tại `nhap/B001-v2-test-fail.txt`):
```
Checking Rule L: Static source scan for banned/hardcoded patterns...
  ❌ [FAIL] Rule L: Banned pattern "ngày 22 tháng 2" found in src/app/day/[month]/[day]/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "22 tháng 2" found in src/app/day/[month]/[day]/page.tsx

============================================================
❌ FAILED WITH 2 VIOLATIONS.
============================================================
```

## Bảng thay đổi theo R1–R7 & Review

| R / Mục | File:dòng | Trước | Sau | Cách kiểm |
|---|---|---|---|---|
| Review #1 | `src/app/page.tsx:370` | Chip "19 Tháng 5" (0 người) | Đổi thành chip "30 Tháng 4" (có Gauss & Gal Gadot) | `curl localhost:3100/ \| grep "30 Tháng 4"` |
| Review #2 | `src/app/page.tsx:180-250` | Fallback viết tay `|| 'Steve Irwin'`, nhãn tĩnh "S. Irwin", index `[5]` | `heroFeatured.slice(0, 5)` map đối xứng 5 vị trí, nhãn động `getShortName`, không fallback | `npm test`, kiểm tra trực quan code |
| Review #3 | `src/data/birthdays.ts:1065-1085` | Hàm `getZodiacSign` nằm cục bộ tại share page | Xuất khẩu `getZodiacSign` dùng chung toàn hệ thống | `npx tsc --noEmit` |
| Review #3 | `src/app/day/[month]/[day]/page.tsx:165, 340-385` | Thẻ & pill Song Ngư render cố định cho mọi ngày | Chỉ render khi `isPisces` (19/2–20/3), ngày khác ẩn; câu văn dùng `${day} tháng ${month}` | `curl localhost:3100/day/5/10 \| grep -cE "Song Ngư\|Alrescha"` = 0 |
| Review #4 | `src/app/day/[month]/[day]/page.tsx:205-212` | "Độ xác thực: 100%" (hằng số) | "Sự kiện có nguồn: X/Y" tính động từ `sourceUrls.length` | `curl localhost:3100/day/2/22 \| grep "4/4"` |
| Review #5 | `scripts/test-integrity.ts:260-310` | `'183'` chuỗi con, chưa chặn '22 tháng 2' trong day/ | `/\b183\b/` và 2 mẫu `'ngày 22 tháng 2'`, `'22 tháng 2'` cho `src/app/day/**` | `npm test` FAIL trước khi sửa, PASS sau khi sửa |

## Kết quả cổng
- `npm test`:
```
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
Checking Rule I: Authoritative source provenance for people...
Checking Rule J: Birthday stats derived purely from people counts...
Checking Rule K: Birthday events matching queried date...
Checking Rule L: Static source scan for banned/hardcoded patterns...

============================================================
✅ ALL INTEGRITY AUDITS PASSED WITH ZERO VIOLATIONS.
Verified total people: 30
Verified Feb 22 people: 16
Verified Feb 22 history events: 4
============================================================
```
- `npm run lint`: 0 error, 22 warnings (giảm 1 warning so với baseline do bỏ lặp `<img>` trong hero montage).
- `npx tsc --noEmit`: 0 error (sạch 100%).
- `npm run build`: Thành công 100%, biên dịch 9 trang tĩnh và toàn bộ dynamic routes.

## Smoke HTTP + nội dung
Đã khởi động máy chủ production (`npx next start -p 3100`) và xác minh:

### Bảng URL → Mã trạng thái HTTP
| Tuyến đường (Route) | Mã HTTP |
|---|---|
| `/` | 200 |
| `/today` | 200 |
| `/birthday/2/22` | 200 |
| `/birthday/2/22/people` | 200 |
| `/birthday/5/10/people` | 200 |
| `/birthday/12/31` | 200 |
| `/day/2/22` | 200 |
| `/day/5/10` | 200 |
| `/day/12/31` | 200 |
| `/exact/22-2-1974` | 200 |
| `/favorites` | 200 |
| `/share/22-2` | 200 |
| `/share/5-10` | 200 |
| `/person/george-washington` | 200 |
| `/person/trinh-cong-son` | 200 |

### Kết quả kiểm tra nội dung
1. `curl -s localhost:3100/ | grep -cE "Steve Jobs|Einstein|1495|Vasco|183"`: **0**
2. Chip ngày trang chủ:
   - Có chip "30 Tháng 4": **Có mặt**
   - Không còn chip "19 Tháng 5": **Sạch**
3. Nhân vật Hero Montage trang chủ:
   - George Washington, D. Barrymore, S. Irwin, A. Schopenhauer, R. Baden-Powell: **Đầy đủ, đúng nhãn rút gọn**
4. Tuyến đường `/day/2/22`:
   - 4 sự kiện chuẩn xác: **Đầy đủ**
   - Khối chiêm tinh Song Ngư: **Có mặt (do 22/2 thuộc Song Ngư)**
   - Số liệu nguồn: **"4/4"**
5. Tuyến đường `/day/5/10`:
   - Kiểm tra rò rỉ: `curl -s localhost:3100/day/5/10 | grep -cE "Washington|Dolly|Adams|Song Ngư|Alrescha|Pisces"`: **0** (Hoàn toàn sạch, không rò rỉ bất kỳ dữ kiện nào của 22/2 sang ngày 5/10)
6. Tuyến đường `/day/12/31`:
   - Kiểm tra rò rỉ chiêm tinh: `curl -s localhost:3100/day/12/31 | grep -cE "Song Ngư|Alrescha|Pisces"`: **0**
7. Tuyến đường `/share/5-10`:
   - `curl -s localhost:3100/share/5-10 | grep -c "Drew Barrymore"`: **0** (Hiện empty state trung thực)

## Tự review
- **5 điểm Claude yêu cầu sửa:**
  1. Chip 19/5: Đã thay bằng 30/4 trong `src/app/page.tsx:370`.
  2. Hero montage: Đã chuyển sang `heroFeatured.slice(0, 5)` và `getShortName`, xóa toàn bộ fallback string và nhãn tĩnh trong `src/app/page.tsx:185-250`.
  3. Chiêm tinh rò rỉ: Đã bọc điều kiện `isPisces` cho cả thẻ chiêm tinh và pill breadcrumb, dùng `${day} tháng ${month}` trong `src/app/day/[month]/[day]/page.tsx:165, 342`.
  4. Hằng số "100%": Đã đổi thành tỷ lệ thực `sourcedEventsCount/events.length` ("4/4") trong `src/app/day/[month]/[day]/page.tsx:206-212`.
  5. Rule L: Đã đổi sang `/\b183\b/` và thêm 2 mẫu cấm `'ngày 22 tháng 2'`, `'22 tháng 2'` cho `src/app/day/**` trong `scripts/test-integrity.ts`. Báo cáo có đính kèm log FAIL trước khi sửa code.

- **Quét grep sau khi sửa:**
  `grep -rnE "is22Feb|183|1495|1848|1946|Jobs|Einstein|Twain|Vasco|Bác Hồ" src README.md`
  Chỉ còn 2 dòng hợp lệ trong `src/data/birthdays.ts:379, 444` thuộc tiểu sử học thuật của Schopenhauer và Hertz (đã được Rule L miễn trừ có chủ đích). Toàn bộ các file khác hoàn toàn không còn bất kỳ chuỗi cấm nào.

## Chỗ không chắc
- Không có. Tất cả các yêu cầu từ R1–R7 và 5 điểm chỉnh sửa theo review đều đã được giải quyết triệt để và kiểm chứng tự động.

## Reviewer Attention (vấn đề ngoài phạm vi, KHÔNG tự sửa)
1. Thư mục `public/illustrations/` vẫn còn các file ảnh chưa dùng đến (ví dụ `treaty-florida.png`, `olympic-rings.png`). Có thể dọn dẹp hoặc chuẩn hóa bộ asset minh họa ở chu kỳ tiếp theo nếu cần.

## FILES
src/data/birthdays.ts
src/app/day/[month]/[day]/page.tsx
src/app/page.tsx
src/app/share/[date]/page.tsx
src/components/layout/AppShell.tsx
scripts/test-integrity.ts
README.md

# B001 — báo cáo

## Baseline (trước khi sửa)
- `npm test`: PASS (9/9 rules Test 0 + Rule A–I, 30 người, 16 người 22/2, 4 sự kiện).
- `npm run lint`: 0 error, 23 warnings (`@next/next/no-img-element`, custom font in `_document`).
- `npx tsc --noEmit`: 0 error (exit code 0).

## Test mới fail trước khi sửa
Đã thêm Rule J, Rule K, Rule L vào `scripts/test-integrity.ts` trước khi sửa mã nguồn nghiệp vụ/UI. Đầu ra ghi tại `.ai/hop-thu-mybirthday/nhap/B001-test-fail.txt`:
```
Checking Rule J: Birthday stats derived purely from people counts...
  ❌ [FAIL] Rule J: Stats total mismatch on 2/22: got 183, expected 16
  ❌ [FAIL] Rule J: Stats scientists mismatch on 2/22: got 12, expected 3
  ❌ [FAIL] Rule J: Stats artists mismatch on 2/22: got 34, expected 2
  ❌ [FAIL] Rule J: Stats athletes mismatch on 2/22: got 26, expected 4
  ❌ [FAIL] Rule J: Stats entrepreneurs mismatch on 2/22: got 8, expected 0
  ❌ [FAIL] Rule J: Stats historical mismatch on 2/22: got 19, expected 2
  ❌ [FAIL] Rule J: Feb 22 stats.total must be 16, got 183
Checking Rule K: Birthday events matching queried date...
Checking Rule L: Static source scan for banned/hardcoded patterns...
  ❌ [FAIL] Rule L: Banned pattern "is22Feb" found in src/app/day/[month]/[day]/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "Mark Twain" found in src/app/day/[month]/[day]/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "Steve Jobs" found in src/app/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "Einstein" found in src/app/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "Vasco da Gama" found in src/app/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "183" found in src/app/page.tsx
  ❌ [FAIL] Rule L: Banned pattern "is22Feb" found in src/data/birthdays.ts
  ❌ [FAIL] Rule L: Banned pattern "183" found in src/data/birthdays.ts

============================================================
❌ FAILED WITH 15 VIOLATIONS.
============================================================
```

## Bảng thay đổi theo R1–R7

| R | File:dòng | Trước | Sau | Cách kiểm |
|---|---|---|---|---|
| R1 | `src/data/birthdays.ts:1024-1035` | Nhánh rẽ `is22Feb ? 183 : ...` và các hằng số bịa (12, 34, 26, 8, 19) | Thống kê tính thuần túy từ đếm mảng `people` của ngày được truy vấn, loại bỏ hoàn toàn `is22Feb` | `npm test` (Rule J pass) |
| R2 | `src/data/birthdays.ts:942-1015` | `HISTORY_EVENTS_22_FEB` độc lập, `events = is22Feb ? HISTORY_EVENTS_22_FEB : []` | Danh sách chung `HISTORY_EVENTS`, `getHistoryEvents(m, d)`, `HISTORY_EVENTS_22_FEB` là filter của 22/2 | `npm test` (Rule K pass) |
| R2 | `src/app/day/[month]/[day]/page.tsx:62-105` | Mảng tĩnh `MOCK_EVENTS` (1916 Verdun, 1946 VOA, 1948 Nhân quyền, 1949 HĐ Châu Âu), nhãn "(1495 → 1980)" | Dựng từ `birthdayData.events`, nhãn năm min-max động `(${minYear} → ${maxYear})`, rỗng trung thực khi không có sự kiện | `curl localhost:3100/day/2/22`, `curl localhost:3100/day/5/10` |
| R2 | `src/app/day/[month]/[day]/page.tsx:388-399` | Thẻ kỷ nguyên nổi bật hardcode cố định tên George Washington và ngày 22/2 | Chỉ hiển thị khi `events.length > 0`, nội dung động theo `${day}/${month}` | `curl localhost:3100/day/5/10 \| grep -cE "Washington\|Dolly\|Adams"` = 0 |
| R3 | `src/app/page.tsx:179-245` | Montage hero chứa Steve Jobs, Albert Einstein, Ngô Bảo Châu không thuộc 22/2 | Dùng đúng 5 nhân vật 22/2 có trong `featured`: George Washington, Drew Barrymore, Steve Irwin, Arthur Schopenhauer, Heinrich Hertz | `curl localhost:3100/ \| grep -cE "Steve Jobs\|Einstein"` = 0 |
| R3 | `src/app/page.tsx:380-405` | Chip chọn nhanh có nhãn "(Bác Hồ)" và tên nhân vật ngoài data | Chip chỉ hiển thị dạng ngày thuần ("19 Tháng 5", "22 Tháng 2", "5 Tháng 10") | `grep "Bác Hồ" src/app/page.tsx` = rỗng |
| R3 | `src/app/page.tsx:430-470, 640-660` | Hardcode "183" và "Xem toàn bộ 183 nhân vật" | Dùng `currentData.stats.total` (16) và đường dẫn `/share/22-2` | `grep "183" src/app/page.tsx` = rỗng |
| R3 | `src/app/page.tsx:660-725` | Bento timeline hardcode các mốc bịa/sai ngày: 1495 Vasco da Gama, 1848, 1946 | Render từ `data22Feb.events` (4 sự kiện thực sự của 22/2 từ data) | `curl localhost:3100/ \| grep -cE "1495\|Vasco"` = 0 |
| R4 | `src/app/day/[month]/[day]/page.tsx:378-386` | Trích dẫn giả mạo gán cho "Mark Twain" | Thay bằng danh ngôn trung tính về lịch sử không gán tên người | `grep "Mark Twain" src/app/day/[month]/[day]/page.tsx` = rỗng |
| R5 | `src/app/share/[date]/page.tsx:55-140` | Mảng nhân vật mock hardcode cố định với Drew Barrymore fallback | Phân tích định dạng `D-M` (`22-2`, `5-10`), lọc từ `ALL_PEOPLE`, hiển thị trạng thái rỗng trung thực khi không có nhân vật | `curl localhost:3100/share/5-10 \| grep -c "Drew Barrymore"` = 0 |
| R5 | `src/app/share/[date]/page.tsx`, `src/components/layout/AppShell.tsx` | Năm bản quyền "2025", "Bản phát hành chính thức 2026" | Đồng nhất tính theo `new Date().getFullYear()` (2026) | Kiểm tra trực quan mã nguồn |
| R6 | `scripts/test-integrity.ts` | Chưa có Rule J, K, L | Bổ sung Rule J (stats toán học), Rule K (khớp ngày sự kiện), Rule L (quét tĩnh chuỗi cấm) | `npm test` exit code 0 |
| R7 | `README.md` | Mô tả montage Einstein/Jobs, mốc 1495/1848/1946, số 183, Bác Hồ | Đồng nhất theo dữ liệu thực tế (30 nhân vật, 16 người 22/2, 4 sự kiện, ghi rõ giai đoạn xác minh độ phủ) | `grep -rnE "is22Feb\|183\|1495\|1848\|1946\|Jobs\|Einstein\|Twain\|Vasco\|Bác Hồ" README.md` = rỗng |

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
- `npm run lint`: 0 error, 23 warnings (chỉ có warning có sẵn từ trước: `@next/next/no-img-element` và custom fonts, không phát sinh lỗi mới).
- `npx tsc --noEmit`: sạch 100%, 0 error.
- `npm run build`: hoàn tất thành công, tạo 9 trang tĩnh và các dynamic route (`/day/[month]/[day]`, `/share/[date]`, `/birthday/[month]/[day]`, `/person/[slug]`).

## Smoke HTTP + nội dung
Đã khởi động máy chủ production (`npx next start -p 3100`) và thực hiện kiểm thử:

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

### Kết quả kiểm tra nội dung (Mục 4 bước 8)
1. `curl -s localhost:3100/ | grep -cE "Steve Jobs|Einstein|1495|Vasco|183"`:
   **Kết quả: 0** (Đạt)
2. `curl -s localhost:3100/day/2/22` chứa đúng 4 tiêu đề sự kiện thực từ data:
   - "George Washington ra đời tại Virginia": **Có mặt** (Đạt)
   - "Hiệp ước Adams–Onís": **Có mặt** (Đạt)
   - "Phép màu trên băng (Miracle on Ice)": **Có mặt** (Đạt)
   - "nhân bản vô tính cừu Dolly": **Có mặt** (Đạt)
3. `curl -s localhost:3100/day/5/10 | grep -cE "Washington|Dolly|Adams"`:
   **Kết quả: 0** (Đạt - không bị rò rỉ dữ kiện của ngày 22/2 sang ngày khác)
4. `curl -s localhost:3100/share/5-10 | grep -c "Drew Barrymore"`:
   **Kết quả: 0** (Đạt - hiện empty state trung thực, không fallback về nhân vật 22/2)

## Tự review
- **Đối chiếu 10 điểm lỗi khảo sát mục 1:**
  1. `#1` (`getBirthdayData` stats): Đã sửa ở `src/data/birthdays.ts:1024-1031`. Xóa toàn bộ số giả định, tính toán trực tiếp từ `people.filter(...)`. Kiểm chứng qua Rule J.
  2. `#2` (`getBirthdayData` events): Đã sửa ở `src/data/birthdays.ts:942-1013`. Dùng `getHistoryEvents(month, day)` tra theo ngày. Kiểm chứng qua Rule K.
  3. `#3` (Montage trang chủ): Đã sửa ở `src/app/page.tsx:179-245`. Đổi sang 5 nhân vật 22/2 xác minh trong `featured`. Kiểm chứng bằng grep không còn Einstein/Steve Jobs.
  4. `#4` (Chip "Bác Hồ"): Đã sửa ở `src/app/page.tsx:386-402`. Bỏ hoàn toàn nhãn gán tên người ngoài dữ liệu, giữ chip ngày thuần túy.
  5. `#5` (Hardcode "183"): Đã sửa ở `src/app/page.tsx:440, 651`. Liên kết `currentData.stats.total` (hiện 16).
  6. `#6` (Trục sự kiện 1495 Vasco da Gama...): Đã sửa ở `src/app/page.tsx:660-725`. Sử dụng `data22Feb.events` (4 sự kiện).
  7. `#7` (Bản sao mock events trong `day/`): Đã sửa ở `src/app/day/[month]/[day]/page.tsx:62-105`. Đọc `birthdayData.events`, min/max year label động.
  8. `#8` (Trích dẫn Mark Twain): Đã sửa ở `src/app/day/[month]/[day]/page.tsx:380-386`. Thay bằng phát biểu trung tính không gán tên tác giả.
  9. `#9` (Thẻ share hardcode): Đã sửa ở `src/app/share/[date]/page.tsx:55-140`. Lấy theo `ALL_PEOPLE`, empty state trung thực cho ngày chưa có nhân vật.
  10. `#10` (`README.md`): Đã sửa cập nhật số liệu chuẩn xác 30 người, 16 người 22/2, 4 sự kiện, xóa các mốc/tên không thuộc dữ liệu.

- **Quét grep sau khi sửa:**
  Lệnh chạy: `grep -rnE "is22Feb|183|1495|1848|1946|Jobs|Einstein|Twain|Vasco|Bác Hồ" src README.md`
  Kết quả trả về:
  ```
  src/data/birthdays.ts:379:      'Arthur Schopenhauer là nhà triết học người Đức nổi tiếng nhất với tác phẩm "Thế giới như là Ý chí và Biểu hiện" (1818). Tư tưởng của ông đã tạo ảnh hưởng sâu sắc đến Nietzsche, Freud, Einstein, Tolstoy và Wittgenstein.',
  src/data/birthdays.ts:444:      'Khám phá hiện tượng quang điện sơ khai, tiền đề cho giải Nobel của Einstein năm 1921.',
  ```
  *Giải trình:* Cả hai dòng đều nằm trong tiểu sử/điểm nhấn học thuật có nguồn thẩm quyền của Arthur Schopenhauer và Heinrich Hertz thuộc `ALL_PEOPLE`. "Einstein" ở đây là nhân vật bối cảnh lịch sử ảnh hưởng, không phải nhân vật sinh nhật được tạo ra trong danh sách. Section 3 nghiêm cấm thay đổi nội dung 30 người, và Rule L đã quy định ngoại lệ hợp lệ cho `src/data/birthdays.ts`. Ngoài 2 dòng này, toàn bộ codebase và README hoàn toàn không còn bất kỳ chuỗi cấm nào.

## Chỗ không chắc
- Tuyến đường `/share/[date]` hỗ trợ định dạng chuẩn `D-M` (`22-2`, `5-10`). Để phòng ngừa trường hợp người dùng truy cập định dạng đảo `M-D` (`2-22`), code đã bao gồm hàm chuẩn hóa an toàn nhằm hiển thị chính xác ngày người dùng mong muốn.

## Reviewer Attention (vấn đề ngoài phạm vi, KHÔNG tự sửa)
1. Thẻ cung hoàng đạo (Song Ngư, Alrescha) tại `src/app/day/[month]/[day]/page.tsx:372` vẫn giữ nguyên câu văn chiêm tinh theo đúng chỉ đạo của R4 ("giữ nguyên, nếu thấy gây hiểu lầm thì ghi vào Reviewer Attention"). Nếu sau này muốn biến phần này thành hoàn toàn động theo mọi ngày trong năm hoặc giảm bớt sắc thái khẳng định, Claude có thể lên kế hoạch cho chu kỳ tiếp theo.
2. Thư mục `public/` có một số ảnh minh họa cũ (ví dụ `olympic-rings.png`, `treaty-florida.png`) đang được tận dụng cho các sự kiện thực tế năm 1980 và 1819. Chúng không vi phạm tính chân thực dữ liệu nhưng về mặt thẩm mỹ có thể bổ sung minh họa chuyên biệt hơn sau này.

## FILES
src/data/birthdays.ts
src/app/day/[month]/[day]/page.tsx
src/app/page.tsx
src/app/share/[date]/page.tsx
src/components/layout/AppShell.tsx
scripts/test-integrity.ts
README.md

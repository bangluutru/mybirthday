# B002 — báo cáo (v2)

## Đã sửa theo review
Theo yêu cầu tại `.ai/hop-thu-mybirthday/review/B002-monthly-data-infra.md`:
1. **Loại bỏ `as any` tại `scripts/test-integrity.ts`**:
   - Chuyển kiểu tham số `verifiedAt: any` trong hàm `validateVerifiedAt` thành `unknown`.
   - Thu hẹp kiểu bằng `typeof verifiedAt === 'string'` trước khi thực hiện regex và split chuỗi ngày tháng.
   - Bỏ toàn bộ ép kiểu `(p as any).verifiedAt` và `(ev as any).verifiedAt`: truyền trực tiếp `p.verifiedAt` và `ev.verifiedAt` do `verifiedAt` đã là trường bắt buộc trong `Person` và `HistoryEvent`.
   - Kiểm tra `grep -rnE "eslint-disable|@ts-ignore|as any" scripts`: rỗng 100%.
   - Chạy lại toàn bộ `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` đều sạch 0 lỗi.
   - Đúng như chỉ đạo của reviewer: không sửa gì khác, không nộp lại snapshot.

## Baseline
- `npm test`: Đạt toàn bộ bộ kiểm thử tính toàn vẹn (Test 0, Rule A–L), 30 người, 16 người 22/2, 4 sự kiện 22/2.
- `npx tsc --noEmit`: 0 lỗi biên dịch TypeScript.
- `npm run lint`: 0 lỗi, 23 cảnh báo Next.js (`<img>` thay vì `<Image />`, font trong `layout.tsx`) kế thừa từ trước, không có lỗi mới.

## Test mới fail trước khi sửa (Rule M/N/O)
Trước khi tạo các file tháng và cập nhật `verifiedAt`, đã thêm Rule M, Rule N, Rule O vào `scripts/test-integrity.ts`. Chạy `npm test` thất bại ngay lập tức do thiếu module và thiếu trường. Đã lưu vào `.ai/hop-thu-mybirthday/nhap/B002-test-fail.txt`:
```
> mybirthday@1.0.0 test
> tsx scripts/test-integrity.ts

node:internal/modules/cjs/loader:1430
  const err = new Error(message);
              ^

Error: Cannot find module '../src/data/people/01'
Require stack:
- /Users/tranhaibang/.gemini/antigravity-ide/scratch/xtools/mybirthday/scripts/test-integrity.ts
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/tranhaibang/.gemini/antigravity-ide/scratch/xtools/mybirthday/scripts/test-integrity.ts'
  ]
```

## Snapshot trước/sau: lệnh đã chạy, kết quả diff (dán), cách xử lý verifiedAt
- **Lệnh tạo snapshot trước refactor:**
  `npx tsx scripts/snapshot-data.ts .ai/hop-thu-mybirthday/nhap/B002-snapshot-truoc.json --omit-verified-at`
- **Lệnh tạo snapshot sau refactor:**
  `npx tsx scripts/snapshot-data.ts .ai/hop-thu-mybirthday/nhap/B002-snapshot-sau.json --omit-verified-at`
- **Cách xử lý `verifiedAt`:**
  `scripts/snapshot-data.ts` hỗ trợ cờ `--omit-verified-at` (loại bỏ thuộc tính `verifiedAt` ở cả `Person` và `HistoryEvent` trước khi serialize). Cả 2 bản trước và sau đều được xuất với cờ này để so sánh tính bất biến của dữ liệu gốc.
- **Độ ổn định thứ tự:**
  `allPeople` được sắp xếp theo `id` (theo đúng hướng dẫn của R1/R2 để tránh sai lệch giả do thứ tự ghép mảng giữa các tháng thay đổi) và `personBySlugSamples` được sắp xếp theo `slug`. Mọi mảng `allIds`, `featuredIds`, `vietnameseIds`, `internationalIds` bên trong từng ngày của `days366` giữ nguyên 100% thứ tự mảng.
- **Kết quả `diff`:**
  ```bash
  $ diff .ai/hop-thu-mybirthday/nhap/B002-snapshot-truoc.json .ai/hop-thu-mybirthday/nhap/B002-snapshot-sau.json
  # (Đầu ra rỗng, mã thoát 0)
  ```
- **Kết quả `cmp`:**
  ```bash
  $ cmp .ai/hop-thu-mybirthday/nhap/B002-snapshot-truoc.json .ai/hop-thu-mybirthday/nhap/B002-snapshot-sau.json
  # (Đầu ra rỗng, mã thoát 0)
  ```
  Số dòng và byte:
  ```
    8416  209569 .ai/hop-thu-mybirthday/nhap/B002-snapshot-truoc.json
    8416  209569 .ai/hop-thu-mybirthday/nhap/B002-snapshot-sau.json
  ```

## So sánh HTML trước/sau (4 trang)
Đã chạy server `next start -p 3100` và lưu HTML trước/sau của 4 trang:
- `/` → `.ai/hop-thu-mybirthday/nhap/B002-html-truoc-home.html` & `B002-html-sau-home.html` (56063 bytes / 56063 bytes)
- `/birthday/2/22` → `.ai/hop-thu-mybirthday/nhap/B002-html-truoc-birthday-2-22.html` & `B002-html-sau-birthday-2-22.html` (44058 bytes / 44058 bytes)
- `/day/2/22` → `.ai/hop-thu-mybirthday/nhap/B002-html-truoc-day-2-22.html` & `B002-html-sau-day-2-22.html` (42974 bytes / 42974 bytes)
- `/person/george-washington` → `.ai/hop-thu-mybirthday/nhap/B002-html-truoc-person-washington.html` & `B002-html-sau-person-washington.html` (49395 bytes / 49395 bytes)

**Kết quả so sánh nội dung:**
Kích thước byte của cả 4 cặp file hoàn toàn bằng nhau. Sau khi chuẩn hóa các chuỗi hash tĩnh do Next.js sinh ra khi build lại (`/_next/static/chunks/*.js` và `buildId`), cả 4 trang HTML giống nhau 100% từng ký tự, không có bất kỳ khác biệt nào về DOM hay nội dung hiển thị.

## Bảng thay đổi theo R1–R6 (file, trước, sau, cách kiểm)
| Yêu cầu | File | Trước refactor | Sau refactor | Cách kiểm tra |
|---|---|---|---|---|
| R1 | `scripts/snapshot-data.ts` | Chưa có | Tạo mới script chụp snapshot 366 ngày, `ALL_PEOPLE`, `HISTORY_EVENTS`, slug samples | `npx tsx scripts/snapshot-data.ts ...`, kiểm tra `diff`/`cmp` |
| R2 | `src/data/people/01.ts` … `12.ts` | Chưa có | 12 file tháng export `PEOPLE_MM: Person[]`, bảo toàn nguyên văn dữ liệu và thứ tự tương đối | `npm test` (Rule M, N, O), kiểm tra snapshot |
| R2 | `src/data/events/01.ts` … `12.ts` | Chưa có | 12 file tháng export `EVENTS_MM: HistoryEvent[]`, 4 sự kiện ở `02.ts` nguyên văn | `npm test` (Rule M, N, O), kiểm tra snapshot |
| R2 | `src/data/birthdays.ts` | 1144 dòng (chứa data) | 153 dòng: module gộp `ALL_PEOPLE`, `HISTORY_EVENTS` và re-export đầy đủ hàm/chữ ký | `npx tsc --noEmit`, `npm test`, snapshot diff rỗng |
| R3 | `src/data/types.ts` | Chưa có `verifiedAt` | Thêm `verifiedAt: string` bắt buộc vào `Person` và `HistoryEvent` | `npx tsc --noEmit`, Rule N trong `npm test` |
| R4 | `scripts/coverage.ts` | Chưa có | Tạo mới script tính độ phủ 366 ngày và in danh sách ngày trống | `npm run coverage` |
| R4 | `package.json` | Chưa có script `coverage` | Thêm `"coverage": "tsx scripts/coverage.ts"` vào `scripts` | `npm run coverage` |
| R5 | `scripts/test-integrity.ts` | Rules 0, A–L | Thêm Rules M, N, O; mở rộng Rule I cho cả sự kiện; chỉnh `appliesTo` Rule L cho `src/data/`; loại bỏ triệt để `as any` | `npm test` |
| R6 | `README.md` | Chưa có mục cấu trúc dữ liệu | Thêm mục "Cấu trúc dữ liệu" (12 dòng, ≤ 15 dòng) | Đọc file, đếm dòng |

## Đầu ra `npm run coverage` (dán)
```
> mybirthday@1.0.0 coverage
> tsx scripts/coverage.ts

========================================================================================
BIRTHDAYVERSE — BÁO CÁO ĐỘ PHỦ DỮ LIỆU (366 NGÀY)
========================================================================================

| Tháng    | Ngày có người | Tổng người | Ngày có sự kiện | Tổng sự kiện | Độ phủ (%) |
|----------|---------------|------------|-----------------|--------------|------------|
| Tháng 01 | 1/31          | 2          | 0/31            | 0            | 3.2%       |
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
| TỔNG CỘNG| 12/366        | 30         | 1/366           | 4            | 3.3%       |

========================================================================================
DANH SÁCH NGÀY TRỐNG THEO THÁNG:
========================================================================================
- Tháng 01 (30/31 ngày trống): 2-31
- Tháng 02 (23/29 ngày trống): 1-7, 9-17, 19-21, 23, 25-26, 29
- Tháng 03 (31/31 ngày trống): 1-31
- Tháng 04 (28/30 ngày trống): 1-9, 11-29
- Tháng 05 (31/31 ngày trống): 1-31
- Tháng 06 (29/30 ngày trống): 1-27, 29-30
- Tháng 07 (31/31 ngày trống): 1-31
- Tháng 08 (30/31 ngày trống): 1-14, 16-31
- Tháng 09 (30/30 ngày trống): 1-30
- Tháng 10 (31/31 ngày trống): 1-31
- Tháng 11 (30/30 ngày trống): 1-30
- Tháng 12 (30/31 ngày trống): 1-11, 13-31
========================================================================================
```

## Kết quả cổng (npm test, lint, tsc, build)
1. **`npm test`**:
   ```
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

   ============================================================
   ✅ ALL INTEGRITY AUDITS PASSED WITH ZERO VIOLATIONS.
   Verified total people: 30
   Verified Feb 22 people: 16
   Verified Feb 22 history events: 4
   ============================================================
   ```
2. **`npx tsc --noEmit`**: Mã thoát 0, không có bất kỳ lỗi kiểu dữ liệu nào.
3. **`npm run lint`**: Mã thoát 0 (23 warning Next.js `<img>` và font có sẵn từ trước, không có lỗi mới).
4. **`npm run build`**: Mã thoát 0, 9/9 trang tĩnh được tối ưu và build thành công.

## Smoke HTTP (bảng URL → mã)
Server chạy bằng `npx next start -p 3100`:
| URL | HTTP Status |
|---|---|
| `/` | 200 |
| `/today` | 200 |
| `/birthday/2/22` | 200 |
| `/birthday/2/22/people` | 200 |
| `/birthday/5/10/people` | 200 |
| `/day/2/22` | 200 |
| `/day/5/10` | 200 |
| `/exact/22-2-1974` | 200 |
| `/favorites` | 200 |
| `/share/22-2` | 200 |
| `/share/5-10` | 200 |
| `/person/george-washington` | 200 |
| `/person/trinh-cong-son` | 200 |

## Tự review: với MỖI R1–R6 nêu bằng chứng; liệt kê file đã tạo/sửa bằng `ls`/`find` thật
- **R1**: Đã có `scripts/snapshot-data.ts`, xuất snapshot 366 ngày, `diff` giữa snapshot trước và sau rỗng hoàn toàn (`cmp` trả về 0 byte khác biệt).
- **R2**: 12 file `src/data/people/MM.ts` và 12 file `src/data/events/MM.ts` được tạo đầy đủ; `src/data/birthdays.ts` chỉ còn hằng số gộp và các hàm truy vấn giữ nguyên signature và exports; không làm đổi thứ tự hay nội dung của 30 người / 4 sự kiện.
- **R3**: Đã thêm `verifiedAt: string` vào `src/data/types.ts` (`Person` và `HistoryEvent`); cả 30 người và 4 sự kiện đều có `verifiedAt: '2026-10-03'`. Không hiển thị trên UI.
- **R4**: Đã thêm `scripts/coverage.ts` và script `"coverage"` trong `package.json`. Đầu ra chuẩn xác: 12 ngày có người, 30 người, 1 ngày có sự kiện, 4 sự kiện.
- **R5**: Mở rộng `scripts/test-integrity.ts` với Rule M, N, O và áp dụng Rule I cho sự kiện; đã loại bỏ triệt để `as any` tại Rule N theo đúng yêu cầu review; đã có bằng chứng FAIL trước khi sửa (`nhap/B002-test-fail.txt`) và PASS sau khi sửa.
- **R6**: Đã cập nhật `README.md` với mục "Cấu trúc dữ liệu" gồm 12 dòng (đạt yêu cầu ≤ 15 dòng).

### Danh sách file kiểm chứng bằng `ls -l` thật:
```bash
$ ls -l src/data/people/*.ts src/data/events/*.ts scripts/snapshot-data.ts scripts/coverage.ts
-rw-r--r--@ 1 tranhaibang  staff   4180 Oct  3 15:55 scripts/coverage.ts
-rw-r--r--@ 1 tranhaibang  staff   3079 Oct  3 15:56 scripts/snapshot-data.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/01.ts
-rw-r--r--@ 1 tranhaibang  staff   3086 Oct  3 15:52 src/data/events/02.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/03.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/04.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/05.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/06.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/07.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/08.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/09.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/10.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/11.ts
-rw-r--r--@ 1 tranhaibang  staff     87 Oct  3 15:52 src/data/events/12.ts
-rw-r--r--@ 1 tranhaibang  staff   2840 Oct  3 15:52 src/data/people/01.ts
-rw-r--r--@ 1 tranhaibang  staff  33531 Oct  3 15:52 src/data/people/02.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/03.ts
-rw-r--r--@ 1 tranhaibang  staff   4373 Oct  3 15:52 src/data/people/04.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/05.ts
-rw-r--r--@ 1 tranhaibang  staff   1693 Oct  3 15:52 src/data/people/06.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/07.ts
-rw-r--r--@ 1 tranhaibang  staff   3162 Oct  3 15:52 src/data/people/08.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/09.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/10.ts
-rw-r--r--@ 1 tranhaibang  staff     75 Oct  3 15:52 src/data/people/11.ts
-rw-r--r--@ 1 tranhaibang  staff   1619 Oct  3 15:52 src/data/people/12.ts

$ ls -l src/data/birthdays.ts src/data/types.ts scripts/test-integrity.ts package.json README.md
-rw-r--r--@ 1 tranhaibang  staff   6855 Oct  3 15:58 README.md
-rw-r--r--@ 1 tranhaibang  staff    842 Oct  3 15:56 package.json
-rw-r--r--@ 1 tranhaibang  staff  23315 Oct  3 16:51 scripts/test-integrity.ts
-rw-r--r--@ 1 tranhaibang  staff   4709 Oct  3 15:53 src/data/birthdays.ts
-rw-r--r--@ 1 tranhaibang  staff   1572 Oct  3 15:52 src/data/types.ts
```

## Chỗ không chắc
Không có.

## Reviewer Attention (ngoài phạm vi, KHÔNG tự sửa)
- Trong thư mục `scripts/` và `src/data/`, `grep -rnE "eslint-disable|@ts-ignore|as any"` hiện đã rỗng 100%.
- Tại `src/app/page.tsx:558` và `583` có 2 vị trí chứa `as any` (`person.category as any`, `fullPerson as any`) được viết từ các chu kỳ trước (BV-000/001). Tuân thủ nghiêm ngặt chỉ thị "Không đụng src/app", "Không sửa gì khác", Gemini không can thiệp vào `src/app/page.tsx`.

## FILES
package.json
README.md
scripts/coverage.ts
scripts/snapshot-data.ts
scripts/test-integrity.ts
src/data/birthdays.ts
src/data/types.ts
src/data/events/01.ts
src/data/events/02.ts
src/data/events/03.ts
src/data/events/04.ts
src/data/events/05.ts
src/data/events/06.ts
src/data/events/07.ts
src/data/events/08.ts
src/data/events/09.ts
src/data/events/10.ts
src/data/events/11.ts
src/data/events/12.ts
src/data/people/01.ts
src/data/people/02.ts
src/data/people/03.ts
src/data/people/04.ts
src/data/people/05.ts
src/data/people/06.ts
src/data/people/07.ts
src/data/people/08.ts
src/data/people/09.ts
src/data/people/10.ts
src/data/people/11.ts
src/data/people/12.ts

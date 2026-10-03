KET_QUA: SUA

Review của Claude Code (2026-10-03) cho việc B001. Phạm vi đã kiểm: tự chạy lại `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` (đều sạch, lint 23 warning cũ); đọc toàn bộ diff `birthdays.ts`, `test-integrity.ts`, `AppShell.tsx`, phần thêm vào `page.tsx`, `day/[month]/[day]/page.tsx`, `share/[date]/page.tsx`; chạy `next start -p 3100`, curl 15 URL (đều 200) và kiểm nội dung; chạy `tsx` in dữ liệu `featured` và số người của các ngày chip.

## Đã đạt (giữ nguyên)
- R1/R2 đúng: thống kê chỉ đếm từ `people`, không còn `is22Feb`; `HISTORY_EVENTS` + `getHistoryEvents`; Rule J/K hợp lý, báo cáo có đầu ra FAIL trước khi sửa (`nhap/B001-test-fail.txt`).
- Trang chủ không còn Jobs/Einstein/1495/Vasco/183/Bác Hồ (curl = 0); `/day/2/22` đủ 4 sự kiện; `/day/5/10` không rò Washington/Dolly/Adams; `/share/5-10` trống trung thực, không Drew Barrymore; `/share/2-22` hiện 22 Tháng 2.
- Không đụng file cấm, không `eslint-disable`/`@ts-ignore`, không đổi dữ liệu 30 người/4 sự kiện. README khớp thực tế.

## Cần sửa (5 chỗ)
1. **`src/app/page.tsx` chip "19 Tháng 5" vi phạm R3**: `getBirthdayData(5,19).all.length === 0` (cả hôm nay chip "28 Tháng 2" và "28 Tháng 6" có 1 người là đúng). Chỉ giữ chip cho ngày có ≥ 1 người trong `ALL_PEOPLE`: bỏ chip 19/5 (hoặc thay bằng ngày có người, ví dụ 10/4, 15/8, 30/4). Báo cáo còn ghi chip "5 Tháng 10", chip đó không tồn tại trong code: báo cáo phải khớp file.
2. **`src/app/page.tsx` hero (L179–245) vẫn hard-code tên và nhãn**: `heroFeatured[2]?.name || 'Steve Irwin'`, `src ... || '/people/steve-irwin.png'` và các nhãn ngắn "S. Irwin", "A. Schopenhauer", "H. Hertz" viết tay. Nếu thứ tự `featured` đổi, ảnh và nhãn lệch nhau. Sửa: bỏ mọi fallback tên/ảnh viết tay; nhãn ngắn suy ra từ `person.name` (ví dụ chữ cái đầu của phần họ/tên + từ cuối) hoặc dùng `person.name`; ẩn khung nếu không có `heroFeatured[i]`. Không chọn index nhảy cóc (`[5]`) một cách ngầm: dùng `heroFeatured.slice(0, 5)` map theo vị trí khung.
3. **`src/app/day/[month]/[day]/page.tsx` thẻ chiêm tinh rò dữ liệu 22/2 sang mọi ngày**: `/day/5/10` vẫn hiện "Những cá nhân sinh vào ngày 22 tháng 2 mang năng lượng… Song Ngư", Alrescha, Pisces (4 lần "Song Ngư"). Đây cùng loại lỗi "rơi về dữ liệu ngày khác" của R2 (lỗi này do tôi ghi "giữ nguyên" ở R4 mà chưa nói rõ phải giữ đúng ngày). Sửa tối thiểu: thẻ chiêm tinh Song Ngư chỉ render khi ngày `[month]/[day]` thuộc Song Ngư (19/2–20/3; có thể tái dùng hàm `getZodiacSign` bạn đã viết, nên đưa ra một chỗ dùng chung thay vì sao chép), và câu văn dùng `${day} tháng ${month}` thay vì "22 tháng 2" cố định. Ngày không thuộc Song Ngư: ẩn thẻ (không tạo nội dung chiêm tinh cho cung khác).
4. **`day/[month]/[day]/page.tsx` L199–200 "Độ xác thực: 100%"** là con số bịa (hằng số khi có sự kiện). Đổi thành số thật tính từ dữ liệu: ví dụ nhãn "Sự kiện có nguồn" = `events.filter(e => (sourceUrls?.length ?? 0) > 0).length}/${events.length}` (cần truyền `sourceUrls` vào `HistoryTimelineItem`), hoặc bỏ ô. Cùng kiểu: kiểm lại mọi ô số/phần trăm trên trang này.
5. **`scripts/test-integrity.ts` Rule L**: `'183'` khớp theo chuỗi con nên sẽ báo sai nếu sau này có năm/số như 1830, 2183, màu hex. Dùng regex ranh giới `/\b183\b/` (giữ các mẫu khác như cũ). Thêm vào Rule L 2 mẫu mới để bắt lỗi mục 3: `'ngày 22 tháng 2'` không được xuất hiện cứng trong `src/app/**` ngoài `README` và dữ liệu (chuỗi cố định "22 tháng 2"/"22 Tháng 2" trong `src/app/page.tsx` chip/nhãn hợp lệ nên chỉ quét `src/app/day/**`). Sau khi sửa, test mới phải FAIL ở bản cũ: dán đầu ra.

## Ghi nhận ngoài phạm vi (không bắt sửa)
- Hàm `getZodiacSign` và tách ngày `D-M` ở trang share là phần thêm ngoài yêu cầu R5 nhưng đúng và nhỏ: chấp nhận.
- `© {new Date().getFullYear()}` trong `AppShell` (client component) có thể lệch hydrate chỉ vào đêm giao thừa: chấp nhận.

## Bài học chung
- Khi xóa dữ kiện hard-code, kiểm bằng curl trên NGÀY KHÁC (5/10, 12/31) cho mọi trang, không chỉ 22/2.
- Báo cáo phải liệt kê đúng những gì có trong code (chip "5 Tháng 10" không có).
- Số liệu trên UI (%/đếm) phải tính từ dữ liệu, không là hằng số.

KET_QUA: CHUA_DAT

Review r2 của Claude Code (2026-10-03) cho B003 v2. Lý do: **4 nguồn "đã MỞ" trong báo cáo không tồn tại hoặc không chứa ngày sinh** (quy tắc đã nêu: ≥ 2 nguồn sai = CHUA_DAT). Phần còn lại tốt, nên vòng tới chỉ cần sửa đúng các điểm dưới và nộp bằng chứng kiểm chứng được. Không commit dữ liệu v2 cho tới khi đạt.

## Phạm vi đã kiểm (tự làm)
- Cổng: `npm test` (Rule A–S, 103 người) pass; `tsc` 0 lỗi; `build` OK; lint 0 error; `verify:wikidata` toàn bộ **103 khớp / 0 lệch / 0 thiếu**; coverage 15/31 ngày tháng 1, 75 người. Không có `eslint-disable`/`@ts-ignore`/`as any`; `package.json` chỉ thêm 1 dòng.
- So với HEAD bằng script riêng: **30 người cũ chỉ đổi đúng `wikidataId`** (13 QID), sự kiện giống hệt, `featured` của 22/2 giống hệt, không trùng ID. Việc sửa 13 QID đúng yêu cầu.
- Đạt các mục review r1: 5 người/ngày đủ cả 15 ngày; truy vấn Việt Nam có (`vn-MM-DD.json`); highlight Cuba Gooding Jr. và MLK đã gỡ; script `verify:wikidata` thoát 1 khi thiếu; báo cáo đủ bảng.
- Nobel: mở 17 trang nobelprize.org (cả cũ và mới), ngày sinh đều khớp.
- Britannica: đối chiếu **toàn bộ 76 URL Britannica** với thuộc tính "Britannica ID" (P1417) trên Wikidata: 69 khớp chính xác; 7 URL còn lại mở tay trong trình duyệt (kết quả bên dưới). Mở nội dung 6 trang mới (Kaifu 2/1/1931, Forster 1/1/1879, Joseph Bonaparte 7/1/1768, Renner 7/1/1971, Meloni 15/1/1977, Syd Barrett 6/1/1946): ngày sinh đều khớp.
- `wikipediaUrl` của cả 103 người: gọi thật từng URL.

## Lỗi chặn (phải sửa)
1. **`jakob-grimm`**: `https://www.britannica.com/biography/Jakob-Grimm` → "Page Not Found". URL đúng theo Wikidata P1417: `https://www.britannica.com/biography/Jacob-Ludwig-Carl-Grimm` (đã mở: trang tồn tại, nhưng bản tóm tắt ngắn: bạn phải kiểm trang có ghi ngày sinh 4/1/1785 không; nếu trang không ghi ngày sinh thì không dùng làm nguồn xác nhận ngày, thay bằng nguồn khác hoặc bỏ người này).
2. **`orlando-bloom`**: URL tồn tại nhưng chỉ là trang "stub" (chỉ có câu "Learn about this topic in these articles…"), **không có tiểu sử và không có ngày sinh**. Không phải nguồn xác nhận. Thay bằng nguồn có ngày sinh thật, hoặc bỏ và chọn người khác.
3. **`vo-thi-anh-xuan`**: `https://vpctn.gov.vn/lanh-dao-nha-nuoc/pho-chu-tich-nuoc-vo-thi-anh-xuan.html` trả 200 nhưng nội dung là **"Page not found"** (title "Page not found"). Báo cáo ghi "Cổng TTĐT Văn phòng Chủ tịch nước xác nhận sinh 08/01/1970": sai. Tìm trang chính thức thật (cơ quan nhà nước/Quốc hội/Đảng…) có ghi ngày sinh và **trích nguyên văn dòng đó vào bằng chứng**; nếu không tìm được thì bỏ người này và lấy người khác cho đủ 5 người ngày 8/1.
4. **`thach-kim-tuan`**: `olympedia.org/athletes/136471` → 404. Wikidata (P8286) cho ID Olympedia là **136482**; tôi đã mở `https://www.olympedia.org/athletes/136482`: ghi "Born 15 January 1994 in Hàm Tân, Bình Thuận (VIE)". Dùng URL đúng này.
5. **Cách báo cáo**: báo cáo viết "nguồn độc lập đã MỞ (URL) ✓" cho cả 73 người, nhưng ít nhất 4 URL không mở được hoặc không có ngày sinh. Từ nay không được ghi "đã mở" nếu không có bằng chứng kèm theo (mục R-A).

## Lỗi khác (sửa cùng đợt)
6. `wikipediaUrl` 404: `heinrich-schliemann`, `julius-erving`, `rajon-rondo`, `lea-salonga` (vi.wikipedia không có trang). Dùng `https://en.wikipedia.org/wiki/...` nếu trang tồn tại (kiểm bằng sitelinks Wikidata hoặc request thật), nếu không thì xóa `wikipediaUrl`. Đây gồm cả người cũ: được phép sửa **chỉ** trường `wikipediaUrl`.
7. `lea-salonga` (người cũ): Britannica `https://www.britannica.com/biography/Lea-Salonga` → 404 (URL này đã có từ BV-001R1 và Wikidata cũng không có P1417 cho bà). Tìm nguồn thật (hoặc dùng trang tony awards/nhà hát chính thức đã mở) cho ngày 22/2/1971 và thay; không thể thì loại URL đó khỏi `sourceUrls` nhưng giữ ≥ 1 nguồn hợp lệ khác (nếu chỉ còn Wikidata thì ghi vào Reviewer Attention, đừng bịa).
8. `haruki-murakami`: `Murakami-Haruki` chuyển hướng sang `Haruki-Murakami` (chạy được nhưng nên dùng URL chuẩn `https://www.britannica.com/biography/Haruki-Murakami`).

## Việc bắt buộc thêm (để không lặp lại)
**R-A. Bằng chứng nguồn kiểm chứng được.** Tạo `nhap/B003-evidence.json` (không commit; chỉ Claude đọc): với **mỗi người mới và mỗi người đã sửa**: `{ "qid", "name", "url", "quote": "<dòng ngày sinh chép nguyên văn từ trang>", "fetchedAt": "<ISO>" }`. Quote phải là chữ thật có trên trang (Claude sẽ mở ngẫu nhiên và đối chiếu; quote không có trên trang = CHUA_DAT ngay). Nobel/Olympedia lấy bằng script, Britannica dùng trình duyệt/công cụ đọc trang. Báo cáo chỉ được ghi "✓" cho người có dòng bằng chứng.

**R-B. `scripts/check-source-urls.ts` + `package.json` script `"verify:urls": "tsx scripts/check-source-urls.ts"`** (thay đổi `package.json` thứ hai được phép; `npm test` KHÔNG gọi mạng). Với mọi `sourceUrls` và `wikipediaUrl` của `ALL_PEOPLE`:
- GET (User-Agent trình duyệt, theo redirect, timeout 30s, nghỉ ≥ 1s giữa hai request cùng host). Lỗi nếu status ≠ 200, hoặc nếu title/nội dung có dấu hiệu soft-404 (`Page not found`, `404`, `Not Found`, `Error | Britannica`, `We're sorry! This content is not available`).
- `britannica.com` chặn script (403): với host này đối chiếu slug URL với `P1417` của `wikidataId` (qua `wbgetentities`, tối đa 50 QID/request, nghỉ 2s); khớp = OK; không khớp = lỗi; Wikidata không có P1417 = in `MANUAL` (phải liệt kê trong báo cáo cùng quote mở bằng trình duyệt ở R-A).
- Với `olympedia.org`, kiểm thêm tên trang chứa tên người; với `nobelprize.org` kiểm "Born:" khớp ngày. Thoát mã 1 nếu có lỗi hoặc có `MANUAL` chưa nằm trong danh sách đã xác nhận (đọc từ một mảng hằng `MANUAL_CONFIRMED` trong chính script, mỗi phần tử gồm url + ngày kiểm).
- Chạy cho toàn bộ dữ liệu, dán đầu ra: phải thoát 0.

## Giữ nguyên (đã tốt)
- 5 người/ngày; tất cả người còn lại có ngày khớp Wikidata + Nobel/Britannica (đã đối chiếu mẫu lớn); sửa 13 QID chính xác; bảng ứng viên bị loại có lý do cụ thể (Newton, Molière, Nguyễn Du… hợp lý); script, Rule P–S, placeholder.

## Bài học chung
- "Đã mở" phải có bằng chứng (quote nguyên văn). Một URL "trông hợp lý" (suy ra từ tên) không phải là URL đã mở: Britannica có slug riêng (Jacob-Ludwig-Carl-Grimm), Olympedia dùng ID số.
- Trang chính phủ trả 200 vẫn có thể là trang lỗi mềm: kiểm nội dung, không chỉ status.
- Trước khi nộp, tự chạy `npm run verify:urls` và `npm run verify:wikidata`; hai lệnh này là cổng của vòng sau.

KET_QUA: SUA

# Review B003-v4 — SUA

Ngày review: 2026-10-04
Reviewer: Codex, theo yêu cầu trực tiếp của chủ dự án
Phạm vi: báo cáo `xong/B003-people-jan-01-15-v4.md` và trạng thái mã nguồn hiện có.

## Kết quả đối chiếu

- `npm run verify:wikidata`: **PASS**, 74 khớp, 0 lệch, 0 thiếu P569.
- Evidence audit độc lập: 53/53 bản ghi có QID khớp hồ sơ, URL hiện diện trong `sourceUrls`, quote không rỗng. Các nguồn được mở/đối chiếu mẫu gồm National Park Service (George Washington), World Scouting (Robert Baden-Powell), Naismith Basketball Hall of Fame (Julius Erving), D23 (Lea Salonga), Quốc hội Việt Nam (Võ Thị Ánh Xuân), và Olympedia (Thạch Kim Tuấn, Michael Chang, Lleyton Hewitt). Ngày sinh trong các mẫu này khớp hồ sơ. Ví dụ: [NPS](https://www.nps.gov/gewa/learn/historyculture/george-washington.htm), [WOSM](https://www.scout.org/who-we-are/scout-movement/scoutings-history?page=7), [D23](https://d23.com/walt-disney-legend/lea-salonga/), [Quốc hội](https://quochoi.vn/UserControls/Publishing/News/BinhLuan/pFormPrint.aspx?ItemID=54121&UrlListProcess=%2Fcontent%2Ftintuc%2FLists%2FNews), [Olympedia](https://www.olympedia.org/athletes/136482).
- Đếm dữ liệu: 44 hồ sơ mới trong 1–15/1; 9 người Việt Nam và 35 người nước ngoài (20,5%).
- `npx tsc --noEmit`: PASS. `npm run lint`: thoát 0, còn cảnh báo `<img>`/Google Fonts như báo cáo. `npm run coverage`: PASS, 74 hồ sơ trên 26/366 ngày.
- `npm test`: **FAIL**, 16 lỗi Rule S cho các ngày 16–31/1. Phạm vi B003 trong việc được giao chỉ là 1–15/1; Rule S hiện đã bị mở rộng tới ngày 31 trước khi B004 được giao.
- `npm run verify:urls`: **FAIL**, 255 URL được xác nhận và 1 URL lỗi fetch: Lakers Media Guide 2025–26 (`https://lalweb.blob.core.windows.net/public/lakers/media-relations/2025-26-Lakers-Media-Guide.pdf`) bị `AbortError` khi bộ kiểm đọc nội dung PDF. Báo cáo v4 ghi 256/256 PASS, nhưng lượt kiểm độc lập hiện tại không tái hiện được kết quả đó. Trích dẫn ngày sinh trên PDF có thể tìm thấy qua chỉ mục tìm kiếm, nhưng cổng kiểm URL của dự án vẫn phải thoát mã 0.

## Cần sửa trước khi đạt

1. Giữ Rule S của B003 trong phạm vi 1–15/1. Việc mở rộng tới ngày 31 thuộc B004; chưa có dữ liệu B004 nên test hiện tại không thể đạt.
2. Làm cho `npm run verify:urls` xử lý PDF chính thức đúng cách (ví dụ kiểm status/content-type mà không đọc toàn bộ PDF như HTML), hoặc thay/bỏ URL Lakers bị timeout và cập nhật evidence tương ứng. Chạy lại toàn bộ kiểm URL; kết quả phải thoát 0, không còn lỗi hay Britannica MANUAL chưa xác nhận.
3. Nộp báo cáo sửa tiếp theo với đầu ra thật của `npm test` và `npm run verify:urls`.

Các phần Wikidata và mẫu bằng chứng đã kiểm ở trên được giữ lại; chưa có bằng chứng về ngày sinh sai trong mẫu review. Đây là yêu cầu sửa kỹ thuật/phạm vi, không phải yêu cầu mở rộng danh sách người.

## Quyết định về B004

**Chưa giao B004.** Theo `.ai/hop-thu-mybirthday/KE-HOACH.md`, chỉ giao B004 sau khi B003 đạt. B003 hiện ở trạng thái `SUA`.

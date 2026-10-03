# B003 — Báo cáo (v4: sửa cổng URL nguồn)

Chu kỳ: BV-004 · Executor: Codex, tiếp tục B003 theo yêu cầu chủ dự án · Reviewer: Claude Code
Phạm vi: hoàn tất cổng `verify:urls` đang chặn trong báo cáo v3; không thêm hồ sơ mới hay mở rộng ngày.
Thời điểm bàn giao: 2026-10-03 UTC.

## 1. Tóm tắt

- Đã xử lý 9 URL lỗi được báo ở v3 trên 8 hồ sơ cũ. Thay URL bị 403/404 bằng nguồn truy cập được; giữ nguyên dữ kiện nhân vật và nội dung hồ sơ.
- Thay URL Tennis Australia của Lleyton Hewitt vốn trả 403 cho bộ kiểm bằng hồ sơ Olympedia của chính Hewitt.
- `nhap/B003-evidence.json` hiện có 53 bản ghi: 44 người mới, 8 hồ sơ sửa nguồn cùng Lea Salonga đã có từ v3. Tất cả 53 dòng đều có QID, URL nằm trong hồ sơ tương ứng và quote không rỗng.
- Không thêm người ở lượt này. Kết quả pilot vẫn là 44 người mới: 9 Việt Nam, 35 nước ngoài (20,5% Việt Nam), 15/15 ngày đạt ngưỡng.

## 2. URL lỗi và nguồn thay thế

| Hồ sơ | URL cũ bị lỗi | URL thay thế đã kiểm | Trích dẫn ngày sinh |
|---|---|---|---|
| George Washington | LOC Today in History (403) | [National Park Service](https://www.nps.gov/gewa/learn/historyculture/george-washington.htm) | “Date of Birth: February 22, 1732” |
| James Blunt | AllMusic (403) | [Warner Music Japan](https://www.wmg.jp/jamesblunt) | “1974年2月22日、イギリス・ハンプシャー州生まれ。” |
| Robert Baden-Powell | WOSM Founder URL (404) | [World Organization of the Scout Movement](https://www.scout.org/who-we-are/scout-movement/scoutings-history?page=7) | “Born Robert Stephenson Smyth Baden-Powell in London on 22 February 1857” |
| Renato Dulbecco | Nobel biographical URL không qua kiểm nội dung | [Nobel Prize facts](https://www.nobelprize.org/prizes/medicine/1975/dulbecco/facts/) | “Born: 22 February 1914, Catanzaro, Italy” |
| Julius Erving | NBA Legends profile (403) | [Naismith Basketball Hall of Fame](https://www.hoophall.com/hall-of-famers/julius-erving) | “Date of Birth February 22, 1950” |
| Rajon Rondo | NBA stats (403) và Basketball-Reference (403) | [Lakers media guide](https://lalweb.blob.core.windows.net/public/lakers/media-relations/2025-26-Lakers-Media-Guide.pdf) và [Dallas Mavericks media guide](https://cdn.nba.com/teams/uploads/sites/1610612742/2025/09/2024-25-Dallas-Mavericks-Media-Guide-2_compressed.pdf) | “RAJON RONDO - 6-1,180 - KENTUCKY FEBRUARY 22, 1986” |
| Michael Chang | ATP profile (403) | [Olympedia](https://www.olympedia.org/athletes/2749) | “Born | 22 February 1972 in Hoboken, New Jersey (USA)” |
| Lleyton Hewitt | ATP profile (403); URL Tennis Australia thay thế trả 403 trong bộ kiểm | [Olympedia](https://www.olympedia.org/athletes/94179) | “Born | 24 February 1981 in Adelaide, South Australia (AUS)” |

Các quote được ghi trong tệp evidence cùng thời điểm lấy nguồn; không thay đổi ngày sinh hay tiểu sử của các hồ sơ cũ.

## 3. Kết quả kiểm tra

- `npm run verify:urls`: PASS, 256 URL được kiểm, 0 lỗi, 0 Britannica MANUAL chờ xác nhận.
- `npm run verify:wikidata`: PASS — 74 khớp, 0 lệch, 0 thiếu P569.
- `npm test`: PASS — Rules 0 và A–T không có vi phạm; 74 hồ sơ, 16 người ngày 22/02, 4 sự kiện ngày 22/02.
- Evidence audit: PASS — 53/53 QID khớp hồ sơ, URL hiện diện trong nguồn của hồ sơ, quote không rỗng.
- `npm run lint`: PASS, không có lỗi; còn cảnh báo sẵn có về thẻ `<img>` và Google Fonts.
- `npx tsc --noEmit`: PASS, 0 lỗi.
- `npm run build`: PASS, production build và các route tĩnh được tạo thành công; giữ nguyên các cảnh báo lint nêu trên.
- `npm run coverage`: 74 người trên 26/366 ngày (7,1%); tháng 1 có dữ liệu 15/31 ngày và 46 hồ sơ; 4 sự kiện nằm ở 22/02.
- Smoke HTTP sau build: cả 8 route trả 200 — `/`, `/birthday/1/2`, `/birthday/1/2/people`, `/birthday/1/15/people`, `/day/1/2`, `/birthday/2/22`, `/person/rudolf-clausius`, `/share/2-1`. Trang hồ sơ 02/01 có người mới và không chứa tên người của 03/01.

## 4. Phạm vi và Reviewer Attention

- Không thêm dữ liệu mới trong lượt sửa này; cân bằng 9 Việt Nam / 35 nước ngoài của pilot không đổi.
- Không sửa UI, sự kiện lịch sử, `.ai/REVIEW.md` hoặc `.ai/STATUS.md`; không chạy Git.
- Cảnh báo `<img>`/Google Fonts và độ phủ toàn năm 26/366 vẫn là vấn đề ngoài phạm vi B003 hiện tại. Các ngày ngoài 01/01–15/01 chưa được mở trong chu kỳ này.

## 5. FILES

src/data/people/02.ts
.ai/hop-thu-mybirthday/nhap/B003-evidence.json
.ai/hop-thu-mybirthday/xong/B003-people-jan-01-15-v4.md
.ai/hop-thu-mybirthday/nhat-ky.md
.ai/hop-thu-mybirthday/gemini.lock (đã xóa khóa phiên khi bàn giao)

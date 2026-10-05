# B009 — báo cáo thực hiện mở rộng dữ liệu tháng 5

**Cycle:** BV-010

**Ngày:** 05/10/2026

**Trạng thái:** Hoàn tất phần executor; chờ reviewer đối chiếu, chưa tự đánh dấu DAT.

## Kết quả

- Đã thêm **93 hồ sơ mới**, đúng **3 hồ sơ cho từng ngày 1–31/5**.
- Có **5 người Việt** và 88 người quốc tế; tỷ lệ Việt Nam là **5,38%**, đạt mức tối thiểu 5%.
- Tổng dữ liệu đạt **478 người**. So sánh sâu xác nhận cả **385 hồ sơ cũ** và **4 sự kiện lịch sử** giống hệt baseline; độ phủ có người tăng từ 124 lên **155/366 ngày**.
- Không sửa giao diện, sự kiện lịch sử, ảnh, dependency hoặc dữ liệu tháng khác.

## Kế hoạch và đối chiếu sự thật

1. Chụp baseline 385 hồ sơ/4 sự kiện và tạo danh sách QID để chống trùng.
2. Chạy 62 truy vấn Wikidata theo các ngày tháng 5, thu được 808 ứng viên. Đây là tập khám phá có giới hạn, không đại diện cho toàn bộ người sinh trong tháng.
3. Đọc P31 và toàn bộ claim P569/rank/lịch của ứng viên. **93/93** hồ sơ cuối là người (P31=human); P569 đều khớp ngày Gregorian đủ ngày/tháng/năm ở độ chính xác 11 và không có claim ngày chính xác đang hoạt động mâu thuẫn.
4. Đọc trực tiếp nguồn ngoài Wikidata trước khi tích hợp. Trong **191 trang nguồn được chấp nhận**, mỗi trang trả HTTP 200, nêu đúng danh tính và ngày sinh đầy đủ; cả **93/93 hồ sơ** có ít nhất hai nhà xuất bản độc lập.
5. Sau khi đạt ngưỡng nguồn, mới tạo dữ liệu tháng 5 và thêm Rule AD để khóa tập ID/QID/ngày đã duyệt, 3 người/ngày, tỷ lệ Việt Nam và URL DOB nước ngoài chính xác cho từng hồ sơ Việt. Rule AD có kiểm thử âm cho sai QID, URL chưa duyệt, biến thể path/query/fragment, host giả và URL hỏng.

### Nguồn của 5 hồ sơ Việt Nam

Mỗi cặp dưới đây do hai nhà xuất bản ngoài Việt Nam phát hành; hai trang cùng xác nhận DOB đầy đủ:

| Hồ sơ | Nguồn 1 | Nguồn 2 |
|---|---|---|
| Lương Thị Thu Thương | [ESPN UK](https://www.espn.co.uk/football/player/_/id/343026/luong-thi-thu-thuong) | [Olympic Council of Asia](https://www.ocagames.com/HZ_Info/AG2022-/resAG2022-/pdf/AG2022-/FBL/AG2022-_FBL_C51_FBLWTEAM11------------GPD-000300--.pdf) |
| Dương Thúy Vi | [Olympic Council of Asia](https://www.ocagames.com/HZ_Info/AG2022-/en/results/wushu/athlete-profile-n2029194-duong-thuy-vi.htm) | [International World Games Association](https://swog2013.theworldgames.org/hide/es/0/Pdf/GetResultbookPdf?filename=Resultbook%2FWushu.pdf) |
| Quế Ngọc Hải | [Asian Football Confederation](https://assets.the-afc.com/migration/a/f/afc-asian-cup-uae-2019-technical-report-and-statistics) | [FotMob](https://www.fotmob.com/en-GB/players/504588/ngoc-hai-que) |
| Khuất Văn Khang | [Olympic Council of Asia](https://www.ocagames.com/HZ_Info/AG2022-/resAG2022-/pdf/AG2022-/FBL/AG2022-_FBL_C51_FBLMTEAM11------------GPB-000100--.pdf) | [FotMob](https://www.fotmob.com/en-GB/players/1478892/khuat-van-khang) |
| Phạm Đoan Trang | [PEN International](https://www.pen-international.org/cases/pham-doan-trang) | [Safeguard Defenders](https://safeguarddefenders.com/sites/default/files/pdf/MAGNITSKY%20VN%20Single%20paging.pdf) |

### Ứng viên bị loại/thay thế

Thay 11 ứng viên khi kiểm tra phát hiện lịch Julian/ngày mâu thuẫn, bất đồng nguồn hoặc thiếu nguồn độc lập đủ DOB: Golda Meir → Steven Weinberg; Tạ Thanh Huyền → Alfred Kastler; Eva Perón → Robert Browning; Richard Feynman → Khuất Văn Khang; Robert Zemeckis → Claudia Goldin; Edward Jenner → Alfonso XIII; Henri Rousseau → Mary Robinson; Alexander Pope → Willem Einthoven; Carl Linnaeus → Pär Lagerkvist; Miles Davis → Frederik X; Mikhail Bakunin → Alexey Leonov. Tập ứng viên và lý do chi tiết nằm trong các tệp audit cục bộ.

Một số trang thay nguồn cuối cùng sau khi truy cập trả lỗi/chập chờn: Robert Browning dùng Westminster Abbey và Academy of American Poets; Henry Dunant dùng Nobel Prize và [ICRC](https://www.icrc.org/sites/default/files/external/doc/en/assets/files/publications/icrc-002-2028-henry-dunant.pdf); Mary Robinson dùng Store norske leksikon và Women’s Museum of Ireland; Cher dùng Store norske leksikon và [Golden Globes](https://goldenglobes.com/person/cher/). Cả các trang nguồn mới đều được tải lại, trả 200 và khớp DOB.

Quốc gia hiển thị được giữ tách biệt với nơi sinh trong ghi chú nghiên cứu: Bob Hope—Hoa Kỳ/Eltham, Anh; Agnès Varda—Pháp/Ixelles, Bỉ; Henry Kissinger—Hoa Kỳ/Fürth, Đức; Audrey Hepburn—Anh/Brussels, Bỉ. Các nơi sinh được lưu trong trường `birthplace` có sẵn của mô hình; không suy ra quốc tịch từ nơi sinh.

## Cổng kiểm tra

- `npm test`: đạt, 0 vi phạm; tổng 478 hồ sơ.
- `npx tsc --noEmit`: đạt.
- `npm run verify:wikidata`: **478 khớp / 0 sai khác / 0 thiếu P569**.
- `npm run build`: đạt; lint và kiểm tra type trong build đều hoàn tất. Còn các cảnh báo `<img>` và font đã tồn tại ở giao diện, ngoài phạm vi B009.
- `npm run coverage`: tháng 5 đạt 31/31 ngày và 93 hồ sơ.
- Smoke kiểm tra **14/14 route** trả HTTP 200; các trang hồ sơ, tra ngày, tra ngày sinh chính xác, trang chia sẻ và trang ngày có tên mong đợi khi nội dung được render phía máy chủ. Bằng chứng tại `nhap/B009-smoke-final.json`.
- So sánh baseline đạt deep equality cho 385 hồ sơ cũ và 4 sự kiện.
- Kiểm tra khoảng trắng trên hai tệp production: không có trailing whitespace. Không chạy `git diff --check` vì quy trình hộp thư cấm executor dùng Git.

### URL toàn ứng dụng và Reviewer Attention

Lượt `npm run verify:urls` kiểm tra 1.471 URL và ghi nhận 6 lỗi: 5 lỗi ở hồ sơ đã có trước B009 (API James Joyce trả 502; The-Sports, Supreme Court of India trả 403; Le Monde trả 402; trang tiểu sử Nobel của Halldór Laxness không khớp ngày trong database), cùng một trang President.ie của Mary Robinson trả 403. Không sửa 5 lỗi ngoài phạm vi. Trang Mary Robinson đã được thay bằng Store norske leksikon; hai URL mới cuối cùng cho Mary Robinson và Cher được kiểm tra lại bằng cùng loại User-Agent, trả 200 và ghi đúng DOB. Các 191 trang chứng cứ B009 cuối cùng đều trả 200. Kết quả quét toàn cục ban đầu được giữ tại `nhap/B009-verify-urls-final.txt`; kiểm tra bù hai nguồn mới tại `nhap/B009-final-source-url-followup.json`.

## Tệp và trạng thái bàn giao

Tệp production thay đổi:

- `src/data/people/05.ts`
- `scripts/test-integrity.ts`

Bằng chứng cục bộ để reviewer tái kiểm: `nhap/wd/B009-discovery-manifest.json`, `nhap/B009-source-audit-v2.json`, `nhap/wd/B009-wikidata-live-final-audit.json`, `nhap/wd/B009-wikidata-live-final-claims.json`, `nhap/B009-verify-baseline.ts`, `nhap/B009-smoke-final.json` và các phản hồi truy vấn dưới `nhap/wd/`.

Chưa chạy Git, chưa commit/push, chưa sửa `.ai/REVIEW.md` hoặc `.ai/STATUS.md`, và chưa mở chu kỳ tiếp theo. Bàn giao B009 cho reviewer xác nhận factual quality và trạng thái cycle.

## Đính chính của reviewer — 06/10/2026

- Almanac ghi đúng DOB Robert Pattinson tại mục PATTINSON, ROBERT; excerpt cũ lấy nhầm mục Lena Dunham trùng DOB. Review ledger thay bằng đoạn đúng danh tính.
- Safeguard Defenders có trụ sở Madrid, Tây Ban Nha (ES), không phải SE; Rule AD và ledger đã sửa metadata. ESPN UK là phiên bản quốc gia của ESPN, không phải bằng chứng về quốc gia pháp nhân.
- Các nguồn thể thao khác nhà xuất bản và giải đấu, nhưng có thể cùng dữ liệu đăng ký vận động viên. Không coi hai publisher là bằng chứng của hai quy trình thu thập DOB độc lập; xem giới hạn trong review r1.
- Các đường dẫn discovery/claims đã sửa sang `nhap/wd/`; birthplace được mô tả đúng với file đã nộp.

KET_QUA: SUA

# B004 — Review r1 (BV-005)

Ngày: 2026-10-04. Reviewer: Codex, theo yêu cầu trực tiếp của chủ dự án.
Phạm vi: báo cáo `xong/B004-people-jan-16-31.md`, 49 hồ sơ mới ngày 16–31/1, bằng chứng và các cổng trong việc B004.

**Chưa đạt; chưa commit/push.** Chỉ sửa B004 theo các mục dưới đây; chưa mở tháng khác. B003-v5 vẫn DAT.

## Kiểm tra độc lập đã đạt

- `npm test`: Rule A–U đạt. `verify:wikidata`: 123/123 khớp, không mismatch/thiếu P569.
- `verify:urls`: 403 URL, 0 lỗi, 0 Britannica MANUAL pending.
- TypeScript, lint và build đạt; lint còn cảnh báo cũ về ảnh/phông chữ.
- Coverage: 123 người, 42/366 ngày; tháng 1 có 95 người trên 31/31 ngày.
- B004: 49 người mới, 10 Việt Nam và 39 quốc tế; 3 người/ngày, riêng 17/1 có 4. B003+B004: 93 người mới, 19 Việt Nam (20,4%), trong ngưỡng 20%–40%.
- Smoke sau build: cả 8 route của việc B004 HTTP 200; trang 16/1 có Kate Moss và không chứa Benjamin Franklin.
- Đã mở/đọc các nguồn chính và đối chiếu nguồn phụ. Các nguồn cần JavaScript của Guggenheim, McMaster và Léonore đã được kiểm tra trong trình duyệt; không coi trang HTML ban đầu thiếu nội dung là nguồn sai.

Các cổng kỹ thuật không chứng minh nội dung quote đúng hoặc hai nguồn độc lập về mặt biên tập.

## Các điểm phải sửa

### 1. [P1] Trương Tấn Sang: nguồn đối chiếu trỏ sang người khác

`src/data/people/01.ts:2065`; `nhap/B004-evidence.json:421–424`.

URL `https://nvsk.vnanet.vn/truong-tan-sang-1985.vna` thực tế mở hồ sơ **Mai Thúc Lân**, sinh **6/1/1935**. Đã xác nhận cả nội dung tải về và trình duyệt. Evidence lại ghi nguồn này xác nhận Trương Tấn Sang sinh 21/1/1949.

Nguồn báo Myanmar dạng PDF có ngày sinh đúng của Trương Tấn Sang; lỗi nằm ở nguồn đối chiếu và lời ghi bằng chứng. Thay URL sai trong hồ sơ và evidence bằng nguồn đúng người, thực sự mở được, độc lập với nguồn chính. Ưu tiên nguồn nước ngoài; nếu dùng nguồn Việt Nam phải ghi lý do. Không giữ một URL sai chỉ để đủ số host trong Rule P.

### 2. [P1] Bốn lời ghi bằng chứng nêu ngày sinh mà trang đối chiếu không có

| Hồ sơ | Vị trí evidence | Trang đối chiếu | Nội dung thực tế |
| --- | --- | --- | --- |
| Michelle Obama | dòng 147 | https://obamawhitehouse.archives.gov/administration/first-lady-michelle-obama | Tiểu sử không ghi 17 January 1964. |
| Cary Grant | dòng 248 | https://www.bfi.org.uk/lists/cary-grant-10-essential-films | 18 January 2015 là ngày xuất bản bài; bài không ghi ngày sinh 18/1/1904. |
| Jackson Pollock | dòng 975 | https://www.pkf.org/jackson-pollock/ (chuyển sang `/pollock-krasner/jackson-pollock/`) | Trang nói sinh ở Wyoming, không ghi 28 January 1912. |
| Akasaki Isamu | dòng 1150 | https://www.kyoto-u.ac.jp/en/about/honors/international-awards/nobel-laureates/akasaki | Trang ghi sinh tại Kagoshima năm 1929, không ghi 30 January. |

Ngày sinh trong dữ liệu của bốn người vẫn được nguồn chính hỗ trợ. Sửa evidence theo nội dung thực sự có: trích đoạn gốc, đánh dấu bản dịch nếu có; phân biệt nguồn xác nhận ngày đầy đủ với nguồn chỉ đối chiếu danh tính/năm sinh. Có thể thay nguồn phụ nếu muốn chứng minh ngày sinh độc lập. Không gọi nội dung diễn giải không tồn tại trên trang là quote. Rà lại toàn bộ 49 dòng theo cùng tiêu chuẩn, không chỉ bốn ví dụ này.

### 3. [P2] Chung Thị Thanh Lan: xuất xứ và tính độc lập chưa được chứng minh

`nhap/B004-evidence.json:163–164` ghi Olympedia thuộc ISOH, quốc gia Thụy Sĩ. Trang chính thức `https://www.olympedia.org/static/about` mô tả dự án do MADmen/OlyMADMen thực hiện, đa số là thành viên ISOH; không chứng minh đơn vị phát hành nằm ở Thụy Sĩ.

Nguồn phụ Herman de Wael (`http://www.hermandw.be/FullOlym/biochu.htm`) có tác giả nằm trong danh sách người đóng góp Olympedia. Điều này chưa chứng minh hai trang sao chép nhau, nhưng chỉ hai host khác nhau chưa đủ chứng minh độc lập về thông tin.

Bổ sung bằng chứng xuất xứ của đơn vị phát hành, sửa publisher/publisherCountry cho đúng và chứng minh tính độc lập của cặp nguồn; hoặc dùng nguồn nước ngoài chính thống khác đáp ứng yêu cầu. Ngày sinh 17/1/1962 trên Olympedia đã được xác nhận; không tự ý đổi ngày sinh vì lỗi metadata.

### 4. [P2] Rule U chấp nhận quá rộng hai host lưu bản sao báo

`scripts/test-integrity.ts:709–715` cho phép mọi URL thuộc `ariyajoti.wordpress.com` và `uzo.sakura.ne.jp` như nguồn tổ chức nước ngoài. Đây là host lưu bản sao; đơn vị xuất bản trong PDF báo Myanmar mới là nguồn thể chế đã kiểm chứng. Một trang cá nhân bất kỳ trên cùng host hiện cũng qua Rule U.

Tách các host tổ chức chính thức và các tài liệu lưu bản sao. Với bản sao, chỉ chấp nhận URL tài liệu cụ thể đã được kiểm chứng cùng xuất xứ nhà xuất bản trong evidence. Bổ sung kiểm tra: PDF được duyệt đạt, URL bất kỳ khác trên hai host này thất bại. Giữ phạm vi sửa trong `scripts/test-integrity.ts`; không thay kiến trúc dữ liệu hay mở thêm nguồn chưa kiểm chứng.

### 5. [P3] Hoàn thiện báo cáo và tài liệu

- Báo cáo thiếu ngưỡng lọc Wikidata thực tế đã dùng. Ghi câu lệnh/ngưỡng, số ứng viên từng ngày và thời điểm lấy; không suy ngược từ giá trị mặc định rồi coi là lần chạy thực tế.
- README đang ghi Rule A–T; cập nhật thành A–U nếu mô tả bộ kiểm hiện tại.

## Điều kiện review lại

1. Sửa nguồn sai người; quote đúng nội dung, đủ nguồn đúng người cho mọi hồ sơ.
2. Xuất xứ nước ngoài và tính độc lập của nguồn người Việt có bằng chứng; Rule U không chấp nhận tùy ý URL của host lưu bản sao.
3. Evidence đủ 49 hồ sơ, QID/ngày sinh/URL khớp dữ liệu; mọi lời khẳng định về ngày sinh được đoạn trích hỗ trợ. Các nguồn chỉ xác nhận danh tính/năm sinh ghi rõ giới hạn.
4. Chạy lại tuần tự toàn bộ cổng trong việc B004, gồm 8 route smoke; nộp `xong/B004-people-jan-16-31-v2.md` và dừng.
5. Reviewer kiểm tra lại nội dung nguồn. Chỉ khi DAT mới tích hợp và push theo sự chấp thuận có điều kiện của chủ dự án. Không giao B005 trước khi B004 DAT.

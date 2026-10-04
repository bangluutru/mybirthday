# B007 — Mở rộng dữ liệu toàn tháng 3

**Cycle:** BV-008 · **Ngày mở:** 04/10/2026 · **Trạng thái:** IMPLEMENTING.

Chủ dự án yêu cầu: “tiếp tục mở vòng tháng 3, lập kế hoạch chi tiết và thực hiện luôn”. Codex trực tiếp thực hiện, kiểm tra, review và commit/push khi đạt. Một vòng bao phủ cả tháng; nghiên cứu theo hai phần 1–15/3 và 16–31/3, không mở việc khác.

## 1. Mục tiêu và phạm vi

Baseline đã duyệt: commit `89fb28b5f17df2b59bf0a16ddca3060620867e34`, 202 hồ sơ trên 65 ngày, 4 sự kiện. Tháng 1 có 95 người/31 ngày; tháng 2 có 100 người/29 ngày; tháng 3 chưa có hồ sơ.

| Chỉ tiêu | Điều kiện chấp nhận |
|---|---|
| Độ phủ tháng 3 | Đủ 31/31 ngày, ít nhất 3 người/ngày |
| Hồ sơ mới | Ít nhất 93; tối đa 8 người mới/ngày |
| Người Việt | Ít nhất 5% trong IDs mới; 93 người cần ít nhất 5 người Việt |
| Đa dạng | Chọn nhiều quốc gia và lĩnh vực, trong giới hạn nguồn đủ mạnh |
| Sau mở rộng tối thiểu | 295 hồ sơ trên 96/366 ngày, chưa đủ cả năm |
| Bảo toàn | Giữ nguyên toàn bộ 202 hồ sơ cũ và 4 sự kiện |

Chỉ thêm người sinh từ 1–31/3. Không sửa UI, ảnh, dependencies, sự kiện, dữ liệu cũ hoặc tháng 4. Không ép đủ số lượng bằng thông tin chưa được xác minh.

## 2. Lộ trình thực hiện

### Bước 1 — Chụp baseline và thu ứng viên

- Đồng bộ Git, đọc AGENTS/REVIEW/STATUS; xác nhận không có DUNG hoặc khóa executor khác.
- Lưu đầy đủ 202 hồ sơ và 4 sự kiện; chạy test, TypeScript và coverage của baseline.
- Dùng `wikidata-candidates` cho từng ngày: lượt chung threshold 60, lượt Việt Nam threshold 0; LIMIT 100, asOfDate 2026-10-04.
- Lưu tham số, query, thời điểm chạy, bindings thô và số QID duy nhất. Raw Wikidata giữ local, không commit. Truy vấn bổ sung phải có mục đích, giới hạn, tham số và kết quả thật; không gọi mẫu giới hạn là danh sách toàn diện.

### Bước 2 — Kiểm tra ngày sinh và danh tính

- Nghiên cứu phần 1–15/3, sau đó 16–31/3.
- Người thật Q5, trưởng thành hoặc đã mất; không trùng ID/slug/QID.
- Xem toàn bộ P569/rank/references: Gregorian precision 11, không có khai báo Gregorian đủ ngày còn hiệu lực mâu thuẫn. Không chỉ lấy preferred rồi bỏ các normal khác.
- Không suy diễn Julian, lịch âm, năm sinh hoặc ngày xuất bản. Trường hợp chưa rõ phải loại và lưu lý do.

### Bước 3 — Kiểm tra chéo nguồn ngoài Wiki

- Mỗi người có Wikidata và 2 đơn vị xuất bản ngoài Wiki khác nhau; ít nhất 1 nguồn chính thống nêu đủ ngày/tháng/năm sinh.
- Mở nội dung thật, kiểm đúng người, ngày sinh, nghề nghiệp, quốc gia và từng claim được đưa vào ứng dụng. HTTP 200 không chứng minh sự thật.
- Không dùng SEO birthday, blog/AI, trang chỉ mục chung hoặc bài sao chép. Nguồn chỉ có năm/danh tính phải đánh dấu đúng giới hạn.
- Mỗi người Việt có ít nhất 1 đơn vị phát hành ngoài Việt Nam nêu đầy đủ ngày sinh; ưu tiên 2 nguồn nước ngoài. Nếu các nguồn có thể cùng dùng đăng ký liên đoàn/cầu thủ, ghi rõ giới hạn; không khẳng định hai cuộc điều tra DOB độc lập.
- PublisherCountry theo đơn vị phát hành, không theo quốc tịch nhân vật hoặc đuôi miền; không rõ ghi unknown.
- Lưu evidence: toàn bộ P569, exact URL, publisher/country, thời điểm mở, hash, vị trí/tác giả hoặc nguồn gốc, các trường được hỗ trợ và trích nguyên ngữ tối đa 25 từ/nguồn/hồ sơ. Rà 100% nguồn được chọn; lưu mâu thuẫn, lỗi mềm, 404/403 và lý do loại.
- Tiểu sử ngắn và 2–3 highlights phải có bằng chứng; dùng placeholder, không thêm nơi sinh, ảnh hay claim chưa chắc. Khi nguồn lệch ngày/năm mất, thay nguồn hoặc loại hồ sơ; không tự chọn ngày thuận tiện.

### Bước 4 — Tích hợp và thêm cổng kiểm tra

- Chỉ bổ sung `src/data/people/03.ts`.
- Giữ A–Y. Rule Z kiểm đủ 31 ngày và giới hạn thêm/ngày. Rule AA kiểm ít nhất 93 người mới, tỷ lệ Việt Nam và exact URL/QID cho nguồn nước ngoài đủ DOB.
- Có kiểm âm host giả, query lạ, path chưa duyệt, URL hỏng và QID sai. Test mới phải fail trước dữ liệu.
- Không nới cổng để đạt; nếu fixture cũ cấm nhầm dữ liệu đúng, cần điều chỉnh cụ thể có bằng chứng và giữ kiểm âm hardcode UI.

### Bước 5 — Review cuối, phát hành và đóng vòng

- Deep equality toàn bộ 202 baseline và 4 sự kiện.
- Test, Wikidata toàn bộ (0 mismatch/missing), URL toàn bộ (0 failed/0 MANUAL), TypeScript, lint, build và coverage đều đạt.
- Có thể dùng helper HTTP GET/body thật của B005 với retry hữu hạn đã duyệt; không cache/mock/ngoại lệ tự xác nhận. Nguồn legacy lỗi chỉ ghi Reviewer Attention; không tự đổi URL dữ liệu cũ.
- Production smoke: `/`, các trang people 1/15/16/31 tháng 3, day 1/31 tháng 3, people 16/1 và 29/2, birthday 22/2, một person mới và share 31/3. Kiểm HTTP 200 và nội dung đúng ngày, không lẫn người khác.
- Cập nhật README bằng số thực tế; báo cáo bảng 31 ngày, ứng viên/bindings/QIDs, thêm Việt Nam/quốc tế, nguồn, cổng, giới hạn và FILES.
- Chỉ DAT khi cả sự thật và cổng máy đạt. Kiểm diff, commit đúng file đã duyệt, push origin/main, fetch xác nhận 0/0 rồi **STOP**. Không mở tháng 4 trong vòng này.

## 3. FILES được phép

`src/data/people/03.ts`, `scripts/test-integrity.ts`, `README.md`; REVIEW/STATUS; chỉ thị/xong/review B007; KE-HOACH và nhat-ky; các B007-* evidence, manifest truy vấn, baseline, log cổng và helper smoke được chọn lọc. Raw `nhap/wd/B007-*` và HTML/PDF nguyên gốc giữ local. Không sửa package/lock hoặc file UI.

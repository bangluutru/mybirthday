# B010 review r1 — tháng 6 (BV-011)

**Quyết định:** PASS — ACCEPTED
**Ngày review:** 06/10/2026
**Phạm vi:** đúng cycle B010, ngày 1–30/6.

## Kết luận reviewer

Tập dữ liệu đạt tiêu chí nội dung và kỹ thuật. Chấp nhận tích hợp 90 hồ sơ mới vào tháng 6 và push thay đổi B010 lên `origin/main` theo chỉ thị trước của chủ dự án. Dừng sau khi xác nhận remote; chưa mở tháng 7.

## Bằng chứng factual

- 90 hồ sơ mới; đúng 3 người mỗi ngày 1–30/6; không trùng QID/ID. Có 5 người Việt và 85 người quốc tế (5,56%). Tháng 6 phủ 30/30 ngày; tổng coverage 184/366 ngày.
- Đối chiếu Wikidata cho tập được chọn: P31=human 90/90; P569 Gregorian precision 11 khớp 90/90; không có ngày đầy đủ đang hoạt động mâu thuẫn. Ba hồ sơ còn claim năm sinh precision thấp hơn, đều nhất quán. Lượt kiểm tra live toàn bộ hiện có: 568 khớp / 0 sai khác / 0 thiếu P569.
- Sổ nguồn ghi 180/180 trang DOB trực tiếp HTTP 200, khớp danh tính và full DOB; hai publisher/host khác nhau trên từng hồ sơ. 5 hồ sơ Việt đều có hai nguồn DOB của tổ chức ngoài Việt Nam, nơi publisher được đối chiếu từ trang trụ sở/liên hệ/pháp lý. Nguồn khác publisher không chứng minh dữ liệu gốc được thu thập độc lập; hạn chế này được công khai.
- Phan Văn Long có thêm trang AFC để hỗ trợ ngữ cảnh nghề nghiệp và qua Rule P; không tính trang này là nguồn DOB. Lê Văn Công dùng hồ sơ của Russian Paralympic Committee làm nguồn tổ chức, được kiểm tra trực tiếp và thêm domain vào Rule P.
- Joseph Kabila bị loại do nguồn tham chiếu nêu nghi vấn về ngày sinh được công bố; thay bằng Bronisław Komorowski, có hai trang bách khoa khớp ngày đầy đủ.
- `review/B010-evidence.json` lưu P31/P569, 90 hồ sơ, 180 URL DOB cùng publisher, ngày khớp, final URL, thời điểm, HTTP/content-type, SHA-256, excerpt ≤25 từ, nguồn AFC ngữ cảnh, proof quốc gia của publisher và baseline hash.

## Bảo toàn baseline và cổng phần mềm

- Rule AE khóa chính xác tập ID/QID/DOB/nguồn, 3 người/ngày, 5 VN, URL ngữ cảnh được duyệt riêng nếu có, 184 ngày coverage; kiểm thử âm cho QID/URL/path/query/fragment/host sai. Không nới Rules A–AD.
- Baseline deep-equal: cả 478 hồ sơ trước B010 giữ nguyên; 4 history events giữ nguyên; tổng dữ liệu 568 người.
- `npm test`: đạt, 0 vi phạm.
- `npm run verify:wikidata`: 568/568 khớp, không sai ngày và không thiếu P569.
- `npx tsc --noEmit`: đạt. `npm run lint`: đạt, còn cảnh báo `<img>`/font cũ ngoài scope. `npm run build`: đạt.
- `npm run coverage`: 184/366 ngày; tháng 6 phủ 30/30.
- Production smoke local: 9/9 route trả 200 và render nội dung kỳ vọng cho trang chủ, các ngày 1/15/16/30 tháng 6, `/day`, `/exact`, hồ sơ Phan Văn Long và `/share`.
- `git diff --check`: đạt.

## Reviewer Attention — URL toàn ứng dụng

`npm run verify:urls` kết thúc với 1.734 URL đã kiểm, 12 lỗi ban đầu, 0 mục Britannica MANUAL. Hai lỗi timeout trong dữ liệu mới là URL trang Wikidata Q37030 (Thomas Mann) và Q13424289 (Edward Snowden); cả hai được thử lại trực tiếp và đều trả HTTP 200. Mọi URL DOB/context B010 đều trả 200. 10 lỗi còn lại nằm ngoài tập nguồn mới của B010; giữ nguyên dữ liệu ngoài tháng 6 theo scope và không kết luận toàn ứng dụng sạch URL.

## Quyết định phát hành

**B010 PASS.** Cho phép commit/push các tệp B010 đã liệt kê trong task, gồm database tháng 6, Rule AE, báo cáo, review/evidence và trạng thái cycle. Không đưa artifacts thô trong `nhap/` vào commit. Sau khi push, xác minh `origin/main` đồng bộ và dừng.

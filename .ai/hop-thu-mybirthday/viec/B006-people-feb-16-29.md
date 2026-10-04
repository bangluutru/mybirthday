# B006 — Nhân vật sinh 16–29/2, gồm ngày nhuận

Cycle BV-007. Reviewer: Codex theo yêu cầu chủ dự án; executor: Gemini 3.8 / Antigravity theo AGENTS.md. Chỉ bắt đầu sau B005 DAT và đã push. Không Git, không sửa REVIEW/STATUS. Nộp xong rồi dừng.

## Mục tiêu và baseline

Baseline B005: 167 người / 56 ngày; tháng 1: 95 người /31 ngày; tháng 2:65 người /20 ngày. Phủ mọi ngày 16–29/2 với ít nhất3 người đã kiểm chứng/ngày. Không thêm ngày22/2 (đã16 người), giữ nguyên4 sự kiện. Tối đa8 người mới/ngày. Cần tối thiểu35 hồ sơ mới nếu đạt mọi ngày. Tối thiểu5% hồ sơ mới là người Việt (35 mới cần2 người Việt,5,7%); tính trên IDs mới, không gộp baseline. Không ép đủ số bằng thông tin chưa xác minh.

|Ngày|Baseline|Tối thiểu bổ sung|
|---|---:|---:|
|16|0|3|
|17|0|3|
|18|1|2|
|19|0|3|
|20|0|3|
|21|0|3|
|22|16|0|
|23|0|3|
|24|1|2|
|25|0|3|
|26|0|3|
|27|1|2|
|28|1|2|
|29|0|3|

## Kiểm tra chéo bắt buộc

- Dùng scripts/wikidata-candidates.ts từng ngày: lượt chung threshold60 và Việt Nam threshold0; LIMIT100. Lưu tham số thật, ngày chạy/asOfDate, bindings thô, QID duy nhất, query và lý do truy vấn bổ sung. Raw nhap/wd/ local, không commit. Không gọi dữ liệu giới hạn là danh sách toàn diện.
- Người thật, trưởng thành hoặc đã mất; P569 Gregorian precision11; không xung đột Gregorian còn hiệu lực; lưu toàn bộ rank/claims kể cả deprecated. Không trùng id/slug/QID. Không suy diễn lịch âm, năm sinh hoặc ngày xuất bản.
- Mỗi hồ sơ: Wikidata +2 nguồn ngoài Wiki độc lập, ≥1 nguồn chính thống nêu đủ ngày/tháng/năm. Mở nội dung thật, kiểm đúng người, đủ ngày; HTTP200 không chứng minh sự thật. Không giữ nguồn lỗi mềm, trang chủ không có claim, bài sao chép, nguồn SEO/blog/AI.
- Người Việt: ≥1 đơn vị phát hành ngoài Việt Nam nêu đủ ngày sinh; ưu tiên2 nguồn nước ngoài độc lập. PublisherCountry theo đơn vị phát hành, không theo quốc tịch nhân vật/đuôi miền; không rõ ghi unknown. Host khác không tự chứng minh độc lập. Nguồn cùng đăng ký liên đoàn phải nêu giới hạn; Olympedia không gán sở hữu IOC/ISOH.
- B006-evidence.json: id/QID/DOB, verifiedAt, toàn bộ P569; từng exactURL,publisher,country,thời điểm mở,hash,vị trí trang/PDF,tác giả hoặc nguồn gốc,claim được hỗ trợ,quote nguyên ngữ ≤25 từ/trang/hồ sơ. Quote từng trường nếu PDF xuống dòng, không ghép giả. Nguồn chỉ có năm/identity không đánh dấu full DOB. Tiểu sử/highlights/nơi sinh phải có bằng chứng; bỏ claim chưa đủ nguồn.
- B006-source-review.json rà100% nguồn ngoài Wiki. B006-excluded.json ghi mâu thuẫn và nguồn không mở được. Tài liệu host cá nhân phải exactURL/QID/hash được reviewer duyệt; không whitelist host.

## Cổng kỹ thuật

1. Lưu baseline167 hồ sơ đầy đủ và4 sự kiện, baseline test/coverage/tsc. Giữ nguyên A–W. RuleX: tháng2 đủ29/29 ngày≥3 người và≤8 mới/ngày. RuleY: ≥5% Việt Nam trongIDs mới B006 và nguồn nước ngoài đủ ngày sinh theo exactURL/QID; kiểm âm QID sai, query lạ, host giả, URL hỏng. Test mới phải fail trước thêm dữ liệu.
2. Không đổi verifiedAt/nguồn/dữ kiện baseline để né cổng. Hằng số16 người22/2 giữ nguyên vì không bổ sung ngày này; không thêm sự kiện. Jan đủ31 ngày, B0051–15/2 vẫn≥3/ngày.
3. Chạy test, verify:wikidata toàn bộ0 mismatch/missing, verify:urls toàn bộ0 failed/0 MANUAL, lint, tsc, build, coverage. Có thể dùng B005-http-complete-retry.cjs cho HTTP GET/body thật; không cache/mock/chuyển lỗi thành200/ngoại lệ nguồn. Lưu cả lỗi và lượt cuối, không chỉ trích PASS. Nguồn cũ lỗi: báo Reviewer Attention, chờ chỉ thị sửa URL cụ thể.
4. Smoke sau build: /, /birthday/2/16/people, /birthday/2/28/people, /birthday/2/29/people, /day/2/29, /birthday/2/1/people, /birthday/1/16/people, /birthday/2/22, /person/<mới>, /share/2-29. HTTP200 và nội dung đúng ngày, không lẫn người khác. Deep equality toàn bộ167 baseline +4 sự kiện. Reviewer chạy diff check trước tích hợp.
5. README chỉ số thực tế, chưa được gọi đủ toàn năm. Không dependencies/ảnh/UI/refactor/tháng3/sự kiện.

## FILES

Sửa src/data/people/02.ts (chỉ append16–29/2, trừ22/2), scripts/test-integrity.ts (X/Y+exactregistry, giữA–W), README.md. Tạo nhap/B006-* và raw local nhap/wd/02-16…02-29*.json; xong/B006-people-feb-16-29.md (sửa dùngv2…), nhat-ky.md, gemini.lock theo protocol. Không sửa viec/review, AGENTS, REVIEW/STATUS, package/lock hay file khác.

## Báo cáo / đóng vòng

Báo cáo FILES thực tế, bảng14 ngày (ứng viên chung/VN,bindings,QID,ngưỡng,thêmVN/quốc tế,tổng/ngày), tỷ lệ mẫu mới, bằng chứng từng người, loại trừ, kiểm100% nguồn, mọi cổng và chỗ không chắc. Thiếu nguồn/độ phủ/tỷ lệ => SUA, không tự nới tiêu chí. Nộp xong dừng. Reviewer chỉ DAT khi cả sự thật và cổng máy đạt; commit/push sau DAT. Tháng3 chỉ mở khi có chỉ thị tiếp theo.

Điều chỉnh chủ dự án2026-10-04: Codex trực tiếp thực hiện B006, review và tích hợp sau DAT; không đổi phạm vi/tiêu chí.

Reviewer correction B006-r1: Rule L cấm tên Steve Jobs ở mọi dữ liệu vì chống fixture cũ. Cho phép duy nhất object dữ liệu steve-jobs, Q19837, Gregorian 1955-02-24 trong people/02.ts đã kiểm nguồn; vẫn cấm hardcode tên này trong UI và mọi record khác. Không bỏ Rule L hoặc quy tắc A–W. Highlights thứ hai dùng tiểu sử đã kiểm nguồn.

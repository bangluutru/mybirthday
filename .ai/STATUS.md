# AG STATUS

## Current cycle

Cycle: BV-012

State: ACCEPTED — B011-r1 PASS ngày 2026-10-06, đã được duyệt phát hành.

Task: `.ai/hop-thu-mybirthday/viec/B011-people-jul-01-31.md`.

Scope: 1–31/7; 93 hồ sơ mới, 3/ngày; tối thiểu 5% người Việt; 2 publisher khác nhau xác nhận full DOB trực tiếp; hồ sơ Việt có 2 publisher ngoài Việt Nam; P31/P569 exact Gregorian precision 11; kiểm tra rank, claim và mâu thuẫn.

### Kết quả và bằng chứng

Thêm 93 hồ sơ (88 quốc tế, 5 Việt; 5,38%), đủ 3 hồ sơ cho mỗi ngày tháng 7. Có 186 trang DOB từ các cặp publisher/host khác nhau: 183 trang tải HTTP 200 và khớp đủ tên/ngày sinh; 3 trang bị lỗi tải cục bộ (2 HTTP 403, 1 HTTP 500) được mở trực tiếp trên trang publisher, khớp tên và ngày sinh. Không có response hash cho nội dung ba trang này; hash phản hồi lỗi được lưu riêng. P31 human và P569 exact Gregorian precision 11 khớp 93/93; không có claim chính xác hơn đang hoạt động bị mâu thuẫn. 10 trang proof chính thức xác nhận publisher của 5 hồ sơ Việt đặt ngoài Việt Nam.

Quốc gia đối chiếu theo P27/mô tả; nghề và phân loại dùng vai trò tổng quát có căn cứ. Không thêm birthplace hoặc thành tích ngoài bằng chứng.

Tổng 661 hồ sơ, 215/366 ngày có dữ liệu, tháng 7 đủ 31/31. 568 hồ sơ ngoài tháng 7 có SHA-256 deep-equal baseline; 4 events không thay đổi. Rule AF khóa danh sách chính xác, pair URL, country code và negative URL tests. Evidence/review: `.ai/hop-thu-mybirthday/review/B011-evidence.json` và `B011-people-jul-01-31-r1.md`; báo cáo executor: `.ai/hop-thu-mybirthday/xong/B011-people-jul-01-31.md`.

### Validation

`npm test`, `npm run verify:wikidata` (661/661), `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage` và smoke 5/5 routes đạt. Lint/build còn 32 cảnh báo `<img>` ở các tệp ngoài phạm vi B011. `git diff --check` sẽ được chốt cùng commit.

### Reviewer Attention

- Một hồ sơ tháng 7 có cùng tên hiển thị với một huấn luyện viên bóng đá sinh tháng 1; dùng slug `nguyen-huy-hoang-swimmer` để bảo đảm ID toàn cục duy nhất.
- URL legacy từ cycle trước có lỗi đã ghi trong B009/B010; ngoài phạm vi B011, không tự sửa.
- Chủ dự án yêu cầu mở tháng 8 tiếp sau khi B011 pass, push và xác nhận remote. Chưa mở trong cycle này.

## Earlier completed cycle — BV-011 / B010

State: ACCEPTED — B010-r1 PASS ngày 2026-10-06. Thêm 90 hồ sơ tháng 6 (85 quốc tế, 5 Việt; 5,56%), đúng 3/ngày. Tổng 568 người, coverage 184/366, 4 events giữ nguyên. Integrity/Wikidata 568/568, typecheck/lint/build/coverage/smoke đạt. Commit `1fb7f46cf0cf3b86ad176ce0a5f46cd8b7dcbdd5` đã push; `origin/main` xác nhận 0/0.

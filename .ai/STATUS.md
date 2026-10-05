# AG STATUS

## Current cycle

Cycle: BV-010
State: ACCEPTED — B009-r1 DAT đối với tập bổ sung tháng 5.
Task: `.ai/hop-thu-mybirthday/viec/B009-people-may-01-31.md`.
Review: `.ai/hop-thu-mybirthday/review/B009-people-may-01-31-r1.md`.
Result: 93 người mới (88 quốc tế/5 Việt, 5,38%), 3/ngày trên 31 ngày. Tổng 478 người/155 ngày phủ; 385 người cũ + 4 sự kiện giữ nguyên.
Factual review: 191 tài liệu xác nhận full DOB; hai publisher mỗi người, giới hạn dữ liệu đăng ký thể thao chung được ghi rõ; claims Wikidata 93/93 human/Gregorian đúng.
Validation: Rules A–AD, Wikidata 478/478, tsc/lint/build/coverage, baseline equality, smoke 26/26 và diff check đạt. Kết quả URL B009 ghi trong review/B009-validation.json; cổng toàn ứng dụng có 5 lỗi legacy chưa sửa.
Git: đã duyệt commit/push theo chủ dự án; kết quả xác nhận remote được báo ở phản hồi cuối. Không mở tháng 6.

## Earlier completed cycle — B008

Cycle: BV-009
State: ACCEPTED — B008-r1 DAT.
Result: 90 hồ sơ mới, 3/ngày trên 30/30 ngày; 5 người Việt/85 quốc tế (5,56%). 181/181 nguồn ngoài Wiki cuối cùng tải HTTP 200; mọi hồ sơ có ít nhất một DOB ngoài Wiki ghi đủ ngày. Tổng 385 người/124 ngày; tháng 4 có 93 hồ sơ trên 30/30 ngày; 4 sự kiện được giữ nguyên.
Validation: Rules A–AC không vi phạm; P31/P569 90/90; Wikidata 385/385; TypeScript, lint, build, coverage, smoke 14/14, deep equality baseline 295 + 4 sự kiện đạt. URL scan snapshot có 16 lỗi trong 1.181 URL nhưng các URL lỗi đã bị loại/thay; lint còn 32 cảnh báo ảnh/font có sẵn.
Commit: `f7ac98139e9483fd851b97c07eafb9093d3e30e1` đã push; `origin/main` xác nhận đồng bộ 0/0.

## Reviewer Attention

Nội dung giao diện “hàng chục nghìn nhân vật” vẫn chưa tương xứng với quy mô dữ liệu hiện có; ngoài phạm vi B009.

URL legacy snapshot: James Joyce API 502; The-Sports/Trần Lê Quốc Toàn 403; Supreme Court of India/Ambedkar 403; Le Monde/Nguyễn Phú Trọng 402; Nobel biographical/Halldór Laxness thiếu exact DOB. Không nằm trong dữ liệu mới B009; chưa sửa.

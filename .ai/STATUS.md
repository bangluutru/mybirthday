# AG STATUS

## Current cycle

Cycle: BV-011
State: ACCEPTED — B010-r1 PASS ngày 2026-10-06; phần dữ liệu được duyệt phát hành.
Task: `.ai/hop-thu-mybirthday/viec/B010-people-jun-01-30.md`.
Scope/acceptance: 1–30/6; mục tiêu 90 hồ sơ, 3/ngày; tối thiểu 5% Việt Nam; 2 publisher ngoài Wikidata xác nhận exact DOB từng người; hồ sơ Việt có 2 nguồn publisher ngoài Việt Nam. P31/P569 exact Gregorian; review claims/ranks/conflicts; chỉ nhập sau factual review.
Baseline từ `origin/main`: 478 people, 4 history events, 155/366 ngày phủ; mục tiêu sau 90 hồ sơ là 568 người và 184/366 ngày. Baseline đã có hồ sơ ngày 28/6 nên 30 ngày tháng 6 chỉ tăng thêm 29 ngày phủ.
Result: tích hợp 90 hồ sơ mới (85 quốc tế/5 Việt, 5,56%), đúng 3/ngày. Tổng 568 người, tháng 6 phủ 30/30 ngày, tổng coverage 184/366. Deep equality giữ 478 hồ sơ nền + 4 events.
Review/evidence: `.ai/hop-thu-mybirthday/review/B010-people-jun-01-30-r1.md` và `B010-evidence.json`; báo cáo executor ở `xong/B010-people-jun-01-30.md`.
Validation: integrity, Wikidata 568/568, TypeScript, lint, build, coverage, smoke 9/9 và diffcheck đạt. URL scan toàn app kiểm 1.734 URL/12 lỗi ban đầu/0 manual pending; hai timeout B010 thử lại 200, nguồn DOB/context B010 đều 200. Cảnh báo URL còn lại ngoài scope, không tuyên bố global clean.
Prior-cycle Reviewer Attention: URL legacy từ các tháng trước không được sửa trong B010.

## Earlier completed cycle — B008

Cycle: BV-009
State: ACCEPTED — B008-r1 DAT.
Result: 90 hồ sơ mới, 3/ngày trên 30/30 ngày; 5 người Việt/85 quốc tế (5,56%). 181/181 nguồn ngoài Wiki cuối cùng tải HTTP 200; mọi hồ sơ có ít nhất một DOB ngoài Wiki ghi đủ ngày. Tổng 385 người/124 ngày; tháng 4 có 93 hồ sơ trên 30/30 ngày; 4 sự kiện được giữ nguyên.
Validation: Rules A–AC không vi phạm; P31/P569 90/90; Wikidata 385/385; TypeScript, lint, build, coverage, smoke 14/14, deep equality baseline 295 + 4 sự kiện đạt. URL scan snapshot có 16 lỗi trong 1.181 URL nhưng các URL lỗi đã bị loại/thay; lint còn 32 cảnh báo ảnh/font có sẵn.
Commit: `f7ac98139e9483fd851b97c07eafb9093d3e30e1` đã push; `origin/main` xác nhận đồng bộ 0/0.

## Reviewer Attention

Nội dung giao diện “hàng chục nghìn nhân vật” vẫn chưa tương xứng với quy mô dữ liệu hiện có; ngoài phạm vi B009.

URL legacy snapshot: James Joyce API 502; The-Sports/Trần Lê Quốc Toàn 403; Supreme Court of India/Ambedkar 403; Le Monde/Nguyễn Phú Trọng 402; Nobel biographical/Halldór Laxness thiếu exact DOB. Không nằm trong dữ liệu mới B009; chưa sửa.

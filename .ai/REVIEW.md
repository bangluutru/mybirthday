# BV-017 — Chất lượng dữ liệu và mở rộng lĩnh vực

State: IMPLEMENTING — theo phê duyệt trực tiếp của người dùng ngày 2026-10-08, tiếp tục rà soát hồ sơ chưa đủ evidence rồi mở rộng theo batch tới khi mỗi ngày có ít nhất 5 hồ sơ đạt chuẩn.
Reviewer/executor: Codex làm trực tiếp trên repository; không qua hộp thư.
Baseline trước BV-016: `de3ade7bf757a12c8ab2c191f9c02531f62971c7` (937 people, 4 events).
Implementation baseline: `0d67324a3bd251ce4960a418c4ea291c86238f63` (1.120 people, 4 events).

## Scope

Thực hiện tuần tự hai phần đã được người dùng duyệt:

### A. Sửa chất lượng dữ liệu hiện có

- Sửa factual issues đã xác nhận ở tháng 11–12, gồm nghề Phạm Như Phương và country mapping Alexander Dubček, Gael García Bernal; rà soát 183 hồ sơ mới về tên, nghề, lĩnh vực, country và nội dung.
- Rà soát tình trạng sống/mất. Không coi thiếu deathDate là còn sống. Thêm dữ liệu ngày mất chỉ khi bằng chứng đủ; xử lý riêng mọi claim mâu thuẫn và giữ trạng thái chưa rõ khi chưa đủ nguồn.
- Cập nhật hiển thị để trạng thái chưa rõ không xuất hiện là “nay”.
- Rà soát chất lượng biography/highlights và region; thay nội dung máy móc bằng thông tin có nguồn. Không phát minh thành tích hoặc nguồn.
- Củng cố schema/evidence và integrity checks để lỗi trong nguồn dữ liệu chính không được lặp lại trong allowlist/evidence. Negative tests gọi validator thật.
- Audit toàn bộ 1.120 hồ sơ; phân biệt đã xác minh, thiếu dữ liệu và mâu thuẫn. Giữ baseline B013/B014 evidence status đúng sự thật.
- Giữ ngoại lệ hiện trạng 22/2 (16 people) như baseline đã biết; không thêm người vào ngày đó, không xóa hồ sơ nền hợp lệ chỉ để thỏa giới hạn.

### B. Mở rộng số lượng và lĩnh vực

- Thêm `fields` nhiều giá trị hoặc tương đương để biểu diễn lĩnh vực chuyên môn mà không ép mọi người vào category rộng hiện nay.
- Bắt đầu bằng pilot 30–40 người qua nhiều tháng; xác minh quy trình và taxonomy rồi mới mở rộng.
- Mục tiêu sau cùng tối thiểu 5 hồ sơ/ngày trên 366 ngày, giữ ngoại lệ 22/2; ước tính tối thiểu +721 hồ sơ từ baseline 1.120 nếu không thay thế/xóa bản ghi.
- Ưu tiên công nghệ/kỹ thuật, y học/sức khỏe, kinh tế/kinh doanh, giáo dục/tư tưởng, xã hội/pháp luật, thiết kế/sáng tạo, trái đất/môi trường và doanh nhân.
- Mục tiêu đa dạng của batch mở rộng: ít nhất 60% thuộc lĩnh vực ưu tiên; tìm tối thiểu 50 doanh nhân; hướng tới 8–12% hồ sơ bổ sung là người Việt, ít nhất một nửa người Việt bổ sung ngoài thể thao; Hoa Kỳ không quá 30% hồ sơ bổ sung. Không hạ chuẩn để đạt quota; báo minh bạch mục tiêu không đạt.
- Mỗi người mới cần hai nguồn DOB có danh tính, ngày và nguồn gốc độc lập; evidence theo từng trường; P31/P569 audit; tình trạng sống/mất; biography và highlights có nội dung; ảnh chỉ khi quyền sử dụng phù hợp.
- Triển khai theo pilot, sau đó theo batch tháng; các chỉ tiêu mỗi ngày được đánh giá lại theo số hồ sơ đạt chuẩn sau phần A.
- Chỉ tính một hồ sơ vào ngưỡng 5/ngày khi hồ sơ có nội dung sự nghiệp thực chất được source trực tiếp hỗ trợ và identity/DOB được xác minh theo evidence hiện có hoặc capture review mới; không dùng riêng số lượng hay URL chưa kiểm tra để tuyên bố đạt.

## Acceptance

- Người đã mất không hiển thị là “nay”; không suy ra người còn sống từ trường ngày mất trống.
- Ba factual findings nói trên được giải quyết bằng bằng chứng; các trường hợp không thể chốt được đánh dấu unknown/needs-review, không đoán.
- 183 hồ sơ mới có nghề, quốc gia, tình trạng sống/mất và nội dung được rà soát; biography/highlights có thông tin thực chất được nguồn hỗ trợ.
- Integrity validator kiểm tra schema, trường nội dung, source dependency, allowlist độc lập, URL âm/dương thực sự và xung đột P31/P569.
- Báo cáo audit cho 1.120 hồ sơ nêu rõ confirmed, unknown, conflicts; không tuyên bố toàn bộ factual nếu chỉ mới kiểm tra cấu trúc.
- Pilot 30–40 hồ sơ mở rộng được review trước khi áp dụng batch lớn; taxonomy có test và không phá category cũ.
- Kết quả cuối đạt ít nhất 5 người/ngày nếu đủ người đạt chuẩn; nếu thiếu phải nêu từng ngày và không thêm dữ liệu yếu.
- Baseline changes có hash mới và test preservation hợp lệ; giữ 4 history events trừ khi có chỉ thị riêng.
- Mục tiêu tiếp tục do người dùng phê duyệt ngày 2026-10-08: hoàn tất review nội dung và mở rộng theo batch; dừng khi cả 366 ngày đều có ít nhất 5 hồ sơ được evidence manifest và validator tính là đạt.
- Validation phù hợp: `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`, cùng live source/Wikidata và HTTP smoke cho UI thay đổi.
- Cập nhật `.ai/STATUS.md`, báo cáo evidence, commit và push theo chỉ thị hiện hành.

## Reviewer attention

- BV-016 / B015+B016 đã được triển khai ở commit `0d67324a3bd251ce4960a418c4ea291c86238f63`; trước review mới trạng thái là WAITING_FOR_REVIEW. Yêu cầu trực tiếp ngày 2026-10-07 cho phép tiếp tục sửa chất lượng và mở rộng.
- Yêu cầu trực tiếp ngày 2026-10-08 phê duyệt tiếp tục BV-017 sau pilot; cập nhật trạng thái sang IMPLEMENTING và chỉ xử lý mục tiêu evidence-backed >=5 hồ sơ/ngày.
- Baseline 22/2 có 16 people, vượt ngưỡng 8 trong directive cũ; giữ nguyên ngoại lệ cho kế hoạch này.
- B014 tháng 10 từng WAITING_FOR_REVIEW; không ghi nhận ACCEPTED nếu chưa review evidence.

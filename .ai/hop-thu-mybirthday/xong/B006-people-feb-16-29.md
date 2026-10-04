# B006 — Báo cáo thực hiện ngày 16–29/2

Cycle BV-007. Executor/reviewer: Codex theo chủ dự án; triển khai trực tiếp sau B005 DAT/push. Baseline HEAD 56bdf9d72567bef02a5106c1fbc58abeb4697cb2.

## Kết quả dữ liệu

Thêm 35 người: 2 Việt Nam /33 quốc tế, tỷ lệ mới 5,714%; 13 quốc gia. Tổng 202 người trên 65/366 ngày (17,8%). Tháng 1 giữ 95 người/31 ngày; tháng 2 có100 người/29 ngày, mỗi ngày ít nhất3, kể cả29/2. Không thêm22/2 (vẫn16 người), giữ4 sự kiện nguyên vẹn. Chưa phủ toàn năm.

|Ngày|Chung bindings/QID (≥60)|VN bindings/QID (≥0)|Mới VN/quốc tế|Tổng ngày|
|---|---:|---:|---:|---:|
|16/2|100/10|8/8|0/3|3|
|17/2|100/14|11/8|1/2|3|
|18/2|100/7|7/5|0/2|3|
|19/2|91/16|15/9|1/2|3|
|20/2|100/11|20/17|0/3|3|
|21/2|100/15|7/7|0/3|3|
|22/2|100/8|18/15|0/0|16|
|23/2|100/9|26/16|0/3|3|
|24/2|52/12|7/5|0/2|3|
|25/2|100/3|8/7|0/3|3|
|26/2|100/9|15/9|0/3|3|
|27/2|100/5|7/7|0/2|3|
|28/2|100/12|23/15|0/2|3|
|29/2|22/6|1/1|0/3|3|

LIMIT 100 mỗi truy vấn, không phải toàn bộ ứng viên. Supplemental query manifest lưu 5 truy vấn định danh giới hạn và lý do.

## Kiểm tra sự thật và nguồn

- 35 QID người thật Q5; tất cả P569 Gregorian precision11 còn hiệu lực đồng thuận. Lưu toàn bộ P569/rank/references trong B006-evidence.json, không chọn lọc preferred để bỏ mâu thuẫn. Các truy vấn từng ngày, tham số, thời gian, số bindings/QID và truy vấn định danh bổ sung được lưu riêng; raw Wikidata chỉ giữ local.
- Đã mở và rà nội dung thật 70 nguồn ngoài Wiki cho35 người, đúng danh tính, nghề nghiệp, quốc gia và từng claim trong tiểu sử ngắn. 66 nguồn có ngày sinh đầy đủ; Apple/Steve Jobs, Rock Hall/George Harrison và IBM/Hollerith chỉ hỗ trợ danh tính, Pritzker/Gehry hỗ trợ năm/danh tính/giải thưởng. Mọi hồ sơ đều có nguồn chính thống đủ DOB. Highlights dùng ngày sinh và tiểu sử đã kiểm; không bổ sung nơi sinh hoặc ảnh chưa có chứng cứ.
- B006-evidence.json lưu publisher/country, exactURL, thời điểm mở, hash nội dung gốc/văn bản, vị trí và trích nguyên ngữ ≤25 từ mỗi nguồn/hồ sơ. B006-source-review.json rà100%70 nguồn. B006-evidence-final-check.json xác nhận70hash/quotes/exactURLs và35highlights khớp. Kiểm hash/URL không thay thế rà sự thật.
- Nguyễn Văn Hoàng: AFC U23 Technical Report2018, trang vật lý57, Vietnam goalkeeper23, 17-02-1995; đối chiếu VPF. Bùi Tấn Trường: AFC Champions League2016 preliminary registration, trang vật lý8, Becamex Binh Duong(VIE), hàng2/số1, 19 Feb,1986; đối chiếu VPF. AFC phát hành ởMalaysia, VPF Việt Nam. Cả hai có đầy đủ DOB trong tài liệu ngoài Việt Nam. Hai đơn vị quản lý độc lập nhưng có thể cùng dùng đăng ký liên đoàn/cầu thủ, không khẳng định hai cuộc điều tra DOB độc lập; không đạt mục tiêu ưu tiên hai nguồn nước ngoài cho mỗi VN.
- SNL/Croatian Encyclopedia là hai đơn vị biên tập khác nhau, văn bản gốc khác nhau; chưa thấy bài sao chép/syndication. Không khẳng định họ không bao giờ chia sẻ nguồn thứ cấp. Nguồn Nobel, National Archives, McLaren, IHA, Moncloa và các tổ chức khác được đối chiếu khi cần.
- P570 Boltzmann/Renoir có ngày thay thế: giữ mọi claims trong evidence, chọn5/9/1906 và3/12/1919 vì cả hai bách khoa trích dẫn đều đồng thuận. Không suy diễn nơi mất của Poitier khi nguồn khác nhau.
- Loại Mo Yan vì mâu thuẫn DOB với tự thuật Nobel; Handel vì ngày23/2 dùng Julian, Gregorian là5/3; Caruso và Goldoni vì ngày giữa nguồn khác nhau. SNL/Arrhenius và Croatian/Prost ghi lệch ngày nên thay nguồn bằng các tổ chức có đầy đủ ngày phù hợp. Nguồn lỗi404/403/index không được dùng. B006-excluded.json ghi các trường hợp; không tự hòa giải lịch hay ép số lượng.

## Cổng và bảo toàn

- Test X/Y fail trước bổ sung:14vi phạm; sau sửa toàn bộ A–Y đạt0vi phạm, 202người/16người22Feb/4events. RuleY kiểm35tối thiểu,5%VN và registry exactURL/QID với kiểm âm host giả/query lạ/path lạ/URL hỏng/QID sai.
- Reviewer sửa RuleL theo chỉ thị bổ sung: chỉ cho phép object steve-jobs/Q19837/1955-02-24 đã kiểm chứng trong02.ts; tên vẫn cấm ở UI, DOB/QID khác và hardcode ngoài record. Kiểm dương/âm được thêm, không bỏ cổng chống fixture cũ. Đây là điều chỉnh test để cho phép dữ liệu đúng ngày24/2.
- Wikidata toàn bộ202/202 matched,0mismatch/0missing; TypeScript, lint, build, coverage đạt. Lint còn cảnh báo img từ trước, không lỗi.
- Production build smoke10/10 route đạt, kiểm các tên đúng ngày và không có ảnh người sai ngày ở16/28/29/1Feb. Deep equality167hồ sơ baseline và4events nguyên vẹn. Raw build/validation và smokeJSON lưu trong nhap/B006-*.
- Cổng URL toàn bộ đạt:640 checked,0failed,0Britannica MANUAL pending. Dùng helper HTTP GET/body thật đã được B005 duyệt; retry hữu hạn lỗi transport, không cache/mock/whitelist hay tự xác nhận MANUAL. Kết quả cuối đáp ứng0failed/0MANUAL; DAT trước tích hợp.

## FILES

src/data/people/02.ts; scripts/test-integrity.ts; README.md; chỉ thị B006 với điều chỉnh executor/RuleL; .ai/REVIEW.md vàSTATUS; KE-HOACH/nhat-ky; xong/review B006; evidence/source-review/excluded/daily-summary/baseline/query-manifest/supplemental-query/people/final-check/test-fail/test/Wikidata/URLs/tsc/lint/build/coverage/smoke và helper smoke B006 được chọn lọc. Không đưa raw Wikidata, HTML/PDF nguyên gốc, nháp saiQID hoặc log trung gian B005 vào commit.

Giới hạn: 301/366 ngày vẫn chưa có người. Không mở tháng3 trước chỉ thị mới. Không thay UI/dependencies/events hoặc baseline.

## Reviewer Attention ngoài phạm vi

Trang /day còn câu cũ “hàng chục nghìn nhân vật” trong phần tra cứu cùng năm, trong khi dữ liệu thực tế202. Chưa sửa UI vì B006 chỉ dữ liệu/test; cần xử lý trong chu kỳ nội dung UI riêng.

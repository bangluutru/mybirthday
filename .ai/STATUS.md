# AG STATUS

## Current cycle

Cycle: BV-017 — quality repair and field expansion

State: WAITING_FOR_REVIEW — pilot implementation and validation completed 2026-10-08; awaiting reviewer decision before any larger expansion batch.

Scope: Repair the reviewed quality backlog on the 1,120-person implementation baseline, retain the multi-field taxonomy, and add an evidence-backed 30-person expansion pilot across January–October. Current total: 1,150 people. Keep the February 22 baseline exception at 16 people. Do not start the 5-per-day expansion batch until the pilot is reviewed.

### Tiến độ BV-017

- Hoàn tất các sửa factual đã xác nhận ở tháng 11–12; bổ sung bằng chứng ngày mất cho Lou Donaldson, Bonnie Greer và Val Kilmer; sửa cách hiển thị để thiếu ngày mất không bị hiểu là còn sống.
- Hoàn tất 185 facts có capture trực tiếp cho 183/183 hồ sơ B015+B016 (159 facts tiểu sử/sự nghiệp và 26 facts giải thưởng); lượt sửa bổ sung 49 facts còn thiếu. Biography/highlights của hồ sơ mới giữ theo fact đã duyệt; không dùng trang ghi rõ nội dung tổng hợp do AI tạo làm căn cứ.
- Đã thay excerpt ghép/suy diễn bằng nội dung trích từ capture HTTP hoặc snippet trình duyệt lưu kèm hash; cập nhật các câu về Victor French, Kurt Waldheim, Carlos Montoya và Eduard Uspensky; bổ sung nguồn cho Ismail Merchant, Gordon Jackson, Carol Reed, Joseph Bologna và Alfonso Cuarón; sửa publisher Kurt Waldheim thành United Nations Archives.
- Backlog low-information đã đóng: 738/738 hồ sơ có fact tiếng Việt đã review với capture HTTPS/hash và kiểm tra danh tính/nội dung; thay 508 highlights chỉ có ngày sinh/category, 93 highlights chỉ ghi nghề nghiệp chung và 137 highlights lặp mô tả ngắn. Đã thay 552 biography theo mẫu ngày sinh/vai trò bằng fact có nguồn. Audit mẫu còn 47 highlights lặp shortDescription ở các hồ sơ có nội dung substantive; cần reviewer quyết định có yêu cầu fact thứ hai trước khi thay hay không.
- Thêm `Person.fields` dạng nhiều giá trị, nhãn tiếng Việt và hiển thị nhãn trên trang chi tiết; giữ nguyên `category` cũ. Taxonomy hiện được gắn cho 40 hồ sơ B015+B016 và 30 hồ sơ pilot, tổng cộng 70 hồ sơ/111 assignments qua đủ 9 field values.
- Bổ sung đúng 30 hồ sơ pilot: 3 hồ sơ/tháng, mỗi ngày khác nhau, từ tháng 1 đến tháng 10; không thêm vào tháng 11–12. Mỗi hồ sơ có hai nguồn DOB độc lập (60 captures), hai career facts có capture trực tiếp (60 facts), audit Wikidata P31/P569/P570/P27/P106, field mapping theo evidence và trạng thái sống/mất được ghi tường minh.
- Pilot có 25 deceased, 4 living và 1 unknown; Nguyễn Thị Bình giữ unknown vì chưa đủ nguồn hiện thời để kết luận. Garrett Morgan giữ trạng thái deceased nhưng không ghi ngày mất do P570 hiện có hai ngày mâu thuẫn. Tất cả 30 hồ sơ dùng placeholder trung tính do chưa xác nhận quyền dùng ảnh.
- Pilot có 30/30 người thuộc field ưu tiên, 8 hồ sơ doanh nhân/khởi nghiệp, 3 người Việt (10%; hai người không thuộc thể thao), và 9 người Hoa Kỳ (30%). Đây là chỉ số của pilot, không được suy rộng thành mục tiêu cho batch sau.
- Thêm hai capture tổ chức trực tiếp cho Alvar Aalto Foundation và The Body Shop vào evidence/publisher checks để bảo đảm hồ sơ Aalto và Anita Roddick có nguồn tổ chức rõ ràng.
- `.ai/evidence/BV017-quality-audit.json` đã làm mới cho 1.150 hồ sơ. Đây là audit trường dữ liệu và mẫu văn bản; không tuyên bố đã tái nghiên cứu độc lập mọi nguồn lịch sử.

### Baseline

`origin/main` ban đầu của BV-017: `0d67324a3bd251ce4960a418c4ea291c86238f63` (1.120 people, 4 events), bằng `origin/main` khi bắt đầu triển khai. Baseline lịch sử trước B013: `de3ade7bf757a12c8ab2c191f9c02531f62971c7` (937 people; 306/366 ngày); SHA-256 hồ sơ `889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa`, events `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

### Kết quả

Tổng hiện tại 1.150 people, phủ 366/366 ngày; tháng 11 có 90 hồ sơ mới, tháng 12 có 93 hồ sơ mới cộng Edvard Munch nền, và pilot BV-017 thêm 30 hồ sơ trong tháng 1–10. Baseline B013/B014/B015/B016 được kiểm tra độc lập sau khi loại đúng ID của các cycle/batch mới hơn.

Evidence mở rộng nằm trong `.ai/evidence/BV017-expansion-pilot.json`: ID/QID/DOB/country/category/occupation/fields/status allowlist; cặp nguồn DOB và capture hashes; Wikidata claims; 60 facts nghề nghiệp; tình trạng sống/mất; phân bố field/nationality; và capture bổ sung cho nguồn tổ chức. `scripts/test-bv017-expansion-pilot.ts` thêm Rule AM, gồm allowlist URL âm/dương và các hash evidence. Rule AL giữ kiểm tra taxonomy/pilot 40 hồ sơ B015+B016.

### Validation

- `npm test`: PASS, 0 violations; tổng 1.150 hồ sơ; Rules AH–AM và baseline-preservation checks PASS.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS; warning `<img>` hiện hữu.
- `npm run build`: PASS.
- `npm run coverage`: PASS, 366/366 ngày có dữ liệu; không có ngày trống.
- `npm run verify:wikidata`: PASS, 1.150 matched, 0 mismatched, 0 thiếu P569.
- HTTP smoke trên production build local: PASS `/person/alvar-aalto` và `/person/anita-roddick`; cả hai trả HTTP 200 và hiển thị nhãn field cùng nội dung hồ sơ.
- `git diff --check`: PASS.
- Full-corpus URL scan: đã dừng sau 58 URL đầu tiên (0 lỗi) vì checker chạy tuần tự qua 3.889 URL. Pilot có 60 capture nguồn DOB, 60 capture career facts và 2 capture nguồn tổ chức — tổng 122 capture HTTP 200 được pin SHA-256 trong evidence.

### Reviewer Attention

- Pilot là checkpoint review bắt buộc trước batch mở rộng lớn hơn. Chưa chạy batch >=5/ngày; kết quả pilot chưa được xem là chấp thuận để mở rộng tiếp.
- 47 highlights lặp shortDescription vẫn có fact substantive đã ghi nguồn; fact thứ hai chưa được review riêng, nên chưa tự thay nội dung.
- Audit 1.150 hồ sơ còn 840 hồ sơ `lifeStatus` thiếu hoặc `unknown`; thiếu ngày mất không được suy ra là còn sống. Có 306 hồ sơ đánh dấu deceased, 4 living trong pilot, 276 ngày mất với source URL riêng. Audit trường dữ liệu không tương đương tái xác minh mọi claim nguồn.
- Wikidata snapshot cho dữ liệu trước pilot có 33 hồ sơ nhiều P570 active claims: 27 ngày mất chính xác được chốt, 1 chỉ xác nhận ngày sự kiện, 5 giữ deceased nhưng không ghi ngày cụ thể. Còn 0 conflict chưa review. Không thêm ngày mất dựa riêng trên P570.
- Ba P569 active không có reference trong audit B015+B016: Phạm Thị Nguyệt Anh (Q137214005), Ruben Nirvi (Q11891308), Trần Thị Duyên (Q121028378); mỗi ngày sinh vẫn được đối chiếu với hai nguồn độc lập.
- Hai sai khác ngày sinh giữa nguồn cần reviewer theo dõi: François Mitterrand — trang Élysée tiếng Pháp ghi 26/10/1916, bản tiếng Anh ghi 26/11/1916 (`https://www.elysee.fr/francois-mitterrand`, `https://www.elysee.fr/en/francois-mitterrand`); Camille Saint-Saëns — BnF authority và Paris Opera ghi 9/10/1835, press dossier PDF của BnF ghi 8/10 (`https://catalogue.bnf.fr/ark:/12148/cb13899342r`, `https://www.operadeparis.fr/artistes/camille-saint-saens`, `https://www.bnf.fr/sites/default/files/2021-06/DP_Saint-Saens.pdf`). Ngày hiện lưu được hỗ trợ bởi các nguồn độc lập còn lại.
- B013/September đã PASS; B014/October trước BV-017 ở trạng thái WAITING_FOR_REVIEW, không tự ghi nhận ACCEPTED.
- Ngoại lệ baseline ngày 22/2 có 16 người được giữ nguyên theo phạm vi BV-017.

## Earlier accepted cycle — BV-014 / B013

PASS ngày 2026-10-07. Thêm 90 người tháng 9 (5 Việt), tổng 844 người/275 ngày; bảo toàn 754 baseline + 4 events. Full Wikidata 844/844, integrity/typecheck/lint/build/coverage/smoke đều PASS. Commit `c981aa7409388f334f08cf57e2e16c4f830d181d` đã push; origin/main xác nhận 0/0.

## Earlier accepted cycle — BV-013 / B012

PASS ngày 2026-10-07. Thêm 93 người tháng 8 (5 Việt), tổng 754 người/245 ngày; bảo toàn 661 baseline + 4 events. Commit `238f8989b366857146ff435572506932539ec176` đã push và xác minh origin/main 0/0.

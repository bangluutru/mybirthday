# AG STATUS

## Current cycle

Cycle: BV-017 — quality repair and field expansion

State: IMPLEMENTING — direct user approval on 2026-10-08 authorizes continuing review and evidence-backed expansion until every calendar day has at least five quality-approved profiles.

Scope: Repair the reviewed quality backlog on the 1,120-person implementation baseline, retain the multi-field taxonomy, review existing profiles without direct career-fact captures, and expand in evidence-backed batches until every date has at least five quality-approved profiles. Current total: 1,176 people. Evidence-backed five-profile/day target is complete for January 1-13 (13/366 dates). Keep the February 22 baseline exception at 16 people.

### Tiến độ BV-017

- Hoàn tất các sửa factual đã xác nhận ở tháng 11–12; bổ sung bằng chứng ngày mất cho Lou Donaldson, Bonnie Greer và Val Kilmer; sửa cách hiển thị để thiếu ngày mất không bị hiểu là còn sống.
- Hoàn tất 185 facts có capture trực tiếp cho 183/183 hồ sơ B015+B016 (159 facts tiểu sử/sự nghiệp và 26 facts giải thưởng); lượt sửa bổ sung 49 facts còn thiếu. Biography/highlights của hồ sơ mới giữ theo fact đã duyệt; không dùng trang ghi rõ nội dung tổng hợp do AI tạo làm căn cứ.
- Đã thay excerpt ghép/suy diễn bằng nội dung trích từ capture HTTP hoặc snippet trình duyệt lưu kèm hash; cập nhật các câu về Victor French, Kurt Waldheim, Carlos Montoya và Eduard Uspensky; bổ sung nguồn cho Ismail Merchant, Gordon Jackson, Carol Reed, Joseph Bologna và Alfonso Cuarón; sửa publisher Kurt Waldheim thành United Nations Archives.
- Backlog low-information đã đóng: 738/738 hồ sơ có fact tiếng Việt đã review với capture HTTPS/hash và kiểm tra danh tính/nội dung; thay 508 highlights chỉ có ngày sinh/category, 93 highlights chỉ ghi nghề nghiệp chung và 137 highlights lặp mô tả ngắn. Đã thay 552 biography theo mẫu ngày sinh/vai trò bằng fact có nguồn. Audit mẫu còn 47 highlights lặp shortDescription ở các hồ sơ có nội dung substantive; cần reviewer quyết định có yêu cầu fact thứ hai trước khi thay hay không.
- Thêm `Person.fields` dạng nhiều giá trị, nhãn tiếng Việt và hiển thị nhãn trên trang chi tiết; giữ nguyên `category` cũ. Taxonomy hiện được gắn cho 118 hồ sơ trong toàn bộ dữ liệu, tổng 170 assignments qua đủ 9 field values; gồm 40 hồ sơ B015+B016, 30 hồ sơ pilot và các hồ sơ legacy đã review trong batch tháng 1.
- Bổ sung đúng 30 hồ sơ pilot: 3 hồ sơ/tháng, mỗi ngày khác nhau, từ tháng 1 đến tháng 10; không thêm vào tháng 11–12. Mỗi hồ sơ có hai nguồn DOB độc lập (60 captures), hai career facts có capture trực tiếp (60 facts), audit Wikidata P31/P569/P570/P27/P106, field mapping theo evidence và trạng thái sống/mất được ghi tường minh.
- Batch ngày 1–10/1 đã review 50 hồ sơ, bổ sung 20 hồ sơ và 100 career facts; 225 capture nguồn/Wikidata được pin SHA-256 trong 10 manifest. Mỗi ngày 1–10 hiện có đúng 5 hồ sơ trong batch review. Ngày 7 thêm Cao Đình Thuyên và Achille Maramotti, sửa nội dung Fillmore/Hamilton/Joseph Bonaparte, ghi xung đột P569 độ chính xác năm của Hamilton, và giữ địa danh nơi sinh của Joseph ở mức Corsica do hai nguồn bất đồng Ajaccio/Corte. Ngày 9 thêm Karel Čapek và Jimmy Page, cập nhật hồ sơ Richard Nixon, Simone de Beauvoir và Joan Baez. Ngày 10 review Donald Knuth, Robert Woodrow Wilson và George Foreman; thêm Michel Henry và Rod Stewart. Lô này lưu 26 capture hash và 10 facts nghề nghiệp; bổ sung bằng chứng ngày mất 2025-03-21 cho Foreman, giữ lifeStatus của Wilson là unknown do không có nguồn hiện thời đã lưu, và xử lý P569 của Foreman theo độ chính xác năm thay vì coi đó là ngày sinh cạnh tranh.
- Batch ngày 11/1 nâng tổng lên 55 hồ sơ đã review, 22 hồ sơ mới, 110 career facts và 256 capture nguồn/Wikidata qua 11 manifest. Lô rà soát Kailash Satyarthi, Roger Guillemin, Nguyễn Hoàng Đức; thêm Alice Paul và Mary J. Blige. Có hai nguồn DOB khác publisher host cho mỗi người, hai career facts mỗi hồ sơ và kiểm tra P31/P569/P570/P27/P106. Roger Guillemin có ngày mất 21/2/2024 được Salk xác nhận trực tiếp; Alice Paul chọn 9/7/1977 theo NPS dù Wikidata còn claim normal-rank 9/7/1978. Nơi sinh Alice chỉ ghi New Jersey do hai nguồn địa phương ghi Mount Laurel và Moorestown khác nhau. Tình trạng living của Satyarthi, Hoàng Đức và Mary được ghi với capture hiện thời tính đến 8/10/2026.
- Batch ngày 12/1 nâng tiến độ lên 60 hồ sơ đã review, 24 hồ sơ mới, 120 career facts và 280 capture nguồn/Wikidata qua 12 manifest. Lô rà soát Jack London, Swami Vivekananda và Charles Perrault; thêm Haruki Murakami và Melanie C. Mỗi hồ sơ có hai nguồn DOB khác publisher host, hai career facts có capture trực tiếp và snapshot Wikidata P31/P569/P570/P27/P106. Có 3 hồ sơ ngày mất được xác nhận trực tiếp (Jack, Swami, Perrault); Haruki giữ `lifeStatus: unknown` vì chưa có nguồn hiện thời đã lưu; Melanie được ghi living theo lịch biểu diễn Live Nation hiện thời tại ngày capture 8/10/2026. Lưu ý lần recheck sau đó của trang PIB cho Swami trả HTTP 403; capture HTTP 200 trước đó vẫn được lưu và khóa hash trong manifest.
- Batch ngày 13/1 nâng tiến độ lên 65 hồ sơ đã review, 26 hồ sơ mới, 130 career facts và 305 capture nguồn/Wikidata qua 13 manifest. Lô rà soát Wilhelm Wien, Sydney Brenner và Patrick Dempsey; thêm Zhou Youguang và Michael Bond. Mỗi hồ sơ có hai nguồn DOB khác publisher host, hai career facts có capture trực tiếp và snapshot Wikidata P31/P569/P570/P27/P106. Có 4 ngày mất được xác nhận trực tiếp (Wien, Brenner, Zhou, Bond); Dempsey giữ `lifeStatus: unknown` vì chưa có nguồn hiện thời được lưu. Cả hai hồ sơ mới dùng placeholder trung tính do chưa xác nhận quyền dùng ảnh.
- Pilot có 25 deceased, 4 living và 1 unknown; Nguyễn Thị Bình giữ unknown vì chưa đủ nguồn hiện thời để kết luận. Garrett Morgan giữ trạng thái deceased nhưng không ghi ngày mất do P570 hiện có hai ngày mâu thuẫn. Tất cả 30 hồ sơ dùng placeholder trung tính do chưa xác nhận quyền dùng ảnh.
- Pilot có 30/30 người thuộc field ưu tiên, 8 hồ sơ doanh nhân/khởi nghiệp, 3 người Việt (10%; hai người không thuộc thể thao), và 9 người Hoa Kỳ (30%). Đây là chỉ số của pilot, không được suy rộng thành mục tiêu cho batch sau.
- Thêm hai capture tổ chức trực tiếp cho Alvar Aalto Foundation và The Body Shop vào evidence/publisher checks để bảo đảm hồ sơ Aalto và Anita Roddick có nguồn tổ chức rõ ràng.
- `.ai/evidence/BV017-quality-audit.json` đã làm mới cho 1.176 hồ sơ. Đây là audit trường dữ liệu và mẫu văn bản; không tuyên bố đã tái nghiên cứu độc lập mọi nguồn lịch sử.

### Baseline

`origin/main` ban đầu của BV-017: `0d67324a3bd251ce4960a418c4ea291c86238f63` (1.120 people, 4 events), bằng `origin/main` khi bắt đầu triển khai. Baseline lịch sử trước B013: `de3ade7bf757a12c8ab2c191f9c02531f62971c7` (937 people; 306/366 ngày); SHA-256 hồ sơ `889afd19959eeddcc367e5910f4fa35d89922fcde8722efe99e3de6157702aaa`, events `6dd4aae214c2b43131155c6483c3f3c575fe632e1287583c5c28ce4e40dcfd07`.

### Kết quả

Tổng hiện tại 1.176 people, phủ thô 366/366 ngày; evidence-backed ngưỡng 5/ngày đã hoàn tất 13/366 ngày. Tháng 11 có 90 hồ sơ mới, tháng 12 có 93 hồ sơ mới cộng Edvard Munch nền, pilot BV-017 thêm 30 hồ sơ trong tháng 1–10, và batch ngày 1–13 thêm 26 hồ sơ. Baseline B013/B014/B015/B016 được kiểm tra độc lập sau khi loại đúng ID của các cycle/batch mới hơn.

Evidence mở rộng nằm trong `.ai/evidence/BV017-expansion-pilot.json`: ID/QID/DOB/country/category/occupation/fields/status allowlist; cặp nguồn DOB và capture hashes; Wikidata claims; 60 facts nghề nghiệp; tình trạng sống/mất; phân bố field/nationality; và capture bổ sung cho nguồn tổ chức. `scripts/test-bv017-expansion-pilot.ts` thêm Rule AM, gồm allowlist URL âm/dương và các hash evidence. Rule AL giữ kiểm tra taxonomy/pilot 40 hồ sơ B015+B016.

`.ai/evidence/BV017-baseline-projection.json` lưu delta các trường đã đổi so với implementation baseline `0d67324a3bd251ce4960a418c4ea291c86238f63` (1.120 hồ sơ): 1.074 hồ sơ, 3.904 trường. Rule AK xác minh hash manifest và phép chiếu; so sánh trực tiếp cả 1.120 hồ sơ chiếu với commit baseline cho 0 mismatch. Snapshot này giúp các kiểm tra hash lịch sử không bỏ sót thay đổi BV-017 ở nội dung, trạng thái và taxonomy.

### Validation

- `npm test`: PASS, 0 violations; tổng 1.176 hồ sơ; Rules AH–AZ, Rules AJ/AK/AL/AM và baseline-preservation checks PASS.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS; còn warning `<img>`/font hiện hữu.
- `npm run build`: PASS.
- `npm run coverage`: PASS, 366/366 ngày có dữ liệu, 1.176 hồ sơ; không có ngày trống (coverage tổng không đồng nghĩa đã đạt ngưỡng 5 hồ sơ được evidence-review mỗi ngày).
- `npm run verify:wikidata`: PASS, 1.176 matched, 0 mismatched, 0 thiếu P569.
- HTTP smoke trên production build local: PASS `/person/alvar-aalto` và `/person/anita-roddick`; cả hai trả HTTP 200 và hiển thị nhãn field cùng nội dung hồ sơ.
- HTTP smoke trên production build local: PASS `/person/karel-capek` và `/person/jimmy-page`; cả hai trả HTTP 200 và hiển thị tên hồ sơ.
- HTTP smoke trên production build local: PASS `/person/donald-knuth`, `/person/robert-woodrow-wilson`, `/person/george-foreman`, `/person/michel-henry` và `/person/rod-stewart`; cả năm trả HTTP 200 và hiển thị tên hồ sơ; Wilson không bị hiển thị như còn sống.
- HTTP smoke trên production build local: PASS `/person/alice-paul` và `/person/mary-j-blige`; cả hai trả HTTP 200, hiển thị tên và nhãn field tiếng Việt.
- HTTP smoke trên production build local: PASS `/person/haruki-murakami`, `/person/melanie-c` và `/birthday/1/12`; cả ba trả HTTP 200 và ngày 12/1 hiển thị đủ 5 hồ sơ trong batch đã review.
- HTTP smoke trên production build local: PASS `/person/zhou-youguang`, `/person/michael-bond` và `/birthday/1/13`; cả ba trả HTTP 200 và ngày 13/1 hiển thị đủ 5 hồ sơ trong batch đã review.
- `git diff --check`: PASS.
- Full-corpus URL scan: đã dừng sau 58 URL đầu tiên (0 lỗi) vì checker chạy tuần tự qua 3.889 URL. Jan 1–13 có tổng cộng 305 capture nguồn/DOB/career/Wikidata trong evidence manifests; capture của lô 13/1 được pin SHA-256. Lần recheck PIB sau capture trả 403, được ghi nhận như giới hạn truy cập hiện thời.

### Reviewer Attention

- User directly approved continuation on 2026-10-08; the calendar-wide 5-profile target is active and is counted from reviewed evidence, not total records. Current progress: 13/366 dates; keep working only within BV-017 scope.
- 47 highlights lặp shortDescription vẫn có fact substantive đã ghi nguồn; fact thứ hai chưa được review riêng, nên chưa tự thay nội dung.
- Audit 1.176 hồ sơ có 516 hồ sơ khai báo trường `lifeStatus`: 17 living, 337 deceased và 162 unknown; 660 hồ sơ thiếu trường này. Tổng cộng 822 hồ sơ chưa có trạng thái living/deceased được xác định. Có 307 ngày mất với source URL riêng và 297 hồ sơ có capture ngày mất trực tiếp trong evidence. Audit trường dữ liệu không tương đương tái xác minh mọi claim nguồn.
- Wikidata snapshot có 33 hồ sơ nhiều P570 active claims: 27 ngày mất chính xác được chốt, 1 chỉ xác nhận ngày sự kiện, 5 giữ deceased nhưng không ghi ngày cụ thể. Còn 0 conflict chưa review. Không thêm ngày mất dựa riêng trên P570.
- Expansion pilot cộng batch ngày 1–13 có 56 hồ sơ mới: 16 Hoa Kỳ (28,57%, sát ngưỡng tối đa 30%), 4 Việt Nam (7,14%, thấp hơn mục tiêu theo dõi 8–12%); cả 4 hồ sơ Việt Nam mới đều ngoài thể thao. Giữ chuẩn chứng cứ khi lựa chọn bổ sung tiếp theo và ưu tiên hồ sơ Việt Nam đủ nguồn.
- Ba P569 active không có reference trong audit B015+B016: Phạm Thị Nguyệt Anh (Q137214005), Ruben Nirvi (Q11891308), Trần Thị Duyên (Q121028378); mỗi ngày sinh vẫn được đối chiếu với hai nguồn độc lập.
- Hai sai khác ngày sinh giữa nguồn cần reviewer theo dõi: François Mitterrand — trang Élysée tiếng Pháp ghi 26/10/1916, bản tiếng Anh ghi 26/11/1916 (`https://www.elysee.fr/francois-mitterrand`, `https://www.elysee.fr/en/francois-mitterrand`); Camille Saint-Saëns — BnF authority và Paris Opera ghi 9/10/1835, press dossier PDF của BnF ghi 8/10 (`https://catalogue.bnf.fr/ark:/12148/cb13899342r`, `https://www.operadeparis.fr/artistes/camille-saint-saens`, `https://www.bnf.fr/sites/default/files/2021-06/DP_Saint-Saens.pdf`). Ngày hiện lưu được hỗ trợ bởi các nguồn độc lập còn lại.
- B013/September đã PASS; B014/October trước BV-017 ở trạng thái WAITING_FOR_REVIEW, không tự ghi nhận ACCEPTED.
- Ngoại lệ baseline ngày 22/2 có 16 người được giữ nguyên theo phạm vi BV-017.

## Earlier accepted cycle — BV-014 / B013

PASS ngày 2026-10-07. Thêm 90 người tháng 9 (5 Việt), tổng 844 người/275 ngày; bảo toàn 754 baseline + 4 events. Full Wikidata 844/844, integrity/typecheck/lint/build/coverage/smoke đều PASS. Commit `c981aa7409388f334f08cf57e2e16c4f830d181d` đã push; origin/main xác nhận 0/0.

## Earlier accepted cycle — BV-013 / B012

PASS ngày 2026-10-07. Thêm 93 người tháng 8 (5 Việt), tổng 754 người/245 ngày; bảo toàn 661 baseline + 4 events. Commit `238f8989b366857146ff435572506932539ec176` đã push và xác minh origin/main 0/0.

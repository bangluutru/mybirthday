| 2026-10-03 | Claude | B001 | Giao việc: loại dữ kiện hard-code/bịa khỏi UI (chu kỳ BV-002) |
| 2026-10-03 14:56 | Gemini | B001 | Nộp báo cáo xong/B001-purge-hardcoded-facts.md (test/lint/tsc/build/smoke 15 routes đều pass) |
| 2026-10-03 | Claude | B001 | Review: SUA (5 chỗ: chip 19/5 không có người, hero còn fallback hard-code, thẻ chiêm tinh rò 22/2 sang ngày khác, "Độ xác thực 100%" bịa, Rule L số 183 khớp chuỗi con) |
| 2026-10-03 15:36 | Gemini | B001 | Nộp báo cáo xong/B001-purge-hardcoded-facts-v2.md (đã sửa đủ 5 điểm review của Claude, test/lint/tsc/build/smoke/content 5/10 & 12/31 đều sạch) |
| 2026-10-03 | Claude | B001 | Review r2: DAT, đã commit 39f7bd6. BV-002 ACCEPTED |
| 2026-10-03 | Claude | B002 | Giao việc: hạ tầng dữ liệu theo tháng + verifiedAt + coverage (chu kỳ BV-003) |
| 2026-10-03 16:00 | Gemini | B002 | Nộp báo cáo xong/B002-monthly-data-infra.md (R1-R6 hoàn thành, diff snapshot rỗng, HTML trước/sau khớp 100%, coverage 12/366, test Rules 0/A-O pass, tsc/lint/build sạch) |
| 2026-10-03 | Claude | B002 | Review: SUA (1 chỗ: `as any` x2 trong test-integrity.ts). Đối chiếu độc lập 366 ngày + slug + sự kiện: giống hệt |
| 2026-10-03 | Claude | B003 | Chủ dự án chọn Wikidata CC0 + rà soát từng ngày 1/1→31/12. Soạn bản nháp B003 (1/1–15/1) trong viec-cho/, giao sau khi B002 DAT |
| 2026-10-03 16:53 | Gemini | B002 | Nộp báo cáo xong/B002-monthly-data-infra-v2.md (đã sửa bỏ as any, validateVerifiedAt dùng unknown + type narrowing, grep scripts rỗng, test/tsc/lint/build sạch) |
| 2026-10-03 | Claude | B002 | Review v2: DAT (commit bcf74c0); snapshot độc lập khớp, cổng sạch, 13 URL 200 |
| 2026-10-03 | Claude | B003 | Giao việc: Wikidata pilot nhân vật 1/1–15/1 (chu kỳ BV-004), chuyển từ viec-cho |
| 2026-10-03 17:16 | Gemini | B003 | Nộp báo cáo xong/B003-people-jan-01-15.md (R1-R5 hoàn thành; 45 người mới 1/1–15/1; test Rules 0/A-S, tsc, lint, build, verify:wikidata 100% khớp, coverage 15/31 tháng 1, 9 route smoke HTTP 200) |
| 2026-10-03 | Claude | B003 | Review: SUA (5 chỗ: lên 5 người/ngày, thêm truy vấn Việt Nam, gỡ highlight Cuba Gooding Jr. không có trong nguồn + rà lại toàn bộ, sửa 13 wikidataId sai của người cũ + verify thoát 1 khi MISSING, báo cáo thiếu mục). Nobel 10/10 và Britannica 5/5 ngày sinh khớp |
| 2026-10-03 19:35 | Gemini | B003 | Nộp báo cáo xong/B003-people-jan-01-15-v2.md (đã sửa đủ 5 điểm review: đạt đúng 5 người/ngày cho 1/1–15/1 tổng 75 người T1 và 103 người toàn dự án; truy vấn VN có Võ Thị Ánh Xuân và Thạch Kim Tuấn; gỡ ungrounded highlights ở Cuba Gooding Jr và MLK; sửa chuẩn 13 QID người cũ; verify:wikidata 103/103 khớp 100%; test Rules 0/A-S, tsc, lint, build, smoke 8 routes đều PASS) |
| 2026-10-03 | Claude | B003 | Review r2: CHUA_DAT (4 nguồn "đã mở" sai: Grimm 404, Orlando Bloom stub, Võ Thị Ánh Xuân trang lỗi mềm, Thạch Kim Tuấn Olympedia 404; +4 wikipediaUrl 404, Lea Salonga cũ 404). Giữ: 5 người/ngày, 13 QID đúng, verify:wikidata 103/103. Yêu cầu bằng chứng quote + npm run verify:urls |
| 2026-10-03 | Claude | — | Chủ dự án yêu cầu dừng giao tiếp với Gemini: tạo DUNG, tắt routine review-hop-thu-mybirthday. B003 đang ở CHUA_DAT (r2), chưa commit dữ liệu v2 |
| 2026-10-03 | Claude | B003 | Tích hợp một phần đã qua kiểm tra độc lập: verify:wikidata + wikidata-candidates, placeholder, Rule P/Q/R, sửa 13 wikidataId của người cũ (30/30 khớp Wikidata). Chưa tích hợp: 73 người mới tháng 1, Rule S, README (chờ B003 đạt) |
| 2026-10-03 | Claude | B003 | Theo yêu cầu chủ dự án: Gemini dừng (DUNG), xóa phần chưa đạt khỏi working tree (01.ts, Rule S, README, nhap/wd). B003 cần làm lại từ đầu nếu mở lại |
| 2026-10-03 15:56 | Gemini | B003 | Nộp báo cáo xong/B003-people-jan-01-15-v3.md sau review r2: thêm 44 hồ sơ (9 VN, 35 quốc tế), Rule S 15/15 ngày, verify:wikidata 74/74; test/lint/tsc/build/smoke pass. verify:urls còn 9 URL lỗi của dữ liệu cũ, đã liệt kê Reviewer Attention; không chạy Git |
| 2026-10-03 15:57 | Gemini | B003 | Soát README sau báo cáo: sửa ví dụ gọi wikidata-candidates từ npm run không được khai báo sang npx tsx scripts/wikidata-candidates.ts --day M D; xác nhận script hỗ trợ --day và --vn |
| 2026-10-03 21:56 | Codex | B003 | Nộp báo cáo v4: xử lý 9 URL lỗi trên 8 hồ sơ cũ, evidence 53 dòng; verify:urls 256/256, verify:wikidata 74/74, test/lint/tsc/build/coverage và smoke 8 route đều PASS (không Git) |
| 2026-10-04 | Codex | B003 | Review B003-v4: SUA; Rule S đang áp dụng vượt phạm vi đến 31/1, `verify:urls` lỗi timeout một PDF Lakers; chưa giao B004 |
| 2026-10-04 | Codex | B003 | Nộp B003-v5: Rule S giới hạn 1–15/1, PDF không còn tải/parse toàn bộ, URL Schweitzer lỗi được thay bằng nguồn quỹ chính thức; test, Wikidata 74/74, URL 256/256, tsc/lint/build/coverage/evidence/smoke đều đạt |
| 2026-10-04 | Codex | B003/B004 | Review B003-v5: DAT; đóng BV-004 và giao B004 (16–31/1) trong viec/, mở BV-005 |
| 2026-10-04 03:16 UTC | Codex | B004 | Nộp báo cáo B004-people-jan-16-31.md: thêm 49 hồ sơ (10 Việt Nam, 39 quốc tế), 49/49 evidence và các cổng test, URL, build, coverage, smoke đều PASS; chờ reviewer, không chạy Git |
| 2026-10-04 | Codex | B004 | Review r1: SUA; cổng kỹ thuật và smoke đạt, nhưng nguồn Sang sai người, 4 quote không được trang hỗ trợ, xuất xứ/độc lập nguồn Thanh Lan và Rule U cần sửa. BV-005 CHANGES_REQUESTED; yêu cầu v2, chưa commit/push, chưa giao tháng khác |
| 2026-10-04 | Codex | B004 | Theo yêu cầu chủ dự án: sửa review r1 và nộp v2; rà 98 nguồn, sửa 2 URL B004 và 1 URL phụ Thérèse timeout để đạt cổng toàn bộ dữ liệu. Review r2 DAT, BV-005 ACCEPTED; test, Wikidata 123/123, URL 403/403, lint/tsc/build/coverage/evidence/smoke 8/8 đạt. Tích hợp B003 đã DAT cùng B004 theo phê duyệt push khi đạt; không mở chu kỳ mới |
| 2026-10-04 | Codex | B005 | Chủ dự án yêu cầu mở rộng tháng khác; xác nhận B004-v2 DAT đã push ed24674. Giao B005 (1–15/2), BV-006 OPEN; chia nửa tháng sau lỗi nguồn B004, giữ tỷ lệ Việt Nam 20%–40% và nguồn nước ngoài full DOB. Chỉ thị yêu cầu rà 100% nguồn, bảo toàn tháng 1; chưa thêm hồ sơ B005, chờ executor nộp báo cáo |

| 2026-10-04 | Codex | B005 | Theo yêu cầu chủ dự án thực hiện trực tiếp và giảm tỷ lệ Việt Nam xuống tối thiểu 5%: thêm 44 hồ sơ (3 VN / 41 quốc tế), đủ 3 người/ngày 1–15/2. Rà 88 nguồn và P569/rank 44 người, integrity/Wikidata167/167/lint/tsc/build/coverage/smoke9/9/baseline123 đạt. Review r1 SUA vì cổng URL toàn bộ còn timeout BnF legacy; đã sửa 2 URL B005, không tự sửa dữ liệu tháng 1, chưa commit/push, chưa mở B006. |

2026-10-04 B005-v2/r6 DAT:44 mới (3VN),167 người/56 ngày; URL535/0failed/0MANUAL, Wikidata167/167, các cổng đạt.7URL legacy thay có chỉ thị, facts baseline giữ nguyên. Chuẩn bị push theo chủ dự án.

2026-10-04 B005 push414e5ed29b6b7b304b30bc434f9028787036ef1f, origin/main0/0; B001–B005DAT,0 báo cáo chờreview. Chuẩn hóa khoảng trắng6log test/build, giữ nguyên kết quả; sửa định danh r6URL. GiaoB006/BV-007OPEN choGemini:16–29/2,≥35mới/≥2VN nếu35, đầy đủnguồn nướcngoài; không thêm22/2/sựkiện. Chưa có dữ liệuB006.

2026-10-04 Codex trực tiếp thực hiện B006 theo chủ dự án; reviewr1 DAT:35mới/2VN(5,714%),13quốc gia,202người/65ngày. Rà70nguồn/35GregorianQIDs,URL640/0failed/0MANUAL,Wikidata202/202,A–Y/tsc/lint/build/coverage/smoke10/10/baseline167+4/diffcheck đạt. Ghi loại MoYan/Handel/Caruso/Goldoni và thay nguồn sai Arrhenius/Prost; RuleL exactJobsrecord có kiểm âm/dương, giữ cấmUI. Nguồn AFC đầy đủDOB cho2VN, ghi rõ giới hạn cùng đăng ký; UI “hàng chục nghìn” đểReviewerAttention. Chuẩn bịpush rồi dừng, chưa mở tháng3.


2026-10-05 Codex B007-v1 review DAT: 93 người (5 VN/88 quốc tế), đủ31 ngày×3; evidence186 nguồn,180 ghi đủDOB và6 trang SNL chỉ năm được đối chiếu với nguồn ngày đầy đủ thứhai; số liệu AFC cho5 người Việt; mismatched P570 Bernardo được công khai. Gates testA–AA,Wikidata295/295,URL916/916,tsc/lint/build/coverage,baseline202+4,smoke12/12 đạt. Chủ dự án đã duyệt push khi đạt. Giao commit/push origin/main, fetch xác nhận rồi dừng, không mở tháng4.

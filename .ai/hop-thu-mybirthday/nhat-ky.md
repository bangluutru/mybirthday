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

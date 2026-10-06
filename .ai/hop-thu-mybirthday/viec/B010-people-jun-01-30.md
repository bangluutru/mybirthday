# B010 — mở rộng hồ sơ người sinh tháng 6 (1–30/6)

**Cycle:** BV-011
**Ngày mở:** 06/10/2026
**Trạng thái:** ACCEPTED — review r1 PASS ngày 06/10/2026; phần đạt được duyệt phát hành.
**Reviewer/executor:** Codex, được chủ dự án chỉ định trực tiếp để tiếp tục mở rộng, review và tích hợp phần đạt.

## Mục tiêu và phạm vi

Mở rộng dữ liệu sinh nhật ngày 1–30 tháng 6. Lập kế hoạch, tìm ứng viên, đọc nguồn gốc và rà từng hồ sơ trước khi tích hợp. Mục tiêu là 3 người/ngày (90 mới). Độ chính xác cao hơn số lượng; nếu không có 3 hồ sơ qua đủ kiểm tra, không lấp chỗ bằng nguồn yếu.

| Hạng mục | Điều kiện nghiệm thu |
|---|---|
| Độ phủ | 3 hồ sơ mới cho mỗi ngày 1–30/6; 90 bổ sung (3/ngày), tối đa 8/ngày; 28/6 sẽ có một hồ sơ baseline + 3 mới. Không thêm người trùng QID/ID; không thêm hồ sơ thiếu nguồn. |
| Cân bằng | Ít nhất 5% hồ sơ mới là người Việt Nam; với 90 hồ sơ là tối thiểu 5. Tỷ lệ làm tròn công khai. |
| Wikidata | P31 là human; đọc mọi claim P569 đang hoạt động/rank/reference, ngày phải Gregorian, precision 11; không có claim ngày chính xác hoặc chính xác hơn mâu thuẫn. Sàng lọc riêng người còn sống. |
| Đối chiếu DOB | Mỗi người có ít nhất hai URL ngoài Wikidata từ publisher khác nhau, cùng xác nhận đúng danh tính và ngày/tháng/năm sinh đầy đủ. Mở trực tiếp HTML/PDF; tìm trùng lặp/copy giữa hai trang; trang chỉ có năm không tính. Ghi rằng publisher khác nhau không tự chứng minh dữ liệu gốc được thu thập độc lập. |
| Người Việt | Có tối thiểu 5 người Việt và mỗi người có hai nguồn DOB ngoài Wikidata, do tổ chức/publisher ngoài Việt Nam phát hành. Không suy luận nơi đặt publisher chỉ từ đuôi domain/ấn bản/ngôn ngữ. |
| Sự thật hồ sơ | Tên, occupation, category, country và birthplace nếu dùng phải được nguồn hỗ trợ; không suy quốc tịch từ nơi sinh. Tránh thêm thành tích không có trong bằng chứng. |
| Phạm vi tệp | Chỉ database tháng 6 (`src/data/people/06.ts`), integrity test cho Rule AE, task/report/review/bằng chứng/trạng thái của B010. Không sửa UI, events, ảnh, dependencies hay dữ liệu tháng khác. |
| Bảo toàn | Khóa baseline 478 người, 4 sự kiện, coverage và smoke snapshot; dữ liệu cũ/evenets phải deep-equal sau thêm tháng 6. Kết quả dự kiến 568 người, độ phủ 184/366 ngày nếu đủ 90 mới. Baseline đã có hồ sơ ngày 28/6 nên 30 ngày tháng 6 chỉ mở thêm 29 ngày phủ. |

## Kế hoạch từng giai đoạn

1. **Baseline:** xác nhận `origin/main` sạch và `PEOPLE_06` hiện chỉ có hồ sơ Ngô Bảo Châu ngày 28/6; chụp deep snapshot với/không `verifiedAt`, 478 người/4 sự kiện, test, coverage, TypeScript và smoke phù hợp. Giữ nguyên hồ sơ baseline, không chỉnh trong B010.
2. **Khám phá có giới hạn:** truy vấn Wikidata cho từng ngày tháng 6, tách tập toàn cầu và người có quốc tịch Việt Nam. Lưu SPARQL, thời điểm, endpoint, kết quả/QID và SHA-256. Candidate list chỉ là công cụ tìm kiếm; không đại diện cho tổng số người sinh ngày đó.
3. **Sàng lọc entity:** lấy entity claims trực tiếp theo batch; xác nhận P31/P569, precision/calendar/ranks, references, aliases và tình trạng còn sống. Bỏ ứng viên có ngày mâu thuẫn/lịch khác, trùng, nhầm người hoặc chưa trưởng thành nếu thông tin đời tư không phù hợp.
4. **Lập sổ bằng chứng trước tích hợp:** trước khi sửa `06.ts`, cho từng QID ghi ngày, 2+ publisher, quốc gia publisher kiểm chứng, URL/final URL, HTTP/content type, excerpt ngắn (không quá 25 từ mỗi trang), timestamp và hash response. Dùng bảo tàng, cơ quan nhà nước, hall of fame, tổ chức nghề nghiệp, đại học, publisher báo chí/encyclopedia có biên tập hoặc hồ sơ chính thức. Bỏ SEO birthday sites, blog cá nhân, Wikipedia/Wikidata như nguồn DOB.
5. **Cross-check nội dung:** đọc cả 2 nguồn thật của 90 người, kiểm tra tên trùng người, DOB đủ năm/tháng/ngày, sự độc lập biên tập/host và không sao chép trực tiếp. Tìm nguồn thay thế cho mọi lỗi HTTP, DOB chỉ năm, quote không khớp hoặc nguồn gốc lặp. Các nguồn thể thao có thể dùng chung đăng ký; phải ghi rõ và không khẳng định đã xác thực bằng hồ sơ hộ tịch.
6. **Chốt tập đạt rồi mới tích hợp:** cân bằng ít nhất 5 VN nhưng không cố định người trước khi xác nhận nguồn nước ngoài. Chỉ sinh `06.ts` sau khi tập cuối đạt đủ số từng ngày và mỗi hồ sơ qua mọi cổng sự thật. Nếu thiếu người/ngày thì ghi phần đạt và phần chưa đạt, không thêm dữ liệu chưa review.
7. **Rule AE:** thêm allowlist chính xác của 90 `id → QID → DOB → 2+ publisher/URL`; yêu cầu đúng tháng 6, đúng 3/ngày, ≥5% Việt, URL Wiki đúng, host nguồn non-Wiki phân biệt, map chính xác 2 nguồn DOB ngoại quốc cho từng QID Việt và negative test sai QID/URL/path/query/fragment/lookalike/malformed. Không nới Rules A–AD.
8. **Kiểm chứng sau tích hợp:** hoàn tất. Deep equality baseline 478 người/4 events; integrity, Wikidata, TypeScript, lint, build, coverage, diffcheck và smoke 9/9 đạt. `verify:urls` kiểm 1.734 URL, ghi 12 lỗi ban đầu/0 Britannica MANUAL; hai URL Wikidata B010 timeout đã retest 200, mọi DOB/context URL B010 đều HTTP 200. Còn cảnh báo ngoài scope.
9. **Review/release:** hoàn tất review r1 PASS; ledger `review/B010-evidence.json` có evidence/status trong Git, response thô HTML/PDF/SPARQL ở local `nhap/` không commit. Cổng global legacy được tách riêng, không tuyên bố toàn ứng dụng sạch. Push phần đạt theo yêu cầu trước của chủ dự án; xác nhận remote rồi dừng.

## Reviewer Attention từ vòng trước

B009 để lại 5 URL legacy ở tháng 1–4 (James Joyce API, Trần Lê Quốc Toàn, Ambedkar, Nguyễn Phú Trọng, Halldór Laxness). Không đưa các lỗi đó vào phạm vi tự sửa B010; kiểm tra sau vòng này xem chúng còn tồn tại và báo rõ tình trạng.

## Tệp dự kiến

- `src/data/people/06.ts`
- `scripts/test-integrity.ts` (Rule AE)
- `.ai/hop-thu-mybirthday/nhap/` cho baseline, truy vấn và captures cục bộ
- `.ai/hop-thu-mybirthday/xong/B010-people-jun-01-30.md`
- `.ai/hop-thu-mybirthday/review/B010-people-jun-01-30-r1.md` cùng evidence/validation ledger tối thiểu
- `.ai/REVIEW.md`, `.ai/STATUS.md`, `KE-HOACH.md`, `nhat-ky.md`

## Dừng

Không đưa bất kỳ dòng nào vào database trước khi source audit của dòng đó đạt. Không mở tháng 7 trong BV-011.

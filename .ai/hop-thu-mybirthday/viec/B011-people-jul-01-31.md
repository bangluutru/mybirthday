# B011 — mở rộng hồ sơ người sinh tháng 7 (1–31/7)

**Cycle:** BV-012

**Ngày mở:** 06/10/2026

**Trạng thái:** OPEN

**Reviewer/executor:** Codex theo yêu cầu trực tiếp của chủ dự án tiếp tục mở rộng, kiểm tra và tích hợp phần đạt.

## Mục tiêu và phạm vi

Bổ sung hồ sơ người sinh ngày 1–31/7, sau khi nghiên cứu và đối chiếu nguồn từng người. Mục tiêu là 3 người mới/ngày (93 hồ sơ). Ưu tiên độ chính xác; nếu ngày nào chưa tìm đủ người qua kiểm chứng thì báo thiếu, không bù bằng nguồn yếu.

| Hạng mục | Điều kiện nghiệm thu |
|---|---|
| Độ phủ | Đúng 3 hồ sơ mới/ngày từ 1–31/7; tổng 93, tối đa 8 hồ sơ/ngày khi tính cả dữ liệu nền; không trùng QID/ID. |
| Cân bằng | Có ít nhất 5 người Việt trong 93 hồ sơ (5,38% nếu đủ 93); tỷ lệ thực tế phải ghi rõ. |
| Wikidata | P31 là human; rà mọi claim P569 đang hoạt động, rank, reference; DOB phải lịch Gregorian, precision 11; loại mâu thuẫn exact hoặc chính xác hơn. Sàng lọc riêng người còn sống. |
| Đối chiếu ngày sinh | Mỗi hồ sơ có tối thiểu 2 trang trực tiếp ngoài Wikidata, từ publisher khác nhau; cả hai trang chứng minh đúng người và ngày/tháng/năm sinh đầy đủ. Mở nội dung trực tiếp, rà ngày mâu thuẫn, nội dung trùng/copy; publisher khác nhau không tự chứng minh nguồn dữ liệu gốc độc lập. |
| Hồ sơ Việt | Ít nhất 5 người Việt; mỗi người có 2 nguồn DOB đầy đủ từ publisher có trụ sở ngoài Việt Nam. Vị trí publisher phải có nguồn chính thức chứng minh, không suy từ domain/ngôn ngữ/ấn bản. |
| Dữ kiện hiển thị | Tên, nghề nghiệp, phân loại, quốc gia và birthplace (nếu có) phải được nguồn hỗ trợ; không suy quốc tịch từ nơi sinh, không thêm thành tích không kiểm chứng. |
| Rule AF | Khóa chính xác allowlist `ID → QID → DOB → nguồn`, đúng tháng 7, đúng 3/ngày, tối thiểu 5% Việt; yêu cầu hai publisher và hai host phân biệt; kiểm tra nguồn nước ngoài cho hồ sơ Việt và negative cases cho QID/URL giả, query/path/fragment/malformed/lookalike. Không nới Rules A–AE. |
| Bảo toàn | Deep-equal baseline 568 người và 4 sự kiện; tháng 8 baseline vẫn giữ nguyên. Trước B011, coverage 184/366; nếu đủ tháng 7, dự kiến 661 người và 215/366 ngày. |
| Cổng kỹ thuật | `npm test`, `npm run verify:wikidata`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`, smoke HTTP routes; URL mới phải kiểm trực tiếp và mọi lỗi toàn cục nằm ngoài scope phải tách rõ. |

## Kế hoạch

1. Chụp baseline từ `origin/main`: 568 hồ sơ, 4 events, 184 ngày; kiểm tra July trống và không thay đổi August 15 baseline (2 hồ sơ).
2. Khám phá ứng viên theo ngày từ Wikidata (general và Việt riêng); lưu query, ngày giờ, endpoint, QID, raw result, hash. Danh sách ứng viên chỉ dùng khám phá, không coi là sự thật đã xác minh.
3. Rà entity: P31/P569, mọi claim đang hoạt động và qualifier/reference, precision/calendar/rank/conflict; kiểm tra danh tính, nghề, quốc tịch và trưởng thành nếu còn sống.
4. Lập evidence ledger trước khi tích hợp: hai trang publisher trực tiếp mỗi người, URL/final URL, HTTP/content type, excerpt ngắn (tối đa 25 từ mỗi trang), exact DOB/identity result, hash và thời gian truy fetch; đối với hồ sơ Việt lưu thêm bằng chứng chính thức về quốc gia publisher.
5. Đối chiếu người trùng tên, ngày mâu thuẫn, khả năng sao chép nguồn và nguồn thể thao có thể cùng dựa trên một hồ sơ đăng ký. Loại hồ sơ không vượt đủ lớp kiểm.
6. Chỉ sau khi tập 93 người qua factual audit mới cập nhật `src/data/people/07.ts`, Rule AF và artifacts B011 được nêu dưới đây.
7. Chạy đủ cổng; ghi rõ coverage, snapshot baseline, URL source mới và lỗi legacy ngoài scope. Báo cáo kết quả review rồi push phần đạt và xác nhận `origin/main` 0/0.
8. Dừng sau khi B011 đóng. Chỉ khi remote xác nhận mới mở B012 tháng 8, theo yêu cầu riêng của chủ dự án.

## Phạm vi tệp

- `src/data/people/07.ts`
- `scripts/test-integrity.ts` (chỉ thêm Rule AF)
- `.ai/hop-thu-mybirthday/nhap/` cho baseline/discovery/captures/logs cục bộ
- `.ai/hop-thu-mybirthday/xong/B011-people-jul-01-31.md`
- `.ai/hop-thu-mybirthday/review/B011-people-jul-01-31-r1.md` và evidence ledger
- `.ai/REVIEW.md`, `.ai/STATUS.md`, `.ai/hop-thu-mybirthday/KE-HOACH.md`, `.ai/hop-thu-mybirthday/nhat-ky.md`

Không sửa UI, events, ảnh, dependencies hoặc dữ liệu các tháng khác trong B011.

## Dừng

Không đưa dòng hồ sơ nào vào database trước khi hai nguồn DOB trực tiếp và entity Wikidata của dòng đó được đối chiếu đạt. Không mở B012 trong lúc B011 chưa được review, tích hợp, push và xác nhận remote.

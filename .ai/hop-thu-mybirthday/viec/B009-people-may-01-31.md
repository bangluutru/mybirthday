# B009 — mở rộng hồ sơ người sinh tháng 5 (1–31/5)

**Cycle:** BV-010 · **Ngày mở:** 05/10/2026 · **Trạng thái:** ACCEPTED theo review r1 ngày 06/10/2026; phạm vi cổng URL và giới hạn nguồn xem báo cáo review.

## Mục tiêu và phạm vi

Mở rộng riêng dữ liệu người sinh từ ngày 1 đến 31 tháng 5. Hoàn tất nghiên cứu và đối chiếu từng ứng viên trước khi thêm bất kỳ hồ sơ nào vào database. Đúng sự thật quan trọng hơn đủ số lượng; không hạ chuẩn bằng chứng để lấp ngày.

| Hạng mục | Tiêu chí nghiệm thu |
|---|---|
| Độ phủ | 31/31 ngày tháng 5 có hồ sơ mới; mục tiêu đúng 3 hồ sơ mới/ngày, 93 hồ sơ tổng cộng; không quá 8 hồ sơ mới/ngày |
| Tỷ lệ Việt | Ít nhất 5% số hồ sơ mới là người Việt; nếu đúng 93 hồ sơ thì tối thiểu 5 người; nguồn DOB của mọi hồ sơ Việt phải do nhà xuất bản/cơ quan bên ngoài Việt Nam phát hành |
| Wikidata | Mỗi hồ sơ là con người; P569 có ngày/tháng/năm chính xác, độ chính xác ngày (11), lịch Gregorian; rà toàn bộ claims/ranks, không chấp nhận ngày chính xác đang hoạt động mâu thuẫn |
| Đối chiếu sự thật | Trước khi tích hợp, mỗi người phải có **hai nguồn ngoài Wikidata độc lập** xác nhận đúng danh tính và ngày sinh đủ ngày/tháng/năm. Hai nguồn không được sao chép cùng một nguồn gốc; nguồn chỉ ghi năm không tính là xác nhận ngày |
| Nguồn Việt | Mỗi người Việt có ít nhất hai nguồn DOB độc lập ngoài Việt Nam; ghi rõ nếu có quan hệ đăng ký/chung dữ liệu hoặc biên soạn lại |
| Phạm vi dữ liệu | Chỉ thêm hồ sơ tháng 5 vào `src/data/people/05.ts`; không sửa UI, sự kiện, ảnh, dependency hay dữ liệu tháng khác |
| Bảo toàn | Snapshot trước/sau phải chứng minh 385 hồ sơ cũ và 4 sự kiện được giữ nguyên; tổng dự kiến 478 người và ít nhất 155/366 ngày phủ nếu đạt 93 hồ sơ mới |

## Kế hoạch thực hiện

1. **Chốt baseline:** lưu snapshot 385 người + 4 sự kiện, coverage, test, TypeScript. Xác nhận `PEOPLE_05` hiện rỗng và lập danh sách QID/slug để chống trùng.
2. **Khám phá có giới hạn:** truy vấn Wikidata riêng từng ngày 1–31/5; lưu endpoint, truy vấn, thời điểm, toàn bộ response/QID và điều kiện lọc. Kết quả truy vấn chỉ là danh sách ứng viên, không phải bằng chứng sự thật hay khẳng định đầy đủ mọi người sinh trong tháng.
3. **Sàng lọc claims:** đọc P31 và tất cả P569 statements, gồm rank, precision, calendar, qualifiers/references. Loại năm-only, lịch Julian/khác, người không phải người, QID sai người, ngày mâu thuẫn và hồ sơ trùng. Kiểm tra riêng các hồ sơ đang sống để không đưa thông tin DOB nhạy cảm/không phù hợp.
4. **Tạo danh sách ứng viên trước khi tích hợp:** với từng ngày, chọn tối đa số cần thiết từ ứng viên có nguồn xuất bản phù hợp. Lưu bảng QID, DOB, URL nguồn 1/2, nhà xuất bản/quốc gia, câu trích dẫn ngắn chứng minh danh tính/DOB, HTTP/content type, thời điểm truy cập và SHA-256 nội dung. Không sửa `05.ts` ở bước này.
5. **Review chéo 100%:** đọc trang HTML/PDF thật của cả hai nguồn cho từng người; kiểm tra nguồn nói đúng người và exact DOB, host/nhà xuất bản độc lập, claim Wikidata Gregorian khớp; đối chiếu nghề nghiệp/quốc gia được ghi vào hồ sơ. Lập danh sách loại và lý do cho mọi ứng viên không đạt. Với người Việt, xác minh cả hai nguồn phát hành ngoài Việt Nam.
6. **Chốt tập đạt:** chỉ khi có ít nhất 3 hồ sơ đạt cho mỗi ngày và ít nhất 5% là người Việt mới đưa các dòng đã review vào `05.ts`. Nếu ứng viên hiện tại thiếu bằng chứng, tiếp tục tìm ứng viên thay thế; không dùng hồ sơ chưa qua kiểm chéo.
7. **Kiểm tra tự động chống hồi quy:** thêm Rule AD riêng cho B009 kiểm chính xác tập ID/QID đã duyệt, 3/ngày, tổng 93, chỉ tháng 5, tỷ lệ người Việt ≥5%, Wikidata URL chính xác, tối thiểu hai host nguồn độc lập và allowlist URL DOB nước ngoài chính xác cho từng QID Việt; có ca âm cho sai QID/URL/path/query/lookalike host/hỏng URL. Không nới A–AC.
8. **Xác minh tích hợp:** so deep-equality baseline 385 người + 4 sự kiện; chạy `npm test`, `npm run verify:wikidata`, `npm run verify:urls`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run coverage`, `git diff --check`; smoke trang chủ, các ngày 1/15/16/31 tháng 5, trang nhân vật/share và ngày hồi quy tháng 1–4/29-2. Kiểm tra số đếm từ file thật.
9. **Báo cáo/review:** ghi kết quả, nguồn, sai khác, ứng viên bị loại, giới hạn query và lint warnings vào `xong/B009-people-may-01-31.md`; review chỉ ghi DAT nếu factual review và mọi cổng đạt. Chỉ sau DAT mới được coi B009 hoàn tất theo state machine; không mở tháng 6 trong vòng này.

## File dự kiến

- Database: `src/data/people/05.ts`
- Cổng integrity: `scripts/test-integrity.ts`
- Tài liệu sản phẩm: `README.md` nếu coverage trong README cần cập nhật
- Kế hoạch/bằng chứng/báo cáo B009 dưới `.ai/hop-thu-mybirthday/`

Không đưa query response nguyên bản hoặc HTML/PDF tải về vào Git; giữ cục bộ trong `nhap/wd/` và `/tmp`. Chỉ stage artefact B009 cần thiết để tái lập kết quả và rà soát.

## Điều kiện dừng

Không tích hợp hồ sơ nếu không có hai nguồn DOB độc lập; không tự suy diễn quốc tịch, birthplace, nghề nghiệp hay ngày. Nếu không đạt đủ 3 người/ngày sau khi đã tìm nguồn, dừng tích hợp ngày thiếu, ghi rõ bằng chứng đã tìm và kết quả chưa đạt thay vì làm yếu tiêu chí.

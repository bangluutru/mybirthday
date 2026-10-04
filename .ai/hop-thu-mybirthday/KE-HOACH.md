# hop-thu-mybirthday: kế hoạch giao việc Gemini 3.8 (Claude đọc để giao việc kế tiếp)

Nguyên tắc: đúng sự thật > số lượng; mỗi việc nhỏ có chốt kiểm bằng test máy; chỉ giao việc kế tiếp khi việc trước `DAT`. Một việc `CHUA_DAT` hai lần liên tiếp, hoặc lỗi hệ thống lặp lại → ngừng giao, ghi "CẦN CHỦ DỰ ÁN: …" vào `nhat-ky.md`.

Baseline lịch sử (commit `3d875a0`): UI hoàn thiện nhưng dữ liệu rất mỏng: 30 người trên 12 ngày (16 người ở 22/2), 4 sự kiện lịch sử (chỉ 22/2), 354 ngày trống. Lớp UI còn dữ kiện hard-code/bịa (B001).

| Thứ tự | Việc | Nội dung | Điều kiện giao |
|---|---|---|---|
| 1 | B001 | Loại dữ kiện hard-code/bịa khỏi UI; mọi dữ kiện đi qua `birthdays.ts`; test J/K/L; sửa README | **DAT** (39f7bd6) |
| 2 | B002 | Hạ tầng dữ liệu mở rộng được: tách dữ liệu theo tháng (`src/data/people/MM.ts` hoặc JSON), loader gộp, schema + provenance (`sourceUrls` bắt buộc, `verifiedAt`), script báo cáo độ phủ 366 ngày (`npm run coverage`), mở rộng test cho mọi file tháng. KHÔNG thêm người mới; kết quả hành vi UI giữ nguyên | đã giao (BV-003) |
| 3 | B003 | **Pilot Wikidata**: nhân vật sinh 1/1–15/1 (≥ 3 người/ngày, ≤ 8 người mới/ngày); script `wikidata-candidates` + `verify:wikidata`; 3 lớp kiểm (Wikidata Gregorian precision-day + nguồn độc lập chính thống đã mở + nhất quán); Rule P/Q/R/S; ảnh placeholder. Bản nháp: `viec-cho/B003-people-jan-01-15.md` | B002 DAT |
| 4 | B004 | 16/1–31/1, cùng quy trình, dùng lại script; bổ sung Rule S cho nửa sau | B003 DAT, ≤ 5 điểm sửa |
| 5 | B005 | 1–15/2, chỉ thị BV-006; ≥3 người/ngày, tối thiểu 5% người Việt trong bổ sung B005; kiểm chéo toàn bộ nguồn | DAT reviewr6;44 mới (3VN),167 người/56 ngày; chuẩn bị tích hợp |
| 6 | B006 (chưa giao) | 16–29/2, bao gồm ngày nhuận; xử lý hằng số 22/2 khi bổ sung ngày này; giữ sự kiện ngoài phạm vi | B005 DAT và đã tích hợp |
| tiếp theo | Mã việc xác định khi giao | Tháng 3 → tháng 12, tiếp tục từng nửa tháng; không mở song song. Chỉ giao phần kế tiếp sau DAT và tích hợp phần trước | việc trước DAT |
| 16 | (sau khi đủ 366 ngày) | Sự kiện lịch sử theo ngày (cũng Wikidata + nguồn chính thống) và ảnh (giấy phép Commons) là các chu kỳ riêng, cần chủ dự án duyệt | chủ dự án |

Quyết định của chủ dự án (2026-10-03): nguồn dữ liệu = Wikidata CC0 làm xương sống; Gemini rà soát từng ngày 1/1 → 31/12. Đồng thời giữ nguyên quy tắc "đúng sự thật > số lượng": người nào không qua đủ 3 lớp kiểm thì bỏ.

Thư mục `viec-cho/` chứa bản nháp việc chưa giao (`trang-thai.py` không quét). Routine chuyển bản nháp sang `viec/` đúng khi việc trước `DAT`.

Bài học lấy từ 123manabi áp dụng ở đây: báo cáo sinh từ file thật chứ không từ trí nhớ; test mới phải fail trước khi sửa; không có thay đổi nào "cho đẹp"; ngoài phạm vi thì ghi Reviewer Attention.

Cập nhật 2026-10-04: B003/B004 đã DAT và push tại `ed24674`; 123 người / 42 ngày, tháng 1 đủ 31/31 ngày, 19/93 bổ sung tháng 1 là người Việt (20,4%). B004 có lỗi nguồn ở r1, đã sửa đạt r2; áp dụng quy tắc chia nửa tháng. Chủ dự án duyệt tiếp tục tháng khác; B005 triển khai 1–15/2; reviewr6 DAT, cổngURL toàn bộ đạt. Các đích phủ tháng 2 và toàn năm chưa hoàn thành.

Điều chỉnh chủ dự án 2026-10-04: tỷ lệ hồ sơ mới B005 tối thiểu 5% người Việt; Codex trực tiếp thực hiện, kiểm tra và tích hợp sau DAT. Không thay đổi bằng chứng hay tiêu chí đóng tháng 1.

Quyết định tỷ lệ 5% áp dụng các đợt mở rộng mới tiếp theo; lịch sử và cổng đã đóng tháng 1 giữ nguyên. Không giao đợt kế tiếp khi B005 còn SUA.

# hop-thu-mybirthday: kế hoạch giao việc Gemini 3.8 (Claude đọc để giao việc kế tiếp)

Nguyên tắc: đúng sự thật > số lượng; mỗi việc nhỏ có chốt kiểm bằng test máy; chỉ giao việc kế tiếp khi việc trước `DAT`. Một việc `CHUA_DAT` hai lần liên tiếp, hoặc lỗi hệ thống lặp lại → ngừng giao, ghi "CẦN CHỦ DỰ ÁN: …" vào `nhat-ky.md`.

Hiện trạng (commit `3d875a0`): UI hoàn thiện nhưng dữ liệu rất mỏng: 30 người trên 12 ngày (16 người ở 22/2), 4 sự kiện lịch sử (chỉ 22/2), 354 ngày trống. Lớp UI còn dữ kiện hard-code/bịa (B001).

| Thứ tự | Việc | Nội dung | Điều kiện giao |
|---|---|---|---|
| 1 | B001 | Loại dữ kiện hard-code/bịa khỏi UI; mọi dữ kiện đi qua `birthdays.ts`; test J/K/L; sửa README | **DAT** (39f7bd6) |
| 2 | B002 | Hạ tầng dữ liệu mở rộng được: tách dữ liệu theo tháng (`src/data/people/MM.ts` hoặc JSON), loader gộp, schema + provenance (`sourceUrls` bắt buộc, `verifiedAt`), script báo cáo độ phủ 366 ngày (`npm run coverage`), mở rộng test cho mọi file tháng. KHÔNG thêm người mới; kết quả hành vi UI giữ nguyên | đã giao (BV-003) |
| 3 | B003 | **Pilot Wikidata**: nhân vật sinh 1/1–15/1 (≥ 3 người/ngày, ≤ 8 người mới/ngày); script `wikidata-candidates` + `verify:wikidata`; 3 lớp kiểm (Wikidata Gregorian precision-day + nguồn độc lập chính thống đã mở + nhất quán); Rule P/Q/R/S; ảnh placeholder. Bản nháp: `viec-cho/B003-people-jan-01-15.md` | B002 DAT |
| 4 | B004 | 16/1–31/1, cùng quy trình, dùng lại script; bổ sung Rule S cho nửa sau | B003 DAT, ≤ 5 điểm sửa |
| 5–15 | B005…B015 | Mỗi việc một tháng (Feb → Dec, một việc/tháng; Feb phải gỡ các hằng số cứng "22/2 = 16 người" ở Rule J/H và README khi thêm người cho 22/2). Nếu B003/B004 bị SUA nhiều (> 5 điểm hoặc có nguồn sai) thì quay lại chia nửa tháng | việc trước DAT |
| 16 | (sau khi đủ 366 ngày) | Sự kiện lịch sử theo ngày (cũng Wikidata + nguồn chính thống) và ảnh (giấy phép Commons) là các chu kỳ riêng, cần chủ dự án duyệt | chủ dự án |

Quyết định của chủ dự án (2026-10-03): nguồn dữ liệu = Wikidata CC0 làm xương sống; Gemini rà soát từng ngày 1/1 → 31/12. Đồng thời giữ nguyên quy tắc "đúng sự thật > số lượng": người nào không qua đủ 3 lớp kiểm thì bỏ.

Thư mục `viec-cho/` chứa bản nháp việc chưa giao (`trang-thai.py` không quét). Routine chuyển bản nháp sang `viec/` đúng khi việc trước `DAT`.

Bài học lấy từ 123manabi áp dụng ở đây: báo cáo sinh từ file thật chứ không từ trí nhớ; test mới phải fail trước khi sửa; không có thay đổi nào "cho đẹp"; ngoài phạm vi thì ghi Reviewer Attention.

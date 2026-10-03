# hop-thu-mybirthday: kế hoạch giao việc Gemini 3.8 (Claude đọc để giao việc kế tiếp)

Nguyên tắc: đúng sự thật > số lượng; mỗi việc nhỏ có chốt kiểm bằng test máy; chỉ giao việc kế tiếp khi việc trước `DAT`. Một việc `CHUA_DAT` hai lần liên tiếp, hoặc lỗi hệ thống lặp lại → ngừng giao, ghi "CẦN CHỦ DỰ ÁN: …" vào `nhat-ky.md`.

Hiện trạng (commit `3d875a0`): UI hoàn thiện nhưng dữ liệu rất mỏng: 30 người trên 12 ngày (16 người ở 22/2), 4 sự kiện lịch sử (chỉ 22/2), 354 ngày trống. Lớp UI còn dữ kiện hard-code/bịa (B001).

| Thứ tự | Việc | Nội dung | Điều kiện giao |
|---|---|---|---|
| 1 | B001 | Loại dữ kiện hard-code/bịa khỏi UI; mọi dữ kiện đi qua `birthdays.ts`; test J/K/L; sửa README | **DAT** (39f7bd6) |
| 2 | B002 | Hạ tầng dữ liệu mở rộng được: tách dữ liệu theo tháng (`src/data/people/MM.ts` hoặc JSON), loader gộp, schema + provenance (`sourceUrls` bắt buộc, `verifiedAt`), script báo cáo độ phủ 366 ngày (`npm run coverage`), mở rộng test cho mọi file tháng. KHÔNG thêm người mới; kết quả hành vi UI giữ nguyên | đã giao (BV-003) |
| 3 | (dừng, chờ chủ dự án) | **Quyết định nguồn dữ liệu cho việc nhân rộng**: (a) Wikidata CC0 (miễn phí, có ngày sinh + sitelinks để xếp hạng nổi tiếng) làm xương sống, Gemini chỉ viết mô tả tiếng Việt; hay (b) chỉ nhân vật có trang Britannica/Nobel/hall of fame. Ghi "CẦN CHỦ DỰ ÁN: chọn nguồn dữ liệu B003" | B002 DAT |
| 4+ | B003… | Mỗi việc = 1 tháng, ≥ 3 người/ngày có nguồn chính thống đúng ngày sinh, ảnh dùng placeholder trung thực (không bịa ảnh), test coverage tháng đó, không sửa tháng khác. Bắt đầu bằng 1 tháng thử (tháng 1) rồi mới nhân rộng theo chất lượng review | chủ dự án chốt nguồn |

Bài học lấy từ 123manabi áp dụng ở đây: báo cáo sinh từ file thật chứ không từ trí nhớ; test mới phải fail trước khi sửa; không có thay đổi nào "cho đẹp"; ngoài phạm vi thì ghi Reviewer Attention.

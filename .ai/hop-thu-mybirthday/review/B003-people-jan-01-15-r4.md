KET_QUA: DAT

# Review B003-v5 — DAT

Ngày review: 2026-10-04
Reviewer: Codex theo yêu cầu trực tiếp của chủ dự án
Phạm vi: báo cáo B003-v5, mã kiểm tra và dữ liệu B003 hiện có.

## Đối chiếu review r3

1. **Rule S đúng phạm vi:** vòng lặp chỉ kiểm 1–15/1. `npm test` đạt, không còn lỗi 16–31/1.
2. **PDF:** bộ kiểm URL nhận diện PDF, giữ kiểm tra HTTP status và không đọc toàn bộ PDF như HTML. Lakers Media Guide trả HTTP 200.
3. **URL phụ Schweitzer:** URL bị lỗi fetch đã được bỏ; nguồn Nobel vẫn còn và có thêm trang Stiftung Albert-Schweitzer-Werk. Trang quỹ ghi ngày sinh `14. Januar 1875`, khớp ngày Wikidata và hồ sơ. Đã ghi quote trong evidence.

## Kết quả kiểm độc lập

- `npm test`: PASS, 0 vi phạm; 44 hồ sơ mới (9 Việt Nam, 35 quốc tế; 20,5% Việt Nam).
- `npm run verify:urls`: PASS — 256 kiểm tra, 0 lỗi, 0 Britannica MANUAL.
- `npm run verify:wikidata`: PASS — 74/74 khớp.
- TypeScript, lint và production build: PASS; lint/build còn cảnh báo `<img>`/Google Fonts có từ trước.
- Coverage: 74 người, 26/366 ngày; tháng 1 có người ở 15/31 ngày.
- Evidence audit: 54/54 bản ghi liên kết được tới đúng QID, URL trong hồ sơ và quote.
- Smoke: 8/8 route HTTP 200; ngày 2/1 có Rudolf Clausius và không lẫn Tolkien của 3/1.
- Kiểm chứng trực tiếp ngày sinh Schweitzer: [Nobel Prize](https://www.nobelprize.org/prizes/peace/1952/schweitzer/biographical/) và [Stiftung Albert-Schweitzer-Werk](https://www.albert-schweitzer.ch/albert-und-helene-schweitzer/albert-schweitzer).

## Quyết định

B003 **đạt (DAT)** và được đóng. Theo yêu cầu của chủ dự án, giao B004 cho ngày 16–31/1. B004 được mở tại `.ai/hop-thu-mybirthday/viec/B004-people-jan-16-31.md`; phạm vi cân bằng Việt Nam/quốc tế áp dụng cho toàn bộ dữ liệu bổ sung tháng 1.

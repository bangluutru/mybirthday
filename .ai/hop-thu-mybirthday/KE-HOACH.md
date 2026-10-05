# hop-thu-mybirthday: kế hoạch giao việc Gemini 3.8 (Claude đọc để giao việc kế tiếp)

Nguyên tắc: đúng sự thật > số lượng; mỗi việc nhỏ có chốt kiểm bằng test máy; chỉ giao việc kế tiếp khi việc trước `DAT`. Một việc `CHUA_DAT` hai lần liên tiếp, hoặc lỗi hệ thống lặp lại → ngừng giao, ghi "CẦN CHỦ DỰ ÁN: …" vào `nhat-ky.md`.

Baseline lịch sử (commit `3d875a0`): UI hoàn thiện nhưng dữ liệu rất mỏng: 30 người trên 12 ngày (16 người ở 22/2), 4 sự kiện lịch sử (chỉ 22/2), 354 ngày trống. Lớp UI còn dữ kiện hard-code/bịa (B001).

| Thứ tự | Việc | Nội dung | Điều kiện giao |
|---|---|---|---|
| 1 | B001 | Loại dữ kiện hard-code/bịa khỏi UI; mọi dữ kiện đi qua `birthdays.ts`; test J/K/L; sửa README | **DAT** (39f7bd6) |
| 2 | B002 | Hạ tầng dữ liệu mở rộng được: tách dữ liệu theo tháng (`src/data/people/MM.ts` hoặc JSON), loader gộp, schema + provenance (`sourceUrls` bắt buộc, `verifiedAt`), script báo cáo độ phủ 366 ngày (`npm run coverage`), mở rộng test cho mọi file tháng. KHÔNG thêm người mới; kết quả hành vi UI giữ nguyên | đã giao (BV-003) |
| 3 | B003 | **Pilot Wikidata**: nhân vật sinh 1/1–15/1 (≥ 3 người/ngày, ≤ 8 người mới/ngày); script `wikidata-candidates` + `verify:wikidata`; 3 lớp kiểm (Wikidata Gregorian precision-day + nguồn độc lập chính thống đã mở + nhất quán); Rule P/Q/R/S; ảnh placeholder. Bản nháp: `viec-cho/B003-people-jan-01-15.md` | B002 DAT |
| 4 | B004 | 16/1–31/1, cùng quy trình, dùng lại script; bổ sung Rule S cho nửa sau | B003 DAT, ≤ 5 điểm sửa |
| 5 | B005 | 1–15/2, chỉ thị BV-006; ≥3 người/ngày, tối thiểu 5% người Việt trong bổ sung B005; kiểm chéo toàn bộ nguồn | DAT reviewr6;44 mới (3VN),167 người/56 ngày; đã push414e5ed |
| 6 | B006 | 16–29/2, gồm29/2; ít nhất35 mới,≥5%VN; không thêm22/2 vì đã16 người, giữ4events | DAT reviewr1;35 mới (2VN),202 người/65 ngày; tháng2 đủ29/29 ngày |
| tiếp theo | Mã việc xác định khi giao | Tháng 3 → tháng 12, tiếp tục từng nửa tháng; không mở song song. Chỉ giao phần kế tiếp sau DAT và tích hợp phần trước | việc trước DAT |
| 16 | (sau khi đủ 366 ngày) | Sự kiện lịch sử theo ngày (cũng Wikidata + nguồn chính thống) và ảnh (giấy phép Commons) là các chu kỳ riêng, cần chủ dự án duyệt | chủ dự án |

Quyết định của chủ dự án (2026-10-03): nguồn dữ liệu = Wikidata CC0 làm xương sống; Gemini rà soát từng ngày 1/1 → 31/12. Đồng thời giữ nguyên quy tắc "đúng sự thật > số lượng": người nào không qua đủ 3 lớp kiểm thì bỏ.

Thư mục `viec-cho/` chứa bản nháp việc chưa giao (`trang-thai.py` không quét). Routine chuyển bản nháp sang `viec/` đúng khi việc trước `DAT`.

Bài học lấy từ 123manabi áp dụng ở đây: báo cáo sinh từ file thật chứ không từ trí nhớ; test mới phải fail trước khi sửa; không có thay đổi nào "cho đẹp"; ngoài phạm vi thì ghi Reviewer Attention.

Cập nhật 2026-10-04: B003/B004 đã DAT và push tại `ed24674`; 123 người / 42 ngày, tháng 1 đủ 31/31 ngày, 19/93 bổ sung tháng 1 là người Việt (20,4%). B004 có lỗi nguồn ở r1, đã sửa đạt r2; áp dụng quy tắc chia nửa tháng. Chủ dự án duyệt tiếp tục tháng khác; B005 triển khai 1–15/2; reviewr6 DAT, cổngURL toàn bộ đạt. Các đích phủ tháng 2 và toàn năm chưa hoàn thành.

Điều chỉnh chủ dự án 2026-10-04: tỷ lệ hồ sơ mới B005 tối thiểu 5% người Việt; Codex trực tiếp thực hiện, kiểm tra và tích hợp sau DAT. Không thay đổi bằng chứng hay tiêu chí đóng tháng 1.

Quyết định tỷ lệ 5% áp dụng các đợt mở rộng mới tiếp theo; lịch sử và cổng đã đóng tháng 1 giữ nguyên. Không giao đợt kế tiếp khi B005 còn SUA.

2026-10-04 B006/BV-007 DAT:35mới/2VN(5,714%),Feb100/29ngày; mọi cổng đạt. Chưa giao tháng3; dừng sau tích hợp/push.

2026-10-04 chủ dự án mở toàn tháng3 và yêu cầu thực hiện luôn. B007/BV-008 thực hiện31ngày,≥93mới/≥5%VN;hai phầnnghiên cứu tuần tự trong cùngcycle, khôngsong song. Chỉ thị viec/B007-people-mar-01-31.md.


## B007 — toàn tháng 3 (hoàn tất, 05/10/2026)

- B007-v1 đạt chỉ tiêu: 93 người mới (88 quốc tế/5 Việt), 31 ngày đủ 3 người. Tổng295 hồ sơ/96 ngày, 4 sự kiện giữ nguyên.
- Nguồn: 93×2 nhà xuất bản ngoài Wiki, 186 hồ sơ tài liệu. 180 tài liệu nêu DOB đầy đủ; 6 hồ sơ SNL chỉ cho năm nhưng nhà xuất bản thứ hai xác nhận ngày. Năm hồ sơ Việt đều có DOB đầy đủ từ AFC; ghi chú giới hạn nguồn đăng ký cầu thủ chung AFC/VPF.
- Gates: tests A–AA, Wikidata295/295, URL916/916, tsc/lint/build/coverage, source evidence native 186, smoke12/12, equality baseline202+4 events. 5 lint `<img>` cảnh báo cũ.
- Chủ dự án đã phê duyệt Codex thực hiện, review, commit/push khi DAT. Đóng vòng sau khi kiểm tra remote; không chuyển qua tháng4 trong cùng vòng.


## B008 — tháng 4 (ACCEPTED, BV-009)

Chủ dự án yêu cầu tiếp tục tháng4 ngày2026-10-05. B007 đã DAT và push tại `20ec06a1df2227ddcb64561e874fbc025f6239ef`, origin/main xác nhận0/0. B008 phủ30/30 ngày,90 hồ sơ mới,3/ngày,≤8/ngày,5/90 người Việt (5,56%). Bảo toàn295 hồ sơ+4 sự kiện. Hai đợt nghiên cứu 1–15 và16–30/4; query LIMIT100 là mẫu sàng lọc, không khẳng định đầy đủ toàn bộ ứng viên. Review r1 DAT. 181/181 trang nguồn B008 cuối HTTP200; 90/90 hồ sơ có exactDOB nguồn ngoài Wiki. Tổng385người,124ngày phủ. Rules A–AC, Wikidata385/385, TypeScript/lint/build/coverage, smoke14/14 và equality baseline đạt. Báo cáo `.ai/hop-thu-mybirthday/xong/B008-people-apr-01-30.md`; review `.ai/hop-thu-mybirthday/review/B008-people-apr-01-30-r1.md`. Commit `f7ac981` đã push; `origin/main` xác nhận0/0.


## B009 — tháng 5 (BV-010, ACCEPTED)

Chủ dự án yêu cầu lập kế hoạch và tự thực hiện 2026-10-05; review đối chiếu chính xác trước khi nhập database. Task đã review: `.ai/hop-thu-mybirthday/viec/B009-people-may-01-31.md`. Tiêu chí cao hơn vòng trước: 3 hồ sơ/ngày × 31; ít nhất 5% người Việt; mỗi hồ sơ có Wikidata chính xác và hai nhà xuất bản độc lập đều xác nhận full DOB; người Việt có hai nguồn full DOB ngoài Việt Nam. Đã lưu danh sách/captures và loại ứng viên chưa đủ nguồn trước khi tích hợp. B009 được chốt theo review r1; chỉ thêm `PEOPLE_05`, chưa mở tháng 6.

06/10/2026 B009 review r1 DAT cho 93 hồ sơ tháng 5: 5 VN/88 quốc tế, 191 nguồn DOB, strict claims 93/93, Wikidata 478/478, baseline 385+4, smoke 26/26 và cổng kỹ thuật đạt. Sửa metadata publisher ES và excerpt sai người của Almanac; công khai giới hạn nguồn đăng ký thể thao. Tổng 478 người/155 ngày. URL toàn ứng dụng còn 5 lỗi legacy trong snapshot, ngoài phần phát hành B009. Chủ dự án duyệt push phần đạt; dừng sau xác nhận remote, chưa giao tháng 6.

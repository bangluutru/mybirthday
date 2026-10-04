KET_QUA: SUA

# B005 review r3 — nguồn Brecht bị lỗi máy chủ

2026-10-04. BnF, SNL Woolf và Mozarteum đã qua kiểm tra; toàn bộ dữ kiện baseline giữ nguyên, trừ đúng URL phụ Woolf được duyệt ở r2.

Lượt toàn bộ với helper HTTP GET/body thật: 535 checked /1 failed/0 MANUAL. Nguồn `https://adk.de/bertolt-brecht` trả HTTP502 cả3 lần; không được coi là đã đạt.

Chỉ thị sửa trong FILES B005: thay nguồn đầu của hồ sơ `bertolt-brecht` /Q38757 bằng `https://snl.no/Bertolt_Brecht`. SNL ghi `10. februar 1898`; tác giả Giáo sư Elsbeth Wessel (Đại học Oslo) và Jostein Avdem Fretland, độc lập với Deutsche Biographie. Giữ mọi trường dữ kiện, cập nhật đúng nguồn/quote/hash/publisher trong evidence và source-review. Chạy lại cổng đầy đủ đến0 lỗi/0 MANUAL, nộp v2, reviewer duyệt trước push. Không mở B006 trước DAT.

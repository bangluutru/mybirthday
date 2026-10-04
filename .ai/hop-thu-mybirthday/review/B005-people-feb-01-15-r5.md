KET_QUA: SUA

# B005 review r5 — lỗi HTTP500 thoáng qua ở AJPN

Lượt r5:535 checked/1 failed/0MANUAL; AJPN Paul Nguyễn Công Anh trả500. Mọi cổng khác r5 đạt, kể cả Wikidata167/167 vàsmoke9/9. GET thật ngay sau lỗi trả200, body71193 bytes, SHA256 a6b4a3262975412d43c994f76627cf69ba8eb5246abc94f38a02fc0918623a71, nội dung ghi `Date de naissance: 31/01/1919`. Các lượt r2/r3 cũng200. Không thayURL hoặc dữ kiện Paul.

Cho phép helper validation thử lại HTTP500 tương tự502/503/504 (tối đa3 lần GET/body thật); không cache/mock/ngoại lệ hay đổi check nguồn. Chạy lại toàn bộ để có0failed/0MANUAL trước DAT. Giữ nguyên các kết quả lỗi r1–r5 để truy vết. Đây là sửa helper thuộc FILES B005, không mở rộng code/UI/data. B006 chưa mở.

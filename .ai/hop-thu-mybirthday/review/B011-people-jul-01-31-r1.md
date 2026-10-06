KET_QUA: DAT

# B011-r1 — Review dữ liệu tháng 7

**Cycle:** BV-012

**Ngày review:** 2026-10-06

**Kết quả:** PASS — duyệt phát hành

## Tiêu chí và kết quả

| Tiêu chí | Kết quả |
|---|---|
| Phạm vi 1–31/7 | 93 hồ sơ mới, đúng 3 hồ sơ mỗi ngày |
| Cân bằng | 5 người Việt/93 hồ sơ = 5,38% |
| ID và Wikidata | 93 ID, 93 QID, duy nhất; trùng tên Nguyễn Huy Hoàng được tách bằng slug theo vai trò |
| Wikidata | P31 human 93/93; P569 Gregorian precision 11 93/93; 0 claim chính xác hơn đang hoạt động bị mâu thuẫn |
| Hai nguồn DOB | 186 trang; mỗi hồ sơ hai publisher và host khác nhau; cả hai đối chiếu đúng người và ngày đầy đủ |
| Nguồn Việt | 5/5 hồ sơ có hai publisher ngoài Việt Nam; 10 trang proof chính thức được ghi trong ledger |
| Metadata hiển thị | Quốc gia đối chiếu P27 và mô tả nhân vật; nghề/phân loại dùng vai trò tổng quát có căn cứ, khóa trong Rule AF; không thêm birthplace hay thành tích chưa kiểm chứng |
| Bảo toàn baseline | 568 hồ sơ ngoài tháng 7 giữ deep-equal; 4 history events giữ nguyên |
| Độ phủ | Sau cập nhật 661 hồ sơ, 215/366 ngày; tháng 7 31/31 ngày |

## Nguồn không tải được cục bộ

183/186 trang DOB trả HTTP 200 từ lượt kiểm tra trực tiếp. Ba trang còn lại được mở và xác minh trực tiếp trên trang publisher:

- Smithsonian SOVA về P. T. Barnum: trang ghi hồ sơ đúng người và ngày sinh đầy đủ; local HTTP 403. [Smithsonian source](https://sova.si.edu/record/nmah.ac.0068)
- National Academy of Sciences về John B. Goodenough: trang ghi ngày sinh đầy đủ; local HTTP 403. [NAS source](https://www.nasonline.org/directory-entry/john-b-goodenough-mrh6a9/)
- Universal Music France về Selena Gomez: trang ghi đúng tên và ngày sinh; local HTTP 500. [Universal Music France source](https://www.universalmusic.fr/artistes/30192124702)

Các trang browser-direct có xác nhận identity/DOB, URL và line evidence trong `B011-evidence.json`. Không có hash byte nội dung cho ba trang ấy; hash của phản hồi lỗi cục bộ được giữ riêng. Đây là giới hạn bằng chứng được ghi rõ, không phải nguồn DOB chưa xác minh.

## Kỹ thuật

- Integrity suite A–AF: PASS, 0 vi phạm.
- Wikidata toàn ứng dụng: 661/661 khớp Gregorian DOB, 0 mismatch/thiếu P569.
- TypeScript, lint, production build, coverage: PASS.
- Smoke 5/5 routes: PASS.
- Lint/build giữ 32 cảnh báo `<img>` có trước, ngoài phạm vi B011.
- `git diff --cached --check`: PASS — không có whitespace lỗi trong các tệp B011 được stage.

## Quyết định

B011 đạt acceptance; duyệt commit và push các tệp nằm trong scope. Sau khi xác nhận `origin/main` đồng bộ, được mở B012 tháng 8 theo yêu cầu chủ dự án.

Ledger đầy đủ: [`B011-evidence.json`](B011-evidence.json). Executor report: [`B011-people-jul-01-31.md`](../xong/B011-people-jul-01-31.md).

# hop-thu-mybirthday: Claude Code ↔ Gemini 3.8 (Antigravity) cho BirthdayVerse

Cùng cơ chế với `123manabi/hop-thu-gemini`. Thư mục dự án: `/Users/tranhaibang/.gemini/antigravity-ide/scratch/xtools/mybirthday/`. Hộp thư: `.ai/hop-thu-mybirthday/` (trong repo).

```
viec/B001-….md   ← Claude giao việc (Gemini làm đúng việc này)
xong/B001-….md   ← Gemini báo xong (lần sửa k → B001-…-v<k>.md)
review/B001-….md ← Claude review (dòng đầu: KET_QUA: DAT | SUA | CHUA_DAT)
```

## Vai trò (thay thế bảng vai trò cũ trong AGENTS.md cho chế độ hộp thư này)
- **Gemini**: executor. Sửa code, chạy test/lint/tsc/build, nộp báo cáo. **KHÔNG chạy git** (không add/commit/push/pull/stash/checkout/reset).
- **Claude Code**: reviewer + người commit/push duy nhất. Chỉ `git add` đúng các file nằm trong mục FILES của báo cáo.
- **GitHub**: nguồn sự thật. Lịch sử mỗi vòng nằm trong `viec/`, `xong/`, `review/`.

## Quy tắc cứng cho Gemini
1. Không git. Không cài gói mới (`npm install <gì đó>` bị cấm), không sửa `package.json`/lock trừ khi việc nói rõ.
2. Chỉ ghi: các file nguồn mà việc cho phép, `xong/`, `nhap/`, `nhat-ky.md`, `gemini.lock`. Không ghi vào `viec/`, `review/`.
3. Không mở rộng phạm vi, không redesign UI, không thêm dữ liệu mới ngoài việc được giao. Thấy vấn đề ngoài phạm vi → ghi vào mục "Reviewer Attention" của báo cáo, KHÔNG tự sửa.
4. Không bịa dữ kiện. Dữ liệu nhân vật/sự kiện chỉ được giữ khi nguồn chính thống (Britannica, Nobel, bảo tàng, cơ quan nhà nước, đại học, hall of fame) chứng minh đúng ngày. Không dùng web "sinh nhật" SEO, blog, nguồn do AI sinh. Không API trả phí, không gọi LLM từ code.
5. Gặp điều không chắc: ghi thật vào "Chỗ không chắc", đừng đoán rồi giấu. Làm cẩn thận hơn làm nhanh.
6. Nộp xong một việc thì không sửa lại cho tới khi có review.

## Luồng bán tự động
- Trạng thái một việc do `trang-thai.py` tính (mtime): chưa có `xong` → Gemini làm; `xong` mới hơn `review` → chờ Claude; review mới nhất `SUA|CHUA_DAT` → Gemini sửa và nộp `xong/<mã>-v<k>.md`; `DAT` → xong (Claude đã commit).
- Luôn ≤ 1 việc chưa xong. Việc kế tiếp chỉ được giao SAU khi việc trước `DAT` (xem `KE-HOACH.md`).
- Chủ dự án mở phiên Antigravity và dán câu lệnh trong `GEMINI-PROMPT.md`.
- File `DUNG` trong thư mục này → cả hai bên dừng. Tình huống bất thường: Claude ghi "CẦN CHỦ DỰ ÁN: …" vào `nhat-ky.md` rồi ngừng giao việc.

## Liên hệ với state machine trong AGENTS.md
`.ai/REVIEW.md` ghi chu kỳ đang mở (BV-002) và trỏ tới việc B-… tương ứng. Khi Gemini nộp, trạng thái là WAITING_FOR_REVIEW; Claude cập nhật `.ai/REVIEW.md` và `.ai/STATUS.md` khi review/commit. Gemini không sửa `.ai/REVIEW.md` hay `.ai/STATUS.md`.

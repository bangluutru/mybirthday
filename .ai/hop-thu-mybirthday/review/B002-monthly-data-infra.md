KET_QUA: SUA

Review của Claude Code (2026-10-03) cho B002. Phạm vi đã kiểm (không dựa vào snapshot của Gemini):
- Tự chạy lại `npm test` (Rule A–O pass), `tsc` 0 lỗi, `build` OK, lint 0 error, `npm run coverage` ra 12/366 ngày, 30 người, 1 ngày/4 sự kiện (khớp dữ liệu).
- **Đối chiếu độc lập**: lấy `birthdays.ts`/`types.ts` gốc từ git HEAD, viết script riêng so sâu với bản mới: `ALL_PEOPLE` (bỏ `verifiedAt`), `HISTORY_EVENTS`, `HISTORY_EVENTS_22_FEB`, `getBirthdayData` cho cả 366 ngày (thứ tự id trong featured/all/…), `getExactSameDatePeople` 6 cặp, `getPersonBySlug` cho 30 slug → **GIỐNG HỆT**. Chỉ thứ tự toàn mảng `ALL_PEOPLE` khác (theo tháng tăng dần, spec cho phép). Cả 30 người và 4 sự kiện có `verifiedAt = 2026-10-03`.
- HTML 4 trang trước/sau: mỗi trang chỉ 4 token khác, toàn bộ nằm trong buildId/hash chunk của Next. Nội dung giống nhau.
- Không đụng `src/app`, `src/components`, `src/hooks`, `src/messages`, `public`, lock, AGENTS.md; `package.json` chỉ thêm đúng dòng `coverage`; `birthdays.ts` còn 152 dòng, giữ nguyên export.

## Cần sửa (1 chỗ)
1. **`scripts/test-integrity.ts` L454 và L458 dùng `(p as any).verifiedAt` / `(ev as any).verifiedAt`**: việc cấm `as any`. `verifiedAt` đã là trường bắt buộc của kiểu nên không cần ép kiểu: truyền `p.verifiedAt` trực tiếp, và đổi tham số `verifiedAt: any` của `validateVerifiedAt` thành `unknown` (sau đó thu hẹp bằng `typeof verifiedAt === 'string'` trước khi `split`). Sau khi sửa: `grep -rnE "eslint-disable|@ts-ignore|as any" scripts src` phải rỗng; chạy lại `npm test`, `tsc`, lint, build. Không sửa gì khác, không nộp lại snapshot.

## Ghi nhận (đồng ý, không sửa)
- Mở rộng miễn trừ "Einstein" của Rule L từ `birthdays.ts` sang cả `src/data/**` là hệ quả hợp lý của việc tách file; Gemini đã ghi trong Reviewer Attention.
- Snapshot sắp `allPeople` theo `id` để bỏ qua thứ tự toàn mảng: chấp nhận, vì thứ tự theo ngày vẫn được kiểm trong từng `getBirthdayData`.

## Bài học chung
- Quy tắc cấm (`as any`…) áp dụng cả cho script test, không chỉ code ứng dụng; kiểu đã bắt buộc thì không cần ép kiểu.

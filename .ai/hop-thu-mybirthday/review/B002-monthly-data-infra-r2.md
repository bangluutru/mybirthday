KET_QUA: DAT

# Review B002 (v2)
- Cổng máy tự chạy lại: `npm test` (Rule 0, A–O) pass; `npx tsc --noEmit` 0 lỗi; `npm run lint` 0 error; `npm run build` OK.
- `grep -rnE "eslint-disable|@ts-ignore|as any" scripts src/data`: rỗng. Lỗi `as any` của lần 1 đã sửa.
- Snapshot độc lập: dựng bản HEAD cũ (git archive) rồi chạy `snapshot-data.ts --omit-verified-at` trên cả cũ và mới → `cmp` giống hệt (209569 byte).
- `git status`: chỉ có file trong FILES (+ hộp thư). `package.json` chỉ thêm dòng `coverage`. `types.ts` chỉ thêm 2 dòng `verifiedAt`.
- verifiedAt có đủ: 30 người + 4 sự kiện. Rule N kiểm định dạng, lịch hợp lệ, không tương lai, ≥ 2026-01-01.
- Smoke HTTP 13 URL: đều 200.
- Dữ liệu người/sự kiện không đổi nội dung (snapshot khớp) nên không cần đối chiếu nguồn mới.

## Bài học chung
Snapshot trước/sau + so HTML là cách đúng cho refactor bảo toàn hành vi; giữ cách này.

## Reviewer Attention của Gemini (ghi vào STATUS.md, không bắt sửa)
`src/app/page.tsx:558,583` có `as any` từ chu kỳ cũ.

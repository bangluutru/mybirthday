# AG STATUS

## Current cycle

Cycle: BV-007
State: ACCEPTED
Task: B006 — sinh16–29/2, gồm29/2; reviewr1 DAT.
Reviewer/executor: Codex trực tiếp theo yêu cầu chủ dự án.
Result:35mới,2VN/33quốc tế (5,714%),13quốc gia;202người/65ngày. Jan95/31ngày,Feb100/29ngày,≥3/ngày. Không thêm22Feb (16),4events nguyên vẹn.
Validation: A–Y0vi phạm,Wikidata202/202,URL640/0failed/0MANUAL,tsc/lint/build/coverage/smoke10/10,diffcheck đạt.167baseline/4events deep equality. Rà35hồ sơ/70nguồn,66fullDOB,2VN có tài liệu AFC nước ngoài đủDOB, giới hạn đăng ký liên đoàn chung ghi rõ. Lint cònimgwarnings cũ.
Next: tích hợp vàpush origin/main theo chủ dự án, rồi dừng; không có chỉ thị tháng3.

## Last completed cycle — B005

Cycle: BV-006
State: ACCEPTED
Task: B005 — sinh1–15/2, B005-v2 /reviewr6 DAT.
Executor /Reviewer: Codex theo chủ dự án2026-10-04.
Result:44 mới,3VN/41 quốc tế (6,818%),14 quốc gia; tổng167 người /56 ngày. Tháng1=95/31 ngày, tháng2=65/20 ngày;1–15/2 mỗi ngày3 người.
Validation r5 kỹ thuật /r6 URL: testA–W, Wikidata167/167, URL535/0failed/0MANUAL,tsc,lint,build,coverage,9/9smoke,diffcheck đạt. Lint cònimgwarnings cũ.
Baseline:123 facts giữ nguyên,116 nguyên hồ sơ,7 chỉ đổiURL được duyệt r2/r4. Brecht mới đổi nguồn theo r3;22/2=16people/4events. Rà44 người/88 nguồn và7 nguồn thay thế;0unsupported. HTTPGET/body thật có retries, không mock/cache/nguồn ngoại lệ.
Git: đã push414e5ed29b6b7b304b30bc434f9028787036ef1f; origin/main khớp0/0. Hộp thư B001–B005DAT,0 báo cáo chờ review.

## Earlier completed cycle — B004

Cycle: BV-005
State: ACCEPTED
Task: B004 — nhân vật sinh 16/1–31/1.
Review: B004-v2 / r2 DAT; `review/B004-people-jan-16-31-r2.md` (2026-10-04).
Integration: ed24674a40e12189535ec245706993a94a38b8aa đã push origin/main, gồm B003 đã DAT và B004 đã DAT theo phê duyệt chủ dự án.
Validation khi đóng: Rule A–U, Wikidata 123/123, URL 403/403 (0 MANUAL), lint, TypeScript, build, coverage và 8 route smoke đạt. Tháng 1 đủ 31/31 ngày, 19/93 hồ sơ mới Việt Nam (20,4%).
Resolution: sửa nguồn Sang sai người, rà 98 nguồn/quote, sửa xuất xứ và kiểm độc lập nguồn Thanh Lan, siết exact URL/QID và kiểm âm Rule U; thay URL phụ Thérèse timeout bằng PDF chính thức. Không còn yêu cầu sửa B004 đang mở.

## Earlier completed cycle

Cycle: BV-004
State: ACCEPTED
Task: B003 — nhân vật sinh 1/1–15/1.
Review: B003-v5 / r4 DAT; tích hợp cùng B004 tại ed24674.
Validation lúc review: Wikidata 74/74, URL 256/256, test/lint/TypeScript/build/coverage và smoke đạt.

## Previous completed cycle

Cycle: BV-003
State: ACCEPTED
Executor: Codex theo yêu cầu thực hiện trực tiếp ngày 2026-10-04 qua hộp thư `.ai/hop-thu-mybirthday/`
Reviewer: Claude Code
Implementation Commit: bcf74c08d9ce40ba5a80c66431bc82dd2d43941e (`[B002] monthly data infra, verifiedAt, coverage`)

## Kết quả BV-002 / B001

- B001 được DAT sau sửa các vấn đề hard-code, nhiễm dữ kiện giữa ngày và quy tắc test.
- Cổng khi đóng: `npm test`, `npx tsc --noEmit`, `npm run build` đạt; lint còn cảnh báo cũ; URL đều truy cập được.
- Hành vi: thống kê lấy từ dữ liệu; sự kiện lịch sử tra từ `HISTORY_EVENTS`; trang chủ/share/day không còn dữ kiện hard-code.

## Reviewer Attention (từ các chu kỳ trước, chưa xử lý)

1. `public/illustrations/` có ảnh minh họa chưa dùng hoặc có thể chưa phù hợp với sự kiện/nhân vật.
2. Phần chiêm tinh là nội dung biểu tượng, không phải dữ kiện lịch sử.
3. Dữ liệu toàn năm còn mỏng: sau B006 có202 người trên65/366 ngày; tháng1 và2 đủ31/29 ngày,301 ngày còn trống.
4. `src/app/page.tsx` còn `as any` từ chu kỳ cũ, ngoài phạm vi B003/B004.

## Kết quả BV-003 / B002 (ACCEPTED, commit bcf74c0)

- Hộp thư: B002 → xong/B002, v2 → review/B002 (SUA: `as any`), review/B002-r2 (DAT).
- Cổng (Claude chạy lại): test Rule A–O, TypeScript, lint, build và 13 URL đều đạt; snapshot trước/sau khớp.
- Hành vi: dữ liệu tách theo tháng, có `verifiedAt` và `npm run coverage` (12/366 ngày tại thời điểm đó).

Điều chỉnh chủ dự án 2026-10-04: tỷ lệ hồ sơ mới B005 tối thiểu 5% người Việt; Codex trực tiếp thực hiện, kiểm tra và tích hợp sau DAT. Không thay đổi bằng chứng hay tiêu chí đóng tháng 1.

## Reviewer Attention B005 — resolved

Timeout BnF/Woolf và502 Brecht đã xử lý đúng chỉ thị r2–r4; cổng toàn bộ cuối0failed/0MANUAL. Log lỗi giữ lịch sử. PublisherCountry host cá nhân chưa rõ ghiunknown, không suy đoán.

## Reviewer Attention B006

Trang /day còn câu cũ “hàng chục nghìn nhân vật” dù thực tế202. Cần chu kỳ UI riêng; không sửa ngoài phạm viB006. Hai nguồn AFC/VPF quản lý khác nhau nhưng có thể chung đăng ký liên đoàn; không coi là hai cuộc điều traDOB độc lập.

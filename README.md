# BirthdayVerse — Sinh Nhật Cùng Ai 🌌🎂

> **Your Birthday Universe**: Khám phá danh nhân, nghệ sĩ, nhà khoa học và các sự kiện lịch sử vĩ đại chia sẻ cùng ngày sinh của bạn trên khắp thế giới.
>
> *Cơ sở dữ liệu hiện có 202 hồ sơ nhân vật và 4 sự kiện lịch sử đã xác minh. Nhân vật xuất hiện ở 65/366 ngày (17,8%). Tháng 1 có 95 người trên đủ 31 ngày; tháng 2 có 100 người trên đủ 29 ngày, gồm ngày nhuận 29/2. Mỗi ngày tháng 2 có ít nhất 3 người; ngày 22/2 giữ 16 người. B006 bổ sung 35 người, gồm 2 người Việt (5,7%, làm tròn từ mức tối thiểu 5%), có nguồn nước ngoài nêu đủ ngày sinh. Dữ liệu đang mở rộng và chưa phủ đủ năm.*

Ứng dụng web/PWA trải nghiệm khám phá ngày sinh cá nhân hoá cao cấp, xây dựng theo ngôn ngữ thiết kế **Astral Editorial Minimal**, tối ưu cho cả giao diện di động (Mobile-First) và máy tính (Desktop Editorial 1360px).

---

## ✨ Tính Năng Nổi Bật

### 1. 🌌 Trang Chủ — Khám Phá Vũ Trụ Sinh Nhật
* **Nocturnal Cosmic Continuum:** Không gian sao đêm vô cực kết hợp vòng cung chân trời Trái Đất (Curved Earth Glow Arc).
* **Centerpiece Montage:** Trưng bày nhóm danh nhân kiệt xuất (George Washington, Drew Barrymore, Steve Irwin, Arthur Schopenhauer, Heinrich Hertz).
* **Interactive Date Portal Card:** Bảng điều khiển nổi tactile tra cứu ngày (1–31), tháng (1–12), năm sinh tùy chọn, cùng các chip chọn nhanh (*Hôm nay, 22 Tháng 2, 28 Tháng 2, 19 Tháng 5, 28 Tháng 6*).
* **Báo cáo Niên biểu Câu lạc bộ Ngày sinh:** Thống kê các chỉ số chuyên sâu (Tổng nhân vật, Nhà khoa học, Nghệ sĩ & Điện ảnh, Lịch sử, Thể thao, Doanh nhân) từ dữ liệu thực tế kết hợp huy hiệu chiêm tinh hoàng đạo (Pisces, Aquarius, v.v.).
* **Bento Danh Nhân Tiêu Biểu & Sự Kiện:** Bộ lọc 3 tab khu vực (*Tất cả, Việt Nam, Thế giới*), chip bar phân loại ngành nghề và trục sự kiện lịch sử bento.

### 2. 🏛️ Danh Sách Nhân Vật & Hồ Sơ Chi Tiết (Master-Detail Workstation)
* **Thanh công cụ lọc đa tầng:** Tìm kiếm tức thì theo tên, tác phẩm, sự kiện; nút gạt lọc chính xác theo năm sinh; phân loại quốc gia và lĩnh vực.
* **Layout Master-Detail 12 cột:**
  * **Cột trái:** Thư mục danh sách danh nhân kèm huy hiệu năm sinh, quốc tịch, chỉ báo trạng thái đang chọn (Active Indicator).
  * **Cột phải (Sticky Deep Dossier):** Hồ sơ toàn diện với banner khổ lớn, trích dẫn triết lý, cột mốc di sản (*Thành tựu cốt lõi, Nơi sinh & Xuất thân, Tầm ảnh hưởng thiên văn*), liên kết Wikipedia chính thức và danh nhân liên quan.

### 3. 📜 Dòng Thời Gian Lịch Sử & Cùng Năm Sinh (Timeline & Exact Year)
* **Trục thời gian tương tác (Interactive Vertical Timeline):** Dẫn hướng timeline dọc qua nhiều thế kỷ với các mốc son đã xác minh (1732 Washington, 1819 Adams-Onís, 1980 Miracle on Ice, 1997 Cừu Dolly).
* **Widget Bản Đồ Sao Thiên Văn (Constellation Charting):** Đồ họa vector SVG chòm sao Song Ngư với các nút sao phát sáng (Alrescha - Alpha Psc), ghi chú lịch sử và phân tích trực giác chiêm tinh.
* **Cùng ngày, cùng năm sinh:** Thẻ danh nhân sinh chính xác cùng năm và bảng tra cứu năm sinh bất kỳ.

### 4. 🎨 Tạo Thẻ Chia Sẻ Sinh Nhật (Astral Creator Studio)
* **4 Phong cách thẩm mỹ (Theme Styles):** *Cosmic Galaxy* (Huyền ảo vô cực), *Hoàng gia Di sản* (Trầm ấm kinh điển), *Minimal Editorial* (Thanh lịch tối giản), *Modern Pop Art* (Sôi nổi rực rỡ).
* **Tùy biến nội dung:** Tên người dùng, ngày kỷ niệm, lời chúc/thông điệp cá nhân.
* **Chọn nhân vật xuất hiện trên thẻ:** Checkbox chọn từ 1 đến 5 danh nhân đồng hành.
* **3 Tỉ lệ khung hình chuẩn mạng xã hội:** Vuông 1:1 (Instagram/Facebook), Story 9:16 (TikTok/Reels/Stories), Banner 16:9 (Facebook Cover).
* **Xuất ảnh trực tiếp:** Tải thẻ PNG độ nét cao (2x pixel ratio) nhờ `html-to-image` và chia sẻ một chạm qua Web Share API / Facebook.

### 5. 🔖 Bộ Sưu Tập Cá Nhân (Bookmarks)
* Lưu trữ các danh nhân yêu thích vào bộ nhớ cục bộ `localStorage` thông qua hook `useFavorites()`.
* Huy hiệu đếm số lượng realtime trên thanh header.

---

## 🛠️ Công Nghệ Sử Dụng

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
* **Styling & Design System:** [Tailwind CSS](https://tailwindcss.com/) tùy biến Design Tokens chuẩn Astral Editorial Minimal
* **Typography:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro)
* **Iconography:** [Google Material Symbols Outlined](https://fonts.google.com/icons) & [Lucide React](https://lucide.dev/)
* **Hiệu ứng & Xuất ảnh:** `html-to-image`, `canvas-confetti`
* **Triển khai PWA:** Manifest web app, icons, responsive viewport trên iOS/Android/Desktop

## 📊 Cấu Trúc Dữ Liệu

Dữ liệu nhân vật và sự kiện được phân tách theo 12 tháng:
- `src/data/people/MM.ts` (`01.ts` … `12.ts`): Export `PEOPLE_MM` chứa danh nhân có `birthMonth === MM`.
- `src/data/events/MM.ts` (`01.ts` … `12.ts`): Export `EVENTS_MM` chứa sự kiện lịch sử có `month === MM`.
- `src/data/birthdays.ts`: Module tổng hợp dữ liệu toàn năm và cung cấp các hàm truy vấn.

**Quy tắc đóng góp & kiểm tra dữ liệu:**
1. Mọi bản ghi bắt buộc có `verifiedAt` (`YYYY-MM-DD`) và `sourceUrls` từ nguồn chính thống (Britannica, bảo tàng, lưu trữ quốc gia; chặn web SEO).
2. Chạy `npm test` để kiểm tra toàn vẹn dữ liệu (Rules 0, A–Y).
3. Chạy `npm run coverage` để theo dõi độ phủ 366 ngày.

### Quy trình bổ sung dữ liệu (Wikidata + nguồn chính thống)
1. Dùng `npx tsx scripts/wikidata-candidates.ts --day M D` để lấy ứng viên theo ngày; thêm `--vn` để chạy truy vấn ứng viên Việt Nam.
2. Đối chiếu ngày sinh Gregorian có độ chính xác ngày, rồi mở nguồn độc lập chính thống và kiểm tra trùng khớp.
3. Chạy `npm run verify:wikidata` để so ngày sinh với Wikidata trên toàn bộ cơ sở dữ liệu.
4. Chạy `npm test` để kiểm tra dữ liệu, nguồn, độ phủ ngày và cân bằng hồ sơ Việt Nam.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

1. **Clone repository:**
   ```bash
   git clone https://github.com/bangluutru/mybirthday.git
   cd mybirthday
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Chạy ở chế độ phát triển (Development):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

4. **Đóng gói và chạy sản phẩm (Production):**
   ```bash
   npm run build
   npm start
   ```

---

## 📱 Khả Năng Tương Thích Màn Hình

* **Mobile Viewport:** 390 × 844, 393 × 852, 430 × 932
* **Tablet:** iPad, Galaxy Tab (768px – 1024px)
* **Desktop Editorial:** 1280px – 1360px max width

---

## 📄 Bản Quyền & Giấy Phép

© 2026 BirthdayVerse. Mã nguồn mở phục vụ mục đích nghiên cứu và giải trí giáo dục.

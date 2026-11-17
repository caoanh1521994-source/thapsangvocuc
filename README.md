# Thắp sáng dải vô cực – KioMath

Trang web để học sinh KioMath cùng "thắp đèn" trên dải ∞, lấy cảm hứng từ dự án Ánh Đèn.
Slogan: **Học tập không có điểm cuối – sáng tạo là vô hạn.**

Học sinh nhập tên (hoặc biệt danh), chọn lớp, viết một điều vừa học được rồi bấm **Thắp sáng**.
Một điểm sáng mới hiện lên trên dải ∞. Không cần tài khoản, mỗi máy được thắp 1 ngọn đèn mỗi ngày.
Dải ∞ ban đầu nhạt màu và rực dần lên khi số đèn tiến tới mục tiêu (mặc định 2026 ngọn).

## Cấu trúc tệp

| Tệp | Vai trò |
|---|---|
| `index.html` | Toàn bộ trang (HTML/CSS/JS trong một tệp) |
| `apps-script.gs` | Code Google Apps Script lưu đèn vào Google Sheets |
| `vercel.json` | Cấu hình Vercel |

## Nối Google Sheets (để cả lớp cùng thấy)

Khi `LIGHT_API` còn trống, trang chạy **chế độ thử**: đèn chỉ lưu trên máy đang mở.

1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script → dán toàn bộ `apps-script.gs` → Lưu.
2. Triển khai → Tùy chọn triển khai mới → Ứng dụng web. Thực thi: **Tôi**. Truy cập: **Bất kỳ ai** → Triển khai.
3. Sao chép URL đuôi `/exec`, dán vào `const LIGHT_API = '';` ở đầu phần `<script>` trong `index.html`, đẩy lại GitHub.
4. Sửa Apps Script sau này: Quản lý bản triển khai → bút chì → Phiên bản: Mới (URL giữ nguyên).

**Kiểm duyệt:** trong tab `DenSang`, gõ `TRUE` vào cột **Ẩn** (cột G) của dòng cần ẩn. Lời nhắn biến khỏi trang
(ngọn đèn vẫn tính vào tổng). Trang tự cập nhật sau khoảng 1 phút.

## Tuỳ chỉnh nhanh (đầu phần `<script>` trong `index.html`)

- `GOAL` – mục tiêu số ngọn đèn.
- `CLASSES` – danh sách lớp.
- `IDEAS` – các gợi ý lời nhắn.

## Đưa lên Vercel

Add New → Project → Import repo → Framework Preset **Other**, không Build Command, Output Directory để trống,
Project Name = tên repo. Mỗi lần đẩy lên `main`, Vercel tự cập nhật.

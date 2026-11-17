# Quy ước repo Thắp sáng dải vô cực

- Trang tĩnh một tệp `index.html`, không framework, không bước build. Chữ trên trang viết tiếng Việt có dấu, gọi người dùng là "em".
- Hình dải ∞ vẽ bằng JS: `C(t)` là lemniscate (CX=500, CY=280, A=430, B=660 trong viewBox 1000×600), `width(t)` có 2 chỗ xoắn tại 1,1π và 1,9π, màu theo `KO` (cam) / `KP` (tím). Không đổi các hằng này nếu không muốn mọi đèn đổi chỗ.
- Vị trí đèn thứ i (đếm từ 0, theo thứ tự thắp) = `posOf(i)`: rải theo tỉ lệ vàng trên chiều dài cung. `state.lights[0]` là đèn mới nhất, chỉ số toàn cục = total-1-k.
- Dữ liệu: Google Sheets qua `apps-script.gs` (tab `DenSang`: Thời gian, Tên, Lớp, Lời nhắn, Số phút học, Mã máy, Ẩn). GET trả `{total, minutes, lights:[{n,c,m,d,t}], byClass, board:[{n,c,k,d}]}` (300 đèn mới nhất; `d` = số phút học), POST nhận `{name, cls, msg, mins, did}` (mins kẹp 5–300).
- Thời gian học: học sinh bắt buộc chọn 1 nút trong `DURS` (15 phút … 2 giờ trở lên); đèn học lâu sáng to hơn (hệ số `sc`), dưới bộ đếm hiện tổng thời gian cả nhà đã học.
- Mỗi máy 1 đèn/ngày: kiểm ở trình duyệt (localStorage `thapsang-v1`) và ở Apps Script (mã máy + ngày giờ VN).
- Mọi giá trị từ trình duyệt đều cắt độ dài ở cả hai phía; lời nhắn hiển thị qua `esc()`.
- "Bảng xếp hạng" (cuối trang): tab 🏆 Chăm học nhất dùng `state.board` (Apps Script gộp theo mã máy, xếp theo tổng phút học, tối đa `BOARD`=200; bản thử gộp theo tên + lớp) và tab 📋 Tất cả lượt thắp dùng `state.lights`; có ô tìm tên và lọc lớp. Mã máy không bao giờ gửi ra trình duyệt.

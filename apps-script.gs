/**
 * THẮP SÁNG DẢI VÔ CỰC – KioMath
 * Lưu các ngọn đèn vào Google Sheets (không cần tài khoản cho học sinh).
 *
 * CÁCH CÀI:
 * 1. Tạo một Google Sheet mới → Tiện ích mở rộng → Apps Script, xoá code mẫu, dán toàn bộ tệp này, bấm Lưu.
 * 2. Triển khai → Tùy chọn triển khai mới → chọn loại "Ứng dụng web".
 *    Thực thi với tư cách: Tôi.  Người có quyền truy cập: Bất kỳ ai.  → Triển khai, cấp quyền.
 * 3. Sao chép URL Ứng dụng web (đuôi /exec), dán vào dòng  const LIGHT_API = '';  trong index.html rồi đẩy lại GitHub.
 * 4. Sửa code sau này: Triển khai → Quản lý bản triển khai → biểu tượng bút chì → Phiên bản: Mới → Triển khai (giữ nguyên URL).
 *
 * KIỂM DUYỆT: mở tab "DenSang", gõ TRUE vào cột "Ẩn" (cột G) của dòng muốn ẩn → lời nhắn đó biến khỏi trang
 * (ngọn đèn vẫn được tính vào tổng). Trang tự cập nhật sau khoảng 1 phút.
 */
const SHEET = 'DenSang';
const HEAD = ['Thời gian', 'Tên', 'Lớp', 'Lời nhắn', 'Số phút học', 'Mã máy', 'Ẩn'];
const SHOW = 300;                 // số lời nhắn mới nhất gửi về trang
const BAD = ['địt','đụ','lồn','cặc','đéo','vcl','óc chó','chó chết'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET); s.appendRow(HEAD); s.setFrozenRows(1);
    s.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
  }
  return s;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(v, n) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n); }
function today_() { return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'); }

function read_() {
  const s = sheet_(), last = s.getLastRow();
  if (last < 2) return { total: 0, minutes: 0, lights: [], byClass: {} };
  const v = s.getRange(2, 1, last - 1, HEAD.length).getValues();
  const byClass = {}; let minutes = 0;
  v.forEach(r => { if (r[2]) byClass[r[2]] = (byClass[r[2]] || 0) + 1; minutes += Number(r[4]) || 0; });
  const lights = [];
  for (let i = v.length - 1; i >= 0 && lights.length < SHOW; i--) {
    const r = v[i];
    // giữ đúng vị trí trên dải: dòng bị ẩn vẫn chiếm chỗ nhưng không lộ lời nhắn
    const hidden = r[6] === true || String(r[6]).toUpperCase() === 'TRUE', d = Number(r[4]) || 0;
    lights.push(hidden ? { n: 'Một bạn nhỏ', c: r[2], m: '✨', d: d, t: r[0] } : { n: r[1], c: r[2], m: r[3], d: d, t: r[0] });
  }
  return { total: v.length, minutes: minutes, lights: lights, byClass: byClass };
}

function doGet() {
  const cache = CacheService.getScriptCache(), hit = cache.get('data');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  const out = JSON.stringify(read_());
  if (out.length < 90000) cache.put('data', out, 30);
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    const name = clean_(d.name, 30) || 'Một bạn nhỏ', cls = clean_(d.cls, 20), msg = clean_(d.msg, 120), did = clean_(d.did, 40);
    const mins = Math.max(5, Math.min(300, Math.round(Number(d.mins) || 0)));
    if (!cls || msg.length < 5 || !did || !Number(d.mins)) return json_({ ok: false, error: 'thieu' });
    const low = (' ' + name + ' ' + msg + ' ').toLowerCase();
    if (BAD.some(w => low.indexOf(w) >= 0)) return json_({ ok: false, error: 'tu' });
    const s = sheet_(), last = s.getLastRow(), t = today_();
    if (last >= 2) {                                                           // mỗi máy 1 ngọn đèn / ngày
      const from = Math.max(2, last - 1500), v = s.getRange(from, 1, last - from + 1, 6).getValues();
      if (v.some(r => r[5] === did && Utilities.formatDate(new Date(r[0]), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === t))
        return json_({ ok: false, error: 'daily' });
    }
    s.appendRow([new Date(), name, cls, msg, mins, did, false]);
    CacheService.getScriptCache().remove('data');
    const tot = s.getLastRow() - 1, m = s.getRange(2, 5, tot, 1).getValues().reduce((a, r) => a + (Number(r[0]) || 0), 0);
    return json_({ ok: true, total: tot, minutes: m });
  } catch (err) {
    return json_({ ok: false, error: 'loi' });
  } finally { lock.releaseLock(); }
}

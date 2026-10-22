// Đọc mã QR trên CCCD gắn chip và trên ảnh/mã QR của ứng dụng VNeID (định danh điện tử).
// Cấu trúc chuẩn Bộ Công an:  Số CCCD|Số CMND cũ|Họ và tên|ngày sinh ddmmyyyy|Giới tính|Nơi thường trú|ngày cấp ddmmyyyy
import { VN_PROVINCES } from "@/lib/vn-provinces";

export type CccdInfo = {
  nationalId: string; oldId: string; fullName: string; birthDate: string; sex: "M" | "F" | "O";
  address: string; ward: string; province: string; issueDate: string; rawAddress: string;
};

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/\s+/g, " ").trim();

function isoDate(v: string): string {
  const t = v.trim();
  if (/^\d{8}$/.test(t)) return `${t.slice(4)}-${t.slice(2, 4)}-${t.slice(0, 2)}`;
  const m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/.exec(t);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

function properName(n: string): string {
  const t = n.trim().replace(/\s+/g, " ");
  if (t !== t.toUpperCase()) return t; // đã viết hoa chữ cái đầu đúng kiểu
  return t.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

const WARD = /^(xã|phường|thị trấn|đặc khu|p\.|x\.|tt\.)\s*/i;
const DISTRICT = /^(huyện|quận|thị xã|thành phố|tp\.?|h\.|q\.|tx\.)\s*/i;

export function splitAddress(raw: string): { address: string; ward: string; province: string } {
  const parts = raw.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 0) return { address: "", ward: "", province: "" };
  let province = "";
  const last = parts[parts.length - 1];
  const foldLast = fold(last.replace(/^(tỉnh|thành phố|tp\.?)\s+/i, ""));
  const prov = VN_PROVINCES.find((p) => fold(p.name) === fold(last) || fold(p.name.replace(/^(Tỉnh|Thành phố)\s+/, "")) === foldLast);
  if (prov) { province = prov.name; parts.pop(); }
  else if (parts.length > 1) { province = last; parts.pop(); }
  // bỏ cấp quận/huyện (không còn từ 01/07/2025) nếu có
  if (parts.length > 1 && DISTRICT.test(parts[parts.length - 1]) && !WARD.test(parts[parts.length - 1])) parts.pop();
  let ward = "";
  if (parts.length && WARD.test(parts[parts.length - 1])) ward = parts.pop()!;
  return { address: parts.join(", "), ward, province };
}

export function parseCccdQr(text: string): CccdInfo | { error: string } {
  const t = text.trim();
  const f = t.split("|").map((x) => x.trim());
  if (f.length < 5 || !/^\d{9}(\d{3})?$/.test(f[0])) {
    return { error: "Không phải mã QR CCCD/VNeID (cần dạng số CCCD|CMND|Họ tên|Ngày sinh|Giới tính|Địa chỉ|Ngày cấp)." };
  }
  const birthDate = isoDate(f[3]);
  if (!birthDate) return { error: "Mã QR không có ngày sinh đầy đủ (ddmmyyyy). Hãy nhập tay ngày sinh." };
  const g = fold(f[4]);
  const sex = g === "nam" ? "M" : g === "nu" ? "F" : "O";
  const a = splitAddress(f[5] ?? "");
  return {
    nationalId: f[0], oldId: f[1] ?? "", fullName: properName(f[2]), birthDate, sex,
    address: a.address, ward: a.ward, province: a.province, issueDate: isoDate(f[6] ?? ""), rawAddress: f[5] ?? "",
  };
}

// Tên vị thuốc luôn hiển thị dạng viết hoa chữ cái đầu mỗi từ: "bạc hà" / "BẠC HÀ" → "Bạc Hà".
// Không phụ thuộc DB (dùng được ở cả server và client).
export function herbTitle(s?: string | null): string {
  if (!s) return "";
  // dòng hóa đơn có đuôi "(30 g × 3 thang)": chỉ chuẩn hóa phần tên
  const cut = s.search(/\s\(\d/);
  if (cut > 0) return herbTitle(s.slice(0, cut)) + s.slice(cut);
  return s.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("vi")
    .replace(/(^|[\s(\[\/\-])(\p{L})/gu, (_m, a: string, c: string) => a + c.toLocaleUpperCase("vi"));
}

// Mặt hàng kho / dòng toa / dòng hóa đơn: chỉ chuẩn hóa khi là vị thuốc.
export const itemTitle = (name: string, type?: string | null) => (type === "HERB" ? herbTitle(name) : name);

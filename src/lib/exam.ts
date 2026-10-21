// Hằng số và hàm thuần cho màn hình khám bệnh.
export const BAT_CUONG = [
  { name: "exteriorInterior", label: "Biểu / Lý", options: [["BIEU", "Biểu"], ["LY", "Lý"]] },
  { name: "coldHeat", label: "Hàn / Nhiệt", options: [["HAN", "Hàn"], ["NHIET", "Nhiệt"]] },
  { name: "deficiencyExcess", label: "Hư / Thực", options: [["HU", "Hư"], ["THUC", "Thực"]] },
  { name: "yinYang", label: "Âm / Dương", options: [["AM", "Âm"], ["DUONG", "Dương"]] },
] as const;

export const BAT_PHAP = ["Hãn", "Thổ", "Hạ", "Hòa", "Thanh", "Ôn", "Bổ", "Tiêu"];

// Lấy số gam từ chuỗi liều như "12", "12g", "8-12 g". Trả null nếu không đọc được.
export function parseAmount(amount: string | null | undefined, unit: string | null | undefined): { qty: number | null; unitNote: string | null } {
  if (!amount) return { qty: null, unitNote: null };
  const m = amount.replace(",", ".").match(/\d+(\.\d+)?/);
  if (!m) return { qty: null, unitNote: null };
  const qty = parseFloat(m[0]);
  const u = `${unit ?? ""} ${amount.replace(/[\d.,\s\-–]/g, "")}`.trim().toLowerCase();
  const isGram = u === "" || /^(g|gam|gr)$/.test(u.replace(/\s/g, ""));
  return { qty, unitNote: isGram ? null : `đơn vị gốc: ${u}` };
}

// Đọc khoảng liều thường dùng từ chữ như "6-12g", "9 – 15 g". Trả null nếu không rõ.
export function parseDoseRange(text: string | null | undefined): { min: number; max: number } | null {
  if (!text) return null;
  const m = text.replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(?:-|–|—|đến|tới)\s*(\d+(?:\.\d+)?)\s*(?:g|gam)\b/i);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const b = parseFloat(m[2]);
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

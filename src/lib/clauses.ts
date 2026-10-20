// Tách một đoạn văn công năng/chủ trị thành các mệnh đề ngắn để hiển thị dạng thẻ,
// mà không làm sai lệch nội dung nguồn (chỉ tách theo dấu câu đã có sẵn, không viết lại).
export function splitClauses(text: string): string[] {
  const bySemicolon = text
    .split(/;|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (bySemicolon.length > 1) return bySemicolon;

  // Không có dấu ";" — thử tách câu bằng dấu chấm, nhưng chỉ áp dụng nếu kết quả
  // hợp lý (2-8 câu vừa phải), tránh băm nát một đoạn văn dài thành câu rời rạc.
  const bySentence = text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỹ])/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (bySentence.length >= 2 && bySentence.length <= 8) return bySentence;

  return [text.trim()];
}

type ClauseIconKey =
  | "pain"
  | "fever-heat"
  | "cold"
  | "bleeding"
  | "calm-sleep"
  | "digestive"
  | "respiratory"
  | "detox"
  | "qi-blood"
  | "skin"
  | "diuretic"
  | "default";

const KEYWORD_RULES: [RegExp, ClauseIconKey][] = [
  [/đau|nhức|giảm đau/i, "pain"],
  [/nhiệt|sốt|viêm|hỏa/i, "fever-heat"],
  [/hàn|lạnh|ấm kinh|tán hàn/i, "cold"],
  [/cầm máu|xuất huyết|huyết ứ|hoạt huyết/i, "bleeding"],
  [/an thần|ngủ|trấn tĩnh|ích trí/i, "calm-sleep"],
  [/tiêu hóa|tỳ vị|ăn kém|kiện tỳ|tiêu thực/i, "digestive"],
  [/ho|suyễn|đờm|phế khí|hen/i, "respiratory"],
  [/giải độc|sát trùng|kháng khuẩn|thanh nhiệt/i, "detox"],
  [/khí huyết|bổ khí|bổ huyết|ích khí/i, "qi-blood"],
  [/da|mụn|lở|chàm|ngứa/i, "skin"],
  [/lợi tiểu|lợi thủy|thông tiểu/i, "diuretic"],
];

export function pickClauseIcon(clause: string): ClauseIconKey {
  for (const [re, key] of KEYWORD_RULES) {
    if (re.test(clause)) return key;
  }
  return "default";
}

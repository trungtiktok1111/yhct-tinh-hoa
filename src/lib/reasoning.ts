// Lõi đối chiếu chứng hậu — mục 5 của tài liệu đặc tả.
// Nguyên tắc bắt buộc: KHÔNG dùng điểm số/phần trăm tự sinh (mục 5.3).
// Phương pháp ở đây là so khớp từ khóa đơn giản (substring, không phân biệt hoa/thường)
// giữa dữ kiện người dùng nhập và các trường supportCriteria/againstCriteria/keySigns
// đã được biên soạn cho từng chứng hậu. Đây là phương pháp thô, CHỈ để minh họa luồng —
// cần chuyên gia định nghĩa lại quy tắc chuẩn hóa thuật ngữ trước khi dùng thật.

export type PatternForAnalysis = {
  id: string;
  name: string;
  supportCriteria: string | null;
  againstCriteria: string | null;
  keySigns: string | null;
  missingDataPrompts: string | null;
};

export type PatternAnalysisResult = {
  patternId: string;
  patternName: string;
  supportMatches: string[];
  againstMatches: string[];
  missingDataPrompts: string | null;
  label: "Phù hợp với một số tiêu chí đã ghi" | "Có dữ kiện mâu thuẫn — cần xem lại" | "Chưa đủ dữ kiện để đối chiếu";
};

function splitPhrases(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/[;,.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

function findMatches(observation: string, phrases: string[]): string[] {
  const obsLower = observation.toLowerCase();
  return phrases.filter((p) => obsLower.includes(p.toLowerCase()));
}

export function analyzePatterns(observationText: string, patterns: PatternForAnalysis[]): PatternAnalysisResult[] {
  return patterns.map((p) => {
    const supportMatches = findMatches(observationText, [
      ...splitPhrases(p.supportCriteria),
      ...splitPhrases(p.keySigns),
    ]);
    const againstMatches = findMatches(observationText, splitPhrases(p.againstCriteria));

    let label: PatternAnalysisResult["label"];
    if (againstMatches.length > 0) {
      label = "Có dữ kiện mâu thuẫn — cần xem lại";
    } else if (supportMatches.length > 0) {
      label = "Phù hợp với một số tiêu chí đã ghi";
    } else {
      label = "Chưa đủ dữ kiện để đối chiếu";
    }

    return {
      patternId: p.id,
      patternName: p.name,
      supportMatches: [...new Set(supportMatches)],
      againstMatches: [...new Set(againstMatches)],
      missingDataPrompts: p.missingDataPrompts,
      label,
    };
  });
}

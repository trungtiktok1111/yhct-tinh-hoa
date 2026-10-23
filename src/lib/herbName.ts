import { prisma } from "@/lib/db";

// Khóa so khớp tên: không phân biệt hoa/thường, thừa khoảng trắng, dạng gõ dấu (NFC/NFD).
// Dấu tiếng Việt vẫn giữ nguyên vì khác dấu là khác vị (vd Bạch chỉ ≠ Bạch chi).
export const nameKey = (s: string) =>
  s.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("vi");

const splitAliases = (a?: string | null) => (a ?? "").split(/[,;/\n]+/).map(nameKey).filter(Boolean);

// Tìm vị thuốc theo tên chuẩn hoặc tên khác, bỏ qua khác biệt hoa/thường.
export async function findHerbByName(name: string, excludeId?: string): Promise<{ id: string; standardName: string } | null> {
  const k = nameKey(name);
  if (!k) return null;
  const herbs = await prisma.herb.findMany({ select: { id: true, standardName: true, aliases: true } });
  const byName = herbs.find((h) => h.id !== excludeId && nameKey(h.standardName) === k);
  if (byName) return byName;
  return herbs.find((h) => h.id !== excludeId && splitAliases(h.aliases).includes(k)) ?? null;
}

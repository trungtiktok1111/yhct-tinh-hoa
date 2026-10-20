// Tách "tính vị" (vốn đã có sẵn nguyên văn trong trường actions, chỉ chưa được tách riêng ra
// natureFlavor) cho các Herb mới thêm từ "Tuyển tập 3033 cây thuốc Đông y". Không suy diễn gì
// thêm — chỉ di chuyển đúng cụm "vị X, tính Y" đã có trong chính văn bản nguồn.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const APPLY = process.env.APPLY === "1";

function extractNatureFlavor(text) {
  const head = text.slice(0, 220);
  const re = /vị\s+([^.;]{1,60}?)(?:,?\s*mùi\s+[^,.;]{1,30})?,?\s*tính\s+([^,.;]{1,30})/i;
  const m = head.match(re);
  if (!m) return null;
  const flavor = m[1].trim().replace(/\s+/g, " ");
  const nature = m[2].trim().replace(/\s+/g, " ");
  if (flavor.length > 50 || nature.length > 35) return null; // an toàn, tránh khớp tràn lan
  return { value: `Vị ${flavor}, tính ${nature}`, matchedText: m[0], index: m.index };
}

function stripFromActions(text, matched) {
  const idx = text.indexOf(matched);
  if (idx === -1) return text;
  let rest = text.slice(0, idx) + text.slice(idx + matched.length);
  // Dọn phần nối còn sót (dấu phẩy/chấm đầu dòng, chữ "có" lẻ loi, khoảng trắng dư).
  rest = rest.replace(/^[,.;\s]+/, "").replace(/\s{2,}/g, " ").trim();
  // Nếu phần đầu bị cắt trơ trọi kiểu "<Tên cây> có ." thì bỏ luôn phần đó.
  rest = rest.replace(/^[^,.;]{0,40}\s+có\s*[.,;]\s*/i, "");
  return rest || null;
}

const source = await prisma.source.findFirst({ where: { title: { contains: "Tuyển tập 3033" } } });
const herbs = await prisma.herb.findMany({
  where: { sourceId: source.id, natureFlavor: null, actions: { not: null } },
  select: { id: true, standardName: true, actions: true },
});
console.log(`Herbs to scan: ${herbs.length}`);

let matched = 0;
const updates = [];
for (const h of herbs) {
  const r = extractNatureFlavor(h.actions);
  if (!r) continue;
  matched++;
  const newActions = stripFromActions(h.actions, r.matchedText);
  updates.push({ id: h.id, name: h.standardName, natureFlavor: r.value, actions: newActions });
}
console.log(`Matched tính vị for: ${matched}`);

for (const u of updates.slice(0, 8)) {
  console.log(`\n${u.name}\n  natureFlavor: ${u.natureFlavor}\n  actions (sau khi tách): ${(u.actions || "").slice(0, 120)}`);
}

if (!APPLY) {
  console.log("\n(DRY RUN — chạy lại với APPLY=1 để áp dụng.)");
  await prisma.$disconnect();
  process.exit(0);
}

for (const u of updates) {
  await prisma.herb.update({ where: { id: u.id }, data: { natureFlavor: u.natureFlavor, actions: u.actions } });
}
console.log(`\nĐã cập nhật ${updates.length} vị thuốc.`);
await prisma.$disconnect();

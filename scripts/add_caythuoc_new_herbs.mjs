// Thêm MỚI toàn bộ các vị thuốc trong "Tuyển tập 3033 cây thuốc Đông y" (Tuệ Tĩnh) CHƯA có
// trong DB (phần đã khớp tên với Herb có sẵn được xử lý riêng ở match_caythuoc_to_db.mjs, không
// tạo trùng ở đây). Đây là nội dung mới cần đưa vào app, không phải chỉ làm giàu cái đã có —
// app không lấy 637 vị thuốc cũ làm chuẩn, có kiến thức thật trong nguồn thì phải thêm vào.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const APPLY = process.env.APPLY === "1";

function normalize(s) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function titleCaseFirst(s) {
  if (!s) return s;
  s = s.replace(/^\d+\.\s*Tên thường gọi\s*:?\s*/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const parsed = JSON.parse(fs.readFileSync("scripts/_caythuoc_parsed.json", "utf-8"));
const goodEntries = parsed.filter(
  (e) => e.name && !/tên khoa học|thuộc họ/i.test(e.name) && e.name.length <= 50 && e.name.length >= 2
);
console.log(`Entries usable after filtering: ${goodEntries.length} / ${parsed.length}`);

// Dedup theo tên chuẩn hoá — giữ bản đầu tiên gặp.
const byNorm = new Map();
for (const e of goodEntries) {
  const key = normalize(e.name);
  if (!byNorm.has(key)) byNorm.set(key, e);
}
console.log(`Unique normalized names: ${byNorm.size}`);

const herbs = await prisma.herb.findMany({ select: { standardName: true, aliases: true } });
const existingNames = new Set();
for (const h of herbs) {
  existingNames.add(normalize(h.standardName));
  if (h.aliases) {
    for (const a of h.aliases.split(/[;,]/)) existingNames.add(normalize(a));
  }
}
console.log(`Existing herb name variants in DB: ${existingNames.size}`);

const toCreate = [];
for (const [key, e] of byNorm) {
  if (existingNames.has(key)) continue; // đã có — thuộc phạm vi script enrich riêng
  const hasContent = e.botanicalDescription || e.indications || e.partUsed || e.chemicalComposition;
  if (!hasContent) continue; // không có nội dung thật để lưu, bỏ qua mục rỗng

  let indications = e.indications
    ? e.indications.replace(/^,?\s*chỉ định và phối hợp\s*:?\s*/i, "").trim()
    : null;

  toCreate.push({
    standardName: titleCaseFirst(e.name),
    latinName: e.latinName || null,
    family: e.family || null,
    botanicalDescription: e.botanicalDescription || null,
    partUsed: e.partUsed || null,
    distribution: e.distribution || null,
    chemicalComposition: e.chemicalComposition || null,
    actions: e.natureFlavorActions || null,
    indications,
    dosage: e.dosage || null,
    status: "DRAFT",
  });
}

console.log(`\nVị thuốc MỚI sẽ được tạo: ${toCreate.length}`);
console.log("Mẫu 3 mục đầu:");
for (const c of toCreate.slice(0, 3)) {
  console.log(`\n=== ${c.standardName} ===`);
  console.log("latinName:", c.latinName);
  console.log("family:", c.family);
  console.log("botanicalDescription:", (c.botanicalDescription || "").slice(0, 150));
  console.log("indications:", (c.indications || "").slice(0, 150));
}

fs.writeFileSync("scripts/_caythuoc_new_herbs.json", JSON.stringify(toCreate, null, 1));

if (!APPLY) {
  console.log("\n(DRY RUN — chạy lại với APPLY=1 để ghi vào DB.)");
  await prisma.$disconnect();
  process.exit(0);
}

let source = await prisma.source.findFirst({
  where: { title: { equals: "Tuyển tập 3033 cây thuốc Đông y - Y Học Cổ Truyền Tuệ Tĩnh", mode: "insensitive" } },
});
if (!source) {
  source = await prisma.source.create({
    data: {
      title: "Tuyển tập 3033 cây thuốc Đông y - Y Học Cổ Truyền Tuệ Tĩnh",
      sourceType: "Sách tổng hợp cây thuốc",
      locator: "1362 trang",
    },
  });
}

let created = 0;
for (const batchStart of Array.from({ length: Math.ceil(toCreate.length / 200) }, (_, i) => i * 200)) {
  const batch = toCreate.slice(batchStart, batchStart + 200).map((c) => ({ ...c, sourceId: source.id }));
  const res = await prisma.herb.createMany({ data: batch, skipDuplicates: true });
  created += res.count;
  console.log(`Đã tạo batch ${batchStart}-${batchStart + batch.length}: +${res.count}`);
}

console.log(`\nTổng cộng đã tạo ${created} vị thuốc mới.`);
await prisma.$disconnect();

// Áp dụng 265 mục vị thuốc từ "Đông Y Dược 2.0" (Lê Đình Sáng, biên soạn từ Trung Dược Học, Đông
// Dược Học Thiết Yếu, Bản Kinh...) — vừa làm giàu Herb đã có (chỉ điền trường trống), vừa TẠO MỚI
// các vị chưa có trong app (DRAFT), đúng quy tắc không giới hạn vào số vị thuốc hiện có.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const APPLY = process.env.APPLY === "1";

function normalize(s) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

const rawParsed = JSON.parse(fs.readFileSync("scripts/_bachkhoa_herbs_parsed.json", "utf-8"));

// Loại hẳn các mục đã xác minh bị hỏng hoàn toàn do lỗi ranh giới tách văn bản (nội dung của
// một vị thuốc khác bị lẫn vào) — "Tân Di" (hoa mộc lan) bị dính nguyên nội dung "Cáp giới"
// (tắc kè, một vị thuốc động vật khác hẳn) ở cả family lẫn latinName.
const HARD_EXCLUDE = new Set(["tân di"]);

// Chuẩn hoá độ dài family/latinName — 2 trường này về bản chất phải ngắn (vd "Họ Cúc
// (Asteraceae)", "Panax ginseng C.A.Mey"); nếu dài bất thường (>150 ký tự) gần như chắc chắn là
// lỗi dính nội dung của trường/mục kế tiếp do văn bản PDF ngắt dòng bất thường — chỉ bỏ đúng
// trường đó (không suy diễn giá trị đúng), giữ nguyên các trường khác của cùng mục vì chúng vẫn
// đáng tin cậy riêng rẽ.
function sanitize(e) {
  return {
    ...e,
    family: e.family && e.family.length <= 150 ? e.family : null,
    latinName: e.latinName && e.latinName.length <= 150 ? e.latinName : null,
  };
}

// Sách này có ~11 vị thuốc xuất hiện 2 lần (biên soạn từ nhiều nguồn khác nhau ghép lại, mỗi
// lần với trích dẫn/mô tả riêng) — gộp lại thay vì áp dụng update 2 lần chồng lên nhau (lần sau
// ghi đè lần trước một cách không kiểm soát). Với các trường multi-citation, nối cả hai; với
// trường đơn, ưu tiên giá trị không rỗng, nếu cả hai khác nhau thì nối lại (không mất thông tin).
function mergeEntries(a, b) {
  const merged = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b), "name"])) {
    if (key === "name") { merged.name = a.name; continue; }
    const va = a[key], vb = b[key];
    if (va && vb && va !== vb) merged[key] = `${va} | ${vb}`;
    else merged[key] = va || vb || null;
  }
  return merged;
}

const byName = new Map();
for (const raw of rawParsed) {
  const e = sanitize(raw);
  const key = normalize(e.name);
  if (HARD_EXCLUDE.has(key)) continue;
  if (byName.has(key)) {
    byName.set(key, mergeEntries(byName.get(key), e));
  } else {
    byName.set(key, e);
  }
}
const parsed = Array.from(byName.values());
console.log(`Entries sau khi loại trừ + gộp trùng: ${parsed.length} (gốc: ${rawParsed.length})`);

function buildFields(e) {
  const aliases = [e.aliasesVN, e.aliasesHV].filter(Boolean).join("; ") || null;
  const botanicalDescription = [e.botanicalDescription, e.distinguish].filter(Boolean).join(" ") || null;
  const harvestProcessing = [e.harvest, e.processing].filter(Boolean).join(" ") || null;
  const indications = [e.indications, e.clinicalRecipes ? `Đơn thuốc kinh nghiệm: ${e.clinicalRecipes}` : null]
    .filter(Boolean)
    .join(" ") || null;
  const dosage = [e.usage, e.dosage].filter(Boolean).join(" ") || null;
  return {
    aliases,
    latinName: e.latinName,
    family: e.family,
    botanicalDescription,
    distribution: e.distribution,
    partUsed: e.partUsed,
    harvestProcessing,
    chemicalComposition: e.chemicalComposition,
    natureFlavor: e.natureFlavor,
    meridians: e.meridians,
    actions: e.actions,
    indications,
    dosage,
    safetyNotes: e.safetyNotes,
  };
}

// Loại trừ các tên đã xác minh là đồng âm dị nghĩa (khác loài/khác vị) phát hiện từ nguồn trước —
// nếu trong nguồn này cũng xuất hiện tên tương tự, không áp dụng tự động, cần xem thủ công trước.
const MANUAL_REVIEW_NEEDED = new Set(["thục địa", "bạch đàn hương"]);

const existingHerbs = await prisma.herb.findMany();
const existingByNorm = new Map();
for (const h of existingHerbs) {
  existingByNorm.set(normalize(h.standardName), h);
  if (h.aliases) {
    for (const a of h.aliases.split(/[;,]/)) {
      const k = normalize(a);
      if (!existingByNorm.has(k)) existingByNorm.set(k, h);
    }
  }
}

const toUpdate = [];
const toCreate = [];
const needsReview = [];

for (const e of parsed) {
  const key = normalize(e.name);
  if (!key || key.length < 2) continue;
  const fields = buildFields(e);
  const hasAnyContent = Object.values(fields).some(Boolean);
  if (!hasAnyContent) continue;

  if (MANUAL_REVIEW_NEEDED.has(key)) {
    needsReview.push({ name: e.name, fields });
    continue;
  }

  const existing = existingByNorm.get(key);
  if (existing) {
    const data = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v && !existing[k]) data[k] = v;
    }
    if (Object.keys(data).length > 0) {
      toUpdate.push({ id: existing.id, name: existing.standardName, data });
    }
  } else {
    toCreate.push({ standardName: e.name, status: "DRAFT", ...fields });
  }
}

console.log(`Herbs đã có sẽ được làm giàu: ${toUpdate.length}`);
console.log(`Herbs mới sẽ được tạo: ${toCreate.length}`);
console.log(`Cần xem thủ công (trùng tên nghi ngờ khác loài): ${needsReview.length}`);
needsReview.forEach((r) => console.log("  -", r.name, "| family:", r.fields.family, "| latin:", r.fields.latinName));

console.log("\nMẫu 3 bản cập nhật đầu:");
for (const u of toUpdate.slice(0, 3)) {
  console.log(`\n=== ${u.name} ===`);
  for (const [k, v] of Object.entries(u.data)) console.log(`  ${k}: ${String(v).slice(0, 150)}`);
}
console.log("\nMẫu 3 vị thuốc mới đầu:");
for (const c of toCreate.slice(0, 3)) {
  console.log(`\n=== ${c.standardName} ===`);
  console.log("  latinName:", c.latinName, "| family:", c.family);
  console.log("  natureFlavor:", (c.natureFlavor || "").slice(0, 100));
}

fs.writeFileSync("scripts/_bachkhoa_toUpdate.json", JSON.stringify(toUpdate, null, 1));
fs.writeFileSync("scripts/_bachkhoa_toCreate.json", JSON.stringify(toCreate, null, 1));

if (!APPLY) {
  console.log("\n(DRY RUN — chạy lại với APPLY=1 để ghi vào DB.)");
  await prisma.$disconnect();
  process.exit(0);
}

let source = await prisma.source.findFirst({
  where: { title: { equals: "Đông Y Dược 2.0 - Lê Đình Sáng (biên soạn từ Trung Dược Học, Đông Dược Học Thiết Yếu...)", mode: "insensitive" } },
});
if (!source) {
  source = await prisma.source.create({
    data: {
      title: "Đông Y Dược 2.0 - Lê Đình Sáng (biên soạn từ Trung Dược Học, Đông Dược Học Thiết Yếu...)",
      sourceType: "Sách tổng hợp/biên dịch nhiều nguồn kinh điển",
      locator: "Phần Vị thuốc, mục 1-264",
    },
  });
}

for (const u of toUpdate) {
  await prisma.herb.update({ where: { id: u.id }, data: u.data });
}
console.log(`\nĐã làm giàu ${toUpdate.length} vị thuốc.`);

const created = await prisma.herb.createMany({
  data: toCreate.map((c) => ({ ...c, sourceId: source.id })),
  skipDuplicates: true,
});
console.log(`Đã tạo ${created.count} vị thuốc mới.`);

await prisma.$disconnect();

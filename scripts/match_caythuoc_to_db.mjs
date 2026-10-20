// Đối chiếu các mục đã phân tách từ "Tuyển tập 3033 cây thuốc Đông y" với các Herb đã có trong DB
// (so khớp theo tên chuẩn hoá, bỏ dấu). Mặc định DRY_RUN=true chỉ in ra để kiểm tra trước khi áp dụng.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const DRY_RUN = process.env.APPLY !== "1";

// CHÚ Ý: không bỏ dấu tiếng Việt khi so khớp — từng thử bỏ dấu và phát hiện va chạm sai
// (vd. "Thị đế" và "Thị dẻ" cùng chuẩn hoá về "thi de" dù là 2 vị khác nhau). Chỉ hạ chữ
// thường + gộp khoảng trắng để so khớp chính xác theo chữ có dấu.
function normalize(s) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

const parsed = JSON.parse(fs.readFileSync("scripts/_caythuoc_parsed.json", "utf-8"));

// Lọc các mục có tên hỏng do lỗi phân tách định dạng số thứ tự hiếm gặp.
const goodEntries = parsed.filter(
  (e) => e.name && !/tên khoa học|thuộc họ/i.test(e.name) && e.name.length <= 50
);
console.log(`Entries usable after filtering: ${goodEntries.length} / ${parsed.length}`);

const byNorm = new Map();
for (const e of goodEntries) {
  const key = normalize(e.name);
  if (!byNorm.has(key)) byNorm.set(key, e);
}
console.log(`Unique normalized names: ${byNorm.size}`);

const herbs = await prisma.herb.findMany();
console.log(`Herbs in DB: ${herbs.length}`);

// Loại trừ các tên trùng lặp giữa truyền thống dân gian (nguồn này) và TCM cổ điển (DB) mà
// khi kiểm tra chéo family/tên Latin phát hiện là 2 loài hoàn toàn khác nhau (đồng âm khác
// nghĩa) — áp dụng sẽ ghi đè dữ liệu sai cho vị thuốc TCM. Xác minh thủ công trước khi gỡ bỏ
// khỏi danh sách này.
const EXCLUDE_NAMES = new Set([
  "thục địa", // Thục địa (TCM) = Rehmannia đã chế; nguồn này ghi "Thục địa" cho Guazuma ulmifolia (họ Trôm) — khác loài.
  "bạch đàn hương", // Bạch đàn hương (TCM) = gỗ đàn hương Santalum (họ Santalaceae); nguồn này ghi family Verbenaceae/Premna — khác loài.
]);

let matched = 0;
const updates = [];
for (const h of herbs) {
  const candidates = [h.standardName, ...(h.aliases ? h.aliases.split(/[;,]/) : [])];
  let found = null;
  for (const c of candidates) {
    const key = normalize(c);
    if (byNorm.has(key)) {
      found = byNorm.get(key);
      break;
    }
  }
  if (!found) continue;
  if (EXCLUDE_NAMES.has(normalize(h.standardName))) {
    console.log(`  (bỏ qua theo danh sách loại trừ: ${h.standardName})`);
    continue;
  }
  matched++;

  const data = {};
  if (!h.latinName && found.latinName) data.latinName = found.latinName;
  if (!h.family && found.family) data.family = found.family;
  if (!h.botanicalDescription && found.botanicalDescription) data.botanicalDescription = found.botanicalDescription;
  if (!h.partUsed && found.partUsed) data.partUsed = found.partUsed;
  if (!h.distribution && found.distribution) data.distribution = found.distribution;
  if (!h.chemicalComposition && found.chemicalComposition) data.chemicalComposition = found.chemicalComposition;
  if (!h.indications && found.indications) {
    // Dọn tiền tố còn sót từ nhãn gốc "Công dụng, chỉ định và phối hợp:" (regex chỉ khớp "Công dụng").
    data.indications = found.indications.replace(/^,?\s*chỉ định và phối hợp\s*:?\s*/i, "").trim();
  }
  if (!h.dosage && found.dosage) data.dosage = found.dosage;
  // natureFlavorActions ghép dồn kiến thức tính vị/tác dụng — chỉ dùng khi actions đang trống.
  if (!h.actions && found.natureFlavorActions) data.actions = found.natureFlavorActions;

  if (Object.keys(data).length === 0) continue; // không có gì mới để bổ sung

  updates.push({ id: h.id, name: h.standardName, matchedAs: found.name, data });
}

console.log(`\nHerbs matched by name: ${matched}`);
console.log(`Herbs with new fields to fill: ${updates.length}`);

// In 5 mẫu để kiểm tra chất lượng trước khi áp dụng thật.
for (const u of updates.slice(0, 5)) {
  console.log(`\n=== ${u.name} (khớp: "${u.matchedAs}") ===`);
  for (const [k, v] of Object.entries(u.data)) {
    console.log(`  ${k}: ${String(v).slice(0, 200)}`);
  }
}

fs.writeFileSync("scripts/_caythuoc_updates.json", JSON.stringify(updates, null, 1));
console.log(`\nĐã ghi ${updates.length} bản cập nhật vào scripts/_caythuoc_updates.json`);

if (!DRY_RUN) {
  console.log("\nAPPLY=1 -> đang ghi vào DB...");
  for (const u of updates) {
    await prisma.herb.update({ where: { id: u.id }, data: u.data });
  }
  console.log(`Đã cập nhật ${updates.length} vị thuốc.`);
} else {
  console.log("\n(DRY RUN — chưa ghi vào DB. Chạy lại với APPLY=1 để áp dụng thật.)");
}

await prisma.$disconnect();

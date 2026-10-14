// Thêm vị thuốc còn thiếu + gắn nhãn công năng từ "So sánh các nhóm thuốc giải
// biểu. Ths Bs Võ Thanh Phong.pptx" (134 slide, so sánh nhiều nhóm thuốc: giải
// biểu, thanh nhiệt, tả hạ, ...). Mỗi slide = 1 tiểu nhóm công năng + danh sách
// vị thuốc thuộc nhóm đó (không xếp hạng rõ ràng, chỉ là danh sách liệt kê).
// CHỈ tạo Herb mới nếu CHƯA có trong DB — không sửa/ghi đè dữ liệu Herb đã có để
// tránh làm hỏng nội dung đã thẩm định từ các nguồn khác.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Row = { section: string | null; title: string | null; herbs: string[]; slide: number };

async function main() {
  const rows: Row[] = JSON.parse(fs.readFileSync("scripts/so_sanh_giai_bieu_parsed.json", "utf-8"));

  const source = await prisma.source.create({
    data: {
      title: "So sánh các nhóm thuốc (giải biểu, thanh nhiệt, tả hạ...)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Bs. Võ Thanh Phong",
      locator: "134 slide, so sánh công năng theo tiểu nhóm",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let created = 0;
  let skipped = 0;
  const byHerb: Record<string, Set<string>> = {};
  for (const row of rows) {
    const label = row.title ?? "";
    for (const name of row.herbs) {
      if (!name) continue;
      if (!byHerb[name]) byHerb[name] = new Set();
      byHerb[name].add(label);
    }
  }

  for (const [name, labels] of Object.entries(byHerb)) {
    const existing = await prisma.herb.findFirst({ where: { standardName: name } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.herb.create({
      data: { standardName: name, actions: Array.from(labels).join("; "), status: "DRAFT", sourceId: source.id },
    });
    created++;
  }

  console.log(`Vị thuốc duy nhất trong file: ${Object.keys(byHerb).length}. Tạo mới: ${created}; đã có từ trước (bỏ qua): ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

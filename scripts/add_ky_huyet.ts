// Thêm Tân huyệt và Kỳ huyệt (huyệt ngoài 14 kinh mạch cổ điển) từ "kỳ huyệt.pdf"
// (nguồn dokinhlac.com.vn, trích "Huyệt vị trên 14 đường kinh — Cẩm nang chẩn trị
// Đông y"). Mỗi huyệt: vị trí, cách châm, chủ trị — trích nguyên văn. Bỏ qua nếu
// trùng tên với huyệt đã có (không ghi đè).
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Raw = { num: string; name: string; location: string | null; technique: string | null; indications: string | null };

function clean(s: string | null): string | undefined {
  if (!s) return undefined;
  return s.replace(/\s+/g, " ").trim() || undefined;
}

async function main() {
  const rows: Raw[] = JSON.parse(fs.readFileSync("scripts/ky_huyet_parsed.json", "utf-8"));

  const source = await prisma.source.create({
    data: {
      title: "Tân huyệt và Kỳ huyệt (Huyệt vị trên 14 đường kinh — Cẩm nang chẩn trị Đông y)",
      sourceType: "Sách/tài liệu tham khảo",
      authorOrOrg: "DEMO — nguồn dokinhlac.com.vn, chưa rõ tác giả gốc",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let created = 0;
  let skipped = 0;
  for (const row of rows) {
    const name = clean(row.name)?.replace(/[:\*]+$/, "").trim();
    if (!name) continue;
    const existing = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.acupuncturePoint.create({
      data: {
        code: "",
        standardName: name,
        location: clean(row.location),
        technique: clean(row.technique),
        actions: clean(row.indications),
        status: "DRAFT",
        sourceId: source.id,
      },
    });
    created++;
  }

  console.log(`Tân huyệt/Kỳ huyệt: tạo mới ${created}, bỏ qua (trùng tên đã có) ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

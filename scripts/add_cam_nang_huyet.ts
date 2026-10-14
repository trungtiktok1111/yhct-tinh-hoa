// Bổ sung dữ liệu huyệt từ "cẩm nang huyệt.pdf" (Ths.Bs Trần Minh Quang, 2022).
// Với huyệt ĐÃ CÓ: chỉ điền vào các trường còn TRỐNG (location/meridian/technique/
// actions) — không ghi đè nội dung đã có để tránh làm hỏng dữ liệu đã thẩm định.
// Với huyệt CHƯA CÓ: tạo mới đầy đủ. Không bịa thêm nội dung ngoài file.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Raw = { name: string; meridian: string | null; location: string | null; actions: string | null; technique: string | null };

function clean(s: string | null | undefined): string | undefined {
  if (!s) return undefined;
  // bỏ số trang lạc vào cuối đoạn (vd "... sâu 0,3 thốn.    48")
  const stripped = s.replace(/\s+\d{1,3}\s*$/, "").replace(/\s+/g, " ").trim();
  return stripped || undefined;
}

async function main() {
  const rows: Raw[] = JSON.parse(fs.readFileSync("scripts/cam_nang_huyet_parsed.json", "utf-8"));

  const source = await prisma.source.create({
    data: {
      title: "Cẩm nang một số huyệt thường dùng trong châm cứu",
      sourceType: "Tài liệu tham khảo",
      authorOrOrg: "Ths.Bs. Trần Minh Quang, 2022",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let created = 0;
  let enriched = 0;
  let untouched = 0;

  for (const row of rows) {
    const name = row.name.trim();
    const existing = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
    if (!existing) {
      await prisma.acupuncturePoint.create({
        data: {
          code: "",
          standardName: name,
          meridian: clean(row.meridian),
          location: clean(row.location),
          actions: clean(row.actions),
          technique: clean(row.technique),
          status: "DRAFT",
          sourceId: source.id,
        },
      });
      created++;
      continue;
    }
    const patch: Record<string, string> = {};
    if (!existing.meridian && clean(row.meridian)) patch.meridian = clean(row.meridian)!;
    if (!existing.location && clean(row.location)) patch.location = clean(row.location)!;
    if (!existing.actions && clean(row.actions)) patch.actions = clean(row.actions)!;
    if (!existing.technique && clean(row.technique)) patch.technique = clean(row.technique)!;
    if (Object.keys(patch).length > 0) {
      await prisma.acupuncturePoint.update({ where: { id: existing.id }, data: patch });
      enriched++;
    } else {
      untouched++;
    }
  }

  console.log(`Huyệt mới: ${created}. Đã có, bổ sung trường trống: ${enriched}. Đã có, đủ dữ liệu (không đổi): ${untouched}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

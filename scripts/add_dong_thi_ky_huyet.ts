// Thêm 30 huyệt Đổng thị kỳ huyệt (Châm cứu Đổng Thị) từ "SỔ TAY TOP 30 ĐỔNG THỊ
// KỲ HUYỆT.pdf" (người dịch NNK). Mỗi huyệt: vị trí, chỉ định, cách châm (độ sâu),
// ghi chú phối hợp/khu phản ứng. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Raw = { order: number; name_guess: string; location: string; rest_text: string; page: number };

function extractSection(text: string, afterLabel: string, beforeLabel?: string): string | null {
  const afterIdx = text.indexOf(afterLabel);
  if (afterIdx === -1) return null;
  let start = afterIdx + afterLabel.length;
  let end = text.length;
  if (beforeLabel) {
    const beforeIdx = text.indexOf(beforeLabel, start);
    if (beforeIdx !== -1) end = beforeIdx;
  }
  return text.slice(start, end).trim();
}

async function main() {
  const rows: Raw[] = JSON.parse(fs.readFileSync("scripts/dong_thi_ky_huyet_parsed.json", "utf-8"));

  const source = await prisma.source.create({
    data: {
      title: "Sổ Tay Top 30 Đổng Thị Kỳ Huyệt",
      sourceType: "Sách dịch (châm cứu Đổng Thị)",
      authorOrOrg: "Đại Sư Đổng Cảnh Xương (truyền thống); người dịch: NNK (Bs Nguyễn Ngọc Khánh)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let n = 0;
  for (const row of rows) {
    const indications = extractSection(row.rest_text, "Chỉ định\n", row.name_guess) ?? extractSection(row.rest_text, "Chỉ định", row.name_guess);
    const afterName = row.name_guess ? extractSection(row.rest_text, row.name_guess, "Cách châm") : null;
    const technique = extractSection(row.rest_text, "Cách châm:", undefined);

    const name = row.name_guess ?? `Đổng thị huyệt #${row.order + 1}`;
    const existing = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
    if (existing) {
      console.log("đã có, bỏ qua:", name);
      continue;
    }
    await prisma.acupuncturePoint.create({
      data: {
        code: "",
        standardName: name,
        location: row.location || undefined,
        actions: indications ? indications.replace(/\n/g, " ").replace(/•\s*/g, "").trim() : undefined,
        technique: technique ? technique.replace(/\n/g, " ").trim() : undefined,
        anatomyNotes: afterName ? afterName.replace(/\n/g, " ").trim() || undefined : undefined,
        status: "DRAFT",
        sourceId: source.id,
      },
    });
    n++;
  }

  console.log(`Đã thêm ${n} huyệt Đổng thị kỳ huyệt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

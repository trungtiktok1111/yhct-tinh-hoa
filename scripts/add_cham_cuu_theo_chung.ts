// Thêm 20 chứng/triệu chứng + phác đồ châm cứu cổ điển từ "CHÂM CỨU\CHAM CUU THEO CHUNG.pptx".
// Mỗi mục là 1 chứng (vd "Tâm thống", "Tiểu nhiều lần") với công thức huyệt, xuất xứ/tác
// giả, công năng, thao tác, chủ trị, gia giảm — trích đúng nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Item = {
  name: string;
  overview: Record<string, string>;
  points_detail: { Huyệt?: string; "Ý nghĩa"?: string }[];
};

async function findOrCreatePoint(name: string, sourceId: string) {
  let point = await prisma.acupuncturePoint.findFirst({ where: { standardName: name } });
  if (!point) {
    point = await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId } });
  }
  return point;
}

async function main() {
  const items: Item[] = JSON.parse(fs.readFileSync("scripts/cham_cuu_theo_chung_parsed.json", "utf-8"));

  const source = await prisma.source.create({
    data: {
      title: "Xử phương châm cứu cổ điển (bài giảng, theo chứng)",
      sourceType: "Bài giảng",
      authorOrOrg: "DEMO — chưa rõ giảng viên, dẫn nguồn cổ điển riêng từng chứng (xem locator mỗi mục)",
      locator: "File CHAM CUU THEO CHUNG.pptx, 43 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let n = 0;
  for (const it of items) {
    const congThuc = it.overview["Công thức"] ?? "";
    const xuatXu = it.overview["Xuất xứ"] ?? it.overview["Tác giả"] ?? "";
    const congNang = it.overview["Công năng"] ?? "";
    const thaoTac = it.overview["Thao tác"] ?? "";
    const chuTri = it.overview["Chủ trị"] ?? "";
    const giaGiam = it.overview["Gia giảm"] ?? "";

    const pattern = await prisma.pattern.create({
      data: {
        name: it.name,
        description: chuTri || undefined,
        keySigns: chuTri || undefined,
        status: "DRAFT",
        sourceId: source.id,
      },
    });

    const principle = await prisma.treatmentPrinciple.create({
      data: {
        name: congNang ? `${congNang} (${it.name})` : it.name,
        description: congNang || undefined,
        limitations: giaGiam ? `Gia giảm: ${giaGiam}` : undefined,
        status: "DRAFT",
        sourceId: source.id,
      },
    });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });

    const protocol = await prisma.pointProtocol.create({
      data: {
        name: `Châm cứu — ${it.name}${xuatXu ? ` (${xuatXu})` : ""}`,
        goal: congNang || undefined,
        conditions: chuTri || undefined,
        warnings: [thaoTac && `Thao tác: ${thaoTac}`, giaGiam && `Gia giảm: ${giaGiam}`].filter(Boolean).join(" | ") || undefined,
        status: "DRAFT",
        sourceId: source.id,
        principleId: principle.id,
      },
    });

    const seen = new Set<string>();
    for (const row of it.points_detail) {
      const cell = row["Huyệt"];
      if (!cell) continue;
      // Một dòng bảng có thể gộp nhiều huyệt cùng ý nghĩa (vd "Ngư yêu\nThái dương",
      // "Tứ thần thông, Bách hội", hoặc "Thái xung xuyên Dũng tuyền" — thấu huyệt, giữ cả 2)
      const names = cell.split(/\n|,|，/).flatMap((s) => s.split("xuyên")).map((s) => s.trim()).filter(Boolean);
      for (const name of names) {
        if (seen.has(name)) continue;
        seen.add(name);
        const point = await findOrCreatePoint(name, source.id);
        await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id, note: row["Ý nghĩa"] || undefined } });
      }
    }
    // Chỉ dùng overview để suy huyệt khi KHÔNG có slide chi tiết (vd "Viêm tiền liệt tuyến") —
    // tránh suy nhầm khi Công thức có cấu trúc phức tạp (vd "Liệt dây IV: ...\nLiệt dây III: ...").
    // "A xuyên B" = châm xuyên từ A hướng B (kỹ thuật thấu huyệt) — giữ cả 2 huyệt.
    if (it.points_detail.length === 0) {
      for (const raw of congThuc.split(/[,，\n]/)) {
        const parts = raw.split("xuyên").map((s) => s.trim()).filter(Boolean);
        for (const candidate of parts) {
          if (!candidate || seen.has(candidate)) continue;
          seen.add(candidate);
          const point = await findOrCreatePoint(candidate, source.id);
          const note = parts.length > 1 ? `Thấu huyệt: ${parts.join(" xuyên ")}` : undefined;
          await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id, note } });
        }
      }
    }
    n++;
  }
  console.log(`Đã thêm ${n} chứng + phác đồ châm cứu cổ điển.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

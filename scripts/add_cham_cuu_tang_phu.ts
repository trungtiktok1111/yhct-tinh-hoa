// Thêm 24 phác đồ châm cứu theo tạng phủ từ "CHÂM CỨU\CHAM CUU BENH TANG PHU.pptx"
// (ThS. Võ Thanh Phong). Mỗi phác đồ: pháp trị + công thức huyệt + ý nghĩa/công năng
// từng huyệt + chủ trị. Chỉ nhập đúng nội dung có trong slide, không bịa thêm.
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

type Protocol = {
  section: string;
  name: string;
  overview: Record<string, string>;
  points_detail: { Huyệt?: string; "Phối huyệt"?: string; "Ý nghĩa"?: string; "Giải thích"?: string; "Công năng"?: string }[];
};

async function findOrCreatePoint(name: string, sourceId: string) {
  let point = await prisma.acupuncturePoint.findFirst({ where: { standardName: name } });
  if (!point) {
    point = await prisma.acupuncturePoint.create({
      data: { code: "", standardName: name, status: "DRAFT", sourceId },
    });
  }
  return point;
}

async function main() {
  const protocols: Protocol[] = JSON.parse(
    fs.readFileSync("scripts/cham_cuu_tang_phu_parsed.json", "utf-8")
  );

  const source = await prisma.source.create({
    data: {
      title: "Châm cứu bệnh tạng phủ (bài giảng)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Võ Thanh Phong",
      locator: "File CHAM CUU BENH TANG PHU.pptx, 55 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let countProtocols = 0;
  let countPoints = 0;

  for (const p of protocols) {
    const congThuc = p.overview["Công thức"] ?? p.overview[""] ?? "";
    const congNang = p.overview["Công năng"] ?? "";
    const thaoTac = p.overview["Thao tác"] ?? "";
    const chuTri = p.overview["Chủ trị"] ?? "";

    const principle = await prisma.treatmentPrinciple.create({
      data: {
        name: p.name,
        description: congNang || undefined,
        scope: p.section,
        status: "DRAFT",
        sourceId: source.id,
      },
    });

    const protocol = await prisma.pointProtocol.create({
      data: {
        name: `${p.name} (${p.section})`,
        goal: congNang || undefined,
        conditions: chuTri || undefined,
        warnings: thaoTac ? `Thao tác: ${thaoTac}` : undefined,
        status: "DRAFT",
        sourceId: source.id,
        principleId: principle.id,
      },
    });
    countProtocols++;

    const seen = new Set<string>();
    for (const row of p.points_detail) {
      const cell = row["Huyệt"] ?? row["Phối huyệt"];
      if (!cell) continue;
      const ynghia = row["Ý nghĩa"] ?? row["Giải thích"] ?? "";
      const congNangHuyet = row["Công năng"] ?? "";
      const note = [ynghia, congNangHuyet].filter(Boolean).join(" — ") || undefined;
      // Một dòng bảng có thể gộp nhiều huyệt dùng chung ý nghĩa (vd "Phế du\nXích trạch")
      for (const pointName of cell.split("\n").map((s) => s.trim()).filter(Boolean)) {
        if (seen.has(pointName)) continue;
        seen.add(pointName);
        const point = await findOrCreatePoint(pointName, source.id);
        await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id, note } });
        countPoints++;
      }
    }

    // Nếu huyệt trong "Công thức" không khớp đủ với points_detail (vd thiếu do trùng tên
    // ở các slide không có bảng chi tiết), vẫn đảm bảo đủ huyệt theo overview.
    const overviewNames = congThuc.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
    for (const name of overviewNames) {
      if (!seen.has(name)) {
        seen.add(name);
        const point = await findOrCreatePoint(name, source.id);
        await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id } });
        countPoints++;
      }
    }
  }

  console.log(`Đã thêm ${countProtocols} phác đồ châm cứu, ${countPoints} lượt huyệt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

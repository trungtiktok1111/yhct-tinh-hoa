import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const fixes = [
  { name: "Ngũ vị tiêu độc ẩm", indications: "Thanh nhiệt giải độc, tiêu tán đinh sang (nhọt độc, áp xe da giai đoạn đầu)." },
  { name: "Cách hạ trục ứ thang", indications: "Hoạt huyết hóa ứ, hành khí chỉ thống (dùng cho các chứng ứ huyết vùng hoành cách/bụng trên, đau cố định cự án)." },
  { name: "Thân thống trục ứ thang", indications: "Hoạt huyết hóa ứ, hành khí thông lạc, lợi tý chỉ thống (dùng cho tý chứng có ứ huyết, đau nhức toàn thân/khớp dai dẳng)." },
];

for (const f of fixes) {
  const existing = await prisma.formula.findFirst({ where: { name: f.name } });
  if (!existing) { console.log(`KHÔNG TÌM THẤY: ${f.name}`); continue; }
  await prisma.formula.update({ where: { id: existing.id }, data: { indications: f.indications } });
  console.log(`Đã cập nhật: ${f.name}`);
}
await prisma.$disconnect();

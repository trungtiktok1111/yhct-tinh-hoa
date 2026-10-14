// Thêm 12 "đối dược" (bài thuốc 2 vị) nhóm Cố sáp từ "Kê đơn lập phương theo YHCT.
// LẬP PHƯƠNG CỐ SÁP. TS Nguyễn Thị Hướng Dương.pdf" (tr.89-101). Mỗi đối dược có
// công dụng, chủ trị, liều dùng 2 vị, và kinh nghiệm gia giảm — trích nguyên văn.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: name } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Kê đơn lập phương theo YHCT — Lập phương Cố sáp",
      sourceType: "Bài giảng",
      authorOrOrg: "TS. Nguyễn Thị Hướng Dương — Đại học Y Dược TP.HCM, Khoa Y học cổ truyền",
      locator: "tr.89-101 (Phối ngũ thuốc theo phân nhóm — đối dược Cố sáp)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let principle = await prisma.treatmentPrinciple.findFirst({ where: { name: "Cố sáp" } });
  if (!principle) principle = await prisma.treatmentPrinciple.create({ data: { name: "Cố sáp", status: "DRAFT", sourceId: source.id } });

  const pairs: { name: string; indications: string; herbs: [string, string][]; note?: string }[] = [
    { name: "Hoàng kỳ - Phòng phong", indications: "Cố biểu chỉ hãn — Biểu hư tự hãn, dễ cảm mạo", herbs: [["Hoàng kỳ", "10-15g"], ["Phòng phong", "6-10g"]] },
    { name: "Sơn thù - Mẫu lệ", indications: "Liễm âm chỉ hãn — Tự hãn, đạo hãn; Di tinh, hoạt tinh; Đới hạ", herbs: [["Sơn thù", "10-15g"], ["Mẫu lệ", "10-25g"]], note: "Phối thêm Hoàng kỳ tăng hiệu quả" },
    { name: "Ma hoàng căn - Phù tiểu mạch", indications: "Ích khí dưỡng tâm, cố biểu chỉ hãn, thanh nhiệt lương khí — Khí hư tự hãn, Âm hư đạo hãn", herbs: [["Ma hoàng căn", "6-10g"], ["Phù tiểu mạch", "10-30g"]], note: "Phối thêm Ngũ vị tử, Mạch môn, Đảng sâm tăng hiệu quả" },
    { name: "Hoàng kỳ - Mẫu lệ", indications: "Ích khí cố biểu chỉ hãn — Khí âm bất túc gây tự hãn, đạo hãn", herbs: [["Hoàng kỳ", "10-15g"], ["Mẫu lệ", "10-25g"]] },
    { name: "Hoàng kỳ - Phù tiểu mạch", indications: "Ích khí thanh nhiệt, cố biểu chỉ hãn — Biểu hư tự hãn", herbs: [["Hoàng kỳ", "10-15g"], ["Phù tiểu mạch", "10-30g"]], note: "Có thể dùng Tiểu mạch thay cho Phù tiểu mạch" },
    {
      name: "Ngũ vị tử - Ngũ bội tử",
      indications: "Ích thận cố tinh, sáp trường chỉ tả, liễm hãn — Tự hãn, đạo hãn; Phế khí hư gây ho mạn tính; Tiêu chảy mạn tính; Di hoạt tinh, băng lậu; Sa tạng phủ",
      herbs: [["Ngũ vị tử", "6-10g"], ["Ngũ bội tử", "3-6g"]],
      note: "Dương hư tự hãn: gia Hoàng kỳ, Phụ tử. Tiêu chảy/lỵ mạn: gia Xích thạch chi, Vũ dư lương. Sa tạng phủ: gia Sài hồ, Thăng ma.",
    },
    { name: "Ô mai - Ngũ vị tử", indications: "Dưỡng âm cường tâm, liễm phế chỉ hãn — Tự hãn, đạo hãn; Đái tháo đường", herbs: [["Ô mai", "6-10g"], ["Ngũ vị tử", "6-10g"]], note: "Liễm hãn: gia Mạch môn, Đảng sâm để ích âm cường tâm tăng hiệu quả chỉ hãn" },
    {
      name: "Khiếm thực - Liên nhục",
      indications: "Kiện Tỳ chỉ tả, bổ Thận cố tinh, sáp tinh chỉ đới — Tỳ hư tiết tả; Tỳ hư thấp thịnh gây bạch đới; Thận hư bất cố gây hoạt tinh/di tinh/mộng tinh; Thận hư gây tiểu nhiều lần, tiểu không tự chủ",
      herbs: [["Khiếm thực", "10-15g"], ["Liên nhục", "6-12g"]],
      note: "Phối hợp thêm Phục linh, Bạch truật tăng hiệu quả trị tiết tả mạn tính",
    },
    { name: "Sơn dược - Biển đậu", indications: "Kiện Tỳ hóa thấp, hòa trung chỉ tả — Tỳ Vị hư nhược gây tiết tả; Đới hạ do Tỳ hư", herbs: [["Sơn dược", "10-30g"], ["Biển đậu", "10-15g"]] },
    { name: "Mộc hương - Hoàng liên", indications: "Lý khí hành trệ, sáp trường chỉ tả, chỉ lỵ — Xích bạch lỵ", herbs: [["Mộc hương", "6-10g"], ["Hoàng liên", "3-10g"]], note: "Mộc hương sắc hậu hạ. Lỵ tật: gia Mã xỉ hiện, Huyết dư thán, Ích nguyên tán." },
    { name: "Nhục đậu khấu - Bổ cốt chỉ", indications: "Ôn Tỳ Thận dương, hóa thấp chỉ tả — Tỳ Thận dương hư gây tiết tả; Ngũ canh tả", herbs: [["Nhục đậu khấu", "6-10g"], ["Bổ cốt chỉ", "6-10g"]] },
    { name: "Kim anh tử - Khiếm thực", indications: "Ích Thận cố tinh, bổ Tỳ chỉ tả, sáp niệu chỉ đới — Tỳ Thận dương hư gây tiết tả mạn; Thận khí bất cố gây di tinh, đới hạ", herbs: [["Kim anh tử", "6-12g"], ["Khiếm thực", "10-15g"]] },
    {
      name: "Tang phiêu tiêu - Hải phiêu tiêu",
      indications: "Bổ Thận trợ dương, thu liễm chỉ huyết, chỉ đới, sáp tinh, sáp niệu — Thận khí hư gây tiểu nhiều lần, tiểu không tự chủ; Trẻ em đái dầm; Di tinh, tảo tiết, băng lậu, đới hạ",
      herbs: [["Tang phiêu tiêu", "6-10g"], ["Hải phiêu tiêu", "10-12g"]],
    },
  ];

  for (const p of pairs) {
    const formula = await prisma.formula.create({
      data: { name: p.name, origin: "đối dược (kinh nghiệm)", indications: p.indications, modifications: p.note, status: "DRAFT", sourceId: source.id, principleId: principle.id },
    });
    for (const [name, amount] of p.herbs) {
      const h = await herb(name, source.id);
      await prisma.formulaIngredient.create({ data: { formulaId: formula.id, herbId: h.id, amount } });
    }
  }

  console.log(`Đã thêm ${pairs.length} đối dược nhóm Cố sáp.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

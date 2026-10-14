// Thêm nội dung từ "Kê đơn lập phương theo YHCT. LẬP PHƯƠNG TIÊU ĐẠO. TS Nguyễn Thị
// Hướng Dương.pdf": 11 đối dược (tr.41-51) + 2 bài thuốc đầy đủ (Bảo hòa hoàn,
// Kiện Tỳ hoàn, tr.52-57). Chỉ nhập đúng nội dung có trong file.
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
      title: "Kê đơn lập phương theo YHCT — Lập phương Tiêu đạo",
      sourceType: "Bài giảng",
      authorOrOrg: "TS. Nguyễn Thị Hướng Dương — Đại học Y Dược TP.HCM, Khoa Y học cổ truyền",
      locator: "tr.41-57",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let principle = await prisma.treatmentPrinciple.findFirst({ where: { name: "Tiêu đạo" } });
  if (!principle) principle = await prisma.treatmentPrinciple.create({ data: { name: "Tiêu đạo", status: "DRAFT", sourceId: source.id } });

  const pairs: { name: string; indications: string; herbs: [string, string][]; note?: string }[] = [
    { name: "Kê nội kim - Mạch nha", indications: "Sinh phát Vị khí, thư điều Can khí, kích thích ăn ngon — Tỳ Vị hư nhược không muốn ăn", herbs: [["Kê nội kim", "6-10g"], ["Mạch nha", "10-15g"]], note: "Có thể thay Mạch nha bằng Cốc nha" },
    { name: "Thương truật - Bạch truật", indications: "Kiện Tỳ hóa thấp — Thấp trệ trung tiêu gây tiết tả, đầy bụng; Tỳ Vị thất kiện vận gây chán ăn, buồn nôn, nôn", herbs: [["Thương truật", "6-10g"], ["Bạch truật", "10-15g"]], note: "Cả hai dùng dạng đã sao" },
    { name: "Bán hạ khúc - Kiện thần khúc", indications: "Kiện Tỳ hòa Vị, hòa trung giáng nghịch, lý khí khoan cách, tiêu thực trừ mãn — Tỳ Vị hư thất kiện vận", herbs: [["Bán hạ khúc", "6-10g"], ["Kiện thần khúc", "6-10g"]] },
    { name: "Bán hạ khúc - Trầm hương khúc", indications: "Sơ Can hòa Vị, kiện Tỳ táo thấp, hành khí chỉ thống, hóa trệ tiêu chướng — Tỳ Vị hư thất kiện vận", herbs: [["Bán hạ khúc", "6-10g"], ["Trầm hương khúc", "6-10g"]] },
    { name: "Bạch truật - Kê nội kim", indications: "Bổ tiêu khiêm thi, kiện Tỳ khai Vị — Tỳ Vị hư thất kiện vận", herbs: [["Bạch truật", "9-10g"], ["Kê nội kim", "6-10g"]] },
    { name: "Chỉ thực - Bạch truật", indications: "Kiện Tỳ, tiêu thực hóa tích, tiêu bĩ trừ mãn — Tỳ Vị hư ăn uống kém; Gan lách to", herbs: [["Chỉ thực", "5-10g"], ["Bạch truật", "10-15g"]], note: "Dùng dạng sao tăng cường hiệu quả" },
    { name: "Bạch truật - Phục linh", indications: "Kiện Tỳ trừ thấp, tiêu thũng hóa ẩm — Tỳ hư thủy thấp nội đình; Chóng mặt do bệnh Meniere", herbs: [["Bạch truật", "10-15g"], ["Phục linh", "10-15g"]], note: "Dùng Linh quế truật cam thang điều trị bệnh Meniere" },
    { name: "Bán hạ - Trúc nhự", indications: "Kiện Tỳ táo thấp, hòa Vị chỉ ẩu — Tỳ Vị bất hòa, Vị khí thượng nghịch gây nôn; Đàm trọc gây huyễn vựng, hư phiền; Thai nghén", herbs: [["Bán hạ", "6-10g"], ["Trúc nhự", "6-10g"]], note: "Cả hai dùng dạng chế gừng để tăng hiệu quả" },
    { name: "Chỉ thực - Trúc nhự", indications: "Hòa Vị giáng nghịch, thanh nhiệt chỉ ẩu, tiêu tích hóa đàm, khoan trung lợi cách — Đàm nhiệt gây Vị khí nghịch", herbs: [["Chỉ thực", "3-6g"], ["Trúc nhự", "6-10g"]] },
    { name: "Can khương - Hoàng liên", indications: "Tân khai khổ giáng, trừ hàn tích, thanh uất nhiệt, giáng nghịch chỉ ẩu, chế toan hòa Vị — Hàn nhiệt thác tạp, nôn chua, vị thống; Tiết tả, lỵ tật", herbs: [["Can khương", "1.5-10g"], ["Hoàng liên", "3-5g"]], note: "Biện chứng hàn nhiệt để chỉnh liều Can khương/Hoàng liên" },
    { name: "Đinh hương - Thị đế", indications: "Thăng giáng phối hợp, ôn trung tán hàn, giáng nghịch chỉ ẩu — Ách nghịch hàn nhiệt thác tạp; Tỳ Vị hư hàn gây nôn", herbs: [["Đinh hương", "1.5-6g"], ["Thị đế", "6-10g"]], note: "Nếu Tỳ khí hư rõ, gia Nhân sâm, Sinh khương để tăng hiệu quả" },
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

  // Bảo hòa hoàn (Đơn khê tâm pháp)
  const baoHoaHoan = await prisma.formula.create({
    data: {
      name: "Bảo hòa hoàn",
      origin: "cổ điển — Đơn khê tâm pháp",
      indications: "Thực tích đình trệ kèm Khí bế, phát Nhiệt nhẹ (đầy bụng, ợ hơi, nôn tanh hôi, táo bón/tiêu chảy, rêu lưỡi dày trắng hoặc ít vàng). PT tiêu thực đạo trệ thường dùng trị các chứng thực tích mức độ nhẹ.",
      modifications:
        "Thực trệ nặng: thêm Chỉ thực, Binh lang. Thực tích hóa nhiệt nặng: thêm Hoàng cầm, Hoàng liên. Thực tích kiêm Tỳ hư: thêm Bạch truật → thành Đại an hoàn (Đơn khê tâm pháp, tiêu tích kiện Tỳ). Bỏ Bán hạ, La bạc tử, Liên kiều, thêm Bạch truật, Bạch thược → thành Tiểu bảo hòa hoàn (Y phương tập giải, kiện Tỳ tiêu thực nhẹ). Thêm Bạch truật, Hậu phác, Hương phụ, Chỉ thực, Hoàng cầm → thành Bảo hòa hoàn (Cổ kim y giám, kiện Tỳ tiêu tích, hóa thấp thanh nhiệt).",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const baoHoaHoanHerbs: [string, string, string][] = [
    ["Sơn tra", "180g", "Quân — tiêu hóa tích trệ do thịt/chất béo/sữa, quy kinh Can, giúp điều khí"],
    ["Thần khúc", "60g", "Quân (thần) — tiêu hóa tích trệ do ngũ cốc, loại trừ ảnh hưởng của rượu"],
    ["La bặc tử", "30g", "Quân (thần) — tiêu thực đạo trệ mạnh, giáng Phế/Vị khí, tăng nhu động ruột, trừ đàm"],
    ["Trần bì", "30g", "Thần (tá) — bình Vị khí, trị khí trệ, trừ căng chướng bụng"],
    ["Bán hạ", "90g", "Thần (tá) — hòa Vị, trừ khí trệ và đàm thấp, trị buồn nôn"],
    ["Phục linh", "90g", "Tá — bổ Tỳ, hóa thấp tại trung tiêu, hỗ trợ công năng vận hóa"],
    ["Liên kiều", "30g", "Tá — thanh nhiệt, phòng ngừa thực tích lâu ngày hóa sinh nhiệt"],
  ];
  for (const [name, amount, note] of baoHoaHoanHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: baoHoaHoan.id, herbId: h.id, amount, note, role: note.split(" —")[0] } });
  }

  // Kiện Tỳ hoàn (Chứng trị chuẩn thằng) — không có liều cụ thể trong nguồn
  const kienTyHoan = await prisma.formula.create({
    data: {
      name: "Kiện Tỳ hoàn",
      origin: "cổ điển — Chứng trị chuẩn thằng",
      indications: "Tỳ hư thực tích, biểu hiện: ăn ít, khó tiêu, tiêu lỏng, ngực bụng đầy tức, mệt mỏi, uể oải, rêu nhầy vàng nhẹ, mạch hư nhược.",
      modifications:
        "Pháp trị: Kiện Tỳ hòa Vị, tiêu thực chỉ tả. Đặc điểm phối ngũ: Phục linh+Bạch truật, Thần khúc+Sơn tra+Mạch nha; tiêu bổ kiêm thi (trong tiêu có bổ). Gia giảm: Tỳ Vị hư hàn kèm thực tích — bỏ Hoàng liên, thêm Can khương ôn trung khu hàn; khí hư — thêm Hoàng kỳ ích khí; khí trệ — thêm Chỉ xác hành khí. Bạch truật/Mạch nha/Thần khúc dùng dạng sao; Hoàng liên chế rượu để giảm tính hàn.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const kienTyHoanHerbs: [string, string][] = [
    ["Nhân sâm", "Quân — bổ khí kiện Tỳ, thẩm thấp chỉ tả"],
    ["Bạch truật", "Quân — bổ khí kiện Tỳ, thẩm thấp chỉ tả"],
    ["Phục linh", "Quân — bổ khí kiện Tỳ, thẩm thấp chỉ tả"],
    ["Sơn tra", "Thần — tiêu thực hòa Vị, hóa trệ"],
    ["Thần khúc", "Thần — tiêu thực hòa Vị, hóa trệ"],
    ["Mạch nha", "Thần — tiêu thực hòa Vị, hóa trệ"],
    ["Sơn dược", "Tá — kiện Tỳ chỉ tả"],
    ["Nhục đậu khấu", "Tá — kiện Tỳ chỉ tả"],
    ["Mộc hương", "Tá — lý khí hòa Vị, kiện Tỳ hóa thấp"],
    ["Sa nhân", "Tá — lý khí hòa Vị, kiện Tỳ hóa thấp"],
    ["Trần bì", "Tá — lý khí hòa Vị, kiện Tỳ hóa thấp"],
    ["Hoàng liên", "Tá — trừ nhiệt kết sinh ra do thực tích"],
    ["Cam thảo chích", "Tá, Sứ — hòa trung, điều hòa các vị thuốc"],
  ];
  for (const [name, note] of kienTyHoanHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: kienTyHoan.id, herbId: h.id, note, role: note.split(" —")[0] } });
  }

  console.log(`Đã thêm ${pairs.length} đối dược + Bảo hòa hoàn + Kiện Tỳ hoàn (nhóm Tiêu đạo).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Thêm "Đại cương bệnh ngoài da (Da liễu YHCT)" từ giáo án Bài 1 — Giao_an_Bai1_Cac_benh_ngoai_da.docx.
// Đây là bài lý thuyết tổng quan (không phải 1 bệnh cụ thể) nên lưu như 1 Disease đại
// cương + các bài thuốc dùng ngoài có đủ vị/liều trích nguyên văn từ Phạm Văn Trịnh,
// Ngoại khoa Y học cổ truyền (2007), Chương II. Không bịa thêm thành phần.
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
      title: "Giáo án Bài 1 — Các bệnh ngoài da (Đại cương Da liễu Y học cổ truyền)",
      sourceType: "Giáo án lý thuyết",
      authorOrOrg: "Giáo trình chính: Nguyễn Thị Bay, Nguyễn Lê Việt Hùng — Da liễu YHCT, NXB ĐHQG TP.HCM 2024; bài thuốc dùng ngoài trích từ Phạm Văn Trịnh — Ngoại khoa YHCT, NXB Y học 2007, Chương II",
      locator: "Mục 4.2 (các dạng thuốc dùng ngoài, tr.36-39 sách gốc)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const disease = await prisma.disease.create({
    data: {
      name: "Đại cương bệnh ngoài da (Da liễu YHCT)",
      definition:
        "Bệnh Da liễu YHCT thuộc nhóm bệnh Ngoại khoa YHCT, có tổn thương khu trú, quan sát/sờ nắn trực tiếp được (vọng, thiết) — khác bệnh nội thương phải suy luận qua triệu chứng gián tiếp. Tổn thương đích ở da gọi chung là chứng Sang. Bao gồm cả bệnh ngoài da và bệnh hoa liễu (lây qua đường tình dục).",
      cause:
        "Ngoại nhân — Lục dâm tà khí (Phong: ngứa, lan tỏa di chuyển; Hàn: cố định, lạnh, ngưng trệ khí huyết; Hỏa/Nhiệt: sưng nóng đỏ đau, nung mủ; Thử: đỏ da bong trợt, thường kèm Thấp; Thấp: sưng đau, xuất tiết, dễ kéo dài; Táo: khô nứt, bong tróc) và Ôn tà dịch độc (Phong độc tà công lên đầu mặt; Thấp độc tà công xuống phần dưới thân). Nội nhân — Thất tình (Ưu/Bi hại Phế; Hỷ hại Tâm; Nộ hại Can — cơ chế Zona dọc kinh Can/Đởm; Tư hại Tỳ — sinh Chàm). Bất nội ngoại nhân — ăn uống thất điều (tích thấp nhiệt), phòng dục/lao lực quá mức (hao tân dịch), tiên thiên bất túc (Vảy nến cơ địa), trùng thú cắn/sang chấn.",
      mechanism:
        "6 đường truyền biến hình thành sang thương: (1) Lục dâm trực tiếp xâm phạm bì phu theo 4 tầng Vệ-Khí-Dinh-Huyết (càng sâu càng nặng); (2) Lục dâm/ôn độc tấn công theo đường kinh (Thập nhị bì bộ) — vd Mày đay; (3) Tà nhập kinh hại Vệ khí tràn ra bì phu — vd Zona (Hỏa độc theo kinh Can/Đởm); (4) Tà khí nhập Dinh phát ban — vd Sởi, Thủy đậu; (5) Huyết bị tổn thương (huyết táo, huyết nhiệt sinh phong) — vd Vảy nến, Chàm mạn; (6) Tạng phủ gây bệnh bì phu (Can tổn thương → tà độc theo huyết phát tán; Thận tổn thương → bệnh da cơ địa/di truyền) và trùng thú len da/cắn.",
      differential:
        "Biện chứng Âm chứng/Dương chứng của sang thương: Dương chứng — màu đỏ hồng sáng tươi, sưng gồ cao khu trú, mủ đặc, đau dữ dội cự án, khởi phát cấp kèm sốt, mạch nhanh (vd Mụn nhọt, Đinh râu). Âm chứng — trắng bệch sạm tối, sưng nhẹ lan rộng, mủ loãng ở sâu, đau nhẹ âm ỉ thiện án, mạn tính, mạch hòa hoãn (vd Tràng nhạc, Loa lịch, Nham). Phân loại hình thái: Tiết chứng (mụn nhỏ — Rôm sẩy, trứng cá), Sang chứng (mụn mọng nước vỡ mủ — Chàm, Chốc lở), Đinh chứng (mụn nhỏ mủ đặc — Đinh râu, Chín mé), Lưu chú/Ung chứng (khối viêm hóa mủ dưới da), Tiễn chứng (sừng hóa dày chai — Eczema/Ngưu bì tiễn, Vảy nến/Tùng bì tiễn).",
      warnings:
        "4 thành phần chẩn đoán: Bệnh danh — Bát cương (Biểu/Lý, Hư/Thực, Hàn/Nhiệt) — Vị trí tổn thương — Nguyên nhân gây bệnh. Nếu kèm dấu hiệu sốc phản vệ/vong âm thoát dương (khó thở, tụt huyết áp) phải chuyển cấp cứu YHHĐ ngay, không chỉ điều trị bằng YHCT. Khi có chứng Sang: không cào gãi, chà xát, cậy nặn. Bài thuốc cổ phương định hướng theo đường truyền biến: Ngân kiều tán/Quế chi thang/Tiêu phong tán (lục dâm xâm phạm bì phu); Hoàng kỳ kiến trung thang/Long đởm tả Can thang (tà nhập kinh — Zona); Thanh dinh thang/Tê giác địa hoàng thang (tà nhập Dinh phát ban); Tứ vật phối hợp Tiêu phong tán/Lục vị địa hoàng thang/Thanh Can thang (huyết tổn thương — Vảy nến).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  const principleNgoai = await prisma.treatmentPrinciple.create({
    data: {
      name: "Các dạng thuốc dùng ngoài trị bệnh da (theo giai đoạn tổn thương)",
      description: "Thuốc bôi/đắp, cao đơn, thuốc xông/ngâm, bột tán rắc, thuốc rửa — mỗi dạng ứng với 1 giai đoạn/tính chất tổn thương khác nhau.",
      scope: "Ngoại khoa YHCT — bệnh ngoài da",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  await prisma.patternPrinciple.create({
    data: {
      principleId: principleNgoai.id,
      patternId: (
        await prisma.pattern.create({
          data: { name: "Dương chứng sang thương (viêm mủ cấp)", keySigns: "Sưng gồ cao khu trú, đỏ tươi, mủ đặc, đau dữ dội cự án, cấp tính kèm sốt, mạch nhanh.", status: "DRAFT", sourceId: source.id },
        })
      ).id,
    },
  });

  const formulas: { name: string; indications: string; herbs: [string, string][]; note?: string }[] = [
    {
      name: "Tứ hoàng tán",
      indications: "Thuốc bôi/đắp — mụn nhọt, chấn thương, viêm nhiễm giai đoạn đầu (bột hòa rượu bôi đắp); trị ung thương nhiệt độc viêm mủ",
      herbs: [["Hoàng liên", "1 phần"], ["Hoàng cầm", "3 phần"], ["Hoàng bá", "3 phần"], ["Đại hoàng", "3 phần"]],
    },
    {
      name: "Cao sinh cơ",
      indications: "Cao đơn (dán/đắp) — chấn thương, vết thương lâu lành cần sinh cơ, lên da non; bôi sau khi trừ mủ, chống nhiễm trùng",
      herbs: [
        ["Bạch liễm", "16g"], ["Bạch cập", "16g"], ["Bạch chỉ", "16g"],
        ["Nghệ khô", "8g"], ["Nhũ hương", "8g"], ["Một dược", "8g"], ["Phòng phong", "8g"], ["Tóc rối", "8g"],
        ["Quy vĩ", "10g"], ["Trân châu", "4g"], ["Hoàng đơn", "4g"], ["Dầu vừng", "1000g"],
      ],
      note: "Nấu cao",
    },
    {
      name: "Bảo sinh cơ",
      indications: "Bột tán rắc — Rôm sảy, Chốc lở; cầm máu, hút mủ, liền vết thương (rắc vào vết thương sau khi khô)",
      herbs: [["Thạch cao", "36g"], ["Khinh phấn", "36g"], ["Nhũ hương", "12g"], ["Hoàng đơn", "12g"], ["Một dược", "12g"], ["Long cốt", "12g"], ["Xích thạch chi", "4g"]],
    },
    {
      name: "Tứ hoàng (thang rửa)",
      indications: "Thuốc rửa — vết thương lâu liền cần làm sạch, sát khuẩn (sắc đặc rửa)",
      herbs: [["Hoàng cầm", ""], ["Hoàng liên", ""], ["Hoàng bá", ""], ["Đại hoàng", ""]],
      note: "Liều bằng nhau. Có thể thay bằng Bồ công anh + Phèn phi + Trầu không mỗi vị 200g sắc rửa.",
    },
  ];

  for (const f of formulas) {
    const formula = await prisma.formula.create({
      data: {
        name: f.name,
        origin: "cổ điển",
        indications: f.indications,
        modifications: f.note,
        status: "DRAFT",
        sourceId: source.id,
        principleId: principleNgoai.id,
      },
    });
    for (const [name, amount] of f.herbs) {
      const h = await herb(name, source.id);
      await prisma.formulaIngredient.create({ data: { formulaId: formula.id, herbId: h.id, amount: amount || undefined } });
    }
  }

  console.log("Đã thêm Đại cương bệnh ngoài da +", formulas.length, "bài thuốc dùng ngoài.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

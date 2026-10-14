// Thêm Học thuyết Thủy Hỏa (Hải Thượng Lãn Ông) + 2 bài thuốc Lục vị hoàn, Bát vị hoàn
// từ "Học thuyết Thủy Hỏa và hai bài thuốc Lục vị hoàn.docx". Đủ vị + liều (đơn vị
// "lạng" theo nguyên văn cổ phương), phân tích quân/thần/tá/sứ, công dụng, gia giảm
// (rút gọn nhưng giữ đúng ý), cấm kỵ. Không bịa thêm.
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
      title: "Học thuyết Thủy Hỏa và hai bài thuốc Lục vị hoàn, Bát vị hoàn",
      sourceType: "Bài viết lý luận + phương tễ",
      authorOrOrg: "Hải Thượng Lãn Ông (danh y VN thế kỷ XVIII) — tổng hợp/diễn giải",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: {
      name: "Giáng tâm hỏa, ích thận thủy (học thuyết Thủy Hỏa)",
      description:
        "Học thuyết Thủy Hỏa (học thuyết Tâm Thận) do Hải Thượng Lãn Ông xây dựng: thủy hỏa là chỗ hiển hiện của âm dương trong cơ thể — chân thủy, chân hỏa là gốc bẩm sinh tiên thiên do Thận làm chủ; khí huyết là ngọn, sinh từ hậu thiên do Tâm Can Tỳ Phế làm chủ. Phương châm điều hòa 2 quá trình thủy hỏa để lập lại cân bằng âm dương, tiêu tán bệnh tật.",
      goal: "Bổ thủy, bổ hỏa — dùng biến phương từ Lục vị/Bát vị để trị hơn 50 chứng, bệnh khác nhau.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  // ================= BÁT VỊ HOÀN =================
  const batVi = await prisma.formula.create({
    data: {
      name: "Bát vị hoàn",
      origin: "cổ điển (Hải Thượng Lãn Ông sử dụng)",
      preparation: "Viên với mật bằng hạt ngô đồng, mỗi lần uống 60-70 viên lúc đói, nấu nước muối làm thang mà uống; uống xong một lúc thì ăn thức ngon chặn lên.",
      indications:
        "Mệnh môn hỏa suy, tướng hỏa không đủ không sinh được thổ, đến nỗi Tỳ Vị hư hàn, hư yếu, khí kém, không thiết ăn uống, đại tiện không rắn, rốn bụng quặn đau, đêm đi đái nhiều; mạch hư nhược hoặc mạch rỗng ấn vào có lực; hỏa hư đờm thịnh; âm thịnh cách dương (trong thực hàn mà ngoài giả nhiệt). Bổ ích nguồn chân hỏa để tiêu tán mây mù trong phần âm (Vương Băng). Thích hợp khi mạch xích nhược.",
      modifications:
        "Gia giảm theo chứng (trích các trường hợp chính, không đầy đủ toàn bộ danh sách gốc): Thận hư ỉa chảy/kiết lỵ kéo dài: gia Thăng ma, Phá cố chỉ, Ngũ vị, bội Linh/Trạch, khử Mẫu đơn bì. Mạch xích trái hồng sác (âm quá thiếu): bội Thục địa. Can khí không đủ: bội Sơn thù. Tỳ Vị kém: bội Linh/Trạch. Vị hỏa nhiều (phát vàng, sốt chiều, miệng lở): giảm Trạch tả, bội Đơn bì. Can hỏa thịnh: bội Thục địa, Đơn bì. Trung khí hư hàn: khử Mẫu đơn, bội Linh/Trạch/Quế/Phụ. Cô dương bốc nổi (Thận hư không thu nạp): gia Ngưu tất, Ngũ vị tử. Dương hư tinh tổn: gia Lộc nhung, Hà xa. Thận hư thần tả (ỉa lúc mờ sáng): gia Bổ cốt chỉ, Thỏ ty. Âm dương đều hư, nóng rét qua lại: gia Sài hồ. Vừa mửa vừa ỉa: bội Đơn bì/Linh/Trạch, gia Ngũ vị, Cố chỉ. (Còn nhiều gia giảm khác theo từng chứng cụ thể trong nguồn — xem thêm nếu cần đối chiếu đầy đủ).",
      safetyNotes:
        "Cấm kỵ/lưu ý khi lập phương: không dùng Hà thủ ô làm đầu vị cùng Thục địa (hai đầu vị tranh nhau); không phối Sâm Kỳ tùy tiện (gây giằng giữ âm dương); không thêm Táo nhân/Đương quy/Bạch truật để kiêm chữa Tâm Tỳ (sai vì Thục địa+Sơn thù chuyên bổ tinh huyết ở Thận, khác cơ chế của Táo/Quy/Truật ở Tâm Tỳ, Bạch truật làm khô ráo mất sức hun nấu chân âm); không gia Tiên mao (bẩm tính không hợp); không gia Bào khương, Chích thảo (thuốc trung tiêu, phá mất tính nhu nhuận của Thục địa). Phép dùng thang tống: nước lã sôi / nước cơm sôi / rượu nóng / thang Bổ trung, Lý trung, Sinh mạch, Quy tỳ, Nhân sâm Trần mễ — tùy chứng kèm theo.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const batViHerbs: [string, string, string][] = [
    ["Thục địa", "8 lạng", "Bổ thận, điều tinh, sinh huyết — thuốc thánh bổ âm, đầu vị"],
    ["Đơn bì", "3 lạng", "Trừ nhiệt ẩn náu phần âm, tả hỏa quan tướng, lương huyết lui nhiệt, tuyên thông giúp Sơn thù cố sáp"],
    ["Bạch linh", "3 lạng", "Giúp Tỳ Vị sinh hóa nguyên, thấm thấp nhiệt ở Tỳ, thông với Thận, giao với Tâm"],
    ["Trạch tả", "3 lạng", "Lợi tiểu tiện, thanh tướng hỏa, thông cái trệ của Thục địa, dẫn thuốc mau đến Thận"],
    ["Nhục quế", "1 lạng", "Cay nhuận, bổ hỏa trong thủy, tuyên thông huyết mạch — thuốc kinh Thiếu âm"],
    ["Phụ tử", "1 lạng", "Cay nóng thuần dương, lưu thông các kinh mạch — thuốc của cả Tam tiêu"],
  ];
  // Sơn dược có nêu trong phần phân tích (giúp Bạch linh) nhưng không có trong bảng liều ở đầu bài — vẫn ghi nhận vì được phân tích công dụng rõ, không bịa liều.
  for (const [name, amount, note] of batViHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: batVi.id, herbId: h.id, amount, note } });
  }
  // Sơn thù, Sơn dược được phân tích công dụng trong bài nhưng bảng liều gốc trong file
  // nguồn bị thiếu dòng liều của 2 vị này (có thể do lỗi soạn thảo ở file gốc) — ghi nhận
  // công dụng, KHÔNG bịa liều lượng.
  {
    const h = await herb("Sơn thù", source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: batVi.id, herbId: h.id, note: "Vị chua vào Can Thận, ấm Can, đuổi phong, cố tinh ích khí — cùng Thục địa là chất nhu nhuận (liều không nêu rõ trong nguồn)" } });
  }
  {
    const h = await herb("Sơn dược", source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: batVi.id, herbId: h.id, note: "Giúp Tỳ Vị, bổ Tỳ, thanh hư nhiệt ở Phế, cố tinh bổ Thận (liều không nêu rõ trong nguồn)" } });
  }

  // ================= LỤC VỊ HOÀN =================
  const lucVi = await prisma.formula.create({
    data: {
      name: "Lục vị hoàn",
      origin: "cổ điển (Hải Thượng Lãn Ông sử dụng)",
      preparation: "Các vị tán nhỏ, trộn với Thục địa, cho mật ong vào viên bằng hạt ngô đồng, mỗi lần uống 70-80 viên với nước muối nhạt, uống khi đói, uống xong ăn thức ăn nhẹ chặn lên.",
      indications:
        "Can Thận bất túc, chân âm suy tổn, tinh khô huyết kém: lưng đau chân nhức, di tinh, ỉa ra máu, tiêu khát, lâm lịch bí đái, đờm dãi, mắt mờ/hoa, tai ù/điếc, khô cổ đau họng; Thận hư phát sốt, đổ mồ hôi/mồ hôi trộm, ỉa ra máu, mất máu; thủy hư huyết hư phát sốt, ho hen khát nước; đầu choáng váng, thổ huyết, băng huyết, rong huyết; tiểu tiện không thông lợi, mất tiếng, răng không chắc, đau răng do hư hỏa, lưỡi khô đau, gót chân đau, ghẻ lở hạ bộ, hư thũng đầu mắt; các bệnh sốt trẻ em thuộc chứng dương.",
      modifications:
        "Gia giảm theo chứng (trích các trường hợp chính): Hình thể gầy đen khô khốc: bội Thục địa, khử Trạch tả; tiểu không thông thì vẫn cần Trạch tả, gia Mạch môn/Ngũ vị. Sốt âm (chiều/đêm): bội Đơn bì; Can hỏa thịnh: gia Bạch thược, nặng gia Tri bá. Tỳ hư kém ăn: bội Bạch linh/Sơn dược, khử Đơn bì. Huyết hư âm suy: bội Thục địa/Sơn thù, gia Lộc nhung. Thận hư đau lưng mỏi gối: gia Đỗ trọng, Ngưu tất. Tinh hoạt, nhức đầu chóng mặt: bội Thục địa/Sơn thù; tinh hoạt quá gia Phá cố chỉ. Tiểu tiện bất thường: bội Phục linh/Trạch tả; kèm thấp nhiệt gia Chi tử, Mộc thông. Tâm hỏa thịnh: bội Đơn bì, gia Mộc thông. Đàn bà huyết khô kinh bế: gia Quy, Thược, Nhục quế. Trẻ em sốt các chứng: bội/khử theo hàn nhiệt (Quế Phụ, Mạch môn, Ngũ vị, Tri bá tùy mức độ). Tỳ hư đi tả/kiết lỵ kéo dài: gia Thỏ ty, Phá cố chỉ. (Còn nhiều gia giảm khác theo từng chứng cụ thể trong nguồn).",
      safetyNotes:
        "Cấm kỵ: hỏa hư, Tỳ Vị yếu dễ ỉa chảy — không nên dùng nhiều. Người chân âm thịnh, béo trắng, có sốt nóng do thổ hư không tàng được dương — cấm dùng. Đờm ở Tỳ Phế bít lấp, hoặc gây suyễn nghịch — cấm dùng. Thủy thịnh gây phát thũng trướng, dù có Linh/Tả cũng cấm dùng. 4 lỗi thường gặp khi dùng sai: không dùng đúng Thục của đất Hoài Khánh (sức thuốc kém); không chế đủ 9 lần chưng 9 lần phơi (không chín); giảm lượng Thục địa vì ngại tính nê trệ (làm vị đầu kém yếu); giảm Trạch tả (làm vị 'sứ' kém tác dụng tả). So với Bát vị: Lục vị chuyên bổ thận thủy; Bát vị bổ cả thận thủy và tướng hỏa — người trẻ thủy suy hỏa vượng nên dùng Lục vị, người già thủy hỏa đều suy nên dùng Bát vị. Phép dùng thang tống giống Bát vị hoàn (nước cơm sôi/nước lã sôi/rượu nóng/thang Bổ trung, Lý trung, Sinh mạch, Quy tỳ, Nhân sâm Trần mễ).",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const lucViHerbs: [string, string, string][] = [
    ["Thục địa", "8 lạng", "Tư âm trấn tinh — Quân"],
    ["Sơn thù", "4 lạng", "Thuốc âm Mộc, cùng Sơn dược chủ đi xuống, thu liễm — Thần"],
    ["Sơn dược", "4 lạng", "Thuốc âm Kim, làm thái âm thổ bền chắc, nguồn của thận thủy — Thần"],
    ["Mẫu đơn bì", "3 lạng", "Thanh tả Can hỏa — Tá/Sứ"],
    ["Trạch tả", "3 lạng", "Thanh tả Thận hỏa — Tá/Sứ"],
    ["Phục linh", "3 lạng", "Đạm thẩm lợi thấp — Tá/Sứ"],
  ];
  for (const [name, amount, note] of lucViHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: lucVi.id, herbId: h.id, amount, note } });
  }

  console.log("Đã thêm học thuyết Thủy Hỏa + Bát vị hoàn + Lục vị hoàn.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

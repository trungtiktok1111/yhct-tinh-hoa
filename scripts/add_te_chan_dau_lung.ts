// Thêm "Tê chân, dị cảm trong đau thắt lưng mạn tính" (ThS Võ Thanh Phong, 38 slide):
// YHHĐ (diễn tiến, can thiệp bảo tồn/xâm lấn, giai đoạn tái sinh thần kinh), YHCT
// nội trị (3 vị thuốc độc tính + liều an toàn, 6 bài thuốc đủ vị/liều dẫn nguồn
// Trung y hiện đại) và ngoại trị (6 phác đồ châm cứu/thủy châm/phúc châm). Trích
// nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}
async function point(name: string, sourceId: string) {
  let p = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!p) p = await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId } });
  return p;
}
async function makeFormula(sourceId: string, principleId: string, name: string, indications: string, herbs: [string, string?][], modifications?: string) {
  const f = await prisma.formula.create({ data: { name, origin: "hiện đại (dẫn nguồn nghiên cứu Trung y)", indications, modifications, status: "DRAFT", sourceId, principleId } });
  for (const [n, amount] of herbs) {
    const h = await herb(n, sourceId);
    await prisma.formulaIngredient.create({ data: { formulaId: f.id, herbId: h.id, amount: amount || undefined } });
  }
  return f;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Tê chân, dị cảm trong đau thắt lưng mạn tính",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Võ Thanh Phong — dẫn nhiều nghiên cứu YHHĐ và Trung y hiện đại (xem chi tiết trích dẫn trong từng mục)",
      locator: "38 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const disease = await prisma.disease.create({
    data: {
      name: "Tê chân, dị cảm trong đau thắt lưng mạn tính",
      nameModern: "Đau thần kinh tọa mạn tính / bệnh lý rễ thần kinh thắt lưng",
      definition: "Dị cảm/tê chân là triệu chứng thường kèm đau thắt lưng mạn tính do chèn ép rễ thần kinh, thường kháng trị và cần thời gian dài để đáp ứng điều trị.",
      mechanism:
        "Diễn tiến: khoảng 1/2 bệnh nhân vẫn còn vấn đề sau 12 tháng; đau chân kéo dài trên 3 tháng là yếu tố tiên lượng kém; MRI có chèn ép rễ thần kinh KHÔNG phải yếu tố tiên lượng mạnh (Konstantinou 2018). 4 giai đoạn tái sinh thần kinh: Cấp tính (phút-giờ: rối loạn dẫn truyền, Ca2+ nội bào tăng, tổn thương ty thể — ưu tiên bảo vệ thần kinh sớm, giảm chèn ép, theo dõi EMG/NCV); Bán cấp (giờ-ngày: thoái hóa Wallerian, hoạt hóa tế bào Schwann, đại thực bào dọn dẹp myelin, viêm tăng — điều hòa viêm, kiểm soát đau thần kinh); Tái sinh sớm (7-14 ngày: sợi trục mọc, Schwann cell tạo Büngner bands, M2 macrophage, VEGF/TGF-β/laminin tăng — phục hồi chức năng có kiểm soát); Tái sinh muộn (tuần-tháng: tái myelin hóa, trưởng thành sợi trục, phục hồi bản vận động — tăng sức cơ, tập thăng bằng-dáng đi).",
      warnings:
        "Can thiệp bảo tồn (Fairag 2022): Corticosteroid toàn thân (cải thiện nhẹ ngắn hạn, nhiều TDP); Gabapentin/Pregabalin (bằng chứng không chắc chắn, gây chóng mặt); BZD/TCA (cân nhắc khi đau nặng, ngắn hạn, lệ thuộc thuốc/buồn ngủ); Kéo giãn cột sống và VLTL (hỗ trợ, cần thận trọng khi chèn ép nặng/loãng xương). Nucleotides: hỗ trợ tái tạo bao myelin/sợi thần kinh nhưng bằng chứng rất thấp (Chavushyan). Can thiệp xâm lấn (Liu 2023, BMJ): phẫu thuật lấy nhân đệm giảm đau nhanh nhưng lợi ích không quá 12 tháng; tiêm corticosteroid ngoài màng cứng chỉ lợi ích ngắn hạn — điều trị bảo tồn vẫn là nền tảng ban đầu. Kết luận: luôn loại trừ tình huống cần ngoại khoa; luôn bắt đầu liệu pháp an toàn/ít TDP nhất; lựa chọn và theo dõi sát khi dùng thuốc độc tính cao (Toàn yết, Ngô công, Mã tiền tử).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: { name: "Thông lạc chỉ thống, hoạt huyết khư ứ trị tê chân/đau thần kinh tọa", status: "DRAFT", sourceId: source.id },
  });
  await prisma.diseasePattern.create({
    data: {
      diseaseId: disease.id,
      relation: "có thể gặp",
      patternId: (await prisma.pattern.create({ data: { name: "Đàm ngưng huyết ứ, khí trệ (tê chân mạn)", status: "DRAFT", sourceId: source.id } })).id,
    },
  });

  // --- 3 vị thuốc độc tính cao, cần liều/thời gian an toàn ---
  const toanYet = await herb("Toàn yết", source.id);
  await prisma.herb.update({
    where: { id: toanYet.id },
    data: {
      actions: toanYet.actions ?? "Thông lạc chỉ thống mạnh — dùng cho đau thần kinh mạn tính",
      dosage: toanYet.dosage ?? "Khởi đầu 1g, tăng dần, tối đa không quá 6g; không dùng kéo dài, ngưng khi đạt hiệu quả",
      safetyNotes: toanYet.safetyNotes ?? "Có độc tính: dị ứng, tổn thương da, gan, thận. Bào chế: hỏa chế, dùng toàn thân (không chỉ dùng đuôi); chích rượu tăng hiệu quả giảm đau. Phối Mật ong, Cam thảo giảm độc tính.",
    },
  });
  const ngoCong = await herb("Ngô công", source.id);
  await prisma.herb.update({
    where: { id: ngoCong.id },
    data: {
      dosage: ngoCong.dosage ?? "Khởi đầu 1g, tăng dần, tối đa không quá 5g (nếu tiền sử dị ứng hải sản, khởi đầu 0,5g); không dùng kéo dài, ngưng khi đạt hiệu quả",
      safetyNotes: ngoCong.safetyNotes ?? "Bào chế: sao hoặc chích rượu.",
    },
  });
  const maTienTu = await herb("Mã tiền tử", source.id);
  await prisma.herb.update({
    where: { id: maTienTu.id },
    data: {
      actions: maTienTu.actions ?? "Strychnine, brucine tăng tốc độ dẫn truyền thần kinh, giảm phù nề và giảm chèn ép thần kinh",
      dosage: maTienTu.dosage ?? "Chế Mã tiền tử mỗi lần 0,3-0,6g; liều tối đa không quá 1,2g/ngày",
      safetyNotes: maTienTu.safetyNotes ?? "Độc tính mạnh, cửa sổ điều trị rất hẹp. Bào chế: sao cát, chiên dầu, hoặc nướng.",
    },
  });

  // --- 6 bài thuốc đầy đủ vị/liều ---
  await makeFormula(source.id, principle.id, "Quyên tý kiện yêu thang",
    "Tê chân/đau lưng mạn tính (gia giảm theo nghiên cứu điều trị thoát vị đĩa đệm thắt lưng sau phẫu thuật nửa bản sống giảm áp).",
    [["Dâm dương hoắc", "15g"], ["Tang ký sinh", "12g"], ["Nữ trinh tử", "12g"], ["Xuyên ngưu tất", "12g"], ["Độc hoạt", "15g"], ["Mộc qua", "12g"], ["Ngô công", "2 con"], ["Địa long", "12g"], ["Phong phòng (tổ ong)", "15g"], ["Kê huyết đằng", "12g"], ["Xích thược", "15g"], ["Đào nhân", "10g"], ["Xuyên khung", "15g"], ["Diên hồ sách", "15g"]]
  );
  await makeFormula(source.id, principle.id, "Thân thống trục ứ thang + Chỉ mê phục linh hoàn",
    "Đàm ngưng huyết ứ (tê chân mạn tính).",
    [["Xuyên ngưu tất", ""], ["Kê huyết đằng", ""], ["Đương quy", ""], ["Xuyên khung", ""], ["Xích thược", ""], ["Đào nhân", ""], ["Huyền hồ", ""], ["Nga truật", ""], ["Thiên tiên đằng", ""], ["Xạ hương", ""], ["Bán hạ", ""], ["Trần bì", ""], ["Phục linh", ""], ["Đảm nam tinh", ""], ["Trúc nhự", ""]],
    "Đàm thấp nặng: gia Cương tàm, Bạch tật lê. Huyết ứ nặng: gia Nhũ hương (và các vị khác theo bản gốc, phần sau bị cắt trong slide)."
  );
  await makeFormula(source.id, principle.id, "Bổ dương hoàn ngũ thang (trị thoát vị đĩa đệm/hẹp ống sống thắt lưng)",
    "Thể trạng hư yếu, khí huyết hư kèm huyết ứ — thoát vị đĩa đệm/hẹp ống sống thắt lưng.",
    [["Hoàng kỳ", "60g"], ["Địa long", "9g"], ["Xích thược", "9g"], ["Đào nhân", "9g"], ["Đương quy", "15g"], ["Xuyên khung", "6g"], ["Hồng hoa", "6g"]],
    "Người cao tuổi, tỳ vị yếu: khởi đầu Hoàng kỳ liều 30g tăng dần. Thận dương hư, tay chân lạnh sợ lạnh: gia Đỗ trọng, Nhục quế, Thỏ ty tử. Thận âm hư, miệng khô ngũ tâm phiền nhiệt: gia Thiên đông, Câu kỷ tử. Huyết ứ nặng: Hoàng kỳ tăng đến 120g, gia Xuyên ngưu tất, Kê huyết đằng, Nhũ hương, Một dược, Thổ miết trùng. Khí trệ: gia Hương phụ, Chỉ xác, Lộ lộ thông. Đau lan chân: gia Ngưu tất, Hổ trượng. Đau dữ dội: gia Diên hồ sách, Khương hoàng, Tự nhiên đồng. Tê chi dưới: gia Thiên ma, Bạch cương tàm, Uy linh tiên, Hy thiêm, Quế chi, Mộc qua, Toàn yết, Ngô công, Cương tàm, Ô tiêu xà, Kim tiền bạch hoa xà. Đau tăng khi trời ẩm thấp: gia Tang chi, Thân cân thảo, Thương truật, Hổ trượng, Ý dĩ."
  );
  await makeFormula(source.id, principle.id, "Nhị ô xà yết thang (trị đau thần kinh tọa)",
    "Đau thần kinh tọa.",
    [["Chế Xuyên ô", "9g"], ["Chế Thảo ô", "6-9g"], ["Ô tiêu xà", "9g"], ["Toàn yết", "6g"], ["Ngô công", "2 con"], ["Địa long", "9g"], ["Chích ma hoàng", "6-9g"], ["Quế chi", "12g"], ["Tế tân", "6g"], ["Độc hoạt", "15g"], ["Khương hoạt", "20g"], ["Đương quy", "15g"], ["Xuyên ngưu tất", "10g"], ["Mộc qua", "20g"], ["Bạch thược", "15-30g"], ["Cam thảo", "6g"]],
    "Chế Xuyên ô, Chế Thảo ô sắc trước."
  );
  await makeFormula(source.id, principle.id, "Tứ đằng nhất tiên thang",
    "Thông kinh nhập lạc, thông 12 kinh chỉ thống.",
    [["Kê huyết đằng", "30g"], ["Câu đằng", "15g"], ["Lạc thạch đằng", "15g"], ["Hải phong đằng", "15g"], ["Uy linh tiên", "10g"], ["Mộc qua", "15g"], ["Ngưu tất", "15g"], ["Quế chi", "10g"], ["Phòng phong", "10g"], ["Độc hoạt", "10g"], ["Hải đồng bì", "10g"], ["Địa long", "10g"], ["Xuyên khung", "10g"]]
  );
  await makeFormula(source.id, principle.id, "Xuyên khung trà điều thang + Thân thống trục ứ thang (gia giảm)",
    "Đau đầu kèm đau lưng/tê chân do phong hàn kèm huyết ứ.",
    [["Xuyên khung", "20g"], ["Phòng phong", "10g"], ["Kinh giới", "10g"], ["Bạch chỉ", "10g"], ["Bạc hà", "10g"], ["Khương hoạt", "10g"], ["Mạn kinh tử", "10g"], ["Địa long", "10g"], ["Đào nhân", "6g"], ["Đan bì", "6g"], ["Quế chi", "6g"], ["Tế tân", "3g"], ["Toàn yết", "3g"], ["Hoàng kỳ", "30g"], ["Diên hồ sách", "30g"], ["Tam thất", "30g"], ["Hoài ngưu tất", ""]]
  );

  // --- Ngoại trị (châm cứu) ---
  const protocolThuongQuy = await prisma.pointProtocol.create({
    data: {
      name: "Thương quy thám huyệt (trị tê chân/đau thần kinh tọa)",
      goal: "Lưu hành kinh mạch, thông quan tiết",
      warnings: "Kim 0,35 x 75mm. Châm xiên từ các hướng trái/phải/trên/dưới theo phép 3 bộ, xuống chậm lên nhanh; mỗi lần đổi hướng cần rút kim lên da rồi mới đổi.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  for (const name of ["Hoàn khiêu", "Yêu dương quan", "Thận du", "Đại trường du"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolThuongQuy.id, pointId: (await point(name, source.id)).id } });
  }

  const protocolTrattbien = await prisma.pointProtocol.create({
    data: { name: "Yêu tứ châm (4 huyệt vùng lưng)", goal: "Giảm chèn ép rễ thần kinh", warnings: "Huyệt 1: cạnh lỗ liên hợp thần kinh tương ứng bên đau, cách ~1 thốn. Huyệt 2-3: trên và dưới huyệt 1 một khoang đốt sống. Huyệt 4: Trật biên.", status: "DRAFT", sourceId: source.id, principleId: principle.id },
  });
  await prisma.pointProtocolItem.create({ data: { protocolId: protocolTrattbien.id, pointId: (await point("Trật biên", source.id)).id } });

  const protocolKichThich = await prisma.pointProtocol.create({
    data: { name: "Kích thích dây thần kinh tọa qua huyệt", goal: "Kích thích chọn lọc theo chi phối thần kinh", status: "DRAFT", sourceId: source.id, principleId: principle.id },
  });
  const nerveMap: [string, string][] = [["Hoàn khiêu", "TK tọa"], ["Túc tam lý", "TK mác chung"], ["Ủy trung", "TK chày"], ["Tam âm giao", "TK chày"]];
  for (const [name, nerve] of nerveMap) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolKichThich.id, pointId: (await point(name, source.id)).id, note: `Chi phối: ${nerve}` } });
  }

  const protocolThongDoc = await prisma.pointProtocol.create({
    data: {
      name: "Thông đốc hoạt huyết (phác đồ chi tiết)",
      goal: "Thông đốc mạch, hoạt huyết",
      warnings:
        "Yêu bộ đốc mạch bài thích: châm dưới mỏm gai hướng lên, sâu 0,5-1 thốn, bình bổ bình tả. Kinh Bàng quang 2 đường (cách 1,5 và 3 thốn) ngang mức đốt sống bị bệnh: L1-L3 châm 1-1,5 thốn, L4-L5 châm 1,5-2 thốn. Túc tam lý 1-1,5 thốn vê kim bổ pháp. Ủy trung 1-1,5 thốn tả pháp (đạt khi tê lan chi dưới). Thận du 1-1,5 thốn, Đại trường du 1,5-2 thốn, bình bổ bình tả. Hoàn khiêu 2,5-3 thốn châm tả đến khi tê chi dưới. Dương lăng 1-1,5 thốn, Côn lôn 0,5-0,8 thốn, châm tả.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  for (const name of ["Túc tam lý", "Ủy trung", "Thận du", "Đại trường du", "Hoàn khiêu", "Dương lăng tuyền", "Côn lôn"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolThongDoc.id, pointId: (await point(name, source.id)).id } });
  }

  const protocolThuyCham = await prisma.pointProtocol.create({
    data: { name: "Thủy châm (tiêm huyệt) trị đau thần kinh tọa", goal: "Giảm đau nhanh qua tiêm huyệt", warnings: "Cách ngày hoặc mỗi ngày.", status: "DRAFT", sourceId: source.id, principleId: principle.id },
  });
  await prisma.pointProtocolItem.create({ data: { protocolId: protocolThuyCham.id, pointId: (await point("Hoàn khiêu", source.id)).id, note: "Chủ huyệt" } });
  for (const name of ["Thận du", "Túc tam lý"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolThuyCham.id, pointId: (await point(name, source.id)).id, note: "Phối huyệt" } });
  }

  const protocolPhucCham = await prisma.pointProtocol.create({
    data: {
      name: "Phúc châm (châm bụng) trị thoát vị đĩa đệm thắt lưng thứ phát đau thần kinh tọa",
      goal: "Điều khí toàn thân qua hệ huyệt bụng",
      warnings: "Khí bàng đối bên; Thần khuyết cứu ngải. Lưu kim 30 phút, hành kim mỗi 10 phút.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  for (const name of ["Thủy phân", "Quan nguyên"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolPhucCham.id, pointId: (await point(name, source.id)).id } });
  }
  for (const name of ["Ngoại lăng", "Hạ phong thấp điểm", "Hạ phong thấp hạ điểm", "Khí bàng", "Thần khuyết"]) {
    const existing = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
    const p = existing ?? (await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId: source.id } }));
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolPhucCham.id, pointId: p.id } });
  }

  console.log("Đã thêm bệnh Tê chân/dị cảm trong đau thắt lưng mạn tính + 6 bài thuốc + 6 phác đồ châm cứu + cập nhật an toàn 3 vị thuốc độc tính.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

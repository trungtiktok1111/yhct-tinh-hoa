// Thêm "Quản lý tình trạng đồng mắc trong đau thắt lưng mạn" (ThS Võ Thanh Phong,
// 47 slide): 4 bệnh đồng mắc — Béo phì, Loãng xương, Thiểu cơ, Mãn kinh — mỗi bệnh
// có YHHĐ (cơ chế, thuốc) + YHCT (bài thuốc đủ vị/liều khi có, đối dược, châm cứu).
// Trích nguyên văn, không bịa thêm; bài thuốc không có liều trong nguồn thì chỉ ghi
// tên vị không suy diễn liều.
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
async function makeFormula(sourceId: string, principleId: string, name: string, indications: string, herbs: [string, string?][], modifications?: string, preparation?: string) {
  const f = await prisma.formula.create({ data: { name, origin: "hiện đại (dẫn nguồn nghiên cứu Trung y)", indications, modifications, preparation, status: "DRAFT", sourceId, principleId } });
  for (const [n, amount] of herbs) {
    const h = await herb(n, sourceId);
    await prisma.formulaIngredient.create({ data: { formulaId: f.id, herbId: h.id, amount: amount || undefined } });
  }
  return f;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Quản lý tình trạng đồng mắc trong đau thắt lưng mạn (Béo phì, Loãng xương, Thiểu cơ, Mãn kinh)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Võ Thanh Phong — dẫn nhiều nghiên cứu YHHĐ và Trung y hiện đại",
      locator: "47 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  // ================= BÉO PHÌ =================
  const beoPhi = await prisma.disease.create({
    data: {
      name: "Béo phì (đồng mắc trong đau thắt lưng mạn)",
      definition: "BMI có liên quan nhân quả với đau thắt lưng mạn tính: tăng đau và hạn chế chức năng; giảm cân giúp giảm đau; lo âu và trầm cảm làm mạnh thêm mối liên quan.",
      mechanism: "Ảnh hưởng đa cơ chế (viêm, cơ sinh học, chuyển hóa) — xem chi tiết trích dẫn Ruiz-Fernandez 2025.",
      warnings:
        "Chiến lược tăng tuân thủ tập luyện theo rào cản: đau khi tập kéo dài → chia nhiều đợt ngắn; đau khi đi bộ/chạy → đạp xe/tập dưới nước; đau tăng sau tập → giảm khối lượng/cường độ; sợ vận động → giáo dục, tập có giám sát, đặt mục tiêu nhỏ; yếu cơ quanh khớp → tập kháng lực trước. Chuyển năng lượng sang bữa sáng (Big Breakfast Study): bữa lớn nhất ăn sớm trong ngày, bữa sáng nhiều đạm (>35g) giảm ăn đêm, cửa sổ ăn <12 giờ, lợi ích xuất hiện ngay cả khi tổng calo không giảm.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const principleBeoPhi = await prisma.treatmentPrinciple.create({
    data: { name: "Kiện tỳ hóa thấp, tiêu thực giảm cân", status: "DRAFT", sourceId: source.id },
  });
  await prisma.formula.create({
    data: { name: "Ma hoàng — Ý dĩ (đối dược giảm cân)", origin: "đối dược (nghiên cứu hiện đại)", indications: "Giảm adipogenesis, giảm cân, giảm tích tụ mỡ, hoạt hóa mô mỡ (Yu 2023, Lim 2023, Jang).", status: "DRAFT", sourceId: source.id, principleId: principleBeoPhi.id },
  });
  const beoPhiDungDuoc: [string, [string, string?][]][] = [
    ["Khí hư", [["Hoàng kỳ", "20g"], ["Thương truật", "20g"], ["Bạch truật", "10g"]]],
    ["Dương hư", [["Hà thủ ô"], ["Nhục quế"], ["Hoàng kỳ"], ["Thương truật"]]],
    ["Đàm ứ", [["Hải tảo"], ["Côn bố"]]],
    ["Trọc ứ", [["Khương hoàng"], ["Đại hoàng"], ["Bồ hoàng"], ["Sơn tra"], ["Đương quy"]]],
  ];
  for (const [co_che, herbs] of beoPhiDungDuoc) {
    await makeFormula(source.id, principleBeoPhi.id, `Dụng dược béo phì — ${co_che}`, `Béo phì, cơ chế ${co_che}`, herbs);
  }
  const beoPhiDoiDuoc: [string, string][] = [
    ["Trần bì — Phục linh", "Lý khí, trừ thấp"],
    ["Liên tử — Khiếm thực", "Kiện tỳ trừ thấp"],
    ["Sơn tra — Ý dĩ", "Tiêu thực, kiện tỳ, hóa thấp"],
    ["Cốc nha — Mạch nha", "Tỉnh tỳ, tiêu thực"],
    ["Trạch tả — Giảo cổ lam", "Kiện tỳ hóa thấp giáng trọc"],
  ];
  for (const [name, indications] of beoPhiDoiDuoc) {
    await prisma.formula.create({ data: { name, origin: "đối dược", indications, status: "DRAFT", sourceId: source.id, principleId: principleBeoPhi.id } });
  }
  const protocolBeoPhi = await prisma.pointProtocol.create({
    data: {
      name: "Châm cứu trị béo phì",
      goal: "Kiện tỳ trừ thấp, giảm cân",
      warnings: "Thủ pháp: đề sáp, niệm chuyển. Kết hợp Vy thích (vây châm) vùng bụng. Cấy chỉ: chiều dài chỉ 1cm (cơ mỏng)/2cm (cơ-mỡ dày); loại chỉ PGLA hiệu quả cao và ổn định hơn; cấy vào lớp mỡ cho hiệu quả giảm cân tốt hơn (tứ chi/lưng cấy sâu vào lớp cơ, người béo bụng cấy vào lớp mỡ); tần suất 2 tuần/lần tốt hơn 3 tuần/lần; liệu trình 3-6 tháng.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principleBeoPhi.id,
    },
  });
  for (const name of ["Trung quản", "Thủy phân", "Thiên xu", "Đại hoành", "Hoạt nhục môn", "Đới mạch", "Túc tam lý", "Thượng cự hư", "Phong long", "Âm lăng tuyền"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolBeoPhi.id, pointId: (await point(name, source.id)).id } });
  }

  // ================= LOÃNG XƯƠNG =================
  const loangXuong = await prisma.disease.create({
    data: {
      name: "Loãng xương (đồng mắc trong đau thắt lưng mạn)",
      definition: "Loãng xương đơn thuần liên quan không rõ đến đau thắt lưng nhưng liên quan giảm tốc độ đi bộ/độ dài bước chân. Gãy xẹp thân đốt sống có liên quan đau và liên quan chậm đứng lên ngồi xuống, giảm tốc độ.",
      warnings:
        "Thuốc chống loãng xương (YHHĐ, Bhadouria 2024, Paolucci 2016): Bisphosphonates (cấp+mạn, giảm đau lưng khi có biến đổi Modic/gãy xẹp); Teriparatide (cấp+mạn, bằng chứng rõ giảm đau ở phụ nữ mãn kinh loãng xương, tốt hơn khi gãy đốt sống gần đây/nguy cơ gãy); Denosumab (bằng chứng nhỏ giảm đau khi có biến đổi Modic); Raloxifene (mạn, giảm đau liên quan giảm chất P); Calcitonin (cấp, đau do gãy đốt sống, chỉ dùng ngắn hạn do TDP).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const principleLX = await prisma.treatmentPrinciple.create({ data: { name: "Bổ thận cường cốt trị loãng xương kèm đau lưng", status: "DRAFT", sourceId: source.id } });
  await makeFormula(source.id, principleLX.id, "Tế sinh thận khí thang (trị loãng xương)",
    "Loãng xương kèm đau thắt lưng (can thiệp 6 tháng).",
    [["Phụ tử chế", "15g"], ["Thục địa hoàng", "15g"], ["Nhục quế", "30g"], ["Trạch tả", "30g"], ["Xa tiền tử", "30g"], ["Phục linh", "30g"], ["Sơn dược", "30g"], ["Sơn thù du chế", "30g"], ["Xuyên ngưu tất", "15g"], ["Mẫu đơn bì", "30g"]],
    undefined, "1.500 mL nước, sắc còn 800 mL, chia uống mỗi lần 400 mL."
  );
  await makeFormula(source.id, principleLX.id, "Ôn thận tuyên tý thang",
    "Loãng xương nguyên phát có đau lưng.",
    [["Đạm phụ phiến", "10g"], ["Chế cẩu tích", "10g"], ["Sơn thù nhục", "10g"], ["Quế chi", "10g"], ["Tế tân", "6g"], ["Bạch truật", "10g (sao cám)"], ["Trạch tả", "10g"], ["Phục linh", "12g"], ["Ý dĩ nhân", "15g"], ["Mộc hương", "10g"], ["Thiên ma", "10g"], ["Cam thảo", "10g"], ["Đan sâm", "12g"], ["Xuyên khung", "10g"]]
  );
  await makeFormula(source.id, principleLX.id, "Sâm tục bổ cốt thang",
    "Loãng xương.",
    [["Thục địa", "20g"], ["Cốt toái bổ", "10g"], ["Tục đoạn", "10g"], ["Diêm bổ cốt chi", "10g"], ["Diêm cẩu tích", "10g"], ["Hoàng tinh", "15g (chế rượu)"], ["Đảng sâm", "30g (chế)"], ["Chích hoàng kỳ", "30g"], ["Tô mộc", "10g"], ["Tự nhiên đồng", "10g"], ["Can Thạch hộc", "20g"], ["Đương quy", "5g"], ["Đại táo", "20g"]],
    undefined, "1 thang/ngày x 3 tháng."
  );
  await makeFormula(source.id, principleLX.id, "Bổ thận dưỡng huyết hoạt huyết trấn thống thang",
    "Loãng xương kèm đau lưng.",
    [["Thục địa", "20g"], ["Đương quy", "20g"], ["Xuyên khung", "9g"], ["Bạch thược", "9g"], ["Câu kỷ tử", "15g"], ["Thỏ ty tử", "12g"], ["Nữ trinh tử", "15g"], ["Ba kích", "10g"], ["Cốt toái bổ", "9g"], ["Tục đoạn", "9g"], ["Đỗ trọng", "12g"], ["Tang ký sinh", "15g"], ["Ngưu tất", "10g"], ["Đan sâm", "15g"], ["Tam thất", "4.5g"], ["Chích thảo", "6g"]],
    "Hàn nặng: gia Phụ tử 10g, Quế chi 10g. Thấp nặng: gia Độc hoạt 10g, Mộc qua 15g, Ngũ gia bì 15g, Uy linh tiên 15g. Thận âm hư: gia Quy bản 15g. Thận dương hư: gia Dâm dương hoắc 15g, Nhục thung dung 15g."
  );

  // ================= THIỂU CƠ (SARCOPENIA) =================
  const thieuCo = await prisma.disease.create({
    data: {
      name: "Thiểu cơ / Sarcopenia (đồng mắc trong đau thắt lưng mạn)",
      nameModern: "Sarcopenia (tiêu chuẩn AWGS 2019)",
      definition:
        "Thiểu cơ = giảm khối lượng cơ (ASM/DEXA: nam <7 kg/m², nữ <5,4 kg/m²) + giảm sức mạnh (lực nắm tay: nam <28kg, nữ <18kg) + giảm hiệu suất thể chất (đi bộ 6m <1 m/s) (Chen LK 2020, AWGS 2019).",
      mechanism:
        "Con đường đến thừa cân người già: giảm cân chủ yếu giảm khối cơ; tăng cân chủ yếu tăng mỡ nội tạng → có thể dẫn đến béo phì kèm teo cơ (osteosarcopenic obesity). Hạn chế calorie đơn độc ở người già béo phì có thể gây: tích lũy mỡ trung tâm, phản ứng viêm, lipid trong tế bào cơ, thoái hóa protein, giảm khối cơ/sức mạnh cơ — cần can thiệp đa yếu tố (Kirk 2020) thay vì chỉ hạn chế calo.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const principleTC = await prisma.treatmentPrinciple.create({ data: { name: "Bổ khí huyết, ích Can Thận trị thiểu cơ", status: "DRAFT", sourceId: source.id } });
  await makeFormula(source.id, principleTC.id, "Địa hoàng ẩm tử (trị thiểu cơ thể Can Thận hư)",
    "Cải thiện khối cơ và sức mạnh cơ (SARC-F) ở bệnh nhân đái tháo đường kèm thiếu cơ thể Can Thận hư, sau 4 tuần can thiệp.",
    [["Can địa hoàng", "12g"], ["Ba kích", "15g"], ["Sơn thù", "15g"], ["Thạch hộc", "15g"], ["Nhục thung dung", "15g"], ["Phụ tử", "15g"], ["Ngũ vị tử", "15g"], ["Nhục quế", "15g"], ["Bạch linh", ""]],
    "Thành phần trích theo nguồn, có thể còn vị thuốc khác bị cắt trong slide gốc."
  );
  await makeFormula(source.id, principleTC.id, "Bổ trung ích khí thang (trị thiểu cơ)",
    "Giảm marker viêm (IL-6, TNF-α) ở bệnh nhân lớn tuổi có thiểu cơ.",
    [["Hoàng kỳ", "60g"], ["Thái tử sâm", "30g"], ["Đương quy", "15g"], ["Bạch truật", "15g"], ["Thăng ma", "10g"], ["Sài hồ", "10g"], ["Chỉ xác", "5g"], ["Ngũ trảo long", "30g"], ["Quy bản", "30g"], ["Lộc giác sương", "10g"], ["Tử hà xa", "10g"], ["Cam thảo", ""]],
    "Thành phần trích theo nguồn, phần cuối (Cam thảo, liều) bị cắt trong slide gốc."
  );
  const protocolThieuCo = await prisma.pointProtocol.create({
    data: { name: "Châm cứu trị thiểu cơ", goal: "Trị nuy độc thủ Dương minh, kiêm cố Tỳ Vị/Thận/khí huyết", warnings: "Hào châm, ôn châm, điện châm.", status: "DRAFT", sourceId: source.id, principleId: principleTC.id },
  });
  const thieuCoPoints: [string, string[]][] = [
    ["Dương minh", ["Khúc trì", "Hợp cốc", "Tý nhu", "Bễ quan", "Lương khâu"]],
    ["Khí huyết", ["Khí hải", "Quan nguyên", "Túc tam lý"]],
    ["Thận", ["Tam âm giao", "Thái khê", "Mệnh môn", "Yêu dương quan", "Thận du", "Can du"]],
  ];
  for (const [goal, points] of thieuCoPoints) {
    for (const name of points) {
      await prisma.pointProtocolItem.create({ data: { protocolId: protocolThieuCo.id, pointId: (await point(name, source.id)).id, note: `Mục tiêu: ${goal}` } });
    }
  }

  // ================= MÃN KINH =================
  const manKinh = await prisma.disease.create({
    data: {
      name: "Hội chứng quanh mãn kinh (đồng mắc trong đau thắt lưng mạn)",
      nameModern: "Perimenopausal syndrome",
      cause:
        "Thận tinh bất túc, Xung Nhâm thất dưỡng; Thận âm dương lưỡng hư; Tâm Thận bất giao; Can uất.",
      mechanism:
        "Thay đổi thành phần cơ thể: tăng mỡ nội tạng → tăng adipocytokine/cytokine tiền viêm, tăng nguy cơ ung thư vú/đại tràng/nội mạc tử cung; giảm SHBG do thiếu estrogen → phân bố mỡ về bụng; giảm hoạt động thể chất + thiếu cơ. Thay đổi hệ cơ xương khớp: giảm estrogen → giảm ức chế RANKL → tăng số lượng/hoạt tính/tuổi thọ hủy cốt bào → tăng tái hấp thu xương → loãng xương; estrogen vốn ức chế cytokine hủy xương IL-1, TNF-α; giảm hấp thu canxi ruột theo tuổi, giảm tổng hợp vitamin D3 ở thận. Thay đổi nhận thức: khó tìm từ, giảm trí nhớ ngắn hạn, suy giảm giải quyết vấn đề — hậu quả trực tiếp suy giảm estrogen, thứ phát do giấc ngủ kém/thay đổi tâm trạng; tạm thời, hồi phục sau mãn kinh, không nên coi là dấu hiệu báo trước sa sút trí tuệ (Davis 2023).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const manKinhPatterns: [string, string][] = [
    ["Thận tinh bất túc, Xung Nhâm thất dưỡng (mãn kinh)", "Bổ thận ích tinh, tư dưỡng Xung Nhâm"],
    ["Thận âm dương lưỡng hư (mãn kinh)", "Ôn thận bổ dương, tư âm giáng hỏa, kết hợp điều chỉnh tình chí"],
    ["Tâm Thận bất giao (mãn kinh)", "Tư thận dưỡng âm, thanh tâm an thần"],
    ["Can uất (mãn kinh)", "Sơ Can giải uất, tư âm thanh nhiệt"],
  ];
  for (const [patName, princName] of manKinhPatterns) {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: princName, status: "DRAFT", sourceId: source.id } });
    const pattern = await prisma.pattern.create({ data: { name: patName, status: "DRAFT", sourceId: source.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: manKinh.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
  }
  const principleMK = (await prisma.treatmentPrinciple.findFirst({ where: { name: "Bổ thận ích tinh, tư dưỡng Xung Nhâm" } }))!;
  await prisma.formula.create({
    data: {
      name: "Ôn thận phục quý phương",
      origin: "kinh nghiệm hiện đại (Lưu Tổ Trường)",
      indications: "Hội chứng quanh mãn kinh — pháp ôn thận ích tinh.",
      modifications:
        "Dương hư: tăng Thỏ ty tử, Thục địa, thêm Dâm dương hoắc, Ba kích. Âm hư: Can địa hoàng thay Thục địa, thêm Nhị chí hoàn, Quy giáp. Đạo hãn: thêm Hạn liên thảo, Địa cốt bì, Phù tiểu mạch. Loãng xương, đau lưng: thêm Tục đoạn, Đỗ trọng, Đan sâm. Mất ngủ: thêm Toan táo nhân, Dạ giao đằng, Trân châu mẫu. Mặt đỏ, bốc hỏa, đổ mồ hôi: thêm Tiên mao, Hoàng bá.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principleMK.id,
    },
  }).then(async (f) => {
    for (const name of ["Thỏ ty tử", "Phúc bồn tử", "Câu kỷ tử", "Thục địa", "Sơn dược", "Sơn thù", "Hoàng bá", "Tiên mao", "Long cốt", "Mẫu lệ"]) {
      const h = await herb(name, source.id);
      await prisma.formulaIngredient.create({ data: { formulaId: f.id, herbId: h.id } });
    }
  });
  const manKinhDoiDuoc: [string, string][] = [
    ["Tiên mao, Tiên linh tỳ", "Bổ thận dương"],
    ["Tử hà xa, Thục địa", "Bổ thận tinh"],
    ["Nữ trinh tử, Hoàng tinh", "Dưỡng thận âm"],
    ["Đương quy, Kê huyết đằng", "Dưỡng can huyết"],
    ["Mai khôi hoa, Uất kim", "Sơ can lý khí"],
    ["Hoài tiểu mạch, Linh chi", "An thần"],
    ["Trúc diệp, Chi tử", "Thanh tâm hỏa"],
    ["Bạch truật, Phục linh", "Kiện tỳ khí"],
    ["Đơn bì, Chi tử", "Tả hỏa giải uất"],
    ["Đương quy, Bạch thược", "Dưỡng huyết nhu can"],
  ];
  for (const [name, indications] of manKinhDoiDuoc) {
    await prisma.formula.create({ data: { name, origin: "đối dược", indications, status: "DRAFT", sourceId: source.id, principleId: principleMK.id } });
  }

  console.log("Đã thêm 4 bệnh đồng mắc (Béo phì, Loãng xương, Thiểu cơ, Mãn kinh) với bài thuốc, đối dược, châm cứu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

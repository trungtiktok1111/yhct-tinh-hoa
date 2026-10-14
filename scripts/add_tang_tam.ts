// Thêm "Tạng Tâm" (BSNT Đinh Thị Lan Hương, 25 slide) vào Lý luận cơ bản +
// các bài thuốc điều trị bệnh Tâm (Formula + FormulaIngredient). Các Pattern
// (Tâm khí hư, Tâm dương hư, Tâm huyết hư, Tâm âm hư, Đàm mê tâm khiếu) đã tồn
// tại từ các batch trước nên không tạo lại — chỉ bổ sung Formula điều trị.
// Liều lượng không được nêu trong nguồn nên không bịa, chỉ ghi "liều không nêu
// rõ trong nguồn".
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreateHerb(
  sourceId: string,
  name: string,
  natureFlavor?: string,
  actions?: string
) {
  const existing = await prisma.herb.findFirst({
    where: { standardName: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    const data: Record<string, string> = {};
    if (!existing.natureFlavor && natureFlavor) data.natureFlavor = natureFlavor;
    if (!existing.actions && actions) data.actions = actions;
    if (Object.keys(data).length > 0) {
      await prisma.herb.update({ where: { id: existing.id }, data });
    }
    return existing.id;
  }
  const created = await prisma.herb.create({
    data: { standardName: name, natureFlavor, actions, status: "DRAFT", sourceId },
  });
  return created.id;
}

async function createFormula(
  sourceId: string,
  name: string,
  origin: string | undefined,
  indications: string,
  ingredients: { name: string; natureFlavor?: string; actions?: string }[]
) {
  const existing = await prisma.formula.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    console.log(`Bỏ qua (Formula đã tồn tại): ${name}`);
    return;
  }
  const formula = await prisma.formula.create({
    data: { name, origin, indications, status: "DRAFT", sourceId },
  });
  for (const ing of ingredients) {
    const herbId = await findOrCreateHerb(sourceId, ing.name, ing.natureFlavor, ing.actions);
    await prisma.formulaIngredient.create({
      data: {
        formulaId: formula.id,
        herbId,
        note: "Liều lượng không nêu rõ trong nguồn",
      },
    });
  }
  console.log(`Đã thêm Formula: ${name}`);
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Tạng Tâm",
      sourceType: "Bài giảng",
      authorOrOrg: "BSNT. Đinh Thị Lan Hương",
      locator: "25 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Tượng — khái niệm Tạng/Phủ/Phủ kỳ hằng",
      category: "Tạng tượng",
      summary: "Tạng tượng = kết cấu hình thái (Tạng/Tàng = ẩn tàng) + hiện tượng biểu hiện ra ngoài (Tượng). Phân 3 loại: Ngũ tạng (hóa sinh tàng trữ tinh-khí-thần-huyết-tân dịch), Lục phủ (thu nạp chuyển hóa thủy cốc), Phủ kỳ hằng (hình rỗng như phủ nhưng tàng trữ như tạng).",
      content:
        "Hàm nghĩa Tạng tượng: dựa trên cơ sở giải phẫu cơ bản — 'Tạng' (= Tàng trong y văn cổ) nghĩa là ẩn tàng; 'Tượng' vừa là kết cấu hình thái của cơ quan tạng phủ, vừa là hiện tượng biểu hiện ra bên ngoài. Nội dung học thuyết Tạng tượng: nghiên cứu kết cấu hình thái và quy luật hoạt động sinh lý/biến hóa bệnh lý của cơ quan, tổ chức; theo quan niệm chỉnh thể lấy Ngũ tạng làm trung tâm — hoạt động sống của cơ thể lấy Tâm làm thống trị, Ngũ tạng làm trung tâm, phối hợp Lục phủ, Tinh-Khí-Thần-Huyết-Tân dịch làm cơ sở; quan hệ sinh lý/bệnh lý còn chịu tác động của khí hậu, âm dương. " +
        "Khái niệm Tạng phủ: cách gọi chung các cơ quan trong cơ thể, chia 3 loại — Ngũ tạng (Tâm, Can, Tỳ, Phế, Thận): hóa sinh và tàng trữ vật chất tinh vi như tinh, khí, thần, huyết, tân dịch để duy trì hoạt động sống. Lục phủ (Đởm, Vị, Tiểu trường, Đại trường, Tam tiêu — và Bàng quang theo cách phân loại kinh điển khác): thu nạp, chuyển hóa thủy cốc ra tinh khí đưa đến các tạng. Phủ kỳ hằng (Kỳ = dị thường; Hằng = thường có): gồm Não, Tủy, Cốt, Mạch, Đởm, Tử cung — hình thái chủ yếu rỗng giống Phủ, nhưng công năng tàng trữ tinh khí giống Tạng nên gọi 'kỳ hằng'; Đởm vốn thuộc Lục phủ nhưng vì tàng trữ tinh chất dịch mật nên cũng thuộc Phủ kỳ hằng.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Tâm — Tâm chủ huyết mạch và Tâm chủ Thần chí (chi tiết cơ chế)",
      category: "Tạng tượng",
      summary: "Tâm chủ huyết mạch cần 2 điều kiện (hình chất Tâm không tổn thương, dương khí Tâm mạnh); Tâm chủ Thần chí — Thần là biểu hiện tổng thể hoạt động sinh mệnh, có quan hệ Tâm-Não ('Tâm não đồng trị': Não là phủ của nguyên thần nhưng Tâm chủ huyết nuôi Não).",
      content:
        "KHÁI NIỆM TẠNG TÂM: nằm trong lồng ngực, có Tâm bào lạc che chở; là tạng Dương trong Dương; quan hệ biểu lý với Tiểu trường; thuộc hành Hỏa, ứng mùa Hạ; là chủ/thống trị của các tạng phủ. Công năng: chủ huyết mạch (vinh nhuận ra mặt), khai khiếu ra lưỡi, tàng Thần (chủ thần minh, tư duy, ý thức). " +
        "TÂM CHỦ HUYẾT MẠCH: Tâm chủ huyết quản và thúc đẩy huyết dịch vận hành trong mạch (chủ huyết + chủ mạch). Tạng Tâm có nhịp đập theo quy luật, huyết quản tương thông với Tâm cũng theo đó tạo nhịp đập → mạch bác (mạch đập). Điều kiện: hình chất của Tâm không bị tổn thương, dương khí của Tâm phải mạnh mẽ. Tác dụng: (1) hành huyết để vận chuyển vật chất dinh dưỡng; (2) sinh huyết — huyết dịch không ngừng được bổ sung. " +
        "TÂM CHỦ THẦN CHÍ: chủ thần chí tức Tâm chủ thần minh → Tâm tàng Thần. Thần là toàn thể biểu hiện bên ngoài của hoạt động sinh mệnh (hình tượng, sắc diện, ánh mắt, ngôn ngữ, ứng đáp, tư thái hoạt động cơ thể) — là công dụng/cơ năng của hình thể; Thần do tinh khí tiên thiên và được bổ sung bởi tinh khí hậu thiên. Tác dụng: chủ tư duy/ý thức/tinh thần (tiếp nhận và phản ánh sự vật khách quan ngoại giới, tiến hành hoạt động tư duy); là chủ tể hoạt động sinh mệnh. Tâm vận chuyển huyết dịch dinh dưỡng toàn thân nên chủ hoạt động sinh mệnh — rối loạn Tâm thì thần chí thay đổi. " +
        "QUAN HỆ TÂM - NÃO: Não là 'tủy hải', tủy sinh từ Tinh. Sự suy nghĩ nhanh nhạy, trí nhớ, tư duy ngôn ngữ, nhìn/nghe/ngửi đều do Não làm chủ → Não là 'phủ của nguyên thần'. Tâm chủ huyết, huyết đi lên giúp nuôi dưỡng Não → Tâm và Não có quan hệ mật thiết với nhau, gọi là 'Tâm não đồng trị'. Hoạt động tinh thần, ý thức, tư duy của con người đều thuộc công năng sinh lý của đại não. " +
        "ĐẶC TÍNH SINH LÝ: Tâm là tạng Dương, chủ dương khí — là 'thái dương trong dương', lấy dương khí làm dụng; dương khí của Tâm thúc đẩy huyết dịch tuần hoàn, duy trì hoạt động sinh mệnh. Tâm khí tương thông với khí mùa Hạ (Tâm ứng mùa Hạ, phương Nam, Nhiệt, Hỏa, vị đắng, màu đỏ) — vì Tâm là dương tạng nên công năng mạnh nhất, vượng thịnh nhất vào mùa Hạ. " +
        "Quan hệ với hình-khiếu-chi-tân dịch: Tâm biểu hiện ra mặt, khai khiếu ra lưỡi, vinh nhuận ra mặt; Vui mừng là tình chí của Tâm; Mồ hôi là dịch liên quan đến Tâm; quan hệ biểu lý với Tiểu trường; được Tâm bào lạc bảo vệ.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  // --- Bài thuốc điều trị bệnh Tâm (Formula) ---
  await createFormula(
    sid,
    "Tứ Quân tử thang gia giảm (trị Tâm khí hư)",
    "Cục phương, gia giảm",
    "Tâm khí hư: trống ngực, thở ngắn, tự ra mồ hôi, sắc mặt xanh xao, mệt mỏi, lưỡi nhợt mềm bệu, mạch hư vô lực. Pháp trị: Bổ ích Tâm khí.",
    [
      { name: "Nhân sâm" },
      { name: "Phụ tử chế" },
      { name: "Phục linh" },
      { name: "Viễn chí" },
      { name: "Bạch truật" },
      { name: "Đại táo" },
      { name: "Bá tử nhân" },
      { name: "Cam thảo" },
    ]
  );

  await createFormula(
    sid,
    "Chân vũ thang (trị Tâm dương hư)",
    undefined,
    "Tâm dương hư: sợ lạnh, thích uống nước ấm, đau bụng, tiêu chảy, tự hãn, tay chân lạnh, phù nề, đau vùng ngực, hồi hộp. Nặng hơn (Tâm dương hư thoát): ra mồ hôi không ngừng, chân tay quyết lạnh, môi xanh tím. Pháp trị: Ôn thông Tâm dương; Hồi dương cứu nghịch (khi thoát).",
    [
      { name: "Nhân sâm" },
      { name: "Phụ tử chế" },
      { name: "Đương quy" },
      { name: "Đan sâm" },
      { name: "Nhục quế" },
      { name: "Nhục thung dung" },
      { name: "Ba kích" },
    ]
  );

  // Huyết phủ trục ứ thang (Y Lâm cải thác) đã tồn tại trong DB từ các batch
  // trước (dùng cho Tâm huyết ứ trệ cũng như các bệnh huyết ứ khác) — không
  // tạo lại để tránh trùng lặp Formula, chỉ xác nhận chỉ định này qua
  // TheoryTopic/Pattern Tâm huyết uất trệ ở trên.

  await createFormula(
    sid,
    "Thiên vương bổ tâm đan (trị Tâm huyết hư)",
    undefined,
    "Tâm huyết hư: sắc mặt xanh, môi nhợt nhạt, hồi hộp, dễ kinh sợ, hoa mắt chóng mặt, mất ngủ hay quên, lưỡi nhợt bệu, mạch sác vô lực. Pháp trị: Dưỡng Tâm huyết, an Thần.",
    [
      { name: "Sinh địa", natureFlavor: "Ngọt, đắng, hàn", actions: "Dưỡng âm, dưỡng huyết" },
      { name: "Huyền sâm", natureFlavor: "Đắng, mặn, hơi lạnh", actions: "Thanh nhiệt, dưỡng huyết, giải độc, giáng hỏa" },
      { name: "Đan sâm", natureFlavor: "Đắng, lạnh", actions: "Hoạt huyết, khử ứ" },
      { name: "Đương quy", natureFlavor: "Ngọt, cay, ấm", actions: "Bổ huyết, hành huyết" },
      { name: "Đảng sâm", natureFlavor: "Ngọt, bình", actions: "Bổ dưỡng Tỳ, Vị" },
      { name: "Phục linh", natureFlavor: "Ngọt, bình", actions: "Bổ Tỳ thổ, định Tâm, lợi thủy" },
      { name: "Bá tử nhân", natureFlavor: "Ngọt, bình", actions: "Bổ huyết, kiện Tỳ, an Thần" },
      { name: "Viễn chí", natureFlavor: "Đắng, ấm", actions: "Bổ Tâm, Thận, an Thần" },
      { name: "Thiên môn", natureFlavor: "Ngọt, lạnh", actions: "Thanh Tâm nhiệt, giáng Phế hỏa" },
      { name: "Mạch môn", natureFlavor: "Ngọt, đắng, lạnh", actions: "Nhuận Phế, sinh tân dịch" },
      { name: "Ngũ vị tử", natureFlavor: "Mặn, chua, ấm", actions: "Liễm hãn, cố tinh" },
      { name: "Toan táo nhân", natureFlavor: "Ngọt, chua, bình", actions: "Dưỡng Tâm an Thần, sinh tân dịch" },
      { name: "Cát cánh", natureFlavor: "Đắng, cay, ấm", actions: "Điều hòa các vị thuốc" },
      { name: "Chu sa", natureFlavor: "Ngọt, lạnh", actions: "An Thần, trấn kinh, dẫn thuốc vào Tâm" },
    ]
  );

  await createFormula(
    sid,
    "Bá tử dưỡng tâm hoàn (trị Tâm âm hư)",
    "Thể nhân hội thiên",
    "Tâm âm hư: cảm giác nóng trong người, sốt về chiều/đêm, mặt đỏ, tay chân nóng, tâm quý chính xung, mất ngủ hay mê, bứt rứt, họng khô, ngũ tâm phiền nhiệt, mạch tế sác vô lực. Pháp trị: Tư dưỡng Tâm âm, an Thần; tư âm giáng hỏa, tiềm dương an Thần.",
    [
      { name: "Bá tử nhân", natureFlavor: "Ngọt, bình", actions: "Bổ huyết, kiện Tỳ, an Thần" },
      { name: "Câu kỷ tử", natureFlavor: "Ngọt, bình", actions: "Bổ Can, Thận" },
      { name: "Mạch môn", natureFlavor: "Ngọt, đắng, lạnh", actions: "Nhuận Phế, sinh tân" },
      { name: "Đương quy", natureFlavor: "Ngọt, cay, ấm", actions: "Bổ huyết, hành huyết" },
      { name: "Thạch xương bồ", natureFlavor: "Cay, đắng, ấm", actions: "Khai khiếu hóa đàm, giải độc, tán phong" },
      { name: "Phục thần", actions: "Tiết tâm nhiệt, bình ổn tâm Thần" },
      { name: "Huyền sâm", natureFlavor: "Đắng, mặn, hơi lạnh", actions: "Thanh nhiệt, lương huyết, giải độc, giáng hỏa" },
      { name: "Thục địa", natureFlavor: "Ngọt, ấm", actions: "Bổ huyết, dưỡng âm" },
      { name: "Cam thảo", actions: "Điều hòa các vị thuốc" },
    ]
  );

  await createFormula(
    sid,
    "Mông thạch cổn đờm hoàn (trị Đàm hỏa nhiễu tâm)",
    "Ngọc ẩn Quân phương, Đan khê tâm pháp",
    "Đàm hỏa nhiễu Tâm: vật vã mất ngủ, miệng đắng họng khô, lưỡi đỏ rêu trắng dày, cười nói huyên thuyên, thao cuồng, mạch hoạt hữu lực. Pháp trị: Thanh Tâm tả hỏa, trừ đàm khai khiếu.",
    [
      { name: "Mông thạch", actions: "Trục lão đàm tích tụ" },
      { name: "Trầm hương", natureFlavor: "Cay, ấm", actions: "Thăng giáng các khí, bổ nguyên dương, hạ đàm" },
      { name: "Hoàng cầm", natureFlavor: "Đắng, lạnh", actions: "Tả Phế, thanh Tâm" },
      { name: "Đại hoàng", natureFlavor: "Đắng, lạnh", actions: "Tả nhiệt, khử trừ thực tích" },
    ]
  );

  await createFormula(
    sid,
    "Tô hợp hoàn (trị Đàm mê tâm khiếu)",
    undefined,
    "Đàm mê tâm khiếu: tinh thần đần độn, cười nói một mình, đột nhiên ngã lăn, đờm khò khè, rêu trắng dày, mạch huyền hoạt. Pháp trị: Trừ đàm khai khiếu.",
    [
      { name: "Bạch truật", natureFlavor: "Ngọt, đắng, ấm", actions: "Kiện Tỳ Vị, táo thấp, phù chính khí" },
      { name: "Mộc hương", natureFlavor: "Cay, đắng, ấm", actions: "Hành khí, chỉ thống, kiện Tỳ" },
      { name: "Tê giác", natureFlavor: "Đắng, mát", actions: "Thanh Tâm giải độc" },
      { name: "Hương phụ", natureFlavor: "Cay, đắng, ấm", actions: "Hành khí, giải uất" },
      { name: "Chu sa", natureFlavor: "Ngọt, lạnh", actions: "An Thần, trấn kinh, giải độc" },
      { name: "Kha tử", natureFlavor: "Đắng, chua, sáp, ấm", actions: "Liễm Phế" },
      { name: "Bạch đàn hương", actions: "Điều hòa tạng phủ khí huyết uất trệ" },
      { name: "Đinh hương", natureFlavor: "Cay, thơm, nóng", actions: "Ấm Tỳ Vị, giáng nghịch khí, giảm đau" },
      { name: "Xạ hương", natureFlavor: "Cay, ấm", actions: "Khai khiếu, thông kinh lạc, trừ uế" },
      { name: "Tất bát", natureFlavor: "Cay, ấm", actions: "Điều hòa tạng phủ" },
      { name: "An tức hương", actions: "Tránh uế ác khí" },
      { name: "Long não", natureFlavor: "Vị the, ấm", actions: "Tránh uế khí, ác khí, trúng phong" },
      { name: "Dầu Tô hợp hương", actions: "Tránh uế khí" },
      { name: "Nhũ hương", natureFlavor: "Đắng, cay, hơi ấm", actions: "Điều khí, hoạt huyết" },
    ]
  );

  console.log("Hoàn tất xử lý Tạng Tâm (2 TheoryTopic + các Formula điều trị).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

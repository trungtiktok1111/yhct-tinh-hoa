// Nguồn: "Các liệu pháp thuốc dùng ngoài trong điều trị thoái hóa khớp" - Ts.Bs Nguyễn Lê Việt Hùng,
// Khoa YHCT ĐHYD TP.HCM (60 trang). Phần YHHĐ (NSAIDs/Capsaicin/Salicylate bôi ngoài) chỉ có nội dung
// tổng quát không đủ chi tiết lâm sàng riêng để tách thành Disease/Pattern; phần YHCT có các vị thuốc
// dùng ngoài cụ thể (có TVQK, công năng, cách dùng trích Dược điển VN5/Đỗ Tất Lợi) — đưa vào Herb. Các
// vị thuốc đã có sẵn trong DB (Hoạt thạch, Long não, Tô mộc, Hoàng liên, Nghệ/Nghệ khô, Quế, Thiên niên
// kiện, Bạc hà, Sinh khương, Ngải diệp) không tạo lại, chỉ tạo mới 5 vị chưa có. 1 TheoryTopic tổng quan
// nguyên tắc/dạng bào chế thuốc dùng ngoài (category "Dưỡng sinh - Dinh dưỡng" không phù hợp — dùng
// "Bát pháp - Nguyên tắc điều trị" vì đây là nguyên tắc trị liệu ngoại trị). 2 Formula cụ thể có đủ thành
// phần/liều lượng từ Đỗ Tất Lợi được tạo; các tổ hợp cao dán/rượu xoa bóp liệt kê tên vị không kèm liều
// lượng trong nguồn — không bịa thêm liều, chỉ ghi nhận dạng danh mục trong modifications.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let source = await prisma.source.findFirst({
    where: { title: { contains: "Các liệu pháp thuốc dùng ngoài trong điều trị thoái hóa khớp", mode: "insensitive" } },
  });
  if (!source) {
    source = await prisma.source.create({
      data: {
        title: "Các liệu pháp thuốc dùng ngoài trong điều trị thoái hóa khớp",
        authorOrOrg: "Ts.Bs. Nguyễn Lê Việt Hùng, Khoa Y học cổ truyền - Đại học Y Dược TP.HCM",
        sourceType: "Tài liệu giảng dạy",
        locator: "60 trang",
      },
    });
  }

  // ===== HERB (5 vị thuốc dùng ngoài chưa có trong DB) =====
  const herbs: {
    standardName: string;
    aliases?: string;
    latinName?: string;
    partUsed?: string;
    natureFlavor?: string;
    meridians?: string;
    actions: string;
    indications: string;
    dosage?: string;
    safetyNotes?: string;
  }[] = [
    {
      standardName: "Phèn chua",
      aliases: "Minh phàn; khô phàn (dạng nung xốp); phàn chi; bạch phàn",
      latinName: "Alumen",
      partUsed: "Muối kép nhôm sunfat và kali (K2SO4.Al2(SO4)3.24H2O), khoáng vật thiên nhiên hoặc chế",
      natureFlavor: "Vị chua, tính lạnh (hàn), không độc",
      meridians: "Tỳ",
      actions:
        "Táo thấp, giải độc, sát trùng, làm hết ngứa; thu liễm, cầm máu. Dạng rang xốp (phèn phi/khô phàn) dùng ngoài không kể liều lượng.",
      indications:
        "Dùng ngoài: thấp chẩn (eczema), thấp sang (lở loét), rôm sảy, chàm, chốc đầu, ngoài da do thấp; làm thuốc chữa đau răng, đau mắt, lỵ (chế luyện). Dùng trong: chữa có nhiệt trong xương tủy, thịt mọc trong mũi, cầm máu (ho ra máu, các loại xuất huyết).",
      dosage:
        "Uống: 0,3-1g khô phàn/ngày, có thể tới 2-4g. Dùng ngoài: không kể liều lượng (theo Đỗ Tất Lợi).",
    },
    {
      standardName: "Vỏ Xoan (Sầu đâu)",
      aliases: "Sầu đâu; xoan trắng; xuyên luyện; khổ luyện; đốc hiên",
      latinName: "Melia azedarach L. (họ Xoan - Meliaceae)",
      partUsed: "Vỏ thân, lá",
      natureFlavor: "Vị đắng, tính hàn",
      meridians: "Tỳ, Vị, Can",
      actions:
        "Thuốc có độc. Theo Nhật hoa tử bản thảo: trị du phong nhiệt độc, phong chẩn, ác sang giới lại, tiểu nhi tràng nhiệt (nấu nước ngâm rửa). Xuyên luyện tố (Toosendanin) là thành phần chủ yếu diệt giun đũa, tác dụng chậm nhưng kéo dài hơn Santonin. Nước sắc vỏ Xoan đậm (25-50%) in vitro làm tê liệt giun kim ở chuột; ức chế một số nấm ngoài da (nước sắc vỏ xoan 4ml=1g vỏ xoan ức chế một số vi trùng bệnh ngoài da, theo Trung Hoa bì phu khoa tạp chí 1957).",
      indications: "Dùng ngoài: nấu nước ngâm rửa trị các bệnh ngoài da, phong chẩn, lở loét.",
      safetyNotes: "Thuốc có độc — thận trọng khi dùng, đặc biệt đường uống.",
    },
    {
      standardName: "Mỏ quạ",
      aliases: "Hoàng lồ; vàng lồ; xuyên phá thạch",
      latinName: "Cudrania tricuspidata (Carr.) Bur. Corner (họ Dâu tằm - Moraceae)",
      partUsed: "Lá tươi",
      actions:
        "Dùng tươi giã nhỏ đắp vào vết thương phần mềm theo kinh nghiệm dân gian: làm sạch vết thương, tăng tổ chức hạt, chóng lên da non.",
      indications: "Vết thương phần mềm lâu lành.",
      dosage:
        "Lá Mỏ quạ tươi rửa sạch, bỏ cuống, giã nhỏ đắp vào vết thương (nếu vết thương xuyên thủng thì đắp cả hai bên, băng lại), mỗi ngày rửa và thay băng 1 lần. Phối hợp thuốc rửa: lá trầu không 40g nấu với 2 lít nước, để nguội, thêm Phèn phi 8g, hòa tan, lọc, dùng rửa vết thương; sau 3-5 ngày đỡ thì 2 ngày rửa/thay băng 1 lần (theo kinh nghiệm dân gian, trích Đỗ Tất Lợi).",
    },
    {
      standardName: "Lá lốt",
      natureFlavor: "Tính ấm, vị cay",
      actions:
        "Trừ hàn, giảm đau. Chứa hoạt chất kháng khuẩn tự nhiên giúp bảo vệ khớp khỏi nhiễm trùng. Giảm viêm, sưng đau khớp.",
      indications: "Đau nhức xương khớp, sưng viêm khớp — dùng ngoài dạng đắp/xoa.",
    },
    {
      standardName: "Địa liền",
      latinName: "Kaempferia galanga",
      actions: "Hoạt huyết, tán ứ, giảm đau; giúp hành khí.",
      indications: "Đau nhức xương khớp — phối hợp trong cao dán và rượu xoa bóp dùng ngoài.",
    },
  ];

  for (const h of herbs) {
    const existing = await prisma.herb.findFirst({ where: { standardName: { equals: h.standardName, mode: "insensitive" } } });
    if (existing) {
      console.log(`ĐÃ TỒN TẠI, bỏ qua: ${h.standardName}`);
      continue;
    }
    await prisma.herb.create({ data: { ...h, sourceId: source.id } });
    console.log(`Đã tạo Herb: ${h.standardName}`);
  }

  // ===== TheoryTopic tổng quan =====
  const topicName = "Nguyên tắc và dạng bào chế thuốc dùng ngoài (ngoại trị) trong thoái hóa khớp";
  const existingTopic = await prisma.theoryTopic.findFirst({ where: { name: { equals: topicName, mode: "insensitive" } } });
  if (!existingTopic) {
    await prisma.theoryTopic.create({
      data: {
        name: topicName,
        category: "Bát pháp - Nguyên tắc điều trị",
        summary:
          "Vai trò, cơ chế, ưu-nhược điểm của thuốc dùng ngoài (YHHĐ: NSAIDs/Capsaicin/Salicylate; YHCT: các dạng bào chế ngoại trị) trong điều trị thoái hóa khớp.",
        content:
          "Thoái hóa khớp là bệnh lý mạn tính gây tổn thương sụn khớp và xương dưới sụn, thường gặp ở người lớn tuổi; yếu tố nguy cơ gồm tuổi tác, cân nặng, di truyền. Theo YHCT, thoái hóa khớp thuộc phạm vi chứng Tý, do phong - hàn - thấp xâm nhập gây bế tắc kinh lạc. Triệu chứng: đau khớp (triệu chứng chính), cứng khớp buổi sáng, có thể kèm sưng nóng tại khớp, hạn chế vận động. Chẩn đoán: khám lâm sàng, X-quang (đánh giá tổn thương xương khớp), MRI (chi tiết mô mềm). Hướng điều trị: điều trị triệu chứng, điều trị nguyên nhân, điều trị biến chứng; kết hợp Đông Tây y gồm điều trị không dùng thuốc và điều trị dùng thuốc (đường uống, dùng ngoài).\n\nCác nhóm thuốc dùng ngoài YHHĐ phổ biến: NSAIDs (Diclofenac, Ibuprofen, Ketoprofen — giảm đau và viêm hiệu quả, cơ chế ức chế COX-1 và COX-2, giảm sản xuất prostaglandin gây viêm, dạng gel/kem/miếng dán); Capsaicin (chiết xuất từ ớt, giảm đau bằng cách kích thích và làm cạn kiệt chất P — chất trung gian hóa học chính của xung động đau từ ngoại biên đến trung ương, tác động lên thụ thể cảm giác đau TRPV1); Salicylate (Methyl salicylate — giảm đau nhẹ, kháng viêm nhẹ, tăng lưu thông máu tại chỗ); thuốc khác (Menthol, Camphor, tinh dầu thảo dược). Cơ chế chung: thuốc hấp thu qua da và tác động tại chỗ nhanh chóng, ảnh hưởng các chất trung gian gây viêm (Prostaglandin, Cytokine).\n\nƯu điểm thuốc bôi ngoài: giảm tác dụng phụ toàn thân, dễ sử dụng tiện lợi, tác dụng nhanh tại chỗ. Hạn chế: hiệu quả có thể thấp hơn thuốc uống, gây kích ứng da tại chỗ, có thể tương tác với thuốc khác. Tác dụng phụ: tại chỗ (kích ứng da, ngứa, đỏ — thường gặp), toàn thân (ít gặp, có thể ảnh hưởng tiêu hóa/tim mạch khi dùng NSAIDs). Cần lưu ý chống chỉ định, thận trọng, và tương tác thuốc. Thứ bậc hiệu quả so sánh giữa các liệu pháp (từ nguồn, dạng kim tự tháp không định lượng cụ thể): thuốc uống - tiêm khớp - thuốc bôi. Cân nhắc khi lựa chọn thuốc bôi ngoài: mức độ đau, vị trí khớp, bệnh lý nền, tương tác thuốc. Hướng dẫn sử dụng an toàn: dùng theo hướng dẫn bác sĩ/nhà sản xuất, theo dõi tác dụng phụ, thận trọng cho phụ nữ có thai và trẻ em; cần hướng dẫn bệnh nhân liều lượng-tần suất-thời gian, lưu ý bệnh nền (tim mạch, tiêu hóa, thận), theo dõi đánh giá hiệu quả thường xuyên, tư vấn biện pháp hỗ trợ khác (vật lý trị liệu, giảm cân).\n\nCác dạng thuốc dùng ngoài theo YHCT: (1) Dạng bột — khô, hút thấp, các vị thuốc sát trùng/cố sáp/chống viêm/chống ngứa (Hoạt thạch, Phèn phi). (2) Dạng nước — thuốc đun sắc hoặc vò với nước để rửa, sát trùng, bôi vào nơi tổn thương, tác dụng tiêu viêm, trừ mủ (bài nùng), cố sáp (lá Xoan, Long não). (3) Thuốc ngâm rượu — tiêu độc, chống ngứa, chống ứ huyết cục bộ (rượu thuốc Long não, Tô mộc). (4) Dạng mỡ, dầu — làm mềm da, sát trùng, tiêu độc, tiêu viêm, liền sẹo (mỡ Hoàng liên, tinh dầu nghệ). (5) Dạng cao (cao mềm và cao rắn) — dùng bôi/thoa/băng/dán vào vùng tổn thương da, tác dụng chống viêm giảm đau, giải độc, khứ ứ, hoạt huyết sinh cơ (cao Mỏ quạ đắp vết thương lâu lành giúp làm sạch, tăng tổ chức hạt, chóng lên da non). (6) Thuốc xông (hơi, khói) — ví dụ Thương truật + Bã đậu đốt than hồng, hun khói vào nơi tổn thương để trị chàm; nước Cà gai leo và Kinh giới xông chữa ngứa.\n\nCơ chế tác động của dược liệu YHCT dùng ngoài: giảm đau-kháng viêm (hoạt chất giảm đau + kháng viêm tự nhiên), tăng cường lưu thông máu (kích thích tuần hoàn tại chỗ, nuôi dưỡng phục hồi khớp), giãn cơ-giảm co cứng (giảm co cứng quanh khớp). Dược liệu giảm đau chống viêm tiêu biểu: Gừng (tính ấm vị cay, gingerol kháng viêm giảm sưng đau), Nghệ (curcumin chống oxy hóa kháng viêm mạnh), Bạc hà (tinh dầu mát lạnh giảm đau nhanh) — thường dùng dạng cao xoa bóp hoặc dầu xoa. Dược liệu hoạt huyết thông kinh lạc: Địa liền (hoạt huyết, tán ứ, giảm đau), Quế (tính ấm nóng, thông kinh hoạt lạc), Thiên niên kiện (khử phong thấp, mạnh gân cốt) — dùng ngoài da tăng lưu thông máu, giảm đau nhức khớp. Bài thuốc đắp ngoài da ví dụ: Ngải cứu (giảm đau kháng viêm) + Muối (giữ nhiệt, giảm phù nề) + Gừng (làm ấm giảm đau) — sao nóng các dược liệu, bọc vào vải, đắp lên vùng khớp đau. Cách dùng cao xoa bóp: xoa nhẹ cao lên vùng đau, massage nhẹ nhàng 10-15 phút, giữ ấm che kín vùng xoa bóp; ngày dùng 2-3 lần, không dùng trên vết thương hở. Lưu ý khi sử dụng dược liệu: kiểm tra dị ứng trước khi dùng, tham khảo ý kiến thầy thuốc YHCT, kết hợp với các phương pháp điều trị khác.\n\nNghiên cứu lâm sàng (theo nguồn, không nêu số liệu định lượng cụ thể): thuốc dùng ngoài YHCT cho thấy hiệu quả giảm đau, cải thiện chức năng khớp, và an toàn với ít tác dụng phụ hơn thuốc tây; tuy nhiên cần thêm nghiên cứu lớn hơn để khẳng định hiệu quả. Kết hợp YHCT và Y học hiện đại trong quản lý thoái hóa khớp gồm 3 khâu: chẩn đoán (xác định mức độ thoái hóa), điều trị (kết hợp thuốc, vật lý trị liệu, dược liệu), phục hồi (tập luyện, dinh dưỡng, duy trì lối sống lành mạnh) — đem lại hiệu quả toàn diện và lâu dài.",
        keyPoints:
          "YHHĐ dùng ngoài: NSAIDs (ức chế COX-1/2), Capsaicin (cạn kiệt chất P qua thụ thể TRPV1), Salicylate (tăng lưu thông máu) — ưu điểm ít tác dụng phụ toàn thân, hạn chế kích ứng da tại chỗ.\nYHCT có 6 dạng bào chế ngoại trị: bột, nước, ngâm rượu, mỡ/dầu, cao, xông (hơi/khói) — mỗi dạng có vị thuốc và cơ chế đặc trưng riêng.\nDược liệu hay dùng: Gừng/Nghệ/Bạc hà (giảm đau-kháng viêm), Địa liền/Quế/Thiên niên kiện (hoạt huyết thông kinh lạc), Hoạt thạch/Phèn chua (táo thấp sát trùng dạng bột), Mỏ quạ (cao dán liền vết thương).",
        sourceId: source.id,
      },
    });
    console.log(`Đã tạo TheoryTopic: ${topicName}`);
  } else {
    console.log(`ĐÃ TỒN TẠI TheoryTopic, bỏ qua: ${topicName}`);
  }

  // ===== FORMULA =====
  const phenChua1 = await prisma.formula.findFirst({ where: { name: { equals: "Cao dán Minh phàn - Tùng hương (trị chốc đầu, chàm lở)", mode: "insensitive" } } });
  if (!phenChua1) {
    const f = await prisma.formula.create({
      data: {
        name: "Cao dán Minh phàn - Tùng hương (trị chốc đầu, chàm lở)",
        origin: "Kinh nghiệm dân gian (trích Những cây thuốc và vị thuốc Việt Nam - Đỗ Tất Lợi)",
        indications: "Trị chốc đầu, chàm lở.",
        preparation:
          "Minh phàn 1.500g (nung thành khô phàn, tán bột mịn), Tùng hương 200g, mỡ lợn mới 500g. Cho tùng hương vào mỡ lợn, đun cho tùng hương tan trong mỡ, để nguội, cho khô phàn vào, trộn đều, bôi lên chỗ đau.",
        sourceId: source.id,
      },
    });
    console.log("Đã tạo Formula: Cao dán Minh phàn - Tùng hương");
  } else {
    console.log("ĐÃ TỒN TẠI Formula: Cao dán Minh phàn - Tùng hương");
  }

  const phenChua2 = await prisma.formula.findFirst({ where: { name: { equals: "Cao bột Khô phàn - Lưu huỳnh - Thạch cao (trị ngoài da do thấp)", mode: "insensitive" } } });
  if (!phenChua2) {
    await prisma.formula.create({
      data: {
        name: "Cao bột Khô phàn - Lưu huỳnh - Thạch cao (trị ngoài da do thấp)",
        origin: "Kinh nghiệm dân gian (trích Những cây thuốc và vị thuốc Việt Nam - Đỗ Tất Lợi)",
        indications: "Trị ngoài da do thấp.",
        preparation:
          "Khô phàn 12g, Lưu huỳnh 12g, Thạch cao nung 1.000g, Thanh đại 63g, Băng phiến 2g. Tất cả tán bột mịn, cho vào lọ sành, nút kín. Khi dùng, lấy bột thuốc trộn với dầu, bôi lên chỗ đau. Ngày 2 lần, bôi trong 5-7 ngày.",
        sourceId: source.id,
      },
    });
    console.log("Đã tạo Formula: Cao bột Khô phàn - Lưu huỳnh - Thạch cao");
  } else {
    console.log("ĐÃ TỒN TẠI Formula: Cao bột Khô phàn - Lưu huỳnh - Thạch cao");
  }

  const caoDanNgoTatTo = await prisma.formula.findFirst({ where: { name: { equals: "Cao dán nhọt (kinh nghiệm Ngô Tất Tố)", mode: "insensitive" } } });
  if (!caoDanNgoTatTo) {
    await prisma.formula.create({
      data: {
        name: "Cao dán nhọt (kinh nghiệm Ngô Tất Tố)",
        origin: "Kinh nghiệm dân gian — Ngô Tất Tố (trích Những cây thuốc và vị thuốc Việt Nam - Đỗ Tất Lợi)",
        indications: "Dán vào mụn nhọt.",
        preparation:
          "Củ ráy 80g (một củ), Nghệ 60g (một củ), Nhựa thông 40g, Sáp ong 40g, Dầu vừng 80g. Củ ráy gọt sạch vỏ cùng giã với nghệ cho thật nhỏ, cho vào nấu nhừ với nhựa thông, dầu vừng và sáp ong. Lọc để nguội, phết lên giấy bản dán vào mụn nhọt.",
        sourceId: source.id,
      },
    });
    console.log("Đã tạo Formula: Cao dán nhọt (Ngô Tất Tố)");
  } else {
    console.log("ĐÃ TỒN TẠI Formula: Cao dán nhọt (Ngô Tất Tố)");
  }

  const caoDanToaiHoaKhop = await prisma.formula.findFirst({ where: { name: { equals: "Cao dán Mật gấu - Quế nhục - Địa liền (thoái hóa khớp)", mode: "insensitive" } } });
  if (!caoDanToaiHoaKhop) {
    await prisma.formula.create({
      data: {
        name: "Cao dán Mật gấu - Quế nhục - Địa liền (thoái hóa khớp)",
        origin: "Tài liệu giảng dạy (danh mục vị thuốc, nguồn không nêu liều lượng/tỷ lệ)",
        indications: "Giảm đau tại chỗ trong thoái hóa khớp (Mật gấu: giảm đau tiêu viêm; Quế nhục: ấm kinh thông lạc; Địa liền: giảm đau hành khí).",
        preparation: "Nguồn chỉ liệt kê danh mục 3 vị (Mật gấu, Quế nhục, Địa liền) dùng dạng cao dán tiện lợi để giảm đau tại chỗ, không nêu tỷ lệ/liều lượng cụ thể — không bổ sung số liệu không có trong nguồn.",
        sourceId: source.id,
      },
    });
    console.log("Đã tạo Formula: Cao dán Mật gấu - Quế nhục - Địa liền");
  } else {
    console.log("ĐÃ TỒN TẠI Formula: Cao dán Mật gấu - Quế nhục - Địa liền");
  }

  const ruouXoaBop = await prisma.formula.findFirst({ where: { name: { equals: "Rượu xoa bóp Gừng - Địa liền - Quế - Hồi", mode: "insensitive" } } });
  if (!ruouXoaBop) {
    await prisma.formula.create({
      data: {
        name: "Rượu xoa bóp Gừng - Địa liền - Quế - Hồi",
        origin: "Tài liệu giảng dạy (danh mục vị thuốc, nguồn không nêu liều lượng/tỷ lệ)",
        indications: "Làm ấm khớp, tăng cường lưu thông máu (xoa bóp ngoài da).",
        preparation: "Nguồn chỉ liệt kê danh mục 4 vị (Gừng, Địa liền, Quế, Hồi) ngâm rượu dùng xoa bóp, không nêu tỷ lệ/liều lượng cụ thể — không bổ sung số liệu không có trong nguồn.",
        sourceId: source.id,
      },
    });
    console.log("Đã tạo Formula: Rượu xoa bóp Gừng - Địa liền - Quế - Hồi");
  } else {
    console.log("ĐÃ TỒN TẠI Formula: Rượu xoa bóp Gừng - Địa liền - Quế - Hồi");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

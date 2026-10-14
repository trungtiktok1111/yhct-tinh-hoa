// Thêm "Học thuyết Tạng Tượng" (ThS Võ Thanh Phong, 94 slide) vào Lý luận cơ bản:
// 5 Tạng + Lục phủ + Phủ kỳ hằng, đầy đủ đặc tính/công năng/hình khiếu chí dịch/
// quan hệ tạng phủ. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Học thuyết Tạng Tượng",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Hội Đông Y Hà Nội (2014), Sinh bệnh lý và luận trị tạng Phế, NXB Y Học",
      locator: "94 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Tạng tượng";

  await prisma.theoryTopic.create({
    data: {
      name: "Hệ thống Tạng Phủ — đại cương",
      category: cat,
      summary: "Tạng: Tâm, Tâm bào, Tỳ, Phế, Thận, Can. Phủ: Tiểu trường, Tam tiêu, Vị, Đại trường, Đởm, Bàng quang. Phủ kỳ hằng: Não, Tủy, Cốt, Mạch, Đởm, Bào cung (Tử cung).",
      content:
        "Học thuyết Tạng tượng nghiên cứu chức năng sinh lý bình thường và biến đổi bệnh lý của các hệ thống chức năng trong cơ thể. " +
        "Đặc tính chung: Tạng — hóa sinh và tàng trữ tinh khí ('tạng tàng nhi bất tả' = tạng chứa mà không tả ra). Phủ — vận chuyển vật chất, không tàng trữ ('phủ tả nhi bất tàng' = phủ tả ra mà không chứa). Phủ kỳ hằng — vừa rỗng vừa có chức năng tàng trữ (đặc biệt, khác cả Tạng và Phủ thường).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Tâm",
      category: cat,
      summary: "Tâm thuộc hành Hỏa, 'quân chủ chi quan' (vua của các tạng phủ) — chủ huyết mạch và tàng Thần.",
      content:
        "Đặc tính: Tâm thuộc hành Hỏa; là tạng Dương trong Dương; 'Quân chủ chi quan'; ứng với mùa Hạ. " +
        "Công năng — CHỦ HUYẾT MẠCH: Huyết là huyết dịch, Mạch là mạch đạo (phủ, đường vận hành của huyết). Tâm chủ hành huyết (thúc đẩy huyết vận hành), Tâm sinh huyết, Tâm nuôi dưỡng mạch đạo, Tâm chủ 'Tâm luật' (mạch đập theo nhịp). Bình thường: sắc mặt hồng nhuận tươi sáng, lưỡi hồng nhuận, mạch hòa hoãn, lồng ngực thư thái. Bất thường: sắc mặt không tươi, lưỡi nhợt/tím, mạch tế nhược/không đều, đau ngực. " +
        "Công năng — TÀNG THẦN: Tâm chủ thần minh (chi phối hoạt động sinh lý, tinh thần, ý thức, tư duy); Tâm chủ 'nhiệm vật' (tiếp thu, phản ánh thế giới xung quanh); chỉ đạo hoạt động sống (tinh thần, sinh lý). Bình thường: tinh thần hưng phấn, tình chí ôn hòa, đáp ứng linh hoạt. Bất thường: mất ngủ, hay mê, bứt rứt không yên, nói sảng, hôn mê. " +
        "Tâm chủ ôn chiếu: Tâm dương ôn chiếu toàn thân — ôn chiếu Tỳ để vận hóa thức ăn; ôn chiếu Thận để trao đổi thủy dịch. " +
        "Tâm bào lạc: làm ngoại vệ cho Tâm — ngoại tà muốn phạm Tâm phải qua Tâm bào lạc trước; triệu chứng và điều trị giống Tâm. " +
        "Hình-khiếu-chí-dịch-kinh lạc-biểu lý: Hình = vinh nhuận ra mặt; Cấu trúc = Mạch; Khiếu = khai khiếu ra lưỡi; Chí = vui mừng; Dịch = mồ hôi; Kinh lạc = kinh Tâm; Biểu lý = phủ Tiểu trường.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Can",
      category: cat,
      summary: "Can thuộc hành Mộc, 'thể âm mà dụng dương', tính cương — chủ sơ tiết và tàng huyết.",
      content:
        "Đặc tính: Can thuộc Mộc; tạng Dương trong Âm; 'thể âm mà dụng dương'; tính cương; ứng mùa Xuân. " +
        "Công năng — CHỦ SƠ TIẾT: Sơ = sơ thông, Tiết = phát tiết và thăng phát. Can sơ tiết khiến khí cơ toàn thân thông mà không trệ, tán mà không uất; khí cơ thăng-giáng-xuất-nhập bình thường; khí huyết điều hòa, tạng phủ vận hành bình thường. Can sơ tiết điều tiết: tình chí; vận hóa thủy cốc của Tỳ Vị; tuần hành đởm trấp; vận hành khí huyết; trao đổi thủy dịch; Xung Nhâm; Tinh thất. " +
        "Công năng — TÀNG HUYẾT: Can tàng trữ huyết dịch; nhu dưỡng Can âm, ức chế Can dương; điều tiết lượng huyết toàn thân, phân bố theo nhu cầu tạng phủ; nuôi dưỡng Xung Nhâm, Bào cung; phòng ngừa xuất huyết. " +
        "Can tàng Hồn (phần hồn/tinh thần tàng trữ ở Can). " +
        "Hình-khiếu-chí-dịch: Hình = vinh nhuận ra móng; Cấu trúc = Cân; Khiếu = khai khiếu ra mắt; Chí = tức giận; Dịch = nước mắt; Kinh lạc = kinh Can; Biểu lý = Đởm.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Tỳ",
      category: cat,
      summary: "Tỳ thuộc hành Thổ, 'chí âm trong âm', ưa táo ghét thấp — chủ vận hóa thủy cốc/thủy thấp, chủ thăng thanh, sinh huyết thống huyết.",
      content:
        "Đặc tính: Tỳ thuộc Thổ; tạng Chí âm trong Âm; Tỳ ưa táo ghét thấp; ứng mùa Trưởng hạ. " +
        "Công năng — VẬN HÓA THỦY CỐC: Vận = chuyển dời, Hóa = biến đổi. Tỳ biến đổi thức ăn thành chất tinh vi và chuyển vận lên Phế. " +
        "Công năng — VẬN HÓA THỦY THẤP: Tỳ điều tiết trao đổi thủy dịch; tân dịch qua quá trình sử dụng của các tạng phủ sinh ra Thấp; Tỳ biến đổi Thấp thành dạng có thể bài tiết ra ngoài. " +
        "Công năng — CHỦ THĂNG THANH: Tỳ đưa vật chất tinh vi lên Phế; Tỳ duy trì vị trí các cơ quan tạng phủ ở đúng nơi (không bị sa xuống). " +
        "Công năng — SINH HUYẾT, THỐNG HUYẾT: Tỳ vận hóa thủy cốc thành tinh vi là nguồn gốc hóa sinh Huyết; Tỳ thống nhiếp Huyết (giữ huyết vận hành đúng nơi trong lòng mạch). " +
        "Tỳ tàng Ý (hoạt động suy nghĩ, ý tưởng tàng trữ ở Tỳ). " +
        "Hình-khiếu-chí-dịch: Hình = vinh nhuận ra môi; Cấu trúc = Cơ nhục; Khiếu = khai khiếu ra miệng; Chí = lo nghĩ; Dịch = nước dãi; Kinh lạc = kinh Tỳ; Biểu lý = Vị.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Thận",
      category: cat,
      summary: "Thận là nguồn gốc Âm Dương của cơ thể, 'tạng Âm trong Âm', hành Thủy — chủ tàng tinh, chủ thủy, chủ nạp khí, chủ bế tàng, chủ âm dương.",
      content:
        "Đặc tính: Thận là nguồn gốc âm dương của cơ thể; tạng Âm trong Âm; hành Thủy; ứng mùa Đông. " +
        "Công năng — TÀNG TINH: Tàng = bế tàng, tàng trữ. Thận trữ tồn tinh khí, làm tinh khí không ngừng được bổ sung, ngăn mất tinh. Tinh tiên thiên (cha mẹ truyền, bẩm sinh) + Tinh hậu thiên (hóa sinh từ thủy cốc trong quá trình sống). Công năng của Tinh: thúc đẩy sinh trưởng/phát dục/sinh sản; hóa sinh huyết dịch; sinh tủy; ngăn ngoại tà. " +
        "Công năng — CHỦ THỦY: Thận chủ trì và điều tiết trao đổi thủy dịch; phối hợp Thận chủ khí hóa Bàng quang; đưa tân dịch đã hấp thu phân bố đi toàn thân; đưa trọc dịch bài xuất ra ngoài. " +
        "Công năng — CHỦ NẠP KHÍ: Thận nhiếp nạp thanh khí do Phế hô hấp để điều tiết hô hấp; sau khi Phế thanh túc, Thận tăng cường nhiếp nạp giúp hô hấp thông, ngăn hô hấp nhanh nông. " +
        "Công năng — CHỦ BẾ TÀNG: gồm 3 mặt — Thận tàng tinh, Thận nạp khí, Thận liễm hãn (giữ mồ hôi). " +
        "Công năng — CHỦ ÂM DƯƠNG: Thận âm là nguyên âm, tư dưỡng phần âm của ngũ tạng; Thận dương là nguyên dương, gốc rễ dương khí cơ thể; âm dương của Thận tương hỗ, chế ước, duy trì vận động sinh lý cơ thể. " +
        "Hình-khiếu-chí-dịch: Hình = vinh nhuận tóc; Cấu trúc = Cốt tủy; Khiếu = khai khiếu ra tai; Chí = kinh khủng (sợ hãi); Dịch = nước bọt; Kinh lạc = kinh Thận; Biểu lý = Bàng quang.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tạng Phế",
      category: cat,
      summary: "Phế thuộc Kim, 'thái âm trong dương' (ở vị trí cao nhất là Dương nhưng tính thu liễm là Âm), ưa nhuận ghét táo — chủ khí, tuyên phát-túc giáng, thông điều thủy đạo, trị tiết.",
      content:
        "Đặc tính: Phế chủ thu liễm, túc giáng là Âm; nhưng nằm ở thượng tiêu (lồng ngực), vị trí tối cao là Dương → Phế là 'thái âm trong dương'. Phế thuộc Kim: thanh khiết, thu liễm, thanh túc. Ứng mùa Thu. Phế là 'hoa cái' (che chở cho các tạng phủ, như cái lọng che). Phế là 'kiều tạng' (tạng mỏng manh, dễ bị tổn thương — dùng thuốc cần nhẹ nhàng, tuyên tán là chủ). Phế ưa nhuận, ghét táo → dễ tổn thương Phế tân. " +
        "Công năng — CHỦ KHÍ: Phế chủ hoạt động hô hấp (hít vào thiên khí, thở ra trọc khí); tham gia hình thành Tông khí; điều tiết khí cơ toàn thân, thúc đẩy vận động khí cơ. " +
        "Công năng — TRIỀU BÁCH MẠCH: Triều = hội tụ. Khí huyết vận hành toàn thân và hội tụ ở Phế; Phế giúp Tâm hành huyết thông qua điều tiết khí cơ. " +
        "Công năng — TUYÊN PHÁT, TÚC GIÁNG: Tuyên phát = tuyên thông và phát tán; Túc giáng = thanh túc và hạ giáng. Phế chủ tuyên phát: bài xuất trọc khí, phân bố tinh vi đi toàn thân, tuyên phát Vệ khí. Phế chủ túc giáng: thanh túc thiên khí thành phần thanh/trọc, phân bố tinh vi (Phế ở trên nên giáng xuống), thanh túc dị vật. " +
        "Công năng — THÔNG ĐIỀU THỦY ĐẠO: Phế sơ thông và điều tiết vận hành thủy dịch toàn thân; tuyên phát thủy dịch đi toàn thân (qua tuyên phát khí); túc giáng thủy dịch xuống dưới, vào trong. " +
        "Công năng — CHỦ TRỊ TIẾT: Trị tiết = trị lý và điều tiết. Phế giúp Tâm trị lý/điều tiết khí huyết tân dịch toàn thân — qua: chủ khí/quản hô hấp, điều tiết khí cơ, giúp Tâm hành huyết, điều tiết trao đổi thủy dịch. " +
        "Hình-khiếu-chí-dịch: Hình = vinh nhuận bì mao; Cấu trúc = Bì mao; Khiếu = khai khiếu ra mũi; Chí = buồn rầu; Dịch = nước mũi; Kinh lạc = kinh Phế; Biểu lý = Đại trường. " +
        "Phế và Đại trường: cả hai đều ưa nhuận, sợ táo, khí lấy hạ giáng làm thuận — Phế túc giáng giúp Đại trường chuyển đạo (truyền tống); Đại trường truyền đạo bình thường giúp Phế túc giáng.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quan hệ giữa các Tạng",
      category: cat,
      summary: "Mối quan hệ sinh lý tương hỗ giữa các cặp Tạng (Tâm-Phế, Tâm-Tỳ, Tâm-Can, Tâm-Thận, Phế-Tỳ, Phế-Can, Phế-Thận, Can-Tỳ, Can-Thận, Tỳ-Thận).",
      content:
        "TÂM-PHẾ: Tâm chủ huyết, Phế chủ khí → khí huyết vận hành thông sướng; khí hành thì huyết hành, huyết hành thì khí hành; 'khí là soái (tướng chỉ huy) của huyết, huyết là mẹ của khí'. " +
        "TÂM-TỲ: Tâm chủ huyết; Tỳ sinh huyết, nhiếp huyết. " +
        "TÂM-CAN: Can chủ sơ tiết → thúc đẩy Tâm vận hành huyết; Can tàng huyết → phối hợp với Tâm điều phối huyết dịch; Can sơ tiết → phối hợp Tâm duy trì tình chí bình thường. " +
        "TÂM-THẬN: 'Thủy hỏa ký tế' (nước lửa giúp nhau) — Tâm dương ôn Thận dương; Thận thủy thanh (làm mát) Tâm hỏa; Tinh hóa Khí sinh Thần; Thần là chủ của Tinh Khí. " +
        "PHẾ-TỲ: Phế chủ hô hấp, Tỳ chủ vận hóa thủy cốc → sinh thành Khí; Phế chủ thông điều thủy đạo, Tỳ chủ vận hóa thủy thấp → điều hòa trao đổi thủy dịch. " +
        "PHẾ-CAN: Phế chủ túc giáng, Can chủ thăng → thăng giáng hiệp điều (phối hợp); Can sơ tiết → Phế khí túc giáng thuận lợi. " +
        "PHẾ-THẬN: Phế thông điều thủy đạo, Thận chủ khí hóa Bàng quang/chủ thủy → điều tiết trao đổi thủy dịch; Phế chủ hô hấp, Thận chủ nạp khí → điều hòa vận động hô hấp. " +
        "CAN-TỲ: Can chủ sơ tiết → hỗ trợ Tỳ vận hóa; Can tàng huyết, Tỳ nhiếp huyết → vận hành huyết dịch điều hòa. " +
        "CAN-THẬN: 'Tinh huyết đồng nguyên'; tàng-tiết tương hỗ (Can tàng huyết, Thận tàng tinh, phối hợp với nhau); Can Thận đều là 'tướng hỏa'; 'thủy hàm dưỡng mộc' (Thận thủy nuôi dưỡng Can mộc). " +
        "TỲ-THẬN: Tỳ là gốc hậu thiên, Thận là gốc tiên thiên; phối hợp điều tiết trao đổi thủy dịch.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Phủ",
      category: cat,
      summary: "6 Phủ: Đởm, Vị, Tiểu trường, Đại trường, Bàng quang, Tam tiêu — có chức năng vận chuyển/tiêu hóa vật chất, không tàng trữ (trừ Đởm vừa là Phủ vừa là Phủ kỳ hằng).",
      content:
        "ĐỞM: vừa là Phủ vừa là Phủ kỳ hằng; thuộc Dương, thuộc Mộc, biểu lý với Can. Chủ trữ tồn và bài tiết đởm trấp (dịch mật); chủ quyết đoán; Đởm khí chủ thăng; tính thích ninh tĩnh (yên tĩnh). " +
        "VỊ: chủ thu nạp thủy cốc; chủ ngấu nhừ thủy cốc; chủ giáng (đưa) thủy cốc xuống; Vị ưa nhuận ghét táo. " +
        "TIỂU TRƯỜNG: chủ thu đựng và hóa vật; chủ phân biệt thanh trọc. " +
        "ĐẠI TRƯỜNG: chủ chuyển hóa chất cặn bã; chủ 'tân' (hấp thu lại nước), tế bí biệt trấp. " +
        "BÀNG QUANG: chủ trữ tồn nước tiểu; chủ tống xuất nước tiểu. " +
        "TAM TIÊU: hệ thống kết nối các tạng phủ để vận hành nguyên khí, sơ thông thủy dịch; chủ thông hành nguyên khí; sơ thông thủy đạo.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phủ kỳ hằng",
      category: cat,
      summary: "Các cơ quan 'đặc biệt' (Não, Tủy, Mạch, Tử cung/Bào cung, Tinh thất — và Đởm) vừa rỗng vừa có chức năng tàng trữ, khác với Tạng và Phủ thông thường.",
      content:
        "NÃO: là Tủy hội tụ mà thành ('tủy hải' — biển của tủy); là phủ của nguyên thần; chủ các hoạt động sống của con người; chủ tàng nguyên thần; chủ cảm giác, vận động. " +
        "TỦY: 3 loại — tủy xương, tủy sống, tủy não. Chức năng: dưỡng Não; nuôi dưỡng Cốt (xương); sinh Huyết. " +
        "MẠCH: đường vận hành của khí huyết. Chức năng: vận hành khí huyết; chế ước huyết hành (giữ huyết đi đúng đường); phản ánh tin tức (thông tin) toàn thân (cơ sở của mạch chẩn). " +
        "TỬ CUNG (Bào cung): chủ trì kinh nguyệt; chủ việc thụ thai. Quan hệ mật thiết với Tỳ (sinh huyết, thống huyết), Can (tàng huyết, sơ tiết), Thận (tàng tinh, chủ phát dục/sinh sản). Quan hệ mật thiết với 4 mạch Xung-Nhâm-Đốc-Đới: Xung mạch là 'bể của huyết'; Nhâm mạch chủ bào thai; Đốc mạch điều nhiếp khí huyết; Đới mạch thống nhiếp khí huyết của 3 kinh Xung-Nhâm-Đốc để bảo vệ thai. " +
        "TINH THẤT: hóa sinh, trữ tàng tinh dịch.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 9 chủ đề Tạng Tượng (đại cương, 5 Tạng, quan hệ giữa các Tạng, Lục phủ, Phủ kỳ hằng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Chẩn đoán học YHCT batch 7 (lấp khoảng trống + tiếp tục): Hình tượng lưỡi
// nguy hiểm (kết thúc Vọng Thiệt) + TOÀN BỘ Bài 2 VĂN CHẨN (Nghe thanh âm,
// Ngửi mùi vị) — đây là phần bị bỏ sót khi nhảy đọc trước đó. Dòng 575-669
// của dump. Trích trung thực, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1: Hình tượng lưỡi nguy hiểm (hết Bài 1), Bài 2 Văn Chẩn (Nghe thanh âm, Ngửi mùi vị)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Hình tượng lưỡi nguy hiểm (tử chứng)",
      category: cat,
      summary: "Khi bệnh đến giai đoạn nguy kịch, âm dương khí huyết tân dịch sắp kiệt, lưỡi và rêu xuất hiện các hình sắc đặc thù báo hiệu từng tạng sắp tuyệt.",
      content:
        "Khi âm khí gần tuyệt, lưỡi có thể: không rêu như trái thận heo lột màng hoặc như mặt kính (thương âm hoặc vị khí gần tuyệt); thô to có gai như da cá nhám mà khô nứt (tân dịch khô kiệt); đầu lưỡi co rụt như thịt trái vải khô, hoàn toàn không tân dịch (nhiệt cực tân khô); chất lưỡi khô tối như màu gan heo hoặc đỏ như trái thị (khí huyết bại hoại); lưỡi ngắn mà âm nang teo (Can khí gần tuyệt); đỏ sẫm như giả thạch xen đen (Thận âm gần tuyệt); mọc mảng trắng như hoa tuyết (Tỳ dương gần tuyệt). Đây đều là triệu chứng khó chữa, cần phối hợp tứ chẩn hợp tham để không nhầm lẫn. " +
        "TIỂU KẾT VỌNG CHẨN: nguyên tắc chung — quan sát Thần/Sắc/Hình/Thái cục bộ và toàn diện; thẩm sát thần khí đoán sinh tử; quan sát sắc trạch thiện ác đoán nặng nhẹ nông sâu. Sắc minh nhuận hàm súc = thường; khô ám lộ rõ = bệnh ('Thanh hắc vi thống, hoàng xích vi nhiệt, bạch vi hàn'). Thiệt chẩn: khí bệnh xem rêu, huyết bệnh xem chất — lưỡi nhạt chủ hư hàn, lưỡi đỏ chủ nhiệt, xanh tím chủ hàn(nhuận)/nhiệt(táo); rêu trắng chủ biểu/hàn (cũng có thể lý), rêu vàng chủ lý/nhiệt, rêu đen chủ hàn(nhuận)/nhiệt(táo) — cần kết hợp hình thái lưỡi và hình chất rêu để tổng hợp phân tích. Vọng lạc mạch trẻ em dùng phù/trầm phân biểu lý, đỏ/tím phân hàn nhiệt, đạm/trệ phân hư thực, tam quan đoán nặng nhẹ.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Văn Chẩn — Nghe Thanh Âm (phát thanh, tiếng nói, hô hấp, ho)",
      category: cat,
      summary: "Âm thanh do Phế (động lực chính), Hầu (cơ quan phát thanh), và Thận (chủ nạp khí) phối hợp tạo ra. Bệnh biến tạng phủ ảnh hưởng thanh âm qua kinh lạc. Ngũ âm/ngũ thanh ứng ngũ tạng.",
      content:
        "NGUYÊN LÝ: Phế chủ nhất thân chi khí, khí động tắc hữu thanh (động lực chính); Hầu là cơ quan phát thanh; Thận chủ nạp khí nên thanh âm phải do khí vận động từ giữa hai Thận lên lưỡi. Thanh âm bình thường: tự nhiên, thông thoáng, cương nhu tương tề (nam trầm đục, nữ cao trong, trẻ em trong giòn, già trầm thấp) — thay đổi theo tình chí (vui=hoan duyên tán; giận=phẫn nộ cấp thúc; buồn=bi thảm đứt đoạn...) vẫn là bình thường. " +
        "NGŨ ÂM/NGŨ THANH ỨNG NGŨ TẠNG: Hô-Tiếu-Ca-Khấp-Thân (hô/cười/ca hát/khóc/rên) tương ứng Can-Tâm-Tỳ-Phế-Thận. " +
        "PHÁT THANH BẤT THƯỜNG: Khàn/mất tiếng — bệnh mới = thực chứng (ngoại cảm phong hàn/phong nhiệt, hoặc đàm trọc ủng Phế — 'Kim thực bất minh'); bệnh lâu = hư chứng (tinh khí nội thương, Phế Thận âm hư hư hỏa chước kim — 'Kim phá bất minh'); bạo nộ kêu gào tổn hầu họng cũng gây khàn; phụ nữ mang thai mất tiếng = bào thai trở trệ Thận tinh khí không thượng vinh. Âm cao to hữu lực liên tục = thực/nhiệt chứng (kèm nghẹt mũi = phong hàn thấp tà). Âm nhẹ khẽ tế nhược đứt quãng = hư chứng, hàn chứng. Ngáy khi ngủ bình thường, nhưng ngủ mê mệt ngáy liên tục + tiểu không hay + bàn tay xòe = trúng phong nhập tạng (nguy hiểm). Rên rỉ: chau mày rên = đau đầu dữ dội; không ngồi được = đau lưng/chân; ôm ngực/bụng rên = đau ngực/bụng; la kinh dị đột ngột = đau khớp/xương; la từng cơn + âm cao + sợ hãi = kinh phong; trẻ khóc đêm = Tỳ kinh có nhiệt hoặc Tỳ hàn đau bụng. " +
        "TIẾNG NÓI (ngữ ngôn): trầm mặc ít nói = hư/hàn chứng; phiền thao nói nhiều = nhiệt/thực chứng. 'Đoạt khí' (nói chậm nhẹ, muốn nói không nhắc lại được) = trung khí đại hư. Nói chậm không rõ = phong đàm mông bịt thanh khiếu. Nói lộn xộn = thần minh nhiễu loạn (Tâm bệnh). 'Chiêm ngữ' (thần trí không tỉnh, nói không thứ tự, tiếng cao có lực) = thực chứng (đàm nhiễu Tâm thần, ôn bệnh tà nhập Tâm bào, hoặc Dương minh phủ thực — có huyết nhiệt/ứ huyết/táo thỉ/đàm ngưng). 'Trịnh thanh' (thần trí không tỉnh, lặp lời, âm thấp nhược) = Tâm khí đại thương, hư chứng. 'Độc ngữ/Thác ngữ' (lẩm bẩm một mình, ngưng khi gặp người) = Tâm khí bất túc thần thất dưỡng, hư chứng. Cuồng chứng (cười chửi cuồng ngôn, trèo cao ca hát, cởi đồ chạy) = dương nhiệt thực chứng (đàm hỏa nhiễu Tâm hoặc Thương hàn súc huyết). " +
        "HÔ HẤP: hơi thở thô hổn hển nhanh = thực/nhiệt (ngoại cảm tà khí hữu dư); nhỏ chậm = hư/hàn (nội thương chính khí bất túc). Giả thực: bệnh lâu khí thô mà đứt đoạn (Phế Thận muốn tuyệt). Giả hư: ôn nhiệt nhập Tâm bào, hơi thở vi mà mê mê. Hơi thở gấp ngắn không kịp nghỉ = nguyên khí đại tổn, âm dương ly quyết. 5 loại: Suyễn (khó thở gấp, há miệng rụt vai, cánh mũi phập phồng — thực suyễn: cấp, thô cao gấp, thể chắc khỏe, Phế thực nhiệt/đàm ẩm; hư suyễn: từ từ, thấp nhỏ, động là tăng nhưng hít sâu dễ chịu, gầy, Phế Thận hư tổn không nhiếp nạp). Háo (thở nhanh gấp, đứt đoạn, họng có tiếng đàm minh, bệnh dài khó khỏi — đàm ẩm trong + ngoại hàn thúc biểu). Thượng khí (Phế khí không tuyên, nghịch lên hầu — khái nghịch thượng khí kèm đàm, ngồi thở không nằm = đàm ẩm nội đình hung cách; kèm phù thũng = ngoại tà thúc bì mao Phế khí bế tắc). Đoản khí (nhanh ngắn không kịp nghỉ, không rụt vai, không tiếng đàm — đàm ngưng đình ngực + khát = thực; Phế khí bất túc + khí đoản tiểu không thông = hư). Thiểu khí/Khí vi (nhỏ yếu, ngắn, hình thể không đổi — chủ các loại hư bất túc). " +
        "HO (khái thấu): tiếng nặng tức ngực = hàn thấp. Nặng đục + đàm trong loãng trắng + nghẹt mũi = ngoại cảm phong hàn. Tiếng nhỏ đàm nhiều dễ khạc = ho hàn/thấp/đàm ẩm. Tiếng thanh giòn, ho khan không đàm hoặc đàm dính ít = táo nhiệt. Ho không thông, khàn đặc, đàm vàng dính đặc khó khạc, họng khô đau, thở ra nóng = Phế nhiệt (Phế khí không tuyên). Ho một tràng liên tục = phong. Ho từng cơn liên tục kèm nôn/ho máu, cuối cơn kêu như tiếng cò = 'Bách nhật khái' (ho gà, trẻ em, Phế thực, phong tà + phục đàm uất hóa nhiệt). Ho như tiếng chó sủa (bạch hầu) = Phế Thận âm hư hỏa độc công hầu. Ho không có sức, khạc bọt trắng kèm khí thúc = Phế hư. Ho nhiều về đêm = Thận thủy khuy. Ho nhiều sáng sớm = Tỳ hư hoặc đàm thấp Đại trường.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Văn Chẩn — Nôn ói, Ách nghịch, Ợ hơi, Thở dài, Hắt hơi, Sôi ruột, Ngửi mùi vị",
      category: cat,
      summary: "Các âm thanh từ Vị khí thượng nghịch (nôn/nấc/ợ), Can khí uất (thở dài), Phế khí (hắt hơi), Tỳ Vị (sôi ruột); và ngửi mùi cơ thể/phòng bệnh để đoán tạng phủ.",
      content:
        "NÔN ÓI (ẩu thổ, do Vị khí thượng nghịch): Ẩu (nôn có tiếng và vật), Can ẩu/nôn khan (có tiếng không vật), Thổ (có vật không tiếng). Hư hàn — nôn từ từ, tiếng nhỏ yếu, nôn nước trong đàm nhớt. Thực nhiệt — nôn mãnh liệt, tiếng to, nôn nước vàng/chua/đắng; nặng (nhiệt nhiễu thần minh) = nôn vọt. Sáng ăn chiều ói ('phản vị') = Vị dương hư hoặc Tỳ Thận đều hư. Khô miệng muốn uống nhưng uống vào nôn liền = thủy nghịch chứng (súc thủy Thái dương hoặc đàm ẩm). Ngực tức bụng đầy đại tiện không thông mà nôn = trường có táo thỉ xú trọc thượng nghịch. Khí uất nôn (ngực tức bụng đau) = Can khí phạm Vị. Vị thống mà nôn mủ = Vị ung. " +
        "ÁCH NGHỊCH (nấc cụt, Vị khí thượng nghịch): bệnh mới, tiếng hữu lực = hàn/nhiệt tà khách Vị; bệnh lâu, tiếng nhỏ khẽ = vị khí gần tuyệt. Nấc liên tục cao ngắn hữu lực = thực nhiệt. Nấc nhỏ trầm dài, cách hồi lâu mới 1 tiếng = hư hàn. Nấc nhỏ không lên tới họng/'trịnh thanh' = Tỳ Vị khí suy. Nấc ngắn, tinh thần sáng suốt, tự khỏi = ăn nhanh/cảm phong hàn nhất thời. " +
        "Ợ HƠI (ái khí, Vị khí thượng nghịch): ợ nước chua + ngực bụng trướng mãn = thực tích thức ăn cũ, Vị khí trệ. Ợ rõ trong liên tục, trung tiện đỡ, theo tình chí = Can khí phạm Vị. Ợ thấp trầm không chua hôi, ăn không ngon (người già) = Tỳ Vị hư nhược; hoặc hàn khí khách Vị, hoặc sau hãn/thổ/hạ pháp Vị khí bất hòa. " +
        "THỞ DÀI (thái tức): bệnh tình chí — tình chí uất ức/ngực đầy tức, thở dài thấy dễ chịu = Can khí uất kết. " +
        "HẮT HƠI: Phế khí thượng xung lên mũi, đa số ngoại cảm phong hàn; nếu ngoại tà uất biểu lâu ngày mà đột nhiên hắt hơi = báo hiệu bệnh gần khỏi. " +
        "SÔI RUỘT (trường minh): tiếng ở thượng vị + bụng căng trướng, đứng lên/xoa bụng thấy tiếng đi xuống = ẩm thực lưu tụ tại Vị. Tiếng ở bụng như đói, ấm/ăn vào giảm, lạnh/đói tăng = trung hư trường vị bất thực. Tiếng như sấm = phong hàn thấp tà thắng, bĩ mãn, tiêu lỏng. " +
        "NGỬI MÙI VỊ: Mùi miệng — chua hôi = có thực tích (xá thực); hôi thối = Vị nhiệt. Mùi mồ hôi tanh khét = phong thấp nhiệt ủ lâu bì phu chưng biến tân dịch. Mùi mũi hôi kèm nước mũi đục = viêm xoang. Mùi thân thể hôi — cần kiểm tra nhọt lở loét. Mùi phòng bệnh: hôi cả phòng (ôn dịch), hôi như xác chết = tạng phủ bại hoại (bệnh nặng); mùi máu tanh = bệnh nhân mất máu.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề Chẩn đoán học YHCT batch 7 (Hình tượng lưỡi nguy hiểm, Văn Chẩn Nghe Thanh Âm phần 1, Văn Chẩn phần 2 + Ngửi mùi vị) — lấp khoảng trống Bài 2 Văn Chẩn bị bỏ sót.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Chẩn đoán học YHCT batch 2: Vọng Hình Thái + Vọng Đầu Cổ Ngũ Quan Cửu Khiếu
// (đầu mặt cổ tóc, mắt, tai, mũi, miệng môi răng lợi, họng hầu). Dòng 150-400
// của dump. Trích/diễn giải trung thực theo nguồn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 1 Vọng chẩn: Vọng Hình Thái, Vọng Đầu Cổ Ngũ Quan Cửu Khiếu",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Hình Thái — thể hình và tư thế",
      category: cat,
      summary: "Ngũ thể hợp ngũ tạng — hình thể và tư thế phản ánh thịnh suy khí huyết tạng phủ. 3 loại thể chất: dương tạng, âm tạng, âm dương hòa bình. Nhiều tư thế đặc trưng chẩn đoán bệnh (co giật, nằm ngồi, trúng phong...).",
      content:
        "VỌNG HÌNH THỂ: Cường (thân thể cường tráng: xương to dài chắc, ngực đầy nở, cơ bắp sung thực, da nhuận) — dự hậu tốt dù mắc bệnh. Nhược (suy nhược: xương nhỏ ngực lép, cơ nhục mềm gầy, da khô) — dự hậu kém. 'Hình chi sở sung giả khí, hình thắng khí giả yểu, khí thắng hình giả thọ' (Tứ chẩn quyết vi) — người vô khí lực dù mập ốm đều chủ yểu. Mập ăn được = hình thịnh hữu dư; mập ăn ít = hình thịnh khí suy (đa số Tỳ hư có đàm). Gầy ăn nhiều = trung tiêu có hỏa; gầy ăn ít = trung tiêu khí hư nhược. 'Đại cốt khô cảo, đại nhục hãm hạ' (gầy trơ xương) = khí dịch cạn, tinh khí tạng phủ suy kiệt — vô thần nặng. Người mập bụng phệ dễ tụ thấp sinh đàm, dễ trúng phong bạo quyết. Người gầy âm hư huyết dịch suy thiểu, tướng hỏa dễ kháng, dễ lao thấu. Dị hình (ngực gà/lưng rùa/chân vòng kiềng) — tiên thiên bẩm phú bất túc (thận tinh khuy tổn) hoặc hậu thiên thất dưỡng (Tỳ Vị hư nhược). Ngực hình thùng — phục ẩm tích đàm, Phế khí hao tán hoặc Thận bất nạp khí. Bụng to tứ chi teo = cổ trướng (Can uất/Tỳ hư → khí trệ thủy đình huyết ứ). Da bụng mềm nhẽo lõm, sờ thấy cột sống = vị trường khô lép, tinh khí tạng phủ suy bại (ác tính). " +
        "3 THỂ CHẤT: Dương tạng (âm hư dương thịnh) — gầy cao, đầu dài, cổ nhỏ dài, vai hẹp, ngực dài bằng phẳng, tư thế hơi cúi gập trước. Âm tạng (dương hư âm thịnh) — thấp mập, đầu tròn cổ to ngắn, vai rộng ngực rộng ngắn hình tròn, tư thế ưỡn ra sau. Âm dương hòa bình — không thiên thịnh/suy, khí huyết điều hòa, thể hình trung gian. " +
        "VỌNG TƯ THẾ: Mi/mặt/môi/ngón tay chân run giật từng cơn — báo trước co giật (ngoại cảm nhiệt bệnh) hoặc huyết hư âm khuy kinh mạch thất dưỡng (nội thương). Tay chân run — hư phong nội động. Tứ chi co giật/co quắp/cổ lưng cứng 'giác cung phản trương' — kinh bệnh do phong/hàn/thấp/nhiệt/hư, đa số Can phong nội động hoặc nhiệt cực sinh phong (cũng gặp ở trẻ em kinh phong, ôn bệnh nhiệt nhập dinh huyết, hoặc khí huyết hư kinh mạch thất dưỡng). Rét run — sốt rét cơn hoặc chính tà đấu tranh dữ dội (báo trước đổ mồ hôi dữ dội — 'chiến hãn'). Bắt chuồn chuồn/vuốt áo mò giường — thất thần nguy hiểm. Tay chân mềm yếu vô lực không đau = 'Nuy chứng' (Dương minh thấp nhiệt hoặc Tỳ Vị khí suy Can Thận bất túc). Khớp sưng đau vận động khó = 'Tý chứng'. Đột nhiên hôn đảo bán thân bất toại miệng méo mắt không khít = trúng phong nhập tạng; chỉ liệt nửa người/méo miệng mà thần trí tỉnh = phong trúng kinh lạc. Đột ngột hôn đảo mà hô hấp bình thường = 'Quyết chứng'. Té ngã miệng há tay chân duỗi đái không tự chủ = trúng phong thoát chứng; răng cắn chặt tay nắm chặt = trúng phong bế chứng; té đột ngột mặt đỏ đổ mồ hôi = trúng thử. Tư thế đặc biệt theo thống chứng: tay ôm bụng dáng ngã trước = phúc thống; hai tay ôm bụng lưng cong = bệnh lưng đùi; đang đi đột nhiên ngưng tay ôm ngực = chân tâm thống. Co ro mặc nhiều áo = ố hàn (biểu hàn hoặc lý hàn); cởi áo tung chăn = ố nhiệt (biểu nhiệt hoặc lý nhiệt). Dương chứng muốn hàn lạnh, muốn gập người; âm chứng thích ấm, không thích gặp người. " +
        "TƯ THẾ NGỒI/NẰM: ngồi thích phủ phục = Phế hư khí thiểu; ngồi thích ưỡn ngẩng = Phế thực khí thịnh; ngồi không nằm được (nằm thì khí nghịch) = khái suyễn Phế trướng hoặc thủy ẩm đình ngực bụng; chỉ nằm không ngồi được = khí huyết đều hư hoặc đoạt khí thoát huyết. Nằm mặt hướng ngoài, dễ xoay trở = dương/thực/nhiệt chứng; nằm quay mặt vô tường, nặng nề khó xoay = âm/hàn/hư chứng (bệnh nặng mà vậy là dự hậu xấu). Nằm co ro co quắp = dương hư úy hàn hoặc đau cực độ; nằm sải chân tay mặt ngửa = dương chứng nhiệt thịnh.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Đầu Mặt, Cổ Gáy, Tóc",
      category: cat,
      summary: "Đầu là nơi hội tụ chư dương, tàng não (nguyên thần chi phủ, thuộc Thận); tóc là 'huyết dư', huyết mạch thượng vinh ở mặt (Tâm kỳ hóa). Vọng đầu mặt cổ tóc chủ yếu tìm hiểu Tâm, Thận và khí huyết.",
      content:
        "ĐẦU MẶT: đầu trẻ em quá to/nhỏ — dị hình do tiên thiên bẩm phú (thận tinh bất túc) hoặc não tích thủy (kèm chậm phát triển trí tuệ). THÓP (tín môn): thóp không đóng ('tín hãm') — hư chứng (nôn tiêu chảy nhiều thương tân dịch, khí huyết bất túc, Tỳ Vị hư hàn, hoặc tiên thiên bất túc não tủy bất túc). Thóp nhô cao ('tín điền') — thực nhiệt chứng (ôn bệnh hỏa nhiệt/phong nhiệt/thấp nhiệt tà xâm nhập não tủy). Thóp đóng chậm — Thận khí bất túc, còi xương. ĐẦU LẮC không tự chủ — phong bệnh hoặc khí huyết hư suy (ở người già sau bệnh, gầy ốm — đa số hư, khí huyết hư hỏa phạm thượng). MẶT THŨNG — đa số thủy thũng: dương thủy khởi nhanh (phù mi mắt đầu mặt trước), âm thủy khởi chậm (phù chân trước). Da đầu mặt đỏ nóng sưng như phết son, ấn mất màu kèm đau = 'bao đầu hỏa đan' (phong nhiệt hỏa độc thượng công, dễ tà độc nội hãm). Đầu to như cái đấu, mắt sưng không mở được = 'đại đầu ôn' (dịch độc hỏa độc thượng công). KHẨU NHÃN OA TÀ (méo miệng lệch mắt): mắt nhắm không khít, miệng méo không chau mày/thổi sáo được — phong tà trúng lạc hoặc lạc mạch hư, phong đàm bế tắc (đa số ở Dương minh kinh). " +
        "CỔ GÁY: cứng ngắc = tà khí thực (ôn bệnh hỏa tà thượng công); mềm, đầu nặng muốn gục = chính khí hư (Thận khí hư suy). " +
        "TÓC: đen dày mượt = Thận khí thịnh, tinh huyết sung túc. Vàng hoe thưa khô cháy = tinh huyết bất túc (sau đại bệnh, hư tổn — có thể rụng hết sói đầu). Rụng từng mảng đột ngột = huyết hư nhiễm phong. Thanh niên tóc thưa dễ rụng = Thận hư hoặc huyết nhiệt. Thanh thiếu niên tóc bạc kèm triệu chứng Thận hư = Thận hư; kèm âm hư = lao thần thương huyết. Trẻ em cam tích (do tiên thiên bất túc, Tỳ Vị hư tổn) cũng ảnh hưởng tóc.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Mắt — Ngũ luân, thần nhãn, sắc và hình thái mắt",
      category: cat,
      summary: "Học thuyết Ngũ luân: mống mắt-Tâm (Huyết luân), lòng đen-Can (Phong luân), lòng trắng-Phế (Khí luân), đồng tử-Thận (Thủy luân), mi mắt-Tỳ (Nhục luân). Mắt là nơi hội tụ tinh của ngũ tạng lục phủ.",
      content:
        "NGUYÊN LÝ: 'Ngũ tạng lục phủ chi tinh khí, giai thượng chí vu mục nhi vi chi tinh' (Tố Vấn). NGŨ LUÂN: mống mắt trong-ngoài (huyết lạc) thuộc Tâm = Huyết luân (Tâm chủ huyết, lạc là tinh của huyết); lòng đen thuộc Can = Phong luân (Can chủ cân, lòng đen là tinh của cân); lòng trắng thuộc Phế = Khí luân (Phế chủ khí); đồng tử thuộc Thận = Thủy luân (Thận chủ cốt, sinh tủy); mi mắt (nhãn bào) thuộc Tỳ = Nhục luân (Tỳ chủ cơ nhục). " +
        "CHẨN NHÃN THẦN: ranh giới lòng đen-trắng rõ, ẩn chứa thần sắc, thần quang sung túc, có ghèn/nước mắt, nhìn rõ = hữu thần (dễ chữa dù bệnh). Lòng trắng tối đục, lòng đen sắc trệ, mất thần sắc, phù quang bạo lộ, không ghèn/nước mắt, nhìn mơ hồ = vô thần (khó chữa). " +
        "SẮC CHẨN MẮT: mống mắt đỏ = Tâm hỏa; lòng trắng đỏ = Phế hỏa; vàng = thấp nhiệt nội thịnh; mắt sưng = Can hỏa; mí mắt đỏ ẩm loét = Tỳ hỏa; toàn bộ mắt đỏ = Can kinh phong; mắt trong = hàn, đục = nhiệt; mống mắt trắng nhạt = huyết hư; mi mắt tươi sáng = đàm ẩm; mi mắt tối ám = Thận hư. " +
        "HÌNH DÁNG MẮT: Sưng mới xuất hiện + thủy khí ở mặt = thủy thũng mới phát (Tỳ nhiệt sưng nhanh đỏ; Tỳ hư sưng chậm mi mềm vô lực; người già Thận suy sưng mi dưới). Mắt thụt vào = tinh khí ngũ tạng suy (khó chữa; thụt sâu + không nhìn rõ + mạch chân tạng = âm dương kiệt tuyệt, triệu chứng tử). Mắt lồi + suyễn = Phế trướng; cổ sưng mắt lồi = 'Anh thũng'. Mắt kéo màng (ế mạc) — do lục dâm tà độc, thực trệ đàm hỏa thấp nhiệt, thất tình uất kết, tạng khí hư tổn, hoặc ngoại thương; 'nội chướng' (cườm) — thất tình tổn thương khí huyết lưỡng hư, hoặc Can Thận bất túc âm hư hỏa vượng (ngoại chướng thuộc thực, nội chướng thuộc hư). Mộng thịt — Tâm Phế phong nhiệt úng thịnh, hoặc Tỳ Vị thấp nhiệt uẩn chưng huyết trệ, hoặc Thận âm hao Tâm hỏa thượng viêm. Châm nhãn/nhãn đan (chắp/lẹo) — phong nhiệt bác khách mi mắt, hoặc Tỳ Vị uẩn tích nhiệt độc. " +
        "HÌNH THÁI MẮT: trợn ngược nhìn trừng trừng không chớp = triệu chứng nặng. Nhìn/liếc ngang = Can phong nội động. Ngủ mắt không khít = Tỳ khí thanh dương không thăng (trẻ em Tỳ Vị hư nhược/mạn Tỳ phong). Liệt mi cả 2 mắt = tiên thiên bất túc Tỳ Thận lưỡng hư; 1 mắt liệt = Tỳ hư khí nhược hoặc khí huyết bất hóa sau sang chấn. Đồng tử giãn to = Thận tinh hao kiệt (nguy kịch); đồng tử co nhỏ = Can Đởm hỏa tích, lao tổn Can Thận hư hỏa thượng nhiễu, hoặc trúng độc.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Tai, Vọng Mũi",
      category: cat,
      summary: "Tai là khiếu của Thận, nơi hội tụ nhiều kinh mạch ('Tông mạch chi sở tụ'). Mũi là khiếu của Phế, thuộc Tỳ kinh, liên hệ Vị kinh.",
      content:
        "VỌNG TAI: tai là khiếu của Thận; kinh Thủ/Túc Thiếu dương, Thái dương, Dương minh đều phân bố ở tai. Biến hóa sắc trạch: tai dày nhuận = thận âm sung túc tiên thiên; mỏng khô = thận âm tiên thiên bất túc. Trắng = hàn (cảm phong hàn hoặc hàn tà trực trúng); mỏng trắng = Thận bại. Xanh đen = đau dữ dội; vành tai đen cháy khô = Thận thủy suy cực độ (giai đoạn cuối ôn bệnh). Đỏ nhuận = bình thường (Thận khí sung túc); đỏ sưng = Thiếu dương tướng hỏa thượng công hoặc Can Đởm thấp nhiệt hỏa độc; đường đỏ sau tai + gốc tai lạnh = triều nhiệt của sởi. Hình thái: dày to = Thận khí túc; nhỏ mỏng = Thận khí khuy suy; sưng = tà khí thực (Thiếu dương tướng hỏa); gầy = chính khí suy (Thận tinh/Thận âm bất túc); teo héo = Thận khí kiệt tuyệt (tử chứng); xơ xác héo = bệnh lâu huyết ứ hoặc trướng ung. Thịt dư trong tai: 'Nhĩ trĩ' (như trái anh đào/vú dê), 'Nhĩ tầm' (đầu to chân nhỏ như nấm), 'Nhĩ đĩnh' (nhỏ dài như hột táo, đau) — đều do Can kinh nộ hỏa, Thận kinh tướng hỏa, Vị kinh tích hỏa uất kết. Mủ tai: vàng = 'Minh nhĩ/Nhĩ thấp'; trắng = 'Triền nhĩ'; đỏ = 'Nhĩ phong độc' — do Túc Thiếu âm/Thủ Thiếu dương phong nhiệt thượng ủng, Can Đởm thấp nhiệt, hoặc Thận hư tướng hỏa thượng công. " +
        "VỌNG MŨI: mũi là khiếu của Phế, thuộc Tỳ kinh, liên hệ Túc Dương minh Vị kinh ('Ngũ sắc quyết vu minh đường, minh đường giả tỵ dã'). Ngũ sắc chủ bệnh: đầu mũi xanh = đau bụng; vàng = lý có thấp nhiệt; trắng = vong huyết; đỏ = Phế Tỳ kinh nhiệt; hơi đen = có thủy khí; minh nhuận = không bệnh/gần khỏi; vàng đen khô héo = Tỳ hỏa tân khô (ác tính). Lỗ mũi khô táo = Dương minh nhiệt chứng; khô đen như muội than = dương độc nhiệt thâm; lạnh trơn sắc đen = âm độc lãnh cực. Hình thái: sưng = tà khí thịnh; sưng đỏ mọc nhọt = huyết nhiệt; nghẹt mũi = nhiệt khách Dương minh kinh; trĩ mũi (thịt dư như hạt lựu) = Phế khí nhiệt cực hoặc phong thấp uất trệ lâu ngày; mũi 'tửu tra' (bã rượu, nhiều mụn hạt nhỏ) = huyết nhiệt nhập Phế; cánh mũi phập phồng mới phát = nhiệt tà phong hỏa ủng tắc Phế tạng (kèm đổ mồ hôi = Phế nhiệt).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Miệng Môi, Răng Lợi, Họng Hầu",
      category: cat,
      summary: "Tỳ khai khiếu ở miệng, kỳ hóa tại môi; Vị kinh vòng quanh môi. Răng là 'biểu hiện của Thận, căn bản của Cốt'. Họng hầu là cửa ngõ Phế Vị.",
      content:
        "MIỆNG MÔI: sắc chẩn giống ngũ sắc chẩn vùng mặt (niêm mạc môi mỏng trong nên biến đổi rõ). Hồng nhuận = bình thường (Vị khí sung túc, khí huyết điều hòa). Trắng nhợt = huyết khuy (mất máu nhiều). Hồng nhạt = hư/hàn (huyết hư hoặc khí huyết lưỡng hư). Đỏ thẫm = thực/nhiệt (khô = nhiệt thịnh thương tân; sưng khô = nhiệt cực; đỏ như trái anh đào = ngộ độc CO2). Xanh đen: hồng nhạt hơi đen = hàn thịnh; xanh đen = lạnh cực; xanh = khí trệ huyết ứ (chủ đau); thâm tím = uất nhiệt; quanh miệng đen = Thận tuyệt. Hình thái: khô nứt = tân dịch tổn thương (ngoại cảm táo nhiệt, Tỳ nhiệt, âm hư); chảy dãi = Tỳ hư thấp thắng hoặc Vị có nhiệt; miệng chúm co giật không bú (trẻ sơ sinh) = 'tề phong' (uốn ván/nhiễm trùng rốn); miệng há không đóng = hư, Tỳ tuyệt; nhân trung đầy môi lật ra = Tỳ dương tuyệt; nhân trung ngắn môi teo không phủ kín răng = Tỳ âm tuyệt; lở đẹn trắng cào lộ màng đỏ đau = dương vượng âm hư hoặc Tỳ kinh thấp nhiệt nội uất; ngứa sưng đỏ nứt chảy nước đau như đốt = Dương minh Vị kinh hỏa thượng công. " +
        "RĂNG LỢI: 'Xỉ giả Thận chi tiêu, Cốt chi bản dã' — răng liên quan Thận, Vị, Đại trường qua kinh mạch Dương minh. VỌNG XỈ: răng sạch trắng nhuận = tân dịch nội sung, Thận khí sung túc. Vàng khô = nhiệt thịnh thương tân (giai đoạn cao điểm nhiệt bệnh); sáng khô như đá = Dương minh nhiệt thịnh; khô như xương = Thận âm khô kiệt. Cắn răng nghiến lợi = thấp nhiệt động phong (sắp thành kinh bệnh); cắn không nghiến = Vị nhiệt; cắn mà mạch hư = Vị khí bất túc cân mạch thất dưỡng; cắn chặt khó há = phong đàm trở lạc hoặc nhiệt thịnh động phong; ngủ nghiến răng = phong nhiệt hoặc tích trệ. Răng lung lay thưa, chân răng lộ = Thận hư hoặc hư hỏa thượng viêm; trẻ em răng rụng lâu mọc = Thận khí khuy; bệnh nặng răng vàng khô rụng = cốt tuyệt; nướu lở răng rụng ('xỉ cam') = triệu chứng nặng. XEM LỢI: trắng nhạt = huyết hư huyết thiểu; teo sắc nhạt = Vị âm bất túc hoặc Thận khí hư; sưng đỏ = Vị nhiệt thượng viêm; đường màu lam ở lợi-răng = nhiễm độc chì; chảy máu chân răng sưng đỏ = Vị nhiệt thương lạc mạch; không đau đỏ mà hơi sưng = khí suy hoặc Thận hỏa thương lạc. " +
        "HỌNG HẦU: bình thường hồng nhạt nhuận, không sưng đau, hô hấp/phát âm/nuốt thông suốt. Sưng đỏ đau, lở loét/mủ vàng trắng ('Nhũ nga') = Phế Vị nhiệt độc ủng thịnh; đỏ kiều nộn không sưng đau nhiều = Thận thủy khuy thiểu âm hư hỏa vượng. Hơi sưng đỏ nhạt = đàm thấp ngưng trệ; hồng nhạt không sưng hơi đau hay tái phát/họng ngứa ho khan = khí âm lưỡng hư hư hỏa thượng phù. Lở loét đỏ sưng xung quanh = thực chứng (nông tản mạn = Phế Vị nhiệt nhẹ; thành mảng = hỏa độc ủng thịnh); lở lâu quanh hồng nhạt = hư chứng (nông = hư hỏa thượng viêm; mảng = khí huyết bất túc Thận âm hư tổn tà độc nội hãm). Giả mạc: lỏng dày dễ cạo, tróc rồi mọc lại = Vị nhiệt; giả mạc chắc khó cạo, cạo chảy máu không mọc lại = bạch hầu nặng (Phế Vị nhiệt độc thương âm). Dịch mủ vàng đặc = thực chứng; loãng/dơ đục = chính khí hư không thắng tà.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 5 chủ đề Chẩn đoán học YHCT batch 2 (Vọng Hình Thái, Đầu Mặt Cổ Tóc, Mắt, Tai-Mũi, Miệng-Răng-Họng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

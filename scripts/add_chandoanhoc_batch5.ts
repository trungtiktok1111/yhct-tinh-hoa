// Chẩn đoán học YHCT batch 5 (lấp khoảng trống): Vọng Hạ Khiếu (Tiền âm, Hậu
// âm), Vọng Bì Phu (da — sắc trạch, ban chẩn, rôm sảy, ung/thư/đinh/tiết),
// Vọng Lạc Mạch trẻ em + Xem móng. Dòng 298-392 của dump (paragraph 385-491
// gốc). Trích trung thực, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 1 Vọng chẩn: Vọng Hạ Khiếu, Vọng Bì Phu, Vọng Lạc Mạch trẻ em, Xem móng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Hạ Khiếu — Tiền âm, Hậu âm",
      category: cat,
      summary: "Hạ khiếu gồm Tiền âm (liên quan Can Đởm Thận Bàng quang, Thái âm-Thiếu âm-Quyết âm-Thiếu dương-Dương minh, Nhâm Đốc mạch) và Hậu âm (liên quan Phế, Tỳ Vị qua trực tràng đại tràng).",
      content:
        "NGUYÊN LÝ: Thận khai khiếu ở nhị âm. Tinh khiếu thông Thận; âm hộ thông Bào cung và Thận; niệu khiếu thông Bàng quang. Tiền âm là nơi tụ tông cân, nơi hợp Thái âm-Dương minh; kinh mạch Can Đởm đi qua bộ phận sinh dục ngoài — nên Tiền âm liên quan mật thiết Can Đởm Thận Bàng quang và các kinh Thái âm/Thiếu âm/Quyết âm/Thiếu dương/Dương minh, cũng liên quan Nhâm Đốc mạch. Hậu âm (giang môn) thông trực tràng đại tràng nên liên quan Phế và Tỳ Vị. " +
        "TIỀN ÂM: Âm thũng (âm nang sưng không ngứa không đau) — ngồi đất cảm phong thấp, hoặc thủy thũng nặng. 'Thủy sán' (sưng căng bóng trong). Sưng to không bóng trong, không cứng — đa số sa ruột. Cao hoàn (tinh hoàn) sưng đau — 'Sán chứng' (7 loại: khí/huyết/cân/đồi/hàn/thủy/hồ) do Can khí uất, nhiễm hàn thấp nhiệt, khí suy, hoặc đứng lâu đi nhiều. 'Âm túc' (dương vật/âm nang/âm hộ co vào bụng) — hàn ngưng kinh lạc, hoặc ngoại cảm nhiệt bệnh nhiệt nhập Quyết âm làm âm dinh đại tổn thương tông cân — gặp ở âm dương hư cực độ, nguy hiểm. Sa tử cung — trung khí bất túc, Tỳ hư hạ hãm. Trẻ em: âm nang chắc màu đỏ hơi tím = khí sung hình túc (khỏe mạnh); âm nang nhẽo thòng/trắng = khí huyết suy, cơ thể nhiều bệnh. " +
        "HẬU ÂM: Nứt hậu môn (đau sau đại tiện, chảy máu) — Đại trường nhiệt kết phân cứng. Trĩ lậu/dò hậu môn (trĩ lở lâu không lành) — trường nội có thấp-nhiệt-phong-táo tương hợp. Thoát giang/sa trực tràng (nhẹ: lồi ra tự rút; nặng: khó co rút) — trung khí bất túc khí hư hạ hãm (thường gặp người già, trẻ em, sản phụ sau sanh, hoặc kiết lỵ lâu ngày).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Bì Phu (Da) — sắc trạch, ban chẩn, rôm sảy, ung thư đinh tiết",
      category: cat,
      summary: "Da là hàng rào vệ khí, trong hợp Phế. Vọng da gồm sắc trạch (đỏ/vàng/đen), nhuận khô, thũng trướng, ban-chẩn (sởi/phong chẩn/ẩn chẩn), rôm-sảy-bóng nước, và 4 loại tổn thương ngoại khoa Ung-Thư-Đinh-Tiết.",
      content:
        "NGUYÊN LÝ: da là nơi vệ khí vận hành, trong hợp Phế tạng; là nơi đầu tiên tiếp nhận ngoại tà; bệnh biến khí huyết tạng phủ cũng phản ánh qua kinh lạc ra da. " +
        "SẮC TRẠCH: Da đỏ — 'Đan độc' (như thoa đan, di chuyển vô định hoặc phù sưng đau) do đàm hỏa thiên kháng phong nhiệt thừa cơ (trẻ nhi liên quan thai độc); cục bộ gọi 'Lưu hỏa' (vd chi dưới đỏ sưng = Thận hỏa độc uẩn thấp nhiệt hạ chú). Da vàng — hoàng đản (da/mắt/móng vàng): Dương hoàng (vàng tươi như vỏ quýt, mồ hôi/nước tiểu vàng thẫm, khát, rêu vàng nê — Tỳ Vị/Can Đởm thấp nhiệt); Âm hoàng (vàng tối như ám khói, úy hàn, miệng lạt, rêu vàng nê — hàn thấp khốn Tỳ Vị). Da đen — 'Hắc đản' (vàng hiện đen, tối ám — từ hoàng đản chuyển biến do sắc dục quá độ thương Thận, gọi 'Nữ lao đản'). " +
        "NHUẬN KHÔ: da nhuận = Thái âm khí sung thịnh; khô còng sơ sác = Thái âm khí suy. Da nhăn lông rụng = Phế tổn; da khô lông tóc gãy = Phế tuyệt. Da khô như vẩy cá ('cơ phu giáp thác') + hốc mắt đen = Can huyết khô (kèm đau dữ dội = sinh ung mủ). " +
        "THŨNG TRƯỚNG: Thũng (phù mặt/đầu/ngực/bụng/lưng/tứ chi) khác Trướng (chỉ bụng phình = cổ trướng). Thũng trướng mà khuyết bồn phẳng/lòng bàn chân phẳng/lưng phẳng/rốn lồi/môi đen = khó chữa. " +
        "BAN CHẨN: Ban (mảng đỏ phẳng không cảm giác) — Dương ban: ôn bệnh tà nhập dinh/huyết phần, nhiệt uất Phế Vị thấu ra cơ biểu (từ cơ nhục ra = ban, từ huyết lạc ra = chẩn); mọc thưa đỏ ở ngực bụng trước lan tứ chi + sốt lui + tỉnh táo = thuận nhẹ; mọc dày đỏ/tím đen ở tứ chi trước lan ngực bụng + sốt không hạ + hôn muội = nghịch nặng (chính bất thắng tà). Âm ban — nội thương khí huyết khuy hư, to nhỏ không đều, hồng nhạt/tím tối, không ở đầu mặt lưng, thần trí tỉnh, mạch tế nhược tay chân lạnh = hư chứng. Chẩn (nhô cao, ráp tay): Ma chẩn/sởi (trẻ em, trước phát ban ho/sổ mũi/chảy nước mắt/tai lạnh/đường chỉ đỏ sau tai, sốt 3-4 ngày chẩn xuất hiện đầu→ngực bụng→tứ chi; thuận chứng: sốt nhẹ có mồ hôi chẩn đỏ nhuận lặn dần; nghịch chứng: sốt cao không mồ hôi chẩn không thấu phát/đỏ nhạt tối hoặc tím ám/trắng không đỏ — nếu lặn đột ngột + hôn mê + suyễn = độc chẩn nội hãm). Phong chẩn (phong nhiệt thời tà, nhỏ thưa hồng nhạt ngứa, lúc phát lúc ngưng). Ẩn chẩn (dinh huyết hư + phong tà trúng kinh lạc, lúc ẩn lúc hiện, ngứa gãi thành dề, đỏ nhạt lẫn trắng). " +
        "RÔM SẢY BÓNG NƯỚC: Rôm (thử thấp/thấp ôn, bóng nước nhỏ trắng trong — thấp uất hãn xuất không triệt để; trắng trong sáng tư nhuận = thuận; tối khô = nghịch tân dịch khô kiệt). Sảy (hạt nhỏ đỏ đầu ngứa đau, mùa hè, trẻ em/người mập — thấp nhiệt tà uất cơ phu). Nhiệt khí sang (bóng nước nhỏ từng đám, ngứa nóng rát, quanh môi/mi mắt/sinh dục — phong nhiệt độc trở trệ Phế Vị, thấp nhiệt hun chưng). Triền yêu hỏa đơn/Zona (ngực bụng sườn, nóng rát đau châm chích rồi bóng nước từng đám — Can hỏa vọng động, thấp nhiệt hun chưng). Thấp chẩn/Mạn dâm sang (hồng ban→sưng ngứa/bóng nước→lở loét→khô mày→sẹo lâu hết — thấp nhiệt lưu bì phu, hoặc bệnh lâu hao huyết sinh phong hóa táo). " +
        "UNG THƯ ĐINH TIẾT (ngoại khoa): Ung (sưng to đỏ chắc nóng đau — dương chứng, thấp nhiệt hỏa độc nội uẩn khí huyết ứ trệ nhiệt thịnh nhục hủ). Thư (sưng tròn không đầu, da không đổi màu, không nóng, ít đau — âm chứng, khí huyết hư hàn đàm ngưng trệ hoặc ngũ tạng phong độc tích nhiệt nội hãm cân cốt). Đinh (nhỏ như hạt gạo, chân chắc sâu, tê/ngứa, đầu trắng đau — nặng hơn sang/tiết; 'Hồng tơ đinh'/'Đinh độc tẩu hoàng' nếu có đường chỉ đỏ lan từ ngoài vào = hỏa nhiệt độc xuyên kinh mạch nội công, nguy hiểm). Tiết (mọc nông nhỏ tròn sưng nóng đỏ đau nhẹ, dễ hóa mủ dễ lành — thử thấp trở cơ phu hoặc tạng phủ uẩn tích thấp nhiệt).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Lạc Mạch trẻ em (chỉ văn) và Xem móng",
      category: cat,
      summary: "Vọng lạc mạch ngón trỏ (dưới 3 tuổi) — tam quan Phong/Khí/Mệnh biện độ nông sâu của tà khí. Xem móng (ngoại hầu của Can Đởm) đoán biết khí huyết.",
      content:
        "VỌNG LẠC MẠCH NGÓN TRỎ (trước gọi 'chỉ văn', dùng cho trẻ dưới 3 tuổi vì mạch bộ ngắn khó bắt mạch, da mỏng lạc mạch dễ lộ): lạc mạch là nhánh của Thủ Thái âm Phế kinh (cùng nguồn với Ngư tế). TAM QUAN: đốt 1 = Phong quan (từ khớp bàn-ngón đến chỉ ngang đốt 2); đốt 2 = Khí quan; đốt 3 = Mệnh quan (đến đầu ngón). Thủ pháp: tay trái giữ ngón trỏ bé, ngón cái phải miết từ Mệnh quan xuống Khí quan rồi Phong quan vài lần cho lạc mạch lộ rõ. " +
        "TAM QUAN BIỆN NẶNG NHẸ: hiện ở Phong quan = tà mới nhập lạc, bệnh nông nhẹ; thấu lên Khí quan + màu sẫm = tà nhập kinh, bệnh nặng; hiện rõ ở Mệnh quan = tà nhập tạng phủ, nguy hiểm tính mạng; 'thấu quan xạ giáp' (lạc mạch đi thẳng tới đầu ngón) = cực kỳ hiểm nghèo, dự hậu xấu. " +
        "HÌNH SẮC CHỦ BỆNH: bình thường — hồng nhạt pha vàng, trong phạm vi Phong quan, phù lộ, 1 nhánh vừa phải (nóng thì to dài, lạnh thì co nhỏ; trẻ 1 tuổi dài hơn, theo tuổi ngắn lại). Phù/Trầm: phù (hiện rõ) = bệnh tại biểu; trầm (không rõ) = bệnh tại lý. Sâu/Cạn: đậm = bệnh nặng; cạn = nhẹ; nhạt = hư; trệ = thực; không thấy đậm/nhạt (dương khí không đạt tứ chi mạt đoạn) = âm dương bạo thoát; thâm trệ = bế chứng tà hãm Tâm bào khí huyết uất bế. Sắc: tím đỏ = nội nhiệt; đỏ tươi = ngoại cảm biểu chứng; xanh = phong hoặc đau; nhạt = hư; tím đen = huyết lạc bế uất (nguy hiểm). Hình trạng: dài ra = bệnh nặng dần; ngắn lại = bệnh lui (ngoại lệ: tân thương dịch kiệt khí âm lưỡng hư cũng ngắn lại dưới Phong quan; âm hư dương phù lại dài ra). To = nhiệt/thực chứng; nhỏ = hàn/hư chứng; 1 nhánh hơi xéo = nhẹ; cong nhiều nhánh tròn = nặng thực chứng. " +
        "XEM LẠC MẠCH NGƯ TẾ: Ngư tế thuộc Thủ Thái âm Phế kinh, nguyên lý giống 'Độc thủ thốn khẩu' thiết chẩn — khí huyết trong lạc mạch do Tỳ Vị hóa ra nên xem Ngư tế cũng là xem Vị khí. 'Mạch sắc xanh tắc hàn mà thống, xích tắc hữu nhiệt' (Linh khu). Vị trung hữu hàn → lạc mạch Ngư tế xanh (xanh ngắn đỏ = thiểu khí, hư chứng); Vị trung nhiệt → đỏ. " +
        "XEM MÓNG (trảo giáp — phần dư của Cân, ngoại hầu của Can Đởm; Can tàng huyết chủ sơ tiết): bình thường hồng nhuận, cứng hình vòng cung, quang trạch, ấn-buông phục hồi huyết sắc nhanh (khí huyết thông suốt). Thâm hồng = khí phần hữu nhiệt. Vàng = hoàng đản (thấp nhiệt hun chưng). Nhạt = huyết hư hoặc khí huyết lưỡng hư. Nhợt nhạt = hư hàn (Tỳ Vị dương hư). Tím đen = huyết ứ/huyết ngưng (tử chứng). Xanh = hàn chứng. Ấn trắng buông phục hồi chậm = huyết ứ/khí trệ; không hồng lại = huyết hư. 'Phản giáp' (móng dẹt/lõm) = Can huyết bất túc. Móng khô = tý bệnh cốt thống; nhợt nhạt mà khô = Can nhiệt.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề Chẩn đoán học YHCT batch 5 (Tiền âm-Hậu âm, Vọng Bì Phu, Vọng Lạc Mạch trẻ em + móng) — lấp khoảng trống bị bỏ sót.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

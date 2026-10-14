// Chẩn đoán học YHCT batch 3: Xem chất bài tiết (đàm/nước mũi/diên/thoá/vật
// nôn) + VỌNG THIỆT phần 1 (ý nghĩa, nguyên lý, phương pháp, vọng chất lưỡi:
// thần-sắc-hình). Dòng 400-550 của dump. Trích/diễn giải trung thực, không
// bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 1 Vọng chẩn: Xem chất bài tiết, Vọng Thiệt (ý nghĩa, nguyên lý, chất lưỡi)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Xem chất bài tiết — đàm, nước mũi, nước dãi, nước bọt, vật nôn",
      category: cat,
      summary: "Tính chất đàm, nước mũi, nước dãi/nước bọt, và vật nôn đều phản ánh hàn/nhiệt/đàm/thấp/hư/thực của tạng phủ liên quan (chủ yếu Phế, Tỳ Vị).",
      content:
        "ĐÀM VÀ NƯỚC MŨI: đàm trong loãng kèm đốm xám đen = hàn đàm (hàn thương dương khí, khí bất hóa tân, thấp tụ thành đàm). Đàm trong loãng nhiều bọt = phong đàm (Can phong kèm đàm thượng nhiễu, kèm mặt xanh chóng mặt tức ngực suyễn cấp). Đàm trắng trơn lượng nhiều dễ khạc = thấp đàm (Tỳ hư bất vận thủy thấp). Đàm ít dính khó khạc = táo đàm (nặng hơn thì ho khan không đàm — táo thương Phế). Đàm lẫn máu đỏ tươi = nhiệt thương Phế lạc (gặp ở âm hư hỏa vượng). Ho khạc đàm máu mủ tanh hôi/nôn đàm mủ như cháo = Phế ung (nhiệt tà phạm Phế, nhiệt độc lưu lâu nhục hủ thành mủ). Ho khạc nước dãi bọt, há miệng thở = Phế nuy. Nước mũi đục = ngoại cảm phong nhiệt; trong = ngoại cảm phong hàn; đục chảy không dứt = tỵ uyên (viêm xoang). " +
        "NƯỚC DÃI (diên) VÀ NƯỚC BỌT (thoá): chảy nước dãi trong = Tỳ lạnh; khạc nhổ dãi đặc = Tỳ nhiệt; miệng nhiều dãi = Tỳ Vị hư hàn; dãi dính = Tỳ Vị thấp nhiệt. Dãi chảy dài khóe miệng, nhiều lúc ngủ = Tỳ khí hư không thu nhiếp, hoặc trẻ em Vị nhiệt trùng tích. Nhổ nước bọt nhiều = Vị trung hữu hàn/tích lãnh/thấp trệ/túc thực, hoặc Thận hàn/Thận hư. " +
        "VẬT NÔN (do Vị khí thượng nghịch): nôn trong loãng không mùi = hàn ẩu (Vị dương bất túc, thủy ẩm nội đình — đa số Tỳ Thận dương hư hoặc hàn tà phạm Vị). Nôn đồ ăn thối chua hôi = nhiệt ẩu (tà nhiệt phạm Vị hoặc Can kinh uất hỏa). Nôn chua kèm thức ăn không tiêu = thực tích (bạo ẩm bạo thực tổn thương Tỳ Vị); nôn không chua hôi, lúc phát lúc nghỉ = khí trệ (Can uất phạm Vị). Nôn nước trong đàm dãi, miệng khô không thích uống, rêu nê, tức ngực = đàm ẩm (Tỳ thất kiện vận). Nôn nước vàng xanh vị đắng = Can Đởm thấp nhiệt/uất nhiệt, Can khí hoành nghịch phạm Vị, nhiệt bức đởm trấp tràn ra. Nôn máu tươi/máu cục lẫn đồ ăn = Vị tích nhiệt, Can hỏa phạm Vị, hoặc ứ huyết cũ, huyết bất quy kinh; nôn máu kèm mủ = Vị ung.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Thiệt — ý nghĩa, nguyên lý, và phương pháp khám lưỡi",
      category: cat,
      summary: "Thiệt chẩn (xem lưỡi) là phương pháp chẩn đoán đặc thù của YHCT, phản ánh khách quan thịnh suy chính khí, vị trí/tính chất tà khí, tiến triển bệnh. Lưỡi liên hệ tạng phủ qua kinh lạc, đặc biệt mật thiết với Tâm và Tỳ Vị.",
      content:
        "Ý NGHĨA LÂM SÀNG: mọi phép biện chứng (bát cương, bệnh nhân, tạng phủ, lục kinh, vệ khí dinh huyết, tam tiêu) đều lấy thiệt tượng làm tiêu chuẩn. 4 công dụng: (1) Phán đoán chính khí thịnh suy — chất lưỡi hồng nhuận = khí huyết thịnh vượng; lưỡi bóng không rêu = vị khí suy bại hoặc vị âm khô kiệt ('sát thiệt khả chiêm chính chi thịnh suy, nghiệm thái dĩ tri tà chi xuất nhập'). (2) Phân biệt vị trí bệnh nông sâu — rêu mỏng = bệnh nông mới phát tại biểu; rêu dày = tà nhập lý; lưỡi đỏ thẫm = nhiệt nhập dinh huyết, bệnh vị sâu nguy hiểm. (3) Phân biệt tính chất tà khí — rêu vàng chủ nhiệt tà; rêu trắng hoạt chủ hàn tà; rêu hủ nê = thực tích đàm trọc; rêu vàng dày nê = thấp nhiệt; lưỡi lệch = phong tà; ứ ban ứ điểm = huyết ứ. (4) Phán đoán tiến triển bệnh — rêu trắng→vàng→xám đen = tà từ biểu nhập lý, bệnh nặng dần, hàn chuyển nhiệt; rêu nhuận→táo = nhiệt thịnh thương tân; rêu dày→mỏng, táo→nhuận = bệnh lui, tân dịch hồi phục. " +
        "QUAN HỆ VỚI TẠNG PHỦ: (1) qua tuần hoàn kinh lạc/kinh cân — Thủ Thiếu âm Tâm kinh biệt đến lưỡi; Túc Thái âm Tỳ kinh liên hệ trực tiếp (phân tán dưới lưỡi); Túc Thiếu âm Thận kinh kẹp lưỡi; Túc Quyết âm Can kinh lạc tới lưỡi. (2) Tâm và Tỳ Vị quan hệ mật thiết nhất — lưỡi là miêu khiếu của Tâm, ngoại hầu của Tỳ, rêu lưỡi do Vị khí hun chưng; chất lưỡi có hệ mạch máu phong phú liên quan Tâm chủ huyết mạch; lưỡi linh hoạt tạo tiếng nói liên quan Tâm chủ thần chí. (3) Tỳ Vị (hậu thiên chi bản) + Thận (tiên thiên chi bản, tinh ngũ tạng lục phủ quy tàng tại Thận) → tinh khí ngũ tạng lục phủ đều có thể phản ánh trên lưỡi. PHÂN BỐ TẠNG PHỦ TRÊN LƯỠI: (a) theo Vị kinh — đầu lưỡi=thượng quản, giữa=trung quản, gốc=hạ quản; (b) theo ngũ tạng — đầu lưỡi=Tâm Phế, rìa lưỡi=Can Đởm (trái=Can, phải=Đởm), giữa=Tỳ Vị, gốc=Thận. " +
        "PHƯƠNG PHÁP KHÁM: cần ánh sáng tự nhiên đủ sáng (tránh gay gắt/phản xạ màu); tư thế ngồi thẳng, há miệng, le lưỡi tự nhiên (tránh căng/cuộn/dùng sức lâu gây giả tượng); thứ tự cố định (rêu trước: có/không, dày/mỏng, nhuận/táo — rồi chất lưỡi: sắc, ban điểm, lão nộn, gầy béo, động thái — từ đầu đến gốc lưỡi); lưu ý ẩm thực có thể nhuộm màu rêu (sữa→trắng; dầu thực vật→vàng trắng giả hủ nê); mùa/thời gian ảnh hưởng (hè rêu dày vàng nhạt, thu mỏng khô, đông thấp nhuận; sáng sớm dày, sau ăn mỏng lại); tuổi tác/thể chất (già dễ nứt/teo gai; trẻ em dễ mảng trắng/rêu bong; mập lưỡi to nhạt, gầy lưỡi đỏ); có thể cạo/chùi lưỡi để kiểm tra rêu có gốc hay không và khả năng tái sinh. NỘI DUNG: chất lưỡi (thiệt thể — xem Thần, Sắc, Hình, Thái) và rêu lưỡi (xem chất rêu + sắc rêu). Lưỡi bình thường = 'Đạm hồng thiệt, trắng mỏng rêu' (lưỡi hồng nhạt mềm mại linh hoạt, rêu trắng mỏng đều có gốc, không khô không ướt không dính).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng chất lưỡi — Thiệt sắc (5 màu) và các hình dạng lưỡi",
      category: cat,
      summary: "5 màu lưỡi (nhạt trắng, hồng/đỏ, đỏ thẫm, tím, xanh) và các hình dạng (bệu/gầy/sưng/nứt/điểm-thích/dấu răng/trùng thiệt...) đều có ý nghĩa chẩn đoán riêng.",
      content:
        "THIỆT THẦN: chất lưỡi vinh nhuận hồng hoạt có sinh khí = hữu thần (bệnh nhẹ dù có bệnh); khô khốc cứng đờ mất quang trạch = vô thần (triệu chứng nặng). " +
        "THIỆT SẮC (5 màu): (1) Nhạt trắng (đạm bạch) — dương khí bất túc, sinh hóa âm huyết giảm; chủ hư chứng, hàn chứng, khí huyết lưỡng hư (nhạt trắng thấp nhuận bệu nộn = dương hư hàn chứng; nhạt trắng mà gầy mỏng = khí huyết lưỡng hư). (2) Hồng thiệt (đỏ, do 'huyết đắc nhiệt tắc hành') — chủ nhiệt chứng (đỏ tươi + nhú gai/rêu vàng dày = thực nhiệt; đỏ tươi ít rêu/nứt/nhẵn không rêu = hư nhiệt). (3) Giang thiệt (đỏ thẫm) — ngoại cảm: đỏ thẫm/điểm đỏ/mọc gai = ôn bệnh nhiệt nhập dinh huyết; nội thương: đỏ thẫm ít/không rêu hoặc nứt = âm hư hỏa vượng; đỏ thẫm ít rêu mà tân nhuận = huyết ứ. (4) Tử thiệt (tím) — đỏ thâm tím khô ít tân = nhiệt thịnh thương tân khí huyết úng trệ; nhạt tím/xanh tím thấp nhuận = hàn ngưng huyết ứ. (5) Thanh thiệt (xanh, như lưỡi trâu) — âm hàn tà thắng dương khí uất, huyết ngưng ứ trệ; chủ hàn ngưng dương uất huyết ứ (toàn bộ xanh = hàn tà trực trúng Can Thận; rìa lưỡi xanh + khô miệng chỉ muốn súc miệng không muốn uống = huyết ứ bên trong). " +
        "HÌNH DẠNG LƯỠI: Lão/Nộn — lão (vân thô, cứng cáp già) = thực chứng bất kể sắc gì; nộn (vân nhỏ mịn, phù mập nõn) = hư chứng. Bệu đại (to đầy miệng) — thủy thấp đàm ẩm trở trệ (nhạt trắng bệu + rêu ướt = Tỳ Thận dương hư tích thủy đình ẩm; nhạt hồng bệu + rêu vàng nê = Tỳ Vị thấp nhiệt đàm trọc). Thũng trướng (sưng đầy miệng không khép được) — 3 nguyên nhân: Tâm Tỳ có nhiệt (đỏ sưng đau), nghiện rượu + ôn nhiệt bệnh (tím sưng), hoặc trùng độc/huyết lạc ứ tắc tiên thiên (tím sưng to như u mạch máu). Gầy mỏng (sấu bạc) — khí huyết âm dịch bất túc (nhạt = khí huyết lưỡng hư; đỏ thẫm khô táo = âm hư hỏa vượng). Điểm/Thích (chấm màu/gai nhú) — nhiệt độc tích thịnh nhập huyết phần (hồng điểm = ôn độc nhập huyết/thấp nhiệt uẩn huyết; bạch điểm = Tỳ Vị khí suy bị nhiệt độc công, báo trước lở loét; hắc điểm = nhiệt huyết nặng khí huyết úng trệ). Ứ ban (mảng xanh tím/tím đen không nhô cao) — ngoại cảm: nhiệt nhập dinh huyết sắp phát ban; nội thương: huyết ứ. Mọc gai — nhiệt tà nội kết (vị trí gai chỉ tạng nhiệt: đầu lưỡi = Tâm hỏa kháng thịnh; giữa lưỡi = Vị trường nhiệt thịnh). Lưỡi nứt — âm huyết hư không vinh nhuận bề mặt; 3 loại: đỏ thẫm nứt = nhiệt thịnh thương Tâm/âm hư dịch kiệt; nhạt trắng nứt = huyết hư bất nhuận; nhạt trắng bệu có dấu răng + nứt = Tỳ hư thấp xâm. Quang hoạt ('kính diện thiệt', bóng như kiếng không rêu) — Vị âm khô kiệt, Vị khí đại tổn (gần tuyệt); nhạt trắng quang hoạt = Tỳ Vị khí huyết lưỡng hư cực điểm; đỏ thẫm quang hoạt = Vị Thận âm dịch khô kiệt. Dấu răng — Tỳ hư không vận hóa thủy thấp (nhạt trắng thấp nhuận = hàn thấp ủng thịnh; nhạt đỏ = Tỳ hư/khí hư). Trùng thiệt/liên hoa thiệt (mạch dưới lưỡi sưng như lưỡi nhỏ) — Tâm kinh hỏa nhiệt (thường gặp trẻ em). Thiệt nục (xuất huyết lưỡi) — Tâm kinh nhiệt thịnh bức huyết, hoặc Phế Vị nhiệt/Can hỏa/Tỳ hư bất thống huyết. Thiệt ung/đinh/sang/khuẩn (các loại nhọt/lở loét/u ở lưỡi) — đa số do Tâm Tỳ hỏa độc hoặc hạ tiêu âm hư hỏa thượng phù; thiệt khuẩn (như bông cải/mào gà, lở loét hôi đau) là ác hầu (triệu chứng ác tính), mọc chậm không đau dự hậu tốt hơn. Lạc mạch dưới lưỡi xanh tím căng phồng — khí trệ huyết ứ (Can thất sơ tiết, đàm nhiệt nội trở, hoặc hàn ngưng huyết ứ).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng chất lưỡi — Hình thái (động thái) lưỡi",
      category: cat,
      summary: "Động thái bất thường của lưỡi (cứng, teo liệt, run, lệch, thè/liếm, ngắn, dài không rụt, tê) phản ánh trúng phong, động phong, hư tổn khí huyết/tân dịch.",
      content:
        "CƯỜNG NGẠNH (cứng, nói khó): (1) ngoại cảm nhiệt bệnh — nhiệt nhập Tâm bào nhiễu loạn thần, sốt cao thương tân cân mạch thất dưỡng (lưỡi đỏ thẫm); (2) nội thương — Can phong kèm đàm trở tắc liêm tuyền, hoặc Can dương thượng kháng phong hỏa thượng công (đàm trọc: lưỡi bệu rêu dày dơ; trúng phong: nhạt hồng hoặc xanh tím). " +
        "NUY NHUYỄN (mềm nhược không sức le ra): khí huyết hư, âm dịch hư tổn, cân mạch thất dưỡng. Bệnh lâu lưỡi nhạt mà nuy = khí huyết đều hư; bệnh mới lưỡi khô đỏ nuy = nhiệt thương chước tân; bệnh lâu lưỡi đỏ thẫm nuy = âm hư cực độ. " +
        "LƯỠI RUN (chiến động): hư tổn hoặc động phong — khí huyết lưỡng hư/vong dương thương tân (cân mạch thất ôn dưỡng) hoặc nhiệt cực tân thương động phong. Bệnh lâu run nhẹ = khí huyết lưỡng hư/dương hư; ngoại cảm nhiệt bệnh = nhiệt cực sinh phong hoặc ngộ độc rượu. " +
        "LƯỠI LỆCH: phong tà trúng lạc hoặc phong đàm trở lạc. " +
        "THỔ LỘNG (thè ra/liếm liên tục): Tâm Tỳ kinh nhiệt (Tâm nhiệt động phong, Tỳ nhiệt tân hao, cân mạch co cứng) — gặp ở dịch độc công Tâm hoặc chính khí sắp tuyệt (kèm lưỡi tím); lộng thiệt — báo trước động phong hoặc trẻ em chậm phát triển trí năng. " +
        "LƯỠI NGẮN (không le ra được — chứng hậu nghiêm trọng, 4 nguyên nhân): hàn ngưng cân mạch (nhạt trắng/xanh tím thấp nhuận); đàm trọc nội trở (bệu, rêu dính nê); nhiệt thịnh thương tân động phong (đỏ thẫm khô); khí huyết đều hư (nhạt trắng bệu nộn). " +
        "THIỆT TÚNG (le dài khó/không rụt lại): do cơ lưỡi giãn — đỏ thẫm trướng mãn cứng khô = thực nhiệt nội cứ/đàm hỏa nhiễu Tâm; to mà tê mất cảm giác = khí hư; le không rụt + khô không rêu = nguy kịch; le không rụt + tân nhuận = nhẹ. " +
        "LƯỠI TÊ (ma tý): dinh huyết không thượng vinh đến lưỡi — chủ huyết hư Can phong nội động hoặc phong khí kẹp đàm.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 4 chủ đề Chẩn đoán học YHCT batch 3 (Chất bài tiết, Vọng Thiệt ý nghĩa/nguyên lý, Thiệt sắc + hình dạng, Hình thái động thái lưỡi).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

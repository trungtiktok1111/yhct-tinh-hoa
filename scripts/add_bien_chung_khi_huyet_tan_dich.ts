// Thêm "Biện chứng Tinh - Khí - Huyết - Tân dịch" (ThS Võ Thanh Phong, 44 slide)
// vào Lý luận cơ bản. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Biện chứng Tinh - Khí - Huyết - Tân dịch",
      sourceType: "Bài giảng",
      authorOrOrg:
        "ThS.Bs. Võ Thanh Phong — dẫn Bành Văn Khìu & Đặng Quốc Khánh (2002), Những học thuyết cơ bản của y học cổ truyền, NXB Hà Nội; Giovanni Maciocia (2015), The foundations of Chinese medicine, Elsevier",
      locator: "44 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Biện chứng Tinh bất túc",
      category: cat,
      summary: "Tinh bất túc do tiên thiên bất túc, lao dục quá độ, mất huyết, sinh nhiều, Thận âm/Thận dương hư.",
      content:
        "Nguyên nhân Tinh bất túc: tiên thiên bất túc; lao dục quá độ; mất huyết; sinh nhiều (đẻ nhiều); Thận âm hư/Thận dương hư. " +
        "Biểu hiện ở trẻ em: xương kém phát triển, chậm đóng thóp, điếc, tinh thần trì trệ. " +
        "Biểu hiện ở người lớn: xương mềm yếu, gối yếu, hay quên, răng lung lay, tóc rụng, bạc sớm, tình dục suy giảm, lưng đau, vô sinh, vô kinh, chóng mặt, ù tai, điếc, nhìn mờ, sa sút trí tuệ. " +
        "Lưỡi nhợt (kèm Thận dương hư), lưỡi không rêu (nếu kèm Thận âm hư), mạch phù hư.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Khí hư",
      category: cat,
      summary: "Khí bất túc dẫn đến chức năng tạng phủ giảm thấp, sức đề kháng giảm; nguyên nhân do hóa sinh bất túc hoặc tiêu hao quá nhiều.",
      content:
        "Định nghĩa: Khí hư là trạng thái bệnh lý khí bất túc dẫn đến chức năng tạng phủ tổ chức giảm thấp, sức đề kháng của cơ thể giảm. " +
        "Nguyên nhân: hóa sinh bất túc (giảm tạo — liên quan Vị, Tỳ, Phế, Thận; giảm nhập); tiêu hao quá nhiều (tăng mất — hãn xuất, huyết xuất, nhiệt, tinh bất túc, nội/ngoại phong, lao nhọc). " +
        "Biểu hiện theo tạng: Vệ khí hư — sợ lạnh, tự hãn, dễ cảm ngoại tà. Tỳ khí hư không chủ tứ chi — mệt mỏi; Tỳ khí hư thanh dương không thăng — tinh thần uể oải. Tâm khí hư không chủ huyết mạch — mạch vi tế; Tâm khí hư không hành huyết — huyết ứ. Phế khí hư không chủ khí — đoản hơi. " +
        "Khí hư ảnh hưởng tạo thành và vận hành tân dịch, huyết: Khí hư → huyết hư, huyết ứ, xuất huyết; Khí hư → tân dịch bất túc, rối loạn phân bố và bài xuất tân dịch.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Khí cơ thất điều (5 loại: trệ, nghịch, hãm, bế, thoát)",
      category: cat,
      summary: "Thăng giáng xuất nhập của khí rối loạn, chia 5 loại: khí trệ, khí nghịch, khí hãm, khí bế, khí thoát.",
      content:
        "Khí cơ thất điều là rối loạn thăng giáng xuất nhập của khí — vận động của khí phản ánh qua hoạt động của tạng phủ cơ quan. " +
        "KHÍ UẤT TRỆ: lưu thông của khí không thông thoát, hoặc trì trệ, hoặc khí uất không tán gây bệnh lý. Nguyên nhân: tình chí uất không giải; tà hữu hình trở ngại khí cơ (đàm, thấp, thực tích, huyết ứ); ngoại tà xâm phạm; chức năng tạng phủ trở ngại (Can mất sơ tiết); khí hư không đủ sức thúc đẩy khí. Biểu hiện: đầy trướng, ứ huyết, thủy đình, đàm ẩm; rối loạn công năng tạng phủ (Phế khí mất tuyên túc gây ho; Can khí mất sơ tiết gây ngực sườn đầy tức). " +
        "KHÍ NGHỊCH: trạng thái khí cơ thăng nhiều giáng ít làm khí thượng nghịch. Nguyên nhân: tình chí nội thương, ngoại tà xâm phạm, đàm trọc ủng trệ, ẩm thực thất điều. Biểu hiện: Phế khí nghịch — suyễn, ho; Vị khí nghịch — nôn, nấc, ợ hơi; Can khí nghịch — khái huyết, thổ huyết. Bảng khí nghịch theo tạng phủ (bình thường → khí nghịch → triệu chứng): Vị (Giáng→Thăng: ợ hơi, nấc cục, buồn nôn, nôn); Tỳ (Thăng→Giáng: tiêu chảy, sa tạng phủ); Can (Thăng→1.Thăng quá mức/2.Hoành nghịch ảnh hưởng Vị-Tỳ-trường phủ/3.Giáng: đau đầu, chóng mặt, dễ giận, buồn nôn, tiêu chảy, phân khô, tiểu nóng rát); Phế (Giáng→Thăng: ho, suyễn); Thận (Giáng→Thăng: suyễn); Tâm (Giáng→Thăng: mất ngủ, bứt rứt). " +
        "KHÍ HÃM: chức năng thăng đề của khí giảm. Nguyên nhân: khí hư phát triển thành khí hãm. Biểu hiện: thượng khí bất túc — chất tinh vi không lên đầu mặt gây chóng mặt, ù tai, mệt mỏi; trung khí hạ hãm — sa tạng phủ. " +
        "KHÍ BẾ: xuất nhập của khí trở ngại, chủ yếu do khí uất thái quá, đi lên ủng tắc tâm não gây hôn mê hoặc ủng tắc Phế gây hô hấp khó khăn. Nguyên nhân: tình chí uất ức, ngoại tà, đàm trọc. Biểu hiện: dương khí uất bế — chân tay lạnh; Phế khí uất bế — hô hấp khó khăn, mặt xanh, môi tím. " +
        "KHÍ THOÁT: khí không giữ được bên trong, thoát ra ngoài lượng lớn gây khí hư toàn thân nghiêm trọng, chức năng đột ngột suy kiệt. Nguyên nhân: chính khí bị tà tổn thương; bệnh lâu ngày khí hư không giữ được khí; mất huyết, hãn hạ thổ quá mức. Biểu hiện: mặt trắng nhợt, mồ hôi thoát không cầm, mắt nhắm, miệng há, toàn thân buông thõng, nhị tiện không tự chủ, mạch vi tế muốn tuyệt.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Huyết hư, Huyết ứ, Huyết nhiệt, Xuất huyết",
      category: cat,
      summary: "Bệnh lý của Huyết chia 2 mặt: hóa sinh bất túc/tiêu hao quá mức (huyết hư) và vận hành thất thường (huyết ứ, huyết nhiệt, xuất huyết).",
      content:
        "Tổng quát: hóa sinh huyết bất túc hoặc tiêu hao quá mức → chức năng nhu dưỡng của huyết suy giảm → huyết hư. Vận hành huyết thất thường — chậm, nhanh, loạn, hoặc vọng hành. " +
        "HUYẾT HƯ: huyết dịch không đủ, chức năng dinh dưỡng và tư nhuận giảm dẫn đến cơ quan tạng phủ kinh mạch không được nuôi dưỡng. Nguyên nhân: mất huyết quá nhiều; không đủ nguyên liệu tạo huyết; hóa sinh bất túc (liên quan ngũ tạng — giảm tạo ở Vị, Tỳ, Phế, Tâm; giảm nhập; tăng mất do hãn xuất, huyết xuất, nhiệt, huyết ứ, phòng dục, lao nhọc). Biểu hiện: niêm nhợt, móng mất bóng; huyết hư → khí hư, tân hư; huyết hư làm tâm thần thất dưỡng, hồn không có chỗ tàng. " +
        "HUYẾT Ứ: huyết dịch chảy chậm không thông, nặng thì ứ kết đình lưu thành khối. Nguyên nhân: khí cơ uất trệ, khí hư không hành huyết; hàn ngưng, nhiệt kết, chấn thương; sản hậu ác lộ không xuống hết. Biểu hiện: đau cố định, hình thành khối cục; môi lưỡi tím, lưỡi có điểm ứ huyết; tay chân tê do khí không thông, sưng do tân dịch không vận hành. Phân biệt Khí trệ vs Huyết ứ: Khí trệ — đau căng chướng nhiều hơn đau, đau di chuyển, đau căng, tích khối lúc có lúc không, da không biểu hiện, sắc mặt không đổi, lưỡi bình thường/đỏ ít, mạch huyền. Huyết ứ — đau nhiều hơn căng chướng, đau cố định, đau nhói, tích khối luôn có, da có mảng/chấm xuất huyết, sắc mặt tối/xanh tím, lưỡi tím, mạch huyền-sáp-lao. " +
        "HUYẾT NHIỆT: trong huyết có nhiệt làm huyết chảy nhanh hơn, mạch dần to, huyết vọng hành gây xuất huyết. Nguyên nhân: ngoại cảm ôn nhiệt vào huyết phận, hàn tà vào lý hóa nhiệt; ngũ chí hóa hỏa. Biểu hiện: thuộc dương thịnh nên biểu hiện thực nhiệt; nhiệt bức huyết vọng hành gây mặt mắt đỏ, xuất huyết; huyết nhiệt nhiễu tâm thần. Biểu hiện theo tạng: Tâm — cảm giác nóng trong người, da nổi mụn nhọt đỏ, khát nước, xuất huyết, lưỡi đỏ, mạch sác, lo âu mất ngủ tinh thần không yên, loét miệng; Can — hồng ban kèm ngứa, dễ tức giận; Bào cung — kinh nguyệt lượng nhiều; Đại trường — tiêu máu. " +
        "XUẤT HUYẾT: cơ chế — Huyết ứ cản trở huyết vận hành gây huyết tràn ra ngoài mạch; Nhiệt (thực/hư) bức huyết vọng hành; Tâm âm/huyết hư không nuôi dưỡng mạch đạo làm mạch đạo không bền dễ vỡ; Huyết theo khí thượng nghịch gây nôn/ho ra máu; Khí hư (Can, Tỳ) không nhiếp được huyết; Chấn thương làm mạch đạo tổn thương, huyết xuất ra ngoài.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quan hệ Khí - Huyết trong bệnh lý",
      category: cat,
      summary: "Khí và Huyết tương hỗ: khí ôn ấm/thúc đẩy/hóa sinh/thống nhiếp huyết; huyết nhu dưỡng và là 'nhà' của khí. Các bệnh cảnh phối hợp: khí trệ huyết ứ, khí hư huyết ứ, khí không nhiếp huyết, khí theo huyết thoát, khí huyết lưỡng hư.",
      content:
        "Khí đối với Huyết: ôn ấm, thúc đẩy vận hành, hóa sinh, thống nhiếp. Không ôn ấm → huyết ứ; không thống nhiếp → xuất huyết; khí trệ → huyết ứ; khí hư → huyết hư. " +
        "Huyết đối với Khí: nhu dưỡng, là 'nhà' của khí. Không nhu dưỡng → khí thiếu hụt; mất nơi nương tựa → khí thoát; huyết ứ → khí trệ. " +
        "KHÍ TRỆ HUYẾT Ứ: vận hành của khí uất trệ không thông dẫn đến vận hành huyết dịch gặp trở ngại, xuất hiện huyết ứ. Nguyên nhân: nội thương tình chí, chấn thương. Biểu hiện: đau, ban ứ huyết, trưng hà tích tụ. " +
        "KHÍ HƯ HUYẾT Ứ: khí hư không đủ sức thúc đẩy huyết vận hành thành huyết ứ. Biểu hiện: khí hư có trước, huyết ứ dần dần sinh ra. " +
        "Các bệnh cảnh khác được nêu: khí không nhiếp huyết (gây xuất huyết), khí theo huyết thoát, khí huyết lưỡng hư.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tân dịch hao tổn bất túc và trở ngại phân bố-bài tiết",
      category: cat,
      summary: "Chuyển hóa tân dịch gồm tạo thành, phân bố, bài tiết — phụ thuộc thăng giáng xuất nhập của khí cơ và vai trò Phế/Tỳ/Thận/Bàng quang/Tam tiêu.",
      content:
        "Tổng quát: chuyển hóa tân dịch gồm tạo thành, phân bố, bài tiết; tạo thành và bài tiết phải cân bằng; phụ thuộc vận động thăng giáng xuất nhập của khí cơ. Vai trò các tạng phủ: Phế tuyên phát túc giáng; Tỳ vận hóa; Thận khí hóa; Bàng quang, Tam tiêu. " +
        "TÂN DỊCH HAO TỔN BẤT TÚC: số lượng tân dịch trong cơ thể giảm sút làm tạng phủ/cơ quan không được nhu nhuận tư dưỡng đầy đủ, gây biểu hiện khô ráo/sáp. Nguyên nhân: nhiệt thịnh thương tân; tân dịch mất quá nhiều (thổ, tả, phát hãn); bệnh lâu ngày gây hao tổn (không sinh tân, âm hư nội nhiệt) — giảm tạo ở Phế/Tỳ/Thận, giảm nhập, tăng mất (hãn xuất, huyết xuất, thực/hư nhiệt, tiêu chảy, nôn ói). Biểu hiện về Tân: tiểu vàng ít, mắt hỏm sâu, miệng khô, đại tiện khô, da khô, họng khô, ngứa da (huyết táo sinh phong). Biểu hiện về Dịch: cơ teo, da khô, lông tóc rụng, lưỡi đỏ ít rêu, co giật, run. " +
        "TRỞ NGẠI PHÂN BỐ - BÀI TIẾT: Phân bố — vận chuyển, phân tán, hoàn lưu của tân dịch trong cơ thể để tiến hành trao đổi thủy dịch, liên quan Tỳ, Phế, Tam tiêu, Can sơ tiết. Bài tiết — tân dịch sau chuyển hóa thông qua đường niệu, mồ hôi, hô hấp bài xuất ra ngoài, liên quan Phế, Thận. Biểu hiện khi trở ngại: thấp trọc khốn trở, đàm ẩm ngưng tụ, thủy ẩm tàng lưu.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quan hệ Tân dịch với Khí - Huyết trong bệnh lý",
      category: cat,
      summary: "Tân dịch, khí, huyết quan hệ mật thiết — các bệnh cảnh: thủy đình khí trệ, khí theo dịch thoát, tân khô huyết táo, tân khuy huyết ứ.",
      content:
        "THỦY ĐÌNH KHÍ TRỆ: thủy dịch đình đọng dẫn đến khí cơ trở trệ. Biểu hiện: thủy ẩm trở Phế — ngực đầy, ho, suyễn; thủy ẩm trở Tâm — loạn nhịp, đau ngực; trung tiêu — đầu nặng, mệt mỏi, chướng bụng, ăn kém ngon, nôn; tay chân — phù thũng, nặng nề, đau nhức. " +
        "KHÍ THEO DỊCH THOÁT: một lượng lớn tân dịch mất, khí mất nơi trú ngụ nên thuận theo dịch thoát ra ngoài, dẫn đến dương khí bạo thoát. Nguyên nhân: phát hãn thương tân; thổ tả nghiêm trọng. " +
        "TÂN KHÔ (KHUY) HUYẾT TÁO: tân dịch hư khuyết khô kiệt dẫn đến huyết táo hư nhiệt nội sinh, hoặc huyết táo sinh phong. Nguyên nhân: sốt cao thương tân; âm hư nội nhiệt. " +
        "TÂN KHUY HUYẾT Ứ: tân dịch khuy hao, huyết dịch vận hành không thông. Nguyên nhân: sốt cao thương tân; hoặc thổ, hoặc tả, hoặc nôn, hoặc phát hãn thương tân.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 7 chủ đề Biện chứng Tinh - Khí - Huyết - Tân dịch.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

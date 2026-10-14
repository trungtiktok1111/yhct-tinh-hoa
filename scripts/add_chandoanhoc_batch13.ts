import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 3: Biện Chứng, phần Khí Huyết Tân Dịch Biện Chứng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Khí huyết - Tân dịch";

  await prisma.theoryTopic.create({
    data: {
      name: "Khí Huyết Tân Dịch Biện Chứng - Khí Bệnh (Khí hư, Khí hãm, Khí trệ, Khí nghịch)",
      category: cat,
      summary: "4 loại chứng hầu của khí bệnh: khí hư (chức năng giảm), khí hãm (thăng đề vô lực gây sa nội tạng), khí trệ (trướng đau), khí nghịch (thăng giáng thất thường, nghịch lên).",
      content: `Biện chứng khí huyết tân dịch vận dụng lý luận tạng phủ để phân tích bệnh biến khí/huyết/tân dịch — có mối tương quan hai chiều với tạng phủ nên cần tham chiếu lẫn nhau. "Tố vấn - Cử thống luận": "Bách bệnh sinh vu khí dã" — khí bệnh phạm vi rất rộng, khái quát 4 loại: khí hư, khí hãm, khí trệ, khí nghịch.

KHÍ HƯ CHỨNG: chức năng tạng phủ cơ quan giảm, do bệnh lâu/cơ thể hư/lao động quá độ/già yếu. Biểu hiện: thiếu khí, lười nói, tinh thần uể oải mệt nhọc, hoa mắt chóng mặt, tự hạn (tăng khi vận động), lưỡi nhạt rêu trắng, mạch hư vô lực. Cơ chế: nguyên khí khuy hư → chức năng giảm → khí thiểu lười nói mệt mỏi; thanh dương bất thăng không ôn dưỡng đầu mắt → hoa mắt chóng mặt; mao khiếu lỏng lẻo → tự hạn; khí hư không cổ động huyết mạch → mạch vô lực, rêu lưỡi nhạt.

KHÍ HÃM CHỨNG: khí hư không đủ sức thăng đề mà hạ hãm — đặc trưng SA NỘI TẠNG. Thường từ khí hư phát triển thêm, hoặc lao lực tổn thương một tạng. Biểu hiện: chóng mặt hoa mắt, thiểu khí uể oải, tiêu chảy/lỵ mãn tính, bụng trì căng, thoát giang (sa trực tràng) hoặc sa tử cung, lưỡi nhạt rêu trắng, mạch nhược. Phân biệt vị trí sa: vị sa — trì trướng vùng giữa rốn-bụng; can sa — hạ sườn phải; thận sa — thiếu phúc 2 bên. Thoát giang gặp ở tiêu chảy/lỵ mãn (trung khí hạ hãm) hoặc trẻ em táo bón dùng sức nhiều. Sa tử cung đơn độc (không kèm khí suy toàn thân, ví dụ sản hậu làm việc nặng sớm) vẫn chẩn đoán khí hư hạ hãm.

KHÍ TRỆ CHỨNG: khí cơ trở trệ, vận hành không thông tại một tạng phủ/vị trí. Nguyên nhân: bệnh tà nội trở, thất tình uất kết, dương khí suy không đủ sức ôn vận. Biểu hiện: trướng muộn, đau ("trướng thống", "xuyên thống", "công thống" — đặc trưng đau của khí trệ). Nhẹ = trướng muộn; nặng = đau. Biện chứng cần tìm nguyên nhân và vị trí bệnh cụ thể (ví dụ đau ngực → tâm phế; đau sườn → can đởm; đau khớp tứ chi → kinh lạc).

KHÍ NGHỊCH CHỨNG: khí cơ thăng giáng thất thường, nghịch lên trên. Thường gặp phế vị thượng nghịch và can khí thăng phát thái quá. Biểu hiện: phế khí thượng nghịch → ho, suyễn tức; vị khí thượng nghịch → nấc cụt, ợ hơi, buồn nôn, nôn; can khí thượng nghịch → đau đầu, hoa mắt, hôn quyết, thổ huyết (huyết theo khí nghịch mà thượng dũng).`,
      keyPoints: "4 loại khí bệnh: Khí hư (chức năng giảm toàn thân), Khí hãm (sa nội tạng - đặc trưng riêng của khí hư nặng), Khí trệ (trướng đau tại chỗ), Khí nghịch (thăng giáng thất thường, nghịch lên - phế/vị/can)\nKhí hãm chứng đặc trưng bởi sa nội tạng; vị trí sa khác nhau theo tạng (vị/can/thận) giúp định vị bệnh",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Khí Huyết Tân Dịch Biện Chứng - Huyết Bệnh (Huyết hư, Huyết ứ, Huyết nhiệt, Huyết hàn)",
      category: cat,
      summary: "4 loại chứng hầu của huyết bệnh: huyết hư (toàn thân hư nhược), huyết ứ (đau cố định cự án, tím tối), huyết nhiệt (xuất huyết + nhiệt tượng), huyết hàn (lạnh đau cục bộ tay chân).",
      content: `Huyết dịch vận hành trong mạch, nuôi tạng phủ và cơ phu. Khi ngoại tà/tạng phủ thất điều ảnh hưởng chức năng huyết → bệnh chứng hàn nhiệt hư thực. 4 loại: huyết hư, huyết ứ, huyết nhiệt, huyết hàn.

HUYẾT HƯ CHỨNG: huyết dịch hư khuy, tạng phủ bách mạch thất dưỡng. Nguyên nhân: bẩm phú bất túc, tỳ vị hư nhược thiếu nguồn sinh huyết, xuất huyết cấp/mãn, bệnh lâu, tư lự hao âm huyết, ứ huyết cản trở sinh huyết mới, ký sinh trùng đường ruột. Biểu hiện: mặt trắng không tươi/vàng héo, môi móng trắng nhợt, hoa mắt chóng mặt, tâm quý thất miên, tê tay chân, phụ nữ kinh ít sắc nhạt/trễ kỳ/bế kinh, lưỡi nhạt rêu trắng, mạch tế vô lực.

HUYẾT Ứ CHỨNG: ly kinh chi huyết không kịp bài xuất/tiêu tán, ứ lại; hoặc huyết hành không thông ứ trong mạch lạc/tạng phủ. Nguyên nhân: hàn ngưng, khí trệ, khí hư, ngoại thương. Biểu hiện: đau như châm đâm/cắt, cố định cự án, đau tăng về đêm; u sưng xanh tím (chứng tích — cứng không di động); xuất huyết tái phát màu tím tối kèm huyết khối, hoặc đại tiện đen như dầu; sắc mặt đen da khô nhăn, môi móng tím tối, bụng/chân nổi gân xanh; phụ nữ bế kinh; lưỡi tím tối có ứ điểm ứ ban, mạch tế sáp. Cơ chế xuất huyết do ứ: ứ huyết trở tắc lạc mạch → huyết tuôn phá mạch → xuất huyết, huyết này không bài xuất lại đình tụ thành ứ mới → vòng xuất huyết tái phát.

HUYẾT NHIỆT CHỨNG: tạng phủ hỏa nhiệt tích thịnh, nhiệt bức huyết phần. Nguyên nhân: phiền lao, nghiện rượu, tức giận thương can, phòng thất quá độ. Biểu hiện: ho máu, thổ huyết, tiểu huyết, nục huyết (mũi/răng/lưỡi/cơ), lưỡi đỏ thẫm, mạch phù sác (huyền sác hữu lực). Vị trí xuất huyết theo tạng tổn thương: phế lạc thương → khái huyết; vị lạc thương → thổ huyết; bàng quang lạc thương → niệu huyết.

HUYẾT HÀN CHỨNG: cục bộ mạch lạc hàn ngưng khí trệ, huyết hành không thông — do cảm hàn tà. Biểu hiện: hàn thống ở tay chân, da tím tối lạnh, thích ấm ghét hàn (gặp ấm giảm đau), hoặc đau vùng thiếu phủ, hình hàn chi lãnh, kinh kỳ kéo dài sắc tím tối có huyết khối, lưỡi nhạt tối rêu trắng, mạch trầm trì sáp. Gặp ở phụ nữ sau sinh thích mát uống lạnh → hàn khách huyết mạch tử cung.`,
      keyPoints: "4 loại huyết bệnh: Huyết hư (toàn thân nhược, trắng nhợt), Huyết ứ (đau cố định cự án, tím tối - đặc trưng chẩn đoán), Huyết nhiệt (xuất huyết + nhiệt tượng, lưỡi đỏ thẫm), Huyết hàn (lạnh đau cục bộ, thích ấm)\nHuyết ứ gây xuất huyết có đặc điểm tái phát, màu tím tối kèm huyết khối - khác xuất huyết do huyết nhiệt (màu đỏ tươi, kèm nhiệt tượng)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Khí Huyết Tân Dịch Biện Chứng - Khí Huyết Đồng Bệnh (5 chứng hầu thường gặp)",
      category: cat,
      summary: "Khí huyết đồng bệnh (khí và huyết ảnh hưởng lẫn nhau): khí trệ huyết ứ, khí hư huyết ứ, khí huyết lưỡng hư, khí bất nhiếp huyết, khí tùy huyết thoát.",
      content: `Khí và huyết dựa vào nhau, trợ giúp nhau — khi bệnh thường ảnh hưởng lẫn nhau ("khí huyết đồng bệnh"). 5 chứng hầu thường gặp:

KHÍ TRỆ HUYẾT Ứ CHỨNG: khí cơ uất trệ dẫn đến huyết hành ứ trở. Do tình chí bất toại hoặc ngoại tà xâm tập → can khí uất lâu không giải. Biểu hiện: ngực sườn trướng muộn đau lan xuyên, tính tình cáu gắt, hạ sườn có u cục đau như đâm chọc cự án; phụ nữ bế kinh/thống kinh, sắc kinh tím tối có huyết khối; lưỡi tím tối hoặc có tử ban, mạch sáp. Cơ chế: khí trệ và huyết ứ là nhân quả của nhau (khí trệ trước → huyết ứ sau → ứ lại cản khí cơ → đau tăng).

KHÍ HƯ HUYẾT Ứ CHỨNG: khí hư vận hóa vô lực → huyết hành ứ trệ (hư trung kèm thực). Do bệnh lâu khí hư dẫn đến huyết ứ nội đình. Biểu hiện: sắc mặt trắng nhợt/tối trệ, mệt mỏi uể oải lười biếng, thiểu khí lười nói, đau như châm chích (thường vùng ngực sườn) cố định cự án, lưỡi nhạt tối hoặc có ứ ban, mạch trầm sáp.

KHÍ HUYẾT LƯỠNG HƯ CHỨNG: khí hư và huyết hư cùng tồn tại. Do bệnh lâu không lành, khí hư không sinh huyết hoặc huyết hư không sinh khí. Biểu hiện: hoa mắt chóng mặt, thiểu khí lười nói, sắc mặt trắng nhợt/vàng héo, tâm quý mất ngủ, lưỡi nhạt mà nộn, mạch tế nhược. Cần liên hệ tạng phủ để tìm nguyên nhân gốc.

KHÍ BẤT NHIẾP HUYẾT CHỨNG: khí hư không thống nhiếp được huyết dịch → xuất huyết. Do cửu bệnh khí hư hoặc xuất huyết mãn (khí theo huyết thoát) chuyển thành khí hư không nhiếp huyết. Biểu hiện: thổ huyết, tiện huyết, xuất huyết dưới da, băng lậu, khí đoản, uể oải vô lực, sắc mặt trắng nhợt không tươi, lưỡi nhạt, mạch tế nhược. Lưu ý: trong bệnh xuất huyết, nhiệt chứng chiếm đa số nhưng khí bất nhiếp huyết cũng gặp không ít — cần phân biệt (nhiệt: màu đỏ tươi + nhiệt tượng; khí bất nhiếp: màu nhạt + khí hư tượng).

KHÍ TÙY HUYẾT THOÁT CHỨNG: xuất huyết ồ ạt gây khí thoát kèm theo (nguy kịch). Do can/vị/phế có bệnh sẵn đột ngột vỡ mạch, ngoại thương, hoặc phụ nữ băng huyết. Biểu hiện: xuất huyết ồ ạt, đột nhiên sắc mặt tái nhợt, tay chân lạnh toát, mồ hôi đầm đìa, nặng thì hôn quyết, lưỡi nhạt, mạch vi tế muốn tuyệt hoặc phù đại mà tán. Cơ chế: huyết ra nhiều → khí mất nơi nương tựa, kéo theo thoát → dương vong (sắc mặt nhợt, tứ chi lạnh, mồ hôi đầm) + thần tán (hôn quyết). Lưu ý: xuất huyết nội (không thấy bên ngoài) cũng có thể gây khí thoát vong dương — cần đặc biệt chú ý.`,
      keyPoints: "5 chứng khí huyết đồng bệnh: khí trệ huyết ứ, khí hư huyết ứ, khí huyết lưỡng hư, khí bất nhiếp huyết, khí tùy huyết thoát (nguy kịch nhất)\nKhí tùy huyết thoát là cấp cứu: xuất huyết ồ ạt (kể cả xuất huyết nội không thấy ngoài) gây vong dương — cần nhận biết nhanh",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tân Dịch Biện Chứng - Tân Dịch Bất Túc và Thủy Thũng (Dương thủy, Âm thủy)",
      category: cat,
      summary: "Tân dịch bất túc gây khô táo toàn thân; thủy dịch đình tụ gây thủy thũng — phân biệt dương thủy (thực, phát nhanh, phù từ mặt) và âm thủy (hư, phát chậm, phù từ chân/lưng).",
      content: `Tân dịch (thủy dịch cơ thể) tư dưỡng tạng phủ, nhuận hoạt quan tiết, nhu dưỡng cơ phu — sinh ra và phân bố liên quan tỳ (vận hóa), phế (thông điều), thận (khí hóa). Bệnh biến: tân dịch bất túc và thủy dịch đình tụ.

TÂN DỊCH BẤT TÚC CHỨNG (tân khuy, tân thương — chứng nội táo): do sinh không đủ (tỳ vị hư nhược, hạn chế ăn uống, ế ách/phản vị không ăn được lâu) hoặc mất quá nhiều (nhiệt thịnh thương tân, đại hạn, thổ tả nhiều). Biểu hiện: miệng khô hầu táo, môi khô nứt, da khô không tươi, tiểu ngắn ít, đại tiện táo, lưỡi đỏ ít tân, mạch tế sác. Cơ chế: tân dịch khuy → không tư nhuận miệng hầu/da/đại trường; tân huyết khuy sinh nội nhiệt → lưỡi đỏ mạch tế sác.

THỦY THŨNG (thủy dịch đình tụ tràn ra cơ phu, mặt mắt tứ chi ngực bụng toàn thân — phù thũng): phân biệt dương thủy (thực) và âm thủy (hư) để biết hư thực.

DƯƠNG THỦY (thực chứng, do ngoại cảm phong tà hoặc thủy thấp tẩm dâm): phát bệnh nhanh mạnh, phù mi mắt/mặt trước lan toàn thân nhanh, da mỏng bóng sáng. Thể phong thủy: tiểu ngắn ít, kèm ố phong/ố hàn/sốt/đau khớp, rêu trắng mỏng mạch phù khẩn (thiên hàn) hoặc họng sưng đau lưỡi đỏ mạch phù sác (thiên nhiệt) — phế vệ bị liên lụy, tuyên giáng/thông điều thủy đạo thất thường, tam tiêu không thông. Thể thủy thấp khốn tỳ: phù toàn thân chậm hơn, ấn lõm, tay chân nặng, tiểu ít, ăn kém đầy bụng buồn ói, rêu trắng nê mạch trầm — tỳ thổ khốn đốn, vận hóa thất chức.

ÂM THỦY (hư chứng, do bệnh lâu chính khí hư/lao quyện/phòng sự bất tiết): phát bệnh chậm, phù từ chân/lưng trở xuống trước, ấn lõm chậm đầy lại (phù mềm). Thể tỳ hư: tiểu ngắn ít, bụng đầy trướng, ăn ít tiêu lỏng, sắc mặt nhợt, uể oải, tay chân nặng nề, lưỡi nhạt rêu trắng nê — tỳ không vận hóa thủy thấp. Thể thận dương hư (nặng hơn tỳ hư, phù tăng dần): tiểu không thông, lưng gối tê lạnh, tay chân không ấm, úy hàn mệt mỏi, sắc mặt nhạt trắng/xám trệ, lưỡi nhạt bệu rêu trắng hoạt, mạch trầm trì vô lực — thận dương khuy hư, bàng quang khí hóa thất tư, khai hợp không thông. Tỳ hư thủy thũng kéo dài không khỏi có thể tổn đến thận dương, chuyển thành âm thủy nặng hơn.`,
      keyPoints: "Thủy thũng: Dương thủy (thực, nhanh, từ mặt/mi mắt, da mỏng bóng, kèm biểu chứng) khác Âm thủy (hư, chậm, từ chân/lưng, phù mềm ấn lõm chậm đầy, kèm tỳ/thận dương hư)\nDương thủy 2 thể: phong thủy (ngoại cảm) và thủy thấp khốn tỳ; Âm thủy 2 thể: tỳ hư (nhẹ) và thận dương hư (nặng hơn)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tân Dịch Biện Chứng - Đàm Chứng và Ẩm Chứng",
      category: cat,
      summary: "Đàm (thủy dịch đặc ngưng kết) gây 'quái bệnh' đa dạng khắp tạng phủ kinh lạc; Ẩm (thủy dịch trong loãng) đình trệ chủ yếu tại phế/vị trường/ngực sườn.",
      content: `Đàm và ẩm là biểu hiện chức năng tạng phủ thất điều, trở ngại chuyển hóa thủy dịch — khác nhau về độ đặc.

ĐÀM CHỨNG: thủy dịch đặc, ngưng kết tại tạng phủ/kinh lạc/tổ chức. Do ngoại cảm lục dâm, nội thương thất tình dẫn đến tạng phủ thất điều sinh đàm. Biểu hiện rất đa dạng ("Tất cả mọi quái bệnh đều thuộc đàm" — cổ nhân): ho suyễn khạc đàm, đau ngực, bụng đầy bĩ, chán ăn buồn nôn nôn đàm dãi, hoa mắt chóng mặt, thần trí không tỉnh/điên cuồng, đàm khò khè trong cổ, tay chân tê dại, bán thân bất toại, tràng nhạc, bướu cổ, đàm hạch, u vú, cảm giác dị vật trong họng (mai hạch khí); rêu lưỡi trắng nê (đàm thấp) hoặc vàng nê (đàm hỏa), mạch hoạt. Căn cứ biện chứng: nôn đàm dãi, đàm minh trong họng, tay chân tê, hạch đàm, rêu nê, mạch hoạt.
Cơ chế theo vị trí: đàm trở phế → ho suyễn khạc đàm tức ngực; đàm trệ vị → bụng đầy bĩ nôn ói; đàm khiết trở thanh dương → hoa mắt chóng mặt; đàm mê tâm khiếu → thần chí mơ hồ (điên chứng do đàm trọc, cuồng chứng do đàm hỏa — khác tính chất); đàm đình kinh lạc → chi thể tê dại/bán thân bất toại; đàm ngưng dưới da cơ nhục → tràng nhạc/bướu cổ/hạch đàm/u vú/mai hạch khí.

ẨM CHỨNG: thủy ẩm trong loãng, đình trệ — chủ yếu tại phế, vị trường, ngực sườn (do chức năng tạng phủ suy thoái). Biểu hiện: ho khí suyễn tức ngực, đàm dịch trong loãng trắng lượng nhiều, khò khè trong họng, ngồi dựa không nằm được; nặng: tâm quý, phù chi dưới, bụng trướng tiếng sôi ruột lớn, nôn nước trong, ăn uống giảm; hoặc ngực sườn trướng tức đau, ho suyễn đau tăng; rêu trắng hoạt, mạch huyền.
Cơ chế theo vị trí: ẩm đình phế → phế khí thượng nghịch ho suyễn, khò khè không nằm được (bệnh dễ tái phát, kéo dài tổn tâm dương → tâm quý; tỳ vị dương hư → phù hạ chi); ẩm đình vị trường → khí cơ không thông, bụng trướng, tiếng vỗ nước/sôi ruột, nôn nước trong ăn giảm; ẩm ngưng ngực sườn → khí đạo tắc trở, ngực sườn tức trướng đau. Ẩm là âm tà chất loãng → rêu trắng hoạt; mạch huyền là mạch thường gặp của ẩm bệnh.`,
      keyPoints: "Đàm (đặc) gây bệnh đa dạng khắp cơ thể (đàm mê tâm khiếu, đàm tại kinh lạc, đàm ngưng dưới da...) — 'bách bệnh đa đàm'; Ẩm (loãng) chủ yếu khu trú ở phế/vị trường/ngực sườn\nĐàm mê tâm khiếu: điên chứng (đàm trọc) khác cuồng chứng (đàm hỏa) về tính chất và biểu hiện",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 5 chủ đề Khí Huyết Tân Dịch Biện Chứng.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

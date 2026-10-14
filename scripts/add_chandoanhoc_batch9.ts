import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 4: Thiết chẩn, phần Mạch chẩn",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Nguyên lý hình thành mạch tượng và ý nghĩa lâm sàng",
      category: cat,
      summary: "Tâm chủ huyết mạch, tông khí thúc đẩy tâm đập; phế/tỳ/can/thận đều tham gia; mạch tượng phản ánh bệnh vị, tính chất bệnh, tà chính thịnh suy và dự hậu.",
      content: `NGUYÊN LÝ HÌNH THÀNH MẠCH TƯỢNG:
Tâm chủ huyết mạch, tạng tâm đập đẩy huyết dịch trong huyết quản hình thành mạch đập. Tâm đập và huyết dịch vận hành đều nhờ tông khí thúc đẩy. "Tố vấn - Bình nhân khí tượng luận": vị chi đại lạc (hư lý) xuất ở tả nhũ hạ, động ứng thủ, là mạch của tông khí. "Linh khu - Thiên tà khách": tông khí tích ở trong ngực, ra ở hầu, để quán thông tâm mạch — chỉ rõ tông khí thúc đẩy huyết mạch vận hành.
Ngoài tâm chủ đạo, các tạng khác đều hiệp điều: Phế triều bách mạch — huyết mạch toàn thân hội tụ về phế, qua tán bố của phế khí mà huyết dịch tái phân bố toàn thân. Tỳ vị là nguồn sinh khí huyết, tỳ chủ thống huyết, tuần hành huyết dịch nhờ thống nhiếp của tỳ. Can tàng huyết chủ sơ tiết điều tiết huyết lượng tuần hoàn. Thận tàng tinh, tinh hóa khí là căn bản dương khí, nguyên động lực cho tạng phủ hoạt động, tinh cũng hóa sinh huyết. Do đó mạch tượng có quan hệ mật thiết với khí huyết các tạng phủ.

Ý NGHĨA LÂM SÀNG:
1. Phán đoán bệnh vị, tính chất bệnh và tà chính thịnh suy: Mạch phù đa số bệnh tại biểu, mạch trầm đa số bệnh tại lý (phản ánh vị trí bệnh nông sâu). Mạch trì đa số hàn chứng, mạch sác đa số nhiệt chứng (phản ánh tính chất bệnh). Mạch hữu lực/vô lực phản ánh hư thực: mạch hư nhược vô lực là hư chứng (chính khí bất túc), mạch thực hữu lực là thực chứng (tà khí kháng thịnh) — "Hư thực chi yếu, mạc đào vu mạch" (Từ Linh Thai).
2. Suy đoán bệnh tiến thoái dự hậu: bệnh lâu mạch thấy hòa hoãn — vị khí hồi phục, bệnh thoái. Hư lao thất huyết/tiêu chảy lâu mà mạch hồng — nguy hiểm (tà thịnh chính suy). Ngoại cảm nhiệt bệnh nhiệt thế dần thoái, mạch hoãn hòa — bệnh gần khỏi; mạch cấp sác phiền thao — bệnh tiến. "Cảnh nhạc toàn thư - Mạch thần": xem mạch hôm nay và ngày mai so sánh để biết tà khí tiến hay vị khí hồi phục.
3. Mạch chứng không phải lúc nào cũng tương ứng — có "Xá mạch tùng chứng" và "Xá chứng tùng mạch" (xá=bỏ, tùng=theo), cần tứ chẩn hợp tham để chẩn đoán chính xác.`,
      keyPoints: "Mạch tượng hình thành nhờ tâm chủ huyết mạch + tông khí thúc đẩy, có sự tham gia của phế/tỳ/can/thận\nPhù/trầm phản ánh biểu/lý; trì/sác phản ánh hàn/nhiệt; hữu lực/vô lực phản ánh thực/hư\nMạch tượng giúp suy đoán tiến thoái dự hậu bệnh; cần tứ chẩn hợp tham vì có lúc mạch chứng không tương ứng (xá mạch tùng chứng / xá chứng tùng mạch)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Vị trí và phương pháp chẩn mạch",
      category: cat,
      summary: "Ba cách định vị mạch (Biến chẩn/Tam bộ cửu hầu, Tam bộ chẩn pháp, Thốn khẩu chẩn pháp); thốn khẩu phân Thốn-Quan-Xích phối tạng phủ; phương pháp bắt mạch (thời gian, tư thế, chỉ pháp, cử án tầm, bình tức, đủ 50 động).",
      content: `BA CÁCH ĐỊNH VỊ CHẨN MẠCH:
1. Biến chẩn pháp (tam bộ cửu hầu trong "Tố vấn"): vị trí đầu, tay, chân (tam bộ), mỗi bộ chia thiên-địa-nhân (3 hầu) = 9 hầu. Thượng bộ (đầu): thượng=động mạch trán (hầu khí góc đầu), trung=động mạch trước tai (hầu khí mắt tai), hạ=động mạch má (hầu miệng răng). Trung bộ (tay): thượng=thủ thái âm/thốn khẩu (hầu phế), trung=thủ thiếu âm/thần môn (xem tâm), hạ=thủ dương minh/hợp cốc (khí trong ngực). Hạ bộ (chân): thượng=túc quyết âm/thái xung (xem can), trung=túc thái âm/xung dương (xem tỳ vị), hạ=túc thiếu âm/thái khê (xem thận).
2. Tam bộ chẩn pháp ("Thương hàn luận" của Trương Trọng Cảnh): nhân nghinh, thốn khẩu, phu dương — thốn khẩu hầu 12 kinh, nhân nghinh/phu dương xem vị khí, thêm túc thái âm (thái khê) xem thận. Ngày nay ít dùng, chỉ dùng khi mạch hai tay không còn.
3. Thốn khẩu chẩn pháp (phổ biến từ đời Tấn, "Mạch chẩn" của Vương Thúc Hòa): căn cứ "Tố Vấn - Ngũ tạng biệt luận" và "Nạn kinh": khí khẩu là nơi thủ thái âm kinh đi qua, khí vị của lục phủ ngũ tạng đều xuất phát từ vị nên biểu hiện tại khí khẩu. Thốn khẩu phân Thốn-Quan-Xích: từ ngư tế đến mỏm trâm quay là thốn khẩu; quan ở ngay mỏm trâm quay; thốn trước quan (phía cổ tay), xích sau quan. Hai tay có 6 bộ. Mỗi bộ lại phân phù-trung-trầm (3 hầu) → tam bộ cửu hầu của thốn khẩu.

THỐN QUAN XÍCH PHỐI TẠNG PHỦ: có nhiều học thuyết khác nhau (Nội Kinh, Mạch kinh, Trương Trọng Cảnh, Y tông kim giám) — khác biệt chủ yếu ở đại/tiểu trường và tam tiêu, nhưng hầu ngũ tạng giống nhau. Lý Thời Trân nhắc: thốn quan xích phối tạng phủ là để "hầu" (xem) khí của tạng phủ, không phải định vị trí tạng phủ tại đó. Cách khác: không chia thốn quan xích mà phân phù-trung-trầm, trái xem tâm-can-thận, phải xem phế-tỳ-mệnh môn — dùng khi bệnh nguy cấp, người già/hư nhược/bệnh lâu/sản hậu.

PHƯƠNG PHÁP CHẨN MẠCH:
- Thời gian: tốt nhất sáng sớm (bình minh) khi âm khí chưa động, dương khí chưa tán, chưa ăn uống — khí huyết chưa loạn dễ biện mạch bệnh. Không bắt buộc, nhưng cần môi trường an tĩnh, bệnh nhân nghỉ trước khi chẩn.
- Tư thế: nằm/ngồi, tay ngang tim, cổ tay thẳng lòng bàn tay hướng lên, kê gối nhỏ dưới tay.
- Chỉ pháp (cách bắt mạch): thầy thuốc-bệnh nhân đối mặt, tay trái bắt mạch tay phải bệnh nhân và ngược lại. Ngón giữa đặt bộ quan (trong mỏm trâm quay), ngón trỏ đặt bộ thốn, ngón vô danh đặt bộ xích; khoảng cách 3 ngón theo chiều cao bệnh nhân. "Tổng án": 3 ngón cùng ấn xem; "Đơn án": 1 ngón ấn 1 bộ, 2 ngón khác hơi giở lên — lâm sàng phối hợp dùng. Trẻ em dùng 1 ngón cái (thốn khẩu ngắn, không chia 3 bộ được).
- Cử, án, tầm: chỉ lực nặng nhẹ — cử=nhẹ, án=mạnh, tầm=trung bình (Hoạt Bá Nhân, "Chẩn gia khu yếu").
- Bình tức: một lần hít-thở gọi 1 tức, dùng để tính số lần mạch, thầy thuốc hơi thở phải tự nhiên đều và tập trung.
- Mỗi lần chẩn mạch cần tối thiểu 50 lần đập (3-5 phút) để phát hiện mạch kết/đại/thúc; có thể kéo dài 2-3 lần 50 động khi cần.`,
      keyPoints: "Ba cách định vị: Biến chẩn pháp (tam bộ cửu hầu đầu-tay-chân), Tam bộ chẩn pháp (nhân nghinh-thốn khẩu-phu dương), Thốn khẩu chẩn pháp (phổ biến nhất, Thốn-Quan-Xích)\nThốn quan xích phối tạng phủ là để hầu khí tạng phủ, không định vị trí giải phẫu\nChẩn mạch cần đủ 50 động, chú ý thời gian, tư thế, chỉ pháp (tổng án/đơn án), cử-án-tầm, bình tức",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Bình mạch (mạch người bình thường) và các yếu tố ảnh hưởng sinh lý",
      category: cat,
      summary: "Bình mạch cần hội tụ vị, thần, căn; biến đổi sinh lý theo tứ thời, địa lý, giới tính, tuổi tác, thể tạng, tình chí, lao động.",
      content: `BÌNH MẠCH: mạch người bình thường, cả ba bộ không to không nhỏ, chậm rãi nhu hòa hữu lực, nhịp đều, bộ xích hơi trầm. Cần hội tụ 3 đặc điểm: VỊ, THẦN, CĂN.
- Vị: vị là thủy cốc chi hải, hậu thiên chi bản, nguồn cung cấp dinh vệ khí huyết. "Hữu vị khí tắc sinh, vô vị khí tắc tử". Mạch tượng không phù không trầm, không nhanh không chậm, tùng dung hòa hoãn nhịp đều là có vị khí. Ngay cả mạch bệnh (bất luận phù trầm trì sác) mà có mạch chậm rãi hòa hoãn (từ hòa) là còn vị khí — ý nghĩa lớn cho biện chứng tiến thoái hung kết.
- Thần: tâm chủ huyết tàng thần, khí huyết sung doanh thì tâm thần kiện vượng, mạch tự nhiên hữu thần. Hình thái: nhu hòa hữu lực; mạch vi nhược nhưng không hoàn toàn vô lực, hoặc mạch huyền thực kèm chút nhu hòa — vẫn coi là hữu thần.
- Căn: thận vi tiên thiên chi bản, nguyên động lực tạng phủ. Thận khí túc thì mạch hữu căn — bộ xích trầm án mà hữu lực. Nếu bệnh mà bộ xích trầm án vẫn thấy — còn cơ hội sống ("Thốn khẩu tuy vô, xích do bất tuyệt, như thử chi lưu, hà ưu vẫn tử" - "Mạch quyết").

CÁC YẾU TỐ ẢNH HƯỞNG SINH LÝ ĐẾN BÌNH MẠCH:
- Tứ thời khí hậu: xuân huyền (dương khí thăng nhưng hàn khí chưa tận, khí cơ bị ước thúc), hạ hồng (dương khí thịnh, đến mạnh đi suy), thu phù (dương khí muốn liễm), đông trầm (dương khí tiềm tàng).
- Hoàn cảnh địa lý: phương Nam đất thấp khí ôn thấp nhuận, cơ tấu hoãn sơ → mạch tế nhuyễn hơi sác; phương Bắc đất cao khô táo hàn, cơ tấu chặt → mạch trầm thực.
- Giới tính: nữ mạch nhu nhược và hơi nhanh hơn nam; phụ nữ có thai mạch hoạt sác xung hòa.
- Tuổi tác: tuổi nhỏ mạch đập nhanh (nhũ nhi 120-140 lần/phút, 5-6 tuổi 90-110 lần/phút), tuổi lớn mạch chậm; thanh niên mạch hữu lực, người già mạch hơi nhược.
- Thể tạng: người cao mạch dài, người lùn mạch ngắn; người ốm mạch thường phù, người mập mạch trầm. "Lục âm mạch" (6 mạch trầm tế đồng đẳng ở người không bệnh), "Lục dương mạch" (6 mạch hồng đại đồng đẳng không biểu hiện bệnh lý).
- Tình chí: hỷ thương tâm mạch hoãn, nộ thương can mạch cấp, kinh tắc khí loạn mạch động; tình chí hồi phục mạch bình thường lại.
- Lao động: lao động mệt nhọc/vận động căng mạch cấp tật, sau ngủ mạch trì hoãn; lao động trí óc mạch thường nhược hơn lao động chân tay.
- "Tà phi mạch": mạch không xuất hiện ở thốn khẩu mà đi lên mu tay từ bộ xích — do dị dạng giải phẫu, không thuộc mạch bệnh.`,
      keyPoints: "Bình mạch cần hội tụ Vị (hòa hoãn nhịp đều), Thần (nhu hòa hữu lực), Căn (bộ xích trầm án hữu lực)\nMạch sinh lý biến đổi theo mùa (xuân huyền/hạ hồng/thu phù/đông trầm), địa lý, giới tính, tuổi, thể tạng, tình chí, lao động — không phải mạch bệnh\nCòn vị khí (mạch chậm rãi hòa hoãn dù bệnh) có ý nghĩa lớn cho dự hậu",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "28 loại mạch tượng (phần 1): Phù, Trầm, Trì, Sác, Hồng, Đại, Vi, Tế, Tán, Hư, Thực, Hoạt, Sáp",
      category: cat,
      summary: "Mạch tượng quan sát qua 4 mặt: vị trí, số (nhịp), hình, thế. 13 loại mạch cơ bản đầu tiên trong 28 loại mạch tượng và chủ bệnh của mỗi loại.",
      content: `Bệnh tật phản ánh ở mạch tượng gọi là mạch bệnh. "Mạch kinh" đưa ra 24 loại, "Trọng Cảnh toàn thư" 16 loại, "Tần Hồ mạch học" 27 loại, Lý Sĩ Tài thêm tật mạch → cận đại dùng 28 loại. Mạch tượng quan sát qua 4 mặt: vị trí (phù trầm), số/nhịp (trì sác), hình, thế (hư thực).

PHÙ MẠCH: khinh thủ (ấn nhẹ) là thấy, trầm án giảm mà không trống. Chủ: biểu chứng, cũng chủ hư chứng. Giải thích: tà tại biểu, vệ dương đề kháng nên mạch khí được cổ động ra ngoài; ở người hàn thể hư cũng có mạch phù (đa số phù đại vô lực) — không nhầm với ngoại cảm.

TRẦM MẠCH: ấn nhẹ không thấy, trọng án mới thấy. Chủ: lý chứng (hữu lực=lý thực, vô lực=lý hư).

TRÌ MẠCH: 1 tức không đủ 4 lần (~60 lần/phút). Chủ: hàn chứng (hữu lực=hàn tích, vô lực=hư hàn). Lưu ý: uất nhiệt kết tụ cũng có thể gặp mạch trì hữu lực (thương hàn dương minh bệnh) — cần mạch chứng hợp tham. Vận động viên lâu năm có mạch trì hữu lực không phải mạch bệnh.

SÁC MẠCH: 1 tức trên 5 lần (~90 lần/phút). Chủ: nhiệt chứng (hữu lực=thực nhiệt, vô lực=hư nhiệt). Dương hư ngoại phù cũng gặp mạch sác vô lực, ấn thấy rộng mở trống rỗng — cần phân biệt 3 chứng qua chứng mạch hợp tham.

HỒNG MẠCH (mạch đại/to): cực to như sóng lớn cuộn trào, đến mạnh đi yếu. Chủ: khí phần nhiệt thịnh. Bệnh lâu/hư lao/mất máu/tiêu chảy lâu mà gặp mạch hồng — tà thịnh chính suy, nguy cấp.

MẠCH ĐẠI (to): sờ rất to nhưng không có cảm giác tuôn trào (khác hồng mạch). Chủ tà thịnh (bệnh tiến), cũng chủ hư — biện theo hữu lực/vô lực.

MẠCH VI: cực nhỏ cực nhuyễn, ấn như muốn tuyệt, như có như không. Chủ: dương suy thiểu khí, âm dương khí huyết đều suy. Bệnh lâu mạch vi — chính khí gần tuyệt; bệnh mới mạch vi — dương khí bạo thoát (còn cứu được nếu tà không sâu).

MẠCH TẾ (tiểu): nhỏ như sợi chỉ nhưng sờ rõ. Chủ: khí huyết lưỡng hư, hư suy lao tổn, cũng chủ bệnh thấp. Trong ôn nhiệt bệnh mà hôn mê nói nhảm, mạch tế — nhiệt tà sâu nhập dinh huyết/tà hãm tâm bào.

MẠCH TÁN: phù tán không gốc, đếm không được. Chủ: nguyên khí ly tán — nguy hiểm, khí tạng phủ gần tuyệt.

MẠCH HƯ: ba bộ đều vô lực, ấn cảm giác hư không. Chủ: hư chứng (khí huyết lưỡng hư, tạng phủ khí hư).

MẠCH THỰC: ba bộ đều hữu lực. Chủ: thực chứng (tà khí kháng thịnh, chính khí không suy, khí huyết úng thịnh).

MẠCH HOẠT: đến đi lưu loát như viên bi lăn trên bàn. Chủ: đàm ẩm, thực trệ, thực nhiệt. Người bình thường mạch hoạt xung hòa là bình mạch (dinh vệ sung thực); phụ nữ có thai cũng mạch hoạt (khí huyết sung thịnh điều hòa).

MẠCH SÁP: đến đi không trơn tru, như dao nhỏ cạo vỏ trúc (trái với hoạt mạch). Chủ: thương tổn tinh khí thiếu huyết, khí trệ huyết ứ, kẹp đàm, kẹp thực. Vô lực = tinh khuy huyết thiểu; hữu lực = khí trệ huyết ứ/thực đàm giao cố.`,
      keyPoints: "Mạch tượng quan sát 4 mặt: vị trí (phù/trầm), số/nhịp (trì/sác), hình, thế (hư/thực)\nPhù=biểu, Trầm=lý, Trì=hàn, Sác=nhiệt, Hư/Thực theo hữu lực vô lực\nHồng/Vi/Tế/Tán ở bệnh lâu/mất máu thường là dấu hiệu nguy cấp (tà thịnh chính suy hoặc nguyên khí ly tán)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "28 loại mạch tượng (phần 2): Trường, Đoản, Huyền, Khâu, Khẩn, Hoãn, Cách, Lao, Nhược, Nhu, Phục, Động, Thúc, Kết, Đại (nhịp nghỉ), Tật",
      category: cat,
      summary: "15 loại mạch tượng còn lại trong 28 loại mạch tượng cổ truyền và chủ bệnh của mỗi loại, bao gồm các mạch loạn nhịp (kết, đại, thúc).",
      content: `MẠCH TRƯỜNG: đầu đuôi thẳng dài, vượt quá vị trí thốn khẩu. Chủ: can dương hữu dư, dương thịnh nội nhiệt. Trường mà hòa hoãn = trung khí sung túc (mạch người khỏe); trường mà huyền cứng = can dương hữu dư.

MẠCH ĐOẢN: đầu đuôi đều ngắn không đủ bộ thốn khẩu. Chủ: hữu lực=khí uất, vô lực=khí tổn.

MẠCH HUYỀN: thẳng mà dài, như bấm vào dây đàn. Chủ: bệnh can đởm, các loại đau, đàm ẩm, ngược tật (sốt rét). Hư lao nội thương/can bệnh thừa tỳ cũng gặp mạch huyền. Huyền mà tế kình (nhỏ cứng như vuốt lưỡi dao) = vị khí mất hoàn toàn, khó chữa.

MẠCH KHÂU: phù to mà trống rỗng, như ấn vào cọng hành (trên dưới có mạch, giữa không). Chủ: thất huyết, thương âm. Do mất máu nhiều/tổn thương tân dịch, huyết thất âm thương, dương vô sở phụ mà tán ra ngoài.

MẠCH KHẨN: đến rất căng và nhanh. Chủ: hàn, thống (đau), túc thực (tích trệ ăn uống). Hàn tại biểu → phù khẩn; hàn tại lý → trầm khẩn.

MẠCH HOÃN: 1 tức 4 lần đến đi chậm. Chủ: thấp bệnh, tỳ vị hư nhược. Mạch chuyển hòa hoãn ở người bệnh = chính khí hồi phục; mạch hòa hoãn đều đặn ở người khỏe = bình thường.

MẠCH CÁCH: phù mà nẩy mạnh, trong rỗng ngoài cứng như mặt trống. Chủ: vong huyết, tổn thất tinh, lậu hạ (băng lậu).

MẠCH LAO (lao tù): trầm án mới thấy thực đại huyền trường, kiên cố bất di. Chủ: âm hàn nội thực, sán khí, chứng hà (u cục bụng). Mạch lao gặp ở mất máu/âm hư — nguy hiểm.

MẠCH NHƯỢC: cực mềm mà trầm tế. Chủ: khí huyết bất túc. Sau bệnh chính hư gặp mạch nhược = thuận; bệnh mới tà thực gặp mạch nhược = nghịch.

MẠCH NHU: phù mà tế nhuyễn (ấn nhẹ thấy, trọng án không rõ). Chủ: các chứng hư, chứng thấp.

MẠCH PHỤC: ấn thật mạnh mới thấy, rất sâu (sâu hơn trầm mạch, ấn tới gân cốt). Chủ: tà bế, quyết chứng, đau đớn cục bộ. Hai tay mạch phục mà thái khê/phụ dương cũng không mạch — nguy chứng.

MẠCH ĐỘNG: hình như hạt đậu, ngắn, hoạt sác hữu lực. Chủ: đau đớn, kinh sợ.

MẠCH THÚC: đến nhanh vài nhịp, nghỉ một nhịp, không đều. Chủ: dương thịnh thực nhiệt, khí huyết đàm ẩm túc thực đình trệ, cũng chủ phế ung. Thúc mà tiểu tế vô lực = hư thoát, cần cảnh giác.

MẠCH KẾT: đến chậm vài nhịp rồi nghỉ, không đều. Chủ: âm thịnh khí kết, hàn đàm ứ huyết, chứng hà tích tụ.

MẠCH ĐẠI (nhịp nghỉ, khác mạch đại=to ở phần 1): nhịp nghỉ đều, nghỉ tương đối dài. Chủ: tạng khí suy vi, phong chứng thống chứng, thất tình kinh khủng, trật đả tổn thương. Người thể yếu/phụ nữ có thai cũng có thể gặp — không hoàn toàn là mạch bệnh.

MẠCH TẬT: đến cực nhanh, 1 tức 7-8 lần. Chủ: dương cực âm tuyệt, nguyên khí gần thoát. Thương hàn ôn bệnh giai đoạn nhiệt cực thường gặp. Tật mà cứng = dương kháng vô chế; tật mà hư nhược = nguyên dương gần thoát. Trẻ em 1 tức 7 lần là bình thường (không phải tật mạch).`,
      keyPoints: "Mạch loạn nhịp có khoảng nghỉ: Kết (chậm+nghỉ, âm thịnh), Thúc (nhanh+nghỉ, dương thịnh), Đại (nghỉ đều dài, tạng khí suy vi)\nMạch Huyền/Khẩn/Trường đều 'dài căng' nhưng khác nhau về độ căng và chủ bệnh (can đởm/hàn đau/can dương)\nMạch Phục/Lao/Trầm đều ở vị trí sâu nhưng khác độ sâu và hình thái",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Phân biệt các mạch tương tự và Quái mạch (Thất tuyệt mạch)",
      category: cat,
      summary: "Phương pháp tỷ loại và đối cử để phân biệt các nhóm mạch dễ nhầm lẫn; Quái mạch (chân tạng mạch) là 7 loại mạch báo hiệu nguy kịch.",
      content: `PHÂN BIỆT CÁC MẠCH TƯƠNG TỰ (phương pháp tỷ loại - so sánh mạch gần giống nhau):
- Phù và Hư, Khâu, Tán: đều ở vị trí cạn ngoài. Phù: ấn sơ sơ thấy, trọng án giảm nhưng không trống, hình không to không nhỏ. Hư: hình to, vô lực, trọng án không hư (mất hẳn). Khâu: phù đại vô lực, giữa trống như ấn cọng hành. Tán: phù tán vô lực, tản mạn không gốc, hơi ấn là mất.
- Trầm, Phục, Lao: đều ở vị trí sâu. Trầm: trọng án mới thấy. Phục: sâu hơn trầm, gần xương gân mới thấy (có khi tạm thời không thấy). Lao: trầm án thấy thực đại huyền trường, kiên cố bất di.
- Trì và Hoãn: đều tính theo tức (hơi thở). Trì: 1 tức không đến 4 cái. Hoãn: hơi nhanh hơn trì (1 tức 4 cái), đến rất xung hòa từ tốn.
- Sác, Hoạt, Tật: Hoạt chỉ hình thái/xu thế lưu loát; Sác chỉ số lần (>5/tức); Tật còn nhanh hơn sác (7-8/tức, ~140/phút).
- Thực và Hồng: đều sung thực hữu lực. Hồng: như sóng lớn cuộn trào, đến thịnh đi suy, ấn nhẹ cũng thấy. Thực: trường đại kiên thực, đến mạnh đi cũng mạnh, phù án/trầm án đều thấy trường đại hữu lực.
- Tế và Vi, Nhược, Nhu: đều tế tiểu nhuyễn nhược vô lực. Tế: hình nhỏ nhưng rõ. Vi: cực nhỏ cực mềm, ấn như muốn tuyệt, có lúc đếm không rõ. Nhược: trầm tế mà vô lực. Nhu: phù mà tế nhuyễn.
- Khâu và Cách: đều trung không (trống giữa). Khâu: phù đại vô lực, trung không như ấn cọng hành (mềm mại). Cách: phù đại nẩy tay huyền cấp, trung không như ấn mặt trống (cứng).
- Huyền và Trường, Khẩn: Trường vượt quá bộ vị thốn khẩu, như vuốt cây trúc dài mà không nhanh. Huyền dài nhưng khí khẩn trương như ấn dây đàn. Khẩn như ấn dây thừng căng, mạch hình to hơn huyền.
- Đoản và Động: đều thu ngắn. Đoản: thu ngắn mà sáp, thường kèm trì, không đủ ba bộ. Động: như đậu, thường kèm hoạt sác hữu lực.
- Kết, Đại, Thúc: đều loạn nhịp có nghỉ. Kết/Thúc: nghỉ không đều, ngắn. Đại: nghỉ rất đều, thời gian nghỉ dài. Kết là mạch trì có nghỉ; Thúc là mạch sác có nghỉ.

PHƯƠNG PHÁP ĐỐI CỬ (so sánh mạch tương phản): Phù-Trầm (vị trí ngoài/trong, biểu/lý); Trì-Sác (nhanh/chậm, hàn/nhiệt); Hư-Thực (sức đập mạnh/yếu); Hoạt-Sáp (thông/trệ); Hồng-Tế (to/nhỏ); Khẩn-Hoãn (căng/chậm).

QUÁI MẠCH (Chân tạng mạch, Bại mạch, Tử mạch, Tuyệt mạch): mạch không có vị-thần-căn, gặp ở bệnh thời kỳ cuối, khí tạng phủ suy kiệt, vị khí bại tuyệt. Ngụy Diệc Lâm liệt 10 loại, hậu thế còn lại "Thất tuyệt mạch":
1. Phủ phí mạch (nước sôi trong nồi): phù sác cực kỳ, đếm không rõ, không căn gốc — tam dương nhiệt cực, âm dịch khô kiệt, xuất hiện trước lâm chung.
2. Ngư tường mạch (cá bay): nổi ngoài da, đầu định đuôi vẫy như có như không — ba kinh âm hàn cực, dương vong ngoài.
3. Hà du mạch (tôm lội): nổi ngoài da, nhảy rồi lặn mất chốc lát lại đến — cô dương không nơi nương, chủ đại trường khí tuyệt.
4. Ốc lậu mạch (nhà dột): chìm giữa gân cơ, cực trì chậm vô lực như nóc nhà dột lâu mới rớt 1 hột nước — vị khí dinh vệ gần tuyệt.
5. Tước trác mạch (chim sẻ mổ): giữa cân mạch nhanh liên tục không đều — tỳ khí tuyệt.
6. Giải sách mạch (cởi dây): chìm giữa cân, lúc thưa lúc nhặt như gỡ dây rối — thận và mệnh môn khí đều vong.
7. Đàn thạch mạch (bắn đạn): dưới cân nhục rất sâu, không chút nhu hòa — thận khí kiệt tuyệt.
Lưu ý hiện đại: chân tạng mạch đa số do loạn nhịp tim thực thể hoặc chức năng gây ra; dự báo nghiêm trọng nhưng vẫn có thể chữa (không tuyệt đối "không chữa được" như quan niệm cổ).`,
      keyPoints: "Phương pháp tỷ loại (so sánh mạch giống nhau) và đối cử (so sánh mạch tương phản) giúp phân biệt 28 loại mạch dễ nhầm",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Chẩn mạch phụ nữ và trẻ em",
      category: cat,
      summary: "Mạch kinh nguyệt, mạch thai, mạch thai sống chết, mạch gần sanh ở phụ nữ; phương pháp và chủ bệnh mạch ở trẻ em khác người lớn.",
      content: `CHẨN MẠCH PHỤ NỮ:
- Chẩn kinh nguyệt mạch: bộ quan xích trái đột nhiên lớn hơn phải, không khát không sốt không trướng bụng — kinh nguyệt chuẩn bị tới. Thốn quan điều hòa mà bộ xích tuyệt không đến — kinh nguyệt không tới. Bế kinh: xích hư tế sáp = hư bế chứng (huyết thiểu); xích huyền sáp = thực bế chứng.
- Chẩn thai mạch: kinh ngừng, mạch hoạt sác xung hòa kèm thích ăn chua/nôn ói — có thai. "Tố vấn - Phúc trung luận": có bệnh mà không có tà mạch (ba bộ phù trầm lớn nhỏ bình thường, không huyền khâu sáp) — có thai. "Tố vấn - Bình nhân khí tượng luận": thốn trái mạch động mạnh khi kinh mới ngưng — huyết tụ dưỡng thai. "Tố vấn - Âm dương biệt luận": bộ xích (âm, thận) hoạt sác bác tay khác bộ thốn (dương) — có thai. Phân biệt thai mạch với bệnh mạch: bế kinh đa số hư tế sáp/huyền sáp; tích tụ đa số huyền khẩn trầm kết/trầm phục; thai phụ mạch tất phải hoạt (dù sác cũng kèm hoạt, khác lao tổn sác kèm sáp).
- Chẩn mạch thai sống chết: "Mạch kinh": thốn khẩu mạch hồng mà sáp — khí động đan điền ấm thai; trầm án vẫn hồng cường = dương khí của thai còn sống; trầm án dương khí suy kiệt = thai đã chết hoặc là khối u.
- Chẩn mạch gần sanh: bộ xích nhanh như ấn dây thừng chuyển hạt châu ("Chư bệnh nguyên hầu luận"); hai ngón giữa đỉnh tiết hai bên bộ quan vô mạch bình thường, nếu mạch nhảy kèm đau bụng-lưng từng cơn, hoa mắt — chính lúc sanh ("Y tồn"). Cần mạch chứng hợp tham toàn diện.

CHẨN MẠCH TRẺ EM:
Thốn khẩu trẻ em nhỏ hẹp khó phân 3 bộ; trẻ hay khóc la khiến khí loạn khó nắm mạch — cần chú ý hình sắc, hỏi nguồn cơn kết hợp. Phương pháp 1 ngón xem 3 bộ: dưới 3 tuổi dùng ngón cái tại mỏm trâm quay chia 3 bộ bằng hơi thở; trên 4 tuổi giữa xương cao là quan, dò tìm thốn; 7 tuổi tương tự; 9-10 tuổi dùng thêm ngón trỏ; 15 tuổi trở lên chẩn như người lớn.
Mạch chủ bệnh trẻ em: dưới 3 tuổi 1 tức 7-8 đập là bình mạch; 5-6 tuổi 6 đập bình thường, ≥7 đập là sác, 4-5 đập là trì. Chỉ cần chẩn phù trầm, trì sác, mạnh yếu, hoãn cấp để biện âm dương hàn nhiệt biểu lý tà chính thịnh suy, không cần chính xác đủ 28 loại mạch. Phù sác=dương, trầm trì=âm; mạnh yếu=thực hư; hoãn cấp=tà chính. Sác=nhiệt, trì=hàn, trầm hoạt=đàm thực, phù hoạt=phong đàm, khẩn=hàn, hoãn=thấp, lớn nhỏ không đều=trệ.
Trẻ em thận khí chưa sung nên hơi dùng sức không thấy mạch; nếu trọng án còn thấy — giống lao mạch ở người lớn.`,
      keyPoints: "Thai mạch đặc trưng hoạt sác xung hòa; phân biệt với bế kinh (hư tế sáp/huyền sáp) và tích tụ (huyền khẩn trầm kết)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Mạch Chẩn - Mạch tương kiêm chủ bệnh và Mạch chứng thuận nghịch, tùng xá",
      category: cat,
      summary: "Các mạch tượng thường kết hợp (nhị hợp, tam hợp) với chủ bệnh tổng hợp; nguyên tắc 'xá mạch tùng chứng' và 'xá chứng tùng mạch' khi mạch và chứng không tương ứng.",
      content: `MẠCH TƯƠNG KIÊM VÀ CHỦ BỆNH: Mạch tượng thường không chỉ một loại; một số mạch (như nhược=hư trầm tiểu hợp; lao=trầm thực đại huyền trường hợp) đã là tổ hợp. Từ Linh Đài gọi tổ hợp 2/3/4 mạch là nhị hợp/tam hợp/tứ hợp (ví dụ: phù sác và trầm trì là nhị hợp; phù sác mà nhược là tam hợp; phù sác hoạt thực là tứ hợp). Chủ bệnh của tương kiêm mạch = tổng hợp chủ bệnh các mạch đơn (ví dụ phù+sác=biểu nhiệt; phù+trì=biểu hàn; phù sác vô lực=biểu hư nhiệt; trầm trì hữu lực=lý thực hàn).

Một số tương kiêm mạch thường gặp:
- Phù khẩn: ngoại cảm hàn tà, biểu nhiệt chứng hoặc phong tý đau.
- Phù hoãn: phong tà thương vệ, dinh vệ bất hòa, thái dương trúng phong, biểu hư chứng.
- Phù sác: phong nhiệt tập biểu, biểu nhiệt chứng.
- Phù hoạt: biểu chứng kẹp thấp hoặc phong đàm.
- Trầm trì: lý hàn chứng (tỳ vị dương hư, âm hàn ngưng trệ).
- Huyền sác: can uất hỏa hóa hoặc can đởm thấp nhiệt.
- Hồng sác: khí phần nhiệt thịnh (ngoại cảm nhiệt bệnh).
- Trầm huyền: can uất khí trệ, hoặc thủy ẩm nội đình.
- Trầm sáp: huyết ứ (dương hư hàn ngưng huyết ứ).
- Huyền tế: can thận âm hư hoặc huyết hư can uất hoặc can uất tỳ hư.
- Trầm hoãn: tỳ hư thủy thấp đình lưu.
- Trầm tế: âm hư hoặc huyết hư.
- Huyền hoạt sác: can hỏa kẹp đàm hoặc phong dương thượng nhiễu, đàm hỏa nội uẩn.

MẠCH CHỨNG THUẬN NGHỊCH VÀ TÙNG XÁ:
Mạch chứng tương ứng = thuận bệnh (tà thực chính thịnh nếu đều thực; tà suy chính hồi phục nếu đều hư ở bệnh lâu). Mạch chứng tương phản = nghịch bệnh (ví dụ bệnh hữu dư mà mạch tế vi nhược = tà thịnh chính hư, dễ tà hãm; bệnh mới mà mạch trầm tế vi nhược = chính khí đã suy; bệnh lâu mà mạch phù hồng sác thực = chính suy tà chưa thoái, nghịch chứng).
Khi mạch và chứng không phù hợp, phải có một chân một giả — cần biện rõ để quyết định tùng (theo) hoặc xá (bỏ):
- Xá mạch tùng chứng: khi chứng chân mạch giả. Ví dụ: bụng trướng mãn, đau cự án, táo bón, lưỡi đỏ rêu vàng dày cháy táo (chứng phản ánh thực nhiệt nội kết — chân) mà mạch trầm tế (do nhiệt kết trở trệ huyết mạch — giả) → bỏ mạch theo chứng.
- Xá chứng tùng mạch: khi chứng giả mạch chân. Ví dụ: thương hàn nhiệt bế trong, tứ chi quyết lãnh (chứng giả hàn) mà mạch phù sác (mạch phản ánh chân nhiệt, do nhiệt tà nội phục cách âm ra ngoài) → bỏ chứng theo mạch.
"Y tông mật độc - Mạch pháp tâm tham" nêu ví dụ: mạch phù đại mà tâm hạ ngạnh, sốt thuộc tạng — công hạ chứ không phát hạn (dù mạch phù thường trị phát hạn); thiếu âm bệnh mới mắc lại sốt, mạch trầm — vẫn dùng Ma hoàng phụ tử tế tân thang hạn pháp (dù mạch trầm thường trị tả hạ); mạch thúc mà tay chân quyết lãnh — là hư thoát, dùng ôn pháp (không phải dương thịnh); mạch trì ở dương minh bệnh không ố hàn mồ hôi nhiều — dùng Đại thừa khí thang (không phải âm hàn). Trọng Cảnh còn dùng ví dụ Tứ nghịch thang (tùng mạch trầm trị biểu chứng hạn) và Quế chi thang (tùng mạch phù dù chứng có vẻ lý) để minh họa tùng xá.
Kết luận: mạch tượng chỉ là một mặt biểu hiện của bệnh, không thể dùng làm căn cứ duy nhất chẩn đoán — phải tứ chẩn hợp tham để tùng xá thích hợp.`,
      keyPoints: "Mạch tương kiêm (nhị/tam/tứ hợp) có chủ bệnh là tổng hợp các mạch đơn lẻ cấu thành",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 8 chủ đề Mạch Chẩn (Bài 4 Thiết Chẩn, phần 1).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Chẩn đoán học YHCT batch 6: Bài 3 VẤN CHẨN phần 1 — đại cương (Thập vấn
// ca), Vấn hàn nhiệt, Vấn hạn (mồ hôi), Vấn đau đầu/chóng mặt/toàn thân/tứ
// chi/lưng, Vấn ngực-sườn-vị quản-bụng, Vấn tai-mắt. Dòng 670-818 của dump.
// Trích trung thực, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 3 Vấn chẩn (phần 1: đại cương, hàn nhiệt, hạn, đau đầu/thân, ngực-sườn-bụng, tai-mắt)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn — đại cương và Thập Vấn Ca",
      category: cat,
      summary: "Vấn chẩn là hỏi bệnh nhân/gia thuộc để biết bệnh sử, triệu chứng chủ quan, sức khỏe trước đây, tình hình gia tộc. Trương Cảnh Nhạc tổng kết thành 'Thập vấn ca' (bài ca 10 điều cần hỏi).",
      content:
        "PHƯƠNG PHÁP: hỏi có trọng tâm nhưng không phiến diện; thái độ nhiệt tình, đồng cảm, lời lẽ dễ hiểu, kiên trì tỉ mỉ; không dùng ý kiến chủ quan để ám thị bệnh nhân. " +
        "HỎI TÌNH HÌNH THÔNG THƯỜNG (hành chính): họ tên, tuổi, nghề nghiệp, dân tộc, nơi cư ngụ. " +
        "HỎI TẬP QUÁN SINH HOẠT: đời sống, thói quen ăn uống, cư ngụ, tính chất công việc, kinh tế. Tính tình vui vẻ → khí huyết điều hòa, ít bệnh; tâm tình khổ buồn → khí huyết uất trệ, dễ Can khí uất trệ. Ăn lệch ngũ vị → tạng khí thiên thịnh/suy; thích nóng ghét lạnh → âm khí thiên thịnh; thích lạnh ghét nóng → dương khí thiên thịnh. Đời sống khó khăn lao động vất vả → dễ lao thương; khá giả nhàn hạ lười vận động → dễ Tỳ thất kiện vận. " +
        "HỎI GIA TỘC VÀ TIỀN SỬ: sức khỏe trực hệ thân thuộc (bệnh truyền nhiễm/di truyền — lao phổi, điên...); tiền sử sức khỏe bản thân (vd tố thể Can dương thượng kháng dễ mắc trúng phong). " +
        "HỎI TÌNH TRẠNG LÚC KHỞI BỆNH: nguyên nhân phát bệnh → tính chất bệnh (vd mùa đông ngoại cảm phong hàn → biểu hàn chứng; tình chí uất ức → Can khí uất trệ). Bệnh trình dài/ngắn → hư/thực (vd điếc đột ngột = thực chứng Can hỏa thượng viêm; điếc từ từ = hư chứng Thận âm bất túc). Hiệu quả điều trị đã qua → biện chứng dùng thuốc (vd uống thuốc hàn không hiệu quả có thể không phải nhiệt chứng; uống thuốc hành khí tiêu trướng mà trướng nặng thêm = Tỳ Vị hư hàn không đủ sức tiêu hóa, không phải thực chứng). " +
        "THẬP VẤN CA (Trương Cảnh Nhạc, đời Minh — được đời sau sửa lại): 'Nhất vấn hàn nhiệt, nhị vấn hãn (mồ hôi); tam vấn đầu thân, tứ vấn tiện (đại tiểu tiện); ngũ vấn ẩm thực, lục vấn hung (ngực); thất lung (điếc) bát khát cầu đương biện; cửu vấn cựu bệnh, thập vấn nhân (nguyên nhân); tái kiêm phục dược tham cơ biến; phụ nữ do tất vấn kinh kỳ; trì tốc bế băng giai khả kiến; tái thiêm phiến ngữ cáo nhi khoa; thiên hoa ma chẩn toàn chiêm nghiệm'. Lời đơn giản nhưng bao trùm nội dung, cần vận dụng linh hoạt theo thực tế lâm sàng, có trọng điểm.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Hàn Nhiệt — ố hàn phát nhiệt, chỉ hàn/chỉ nhiệt, hàn nhiệt vãng lai",
      category: cat,
      summary: "Phân biệt ố hàn phát nhiệt (ngoại cảm biểu chứng), chỉ hàn không nhiệt (lý hàn), chỉ nhiệt không hàn (lý nhiệt — gồm tráng nhiệt/triều nhiệt/vi nhiệt), và hàn nhiệt vãng lai (bán biểu bán lý/sốt rét).",
      content:
        "Ố HÀN PHÁT NHIỆT (gặp ngoại cảm biểu chứng): ngoại tà tập biểu ảnh hưởng vệ dương ('ôn phần nhục') → cơ biểu thất húc → ố hàn; chính khí kháng tà, dương khí hướng biểu nhưng hàn tà bó ngoài, huyền phủ bế tắc, dương khí uất → phát nhiệt. 'Hữu nhất phân ố hàn tiện hữu nhất phân biểu chứng'. 3 loại: (a) Ố hàn nặng sốt nhẹ = biểu hàn chứng (hàn là âm tà thúc biểu thương dương); (b) Sốt nặng ố hàn nhẹ = biểu nhiệt chứng (nhiệt là dương tà dễ dương thịnh); (c) Sốt nhẹ, ố phong tự hãn = Thái dương trúng phong chứng (phong khai tiết làm huyền phủ khai mở). " +
        "CHỈ HÀN KHÔNG NHIỆT (lý hàn chứng): do dương hư không ôn húc cơ biểu, hoặc hàn tà trực tiếp xâm nhập tổn thương dương khí. Đặc điểm: đắp/mặc thêm/sưởi thì đỡ lạnh (khác ố hàn). 2 loại: bệnh lâu, mạch trầm trì vô lực = hư hàn chứng; bệnh mới, đau bụng/cục bộ dữ dội, mạch trầm trì hữu lực = thực hàn chứng. " +
        "CHỈ SỐT KHÔNG HÀN (lý nhiệt chứng): Tráng nhiệt (sốt cao liên tục >39°C, mặt đỏ khát uống lạnh mồ hôi nhiều mạch hồng đại) = lý thực nhiệt. Triều nhiệt (sốt đúng giờ như thủy triều) — 3 loại: Dương minh triều nhiệt (sốt rất cao, nặng về giờ Thân 3-5h chiều, bụng trướng táo bón — Dương minh phủ thực nhiệt); Thấp ôn triều nhiệt ('thân nhiệt bất dương' — rờ không nóng ngay nhưng để lâu rất nóng, sốt cao sau trưa, đầu thân nặng nề — thấp tà che lấp nhiệt phục); Âm hư triều nhiệt (sốt nhẹ chiều/đêm, nóng từ trong xương ra 'cốt chưng', lưỡng quyền đỏ, đạo hãn — âm hư). Vi nhiệt (37-38°C, nội thương hoặc ôn bệnh cuối kỳ). Theo bệnh cơ: Khí hư sốt (sốt thấp lâu ngày, tăng khi mệt, hoặc sốt cao kèm thiểu khí tự hãn mệt mỏi — Tỳ khí hư tổn không thăng phát thanh dương); Trẻ em sốt mùa hè (sốt dai dẳng mùa hè, phiền táo khát không mồ hôi tiểu nhiều, thu mát tự khỏi — khí âm bất túc). " +
        "HÀN NHIỆT VÃNG LAI (bán biểu bán lý): loại 1 — ố hàn/sốt thay phiên không định giờ, kèm miệng đắng họng khô chóng mặt ngực sườn khổ mãn không muốn ăn mạch huyền = Thiếu dương bệnh (tà ở bán biểu bán lý, tà thắng thì ố hàn, chính thắng thì sốt). Loại 2 — lạnh run/sốt cao xen nhau đúng giờ mỗi ngày hoặc 2-3 ngày 1 lần, đau đầu dữ dội khát mồ hôi nhiều = ngược tật/sốt rét (ngược tà mai phục ở mạc nguyên, nội nhập đấu âm gây lạnh run, ngoại xuất đấu dương gây sốt cao).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Hạn (mồ hôi) — biểu chứng, lý chứng, và mồ hôi cục bộ",
      category: cat,
      summary: "Hỏi về mồ hôi (hạn, một phần tân dịch) giúp biện biểu/lý/hàn/nhiệt/hư/thực. Lý chứng có 4 dạng: tự hãn, đạo hãn, đại hãn, chiến hãn. Mồ hôi cục bộ (đầu, nửa thân, lòng bàn tay chân) có ý nghĩa riêng.",
      content:
        "NGUYÊN LÝ: 'Tấu lý khai tiết, hãn xuất trăn trăn thị vị tân' (Tố Vấn) — dương khí chưng hóa tân dịch xuất ra huyền phủ gọi là hãn; bình thường điều tiết thân nhiệt, điều hòa dinh vệ, tư nhuận bì phu. " +
        "BIỂU CHỨNG BIỆN HÃN: không mồ hôi + ố hàn nhiều/sốt nhẹ/đầu cổ cứng đau/mạch phù khẩn = ngoại cảm hàn tà, biểu hàn/biểu thực (hàn thu liễm thúc biểu, huyền phủ bế tắc). Có mồ hôi + sốt/ố phong/mạch phù hoãn = Thái dương trúng phong (biểu hư, phong khai tiết huyền phủ). Có mồ hôi + sốt cao/ố hàn nhẹ/đau đầu họng/mạch phù sác = biểu nhiệt chứng (nhiệt tính thăng tán mở tấu lý). " +
        "LÝ CHỨNG BIỆN HÃN (4 dạng): Tự hãn — mồ hôi ban ngày lúc thức, tăng khi hoạt động, kèm úy hàn tinh thần uể oải = dương hư (vệ dương bất túc không cố mật cơ biểu). Đạo hãn — mồ hôi lúc ngủ, tỉnh dậy hết, kèm triều nhiệt đỏ lưỡng quyền = âm hư (âm hư hóa táo sinh nhiệt, ngủ vệ dương nhập lý không cố mật, hư nhiệt chưng tân ngoại tiết). Đại hãn (mồ hôi rất nhiều) — chia hư/thực: sốt cao ra mồ hôi không dứt + mặt đỏ khát uống lạnh mạch hồng đại = thực nhiệt chứng; mồ hôi lạnh dầm dề + mặt nhợt tứ chi quyết lãnh mạch vi muốn tuyệt = vong dương chứng (dương khí bạo thoát, nguy hiểm). Chiến hãn (ố hàn run trước, dãy dụa, rồi đổ mồ hôi — gặp Thương hàn khi tà chính tương tranh) — nếu sau đó hãn xuất sốt hạ mạch chậm lại = tà khứ chính an, bệnh tốt lên; nếu hãn xuất mà sốt cao không hạ mạch nhanh = tà thịnh chính suy, bệnh ác hóa. " +
        "MỒ HÔI CỤC BỘ: Đầu hãn (chỉ đổ mồ hôi đầu/cổ) — thượng tiêu tà nhiệt, trung tiêu thấp nhiệt thượng chưng, hoặc (nặng) dương hư thượng việt (trán rịn như dầu + tứ chi quyết lãnh + khí suyễn mạch vi = tinh khí suy kiệt âm dương ly tuyệt, nguy kịch). Bán thân hãn (chỉ nửa người có mồ hôi) — bên không mồ hôi do kinh lạc trở bế khí huyết không đủ (gặp trúng phong, nuy chứng, liệt tủy). Mồ hôi lòng bàn tay chân — liên quan Tỳ Vị (Tỳ chủ tứ chi, tay chân là 'chư dương chi bản'; Tỳ Vị bệnh vận hóa thất thường, tân dịch đi lệch đường ra tứ chi).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Đau Đầu, Chóng Mặt, Toàn Thân, Tứ Chi, Lưng",
      category: cat,
      summary: "Vị trí đau đầu chỉ ra kinh bệnh (Dương minh/Thiếu dương/Thái dương/Quyết âm/Thiếu âm/Thái âm); tính chất đau phân biệt ngoại cảm (thực) và nội thương (hư). Đau mình/tứ chi/lưng theo tý chứng và tạng phủ liên quan.",
      content:
        "VỊ TRÍ ĐAU ĐẦU → KINH BỆNH: trước trán xuống 2 cung mày = Dương minh kinh (Túc Dương minh đi từ chân tóc tới trán). Nửa đầu 2 bên huyệt thái dương = Thiếu dương kinh (Túc Thiếu dương Đởm kinh). Sau gáy tới cổ = Thái dương kinh (Túc Thái dương Bàng quang kinh). Đỉnh đầu = Quyết âm kinh (Túc Quyết âm Can kinh liên hệ mục hệ, cùng Đốc mạch ở đỉnh). Đau lan cả răng = Thiếu âm kinh (Thận chủ cốt sinh tủy, não là tủy hải). Đau đầu kèm chóng mặt/tiêu chảy/tự hãn = Thái âm Tỳ kinh (Tỳ hư thanh dương bất thăng). " +
        "TÍNH CHẤT ĐAU ĐẦU: Ngoại cảm (thực chứng — phát nhanh, bệnh trình ngắn, đau kịch liệt không ngưng): phong hàn đầu thống (gặp gió đau tăng — kinh mạch Thái dương uất tắc); phong nhiệt đầu thống (sợ nóng, mặt mắt đỏ — phong nhiệt thượng nhiễu thanh khiếu); phong thấp đầu thống (đau như bó buộc, thân nặng — phong thấp trở khiết dương khí). Nội thương (hư chứng — phát chậm, bệnh trình dài, đau vừa phải lúc đau lúc ngưng): khí suy đầu thống (đau âm ỉ, tăng khi mệt — trung khí suy, não phủ thất dưỡng); huyết hư đầu thống (kèm chóng mặt sắc mặt nhợt — dinh huyết khuy hư); thận hư đầu thống (đầu trống rỗng, lưng gối mỏi mềm — thận tinh bất túc tủy hải bất sung). " +
        "CHÓNG MẶT (đầu vựng): Can dương thượng kháng (trướng căng + mặt đỏ tai ù miệng đắng họng khô — dương kháng sinh phong); đàm thấp nội trở (buồn ngủ hôn trầm + tức ngực nôn đàm — thanh dương bất thăng); khí huyết lưỡng hư (tăng khi mệt/đứng dậy đột ngột + mặt trắng lưỡi nhạt tâm quý mất ngủ — não phủ thất dưỡng). " +
        "ĐAU MÌNH, THÂN THỂ NẶNG NỀ, TỨ CHI: Đau toàn thân — ngoại cảm phong hàn/phong thấp (kinh lạc ngưng trệ); 'Dương độc' (mặt đỏ phát ban đau như bị đánh — thử thấp dịch độc); nằm lâu đau toàn thân — dinh khí bất túc. Thân nặng nề + tức thượng vị/rêu nê/ăn kém/tiêu lỏng = cảm thụ thấp tà; thân nặng chỉ muốn nằm + thiểu khí lười nói mệt mỏi = Tỳ khí suy hư. Tứ chi đau (Tý chứng): hành tý (di chuyển — phong tà); thống tý (dữ dội — hàn tà); trước tý (nặng tức không di chuyển — thấp tà); nhiệt tý (sưng nóng đỏ đau — phong thấp uất hóa nhiệt). " +
        "ĐAU LƯNG: thận hư yêu thống (âm ỉ, mỏi mềm vô lực — thận tinh khuy tổn); hàn thấp (lạnh, nặng nề, tăng khi lạnh/trở trời); ứ huyết (dữ dội như đâm chích, cố định cự án, không xoay trở được — sang chấn ứ huyết).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Ngực, Sườn, Vị Quản, Bụng",
      category: cat,
      summary: "Đau ngực liên quan Tâm Phế (hung tý, chân tâm thống, phế ung...); đau sườn liên quan Can Đởm; đau vị quản phân hàn/nhiệt/khí trệ/ứ huyết/âm hư/dương hư; đau bụng theo vị trí (đại phúc-Tỳ, tiểu phúc-Bàng quang/Bào cung, thiếu phúc-Can kinh).",
      content:
        "VẤN NGỰC (hung — thượng tiêu, chứa Tâm Phế, tông khí hội ở đản trung): Hung tý (đau tức ngực lan vai cánh tay — hung dương bất chấn, đàm trọc nội trở hoặc khí hư huyết ứ). Chân tâm thống (đau dữ dội thấu lưng, sắc mặt xanh xám, tay chân xanh tới đầu ngón — Tâm mạch bế tắc đột ngột). Phế thực nhiệt (đau ngực sốt cao mặt đỏ suyễn thúc cánh mũi phập phồng — phong nhiệt phạm Phế). Phế âm hư (đau ngực triều nhiệt đạo hãn ho đàm lẫn máu). Đàm thấp phạm Phế (tức ngực ho suyễn đàm trắng nhiều). Phế ung (đau ngực sốt ho khạc đàm mủ máu hôi tanh — nhiệt độc uẩn Phế, khí huyết ứ kết nhục hủ thành mủ). Khí trệ (đau trướng di chuyển, thích thở dài, dễ cáu — tình chí uất kết). Huyết ứ (đau như châm chích, cố định — sang chấn ứ huyết). Bĩ (đầy tức không đau): hàn bĩ (lạnh, đàm dãi, mạch trì), nhiệt bĩ (phiền khát mạch sác), hư bĩ (thiểu khí, thích thở dài, mạch nhược), đàm bĩ (khạc đàm nhiều, mạch hoạt). " +
        "VẤN SƯỜN (hiếp — chứa Can Đởm): Can khí uất kết (trướng thống, thở dài, dễ cáu). Can hỏa uất trệ (đau nóng, mặt mắt đỏ). Can Đởm thấp nhiệt (đau tức, vàng da vàng mắt — hoàng đản). Ứ huyết (đau như châm, điểm cố định — sang chấn). Huyền ẩm (sườn căng phồng, ho khạc đau tăng — ẩm tà đình lưu ngực sườn). Thiếu dương chứng kỳ đầu (đau tức đầy ngực sườn, hàn nhiệt vãng lai). " +
        "VẤN VỊ QUẢN: Hàn tà phạm Vị (đau dữ dội, gặp ấm đỡ). Vị hỏa tích thịnh (đau nóng rát, ăn mau đói, miệng hôi, táo bón). Vị khí trệ (trướng đau, ợ hơi, tăng khi uất nộ — Can khí phạm Vị). Vị ứ huyết (đau như châm, cố định). Vị dương hư (đau ngầm ngầm, thích ấm/xoa, nôn nước trong). Vị âm hư (xót ruột như đói mà không muốn ăn, lưỡi đỏ ít rêu — hư hỏa nội nhiễu). " +
        "VẤN BỤNG: Đại phúc (trên rốn, thuộc Thái âm Tỳ) — đau ngầm thích ấm/xoa + tiêu chảy = Tỳ Vị hư hàn. Tiểu phúc (dưới rốn đến xương mu, thuộc Bàng quang/Bào cung) — trướng đau tiểu không thông = long bế (Bàng quang khí hóa bất lợi); đau như châm + tiểu tự lợi = súc huyết (ứ huyết hạ tiêu). Thiếu phúc (2 bên tiểu phúc, Quyết âm Can kinh đi qua) — lạnh đau lan xuống bộ sinh dục = hàn ngưng Can mạch. Đau quanh rốn có cục u di động = trùng tích. Phân biệt hư/thực/hàn/nhiệt qua tính chất: nhanh gấp kịch liệt cự án ăn vô đau nhiều = thực; từ từ ngầm ngầm thích ấn xoa ăn vô đỡ = hư; chườm nóng đỡ = hàn; thích lạnh = nhiệt.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Tai, Mắt",
      category: cat,
      summary: "Thận khai khiếu ở tai; Can khai khiếu ở mắt. Ù tai/điếc phân hư-thực theo phản ứng khi bịt tai; đau mắt/chóng mặt mắt/hoa mắt/quáng gà theo Can Thận và đàm thấp.",
      content:
        "VẤN TAI: Tai ù (nhĩ minh) — tiếng ù to đột ngột, bịt tai càng ù to = thực chứng (Can Đởm Tam tiêu hỏa thượng nhiễu, hoặc Tỳ thấp thịnh thanh dương bất thăng); tiếng ù giảm khi bịt tai = hư chứng (Thận hư tinh khuy, tủy hải bất sung). Điếc tai (nhĩ lung): Thương hàn điếc — tà tại Thiếu dương kinh khí bế tắc; Ôn bệnh điếc — tà hỏa mông bịt thanh khiếu; (các dạng trên là thực chứng dễ chữa). Bệnh lâu/nặng mà điếc = Tâm khí suy kiệt, Thận hư tinh thoát (nguy nặng, hư chứng khó chữa; người già điếc do khí suy tinh suy). Nặng tai (trọng thính) — phong tà, hoặc Can kinh có nhiệt, hoặc hạ nguyên hư sẵn (thượng thịnh hạ hư). " +
        "VẤN MẮT: Đau mắt dữ dội lan đầu, nôn ói, đồng tử giãn to, nhìn như mây mờ xanh/lục/vàng = phong nội chướng (tăng nhãn áp). Mục huyền/chóng mặt mắt (đồ vật quay vòng, chòng chành): kèm đầu vựng căng trướng mặt đỏ tai ù lưng gối mỏi = Thận âm khuy hư, Can dương thượng kháng; kèm tức ngực tê tay chân buồn ói rêu nê = đàm thấp nội uẩn thanh dương bất thăng. Hoa mắt (mục hôn) — hôn hoa khô sáp nhìn không rõ, gặp bệnh lâu hư suy/người già — Can khí bất túc, Thận tinh khuy hao. Quáng gà (tước mục) — thị lực giảm lúc hoàng hôn như chim sẻ mù tối — Can hư bệnh.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 6 chủ đề Chẩn đoán học YHCT batch 6 (Vấn chẩn đại cương, Hàn nhiệt, Hạn, Đau đầu-thân, Ngực-sườn-bụng, Tai-mắt).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

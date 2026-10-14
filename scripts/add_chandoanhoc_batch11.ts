import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 2: Bát Cương",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Tổng luận",
      category: cat,
      summary: "Bát cương (âm dương, biểu lý, hàn nhiệt, hư thực) là cương lĩnh quy nạp mọi biểu hiện bệnh phức tạp thành 8 loại chứng hầu; âm dương là tổng cương thống lĩnh 6 cương còn lại.",
      content: `Bát cương gồm: Âm, Dương, Biểu, Lý, Hàn, Nhiệt, Hư, Thực — cơ sở lý luận của biện chứng luận trị. Thông qua tứ chẩn nắm tư liệu, căn cứ vị trí bệnh nông sâu, tính chất bệnh tà, sự thịnh suy của tà và chính khí, tổng hợp phân tích quy nạp thành 8 loại chứng hầu.
Nguồn gốc: bàn luận sớm trong "Nội kinh"; Trọng Cảnh vận dụng cụ thể trong thương hàn và tạp bệnh; "Cảnh Nhạc toàn thư" (thiên âm dương lục biến biện) củng cố giải thích; Trình Chung Linh (đời Thanh) đề xướng lại — bát cương trở thành thành tố quan trọng trong chẩn đoán học.

Ý NGHĨA QUY NẠP: bệnh tật phức tạp nhưng cơ bản quy nạp bằng bát cương — loại bệnh: âm chứng/dương chứng; vị trí nông sâu: biểu chứng/lý chứng; tính chất: hàn chứng/nhiệt chứng; tà chính thịnh suy: thực chứng (tà thịnh)/hư chứng (chính hư). Việc quy nạp giúp tìm điểm mấu chốt, nắm yếu lĩnh, xác định loại hình, dự đoán xu thế, nêu phương hướng điều trị.

ÂM DƯƠNG LÀ TỔNG CƯƠNG: biểu chứng, nhiệt chứng, thực chứng thuộc dương; lý chứng, hàn chứng, hư chứng thuộc âm → âm dương bao quát 6 cương còn lại, nên bát cương còn gọi "Nhị cương lục yếu".

MỐI LIÊN HỆ KHÔNG THỂ TÁCH RỜI: bát cương không phải 8 khu vực tách rời mà có quan hệ tương hỗ (biểu lý với hàn nhiệt hư thực, hàn nhiệt với hư thực biểu lý…). Bệnh tật thường biểu hiện xen kẽ phức tạp: biểu lý đồng bệnh, hư thực giáp tạp, hàn nhiệt thác tạp. Trong điều kiện nhất định còn chuyển hóa: biểu tà nhập lý, lý tà xuất biểu, hàn chứng hóa nhiệt, nhiệt chứng hóa hàn, thực chứng chuyển hư, do hư dẫn đến thực. Giai đoạn nguy cấp còn xuất hiện hiện tượng giả: chân hàn giả nhiệt, chân nhiệt giả hàn, chân hư giả thực, chân thực giả hư. Âm dương cũng tương tự: âm trung hữu dương, dương trung hữu âm, bệnh có thể từ dương nhập âm, từ âm xuất dương.
→ Khi biện chứng bát cương cần nắm vững đặc điểm từng chứng hầu VÀ chú ý mối quan hệ tương kiêm, chuyển hóa, giáp tạp, chân giả của chúng để nhận biết toàn diện chính xác.`,
      keyPoints: "Bát cương = âm dương + biểu lý + hàn nhiệt + hư thực, quy nạp mọi bệnh phức tạp thành 8 chứng hầu cương lĩnh\nÂm dương là tổng cương: dương bao gồm biểu-nhiệt-thực, âm bao gồm lý-hàn-hư (còn gọi 'nhị cương lục yếu')\nBát cương có quan hệ tương hỗ, chuyển hóa, thác tạp, chân giả — không tách rời độc lập",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Biểu Lý",
      category: cat,
      summary: "Biểu lý biện biệt vị trí bệnh nông sâu (khái niệm tương đối); biểu chứng (ngoại cảm giai đoạn đầu), lý chứng (tà nhập sâu), bán biểu bán lý; quan hệ đồng bệnh và xuất nhập.",
      content: `Biểu lý là cương lĩnh biện biệt bệnh vị (nội/ngoại) và thế bệnh nông sâu — khái niệm TƯƠNG ĐỐI: bề ngoài cơ thể là biểu, nội tạng là lý; phủ (so với tạng) là biểu, tạng là lý; kinh lạc (so với tạng phủ) là biểu; 3 kinh dương là biểu, 3 kinh âm là lý. Nghĩa hẹp: bì mao/tấu lý/kinh lạc = biểu; tạng phủ/cốt tủy = lý.

BIỂU CHỨNG: lục dâm tà khí qua bì mao/mũi miệng tẩm nhập, đa số giai đoạn đầu ngoại cảm, khởi bệnh nhanh bệnh trình ngắn. Biểu hiện: sốt, ố hàn (ố phong), đau đầu mình, rêu trắng mỏng, mạch phù, kèm nghẹt mũi chảy nước mũi ngứa đau họng ho. Cơ chế: tà khách bì mao cơ biểu trở át tuyên phát dương khí → uất phát nhiệt; vệ khí mất chức năng ôn húc tấu lý → ố phong hàn; tà uất kinh lạc khí huyết không thông → đau đầu mình; tà chưa nhập lý nên rêu còn trắng mỏng; chính khí kháng tà → mạch phù; phế chủ bì mao mũi là khiếu của phế → tà nội ứng phế gây nghẹt mũi ho.

LÝ CHỨNG: tà đã nhập lý (tạng phủ/khí huyết/cốt tủy), đa số giai đoạn giữa-cuối ngoại cảm. 3 nguyên nhân: (1) ngoại tà không giải truyền nhập lý; (2) ngoại tà trực trúng tạng phủ; (3) tình chí/ẩm thực/lao quyện tổn hại tạng phủ trực tiếp. Biểu hiện: sốt cao (tráng nhiệt), phiền thao thần hôn, khát, bụng đau, táo bón/tiêu chảy/nôn ói, tiểu ngắn đỏ, rêu vàng/trắng dày nê, mạch trầm.

BÁN BIỂU BÁN LÝ CHỨNG: tà từ biểu nội truyền chưa tới lý, hoặc lý tà thấu biểu chưa tới biểu — tà chính tương đấu. Chứng: hàn nhiệt vãng lai, ngực sườn đau tức (khổ mãn), tâm phiền muốn ói, thích yên tĩnh không muốn ăn, miệng đắng họng khô, hoa mắt, mạch huyền (= thiếu dương biện chứng trong lục kinh).

PHÂN BIỆT BIỂU-LÝ: dựa vào hàn nhiệt, lưỡi, mạch. "Y học tâm ngộ": sốt+ố hàn+đau đầu+nghẹt mũi+rêu trắng mỏng+mạch phù = biểu; triều nhiệt+ố nhiệt+đau bụng+miệng táo+rêu vàng đen+mạch trầm = lý. Sốt và ố hàn cùng xuất hiện = biểu; chỉ sốt không ố hàn hoặc chỉ hàn không sốt = lý. Biểu chứng rêu ít biến đổi, lý chứng rêu đa số biến đổi.

QUAN HỆ BIỂU-LÝ:
- Biểu lý đồng bệnh: biểu và lý chứng cùng xuất hiện (ví dụ bản có nội thương lại ngoại cảm). Thường kèm hàn nhiệt hư thực: biểu hàn lý nhiệt, biểu nhiệt lý hàn, biểu hư lý thực, biểu thực lý hư.
- Biểu tà nhập lý: biểu tà chưa giải đã nội truyền (do kháng tà giảm, tà quá mạnh, hộ lý không đáng, thất trị/ngộ trị) — bệnh nặng thêm.
- Lý tà xuất biểu: lý tà thấu đạt ra biểu (do điều trị thích đáng, sức đề kháng cải thiện, ví dụ xuất hiện ban chẩn) — bệnh đang giảm.`,
      keyPoints: "Biểu lý là khái niệm tương đối (ngoài/trong, phủ/tạng, kinh lạc/tạng phủ) chứ không tuyệt đối",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Hàn Nhiệt",
      category: cat,
      summary: "Hàn nhiệt biện biệt tính chất bệnh (âm dương thịnh suy); hàn chứng, nhiệt chứng; quan hệ thác tạp (thượng nhiệt hạ hàn...), chuyển hóa, chân giả (chân hàn giả nhiệt/chân nhiệt giả hàn).",
      content: `Hàn nhiệt biện biệt tính chất bệnh: âm thịnh/dương suy → hàn chứng; dương thịnh/âm hư → nhiệt chứng. "Tố vấn": "Dương thắng tắc nhiệt, âm thắng tắc hàn", "Dương hư tắc ngoại hàn, âm hư tắc nội nhiệt". Trương Cảnh Nhạc: "Hàn nhiệt nãi âm dương chi hóa dã". Biện chứng cần tổng hợp cả nhóm triệu chứng qua tứ chẩn, không dựa triệu chứng đơn lẻ. "Tố vấn - Chí chân yếu đại luận": "Hàn giả nhiệt chi, nhiệt giả hàn chi" — nguyên tắc điều trị đối lập hoàn toàn.

HÀN CHỨNG: do cảm hàn tà, hoặc nội thương lâu dương khí hao tổn, hoặc ăn đồ sống lạnh gây âm hàn nội thịnh. Bao gồm biểu hàn, lý hàn, hư hàn, thực hàn. Biểu hiện: ố hàn thích ấm, sắc mặt trắng nhợt, tay chân lạnh co ro, miệng lạt không khát, đàm dãi nước mũi trong loãng, tiểu trong dài, phân lỏng, lưỡi nhạt rêu trắng nhuận hoạt, mạch trì/khẩn.

NHIỆT CHỨNG: do cảm hỏa nhiệt tà, hàn hóa nhiệt nhập lý, thất tình uất hóa nhiệt, ẩm thực tích súc thành nhiệt, hoặc phòng thất lao thương tổn âm tinh gây âm hư dương kháng. Bao gồm biểu nhiệt, lý nhiệt, hư nhiệt, thực nhiệt. Biểu hiện: ố nhiệt thích mát, khát thích uống lạnh, mặt mắt đỏ, phiền thao, đàm/nước mũi vàng đặc, thổ huyết nục huyết, tiểu ngắn đỏ, đại tiện khô táo, lưỡi đỏ rêu vàng khô táo, mạch sác.

PHÂN BIỆT: dựa vào hỷ ố hàn nhiệt, khát hay không, sắc mặt, tứ chi lạnh/ấm, nhị tiện, lưỡi mạch. "Y học tâm ngộ": khát mà uống được nước, thích lạnh, phiền thao, tiểu ngắn đỏ, đại tiện kết, mạch sác = nhiệt; không khát hoặc khát không uống được, thích uống nóng, tay chân lạnh, tiểu trong dài, tiêu lỏng, mạch trì = hàn.

QUAN HỆ HÀN NHIỆT:
- Hàn nhiệt thác tạp: thượng nhiệt hạ hàn (phiền nhiệt trong ngực + đau bụng thích ấm tiêu lỏng), thượng hàn hạ nhiệt (đau lạnh vị quản + tiểu gắt đỏ), biểu hàn lý nhiệt (ố hàn sốt không mồ hôi + phiền khát — vốn nội nhiệt lại cảm phong hàn), biểu nhiệt lý hàn (sốt đau đầu ho + tiêu lỏng tiểu trong — vốn tỳ vị hư hàn lại cảm phong nhiệt).
- Hàn nhiệt chuyển hóa: hàn→nhiệt (do ngộ trị/thất trị, dương khí thiên thịnh, hàn tà theo dương hóa nhiệt — chứng tỏ chính khí còn thịnh); nhiệt→hàn (do tổn thương dương khí, tà thịnh chính suy, có thể đột biến như sau đại hạn/thổ hạ quá độ gây dương vong, hoặc từ từ như nhiệt lỵ lâu chuyển hàn lỵ).
- Hàn nhiệt chân giả (giai đoạn hàn cực/nhiệt cực, nguy hiểm, dễ nhầm): Chân hàn giả nhiệt ("âm thịnh cách dương") — sốt mặt đỏ khát mạch đại (giả nhiệt) nhưng sốt mà lạnh, khát thích uống ấm ít, mạch to vô lực, tứ chi quyết lãnh, hạ lợi thanh cốc, tiểu trong dài (hàn chứng thật). Chân nhiệt giả hàn ("dương thịnh cách âm", "nhiệt thâm quyết diệc thâm") — tứ chi lạnh mạch trầm (giả hàn) nhưng sốt ố nhiệt, mạch trầm sác hữu lực, khát thích lạnh, họng khô miệng hôi, táo kết (nhiệt chứng thật). Phân biệt: hiện tượng giả ở tứ chi/sắc mặt/da; bản chất ở lý chứng/lưỡi/mạch. Giả nhiệt: mặt đỏ chỉ ở lưỡng quyền lúc ẩn lúc hiện (chân nhiệt đỏ cả mặt); giả hàn: tứ chi lạnh nhưng ngực bụng sờ nóng, không muốn đắp mền (chân hàn thì muốn đắp thêm áo).`,
      keyPoints: "Hàn nhiệt chân giả là tình huống nguy hiểm dễ chẩn đoán nhầm: cần dựa vào lý chứng/lưỡi/mạch (bản chất) chứ không dựa hiện tượng bề ngoài ở tứ chi/sắc mặt\nChân hàn giả nhiệt = âm thịnh cách dương; Chân nhiệt giả hàn = dương thịnh cách âm ('nhiệt thâm quyết diệc thâm')",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Hư Thực",
      category: cat,
      summary: "Hư thực biện biệt tà chính thịnh suy; hư chứng (chính khí hư), thực chứng (tà khí thịnh); quan hệ thác tạp, chuyển hóa, chân giả (giả thực, giả hư).",
      content: `Hư thực biện biệt tà chính thịnh suy: hư = chính khí bất túc; thực = tà khí thịnh thực. "Tố vấn - Thông bình hư thực luận": "Tà khí thịnh tắc thực, tinh khí đoạt tắc hư". Thực chứng nên công, hư chứng nên bổ — biện chứng chuẩn xác mới công bổ hiệu quả.

HƯ CHỨNG: chính khí hư nhược. Nguyên nhân: tiên thiên bất túc, hậu thiên thất điều (ẩm thực thất điều, thất tình lao quyện, phòng thất quá độ, bệnh lâu thất trị/ngộ trị) — hậu thiên là chủ yếu. Bao gồm âm hư, dương hư, khí hư, huyết hư, tân hư, tinh hư. 2 loại thường gặp:
- Dương hư (thương dương): sắc mặt trắng nhợt, tinh thần ủy mị mệt mỏi, tâm quý khí đoản, hình hàn chi lạnh, tự hạn, đại tiện hoạt thoát, tiểu không tự chủ, lưỡi nhạt bệu, mạch hư trầm trì.
- Âm hư (thương âm): ngũ tâm phiền nhiệt, gầy sút lưỡng quyền đỏ, miệng họng khô, đạo hạn triều nhiệt, lưỡi đỏ ít rêu, mạch hư tế sác.

THỰC CHỨNG: cảm thụ ngoại tà, hoặc sản phẩm bệnh lý (đàm ẩm, thủy thấp, ứ huyết) tích tụ. Biểu hiện: sốt, đau trướng bụng cự án, tức ngực bực bội thậm chí thần hôn chiêm ngữ, hô hấp thô, đàm dãi úng thịnh, táo kết hoặc tiêu chảy, lý cấp hậu trọng, tiểu không thông, lưỡi già (thương lão), rêu dày nê, mạch thực hữu lực.

PHÂN BIỆT: cùng 1 triệu chứng có thể hư hoặc thực (ví dụ đau bụng thích ấn xoa = hư, cự án = thực; dương hư cũng ố hàn như biểu thực).

QUAN HỆ HƯ THỰC:
- Hư thực thác tạp: hư kẹp thực (ví dụ Can huyết lao — triệu chứng hư rõ nhưng lưỡi tím có dấu ứ huyết, mạch sáp hữu lực = hư trung kẹp thực, trị khứ ứ sinh tân); thực kẹp hư (ví dụ cổ trướng lâu — bụng báng gầy gò nhưng rêu khô vàng nê = thực trung kèm hư, trị công bổ kiêm thi hoặc công ít bổ nhiều); thực chứng kẹp hư (phát sinh trong quá trình thực chứng, chính khí hao tổn, ví dụ sau phát hạn/thổ/hạ xuất hiện tâm hạ bĩ ngạnh); hư chứng kẹp thực (thực chứng nặng kéo dài gây chính khí đại tổn mà tà dư chưa hết, ví dụ xuân ôn với thận âm khuy tổn, tà ít hư nhiều, trị tư âm dưỡng dịch kèm thanh dư tà); hư thực đều nặng (cả 2 trường hợp thực chứng nặng kéo dài + chính khí hư suy sẵn lại cảm tà nặng, ví dụ cam tích trẻ em, trị tiêu thực hóa tích + kiện tỳ).
- Hư thực chuyển hóa: thực→hư (bệnh tà lưu lại lâu tổn thương chính khí, ví dụ sốt cao thực nhiệt chữa không đúng lâu ngày chuyển gầy sút mạch tế vô lực); do hư dẫn thực (chính khí hư, chức năng tạng phủ suy gây đàm/huyết/thũng/thực ngưng kết thành tác nhân mới, ví dụ tâm tỳ khí suy lâu dẫn đến khí hư huyết trệ tâm mạch ứ trở, trị hoạt huyết khứ ứ).
- Hư thực chân giả: Giả thực ("Cảnh Nhạc toàn thư") — bụng đầy nhưng có lúc giảm (không như thực chứng đầy hoài), ấn không đau hoặc ấn giảm đau, mạch huyền cứng kèm trầm trì. Giả hư — trầm mặc ít nói nhưng nói thì cao vang, không muốn ăn nhưng ăn nhiều, lười nhưng vận động lại dễ chịu, bụng đau cố định. Biện biệt dựa: mạch tượng (hữu lực/vô lực, có thần/không), chất lưỡi (bệu nộn/thương lão), âm thanh (cao vang/nhỏ khẽ), thể chất và tiền sử bệnh/điều trị.`,
      keyPoints: "Hư thực thác tạp có 5 dạng: hư kẹp thực, thực kẹp hư, thực chứng kẹp hư, hư chứng kẹp thực, hư thực đều nặng — mỗi dạng có nguyên tắc công/bổ riêng\nGiả thực/giả hư cần phân biệt qua mạch, lưỡi, âm thanh, thể chất — không chỉ dựa triệu chứng bề mặt",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Hư Thực kết hợp Hàn Nhiệt Biểu Lý",
      category: cat,
      summary: "Các chứng hầu cụ thể khi hư thực giao thoa với hàn nhiệt biểu lý: biểu hư/thực, lý hư/thực, hư hàn/nhiệt, thực hàn/nhiệt chứng.",
      content: `BIỂU HƯ CHỨNG: 2 loại. (1) Ngoại cảm biểu hư (cảm phong tà, nhiệt chứng ố phong có mồ hôi): đau đầu cổ gáy cứng, sốt, ra mồ hôi, mạch phù hoãn. (2) Nội thương biểu hư (phế tỳ khí suy, vệ khí không cố): tự hạn thường xuyên, dễ cảm, sắc mặt trắng nhạt, khí đoản, động là suyễn, uể oải, ăn ít tiêu lỏng, lưỡi nhạt rêu trắng, mạch tế nhược.

BIỂU THỰC CHỨNG: ngoại tà xâm tập, dương khí tụ ở cơ biểu đề kháng, tấu lý đóng chặt. Biểu hiện: không mồ hôi, đau đầu mình, mạch phù khẩn. Đa số gặp ở ngoại cảm hàn tà (biểu hàn chứng).

LÝ HƯ CHỨNG / LÝ THỰC CHỨNG: nội dung rộng (tạng phủ kinh lạc, âm dương khí huyết khuy tổn hoặc tà khí các loại) — chia tiếp thành hư hàn/hư nhiệt và thực hàn/thực nhiệt.

HƯ HÀN CHỨNG (dương khí suy): tinh thần không phấn chấn, sắc mặt trắng nhạt, úy hàn tay chân lạnh, đau bụng thích ấn, tiêu lỏng, tiểu trong dài, thiểu khí mệt mỏi, lưỡi nhạt bệu, mạch vi/trầm trì vô lực.

HƯ NHIỆT CHỨNG (âm dịch khuy suy): lưỡng quyền đỏ, hình thể gầy gò, triều nhiệt, đạo hạn, ngũ tâm phiền nhiệt, họng khô, lưỡi đỏ ít rêu, mạch tế sác.

THỰC HÀN CHỨNG (hàn tà/âm tà xâm tập): úy hàn thích ấm, sắc mặt trắng nhợt, tứ chi không ấm, sôi bụng tiêu chảy, hoặc khò khè ho suyễn, miệng nhạt nhiều tân dịch, tiểu trong dài, rêu trắng nhuận, mạch trì/khẩn.

THỰC NHIỆT CHỨNG (dương nhiệt tà từ biểu nhập lý): sốt cao thích mát, khát thích uống lạnh, mặt mắt đỏ, phiền thao hoặc thần hôn chiêm ngữ, bụng trướng đau cự án, táo kết, tiểu ngắn đỏ, lưỡi đỏ rêu vàng khô, mạch hồng hoạt sác thực.

Các chứng hầu này là nền tảng cụ thể hóa cho biện chứng tạng phủ, kinh lạc, lục kinh, vệ khí dinh huyết ở các chương sau — mỗi loại tà khí/vị trí bệnh sẽ biểu hiện qua một trong các khung hư/thực + hàn/nhiệt + biểu/lý này.`,
      keyPoints: "Lý chứng chia tiếp thành 4 khung cụ thể: hư hàn, hư nhiệt, thực hàn, thực nhiệt — mỗi khung có bộ triệu chứng đặc trưng riêng dùng làm nền cho biện chứng tạng phủ/kinh lạc sau này",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bát Cương - Âm Dương (âm chứng, dương chứng, chân âm/chân dương bất túc, vong âm vong dương)",
      category: cat,
      summary: "Âm dương là tổng cương của bát cương; âm chứng (lý-hàn-hư) và dương chứng (biểu-nhiệt-thực); chân âm/chân dương bất túc (thận âm/dương); vong âm và vong dương là chứng nguy hiểm cần phân biệt.",
      content: `Âm dương là tổng cương của bát cương, quy tập mọi bệnh thành 2 mặt. "Tố Vấn": thầy thuốc quan sát sắc bắt mạch đầu tiên cần phân biệt âm dương. Trương Trọng Cảnh chia thương hàn thành âm chứng/dương chứng lấy tam âm tam dương làm tổng cương; Trương Cảnh Nhạc nhấn mạnh thẩm định âm dương là cương lĩnh y đạo.

ÂM CHỨNG (= lý chứng, hàn chứng, hư chứng): sắc mặt ảm đạm, tinh thần ủy mị, thân nặng thích nằm co ro, hình hàn chi lạnh, uể oải, ăn kém, miệng lạt không khát, tiếng nói nhỏ, đại tiện tanh hôi, tiểu trong dài, lưỡi nhạt bệu nộn, mạch trầm trì/nhược/tế sáp.

DƯƠNG CHỨNG (= biểu chứng, nhiệt chứng, thực chứng): sắc mặt hơi đỏ, sốt, da nóng, phiền thao bất an, tiếng nói to thô, hơi thở thô suyễn thúc đàm minh, khát nước, táo kết hoặc mùi hôi dị thường, tiểu ngắn đỏ, lưỡi đỏ thẫm rêu vàng đen mọc gai, mạch phù sác hồng đại hoạt thực.

ĐIỀU TRỊ THEO TIÊU TRƯỞNG ÂM DƯƠNG: dương thịnh âm hư (mạch hồng đại, lưỡi đỏ rêu khô, khát, sốt cao) → ức dương tư âm. Âm thịnh dương hư (mạch trầm trì, lưỡi trắng rêu hoạt, đau bụng tiêu chảy) → ôn dương nhiếp âm. Ví dụ triều nhiệt: âm hư triều nhiệt (mạch tế sác vô lực, lưỡi đỏ ít tân, quyền hồng môi đỏ, ngũ tâm phiền nhiệt) → tư âm (tư âm = tiềm dương); dương thịnh triều nhiệt (mạch trầm hữu lực, rêu vàng khô mọc gai, phiền thao táo kết chiêm ngữ cuồng loạn) → ức dương (ức dương = tồn âm).

CHÂN ÂM BẤT TÚC VÀ CHÂN DƯƠNG BẤT TÚC (= thận âm bất túc, thận dương bất túc — thận là căn bản tiên thiên):
- Chân âm bất túc (hư hỏa thượng viêm): mặt trắng quyền đỏ, môi đỏ như thoa son, miệng khô lưỡi táo đỏ không rêu, họng khô tâm phiền, hoa mắt chóng mặt ù tai, lưng gối mỏi tê, cốt chưng đạo hạn, ác mộng di tinh, nhị tiện táo kết, thủ túc tâm nhiệt, mạch sác vô lực.
- Chân dương bất túc: sắc mặt trắng nhợt, môi lưỡi nhạt, ho suyễn thân phù, tự hạn, hoa mắt, không muốn ăn, bụng to chân sưng, da lạnh, tiêu lỏng hoặc ngũ canh tả, liệt dương tinh lãnh, mạch đại vô lực.
Thẩm Kim Ngao: dương hư = chân hỏa suy, bộ xích phải yếu, trị đại bổ chân nguyên không tổn âm khí; âm hư = chân thủy suy, mạch tất tế vi, trị đại bổ chân âm không công phạt dương khí ("tráng thủy chi chủ dĩ chế dương quang, ích hỏa chi nguyên dĩ tiêu âm ế"). Trương Cảnh Nhạc lập Tả quy ẩm (chân âm) và Hữu quy ẩm (chân dương) từ luận điểm này.

VONG ÂM VÀ VONG DƯƠNG (chứng nguy hiểm, biện chứng sai dẫn tử vong — do sốt cao đại hạn, thổ tả quá độ, mất máu nhiều): Trình Trung Linh: thốn mạch nhược (dương hư) không thể phát hạn (hạn thì vong dương); xích mạch nhược (âm hư) không thể phát hạn (hạn đa vong âm) — vì hạn và huyết đều là âm dịch, đại hạn/đại xuất huyết làm âm tiêu vong, do âm dương hỗ căn nên dương cũng mất chỗ dựa mà vong theo.
Phân biệt: Vong âm — đổ mồ hôi, da nóng sợ nóng, tay chân ấm, mồ hôi ấm vị mặn, khát thích uống lạnh, hơi thở thô, mạch trầm thực, lưỡi đỏ khô. Vong dương — đổ mồ hôi, ố hàn, tay chân lạnh da lạnh toát, mồ hôi lạnh vị nhạt hơi dính, không khát thích uống ấm, hơi thở nhỏ, mạch phù sác mà trống không, lưỡi trắng nhuận. Thực chất vong âm (âm hư dương kháng, có vẻ nhiệt) và vong dương (dương hư tắc hàn, có vẻ hàn) đều là hư chứng nặng — cần nắm vững giới hạn để dùng thuốc không lầm (âm dược chỉ hạn khi dương khí chưa động, dương dược khi dương khí đã động).`,
      keyPoints: "Âm chứng = lý+hàn+hư; Dương chứng = biểu+nhiệt+thực — âm dương là tổng cương bao quát 6 cương còn lại\nChân âm/chân dương bất túc quy về thận âm/thận dương — Tả quy ẩm trị chân âm, Hữu quy ẩm trị chân dương (Trương Cảnh Nhạc)\nVong âm và vong dương đều là chứng nguy hiểm cần phân biệt gấp: vong âm có vẻ nhiệt (mồ hôi ấm, khát lạnh), vong dương có vẻ hàn (mồ hôi lạnh, không khát) — nhầm lẫn khi dùng hạn pháp có thể gây tử vong",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 6 chủ đề Bát Cương - hoàn tất Chương 2.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

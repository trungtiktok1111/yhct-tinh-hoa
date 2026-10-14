import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 3: Vấn chẩn (phần ẩm thực, giấc ngủ, nhị tiện, hỏi phụ nữ, hỏi trẻ em)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi về ẩm thực, khát nước và khẩu vị",
      category: cat,
      summary: "Hỏi ăn uống nhiều/ít biết thịnh suy tỳ vị; hỏi khát nước biết tình trạng tân dịch và hàn nhiệt hư thực; hỏi khẩu vị biết bệnh biến tạng phủ.",
      content: `Hỏi ăn uống nhiều hay ít có thể biết sự thịnh suy của tỳ vị, hỏi khẩu vị biết được hư thực của tạng phủ.

HỎI VỀ KHÁT NƯỚC VÀ UỐNG NƯỚC:
Khát hoặc không, uống nhiều uống ít liên quan tới doanh khuy của tân dịch, nói lên phân bố tân dịch và âm dương thịnh suy; biện biệt hàn nhiệt thực hư.
- Miệng không khát: tân dịch chưa tổn thương, gặp ở hàn chứng.
- Miệng khát uống nhiều: tân dịch đại tổn thương, 3 trường hợp: (1) khát thích uống lạnh, mặt đỏ sốt cao, phiền thao, mồ hôi nhiều, mạch hồng đại — thực nhiệt chứng (lý nhiệt kháng thịnh); (2) khát nhiều uống nhiều tiểu nhiều kèm ăn được nhưng gầy sút — bệnh tiêu khát do thận âm khuy hư; (3) sau đại hạn/ói mửa/tiêu chảy/lợi niệu mà khát uống nhiều — do hao thương tân dịch.
- Khát mà không uống nhiều: tân dịch tổn thương nhẹ hoặc phân bố trở ngại, gặp ở âm hư, thấp nhiệt, đàm ẩm, ứ huyết: (1) khô miệng không muốn uống, triều nhiệt đạo hạn, quyền đỏ — âm hư; (2) khát uống không nhiều, đầu mình nặng, thân nhiệt bất dương, bụng đầy, rêu nê — thấp nhiệt; (3) khát thích nước nóng uống không nhiều hoặc nôn liền, hoa mắt, vị trường sôi — đàm ẩm nội đình; (4) khô miệng chỉ muốn xúc miệng không muốn nuốt, lưỡi xanh/ban ứ huyết, mạch sáp — ứ huyết nội trở.

HỎI VỀ SỰ THÈM ĂN VÀ SỐ LƯỢNG ĂN:
Vị chủ thu nạp hủ thục, tỳ chủ vận hóa — cả hai là hậu thiên chi bản. Vị khí còn/mất liên quan trực tiếp tới bệnh nặng nhẹ, chuyển quy, dự hậu.
- Giảm thèm ăn (nạp ngai/nạp thiểu), 4 trường hợp: (1) ăn ít, gầy ốm mệt mỏi, bụng trướng, tiêu lỏng, lưỡi nhạt, mạch hư — tỳ vị khí hư; (2) bụng trướng, đầu mình nặng, tiêu lỏng, rêu nê — thấp tà khốn tỳ; (3) chán ăn sợ dầu mỡ, hoàng đản, đau sườn, thân nhiệt bất dương — can đởm thấp nhiệt; (4) sợ ăn (yếm thực), ợ hơi ợ chua, bụng trướng đau, rêu dày hủ — thực trệ nội đình. (Phụ nữ mất kinh, sợ ăn, nôn ói, mạch hoạt sác — coi chừng có thai.)
- Ăn nhiều mau đói: (1) kèm khát, tâm phiền, lưỡi đỏ rêu vàng, miệng hôi, táo bón — vị hỏa kháng thịnh; (2) kèm đại tiện lỏng — vị cường tỳ nhược.
- Đói mà không muốn ăn: cảm giác đói nhưng ăn ít, sót ruột/nóng, lưỡi đỏ ít rêu, mạch tế sác — vị âm bất túc, hư hỏa nội nhiễu.
- Thiên thực (kén ăn): trẻ em thích ăn gạo sống/đất — trùng tích; phụ nữ thích chua, tắt kinh, buồn ói, mạch hoạt sác — có thai (không phải bệnh lý).
- Tiên lượng qua ăn uống: thèm ăn tốt lên — vị khí hồi phục, dự hậu tốt; giảm — vị khí suy thoái; bệnh nặng lâu không ăn được mà đột nhiên ăn nhiều — "Trừ trung", hiện tượng nguy cấp (vị khí gần tuyệt, tự muốn ăn để tự cứu).

HỎI VỀ KHẨU VỊ:
Tỳ khai khiếu ở miệng, khí tạng phủ theo kinh mạch tới miệng.
- Miệng lạt không mùi vị — tỳ vị khí suy.
- Miệng ngọt/dính (niêm nê) — tỳ vị thấp nhiệt.
- Miệng chua — can vị uẩn nhiệt.
- Miệng vị chua thiu — thương thực.
- Miệng đắng — nhiệt chứng/hỏa tà/đởm nhiệt.
- Miệng mặn — thận bệnh hoặc hàn chứng.
- Sở thích vị theo tạng bệnh: can bệnh thích chua, tâm bệnh thích đắng, tỳ bệnh thích ngọt, phế bệnh thích cay, thận bệnh thích mặn.`,
      keyPoints: "Khát/uống nước phân biệt hàn nhiệt hư thực và tình trạng tân dịch\nThèm ăn và số lượng ăn phản ánh thịnh suy tỳ vị\nKhẩu vị dị thường phản ánh bệnh biến từng tạng phủ\n'Trừ trung' - ăn nhiều đột ngột ở bệnh nặng là dấu hiệu nguy cấp",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi về giấc ngủ (mất ngủ và buồn ngủ)",
      category: cat,
      summary: "Giấc ngủ liên quan tuần hành vệ khí và thịnh suy âm dương; mất ngủ (thất miên) do dương không nhập âm, buồn ngủ (đa miên) do âm hư dương thịnh hoặc thấp khốn tỳ dương.",
      content: `Giấc ngủ liên quan đến tuần hành vệ khí và thịnh suy âm dương cơ thể. "Linh khu - Khẩu vấn": vệ khí ban ngày đi dương kinh (dương khí thịnh thì thức), ban đêm đi âm kinh (âm khí thịnh thì ngủ). Bệnh làm âm dương thất điều: dương không nhập âm → mất ngủ; dương không xuất biểu → buồn ngủ. Âm dương thất điều cũng ảnh hưởng thần chí gây mất ngủ.

MẤT NGỦ (THẤT MIÊN, "bất muội"): khó vào giấc, thức giấc khó ngủ lại, hoặc không ngủ suốt đêm, kèm mộng mị nhiều — biểu hiện dương thịnh âm suy, thần bất thủ xá. 4 kiểu:
- Khó vào giấc ngủ, tâm phiền mộng nhiều, triều nhiệt đạo hạn, lưng gối mỏi mềm — tâm thận bất giao (thận âm khuy hư/tâm hỏa kháng thịnh, thủy hỏa không ký tế).
- Ngủ dễ tỉnh giấc, tâm quý, ăn ít phạt lực — tâm tỳ lưỡng hư (tỳ khí hư → huyết hư → tâm thần thất dưỡng).
- Mất ngủ hay giật mình, huyền vựng tức ngực, tâm phiền đởm khiếp, miệng đắng buồn nôn — đởm uất đàm nhiễu (tình chí uất kết hóa hỏa sinh đàm).
- Mất ngủ trằn trọc, bụng tức căng, ợ hơi, sình hơi, rêu dày nê — thực trệ nội đình (vị thất hòa giáng). "Vị bất hòa tắc ngọa bất an".

THÍCH NGỦ, BUỒN NGỦ (ĐA MIÊN): tinh thần uể oải, ngủ thiếp không cưỡng được; đa số do âm hư dương thịnh hoặc thấp khốn tỳ dương; cũng gặp ôn tà nhập tâm bào. 4 trường hợp:
- Uể oải muốn ngủ, đầu nặng mắt hoa, thân nặng, sình bụng, rêu nê, mạch nhu — thấp tà khốn tỳ (ngoại cảm thử thấp hoặc đàm thấp tích sẵn), thanh dương bất thăng.
- Sau ăn lờ đờ buồn ngủ, hình thể suy nhược, ăn ít/chán ăn, thiểu khí phạt lực — tỳ hư khí nhược.
- Yếu mệt cực độ, thần trí mông lung, chi lạnh, mạch vi — thận dương hư hoặc thương hàn thời kỳ cuối (tâm thận dương suy vi, âm hàn nội thịnh).
- Lờ đờ (hôn thụy), chiêm ngữ, sốt tăng về đêm hoặc phát ban, lưỡi đỏ thẫm, mạch sác — ôn bệnh nhập dinh huyết, tà hãm tâm bào.`,
      keyPoints: "Giấc ngủ phản ánh tuần hành vệ khí và thịnh suy âm dương\nMất ngủ: tâm thận bất giao, tâm tỳ lưỡng hư, đởm uất đàm nhiễu, thực trệ nội đình\nBuồn ngủ/đa miên: thấp khốn tỳ, tỳ hư khí nhược, thận dương hư, ôn bệnh nhập dinh huyết",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi về đại tiện",
      category: cat,
      summary: "Đại tiện do đại trường chủ, liên quan vận hóa tỳ vị, can sơ tiết, ôn húc mệnh môn; hỏi kỹ số lần, sắc chất, cảm giác bài tiết để biện hàn nhiệt hư thực.",
      content: `Bài tiết phân trực tiếp do đại trường chủ nhưng liên quan vận hóa tiêu hóa của tỳ vị, can sơ tiết, ôn húc của mệnh môn. "Cảnh Nhạc toàn thư": nhị tiện là cửa ngõ một thân, cần xét kỹ để biện hàn nhiệt hư thực.
Người khỏe: mỗi ngày/cách ngày đi tiêu 1 lần, thông thoáng, phân thành khuôn, không khô, không máu mủ niêm dịch, không đồ ăn chưa tiêu.

SỐ LẦN KHÁC THƯỜNG:
- Táo bón, khó đi, số lần giảm — do tân dịch trường đạo khô khuy, truyền đạo đại trường giảm. Các thể: sốt cao táo bón, bụng trướng đau, lưỡi đỏ rêu vàng táo — thực nhiệt chứng; mặt nhợt thích uống ấm, bí kết, mạch trầm trì ("lãnh bí") — âm hàn nội kết; đại tiện khô, lưỡi đỏ ít rêu, mạch tế sác — âm hư tân dịch hư khuy; bệnh lâu/người già/sản hậu táo bón — khí dịch lưỡng khuy.
- Tiết tả: phân nhão lỏng/như nước, số lần tăng — do tỳ thất kiện vận, thủy đình trường đạo. Các thể: ăn ít, bụng trướng đau ngầm, tiêu lỏng — tỳ hư; đau bụng tiêu chảy lúc hừng sáng, đi xong đỡ đau, lưng gối mỏi lạnh ("ngũ canh tả") — thận dương hư (mệnh môn hỏa suy); trướng bụng ợ hơi đồ ăn, đau bụng tiêu chảy đi xong đỡ — thương thực; tình chí uất ức, đau bụng tiêu chảy, đi xong giảm đau — can uất thừa tỳ.

PHÂN KHÁC THƯỜNG: đồ ăn không tiêu (tiêu phân sống) — tỳ hư tiết tả; đi tiêu lúc bón lúc lỏng (rối loạn thói quen) — can uất thừa tỳ (trước khô sau chảy đa số tỳ hư); tiêu đàm máu trong kiết lỵ; phân đen như dầu — "viễn huyết"; phân đỏ tươi — "cận huyết".

CẢM GIÁC KHÁC THƯỜNG KHI BÀI TIẾT:
- Hậu môn nóng rát — đại trường thực nhiệt (thử tả).
- Đi không thoải mái (bất sảng) — can uất thừa tỳ, trường đạo khí trệ; phân nhão như cháo kê vàng, không thông — thấp nhiệt uẩn kết đại trường.
- Mót rặn (lý cấp hậu trọng) — kiết lỵ, do thấp nhiệt nội trở, trường đạo khí trệ.
- Hoạt tả không cầm (thất cấm) — tỳ thận dương hư, hậu môn thất ước.
- Hậu môn khí trụy (thậm chí thoát giang) — tỳ hư trung khí hạ hãm.`,
      keyPoints: "Số lần/tính chất/cảm giác đại tiện biện hàn nhiệt hư thực\nTáo bón: thực nhiệt, âm hàn, âm hư, khí dịch lưỡng khuy\nTiết tả: tỳ hư, thận dương hư (ngũ canh tả), thương thực, can uất thừa tỳ",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi về tiểu tiện",
      category: cat,
      summary: "Tiểu tiện là chất bài tiết chuyển hóa tân dịch, liên quan khí hóa thận, túc giáng của tỳ phế, thông điều tam tiêu; hỏi số lượng, số lần, cảm giác để biện chứng.",
      content: `Nước tiểu là chất bài tiết của chuyển hóa tân dịch. Hỏi biến đổi tiểu tiện tìm hiểu doanh khuy tân dịch và khí hóa phế tỳ thận.
Người khỏe: mỗi ngày đi tiểu 3-5 lần, đêm 0-1 lần, lượng 24h 1000-1800ml (ảnh hưởng bởi uống vào, nhiệt độ, mồ hôi, tuổi tác).

SỐ LƯỢNG BẤT THƯỜNG:
- Tăng lượng: tiểu trong dài tăng, úy hàn thích ấm — hư hàn chứng (hàn khiến hãn dịch không tiết, thủy dịch hạ thẩm); khát uống nhiều tiểu nhiều, hao gầy — bệnh tiêu khát (thận âm hư suy, khai nhiều đóng ít).
- Giảm lượng: tiểu ngắn đỏ ít — đa số thực nhiệt chứng, hoặc hãn/thổ/hạ thương tân (hóa nguyên sinh nước tiểu không đủ).

SỐ LẦN BẤT THƯỜNG:
- Tiểu nhiều lần liên tục: tiểu ngắn đỏ, mót đi hoài ("lâm chứng") — thấp nhiệt uẩn kết hạ tiêu, bàng quang khí hóa bất lợi; tiểu trong nhiều lần không cầm — thận khí bất cố, bàng quang thất ước; tiểu đêm nhiều lần trong dài — người già/thận giai đoạn cuối, thận dương khuy hư; long bế (long=từng giọt, bế=không ra) — thực chứng (thấp nhiệt/ứ huyết/sỏi) hoặc hư chứng (người già khí hư, thận dương bất túc).

CẢM GIÁC KHÁC THƯỜNG:
- Tiểu đau, sáp, không thông, mót đi, nóng rát — lâm chứng (thấp nhiệt uẩn kết).
- Tiểu són (vài giọt sau khi tiểu) — người già, thận khí bất cố.
- Tiểu không tự chủ (niệu thất cấm) — thận khí bất cố, bàng quang thất ước (hôn mê mà tiểu không tự chủ — bệnh nặng).
- Di niệu (đái dầm khi ngủ) — thận khí bất cố, bàng quang hư suy.`,
      keyPoints: "Số lượng/số lần/cảm giác tiểu tiện phản ánh khí hóa thận-tỳ-phế-tam tiêu\nLong bế: thực chứng (thấp nhiệt/ứ huyết/sỏi) hoặc hư chứng (khí hư, thận dương bất túc)\nTiểu không tự chủ ở người hôn mê là dấu hiệu bệnh nặng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi phụ nữ (kinh nguyệt, đới hạ, thai nghén, sản hậu)",
      category: cat,
      summary: "Đặc điểm sinh lý phụ nữ: kinh nguyệt, đái hạ, thai nghén, sinh sản; hỏi kỹ để chẩn đoán bệnh phụ khoa qua chu kỳ, lượng, sắc, chất.",
      content: `Phụ nữ có kinh nguyệt, đái hạ, thai nghén, sinh sản — đặc điểm sinh lý bệnh lý riêng, cần hỏi kỹ để chẩn đoán phụ khoa.

HỎI VỀ KINH NGUYỆT: "Tố Vấn - Thượng cổ thiên chân luận": nữ 14 tuổi thiên quý tới, nhâm mạch thông, thái xung mạch thịnh, có kinh. Bình thường: có kinh lần đầu 13-15 tuổi, chu kỳ ~28 ngày, kéo dài 3-5 ngày, màu đỏ không cục ứ; không có kinh khi mang thai/cho bú; hết kinh ~49 tuổi.
- Kinh không đều (3 loại): (1) Tiên kỳ (sớm ≥8-9 ngày) — màu đỏ thẫm chất đặc lượng nhiều: huyết nhiệt (tà nhiệt bức huyết vọng hành); màu nhạt chất loãng lượng nhiều: khí hư (khí suy bất thống nhiếp huyết). (2) Hậu kỳ (muộn ≥8-9 ngày) — màu nhạt chất loãng lượng ít: huyết hư; sắc tím tối có cục lượng ít: hàn ngưng. (3) Diễn kỳ (không định kỳ, sai lệch ≥8-9 ngày) — sắc tím đỏ có cục lượng ít, đau trướng vú: khí uất; sắc nhạt chất lỏng lượng lúc nhiều lúc ít: tỳ thận hư tổn.
- Đau bụng khi hành kinh (thống kinh): đau trước kinh giảm sau khi có kinh — thực chứng (khí trệ huyết ứ, "bất thông tắc thống"); đau sau hành kinh kèm lưng mỏi — hư chứng (khí huyết bất túc/thận hư); chườm nóng đỡ đau — hàn chứng.
- Kinh bế: đúng chu kỳ mà không có hoặc bế >3 tháng (loại trừ thai nghén, cho bú, mãn kinh) — đa số huyết hư, can khí uất kết, hư lao.
- Băng lậu: ra rất nhiều không ngưng (băng) hoặc rỉ rả lâu dài (lậu) — sắc đỏ thẫm có cục: nhiệt chứng; sắc nhạt không cục: xung nhâm tổn thương/trung khí hạ hãm tỳ hư bất thống huyết.

HỎI VỀ ĐỚI HẠ: bạch đới ít là bình thường. Bệnh lý: "Bạch đới" (trắng, nhiều, trong loãng, không hôi) — hàn thấp (tỳ hư bất vận); "Hoàng đới" (vàng, nhiều, dính đặc, hôi) — thấp nhiệt; "Xích đới" (đỏ dính đặc hoặc đỏ trắng xen, hơi hôi) — can uất hóa nhiệt tổn thương bào lạc (sau mãn kinh còn xích đới rỉ rả — nghi ung thư, cần khám chuyên khoa sớm).

HỎI VỀ THAI NGHÉN: tắc kinh đột ngột, không bệnh lý khác, mạch hoạt sác xung hòa — nghĩ đã thụ thai.
- Ác trở (nghén): sợ ăn buồn nôn/nôn liên tục — vị khí suy (xung mạch khí vượng thượng xung); uất ức cáu giận, miệng đắng ợ chua — can uất hóa hỏa phạm vị; bụng trướng, chán ăn, nôn đàm dãi — đàm trọc thượng nghịch.
- Thai động bất an: bụng dưới đau trì nặng, mỏi lưng, ra dịch đỏ — báo trước trụy thai/sinh non; kèm hoa mắt ù tai tiểu nhiều — thận hư; kèm sắc mặt nhạt trắng, lừ đừ — khí huyết khuy hư; do té ngã — ngoại thương tổn thương xung nhâm.

HỎI SẢN HẬU: ác lộ (sản dịch) rỉ rả >20 ngày (sản hậu ác lộ bất tiệt) — khí hư, huyết nhiệt, huyết ứ. Sốt sản hậu liên tục — ngoại cảm (kèm ố hàn đau đầu), hỏa tà nội thịnh (sốt cao khát uống lạnh táo tiểu đỏ), hoặc huyết hư hóa táo sinh nhiệt (sốt thấp đau bụng ngầm, mặt trắng).`,
      keyPoints: "Kinh nguyệt không đều: tiên kỳ/hậu kỳ/diễn kỳ phân biệt huyết nhiệt, huyết hư, khí hư, hàn ngưng, khí uất\nĐới hạ: bạch đới (hàn thấp), hoàng đới (thấp nhiệt), xích đới (can uất hóa nhiệt - cảnh báo ung thư nếu sau mãn kinh)\nThai nghén/sản hậu: ác trở, thai động bất an, sốt sản hậu theo nguyên nhân",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn Chẩn - Hỏi trẻ em",
      category: cat,
      summary: "Nhi khoa cổ đại gọi 'Á Khoa'; hỏi qua cha mẹ/người nuôi, kết hợp đặc điểm sinh lý bệnh lý trẻ: tiên thiên, dinh dưỡng, tiêm chủng, yếu tố dễ gây bệnh.",
      content: `Nhi khoa cổ đại gọi "Á Khoa" (á=câm) — hỏi khó, thiếu chính xác, nên chủ yếu dựa vào cha mẹ/người nuôi, kết hợp đặc điểm sinh lý bệnh lý của trẻ để hỏi.
Đặc điểm sinh lý trẻ: tạng phủ non nớt (kiều nộn), sức sống mạnh mẽ, phát dục nhanh. Đặc điểm bệnh lý: phát bệnh nhanh, biến hóa nhiều, dễ hư dễ thực → cần chẩn đoán chính xác, điều trị kịp thời.

HỎI VỀ TÌNH HÌNH TRƯỚC VÀ SAU SINH: sơ sinh (trong 1 tháng) bệnh liên quan nhân tố tiên thiên và tình trạng khi sanh — hỏi dinh dưỡng mẹ lúc mang thai, cho bú, sanh dễ/khó, sanh non. Nhũ nhi (1 tháng - 3 tuổi): phát triển nhanh, cần dinh dưỡng nhiều, nuôi bú không tốt dễ suy dinh dưỡng, ngũ nhuyễn ngũ trì, huyết hư — hỏi ăn uống nuôi dưỡng, ngồi/bò/đứng/đi/mọc răng/nói chậm mau để tìm hiểu hậu thiên dinh dưỡng.

HỎI VỀ TIÊM CHỦNG VÀ TIẾP XÚC BỆNH TRUYỀN NHIỄM: trẻ 6 tháng-5 tuổi miễn dịch tiên thiên đã hết, miễn dịch hậu thiên chưa hình thành → dễ cảm nhiễm (thủy đậu, sởi…) — hỏi rõ lịch tiêm chủng và tiếp xúc bệnh truyền nhiễm.

HỎI VỀ NHỮNG YẾU TỐ DỄ GÂY BỆNH: nhũ nhi thần chí chưa hoàn thiện — dễ giật mình kinh sợ, sốt cao co giật (kinh phong); tỳ vị non yếu, sức tiêu hóa kém — dễ thương thực gây nôn ói, tiêu chảy, cam tích; thích ứng ngoại cảnh kém — cần hỏi tình hình nuôi dưỡng.`,
      keyPoints: "Nhi khoa 'Á Khoa' - hỏi qua cha mẹ, kết hợp đặc điểm sinh lý bệnh lý trẻ\nSơ sinh liên quan tiên thiên; nhũ nhi liên quan hậu thiên dinh dưỡng\nTrẻ dễ kinh phong, thương thực, cam tích do tạng phủ non yếu",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 6 chủ đề Vấn Chẩn (ẩm thực, giấc ngủ, nhị tiện, hỏi phụ nữ, hỏi trẻ em) - hoàn tất Bài 3.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

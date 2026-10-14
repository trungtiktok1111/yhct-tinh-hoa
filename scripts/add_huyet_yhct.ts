// Thêm "Khí Huyết trong Y học cổ truyền" (HUYET YHCT.docx, 220 đoạn) vào Lý luận
// cơ bản. Tài liệu rất chi tiết, trình bày cơ chế hình thành/chuyển hóa Tinh-Khí-
// Huyết-Tân dịch qua các tạng phủ, có trích dẫn Hải Thượng Lãn Ông, Đường Tông
// Hải (Huyết chứng luận), Lý Đông Viên, và đối chiếu nghiên cứu y học hiện đại.
// Trích/diễn giải trung thực theo nguồn, không bịa thêm nội dung.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Khí Huyết trong Y học cổ truyền",
      sourceType: "Tài liệu giảng dạy",
      authorOrOrg:
        "Chỉnh sửa & bổ sung theo ThS.BS. Lê Hoàng Sơn (ĐHYD TP.HCM); dẫn Trần Quốc Bảo (2011) Lý luận cơ bản YHCT NXB Y Học, Hoàng Duy Tân (2008) Mạch học tổng hợp NXB Đồng Nai, Đường Tông Hải (Huyết chứng luận), Hải Thượng Lãn Ông, Định Ninh Lê Đức Thiếp (Đông y số điển)",
      locator: "220 đoạn văn (docx)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Khí huyết - Tân dịch";

  await prisma.theoryTopic.create({
    data: {
      name: "Vận hóa thủy cốc: Vị - Tỳ - Tiểu trường",
      category: cat,
      summary: "Chuỗi chuyển hóa thức ăn: Vị nhào trộn → Tỳ dương chưng cất thành tinh khí → Tiểu trường gạn lọc thêm → Tỳ thăng thanh khí lên Phế.",
      content:
        "Vị nhào trộn, nghiền nát thức ăn để Tỳ vận hóa thành chất tinh vi, phần còn lại truyền tống xuống Tiểu trường. Vị ghét táo, ghét thấp — mọi thức ăn/thuốc/độc chất đều qua Vị trước, nên thuốc có tính táo/thấp mạnh cần phối Cam thảo (giảm táo) hoặc Sinh khương + Đại táo (bảo vệ Vị). Túc dương minh Vị kinh đi qua Tâm nên bệnh lý Vị có thể quấy nhiễu Tâm thần (mất ngủ, đau ngực, hồi hộp). " +
        "Tỳ dương là 'lửa' chưng cất thức ăn trong 'nồi' Vị thành tinh khí, tinh khí nhẹ trong được Tỳ khí đưa lên Phế; chất nặng đục truyền xuống Tiểu trường. Tỳ dương suy làm: (1) Vị khó truyền tống → đầy bụng; (2) thanh trọc lẫn lộn xuống Đại trường → tiêu chảy phân sống; (3) thanh trọc dồn hạ tiêu bức bách Thận dương vượt lên gây chứng nhiệt (dù dương hư thường sinh hàn) — điều trị theo 'cam ôn trừ đại nhiệt' (vị ngọt, tính ấm bổ Tỳ dương/khí), điển hình bài Bổ trung ích khí thang (Lý Đông Viên). " +
        "Tỳ ưa táo ghét thấp, có chức năng vận hóa thủy thấp — chuyển thấp (nội/ngoại) thành dạng đào thải được; bệnh có thấp đều có thể trị bằng kiện Tỳ vận hóa thủy thấp. Tỳ âm được nuôi bởi tinh huyết do Tỳ dương vận hóa tạo ra, nên lâm sàng ít gặp Tỳ âm hư đơn độc mà thường Tỳ dương/khí hư trước. " +
        "Vị khí chủ giáng (truyền tống thức ăn xuống Tiểu trường); nếu thức ăn không nghiền nát, Tỳ không vận hóa, hoặc Tiểu trường không tiếp nhận được thì Vị khí nghịch gây nôn ói. " +
        "Tiểu trường dùng hỏa gạn lọc thêm tinh khí còn lại trong thức ăn, chuyển lên Phế qua Tỳ. Tiểu trường dương suy không phân được thanh trọc → Đại trường không tế bí biệt trấp được → tiêu chảy. " +
        "Tỳ chủ thăng thanh: đưa tinh khí (gọi là 'Cốc khí', gồm cả phần tinh của thủy) lên Phế; đồng thời giữ các tạng phủ ở đúng vị trí — thanh dương không thăng gây sa tử cung, sa bàng quang, sa trực tràng, trĩ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tông khí, Dinh khí, Vệ khí",
      category: cat,
      summary: "Phế chủ túc giáng và nạp thanh khí (nhờ Thận chủ nạp khí) hợp với Cốc khí thành Tông khí; Tông khí chia Dinh khí (nuôi dưỡng, trong mạch) và Vệ khí (bảo vệ, ngoài mạch).",
      content:
        "Phế chủ túc giáng: gạn lọc thiên khí hít vào thành thanh khí và trọc khí; trọc khí thải ra khi thở ra ('Phế chủ hô'). Thanh khí cần Thận nạp khí mới được hấp thu ('Thận chủ hấp' — hít vào); Thận không nạp khí → thời gian thở ra kéo dài, hít vào ngắn. " +
        "Cốc khí (từ Tỳ vận hóa) + thanh khí (từ Phế túc giáng) hợp thành Tông khí tại Phế; Tông khí được Phế tuyên thông đi khắp tạng phủ, mỗi tạng phủ nhận và tổng hợp thành khí riêng (Can khí, kinh lạc khí...). Hệ quả: Phế không tuyên phát được Tông khí → ngực đầy trướng, căng tức; Tông khí suy → có tạng phủ khí suy, có tạng phủ khí không suy (do mỗi tạng có khí riêng). Tông khí tại lồng ngực tạo Hung khí — nơi Tâm và Phế liên hệ với nhau (bệnh Phế/Tâm ảnh hưởng lẫn nhau qua Hung khí). " +
        "Tông khí chia 2 loại theo đặc tính: Dinh khí (di chuyển chậm, trong lòng kinh mạch, nuôi dưỡng tạng phủ bên trong) và Vệ khí (di chuyển nhanh, ngoài kinh mạch, nuôi dưỡng bên ngoài và bảo vệ qua tấu lý/bì mao). " +
        "Dinh khí có quy luật thịnh-suy theo giờ trong từng tạng (cơ sở của Tý ngọ lưu chú) — ứng dụng: chẩn đoán (bệnh thực của tạng nặng lên vào giờ tạng đó thịnh, bệnh hư nhẹ đi), điều trị (châm/thuốc theo giờ thịnh để nghênh khí hoặc theo khí lui), tiên lượng (bệnh thực nặng có nguy cơ tử vong vào giờ tạng thịnh). " +
        "Vệ khí: tính nhanh mạnh, chạy ngoài kinh mạch đến tấu lý/bì mao. Chức năng: (1) bảo vệ chống ngoại tà; (2) nuôi dưỡng bì mao tấu lý; (3) điều hòa đóng mở bì khổng (lỗ chân lông) → điều hòa bài tiết mồ hôi; (4) qua đó điều hòa thân nhiệt, tân dịch. Vệ khí hình thành từ 3 tạng: Tỳ (vận hóa thủy cốc → tinh khí), Phế (hình thành Tông khí), Thận (khí hóa Bàng quang). Vệ khí suy → dễ cảm mạo, da lông không nhuận sáng, rối loạn mồ hôi (tự hãn/đạo hãn/vô hãn), thân nhiệt không ổn định. " +
        "Vệ khí tuần hành độc lập với Dinh khí: ban ngày 'xuất dương' (vượng ở biểu), ban đêm 'nhập âm' (vượng ở lý) — ban đêm vệ khí ở phần âm nhiều nên khả năng bảo vệ giảm, cần tránh ngoại tà lúc ngủ. Dương không nhập âm thì không ngủ được (vệ còn hoạt động ngoài thì thần không yên). Trong ôn bệnh thời kỳ dinh huyết: ban ngày vệ khí ở dương không gặp tà nên không sốt, ban đêm dương nhập âm gặp tà → phát nhiệt về đêm, sáng lại xuất dương nên sốt lui. Trong âm hư: đêm vệ khí nhập âm nhưng âm không đủ tiềm giữ → vệ khí thoát ra ngoài kéo tân dịch theo gây đạo hãn ('âm hư sinh đạo hãn').",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Huyết: hình thành, Tâm chủ huyết mạch, Phế triều bách mạch",
      category: cat,
      summary: "Huyết hình thành từ Dinh khí được Tâm dương 'hóa đỏ'; Tâm chủ huyết mạch gồm 3 chức năng (hóa huyết, hành huyết, nuôi mạch); Phế triều bách mạch là cơ sở của mạch chẩn thốn khẩu.",
      content:
        "Dinh khí được Phế tán đến Tâm, Tâm dương đưa hỏa vào Dinh khí hóa thành huyết dịch (huyết có sắc đỏ, tính ấm nhờ Tâm hỏa, có tinh vi thủy cốc nên nuôi dưỡng và ôn ấm). Huyết chứa tân dịch và tinh → 'tinh huyết đồng nguyên', 'tân huyết đồng nguyên'. Thập toàn đại bổ dùng Nhục quế ôn Tâm dương để bổ huyết, Hoàng kỳ bổ khí để bổ huyết — theo Đường Tông Hải (Huyết chứng luận): 'thủy thời hóa khí, hỏa thời hóa huyết' chính là ý Tâm dương hóa huyết. " +
        "Tâm huyết dưỡng Tâm thần (thần là hoạt động của Tâm dương); Tâm huyết hư → Tâm thần thất dưỡng → tâm quý chính xung, thất miên, kiện vong (hay quên). " +
        "Tâm chủ huyết mạch gồm 3 chức năng: (1) Tâm dương hóa Dinh thành huyết; (2) Tâm khí thúc đẩy huyết vận hành (dưới hỗ trợ của Phế khí) — Tâm khí suy → huyết hành vô lực → huyết ứ trệ; (3) Tâm âm nuôi dưỡng mạch lạc (trơn tru, mềm dẻo) — Tâm âm suy → mạch xơ cứng, giòn dễ vỡ → xuất huyết. Biện luận lâm sàng cần phân biệt rõ chức năng nào suy yếu. " +
        "Tâm khí thúc đẩy huyết theo quy luật gọi là Tâm luật — Tâm khí bình hòa thì Tâm luật ổn định; Tâm có nhiệt → Tâm luật nhanh; Tâm khí loạn → Tâm luật rối loạn. Huyết vận hành bình thường cần 3 điều kiện: mạch thông suốt, huyết dịch đầy đủ, Tâm khí sung mãn (Hải Thượng Lãn Ông: huyết như nước sông — đầy thì lưu thông, cạn thì khó chảy; huyết hư cũng sinh huyết ứ). Quan sát chức năng Tâm hành huyết qua: sắc mặt/lưỡi, mạch tượng, cảm giác ở ngực. " +
        "Phế triều bách mạch: Phế khí tuyên tán phối hợp Tâm chủ huyết mạch đưa huyết đi khắp thân theo kinh mạch, huyết lại trở về Phế tạo vòng tuần hoàn. Vì mọi thông tin khí huyết tạng phủ đều chuyển về Phế, Nạn kinh đề ra mạch chẩn dựa vào thốn khẩu (kinh Thủ thái âm Phế) thay cho tam bộ cửu hậu toàn thân cổ điển — vẫn giữ tên 'tam bộ cửu hậu' nhưng là 3 bộ Thốn-Quan-Xích, mỗi bộ xem ở 3 mức khinh án/trung án/trọng án (Nguồn: Hoàng Duy Tân, Mạch học tổng hợp).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tinh: nguồn gốc tiên thiên - hậu thiên và chức năng",
      category: cat,
      summary: "Tinh gồm tinh hậu thiên (từ huyết, tổng hợp riêng cho mỗi tạng phủ) và tinh tiên thiên (tàng ở Thận, nguồn gốc sự sống); Thận tàng tinh và điều phối phân bố tinh.",
      content:
        "Huyết đến tạng phủ nào thì được tổng hợp thành dạng 'tinh' đặc trưng riêng, gọi là tinh hậu thiên, tàng trữ tại chính tạng phủ đó như chất dự trữ — có thể hóa khí hoặc hóa huyết CHỈ dùng cho tạng phủ đó. Do đó trong chứng huyết hư/tinh bất túc/khí hư, không phải mọi tạng phủ đều hư mà chỉ một số tạng phủ bị ảnh hưởng theo cơ chế bệnh sinh cụ thể (ví dụ: Can tinh tàng ở Can, hóa Can khí để sơ tiết/tàng hồn, hóa Can huyết để nuôi cân). " +
        "Tinh hậu thiên dư thừa sẽ theo huyết về tàng trữ tại Thận — nơi còn có tinh tiên thiên (tạo từ tinh cha + tinh mẹ từ bào thai). Tinh tiên thiên sinh nguyên thần, nguyên thủy, nguyên hỏa, nguyên khí; đến thời điểm nhất định sinh Tâm hỏa (quân hỏa) và Tâm thần làm 'quân chủ', nguyên hỏa/nguyên thần thành 'tướng'. Tinh tiên thiên là nguồn sinh phát tinh hậu thiên, và tinh hậu thiên bổ sung ngược lại cho tinh tiên thiên; tinh tiên thiên suy giảm theo lão hóa, cạn kiệt thì chết. " +
        "Thận tàng tinh: vừa dự trữ tinh cho toàn cơ thể, vừa điều phối phân bố tinh theo nhu cầu từng tạng phủ. " +
        "Chức năng của Tinh (6 vai trò): (1) vừa là vật chất vừa là động lực thúc đẩy cơ thể phát triển — tinh hóa huyết (nuôi dưỡng) và hóa khí (như củi hóa lửa, cho tạng phủ năng lượng hoạt động) — 'tinh khí cùng một chất, tinh huyết đồng nguyên'; thiếu tinh → gầy ốm, sụt cân. (2) tạo sự phát dục — tinh phát triển đủ mạnh tạo 'Thiên quý' (duy trì khả năng sinh sản: nữ có kinh, nam có tinh dịch); Thiên quý chỉ tạng âm thủy (Thận) theo thiên can (Quý là âm thủy). (3) đảm bảo sinh sản — tinh sinh dục (nam: tinh dịch; nữ: kinh nguyệt). (4) tinh sinh tủy hóa huyết (nên thuốc bổ Thận tinh như Thục địa có thể bổ huyết). (5) tinh sinh tủy dưỡng cốt (tinh suy → xương mềm yếu dễ gãy; lâm sàng dùng thuốc bổ Thận sinh tinh trị bệnh xương). (6) tinh sinh tủy nuôi não — não là 'bể của tủy', là 'phủ của nguyên thần' (thần trú ngụ, không phải nơi tạo thần — Tâm mới tàng thần và chi phối thần); tinh bất túc → đầu lâng lâng, tai không rõ, mắt không rõ; tổn thương não (chấn thương) có thể gây nguy hiểm tính mạng hoặc yếu liệt do thần không chỉ huy được tứ chi. " +
        "Tinh dịch nam hình thành từ tinh sinh dục (Thận) + phần 'tân' trong tân dịch — mất cân bằng 2 thành phần này gây tinh loãng/thiểu tinh; nhiệt thương tinh thất cần điều trị cả thanh nhiệt sinh tinh và dưỡng âm sinh tân.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tiểu trường, Đại trường, Bàng quang — chuyển hóa và bài xuất thủy dịch",
      category: cat,
      summary: "Tiểu trường phân thanh trọc lần 2, Đại trường tế bí biệt trấp, Bàng quang chứa/bài xuất nước tiểu dưới sự khí hóa của Thận.",
      content:
        "Tiểu trường nhận thức ăn từ Vị (đã qua Tỳ vận hóa), phân thanh trọc thành 3 phần: tinh thanh (Tỳ chuyển lên Phế), thủy thanh (theo Tam tiêu xuống Bàng quang), phần trọc (xuống Đại trường). Điều kiện truyền tống xuống Đại trường: Tiểu trường phân thanh trọc xong, Tiểu trường khí sung mãn, Đại trường còn khả năng tiếp nhận — thiếu 1 trong 3 gây đầy bụng/trướng bụng hoặc tiêu chảy. Tiểu trường dương suy không phân thanh giáng trọc → Đại trường không tế bí biệt trấp được → tiêu chảy. " +
        "Đại trường tế bí biệt trấp: gạn lọc thủy thanh trong phần thủy cốc nhận từ Tiểu trường, chuyển sang Bàng quang. Phụ thuộc tình trạng tân dịch cơ thể/Đại trường: tân dịch thiếu → tăng tế bí biệt trấp (hấp thu/giữ lại tân dịch nhiều hơn, phân khô); tân dịch dư → giảm tế bí biệt trấp (tân dịch trong phân tăng → tiêu chảy) — lâm sàng dùng thuốc tả hạ gây tiêu chảy để loại bỏ tân dịch dư (thủy thũng, cổ trướng). Tân dịch Phế và Đại trường liên hệ mật thiết — nhuận Phế có thể nhuận trường và ngược lại. " +
        "Đại trường truyền tống phân ra ngoài, cần: khí lực Đại trường sung mãn, Thận khí điều hòa đóng mở tiền-hậu âm. Khí lực Đại trường quá vượng → truyền tống nhanh, tế bí biệt trấp chưa đủ → tiêu chảy; khí lực kém → truyền tống chậm, tế bí biệt trấp nhiều hơn → táo bón. Thận khí suy không làm chủ đóng mở hậu âm → đại tiện không tự chủ. " +
        "Bàng quang chứa thủy dịch (từ Tiểu trường/Đại trường/Phế thông điều thủy đạo đưa đến) chờ Thận khí hóa thành khí trong thủy (khí thanh) và thủy trọc. Rối loạn Thận khí hóa Bàng quang: (1) khí hóa quá nhiều → nước tiểu vàng ít (cô đặc); (2) khí hóa không hoàn thành → nước tiểu nhiều, nhạt màu, hoặc tràn ra cơ phu gây thủy thũng (lúc đó nước tiểu lại ít). Thận khí hóa Bàng quang (điều chỉnh tăng/giảm thải trừ) phối hợp Thận chủ thủy (cân bằng thủy dịch toàn thân) để giữ cân bằng chung. Bàng quang truyền tống nước tiểu cần khí lực Bàng quang sung mãn và Thận chủ tiền-hậu âm bình thường — cản trở gây tiểu gắt/buốt/lắt nhắt/gấp; Thận không chủ đóng mở tiền âm → tiểu không tự chủ. " +
        "Khí trong thủy (sau khi Thận khí hóa Bàng quang) có 3 chức năng: góp phần hình thành Vệ khí (qua kinh Túc thái dương Bàng quang lên Phế hợp với Tông khí — lý giải vì sao Phế chủ biểu và Thái dương kinh cũng chủ biểu); vận lên Phế thành tân dịch; vận lên Tâm để thanh Tâm hỏa.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tân dịch: phân loại, chuyển hóa và chức năng",
      category: cat,
      summary: "Tân dịch gồm Tân (loãng, tư nhuận) và Dịch (đặc, nhu dưỡng); hình thành từ khí trong thủy ngưng tụ ở Phế, lưu hành theo Tam tiêu, điều tiết bởi Thận.",
      content:
        "Khí trong thủy (khinh thanh) thăng lên thượng tiêu, ngưng tụ tại Phế (tạng cao nhất, như 'chiếc lộng' che phủ thượng tiêu) thành thủy thanh — đây là cơ chế hình thành tân dịch. Phế phân tán thủy thanh đi toàn thân theo đường Tam tiêu để nhuận dưỡng; Phế không thông điều thủy đạo hoặc Tam tiêu tắc trở → thủy thũng (khởi đầu thường ở mặt, do Phế ở thượng tiêu). Thủy trọc (sau khi tạng phủ sử dụng) theo Tam tiêu về Bàng quang, hoàn thành vòng tuần hoàn thủy dịch. " +
        "Tân dịch gồm nhiều loại dịch (tạng phủ, nước mắt, nước bọt, dịch khớp...), nuôi dưỡng và tư nhuận tạng phủ; vận hành theo khí, đi chung với huyết trong mạch, cũng đi theo Tam tiêu thấm toàn thân; theo khí mà thoát. Thận chủ thủy điều tiết tổng thể; phối hợp Thận khí hóa Bàng quang (làm tân dịch sinh/trao đổi nhanh) và Thận chủ thủy (làm chậm lại) để giữ cân bằng. " +
        "Phân 2 loại theo bản chất: Dịch — đặc hơn, chậm hơn, ở khớp xương/tạng phủ, chủ nhu dưỡng (làm khớp co duỗi dễ, cốt tủy sung mãn). Tân — loãng hơn, nhanh hơn, ở bì phu/cơ nhục/các khiếu, thấm qua huyết mạch, chủ tư nhuận. Tân dịch đào thải qua đại tiện, tiểu tiện, mồ hôi — mang theo nhiệt và sản phẩm chuyển hóa; rối loạn các đường này gây tích độc. Tân và Dịch tuy 2 loại nhưng chuyển hóa bổ sung nhau, thường biện luận chung — riêng khi bệnh lý 'thương tân' (mất tân) và 'thoát dịch' (mất dịch) cần phân biệt. Về nguồn gốc: Tiểu trường chủ Dịch (gạn lọc đưa qua Bàng quang, công năng nuôi dưỡng); Đại trường chủ Tân.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thủy hỏa ký tế: giao thông Tâm - Thận",
      category: cat,
      summary: "Tâm (hỏa, quẻ Ly, thượng tiêu) và Thận (thủy, quẻ Khảm, hạ tiêu) giao thông qua Tiểu trường-Bàng quang; mất giao thông gây chứng Tâm Thận bất giao với 3 cơ chế khác nhau.",
      content:
        "Khí trong thủy (từ Thận khí hóa Bàng quang) theo Tam tiêu lên Tâm Phế để thanh Tâm hỏa (mang tính hàn của thủy); Tâm hỏa theo kinh lạc (Tâm→Tiểu trường→Bàng quang→Thận) xuống ôn Thận dương. Theo Hải Thượng Lãn Ông: Thận là quẻ Khảm (hành thủy), Tâm là quẻ Ly (hành hỏa) — hỏa dưới thủy trên như bếp lò nấu được cơm nước (thủy hỏa ký tế); ngược lại hỏa trên thủy dưới không giao thông được gọi là 'thủy hỏa vị tế'. Phù hợp quy luật âm ở dưới thì thăng, dương ở trên thì giáng, tạo giao hòa âm dương sinh ra sự sống. " +
        "Ví như tuần hoàn nước tự nhiên: Tâm như mặt trời tỏa nhiệt; Thận như đất hấp thu nhiệt làm nước bốc hơi thành mây; Phế (tạng cao nhất) như bầu trời; mây tích đủ thành mưa rơi xuống (ứng với Phế thông điều thủy đạo); mưa làm giảm nhiệt mặt trời, vạn vật phát triển thuận lợi. " +
        "TÂM THẬN BẤT GIAO — 3 cơ chế khác nhau, điều trị khác nhau: (1) Thận âm hư trước → Tâm âm không được tư nhuận nên cũng hư → Tâm hỏa vượng thịnh: điều trị bổ Thận âm, bổ Tâm âm, thanh Tâm hỏa (Thiên vương bổ tâm đơn, Hoàng liên a giao thang — chú trọng bổ Thận âm). (2) Tâm âm hư trước → hỏa thiêu đốt làm Thận âm suy kiệt: điều trị tương tự nhưng chú trọng thanh Tâm hỏa, bổ Tâm âm. (3) Thận dương hư, không khí hóa được Bàng quang → khí trong thủy không hình thành để thanh Tâm hỏa → Tâm hỏa vượng (Tâm âm có thể hư hoặc không): điều trị chủ yếu bổ Thận dương, thứ là thanh Tâm hỏa (Giao thái hoàn: Nhục quế bổ Thận dương + Hoàng liên thanh Tâm hỏa). " +
        "Kinh Bàng quang-Tiểu trường nối nhau (đều Thái dương) lý giải: Tâm có nhiệt → Tiểu trường có nhiệt → tiểu đỏ (hỏa nhiệt qua Bàng quang); mạng lưới Thái dương kinh này chủ biểu, kháng ngoại tà. " +
        "LONG HỎA (Thận hỏa): Thận chủ thủy và hỏa (Long hỏa) cùng ở hạ tiêu, cân bằng âm dương Thận giữ hạ tiêu ổn định. Thận dương suy → bị Thận âm (hàn) lấn át → Long hỏa tránh hàn thượng thăng lên thượng tiêu cùng Tâm hỏa (Quân hỏa) → thượng tiêu phát nhiệt (khát nước, lở miệng, huyễn vựng, mắt đỏ, mặt đỏ) trong khi hạ tiêu chỉ còn hàn thủy (chân lạnh, phù thũng, tiểu nhiều trong) — gọi là 'Chân dương nhiễu loạn', cần phân biệt với chứng thượng nhiệt hạ hàn do Tâm Thận bất giao. " +
        "Thận hỏa còn ôn Tỳ dương liên tục để Tỳ vận hóa thủy cốc — Thận dương suy → Tỳ dương suy → ngũ canh tả (tiêu chảy giờ Dần 3-5h sáng, do Phế giáng thủy xuống gặp thủy đình đọng do Thận dương hư; đến giờ Mão Đại trường khí vượng tế bí biệt trấp thì giảm tiêu chảy) — trị cần ôn cả Thận dương và Tỳ dương ('lấy thổ chế thủy'), theo Định Ninh Lê Đức Thiếp nên kết hợp Nhị trần thang với Tứ thần hoàn.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Can tàng huyết, Đởm, và cơ chế xuất huyết",
      category: cat,
      summary: "Can tàng huyết điều tiết lượng huyết toàn thân theo nhu cầu, nuôi dưỡng cân/Xung Nhâm/hồn, ngăn xuất huyết; Can sơ tiết chi phối hoạt động toàn thân; Đởm tàng đởm trấp (phủ kỳ hằng).",
      content:
        "Can tàng huyết: lưu trữ, điều tiết huyết theo nhu cầu & thời gian (ban ngày huyết ra mắt/tay chân để hoạt động, ban đêm Can thu huyết về — huyết không tàng thì thần không tàng, không ngủ được). Can tàng huyết cân bằng Can âm-Can dương (huyết kém → Can âm không tiềm được Can dương → Can dương vượng). Huyết do Can tàng nuôi dưỡng mạch Xung-Nhâm → Bào cung (kinh nguyệt, nuôi thai) — Can huyết kém → Xung Nhâm thất dưỡng → kinh nguyệt rối loạn, khó thụ thai. Can tàng huyết + Can sơ tiết ngăn xuất huyết — Can khí không sơ tiết → khí nghịch → huyết theo khí xuất ra (như ho ra máu); Đường Tông Hải (Huyết chứng luận) đề xuất thứ tự trị huyết chứng: Chỉ huyết → Ninh huyết → Khử ứ → Bổ huyết (bổ huyết để sau cùng vì phải khử ứ huyết chết trước để kinh lạc thông mới sinh tân huyết). Can cần đủ huyết mới tàng được huyết — Can âm/huyết hư → khó ngủ. " +
        "Can nhận huyết tổng hợp thành Can tinh → gạn thành tinh trấp → dồn xuống Đởm gọi là Đởm trấp, tàng trữ tại Đởm. ĐỞM vừa là phủ (truyền tống) vừa là phủ kỳ hằng (tàng trữ đởm trấp) — gọi là 'trung tinh chi phủ'. Đởm còn là 'trung chính chi quan' (giữ các tạng phủ hoạt động ngay thẳng) và 'quyết đoán xuất yên' (giúp Thần quyết định sáng suốt, dứt khoát) — Đởm khí hư → giảm quyết đoán, hay khiếp sợ (chứng Tâm Đởm khí hư). Đởm trấp màu vàng vị đắng — Đởm mất khả năng tàng (do Can không sơ tiết cho Đởm, thấp/nhiệt ngoại/nội tà, hoặc Đởm khí hư) → tràn ra ngoài gây hoàng đản, miệng đắng. Đởm thừa hưởng tính sơ tiết của Can để hỗ trợ Vị giáng, Tỳ vận hóa, Tiểu trường phân thanh trọc, Đại trường tế bí biệt trấp — Đởm mất sơ tiết thì các chức năng này rối loạn (nôn ói, đầy bụng, tiêu chảy...). " +
        "Can huyết nuôi Cân (co duỗi dễ dàng) — Can huyết kém → cân teo, co rút, khớp cứng; Can khí hư → yếu liệt; Can khí vượng → co giật, run lắc (phong động). Về câu 'trị phong tiên trị huyết, huyết hành phong tự diệt': chỉ áp dụng khi phong tà đã tán hết, chỉ còn khí huyết ứ trệ (dùng hành khí hoạt huyết) — KHÔNG áp dụng khi còn ngoại phong (phải khu phong) hoặc khi Can phong nội động do Can âm hư/Can dương vượng (phải bình Can, tiềm dương, tức phong, thanh nhiệt, dưỡng Can âm — lạm dụng hoạt huyết tính táo sẽ làm nặng thêm); sốt cao trong ôn bệnh gây Can âm huyết hư co giật thì cần bổ Can huyết kết hợp thanh nhiệt. " +
        "Can chủ sơ tiết (làm tạng phủ hoạt động thư thái) cho toàn cơ thể, không chỉ Vị Trường — mất sơ tiết gây: Tâm tàng thần rối loạn (dễ cáu giận), Phế khí nghịch (ho), Tỳ không vận hóa (đầy bụng), Vị không giáng (nôn), Bàng quang không truyền tống thuận (lâm chứng), Đại trường rối loạn (tiết tả/táo bón), rối loạn sinh dục (cương dương, xuất tinh). Can mất sơ tiết → khí uất → huyết ứ. Can tàng Hồn (đáp ứng cảm xúc) — Can khí không sơ tiết → dễ giận; Can khí hư → hồn suy → thờ ơ, trầm cảm; Can huyết hư → hồn không yên → nhiều mộng mị. " +
        "Cơ chế xuất huyết tổng hợp (7 nguyên nhân): khí hư (Can, Tỳ) không giữ huyết trong mạch; huyết ứ cản trở lưu thông gây huyết tràn ra; nhiệt bức huyết vọng hành; Tâm âm không nuôi mạch làm mạch dễ vỡ; chấn thương/sang thương; nhiệt tổn thương huyết lạc; huyết theo khí nghịch. Tỳ khí giữ huyết chạy đúng hướng (thống nhiếp) — Tỳ khí suy → huyết ra ngoài mạch (khái huyết, thổ huyết, tiện huyết, nục huyết, băng huyết...).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phế chủ khí - chủ âm; Chính khí và Tà khí",
      category: cat,
      summary: "Phế tổng hợp và tuyên tán mọi loại khí trong cơ thể, chủ âm thanh/giọng nói; Chính khí là năng lực tự điều tiết-kháng tà-tự phục hồi của cơ thể, đối lập với Tà khí.",
      content:
        "Phế chủ tất cả các loại khí: Tỳ (vận hóa thủy cốc → tinh vi), Phế (túc giáng thiên khí → thanh khí), Thận (khí hóa Bàng quang → khí trong thủy) đều được chuyển về Phế tổng hợp thành Tông khí, rồi Phế tuyên tán đi khắp — mỗi tạng phủ/kinh lạc nhận và tổng hợp thành khí riêng. " +
        "Phế chủ âm (thanh): khí trong ngực truyền qua thanh quản tạo âm thanh/giọng nói. Điều kiện giọng nói bình thường: Tâm tàng thần sáng suốt; Phế khí sung mãn; thanh quản thông suốt toàn vẹn. Phế khí suy → tiếng nhỏ yếu vô lực; thanh quản tắc → giọng khàn biến dạng; thần không sáng suốt (như trúng phong tổn thương não lạc) → khó nói hoặc biến dạng tiếng nói — điều trị cần khai khiếu tỉnh thần, châm thêm huyệt kinh Tâm và Tâm bào. " +
        "CHÍNH KHÍ: hoạt động công năng bình thường của cơ thể — khả năng tự điều tiết thích ứng hoàn cảnh, phòng chống tà khí, tự khỏi bệnh. 3 phương thức: (1) tự điều tiết duy trì cân bằng âm dương; (2) kháng tà để phòng/khu bệnh; (3) tự phục hồi sau bệnh/hư nhược. " +
        "TÀ KHÍ (bệnh tà): nguyên nhân gây bệnh từ môi trường ngoài hoặc do cơ thể tự sinh ra gây hại chính khí — gồm lục dâm, thất tình, ngoại thương, đàm ẩm, huyết ứ... " +
        "Bệnh phát sinh do 2 yếu tố: chính khí suy (khả năng kháng bệnh giảm) và tà khí thịnh (tác động gây bệnh) — khi chính khí không đủ sức kháng tà, hoặc tà khí vượt quá sức chính khí, bệnh mới phát sinh (rối loạn tạng phủ, âm dương, khí huyết, tân dịch). " +
        "Ngoại tà xâm nhập qua bì mao: đầu tiên đấu tranh với Vệ khí; nếu thắng mới vượt bì phu/tấu lý gây bệnh. Chính khí được huy động ra biểu đấu tranh → mạch Phù; đấu tranh sinh nhiệt → phát sốt (sốt ngoài da thịt, khác sốt âm hư nội nhiệt từ trong lý). Tùy tương quan lực lượng chính-tà, có 5 tình huống: chính thắng tà thoái; tà trục chính suy; tà thịnh chính hư; tà chính cầm cự; chính hư tà lưu.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tương quan Huyết YHCT và y học hiện đại (nghiên cứu phân tử)",
      category: cat,
      summary: "Tổng hợp các nghiên cứu hiện đại (sinh học phân tử, dược lý học mạng lưới) đối chiếu các chứng Huyết ứ, Khí trệ huyết ứ, và cơ chế Bổ huyết theo YHCT.",
      content:
        "HUYẾT Ứ: Liao và cs (2016) tìm thấy 2 miRNA (miR-146b-5p, miR-199a-5p) và 23 mRNA đích đặc trưng cho bệnh cảnh huyết ứ ở bệnh nhân nhồi máu não cấp/đau thắt ngực không ổn định so với người khỏe mạnh; miR-146b-5p liên quan điều hòa miễn dịch/viêm qua TLR4 và giảm biểu hiện TNFα qua IRAK/NF-kB; miR-199a-5p liên quan bệnh cơ tim phì đại. " +
        "Zhao và cs (2014) dùng LC-Q-TOF/MS phân biệt bệnh cảnh đàm thấp và huyết ứ trên bệnh mạch vành mạn: tìm 18 marker chuyển hóa (purine, pyrimidine, amino acid); huyết ứ có tỷ lệ Phe/Tyr cao hơn (hoạt hóa miễn dịch cao hơn), uridine/uric acid/dUMP tăng cao hơn đàm thấp (liên quan stress oxy hóa, chuyển hóa năng lượng) — gợi ý huyết ứ và đàm thấp là 2 giai đoạn khác nhau về viêm/oxy hóa/chuyển hóa năng lượng trên cùng bệnh mạch vành mạn. " +
        "Yue và cs (2017) — dược lý học mạng lưới trên cặp Đào nhân-Hồng hoa (hoạt huyết): tác động lên ~20 con đường tín hiệu (cAMP, calcium, NF-kB, sphingolipid, HIF-1, estrogen, neurotrophin, TNF...) liên quan tổn thương thiếu máu não, viêm, đột quỵ, bảo vệ thần kinh. " +
        "Chen và cs (2019) khảo sát RNA huyết tương ở bệnh nhân khí trệ huyết ứ (nhiều bệnh YHHĐ khác nhau nhưng cùng chứng YHCT): khác biệt về con đường sphingolipid, neurotrophin, AMPK, endocytosis — gợi ý khí trệ huyết ứ liên quan cả rối loạn thần kinh và chuyển hóa năng lượng, phù hợp biểu hiện đau căng tức, tê, thay đổi cảm xúc (khó chịu, trầm cảm). " +
        "BỔ HUYẾT: Sun và cs (2016) so sánh đích tác động Tứ quân (bổ khí) và Tứ vật (bổ huyết): Tứ vật tác động chủ yếu chuyển hóa amino acid/carbohydrate (phù hợp vai trò dinh dưỡng của Huyết theo YHCT); Tứ quân liên quan con đường đồng hóa, hormone (tuyến giáp, steroid buồng trứng, prolactin, oxytocin), co cơ trơn mạch máu, tín hiệu calcium (phù hợp chức năng Khí). Một số con đường chung cho cả hai (GABA/GnRH, arginine-proline, PPAR, cytochrome P450, TNF) phản ánh mối liên hệ Khí-Huyết theo YHCT (trục dưới đồi-tuyến yên-tuyến thượng thận/sinh dục, tạo máu, miễn dịch). " +
        "Shi và cs (2019) — Đương quy bổ huyết thang (Hoàng kỳ + Đương quy, Lý Đông Viên): cơ chế hiện đại gồm thúc đẩy hấp thu sắt, tăng erythropoietin ở thận, kích thích tủy xương tạo máu, tăng đáp ứng miễn dịch (lymphocyte, đại thực bào, IL-2); astragaloside IV (Hoàng kỳ) và senkyunolide A/K (Đương quy) liên quan tạo máu qua con đường PI3K-Akt và MAPK.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 9 chủ đề Khí Huyết YHCT.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

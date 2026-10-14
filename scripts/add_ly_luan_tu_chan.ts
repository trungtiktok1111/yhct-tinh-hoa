// Thêm "Tứ Chẩn" (ThS Võ Thanh Phong, 163 slide — dẫn Giovanni Maciocia và Trung Y
// chẩn đoán học HV Trung Y Quảng Châu) vào Lý luận cơ bản. Tách thành nhiều
// TheoryTopic theo 4 chẩn (Vọng/Văn/Vấn/Thiết) và các tiểu mục chính. Trích
// nguyên văn nội dung chữ, bỏ qua các slide chỉ có hình ảnh minh họa không có chữ
// (ảnh lưỡi/mặt/tay thực tế). Không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Tứ Chẩn",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Giovanni Maciocia (2013, 2015), Elsevier; HV Trung Y Quảng Châu (1991), Trung Y chẩn đoán học (Nguyễn Thanh Giản dịch); Kirschbaum (2000)",
      locator: "163 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const topics: { name: string; summary: string; content: string; keyPoints?: string }[] = [
    {
      name: "Vọng chẩn — Thần sắc và hoạt động",
      summary: "Quan sát Thần (hoạt động sống), Sắc (màu da), và Hoạt động của cơ thể — bước đầu tiên và quan trọng nhất của Vọng chẩn.",
      content:
        "Cấu trúc vọng chẩn gồm Tổng quát (hình dạng/vóc dáng/phong thái, tri giác/tinh thần/cảm xúc, sắc mặt, hoạt động) và Từng phần (đầu mặt cổ, ngũ quan, ngực bụng, tứ chi, da lông tóc móng, bộ phận sinh dục, chất tiết, phụ nữ, trẻ em — màu sắc/hình dạng/động thái/rêu lưỡi). Sai lầm thường gặp: tập trung chi tiết mà bỏ qua toàn thể, hoặc toàn thể mà bỏ chi tiết; không chú ý mối quan hệ ngũ quan-chín khiếu với tạng phủ, vùng mặt với tạng phủ, ngũ thể với tạng phủ, vinh nhuận ngũ tạng, 12 bì bộ với tạng phủ. " +
        "Thần và hình: Thần thể hiện hoạt động sống; hình-thần hợp nhất, hình thể mạnh/yếu quyết định thịnh suy của thần. Thần và tinh: Tinh sinh Thần, Thần thống suất Tinh; tinh/thần phản ánh tinh khí hậu thiên và tiên thiên; tinh suy → hình thể suy → thần suy. Sắc và khí: Khí do tạng phủ phát ra, Sắc tùy tinh ba của khí; Sắc biểu hiện bên ngoài, Khí ẩn tàng bên trong. " +
        "Vọng thần là bước đầu tiên: lấy hình thái, động tĩnh, mặt mắt biểu hiện tình cảm, nói năng, hơi thở làm tiêu chuẩn. Giả thần: bệnh lâu ngày, tinh khí suy cực, thần 'chuyển tốt' là hiện tượng giả (báo hiệu nguy hiểm, không phải thật sự khỏe lại). " +
        "So sánh Còn thần / Mất thần theo 4 mặt: Hình sắc (bình thường bắp thịt không teo sắc sáng tươi nhuận / gầy sắc bại bắp thịt teo sắc tối đen); Nhãn thần (nhạy bén tinh anh lanh lợi / chậm chạp lờ đờ); Thần chí (không loạn, nói năng hoạt động bình thường / không tỉnh táo, nói năng động tác thất thường); Hơi thở (điều hòa / khác thường). " +
        "Vọng sắc: Sắc bình thường — vàng đỏ ẩn nhau, tươi nhuận (khí huyết bình hòa, tinh khí ẩn trong, dung quang phát tiết ra ngoài). Chủ sắc — màu da chủ đạo mỗi người, suốt đời không đổi. Khách sắc — biến đổi sắc mặt theo thời tiết (cảm ứng người-tự nhiên), biến đổi rất ít. Ảnh hưởng nhất thời: gắng sức, rượu, tình cảm. Sắc bệnh: tươi nhuận là tốt, xám tối là xấu; Ngũ sắc tương ứng Ngũ tạng, xét quan hệ tương sinh/tương khắc để biết tốt/xấu (vd Can bệnh hiện sắc xanh là đúng ngũ hành; thấy sắc đen là Thủy sinh Mộc — thuận; thấy sắc trắng là Kim khắc Mộc — nghịch). Sắc và mạch: sắc tương ứng mạch là thuận; không tương ứng thì phải tìm căn bản bệnh qua tương sinh/tương khắc. " +
        "Vọng hoạt động: Tăng hoạt động → dương/thực/nhiệt; kém hoạt động → âm/hư/hàn. Vận động nhanh, cảm giác nóng → dương vượng; vận động chậm, cảm giác lạnh → âm vượng. Run co giật → Can phong (thực); run biên độ nhỏ → Can phong (hư). Liệt nửa người → nội phong. Co cứng/co rút → khí trệ, huyết ứ, nội phong. Chân không yên → hư nhiệt ở Thận.",
      keyPoints: "Nguồn chính: Maciocia G. (2013), Diagnosis in Chinese Medicine; HV Trung Y Quảng Châu (1991), Trung Y chẩn đoán học.",
    },
    {
      name: "Vọng chẩn — Phân loại thể tạng YHCT",
      summary: "Phân loại cấu trúc/thể tạng theo Âm dương (Thái dương/Thái âm/Thiếu dương/Thiếu âm/Âm dương quân bình) và Ngũ hành (hình Mộc/Hỏa/Thổ/Kim/Thủy).",
      content:
        "Phân loại theo Âm dương: Thái dương, Thái âm, Thiếu dương, Thiếu âm, Âm dương quân bình. Phân loại theo Ngũ hành: hình Mộc, Hỏa, Thổ, Kim, Thủy — mỗi hình ứng với đặc điểm cấu trúc cơ thể khác nhau (cường tráng, thanh gọn, cơ bắp, gầy, thừa cân). (Nguồn: Maciocia G. 2013/2015 — các slide minh họa hình ảnh thể tạng không trích được nội dung chữ chi tiết ngoài tên gọi).",
    },
    {
      name: "Vọng chẩn — Thiệt chẩn (xem lưỡi)",
      summary: "Thiệt chẩn (xem lưỡi) gồm 4 phần: màu sắc, hình dạng, rêu, thần của lưỡi — dùng để đánh giá hư/thực, hàn/nhiệt, biểu/lý, tân dịch, khí huyết.",
      content:
        "Lưỡi liên quan tạng phủ: Tâm khai khiếu ra lưỡi (Tâm là thiếu âm quân chủ, tàng thần; bệnh Tâm ảnh hưởng 12 tạng phủ và ngược lại); quan hệ mật thiết với vận hóa của Tỳ (vận hóa thủy cốc, thủy thấp; vị giác do Tỳ khí; rêu lưỡi do Vị/Tỳ khí). Liên quan kinh lạc: Thủ thiếu âm Tâm kinh; Túc thiếu âm Thận kinh gắn liền gốc lưỡi (2 huyệt Kim tân, Ngọc dịch giúp tiết nước miếng — dịch của Thận — làm nhuận lưỡi); Túc quyết âm Can kinh liên hệ gốc lưỡi; Túc thái âm Tỳ kinh tỏa ra dưới lưỡi. " +
        "Mục đích thiệt chẩn: Hình lưỡi — đánh giá hư/thực; Sắc lưỡi — đánh giá hàn/nhiệt; Rêu lưỡi — đánh giá biểu/lý, hàn/nhiệt, Vị khí còn/mất. Bệnh về khí xét Rêu, bệnh về huyết xét Chất lưỡi. " +
        "Lưỡi bình thường: Chất — Thần (màu tươi, có sinh khí, linh động, sáng), Sắc (hồng nhạt, trơn nhuận), Hình (thon chắc), Thái (mềm mại, linh hoạt). Rêu — Hình (mỏng), Sắc (trắng, sạch, nhuận). " +
        "Đánh giá Hư/Thực qua lưỡi: Thần (mất thần/có thần); Sắc (nhạt-xanh-đen nhuận / hồng-đỏ); Hình (non bệu không gai / săn chắc nổi gai nhọn; teo+nhạt / teo+đỏ); Thái (run+nhạt / run+hồng tím; mềm+trắng / mềm+khô đỏ); Rêu (dày / mỏng). " +
        "Đánh giá Hàn/Nhiệt qua Sắc lưỡi: Nhạt (hàn) vs Đỏ (nhiệt — đỏ không rêu là âm hư, đỏ đậm là nhiệt nhập dinh phận, đỏ sáng bóng là Vị âm hư); Tím+nhuận (hàn) vs Tím+khô (nhiệt); Đen+nhuận vs Đen+khô. Hình: nổi gai cao nhọn/nứt nẻ/teo+đỏ đậm+khô là nhiệt. Thái: khô+mềm, hồng tím+run (Can phong), cứng khó nói, rút ngắn+đỏ+khô là nhiệt; rút ngắn+trắng+nhuận là hàn. Qua Rêu: nhuận (hàn) vs khô (nhiệt); trắng dày trơn (hàn) vs trắng khô/vàng (nhiệt); xám/đen nhuận (hàn) vs xám/đen khô (nhiệt). " +
        "Đánh giá Tân dịch: Thừa — sắc xanh+trơn nhầy, hình trướng/phù nề, rêu nhờn, sắc rêu xám/đen+trơn. Thiếu — sắc đen+khô, hình teo+đỏ đậm/nứt nẻ+gai nhọn/không rêu (âm hư), rêu khô, sắc rêu xám/đen+khô. " +
        "Đánh giá Khí huyết: Thịnh — sắc hồng nhuận. Suy — sắc nhạt/xanh/đen, hình nứt nẻ/teo+nhợt, thái run+nhợt/dài+tê dại. Uất/trệ — sắc tím. " +
        "Màu sắc lưỡi cụ thể: Nhợt+hơi ướt = Dương hư; Nhợt+hơi khô = Huyết hư; Hơi nhợt = Khí hư; Nhợt giữa lưỡi = Tỳ huyết hư; Nhợt 2 bên = Can huyết hư. Đỏ+có rêu = Thực nhiệt; Đỏ+không rêu = Hư nhiệt; Hồng không rêu = Âm hư. Tím = Huyết ứ (tím vùng giữa = huyết ứ ở Vị; tím vùng Can/Đởm bên phải tương ứng). " +
        "Hình dạng lưỡi: Phù nề = đàm thấp; Cứng = nội phong/huyết ứ/âm hư nặng; Nứt = có nhiệt, âm hư (nứt giữa lưỡi 2/3 trước = Vị âm hư; nứt sâu hơn liên quan Thận âm hư); Có dấu ấn răng = Tỳ khí hư. " +
        "Rêu lưỡi — ý nghĩa: Mỏng = bệnh mới phát, nông nhẹ; Dày = tà vào lý; Vàng = bệnh ở lý, nhiệt; Trắng = người bình thường hoặc phong hàn thấp/biểu chứng; Khô = tân dịch hao tổn; Nhớt = thấp trọc.",
      keyPoints: "Lưu ý kỹ thuật: cần ánh sáng đầy đủ; lưu ý quan hệ thể chất với lưỡi bình thường; rêu có thể bị nhuộm màu do ăn uống (cần hỏi lại bệnh nhân); có thể cạo xem rêu có bong tróc hay không để phân biệt rêu thật với cặn thức ăn.",
    },
    {
      name: "Vọng chẩn — Đầu, mặt, ngũ quan",
      summary: "Quan sát đầu, mặt (và 5 vùng tương ứng ngũ tạng), mắt, mũi, tai, môi miệng, răng nướu, hầu họng.",
      content:
        "Đầu: nơi hội tụ khí dương, phủ của thần, chứa não tủy; Thận vinh nhuận ra tóc, huyết dưỡng tóc. Hình thái đầu: thóp hở/đóng, vận động bình thường/bất thường. Tóc: thưa rụng, bạc, khô. " +
        "Mặt: bộ vị mặt tương ứng tạng phủ, kết hợp xem sắc với bộ vị. Ngũ sắc chủ bệnh: Xanh = phong, hàn, đau, kinh phong, Can bệnh; Đỏ = nhiệt, Tâm bệnh; Vàng = thấp, Tỳ bệnh; Trắng = hư, hàn, huyết thoát, khí thoát, tân dịch thoát, Phế bệnh; Đen = hàn, đau, Thận bệnh (đen mà khô thuộc nhiệt; xanh đen là dương khí suy kém). Hình dạng mặt: sưng nề = thủy thũng; má sưng đột ngột kèm họng đau mặt đỏ, nặng thì đầu mặt cổ sưng = chứng ôn độc; miệng mắt méo lệch = trúng phong (khẩu nhãn oa tà). " +
        "Mắt: bộ vị mắt tương ứng tạng phủ; quan sát Thần của mắt, Sắc (lòng trắng ứng ngũ sắc với ngũ tạng), Hình (mí mắt sưng = Tỳ nhiệt; ổ mắt lõm = tinh khí tạng phủ suy kiệt; đồng tử to = Thận thủy suy). Thần thái: mắt trợn ngược, trực thị = chứng nguy. Tròng trắng có gân xanh tím đỏ nổi = ngực có tích ứ; gân đỏ nổi rõ xoắn = có đau nhức. " +
        "Mũi: Phế khai khiếu ra mũi (mũi cũng thuộc Tỳ kinh). Ngũ sắc: chót mũi xanh = bụng đau; vàng = thấp nhiệt; trắng = mất huyết; đỏ = Tỳ Phế có nhiệt; đen = thủy khí. Mũi khô = Dương minh có nhiệt (khô đen = dương độc nhiệt thâm; lạnh trơn đen = âm độc hàn cực). Hình thái: sưng = tà khí thịnh; chảy nước đục = phong nhiệt; chảy nước trong = phong hàn. " +
        "Tai: Thận khai khiếu ra tai (bình thường tai nhuận, thịt đầy). Ngũ sắc: trắng nhợt = hàn; xanh đen = đau; vàng tai khô xám = Thận thủy suy cực. Hình thể: sưng = tà khí thực; gầy = chính khí hư; vành tai sần sùi = bệnh lâu ngày có huyết ứ. " +
        "Môi miệng: Tỳ khai khiếu ở miệng, vinh nhuận ra môi. Sắc môi: xanh = đau; trắng nhợt = huyết hư; vàng = bệnh ở Tỳ; quanh miệng tím đen = Thận tuyệt; đỏ thẫm = thực nhiệt; hồng nhợt = hư hàn. Hình dạng: thở há miệng = Phế tuyệt; miệng há như cá = Tỳ tuyệt; miệng run giật = Can phong hại Tỳ. " +
        "Răng nướu: răng là phần thừa của cốt (Thận chủ cốt); lạc mạch Dương minh lên đến nướu. Răng nhuận ướt = tân dịch đầy đủ; răng khô = Dương minh nhiệt thịnh. Nướu trắng nhợt = huyết hư; nướu chảy máu = Vị hỏa thịnh. Nghiến răng cắn răng = Can phong động; nghiến mà không cắn = nhiệt. " +
        "Hầu họng: bình thường màu hồng nhạt nhuận trơn; thông với Phế Vị, phần nhiều biểu hiện bệnh của Phế/Vị/Thận. Đỏ sậm = nhiệt; đỏ nhợt = hư nhiệt; sưng đỏ đau cấp = phong nhiệt; sưng đỏ đau mạn = Vị nhiệt; khô họng không sưng đau mạn tính = Phế/Thận âm hư (hư nhiệt); đỏ sưng loét = nhiệt độc; loét mạn tính tái phát = hư nhiệt. " +
        "Da: khô = Can huyết hư; ngứa = phong; phù lõm = Thận dương hư; phù không lõm = khí trệ; vàng tươi = dương hoàng do thấp nhiệt; vàng tối = âm hoàng do hàn thấp; gân đỏ = huyết nhiệt; gân tím = huyết ứ; gân xanh nhợt = đau; gân xanh tái = hàn; sẩn đỏ = nhiệt ở Phế Vị; mụn nước = thấp.",
    },
    {
      name: "Vọng chẩn — Tứ chi và chỉ văn trẻ em",
      summary: "Quan sát tứ chi (sưng khớp, phù, co cứng, yếu liệt, run, móng tay) và chỉ văn (nét chỉ ở ngón trỏ, dùng cho trẻ dưới 3 tuổi).",
      content:
        "Tổng quát tứ chi: sưng khớp, phù chi, vô lực/mềm yếu, co cứng, yếu liệt, co rút, run/liệt cứng, móng tay chân, ngư tế (gò thịt dưới ngón cái), chỉ văn trẻ em. " +
        "Sưng khớp — Chứng tý (trước tý: thấp nhiệt — khớp sưng nóng đỏ; trước tý trên nền Can huyết hư thường gặp ở nữ). " +
        "Phù chi: Phế dương hư = phù bàn tay; Thận dương hư = phù bàn chân; Tỳ dương hư = phù tứ chi; Thấp/Khí trệ = phù tứ chi ấn không lõm; Phong thủy phạm Phế = phù cấp bàn tay. " +
        "Tứ chi mềm yếu (nuy): Phế nhiệt thương tân (cấp), Thấp nhiệt phạm Tỳ Vị, Tỳ Vị hư, Thận âm hư. " +
        "Co cứng chi: cấp do ngoại phong; Can dương vượng; Can phong; chứng tý kèm đàm thấp; phong đàm; huyết ứ; Can Thận âm hư; Tỳ Thận dương hư. " +
        "Yếu liệt: Tỳ Vị hư, khí huyết hư, Can Thận âm hư, thấp tại cơ nhục, huyết ứ, phong đàm. " +
        "Co rút tứ chi: cấp do phong tà; thấp tại cơ nhục; nhiệt thương tân; Can huyết/Can âm hư. " +
        "Run hoặc co cứng: run bàn tay = Can phong; run tứ chi người già = Can phong + đàm trệ cân mạch; run nhỏ ở nữ = Can phong động do Can huyết hư; run nhẹ nhỏ = khí huyết hư; co cứng+run trong Ôn bệnh = Can phong hoặc hư phong do âm hư. " +
        "Móng tay chân: nhợt = huyết hư; tím = huyết ứ; có sọc = Can huyết hư. " +
        "Ngư tế (đánh giá tình trạng Vị): nổi gân xanh = hàn ở Vị; xanh+gân ngắn = Vị hư; nổi gân đỏ = nhiệt ở Vị; nổi gân tím = huyết ứ ở Vị. " +
        "Chỉ văn (Thủy cánh đồ quyết — Vương Siêu, đời Đường): dùng cho trẻ dưới 3 tuổi; mạch cạnh mé trong ngón trỏ thuộc Thủ thái âm Phế kinh; Tam quan: đốt 1 = Phong quan, đốt 2 = Khí quan, đốt 3 = Mệnh quan; xem dưới ánh sáng rõ, miết từ Phong quan đến Mệnh quan vài lần để chỉ văn nổi rõ; bệnh ở Phong quan là nhẹ, ra đến Mệnh quan càng nặng. Hình sắc chủ bệnh: đậm = nặng, nhợt = nhẹ; đỏ tươi = ngoại tà; tía = nhiệt; nhợt = hư; xanh = phong/đau; xanh+tím = huyết lạc bế uất. Hình dạng: chỉ tay càng dài bệnh càng nặng. Nổi/chìm: nổi = bệnh ở biểu, chìm = bệnh ở lý.",
    },
    {
      name: "Văn chẩn",
      summary: "Dùng thính giác (nghe âm thanh: tiếng nói, ho, thở) và khứu giác (ngửi mùi từ người bệnh và chất tiết) để chẩn đoán.",
      content:
        "Nghe âm thanh: âm thanh liên quan Phế khí, họng, hội yểm, lưỡi, răng, môi, mũi; mỗi người có đặc điểm to nhỏ cao thấp riêng; bình thường âm thanh tự nhiên điều hòa; âm thanh cũng quan hệ tình chí ngũ tạng. " +
        "Bệnh lý âm thanh: mất tiếng (thất âm) = Phế khí thất tuyên, Phế tạng suy tổn; tiếng nặng đục cao thô = thực chứng; tiếng trong nhẹ thấp nhỏ yếu = hư chứng; chứng nhiệt hay nói; chứng hư nói ngắt quãng. " +
        "Hơi thở: thở to = thực, nhỏ = hư. Bất thường: Suyễn (khó thở, há miệng rụt vai), Háo (khó thở kèm khò khè), Khí xốc lên (do khí nghịch vì đàm ẩm hoặc âm hư hỏa viêm), Đoản hơi (hơi thở ngắn gấp). Ho do Phế khí nghịch lên. " +
        "Ợ hơi: khí từ Vị đưa lên yết hầu — chủ hàn tà phạm Vị, thức ăn không tiêu. Nấc: khí xung lên yết hầu — nhất thời sau ăn/nuốt vội/cảm xúc là bình thường; nấc cao ngắn mạch sác = nhiệt; nấc thấp dài mạch vô lực = hư; nấc mạnh khí thịnh mạch hoạt thực = thực. " +
        "Ngửi mùi: Miệng — bình thường không mùi; hôi miệng đa phần do tiêu hóa không tốt/sâu răng/miệng không sạch; mùi chua hôi = thực tích ở Vị; hôi = Vị nhiệt; hôi thối = nội ung, lở loét. Mồ hôi mùi tanh khét = phong thấp nhiệt. Mũi mùi hôi, chảy mũi đặc = tỵ uyên. Thân mình người bệnh: lở loét, phân, nước tiểu, kinh đới.",
    },
  ];

  for (const t of topics) {
    await prisma.theoryTopic.create({
      data: { name: t.name, category: "Tứ chẩn - Bát cương", summary: t.summary, content: t.content, keyPoints: t.keyPoints, status: "DRAFT", sourceId: source.id },
    });
  }

  await prisma.theoryTopic.create({
    data: {
      name: "Vấn chẩn (Thập vấn / Thập lục vấn)",
      category: "Tứ chẩn - Bát cương",
      summary: "Hỏi bệnh — Thập vấn (10 mục hỏi, Trương Cảnh Nhạc 1563-1640) mở rộng thành Thập lục vấn (16 mục theo Maciocia): Đau, Ăn uống, Nhị tiện, Khát, Năng lượng, Đầu/mặt/thân, Ngực bụng, Tứ chi, Giấc ngủ, Mồ hôi, Tai/mắt, Hàn nhiệt, Cảm xúc, Tình dục, Phụ khoa, Nhi khoa.",
      content:
        "1. ĐAU: Khí trệ — căng nhiều hơn đau, không cố định, lúc có lúc không. Can dương vượng — đau đầu mạn kèm căng như mạch đập. Huyết ứ — đau nhiều, nhói/như đâm, cố định. Hàn (hư/thực) — co thắt co rút, tăng khi lạnh giảm khi nóng. Thấp nhiệt — đau rát kèm đầy tức nặng. Ngoại phong — đau đầu vùng chẩm, cứng cổ gáy. Ngoại thấp — đau khớp/thượng vị. So sánh Hư/Thực/Hàn/Nhiệt: áp lực (thiện án/cự án); ăn uống (giảm đau/tăng đau); kiểu đau (âm ỉ kéo dài/rõ/co thắt/nóng rát); nhiệt độ (giảm khi nóng [hàn]/giảm khi lạnh [nhiệt]); đi tiêu (tăng/giảm/tăng/giảm); tư thế (giảm khi nằm [hư]/giảm khi ngồi dậy [thực]); khởi phát (chậm kéo dài [hư]/đột ngột [thực]); nôn ói (tăng/giảm/tăng/giảm); nghỉ-vận động (giảm khi nghỉ [hư]/giảm khi vận động [thực,hàn]/nặng hơn khi vận động [nhiệt]). " +
        "2. ĂN UỐNG: giảm sau ăn = hư; tăng khi ăn = thực; chán ăn = Tỳ khí hư; mau đói = Vị nhiệt; đầy bụng = thấp/thực tích; căng chướng = khí trệ; nặng nề = thấp; đau rõ = huyết ứ; thích đồ nóng = hàn. Vị giác: giảm = Tỳ Vị hư; đắng = Tâm/Can nhiệt; ngọt = Tỳ hư/thấp nhiệt; chua = thực tích/Can phạm Vị; mặn = Thận âm hư; cay = Phế nhiệt. Nôn ói: nôn chua = Can phạm Vị; nôn đắng = Can Đởm nhiệt; nôn nước trong = hàn tà phạm Vị, ứ tân dịch; nôn sau ăn = nhiệt chứng. " +
        "3. NHỊ TIỆN: Táo bón — tăng sau đi tiêu = hư, giảm sau đi tiêu = thực; cấp+khát+rêu vàng = nhiệt vị trường; người già/nữ sau sinh = huyết hư; phân nhỏ khô cứng như phân dê = Can khí uất, nhiệt ở trường; khó đi không khô = Can khí uất; kèm đau bụng = nội hàn; phân khô+miệng khô muốn uống ít = âm hư (Thận/Vị); táo-tiêu chảy xen kẽ = Can khí phạm Vị. Tiêu chảy — mạn = Tỳ/Thận dương hư; ngũ canh tả = Thận dương hư; kèm đau bụng = nội hàn; nhầy mủ = thấp ở trường; máu mủ = thấp nhiệt; phân sống = Tỳ khí hư; sệt đi nhiều lần = trung khí hư; phân đen = huyết ứ; máu trước phân đỏ tươi = huyết nhiệt; máu trước phân+hậu môn đau nặng = thấp nhiệt; phân trước máu lỏng như nước = Tỳ khí hư bất thống huyết; tanh hôi = nhiệt. Tiểu tiện — dầm/không tự chủ = Thận hư; không hết = thấp phạm Bàng quang/Phế khí hư; khó tiểu = thấp phạm BQ/Thận hư; đau trước tiểu = khí trệ hạ tiêu; đau trong khi tiểu = thấp nhiệt BQ; đau sau tiểu = khí hư; nhạt màu = hàn; sậm = nhiệt; đục = thấp; nhiều lần = Thận dương hư; nhiều lần+ít = khí hư; vàng ít = Thận âm hư. " +
        "4. KHÁT VÀ UỐNG: khát muốn uống nhiều nước lạnh = thực nhiệt; khát muốn uống ít = âm hư; khát không muốn uống = thấp nhiệt; không khát = hàn chứng; muốn uống lạnh = nhiệt; muốn uống ấm = hàn. " +
        "5. NĂNG LƯỢNG (mệt mỏi): mạn+muốn nằm+chán ăn+phân lỏng = Tỳ khí/dương hư; mạn+nói yếu+dễ cảm lạnh = Phế khí/dương hư; mạn+đau lưng+lạnh+tiểu nhiều = Thận dương hư; mạn+chóng mặt+nhìn mờ+kinh ít = Can huyết hư; mạn+lo lắng+khô miệng đêm+lưỡi không rêu = Thận âm hư; mạn+nặng nề = thấp; mạn+nặng nề+chóng mặt = đàm; mạn+bụng chướng+mạch huyền+kích thích = Can khí uất; ngắn hạn+hàn nhiệt vãng lai+kích thích+rêu lưỡi 1 bên+mạch huyền = hội chứng Thiếu dương. " +
        "9. GIẤC NGỦ: khó vào giấc = Tâm huyết hư; thức nhiều lần trong đêm = âm hư (Tâm/Thận/Can); mất ngủ+lo lắng+hay mơ+khí huyết hư = Tâm Tỳ lưỡng hư; khó vào giấc+chóng mặt+nhìn mờ = Can huyết hư; thức nhiều lần+mơ nhiều+đạo hãn+hồi hộp = Tâm Thận âm hư; mơ nhiều = Can hỏa/Tâm hỏa; ngủ không yên+mơ nhiều = thực tích; thức sớm không ngủ lại = Đởm hư. " +
        "Các mục khác (được nêu tên, nội dung chi tiết hạn chế trong slide trích được): Đầu/mặt/thân (đau đầu — khởi phát/thời gian/vị trí/đặc điểm/kèm theo; chóng mặt; nóng/đau mặt; chảy mũi; chảy máu nướu; loét miệng; đau toàn thân/lưng; tê); Ngực bụng; Tứ chi (yếu liệt, tê, đau khớp/cơ, khó đi, run, lạnh tay/chân, yếu gối, nặng mỏi); Mồ hôi (vị trí, thời gian, bệnh kèm, tính chất); Tai và mắt (ù tai, điếc, đau mắt, nhìn mờ, khô mắt); Hàn nhiệt (nội thương: cảm giác lạnh/nóng; ngoại cảm: sợ lạnh, phát sốt, hàn nhiệt vãng lai); Cảm xúc (trầm cảm, lo âu sợ hãi, tức giận, lo lắng suy nghĩ nhiều, buồn đau khổ); Tình dục (nam: liệt dương, giảm libido, xuất tinh sớm, mệt mỏi chóng mặt sau xuất tinh; nữ: giảm libido, đau đầu sau cực khoái).",
      status: "DRAFT",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thiết chẩn — Mạch chẩn",
      category: "Tứ chẩn - Bát cương",
      summary: "Thiết chẩn gồm Mạch chẩn, Xúc chẩn (sờ nắn cơ biểu/tay chân/ngực bụng), Kinh lạc chẩn (sờ nắn du huyệt). Mạch chẩn ở thốn khẩu (động mạch quay, huyệt Thái Uyên) là trọng tâm.",
      content:
        "Chẩn mạch thốn khẩu: Tố Vấn 20 dùng chẩn bệnh về Phế; Tố Vấn 11: Vị là bể chứa thức ăn, nguồn gốc lục phủ. Nhân nghinh = thốn trái; Khí khẩu = thốn phải. Mạch thốn khẩu chia 3 bộ (Thốn-Quan-Xích), mỗi bộ chia 3 hậu (Phù-Trung-Trầm) = Tam bộ cửu hậu. " +
        "Phân bộ mạch - tạng phủ (có nhiều trường phái khác nhau qua các đời): Theo Nan Kinh — Thốn phải: Phế/Đại trường; Thốn trái: Tâm/Tiểu trường; Quan phải: Tỳ/Vị; Quan trái: Can/Đởm; Xích phải: Thận/Mệnh môn; Xích trái: Thận/Bàng quang. Các trường phái khác (Nội Kinh, Mạch kinh, Thiên Kim phương, Lý Đông Viên, Lý Thời Trân, Cảnh Nhạc toàn thư, Y tông kim giám) có phân bổ hơi khác nhau ở vị trí Mệnh môn/Tam tiêu/Chiên trung — đều được liệt kê để đối chiếu, không có phiên bản 'duy nhất đúng'. " +
        "4 thông số phản ánh KHÍ qua mạch: Độ sâu (rất sâu→rất nông: mạch đập ở nông = khí đang phù việt ra ngoài; ở sâu = khí đang vào trong lý). Độ mạnh (rất yếu→rất mạnh: đập mạnh = khí nhiều; yếu = khí ít). Độ cứng (rất mềm→rất cứng: đề kháng tay nhiều/mạch căng = khí uất kết nhiều; đề kháng ít/mềm mại = khí uất kết ít). Độ trơn (rất rít→rất trơn: đi trơn tru = khí lưu lợi; đi sít = khí bị cản trở). " +
        "4 thông số phản ánh HUYẾT qua mạch: Tần số (rất chậm→rất nhanh: đập nhanh = huyết vận hành nhanh do khí vượng hoặc có nhiệt; đập chậm = huyết vận hành chậm do khí hư, hàn, hoặc khí trệ/huyết ứ/đàm cản trở). Sự đều đặn (đều→không đều: phản ánh Tâm luật do Tâm khí làm chủ; Tâm khí loạn — do Tâm khí hư, Tâm huyết ứ, đàm nhiệt nhiễu Tâm, Tâm dương vượng, Tâm Thận bất giao — khiến mạch đập không đều). Thể tích/độ rộng (rất nhỏ→rất to: to = âm/huyết/tinh/tân dịch nhiều; nhỏ = ít). Độ dài (rất ngắn→rất dài: dài vượt quá bộ thốn/xích = khí đến nhiều hoặc khí không đi được nên uất kết; ngắn chưa đến bộ thốn/quan = khí hư không đến đủ, hoặc có tắc trở). " +
        "Mạch theo Tạng (Khí và Huyết riêng biệt mỗi tạng) — Thận: Khí (chủ hỏa, nạp khí-giữ thủy-liễm hãn, chủ kỹ xảo, chủ tiền âm hậu âm, tàng chí, khai khiếu tai, chủ sợ hãi), Huyết (tiên thiên, tàng tinh, chủ thủy, chủ cốt tủy, tai/tóc, thắt lưng, nước bọt lúc không ăn). Tỳ: Khí (vận hóa thủy cốc/thủy thấp, thống nhiếp huyết, chủ thăng, chủ tứ chi, tàng ý, khai khiếu miệng, chủ tư lự), Huyết (sinh huyết, chủ cơ nhục, môi, nước bọt lúc ăn). Can: Khí (sơ tiết, tàng huyết, mưu lự, tàng hồn, mắt, chủ giận dữ), Huyết (chủ cân, móng, mắt, nước mắt). Tâm: Khí (chủ thần minh, quân hỏa, tàng thần, chủ huyết mạch, khai khiếu lưỡi, chủ vui mừng), Huyết (chủ huyết mạch, khai khiếu lưỡi, mồ hôi). Phế: Khí (chủ trị tiết, chủ khí, túc giáng, tuyên phát/tuyên thông, tàng phách, chủ buồn), Huyết (chủ bì mao, khai khiếu mũi, nước mũi). " +
        "Ý nghĩa xem mạch (3 điểm): Hình (lớn/nhỏ — huyết nhiều mạch lớn, huyết thiếu mạch nhỏ); Lực (cứng/mềm — khí thịnh mạch cứng, khí suy mạch mềm); Vận (khí điều hòa mạch điều hòa, khí loạn mạch loạn, khí thịnh mạch nhanh, khí hư mạch chậm). " +
        "Thời gian/kỹ thuật chẩn mạch: Tố Vấn 17 khuyên lúc sáng sớm, nhưng có bệnh thì lúc nào cũng chẩn được; trước khi chẩn nên nghỉ ngơi cho khí huyết điều hòa; không nên xem mạch khi quá no/đói/uống rượu/đi xa mệt mỏi; môi trường ồn ào, tay áo chật cũng ảnh hưởng. Mạch bình thường có nhiều loại: theo 5 Tạng, theo 4 mùa 6 khí, theo nam/nữ/già(hoãn nhược)/trẻ(nhanh), theo bẩm chất (béo=trầm tế, gầy=phù trường, thấp=đoản, cao=trường). " +
        "7 điều khi xem mạch: tĩnh tâm tập trung tư tưởng; không lo nghĩ việc ngoài; thở đều để định hơi; Phù án xem mạch Phủ; Trung án xem Vị khí; Trầm án xem mạch Tạng; xét số mạch đập của bệnh nhân. Căn của mạch: bộ Xích trầm, hữu lực. Vị khí/Thần của mạch: hòa hoãn, xen vào lục bộ. " +
        "Tư thế và cách đặt tay: bệnh nhân ngồi thẳng hoặc nằm ngửa, cánh tay duỗi 2 bên, bàn tay ngửa; thầy thuốc ngồi nghiêng, tay trái chẩn mạch tay phải bệnh nhân và ngược lại; đặt ngón trỏ vào bộ Quan trước (ngang lồi xương quay) rồi ngón 2 và 4; các đầu ngón tay ngang bằng nhau; không lầm với mạch ngón tay của chính mình; người cao lớn tay thưa (khoảng cách ngón rộng), thấp bé tay khít; 3 mức ấn — sơ án (Phủ), trung án (Vị khí), trầm án (Tạng). " +
        "Không nên câu nệ tính chất đặc thù từng mạch đơn lẻ (vd Phù=biểu, Trầm=lý, Sác=nhiệt, Trì=hàn cứng nhắc). Mạch thay đổi trước-sau khi xem lâu: Phù Đại rồi chìm mất = chính khí quá hư (xấu); Huyền chuyển hòa hoãn = sắp khỏi (tốt); không hòa hoãn/Huyền Tế/vô lực chuyển hòa hoãn = tốt; hòa hoãn chuyển Vi/Sác/không ứng tay/Huyền = xấu. " +
        "Mạch và chứng — nguyên tắc 'bỏ mạch theo chứng' khi: không có mạch (không thể bắt); mạch 1 tay rất nhỏ so tay kia; người thanh cao 2 tay thường không có mạch rõ (nếu có thì rất êm dịu — không phải bệnh); mạch phản quan (dị dạng động mạch quay). " +
        "Mạch theo mùa: Xuân=Huyền (Can-Mộc); Hạ=Hồng (Tâm-Hỏa); Thu=Phù (Phế-Kim); Đông=Trầm (Thận-Thủy); chuyển tiếp/Trưởng hạ=Hoãn (Tỳ-Thổ). Mạch theo Lục khí (6 giai đoạn khí hậu trong năm): Đại Hàn-Xuân Phân = Quyết âm Can phong mộc, Huyền; Xuân Phân-Tiểu Mãn = Thiếu âm Tâm quân hỏa, Hồng; Tiểu Mãn-Đại Thự = Thiếu dương tướng hỏa, Đại mà Phù; Đại Thự-Thu Phân = Thái âm thấp thổ, Trầm; Thu Phân-Tiểu Tuyết = Dương minh táo kim, Đoản Sáp; Tiểu Tuyết-Đại Hàn = Thái dương hàn thủy, Đại Trường. " +
        "Mạch và Lục dâm (ngoại tà): Hàn thương Thận → mạch Khẩn(Trầm); Thử thương Tâm → Hư; Táo thương Phế → Sáp; Thấp thương Tỳ → Nhu(Tế); Phong thương Can → Phù; Nhiệt thương Tâm bào → Nhược. Mạch và Thất tình: Hỷ thương Tâm → Hư; Tư thương Tỳ → Kết; Ưu thương Phế → Sáp; Nộ thương Can → Nhu; Khủng thương Thận → Trầm; Kinh thương Đởm → Động; Bi thương Tâm bào → Khẩn. " +
        "Mạch và nam/nữ: mạch nữ thường nhu nhược hơn nam. Nam: tay trái mạnh hơn phải là thuận (ngược lại là âm thịnh dương suy). Nữ: tay phải mạnh hơn trái là thuận (ngược lại là dương thịnh âm suy). " +
        "Ý nghĩa và giới hạn của mạch chẩn: 1 loại mạch có thể gặp trong nhiều bệnh, hoặc cả người bình thường; hình thái mạch thay đổi do tim hoặc bệnh toàn thân ảnh hưởng tim, cũng bị ảnh hưởng bởi yếu tố thần kinh/tâm lý/thời tiết; KHÔNG thể chỉ bắt mạch mà chẩn ra 1 bệnh cụ thể chi tiết; 1 loại mạch không đặc trưng cho 1 bệnh riêng biệt; mạch chỉ là 1 biểu hiện, phải kết hợp nhiều biểu hiện khác (Vọng-Văn-Vấn) để biện chứng.",
      status: "DRAFT",
    },
  });

  // Gắn Source cho 2 topic cuối (đã quên gắn trong object literal do cấu trúc vòng lặp khác)
  await prisma.theoryTopic.updateMany({
    where: { name: { in: ["Vấn chẩn (Thập vấn / Thập lục vấn)", "Thiết chẩn — Mạch chẩn"] } },
    data: { sourceId: source.id },
  });

  console.log("Đã thêm 8 chủ đề Tứ Chẩn (Vọng x5, Văn, Vấn, Thiết/Mạch).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

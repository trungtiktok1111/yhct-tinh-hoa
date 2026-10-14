// Chẩn đoán học YHCT batch 4: Vọng Rêu Lưỡi (sắc rêu 4 màu + chất rêu: dày
// mỏng, nhuận táo, hủ nê, thiên toàn, bác lạc, tiêu trưởng, chân giả) + Tổng
// hợp chẩn sát rêu và chất lưỡi. Dòng 506-670 của dump. Trích trung thực,
// không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 1 Vọng chẩn: Vọng Rêu Lưỡi, Tổng hợp chẩn sát rêu và chất lưỡi",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Rêu Lưỡi — sắc rêu (4 màu)",
      category: cat,
      summary: "4 màu rêu lưỡi: trắng (biểu/hàn, có ngoại lệ chủ nhiệt), vàng (lý/nhiệt), xám (lý chứng — nhiệt hoặc hàn thấp), đen (lý chứng nặng — nhiệt cực hoặc hàn thịnh). Còn có rêu lục và rêu màu nấm mốc tương.",
      content:
        "RÊU TRẮNG: thường gặp biểu chứng, hàn chứng (ngoại cảm tà chưa nhập lý — vẫn rêu mỏng trắng bình thường, gặp trong Thái dương Thương hàn, vệ phần Ôn bệnh). Lưỡi nhạt + rêu trắng thấp nhuận = lý hàn chứng/hàn thấp chứng. NGOẠI LỆ chủ nhiệt: 'Tích phấn thái' (rêu trắng như lớp bột, sờ không khô) = ngoại cảm uế trọc khí hoặc nhiệt độc nội thịnh (ôn dịch, nội ung). Rêu trắng khô nứt như cát sạn sờ ráp = ôn bệnh hóa nhiệt rất nhanh, nội nhiệt bạo khởi, tân dịch bạo thương (rêu chưa kịp chuyển vàng mà lý nhiệt đã tích). " +
        "RÊU VÀNG: chủ lý chứng, nhiệt chứng (nhiệt tà hun chước) — nhạt = nhiệt nhẹ; đậm = nhiệt nặng; cháy = nhiệt kết. Ngoại cảm rêu trắng→vàng = biểu tà nhập lý hóa nhiệt (Thương hàn: Dương minh kinh bệnh; Ôn bệnh: khí phần chứng). Rêu mỏng vàng nhạt cũng gặp ở phong nhiệt biểu chứng hoặc phong hàn hóa nhiệt. Lưỡi nhạt bệu nộn + rêu vàng hoạt nhuận = dương hư thủy thấp bất hóa (ngoại lệ không chủ nhiệt). " +
        "RÊU XÁM (đen nhạt, từ rêu trắng ám tối chuyển hóa, có thể cùng rêu vàng): chủ lý chứng (lý nhiệt chứng hoặc hàn thấp chứng). Khô = nhiệt tích thương tân (ngoại cảm nhiệt bệnh hoặc âm hư hỏa vượng nội thương); nhuận = đàm ẩm nội đình hoặc hàn thấp nội trở. " +
        "RÊU ĐEN (từ rêu xám/vàng cháy phát triển, gặp giai đoạn nghiêm trọng): chủ lý chứng — nhiệt cực hoặc hàn thịnh. Khô nứt/mọc gai = nhiệt cực tân khô; hoạt nhuận = hàn thịnh dương hư. " +
        "RÊU LỤC (xanh lục, từ rêu trắng chuyển) — ý nghĩa như rêu xám đen nhưng CHỈ chủ nhiệt không chủ hàn (ôn dịch, thấp ôn bệnh). RÊU MÀU NẤM MỐC TƯƠNG (hồng trung phát hắc kèm vàng) — Vị trường có thấp trọc ủ tích lâu ngày, chủ thấp nhiệt cửu uất.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Rêu Lưỡi — chất rêu (dày mỏng, nhuận táo, hủ nê, phân bố, tiêu trưởng, chân giả)",
      category: cat,
      summary: "Các đặc tính của chất rêu (không phải màu) phản ánh độ nông sâu của tà khí, tình trạng tân dịch, thấp trọc, và tiên lượng bệnh qua quá trình biến đổi rêu.",
      content:
        "DÀY MỎNG: thấy mờ chất lưỡi qua rêu = mỏng (vị khí sinh ra, rêu bình thường — chủ ngoại cảm biểu chứng hoặc bệnh nhẹ nội thương, chính khí chưa tổn thương); không thấy chất lưỡi = dày (vị khí kèm thấp trọc tà khí hun chưng — chủ tà thịnh nhập lý hoặc đàm ẩm thấp thực tích trệ bên trong). " +
        "NHUẬN TÁO: nhuận trạch (không khô không ướt) = tân dịch chưa tổn thương. Rêu hoạt (ướt trơn, chảy dãi khi le lưỡi) = hàn thấp, tam tiêu dương khí suy không vận hóa thủy thấp, thấp tụ thành đàm ẩm (dương hư đàm ẩm thủy thấp nội đình). Rêu táo (khô, không tân dịch, có thể ráp như cát) — nhiệt thịnh thương tân, âm dịch khuy hao, dương hư khí hóa kém (tân dịch không lên được), hoặc táo khí thương Phế. Lưu ý ngoại lệ: thấp tà truyền nhập huyết phần có thể làm rêu táo; dương tà nhập âm chưng động âm khí có thể làm rêu nhuận — cần tứ chẩn hợp tham. " +
        "HỦ NÊ (nhị) RÊU: Hủ thái (hạt rời rạc to dày như xác đậu nành, lau sạch được) — các biến thể: 'phù cáu thái' (tối ám dơ), 'nùng hủ thái' (dày dính như mủ), 'mai hủ thái' (màng trắng/điểm lở như hạt cơm). Nê thái (hạt dày đặc lau không đi cạo không tróc, phủ lớp như dầu dơ); 'niêm nê thái' (dính thêm lớp cáu trọc hoạt nê); 'cáu/trọc thái' (không sạch, cáu trọc xen lẫn). Ý nghĩa: Rêu HỦ = dương nhiệt hữu dư chưng đằng hủ trọc (thực tích đàm trọc, nội ung, lở miệng thấp nhiệt) — hủ chuyển thoái dần có rêu mới mỏng = chính thắng tà; nùng hủ (Phế/Can ung, hạ cam kết độc) = tà thịnh bệnh nặng. Rêu NÊ = thấp trọc nội uẩn, dương khí bị che lấp (đàm ẩm, thực tích, thấp nhiệt, ngoan đàm) — vàng dày nê = đàm nhiệt/thấp nhiệt/thử thấp/thực trệ; trắng hoạt nê = thấp trọc hàn thấp; trắng dày không táo như phấn = thời tà kèm thấp từ trong ra; trắng nê không táo = Tỳ hư thấp trọng; trắng dày dính nê + miệng ngọt = Tỳ Vị thấp nhiệt khí tụ thượng phiếm. " +
        "THIÊN TOÀN (phân bố): 'Toàn' (đầy mặt lưỡi) = tà khí tản mạn, đàm thấp trở trệ trung tiêu. 'Thiên' (lệch 1 vùng): thiên ngoại (đầu lưỡi) = tà nhập lý chưa sâu, Vị khí tổn thương trước; thiên nội (gốc lưỡi) = biểu tà giảm nhưng Vị trệ đã xuất hiện; giữa gốc ít rêu = Vị dương/Thận âm không thượng đằng/thượng nhu, âm tinh khí đều thương; chỉ có rêu vùng giữa = đàm ẩm hoặc Vị trướng tích trệ bình nhật. Thiên trái/phải = tà ở bán biểu bán lý (rìa lưỡi thuộc Can Đởm) — tham khảo thêm: thiên trái hoạt rêu = chứng tạng kết (khó chữa nhất); thiên phải hoạt rêu = bệnh tại cơ nhục, bán biểu bán lý. " +
        "BÁC LẠC (bong rêu): 'Quang bác/kính diện lưỡi' (mất hết rêu, bóng như kiếng) = Vị khí Vị âm tồn vong nguy cấp. 'Hoa bác rêu' (bong không toàn bộ, ranh giới rõ) = Vị khí âm lưỡng thương; nếu kèm rêu nê = đàm trọc chưa hóa mà chính khí đã thương (phức tạp). 'Rêu địa đồ' (bong không đều). 'Loại bác' (chỗ bong có hạt rêu mới sinh) = khí huyết hư. Rêu dày giữa bong/nứt/lõm, dưới đỏ khô = đề phòng tân dịch thoát trung khí kiệt. " +
        "TIÊU TRƯỞNG (quá trình biến đổi): Tiêu = dày→mỏng, nhiều→ít (chính khí hồi phục, bệnh lui). Trưởng = không→có, mỏng→dày (tà khí dần thịnh, bệnh tiến triển xấu). Bạo tăng/bạo thoái (đột ngột) = tình huống biến đổi cấp: rêu mỏng đột ngột thành dày = chính khí bạo suy tà nhập lý nhanh; rêu dày đầy lưỡi đột nhiên tiêu nhanh = Vị khí bạo tuyệt. 'Chân thoái chân hóa' (rêu thoái dần rồi sinh rêu mới trắng mỏng) = Vị khí dần hồi phục, cốc khí dần tiến — tốt. 'Giả thoái' (mất đột ngột không sinh rêu mới, thành mặt kiếng) = ác tính, Vị khí âm suy kiệt. Rêu dày đầy miệng đột nhiên thoái nhưng còn dấu vết dơ hoạt hoặc điểm đỏ như chu sa/nứt, sau 1-2 ngày lại có rêu dày = thấp trọc tà thịnh, tà chính đang đấu tranh. " +
        "CHÂN GIẢ RÊU: 'Hữu căn' (chắc dính, khó cạo, như mọc từ chất lưỡi) = rêu CHÂN — bệnh sơ/giữa kỳ: hữu căn so vô căn là bệnh sâu nặng hơn; giai đoạn sau: hữu căn là tốt hơn (Vị khí còn). 'Vô căn' (như bôi phết, dễ tróc) = rêu GIẢ — cần chú ý 3 điều: (1) rêu dày buổi sáng mất sau ăn sáng không phải bệnh, nhưng nếu sau đó ít/không rêu = lý hư; (2) rêu cạo dễ tróc = bệnh nhẹ nông; (3) rêu dày vô căn không mọc lại lớp mới = Vị khí trước còn sau suy thiếu (thường do dùng nhiều thuốc lương dược thương dương hoặc nhiệt dược thương âm).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tổng hợp chẩn sát chất lưỡi và rêu lưỡi",
      category: cat,
      summary: "Chất lưỡi biện chính khí hư thực (huyết bệnh); rêu lưỡi biện tà khí nông sâu tính chất và tồn vong vị khí (khí bệnh). Thường thống nhất nhưng có khi không — cần tứ chẩn hợp tham.",
      content:
        "NGUYÊN TẮC: 'Xem chất lưỡi để biết âm dương hư thực (biện huyết bệnh), thẩm rêu lưỡi để biết tà khí hàn nhiệt nông sâu (biện khí bệnh)' (Y môn bổng hát - Thương hàn luận bản chỉ). " +
        "KHI THỐNG NHẤT (thường gặp): thực nhiệt → lưỡi đỏ + rêu vàng khô; hư hàn → lưỡi nhạt + rêu trắng hoạt. " +
        "KHI KHÔNG THỐNG NHẤT (cần tứ chẩn hợp tham): lưỡi đỏ thẫm + rêu trắng khô = táo nhiệt thương tân (táo khí hóa hỏa nhanh, rêu chưa kịp chuyển vàng nhưng bệnh đã vào dinh phần). Rêu trắng tích như phấn vẫn chủ nhiệt tà tích thịnh (không chủ hàn). Rêu xám đen có thể chủ cả nhiệt chứng và hàn chứng (cần phối hợp). Lưỡi đỏ thẫm + rêu trắng hoạt nê = ngoại cảm (dinh phần có nhiệt, khí phần có thấp) hoặc nội thương (âm hư hỏa vượng kèm đàm trọc thực tích) — những trường hợp này rêu và chất tưởng mâu thuẫn nhưng thực ra bổ sung cho nhau, cần phân tích cụ thể linh hoạt theo thực tế lâm sàng.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề Chẩn đoán học YHCT batch 4 (Rêu lưỡi sắc, Rêu lưỡi chất, Tổng hợp chẩn sát).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

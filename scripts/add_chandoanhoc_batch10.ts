import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1, Bài 4: Thiết chẩn, phần Án chẩn (hoàn tất Bài 4)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Án Chẩn - Phương pháp và ý nghĩa; Án bì phu, Án thủ túc",
      category: cat,
      summary: "Án chẩn dùng tay sờ/mó/ấn để tìm hiểu biến đổi bất thường, suy đoán vị trí và tính chất bệnh; thủ pháp xúc-mô-án; án da và tay chân biện hàn nhiệt biểu lý hư thực.",
      content: `PHƯƠNG PHÁP ÁN CHẨN VÀ Ý NGHĨA:
Án chẩn: dùng tay trực tiếp sờ mó ấn ép vị trí cục bộ để tìm hiểu biến đổi bất thường, suy đoán vị trí bệnh, tính chất bệnh, bệnh tình nặng nhẹ. Đã ghi chép từ "Nội kinh", "Thương hàn luận", "Kim quỹ yếu lược".
Thủ pháp: XÚC (dùng ngón/bàn tay nhẹ tiếp xúc trán, da, tứ chi — xem nóng lạnh, nhuận táo), MÔ (sờ mó chỗ sưng đau — tìm cảm giác sâu, hình khối), ÁN (dùng sức ấn ép ngực bụng/khối u — tìm ấn đau, hình thù, cứng mềm). Lâm sàng phối hợp: xúc trước ấn sau, từ nhẹ đến nặng, từ nông đến sâu. Cần áp sát bệnh nhân, thao tác nhẹ nhàng khéo léo, làm ấm tay khi trời lạnh, căn dặn bệnh nhân phối hợp, vừa khám vừa quan sát nét mặt.
Án chẩn là một phần không thể bỏ qua của thiết chẩn, bổ sung thêm cho vọng-văn-vấn, đặc biệt với bệnh biến vùng ngực bụng (đau, sưng trướng, đàm ẩm, hà chứng). Du Căn (đời Thanh): ngực bụng là nơi cư ngụ lục phủ ngũ tạng, nơi khí huyết hóa sinh — sờ nắn ấn ngực bụng để biết tình trạng tạng phủ.

ÁN BÌ PHU (da): tìm hiểu hàn nhiệt, nhuận táo, sưng thũng toàn thân.
- Dương khí thịnh → thân nóng; dương khí suy → thân lạnh.
- Sờ lâu: mới sờ nóng nhiều, sờ lâu giảm = nhiệt tại biểu; sờ càng lâu nóng càng dữ = nhiệt tại lý (từ trong phát ra).
- Cơ phu mềm mại thích án = hư chứng; cứng cự án = thực chứng. Ấn nhẹ đau = bệnh ngoài cạn (biểu thiển); trọng án mới đau = bệnh trong sâu.
- Da khô (ít ra mồ hôi); da khô nhăn nheo = tân dịch bất túc; da thấp nhuận = đã có mồ hôi.
- Trọng án chỗ sưng: ấn lõm không hồi phục ngay = thủy thũng; ấn lõm bỏ tay đàn hồi liền = khí thũng.
- Ngoại khoa: sưng không cứng không nóng = hàn chứng; sưng nóng áp thống = nhiệt chứng. Gốc sưng đầu không nhô = hư; gốc gom có đỉnh nhô = thực. Cứng nơi đau = chưa có mủ; ngoài cứng ngọn mềm = đã có mủ.
- "Án xích phu" (da từ trong cùi chỏ đến lằn cổ tay trong): xích phu nóng — thường gặp ngoại cảm, đa số ôn nhiệt chứng.

ÁN THỦ TÚC (tay chân): chủ yếu tìm hàn nhiệt.
- Tay chân đều lạnh = dương hư âm thịnh (hàn); đều nóng = dương thịnh hoặc âm hư (nhiệt). Lưu ý: nội nhiệt tích thịnh, dương uất trong không ngoại đạt cũng gây tứ chi quyết lãnh = lý nhiệt thực chứng (không nhầm với hàn).
- Phân biệt ngoại cảm/nội thương: mu tay chân hơi nóng = ngoại cảm phát nhiệt; lòng bàn tay chân (thủ túc tâm) hơi nóng = sốt nội thương.
- Kết hợp trán và lòng bàn tay: trán nóng hơn lòng bàn tay = biểu nhiệt; lòng bàn tay nóng hơn = lý nhiệt.
- Trẻ em: đầu ngón tay lạnh = hàn quyết; chỉ ngón giữa nóng = ngoại cảm phong hàn; đầu ngón giữa lạnh = sởi/đậu mùa sắp phát.
- Chẩn tay chân nóng lạnh để biết âm dương tồn vong, quan trọng cho dự hậu dương hư chứng: tứ chi ấm = dương khí còn, có thể chữa; tứ chi quyết lãnh = đa phần hung, dự hậu xấu. "Thương hàn luận - Thiếu âm": thiếu âm bệnh, hạ lợi tự chỉ, ố hàn quyền ngọa, thủ túc ôn = khả trị; thủ túc nghịch lãnh = bất trị.`,
      keyPoints: "Thủ pháp án chẩn: xúc (nhẹ) - mô (sờ hình khối) - án (ấn mạnh), từ nhẹ đến nặng, nông đến sâu\nÁn bì phu: thích án=hư, cự án=thực; sờ lâu nóng giảm=biểu nhiệt, sờ lâu nóng tăng=lý nhiệt\nÁn thủ túc: tay chân ấm ở dương hư chứng là dấu hiệu còn chữa được; quyết lãnh là dự hậu xấu",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Án Chẩn - Án hung phúc (án hư lý, án hung hiếp, án phúc bộ) và Án du huyệt",
      category: cat,
      summary: "Phân vùng ngực bụng; án hư lý biết tông khí; án hung hiếp xem tâm phế can; án phúc bộ biện hàn nhiệt/hư thực/trướng/khối u; án du huyệt suy đoán bệnh tạng phủ qua phản ứng huyệt.",
      content: `PHÂN VÙNG NGỰC BỤNG: từ cách (cơ hoành) trở lên là hung (ngực), cách trở xuống là phúc (bụng); từ nách xuống đầu xương sườn 11-12 là hiếp (sườn); dưới mũi ức là tâm hạ; vị quản tương đương thượng phúc; từ rốn trở lên là đại phúc, rốn trở xuống là tiểu phúc. Nội dung án hung phúc: án hư lý, án hung hiếp, án phúc bộ.

ÁN HƯ LÝ (vùng dưới vú trái, nơi mỏm tim đập): biết tông khí mạnh yếu, bệnh hư thực, dự hậu hung cát. Bình thường: ứng thủ rõ, không nhanh không chậm không cấp. Đập khẽ không rõ (bất cập) = tông khí hư suy; đập mạnh dội áo (thái quá) = tông khí ngoại tiết. Đập dội tay hồng đại = chứng nguy cấp (cảnh giác đặc biệt ở sản phụ trước sanh, bệnh lao sái). Kinh khủng/đại nộ/vận động kịch liệt làm hư lý đập nhanh tạm thời rồi hồi phục = sinh lý bình thường. Hư lý đập khẽ (giục tuyệt) không dấu hiệu tử vong = đa số đàm ẩm chứng. Ý nghĩa đặc biệt lớn khi gặp bạo quyết/khí đại hư đại thực mà không bắt được mạch (phục) — xem hư lý biết tông khí tồn vong, tránh chẩn đoán lầm.

ÁN HUNG HIẾP: ngực là nơi cư ngụ tâm phế, bên phải can, hai sườn là can kinh. Ngực trước nhô cao + khí suyễn = chứng phế trướng. Ngực sườn ấn đau trướng = đàm nhiệt khí kết hoặc thủy ẩm nội đình. Can (hạ sườn phải, ngang liên sườn 5, trong bờ sườn) thường không sờ thấy; nếu sờ thấy to/mềm/cứng = khí trệ huyết ứ; bề mặt lồi lõm không phẳng = chú ý can nham; đau trướng hạ sườn phải kèm nóng tay = can ung (áp xe); sốt rét lâu ngày có u cục hạ sườn phải = ngược mẫu.

ÁN PHÚC BỘ: tìm hàn nhiệt, mềm cứng, trướng mãn, u cục, ấn đau.
- Biện lạnh nóng: thành bụng lạnh thích ấm/xoa = hư hàn chứng; da bụng chước nhiệt thích lạnh = thực nhiệt chứng.
- Biện đau: thích án = hư; cự án = thực.
- Biện bụng trướng: ấn căng đầy, đau, gõ đục = thực mãn; ấn không đầy không đau, gõ trong = hư mãn. Cổ trướng (bụng to như trống, bệnh nghiêm trọng): thủy cổ (dấu sóng vỗ, ấn lõm) vs khí cổ (gõ vang, ấn không lõm). Người béo bụng to mềm rốn lồi cần phân biệt với cổ trướng.
- Biện bĩ mãn: tâm hạ/vị quản căng tức, ấn mềm không đau = hư chứng; ấn cứng đề kháng đau = thực chứng; ấn trướng đau kèm sôi ruột = đại kết hung.
- Biện khối u: Tích (đau cố định, hữu hình không di chuyển, thuộc huyết phần) vs Tụ (đau không cố định, vô hình, lúc tụ lúc tán, thuộc khí phần). Thiếu phúc trái đau + u cứng = phân cứng ứ trong ruột; thiếu phúc phải đau + u cục = trường ung. Trùng tích (giun sán): 3 đặc điểm — hình như đám gân kết, ấn lâu tan; có cảm giác nhu động dưới tay; thành bụng lồi lõm, ấn phập phều lúc tụ lúc tan.

ÁN DU HUYỆT: đè ấn huyệt đặc định để xem phản ứng, suy đoán bệnh tạng phủ. Biến đổi: nốt nhỏ/hình sợi dây, ấn đau hoặc mẫn cảm. Ví dụ: phế bệnh — nốt nhỏ tại phế du, ấn đau trung phủ; can bệnh — ấn đau can du/kỳ môn; vị bệnh — áp thống vị du/túc tam lý; trường ung — ấn đau thượng cự hư (Lan vĩ). Cũng dùng ấn thử nghiệm để chẩn đoán/điều trị (ví dụ đau bụng do giun chui ống mật, ấn đởm du giảm đau; đau do nguyên nhân khác ấn không hiệu quả). Nguyên lý: khí huyết kinh lạc tụ tại bề mặt cơ thể, chảy vào du huyệt trọng điểm — bệnh bên trong phản ứng tại các điểm đó. "Linh khu - Bối du": ấn thử chỗ nào đau giảm thì đó là du huyệt.`,
      keyPoints: "Án hư lý biết tông khí tồn vong, đặc biệt quan trọng khi không bắt được mạch (bạo quyết, khí đại hư đại thực)\nÁn phúc bộ: Tích (hữu hình, cố định, huyết phần) khác Tụ (vô hình, di động, khí phần); thủy cổ (ấn lõm) khác khí cổ (gõ vang)\nÁn du huyệt dựa trên nguyên lý khí huyết kinh lạc tụ tại bề mặt và chảy vào huyệt trọng điểm, phản ánh bệnh tạng phủ tương ứng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề Án Chẩn - hoàn tất Bài 4 THIẾT CHẨN (Mạch chẩn + Án chẩn).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

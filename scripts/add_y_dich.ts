// Thêm "Y Dịch" (ThS Võ Thanh Phong, 33 slide) vào Lý luận cơ bản.
// LƯU Ý: nhiều slide minh họa bằng hình ảnh (bát quái đồ, so sánh não-vũ trụ,
// các hình vật lý lượng tử...) không trích xuất được qua python-pptx — chỉ ghi
// nhận phần chữ/khái niệm thật. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Y Dịch",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong",
      locator: "33 slide (một số slide minh họa hình ảnh không trích xuất được text)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Cấu trúc Dịch kinh",
      category: cat,
      summary: "Lịch sử hình thành Dịch kinh qua các thời kỳ (Phục Hy → Khổng Tử), 3 bộ Dịch (Liên sơn, Quy tàng, Chu dịch), nghĩa chữ 'Dịch', và bố cục Kinh-Truyện.",
      content:
        "Hình thành: Phục Hy (4477-4363 TCN) — Hà đồ, Tiên thiên bát quái. Hạ Vũ (2205-1766 TCN) — Lạc thư, Cửu trù hồng phạm. Chu Văn Vương (1144-1142 TCN) — Hậu thiên bát quái, thoán từ. Chu Công Đán (1144-1142 TCN) — Hào từ. Khổng Tử (551-479 TCN) — Thập dực. " +
        "Phân loại 3 bộ Dịch: Liên sơn dịch (Hạ, 2205-1776 TCN) — quẻ Cấn làm gốc. Quy tàng dịch (Thương, 1778-1337 TCN) — quẻ Khôn làm gốc. Chu dịch (Chu, 1122-25 TCN) — quẻ Càn làm gốc. " +
        "Nghĩa chữ 'Dịch' có 3 lớp: Biến dịch (thay đổi); Bất dịch (biến đổi theo quy luật chung); Giao dịch (giao cảm với nhau, thay đổi cho nhau). " +
        "Bố cục Dịch kinh gồm Kinh và Truyện: Kinh — Quái (Phục Hy), Thoán từ (Văn Vương), Hào từ (Chu Công). Truyện (Thập dực — Khổng Tử) — Thoán từ thượng truyện, Thoán từ hạ truyện, Tượng thượng truyện, Tượng hạ truyện, Hệ từ thượng truyện, Hệ từ hạ truyện, Văn ngôn truyện, Thuyết quái truyện, Tự quái truyện, Tạp quái truyện.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Y Dịch — Tư tưởng chủ đạo",
      category: cat,
      summary: "Các khái niệm cốt lõi của Dịch học được vận dụng vào Y học: Đắc trung-Đắc chính, Đắc vị, Đắc thời, Biến dịch-Bất dịch, Đối xứng, Toàn tức.",
      content:
        "ĐẮC TRUNG - ĐẮC CHÍNH: Hào 2 là trung của hạ quái, hào 5 là trung của thượng quái → đắc trung. Không thái quá, không bất cập → đắc trung là cát (tốt). Quẻ Ký tế: hào lục ở vị trí 2, hào cửu ở vị trí 5 → trung chính. " +
        "ĐẮC VỊ: hào âm ở âm vị, hào dương ở dương vị → đắc vị; đắc vị thường cát. " +
        "ĐẮC THỜI: Thời là toàn bộ hoàn cảnh xảy ra trong một lúc nào đó. 'Thiên địa doanh hư, dữ thời tiêu trưởng' (trời đất đầy vơi, cùng thời mà tăng giảm); đắc thời thì cát. " +
        "BIẾN DỊCH - BẤT DỊCH: vận động - tuần hoàn; phát sinh vô hạn từ hữu hạn; vô hạn - tuần hoàn. (Các ví dụ đối chiếu khoa học hiện đại trong slide — liên đới lượng tử/quantum entanglement, nhịp sinh học/circadian rhythm ảnh hưởng chức năng thận và đáp ứng miễn dịch — minh họa bằng hình ảnh/trích dẫn tài liệu khoa học, không có mô tả chi tiết bằng chữ trong slide). " +
        "ĐỐI XỨNG: khái niệm cân bằng (minh họa bằng ví dụ vật lý hạt — meson octet — chỉ có hình ảnh, không có diễn giải bằng chữ). " +
        "TOÀN TỨC: một bộ phận nhỏ chứa toàn bộ thông tin của cấu trúc lớn hơn — ví dụ nêu: Hà đồ; sự tương đồng cấu trúc não và vũ trụ (chỉ có hình ảnh minh họa, không có diễn giải chi tiết bằng chữ trong slide).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Y Dịch — Ứng dụng trong Châm cứu, Nhãn khoa, Phòng bệnh, Chẩn đoán, Điều trị",
      category: cat,
      summary: "Các trường phái châm pháp dựa trên Dịch học (Trần Chiếu Hạc Tùng dịch học châm pháp, Toàn tức châm cứu, Tề Vĩnh tề châm, Cát Khâm Phủ phúc bộ lục hợp châm pháp) và vận dụng Dịch học vào phòng bệnh - chẩn đoán - điều trị.",
      content:
        "CHÂM CỨU — Trần Chiếu Hạc 'Tùng dịch học châm pháp': Bát quái thành liệt — chọn huyệt theo kinh có liên quan biểu lý. Cương nhu tương ma — chọn huyệt theo kinh cùng tên với kinh biểu lý. Bát quái tương đảng — chọn huyệt theo kinh cùng tên. Tứ cục châm pháp — 3 kinh âm ở tay là Hỏa, 3 kinh dương ở tay là Mộc, 3 kinh âm ở chân là Kim, 3 kinh dương ở chân là Thủy; bệnh ở Hỏa chọn huyệt Kim và ngược lại, bệnh ở Mộc thì chọn Thủy. " +
        "CHÂM CỨU — 'Toàn tức châm cứu bản hệ': học thuyết toàn tức cho rằng bất cứ một bộ phận nhỏ của cơ thể đều chứa thông tin toàn bộ cơ thể; kích thích các bộ phận nhỏ của cơ thể giúp điều trị bệnh ở bộ phận khác. " +
        "CHÂM CỨU — Tề Vĩnh 'Tề châm': xác định điểm đau khi ấn, tìm nốt gồ lên dưới da. Gồm: Lạc thư toàn tức; Hậu thiên bát quái tề châm; Ngũ hành tề châm liệu pháp (dựa quan hệ tạng phủ và ngũ hành sinh khắc); Địa chi bát quái tề châm; Tứ cục châm pháp. " +
        "CHÂM CỨU — Cát Khâm Phủ 'Phúc bộ lục hợp châm pháp': châm theo Bát quái đồ vùng bụng — Nội bát quái lấy rốn làm trung tâm và xung quanh 1,5 thốn; Trung bát quái lấy rốn làm trung tâm và xung quanh 4 thốn; châm theo mối liên quan giữa bát quái với các vùng cơ thể. " +
        "NHÃN KHOA: ứng dụng 8 quẻ (Càn, Khảm, Cấn, Chấn, Tốn, Đoài, Khôn, Ly) để phân vùng/chẩn đoán tại mắt (slide minh họa bằng hình, không có mô tả chi tiết bằng chữ). " +
        "PHÒNG BỆNH: 64 quẻ, 384 hào là nguyên lý biến hóa của vạn vật → cần tùy biến mà thích nghi. Đắc thời — ăn uống, lao động, điều dưỡng theo biến hóa thời khí thì bệnh tật không sinh ra. Tu thân — đức tính tốt thì sức khỏe tốt; 9 quẻ tu đức: Lí, Khiêm, Phục, Hằng, Tổn, Ích, Khốn, Tỉnh, Tốn. " +
        "CHẨN ĐOÁN: Đắc vị — vong dương do dương kháng, dương kháng sẽ thoát dương do dương không đắc vị. Đắc thời — mạch biến hóa theo tứ thời. Bất dịch — biến đổi tuần theo quy luật nhất định. " +
        "ĐIỀU TRỊ: Đắc vị — ví dụ Tâm Thận bất giao thì điều trị bằng giao thông Tâm Thận. Đắc thời — lúc nào nên bổ thì bổ, nên tả thì tả, không làm nghịch thời. Biến dịch — phải nắm được tình trạng hư thực của khí huyết tạng phủ trước khi châm trị; phép châm phải theo đúng nghênh/tùy, lấy ý để điều hòa. Các phương pháp cụ thể được nêu tên: Linh quy bát pháp, Tý ngọ lưu chú.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 3 chủ đề Y Dịch.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

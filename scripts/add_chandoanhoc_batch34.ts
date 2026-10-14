import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Đau Bụng, Đau Lưng, Đau Cơ và Khớp (HẾT SÁCH)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Đau Bụng (Phúc Thống, 9 chứng)",
      category: cat,
      summary: "Phúc thống (đau từ dưới vị quản tới xương vệ — đại/tiểu/thiếu phúc) liên quan can-đởm-tỳ-vị-đại/tiểu trường-bào cung. Định vị theo vùng: hạ quản=tỳ, thiếu phúc=can, tiểu phúc=bàng quang/xung nhâm/bào cung, quanh rốn=trùng tích, hố chậu phải=trường ung.",
      content: `ĐAU BỤNG (Phúc thống): vùng bụng từ dưới vị quản tới xương vệ (đại phúc, tiểu phúc, thiếu phúc). Can, đởm, tỳ, vị, đại trường, tiểu trường, bào cung đều trong ổ bụng — ngoại tà xâm tập hoặc nội thương gây khí huyết vận hành ách trở hoặc bất túc đều sinh đau bụng.

ĐỊNH VỊ THEO VÙNG: đau hạ quản thuộc THÁI ÂM TỲ; đau thiếu phúc thuộc QUYẾT ÂM CAN; đau tiểu phúc liên hệ BÀNG QUANG, XUNG NHÂM MẠCH, BÀO CUNG; lúc đau lúc ngưng quanh rốn thuộc TRÙNG TÍCH; đau dưới rốn phía phải (hố chậu phải) là TRƯỜNG UNG. Đau hữu hình/cố định khác đau vô hình/không cố định. Trướng đầy cự án thuộc THỰC; đau âm ỉ thích xoa ấn thuộc HƯ.

9 chứng thường gặp:

1. **Hàn tà nội tích**: đau co thắt dữ dội, không ngưng nghỉ, gặp ấm đau giảm, kèm sôi bụng tiêu chảy, rêu mỏng trắng, mạch trầm khẩn. Hàn tà ngưng kết, khí trệ bất hành.

2. **Hỏa nhiệt nội tích**: bụng nhiệt chước trướng đau, thích mát ghét nóng, cự án kèm miệng khát, táo bón, lưỡi đỏ rêu vàng, mạch hoạt sác. Nhiệt tà nội kết, khí cơ vận hành không thông.

3. **Khí trệ phúc thống**: đau trướng vùng bụng, di chuyển lan xuyên, điểm đau VÔ ĐỊNH, giảm khi trung tiện, kèm không muốn ăn, khó chịu sau ăn, rêu mỏng trắng, mạch huyền hoạt. Khí trệ lạc mạch ách trở.

4. **Ứ huyết phúc thống**: đau CỐ ĐỊNH, cự án, ngày đau nhẹ đêm đau nặng, hoặc ấn chẩn thấy u cục, lưỡi xanh có ứ ban, mạch trầm sáp.

5. **Trùng tích phúc thống**: đau quanh rốn lúc đau lúc không, bụng thỉnh thoảng gò cục dài như sợi dây thừng, ấn chẩn lúc tán lúc tụ, kèm hình thể gầy ốm, mặt vàng vọt hoặc hay nghiến răng, bên trong môi nổi hạt nhỏ như tấm trắng, lưỡi mạch như bình thường (lúc đau dữ dội mạch sẽ trầm khẩn). Trùng tích lúc tụ lúc tán làm trở trệ khí cơ.

6. **Hồi quyết** (giun chui ống mật): hạ sườn phải đột nhiên đau từng cơn, đau như dùi như đâm rất khó chịu, kèm mặt trắng bệnh đổ mồ hôi, tứ chi lạnh toát, buồn nôn nôn ói hoặc ói ra giun, lưỡi như người thường, mạch trầm khẩn.

7. **Hư hàn phúc thống**: đau âm ỉ, thích ấm thích ấn xoa, thường tái phát không dứt, kèm tinh thần ủy mị uể oải lười biếng, tứ chi không ấm, đại tiện phân nhão, lưỡi nhạt rêu trắng, mạch trầm tế vô lực. Tố thể dương hư, hư hàn không hóa khí.

8. **Thấp nhiệt lỵ**: bụng đau lý cấp hậu trọng, hạ lỵ mủ máu, hậu môn nóng rát, tiểu tiện ngắn đỏ, lưỡi đỏ rêu vàng nê, mạch hoạt sác. Thấp nhiệt úng trệ trong ruột.

9. **Trường ung phúc thống**: đau hố chậu phải co thắt cự án hoặc sờ u cục kèm sốt, buồn nôn nôn ói, chân phải co duỗi khó do đau, rêu vàng nê, mạch huyền sác. Uất nhiệt tích trệ không thông.

Thêm **Thống kinh**: phụ nữ trước/sau/trong hành kinh đau bụng vùng tiểu phúc và lưng thậm chí đau kịch liệt không chịu nổi, kèm mặt trắng nhợt, xuất hạn, tay chân lạnh toát, buồn nôn. Xung nhâm thất điều, khí huyết vận hành không thông, kinh hành không thông.

PHÂN BIỆT CHỦ YẾU: Hàn tà nội tích (co thắt dữ dội, gặp ấm GIẢM). Hỏa nhiệt nội tích (trướng nhiệt chước, khát, thích uống LẠNH, táo bón). Khí trệ/huyết ứ/trùng tích đều có cảm giác thích ấm/thích lạnh KHÔNG rõ ràng (khác 2 chứng trên) — khí trệ (trướng căng tức, di chuyển không cố định, giảm sau trung tiện); huyết ứ (đau CỐ ĐỊNH, lưỡi xanh ứ ban); trùng tích (đau quanh rốn lúc đau lúc không, ấn như dây thừng lúc tụ lúc tán). Hồi quyết (phát bệnh NHANH, đau hạ sườn phải như dùi đâm từng cơn, nôn ói hoặc nôn ra giun — đặc trưng riêng). Hư hàn (thích ấm thích xoa, chi lạnh, tiêu phân nhão, bệnh trình dài, đau Ít hơn hàn tà nội tích). Trường ung (đau hố chậu phải cự án, sốt, chân phải khó co duỗi).`,
      keyPoints: "Đau bụng định vị theo vùng: hạ quản=tỳ, thiếu phúc=can, tiểu phúc=bàng quang/xung nhâm/bào cung, quanh rốn=trùng tích, hố chậu phải=trường ung\nHồi quyết (giun chui ống mật) đặc trưng: đau hạ sườn phải như dùi đâm từng cơn + nôn ra giun — cấp cứu ngoại khoa cổ truyền",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Đau Lưng (5 chứng) và Đau Cơ Khớp/Tý Chứng (6 chứng) — HOÀN TẤT SÁCH",
      category: cat,
      summary: "Đau lưng (liên hệ mật thiết thận — thủ phủ của thận): ngoại cảm hàn thấp/thấp nhiệt, huyết ứ, thận dương/âm hư. Đau cơ khớp (tý chứng, do phong hàn thấp nhiệt bế tắc kinh lạc): phong tý/hàn tý/thấp tý/nhiệt tý/khí huyết hư nhược tý/huyết ứ tý.",
      content: `ĐAU LƯNG: đau 1 hoặc cả 2 bên lưng. Lưng là thủ phủ của THẬN nên đau lưng liên hệ mật thiết với thận. Ngoại tà xâm tập hoặc nội thương đều gây tổn thương thận, ảnh hưởng kinh mạch vùng lưng không thông mà đau.

5 chứng thường gặp:
1. **Ngoại cảm hàn thấp**: đau lưng hoặc cảm giác lạnh nặng lưng, tăng khi trời lạnh/trở trời, khó xoay trở, giảm khi gặp ấm, hoặc tiểu không thông, rêu trắng nê, mạch trầm khẩn. Hàn thấp xâm phạm gây bế trệ kinh lạc.
2. **Thấp nhiệt nội uẩn**: đau lưng chỗ đau có cảm giác nóng, kèm tiểu ngắn đỏ, 2 chân tê mềm, rêu vàng nê, mạch nhu sác.
3. **Huyết ứ**: đau lưng dữ dội như đâm chích, đau cố định cự án, nhẹ thì nằm xuống ngồi dậy khó khăn, nặng thì không xoay trở được, kèm đại tiện phân đen táo kết không thông, lưỡi tím tối, mạch trầm sáp.
4. **Thận dương hư**: lưng đau cảm giác lãnh thống tê nặng âm ỉ không ngưng, thích ấm thích ấn xoa, kèm phù chi, lưỡi nhạt nộn, rêu trắng, mạch trầm tế. Thận dương hư suy không ôn húc lưng.
5. **Thận âm hư**: đau lưng tê nặng âm ỉ không dứt kèm tâm phiền mất ngủ, miệng khát họng khô, mặt đỏ triều hồng, ngũ tâm phiền nhiệt, hoặc tiểu ngắn ít, phù toàn thân, lưỡi đỏ, mạch tế sác.

PHÂN BIỆT: Ngoại cảm hàn thấp (đau LẠNH, tăng khi trở trời/lạnh, gặp ấm đỡ, mạch trầm khẩn) khác thấp nhiệt nội uẩn (đau có cảm giác NÓNG, tiểu ngắn đỏ, mạch nhu sác). Huyết ứ (đau CỐ ĐỊNH, cự án, lưỡi tím tối, mạch trầm sáp). Thận hư đau lưng bệnh trình DÀI, đau NHẸ hơn, kèm loạt triệu chứng hư chứng — thận dương hư (thích ấm xoa bóp, khí đoản mặt trắng nhợt chi lạnh); thận âm hư (mặt đỏ triều hồng, ngũ tâm phiền nhiệt, mất ngủ).

ĐAU CƠ VÀ KHỚP (Tý chứng): đa số do phong-hàn-thấp-nhiệt tà gây bế tắc kinh lạc, khí huyết bất thông.

6 chứng thường gặp:
1. **Phong tý**: đau khớp di chuyển toàn thân, khớp khó co duỗi, hay gặp chi trên, rêu mỏng trắng, mạch huyền khẩn. Phong thiện hành sác biến, hành tẩu khớp toàn thân.
2. **Hàn tý**: đau khớp dữ dội, đau CỐ ĐỊNH, thích ấm sợ lạnh, khớp không co duỗi được, rêu trắng, mạch huyền khẩn. Hàn tính thu dẫn ngưng trệ.
3. **Thấp tý**: cơ khớp đau tê nặng cố định thường gặp lưng và chân, hoặc tê bì, hơi sưng chỗ đau, rêu trắng nê, mạch nhu hoãn. Thấp tính trọng trọc trở lưu lại khớp.
4. **Nhiệt tý**: khớp sưng nóng đỏ đau, gặp LẠNH đỡ đau, kèm sốt, phiền khát, miệng khát rêu vàng, mạch hoạt sác. Nhiệt tà kèm thấp hun chước cơ khớp, uất lâu hóa nhiệt.
5. **Khí huyết hư nhược tý**: đau cơ khớp, gân mạch co quắp kèm tâm quý khí đoản, tự hạn, phạt lực, sắc mặt không tươi, lưỡi nhạt, mạch nhược. Khí huyết bất túc, phong hàn thấp tà lưu trệ lâu bế tắc kinh lạc.
6. **Huyết ứ tý**: đau khớp như châm chích cố định, đau tăng về ĐÊM, hoặc khớp sưng biến dạng co duỗi khó khăn, ngũ tâm phiền nhiệt, màu da tím tối, lưỡi xanh hoặc có ứ điểm, mạch huyền hoặc trầm sáp. Khí huyết vận hành không thông, lạc mạch tý trở.

PHÂN BIỆT CHỦ YẾU: Phong tý (đau khớp DI CHUYỂN, hay phát chi trên). Hàn tý (đau khớp dữ dội CỐ ĐỊNH, thích ấm ghét lạnh). Thấp tý (đau khớp NẶNG NỀ, tê đau cố định, hay tái phát lưng/chi dưới). Nhiệt tý (đau khớp cục bộ SƯNG NÓNG ĐỎ, đỡ khi chườm LẠNH — khác hẳn hàn tý). Khí huyết hư nhược tý (đau tê khớp, bệnh trình dài kèm tâm quý khí đoản tự hạn sắc mặt không tươi lưỡi nhạt). Huyết ứ tý (đau CỐ ĐỊNH, tăng về ĐÊM, lưỡi xanh có ứ điểm).

*** HẾT SÁCH "Chẩn đoán học Y học cổ truyền" (ĐHYD.HCM, 321 trang) — toàn bộ 5 chương đã được xử lý đầy đủ: Chương 1 Tứ Chẩn, Chương 2 Bát Cương, Chương 3 Biện Chứng (Bệnh Nhân, Khí Huyết Tân Dịch, Tạng Phủ, Kinh Lạc, Lục Kinh, Vệ Khí Dinh Huyết, Tam Tiêu), Chương 4 Chẩn Đoán và Bệnh Án, Chương 5 Phụ Biên Chẩn Đoán Gián Biệt (toàn bộ các triệu chứng: Phát Nhiệt, Hạn Xuất, Hôn Mê, Co Giật, Mất Máu, Ho, Suyễn Thúc, Ẩu Thổ, Tiết Tả, Táo Bón, Tiểu Tiện Bất Lợi, Hoàng Đản, Huyền Vựng, Tâm Quý, Bất Muội, Đau các loại). ***`,
      keyPoints: "Đau lưng luôn liên hệ thận (thủ phủ của thận) — ngoại cảm hàn thấp/thấp nhiệt (thực) vs huyết ứ vs thận dương/âm hư (hư, bệnh trình dài)\nTý chứng (đau khớp): Phong (di chuyển), Hàn (cố định dữ dội, thích ấm), Thấp (nặng nề tê), Nhiệt (sưng nóng đỏ, thích lạnh), Khí huyết hư (hư chứng mạn), Huyết ứ (cố định, tăng đêm)\nĐây là nội dung cuối cùng của sách Chẩn đoán học YHCT ĐHYD.HCM — đánh dấu hoàn tất toàn bộ 321 trang",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề cuối: Đau Bụng (9 chứng), Đau Lưng (5 chứng) + Đau Cơ Khớp (6 chứng). HOÀN TẤT TOÀN BỘ SÁCH.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

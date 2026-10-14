import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Đau Ngực Sườn và Vị Quản Thống",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Đau Ngực Sườn (8 chứng)",
      category: cat,
      summary: "Ngực sườn (hung hiếp) thuộc thượng tiêu, trong có tâm phế, sườn phải có can đởm — đau ngực sườn đa số là bệnh tâm phế can đởm. 8 chứng từ hàn ngưng hung tý đến huyền ẩm.",
      content: `ĐAU NGỰC SƯỜN: ngực sườn (hung hiếp) thuộc thượng tiêu, bên trong có tâm phế, sườn phải có can đởm — đau ngực sườn đa số là bệnh TÂM PHẾ CAN ĐỞM.

8 chứng thường gặp:

1. **Hàn ngưng hung tý**: đau ngực, đau thấu vai lưng, gặp hàn lạnh đau tăng kèm tâm quý khí đoản, ho suyễn, mặt trắng chi lạnh, rêu trắng, mạch trầm trì. Dương khí bất túc, hàn tà xâm tập, khí cơ bế trở, dương khí trong ngực không vận chuyển.

2. **Đàm thấp nội uẩn hung thống**: đau ngực tức ngực (muộn trướng), đau thấu xuyên lưng, suyễn thúc, ho khạc đàm dãi, rêu trắng nê, mạch hoãn hoạt hoặc huyền hoạt. Đàm thấp thượng át hung dương.

3. **Khí trệ hung hiếp thống**: ngực sườn trướng thống, lúc phát lúc ngưng, ngực tức khó chịu, nóng nảy dễ cáu giận, miệng đắng ăn ít hoặc tâm quý khí đoản, rêu mỏng trắng, mạch huyền. Khí trệ kinh lạc không thông.

4. **Huyết ứ hung hiếp thống**: ngực sườn đau như châm chích KHÔNG di chuyển, ngực tức khó chịu, hoặc hạ sườn sờ thấy u cục, lưỡi tím tối, mạch sáp. Ứ huyết trở trệ kinh lạc.

5. **Tâm khí hư hung thống**: ngực trái đau âm ỉ, bệnh trình dài kèm tâm quý, khí đoản, mất ngủ, lưỡi nhạt bệu, mạch nhỏ nhược hoặc kết đại. Tâm khí bất túc, khí huyết vận hành sáp trệ.

6. **Phế âm hư hung thống**: đau ngực kèm ho khan không đàm hoặc ít đàm, khạc máu hoặc trong đàm lẫn máu, triều nhiệt, lưỡng quyền đỏ, đạo hạn, đầu lưỡi đỏ, mạch tế sác. Hư nhiệt nội sinh phế lạc bị chước.

7. **Can âm hư hiếp thống**: đau âm ỉ vùng sườn không dứt kèm hoa mắt chóng mặt, ngũ tâm phiền nhiệt, toàn thân phạt lực, mắt khô rát, lưỡi đỏ ít rêu, mạch tế sác. Can âm hư không tư dưỡng kinh mạch, hư hỏa nội chước.

8. **Phế ung hung hiếp thống**: đau ngực ho kèm sốt, phiền khát, ho đàm tanh hôi hoặc khạc đàm mủ, lưỡi đỏ rêu vàng, mạch hoạt sác. Độc nhiệt uẩn phế, kinh lạc bị tắc.

Thêm **Huyền ẩm bệnh**: ngực sườn trướng thống, đau tăng khi ho khạc, khó xoay trở, đầy no khoảng gian sườn, rêu trắng, mạch trầm huyền. Ẩm đình trệ tại ngực sườn, mạch lạc bị trở ngại.

PHÂN BIỆT CHỦ YẾU: Hung tý (các thể đều đau ngực RÕ, bộ vị đau CỐ ĐỊNH, kèm tâm quý khí đoản — điểm phân biệt với các loại đau ngực khác). Hàn ngưng hung tý nặng nhất, đau thấu vai lưng, gặp hàn tăng, mặt trắng chi lạnh. Đàm thấp nội uẩn (đau trướng ngực, ho khạc đàm dãi, rêu trắng nê). Khí trệ (đau căng trướng, lúc đau lúc ngưng, nóng nảy dễ cáu). Huyết ứ (đau như châm chích kèm lưỡi tím tối + triệu chứng ứ huyết kèm theo). Tâm khí hư/phế âm hư/can âm hư đều bệnh trình kéo dài, đau NHẸ hơn — tâm khí hư (tâm quý khí đoản, mạch nhỏ nhược/kết đại); phế âm hư (ho khan, triều nhiệt, đạo hạn, khạc máu); can âm hư (hoa mắt chóng mặt, mắt khô rát). Phế ung (sốt khạc đàm mủ tanh hôi). Huyền ẩm (ngực sườn đau căng tức, đau tăng khi ho, gian sườn đầy).`,
      keyPoints: "Hung tý các thể (bộ vị đau cố định + tâm quý khí đoản) là đặc trưng phân biệt với đau ngực khác\nTâm khí hư/Phế âm hư/Can âm hư đều hư chứng mạn tính, đau nhẹ — phân biệt theo kiêm chứng đặc trưng từng tạng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Vị Quản Thống (Đau Dạ Dày, 7 chứng)",
      category: cat,
      summary: "Vị quản thống (vị thống, cổ gọi 'Tâm thống') đa số do ẩm thực bất tiết hoặc ưu tư não nộ thái quá gây khí cơ không thông — chia hàn/nhiệt (thực) và khí hư/âm hư (hư) và khí trệ/huyết ứ/thực tích.",
      content: `VỊ QUẢN THỐNG (vị thống, cổ nhân gọi "Tâm thống"): đa số do ẩm thực bất tiết, thích ăn đồ sống lạnh, hoặc ưu tư não nộ thái quá gây khí cơ không thông mà đau.

7 chứng thường gặp:

1. **Hàn ngưng vị quản**: đau dữ dội (kịch thống), gặp nóng ấm đau giảm, kèm nôn ói nước trong, tứ chi quyết lãnh, mặt trắng xanh, lưỡi nhạt, rêu mỏng trắng, mạch trầm trì. Hàn ngưng trung tiêu, vị quản co thắt.

2. **Nhiệt thịnh vị quản**: đau nóng rát (chước nhiệt) kèm miệng khô thích uống lạnh, táo bón, tiểu vàng sậm, lưỡi đỏ rêu vàng, mạch hoạt sác. Tà nhiệt uẩn kết trong vị.

3. **Khí hư vị quản thống**: đau âm ỉ (ẩn ẩn), rõ lúc đói, thích ấm ấn xoa, đau giảm khi ăn kèm nôn nước trong, uể oải vô lực, sắc mặt nhợt nhạt, lưỡi trắng nhạt, mạch tế vô lực. Trung khí hư nhược vị khí bất túc.

4. **Âm hư vị quản thống**: phiền nhiệt đau âm ỉ không dứt kèm ăn kém, bụng căng trướng, ngăn tức sau ăn, môi lưỡi khô táo, miệng hơi khát, ngũ tâm phiền nhiệt, đại tiện táo, lưỡi đỏ, mạch tế sác. Tân dịch thiếu không nhu nhuận vị quản.

5. **Khí trệ vị quản thống**: đau lan đến sườn, khó chịu khi âm (ăn?), giảm khi trung tiện được, kèm ợ hơi ợ chua trào ngược, không muốn ăn, rêu mỏng trắng, mạch trầm sáp. Khí trệ mạch lạc ứ tắc.

6. **Ứ huyết vị quản thống**: đau như châm chích, đau cố định, cự án, đau tăng sau ăn kèm ẩu huyết, đại tiện phân đen, lưỡi hơi xanh có ứ ban, mạch trầm sáp. Ứ huyết đình trệ lạc mạch trở trệ.

7. **Thực tích vị quản thống**: trướng thống, đau tăng khi ấn, kèm buồn nôn nôn ói, không muốn ăn, đại tiện phân hôi thối mà không sảng, rêu vàng nê hoặc vàng trắng, mạch thực hoạt. Thực tích vị khí không hạ giáng.

PHÂN BIỆT CHỦ YẾU: Hàn ngưng (gặp ấm giảm, nôn nước trong, chi lạnh) KHÁC nhiệt thịnh (miệng khô thích uống lạnh). Khí hư và âm hư bệnh trình dài, đau NHẸ — khí hư (thích ấm thích xoa, ăn vào đau giảm); âm hư (miệng lưỡi khô táo, ngũ tâm phiền nhiệt, ăn vào bụng trướng). Khí trệ, huyết ứ, thực tích đều THỰC chứng, CỰ ÁN (khác hư chứng), KHÔNG rõ thích ấm/thích lạnh/chi lạnh như hàn ngưng/nhiệt thịnh — khí trệ (sau trung tiện đau giảm); huyết ứ (đau như châm chích, cố định, lưỡi xanh có ứ ban); thực tích (nôn ói, ợ hơi mùi đồ ăn, đại tiện không thông rất hôi thối).`,
      keyPoints: "Vị quản thống: Hàn ngưng (gặp ấm giảm) đối lập Nhiệt thịnh (thích lạnh) — cả 2 đau dữ dội rõ ràng\nKhí hư/Âm hư: hư chứng, đau nhẹ bệnh trình dài, phân biệt bằng thích ấm (khí hư) vs khô miệng phiền nhiệt (âm hư)\nKhí trệ/Huyết ứ/Thực tích: đều thực chứng cự án — phân biệt bằng giảm sau trung tiện (khí trệ), đau cố định+ứ ban (huyết ứ), nôn ói hôi thối (thực tích)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Đau Ngực Sườn (8 chứng) và Vị Quản Thống (7 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

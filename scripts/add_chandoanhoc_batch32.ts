import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục ĐAU: Tổng quan và Đau Đầu",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - ĐAU: Tổng Quan và Nguyên Tắc Biện Chứng",
      category: cat,
      summary: "Đau là cảm giác chủ quan — vị trí và tính chất đau giúp phán đoán tạng/phủ, kinh/lạc, khí/huyết, phong/hàn/thấp/nhiệt, hư/thực. 7 vị trí đau: đầu, ngực sườn, vị quản, bụng, lưng, cơ, khớp.",
      content: `ĐAU: cảm giác chủ quan — dựa vào vị trí và tính chất đau do bệnh nhân khai có thể phán đoán bệnh tại TẠNG hay PHỦ, tại KINH hay LẠC, tại KHÍ hay HUYẾT, và thuộc PHONG/HÀN/THẤP/NHIỆT, thuộc HƯ hay THỰC. Dựa vị trí chia: đau đầu, đau ngực sườn, đau vị quản, đau bụng, đau lưng, đau cơ, đau khớp.

NGUYÊN NHÂN: tà khí phong-hàn-thử-thấp-táo-nhiệt xâm phạm làm kinh lạc bế tắc, dinh vệ ngưng trệ; hoặc tình chí tổn thương gây khí trệ huyết ứ, tạng phủ úng trệ; hoặc khí huyết nội tạng suy, lạc mạch trống rỗng — đều xuất hiện đau đớn tính chất khác nhau.

NGUYÊN TẮC PHÂN BIỆT TÍNH CHẤT ĐAU (then chốt để biện chứng mọi loại đau):
- Trướng thống (đau căng trướng) → đa số KHÍ TRỆ
- Thích thống (đau như châm đâm) → Ứ HUYẾT
- Đau mà nặng nề → THẤP
- Đau xuyên di chuyển (không cố định) → PHONG
- Lãnh thống co thắt (đau lạnh co rút) → HÀN
- Chước nhiệt thống (đau nóng rát) → HỎA THỊNH
- Đau âm ỉ, thích ấn xoa → HƯ CHỨNG
- Đau dữ dội hoặc trướng thống cự án → THỰC CHỨNG`,
      keyPoints: "Nguyên tắc biện chứng ĐAU (áp dụng cho mọi vị trí đau): trướng=khí trệ, thích(châm đâm)=ứ huyết, nặng nề=thấp, xuyên di chuyển=phong, lạnh co thắt=hàn, nóng rát=hỏa, âm ỉ thích xoa=hư, dữ dội cự án=thực",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Đau Đầu (10 chứng phân biệt)",
      category: cat,
      summary: "Đau đầu gặp trong nhiều bệnh — ngoại cảm (phong hàn/phong nhiệt/phong thấp) và nội thương (can dương thượng kháng/can hỏa thượng viêm/thận hư/khí hư/huyết hư/đàm trọc/ứ huyết), cùng thiên đầu thống và đại đầu ôn.",
      content: `ĐAU ĐẦU: triệu chứng thường gặp, gặp trong nhiều bệnh. Bất luận ngoại cảm/nội thương, phàm tà khí thượng nghịch đều gây đau đầu. Do cảm thụ ngoại tà và tổn thương âm dương khí huyết mỗi người khác nhau nên biểu hiện khác nhau.

10 chứng thường gặp:

1. **Ngoại cảm phong hàn**: đau đầu lan cổ lưng, gặp lạnh càng đau, kèm ố hàn phong, đau khớp, rêu mỏng trắng, mạch phù khẩn. Hàn tính ngưng trệ trở át mạch lạc.

2. **Ngoại cảm phong nhiệt**: đau đầu kèm ố phong, sốt, mặt đỏ, tai đỏ, miệng khát muốn uống, rêu mỏng vàng, mạch phù sác. Nhiệt tính thượng viêm nhiễu động thanh khiếu.

3. **Ngoại cảm phong thấp**: đau đầu như bó buộc, nặng nề căng trướng, trời âm u mưa đau nhiều, kèm ố hàn, tay chân mình mẩy nặng nề uể oải, ngực tức, chán ăn, rêu trắng nê, mạch nhu hoãn. Thấp tà trở tắc thanh khiếu, thanh dương bất thăng trọc âm không giáng.

4. **Can dương thượng kháng**: đầu vựng căng đau, tai ù mắt rát, miệng họng khô, mất ngủ hay quên, tay chân run nhẹ, lưỡi đỏ ít tân, mạch huyền tế. Can dương thượng kháng bức khí huyết xung doanh phía trên.

5. **Can hỏa thượng viêm**: đầu vựng trướng thống, mặt đỏ tai đỏ, miệng đắng sườn đau, dễ cáu, đại tiện táo, tiểu vàng sậm, đỏ đầu và rìa lưỡi, rêu vàng mà khô, mạch huyền sác. Can kinh thực hỏa thượng nghịch lên đầu.

6. **Thận hư**: đầu đau cảm giác trống rỗng, chóng mặt ù tai, lưng gối mỏi mềm vô lực hoặc di tinh đái hạ, lưỡi đỏ ít rêu, mạch trầm tế vô lực. Thận chủ cốt sinh tủy, tủy xung lên đầu, thận hư bất túc.

7. **Khí hư**: đau đầu âm ỉ liên miên không ngưng, tăng khi mệt nhọc, úy hàn thiểu khí, cơ thể uể oải vô lực, khí đoản, tiếng nói nhỏ, lưỡi nhạt, mạch vi nhược. Trung khí khuy tổn không thượng vinh thanh khiếu.

8. **Huyết hư**: đau đầu ngầm ngầm, tâm quý mất ngủ, tay chân tê dại, sắc mặt trắng bệnh nhợt nhạt, môi lưỡi trắng nhợt, mạch hư sáp. Âm huyết bất túc thanh khiếu thất dưỡng.

9. **Đàm trọc**: đau đầu lúc đau lúc không, đầy căng nặng, lơ mơ muốn ngủ hoài, cơ thể nặng nề co ro uể oải, buồn nôn nôn ra đàm dãi, phiền muộn bực bội, rêu trắng nê, mạch huyền hoạt. Đàm trọc trở trệ thanh khiếu, thanh dương bất thăng.

10. **Ứ huyết**: đau đầu như châm chích, đau cố định, lúc đau lúc ngưng kéo dài không khỏi, lưỡi tím tối hoặc có ứ điểm, mạch trầm huyền hoặc trầm sáp. Kinh lạc ứ huyết không thông.

Thêm 2 bệnh đặc biệt:
- **Thiên đầu thống**: đau 1 bên đầu lúc đau lúc ngưng, lúc đau dữ dội khó chịu, đau lan mắt, kéo dài không khỏi, mạch huyền. Can kinh uất nhiệt lâu sinh đàm làm kinh mạch không thông.
- **Đại đầu ôn** (nhọt độc): đầu đau căng dữ dội khó chịu, đầu mắt sưng to, mặt có nhọt lở kèm sốt ho, họng khô, miệng khát, tức ngực phiền muộn, rêu vàng nê, mạch huyền sác. Nhiệt độc thượng úng mạch lạc không thông.

PHÂN BIỆT CHỦ YẾU: Ngoại cảm đau đầu LUÔN kèm biểu chứng — phong hàn (lan cổ lưng, gặp lạnh tăng, mạch phù khẩn, mùa đông); phong nhiệt (mặt tai đỏ, khát, mạch phù sác, mùa xuân); phong thấp (căng nặng, mình nặng, tức ngực chán ăn, rêu trắng nê). Can dương thượng kháng (tai ù mắt khô rát, họng khô, tay chân run) khác can hỏa thượng viêm (mặt đỏ mắt đỏ miệng đắng đau sườn). Thận hư (cảm giác đầu TRỐNG RỖNG mà đau kèm lưng gối mỏi/di tinh). Khí hư và huyết hư đều bệnh trình dài — khí hư đau tăng khi MỆT MỎI kèm úy hàn khí đoản phạt lực; huyết hư kèm tâm quý mất ngủ mặt trắng môi nhạt tay chân tê. Đàm trọc (đầu nặng chóng mặt buồn ngủ, buồn nôn/nôn đàm dãi, rêu trắng nê). Huyết ứ (đau như đâm chọc, đau CỐ ĐỊNH, lưỡi tím ứ điểm). Thiên đầu thống (đau MỘT BÊN đầu lan mắt). Đại đầu ôn (đau căng, đầu mắt sưng to, sốt, mặt có nhọt lở, rêu vàng nê).`,
      keyPoints: "Đau đầu: ngoại cảm LUÔN kèm biểu chứng (phong hàn/nhiệt/thấp); nội thương KHÔNG có biểu chứng (can dương/hỏa, thận hư, khí/huyết hư, đàm trọc, ứ huyết)\nThiên đầu thống (đau 1 bên lan mắt, mạn tính) và Đại đầu ôn (nhọt độc, cấp tính, sốt cao) là 2 bệnh danh riêng biệt dễ nhận diện",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: ĐAU Tổng Quan và Đau Đầu (10 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

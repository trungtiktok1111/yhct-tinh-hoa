import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Ho và Suyễn Thúc",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Ho (10 chứng phân biệt)",
      category: cat,
      summary: "Ho là triệu chứng chủ yếu của phế bệnh (ngoại tà xâm tập phế hoặc tạng phủ khác ảnh hưởng phế gây phế khí không thông) — chia ngoại cảm ho (phong hàn/phong nhiệt/táo nhiệt) và nội thương ho (đàm thấp/can hỏa/phế âm hư/phế khí hư/phế thận lưỡng hư/phế nuy/phế ung).",
      content: `HO: triệu chứng chủ yếu của phế bệnh. Do ngoại tà xâm tập phế hoặc bệnh các tạng phủ khác tổn thương phế gây phế khí không thông (bất lợi). Chia NGOẠI CẢM ho (phế chủ bì mao dễ cảm ngoại tà) và NỘI THƯƠNG ho (tạng phủ khác ảnh hưởng phế).

10 chứng thường gặp:

1. **Ngoại cảm phong hàn**: ho đàm trắng loãng kèm ố hàn, sốt, đau đầu nghẹt mũi, chảy nước mũi, rêu lưỡi mỏng trắng, mạch phù. Phong hàn phạm phế, phế khí uất trệ mất tuyên giáng.

2. **Ngoại cảm phong nhiệt**: ho đàm vàng đặc khó khạc kèm miệng khát, đau họng, sốt, đau đầu, ố phong, hạn xuất, rêu mỏng vàng, mạch phù sác, đa số phát mùa xuân. Phong nhiệt phạm phế, phế thất thanh túc.

3. **Táo nhiệt thương phế**: ho không đàm hoặc đàm ít đặc dính khó khạc kèm ố hàn, sốt, mũi họng khô táo, ho gây đau ngực, rêu mỏng vàng mà khô, mạch tế sác, phát mùa thu. Phế tân bị đốt thiêu, phế khí thất tuyên.

4. **Đàm thấp phạm phế**: ho đàm nhiều mà trắng dính kèm tức đầy ngực bụng, ăn ít, tiêu chảy, rêu trắng nê, mạch nhu hoạt. Tỳ thất kiện vận tụ thấp sinh đàm đi lên phạm phế.

5. **Can hỏa phạm phế**: ho khí nghịch đàm đặc khó khạc kèm mặt đỏ họng khô, ho đau ngực sườn, rêu vàng mỏng ít tân dịch, mạch huyền sác. Can hỏa phạm phế gây phế thất thanh túc.

6. **Phế âm hư**: ho không đàm hoặc đàm ít dính khó khạc hoặc trong đàm lẫn máu (hoặc khạc máu) kèm hầu họng khô táo, triều nhiệt đạo hạn, lưỡi khô mà bóng, mạch tế sác. Phế âm bất túc hư hỏa vọng động nấu tân thành đàm.

7. **Phế khí hư**: ho khí đoản, đàm nhiều mà trong loãng kèm sắc mặt nhợt nhạt, mệt mỏi tự hạn, dễ cảm mạo, lưỡi trắng nhạt, mạch hư nhược. Phế khí hư nhược thất giáng thất chức.

8. **Phế thận lưỡng hư**: ho khí thúc (thở hổn hển), khó khạc đàm, động tắc khí thúc nặng hơn kèm hầu họng đau rát, chóng mặt ù tai, lưng mỏi, lưỡi đỏ mà bóng, mạch tế sác. Hô hấp thất tư, nạp khí kém.

9. **Phế nuy**: ho khạc nhổ bọt dãi, khí đoản, người gầy gò, lưỡi đỏ mạch hư sác. Nhiệt thương tân dịch, phế mất nhu nhuận.

10. **Phế ung**: ho khạc nhổ đàm mủ tanh hôi kèm đau ngực, bứt rứt, sốt, rét run, rêu mỏng vàng, mạch phù sác hoạt. Nhiệt độc úng trệ tại phế.

PHÂN BIỆT CHỦ YẾU: Ho ngoại cảm có sốt, ố hàn hoặc ố phong (phong hàn: đàm trắng loãng; phong nhiệt: đàm vàng đặc; táo nhiệt: không đàm hoặc đàm ít dính đặc). Ho nội thương KHÔNG có ố hàn, sốt (đàm thấp phạm phế: đàm nhiều trắng, ăn kém tiêu chảy, rêu trắng nê; can hỏa phạm phế: khí nghịch đàm đặc, đau ngực sườn khi ho; phế âm hư: không đàm hoặc đàm ít đặc dính lẫn máu, hầu họng khô táo; phế khí hư: đàm nhiều loãng trong, sắc mặt trắng nhợt, tự hạn; phế thận lưỡng hư: động là khí thúc, hoa mắt ù tai, mỏi lưng). Phế nuy: khạc nhổ bọt dãi là biểu hiện chủ yếu. Phế ung: kèm sốt, lạnh run, khạc đàm mủ tanh hôi.`,
      keyPoints: "Ho ngoại cảm LUÔN có ố hàn/sốt (phân biệt phong hàn/phong nhiệt/táo nhiệt theo tính chất đàm); Ho nội thương KHÔNG có ố hàn/sốt (phân biệt theo tạng gây bệnh: đàm thấp, can hỏa, phế âm/khí hư, phế thận lưỡng hư)\nPhế nuy (khạc bọt dãi) và Phế ung (khạc đàm mủ tanh hôi + sốt rét run) là 2 bệnh nặng đặc trưng riêng biệt dễ nhận diện",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Suyễn Thúc (Khó Thở Cấp, 8 chứng phân biệt)",
      category: cat,
      summary: "Suyễn thúc (khí suyễn — hô hấp cấp thúc, thậm chí há miệng rụt cổ tỳ vai để thở) liên hệ mật thiết phế-thận — thực chứng (phong hàn/nhiệt tà úng phế/đàm trọc/huyền ẩm/hàn ẩm/phong thủy) và hư chứng (phế khí hư/thận bất nạp khí).",
      content: `SUYỄN THÚC (khí suyễn): hô hấp cấp thúc (nhanh, hổn hển), thậm chí há miệng rụt cổ tỳ vai để thở — triệu chứng thường gặp, xuất hiện trong nhiều bệnh. Liên hệ mật thiết PHẾ-THẬN: ngoại cảm/nội thương gây bệnh tại phế thận, khí cơ thăng giáng xuất nhập thất thường gây suyễn thúc. Chia hư thực: THỰC chứng đa phần do phong hàn, đàm hỏa, đàm trọc úng thịnh tại phế khiến phế thất tuyên giáng. HƯ chứng đa số do phế khí hư nhược, thận khí bất túc, nạp khí thất thường.

8 chứng thường gặp:

1. **Phong hàn thúc phế**: suyễn thúc kèm tức ngực, ho, đàm trắng loãng kèm sốt, ố hàn, không mồ hôi, rêu trắng mỏng, mạch phù khẩn, đa số phát đông. Phong hàn ngoại tập nội hợp phế, phế khí thất tuyên.

2. **Nhiệt tà úng phế**: suyễn thúc hơi thở thô hữu lực, thậm chí cánh mũi phập phồng kèm ho đàm vàng đặc dính, sốt, tâm phiền, miệng khát, hạn xuất, lưỡi đỏ rêu vàng, mạch sác. Phong hàn tập phế uất hóa nhiệt, hoặc phong nhiệt phạm phế, hoặc phế có phục nhiệt cảm thêm ngoại tà dẫn động.

3. **Đàm trọc trở phế**: suyễn thúc thậm chí há miệng co vai thở, không nằm được, ho đàm nhiều đặc dính khó khạc kèm ngực bụng đầy tức, buồn nôn ăn ít, miệng dính không mùi vị, rêu trắng nê, mạch hoạt. Thấp tích thành đàm trữ phế úng tắc khí đạo.

4. **Phế khí hư suy**: suyễn thúc khí đoản vô lực, ho tiếng nhỏ khẽ, tiếng nói nhỏ khó nghe, tự hạn, úy phong, hầu họng khô táo, lưỡi nhạt ít rêu, mạch nhuyễn nhược. Phế khí bất túc khí thất sở chủ túc giáng thất tư.

5. **Thận bất nạp khí**: hô hấp suyễn thúc, hô đa hấp thiểu (thở ra dễ hít vào khó), động tắc suyễn tăng, khó thở không nối tiếp được kèm gầy gò, tinh thần uể oải lừ đừ, chi lạnh, hạn xuất, mặt xanh hoặc đen xì, lưỡi nhạt, mạch trầm tế. Thận khí hư nhược, hạ nguyên bất cố, khí thất nhiếp nạp.

6. **Huyền ẩm bệnh**: hô hấp cấp thúc, ngực sườn trướng mãn đau khi ho, rêu trắng, mạch trầm huyền. Ẩm đình tại ngực sườn, mạch lạc trở trệ.

7. **Hàn ẩm đình phế**: hô hấp suyễn thúc thậm chí há miệng rụt vai thở, không nằm được, kèm ho đàm trắng bọt lượng nhiều, rêu trắng nê, mạch huyền khẩn, bệnh kéo dài không khỏi (giống giãn phế quản mạn), hễ cảm hàn là tái phát, sơ khởi có ố hàn đau mình. Hàn ẩm đình phế, phế khí thượng nghịch, do ngoại cảm tà dẫn động phục ẩm.

8. **Thủy thũng bệnh, phong thủy phiếm dật**: hô hấp suyễn thúc kèm sưng phù mi mắt sau phù toàn thân, đau sưng họng, khớp mỏi nặng, tiểu không thông, thường ố hàn ố phong sốt, rêu trắng mỏng, mạch phù hoạt hoặc sác. Phong tà ngoại nhập, thông điều thủy đạo của phế đình trệ, thủy khí lăng phế.

PHÂN BIỆT CHỦ YẾU: Phong hàn thúc phế (ố hàn sốt, đàm loãng) khác nhiệt tà úng phế (sốt, tâm phiền khát, đàm vàng đặc). Đàm trọc trở phế (đàm nhiều dính đặc, ngực bụng đầy tức buồn nôn ăn kém là chủ chứng). Phế khí hư suy (khí đoản vô lực, tự hạn, úy phong) khác thận bất nạp khí (hô đa hấp thiểu, động tắc suyễn tăng, chi lạnh, mặt xanh). Huyền ẩm (ngực sườn trướng đầy, ho đau ngực sườn). Hàn ẩm đình phế (đàm trắng bọt nhiều, bệnh kéo dài khó khỏi, mỗi cảm hàn tái phát). Phong thủy phiếm dật (phù toàn thân, tiểu không thông là chính).`,
      keyPoints: "Suyễn thúc thực chứng (phong hàn/nhiệt tà/đàm trọc/huyền ẩm/hàn ẩm/phong thủy — đều có tà thực rõ) vs hư chứng (phế khí hư: tự hạn úy phong; thận bất nạp khí: hô đa hấp thiểu, động tắc tăng — đặc trưng nhất)\nHàn ẩm đình phế giống lâm sàng giãn phế quản mạn tính: bệnh kéo dài, tái phát theo cảm hàn, đàm bọt trắng nhiều",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Ho (10 chứng) và Suyễn Thúc (8 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

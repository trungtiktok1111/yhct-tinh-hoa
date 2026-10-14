import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Hôn Mê và Co Giật",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Hôn Mê (12 chứng phân biệt)",
      category: cat,
      summary: "Hôn mê (thanh khiếu bất lợi, thần minh thất dụng, bệnh biến chủ yếu tại tâm) gặp trong ngoại cảm nặng, trúng phong, quyết chứng, giản chứng, hoặc nội thương giai đoạn cuối — 12 chứng phân biệt theo cơ chế mông bịt/nhiễu loạn/hao tán thần minh.",
      content: `HÔN MÊ: thường gặp thể nặng ngoại cảm bệnh hoặc trúng phong, quyết chứng, giản chứng; cũng gặp nội thương tạp bệnh/bệnh lâu nặng tinh khí hao kiệt (thủy thũng, cổ trướng giai đoạn cuối). Do nhiều nguyên nhân gây thanh khiếu bất lợi, thần minh thất dụng — bệnh biến chủ yếu tại TÂM (tâm chủ thần minh): bệnh tà mông bịt tâm khiếu, thượng nhiễu thần minh, hoặc âm hư dương thoát/tâm thần hao tán đều dẫn đến thần minh thất dụng mà hôn mê.

12 chứng thường gặp:

1. **Nhiệt hãm tâm bào trong ôn nhiệt bệnh**: hôn mê kèm tráng nhiệt (hoặc sốt cao về đêm), phiền thao chiêm ngữ, hoặc hôn mê không nói, chi lạnh, lưỡi cứng, mạch tế sác. Đa số do phế vệ chi tà nghịch truyền tâm bào — tà nhiệt nội hãm chước tân thành đàm, đàm nhiệt bế trở bào lạc. Phát bệnh tương đối cấp và nặng.

2. **Vị trường nhiệt kết, vị nhiệt thừa tâm chứng**: hôn mê kèm nhật bô triều nhiệt, bụng đầy cứng mà đau cự án, miệng khát thích uống, rêu vàng khô, mạch trầm thực. Gặp giai đoạn giữa các loại nhiệt bệnh. Ngoại tà nhập lý hóa nhiệt, nhiệt kết vị trường, tân thương táo kết; vị nhiệt thừa tâm nhiễu loạn thần minh.

3. **Thấp nhiệt mông bịt thanh khiếu trong thấp ôn bệnh**: hôn mê lúc tỉnh lúc mê, sốt không cao, có lúc nói nhảm, rêu vàng nê, mạch nhu hoạt mà sác, hay phát mùa hạ. Thấp nhiệt ủ thành đàm che lấp thanh khiếu.

4. **Nhiệt nhiễu tâm cung chứng trong ôn bệnh**: hôn mê kèm sốt cao về đêm có lúc chiêm ngữ, miệng không khát lắm, ban chẩn xuất hiện lờ mờ, lưỡi đỏ thẫm rêu quang ít tân, mạch tế sác. Gặp giai đoạn cuối các dạng ôn bệnh. Dinh huyết thông tâm — tà nhiệt nhập dinh, dinh âm bị hao nhiễu loạn tâm thần.

5. **Ôn bệnh nhiệt thịnh động huyết, huyết lạc ứ trệ chứng**: hôn mê chiêm ngữ kèm phiền thao, miệng khát xúc miệng chứ không nuốt nước, ban chẩn thấu lộ hoặc các loại xuất huyết, lưỡi đỏ thẫm nhìn khô nhưng sờ ướt nhuận, mạch tế sác. Gặp giai đoạn giữa-sau nhiều dạng ôn bệnh. Huyết phần nhiệt thịnh thượng nhiễu tâm thần.

6. **Thủy thũng tỳ thận lưỡng hư**: hôn mê kèm phù thũng, sắc mặt nhợt nhạt không tươi, hoa mắt, buồn nôn liên tục, miệng có mùi khai urê, tiểu ít, lưỡi nhạt, mạch tế nhược. Trọc âm thượng nghịch mông bịt tâm bào.

7. **Cổ trướng dương khí bạo thoát chứng**: hôn mê kèm buồn nôn nôn ói, bụng to cứng đầy, mạch lạc nổ trướng (tĩnh mạch bàng hệ), sắc mặt ám trệ, tiếng ngáy nhỏ, tay xòe chi lạnh, mồ hôi đầm đìa như mưa, tiêu tiểu không tự chủ, môi lưỡi nhạt nhuận hoặc xanh tím, mạch vi muốn tuyệt. Bệnh lâu không khỏi, dương khí suy vi.

8. **Trúng thử (thử nhiệt nội kết chứng)**: đột nhiên hôn mê bất tỉnh kèm sốt, mặt đỏ, hơi thở thô, tứ chi lạnh toát, lưỡi đỏ rêu trắng mỏng hoặc mỏng vàng, mạch hồng đại hoặc hoạt sác, đa số phát hè hoặc làm việc môi trường nhiệt cao. Khởi đầu hoa mắt chóng mặt, tâm phiền khát, thở nhanh, sau hôn đảo. Thử tà đột nhiên xâm nhập, tà nhiệt bế tắc thanh khiếu.

9. **Trúng phong bế chứng** (chia dương bế và âm bế): đột ngột hôn đảo bất tỉnh, miệng méo kèm mắt đỏ sốt thở gấp hai tay nắm chặt răng cắn chặt đàm kéo khò khè rêu vàng nê mạch huyền hoạt sác (dương bế); hoặc tĩnh lặng nằm yên không phiền thao, mặt trắng môi tím, đàm dãi úng thịnh, tứ chi không ấm, rêu trắng hoạt nê, mạch trầm hoạt/trầm hoãn (âm bế). Đa số do can dương kháng thịnh hoặc thận âm bất túc, can phong nội động kèm đàm hỏa/đàm thấp thượng nhiễu thanh khiếu.

10. **Trúng phong thoát chứng**: hai mắt nhắm miệng há, tay buông thả, tiểu trong quần, ngáy to, hơi thở nhỏ yếu, mồ hôi đầm đìa (như châu), tứ chi quyết lãnh, lưỡi rụt ngắn, rêu trắng hoạt, mạch vi muốn tuyệt. Nguyên khí suy bại, âm dương ly quyết.

11. **Quyết chứng**: nhất thời hôn mê bất tỉnh kèm mím chặt miệng, tay nắm chặt, thở gấp, tứ chi lạnh toát, môi tím, rêu trắng mỏng, mạch phục hoặc trầm huyền. Âm dương thất điều, khí cơ nghịch loạn, huyết theo khí nghịch thượng úng tâm hung trở tắc thanh khiếu. Hôn mê mang tính nhất thời, thời gian ngắn.

12. **Giản chứng**: đột ngột hôn mê, thần chí không tỉnh táo, miệng chảy dãi bọt hoặc phát tiếng kêu dị thường kèm sắc mặt trắng nhợt, răng cắn chặt, hai mắt trợn ngược, tay chân co giật, rêu trắng nê, mạch hoạt. Đàm trọc trở trệ, khí cơ nghịch loạn, can phong nội động, đàm thượng nghịch bế trở thanh khiếu. Hay tái phát, tỉnh lại như người thường.

PHÂN BIỆT CHỦ YẾU: Nhiệt hãm tâm bào (sơ khởi có triệu chứng vệ phần, bệnh nặng biến nhanh) khác nhiệt kết vị trường (bụng đầy cự án, lưỡi vàng khô). Thấp nhiệt mông bịt tâm bào (thần trí ngây ngô, lúc tỉnh lúc mê) khác hẳn 2 chứng trên. Nhiệt nhiễu tâm thần (sốt cao đêm, miệng không khát lắm, ban chẩn lờ mờ) khác nhiệt thịnh động huyết (PHẢI kèm phát ban/xuất huyết, khát nhưng chỉ xúc miệng không nuốt). Thủy thũng tỳ thận lưỡng hư (bệnh trình dài, phù thũng, mặt trắng nhạt, miệng mùi khai urê) khác cổ trướng dương khí bạo thoát (bệnh trình dài, bụng trướng to cứng, nổi tĩnh mạch bàng hệ, sắc mặt tối ám, đại hạn dầm dề — nguy kịch vong dương). Thử nhiệt nội kết (phát tác đột ngột, thời gian NGẮN, có tính mùa rõ hè, KHÔNG co giật) khác trúng phong bế chứng (phát đột ngột nhưng thời gian hôn mê DÀI, kèm méo miệng cắn chặt răng hai tay nắm chặt, đa số để lại DI CHỨNG) khác trúng phong thoát chứng (cũng méo miệng nhưng miệng HÁ tay BUÔNG THẢ, tiểu không hay, mồ hôi như châu). Quyết chứng (mang tính NHẤT THỜI, tứ chi lạnh rõ, thường KHÔNG để lại di chứng) khác giản chứng (hay TÁI PHÁT, tỉnh lại như thường, khi hôn mê sùi bọt mép tay chân co giật tiếng kêu dị thường).`,
      keyPoints: "Hôn mê luôn quy về TÂM (tâm chủ thần minh) dù nguyên nhân là nhiệt/đàm/thấp/hư thoát\nChìa khóa phân biệt: thời gian hôn mê (ngắn=thử nhiệt/quyết chứng; dài=trúng phong), có để lại di chứng không (trúng phong bế có, quyết chứng/giản chứng không), có co giật không, dương bế (tay nắm chặt, phiền táo) vs âm bế (nằm yên, không phiền táo) vs thoát chứng (tay chân buông thả, mồ hôi như châu)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Co Giật (9 chứng phân biệt)",
      category: cat,
      summary: "Co giật (cân mạch câu cấp) do khí huyết khuy tổn, hỏa nhiệt tích thịnh, phong thấp hàn ngưng, hoặc ngoan đàm — gặp trong kinh chứng (cương/nhu), giản chứng, uốn ván, kinh phong (cấp/mạn), lý thực nhiệt kết, nhiệt cực sinh phong, khí huyết lưỡng hư, can thận âm hư, và huyết ứ.",
      content: `CO GIẬT: thường gặp "Kinh chứng", "Giản chứng", uốn ván, kinh phong. Nhiều nguyên nhân tác động lên cân mạch sinh ra: khí huyết khuy tổn, hỏa nhiệt tích thịnh, phong thấp hàn ngưng, ngoan đàm (đàm cố kết ngoan cố) — đều gây cân mạch câu cấp (co thắt).

9 chứng thường gặp:

1. **Cương kinh**: tứ chi co giật, giác cung phản trương, cấm khẩu, gáy cứng, kèm sốt ố hàn KHÔNG mồ hôi, rêu trắng, mạch trầm khẩn. Phong hàn ngoại tập, dương khí trở ngại không nhu dưỡng cân — thái dương chủ biểu, phong hàn tổn dương khí, vệ biểu không ôn húc cân mạch.

2. **Nhu kinh**: tứ chi co giật, giác cung phản trương, cấm khẩu cứng gáy kèm sốt KHÔNG ố hàn, rêu trắng, mạch phù hoãn. Phong tà ngoại tập, vệ dương bất cố, hạn xuất vong dương, cân thất sở dưỡng.

3. **Giản chứng**: tứ chi co giật, hai mắt trợn ngược, sùi bọt mép, đột ngột hôn đảo bất tỉnh, sau tỉnh lại như người thường, hay tái phát. Can phong kẹp đàm thượng nghịch bế trở thanh khiếu — do can/tỳ/thận 3 tạng thất điều: tỳ hư vận hóa thất chức tụ thấp thành đàm; thận hư tinh hư không dưỡng can; can dương kháng thịnh kẹp đàm thượng nghịch mông bế thanh khiếu.

4. **Uốn ván (phá thương phong)**: tứ chi co giật, lưng gáy cứng đơ, giác cung phản trương, răng cắn chặt, lưỡi cứng, miệng mím, chảy dãi, vẻ mặt cười đau khổ. Do ngoại thương (sang chấn) hoặc sản hậu nhiễm trùng sơ sinh.

5. **Kinh phong** (ở trẻ em, chia cấp và mạn): tứ chi co giật, cổ gáy cứng đơ, răng cắn chặt, lúc phát lúc nghỉ.
   - **Cấp kinh phong**: co giật kèm sốt cao, phiền thao bất an, mặt đỏ môi đỏ tươi, đột ngột co giật, thần trí hôn mê, giác cung phản trương, không nước mắt nước mũi, co giật liên tục hoặc lúc nghỉ rồi lại liên tục. Nội nhiệt tích thịnh, đàm ngưng khí trệ, phong nhiệt hỏa tà uất bế kinh mạch.
   - **Mạn kinh phong**: co giật chậm vô lực, lúc phát lúc ngưng, hơi sốt, sắc mặt vàng nhạt, lười biếng uể oải, không muốn nói, mắt nhắm li bì, đại tiện phân xanh hoặc tiêu phân sống, mạch trầm hoãn vô lực. Khí huyết bất túc, can tỳ lưỡng hư không tư dưỡng ôn húc cân mạch.

6. **Lý thực nhiệt kết chứng**: tứ chi co giật, chân co quắp, lưng gáy cứng đơ, nằm lưng không chạm chiếu, răng nghiến chặt kèn kẹt, kèm sốt, ngực đầy, tiêu táo bón, lưỡi đỏ rêu vàng, mạch huyền sác hữu lực. Nhiệt thịnh chước tân không nhu dưỡng cân mạch. "Kim quỹ yếu lược": "Kinh vi bệnh, hung mãn khẩu cấm, ngọa bất trước tịch, cước loạn cấp, tất giới xỉ, khả vu Đại thừa khí thang".

7. **Nhiệt cực sinh phong**: tứ chi co giật, cổ gáy cứng đơ kèm sốt cao ói mửa, thần trí lơ mơ, đầu nhức vô cùng. Nhiệt hỏa độc hao thương âm dịch, cân mạch co thắt.

8. **Khí huyết lưỡng hư, hư phong nội động**: tứ chi co giật, tay chân run kèm hoa mắt chóng mặt, hạn xuất, lừ đừ phạt lực, khí đoản, lưỡi nhạt, mạch nhược. Không nhu nhuận cân mạch được.

9. **Can thận âm hư** (tinh huyết bất túc): tứ chi co giật, tay chân run nhẹ (nhu động) kèm lưng gối tê mỏi, sườn đau rát, sốt nhẹ về chiều, lưỡi đỏ thẫm, mạch tế sác.

10. **Ứ huyết nội trở**: tứ chi co giật, cổ gáy cứng đơ, hình thể gầy ốm mệt mỏi, kèm đau nhức đầu mình (thích thống), lưỡi xanh (ẩn thanh) hoặc có ứ điểm, mạch trầm sáp. Ứ trệ bất thông không nhu dưỡng cân mạch.

PHÂN BIỆT CHỦ YẾU: Kinh bệnh chia nhu/cương — "Y tông kim giám": "Kinh bệnh hạng cường bối phản trương, hữu hạn vi nhu, vô hạn vi cương" — điểm phân biệt chủ yếu là CÓ hay KHÔNG mồ hôi. Giản chứng (phát tác đột ngột, sau co giật tỉnh táo như thường, hay tái phát). Uốn ván (PHẢI kèm răng cắn chặt, vẻ mặt cười đau khổ). Kinh phong (chỉ phát ở TRẺ EM). Lý thực nhiệt kết (sốt cao, táo bón, đầy tức ngực, lưỡi đỏ thẫm rêu vàng nê, mạch huyền sác). Nhiệt cực sinh phong (xuất hiện CÙNG sốt rất cao). Hư chứng co giật (KHÔNG có giác cung phản trương, cắn chặt răng): khí huyết lưỡng hư (hoa mắt chóng mặt, tự hạn, khí đoản, phạt lực, lưỡi nhạt mạch nhược); can thận âm hư hóa nhiệt sinh phong (gặp giai đoạn CUỐI nhiệt bệnh, PHẢI kèm đau bụng sườn, sốt thấp, lưỡi đỏ mạch tế sác); ứ huyết (kèm thích thống, lưỡi đỏ có ứ ban, mạch sáp).`,
      keyPoints: "Cương kinh (không mồ hôi) khác Nhu kinh (có mồ hôi) — phân biệt bằng mồ hôi là then chốt\nKinh phong chỉ gặp ở trẻ em, chia cấp (thực nhiệt, sốt cao) và mạn (hư, chậm vô lực)\nHư chứng co giật KHÔNG có giác cung phản trương/cắn chặt răng — khác hẳn thực chứng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Hôn Mê (12 chứng) và Co Giật (10 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

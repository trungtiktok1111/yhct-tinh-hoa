import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên Triệu Chứng Chẩn Đoán Gián Biệt, mục Phát Nhiệt (Ố hàn phát nhiệt, Tráng nhiệt)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tổng Quan và Ố Hàn Phát Nhiệt (14 bệnh phân biệt)",
      category: cat,
      summary: "Phân biệt triệu chứng (cảm giác chủ quan), chứng hầu (kết luận chẩn đoán tổng hợp), và bệnh cơ (cơ chế nối kết). Ố hàn phát nhiệt (sốt kèm sợ lạnh không giải dù đắp ấm) gặp trong 14 loại bệnh khác nhau, mỗi loại có đặc điểm phân biệt riêng theo mùa, mạch, kiêm chứng.",
      content: `TỔNG QUAN PHỤ BIÊN: Triệu chứng là cảm giác chủ quan của bệnh nhân về đau đớn thống khổ khác thường (như đau đầu, chóng mặt), qua thầy thuốc thám sát mà biết được cải biến trạng thái bệnh — là tiêu chí khách quan để chẩn sát phán đoán. Triệu chứng khác chứng hầu: chứng hầu (gọi tắt "chứng") là khái quát tổng hợp bệnh nhân/bệnh cơ/bệnh vị/triệu chứng/thiệt chẩn/mạch chẩn (giống hội chứng), ví dụ biểu thực chứng, âm hư chứng — phản ánh bản chất bệnh, là kết luận chẩn đoán lâm sàng. Bệnh cơ là cơ chế phát sinh-phát triển-chuyển quy của bệnh, là sự kết nối giữa chứng hầu và triệu chứng, là hạt nhân của chứng hầu — quy định tính chất bệnh (cùng bệnh cơ liên hệ nhiều triệu chứng cấu thành chứng hầu). Mục đích chẩn đoán phân biệt: từ triệu chứng phức tạp tìm sự khác biệt giữa các bệnh có triệu chứng giống nhau để xác định chẩn đoán và chỉ đạo điều trị hiệu quả.

PHÁT NHIỆT (SỐT): triệu chứng thường gặp do tăng thân nhiệt hoặc cảm giác nóng dù thân nhiệt bình thường, do ngoại cảm/nội thương làm thất điều âm dương. Phân loại theo thời gian/vị trí/nhiệt thế/triệu chứng chủ quan: ố hàn phát nhiệt, tráng nhiệt, triều nhiệt, hàn nhiệt vãng lai, phiền nhiệt, vi nhiệt, cốt chưng nhiệt.

ỐT HÀN PHÁT NHIỆT: sốt kèm cảm giác sợ lạnh dù đắp thêm/sưởi ấm vẫn không giải được, thân nhiệt thường 38-39°C. Đa số gặp ở bệnh ngoại cảm phong/hàn/thử/thấp/táo/hỏa/ôn độc — tà khí xâm phạm ngoại phạm cơ biểu, tổn thương vệ dương khí, vệ dương mất tác dụng ôn húc nên ố hàn; chính khí phấn khởi kháng tà, tà chính tương tranh uất tại cơ biểu không ngoại tán được nên sốt ("Còn một phân ố hàn thì còn một phân biểu chứng"). Căn cứ mức độ ố hàn/phát nhiệt và kiêm chứng để phân biệt tính chất tà và chẩn đoán chính xác — 14 bệnh thường gặp:

1. **Thái dương thương hàn chứng**: ố hàn phát nhiệt kiêm đau mình, không mồ hôi mà suyễn, mạch phù khẩn, phát mùa đông. Hàn tà thúc biểu, dinh âm uất trệ; hàn tà ngoại tập át ức dương khí nên sốt không mồ hôi mạch phù khẩn; âm dịch uất trệ kinh khí không thông nên đau mình.

2. **Thái dương trúng phong chứng**: ố hàn sốt kèm ố phong tự hạn, mạch phù hoãn, phát mùa đông xuân. Phong tà tập biểu — phong vi dương tà tính khai tiết, phong thương vệ dương tất tổn dinh âm, dương không cố thủ ngoài nên tự hạn mạch phù hoãn.

3. **Phong ôn biểu chứng**: ố hàn nhẹ phát nhiệt nặng ("phát nhiệt vi ố phong hàn") kèm đau đầu, ho, miệng khát, rêu trắng mỏng, mạch phù sác, phát mùa xuân. Phong ôn là dương tà, xâm phạm cơ biểu vệ khí uất nên sốt nặng ố hàn nhẹ; vệ dương uất ảnh hưởng phế tuyên giáng nên ho; ôn nhiệt thượng nhiễu thanh khiếu hao tân nên đau đầu miệng khát.

4. **Thái dương thương thử chứng**: ố hàn sốt kiêm thân thể nặng nề đau mỏi, mạch huyền tế khâu trì, phát mùa hè. Thử nhiệt tà tổn thương thái dương biểu nên ố hàn sốt; thử tà thương khí, nhiệt tà thương âm, khí âm lưỡng thương, kinh lạc khí không hư không thông nên châu thân mỏi nhừ nặng nề.

5. **Thử ôn bệnh, thử kiêm hàn thấp chứng**: ố hàn sốt thân thể co quắp kiêm đau đầu, không mồ hôi, rêu lưỡi nê, phát mùa hè. Thương thử lại ăn đồ sống lạnh, thử và hàn thấp chi tà át ngăn gây bệnh — hàn uất cơ biểu nên sốt ố hàn không mồ hôi co quắp; thử nhiệt nội uất nên tâm phiền; thấp tà nội trở nên rêu nê trắng tức ngực.

6. **Thấp ôn bệnh, thấp át vệ khí chứng**: ố hàn sốt, thân nhiệt bất dương, sốt tăng sau buổi trưa, kèm đầu thân nặng nề, tức ngực ngăn ngực, không đói, sắc mặt vàng nhạt, rêu trắng nê, mạch nhu hoãn, phát cuối hạ lúc mưa nhiều ẩm thấp. Thấp nhiệt át uất vệ biểu, vệ khí không tuyên tán nên ố hàn sốt thân nhiệt bất dương; sau ngọ thuộc âm, thấp là âm tà vượng ở âm phần nên sốt tăng chiều; thấp tà trở ức thanh dương nên đầu thân nặng.

7. **Bệnh thu táo, ôn táo chứng**: sốt nặng, ố phong hàn nhẹ kèm đau đầu ít mồ hôi, ho đàm ít mà dính, mũi khô họng táo, miệng khát lưỡi đỏ rêu trắng, mạch tay phải sác đại, phát mùa thu. Táo nhiệt tại biểu vệ dương không tuyên thông nên sốt nhẹ ố hàn; táo nhiệt hao tân thương phế nên mũi khô họng táo ho đàm dính.
   **Lương táo chứng** (thể hàn của thu táo): ố hàn nặng sốt nhẹ kèm đầu hơi đau, không mồ hôi, ho đàm lỏng trắng, nghẹt mũi chảy nước mũi, môi khô, rêu trắng mà khô, mạch huyền. Lương táo thuộc hàn xâm tập phế vệ.

8. **Phục thử bệnh**: ố hàn sốt kèm đau đầu không mồ hôi, tâm phiền, miệng khát tiểu ngắn đỏ, tức bụng rêu nê, mạch nhu hoãn, phát mùa thu đông, khởi bệnh cấp. Thử thấp nội uẩn lại cảm thêm hàn lương — hàn tà tại vệ biểu nên ố hàn sốt đau đầu không mồ hôi; thử nhiệt nội uất hao tân thương thần nên tâm phiền khát tiểu đỏ; thấp tà nội uẩn nên tức bụng rêu nê.

9. **Đông ôn bệnh (giai đoạn khởi phát)**: ố hàn nhẹ sốt nặng kèm đau đầu, không mồ hôi, miệng khát, mũi khô, ho khí nghịch, rêu vàng mỏng, mạch sác, phát mùa đông. Thận tinh bất túc, ôn nhiệt tà thừa cơ tập kích uất cơ biểu; phế khí tổn thương nên ho khí nghịch; ôn nhiệt thương tân nên mũi khô miệng khát.

10. **Phong thủy bệnh**: ố hàn sốt kèm phù mi mắt sau lan tứ chi toàn thân, khớp đau nặng nề, tiểu không thông, ho suyễn, rêu mỏng trắng, mạch phù hoạt, phát đông xuân. Phong tà ngoại tập nên ố hàn sốt; phế khí không tuyên nên ho suyễn; chức năng thông điều thủy đạo giảm nên phù.

11. **Phế ung** (giai đoạn sơ khởi): ố hàn sốt kèm ho đàm nhiều mà dính, đau ngực đau tăng khi ho, sau đó ho khạc đàm mủ tanh hôi, miệng khô mũi khô. Độc nhiệt uất lâu tại phế gây ra.

12. **Viêm họng cấp**: ố hàn sốt kèm đau đầu mình, họng sưng đỏ đau, hoặc điểm lở loét miệng họng, da xuất huyết mờ, lưỡi đỏ rêu trắng khô, mạch phù sác, phát đông xuân. Ôn độc xâm phạm phế vệ nên ố hàn sốt đau đầu mình; nhiệt độc thượng công nên hầu họng sưng đau loét; nhiệt độc nhập dinh nên xuất huyết mờ dưới da.

13. **Trường ung (sơ khởi)**: ố hàn sốt kèm đau vùng thiếu phủ (hố chậu) quặn co thắt cự án, đau lan đùi phải, khó cong gập người, đổ mồ hôi, rêu lưỡi mỏng vàng, mạch phù hoạt mà sác, có tính mùa. Nhiệt tích tụ trong trường không tán, khí huyết ngưng trệ không thông nên đau co thắt cự án; nhiệt ảnh hưởng toàn thân dinh vệ bất hợp nên sốt ố hàn.

14. **Ung nhọt (sơ khởi)**: ố hàn sốt, da cục bộ sưng nóng đỏ đau kèm chóng mặt, ăn không ngon, đại tiện táo bón, tiểu ngắn đỏ, rêu trắng nê hoặc vàng mỏng. Tà độc xâm nhập gây khí huyết cục bộ ngưng kết sưng nóng đỏ đau, ảnh hưởng toàn thân dinh vệ bất hợp nên ố hàn sốt.

ĐIỂM PHÂN BIỆT CHỦ YẾU (gián biệt yếu điểm) — 14 bệnh trên đều ố hàn sốt nhưng mỗi bệnh có đặc điểm riêng: Thái dương thương hàn (mạch phù khẩn, không mồ hôi mà suyễn, mùa đông) khác thái dương trúng phong (mạch phù hoãn, tự hạn, đông xuân) khác phong ôn biểu (sốt cao ố hàn nhẹ, khát, mạch phù sác, xuân) khác thương thử (đau mình nặng, tự hạn, kèm chính xung, mạch huyền tế khâu trì, hè). Thử kiêm hàn thấp (thân co quắp không mồ hôi giống thương hàn nhưng phát hè, không có thân nhiệt bất dương khác thương thử, đau ngực không đói khác thấp ôn, không họng khô mũi táo khác lương táo). Thấp ôn thấp át vệ khí (thân nhiệt bất dương tăng chiều, mạch nhu hoãn) khác các chứng trên. Thu táo chia ôn táo (thiên nhiệt, đàm dính) và lương táo (thiên hàn, đàm loãng chảy mũi) — đều có mũi họng khô táo khát (trừ lương táo thiên hàn), mùa thu. Phục thử (khởi cấp, khát tiểu đỏ mạch nhu sác, khác thương hàn; có khát mũi khô khác thái dương thương hàn; đầy bụng rêu nê khác thu táo; mùa đông khác phong ôn/thương thử). Đông ôn (đau đầu không mồ hôi khác trúng phong; khát mũi khô khác thương hàn; không tâm phiền tiểu đỏ khác phục thử; mùa đông khác phong ôn/thu táo). Phong thủy (phù nhanh sau sốt, tiểu không thông, mùa đông, khác hẳn các chứng trên). Phế ung (ho nhiều + đau ngực tăng khi ho — đặc điểm riêng biệt). Viêm họng cấp (hầu họng sưng đau/ổ loét nhỏ, hay tái phát trẻ em). Trường ung (đau bụng cự án).`,
      keyPoints: "Phân biệt rõ: Triệu chứng (cảm giác chủ quan) ≠ Chứng hầu (kết luận tổng hợp = hội chứng) ≠ Bệnh cơ (cơ chế nối kết, hạt nhân của chứng hầu)\nỐ hàn phát nhiệt gặp trong 14 bệnh khác nhau — chìa khóa phân biệt: mùa phát bệnh, mạch tượng, mức độ ố hàn/sốt tương đối, và kiêm chứng đặc trưng\n'Còn một phân ố hàn thì còn một phân biểu chứng' — nguyên tắc cốt lõi để đánh giá mức độ bệnh còn ở biểu hay đã vào lý",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tráng Nhiệt (Sốt Cao, 10 bệnh phân biệt)",
      category: cat,
      summary: "Tráng nhiệt (sốt cao >39°C, ố nhiệt, phiền khát) do bệnh tà từ biểu nhập lý, tà chính giao tranh kịch liệt — gặp ở giai đoạn giữa/sau của nhiều bệnh ngoại cảm khác nhau ('dị bệnh đồng trị'); phân biệt chủ yếu ở 'chứng' chứ không phải 'bệnh'.",
      content: `TRÁNG NHIỆT (SỐT CAO): sốt rất cao kèm ố nhiệt, phiền khát, nhiệt độ trên 39°C. Do bệnh tà từ biểu nhập lý, tà chính giao tranh, nhiệt tà kháng thịnh — đa số gặp ở ngoại cảm bệnh giai đoạn giữa và sau. Nhiều loại ôn bệnh (phong ôn, xuân ôn, thử ôn, thấp ôn, phục thử...) khi tà nhập lý ở giai đoạn khí phần/dinh phần/huyết phần đều có sốt cao với trị pháp đại để giống nhau — đây là "Dị bệnh đồng trị" (bệnh khác nhau trị giống nhau theo biểu hiện). Khi phân biệt cần truy cứu tình trạng phát bệnh và bệnh sử để biết do bệnh gì phát triển thành — trọng điểm là phân biệt CHỨNG, biện bệnh chỉ thứ yếu.

10 bệnh thường gặp có tráng nhiệt:

1. **Thương hàn dương minh chứng hoặc ôn bệnh khí phần nhiệt thịnh chứng**: sốt cao kiêm mồ hôi nhiều, mặt đỏ, khát thích uống lạnh, rêu vàng khô, mạch hồng đại hoặc hoạt sác. Tà nhiệt kháng thịnh, chính khí chưa suy, chính tà đấu kịch liệt. Gặp khi thái dương thương hàn/trúng phong hóa nhiệt nhập lý, hoặc phong ôn/xuân ôn/thử ôn/thấp ôn/thu táo/phục thử/dịch độc nhập khí phần.

2. **Ôn tà nghịch truyền tâm bào chứng**: sốt cao kiêm thần hôn chiêm ngữ hoặc hôn mê không nói, lưỡi cứng, chi lạnh (quyết). Ôn nhiệt tà phạm phế nghịch truyền tâm bào, tà nhiệt nội hãm mông bịt tâm khiếu. Đa số gặp trong phong ôn bệnh.

3. **Phong ôn bệnh tà phát tại khí phần chứng**: sốt cao kèm miệng đắng mà khát, tâm phiền tiểu ngắn đỏ, lưỡi đỏ rêu vàng, mạch huyền sác, phát mùa xuân. Chính khí bất túc lại cảm phong nhiệt chi tà, lý nhiệt tích thịnh.

4. **Ôn bệnh khí dinh lưỡng phiên** (đốt thiêu cả khí và dinh): sốt cao tăng về đêm kèm miệng khát đau đầu, phát ban hoặc thổ huyết/tiện huyết, lưỡi đỏ thẫm, rêu vàng, mạch sác. Lý nhiệt tích thịnh nhiễu động dinh huyết, huyết nhiệt vọng hành. Thường gặp trong thử ôn, xuân ôn, thấp ôn.

5. **Xuân ôn bệnh nhiệt thịnh động phong chứng**: sốt cao kèm chóng mặt, đau căng trướng đầu, tay chân bứt rứt, nặng thì co giật thần hôn, miệng khô môi nứt, lưỡi đỏ rêu vàng khô, mạch huyền sác, phát mùa xuân. Lý nhiệt kháng thịnh thượng nhiễu thần minh, hao thương tân dịch, cân mạch thất dưỡng.

6. **Thử ôn nhiệt bệnh, nhiệt thậm phát kinh chứng**: sốt cao kèm tức ngực, lưng gáy cứng đơ, tứ chi co giật, nặng thì giác cung phản trương (thân mình gồng cong), răng cắn chặt, thần hôn bất tỉnh, hoặc bụng trướng tiêu táo bón, lưỡi đỏ rêu vàng khô, mạch huyền sác, phát mùa hạ. Thử nhiệt tích thịnh dẫn động can phong.

7. **Xuân ôn thấp nhiệt khốn trở trung tiêu chứng**: sốt cao kèm phiền khát, mồ hôi nhiều, tức ngực khí đoản, bụng tức đầy bĩ, thân thể nặng nề, tiểu ít, rêu vàng nê, mạch hoạt sác, phát mùa hạ. Thử nhiệt chi tà kẹp thấp khốn tỳ.

8. **Phong ôn bệnh, phế nhiệt phát chẩn**: sốt cao kèm ho, tức ngực, da nhiều điểm xuất huyết (hồng chẩn), phát mùa xuân. Phế kinh khí phần thịnh ảnh hưởng dinh lạc.

9. **Tà nhiệt úng phế chứng**: sốt cao kèm tức ngực đau ngực, hạn xuất, ho suyễn, đàm dính khó khạc, lưỡi đỏ rêu vàng, mạch sác. Phát đông do ngoại cảm phong hàn hóa nhiệt; phát xuân do ngoại cảm ôn nhiệt — nhiệt tà nhập lý úng tụ phế, phế khí thất tuyên.

10. **Phế ung đã mưng mủ**: sốt cao hàn chiến (lạnh run) kèm tức ngực đau ngực, ho khí cấp, ho khạc đàm mủ hôi tanh, rêu vàng, mạch hoạt sác. Phong tà tập phế hóa nhiệt nội chưng, phế thất túc giáng, nhiệt úng huyết ứ thành mủ.

11. **Chứng thấp nhiệt hạ lỵ**: sốt cao kèm tiêu ra mủ máu nhầy, lý cấp hậu trọng, hậu môn nóng rát, đau bụng, rêu vàng nê, mạch nhu hoạt hoặc hoạt sác, đa số phát mùa hạ. Thấp nhiệt uẩn kết đại trường, khí huyết ứ trệ, đại trường thất chức.

ĐIỂM PHÂN BIỆT CHỦ YẾU: Thương hàn dương minh và khí phần nhiệt thịnh (mồ hôi nhiều, thích uống lạnh, mạch hồng đại rêu vàng — giống nhau). Nghịch truyền tâm bào (đa số trong phong ôn, phát cấp truyền nhanh, nhanh chóng thần hôn chiêm ngữ lưỡi rụt tay chân lạnh — khác hẳn). Xuân ôn phát khí phần (khởi bệnh sốt ngay không ố hàn — khác dương minh/nghịch truyền tâm bào đều có ố hàn sơ khởi). Khí dinh lưỡng phiên (sốt cao về đêm, xuất huyết dưới da/thổ nục huyết, lưỡi đỏ thẫm — khác 3 chứng trên). Xuân ôn động phong (co giật + tay chân bứt rứt, không phát ban — khác khí dinh lưỡng phiên có phát ban; so nghịch truyền tâm bào thì phát bệnh chậm hơn). Thử ôn nhiệt thậm phát kinh (lưng gáy cứng/giác cung phản trương, phát hè — khác xuân ôn động phong phát hòa hoãn hơn và phát xuân). Thấp ôn thấp nhiệt bế trở trung tiêu (phát cuối hạ mưa nhiều, đầy bụng thân nặng — khác dương minh khí phần nhiệt thịnh). Phong ôn phế nhiệt phát chẩn (phát xuân, ban chẩn lờ mờ — khác khí dinh lưỡng phiên là sốt cao đêm + ban rõ + máu cam). Tà nhiệt úng phế (đau ngực đàm dính không máu mủ tanh hôi — khác phế ung có đàm mủ tanh hôi là đặc điểm chủ yếu). Thấp nhiệt hạ lỵ (phát hạ, lý cấp hậu trọng, tiêu máu mủ — đặc trưng riêng).`,
      keyPoints: "Tráng nhiệt (sốt >39°C) là 'dị bệnh đồng trị' — nhiều bệnh ngoại cảm khác nhau cùng biểu hiện sốt cao ở giai đoạn tà nhập lý, trọng điểm phân biệt là CHỨNG chứ không phải BỆNH\nChìa khóa phân biệt: có ố hàn sơ khởi hay không, có phát ban/xuất huyết hay không, có co giật động phong hay không, mùa phát bệnh, và đặc điểm đàm (có mủ tanh hôi = phế ung)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Ố Hàn Phát Nhiệt (14 bệnh) và Tráng Nhiệt (11 bệnh).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Thêm "Biện chứng Bát Cương" (ThS Võ Thanh Phong, 45 slide) vào Lý luận cơ bản.
// Trích nguyên văn các bảng so sánh chứng trạng, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Biện chứng Bát Cương",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Trung Y chẩn đoán học (HV Trung Y Quảng Châu, Nguyễn Thanh Giản dịch), Trần Quốc Bảo (Y lý YHCT), Giovanni Maciocia (2015)",
      locator: "45 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Biện chứng Bát Cương",
      category: "Tứ chẩn - Bát cương",
      summary:
        "Bát cương (綱 = giềng lưới, phần chủ yếu, phép tắc) là lý luận cơ sở của biện chứng chữa bệnh: căn cứ vào toàn bộ chứng trạng chia thành 4 đôi đối lập — Biểu/Lý, Hàn/Nhiệt, Hư/Thực, Âm/Dương (Âm Dương là tổng cương: Hàn+Hư thuộc Âm, Nhiệt+Thực thuộc Dương). Nội Kinh đã bàn tới Bát cương; Trương Trọng Cảnh vận dụng vào Thương hàn tạp bệnh luận; Cảnh Nhạc toàn thư và Trình Chung Linh (Y học tâm ngộ) phát huy và hoàn thiện.",
      content:
        "Ý nghĩa Bát cương: Dương/Âm — xác định mối quan hệ giữa tác nhân gây bệnh và chính khí; Biểu/Lý — xác định vị trí bệnh (nông-sâu); Thực/Hư — xác định trạng thái chính khí; Nhiệt/Hàn — xác định tính chất bệnh; Dương/Âm — đánh giá xu thế chung của bệnh. Bát cương KHÔNG chia chứng trạng thành 8 khu biệt lập mà liên hệ chặt chẽ: Biểu-Lý liên hệ với Hàn-Nhiệt, Hư-Thực (vd Biểu hàn, Biểu nhiệt, Lý hư, Biểu hàn Lý nhiệt). " +
        "\n\n— ÂM DƯƠNG — Tổng cương, khái quát mạch/chứng/biểu/lý/thượng/hạ/hàn/nhiệt/hư/thực/khí/huyết/động/tĩnh. Khi bệnh nghiêm trọng thường mệnh danh trực tiếp bằng âm dương (âm hư, dương hư, vong âm, vong dương). Tố Vấn: 'Âm thắng thì dương bệnh, dương thắng thì âm bệnh'; 'Dương hư thì ngoại hàn, âm hư thì nội nhiệt'. Thương hàn luận: 'phát nóng sợ rét là bệnh phát ở dương, không nóng sợ rét là bệnh phát ở âm'. " +
        "Âm chứng (bên trong, hàn, tĩnh) vs Dương chứng (bên ngoài, động, nhiệt) theo Tứ chẩn: Vọng — Âm: sắc mặt trắng xanh/ảm đạm, nặng nề rũ mỏi, nằm co, lưỡi nhợt phì mập rêu nhuận | Dương: mặt đỏ, mình nóng thích mát, cuồng táo, môi khô nẻ, lưỡi đỏ thẫm rêu vàng/đen nổi gai. Văn — Âm: tiếng nói thấp nhỏ, ít nói, hơi thở yếu | Dương: tiếng to mạnh, hay nói, hơi thở thô, nói cuồng. Vấn — Âm: phân tanh, ăn kém, miệng nhạt không khát, tiểu trong dài | Dương: phân rắn/bí/thối, miệng khô phiền khát, tiểu vàng ít. Thiết — Âm: bụng đau ưa nắn, tay chân lạnh, mạch trầm trì vi tế nhược | Dương: bụng đau cự án, mình nóng chân ấm, mạch phù hồng sác thực. " +
        "Chân âm bất túc (= Thận âm bất túc) vs Chân dương bất túc (= Thận dương bất túc, Thận chủ tiên thiên): Chân âm bất túc — gò má/môi đỏ, miệng khô, lưỡi khô không rêu; họng khô, tâm phiền, huyễn vựng, lưng gối mềm yếu, triều nhiệt, đạo hãn, di tinh, bí kết; lòng bàn tay chân nóng, mạch sác vô lực. Chân dương bất túc — sắc mặt trắng nhợt, môi lưỡi nhợt, ho suyễn, phù thũng; tự hãn, huyễn vựng, không muốn ăn, tiêu chảy/ngũ canh tả, dương nuy, hai chân mềm yếu; da lạnh, mạch đại vô lực. " +
        "Vong âm, Vong dương: xuất hiện sau sốt ra mồ hôi nhiều, phát hãn thái quá, thổ/tả quá độ, mất huyết quá nhiều (Y học tâm ngộ: 'mạch thốn nhược không thể phát hãn, phát hãn thì vong dương; mạch xích nhược không thể phát hãn, phát hãn thì vong âm' — do âm dương hỗ căn, âm kiệt làm dương khí mất theo). Vong âm — mồ hôi nóng vị mặn không dính, chi ấm đều, lưỡi đỏ khô, mạch hồng thực ấn vô lực, da nóng thở thô khát thích uống mát. Vong dương — mồ hôi lạnh vị nhạt hơi dính, chi quyết lạnh, lưỡi trắng nhuận, mạch phù sác rỗng hoặc vi tế muốn tuyệt, da lạnh thở nhỏ không khát thích uống nóng. " +
        "\n\n— BIỂU LÝ — Phân biệt vị trí trong-ngoài, nông-sâu. Biểu: da lông, kinh lạc. Lý: tạng phủ. Quan trọng trong chẩn đoán/điều trị thương hàn, ôn bệnh. Biểu chứng: sợ lạnh phát sốt đau đầu nghẹt mũi mình đau, mạch phù, rêu mỏng trắng. Lý chứng: sốt cao tinh thần u ám bứt rứt khát nước ngực bụng đau tiện bí/lỏng tiểu vàng ít, mạch trầm, rêu vàng/xám đen. " +
        "Hàn-nhiệt-hư-thực của Biểu: Biểu Hàn — sốt sợ lạnh có/không mồ hôi, mạch phù/phù khẩn, rêu trắng mỏng nhuận. Biểu Nhiệt — sợ gió mình nóng, mạch phù sác, rìa/chót lưỡi đỏ. Biểu Hư — tự hãn sợ gió ra mồ hôi dầm dấp, mạch phù hoãn vô lực, lưỡi nhợt. Biểu Thực — không mồ hôi, mạch phù hữu lực, rêu trắng. " +
        "Hàn-nhiệt-hư-thực của Lý: Lý Hàn — sợ lạnh không khát nôn mửa đau bụng tiêu lỏng chân tay lạnh, mạch trầm trì, lưỡi nhợt rêu trắng. Lý Nhiệt — sốt khát mắt môi đỏ phiền táo, mạch trầm sác, lưỡi đỏ rêu vàng. Lý Hư — đoản khí lười nói chân tay lạnh tiêu lỏng huyễn vựng tâm quý mệt mỏi, mạch trầm nhược, lưỡi bệu rêu trắng mỏng. Lý Thực — thở thô nói nhảm bí kết tâm phiền phát cuồng bụng đầy trướng, mạch trầm thực, rêu vàng khô. " +
        "Biểu lý thác tạp (lẫn lộn — biểu tới lý hoặc lý tới biểu, bệnh gốc chưa khỏi kèm bệnh mới): Biểu lý đều nhiệt (bệnh ôn nhiệt, mắt đỏ đầu đau sợ nóng khát họng khô nói nhảm); Biểu lý đều hàn (ngoại cảm hàn trên nền nội hàn, đau bụng thổ tả tay chân lạnh sợ lạnh không mồ hôi); Biểu nhiệt lý hàn (Tỳ Vị hư hàn cảm phong nhiệt, sốt không mồ hôi tiêu lỏng tiểu trong dài rêu vàng bẩn nhớt); Biểu hàn lý nhiệt (sợ lạnh phát sốt không mồ hôi suyễn thở phiền táo khát mạch phù khẩn); Biểu lý đều thực (sợ lạnh phát sốt không mồ hôi bụng trướng đau cự án đại tiểu tiện không thông); Biểu lý đều hư (tự hãn sợ gió huyễn vựng tâm quý khí đoản tiêu lỏng mạch nhược); Biểu hư lý thực (tự hãn sợ gió bụng đầy đau cự án rêu dày bẩn bí kết); Biểu thực lý hư (sợ lạnh không mồ hôi đau đầu bụng đau nôn mửa tiêu lỏng). " +
        "\n\n— HÀN NHIỆT — Phân biệt tính chất bệnh: đơn thuần (hàn hoặc nhiệt), hàn nhiệt thác tạp, hoặc chân giả (chân hàn giả nhiệt / chân nhiệt giả hàn). Hàn chứng: thích nằm co lặng lẽ sắc mặt trắng xanh môi nhợt/tím lưỡi nhợt bệu đàm trắng trong, ít nói, không khát thích ăn uống nóng tiểu trong dài tiêu lỏng, mạch trầm trì vô lực tay chân lạnh. Nhiệt chứng: thích duỗi chân nằm ngửa bứt rứt vật vã mắt đỏ môi khô/đỏ rêu vàng bẩn đàm vàng, hay nói, khát thích uống nguội tiểu vàng ít bí kết, mạch phù hồng sác hữu lực tay chân nóng. " +
        "Hàn nhiệt đồng thời: cần phân rõ biểu lý/trên dưới/kinh lạc tạng phủ/trước sau/chủ thứ mới điều trị được — gồm Hàn nhiệt thác tạp (Thượng nhiệt hạ hàn, Thượng hàn hạ nhiệt, Biểu hàn lý nhiệt, Biểu nhiệt lý hàn) và Hàn nhiệt chuyển hóa (Hàn chứng hóa Nhiệt, Nhiệt chứng hóa Hàn). " +
        "Hàn nhiệt chân giả (khi bệnh nặng, hàn cực sinh nhiệt hoặc nhiệt cực sinh hàn — triệu chứng tương phản đồng xuất hiện): Chân hàn giả nhiệt — người nóng mặt đỏ khát mạch đại (giả nhiệt) NHƯNG thích mặc/uống ấm (không uống nhiều), mạch đại vô lực, tứ chi lạnh, tiêu lỏng phân sống, tiểu trong dài, lưỡi nhợt rêu trắng (chân hàn) — cơ chế: âm thịnh cách trở dương ra ngoài. Chân nhiệt giả hàn — chân tay lạnh mạch trầm (giả hàn) NHƯNG không sợ lạnh mà sợ nóng, mạch trầm sác có lực, khát thích uống lạnh, họng khô, tiểu vàng ít, tiện táo lẫn nhầy máu, lưỡi đỏ rêu vàng (chân nhiệt) — cơ chế: nội nhiệt thịnh, dương khí uất bế. " +
        "\n\n— HƯ THỰC — Phân biệt (1) chính khí mạnh/yếu, (2) bệnh tà thịnh/suy. Hư = chính khí hư; Thực = tà khí hữu dư. Là căn cứ trọng yếu để xác định pháp trị bổ hay công, phù chính hay khu tà. Hư chứng: chính khí suy nhược, phản ứng cơ thể với tác nhân gây bệnh giảm sút. Thực chứng: do cảm ngoại tà hoặc khí trệ/huyết ứ/đàm tích/ứ nước/giun sán, thường là bệnh lý cấp tính. " +
        "So sánh Hư chứng theo tạng: Huyết hư — người gầy huyễn vựng tâm quý thất miên mạch tế ít rêu (điểm giống), RIÊNG: sắc mặt vàng úa/trắng nhợt, tê tay chân, móng khô giòn, mạch tế nhược. Âm hư — ngũ tâm phiền nhiệt, miệng họng khô, đạo hãn, lưỡi đỏ, mạch tế sác vô lực. Khí hư — mặt không nhuận mệt mỏi tự hãn (giống), RIÊNG: hụt hơi ngại nói bụng trướng tiểu són sa nội tạng. Dương hư — sợ lạnh chi lạnh tiểu trong tiện lỏng nát lưỡi bệu mạch trì. " +
        "So sánh Thực nhiệt vs Hư nhiệt: cảm giác nóng (cả ngày / chiều); khát (nặng cả ngày thích lạnh / chiều-đêm uống từng ngụm nhỏ); khô miệng (cả ngày / đêm); đắng miệng (có / không); sắc mặt (đỏ cả mặt / đỏ 2 gò má); tinh thần (bứt rứt nhiều / bứt rứt về đêm); mồ hôi (đại hãn / đạo hãn); bụng (bĩ mãn táo thực, tiêu xong giảm đau / đau âm ỉ liên tục, tiêu xong không giảm); lưỡi (đỏ rêu vàng khô / đỏ ít rêu); mạch (trầm sác hữu lực / phù sác vô lực). " +
        "So sánh Thực hàn vs Hư hàn (Maciocia 2015): khởi phát (cấp / mạn); đau (cường độ cao co thắt / âm ỉ); lưỡi (rêu trắng dày / nhợt rêu trắng dày); mạch (khẩn trì hữu lực / trầm trì nhược). " +
        "Hư thực đồng thời (hiệp tạp): cần phân biểu lý/trên dưới/kinh lạc tạng phủ/trước sau/chủ thứ — Thực chứng hiệp Hư (vd ngoại cảm ôn nhiệt thương âm), Hư chứng hiệp Thực (vd Tỳ hư thêm thương thực), Hư thực cùng nặng; và Hư thực chuyển hóa. " +
        "Hư thực chân giả: cần rút ra đâu là chân tượng, đâu là giả tượng để thấy bản chất bệnh (Cảnh Nhạc toàn thư, thiên 'Hư thực': tà khí ngoại cảm chưa trừ mà ẩn náu lưu lại kinh lạc, thức ăn đình trệ không tiêu mà tích lại... có thể giả hiện hư tượng). Biện hư thực chân giả cần xem: mạch hữu lực/vô lực, hữu thần/vô thần; chất lưỡi non bệu hay xanh đậm; thanh âm cao hay thấp yếu; thể chất người bệnh yếu/khỏe, nguyên nhân phát bệnh, bệnh lâu/mới, quá trình điều trị.",
      keyPoints:
        "Vận dụng trong chẩn đoán: Tứ chẩn (thu thập chứng trạng) → Bát cương (quy nạp, phân tích tư liệu tứ chẩn thu được) → phân loại chứng hậu — ba bước này không nhất thiết theo trình tự cứng, mà lồng vào nhau trong quá trình biện chứng để đi đến kết luận bệnh tật. " +
        "Ca minh họa (Vương Hải Tàng chữa bệnh Hầu phủ): mạch trầm tế, trong lạnh ngoài nóng, ban mọc ở vai lưng ngực sườn, nói năng cuồng loạn — người khác cho là phát ban nói nhảm thuộc Nhiệt, nhưng Vương cho rằng đây là Dương bị uất đi lên nhập Phế truyền ra bì mao nên ban mọc ra (không phải thực nhiệt đơn thuần) — minh họa tầm quan trọng của biện chứng sâu, không chỉ nhìn chứng trạng bề ngoài.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm Biện chứng Bát Cương.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

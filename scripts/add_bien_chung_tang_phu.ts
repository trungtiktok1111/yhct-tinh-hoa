// Thêm "Biện chứng Tạng Phủ" (ThS Võ Thanh Phong, 53 slide) — đây là các CHỨNG HẬU
// (pattern) biện chứng theo tạng phủ nên đưa vào model Pattern (phù hợp hơn
// TheoryTopic). Mỗi Pattern: keySigns = triệu chứng chính, description = cơ chế
// bệnh lý giải thích từng triệu chứng. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createPattern(
  sourceId: string,
  name: string,
  keySigns: string,
  description: string
) {
  const existing = await prisma.pattern.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    console.log(`Bỏ qua (đã tồn tại): ${name}`);
    return;
  }
  await prisma.pattern.create({
    data: { name, keySigns, description, status: "DRAFT", sourceId },
  });
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Biện chứng Tạng Phủ",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong",
      locator: "53 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  // --- Tâm, Tiểu trường ---
  await createPattern(
    sid,
    "Tâm khí hư",
    "Tâm quý, chính xung; tức ngực, khí đoản (tăng khi vận động); sắc mặt nhợt, lưỡi nhợt; tự hãn; mạch hư",
    "Tâm khí hư không làm chủ Tâm luật → Tâm quý, chính xung. Tâm khí hư → Hung khí bất túc, vận động làm hao khí → tức ngực, khí đoản tăng khi vận động. Tâm khí hư, huyết dịch không vận hành lên đầu mặt → sắc mặt nhợt, lưỡi nhợt. Khí hư vệ ngoại bất cố → tự hãn. Tâm khí hư không thúc đẩy huyết vận hành → mạch hư."
  );
  await createPattern(
    sid,
    "Tâm dương hư",
    "Sợ lạnh, tay chân lạnh; Tâm thống; lưỡi nhợt bệu, rêu trắng; mạch vi tế",
    "Khí hư cập dương: Tâm khí hư → Tâm dương hư (Tâm khí hư + hàn chứng). Dương hư mất khả năng ôn chiếu → sợ lạnh, tay chân lạnh. Dương hư → hàn ngưng huyết ứ → Tâm mạch tý trở → Tâm thống. Dương hư hàn thịnh → lưỡi nhợt bệu, rêu trắng. Dương hư, mạch đạo thất sung → mạch vi tế."
  );
  await createPattern(
    sid,
    "Tâm huyết hư",
    "Tâm quý, chính xung; hay quên, mất ngủ, mơ nhiều; chóng mặt; sắc mặt nhợt, môi lưỡi nhợt; mạch tế nhược",
    "Tâm huyết hư → Tâm không chủ được huyết mạch → Tâm luật rối loạn → Tâm quý, chính xung. Tâm huyết hư → Tâm thần thất dưỡng → hay quên, mất ngủ, mơ nhiều. Tâm huyết hư → Não thất dưỡng, thanh khiếu thất dưỡng → chóng mặt. Huyết hư không thăng lên vùng đầu mặt → sắc mặt nhợt, môi lưỡi nhợt. Huyết hư không sung doanh mạch đạo → mạch tế nhược."
  );
  await createPattern(
    sid,
    "Tâm âm hư",
    "Triều nhiệt, ngũ tâm phiền nhiệt; đạo hãn; gò má đỏ, lưỡi đỏ, rêu ít; mạch tế sác",
    "Tâm huyết hư (huyết thuộc âm) → âm hư sinh nội nhiệt → triều nhiệt, ngũ tâm phiền nhiệt. Lúc ngủ thì dương nhập âm → đạo hãn. Hư nhiệt thượng thăng → gò má đỏ, lưỡi đỏ, rêu ít. Âm hư nội nhiệt → mạch tế sác."
  );
  await createPattern(
    sid,
    "Tâm hỏa kháng thịnh",
    "Ngực phiền, nóng, bứt rứt; mất ngủ, cuồng thao, nói sảng; mặt đỏ, miệng khát, tiểu vàng, táo bón, mạch sác; đầu lưỡi đỏ, da có nhọt lở sưng nóng đỏ đau; thổ huyết, nục huyết",
    "Tâm trong lồng ngực → ngực phiền, nóng, bứt rứt. Nhiệt nhiễu thần → mất ngủ, cuồng thao, nói sảng. Lý nhiệt thịnh, nhiệt thương tân → mặt đỏ, miệng khát, tiểu vàng, táo bón, mạch sác. Tâm khai khiếu ra lưỡi, nhiệt tính viêm và hóa hủ huyết → đầu lưỡi đỏ, da có nhọt lở sưng nóng đỏ đau. Nhiệt bức huyết vọng hành → thổ huyết, nục huyết."
  );
  await createPattern(
    sid,
    "Tâm mạch tý trở",
    "Đau ngực, lan vai, cánh tay; Tâm quý, chính xung. 4 thể: ứ huyết nội trở (đau như kim châm, lưỡi tím tối, ứ ban, mạch tế sáp); ứ trọc đình tụ (đau tức nhiều, mập, đàm nhiều, thân nặng, rêu trắng nê, mạch trầm hoạt); âm hàn ngưng trệ (đột phát đau dữ dội gặp ấm giảm, úy hàn chi lãnh, lưỡi nhạt, rêu trắng, mạch trầm trì/trầm khẩn); khí cơ uất trệ (trướng thống, liên quan tình chí, lưỡi đỏ nhạt, rêu mỏng trắng, mạch huyền)",
    "Tâm mạch không thông nên đau theo phân bố kinh Tâm (lan vai, cánh tay); Tâm khí bất túc → Tâm mạch tý trở → Tâm quý, chính xung. 4 nguyên nhân/thể lâm sàng khác nhau: ứ huyết nội trở, ứ trọc đình tụ, âm hàn ngưng trệ, khí cơ uất trệ — mỗi thể có đặc điểm đau và lưỡi/mạch riêng."
  );
  await createPattern(
    sid,
    "Đàm mê tâm khiếu",
    "Ý thức mơ hồ, nặng thì hôn mê; tinh thần uất ức hoặc thờ ơ; sắc mặt tối, rêu trắng nê, mạch hoạt; ngây ngô, nói 1 mình, động tác bất thường; đột ngột té ngã bất tỉnh, họng khò khè, sùi bọt mép",
    "Đàm bế tắc thần khiếu → ý thức mơ hồ, nặng thì hôn mê. Đàm nhiễu thần → tinh thần uất ức, hoặc thờ ơ. Đàm trọc nội thịnh, cản trở vận hành khí huyết → sắc mặt tối, rêu trắng nê, mạch hoạt. Thần minh bị đàm che lấp → ngây ngô, nói 1 mình, động tác bất thường. Đàm che lấp thần khiếu → đột ngột té ngã bất tỉnh, họng khò khè, sùi bọt mép."
  );
  await createPattern(
    sid,
    "Đàm hỏa nhiễu tâm (ngoại cảm nhiệt tà)",
    "Sốt cao; mặt mắt đỏ, hơi thở thô; đàm vàng, khò khè; phát cuồng, nói nhảm; lưỡi đỏ, rêu vàng nhớt, mạch hoạt sác",
    "Thực nhiệt chưng đốt → sốt cao. Nhiệt thượng viêm → mặt mắt đỏ, hơi thở thô. Nhiệt hun đốt tân dịch thành đàm → đàm vàng, khò khè. Đàm nhiệt cấu kết nhiễu loạn thần minh → phát cuồng, nói nhảm. Đàm hỏa nội thịnh → lưỡi đỏ, rêu vàng nhớt, mạch hoạt sác."
  );
  await createPattern(
    sid,
    "Đàm hỏa nhiễu tâm (nội thương phát nhiệt)",
    "Mất ngủ, tâm phiền; tức ngực, đàm nhiều; hoa mắt, chóng mặt; phát cuồng, đánh người, lúc khóc lúc cười; ý thức mơ hồ, không biết thân sơ",
    "Đàm hỏa nhiễu tâm thần → mất ngủ, tâm phiền. Đàm tắc trở hung khí → tức ngực, đàm nhiều. Đàm che lấp thanh khiếu → hoa mắt, chóng mặt. Hỏa thuộc dương, dương chủ động → phát cuồng, đánh người, lúc khóc lúc cười. Đàm hỏa nhiễu tâm thần → ý thức mơ hồ, không biết thân sơ."
  );

  // --- Phế, Đại trường ---
  await createPattern(
    sid,
    "Phế khí hư",
    "Ho suyễn vô lực, khí thiểu; đàm trong loãng; tiếng nói nhỏ; sắc mặt nhợt, lười vận động, mạch hư, lưỡi nhợt, rêu trắng; dễ cảm mạo",
    "Phế chủ hô hấp, chủ khí → khí hư gây ho suyễn vô lực, khí thiểu. Phế khí không phân bố thủy dịch, tụ lại thành đàm → đàm trong loãng. Phế chủ khí, chủ thanh → tiếng nói nhỏ. Khí hư → sắc mặt nhợt, lười vận động, mạch hư, lưỡi nhợt, rêu trắng. Vệ ngoại bất cố → dễ cảm mạo."
  );
  await createPattern(
    sid,
    "Phế âm hư",
    "Ho; đàm ít, dính; họng khô, khan tiếng, người gầy; triều nhiệt, đạo hãn, gò má đỏ, lưỡi đỏ, rêu ít, mạch tế sác; đàm lẫn máu",
    "Nhiệt chưng đốt, Phế khí thượng nghịch → ho. Nhiệt chưng đốt tân dịch thành đàm → đàm ít, dính. Phế tân không tư nhuận họng, toàn thân → họng khô, khan tiếng, người gầy. Âm hư nội nhiệt → triều nhiệt, đạo hãn, gò má đỏ, lưỡi đỏ, rêu ít, mạch tế sác. Phế lạc bị nhiệt làm tổn thương → đàm lẫn máu."
  );
  await createPattern(
    sid,
    "Phong hàn thúc phế",
    "Ho; đàm loãng, trong; nghẹt mũi, chảy mũi trong; ố hàn, phát sốt, không ra mồ hôi; rêu trắng mỏng, mạch phù khẩn",
    "Phong hàn bó buộc, Phế không tuyên phát → ho. Hàn ngưng trệ tân dịch thành đàm → đàm loãng, trong. Phế khai khiếu ra mũi, Phế khí bất tuyên do hàn tà bó buộc → nghẹt mũi, chảy mũi trong. Hàn tà uất phế vệ → ố hàn, phát sốt, không ra mồ hôi. Tà chưa truyền nội nên lưỡi rêu không biến đổi, mạch chủ phong hàn → rêu trắng mỏng, mạch phù khẩn."
  );
  await createPattern(
    sid,
    "Đàm thấp trở phế",
    "Ho, đàm nhiều, dễ khạc; tức ngực, khò khè; lưỡi nhợt, rêu trắng nhớt, mạch hoạt",
    "Đàm thấp trở phế, Phế khí thượng nghịch → ho, đàm nhiều, dễ khạc. Đàm tắc khí đạo → tức ngực, khò khè. Đàm thấp nội trở → lưỡi nhợt, rêu trắng nhớt, mạch hoạt."
  );
  await createPattern(
    sid,
    "Phong nhiệt phạm phế",
    "Ho; đàm vàng, đặc, miệng khô, họng đau; nghẹt mũi, chảy mũi vàng đặc; sợ gió, phát sốt; đầu lưỡi đỏ, rêu vàng mỏng, mạch phù sác",
    "Phong nhiệt phạm Phế, Phế mất thanh túc → ho. Nhiệt hun đốt tân dịch thành đàm → đàm vàng, đặc, miệng khô, họng đau. Phế khai khiếu ra mũi, tân dịch bị hun đốt thành vàng đặc → nghẹt mũi, chảy mũi vàng đặc. Ngoại cảm biểu chứng → sợ gió, phát sốt. → đầu lưỡi đỏ, rêu vàng mỏng, mạch phù sác."
  );
  await createPattern(
    sid,
    "Nhiệt tà úng phế",
    "Ho, đàm vàng đặc; suyễn thở, hơi thở thô; da nóng, miệng khát muốn uống; tâm phiền bất an; cánh mũi phập phồng; chảy máu mũi, ho ra máu; đau ngực, ho đàm mủ tanh hôi; táo bón; tiểu vàng; lưỡi đỏ, rêu vàng, mạch hoạt sác",
    "Nhiệt tà tịnh làm Phế khí nghịch, hun đốt tân dịch thành đàm → ho, đàm vàng đặc. Nhiệt làm Phế mất thanh túc, thúc đẩy khí vọng hành → suyễn thở, hơi thở thô. Nhiệt làm tổn thương tân dịch → da nóng, miệng khát muốn uống. Nhiệt nhiễu thần → tâm phiền bất an. Đàm nhiệt giao trở, úng trệ Phế khí, khí đạo không thông, Phế khí uất bế → cánh mũi phập phồng. Nhiệt thương Phế lạc → chảy máu mũi, ho ra máu. Đàm nhiệt trở Phế, khí huyết úng trệ, huyết hóa hủ → đau ngực, ho đàm mủ tanh hôi. Phế và Đại trường quan hệ biểu lý, Phế nhiệt làm Đại trường tân khuy → táo bón. Nhiệt thương tân dịch → tiểu vàng. Do lý nhiệt hoặc đàm nhiệt → lưỡi đỏ, rêu vàng, mạch hoạt sác."
  );
  await createPattern(
    sid,
    "Đại trường thấp nhiệt",
    "Đại tiện lỏng vàng, có nhầy mủ, máu; đau bụng; lý cấp hậu trọng; miệng khát, tiểu vàng; lưỡi đỏ, rêu vàng, mạch hoạt sác/nhu sác",
    "Thấp nhiệt hun đốt trường đạo, lạc mạch tổn thương, huyết hóa hủ → đại tiện lỏng vàng, có nhầy mủ, máu. Thấp nhiệt úng trở trường đạo → đau bụng. Nhiệt bức trường đạo, thấp làm khí cơ úng trệ → lý cấp hậu trọng. Nhiệt thương tân dịch → miệng khát, tiểu vàng. Biểu hiện thấp nhiệt → lưỡi đỏ, rêu vàng, mạch hoạt sác hoặc nhu sác."
  );

  // --- Tỳ, Vị ---
  await createPattern(
    sid,
    "Tỳ khí hư",
    "Bụng đầy, khó tiêu, tiêu lỏng; không muốn ăn, ăn ít; mệt mỏi, tứ chi vô lực, lười nói; người gầy, sắc mặt vàng úa; lưỡi nhợt, mạch hoãn nhược",
    "Tỳ không vận hóa thủy cốc → bụng đầy, khó tiêu, tiêu lỏng; không muốn ăn, ăn ít (Tỳ khai khiếu ra miệng). Khí hư, Tỳ chủ tứ chi → mệt mỏi, tứ chi vô lực, lười nói. Hóa sinh khí huyết bất túc → người gầy, sắc mặt vàng úa. Khí hư → lưỡi nhợt, mạch hoãn nhược."
  );
  await createPattern(
    sid,
    "Tỳ dương hư",
    "Bụng đầy, ăn ít; đau bụng, thích ấm, tay chân lạnh; tiêu lỏng, phân sống; tứ chi nặng nề, phù toàn thân, nữ đới hạ loãng nhiều; lưỡi nhợt, rêu trắng, mạch trầm trì vô lực",
    "Tỳ không vận hóa thủy cốc → bụng đầy, ăn ít; tiêu lỏng, phân sống. Dương hư, hàn ngưng, khí trệ → đau bụng, thích ấm, tay chân lạnh. Tỳ không vận hóa thủy thấp → tứ chi nặng nề, phù toàn thân, nữ đới hạ loãng nhiều. Dương hư hàn thịnh → lưỡi nhợt, rêu trắng, mạch trầm trì vô lực."
  );
  await createPattern(
    sid,
    "Tỳ khí hư hạ hãm",
    "Hoa mắt chóng mặt; sa dạ dày, tử cung, bàng quang, trực tràng, trĩ",
    "Tỳ khí hư + tạng phủ không thăng đề đúng vị trí. Thanh dương không thăng → hoa mắt chóng mặt. Hóa sinh khí bất túc, tạng khí suy, thăng đề vô lực → sa dạ dày, tử cung, bàng quang, trực tràng, trĩ."
  );
  await createPattern(
    sid,
    "Tỳ bất thống huyết",
    "Tiện huyết, niệu huyết, xuất huyết dưới da; băng lậu, rong kinh, rong huyết; sắc mặt không tươi, lưỡi nhợt, mạch tế nhược",
    "Tỳ khí hư + xuất huyết. Tỳ không thống nhiếp huyết → tiện huyết, niệu huyết, xuất huyết dưới da; băng lậu, rong kinh, rong huyết. Xuất huyết gây huyết hư → sắc mặt không tươi, lưỡi nhợt, mạch tế nhược."
  );
  await createPattern(
    sid,
    "Hàn thấp khốn tỳ",
    "Bụng đầy, ăn ít; tiêu lỏng, phù chi; buồn nôn, nôn; tứ chi nặng nề, đầu nặng; lưỡi nhợt, rêu trắng nhớt, mạch nhu hoãn",
    "Hàn thấp cản trở Tỳ vận hóa thủy cốc → bụng đầy, ăn ít. Thấp hạ chú trường đạo, thấp tràn ra cơ phu → tiêu lỏng, phù chi. Thấp cản trở Vị hòa giáng → buồn nôn, nôn. Thấp tính nặng, Tỳ chủ tứ chi, thanh dương bất thăng → tứ chi nặng nề, đầu nặng. Hàn thấp nội thịnh → lưỡi nhợt, rêu trắng nhớt, mạch nhu hoãn."
  );
  await createPattern(
    sid,
    "Thấp nhiệt uẩn tỳ",
    "Bụng đầy, ăn ít, nôn ói; tứ chi nặng nề; vàng da vàng mắt, sắc vàng tươi; sốt lúc cao lúc thấp, ra mồ hôi mà sốt không giảm; lưỡi đỏ, rêu vàng nhớt, mạch nhu sác",
    "Thấp nhiệt cản trở vận hóa → bụng đầy, ăn ít, nôn ói. Thấp tính trọng → tứ chi nặng nề. Thấp nhiệt chưng đốt, đởm trấp trào ra ngoài da → vàng da vàng mắt, sắc vàng tươi. Thấp nhiệt chưng đốt → sốt lúc cao lúc thấp, ra mồ hôi mà sốt không giảm. Thấp nhiệt nội uẩn → lưỡi đỏ, rêu vàng nhớt, mạch nhu sác."
  );
  await createPattern(
    sid,
    "Vị âm hư",
    "Đau bụng âm ỉ, đói không muốn ăn; họng khô, tiện táo; nôn khan, nấc cục; thượng vị căng tức; lưỡi đỏ, mạch tế sác",
    "Hư nhiệt nội thịnh, Vị khí bất hòa → đau bụng âm ỉ, đói không muốn ăn. Hư nhiệt tổn thương tân dịch → họng khô, tiện táo. Hư nhiệt nhiễu, Vị khí thượng nghịch → nôn khan, nấc cục. Vị mất sự tư nhuận của âm dịch, Vị khí bất hòa → thượng vị căng tức. Âm hư nội nhiệt → lưỡi đỏ, mạch tế sác."
  );
  await createPattern(
    sid,
    "Vị nhiệt thịnh",
    "Đau thượng vị nóng rát; ợ chua, trào ngược, nôn ói, ăn vào nôn liền; khát nước, thích uống lạnh, tiện táo, tiểu vàng ít; sưng đau, chảy máu chân răng, miệng hôi; lưỡi đỏ, rêu vàng, mạch hoạt sác hữu lực",
    "Nhiệt tích trong phủ Vị → đau thượng vị nóng rát. Vị khí hỏa thượng nghịch → ợ chua, trào ngược, nôn ói, ăn vào nôn liền. Nhiệt thương tân dịch → khát nước, thích uống lạnh, tiện táo, tiểu vàng ít. Vị kinh vòng quanh nướu răng, nhiệt viêm và thương huyết lạc, trọc khí thượng nghịch → sưng đau, chảy máu chân răng, miệng hôi. Nhiệt thịnh → lưỡi đỏ, rêu vàng, mạch hoạt sác hữu lực."
  );

  // --- Can, Đởm ---
  await createPattern(
    sid,
    "Can khí uất",
    "Đau căng tức ngực sườn, vú, bụng dưới; tình chí uất ức, dễ cáu giận; mai hạch khí; kinh nguyệt không đều, thống kinh; mạch huyền",
    "Khí uất phát sinh trướng muộn, đau theo kinh Can → đau căng tức ngực sườn, vú, bụng dưới. Can mất sơ tiết tính chí → tình chí uất ức, dễ cáu giận. Khí uất sinh đàm, đàm và khí uất kết vùng cổ họng → mai hạch khí. Khí uất → huyết ứ xung nhâm → kinh nguyệt không đều, thống kinh. Khí uất → mạch huyền."
  );
  await createPattern(
    sid,
    "Can hỏa thượng viêm",
    "Đầu đau căng, chóng mặt, mặt mắt đỏ; miệng khô, tiện táo, tiểu vàng; ngủ hay mơ, ác mộng; ù tai, đau sưng đỏ tai, vỡ mủ; lưỡi đỏ, rêu vàng, mạch hoạt sác",
    "Hỏa tính thượng viêm, hỏa theo kinh Can thượng công đầu mặt → đầu đau căng, chóng mặt, mặt mắt đỏ. Hỏa tổn thương tân dịch → miệng khô, tiện táo, tiểu vàng. Hỏa nhiệt nội nhiễu, thần hồn bất an → ngủ hay mơ, ác mộng. Hỏa nhiệt từ Can truyền qua Đởm đến tai → ù tai, đau sưng đỏ tai, vỡ mủ. Can kinh thực hỏa tích thịnh → lưỡi đỏ, rêu vàng, mạch hoạt sác."
  );
  await createPattern(
    sid,
    "Can huyết hư",
    "Hoa mắt, quáng gà, móng khô giòn; mất ngủ, mơ nhiều; co quắp, co rút, tê, co duỗi khó; chân tay run, giật cơ; sắc mặt nhợt, kinh sắc nhợt, lưỡi nhợt, rêu trắng, mạch tế",
    "Can huyết hư không nuôi dưỡng cân, mắt, móng → hoa mắt, quáng gà, móng khô giòn. Huyết bất túc không yên hồn định chí → mất ngủ, mơ nhiều. Huyết hư không dưỡng được cân mạch → co quắp, co rút, tê, co duỗi khó. Huyết hư phong động → chân tay run, giật cơ. Huyết hư → sắc mặt nhợt, kinh sắc nhợt, lưỡi nhợt, rêu trắng, mạch tế."
  );
  await createPattern(
    sid,
    "Can âm hư",
    "Chóng mặt, mắt khô; mặt đỏ, sườn đau nóng, ngũ tâm phiền nhiệt, triều nhiệt, đạo hãn; miệng khô; chân tay run; lưỡi đỏ, ít rêu, mạch huyền tế sác",
    "Can âm bất túc không nuôi dưỡng mục hệ → chóng mặt, mắt khô. Âm hư nội nhiệt → mặt đỏ, sườn đau nóng, ngũ tâm phiền nhiệt, triều nhiệt, đạo hãn. Hư nhiệt tổn thương tân dịch → miệng khô. Can âm hư → cân mạch thất dưỡng → chân tay run. Âm hư nội nhiệt → lưỡi đỏ, ít rêu, mạch huyền tế sác."
  );
  await createPattern(
    sid,
    "Can dương thượng kháng",
    "Chóng mặt, ù tai, đầu mắt đau căng; nóng giận, dễ cáu gắt; tâm quý, hay quên; đầu nặng, hai chân nhẹ, bước đi không vững; lưỡi đỏ, mạch huyền hữu lực",
    "Can âm bất túc, Can dương kháng nghịch → chóng mặt, ù tai, đầu mắt đau căng. Can mất sơ tiết tính chí → nóng giận, dễ cáu gắt. Âm hư, tâm thất sở dưỡng, thần bất an → tâm quý, hay quên. Thượng thịnh hạ hư → đầu nặng, hai chân nhẹ, bước đi không vững. Âm hư dương kháng → lưỡi đỏ, mạch huyền hữu lực."
  );
  await createPattern(
    sid,
    "Can dương hóa phong",
    "Chóng mặt muốn té, đầu lắc tay run, nói khó hoặc lưỡi cứng không nói được, hoặc đột ngột té bất tỉnh nhân sự, liệt nửa người, đau đầu, cổ cứng, tay chân tê dại, đi đứng lảo đảo. Lưỡi đỏ, rêu trắng. Mạch huyền hữu lực",
    "Thuộc nhóm Can phong nội động, tính chất thượng thực hạ hư."
  );
  await createPattern(
    sid,
    "Nhiệt cực sinh phong",
    "Tay chân co giật, cổ gáy cứng đơ, giác cung phản trương, hai mắt trợn ngược, sốt cao thần hôn thao nhiệt như cuồng. Lưỡi đỏ sẫm. Mạch huyền sác hữu lực",
    "Thuộc nhóm Can phong nội động, tính chất thực nhiệt."
  );
  await createPattern(
    sid,
    "Âm hư phong động",
    "Tay chân run nhẹ, triều nhiệt, ngũ tâm phiền nhiệt, miệng họng khô táo, gầy gò. Lưỡi đỏ, rêu ít. Mạch huyền tế sác",
    "Thuộc nhóm Can phong nội động, tính chất hư nhiệt."
  );
  await createPattern(
    sid,
    "Huyết hư sinh phong",
    "Tay chân run, máy cơ, co cứng khớp, tê dại, chóng mặt ù tai, mặt trắng không tươi, móng tay chân khô không bóng. Lưỡi nhợt, rêu trắng. Mạch tế",
    "Thuộc nhóm Can phong nội động, tính chất hư."
  );
  await createPattern(
    sid,
    "Hàn trệ can mạch",
    "Bụng dưới đau căng, lạnh, tức, đau lan ra bộ phận sinh dục; đau tăng khi gặp lạnh, giảm khi gặp nóng; đau co thắt âm nang; rêu trắng, mạch trầm huyền",
    "Hàn tà xâm nhập Can kinh → khí huyết vận hành không thông → bụng dưới đau căng, lạnh, tức. Hàn tắc khí huyết ngưng trệ, nhiệt tắc khí huyết lưu thông → đau tăng khi gặp lạnh, giảm khi gặp nóng. Hàn tính thu dẫn gây co thắt cân mạch → đau co thắt âm nang. Âm hàn tại Can mạch → rêu trắng, mạch trầm huyền."
  );
  await createPattern(
    sid,
    "Can đởm thấp nhiệt",
    "Đau hạ sườn, căng, nóng; bụng có u cục; chán ăn, bụng chướng, nôn ói; miệng đắng; tiêu lỏng/táo bón; tiểu ít, đỏ; hàn nhiệt vãng lai; vàng da, vàng mắt; ngứa âm hộ, bìu sưng đau, đới hạ vàng hôi ngứa; lưỡi đỏ, rêu vàng nhớt, mạch huyền sác",
    "Thấp nhiệt uẩn kết → Can Đởm mất sơ tiết → khí trệ gây đau hạ sườn, căng, nóng. Khí trệ huyết ứ → bụng có u cục. Can mộc hoành nghịch Tỳ Vị thổ → chán ăn, bụng chướng, nôn ói. Đởm trấp tuần hành thất thường → miệng đắng, vàng da vàng mắt. Thấp thắng thì tiêu lỏng, nhiệt thắng thì táo bón. Thấp nhiệt hạ chú Bàng quang → tiểu ít, đỏ. Tà chính phân tranh tại Thiếu dương Đởm → hàn nhiệt vãng lai. Thấp nhiệt nội uẩn Can Đởm → ngứa âm hộ, bìu sưng đau, đới hạ vàng hôi ngứa; lưỡi đỏ, rêu vàng nhớt, mạch huyền sác."
  );

  // --- Thận, Bàng quang ---
  await createPattern(
    sid,
    "Thận dương hư",
    "Lưng gối đau mỏi yếu; sợ lạnh, tay chân lạnh (chân lạnh nhiều hơn tay); tinh thần ủy mị bất chấn; sắc mặt nhợt, ám tối, lưỡi nhợt bệu, rêu trắng, mạch trầm nhược; dương nuy, bào cung hàn không có thai; tiêu chảy phân sống, ngũ canh tả; phù thũng từ thắt lưng trở xuống; hồi hộp, trống ngực; ho, suyễn",
    "Thận dương hư không ôn dưỡng lưng và xương → lưng gối đau mỏi yếu. Dương hư không ôn ấm tay chân (Thận ở hạ tiêu) → sợ lạnh, tay chân lạnh, chân lạnh nhiều hơn tay. Dương khí bất túc → tâm thần không phấn chấn → tinh thần ủy mị bất chấn. Dương hư không vận hành khí huyết lên vùng đầu mặt → sắc mặt nhợt, ám tối, lưỡi nhợt. Dương hư → khí huyết vận hành vô lực → lưỡi bệu, rêu trắng, mạch trầm nhược. Mệnh môn hỏa suy, chủ sinh sản suy yếu → dương nuy, bào cung hàn không có thai. Thận dương hư, hỏa không sinh thổ, Tỳ thất kiện vận → tiêu chảy phân sống, ngũ canh tả. Khí hóa bất túc, thủy dịch nội đình tràn ra ngoài cơ phu → phù thũng chủ yếu từ thắt lưng trở xuống. Thủy khí lăng tâm → hồi hộp, trống ngực. Thủy hàn xạ Phế → ho, suyễn."
  );
  await createPattern(
    sid,
    "Thận âm hư",
    "Lưng gối đau, mỏi; hoa mắt, ù tai; mất ngủ mơ nhiều, di mộng tinh; kinh ít, bế kinh; băng lậu; người gầy; triều nhiệt, đạo hãn, ngũ tâm phiền nhiệt, gò má đỏ; tiểu vàng ít, tiêu bón; lưỡi đỏ ít rêu, mạch tế sác",
    "Thận âm bất túc, tủy giảm, cốt thất dưỡng → lưng gối đau, mỏi. Não tủy bất túc → hoa mắt, ù tai. Tâm thận bất giao, Tâm hỏa thiên kháng, tâm thần bất ninh → mất ngủ mơ nhiều, di mộng tinh. Âm khuy huyết thiếu → kinh ít, bế kinh. Hư nhiệt bức huyết vọng hành → băng lậu. Âm tinh bất túc → người gầy. Âm hư nội nhiệt → triều nhiệt, đạo hãn, ngũ tâm phiền nhiệt, gò má đỏ. Hư nhiệt thương tân → tiểu vàng ít, tiêu bón. Âm hư nội nhiệt → lưỡi đỏ ít rêu, mạch tế sác."
  );
  await createPattern(
    sid,
    "Thận tinh bất túc",
    "Trẻ em chậm phát triển thể chất, trí lực; chậm đóng thóp, xương cốt mềm ngắn; tinh ít, bế kinh; tóc dễ rụng, răng lung lay rụng sớm; tai ù, tai điếc, hay quên",
    "Tinh bất túc không hóa sinh khí huyết, não tủy bất túc → trẻ em chậm phát triển thể chất, trí lực. Tinh khuy tủy thiểu → chậm đóng thóp, xương cốt mềm ngắn. Thận chủ tinh sinh dục → tinh ít, bế kinh. Thận tinh sung mãn ra tóc, răng là phần thừa của cốt → tóc dễ rụng, răng lung lay rụng sớm. Tinh khuy → não tủy bất túc → tai ù, tai điếc, hay quên."
  );
  await createPattern(
    sid,
    "Thận khí bất cố",
    "Tai giảm thính lực, lưng đau gối mỏi; tiểu nhiều lần, tiểu không tự chủ; tiểu són; đái dầm ở trẻ em, tiểu đêm người lớn; hoạt tinh, tảo tiết; đới hạ trong loãng; dễ sẩy thai, sanh non; lưỡi nhợt, rêu trắng, mạch trầm nhược",
    "Thận khai khiếu ra tai, chủ cốt tủy → tai giảm thính lực, lưng đau gối mỏi. Thận khí hư → Bàng quang thất ước → tiểu nhiều lần, tiểu không tự chủ. Bàng quang tống xuất vô lực → tiểu són. Thận khí bất túc không chủ động mở tiền âm hậu âm vững chắc → đái dầm ở trẻ em, tiểu đêm người lớn. Thận khí hư không thể bế tàng → hoạt tinh, tảo tiết. Đái mạch thất cố → đới hạ trong loãng. Nhâm mạch thất dưỡng → dễ sẩy thai, sanh non. Khí hư → lưỡi nhợt, rêu trắng, mạch trầm nhược."
  );
  await createPattern(
    sid,
    "Thận bất nạp khí",
    "Ho suyễn lâu ngày, thở ra nhiều, hít vô ít; vận động thì suyễn tăng; lưng gối vô lực; tiếng nói nhỏ, tự hãn, mệt mỏi; lưỡi nhợt, rêu trắng, mạch trầm nhược",
    "Thận khí hư không thể nạp khí → ho suyễn lâu ngày, thở ra nhiều, hít vô ít. Vận động làm khí hư nặng hơn → vận động thì suyễn tăng. Thận chủ cốt tủy → lưng gối vô lực. Khí hư → tiếng nói nhỏ, tự hãn, mệt mỏi; lưỡi nhợt, rêu trắng, mạch trầm nhược."
  );
  await createPattern(
    sid,
    "Bàng quang thấp nhiệt",
    "Tiểu gấp, nhiều lần, rát, gắt, buốt; tiểu vàng, ít; bụng dưới trướng căng; tiểu máu; lưỡi đỏ, rêu vàng nhớt, mạch hoạt sác",
    "Thấp nhiệt xâm tập Bàng quang → tiểu gấp, nhiều lần, rát, gắt, buốt. Thấp nhiệt nội uẩn Bàng quang, khí hóa thất tư → tiểu vàng, ít. Thấp nhiệt tại Bàng quang → bụng dưới trướng căng. Nhiệt chước thương huyết lạc → tiểu máu. Thấp nhiệt → lưỡi đỏ, rêu vàng nhớt, mạch hoạt sác."
  );

  console.log("Hoàn tất xử lý Biện chứng Tạng Phủ.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

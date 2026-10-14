// Nguồn: "Các bệnh về khí.pdf" (4tr) và "Các bệnh về huyết & tân dịch.pdf" (8tr) — Y Gia Quán. Bảng phân
// loại kinh điển các chứng trạng tổng quát của Khí - Huyết - Tân dịch (không gắn với tạng phủ cụ thể, khác
// với các Pattern "Khí hư/Huyết hư..." đã có trong DB vốn luôn gắn với 1 tạng như "Tỳ khí hư", "Can huyết
// hư"). Giữ nguyên đầy đủ triệu chứng, pháp trị, phương dùng như trong nguồn, không bịa thêm.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getOrCreateSource(title: string, locator: string) {
  let s = await prisma.source.findFirst({ where: { title: { equals: title, mode: "insensitive" } } });
  if (!s) {
    s = await prisma.source.create({
      data: { title, authorOrOrg: "Y Gia Quán (Thân - Tâm - Tuệ)", sourceType: "Tài liệu tổng hợp", locator },
    });
  }
  return s;
}

async function createPattern(
  sourceId: string,
  name: string,
  description: string,
  supportCriteria: string,
  keySigns: string
) {
  const existing = await prisma.pattern.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
  if (existing) {
    console.log(`ĐÃ TỒN TẠI, bỏ qua: ${name}`);
    return;
  }
  await prisma.pattern.create({
    data: { name, description, supportCriteria, keySigns, sourceId },
  });
  console.log(`Đã tạo Pattern: ${name}`);
}

async function main() {
  const sourceKhi = await getOrCreateSource("Các bệnh về khí", "4 trang");
  const sourceHuyet = await getOrCreateSource("Các bệnh về huyết - tân dịch", "8 trang");

  // ===== CÁC BỆNH VỀ KHÍ =====
  await createPattern(
    sourceKhi.id,
    "Khí hư (tổng quát)",
    "Khí của toàn thân hoặc của một tạng/phủ suy nhược, không đủ sức ôn dưỡng, cố nhiếp, thúc đẩy các hoạt động sinh lý. Ngoài biểu hiện khí hư toàn thân, khí của tạng/phủ hư nhược còn có thêm các biểu hiện đặc thù riêng của tạng hay phủ đó. Pháp: Bổ khí. Phương: Tứ quân tử thang; nếu nặng làm dương khí hư suy thì dùng Sâm phụ thang.",
    "Pháp trị: Bổ khí (Tứ quân tử thang; nặng dùng Sâm phụ thang để hồi dương khí hư suy).",
    "Mệt mỏi, hụt hơi, hơi thở yếu, tiếng nói nhỏ, ngại nói, sắc mặt trắng không tươi nhuận, hoa mắt, chóng mặt, tự ra mồ hôi, dễ cảm mạo, sau khi hoạt động bệnh nặng thêm, chất lưỡi nhợt, mạch hư nhược.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí hãm",
    "Trung khí (khí của Tỳ) hạ hãm, không nâng đỡ được các tạng phủ và không thăng đề được thanh khí, khiến khí ở hạ tiêu bị trệ và các tạng phủ/tổ chức sa xuống. Pháp: Ích khí thăng đề. Phương: Bổ trung ích khí thang.",
    "Pháp trị: Ích khí thăng đề (Bổ trung ích khí thang).",
    "Cảm giác tức nặng bụng dưới, đại tiện lỏng nát kéo dài, đi nhiều lần, tiểu tiện đục; phụ nữ thấy ra nhiều khí hư; hoặc sa dạ dày, sa thận, sa trực tràng (trĩ sa), sa gan; hoa mắt, chóng mặt, sắc mặt trắng nhợt, ù tai, hụt hơi.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí hư bất cố",
    "Khí hư không còn sức cố nhiếp (giữ chặt) tân dịch, huyết và các chất tinh vi của cơ thể, khiến các chất này thoát ra ngoài một cách không kiểm soát (mồ hôi, nước tiểu, dịch tiết, huyết, tinh). Pháp: Bổ khí cố nhiếp. Phương điển hình khi Thận khí bất cố: Kim tỏa cố tinh hoàn.",
    "Pháp trị: Bổ khí cố nhiếp; điển hình Thận khí bất cố dùng Kim tỏa cố tinh hoàn.",
    "Tự ra mồ hôi không cầm, tiểu tiện nhiều lần, số lượng nước tiểu nhiều mà sắc trắng trong, đái dầm (di niệu), rối loạn đại tiện, tăng tiết nhiều dịch (nước mắt, nước dãi, nước mũi) trong loãng; các chứng xuất huyết mạn; hoạt tinh, tảo tiết, kinh nguyệt số lượng nhiều, phụ nữ ra khí hư nhiều hoặc động thai.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí thoát",
    "Khí hư đến cực độ, dương khí sắp thoát ra ngoài (vong dương), là chứng nguy cấp. Pháp: Hồi dương cố thoát. Phương: Tứ vị hồi dương ẩm.",
    "Pháp trị: Hồi dương cố thoát (Tứ vị hồi dương ẩm) — chứng nguy cấp cần xử trí cấp cứu.",
    "Rối loạn hô hấp, hơi thở yếu, không có quy luật, tinh thần u ám hoặc hôn mê, ra mồ hôi nhiều mà không cầm, miệng há, mắt nhắm, tay duỗi mềm, đại tiểu tiện không tự chủ, sắc mặt trắng bệch, mạch vi muốn tuyệt.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí trệ (tổng quát)",
    "Khí vận hành bị cản trở, ứ trệ tại chỗ, thường liên quan đến tình chí uất ức (Can khí uất trệ là điển hình). Pháp: Lý khí hành khí. Phương: Sài hồ sơ can thang; Việt cúc hoàn.",
    "Pháp trị: Lý khí hành khí (Sài hồ sơ can thang; Việt cúc hoàn).",
    "Cảm giác đầy, căng, tức, trướng ở cục bộ hoặc toàn thân. Triệu chứng lúc nhẹ lúc nặng, di chuyển lung tung không định hình nên sờ sẽ không thấy, gõ bụng vang như trống; thường xuất hiện và nặng lên khi cáu giận, giảm đi khi thư thái hoặc nghỉ ngơi hoặc ợ hơi; mạch thường huyền, lưỡi thường không thay đổi nhiều.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí nghịch",
    "Khí của tạng/phủ không giáng xuống theo đúng chiều sinh lý mà đi ngược lên trên (nghịch). Biểu hiện khác nhau tùy tạng phủ: Phế khí thượng nghịch gây ho, khó thở, khạc đờm; Vị khí thượng nghịch gây nôn, ợ hơi, nấc; Can khí thượng nghịch gây đầu và mắt căng đau, chóng mặt, ù tai, mặt hồng, mắt đỏ, nôn ra máu, chảy máu cam, nặng có thể đột nhiên ngã bất tỉnh; Xung Nhâm khí nghịch gây phụ nữ đến kỳ kinh lại chảy máu cam, có thai hay bị nôn hoặc tức ngực, thở gấp, nghẹn họng. Pháp trị căn cứ vào vị trí bệnh để quyết định: Tuyên Phế hóa đàm giáng khí định suyễn (Phế); Hòa Vị giáng nghịch (Vị); Sơ Can lý khí, thanh Can tả hỏa (Can); Bổ Thận nạp khí (Thận). Phương: Tô tử giáng khí thang, Trần bì trúc nhự thang, Tứ ma thang...",
    "Pháp trị căn cứ vị trí bệnh: Phế → Tuyên Phế hóa đàm giáng khí định suyễn (Tô tử giáng khí thang); Vị → Hòa Vị giáng nghịch (Trần bì trúc nhự thang); Can → Sơ Can lý khí, thanh Can tả hỏa (Tứ ma thang...); Thận → Bổ Thận nạp khí.",
    "Phế khí thượng nghịch: ho, khó thở, khạc đờm. Vị khí thượng nghịch: nôn, ợ hơi, nấc. Can khí thượng nghịch: đầu và mắt căng đau, chóng mặt, ù tai, mặt hồng, mắt đỏ, nôn ra máu, chảy máu cam, nặng có thể đột nhiên ngã bất tỉnh. Xung Nhâm khí nghịch: phụ nữ đến kỳ kinh lại chảy máu cam, có thai hay bị nôn hoặc tức ngực, thở gấp, nghẹn họng.",
  );

  await createPattern(
    sourceKhi.id,
    "Khí bế",
    "Khí cơ bế tắc đột ngột, thường xảy ra cấp tính, là chứng nguy cấp cần khai khiếu kịp thời. Pháp: Khai khiếu tinh thần. Phương: Ngũ ma ẩm tử.",
    "Pháp trị: Khai khiếu tinh thần (Ngũ ma ẩm tử) — chứng nguy cấp.",
    "Đột nhiên hôn mê hoặc lên cơn khó thở cấp; hoặc đau dữ dội vùng đầu, ngực, lưng, bụng, đau như châm chích; chân tay giá lạnh, tức ngực, trướng bụng, đại tiểu tiện không thông; chất lưỡi ám tím, rêu lưỡi dày, mạch trầm thực hoặc sáp phục.",
  );

  // ===== CÁC BỆNH VỀ HUYẾT - TÂN DỊCH =====
  await createPattern(
    sourceHuyet.id,
    "Huyết hư (tổng quát)",
    "Huyết dịch của toàn thân suy giảm về số lượng hoặc chất lượng, không đủ nuôi dưỡng tạng phủ, kinh mạch, cân cơ. Pháp: Bổ huyết. Phương: Tứ vật thang.",
    "Pháp trị: Bổ huyết (Tứ vật thang).",
    "Sắc mặt trắng không tươi nhuận hoặc ám vàng, môi và móng chân tay nhợt, hoa mắt, chóng mặt, hồi hộp trống ngực, mất ngủ, hay quên, chân và tay tê nhức, co duỗi khớp khó khăn; phụ nữ thấy kinh sau kỳ, số lượng kinh giảm, kinh sắc nhợt thậm chí bế kinh; chất lưỡi nhợt, mạch tế vô lực.",
  );

  await createPattern(
    sourceHuyet.id,
    "Huyết ứ (tổng quát)",
    "Huyết vận hành không thông, ứ đọng tại chỗ, có thể do nhiều nguyên nhân khác nhau dẫn đến (hàn ngưng, uất nhiệt, huyết ứ có sẵn, khí trệ), mỗi nguyên nhân có pháp trị riêng tuy cùng chung nguyên tắc hoạt huyết khử ứ kiêm lý khí. Pháp chung: Hoạt huyết khử ứ, kiêm lý khí (Huyết phủ trục ứ thang). Do hàn: Ôn kinh hoạt huyết (Đương quy tứ nghịch thang). Do ứ nhiệt: Tiết nhiệt phá ứ (Đại hoàng mẫu đan thang). Do huyết ứ: Bổ huyết hoạt huyết (Đào hồng tứ vật thang). Do khí trệ: Lý khí hóa ứ (Tiêu dao tán gia Đào nhân, Hồng hoa).",
    "Pháp trị theo nguyên nhân: Chung → hoạt huyết khử ứ kiêm lý khí (Huyết phủ trục ứ thang); do hàn → ôn kinh hoạt huyết (Đương quy tứ nghịch thang); do ứ nhiệt → tiết nhiệt phá ứ (Đại hoàng mẫu đan thang); do huyết ứ (lâu ngày) → bổ huyết hoạt huyết (Đào hồng tứ vật thang); do khí trệ → lý khí hóa ứ (Tiêu dao tán gia Đào nhân, Hồng hoa).",
    "Đau chói, đau cố định, đau không thích xoa nắn (cự án), thường đau tăng về đêm, sưng nề, tính chất tương đối cứng; nếu ở nông thấy bề mặt xanh tím mà nổi gồ lên, nếu trong ổ bụng có thể sờ thấy khối không di chuyển; xuất huyết thấy sắc ám tím, chất dính sánh, kèm theo huyết cục hoặc đi ngoài phân đen như bã cà phê, sắc mặt ám tím hoặc ám đen; môi, lưỡi, móng chân và tay ám tím; hoặc dưới da, dưới lưỡi có ban điểm ứ huyết, mạch dưới lưỡi căng phồng và xanh tím hoặc vùng bụng thấy nổi tĩnh mạch sắc xanh; hoặc da khô và sần đỏ xếp như vảy cá. Phụ nữ có thể thấy đau bụng kinh, bế kinh, băng lậu, mạch tế sáp hoặc kết đại hoặc vô mạch. Ngoài ra còn thấy rối loạn về thần chí như mất ngủ, hồi hộp, hay quên, kích động, có thể thấy phát sốt, tê buốt, liệt, loét.",
  );

  await createPattern(
    sourceHuyet.id,
    "Huyết nhiệt",
    "Nhiệt tà xâm phạm phần huyết, huyết bị nhiệt bức bách vận hành loạn, tràn ra ngoài mạch gây các chứng xuất huyết cấp tính. Pháp: Thanh nhiệt lương huyết. Phương: Thanh doanh thang; Thanh nhiệt địa hoàng thang.",
    "Pháp trị: Thanh nhiệt lương huyết (Thanh doanh thang; Thanh nhiệt địa hoàng thang).",
    "Các chứng xuất huyết cấp như ho ra máu, nôn ra máu, chảy máu cam, chảy máu chân răng, đại tiểu tiện ra máu, xuất huyết ở cơ bắp; phụ nữ thấy kinh nguyệt ra quá nhiều, băng lậu; huyết ra hồng tươi; sốt về đêm, sắc mặt hồng, mắt đỏ, miệng khô nhưng uống không nhiều, đi tiểu số lượng ít, sắc màu vàng hoặc đi tiêu dầm dề, hôn mê, rối loạn ngôn ngữ; hoặc có ban xuất huyết ngoài da hoặc mụn phỏng nước sưng nóng đỏ; chất lưỡi hồng bóng, mạch hoạt sác hoặc huyền sác.",
  );

  await createPattern(
    sourceHuyet.id,
    "Huyết hàn",
    "Hàn tà xâm phạm phần huyết, huyết bị hàn ngưng trệ, vận hành không thông gây đau và biến sắc tại chỗ. Pháp: Ôn kinh tán hàn. Phương: Ôn kinh thang; Đương quy tứ nghịch thang.",
    "Pháp trị: Ôn kinh tán hàn (Ôn kinh thang; Đương quy tứ nghịch thang).",
    "Chân tay, gò má, vành tai lạnh và đau, tê buốt, sưng nề, xanh tím, thậm chí loét; hoặc cơ khớp, ngực, bụng lạnh đau, co thắt hoặc đau dữ dội; hoặc đau bụng kinh dữ dội, chườm ấm dễ chịu, gặp lạnh đau tăng, chu kỳ kinh kéo dài, sắc kinh tím kèm theo huyết cục; sợ lạnh, chân tay lạnh, môi và mặt xanh tím, chất lưỡi tím nhợt, rêu lưỡi trắng trơn, mạch trầm trì hoặc huyền sáp.",
  );

  await createPattern(
    sourceHuyet.id,
    "Tân dịch hao hư",
    "Tân dịch trong cơ thể hao hư làm cho tạng phủ, tổ chức, lỗ khiếu không được nhuận dưỡng, phần thủy dịch thiếu hụt gây khô táo (còn gọi là 'nội táo' — khác với ngoại táo trong lục dâm; cũng phân ra hư chứng và thực chứng). Do tân dịch thu nạp không đầy đủ hoặc tân dịch tiêu hao quá nhiều tạo nên. Pháp chung: Tăng bổ tân dịch (Tăng dịch thang). Do Vị tân bất túc: Ích vị sinh tân (Ích vị thang). Do tân hao tiện bí: Sinh tân thông tiện (Ma tử nhân hoàn). Phế táo tân hao: Thanh táo nhuận phế sinh tân (Thanh táo cứu phế thang).",
    "Pháp trị theo thể: chung → tăng bổ tân dịch (Tăng dịch thang); do Vị tân bất túc → ích vị sinh tân (Ích vị thang); do tân hao tiện bí → sinh tân thông tiện (Ma tử nhân hoàn); Phế táo tân hao → thanh táo nhuận phế sinh tân (Thanh táo cứu phế thang).",
    "Biểu hiện tùy thể: khô miệng khát nước (Vị tân bất túc), đại tiện táo bón khô kết (tân hao tiện bí), ho khan, họng khô, da khô (Phế táo tân hao) — chung quy do tân dịch không đủ nhuận dưỡng tạng phủ, tổ chức, lỗ khiếu.",
  );

  await createPattern(
    sourceHuyet.id,
    "Chứng đàm (Tân dịch nội đình)",
    "Tân dịch ứ đọng, ngưng kết thành đàm, theo khí nghịch lên trên hoặc lưu trệ ở kinh lạc, tạng phủ gây bệnh. Phân thành 5 thể theo tính chất tà khí kết hợp: Phong đàm (Khu phong trừ đàm thông lạc hòa doanh — Đạo đàm thang, Đại tần giao thang, Khiên chính tán); Nhiệt đàm (Thanh nhiệt hóa đàm — Bối mẫu qua lâu tán, Thanh khí hóa đàm hoàn); Hàn đàm (Ôn hóa hàn ẩm — Tiểu thanh long thang, Tam tử dưỡng thân thang); Thấp đàm (Táo thấp hóa đàm — Nhị trần thang); Táo đàm (Nhuận táo hóa đàm — Thanh táo cứu phế thang, Bách hợp cố kim thang).",
    "Pháp trị theo thể: Phong đàm → khu phong trừ đàm thông lạc hòa doanh (Đạo đàm thang/Đại tần giao thang/Khiên chính tán); Nhiệt đàm → thanh nhiệt hóa đàm (Bối mẫu qua lâu tán/Thanh khí hóa đàm hoàn); Hàn đàm → ôn hóa hàn ẩm (Tiểu thanh long thang/Tam tử dưỡng thân thang); Thấp đàm → táo thấp hóa đàm (Nhị trần thang); Táo đàm → nhuận táo hóa đàm (Thanh táo cứu phế thang/Bách hợp cố kim thang).",
    "Ho, khó thở, khạc đờm, đờm dính, khò khè trong họng, nôn khạc ra nhiều đờm dãi; sưng hạch, bướu cổ, sưng đau tuyến vú, sưng đau các khớp, co duỗi các khớp khó khăn; chóng mặt, hồi hộp, bụng và ngực đầy tức, chân và tay tê buốt, liệt nửa người, lưỡi cứng, nói khó; mất ngủ, lơ mơ, hôn mê, điên, cuồng, động kinh, đần độn, nuốt vướng trong cổ, hình thể béo trệ, phụ nữ khí hư bạch đới nhiều mà khó thụ thai; rêu lưỡi nhớp, mạch hoạt.",
  );

  await createPattern(
    sourceHuyet.id,
    "Chứng ẩm (Tân dịch nội đình)",
    "Tân dịch ứ đọng thành dạng loãng (ẩm) ở các vị trí khác nhau trong cơ thể, phân thành 4 thể theo vị trí: Đàm ẩm — ẩm đình tụ ở trường Vị gây nôn khạc ra dịch trong loãng, bụng đầy căng trướng, sôi bụng (tiếng óc ách trong bụng), đại tiện lỏng nát; pháp Ôn hóa đàm ẩm (Tiểu thanh long thang, Linh quế truật cam thang). Chi ẩm — ẩm đình tụ trong ngực gây ho khạc ra đờm trắng lượng nhiều, trong loãng, khó thở, há mồm rướn cổ để thở, không thể nằm được, ngực bụng đầy tức, vùng lưng ngực sợ lạnh hoặc kèm theo hen suyễn; pháp Tả Phế trục ẩm, nếu kiêm biểu chứng thì giải biểu hóa ẩm (Tiểu thanh long thang, Đình lịch đại táo tả phế thang). Huyền ẩm — ẩm đình tụ ở mạng sườn gây ngực sườn căng tức trướng đau, ấn vào có cảm giác sóng vỗ, ho, thay đổi tư thế đau tăng; pháp Công trục thủy ẩm (Thập táo thang). Dật ẩm — ẩm tràn lan ra tứ chi gây chân tay nặng nề, đau nhức, nếu nặng thấy phù thũng, kèm theo ho khạc đờm trắng, phát sốt, sợ lạnh, không ra mồ hôi, tiểu tiện khó; pháp Ôn dương lợi thủy (Ngũ linh tán hợp Ngũ bì tán).",
    "Pháp trị theo thể: Đàm ẩm → ôn hóa đàm ẩm (Tiểu thanh long thang/Linh quế truật cam thang); Chi ẩm → tả Phế trục ẩm, kiêm biểu thì giải biểu hóa ẩm (Tiểu thanh long thang/Đình lịch đại táo tả phế thang); Huyền ẩm → công trục thủy ẩm (Thập táo thang); Dật ẩm → ôn dương lợi thủy (Ngũ linh tán hợp Ngũ bì tán).",
    "Chất lưỡi nhợt bệu, rêu lưỡi trắng trơn, mạch trầm huyền (chung cho các thể ẩm). Mỗi thể có vị trí và triệu chứng đặc thù riêng: Đàm ẩm ở trường Vị (nôn dịch trong, sôi bụng, đại tiện lỏng); Chi ẩm ở ngực-Phế (ho đờm trắng loãng lượng nhiều, khó thở không nằm được); Huyền ẩm ở mạng sườn (ngực sườn trướng đau, cảm giác sóng vỗ khi ấn); Dật ẩm ở tứ chi (chân tay nặng nề, phù thũng, kèm biểu chứng ho sốt sợ lạnh).",
  );

  await createPattern(
    sourceHuyet.id,
    "Chứng thủy (Tân dịch nội đình)",
    "Thủy dịch ứ đọng, tràn ra toàn thân gây phù thũng, phân 2 thể theo bản chất hư thực và vị trí khởi phát. Dương thủy: phù thũng, ấn lõm, tiểu tiện ít, hoặc bụng trướng to, ấn có cảm giác sóng vỗ, nghe có tiếng óc ách; đầu tiên thấy phù ở mắt và mặt, sau đó lan nhanh ra toàn thân, kèm theo sốt, sợ gió, đau đầu, đau nhức mình mẩy, sưng đau họng, ho, tiểu tiện vàng sẫm; chất lưỡi bệu, rêu lưỡi nhuận, mạch nhu hoãn (thực chứng, phát bệnh nhanh, thường do ngoại cảm). Pháp: Thông dương hóa thấp lợi thủy (Ngũ linh tán hợp Ngũ bì tán gia giảm). Âm thủy: đầu tiên thấy phù ở chân, sau đó lan đi toàn thân, kèm theo căng trướng bụng, buồn nôn và nôn, ăn kém, mệt mỏi, sợ lạnh, chân tay lạnh; hoặc kèm theo khó thở, không thể nằm được; hoa mắt chóng mặt, hồi hộp, đại tiện lỏng nát; chất lưỡi nhợt, rêu lưỡi trắng trơn, mạch trầm tế (hư chứng, phát bệnh từ từ, thường do tạng phủ hư suy). Pháp: Ôn bổ Tỳ dương lợi thủy (Thực tỳ ẩm gia giảm).",
    "Pháp trị: Dương thủy (thực, do ngoại cảm) → thông dương hóa thấp lợi thủy (Ngũ linh tán hợp Ngũ bì tán gia giảm); Âm thủy (hư, do tạng phủ suy) → ôn bổ Tỳ dương lợi thủy (Thực tỳ ẩm gia giảm). Phân biệt chính: dương thủy khởi phát từ mắt-mặt lan nhanh toàn thân kèm biểu chứng ngoại cảm; âm thủy khởi phát từ chân lan từ từ kèm triệu chứng hư hàn tạng phủ.",
    "Dương thủy: phù ấn lõm, tiểu ít, bụng trướng to có tiếng óc ách, khởi phát ở mắt-mặt lan nhanh toàn thân, kèm sốt sợ gió đau đầu đau mình, họng sưng đau, ho, tiểu vàng sẫm, mạch phù sác. Âm thủy: khởi phát ở chân lan toàn thân, kèm căng trướng bụng, buồn nôn, ăn kém, mệt mỏi, sợ lạnh, chân tay lạnh, có thể khó thở không nằm được, hoa mắt chóng mặt hồi hộp, đại tiện lỏng nát, chất lưỡi ám, mạch trầm tế.",
  );

  await createPattern(
    sourceHuyet.id,
    "Nội thấp (Tân dịch nội đình)",
    "Thấp trọc nội sinh do công năng vận hóa thủy thấp của Tỳ Vị bị rối loạn, đình trệ ở trung tiêu, lan tràn ra cơ phu-khớp, dẫn xuống âm khiếu hoặc đưa lên Phế-Vị. Thấp thuộc âm tà, dễ làm tổn thương dương khí nên bệnh nhân thích nằm và thèm ngủ; thấp tính dính trệ, khó trừ nên bệnh tình thường kéo dài. Nội thấp thường kết hợp với nhiệt tà hoặc hàn tà hoặc với Tỳ khí hư mà gọi tên là thấp nhiệt, hàn thấp hoặc Tỳ hư thấp khốn. Nội thấp đình trệ ở Vị trường làm trệ tắc khí cơ ở trung tiêu gây bụng đầy tức, ăn kém, sôi bụng, tiểu ít; Tỳ Vị bị tổn thương làm thăng giáng thất thường gây buồn nôn, đại tiện lỏng; nội thấp xâm nhập cơ phu và khớp gây cảm giác nặng nề, phù chi dưới; nội thấp đưa xuống âm khiếu gây bạch đới có tính chất dính đục và lượng nhiều; nội thấp đưa lên Phế Vị gây khạc đờm dãi đục và dính. Thấp nhiệt: pháp Thanh nhiệt hóa thấp (Cam lộ tiêu độc đan gia giảm). Tỳ hư thấp khốn: pháp Kiện tỳ hóa thấp (Lục quân tử thang gia giảm). Hàn thấp: pháp Trừ hàn hóa thấp (Bình vị tán gia giảm).",
    "Pháp trị theo thể: Thấp nhiệt → thanh nhiệt hóa thấp (Cam lộ tiêu độc đan gia giảm); Tỳ hư thấp khốn → kiện tỳ hóa thấp (Lục quân tử thang gia giảm); Hàn thấp → trừ hàn hóa thấp (Bình vị tán gia giảm).",
    "Bụng căng trướng, buồn nôn và nôn, ăn kém, miệng nhạt không khát hoặc khát nhưng không muốn uống, sôi bụng, đại tiện lỏng, chân tay nặng nề, thích nằm, thèm ngủ, tiểu tiện ít hoặc chi dưới phù nhẹ, đờm dãi và bạch đới có tính chất dính đục mà lượng nhiều, rêu lưỡi trắng nhớp, mạch nhu hoãn, bệnh tình kéo dài.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

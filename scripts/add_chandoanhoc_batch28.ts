import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Ẩu Thổ (Nôn Ói) và Tiết Tả (Tiêu Chảy)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Ẩu Thổ (Nôn Ói, 8 chứng)",
      category: cat,
      summary: "Ẩu thổ (vị khí thượng nghịch) chia thực chứng (ngoại tà/thực trệ/đàm trọc/can khí phạm vị) và hư chứng (tỳ vị hư hàn/vị âm bất túc/vị táo tân khô).",
      content: `ẨU THỔ (NÔN ÓI): thức ăn đã vào vị nhưng phản thượng nghịch. "Y tông kim giám": "Hữu vật hữu thanh vị chi ẩu, hữu vật vô thanh thổ chi" — có tiếng kèm vật là ẩu, có vật không tiếng là thổ, gộp chung "ẩu thổ". Đa số do ngoại cảm, nội thương, hoặc ẩm thực bất tiết làm chức năng nạp cốc giáng trọc của vị trở ngại, vị khí thượng nghịch. Chia HƯ (vị dương bất chấn/vị khí bất túc mất hòa giáng) và THỰC (tà khí phạm vị: ẩm thực tích trệ, đàm trọc nội trở, ngộ độc thức ăn).

8 chứng thường gặp:

1. **Ngoại cảm hàn thấp**: nôn ói kèm lợm giọng, ố hàn, sốt, rêu trắng mỏng, mạch phù hoãn. Thấp trọc phạm vị, vị khí thượng nghịch.

2. **Thực trệ vị quản**: nôn ói kèm bụng trướng đầy, nôn ra đồ ăn chua, ợ hơi, chán ăn, tiêu chảy, rêu trắng nê, mạch trầm hoạt. Thức ăn đình trệ, vị trọc không giáng uất hóa nhiệt sinh chua.

3. **Đàm trọc nội trở**: nôn ra nước trong, đàm dãi kèm đầy tức bụng không ăn được, hoa mắt, tâm quý, rêu trắng, mạch hoạt. Tỳ bất kiện vận, thủy thấp ngưng kết thành đàm, thanh dương bất thăng.

4. **Can khí phạm vị** (can mộc khắc vị thổ): nôn ói ra đồ ăn chua, ợ hơi liên tục kèm trướng đầy sườn lặc, nóng nảy dễ cáu, đỏ hai rìa lưỡi, rêu mỏng nê, mạch trầm huyền. Vị phủ đình uất hóa nhiệt sinh chua, can khí uất gây đau sườn.

5. **Tỳ vị hư hàn**: nôn ói, ăn hơi nhiều là ói ngay, lúc phát lúc nghỉ, kèm sắc mặt trắng nhợt, uể oải co ro phạt lực, tứ chi không ấm, đại tiện lỏng, lưỡi nhạt, mạch nhu. Trung dương bất chấn, trong không đủ sức tiêu hóa, ngoài không ôn tứ chi.

6. **Vị âm bất túc**: nôn ói có lúc nôn khan kèm miệng họng khô táo như đói mà không muốn ăn, ngũ tâm phiền nhiệt hoặc triều nhiệt đạo hạn, người gầy ốm, lưỡi đỏ. Vị thất nhu nhuận, khí thất hòa giáng.

7. **Vị táo tân khô** (bệnh nặng hơn, giống vị âm hư nhưng bệnh trình dài hơn): nôn ói lâu ngày không khỏi, khi nôn hết thì vị mới yên kèm gầy ốm, hoa mắt, tâm phiền mất ngủ, phạt lực, lưỡi đỏ ít tân, mạch tế sác.

PHÂN BIỆT CHỦ YẾU: Thực chứng (ngoại tà phạm vị kèm ố hàn sốt biểu chứng; thực trệ vị quản có bụng trướng đầy ợ hơi ợ chua; đàm trọc nội trở có đàm dãi nhiều hoa mắt tâm quý; can khí phạm vị có ngực sườn đau, mạch huyền). Hư chứng (tỳ vị khí hư hoặc âm hư hóa táo — phân biệt theo kiêm chứng: mặt trắng chi lạnh tiêu chảy = tỳ vị khí hư; miệng họng khô táo ngũ tâm phiền nhiệt, nhẹ = vị âm bất túc, nặng = vị táo tân khô).`,
      keyPoints: "Ẩu thổ: Thực chứng (ngoại tà/thực trệ/đàm trọc/can khí phạm vị — mỗi loại có dấu hiệu thực tà riêng) vs Hư chứng (tỳ vị khí hư: mặt trắng chi lạnh tiêu chảy; vị âm hư/táo tân khô: khô miệng phiền nhiệt, mức độ nặng dần theo bệnh trình)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tiết Tả (Tiêu Chảy, 7 chứng)",
      category: cat,
      summary: "Tiết tả (số lần đại tiện tăng, phân lỏng — tiết đi như nước hòa hoãn hơn, tả mãnh liệt hơn) do ngoại cảm (hàn/thấp/nhiệt-thử/thương thực) và nội thương (tỳ hư/thận dương hư/can khí phạm tỳ).",
      content: `TIẾT TẢ: số lần đại tiện tăng, phân lỏng, thậm chí tiêu ra nước. Cổ nhân phân biệt: TIẾT đi như nước, hơi hòa hoãn; TẢ tương đối mãnh liệt — khác nhau về mức độ nhưng cùng bản chất bệnh nên gọi chung "tiết tả". Nguyên nhân: ngoại cảm hàn/thấp/thử/nhiệt làm trung dương bị át, tỳ thất kiện vận; hoặc thương tổn ẩm thực, tỳ vị bất hòa, đại trường truyền đạo giảm; hoặc can khí phạm tỳ; hoặc tỳ hư, thận dương bất túc mệnh môn hỏa suy.

7 chứng thường gặp:

1. **Hàn tả**: tả loãng, màu trắng, không hôi, hoặc kèm thức ăn không tiêu (như phân vịt, nước trong), kèm sôi bụng, đau bụng thích ấm, úy hàn, mặt trắng chi lạnh, lưỡi nhạt rêu trắng, mạch trầm trì. Trung tiêu hàn thịnh tỳ vị dương hư không mục chín tiêu hóa, thanh trọc không phân.

2. **Thấp tả**: tả như nước, số lần tăng nhiều, kèm ngực bụng đầy tức, tay chân mình mẩy tê nặng nề, sôi bụng, đau nhẹ hoặc không đau, lưỡi nhạt, mạch hoãn. Thấp thịnh thương tỳ, thanh trọc không phân, thủy dịch đi thẳng xuống trường.

3. **Nhiệt tả hoặc thử tả**: tiêu chảy phân loãng vàng mùi hôi thối cực kỳ, hậu môn nóng rát, kèm sốt, miệng khát uống nhiều, có lúc buồn nôn, tiểu ngắn đỏ sáp đau, lưỡi đỏ, mạch sác. Hỏa nhiệt/thử tà thương tổn trường vị, nhiệt uẩn bên trong làm thức ăn nát như cháo hôi thối.

4. **Thương thực tả**: tả phân lỏng kèm thức ăn không tiêu, trung tiện liên tục hôi thối, kèm ợ hơi đồ ăn thiu, ợ chua, ngực bụng bào muộn (xốn xang), rêu vàng, mạch hoạt. Ăn quá no thương tổn tỳ vị, chức năng thu nạp-hủ thục-hóa vật-truyền đạo xáo trộn.

5. **Tỳ hư tả**: tiêu phân lúc lỏng lúc toàn nước kèm không muốn ăn uống, bụng căng trướng khó chịu, sau ăn sắc mặt vàng úa lừ đừ uể oải, lưỡi nhạt, rêu vàng, mạch hoãn nhược. Tỳ vị hư nhược không tiêu hóa thủy cốc.

6. **Thận tiết** (ngũ canh tả): tiêu phân lỏng hoặc có đồ ăn chưa tiêu, thường vào bình minh, đau dưới rốn, bụng sôi là đi tiêu, dễ chịu sau đi tiêu, kèm hình hàn chi lạnh, lưỡi nhạt rêu trắng, mạch trầm trì. Thận dương bất túc mệnh môn hỏa suy — trước bình minh dương khí chưa hồi phục âm khí cực thịnh.

7. **Can tả** (thống tả): tiêu chảy bụng đau sôi ruột, hết đau sau đi tiêu, kèm đau sườn bĩ muộn, ợ hơi ăn ít, mỗi khi cáu giận là bụng đau đi tiêu ngay, lưỡi nhạt ít rêu, mạch trầm huyền. Can thất điều đạt hằng nghịch phạm tỳ.

PHÂN BIỆT CHỦ YẾU: Hàn tả (phân lỏng nước hoặc tiêu phân sống, hình hàn chi lạnh, lưỡi nhạt mạch trầm trì). Thấp tả (phân lỏng như nước, sôi bụng hơi đau, mạch trầm hoãn). Nhiệt/thử tả (phân lỏng vàng như cháo kê hôi thối, lưỡi đỏ mạch sác). Thương thực tả (thức ăn không tiêu + tiền sử ăn quá no). Tỳ tả (phân lỏng, ăn kém, ăn vào bụng căng tức). Thận tả/ngũ canh tả (tiêu chảy lúc hừng đông, đau bụng là đi tiêu). Can tả/thống tả (đau bụng là tiêu chảy, đau 1 trận tiêu 1 trận, hoặc tức giận lập tức đau bụng tiêu chảy).`,
      keyPoints: "Tiết tả: ngoại cảm (hàn/thấp/nhiệt-thử) phân biệt theo tính chất phân và mạch; nội thương (thương thực/tỳ hư/thận tả-ngũ canh/can tả-thống tả) phân biệt theo thời điểm và yếu tố kích phát\n'Ngũ canh tả' (tiêu chảy lúc hừng đông) = đặc trưng thận dương hư; 'Thống tả' (đau bụng rồi tiêu, liên quan cảm xúc) = đặc trưng can tả",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Ẩu Thổ (8 chứng) và Tiết Tả (7 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

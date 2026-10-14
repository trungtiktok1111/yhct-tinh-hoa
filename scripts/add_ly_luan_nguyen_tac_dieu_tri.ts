// Thêm "Nguyên tắc điều trị chung" + "Bát pháp — các phương pháp điều trị cơ bản"
// từ NGUYEN TAC DIEU TRI.pptx (ThS Võ Thanh Phong, 27 slide). Trích nguyên văn,
// không bịa thêm. Không tạo TreatmentPrinciple trùng tên với các pháp trị đã có
// sẵn trong DB (Giải biểu, Thanh nhiệt, Tả hạ, Hòa giải, Ôn lý, Bổ, Tiêu đạo, Lý
// khí, Lý huyết, Cố sáp...) — nội dung này là lý luận tổng quan, lưu vào TheoryTopic.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Nguyên tắc điều trị",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Vương Vĩnh Viêm, Lỗ Triệu Lân (2008) Trung y nội khoa học; Trần Quốc Bảo (2010) Lý luận cơ bản YHCT",
      locator: "27 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Nguyên tắc điều trị chung",
      category: "Bát pháp - Nguyên tắc điều trị",
      summary: "Các nguyên tắc nền tảng chi phối việc chọn phương pháp điều trị trong YHCT, trước khi áp dụng các pháp trị cụ thể.",
      content:
        "Trị bệnh nghi tảo: trị bệnh sớm lúc bệnh còn nhẹ, trị lúc triệu chứng mới phát hoặc thậm chí chưa phát. " +
        "Chính trị và Phản trị: trị bệnh phải tìm nguyên nhân căn bản, nhắm vào nguyên nhân/cơ chế bệnh sinh. Chính trị — áp dụng nguyên tắc điều trị ngược lại tính chất bệnh, khi bản chất bệnh và triệu chứng lâm sàng thống nhất với nhau. Phản trị — dùng khi có hiện tượng chân giả, khi bản chất bệnh và triệu chứng lâm sàng không thống nhất (biểu hiện trái ngược bản chất). " +
        "Tiêu và Bản: Tiêu là hiện tượng/triệu chứng xuất hiện trên lâm sàng; Bản là cơ chế phát sinh bệnh, bản chất của bệnh. Nguyên tắc 'Cấp tắc trị kỳ tiêu, hoãn tắc trị kỳ bản' — nếu triệu chứng nguy cấp ảnh hưởng tính mạng thì giải quyết triệu chứng đó trước; nếu bệnh mạn tính hoặc diễn tiến ổn định thì trị vào bản chất. " +
        "Phù chính khứ tà: Phù chính là phương pháp bổ dùng cho hư chứng; phát bệnh là quá trình đấu tranh chính khí và tà khí, chính khí thắng thì tà khí lui nên phù chính cũng chính là khứ tà. Phù chính (bổ pháp): ích khí, dưỡng huyết, tư âm, trợ dương. Khứ tà (tả pháp): phát hãn, công hạ, thẩm thấp, lợi thủy, tiêu đạo, hóa ứ. Nguyên tắc: phù chính không để lưu tà, khứ tà không để tổn thương chính khí — có thể tiên công hậu bổ, tiên bổ hậu công, hoặc công bổ kiêm thi (tùy ca). " +
        "Vận dụng Ngũ hành sinh khắc làm nguyên tắc bổ tả: các tạng phủ có quan hệ tương hỗ sinh lý/bệnh lý; 'Hư tắc bổ kỳ mẫu, thực tắc tả kỳ tử'; tráng thủy chế dương và ích hỏa tiêu âm; tư thận âm để trị dương vượng; bổ thận dương trừ thủy ẩm đình trệ; tả biểu an lý, khai lý thấu biểu. " +
        "Điều hòa âm dương: khi âm dương thiên thịnh thì ức chế phần thịnh, tổn phần thịnh; khi bất túc thì bổ phần bất túc (bổ âm, bổ dương, hoặc âm dương song bổ) — 'dương trung cầu âm, âm trung cầu dương'. " +
        "Điều hòa khí huyết: Khí bệnh — khí hư tắc bổ, khí trệ tắc sơ, khí hãm tắc thăng, khí nghịch tắc giáng, khí thoát tắc cố, khí bế tắc khai. Huyết bệnh — huyết hư tắc bổ, huyết thoát tắc cố, huyết ứ tắc hành, huyết hàn tắc ôn, huyết nhiệt tắc lương (và xuất huyết — chỉ huyết, phần sau bị cắt trong slide gốc). " +
        "Dị pháp phương nghi: điều trị không thể chỉ dùng 1 phương pháp cố định — mỗi cá thể, thời gian, địa lý khác nhau cần phương pháp khác nhau ('nhân nhân chế nghi, nhân thời chế nghi').",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  type Method = { name: string; mechanism: string; applications: string; cautions: string };
  const methods: Method[] = [
    { name: "Giải biểu", mechanism: "Thông qua phát hãn, khai tấu lý, đẩy bệnh ra ngoài.", applications: "Giải biểu, Thấu chẩn, Khứ thấp tà, Tiêu thũng.", cautions: "Khi biểu chứng kèm chứng khác cần phối hợp phương pháp khác; lấy hãn xuất tà khứ làm mốc, không dùng quá liều để phòng ra mồ hôi nhiều." },
    { name: "Thanh nhiệt", mechanism: "Giải trừ nhiệt chứng bằng thuốc có tác dụng hàn lương tả nhiệt.", applications: "Thanh nhiệt khí phần, Thanh dinh lương huyết, Thanh nhiệt giải độc, Thanh nhiệt tạng phủ.", cautions: "Phân biệt hàn nhiệt chân giả; không dùng khi biểu tà chưa giải mà dương khí bế uất gây phát sốt, hoặc tạng phủ suy gây phát hư nhiệt; chú ý thêm tư âm khi cần." },
    { name: "Công hạ", mechanism: "Thông qua thông đại tiện, hạ tích, tả thực, trục thủy để tiêu trừ táo bón, tích trệ, thực nhiệt và thủy ẩm.", applications: "Hàn hạ, Ôn hạ, Nhuận hạ, Trục thủy.", cautions: "Không dùng khi tà khí còn ở biểu/bán biểu bán lý; không dùng khi táo bón do tân dịch khô, bẩm tố suy nhược, dương hư; không dùng quá liều tránh chấn thương chính khí." },
    { name: "Hòa giải", mechanism: "Hòa giải chứng Thiếu dương, phò chính đạt tà, điều hòa chức năng tạng phủ.", applications: "Hòa giải Thiếu dương, Điều hòa Can Tỳ, Điều hòa Trường Vị.", cautions: "Không dùng khi tà khí chưa nhập Thiếu dương; khi tà tại Thiếu dương nhưng thiên biểu/thiên lý, thiên hàn/thiên nhiệt phải gia giảm thích hợp." },
    { name: "Ôn lý", mechanism: "Khứ trừ hàn tà và ôn bổ dương khí.", applications: "Ôn trung khứ hàn, Ôn kinh tán hàn, Hồi dương cứu nghịch.", cautions: "Không dùng khi nhiệt phục ở trong (chân nhiệt giả hàn); hàn nặng thì dùng ôn pháp nhanh mạnh nhưng dễ tổn hao âm huyết/tân dịch; hàn mà không hư dùng ôn pháp, hàn mà hư dùng cam ôn." },
    { name: "Bổ", mechanism: "Bổ âm dương khí huyết không đủ của tạng bị hư tổn.", applications: "Bổ khí, Bổ huyết, Bổ dương, Bổ âm.", cautions: "Cần xác định rõ hư tổn của tạng phủ nào để bổ đúng; chú ý mối quan hệ âm dương, khí huyết với nhau." },
    { name: "Tiêu đạo", mechanism: "Thông qua tiêu đạo và tán kết làm thực tà tích tụ bên trong dần tiêu tán.", applications: "Tiêu thực đạo trệ, Tiêu thạch tán kết, Lợi thủy tiêu thũng.", cautions: "Phân biệt rõ hư thực: Tỳ hư tích trệ → kiện Tỳ tiêu thực; Tỳ hư thủy thũng → bổ thổ lợi thủy; Thận hư thủy thũng → ôn Thận hành thủy." },
    { name: "Lý khí", mechanism: "Phương pháp điều chỉnh khí cơ.", applications: "Hành khí giải uất, Giáng khí nghịch, Ích khí thăng dương.", cautions: "Phân biệt rõ hư thực; thuốc lý khí đa phần khô táo dễ tổn thương âm dịch." },
    { name: "Lý huyết", mechanism: "Điều chỉnh phần huyết để giải quyết ứ huyết và các loại xuất huyết.", applications: "Hoạt huyết khử ứ, Chỉ huyết.", cautions: "Hành khí để hoạt huyết ('huyết đắc ôn tắc hành'); không dùng cho phụ nữ có thai." },
    { name: "Cố sáp", mechanism: "Thông qua thu liễm cố sáp để giải trừ bệnh chứng hoạt thoát.", applications: "Cố biểu liễm hãn, Sáp trường chỉ tả, Sáp tinh chỉ di.", cautions: "Chỉ trị tiêu, cần thêm trị bản; không dùng khi nhiệt bệnh phát hãn, thương thực tiêu chảy, hỏa động di tinh." },
    { name: "Khai khiếu", mechanism: "Khai khiếu thông bế để làm thần trí tỉnh lại.", applications: "Lương khai, Ôn khai.", cautions: "Cần biện luận kết hợp thêm thanh nhiệt, thông tiện, lương Can tức phong, hóa đàm." },
    { name: "Trấn kinh (bình Can tức phong)", mechanism: "Thông qua bình Can tức phong, khứ phong thông lạc để giải trừ co giật tứ chi, huyễn vựng, run, miệng méo, mắt không nhắm.", applications: "Thanh nhiệt tức phong, Trấn Can tức phong, Dưỡng huyết tức phong, Hoạt huyết tức phong, Khứ phong giải kinh.", cautions: "Phân biệt nội phong và ngoại phong; thuốc khứ phong phần nhiều tính ôn táo (chi tiết lưu ý bị cắt trong slide gốc)." },
  ];

  await prisma.theoryTopic.create({
    data: {
      name: "Bát pháp — các phương pháp điều trị cơ bản",
      category: "Bát pháp - Nguyên tắc điều trị",
      summary: "12 phương pháp điều trị thường dùng trong YHCT (mở rộng từ Bát pháp cổ điển): Giải biểu, Thanh nhiệt, Công hạ, Hòa giải, Ôn lý, Bổ, Tiêu đạo, Lý khí, Lý huyết, Cố sáp, Khai khiếu, Trấn kinh.",
      content: methods.map((m) => `${m.name}: ${m.mechanism} Ứng dụng: ${m.applications}`).join("\n"),
      keyPoints: methods.map((m) => `${m.name} — Lưu ý: ${m.cautions}`).join("\n"),
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm Nguyên tắc điều trị chung + Bát pháp (12 phương pháp điều trị).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Thêm nội dung từ "Ứng dụng kỳ kinh bát mạch trong điều trị bệnh.docx" (ThS.Bs
// Nguyễn Văn Đàn — ĐH Y Dược TP.HCM / BV Thống Nhất). File là bản docx có nhiều
// đoạn OCR lỗi từ bảng/hình ảnh (vd "Scanned with CamScanner", chữ Anh lẫn lộn) —
// CHỈ trích các đoạn văn xuôi tiếng Việt rõ nghĩa, bỏ qua hoàn toàn các đoạn OCR
// bảng bị lỗi để không bịa/suy diễn sai nội dung y khoa.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function point(name: string, sourceId: string) {
  let p = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!p) p = await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId } });
  return p;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Ứng dụng kỳ kinh bát mạch trong điều trị",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Nguyễn Văn Đàn — Phó Trưởng YHCT ĐH Y Dược TP.HCM, Trưởng khoa YHCT BV Thống Nhất",
      usageRights: "Tài liệu nội bộ người dùng cung cấp — file docx có OCR lỗi ở phần bảng/hình, chỉ trích phần văn xuôi rõ nghĩa",
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: {
      name: "Kỳ kinh bát mạch — nguyên tắc chọn huyệt mở",
      description:
        "Nan Kinh 27-28: Kỳ kinh bát mạch không bị ràng buộc với 12 Kinh Chính, là chỗ 'cứu nguy' cho 12 Kinh Chính khi khí ở các kinh này quá thịnh, kinh mạch không thông được thì khí sẽ chảy vào Kỳ Kinh Bát Mạch (như biển chứa nước từ các nơi dâng lên đổ về). Kỳ Kinh Bát Mạch liên hệ với ngũ tạng lục phủ (qua Xung Mạch), với 12 Kinh qua Dương Duy và Âm Duy Mạch.",
      goal:
        "Khi nào nên dùng Kỳ kinh bát mạch: (1) nếu bệnh lý rõ ràng chỉ ảnh hưởng 1 Kinh chính thì chỉ cần dùng Kinh chính đó; (2) nếu ảnh hưởng nhiều hơn 1 kinh, nên xem xét dùng Kỳ kinh bát mạch vì nó là 'hồ chứa' khí huyết từ nhiều Kinh chính đổ về; (3) dùng trong bệnh lý phức tạp, mãn tính, nhiều hội chứng/triệu chứng ở nhiều vùng cơ thể khác nhau; (4) Hàn-Nhiệt, Hư-Thực thác tạp, bệnh lý tâm thần kinh. Thực tế lâm sàng: có bệnh thuộc Kinh Lạc nhưng điều chỉnh ở Kinh Lạc chỉ bớt không hết hẳn, điều chỉnh ở Kỳ Kinh Bát Mạch mới khỏi hoàn toàn (vd sốt kéo dài không rõ nguyên nhân, châm Đại Chùy hạ sốt vì tuy thuộc Mạch Đốc nhưng là nơi hội của 6 kinh Dương).",
      scope:
        "4 cách sử dụng huyệt: (1) đơn huyệt mở của chính kỳ kinh bệnh, hai bên (vd Liệt khuyết LU-7 khi Nhâm mạch bệnh); (2) huyệt mở + huyệt phối hợp hai bên (vd Liệt khuyết LU-7 + Chiếu hải KI-6) — dùng cho nhiều loại bệnh lý; (3) huyệt mở + huyệt phối hợp một bên và bắt chéo (vd Liệt khuyết 1 bên + Chiếu hải bên kia) — phù hợp vấn đề đầu mặt/nội tạng, đặc biệt thích hợp trẻ em, người già, người yếu/lo lắng; (4) huyệt mở + huyệt phối hợp cùng 1 bên — phù hợp vấn đề biểu hiện 1 bên (lưng, chân tay, đau lưng, bong gân).",
      limitations:
        "Ví dụ lâm sàng: ban đêm không ngủ được, mắt không nhắm được do mạch Âm Kiều hư → bổ Chiếu Hải. Ban ngày không ngủ được do mạch Dương Kiều thực → tả Thân Mạch. Ngoại cảm gây sốt do mạch Dương Duy rối loạn → tả Ngoại Quan. Cổ đau cứng do Đốc Mạch rối loạn → tả Hậu Khê. Ca minh họa: phụ nữ chảy máu nướu răng (Vị nhiệt) + huyết trắng vàng hôi (thấp nhiệt hạ tiêu) — tuy 2 hội chứng khác nhau nhưng cùng thuộc vùng ảnh hưởng của Nhâm mạch → dùng Liệt Khuyết + Chiếu Hải trước, có thể thêm Hợp cốc, Âm lăng tuyền, Túc tam lý, Quan nguyên.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  const pairs: { gate: string; coupled: string; mach: string }[] = [
    { gate: "Liệt khuyết", coupled: "Chiếu hải", mach: "Nhâm mạch — Âm kiểu mạch" },
    { gate: "Công tôn", coupled: "Nội quan", mach: "Xung mạch — Âm duy mạch" },
    { gate: "Hậu khê", coupled: "Thân mạch", mach: "Đốc mạch — Dương kiểu mạch" },
    { gate: "Túc lâm khấp", coupled: "Ngoại quan", mach: "Đái mạch — Dương duy mạch" },
  ];
  for (const p of pairs) {
    const protocol = await prisma.pointProtocol.create({
      data: { name: `Bát mạch giao hội huyệt — ${p.gate} + ${p.coupled} (${p.mach})`, goal: p.mach, status: "DRAFT", sourceId: source.id, principleId: principle.id },
    });
    for (const name of [p.gate, p.coupled]) {
      await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: (await point(name, source.id)).id } });
    }
  }

  // ================= Kỹ thuật bổ tả nâng cao (thủ pháp châm cứu phức hợp) =================
  type Technique = { name: string; englishName?: string; indications: string; actions: string; procedure: string };
  const techniques: Technique[] = [
    {
      name: "Thiêu sơn hỏa",
      indications: "Hàn chứng, dương khí hư suy",
      actions: "Làm ấm dương khí",
      procedure:
        "(Thái Ất Thần Châm) Chọn 1 huyệt sâu khoảng 1,5 thốn: châm qua da, sâu 0,5 thốn (Thiên bộ) kéo kim lên xuống 9 lần; châm sâu thêm 0,5 thốn (Nhân bộ) lên xuống 9 lần; châm sâu thêm 0,5 thốn còn lại (Địa bộ) làm như trên. Có thể lặp lại đến khi có cảm giác nóng dưới thân kim (tối đa 3 lần). Khi rút kim bịt kín lỗ kim lại. Thuần Bổ: 'tam đề nhất sáp' (3 lần nâng, 1 lần đẩy). Chỉ thích hợp vùng cơ/mô liên kết sâu, không áp dụng mặt hoặc mặt lưng bàn tay/chân.",
    },
    {
      name: "Thấu thiên lương",
      englishName: "(đối lập với Thiêu sơn hỏa)",
      indications: "Chứng nhiệt",
      actions: "Tả hỏa khí",
      procedure:
        "(Thái Ất Thần Châm) Châm sâu đến Địa bộ (1,5 thốn): đẩy nhẹ, rút nhanh, lên xuống đúng 6 lần; rút lên Nhân bộ (1 thốn) làm như trên; rút lên Thiên bộ (0,5 thốn) làm như trên. Lặp lại đến 3 lần cho đến khi có cảm giác lạnh dưới đầu kim. Khi rút kim nên lắc kim cho to ra, không bịt lỗ kim. Thuần Tả: 'tam sáp nhất đề' (3 lần đẩy, 1 lần nâng). Khẩu quyết: ba nâng một đẩy thiêu sơn hỏa, ba đẩy một nâng thấu thiên lương; nâng kim thở ra đẩy kim hít; nữ dùng sau ngọ nam trước trưa; thiêu sơn ngày dương dùng số âm, thấu thiên ngày âm dùng số dương.",
    },
    {
      name: "Thanh long bãi vĩ",
      englishName: "Wagging the Tail of the Dragon",
      indications: "Khí huyết ứ trệ",
      actions: "Hành khí, thông quan tiết, vận hành khí huyết",
      procedure:
        "(Thái Ất Thần Châm) Châm từ Thiên bộ vào Nhân bộ, nếu đắc khí thì rút về Thiên bộ (nếu bộ vị cạn mà đắc khí thì không rút); hướng mũi kim về nơi có bệnh, không tiến không thoái, cầm chuôi kim lắc qua trái phải thật chậm 9 lần (tối đa 9x9 = 81 lần).",
    },
    {
      name: "Bạch hổ giao đầu",
      englishName: "White Tiger Shakes his Head",
      indications: "Khí huyết ứ trệ",
      actions: "Hành huyết, thông quan tiết, vận hành khí huyết",
      procedure:
        "(Thái Ất Thần Châm) Châm kim vào huyệt đạt độ sâu thích hợp, lắc kim sang trái rồi sang phải 6 lần (hoặc 3x6=18 lần). Khác Thanh long bãi vĩ: châm kim thẳng và lắc kim nhanh. Muốn khí lên trên: ngón trỏ ấn dưới đường kinh đang châm; muốn khí xuống dưới: ấn bên trên đường kinh đang châm.",
    },
    {
      name: "Xích phụng nghênh nguyên",
      englishName: "Red Phoenix Welcome Source / Peacock's Fantail",
      indications: "Kinh khí ủng tắc",
      actions: "Hành lạc mạch, thông quan tiết, vận hành khí huyết",
      procedure:
        "Châm vào Địa bộ rồi rút lên Thiên bộ, đợi đắc khí thì châm đến Nhân bộ; kết hợp xoay kim trên-dưới, trái-phải tốc độ nhanh. Bệnh ở phần trên: đợi bệnh nhân hít vào thì xoay phải và rút kim. Bệnh ở phần dưới: đợi bệnh nhân thở ra thì xoay trái và châm kim.",
    },
    {
      name: "Thương quy thám huyệt",
      englishName: "Tortoise Detects the Point / Turtle Probing the Cave",
      indications: "Thông kinh lạc, huyết trệ",
      actions: "Lưu hành kinh mạch, thông quan tiết, bổ sung nguyên khí cho kinh mạch",
      procedure:
        "Châm từ cạn xuống sâu (thượng xuống hạ), từ trái sang phải, chia 3 bộ, xuống chậm lên nhanh; mỗi lần đổi hướng rút kim đến dưới da rồi mới đổi hướng.",
    },
    {
      name: "Long hổ giao chiến",
      englishName: "Battle of the Dragon and Tiger",
      indications: "Các chứng đau",
      actions: "Sơ thông kinh khí, chỉ thống",
      procedure:
        "(Thái Ất Thần Châm) Sau khi đắc khí: trước dùng 'thanh long' để bổ (xoay kim thuận chiều kim đồng hồ 9 lần), sau dùng 'bạch hổ' để tả (xoay kim ngược chiều 6 lần). Có thể làm nhiều lần; nặng thì dùng thiên-nhân-địa. Sau khi hoàn thành, giữ kim 20-30 phút.",
    },
    {
      name: "Long hổ thăng giáng",
      englishName: "Dragon Tiger Ascending and Descending",
      indications: "Âm dương thất điều, doanh vệ bất hòa",
      actions: "Điều hòa âm-dương, sơ thông kinh khí",
      procedure:
        "(Châm cứu học Thượng Hải) Châm vào Thiên bộ, xoay kim 1 vòng về tả, châm chậm xuống Nhân bộ rồi rút lên Thiên bộ, xoay 1 vòng về hữu (làm 9 lần). Sau đó châm xuống Địa bộ, xoay sang hữu 1 lần, lên kim nhanh xuống chậm xoay sang trái 1 lần (làm 6 lần). Sau cùng dùng phép búng kim.",
    },
    {
      name: "Tý ngọ đảo cữu",
      indications: "Chứng thủy cổ trướng (thủy độc kết tụ, bụng trướng đại, khát nước, tân dịch hao tổn, bì phu khô)",
      actions: "Điều hòa âm dương, sơ thông kinh khí",
      procedure:
        "(Thái Ất Thần Châm) Khi đắc khí, xoay kim hướng tả 9 lần, ngưng lại một chút; rút kim lên xoay hữu 6 lần. Có thể làm nhiều lần.",
    },
    {
      name: "Dương trung ẩn âm",
      englishName: "Yang within Yin",
      indications: "Tiên hàn hậu nhiệt, hoặc trong hư có thực — bệnh gây suy nhược cơ thể và phát sinh triệu chứng nhiệt",
      actions: "Tiền bổ hậu tả",
      procedure:
        "Châm vào 5 phân, về kim 9 lần (ngón trỏ ra sau, ngón cái ra trước, về chậm); rồi châm sâu 1 thốn, về kim 6 lần (ngón trỏ ra trước, ngón cái ra sau). Có thể lặp lại nhiều lần.",
    },
    {
      name: "Âm trung ẩn dương",
      indications: "Tiên nhiệt hậu hàn — bệnh nhân rối loạn nhiệt làm suy nhược cơ thể, tạo chứng rối loạn cảm lạnh",
      actions: "Tiên tả hậu bổ",
      procedure:
        "Châm sâu 1 thốn (Nhân bộ), dùng thủ pháp tả (châm xuống chậm, rút lên nhanh) 6 lần; rút lên 5 phân (Thiên bộ), dùng thủ pháp bổ (châm xuống nhanh, rút lên chậm) 9 lần. Có thể lặp lại nhiều lần.",
    },
  ];

  for (const t of techniques) {
    await prisma.manualTherapy.create({
      data: {
        name: t.englishName ? `${t.name} (${t.englishName})` : t.name,
        techniqueType: "Thủ pháp châm cứu bổ tả kép (Thái Ất Thần Châm / Châm cứu học Thượng Hải)",
        indications: t.indications,
        sequence: t.procedure,
        durationForce: t.actions,
        status: "DRAFT",
        sourceId: source.id,
      },
    });
  }

  console.log(`Đã thêm lý luận Kỳ kinh bát mạch + 4 bát mạch giao hội huyệt + ${techniques.length} thủ pháp châm cứu bổ tả kép.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

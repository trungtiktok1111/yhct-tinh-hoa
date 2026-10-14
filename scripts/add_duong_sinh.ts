// Thêm "Phương pháp dưỡng sinh" (Bài 7-8-9, Bs Tô Hùng Vinh): nguyên tắc dưỡng
// sinh YHCT + 2 kỹ thuật cụ thể (Thở khí công, Thư giãn). Trích nguyên văn, không
// bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Phương pháp dưỡng sinh",
      sourceType: "Bài giảng",
      authorOrOrg: "Bs. Tô Hùng Vinh",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: {
      name: "Dưỡng sinh Y học cổ truyền — nguyên tắc chung",
      description:
        "Phương pháp rèn luyện cơ thể toàn diện để bảo vệ sức khỏe. Tuệ Tĩnh: 'Bế tinh, dưỡng khí, tồn thần — Thanh tâm, quả dục, thủ chân, luyện hình'. Nguyễn Văn Hưởng: kết hợp kinh nghiệm YHCT dân tộc với khí công, xoa bóp Trung Quốc. 7 nội dung: (1) Ăn uống đúng cách — dinh dưỡng vừa đủ (thiếu/thừa đều có hại), ăn sạch nhai kỹ, hạn chế rượu bia/thuốc lá/chất kích thích. (2) Thở đúng cách — xem Luyện khí. (3) Nghỉ đúng cách — xem Luyện tâm. (4) Biết cách lao động — năng suất cao nhưng không lãng phí sức lực, xen kẽ nghỉ ngơi điều độ, sắp xếp thời gian hợp lý. (5) Hàng ngày tự vận động và xoa bóp — nâng cao chuyển hóa toàn thân, chống xơ cứng/lão hóa; nguyên tắc tập: tập trung ý kết hợp thở và vận động. (6) Có cách nhìn đúng đắn (phòng ngừa nội nhân) — theo YHCT: vui quá hại Tâm, sợ quá hại Thận, giận quá hại Can, lo lắng quá hại Phế, suy nghĩ nhiều hại Tỳ Vị; giữ tinh thần vui vẻ nhưng không thái quá ('cực thịnh tất khởi suy, cực suy tất khởi thịnh'). (7) Biết chống tác nhân gây bệnh — giữ vệ sinh cá nhân/hoàn cảnh, giữ sức khỏe trước thời tiết/vi khuẩn/virus.",
      goal: "Tu dưỡng tinh thần, rèn luyện thân thể, ăn uống và làm việc điều độ, thích ứng với sự thay đổi của hoàn cảnh.",
      scope:
        "Ngũ hành và cảm xúc: cảm xúc = sự thay đổi năng lượng tâm sinh lý, tương ứng 5 quá trình chuyển hóa trong Ngũ hành; mỗi cơ quan/hành ứng 1 cảm xúc, có 2 mặt cân bằng/mất cân bằng. Vượt trội 1 cảm xúc có thể phá vỡ cân bằng theo vòng tương khắc (vd quá thẳng tính mất tình yêu thương; vui mừng thái quá phá hủy tư cách; yêu thương mù quáng mất khả năng thích ứng). Có thể xoa dịu cảm xúc bằng cách tạo cảm xúc khác cân bằng (để không thất vọng hãy yêu thương; để không lo sợ hãy sống có phẩm cách; để không giận giữ hãy học chấp nhận/thích ứng; để không cuồng loạn cần thẳng thắn; để không đau khổ cần niềm vui).",
      limitations:
        "Thơ Hải Thượng Lãn Ông (dẫn trong bài, trích ý): nội thương phát sinh thường do xúc động thất tình; cần tiết dục thanh tâm, giữ liêm chính, không tham tài/danh lợi/sắc đẹp để giữ tinh-khí-thần; hàng ngày luyện khí (hít thanh khí, thải trược khí) làm khí huyết điều hòa, tinh thần vững, bệnh tà khó xâm; cần tiết chế nói năng, tránh làm quá sức, tránh thức khuya lo nghĩ nhiều và say mê sắc dục (đều hại Tâm).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Thở khí công dưỡng sinh (Luyện khí)",
      techniqueType: "Khí công — thở có điều khiển bằng ý thức",
      indications:
        "Đưa oxy vào cơ thể tốt hơn; thay đổi áp lực ổ bụng để xoa bóp nội tạng; luyện tập quá trình hưng phấn-ức chế của hệ thần kinh có ý thức, điều hòa lại sự mất cân bằng của hệ thần kinh.",
      sequence:
        "Nguyên tắc: có thể thở khí công ở bất cứ tư thế nào (nhất là khi đã luyện quen); tập trung tư tưởng điều khiển và theo dõi hoàn toàn sự thở, tránh tiếp nhận kích thích ngũ quan; thở bụng bằng cơ hoành là chủ yếu. 3 cách thở: (1) Thở bụng đơn thuần; (2) Thở bụng kết hợp thở ngực; (3) Thở nén — căng cứng bụng, tăng áp lực khoang bụng-ngực ép vào nội tạng (như khi nhắc vật nặng, khi đại tiện rặn, phụ nữ khi đẻ) — tốt cho người khỏe mạnh bình thường.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Thư giãn (Luyện tâm)",
      techniqueType: "Tập thư giãn chủ động làm mềm cơ bắp",
      indications: "Thần kinh căng thẳng → cơ bắp co cứng; cơ bắp giãn mềm → thần kinh thư thái (và ngược lại) — dùng để chủ động đưa tinh thần vào trạng thái thư thái, hỗ trợ chữa bệnh.",
      sequence:
        "Cách 1 — Ba đường làm giãn: Đường 1: đỉnh đầu → hai má → bên cổ → vai → cánh tay → cẳng tay → bàn tay → ngón tay. Đường 2: đỉnh đầu → mắt → miệng → ngực → bụng → đùi → cẳng chân → bàn chân → ngón chân. Đường 3: đỉnh đầu → gáy → lưng → mông → sau đùi → bắp chân → gót chân. Cách 2 — Phương pháp 6 bước: bắt đầu bằng thở vào sâu (các bước tiếp theo không còn đầy đủ trong tài liệu gốc).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm nguyên tắc Dưỡng sinh YHCT + 2 kỹ thuật (Thở khí công, Thư giãn).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

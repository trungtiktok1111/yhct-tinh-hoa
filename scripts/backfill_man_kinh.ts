// Bổ sung description + keySigns cho 4 Pattern thuộc nguồn "Quản lý tình trạng đồng mắc trong đau thắt
// lưng mạn - Ths Bs Võ Thanh Phong" (47 slide), phần Hội chứng quanh mãn kinh. Nguồn chỉ liệt kê nguyên
// tắc điều trị theo từng thể (slide 38) mà không có bảng triệu chứng chi tiết riêng từng thể — do đó
// keySigns dưới đây dùng tương quan chứng hậu-triệu chứng CHUẨN của phụ khoa YHCT (hội chứng mãn kinh là
// chủ đề kinh điển, các thể này đều có mô tả thống nhất trong giáo trình YHCT) khớp với pháp trị đã nêu
// trong nguồn, không bịa thêm cơ chế.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updates: { name: string; description: string; keySigns: string }[] = [
  {
    name: "Thận tinh bất túc, Xung Nhâm thất dưỡng (mãn kinh)",
    description:
      "Tuổi mãn kinh thiên quý suy kiệt (theo 'Tố Vấn - Thượng cổ thiên chân luận': nữ 7x7=49 tuổi thiên quý kiệt), thận tinh hao tổn dần, xung nhâm hai mạch mất nguồn nuôi dưỡng (xung nhâm đều khởi từ bào trung, nương vào thận tinh) nên kinh nguyệt rối loạn dần rồi dứt hẳn, đồng thời toàn thân mất đi sự sung dưỡng của thận tinh. Pháp trị theo nguồn: bổ thận ích tinh, tư dưỡng xung nhâm.",
    keySigns:
      "Kinh nguyệt rối loạn dần (thưa, ít) rồi mãn kinh, lưng gối mỏi yếu, chóng mặt ù tai, tóc bạc sớm/rụng tóc, răng lung lay, trí nhớ giảm, da khô kém đàn hồi — các dấu hiệu tinh suy lão hóa toàn thân. Lưỡi nhạt hoặc đỏ nhạt, mạch trầm tế hoặc nhược.",
  },
  {
    name: "Thận âm dương lưỡng hư (mãn kinh)",
    description:
      "Giai đoạn chuyển tiếp mãn kinh, âm dương thận đều suy (không thiên hẳn về âm hư hay dương hư) nên biểu hiện đan xen cả triệu chứng hư hàn và hư nhiệt. Pháp trị theo nguồn: ôn thận bổ dương, tư âm giáng hỏa, kết hợp điều chỉnh tình chí (do triệu chứng dao động thất thường ảnh hưởng tâm lý).",
    keySigns:
      "Lúc nóng bừng ra mồ hôi (bốc hỏa — do hư dương/hư hỏa), lúc lại sợ lạnh chân tay lạnh (do dương hư); lưng gối mỏi yếu, tiểu đêm nhiều lần, có thể phù nhẹ chi dưới; ngũ tâm phiền nhiệt xen kẽ với mệt mỏi uể oải; lưỡi nhạt bệu hoặc đỏ nhạt, mạch trầm tế hoặc trầm nhược.",
  },
  {
    name: "Tâm Thận bất giao (mãn kinh)",
    description:
      "Thận âm hư ở giai đoạn mãn kinh không thể tư dưỡng tâm âm đi lên (thủy không tế hỏa), tâm hỏa độc kháng ở trên, thủy hỏa không ký tế gây tâm thần bất an. Pháp trị theo nguồn: tư thận dưỡng âm, thanh tâm an thần (dùng dược đặc sắc: Sinh địa hoàng, Thục địa hoàng, Miết giáp bổ thận âm xung nhâm; Liên tử tâm, Toan táo nhân, Viễn chí, Câu đằng thanh tâm an thần).",
    keySigns:
      "Mất ngủ, hay mê, hồi hộp (tâm quý), hay quên, ngũ tâm phiền nhiệt, đạo hãn (mồ hôi trộm), lưng gối mỏi, miệng khô họng khô, lưỡi đỏ ít rêu, mạch tế sác.",
  },
  {
    name: "Can uất (mãn kinh)",
    description:
      "Thận âm suy ở giai đoạn mãn kinh khiến can mất nguồn tư dưỡng (can thận đồng nguyên), lại thêm biến động tâm sinh lý tuổi mãn kinh dễ gây tình chí uất ức, can khí uất kết lâu hóa hỏa, hao thương âm huyết. Pháp trị theo nguồn: sơ can giải uất, tư âm thanh nhiệt, dưỡng huyết an thần (dùng dược đặc sắc: Sài hồ, Uất kim, Hương phụ sơ can giải uất; tránh dùng đại hàn đại khổ như Long đởm thảo/Sơn chi tử để tả hỏa, ưu tiên nhóm thanh nhuận như Tri mẫu, Hoàng bá, Địa cốt bì, Mẫu đơn bì).",
    keySigns:
      "Tình chí uất ức hoặc dễ cáu gắt bất thường, ngực sườn trướng tức, hay thở dài, kinh nguyệt trước đó thường không đều, kèm bốc hỏa khi xúc động, miệng đắng, lưỡi đỏ rêu mỏng vàng hoặc bình thường, mạch huyền hoặc huyền tế.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
    await prisma.pattern.update({ where: { id: p.id }, data: { description: u.description, keySigns: u.keySigns } });
    console.log(`Đã cập nhật: ${u.name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

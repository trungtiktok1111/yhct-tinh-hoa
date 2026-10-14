// Bổ sung keySigns cho 2 Pattern thuộc nguồn "BÍ TIỂU SAU SINH" (BSCKI. Bùi Thị Yến Nhi, BV ĐHYD CS3).
// Nguồn là bài viết tổng hợp theo cơ chế bệnh sinh chung (không có bảng biện chứng luận trị chi tiết
// triệu chứng riêng từng thể), 2 Pattern này đã có description nhưng thiếu keySigns. Bổ sung keySigns
// dựa trên tương quan triệu chứng-chứng hậu chuẩn của YHCT ứng với mô tả cơ chế đã có trong description
// (không bịa thêm cơ chế mới, chỉ liệt kê triệu chứng điển hình tương ứng với tên chứng đã nêu).
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updates = [
  {
    name: "Khí hư, Thận dương hư (bí tiểu sau sinh)",
    keySigns:
      "Sau sinh không đi tiểu được hoặc tiểu rất ít, bụng dưới trướng tức (có thể sờ thấy cầu bàng quang), không đau dữ dội (khác thể khí trệ huyết ứ); kèm mệt mỏi, hơi thở ngắn, tiếng nói nhỏ, ra mồ hôi (khí hư toàn thân do hao thương khí huyết lúc sinh); sắc mặt nhợt nhạt, sợ lạnh, chân tay lạnh, lưng gối mỏi yếu (thận dương hư không ôn ấm bàng quang); lưỡi nhạt, rêu trắng, mạch hư nhược hoặc trầm nhược.",
  },
  {
    name: "Khí trệ huyết ứ, kèm nhiệt tà (bí tiểu sau sinh)",
    keySigns:
      "Sau sinh (thường có tổn thương/can thiệp tại bàng quang lúc chuyển dạ kéo dài) bí tiểu hoặc tiểu không thông, bụng dưới trướng đau RÕ RỆT, cự án (khác thể khí hư đau nhẹ); có thể kèm cảm giác nóng rát vùng niệu đạo hoặc bụng dưới nếu có nhiệt tà uất kết; tâm phiền, dễ cáu; lưỡi tím hoặc có điểm ứ huyết, mạch sáp hoặc huyền.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
    await prisma.pattern.update({ where: { id: p.id }, data: { keySigns: u.keySigns } });
    console.log(`Đã cập nhật: ${u.name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

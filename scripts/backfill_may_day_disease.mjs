import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const d = await prisma.disease.findFirst({ where: { name: "Mày đay" } });
if (d) {
  await prisma.disease.update({ where: { id: d.id }, data: {
    symptoms: "Sẩn phù (ban/mảng phù) màu hồng/đỏ hoặc nhạt, ranh giới rõ, ngứa nhiều, nổi đột ngột và thường tự lặn dưới 24 giờ không để lại dấu vết (đặc trưng chẩn đoán chính). Theo 6 thể lâm sàng: Phong hàn (sẩn nhạt, gặp lạnh nặng hơn, chườm ấm giảm); Phong nhiệt (sẩn đỏ nóng rát, gặp nóng nặng hơn, kèm sốt nhẹ khát nước); Trường Vị thấp nhiệt (kèm đau bụng buồn nôn, liên quan bữa ăn); Khí huyết hư/Huyết hư sinh phong (sẩn nhạt, nổi về chiều tối, tái phát dai dẳng, mệt mỏi); Xung Nhâm bất điều (tái phát theo chu kỳ kinh nguyệt, ở phụ nữ); Vệ khí bất cố (tái phát mỗi khi đổi thời tiết, dễ cảm mạo). Dấu hiệu nặng cần cấp cứu: phù mạch môi/họng/thanh quản kèm khó thở, khó nuốt, tụt huyết áp (nghi sốc phản vệ)."
  }});
  console.log("Đã cập nhật Disease: Mày đay");
} else { console.log("KHÔNG TÌM THẤY"); }
await prisma.$disconnect();

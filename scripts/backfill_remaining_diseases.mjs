import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updates = [
  {
    name: "Parkinson (góc nhìn YHCT)",
    symptoms: "Run rẩy (chấn chiên) khi nghỉ, cứng cơ/cứng đờ (ma mộc), vận động chậm chạp, dáng đi lom khom bước ngắn, giảm biểu cảm nét mặt, rối loạn thăng bằng tư thế — mức độ và tổ hợp triệu chứng khác nhau tùy thể (khí huyết suy/thận khí hư/phong tà xâm nhập/đàm thấp ứ trệ) theo mô tả cơ chế đã nêu.",
  },
  {
    name: "Đại cương bệnh ngoài da (Da liễu YHCT)",
    symptoms: "Biểu hiện tại da (chứng Sang) đa dạng theo 5 dạng hình thái: Tiết chứng (mụn nhỏ — rôm sẩy, trứng cá), Sang chứng (mụn nước vỡ mủ — chàm, chốc lở), Đinh chứng (mụn nhỏ mủ đặc — đinh râu, chín mé), Lưu chú/Ung chứng (khối viêm hóa mủ dưới da), Tiễn chứng (sừng hóa dày chai — eczema/ngưu bì tiễn, vảy nến/tùng bì tiễn). Phân biệt Dương chứng (đỏ tươi, sưng gồ cao, mủ đặc, đau dữ dội cự án, cấp tính kèm sốt) và Âm chứng (trắng bệch/sạm tối, sưng nhẹ lan rộng, mủ loãng, đau nhẹ âm ỉ thiện án, mạn tính).",
  },
  {
    name: "Béo phì (đồng mắc trong đau thắt lưng mạn)",
    symptoms: "BMI tăng kèm tăng đau thắt lưng và hạn chế chức năng vận động (cúi, xoay người, đi lại); mức độ ảnh hưởng tăng theo BMI; giảm cân giúp giảm đau; có thể kèm lo âu/trầm cảm làm nặng thêm mối liên quan giữa béo phì và đau lưng.",
  },
  {
    name: "Loãng xương (đồng mắc trong đau thắt lưng mạn)",
    symptoms: "Loãng xương đơn thuần thường không đau rõ nhưng làm giảm tốc độ đi bộ/độ dài bước chân. Khi có gãy xẹp thân đốt sống: đau lưng cấp hoặc mạn khu trú, chậm khi đứng lên ngồi xuống, giảm tốc độ vận động, có thể giảm chiều cao/gù lưng nếu gãy nhiều đốt.",
  },
  {
    name: "Thiểu cơ / Sarcopenia (đồng mắc trong đau thắt lưng mạn)",
    symptoms: "Giảm khối lượng cơ (đo bằng DEXA/ASM), giảm sức mạnh cơ (lực nắm tay giảm), giảm hiệu suất thể chất (tốc độ đi bộ 6m <1m/s) theo tiêu chuẩn AWGS 2019; có thể kèm tăng mỡ nội tạng đồng thời (osteosarcopenic obesity) ở người cao tuổi.",
  },
  {
    name: "Hội chứng quanh mãn kinh (đồng mắc trong đau thắt lưng mạn)",
    symptoms: "Bốc hỏa, ra mồ hôi đêm, rối loạn kinh nguyệt rồi mãn kinh, khô âm đạo, rối loạn giấc ngủ, thay đổi tâm trạng (lo âu/cáu gắt), thay đổi nhận thức nhẹ (khó tìm từ, giảm trí nhớ ngắn hạn — tạm thời, hồi phục sau mãn kinh), đau lưng/khớp liên quan giảm estrogen và thay đổi hệ cơ xương khớp (tăng nguy cơ loãng xương), thay đổi phân bố mỡ cơ thể (tăng mỡ bụng).",
  },
];

for (const u of updates) {
  const d = await prisma.disease.findFirst({ where: { name: u.name } });
  if (!d) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
  await prisma.disease.update({ where: { id: d.id }, data: { symptoms: u.symptoms } });
  console.log(`Đã cập nhật: ${u.name}`);
}
await prisma.$disconnect();

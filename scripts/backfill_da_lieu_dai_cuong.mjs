import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const p = await prisma.pattern.findFirst({ where: { name: "Dương chứng sang thương (viêm mủ cấp)" } });
if (p) {
  await prisma.pattern.update({ where: { id: p.id }, data: {
    description: "Dương chứng thuộc phạm trù Bát cương hư/thực — khi tà độc (nhiệt độc, hỏa độc) uất kết tại chỗ, khí huyết cục bộ ngưng trệ bức bách ra ngoài gây phản ứng viêm cấp mạnh: khởi phát CẤP TÍNH (tà thực mới nhập, chính khí còn thịnh để kháng tà), sưng gồ cao khu trú (khí huyết ứ trệ dồn tại chỗ), màu đỏ/hồng sáng tươi (nhiệt tính viêm thượng, huyết nhiệt), mủ đặc (nhiệt thịnh hóa hủ nhục thành mủ nhanh và đặc — khác mủ loãng của âm chứng), đau dữ dội CỰ ÁN (thực chứng — ấn vào đau tăng, khác đau nhẹ âm ỉ thiện án của âm chứng hư), kèm sốt và mạch nhanh (tà chính giao tranh kịch liệt, toàn thân phản ứng). Đối lập hoàn toàn với Âm chứng (khởi phát từ từ/mạn tính, màu trắng bệch/sạm tối, sưng nhẹ lan rộng, mủ loãng ở sâu, đau nhẹ âm ỉ THIỆN ÁN, không sốt, mạch hòa hoãn — ví dụ Tràng nhạc, Loa lịch, Nham).",
    supportCriteria: "Bảng phân biệt Dương chứng/Âm chứng của sang thương (nguồn: Giáo án Bài 1 — Đại cương Da liễu YHCT): Dương chứng — khởi phát cấp tính, màu đỏ/hồng sáng tươi, sưng gồ cao khu trú, mủ đặc, đau dữ dội cự án, kèm sốt, mạch nhanh (ví dụ: Mụn nhọt, Đinh râu). Âm chứng — khởi phát từ từ/mạn tính, màu trắng bệch/sạm tối, sưng nhẹ lan rộng, mủ loãng ở sâu, đau nhẹ âm ỉ thiện án, không sốt, mạch hòa hoãn (ví dụ: Tràng nhạc, Loa lịch, Nham). Xử trí giai đoạn cấp có mủ: ưu tiên thuốc rửa (sát khuẩn, ví dụ Tứ hoàng sắc rửa) hoặc thuốc bôi/đắp thanh nhiệt giải độc (ví dụ Tứ hoàng tán) để tiêu sưng giải độc tại chỗ; CHƯA dùng cao dán/thuốc thoa dầu mỡ (dành cho giai đoạn sinh cơ lên da non, không phù hợp khi còn viêm mủ cấp). Lưu ý: không cào gãi, chà xát, cậy nặn."
  }});
  console.log("Đã cập nhật.");
} else { console.log("KHÔNG TÌM THẤY"); }
await prisma.$disconnect();

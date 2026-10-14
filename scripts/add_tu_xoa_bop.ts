// Thêm "Tự xoa bóp - Cốc Đại Phong giản hóa" (Bài 6, Ths Bs Nguyễn Tú Như). Lưu
// dưới dạng ManualTherapy với đầy đủ 10 bước theo từng vùng cơ thể. Trích nguyên
// văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Tự xoa bóp — Cốc Đại Phong giản hóa",
      sourceType: "Bài giảng (Xoa bóp - Bấm huyệt)",
      authorOrOrg: "Ths.Bs. Nguyễn Tú Như",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Tự xoa bóp theo phương pháp Cốc Đại Phong giản hóa",
      techniqueType: "Tự xoa bóp toàn thân (nguồn gốc Trung Quốc, tác giả Cốc Đại Phong)",
      targetArea: "Toàn thân: đầu mặt, mắt, mũi, miệng, tai, ngực-bụng-thắt lưng, chi trên, chi dưới",
      indications: "Phòng bệnh và chữa một số bệnh mạn tính. Thúc đẩy lưu thông khí huyết (tác dụng chung).",
      sequence:
        "1. Khởi động: xát hai bàn tay cho ấm nóng, vận động các khớp cổ tay. " +
        "2. Xát mặt, đầu, gáy: hai bàn tay áp xát vào má, xát ngược lên đầu, vòng xuống gáy rồi quay ra má, 5-10 lần — làm mềm da mặt, mềm giãn gáy, dịu thần kinh. " +
        "3. Gãi chân tóc: dùng 10 đầu ngón tay gãi chân tóc toàn bộ da đầu; chải đầu bằng ngón tay cong thành lược từ trước ra sau — làm sạch da đầu, nuôi dưỡng tóc, dịu thần kinh. " +
        "4. Mắt: lòng ngón trỏ-giữa xát quanh hốc mắt từ sống mũi, 10 lần; vuốt mi trên (mắt nhắm, áp nhẹ ngón trỏ-giữa vào mi trên, xát từ khóe trong ra ngoài, 5-10 lần); day vùng thái dương 10 lần; tập nhìn xa-nhìn gần. " +
        "5. Mũi: xát dọc sống mũi bằng ngón trỏ-giữa hoặc lưng ngón cái, từ chân tóc giữa trán dọc 2 bên sống mũi, 10 lần; day đỉnh mũi rồi bịt từng bên mũi, ấn sống mũi, xì nhẹ rồi mạnh để đẩy bụi ra ngoài, lần lượt 2 bên. " +
        "6. Miệng: xát lợi răng bằng lưỡi theo vòng tròn (trong và ngoài), 5-10 lần; rõ răng — 2 hàm răng đập vào nhau 50 lần; súc miệng trước khi xoa bóp. " +
        "7. Tai: xát vành tai bằng ngón trỏ-giữa đối ngón cái, 10 lần; rung màng nhĩ — lòng bàn tay bịt kín 2 lỗ tai rồi đột ngột bung tay ra, 10 lần (vận động các khớp xương nghe: xương búa, xương đe, xương bàn đạp). " +
        "8. Ngực-Bụng-Thắt lưng: Ngực — tay phải xoa bóp/xát vùng cổ gáy và ngực bên trái rồi đổi bên, 5-10 lần (tăng cường hô hấp, chữa đau thần kinh liên sườn). Bụng — bàn tay nọ đè lên bàn tay kia áp sát da bụng, xát vòng quanh rốn theo chiều kim đồng hồ, 10 lần. " +
        "9. Chi trên: tay phải xát/bóp cho tay trái, bắt đầu từ đỉnh vai dọc bờ ngoài cánh tay đến mu tay, vòng vào lòng bàn tay ngược dọc mặt trong cánh tay tới nách, 10 lần; đổi bên. " +
        "10. Chi dưới: hai bàn tay xát từ mông dọc mặt ngoài chân xuống bàn chân, vòng vào lòng bàn chân xát ngược mặt trong tới bẹn, 10 lần; hai bàn chân chà xát vào nhau đến ấm nóng; bàn chân nọ xát vào lòng bàn chân kia.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm kỹ thuật Tự xoa bóp Cốc Đại Phong giản hóa.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

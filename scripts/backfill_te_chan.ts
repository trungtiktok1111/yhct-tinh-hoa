// Bổ sung Pattern "Đàm ngưng huyết ứ, khí trệ (tê chân mạn)" và Disease "Tê chân, dị cảm trong đau thắt
// lưng mạn tính" (nguồn: "Tê chân trong đau thắt lưng mạn tính. Ths Bs Võ Thanh Phong.pptx", 38 slide).
// Nguồn trình bày dưới dạng danh sách bài thuốc/vị thuốc trích dẫn từ y văn Trung Quốc hiện đại điều trị
// tê chân sau thoát vị đĩa đệm/hẹp ống sống, không có bảng triệu chứng biện chứng riêng cho từng thể.
// description/keySigns dưới đây suy luận theo lý luận chuẩn (đàm ngưng huyết ứ do chèn ép thần kinh mạn
// tính kéo dài — khí huyết bất thông, đàm thấp ứ trệ) khớp với bối cảnh lâm sàng đã nêu trong nguồn
// (bệnh thần kinh tọa mạn tính, kháng trị, bệnh kéo dài) — không bịa thêm chi tiết lâm sàng cụ thể.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const pattern = await prisma.pattern.findFirst({ where: { name: "Đàm ngưng huyết ứ, khí trệ (tê chân mạn)" } });
  if (pattern) {
    await prisma.pattern.update({
      where: { id: pattern.id },
      data: {
        keySigns:
          "Tê bì/dị cảm kéo dài dai dẳng vùng chi dưới theo rễ thần kinh bị chèn ép (thường kèm đau thắt lưng mạn tính, bệnh thần kinh tọa mạn hoặc hẹp ống sống), cảm giác tê nặng như bị bó, có thể kèm đau âm ỉ hoặc như kim châm cục bộ, lưỡi tối hoặc có điểm ứ huyết, rêu nhớt (nếu đàm thấp nặng), mạch sáp hoặc hoạt sáp. Bệnh trình dài, kháng trị, chậm đáp ứng điều trị.",
        description:
          "Chèn ép rễ thần kinh mạn tính kéo dài (do thoát vị đĩa đệm/hẹp ống sống) khiến khí huyết tại chỗ vận hành trở ngại lâu ngày — khí trệ dẫn đến huyết ứ (bất thông), đồng thời tân dịch ứ trệ sinh đàm thấp (đàm ngưng). Đàm và ứ giao kết tại kinh lạc vùng chi dưới khiến khí huyết không nuôi dưỡng được cân cơ bì phu, gây tê bì dị cảm dai dẳng khó hồi phục — đây là lý do dị cảm/tê chân mạn tính thường kháng trị, cần thời gian dài đáp ứng điều trị như nguồn đã nêu. Điều trị: hoạt huyết hóa ứ, hóa đàm thông lạc — bài Thân thống trục ứ thang hợp Chỉ mê phục linh hoàn (Xuyên ngưu tất, Kê huyết đằng, Đương quy, Xuyên khung, Xích thược, Đào nhân, Huyền hồ, Nga truật, Thiên tiên đằng, Xạ hương, Bán hạ, Trần bì, Phục linh, Đảm nam tinh, Trúc nhự). Gia giảm: đàm thấp nặng gia Cương tàm, Bạch tật lê; huyết ứ nặng gia Nhũ hương, Một dược, Tô mộc, Quỷ tiễn vũ, Lưu ký nô; bệnh kéo dài không giảm gia các vị trùng loại thông lạc mạnh (Địa long, Toàn yết, Ngô công — các vị có độc tính, cần thận trọng liều lượng và thời gian dùng).",
        supportCriteria:
          "Bối cảnh lâm sàng (theo nguồn): dị cảm/tê chân là triệu chứng thường kháng trị, cần thời gian dài để đáp ứng điều trị; đau chân kéo dài trên 3 tháng là yếu tố tiên lượng kém. Các bài thuốc khác cùng nhóm hoạt huyết hóa ứ thông lạc trong nguồn: Quyên tý kiện yêu thang (bổ can thận + hoạt huyết, dùng khi kèm can thận hư), Bổ dương hoàn ngũ thang (dùng khi khí hư huyết ứ, đặc biệt người cao tuổi/thể trạng hư yếu — Hoàng kỳ liều cao để bổ khí hành huyết mà không công phá quá mức).",
      },
    });
    console.log("Đã cập nhật Pattern.");
  } else {
    console.log("KHÔNG TÌM THẤY Pattern");
  }

  const disease = await prisma.disease.findFirst({ where: { name: "Tê chân, dị cảm trong đau thắt lưng mạn tính" } });
  if (disease) {
    await prisma.disease.update({
      where: { id: disease.id },
      data: {
        cause:
          "Chèn ép rễ thần kinh cơ học (thoát vị đĩa đệm, hẹp ống sống) kéo dài gây tổn thương sợi trục và bao myelin, dẫn truyền thần kinh rối loạn. Theo YHCT: khí huyết vận hành bị cản trở mạn tính tại chỗ chèn ép dẫn đến khí trệ huyết ứ, kèm đàm thấp ứ trệ (đàm ngưng huyết ứ) hoặc trên nền can thận hư/khí hư ở người thể trạng yếu, cao tuổi.",
        symptoms:
          "Tê bì, dị cảm (kiến bò, châm chích, giảm/mất cảm giác) theo phân bố rễ thần kinh chi dưới, thường kèm đau thắt lưng lan xuống chân (đau thần kinh tọa), có thể kèm yếu cơ nếu chèn ép nặng. Triệu chứng thường kháng trị, tiến triển chậm, đáp ứng điều trị cần thời gian dài; đau chân kéo dài trên 3 tháng là yếu tố tiên lượng kém (Konstantinou 2018).",
      },
    });
    console.log("Đã cập nhật Disease.");
  } else {
    console.log("KHÔNG TÌM THẤY Disease");
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

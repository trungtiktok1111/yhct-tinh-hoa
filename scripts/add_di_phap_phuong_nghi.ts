// Thêm 5 nguyên tắc lý luận kê đơn cổ điển từ "Kê đơn lập phương theo YHCT. DỊ PHÁP
// PHƯƠNG NGHI.pptx": Dị pháp phương nghi (5 phương), Nhân nghi địa chi, Nhân nghi
// chế chi, Đồng bệnh dị trị, Dị bệnh đồng trị. Đây là lý luận nền tảng (không gắn
// 1 bệnh cụ thể) nên lưu dưới dạng TreatmentPrinciple kèm ví dụ minh họa trong bài.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Kê đơn lập phương theo YHCT — Dị pháp phương nghi",
      sourceType: "Bài giảng",
      authorOrOrg: "DEMO — chưa rõ giảng viên, nội dung dựa trên Nội Kinh Tố Vấn, thiên 12 (Dị pháp phương nghi luận)",
      locator: "62 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.treatmentPrinciple.create({
    data: {
      name: "Dị pháp phương nghi (phép trị theo 5 phương)",
      description:
        "Nguyên lý từ Tố Vấn thiên 12 (Dị pháp phương nghi luận): cùng một bệnh mà phép chữa ở các vùng khác nhau không giống nhau, vẫn đều khỏi — vì địa thế khác nhau. Đông phương (Mộc, nhiều gió ẩm, gần biển, ăn cá/mặn): dễ bệnh về cân, nên dùng châm cứu, dẫn đạo, an dưỡng. Tây phương (Kim, khô ráo, nhiều gió, thủy thổ lạnh cứng): dễ bệnh phế và da lông, nên dùng hàn lương, châm thích tả pháp. Nam phương (Hỏa, nóng bức, ẩm thấp): dễ bệnh nhiệt và tâm, nên dùng châm huyệt du, phép hãn. Bắc phương (Thủy, hàn lạnh, băng giá): dễ bệnh xương và thận (tạng hàn), nên dùng ôn bổ, cứu pháp — ví dụ dùng thuốc ấm nóng (Quan quế, Nhân sâm, hoặc Củ cải trắng/Đinh lăng thay Nhân sâm), cứu các Thủy huyệt, cứu điếu ngải, dán cao Ớt. Trung ương (Thổ, thấp ẩm, đất bằng): dễ bệnh Tỳ Vị, bụng trướng, tiêu hóa (nuy, quyết), nên dùng hòa trung, thổ dược, thổ châm.",
      goal: "Thánh nhân tùy theo địa phương, khí hậu mà áp dụng phép trị liệu thích nghi — phép trị khác mà bệnh đều khỏi.",
      scope:
        "Ứng dụng hiện đại ở Việt Nam: vùng cao lạnh → phong hàn, khí hư, cần ôn dương tán hàn; đồng bằng nóng ẩm → thấp nhiệt, tiêu chảy, lỵ, cần thanh nhiệt hóa thấp; miền biển → hàn thấp, bệnh xương khớp, cần kiện Tỳ bổ Thận; đô thị công nghiệp → thực nhiệt, uất chứng, cần sơ Can giải uất.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.treatmentPrinciple.create({
    data: {
      name: "Nhân nghi địa chi (người thuận ứng theo đất)",
      description:
        "Một trong các tư tưởng của thiên Dị pháp phương nghi luận: con người phải thuận ứng với đặc điểm đất đai, khí hậu, phong tục địa phương (địa khí: khí hậu, thời tiết, độ ẩm, nhiệt độ; nhân tình: tập quán ăn uống, lao động). Thuốc thang, châm cứu, dưỡng sinh đều cần 'tùy địa mà biến', không thể dùng chung một phép trị cho mọi nơi.",
      goal: "Không có một đơn thuốc chung cho mọi vùng.",
      limitations:
        "Cảnh báo từ thực tế: phương pháp hiệu quả ở một hoàn cảnh (vd uống nước lạnh trị bệnh thịnh hành ở Nhật Bản thập niên 1970) có người khỏi có người bệnh tăng thêm — vì bỏ qua sự khác biệt cơ địa/hoàn cảnh cá nhân, cần kết hợp với 'Nhân nghi chế chi'.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.treatmentPrinciple.create({
    data: {
      name: "Nhân nghi chế chi (cá thể hóa điều trị)",
      description:
        "Đối lập/bổ sung cho 'Nhân nghi địa chi': chú trọng yếu tố bên trong (thể chất, cơ địa, bệnh tình từng người) hơn là hoàn cảnh bên ngoài. Nguyên tắc chế ước cái thừa, bù cái thiếu: Hàn nhi ôn chi (hàn thì dùng ôn), Nhiệt nhi lương chi (nhiệt thì dùng lương), Hư nhi bổ chi (hư thì bổ), Thực nhi tả chi (thực thì tả). Không có một bài thuốc chung cho tất cả bệnh nhân.",
      goal: "Cá thể hóa điều trị theo biện chứng luận trị — nhìn người, nhìn bệnh, nhìn thời thế mà quyết định.",
      limitations:
        "Liều lượng bài thuốc cổ phương (lập cách đây rất lâu) cần thay đổi phù hợp thể trạng hiện nay; khác biệt về bào chế (hoàn mật nhỏ xưa vs sắc thang/hoàn to nay) và điều kiện y tế (thể chất người bệnh xưa thường hư yếu, dinh dưỡng kém) cũng ảnh hưởng liều dùng thực tế so với y văn cổ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.treatmentPrinciple.create({
    data: {
      name: "Đồng bệnh dị trị (cùng bệnh, trị khác)",
      description:
        "Cùng một bệnh danh/biểu hiện bên ngoài, nhưng do nguyên nhân – cơ địa – chứng hậu khác nhau nên phép trị không giống nhau (Tố Vấn thiên 46). Ví dụ Ho: do phong hàn phạm Phế → tân ôn giải biểu, tuyên Phế chỉ khái (Ma hoàng, Tử tô, Kinh giới); do phong nhiệt phạm Phế → tân lương giải biểu, thanh Phế chỉ khái (Tang diệp, Cúc hoa, Ngưu bàng tử); do Phế âm hư → tư âm giáng hỏa, dưỡng Phế. Ví dụ Thống kinh: do hàn ngưng huyết ứ → ôn kinh tán hàn hoạt huyết; do khí trệ huyết ứ → sơ Can lý khí hoạt huyết; do khí huyết hư → bổ khí huyết điều kinh chỉ thống. Ví dụ phong hàn: người hư gặp phong hàn cần giải biểu kiêm ích khí (Quế chi thang gia Sâm, Thục); người thực chỉ cần tân ôn phát hãn (Ma hoàng thang). Ví dụ thấp nhiệt: thiên thấp → hóa thấp kiện Tỳ (Thương truật, Bạch truật); thiên nhiệt → thanh nhiệt tả hỏa (Hoàng cầm, Hoàng liên). Ví dụ hư lao: âm hư → tư âm dưỡng huyết (Lục vị địa hoàng hoàn gia Mạch môn, Ngũ vị); khí hư → ích khí cố biểu (Sâm kỳ thang).",
      goal: "Không thể dùng một toa thuốc cho tất cả người mắc cùng một bệnh — phải xét từng nguyên nhân cụ thể.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.treatmentPrinciple.create({
    data: {
      name: "Dị bệnh đồng trị (khác bệnh, trị giống)",
      description:
        "Những bệnh khác tên, khác biểu hiện bên ngoài, nhưng cùng một cơ chế bệnh sinh (cùng chứng) thì phép trị có thể giống nhau. Ví dụ Khí hư hạ hãm: Sa dạ dày, Sa tử cung, Trĩ sa — bệnh danh khác nhau nhưng đều do Tỳ khí hư hạ hãm, cùng trị bằng ích khí thăng đề (Bổ trung ích khí thang gia giảm). Ví dụ Âm hư hỏa vượng: lao nhiệt/phế lao (gầy, sốt chiều), kinh nguyệt đến sớm do âm hư (kinh đỏ sẫm ít, sốt hâm hấp), đái tháo đường/tiêu khát (khát nhiều, gầy sút, tiểu nhiều) — đều thuộc âm hư sinh nội nhiệt, có thể dùng phép tư âm giáng hỏa.",
      goal: "Lấy chứng (biện chứng) làm gốc chứ không cứng nhắc vào tên bệnh — thể hiện sự linh hoạt của Đông y.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 5 nguyên tắc lý luận: Dị pháp phương nghi, Nhân nghi địa chi, Nhân nghi chế chi, Đồng bệnh dị trị, Dị bệnh đồng trị.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

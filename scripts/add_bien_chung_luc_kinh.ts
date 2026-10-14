// Thêm "Biện chứng Lục kinh" (ThS Võ Thanh Phong, 42 slide) vào Lý luận cơ bản.
// LƯU Ý: các slide 20-37 (bảng triệu chứng chi tiết Thái dương/Thiếu dương/
// Dương minh/Thái âm/Thiếu âm/Quyết âm kinh chứng & phủ chứng) là HÌNH ẢNH/BẢNG
// không trích xuất được text qua python-pptx (chỉ lấy được tiêu đề). Theo nguyên
// tắc không bịa đặt, KHÔNG đưa ra các triệu chứng cụ thể của từng kinh — chỉ ghi
// nhận đại cương, quy luật truyền biến và phần có text thật (Dương minh tứ đại,
// bảng so sánh Thái âm). File được đánh dấu "partial" trong manifest.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Biện chứng Lục kinh",
      sourceType: "Bài giảng",
      authorOrOrg:
        "ThS.Bs. Võ Thanh Phong — dẫn Trần Thúy, Nguyễn Nhược Kim, Vũ Nam (2016), Thương hàn luận, NXB Y Học; Giovanni Maciocia (2015), The foundations of Chinese medicine, Elsevier",
      locator: "42 slide (slide 20-37 là bảng/hình ảnh triệu chứng, không trích xuất được text)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Thương hàn luận — đại cương",
      category: cat,
      summary: "Trương Trọng Cảnh (AD 150–219) soạn Thương hàn luận — tài liệu lâm sàng đầu tiên hệ thống hoàn chỉnh lý pháp phương dược điều trị bệnh ngoại cảm.",
      content:
        "Hoàn cảnh ra đời: Trương Trọng Cảnh ghi: 'Từ niên hiệu Kiến An, chưa đầy mười năm chết hai phần ba, bệnh thương hàn mười phần chiếm đến bảy'. Nội kinh đã bàn đến nguyên nhân, điều trị bệnh do ngoại cảm; Thương hàn luận là tài liệu lâm sàng đầu tiên hệ thống hoàn chỉnh lý pháp phương dược điều trị bệnh ngoại cảm. Đường Tôn Hải (Trung tây y học hối thông): 'Thương hàn luận lực sinh vì trăm thứ bệnh mà tiết ra, chứ không phải vì một bệnh cảm hàn'. " +
        "Bệnh chứng thiên biến vạn hóa nên cần theo dõi bệnh, tìm quy luật chuyển biến, quy nạp thành các loại hình để biện chứng luận trị. Trong nhiều thế kỷ Trung y cho rằng đa phần bệnh ngoại cảm do phong hàn (dù Thương hàn luận có bàn về phong nhiệt); cuối Minh đầu Thanh xuất hiện trường phái 'Ôn bệnh' chú trọng nguyên nhân phong nhiệt. " +
        "Ý nghĩa 'thương hàn': Nội kinh — 'Bệnh phát nhiệt ngày nay đều là bệnh thương hàn'. Nạn kinh — 'Thương hàn có năm cách là trúng phong, thương hàn, thấp ôn, nhiệt bệnh và ôn bệnh'. " +
        "Nội dung cốt yếu: Thương hàn luận đưa ra các hội chứng lâm sàng tùy theo sự xâm nhập của tà khí, sức chống đỡ của cơ thể, ảnh hưởng điều trị. Dương chứng: chính khí mạnh, thực và nhiệt. Âm chứng: chính khí suy, hư và hàn. " +
        "Vị trí bệnh biến theo Lục kinh: Thái dương — chính khí đấu tranh bệnh tà ở bì mao; Thiếu dương — chính tà đấu tranh khoảng ngực sườn; Dương minh — chính tà đấu tranh ở dạ dày, ruột; Thái âm — bệnh biến ở hệ tiêu hóa; Thiếu âm — bệnh biến ở hệ tuần hoàn; Quyết âm — bệnh biến ở hệ thần kinh.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quy luật truyền biến Lục kinh",
      category: cat,
      summary: "5 quy luật truyền biến: Truyền kinh, Trực trúng, Lý chứng chuyển biểu, Hợp bệnh, Tính bệnh.",
      content:
        "TRUYỀN KINH: chứng hậu kinh này truyền biến thành chứng hậu kinh khác, từ nông vào sâu. Có thể không theo tuần tự mà truyền tắt hoặc biểu lý tương truyền. Truyền tắt — ví dụ Thái dương truyền sang Dương minh không qua Thiếu dương. Biểu lý tương truyền — ví dụ Dương minh Vị truyền sang Thái âm Tỳ. " +
        "TRỰC TRÚNG: tà trực trúng thẳng vào Tam âm. Nguyên nhân: thể chất yếu, dương khí không đủ, chính khí suy. Tam âm đều có thể trực trúng, tuy nhiên bệnh Thiếu âm nhiều hơn. " +
        "LÝ CHỨNG CHUYỂN BIỂU: Tam âm chuyển thành Tam dương — tiên lượng tốt, do chính khí dần hồi phục. Ví dụ: bệnh trực trúng Thái âm có nôn ói, tiêu chảy, sau đó chuyển thành phát sốt, miệng khát, táo bón — dương khí khôi phục mà bệnh tà chưa giải, chính khí thắng trong đấu tranh với tà khí. " +
        "HỢP BỆNH: cùng lúc xuất hiện chứng trạng của 2 hoặc 3 kinh, do nhiều kinh bị cảm tà khí đồng thời. Chia 2 loại: hợp bệnh dùng đơn phương để trị; hợp bệnh dùng hợp phương để trị. " +
        "TÍNH BỆNH: bệnh một kinh chưa hết mà bệnh tà chuyển sang kinh khác rất nhanh. " +
        "Phân biệt Hợp bệnh và Tính bệnh: giống nhau — đều xuất hiện chứng trạng của nhiều kinh. Khác nhau — Hợp bệnh không phân chia trước sau; Tính bệnh có chứng trạng 1 kinh xuất hiện trước, sau đó xuất hiện chứng trạng kinh khác (chứng trạng kinh trước còn ít).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Biện chứng lục kinh — các nét ghi nhận được (Dương minh, Thái âm)",
      category: cat,
      summary: "Phần trích dẫn còn giữ được từ bộ slide biện chứng 6 kinh (Thái dương, Thiếu dương, Dương minh, Thái âm, Thiếu âm, Quyết âm) — phần lớn nội dung triệu chứng chi tiết nằm trong bảng/hình ảnh không trích xuất được, chỉ ghi nhận phần có chữ rõ ràng.",
      content:
        "LƯU Ý NGUỒN: Bộ slide trình bày Biện chứng cho cả 6 kinh (Thái dương kinh chứng/phủ chứng, Thiếu dương, Dương minh, Thái âm, Thiếu âm, Quyết âm) chủ yếu bằng bảng/hình ảnh (ảnh chụp bảng từ sách), python-pptx không trích xuất được nội dung chữ trong các bảng đó. Theo nguyên tắc không bịa đặt dữ liệu, các triệu chứng cụ thể của từng kinh KHÔNG được ghi vào đây; chỉ ghi lại phần chữ rõ ràng trích xuất được. " +
        "DƯƠNG MINH: đặc trưng bởi 'Tứ đại' — đại hãn (mồ hôi nhiều), đại nhiệt (sốt cao), đại khát (khát nhiều), đại mạch (mạch lớn). " +
        "THÁI ÂM (so sánh với Dương minh): bệnh ở trường vị — Thái âm là hư hàn, Dương minh là thực nhiệt. Bụng đầy — Thái âm có lúc giảm, ấn mạnh tay không đau; Dương minh không có lúc giảm, cự án (ấn đau tăng, không cho ấn). " +
        "THÁI ÂM (so sánh với Thiếu âm): tiêu chảy — Thái âm do Tỳ hư hàn thấp; Thiếu âm do Thận dương hư. Khát — Thái âm không khát; Thiếu âm có khát.",
      status: "PENDING_REVIEW",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thương hàn luận trong y học hiện đại và kết luận",
      category: cat,
      summary: "Thương hàn luận là nền tảng Đông Y, ảnh hưởng các trường phái đời sau (Lý Đông Viên, Chu Đan Khê, Lưu Hà Gian); có nghiên cứu đối chiếu với y học hiện đại (dấu hiệu lạnh chi ở bệnh nhân nhiễm trùng).",
      content:
        "Nghiên cứu đối chiếu y học hiện đại: dấu hiệu 'lạnh chi' (cool extremities) được ghi nhận trong Thương hàn luận vẫn là chỉ số tiên lượng tốt cho bệnh nhân nhiễm trùng (nhiễm khuẩn huyết) tại khoa Hồi sức tích cực ngày nay (Cheng et al., 2014, Chinese journal of integrative medicine). " +
        "Kết luận: Thương hàn luận là nền tảng Đông Y — lấy chứng hậu tạng phủ thuộc Lục kinh, kết hợp chặt chẽ bệnh lý biến hóa để phân tích; phân biệt chứng hậu dựa vào biểu lý, hàn nhiệt biến hóa, hư thực khác nhau. " +
        "Các trường phái đời sau dựa trên Thương hàn: Lý Đông Viên — thuyết bổ thổ, dựa lên chứng Lý trung thang mà đi sâu thêm. Chu Đan Khê — thuyết tư âm, do chứng Hoàng liên a giao thang mà mở rộng. Lưu Hà Gian — chủ trương thanh hỏa, do chứng Đại/Tiểu sài hồ thang, Bạch hổ nhân sâm thang mà ra.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 4 chủ đề Biện chứng Lục kinh (phần có text thật; phần bảng ảnh chi tiết triệu chứng từng kinh bị bỏ qua, đánh dấu partial).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

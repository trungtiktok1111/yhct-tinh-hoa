// Thêm 3 kỹ thuật: Điện châm, Cấy chỉ, Thủy châm từ bài giảng ThS Võ Thanh Phong
// (42 slide) — lưu dưới dạng ManualTherapy (thông số kỹ thuật, quy trình, chống
// chỉ định). Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Điện châm - Cấy chỉ - Thủy châm",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong",
      locator: "42 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Điện châm — thông số kỹ thuật theo mục tiêu điều trị",
      techniqueType: "Châm cứu có kích thích điện (Electroacupuncture)",
      indications:
        "So sánh sóng dày đặc (50-100 Hz: ức chế TK cảm giác/vận động, giảm co cơ và mạch máu — chỉ định giảm đau, chấn thương) và sóng phân tán (2-5 Hz: gây co cơ, tăng trương lực cơ/dây chằng — chỉ định liệt, tổn thương cơ/dây chằng/khớp).",
      sequence:
        "Đau cấp/hậu phẫu/chấn thương cấp: cường độ ở mức cảm giác không gây co cơ, độ rộng xung nhỏ 50-80µs, tần số cao 50-100Hz, mở liên tục — giảm đau sau vài phút. Đau bán cấp/mạn/do quá tải: cường độ cao mức gây co cơ, độ rộng xung lớn 200-350µs, tần số 1-5Hz, mở 30-45s, điều trị 30 phút — giảm đau sau 30 phút, kéo dài 5-7 giờ. Đau mạn cường độ mạnh/đau thần kinh: cường độ rất cao dưới ngay mức gây đau, độ rộng xung rất lớn 1-10ms, tần số rất cao >200Hz, mở 30-45s, điều trị 30 phút — kéo dài nhiều giờ. Chậm loạn dưỡng/giảm mất cơ/hạn chế phù nề (không tái sinh thần kinh): dòng hai pha bất đối xứng, độ rộng xung <1ms (2 tuần đầu) hoặc dòng xung vuông 1 chiều ngắt quãng độ rộng >10ms. Tái rèn luyện cơ (giải phóng ức chế TKTW): cường độ đủ gây co cơ, độ rộng 300-600µs, tần số 35-55Hz, tỷ số mở:tắt=1:5, ngắt quãng, BN chủ động theo dõi để co cơ, điều trị 15 phút. Hạn chế vận động khớp do bệnh lý: cường độ đủ cử động chi hết tầm ảnh hưởng trọng lực, độ rộng 300-600µs, tần số 40-60Hz, mở 15-20s, tắt≥mở. Tăng sức mạnh cơ: 35-80pps, độ rộng 125-200µs (cơ nhỏ)/200-350µs (cơ lớn), đạt >10% co cơ đẳng trường tối đa ở cơ tổn thương (>50% cơ lành), tắt:mở=50-120s:6-10s=1:5, dốc >2s, 10-20 phút. Giảm co cứng: 35-50pps, thấy được co cơ, tắt:mở=1:1 (2-5s:2-5s), dốc>1s, 10-30 phút. Kiểm soát cổng (gate control): 100-150pps, độ rộng 50-80µs, cảm giác tê. Giải phóng endorphin: 2-10pps, độ rộng 150-300µs, thấy co cơ, 20-30 phút. Cách đặt điện cực: kích thích cơ — điện cực dương tại điểm vận động, còn lại song song bó cơ; giảm đau — trên/xung quanh chỗ đau, theo dermatome, vị trí dây TK đi nông nhất, trigger point hoặc huyệt, đối xứng qua trục cơ thể.",
      contraindications:
        "Máy tạo nhịp/khử rung tim; thiết bị kích thích rễ thần kinh; vùng bụng/lưng khi có thai; rối loạn ngôn ngữ/tri giác; vùng mô mới phẫu thuật cần tránh co kéo; bệnh lý ác tính (K); huyết khối động/tĩnh mạch; dụng cụ kim loại cố định trong/ngoài cơ thể; vùng dây thần kinh phế vị; nhược cơ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Cấy chỉ",
      techniqueType: "Cấy chỉ tự tiêu vào huyệt (catgut, PDO)",
      indications: "Phát huy tác dụng chữa bệnh của huyệt qua kích thích cơ học kéo dài trong quá trình chỉ tự tiêu.",
      sequence:
        "Dùng chỉ tự tiêu (catgut, PDO) vùi vào huyệt; trong quá trình tự tiêu tạo kích thích cơ học lên huyệt. Quy trình: rửa tay sạch, đi găng vô trùng → xác định chính xác huyệt định cấy chỉ → sát trùng vùng huyệt → châm kim nhanh qua da và đẩy từ từ tới huyệt → đẩy nòng kim để chỉ nằm vào huyệt → rút kim, sát trùng vị trí tiêm. Khoảng cách: 7-14 ngày cấy chỉ 1 lần.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.manualTherapy.create({
    data: {
      name: "Thủy châm",
      techniqueType: "Tiêm thuốc vào huyệt",
      indications: "Tác dụng theo học thuyết kinh lạc YHCT: tăng cường và duy trì kích thích của châm kim vào huyệt, nâng cao hiệu quả chữa bệnh.",
      sequence:
        "Bước 1: lấy thuốc vào bơm tiêm. Bước 2: thử phản ứng thuốc theo quy định. Bước 3 — thì 1: sát trùng da vùng huyệt; thì 2: châm kim nhanh qua da vào huyệt; thì 3: rút nòng kiểm tra không có máu; thì 4: từ từ bơm thuốc vào huyệt. Thể tích tiêm theo vị trí/tuổi: Cơ Delta — người lớn 1ml, trẻ >6 tuổi 0,5ml. Cơ thẳng đùi — <18 tháng 0,5ml, >6 tuổi 1,5ml, người lớn 2ml. Cơ rộng ngoài đùi — <18 tháng 0,5ml, >6 tuổi 1,5ml, người lớn 5ml. Cơ mông mặt ngoài — <18 tháng 0,5ml, >6 tuổi 1,5ml, người lớn 3ml. Cơ mông mặt sau — >6 tuổi 1,5ml, người lớn 3ml. Thuốc thủy châm có thể có tác dụng phục hồi bao myelin neuron, bảo vệ thần kinh trung ương.",
      contraindications: "Không dùng thuốc người bệnh dị ứng; không dùng thuốc gây xơ cứng/hoại tử; không châm vùng có dây thần kinh/mạch máu lớn; không thủy châm vào huyệt ở vùng cơ mỏng.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 3 kỹ thuật: Điện châm, Cấy chỉ, Thủy châm.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

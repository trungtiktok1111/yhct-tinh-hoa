// Bổ sung description + supportCriteria cho 4 Pattern thuộc nguồn "Những điều chưa biết về bệnh Phong thấp
// theo YHCT" (docx, Hải Đường tổng hợp). Nguồn có mô tả chi tiết cơ chế bệnh sinh của từng thể Tý chứng
// (phong/hàn/thấp/nhiệt) nhưng trước đây chỉ trích keySigns, chưa đưa cơ chế vào description.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generalMechanism =
  "Tý chứng là chứng bế tắc, khí huyết ngưng đọng tại kinh lạc, cơ nhục, khớp xương do Phong-Hàn-Thấp-Nhiệt thừa lúc cơ thể hư (nguyên khí hư yếu) mà xâm nhập. Tà khí thâm nhập cơ biểu và kinh lạc cản trở vận hành khí huyết, 'bất thông tắc thống' nên đau nhức cơ bắp, gân cốt, khớp xương co rút, tê bì, cử động khó khăn. Nếu trị không đúng phép hoặc bệnh nặng, có thể chuyển vào tâm qua mạch gây Tâm ủy (hồi hộp lo âu), khí đoản, đau căng lồng ngực — lâu ngày thành chứng Phong thấp tim (Tâm tý). Thông thường 3 tà Phong-Hàn-Thấp thâm nhập cùng lúc gây thể phong hàn thấp tý; nếu tà khí khu trú lâu ở kinh lạc/khớp không hóa giải thì chuyển thành nhiệt, gây thể phong thấp nhiệt tý (sưng đau nóng đỏ khớp).";

const updates: { name: string; description: string; supportCriteria: string }[] = [
  {
    name: "Hành tý (Phong thắng)",
    description:
      generalMechanism +
      " Thể Hành tý (phong thắng, phong là chủ đạo trong 3 tà): phong là dương tà, tính 'thiện hành sác biến' (di chuyển, biến hóa nhanh) — khi phong thấp nhập cơ biểu/kinh lạc/khớp xương thấy phát nhiệt ố hàn (do dương tà xâm nhập gặp âm tà bị ngưng lại, khí huyết không thông, bất thông tắc thống nên khớp xương sưng đỏ đau đớn). Đặc trưng CHỖ ĐAU THAY ĐỔI, CHẠY KHẮP CƠ THỂ (phong tà thịnh thì khớp đau chạy khắp cơ thể — khác hẳn thống tý đau cố định). Kinh mạch không thông nên khúc gập bất lợi (khó co duỗi khớp, đặc biệt đầu gối, mắt cá, cùi chỏ, cổ tay).",
    supportCriteria:
      "Mình đau, tay chân đau; khớp xương đau nhức; CHỖ ĐAU THAY ĐỔI (đặc trưng của phong — khác hẳn vị trí cố định của thống tý); khớp xương hoặc hồng đỏ hoặc sưng; gân mạch co rút; khúc gập chân tay, cổ bất lợi (đầu gối, mắt cá, cùi chỏ, cổ tay tổn hại nhiều nhất). Nguồn: 'Những điều chưa biết về bệnh Phong thấp theo YHCT'.",
  },
  {
    name: "Thống tý (Hàn thắng)",
    description:
      generalMechanism +
      " Thể Thống tý (hàn thắng, còn gọi Phong thấp lạnh/Tê thấp lạnh): phong-hàn-thấp cùng xâm nhập nhưng hàn mạnh nhất, ứ đọng tại cơ biểu khớp xương. Hàn thấp là âm tà, tính 'ngưng đọng nặng nề và đục' cản trở kinh lạc khớp xương khí huyết, bế tắc không thông — bất thông tắc thống nên khớp xương đau, CHỖ ĐAU NHẤT ĐỊNH (cố định, khác hành tý di chuyển). Hàn tà tính 'thu và dẫn' nên khớp xương khúc gập bất lợi. Hàn tà thịnh bên trong nên sợ lạnh, chân tay lạnh; trời mưa âm u âm khí tăng nên bệnh nặng hơn (NGÀY NHẸ ĐÊM NẶNG). Gặp nhiệt (ấm) thì hàn tản đi, khí huyết thông nên giảm đau; gặp lạnh thì đau tăng — đặc trưng phân biệt chính với nhiệt tý (ngược lại hoàn toàn).",
    supportCriteria:
      "Thân đau, tay chân lạnh; khớp xương đau nhức; CHỖ ĐAU NHẤT ĐỊNH (cố định — đặc trưng của hàn, khác hành tý); NGÀY NHẸ ĐÊM NẶNG; GẶP NHIỆT THÌ GIẢM ĐAU, GẶP LẠNH THÌ ĐAU HƠN (đặc trưng phân biệt chính, ngược hẳn nhiệt tý); chỗ đau da KHÔNG hồng, KHÔNG nóng (khác nhiệt tý sưng đỏ). Nguồn: 'Những điều chưa biết về bệnh Phong thấp theo YHCT'.",
  },
  {
    name: "Trứ tý (Thấp thắng)",
    description:
      generalMechanism +
      " Thể Trứ tý (thấp thắng, còn gọi Phong thấp tê/Tê thấp tê): phong-hàn-thấp xâm nhập mà thấp mạnh hơn, thấp hàn là âm tà tính 'nặng nề' và 'đục, cản', ứ đọng không tản đi — gây toàn thân ớn lạnh, chân tay khớp xương đau nhức ê ẩm NẶNG NỀ, người nặng nề đi đứng khó khăn, hoạt động bất tiện, đau tại khu vực nhất định (thấp kết có nước — sưng phù tại chỗ do thấp), khi nằm trở mình khó khăn. Thấp tà thịnh bên trong, dương khí không chuyển thông nên sinh phù thũng. Hàn thấp làm tỳ vị bên trong khốn khó vận hóa nên ăn uống đầy ứ, vùng bao tử lồng ngực nghẽn (đặc trưng riêng của thể này — liên quan tỳ vị, không có ở 3 thể kia).",
    supportCriteria:
      "Toàn thân ớn lạnh; chân tay khớp xương đau nhức ê ẩm, NẶNG NỀ (đặc trưng của thấp); người nặng nề đi đứng khó khăn, hoạt động bất tiện; đau tại khu vực nhất định, thấp kết có nước (sưng phù tại chỗ); khi nằm trở mình khó khăn; ĂN UỐNG ĐẦY Ứ (đặc trưng riêng do hàn thấp khốn tỳ vị — không có ở phong/hàn/nhiệt tý). Nguồn: 'Những điều chưa biết về bệnh Phong thấp theo YHCT'.",
  },
  {
    name: "Nhiệt tý (Nhiệt thắng)",
    description:
      generalMechanism +
      " Thể Nhiệt tý (nhiệt thắng, còn gọi Phong thấp nhiệt/Tê thấp nhiệt): do 3 tà khu trú lâu ở kinh lạc/khớp không hóa giải mà chuyển thành nhiệt, hoặc phong thấp mà nhiệt tà thịnh — là chứng thấp nhiệt ứ đọng, thuộc THỰC CHỨNG. Nhiệt tà thịnh nên phát nhiệt, miệng khô khát (nặng thì phiền khát), lồng ngực căng, phiền táo bất an; khớp xương sưng đỏ mà đau (nhiệt ứ tại khớp xương) — đau NHƯ LỬA ĐỐT DAO CẮT, gân mạch căng thẳng, tay không dám đụng vào chỗ đau. Vì là thực chứng nên GẶP HÀN LẠNH THÌ GIẢM ĐAU, GẶP ẤM NÓNG THÌ ĐAU TĂNG — hoàn toàn NGƯỢC với thống tý (hàn thắng). Có thể kèm phù thũng tăng nhanh hoặc hồng ban/ẩn chẩn (biểu hiện huyết nhiệt). Ngày nhẹ đêm nặng; nước tiểu vàng đỏ, táo bón (nhiệt thương tân).",
    supportCriteria:
      "Gặp ấm nóng thì đau TĂNG, gặp lạnh thì GIẢM đau (đặc trưng phân biệt chính, ngược hẳn thống tý); miệng khô khát hoặc phiền khát; phiền táo bất an; ngày nhẹ đêm nặng; nước tiểu vàng đỏ, táo bón; đau như lửa đốt dao cắt; gân mạch căng thẳng, không dám đụng vào chỗ đau; phù thũng tăng nhanh hoặc hồng ban/ẩn chẩn; khớp xương nhiều chỗ sưng đỏ đau nhức. Nguồn: 'Những điều chưa biết về bệnh Phong thấp theo YHCT'.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
    await prisma.pattern.update({ where: { id: p.id }, data: { description: u.description, supportCriteria: u.supportCriteria } });
    console.log(`Đã cập nhật: ${u.name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

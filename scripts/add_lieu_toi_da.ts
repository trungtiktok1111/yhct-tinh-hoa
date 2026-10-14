// Thêm khuyến cáo liều tối đa (cho mỗi vị thuốc) từ "So sánh các nhóm thuốc giải
// biểu. Ths Bs Võ Thanh Phong.pptx" (slide 129-133, bảng "Khuyến cáo liều tối đa").
// CHỈ điền vào Herb.dosage nếu trường này còn TRỐNG (không ghi đè liều dùng đã có
// sẵn, vì "liều tối đa an toàn" khác với "liều dùng thường quy" đã nhập trước đó
// — tránh làm mâu thuẫn dữ liệu đã thẩm định).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tiers: [string, string[]][] = [
  ["<0.1 g", ["Băng phiến", "Xạ hương", "Đàn hương"]],
  ["≤1 g", ["Trân châu", "Chu sa"]],
  ["≤3 g", ["Bạch phụ tử", "Thảo đậu khấu", "Đinh hương", "Hổ phách", "Lộc nhung", "Mã bộ", "Manh trùng", "Toàn yết", "Ngô công", "Tế tân", "Giá trùng (Thổ miết trùng)"]],
  ["≤6 g", ["Ngải diệp", "Bạch đậu khấu", "Bạc hà", "Trầm hương", "Đăng tâm thảo", "Phan tả diệp", "Cao lương khương", "Cáp giới", "Kha tử", "Hỏa tiêu", "Hoàng liên", "Linh dương giác", "Mộc thông", "Thanh đại", "Nhục quế", "Sa nhân", "Thăng ma", "Đàn hương", "Ngũ vị tử", "Ngô thù du", "Tây dương sâm", "Ích trí nhân", "Nguyệt quý hoa", "Tử hà xa"]],
  ["≤12 g", ["Bạch đầu ông", "Xích thược dược", "Đại hoàng", "Hoàng cầm", "Mạch nha", "Mẫu đơn bì", "Tỳ bà diệp", "Tri mẫu"]],
  ["≤15 g", ["Bạch cập", "Ba kích thiên", "Bạch mao căn", "Bạch truật", "Bắc sa sâm", "Trắc bá diệp", "Xa tiền tử", "Đại kế", "Đại táo", "Đan sâm", "Đạm trúc diệp", "Đương quy", "Đảng sâm", "Tử hoa địa đinh", "Địa phu tử", "Địa du", "Đỗ trọng", "Cẩu tích", "Câu đằng", "Hải tảo", "Hợp hoan bì", "Hoạt thạch", "Hoài hoa", "Côn bố", "Lai phục tử", "Liên kiều", "Liên tử", "Lô căn", "Mã xỉ hiện", "Mang tiêu", "Nữ trinh tử", "Bồ công anh", "Khiếm thực", "Sơn tra", "Sơn thù du", "Thần khúc", "Thiên hoa phấn", "Thiên môn đông", "Thỏ ty tử", "Tiểu kế", "Huyền sâm", "Dâm dương hoắc", "Ngọc trúc"]],
  ["≤20 g", ["Bạch biển đậu", "Bá tử nhân", "Xích thạch chi", "Hà thủ ô", "Hoàng tinh", "Hoàng kỳ", "Mạch môn đông", "Nhục thung dung", "Sa uyển tử", "Toan táo nhân", "Tục đoạn"]],
  ["≤30 g", ["Bách hợp", "Bạch thược dược", "Biển xúc", "Miết giáp", "Từ thạch", "Xích tiểu đậu", "Đại giả thạch", "Phong mật", "Phù tiểu mạch", "Qua lâu", "Quy bản", "Hạn liên thảo", "Hắc chi ma", "Kê huyết đằng", "Long cốt", "Lục đậu", "Mẫu lệ", "Ngẫu tiết", "Cù mạch", "Tang ký sinh", "Thạch quyết minh", "Thái tử sâm", "Dạ giao đằng", "Ích mẫu thảo", "Ý dĩ nhân", "Nhân trần", "Ngư tinh thảo", "Táo tâm thổ", "Tử châu thảo"]],
  ["≤60 g", ["Phỉ tử", "Kim tiền thảo", "Kim ngân hoa", "Long nhãn nhục", "Thạch vỹ", "Tiên hạc thảo", "Phù tiểu mạch", "Di đường", "Trúc lịch"]],
  ["≤120 g", ["Nam qua tử"]],
];

async function main() {
  const source = await prisma.source.findFirst({ where: { title: { contains: "So sánh các nhóm thuốc" } } });
  if (!source) throw new Error("Chưa có Source — chạy add_so_sanh_giai_bieu.ts trước");

  let filled = 0;
  let createdNew = 0;
  let alreadyHadDosage = 0;

  for (const [maxDose, names] of tiers) {
    for (const name of names) {
      let herb = await prisma.herb.findFirst({ where: { standardName: name } });
      if (!herb) {
        herb = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId: source.id } });
        createdNew++;
      }
      if (!herb.dosage) {
        await prisma.herb.update({ where: { id: herb.id }, data: { dosage: `Liều tối đa khuyến cáo: ${maxDose}/ngày` } });
        filled++;
      } else {
        alreadyHadDosage++;
      }
    }
  }

  console.log(`Tạo vị thuốc mới: ${createdNew}. Điền liều tối đa (trường trống): ${filled}. Đã có liều dùng từ trước (bỏ qua): ${alreadyHadDosage}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

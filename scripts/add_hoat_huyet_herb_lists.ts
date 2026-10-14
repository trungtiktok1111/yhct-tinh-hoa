// Bổ sung các danh sách vị thuốc theo tiểu nhóm công năng (Hoạt huyết chỉ thống,
// Hoạt huyết điều kinh, Hoạt huyết liệu thương, Lương huyết chỉ huyết, Hóa ứ chỉ
// huyết, Thu liễm chỉ huyết) từ cùng file Lập phương Hoạt huyết - Chỉ huyết (tr.15-
// 36) — phần lý thuyết/phân loại trước các cổ phương đã nhập ở add_lap_phuong_hoat_huyet_chi_huyet.ts.
// CHỈ tạo Herb mới nếu chưa có trong DB (không sửa/ghi đè Herb đã có, tránh làm hỏng
// dữ liệu đã được thẩm định); vị đã có thì bỏ qua, không cần cập nhật gì thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.findFirst({ where: { title: { contains: "Lập phương Hoạt huyết - Chỉ huyết" } } });
  if (!source) throw new Error("Chưa có Source — chạy add_lap_phuong_hoat_huyet_chi_huyet.ts trước");

  const groups: Record<string, string[]> = {
    "Hoạt huyết chỉ thống": ["Xuyên khung", "Diên hồ sách", "Uất kim", "Khương hoàng", "Nhũ hương", "Một dược", "Ngũ linh chi"],
    "Hoạt huyết điều kinh": ["Đan sâm", "Hồng hoa", "Đào nhân", "Ích mẫu thảo", "Trạch lan", "Ngưu tất", "Kê huyết đằng", "Vương bất lưu hành", "Nguyệt quý hoa", "Lăng tiêu hoa"],
    "Hoạt huyết liệu thương": ["Thổ miết trùng", "Tự nhiên đồng", "Tô mộc", "Cốt toái bổ", "Huyết kiệt", "Nhi trà", "Lưu ký nô", "Thủy hồng hoa tử", "Mã tiền tử"],
    "Lương huyết chỉ huyết": ["Đại kế", "Tiểu kế", "Địa du", "Hòe hoa", "Trắc bách diệp", "Bạch mao căn", "Trữ ma căn", "Dương đề"],
    "Hóa ứ chỉ huyết": ["Tam thất", "Thiến thảo", "Bồ hoàng", "Hoa nhụy thạch", "Giáng hương", "Huyết dư thán"],
    "Thu liễm chỉ huyết": ["Bạch cập", "Tiên hạc thảo", "Ngẫu tiết", "Bách thảo sương", "Tông lư thán", "Kỷ mộc"],
  };

  let created = 0;
  let skipped = 0;
  for (const [group, names] of Object.entries(groups)) {
    for (const name of names) {
      const existing = await prisma.herb.findFirst({ where: { standardName: name } });
      if (existing) {
        skipped++;
        continue;
      }
      await prisma.herb.create({
        data: { standardName: name, actions: group, status: "DRAFT", sourceId: source.id },
      });
      created++;
    }
  }
  console.log(`Vị thuốc mới tạo: ${created}; đã có từ trước (bỏ qua, không ghi đè): ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

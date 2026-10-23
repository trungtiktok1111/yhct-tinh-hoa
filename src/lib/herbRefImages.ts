// Ảnh tham khảo vị thuốc (tươi / khô), ghép theo TÊN vị thuốc hoặc tên khác. Ảnh trong public/images/herbs/ref/.
export const HERB_REF_IMAGES: { name: string; slug: string }[] = [
  { name: "Hoàng liên", slug: "hoang-lien" },
  { name: "Hoàng cầm", slug: "hoang-cam" },
  { name: "Hoàng bá", slug: "hoang-ba" },
  { name: "Long đởm thảo", slug: "long-dom-thao" },
  { name: "Khổ sâm", slug: "kho-sam" },
  { name: "Tần bì", slug: "tan-bi" },
  { name: "Bạch tiên bì", slug: "bach-tien-bi" },
  { name: "Địa phu tử", slug: "dia-phu-tu" },
  { name: "Kim ngân hoa", slug: "kim-ngan-hoa" },
  { name: "Liên kiều", slug: "lien-kieu" },
  { name: "Bồ công anh", slug: "bo-cong-anh" },
  { name: "Tử hoa địa đinh", slug: "tu-hoa-dia-dinh" },
  { name: "Đại thanh diệp", slug: "dai-thanh-diep" },
  { name: "Bản lam căn", slug: "ban-lam-can" },
  { name: "Ngũ tinh thảo", slug: "ngu-tinh-thao" },
  { name: "Xạ can", slug: "xa-can" },
  { name: "Bạch đầu ông", slug: "bach-dau-ong" },
  { name: "Bạch hoa xà thiệt thảo", slug: "bach-hoa-xa-thiet-thao" },
  { name: "Bán chi liên", slug: "ban-chi-lien" },
  { name: "Sơn đậu căn", slug: "son-dau-can" },
  { name: "Mã xỉ hiện", slug: "ma-xi-hien" },
  { name: "Thổ phục linh", slug: "tho-phuc-linh" },
  { name: "Tứ quý thanh", slug: "tu-quy-thanh" },
  { name: "Nhẫn đông đằng", slug: "nhan-dong-dang" },
];

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/\s+/g, " ").trim();
const BY_NAME = new Map(HERB_REF_IMAGES.map((h) => [fold(h.name), h.slug]));

// Tìm ảnh tham khảo (tươi/khô) theo tên chuẩn hoặc tên khác của vị thuốc; không khớp thì null.
export function herbRefImages(standardName: string, aliases?: string | null): { fresh: string; dry: string } | null {
  const names = [standardName, ...(aliases ?? "").split(/[;,\/]/)].map(fold).filter(Boolean);
  for (const n of names) {
    const slug = BY_NAME.get(n);
    if (slug) return { fresh: `/images/herbs/ref/${slug}-tuoi.jpg`, dry: `/images/herbs/ref/${slug}-kho.jpg` };
  }
  return null;
}

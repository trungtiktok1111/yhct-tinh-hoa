// Ảnh tham khảo vị thuốc, ghép theo TÊN vị thuốc hoặc tên khác. Ảnh trong public/images/herbs/ref/.
// Vị thuốc chưa có trong kho tri thức vẫn được lưu sẵn: khi thêm vị cùng tên, ảnh tự hiện.
// Có đủ ảnh tươi (-tuoi) và khô (-kho).
export const HERB_REF_IMAGES: { name: string; slug: string }[] = [
  { name: "Bạc hà", slug: "bac-ha" },
  { name: "Ngưu bàng tử", slug: "nguu-bang-tu" },
  { name: "Cát căn", slug: "cat-can" },
  { name: "Sài hồ", slug: "sai-ho" },
  { name: "Thăng ma", slug: "thang-ma" },
  { name: "Cúc hoa", slug: "cuc-hoa" },
  { name: "Tang diệp", slug: "tang-diep" },
  { name: "Phù bình", slug: "phu-binh" },
  { name: "Đạm đậu xị", slug: "dam-dau-xi" },
  { name: "Mạn kinh tử", slug: "man-kinh-tu" },
  { name: "Đậu quyển", slug: "dau-quyen" },
  { name: "Ma hoàng", slug: "ma-hoang" },
  { name: "Quế chi", slug: "que-chi" },
  { name: "Tử tô diệp", slug: "tu-to-diep" },
  { name: "Tô diệp", slug: "to-diep" },
  { name: "Tô ngạnh", slug: "to-nganh" },
  { name: "Kinh giới", slug: "kinh-gioi" },
  { name: "Phòng phong", slug: "phong-phong" },
  { name: "Bạch chỉ", slug: "bach-chi" },
  { name: "Sinh khương", slug: "sinh-khuong" },
  { name: "Tế tân", slug: "te-tan" },
  { name: "Cảo bản", slug: "cao-ban" },
  { name: "Khương hoạt", slug: "khuong-hoat" },
  { name: "Thương nhĩ tử", slug: "thuong-nhi-tu" },
  { name: "Tân di", slug: "tan-di" },
  { name: "Hương nhu", slug: "huong-nhu" },
  { name: "Thông bạch", slug: "thong-bach" },
  { name: "Hoàng liên", slug: "hoang-lien" },
  { name: "Hoàng cầm", slug: "hoang-cam" },
  { name: "Hoàng bá", slug: "hoang-ba" },
  { name: "Long đởm thảo", slug: "long-dom-thao" },
  { name: "Khổ sâm", slug: "kho-sam" },
  { name: "Tần bì", slug: "tan-bi" },
  { name: "Bạch tiên bì", slug: "bach-tien-bi" },
  { name: "Địa phu tử", slug: "dia-phu-tu" },
  { name: "Thạch cao", slug: "thach-cao" },
  { name: "Tri mẫu", slug: "tri-mau" },
  { name: "Chi tử", slug: "chi-tu" },
  { name: "Hạ khô thảo", slug: "ha-kho-thao" },
  { name: "Lô căn", slug: "lo-can" },
  { name: "Thiên hoa phấn", slug: "thien-hoa-phan" },
  { name: "Quyết minh tử", slug: "quyet-minh-tu" },
  { name: "Hàn thủy thạch", slug: "han-thuy-thach" },
  { name: "Trúc diệp", slug: "truc-diep" },
  { name: "Đạm trúc diệp", slug: "dam-truc-diep" },
  { name: "Đỗ trọng", slug: "do-trong" },
  { name: "Tục đoạn", slug: "tuc-doan" },
  { name: "Cẩu tích", slug: "cau-tich" },
  { name: "Ngưu tất", slug: "nguu-tat" },
  { name: "Cốt toái bổ", slug: "cot-toai-bo" },
  { name: "Kê huyết đằng", slug: "ke-huyet-dang" },
  { name: "Tang ký sinh", slug: "tang-ky-sinh" },
  { name: "Độc hoạt", slug: "doc-hoat" },
  { name: "Uy linh tiên", slug: "uy-linh-tien" },
  { name: "Phòng kỷ", slug: "phong-ky" },
  { name: "Tần giao", slug: "tan-giao" },
  { name: "Tầm cốt phong", slug: "tam-cot-phong" },
  { name: "Hải phong đằng", slug: "hai-phong-dang" },
  { name: "Lạc thạch đằng", slug: "lac-thach-dang" },
  { name: "Tang chi", slug: "tang-chi" },
  { name: "Mộc qua", slug: "moc-qua" },
  { name: "Ngũ gia bì", slug: "ngu-gia-bi" },
  { name: "Thiên niên kiện", slug: "thien-nien-kien" },
  { name: "Hy thiêm", slug: "hy-thiem" },
  { name: "Tỳ giải", slug: "ty-giai" },
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
// Chỉ có một ảnh.
export const HERB_REF_SINGLE: { name: string; slug: string }[] = [
];

const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/\s+/g, " ").trim();
const PAIR = new Map(HERB_REF_IMAGES.map((h) => [fold(h.name), h.slug]));
const ONE = new Map(HERB_REF_SINGLE.map((h) => [fold(h.name), h.slug]));

export type HerbRef = { images: { cap: string; src: string }[]; thumb: string };

// Tìm ảnh tham khảo theo tên chuẩn hoặc tên khác của vị thuốc; không khớp thì null.
export function herbRefImages(standardName: string, aliases?: string | null): HerbRef | null {
  const names = [standardName, ...(aliases ?? "").split(/[;,\/]/)].map(fold).filter(Boolean);
  for (const n of names) {
    const p = PAIR.get(n);
    if (p) {
      const fresh = `/images/herbs/ref/${p}-tuoi.jpg`, dry = `/images/herbs/ref/${p}-kho.jpg`;
      return { images: [{ cap: "Tươi", src: fresh }, { cap: "Khô", src: dry }], thumb: fresh };
    }
    const o = ONE.get(n);
    if (o) return { images: [{ cap: "Dược liệu", src: `/images/herbs/ref/${o}.jpg` }], thumb: `/images/herbs/ref/${o}.jpg` };
  }
  return null;
}

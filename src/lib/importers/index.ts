import type { Importer } from "@/lib/importKit";
import { kiemKe } from "./kiemke";
import { huyHang } from "./huyhang";
import { danhMuc } from "./danhmuc";
import { benhNhan } from "./benhnhan";

export const IMPORTERS: Record<string, Importer> = {
  [kiemKe.id]: kiemKe,
  [huyHang.id]: huyHang,
  [danhMuc.id]: danhMuc,
  [benhNhan.id]: benhNhan,
};

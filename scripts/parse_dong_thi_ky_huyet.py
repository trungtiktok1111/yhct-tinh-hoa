# -*- coding: utf-8 -*-
"""Phân tích 'SỔ TAY TOP 30 ĐỔNG THỊ KỲ HUYỆT.pdf' (tr.25-54, mỗi trang = 1 huyệt):
Vị trí, Chỉ định, Tên huyệt, ghi chú (phối hợp/khu phản ứng/cách châm). Chỉ lấy
đúng nội dung có trong trang, không bịa thêm."""
import json, re, sys
import pypdf

PATH = r"D:\Tài liệu đông y\tài liệu y học\HUYỆT VỊ - KINH LẠC - R\SỔ TAY TOP 30 ĐỔNG THỊ KỲ HUYỆT.pdf"

NAMES_ORDER = [
    "Hoàn Sào", "Mộc Huyệt", "Phụ Khoa", "Ngũ Hổ", "Trọng Tử", "Trọng Tiên", "Đại Bạch",
    "Linh Cốt", "Trung Bạch", "Hạ Bạch", "Hỏa Ngạnh", "Hỏa Chủ", "Chính Tông", "Chính Cân",
    "Thiên Hoàng Phụ", "Địa Hoàng", "Nhân Hoàng", "Trắc Tam Lý", "Trắc Hạ Tam Lý",
    "Uyển Thuận Một", "Uyển Thuận Hai", "Hỏa Quán", "Hỏa Lăng", "Hỏa Sơn", "Phân Kim",
    "Phù Đỉnh", "Hậu Chi", "Tứ Mã Thượng", "Tứ Mã Trung", "Tứ Mã Hạ",
]

def main():
    r = pypdf.PdfReader(PATH)
    points = []
    # Trang 25..54 (index 24..53) ứng với 30 huyệt theo đúng thứ tự liệt kê ở trang 23
    for idx in range(24, 54):
        t = r.pages[idx].extract_text() or ""
        lines = [l.strip() for l in t.split("\n") if l.strip()]
        # bỏ 2 dòng tiêu đề đầu (tên sách + số trang)
        body = lines[2:] if len(lines) > 2 else lines
        text = "\n".join(body)
        loc_m = re.search(r"Vị [Tt]rí\s*\n?(.*?)(?:Chỉ định|Chỉ đ ịnh)", text, re.S)
        ind_m = re.search(r"Chỉ [Dd]ịnh\s*\n?(.*?)$", text, re.S)
        location = loc_m.group(1).strip().replace("\n", " ") if loc_m else None
        rest = ind_m.group(1).strip() if ind_m else text
        points.append({
            "order": idx - 24,
            "name_guess": NAMES_ORDER[idx - 24] if idx - 24 < len(NAMES_ORDER) else None,
            "location": location,
            "rest_text": rest,
            "page": idx + 1,
        })
    with open(r"D:\yhct-tinh-hoa\scripts\dong_thi_ky_huyet_parsed.json", "w", encoding="utf-8") as fh:
        json.dump(points, fh, ensure_ascii=False, indent=1)
    print(f"TOTAL: {len(points)}", file=sys.stderr)

if __name__ == "__main__":
    main()

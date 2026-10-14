# -*- coding: utf-8 -*-
"""Phân tích 'cẩm nang huyệt.pdf' (Ths.Bs Trần Minh Quang, 2022): mỗi huyệt dạng
'N. Tên (kinh X)' / '- Vị trí:' / '- Tác dụng:' / '- Châm cứu:'. Chỉ lấy đúng nội
dung có trong file, không bịa thêm."""
import json, re, sys
import pypdf

PATH = r"D:\Tài liệu đông y\tài liệu y học\HUYỆT VỊ - KINH LẠC - R\cẩm nang huyệt.pdf"

def main():
    r = pypdf.PdfReader(PATH)
    full = ""
    for i, p in enumerate(r.pages):
        if i < 4:  # bỏ trang bìa + mục lục (ước lượng, sẽ lọc lại bằng vị trí 'Vị trí' bên dưới)
            continue
        full += (p.extract_text() or "") + "\n"

    # Header huyệt: "<so>.  <Ten> (<kinh...>)" đứng ngay trước dòng "- Vị trí"
    pattern = re.compile(r"\n\s*(\d{1,2})\.\s+([^\n(]+?)\s*(?:\(([^)]*)\))?\s*\n", re.M)
    matches = list(pattern.finditer(full))
    points = []
    for i, m in enumerate(matches):
        name = m.group(2).strip()
        meridian = (m.group(3) or "").strip() or None
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(full)
        block = full[start:end]
        if "Vị trí" not in block:
            continue  # không phải mục huyệt thật (vd mục lục sót lại)
        vitri_m = re.search(r"Vị trí\s*:?\s*(.*?)(?:-\s*T[aá]c d[uụ]ng|Châm cứu|$)", block, re.S)
        tacdung_m = re.search(r"T[aá]c d[uụ]ng\s*:?\s*(.*?)(?:-\s*Ch[aâ]m c[ứu]+|$)", block, re.S)
        cham_m = re.search(r"Ch[aâ]m c[ứu]+\s*:?\s*(.*)$", block, re.S)
        points.append({
            "name": name,
            "meridian": meridian,
            "location": vitri_m.group(1).strip().replace("\n", " ") if vitri_m else None,
            "actions": tacdung_m.group(1).strip().replace("\n", " ") if tacdung_m else None,
            "technique": cham_m.group(1).strip().replace("\n", " ") if cham_m else None,
        })
    # Lọc trùng tên liên tiếp giống hệt (đề phòng khớp 2 lần do mục lục + nội dung)
    seen = set()
    uniq = []
    for p in points:
        key = p["name"].lower()
        if key in seen and not p["location"]:
            continue
        seen.add(key)
        uniq.append(p)
    with open(r"D:\yhct-tinh-hoa\scripts\cam_nang_huyet_parsed.json", "w", encoding="utf-8") as fh:
        json.dump(uniq, fh, ensure_ascii=False, indent=1)
    print(f"TOTAL: {len(uniq)}", file=sys.stderr)

if __name__ == "__main__":
    main()

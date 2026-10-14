# -*- coding: utf-8 -*-
"""Phân tích 'kỳ huyệt.pdf' (Tân huyệt và Kỳ huyệt, nguồn dokinhlac.com.vn):
mỗi huyệt dạng 'N. Tên huyệt / Vị trí: ... / Cách châm: ... / Chủ trị: ...'.
Chỉ lấy đúng nội dung có trong file, không bịa thêm."""
import json, re, sys
import pypdf

PATH = r"D:\Tài liệu đông y\tài liệu y học\HUYỆT VỊ - KINH LẠC - R\kỳ huyệt.pdf"

def main():
    r = pypdf.PdfReader(PATH)
    full = ""
    for p in r.pages:
        t = p.extract_text() or ""
        # bỏ dòng tiêu đề lặp lại mỗi trang
        lines = [l for l in t.split("\n") if "HUYỆT VỊ TRÊN 14 ĐƯỜNG KINH" not in l and "dokinhlac.com.vn" not in l]
        full += "\n".join(lines) + "\n"

    # Tách theo mẫu "<số>. <Tên huyệt>" ở đầu dòng
    pattern = re.compile(r"\n(\d{1,3})\.\s+([^\n]+?)\s*\n", re.M)
    matches = list(pattern.finditer(full))
    points = []
    for i, m in enumerate(matches):
        num = m.group(1)
        name = m.group(2).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(full)
        block = full[start:end].strip()
        vitri_m = re.search(r"Vị trí\s*:?\s*(.*?)(?:Cách châm|Chủ trị|$)", block, re.S)
        cham_m = re.search(r"Cách châm\s*:?\s*(.*?)(?:Chủ trị|$)", block, re.S)
        chutri_m = re.search(r"Chủ trị\s*:?\s*(.*)$", block, re.S)
        points.append({
            "num": num,
            "name": name,
            "location": vitri_m.group(1).strip().replace("\n", " ") if vitri_m else None,
            "technique": cham_m.group(1).strip().replace("\n", " ") if cham_m else None,
            "indications": chutri_m.group(1).strip().replace("\n", " ") if chutri_m else None,
        })
    # Lọc bỏ các mục rõ ràng không phải huyệt (vd mục lục, không có Vị trí)
    points = [p for p in points if p["location"]]
    with open(r"D:\yhct-tinh-hoa\scripts\ky_huyet_parsed.json", "w", encoding="utf-8") as fh:
        json.dump(points, fh, ensure_ascii=False, indent=1)
    print(f"TOTAL: {len(points)}", file=sys.stderr)

if __name__ == "__main__":
    main()

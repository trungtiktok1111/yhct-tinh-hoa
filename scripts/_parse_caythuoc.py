# -*- coding: utf-8 -*-
"""Phân tách "Tuyển tập 3033 cây thuốc Đông y" (Y Học Cổ Truyền Tuệ Tĩnh) thành JSON theo từng vị thuốc.
Không bịa thêm nội dung — chỉ trích xuất nguyên văn theo các nhãn đã có sẵn trong nguồn."""
import re
import json

with open("scripts/_caythuoc_dump.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Loại bỏ các dòng số trang đứng riêng và dòng tiêu đề sách lặp lại.
lines = text.split("\n")
cleaned = []
for ln in lines:
    s = ln.strip()
    if re.fullmatch(r"\d{1,4}", s):
        continue
    if "TUYỂN TẬP 3033" in s or "Y HỌC CỔ TRUYỀN TUỆ" in s or "TUỆ-TĨNH" in s:
        continue
    cleaned.append(ln)
text = "\n".join(cleaned)

# Tìm tất cả các dòng khai báo tên khoa học (đánh dấu ranh giới bắt đầu 1 mục từ).
sci_line_re = re.compile(r"^(.*?)(?:thuộc họ|thuoc ho)\s+.+$", re.MULTILINE)
matches = list(sci_line_re.finditer(text))
print(f"Found {len(matches)} 'thuộc họ' boundary lines")

entries = []
for idx, m in enumerate(matches):
    start = m.start()
    end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
    block = text[start:end].strip()
    entries.append(block)

print(f"Total raw entry blocks: {len(entries)}")

def extract_name(block: str) -> str:
    first_line = block.split("\n")[0]
    # Bỏ số thứ tự kiểu "2. Tên khoa học: "
    first_line = re.sub(r"^\d+\.\s*Tên khoa học:\s*", "", first_line)
    # Tách theo dấu gạch ngang/en-dash trước phần Latin
    parts = re.split(r"\s[–-]\s", first_line, maxsplit=1)
    name = parts[0].strip()
    name = re.sub(r"\s+", " ", name)
    return name

def extract_field(block: str, labels: list[str], next_labels: list[str]) -> str | None:
    for label in labels:
        pat = re.compile(
            re.escape(label) + r"\s*:?\s*(.*?)(?=" +
            "|".join(re.escape(nl) + r"\s*:" for nl in next_labels) +
            r"|$)",
            re.DOTALL,
        )
        mm = pat.search(block)
        if mm:
            val = mm.group(1).strip()
            val = re.sub(r"\s+", " ", val)
            val = val.strip(" .")
            if val:
                return val
    return None

ALL_LABELS = [
    "Tên thường gọi", "Tên khoa học", "Mô tả", "Bộ phận dùng và thu hái",
    "Bộ phận dùng", "Nơi sống và thu hái", "Thành phần hoá học", "Thành phần hóa học",
    "Tính vị, tác dụng", "Tính vị tác dụng", "Công dụng", "Cách dùng", "Đơn thuốc",
]

results = []
for block in entries:
    name = extract_name(block)
    if not name or len(name) > 80 or len(name) < 2:
        continue
    # Phần "header" (tên-latin-họ) có thể bị PDF ngắt dòng giữa chừng; gộp các dòng cho tới
    # nhãn trường đầu tiên lại thành một chuỗi liền trước khi tách latin/họ.
    first_label_pos = len(block)
    for lbl in ALL_LABELS:
        mlbl = re.search(re.escape(lbl) + r"\s*:", block)
        if mlbl and mlbl.start() < first_label_pos:
            first_label_pos = mlbl.start()
    header_text = re.sub(r"\s+", " ", block[:first_label_pos]).strip()
    family_m = re.search(r"thuộc họ\s+(.+?)(?:\.|$)", header_text)
    family = family_m.group(1).strip() if family_m else None
    latin_m = re.search(r"[–-]\s*([A-Z][a-zA-Z.\s]+?)\s*,?\s*thuộc họ", header_text)
    latin_name = latin_m.group(1).strip().rstrip(",") if latin_m else None

    entry = {
        "name": name,
        "latinName": latin_name,
        "family": family,
        "botanicalDescription": extract_field(block, ["Mô tả"], ALL_LABELS),
        "partUsed": extract_field(block, ["Bộ phận dùng và thu hái", "Bộ phận dùng"], ALL_LABELS),
        "distribution": extract_field(block, ["Nơi sống và thu hái"], ALL_LABELS),
        "chemicalComposition": extract_field(block, ["Thành phần hoá học", "Thành phần hóa học"], ALL_LABELS),
        "natureFlavorActions": extract_field(block, ["Tính vị, tác dụng", "Tính vị tác dụng"], ALL_LABELS),
        "indications": extract_field(block, ["Công dụng"], ALL_LABELS),
        "dosage": extract_field(block, ["Cách dùng"], ALL_LABELS),
    }
    results.append(entry)

print(f"Parsed entries with a usable name: {len(results)}")
with open("scripts/_caythuoc_parsed.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=1)

# In vài mục mẫu để kiểm tra chất lượng.
for e in results[:3]:
    print(json.dumps(e, ensure_ascii=False, indent=1)[:800])
    print("---")

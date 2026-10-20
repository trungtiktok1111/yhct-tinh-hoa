# -*- coding: utf-8 -*-
"""Phân tách phần "Vị thuốc" (264 mục, từ A GIAO đến ĐƠN ĐỎ) trong "Đông Y Dược 2.0" (Lê Đình Sáng)
thành JSON theo từng vị thuốc. Nguồn trích dẫn nhiều sách kinh điển (Trung Dược Học, Đông Dược Học
Thiết Yếu, Bản Kinh...) cho mỗi trường — giữ nguyên các trích dẫn, không bịa thêm."""
import re
import json

with open("scripts/_bachkhoa_dump.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Phạm vi dòng (1-indexed trong grep) chứa đúng 264 mục vị thuốc, trước khi chuyển sang Bài thuốc.
HERB_START_LINE = 554
HERB_END_LINE = 36176 + 60  # chừa dư để lấy hết nội dung mục cuối (ĐƠN ĐỎ) trước dòng 265. BẠCH HỔ THANG
text = "".join(lines[HERB_START_LINE - 1 : HERB_END_LINE])

# Tách theo ranh giới "<số>. TÊN VIẾT HOA" ở đầu dòng.
header_re = re.compile(r"^(\d{1,3})\.\s+([A-ZÀ-Ỵ0-9 À-ỹĐƠƯ.,'-]{2,60})\s*$", re.MULTILINE)
matches = list(header_re.finditer(text))
print(f"Found {len(matches)} herb headers")

entries = []
for i, m in enumerate(matches):
    start = m.end()
    end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
    name = m.group(2).strip()
    body = text[start:end].strip()
    entries.append((name, body))

print(f"Total entries: {len(entries)}")

LABELS = {
    "aliasesVN": ["Tên Việt Nam", "Tên Khác", "Tên khác"],
    "aliasesHV": ["Tên Hán - Việt khác", "Tên Hán Việt khác", "Tên Hán-Việt khác"],
    "history": ["Lịch sử"],
    "latinName": ["Tên khoa học", "Tên Khoa Học", "Tên Khoa học"],
    "family": ["Họ khoa học", "Họ Khoa Học", "Thuộc họ"],
    "botanicalDescription": ["Mô tả", "Mô Tả"],
    "distinguish": ["Phân biệt chống nhầm lẫn", "Phân Biệt"],
    "distribution": ["Địa lý", "Địa Lý"],
    "partUsed": ["Phần dùng làm thuốc", "Phần Dùng Làm Thuốc", "Bộ phận dùng"],
    "harvest": ["Thu hái, sơ chế", "Thu Hái, Sơ Chế", "Thu Hoạch", "Thu hái"],
    "processing": ["Bào chế", "Bào Chế"],
    "chemicalComposition": ["Thành phần hóa học", "Thành Phần Hóa Học", "Thành phần hoá học"],
    "natureFlavor": ["Tính vị", "Tính Vị"],
    "meridians": ["Quy kinh", "Quy Kinh"],
    "actions": ["Tác dụng", "Tác Dụng"],
    "indications": ["Chủ trị", "Chủ Trị"],
    "usage": ["Cách dùng", "Cách Dùng"],
    "safetyNotes": ["Kiêng kỵ", "Kiêng Kỵ"],
    "dosage": ["Liều dùng", "Liều Dùng"],
    "clinicalRecipes": ["Đơn thuốc kinh nghiệm", "Đơn Thuốc Kinh Nghiệm"],
    "reference": ["Tham khảo", "Tham Khảo"],
}
ALL_LABEL_STRS = [lbl for group in LABELS.values() for lbl in group]

def extract_field(body: str, label_group: list[str]) -> str | None:
    for label in label_group:
        pat = re.compile(
            re.escape(label) + r"\s*:?\s*(.*?)(?=" +
            "|".join(re.escape(l) + r"\s*:" for l in ALL_LABEL_STRS) +
            r"|$)",
            re.DOTALL,
        )
        mm = pat.search(body)
        if mm:
            val = re.sub(r"\s+", " ", mm.group(1)).strip(" .")
            if val:
                return val
    return None

results = []
for name, body in entries:
    entry = {"name": name.title()}
    for key, labels in LABELS.items():
        entry[key] = extract_field(body, labels)
    results.append(entry)

with open("scripts/_bachkhoa_herbs_parsed.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=1)

print(f"Parsed {len(results)} herb entries -> scripts/_bachkhoa_herbs_parsed.json")
for e in results[:2]:
    print(json.dumps(e, ensure_ascii=False, indent=1)[:1200])
    print("---")

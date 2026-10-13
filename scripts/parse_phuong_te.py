# -*- coding: utf-8 -*-
"""
Phân tích PHƯƠNG TỄ: tìm MỌI slide có bảng chứa nhãn "Dược vị" (dấu hiệu
chắc chắn đây là một bài thuốc thật, phân biệt với slide "dược đối" chỉ có
Liều dùng). Tên bài thuốc lấy từ text ngắn trên CHÍNH slide đó nếu có,
nếu không thì lấy từ slide liền trước (tối đa 2 slide) có duy nhất 1 dòng
text ngắn (kiểu tiêu đề). Gộp thêm 1-2 slide theo sau nếu có text bổ sung
(vd "Ứng dụng lâm sàng") trước khi gặp slide trigger tiếp theo hoặc slide
tiêu đề mới.
"""
import glob, json, os, re, sys
from pptx import Presentation

ROOT = r"D:\Tài liệu đông y\tài liệu y học\PHƯƠNG TỄ"
FIELD_LABELS = {"Chủ trị", "Biện chứng", "Bệnh cơ", "Công dụng", "Dược vị", "Cách dùng", "Gia giảm", "Kinh nghiệm"}

def shapes_of(slide):
    texts, tables = [], []
    for shape in slide.shapes:
        if shape.has_text_frame and shape.text_frame.text.strip():
            texts.append(shape.text_frame.text.strip())
        elif shape.has_table:
            rows = [[c.text.strip() for c in row.cells] for row in shape.table.rows]
            tables.append(rows)
    return texts, tables

def clean_texts(texts):
    return [t for t in texts if not re.fullmatch(r"[\d\s‹#›]+", t)]

def short_title(texts):
    c = clean_texts(texts)
    if len(c) == 1 and 2 < len(c[0]) <= 60 and "\n" not in c[0]:
        return c[0]
    return None

def table_with_duoc_vi(tables):
    for rows in tables:
        labels = {r[0].strip() for r in rows if r}
        if "Dược vị" in labels:
            return rows
    return None

def parse_duoc_vi_table(rows):
    data = {}
    citation = rows[0][0].strip() if rows and rows[0] and rows[0][0].strip() not in FIELD_LABELS else None
    current_label = None
    for row in rows:
        if not row:
            continue
        label = row[0].strip()
        value = row[1].strip() if len(row) > 1 else ""
        if label in FIELD_LABELS:
            current_label = label
            data.setdefault(current_label, [])
            if value:
                data[current_label].append(value)
        elif current_label and value and not label:
            data[current_label].append(value)
        elif current_label and label and not value:
            data[current_label].append(label)
    return citation, {k: "\n".join(v) for k, v in data.items()}

DOSE_RE = re.compile(
    r"^(?P<name>.*?)\s*(?:đều\s*)?(?P<amount>\d+(?:[.,]\d+)?(?:\s*-\s*\d+(?:[.,]\d+)?)?)\s*"
    r"(?P<unit>g|mg|quả|lát|cọng|hạt|cái|chén)?\s*$"
)

def split_duoc_vi(text):
    """Tách chuỗi Dược vị thành list {name, amount, unit}. Quy ước:
    'A, B, C 6g' nghĩa là A, B, C đều 6g (dose cuối áp dụng ngược cho các vị
    liền trước chưa có liều riêng)."""
    if not text:
        return []
    # bỏ các dòng phụ như cách dùng lẫn vào (hiếm khi xảy ra do đã tách field)
    segments = [s.strip() for s in re.split(r",|\n", text) if s.strip()]
    result = []
    pending = []  # tên chưa có liều
    for seg in segments:
        m = DOSE_RE.match(seg)
        if m and m.group("amount"):
            name = m.group("name").strip()
            amount = m.group("amount").strip()
            unit = m.group("unit") or "g"
            if name:
                pending.append(name)
            for nm in pending:
                result.append({"name": nm, "amount": amount, "unit": unit})
            pending = []
        else:
            # không có liều riêng trên token này — giữ lại chờ token có liều phía sau
            if seg:
                pending.append(seg)
    for nm in pending:
        result.append({"name": nm, "amount": None, "unit": None})
    return result

def parse_file(path):
    p = Presentation(path)
    slides = list(p.slides)
    n = len(slides)
    slide_info = []
    for s in slides:
        t, tb = shapes_of(s)
        slide_info.append((t, tb))

    formulas = []
    i = 0
    while i < n:
        texts, tables = slide_info[i]
        dv_rows = table_with_duoc_vi(tables)
        if dv_rows is not None:
            name = short_title(texts)
            if not name:
                for back in (1, 2):
                    if i - back >= 0:
                        bt, btb = slide_info[i - back]
                        if not btb:
                            cand = short_title(bt)
                            if cand:
                                name = cand
                                break
            citation, fields = parse_duoc_vi_table(dv_rows)
            extra_notes = []
            j = i + 1
            steps = 0
            while j < n and steps < 2:
                nt, ntb = slide_info[j]
                if table_with_duoc_vi(ntb) is not None:
                    break
                if short_title(nt):
                    break
                if nt:
                    cleaned = clean_texts(nt)
                    if cleaned:
                        extra_notes.append("\n".join(cleaned))
                j += 1
                steps += 1
            formulas.append({
                "name": name or f"(không rõ tên, slide {i+1})",
                "citation": citation,
                "slide": i + 1,
                **fields,
                "extra_notes": "\n".join(extra_notes) if extra_notes else None,
                "ingredients": split_duoc_vi(fields.get("Dược vị")),
            })
        i += 1
    return formulas

def main():
    files = sorted(glob.glob(os.path.join(ROOT, "*.pptx")))
    all_data = {}
    for f in files:
        name = os.path.basename(f)
        try:
            formulas = parse_file(f)
            all_data[name] = formulas
            print(f"{name}: {len(formulas)} bài thuốc", file=sys.stderr)
        except Exception as e:
            print(f"{name}: ERROR {e}", file=sys.stderr)
    out_path = r"D:\yhct-tinh-hoa\scripts\phuong_te_parsed.json"
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(all_data, fh, ensure_ascii=False, indent=1)
    total = sum(len(v) for v in all_data.values() if isinstance(v, list))
    print(f"TOTAL formulas parsed: {total}", file=sys.stderr)

if __name__ == "__main__":
    main()

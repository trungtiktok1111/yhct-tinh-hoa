# -*- coding: utf-8 -*-
"""Xuất toàn bộ text (đoạn văn + bảng, theo đúng thứ tự) của 1 file .docx ra .txt để đọc."""
import sys, docx

def main():
    path = sys.argv[1]
    out = sys.argv[2]
    d = docx.Document(path)
    lines = []
    try:
        for block in d.iter_inner_content():
            if hasattr(block, "text"):
                lines.append(block.text)
            else:  # table
                for row in block.rows:
                    lines.append(" | ".join(c.text for c in row.cells))
    except AttributeError:
        for p in d.paragraphs:
            lines.append(p.text)
        for t in d.tables:
            for row in t.rows:
                lines.append(" | ".join(c.text for c in row.cells))
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print(len(lines), "lines ->", out)

if __name__ == "__main__":
    main()

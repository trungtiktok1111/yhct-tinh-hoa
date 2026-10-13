import pypdf, glob, os, sys, json

root = r"D:\Tài liệu đông y\tài liệu y học"
os.chdir(root)
files = glob.glob('**/*.pdf', recursive=True)
results = []
for i, f in enumerate(files):
    entry = {"path": f, "pages": None, "chars_per_page": None, "kind": "error"}
    try:
        r = pypdf.PdfReader(f)
        n = len(r.pages)
        entry["pages"] = n
        sample_n = min(n, 3)
        total_chars = 0
        for p in range(sample_n):
            try:
                t = r.pages[p].extract_text() or ""
                total_chars += len(t)
            except Exception:
                pass
        cpp = total_chars / max(sample_n, 1)
        entry["chars_per_page"] = round(cpp, 1)
        entry["kind"] = "text" if cpp > 200 else "scan_or_empty"
    except Exception as e:
        entry["error"] = str(e)[:100]
    results.append(entry)
    if (i+1) % 50 == 0:
        print(f"...{i+1}/{len(files)}", file=sys.stderr)

with open(r"D:\yhct-tinh-hoa\scripts\pdf_classification.json", "w", encoding="utf-8") as fh:
    json.dump(results, fh, ensure_ascii=False, indent=1)

text_count = sum(1 for r in results if r["kind"] == "text")
print(f"Done. {text_count}/{len(results)} classified as text-based.")

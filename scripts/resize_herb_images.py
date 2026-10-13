import glob, os, json
from PIL import Image

SRC_DIR = r"D:\yhct-tinh-hoa\public\images\herbs"
MAX_SIDE = 480

files = glob.glob(os.path.join(SRC_DIR, "*.*"))
total_before = 0
total_after = 0
renamed_map = {}
for f in files:
    total_before += os.path.getsize(f)
    img = Image.open(f).convert("RGB")
    w, h = img.size
    scale = MAX_SIDE / max(w, h)
    if scale < 1:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    base = os.path.splitext(os.path.basename(f))[0]
    new_path = os.path.join(SRC_DIR, base + ".jpg")
    img.save(new_path, "JPEG", quality=72, optimize=True)
    if not new_path.lower() == f.lower():
        os.remove(f)
    total_after += os.path.getsize(new_path)
    renamed_map[os.path.basename(f)] = os.path.basename(new_path)

print(f"Before: {total_before/1e6:.1f} MB, After: {total_after/1e6:.1f} MB")
with open(r"D:\yhct-tinh-hoa\scripts\herb_image_rename_map.json", "w", encoding="utf-8") as fh:
    json.dump(renamed_map, fh, ensure_ascii=False, indent=1)

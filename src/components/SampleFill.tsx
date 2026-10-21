"use client";

// Điền sẵn ví dụ mẫu vào form tứ chẩn để người dùng xem cách ghi (chưa lưu cho đến khi bấm Lưu).
const SAMPLE: [string, string][] = [
  ["han_nhiet", "so_lanh_o_han"],
  ["han_nhiet", "so_gio"],
  ["mo_hoi", "khong_ra_mo_hoi"],
  ["dau_than", "dau_co_vai_gay"],
  ["luoi_reu", "trang"],
  ["luoi_reu_tc", "mong"],
  ["mach_tong", "phu"],
  ["mach_tong", "khan"],
];

export function SampleFill() {
  function fill() {
    let n = 0;
    for (const [k, v] of SAMPLE) {
      const els = document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[name="t_${k}"]`);
      els.forEach((el) => {
        if (el instanceof HTMLSelectElement) { if ([...el.options].some((o) => o.value === v)) { el.value = v; n++; } else return; }
        else if (el.value === v) { el.checked = true; n++; }
        else return;
        let p: HTMLElement | null = el.parentElement;
        while (p) { if (p instanceof HTMLDetailsElement) p.open = true; p = p.parentElement; }
      });
    }
    alert(`Đã tích sẵn ${n} mục mẫu. Xem lại rồi bỏ tích hoặc bấm Lưu. Chưa lưu cho đến khi bạn bấm “Lưu tứ chẩn”.`);
  }
  return (
    <button type="button" onClick={fill} className="rounded-lg border border-brand-deep px-3 py-1.5 text-sm font-semibold text-brand-deep hover:bg-brand-deep hover:text-brand-cream">
      Điền thử ví dụ này vào form
    </button>
  );
}

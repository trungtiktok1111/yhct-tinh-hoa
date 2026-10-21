// Bỏ dấu, hạ chữ thường: so khớp tên không phân biệt dấu.
export const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

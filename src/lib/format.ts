export const vnd = (n: number) => n.toLocaleString("vi-VN") + " đ";
export const qty = (n: number) => (Math.round(n * 100) / 100).toLocaleString("vi-VN");
export const dateVN = (d: Date) => d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

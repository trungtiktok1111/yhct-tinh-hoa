import { prisma } from "@/lib/db";
import { typeLabel } from "@/lib/constants";
import { tableBook, fmtDay, fmtTime, VN, type KitCol, type KitCell } from "@/lib/xlsxKit";

// Các báo cáo Excel dạng bảng. Mỗi hàm trả về một file theo khung chung (xlsxKit).
export type Ctx = {
  branchIds: string[]; branchLabel: string; singleBranch: { id: string; name: string } | null;
  from: string; to: string; start: Date; end: Date; cost: boolean; by: string;
};
type Row = Record<string, KitCell>;
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const dayKey = (d: Date) => new Date(d.getTime() + VN).toISOString().slice(0, 10);
const dmy = (s: string) => s.split("-").reverse().join("/");
const kindLabel = (k: string) => (k === "RETAIL" ? "Bán lẻ" : "Khám");
const SOON = 90 * 86400_000;

export const BUILDERS: Record<string, (c: Ctx) => Promise<{ buf: Buffer; file: string }>> = {
  async "doanh-thu"(c) {
    const inv = await prisma.invoice.findMany({
      where: { branchId: { in: c.branchIds }, status: "PAID", paidAt: { gte: c.start, lt: c.end } },
      select: { paidAt: true, total: true, method: true, kind: true, discount: true },
    });
    const by = new Map<string, Row>();
    const get = (k: string) => by.get(k) ?? by.set(k, { day: dmy(k), n: 0, kham: 0, le: 0, cash: 0, bank: 0, card: 0, disc: 0, total: 0 }).get(k)!;
    for (const i of inv) {
      const r = get(dayKey(i.paidAt as Date));
      r.n = (r.n as number) + 1;
      if (i.kind === "RETAIL") r.le = (r.le as number) + i.total; else r.kham = (r.kham as number) + i.total;
      if (i.method === "CASH") r.cash = (r.cash as number) + i.total;
      else if (i.method === "TRANSFER") r.bank = (r.bank as number) + i.total;
      else if (i.method === "CARD") r.card = (r.card as number) + i.total;
      r.disc = (r.disc as number) + (i.discount ?? 0);
      r.total = (r.total as number) + i.total;
    }
    const rows = [...by.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, r]) => r);
    const cols: KitCol[] = [
      { h: "Ngày", w: 13, key: "day", kind: "center" }, { h: "Số hóa đơn", w: 11, key: "n", kind: "int", total: true },
      { h: "Thu từ khám", w: 16, key: "kham", kind: "money", total: true }, { h: "Thu bán lẻ", w: 16, key: "le", kind: "money", total: true },
      { h: "Tiền mặt", w: 16, key: "cash", kind: "money", total: true }, { h: "Chuyển khoản", w: 16, key: "bank", kind: "money", total: true },
      { h: "Thẻ", w: 14, key: "card", kind: "money", total: true }, { h: "Giảm giá đã cho", w: 15, key: "disc", kind: "money", total: true },
      { h: "Tổng thu", w: 17, key: "total", kind: "money", total: true },
    ];
    const buf = await tableBook({ sheet: "Doanh thu", title: "Báo cáo doanh thu theo ngày", branch: c.branchLabel, period: { from: c.from, to: c.to }, note: "Chỉ tính hóa đơn đã thu tiền, theo ngày thu. Đơn vị: đồng. Tổng thu = Thu từ khám + Thu bán lẻ = Tiền mặt + Chuyển khoản + Thẻ.", by: c.by, cols, rows });
    return { buf, file: `doanh-thu-${c.from}_${c.to}` };
  },

  async "bang-ke-hd"(c) {
    const inv = await prisma.invoice.findMany({
      where: { branchId: { in: c.branchIds }, status: "PAID", paidAt: { gte: c.start, lt: c.end } }, orderBy: { paidAt: "asc" },
      include: { patient: { select: { fullName: true } }, branch: { select: { name: true } } },
    });
    const rows: Row[] = inv.map((i, k) => ({ stt: k + 1, no: `HD-${String(i.seq).padStart(6, "0")}`, at: fmtTime(i.paidAt as Date), branch: i.branch.name, who: i.patient?.fullName ?? i.customerName ?? "Khách lẻ", kind: kindLabel(i.kind), method: i.method ? METHOD[i.method] ?? i.method : "", staff: i.staffName ?? "", total: i.total }));
    const cols: KitCol[] = [
      { h: "STT", w: 6, key: "stt", kind: "center" }, { h: "Số hóa đơn", w: 14, key: "no", kind: "center" }, { h: "Ngày giờ thu", w: 17, key: "at", kind: "center" },
      { h: "Chi nhánh", w: 24, key: "branch" }, { h: "Bệnh nhân / khách", w: 26, key: "who" }, { h: "Loại", w: 10, key: "kind", kind: "center" },
      { h: "Hình thức", w: 14, key: "method", kind: "center" }, { h: "Người thu", w: 18, key: "staff" }, { h: "Tổng tiền", w: 16, key: "total", kind: "money", total: true },
    ];
    const buf = await tableBook({ sheet: "Bảng kê hóa đơn", title: "Bảng kê hóa đơn", branch: c.branchLabel, period: { from: c.from, to: c.to }, note: "Hóa đơn đã thu tiền trong kỳ, theo thứ tự thời gian. Đơn vị: đồng.", by: c.by, cols, rows });
    return { buf, file: `bang-ke-hoa-don-${c.from}_${c.to}` };
  },

  async "ban-theo-mat-hang"(c) {
    const lines = await prisma.invoiceLine.findMany({
      where: { itemId: { not: null }, invoice: { branchId: { in: c.branchIds }, status: "PAID", paidAt: { gte: c.start, lt: c.end } } },
      select: { itemId: true, name: true, unit: true, qty: true, amount: true, invoiceId: true },
    });
    const items = await prisma.item.findMany({ select: { id: true, code: true } });
    const code = new Map(items.map((i) => [i.id, i.code ?? ""]));
    const m = new Map<string, { code: string; name: string; unit: string; qty: number; amt: number; inv: Set<string> }>();
    for (const l of lines) {
      const k = `${l.itemId}`;
      const r = m.get(k) ?? m.set(k, { code: String(code.get(l.itemId as string) ?? ""), name: l.name, unit: l.unit, qty: 0, amt: 0, inv: new Set() }).get(k)!;
      r.qty += l.qty; r.amt += l.amount; r.inv.add(l.invoiceId);
    }
    const rows: Row[] = [...m.values()].sort((a, b) => b.amt - a.amt).map((r, k) => ({ stt: k + 1, code: r.code, name: r.name, unit: r.unit, qty: Math.round(r.qty * 100) / 100, n: r.inv.size, amt: r.amt }));
    const cols: KitCol[] = [
      { h: "STT", w: 6, key: "stt", kind: "center" }, { h: "Mã hàng", w: 11, key: "code", kind: "center" }, { h: "Tên mặt hàng", w: 32, key: "name" }, { h: "ĐVT", w: 8, key: "unit", kind: "center" },
      { h: "Số lượng bán", w: 15, key: "qty", kind: "num" }, { h: "Số hóa đơn", w: 12, key: "n", kind: "int" }, { h: "Thành tiền", w: 17, key: "amt", kind: "money", total: true },
    ];
    const buf = await tableBook({ sheet: "Doanh số mặt hàng", title: "Doanh số theo mặt hàng", branch: c.branchLabel, period: { from: c.from, to: c.to }, note: "Sắp theo thành tiền giảm dần. Chỉ tính hóa đơn đã thu. Số lượng không cộng chung vì khác đơn vị tính.", by: c.by, cols, rows });
    return { buf, file: `doanh-so-mat-hang-${c.from}_${c.to}` };
  },

  async "lo-han-dung"(c) {
    const lots = await prisma.stockLot.findMany({
      where: { branchId: { in: c.branchIds }, qtyRemaining: { gt: 0 } },
      include: { item: { select: { code: true, name: true, unit: true } } },
      orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }, { receivedAt: "asc" }],
    });
    const now = Date.now();
    const rows: Row[] = lots.map((l, k) => {
      const e = l.expiryDate?.getTime();
      const st = e == null ? "Chưa ghi hạn" : e < now ? "Đã hết hạn" : e < now + SOON ? "Sắp hết hạn (≤ 90 ngày)" : "Còn hạn";
      return { stt: k + 1, code: l.item.code ?? "", name: l.item.name, pn: l.note?.match(/PN-[0-9]{8}-[0-9A-F]{3,6}/)?.[0] ?? "", at: fmtDay(l.receivedAt), sup: l.supplier ?? "", exp: l.expiryDate ? new Date(l.expiryDate.getTime()).toISOString().slice(0, 10).split("-").reverse().join("/") : "", unit: l.item.unit, left: Math.round(l.qtyRemaining * 100) / 100, cost: c.cost ? l.unitCost : null, val: c.cost ? Math.round(l.qtyRemaining * l.unitCost) : null, st };
    });
    const cols: KitCol[] = [
      { h: "STT", w: 6, key: "stt", kind: "center" }, { h: "Mã hàng", w: 10, key: "code", kind: "center" }, { h: "Tên mặt hàng", w: 28, key: "name" }, { h: "Số phiếu nhập", w: 19, key: "pn", kind: "center" },
      { h: "Ngày nhập", w: 12, key: "at", kind: "center" }, { h: "Nhà cung cấp", w: 22, key: "sup" }, { h: "Hạn dùng", w: 12, key: "exp", kind: "center" }, { h: "ĐVT", w: 7, key: "unit", kind: "center" }, { h: "Còn lại", w: 13, key: "left", kind: "num" },
      ...(c.cost ? ([{ h: "Giá nhập", w: 11, key: "cost", kind: "money" }, { h: "Giá trị còn lại", w: 16, key: "val", kind: "money", total: true }] as KitCol[]) : []),
      { h: "Tình trạng hạn", w: 22, key: "st" },
    ];
    const buf = await tableBook({ sheet: "Lô hàng", title: "Sổ lô hàng và hạn dùng", branch: c.branchLabel, note: "Các lô còn hàng, sắp theo hạn dùng gần nhất trước. Hàng sắp hết hạn nên ưu tiên dùng hoặc xử lý.", by: c.by, cols, rows });
    return { buf, file: `lo-hang-han-dung-${dayKey(new Date())}` };
  },

  async "bang-gia"(c) {
    const items = await prisma.item.findMany({
      where: { active: true }, orderBy: [{ type: "asc" }, { name: "asc" }],
      include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 }, lots: { where: { branchId: { in: c.branchIds } }, orderBy: { receivedAt: "desc" }, take: 1, select: { unitCost: true } } },
    });
    const rows: Row[] = items.map((i, k) => ({ stt: k + 1, code: i.code ?? "", name: i.name, type: typeLabel(i.type), unit: i.unit, price: i.prices[0]?.price ?? null, min: i.minStock, cost: c.cost ? i.lots[0]?.unitCost ?? null : null }));
    const cols: KitCol[] = [
      { h: "STT", w: 6, key: "stt", kind: "center" }, { h: "Mã hàng", w: 11, key: "code", kind: "center" }, { h: "Tên mặt hàng", w: 32, key: "name" }, { h: "Loại", w: 12, key: "type", kind: "center" }, { h: "ĐVT", w: 8, key: "unit", kind: "center" },
      { h: "Giá bán (đ / ĐVT)", w: 16, key: "price", kind: "money" }, { h: "Tồn tối thiểu", w: 14, key: "min", kind: "num" },
      ...(c.cost ? ([{ h: "Giá nhập gần nhất (đ / ĐVT)", w: 20, key: "cost", kind: "money" }] as KitCol[]) : []),
    ];
    const buf = await tableBook({ sheet: "Bảng giá", title: "Danh mục mặt hàng và bảng giá", branch: c.branchLabel, note: "Dược liệu tính giá theo gam. Giá bán là giá hiện hành.", by: c.by, cols, rows, signatures: false });
    return { buf, file: `bang-gia-${dayKey(new Date())}` };
  },

  async "nha-cung-cap"(c) {
    const sups = await prisma.supplier.findMany({ orderBy: { name: "asc" }, include: { lots: { where: { branchId: { in: c.branchIds } }, select: { qtyReceived: true, unitCost: true } } } });
    const rows: Row[] = sups.map((s, k) => ({ stt: k + 1, name: s.name, phone: s.phone ?? "", addr: s.address ?? "", n: s.lots.length, val: Math.round(s.lots.reduce((a, l) => a + l.qtyReceived * l.unitCost, 0)), st: s.active ? "Đang dùng" : "Ngừng", note: s.note ?? "" }));
    const cols: KitCol[] = [
      { h: "STT", w: 6, key: "stt", kind: "center" }, { h: "Nhà cung cấp", w: 28, key: "name" }, { h: "Điện thoại", w: 15, key: "phone" }, { h: "Địa chỉ", w: 34, key: "addr" },
      { h: "Số lô đã nhập", w: 13, key: "n", kind: "int", total: true }, { h: "Tổng giá trị nhập", w: 18, key: "val", kind: "money", total: true }, { h: "Trạng thái", w: 12, key: "st", kind: "center" }, { h: "Ghi chú", w: 26, key: "note" },
    ];
    const buf = await tableBook({ sheet: "Nhà cung cấp", title: "Danh sách nhà cung cấp", branch: c.branchLabel, note: "Tổng giá trị nhập = số lượng nhập × giá nhập của mọi lô từ nhà cung cấp này tại chi nhánh.", by: c.by, cols, rows });
    return { buf, file: `nha-cung-cap-${dayKey(new Date())}` };
  },

  async "so-kham"(c) {
    const vs = await prisma.visit.findMany({
      where: { branchId: { in: c.branchIds }, createdAt: { gte: c.start, lt: c.end } }, orderBy: { createdAt: "asc" },
      include: { patient: { select: { seq: true, fullName: true } }, branch: { select: { name: true } } },
    });
    const ST: Record<string, string> = { WAITING: "Đang chờ", IN_EXAM: "Đang khám", DONE: "Đã khám", CANCELLED: "Đã hủy" };
    const rows: Row[] = vs.map((v) => ({ day: fmtDay(v.createdAt), q: v.queueNo, code: `BN-${String(v.patient.seq).padStart(6, "0")}`, name: v.patient.fullName, branch: v.branch.name, doc: v.doctorName ?? "", reason: v.reason ?? "", st: ST[v.status] ?? v.status }));
    const cols: KitCol[] = [
      { h: "Ngày", w: 12, key: "day", kind: "center" }, { h: "STT khám", w: 9, key: "q", kind: "center" }, { h: "Mã BN", w: 12, key: "code", kind: "center" }, { h: "Họ tên", w: 26, key: "name" },
      { h: "Chi nhánh", w: 22, key: "branch" }, { h: "Bác sĩ", w: 20, key: "doc" }, { h: "Lý do khám", w: 34, key: "reason" }, { h: "Trạng thái", w: 12, key: "st", kind: "center" },
    ];
    const buf = await tableBook({ sheet: "Sổ khám", title: "Sổ khám bệnh", branch: c.branchLabel, period: { from: c.from, to: c.to }, note: `${vs.length} lượt tiếp đón trong kỳ.`, by: c.by, cols, rows });
    return { buf, file: `so-kham-${c.from}_${c.to}` };
  },

  async "ds-benh-nhan"(c) {
    const ps = await prisma.patient.findMany({ orderBy: { seq: "asc" } });
    const sex: Record<string, string> = { M: "Nam", F: "Nữ", O: "Khác" };
    const rows: Row[] = ps.map((p) => ({ code: `BN-${String(p.seq).padStart(6, "0")}`, name: p.fullName, sex: sex[p.sex] ?? p.sex, dob: p.birthDate ? p.birthDate.toISOString().slice(0, 10).split("-").reverse().join("/") : String(p.birthYear), phone: p.phone, addr: [p.address, p.ward, p.district, p.province].filter(Boolean).join(", "), created: fmtDay(p.createdAt) }));
    const cols: KitCol[] = [
      { h: "Mã BN", w: 12, key: "code", kind: "center" }, { h: "Họ tên", w: 26, key: "name" }, { h: "Giới", w: 8, key: "sex", kind: "center" }, { h: "Ngày sinh", w: 12, key: "dob", kind: "center" },
      { h: "Điện thoại", w: 15, key: "phone" }, { h: "Địa chỉ", w: 44, key: "addr" }, { h: "Ngày tạo hồ sơ", w: 14, key: "created", kind: "center" },
    ];
    const buf = await tableBook({ sheet: "Bệnh nhân", title: "Danh sách bệnh nhân", note: `${ps.length} hồ sơ. File có thông tin cá nhân, chỉ dùng nội bộ, không gửi ra ngoài.`, by: c.by, cols, rows });
    return { buf, file: `danh-sach-benh-nhan-${dayKey(new Date())}` };
  },

  async "nhat-ky"(c) {
    const logs = await prisma.auditLog.findMany({ where: { at: { gte: c.start, lt: c.end } }, orderBy: { at: "asc" }, take: 20000 });
    const rows: Row[] = logs.map((l) => ({ at: fmtTime(l.at), who: l.staffName ?? "", act: l.action, ent: l.entity, detail: l.detail ?? "" }));
    const cols: KitCol[] = [
      { h: "Thời gian", w: 17, key: "at", kind: "center" }, { h: "Người dùng", w: 22, key: "who" }, { h: "Hành động", w: 16, key: "act", kind: "center" }, { h: "Đối tượng", w: 16, key: "ent" }, { h: "Chi tiết", w: 70, key: "detail" },
    ];
    const buf = await tableBook({ sheet: "Nhật ký", title: "Nhật ký thao tác", period: { from: c.from, to: c.to }, note: logs.length >= 20000 ? "Chỉ xuất 20.000 dòng đầu của kỳ. Hãy chọn kỳ ngắn hơn." : `${logs.length} thao tác.`, by: c.by, cols, rows });
    return { buf, file: `nhat-ky-${c.from}_${c.to}` };
  },
};

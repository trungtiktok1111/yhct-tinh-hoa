import { requireRole } from "@/lib/auth";
import { STOCK_WRITE_ROLES } from "@/lib/permissions";
import { importStockExcel } from "@/actions/stock";
import { KhoTabs } from "@/components/KhoTabs";
import { BackLink } from "@/components/BackLink";
import { ExcelImport } from "@/components/ExcelImport";
import { branchesFor } from "@/lib/stock";

export const dynamic = "force-dynamic";

export default async function ExcelReceivePage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const branches = await branchesFor(staff);
  return (
    <div className="space-y-5">
      <BackLink href="/kho/nhap" label="Quay lại Nhập kho" />
      <KhoTabs active="nhap" />
      <div>
        <h1 className="text-2xl font-bold font-display">Nhập kho từ Excel</h1>
        <p className="mt-1 text-sm text-brand-ink/70">Tải phiếu mẫu (đã có sẵn mã hàng, tồn kho, giá hiện tại), điền các cột vàng, rồi tải lên. App hiện bảng xem trước từng dòng và chỉ lưu khi bạn xác nhận.</p>
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã nhập kho {searchParams.ok} dòng.</div>}
      {branches.length === 0 ? <div className="warn-box text-sm">Chưa có chi nhánh.</div> : <ExcelImport branches={branches} action={importStockExcel} />}
    </div>
  );
}

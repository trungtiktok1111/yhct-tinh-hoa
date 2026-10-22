import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { branchesFor } from "@/lib/stock";
import { hasAny } from "@/lib/permissions";
import { IMPORTERS } from "@/lib/importers";
import { formById } from "@/lib/forms";
import { PageHead } from "@/components/ui";
import { GenericImport } from "@/components/GenericImport";
import { Upload } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ImportPage({ params, searchParams }: { params: { id: string }; searchParams: { ok?: string; loi?: string } }) {
  const imp = IMPORTERS[params.id];
  if (!imp) notFound();
  const staff = await requireStaff();
  if (!hasAny(staff.roles, imp.roles)) redirect("/khong-co-quyen");
  const branches = await branchesFor(staff);
  const def = formById(params.id);
  return (
    <div className="space-y-4">
      <PageHead icon={Upload} title={`Tải lên: ${imp.name}`} sub="Chọn file đã điền theo mẫu. App kiểm tra từng dòng và chỉ lưu khi bạn xác nhận.">
        <Link href="/bieu-mau" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-brand-deep">Về Biểu mẫu</Link>
        {def && <a href={`/bieu-mau/mau/${imp.id}`} className="rounded-xl bg-brand-deep px-4 py-2 text-sm font-semibold text-white">Tải mẫu mới</a>}
      </PageHead>
      {searchParams.ok && <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">{searchParams.ok}</div>}
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <GenericImport id={imp.id} name={imp.name} branches={branches} needsBranch={imp.needsBranch} columns={imp.columns} hint={imp.allowedHint} />
    </div>
  );
}

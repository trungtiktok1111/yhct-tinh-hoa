import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default async function HerbDetailPage({ params }: { params: { id: string } }) {
  const herb = await prisma.herb.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      formulaLinks: { include: { formula: true } },
    },
  });
  if (!herb) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/vi-thuoc" className="text-sm text-brand-deep underline">
          ← Danh mục vị thuốc
        </Link>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{herb.standardName}</h1>
          <StatusPill status={herb.status} />
        </div>
        {herb.aliases && <p className="text-sm text-gray-500">Tên khác: {herb.aliases}</p>}
      </div>

      <div className="card space-y-3">
        <Field label="Tên khoa học" value={herb.latinName} />
        <Field label="Bộ phận dùng" value={herb.partUsed} />
        <Field label="Nguồn gốc" value={herb.origin} />
        <Field label="Tính vị" value={herb.natureFlavor} />
        <Field label="Quy kinh" value={herb.meridians} />
        <Field label="Công năng" value={herb.actions} />
        <Field label="Chủ trị" value={herb.indications} />
        <Field label="Liều dùng theo nguồn" value={herb.dosage} />
        {herb.safetyNotes && (
          <div className="warn-box">
            <div className="text-xs uppercase tracking-wide">An toàn</div>
            <div className="whitespace-pre-wrap">{herb.safetyNotes}</div>
          </div>
        )}
        {herb.source && <div className="text-xs text-gray-500 border-t pt-2">Nguồn: {herb.source.title}</div>}
        {!herb.source && <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này.</div>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-2">Xuất hiện trong bài thuốc</h2>
        <ul className="space-y-1">
          {herb.formulaLinks.map((fi) => (
            <li key={fi.id}>
              <Link href={`/bai-thuoc/${fi.formula.id}`} className="text-brand-deep underline">
                {fi.formula.name}
              </Link>
              {fi.role && <span className="text-xs text-gray-500 ml-1">— vai trò {fi.role}</span>}
            </li>
          ))}
          {herb.formulaLinks.length === 0 && (
            <p className="text-sm text-gray-500">Chưa thuộc bài thuốc nào trong hệ thống.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

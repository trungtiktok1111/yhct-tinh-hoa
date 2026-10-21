import { EntityToolbar } from "@/components/EntityToolbar";
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

export default async function PointDetailPage({ params }: { params: { id: string } }) {
  const point = await prisma.acupuncturePoint.findUnique({
    where: { id: params.id },
    include: { source: true, protocolLinks: { include: { protocol: true } } },
  });
  if (!point) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/cham-cuu" className="text-sm text-brand-deep underline">
          ← Danh mục huyệt vị
        </Link>
        <EntityToolbar entity="cham-cuu" id={params.id} />
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">
            {point.code ? `${point.code} — ` : ""}
            {point.standardName}
          </h1>
          <StatusPill status={point.status} />
        </div>
        {point.meridian && <p className="text-sm text-gray-500">Kinh mạch: {point.meridian}</p>}
      </div>

      <div className="card space-y-3">
        <Field label="Vị trí" value={point.location} />
        <Field label="Ghi chú giải phẫu" value={point.anatomyNotes} />
        <Field label="Tác dụng theo nguồn" value={point.actions} />
        <Field label="Kỹ thuật" value={point.technique} />
        {(point.contraindications || point.riskNotes) && (
          <div className="warn-box space-y-1">
            <div className="text-xs uppercase tracking-wide">An toàn</div>
            {point.contraindications && <div>Chống chỉ định: {point.contraindications}</div>}
            {point.riskNotes && <div>Rủi ro giải phẫu: {point.riskNotes}</div>}
          </div>
        )}
        {point.source && <div className="text-xs text-gray-500 border-t pt-2">Nguồn: {point.source.title}</div>}
        {!point.source && <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này.</div>}
      </div>

      {point.protocolLinks.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-2">Phối huyệt sử dụng huyệt này</h2>
          <ul className="space-y-1">
            {point.protocolLinks.map((l) => (
              <li key={l.id}>
                {l.protocol.name} {l.role && <span className="text-xs text-gray-500">({l.role})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

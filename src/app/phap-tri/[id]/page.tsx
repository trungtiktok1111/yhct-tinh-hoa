import { EntityToolbar } from "@/components/EntityToolbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { unlinkPatternPrinciple } from "@/actions/entity";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { getCurrentStaff } from "@/lib/auth";
import { canEditKnowledge } from "@/lib/permissions";


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

export default async function PrincipleDetailPage({ params }: { params: { id: string } }) {
  const principle = await prisma.treatmentPrinciple.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      patternLinks: { include: { pattern: true } },
      formulas: true,
      protocols: true,
    },
  });
  if (!principle) notFound();
  const staff = await getCurrentStaff();
  const canEdit = !!staff && canEditKnowledge(staff.role);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/phap-tri" className="text-sm text-brand-deep underline">
          ← Danh mục pháp trị
        </Link>
        <EntityToolbar entity="phap-tri" id={params.id} />
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{principle.name}</h1>
          <StatusPill status={principle.status} />
        </div>
      </div>

      <div className="card space-y-3">
        <Field label="Mô tả" value={principle.description} />
        <Field label="Mục tiêu" value={principle.goal} />
        <Field label="Tình huống áp dụng" value={principle.scope} />
        <Field label="Giới hạn" value={principle.limitations} />
        {principle.source && (
          <div className="text-xs text-gray-500 border-t pt-2">Nguồn: {principle.source.title}</div>
        )}
        {!principle.source && <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này.</div>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-2">Chứng hậu liên quan</h2>
        <ul className="space-y-1">
          {principle.patternLinks.map((l) => (
            <li key={l.id}>
              <Link href={`/chung-hau/${l.pattern.id}`} className="text-brand-deep underline">
                {l.pattern.name}
              </Link>
              {canEdit && (
                <form action={unlinkPatternPrinciple} className="inline ml-2">
                  <input type="hidden" name="linkId" value={l.id} />
                  <ConfirmSubmit message="Gỡ liên kết này?" className="rounded border border-red-300 text-red-800 px-2 py-0.5 text-xs">Gỡ</ConfirmSubmit>
                </form>
              )}
            </li>
          ))}
          {principle.patternLinks.length === 0 && <p className="text-sm text-gray-500">Chưa liên kết.</p>}
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-2">Bài thuốc liên quan</h2>
        <ul className="space-y-1 mb-2">
          {principle.formulas.map((f) => (
            <li key={f.id}>
              <Link href={`/bai-thuoc/${f.id}`} className="text-brand-deep underline">
                {f.name}
              </Link>
            </li>
          ))}
          {principle.formulas.length === 0 && <p className="text-sm text-gray-500">Chưa có bài thuốc nào gắn pháp trị này.</p>}
        </ul>
        <Link href="/bai-thuoc/moi" className="text-xs underline text-brand-deep">
          + Thêm bài thuốc theo pháp trị này
        </Link>
      </div>

      {principle.protocols.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-2">Phối huyệt liên quan</h2>
          <ul className="space-y-1">
            {principle.protocols.map((pr) => (
              <li key={pr.id}>{pr.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

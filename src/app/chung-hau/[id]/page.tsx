import { EntityToolbar } from "@/components/EntityToolbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { linkPatternPrinciple } from "@/actions/content";
import { unlinkDiseasePattern, unlinkPatternPrinciple } from "@/actions/entity";
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

export default async function PatternDetailPage({ params }: { params: { id: string } }) {
  const pattern = await prisma.pattern.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      diseaseLinks: { include: { disease: true } },
      principleLinks: { include: { principle: true } },
    },
  });
  if (!pattern) notFound();
  const staff = await getCurrentStaff();
  const canEdit = !!staff && canEditKnowledge(staff.role);

  const allPrinciples = canEdit ? await prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }) : [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/chung-hau" className="text-sm text-brand-deep underline">
          ← Danh mục chứng hậu
        </Link>
        <EntityToolbar entity="chung-hau" id={params.id} />
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{pattern.name}</h1>
          <StatusPill status={pattern.status} />
        </div>
      </div>

      <div className="card space-y-3">
        <Field label="Mô tả" value={pattern.description} />
        <Field label="Tiêu chí ủng hộ" value={pattern.supportCriteria} />
        <Field label="Tiêu chí không phù hợp" value={pattern.againstCriteria} />
        <Field label="Dấu hiệu trọng yếu" value={pattern.keySigns} />
        <Field label="Dữ kiện cần hỏi thêm" value={pattern.missingDataPrompts} />
        {pattern.source && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Nguồn: {pattern.source.title}
            {pattern.source.version ? ` — ${pattern.source.version}` : ""}
          </div>
        )}
        {!pattern.source && <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này.</div>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-3">Bệnh liên quan</h2>
        <ul className="space-y-1">
          {pattern.diseaseLinks.map((l) => (
            <li key={l.id}>
              <Link href={`/benh-hoc/${l.disease.id}`} className="text-brand-deep underline">
                {l.disease.name}
              </Link>{" "}
              <span className="text-xs text-gray-500">({l.relation})</span>
              {canEdit && (
                <form action={unlinkDiseasePattern} className="inline ml-2">
                  <input type="hidden" name="linkId" value={l.id} />
                  <ConfirmSubmit message="Gỡ liên kết này?" className="rounded border border-red-300 text-red-800 px-2 py-0.5 text-xs">Gỡ</ConfirmSubmit>
                </form>
              )}
            </li>
          ))}
          {pattern.diseaseLinks.length === 0 && <p className="text-sm text-gray-500">Chưa liên kết bệnh nào.</p>}
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-3">Pháp trị liên quan</h2>
        <ul className="space-y-1 mb-4">
          {pattern.principleLinks.map((l) => (
            <li key={l.id}>
              <Link href={`/phap-tri/${l.principle.id}`} className="text-brand-deep underline">
                {l.principle.name}
              </Link>
              {l.rationale && <div className="text-xs text-gray-500">{l.rationale}</div>}
              {canEdit && (
                <form action={unlinkPatternPrinciple} className="inline ml-2">
                  <input type="hidden" name="linkId" value={l.id} />
                  <ConfirmSubmit message="Gỡ liên kết này?" className="rounded border border-red-300 text-red-800 px-2 py-0.5 text-xs">Gỡ</ConfirmSubmit>
                </form>
              )}
            </li>
          ))}
          {pattern.principleLinks.length === 0 && <p className="text-sm text-gray-500">Chưa liên kết pháp trị nào.</p>}
        </ul>
        {canEdit && <form action={linkPatternPrinciple} className="grid md:grid-cols-3 gap-2 text-sm">
          <input type="hidden" name="patternId" value={pattern.id} />
          <select name="principleId" required className="border rounded px-2 py-1.5">
            <option value="">— Chọn pháp trị —</option>
            {allPrinciples.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input name="rationale" placeholder="Căn cứ dựa trên bệnh cơ nào" className="border rounded px-2 py-1.5" />
          <button className="border border-brand-deep text-brand-deep rounded px-3 py-1.5">Liên kết</button>
        </form>}
      </div>
    </div>
  );
}

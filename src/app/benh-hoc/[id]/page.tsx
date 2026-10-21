import { EntityToolbar } from "@/components/EntityToolbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { linkDiseasePattern } from "@/actions/content";
import { unlinkDiseasePattern } from "@/actions/entity";
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

export default async function DiseaseDetailPage({ params }: { params: { id: string } }) {
  const disease = await prisma.disease.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      patternLinks: { include: { pattern: true } },
    },
  });
  if (!disease) notFound();

  const staff = await getCurrentStaff();
  const canEdit = !!staff && canEditKnowledge(staff.role);
  const allPatterns = canEdit ? await prisma.pattern.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }) : [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/benh-hoc" className="text-sm text-brand-deep underline">
          ← Danh mục bệnh học
        </Link>
        <EntityToolbar entity="benh-hoc" id={params.id} />
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{disease.name}</h1>
          <StatusPill status={disease.status} />
        </div>
        {disease.aliases && <p className="text-sm text-gray-500">Tên khác: {disease.aliases}</p>}
        {disease.nameModern && (
          <p className="text-sm text-gray-500">Bệnh danh YHHĐ liên quan (không đồng nhất khái niệm): {disease.nameModern}</p>
        )}
      </div>

      <div className="card space-y-3">
        <Field label="Định nghĩa" value={disease.definition} />
        <Field label="Phân loại" value={disease.category} />
        <Field label="Nguyên nhân" value={disease.cause} />
        <Field label="Bệnh cơ" value={disease.mechanism} />
        <Field label="Triệu chứng" value={disease.symptoms} />
        <Field label="Chẩn đoán phân biệt" value={disease.differential} />
        {disease.warnings && (
          <div className="warn-box">
            <div className="text-xs uppercase tracking-wide">Cảnh báo</div>
            <div className="whitespace-pre-wrap">{disease.warnings}</div>
          </div>
        )}
        {disease.source && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Nguồn: {disease.source.title}
            {disease.source.version ? ` — ${disease.source.version}` : ""}
            {disease.source.locator ? ` — ${disease.source.locator}` : ""}
          </div>
        )}
        {!disease.source && (
          <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này — cần bổ sung trước khi đưa vào dùng thật.</div>
        )}
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-3">Chứng hậu liên quan</h2>
        <ul className="space-y-2 mb-4">
          {disease.patternLinks.map((link) => (
            <li key={link.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
              <div>
                <Link href={`/chung-hau/${link.pattern.id}`} className="text-brand-deep underline font-medium">
                  {link.pattern.name}
                </Link>
                <span className="text-xs text-gray-500 ml-2">({link.relation})</span>
                {link.rationale && <div className="text-xs text-gray-500">{link.rationale}</div>}
              </div>
              {canEdit && (
                <form action={unlinkDiseasePattern}>
                  <input type="hidden" name="linkId" value={link.id} />
                  <ConfirmSubmit message="Gỡ liên kết chứng hậu này?" className="rounded border border-red-300 text-red-800 px-2 py-1 text-xs">Gỡ</ConfirmSubmit>
                </form>
              )}
            </li>
          ))}
          {disease.patternLinks.length === 0 && <p className="text-sm text-gray-500">Chưa liên kết chứng hậu nào.</p>}
        </ul>

        {canEdit && <form action={linkDiseasePattern} className="grid md:grid-cols-4 gap-2 text-sm">
          <input type="hidden" name="diseaseId" value={disease.id} />
          <select name="patternId" required className="border rounded px-2 py-1.5">
            <option value="">— Chọn chứng hậu —</option>
            {allPatterns.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select name="relation" className="border rounded px-2 py-1.5">
            <option value="có thể gặp">có thể gặp</option>
            <option value="cần phân biệt với">cần phân biệt với</option>
          </select>
          <input name="rationale" placeholder="Lý do / dữ kiện ủng hộ" className="border rounded px-2 py-1.5 md:col-span-1" />
          <button className="border border-brand-deep text-brand-deep rounded px-3 py-1.5">Liên kết</button>
        </form>}
        <p className="text-xs text-gray-400 mt-1">
          Chưa có chứng hậu bạn cần?{" "}
          <Link href="/chung-hau/moi" className="underline">
            Thêm chứng hậu mới
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

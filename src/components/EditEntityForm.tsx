import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireKnowledgeEditor } from "@/lib/auth";
import { ENTITIES } from "@/lib/entities";
import { REVIEW_STATUS_LABEL, REVIEW_STATUS_OPTIONS } from "@/lib/constants";
import { updateEntity } from "@/actions/entity";
import { BackLink } from "@/components/BackLink";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export async function EditEntityForm({
  entity,
  id,
  loi,
}: {
  entity: string;
  id: string;
  loi?: string;
}) {
  await requireKnowledgeEditor();
  const def = ENTITIES[entity];
  if (!def) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = await (prisma as any)[def.model].findUnique({ where: { id } });
  if (!row) notFound();
  const [sources, principles] = await Promise.all([
    def.source ? prisma.source.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, version: true } }) : [],
    def.model === "formula"
      ? prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
      : [],
  ]);
  const back = def.model === "manualTherapy" ? `/${def.path}` : `/${def.path}/${id}`;

  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href={back} label="Quay lại, không lưu" />
      <h1 className="text-2xl font-bold font-display">Sửa {def.label.toLowerCase()}</h1>
      {loi && <div className="warn-box text-sm">{loi}</div>}
      <form action={updateEntity} className="space-y-3">
        <input type="hidden" name="entity" value={entity} />
        <input type="hidden" name="id" value={id} />
        {def.fields.map((f) => (
          <label key={f.name} className="block text-sm">
            {f.label}
            {f.required ? " *" : ""}
            {f.long ? (
              <textarea name={f.name} defaultValue={row[f.name] ?? ""} rows={4} className={cls} />
            ) : (
              <input name={f.name} defaultValue={row[f.name] ?? ""} required={f.required} className={cls} />
            )}
          </label>
        ))}
        {def.model === "formula" && (
          <label className="block text-sm">
            Pháp trị của bài thuốc
            <select name="principleId" defaultValue={row.principleId ?? ""} className={cls}>
              <option value="">— Không chọn —</option>
              {principles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        )}
        {def.status && (
          <label className="block text-sm">
            Trạng thái thẩm định
            <select name="status" defaultValue={row.status} className={cls}>
              {REVIEW_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{REVIEW_STATUS_LABEL[s]}</option>)}
            </select>
          </label>
        )}
        {def.source && (
          <label className="block text-sm">
            Nguồn / căn cứ
            <select name="sourceId" defaultValue={row.sourceId ?? ""} className={cls}>
              <option value="">— Không chọn —</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.title}{s.version ? ` (${s.version})` : ""}</option>
              ))}
            </select>
          </label>
        )}
        <div className="flex gap-2">
          <button type="submit" className="bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-5 py-2.5 font-semibold">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

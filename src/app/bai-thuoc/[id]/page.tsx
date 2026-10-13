import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { addFormulaIngredient } from "@/actions/content";

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

export default async function FormulaDetailPage({ params }: { params: { id: string } }) {
  const formula = await prisma.formula.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      principle: true,
      ingredients: { include: { herb: true } },
    },
  });
  if (!formula) notFound();

  const allHerbs = await prisma.herb.findMany({ orderBy: { standardName: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/bai-thuoc" className="text-sm text-brand-deep underline">
          ← Danh mục bài thuốc
        </Link>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{formula.name}</h1>
          <StatusPill status={formula.status} />
        </div>
        {formula.principle && (
          <p className="text-sm text-gray-500">
            Pháp trị:{" "}
            <Link href={`/phap-tri/${formula.principle.id}`} className="underline text-brand-deep">
              {formula.principle.name}
            </Link>
          </p>
        )}
      </div>

      <div className="card space-y-3">
        <Field label="Xuất xứ" value={formula.origin} />
        <Field label="Chủ trị" value={formula.indications} />
        <Field label="Cách dùng / chế biến" value={formula.preparation} />
        <Field label="Gia giảm" value={formula.modifications} />
        {formula.safetyNotes && (
          <div className="warn-box">
            <div className="text-xs uppercase tracking-wide">An toàn / chống chỉ định</div>
            <div className="whitespace-pre-wrap">{formula.safetyNotes}</div>
          </div>
        )}
        {formula.source && <div className="text-xs text-gray-500 border-t pt-2">Nguồn: {formula.source.title}</div>}
        {!formula.source && <div className="text-xs text-amber-700">Chưa gắn nguồn cho mục này.</div>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-3">Thành phần (quân thần tá sứ)</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="py-1 pr-2">Vị thuốc</th>
                <th className="py-1 pr-2">Lượng</th>
                <th className="py-1 pr-2">Vai trò</th>
                <th className="py-1 pr-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {formula.ingredients.map((ing) => (
                <tr key={ing.id} className="border-b last:border-0">
                  <td className="py-1.5 pr-2">
                    <Link href={`/vi-thuoc/${ing.herb.id}`} className="text-brand-deep underline">
                      {ing.herb.standardName}
                    </Link>
                  </td>
                  <td className="py-1.5 pr-2">
                    {ing.amount ?? "—"} {ing.unit ?? ""}
                  </td>
                  <td className="py-1.5 pr-2">{ing.role ?? "—"}</td>
                  <td className="py-1.5 pr-2 text-gray-500">{ing.note ?? ""}</td>
                </tr>
              ))}
              {formula.ingredients.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-gray-500 py-2">
                    Chưa có thành phần.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form action={addFormulaIngredient} className="grid md:grid-cols-5 gap-2 text-sm">
          <input type="hidden" name="formulaId" value={formula.id} />
          <select name="herbId" required className="border rounded px-2 py-1.5 md:col-span-2">
            <option value="">— Chọn vị thuốc —</option>
            {allHerbs.map((h) => (
              <option key={h.id} value={h.id}>
                {h.standardName}
              </option>
            ))}
          </select>
          <input name="amount" placeholder="Lượng" className="border rounded px-2 py-1.5" />
          <input name="unit" placeholder="Đơn vị" className="border rounded px-2 py-1.5" />
          <select name="role" className="border rounded px-2 py-1.5">
            <option value="">Vai trò</option>
            <option value="Quân">Quân</option>
            <option value="Thần">Thần</option>
            <option value="Tá">Tá</option>
            <option value="Sứ">Sứ</option>
          </select>
          <input name="note" placeholder="Ghi chú" className="border rounded px-2 py-1.5 md:col-span-4" />
          <button className="border border-brand-deep text-brand-deep rounded px-3 py-1.5">Thêm thành phần</button>
        </form>
        <p className="text-xs text-gray-400 mt-1">
          Chưa có vị thuốc cần? <Link href="/vi-thuoc/moi" className="underline">Thêm vị thuốc mới</Link>.
        </p>
      </div>
    </div>
  );
}

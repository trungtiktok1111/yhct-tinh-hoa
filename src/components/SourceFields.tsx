import { prisma } from "@/lib/db";

export async function SourceFields() {
  const sources = await prisma.source.findMany({ orderBy: { title: "asc" } });
  return (
    <fieldset className="border border-brand-deep/20 rounded-lg p-3 space-y-2">
      <legend className="text-sm font-semibold text-brand-deep px-1">Nguồn / căn cứ</legend>
      <label className="block text-sm">
        Chọn nguồn đã có
        <select name="sourceId" className="mt-1 w-full border rounded px-2 py-1.5">
          <option value="">— Không chọn —</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
              {s.version ? ` (${s.version})` : ""}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-gray-500">Hoặc thêm nhanh nguồn mới (sẽ bỏ qua nếu bạn đã chọn nguồn ở trên):</p>
      <div className="grid grid-cols-2 gap-2">
        <input name="newSourceTitle" placeholder="Tên tài liệu" className="border rounded px-2 py-1.5 text-sm" />
        <input name="newSourceType" placeholder="Loại nguồn (vd Sách, WHO...)" className="border rounded px-2 py-1.5 text-sm" />
        <input name="newSourceAuthor" placeholder="Tác giả / cơ quan" className="border rounded px-2 py-1.5 text-sm" />
        <input name="newSourceYear" type="number" placeholder="Năm" className="border rounded px-2 py-1.5 text-sm" />
        <input name="newSourceVersion" placeholder="Phiên bản" className="border rounded px-2 py-1.5 text-sm" />
        <input name="newSourceLocator" placeholder="Trang/chương/đoạn" className="border rounded px-2 py-1.5 text-sm" />
      </div>
    </fieldset>
  );
}

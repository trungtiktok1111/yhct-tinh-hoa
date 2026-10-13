import { createHerb } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewHerbPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm vị thuốc</h1>
      <form action={createHerb} className="space-y-3">
        <input name="standardName" required placeholder="Tên chuẩn (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên khác / đồng danh" className="w-full border rounded px-3 py-2" />
        <input name="latinName" placeholder="Tên khoa học" className="w-full border rounded px-3 py-2" />
        <input name="partUsed" placeholder="Bộ phận dùng" className="w-full border rounded px-3 py-2" />
        <input name="origin" placeholder="Nguồn gốc" className="w-full border rounded px-3 py-2" />
        <input name="natureFlavor" placeholder="Tính vị" className="w-full border rounded px-3 py-2" />
        <input name="meridians" placeholder="Quy kinh" className="w-full border rounded px-3 py-2" />
        <textarea name="actions" placeholder="Công năng" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="indications" placeholder="Chủ trị" className="w-full border rounded px-3 py-2" rows={2} />
        <input name="dosage" placeholder="Liều dùng theo nguồn" className="w-full border rounded px-3 py-2" />
        <textarea name="safetyNotes" placeholder="An toàn / độc tính / tương tác" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

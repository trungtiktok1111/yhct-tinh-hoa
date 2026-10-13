import { createManualTherapy } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewManualTherapyPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm thủ pháp xoa bóp / phương pháp khác</h1>
      <form action={createManualTherapy} className="space-y-3">
        <input name="name" required placeholder="Tên thủ pháp (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="techniqueType" placeholder="Loại kỹ thuật (vd cứu ngải, giác hơi, dưỡng sinh...)" className="w-full border rounded px-3 py-2" />
        <input name="targetArea" placeholder="Vùng tác động" className="w-full border rounded px-3 py-2" />
        <textarea name="sequence" placeholder="Trình tự thực hiện" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="indications" placeholder="Chỉ định" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="contraindications" placeholder="Chống chỉ định / dấu hiệu phải dừng" className="w-full border rounded px-3 py-2" rows={2} />
        <input name="durationForce" placeholder="Thời lượng / lực tác động theo nguồn" className="w-full border rounded px-3 py-2" />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

import { createPattern } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewPatternPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm chứng hậu</h1>
      <form action={createPattern} className="space-y-3">
        <input name="name" required placeholder="Tên chứng hậu (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <textarea name="description" placeholder="Mô tả" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="supportCriteria" placeholder="Tiêu chí ủng hộ" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="againstCriteria" placeholder="Tiêu chí không phù hợp" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="keySigns" placeholder="Dấu hiệu trọng yếu" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="missingDataPrompts" placeholder="Dữ kiện cần hỏi thêm để xác định" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

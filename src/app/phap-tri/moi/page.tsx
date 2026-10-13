import { createPrinciple } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewPrinciplePage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm pháp trị</h1>
      <form action={createPrinciple} className="space-y-3">
        <input name="name" required placeholder="Tên pháp trị (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên khác" className="w-full border rounded px-3 py-2" />
        <textarea name="description" placeholder="Mô tả" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="goal" placeholder="Mục tiêu điều trị" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="scope" placeholder="Tình huống áp dụng" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="limitations" placeholder="Giới hạn / tình huống không phù hợp" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

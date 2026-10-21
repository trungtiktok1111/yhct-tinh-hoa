import { BackLink } from "@/components/BackLink";
import { createPoint } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewPointPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/cham-cuu" label="Quay lại danh sách huyệt vị" />
      <h1 className="text-2xl font-bold text-brand-deep">Thêm huyệt vị</h1>
      <form action={createPoint} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input name="code" placeholder="Mã huyệt (vd LI4)" className="border rounded px-3 py-2" />
          <input name="meridian" placeholder="Kinh mạch" className="border rounded px-3 py-2" />
        </div>
        <input name="standardName" required placeholder="Tên chuẩn (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên quốc tế / biến thể" className="w-full border rounded px-3 py-2" />
        <textarea name="location" placeholder="Vị trí" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="anatomyNotes" placeholder="Ghi chú giải phẫu / cấu trúc lân cận" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="actions" placeholder="Tác dụng theo nguồn" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="technique" placeholder="Kỹ thuật" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="contraindications" placeholder="Chống chỉ định" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="riskNotes" placeholder="Cảnh báo rủi ro giải phẫu" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

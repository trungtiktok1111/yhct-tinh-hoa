import { createDisease } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewDiseasePage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm bệnh học</h1>
      <form action={createDisease} className="space-y-3">
        <input name="name" required placeholder="Tên bệnh (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên khác (phân tách bằng ;)" className="w-full border rounded px-3 py-2" />
        <input name="nameModern" placeholder="Tên bệnh danh YHHĐ tương ứng (nếu có)" className="w-full border rounded px-3 py-2" />
        <input name="category" placeholder="Phân loại" className="w-full border rounded px-3 py-2" />
        <textarea name="definition" placeholder="Định nghĩa / khái niệm" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="cause" placeholder="Nguyên nhân" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="mechanism" placeholder="Bệnh cơ" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="symptoms" placeholder="Triệu chứng" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="differential" placeholder="Chẩn đoán phân biệt" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="warnings" placeholder="Cảnh báo / biến chứng" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

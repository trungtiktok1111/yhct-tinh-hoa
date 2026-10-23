import { BackLink } from "@/components/BackLink";
import { createHerb } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewHerbPage({ searchParams }: { searchParams: { loi?: string } }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/vi-thuoc" label="Quay lại danh sách vị thuốc" />
      <h1 className="text-2xl font-bold text-brand-deep">Thêm vị thuốc</h1>
      {searchParams.loi && <p className="warn-box text-sm">{searchParams.loi}</p>}
      <form action={createHerb} className="space-y-3">
        <input name="standardName" required placeholder="Tên chuẩn (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên khác / đồng danh" className="w-full border rounded px-3 py-2" />
        <input name="latinName" placeholder="Tên khoa học" className="w-full border rounded px-3 py-2" />
        <input name="family" placeholder="Họ (thực vật/động vật/khoáng vật)" className="w-full border rounded px-3 py-2" />
        <input name="partUsed" placeholder="Bộ phận dùng" className="w-full border rounded px-3 py-2" />
        <input name="origin" placeholder="Nguồn gốc" className="w-full border rounded px-3 py-2" />
        <textarea name="botanicalDescription" placeholder="Đặc điểm thực vật (thân, lá, hoa, quả...)" className="w-full border rounded px-3 py-2" rows={3} />
        <textarea name="distribution" placeholder="Phân bố" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="harvestProcessing" placeholder="Thu hái và sơ chế / bào chế" className="w-full border rounded px-3 py-2" rows={2} />
        <input name="storage" placeholder="Bảo quản" className="w-full border rounded px-3 py-2" />
        <textarea name="chemicalComposition" placeholder="Thành phần hóa học" className="w-full border rounded px-3 py-2" rows={2} />
        <input name="natureFlavor" placeholder="Tính vị" className="w-full border rounded px-3 py-2" />
        <input name="meridians" placeholder="Quy kinh" className="w-full border rounded px-3 py-2" />
        <textarea name="actions" placeholder="Công năng" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="indications" placeholder="Chủ trị" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="modernPharmacology" placeholder="Tác dụng dược lý hiện đại (nghiên cứu khoa học)" className="w-full border rounded px-3 py-2" rows={3} />
        <input name="dosage" placeholder="Liều dùng theo nguồn" className="w-full border rounded px-3 py-2" />
        <textarea name="safetyNotes" placeholder="An toàn / độc tính / tương tác" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

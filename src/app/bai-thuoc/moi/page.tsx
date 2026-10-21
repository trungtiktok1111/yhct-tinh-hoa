import { BackLink } from "@/components/BackLink";
import { createFormula } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";
import { prisma } from "@/lib/db";

export default async function NewFormulaPage() {
  const principles = await prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/bai-thuoc" label="Quay lại danh sách bài thuốc" />
      <h1 className="text-2xl font-bold text-brand-deep">Thêm bài thuốc</h1>
      <form action={createFormula} className="space-y-3">
        <input name="name" required placeholder="Tên bài thuốc (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="aliases" placeholder="Tên khác" className="w-full border rounded px-3 py-2" />
        <select name="origin" className="w-full border rounded px-3 py-2">
          <option value="">— Xuất xứ —</option>
          <option value="Cổ điển">Cổ điển</option>
          <option value="Biến phương">Biến phương</option>
          <option value="Bài kinh nghiệm">Bài kinh nghiệm</option>
          <option value="Công thức nội bộ">Công thức nội bộ</option>
        </select>
        <select name="principleId" className="w-full border rounded px-3 py-2">
          <option value="">— Pháp trị liên quan —</option>
          {principles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <textarea name="indications" placeholder="Chủ trị" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="preparation" placeholder="Cách dùng / chế biến / sắc dùng" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="modifications" placeholder="Gia giảm (theo điều kiện cụ thể)" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="safetyNotes" placeholder="Chống chỉ định / cảnh báo" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
      <p className="text-xs text-gray-500">Sau khi lưu, bạn sẽ thêm từng vị thuốc/thành phần ở trang chi tiết.</p>
    </div>
  );
}

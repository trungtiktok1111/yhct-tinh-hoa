import { createTheoryTopic } from "@/actions/content";
import { SourceFields } from "@/components/SourceFields";
import { StatusSelect } from "@/components/StatusSelect";

export default function NewTheoryTopicPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-deep">Thêm lý luận cơ bản</h1>
      <form action={createTheoryTopic} className="space-y-3">
        <input name="name" required placeholder="Tên lý luận (bắt buộc, vd Âm Dương, Ngũ Hành, Vọng chẩn...)" className="w-full border rounded px-3 py-2" />
        <input name="category" placeholder="Nhóm (vd Âm dương - Ngũ hành, Tạng tượng, Kinh lạc, Tứ chẩn, Bát cương, Bát pháp...)" className="w-full border rounded px-3 py-2" />
        <textarea name="summary" placeholder="Tóm tắt ngắn" className="w-full border rounded px-3 py-2" rows={2} />
        <textarea name="content" placeholder="Nội dung đầy đủ" className="w-full border rounded px-3 py-2" rows={6} />
        <textarea name="keyPoints" placeholder="Ứng dụng lâm sàng / điểm cần nhớ" className="w-full border rounded px-3 py-2" rows={2} />
        <StatusSelect />
        <SourceFields />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

import { BackLink } from "@/components/BackLink";
import { createSource } from "@/actions/content";

export default function NewSourcePage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/thu-vien" label="Quay lại danh sách tài liệu" />
      <h1 className="text-2xl font-bold text-brand-deep">Thêm tài liệu nguồn</h1>
      <form action={createSource} className="space-y-3">
        <input name="title" required placeholder="Tên tài liệu (bắt buộc)" className="w-full border rounded px-3 py-2" />
        <input name="sourceType" placeholder="Loại nguồn (Sách, Văn bản pháp quy, WHO, Nghiên cứu...)" className="w-full border rounded px-3 py-2" />
        <input name="authorOrOrg" placeholder="Tác giả / cơ quan" className="w-full border rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <input name="year" type="number" placeholder="Năm" className="border rounded px-3 py-2" />
          <input name="version" placeholder="Phiên bản" className="border rounded px-3 py-2" />
        </div>
        <input name="publisherOrUrl" placeholder="Nhà xuất bản / URL" className="w-full border rounded px-3 py-2" />
        <input name="locator" placeholder="Trang / chương / đoạn" className="w-full border rounded px-3 py-2" />
        <input name="usageRights" placeholder="Quyền sử dụng" className="w-full border rounded px-3 py-2" />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Lưu</button>
      </form>
    </div>
  );
}

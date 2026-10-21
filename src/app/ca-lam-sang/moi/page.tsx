import { BackLink } from "@/components/BackLink";
import { createCase } from "@/actions/case";

export default function NewCasePage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/ca-lam-sang" label="Quay lại danh sách ca lâm sàng" />
      <h1 className="text-2xl font-bold text-brand-deep">Tạo ca lâm sàng</h1>
      <div className="warn-box text-sm">
        Chỉ nhập dữ liệu định danh tối thiểu/đã ẩn danh. Đây là bản demo mở, chưa có phân quyền bảo vệ hồ sơ.
      </div>
      <form action={createCase} className="space-y-3">
        <input name="caseCode" placeholder="Mã ca (để trống sẽ tự sinh)" className="w-full border rounded px-3 py-2" />
        <input name="minimalIdentity" placeholder="Định danh tối thiểu (vd: Nữ, 34 tuổi)" className="w-full border rounded px-3 py-2" />
        <textarea name="history" placeholder="Lý do khám / bệnh sử tóm tắt" className="w-full border rounded px-3 py-2" rows={3} />
        <button className="bg-brand-deep text-white rounded-lg px-5 py-2 font-medium">Tạo ca và bắt đầu tứ chẩn</button>
      </form>
    </div>
  );
}

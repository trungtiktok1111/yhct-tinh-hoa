export default function ClinicalCasePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-deep">Ca lâm sàng</h1>
      <div className="card">
        <p className="font-semibold mb-2">Chưa triển khai ở bản demo này.</p>
        <p className="text-sm text-gray-600">
          Mô hình dữ liệu <code>ClinicalCase</code> đã có trong cơ sở dữ liệu (bệnh sử, quan sát tứ chẩn, chứng hậu
          ứng viên, kết luận, điều trị thực tế, kết quả) nhưng chưa có giao diện nhập liệu và chưa phân quyền truy cập
          theo hồ sơ. Đây là phần việc tiếp theo sau khi luồng tri thức (bệnh → chứng hậu → pháp trị → bài thuốc →
          vị thuốc) đã ổn định.
        </p>
      </div>
    </div>
  );
}

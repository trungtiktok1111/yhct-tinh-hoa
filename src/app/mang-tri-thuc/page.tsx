import { ModuleHeader } from "@/components/ModuleHeader";

export default function KnowledgeNetworkPage() {
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Mạng lưới tri thức"
        subtitle="Quan hệ bệnh – chứng hậu – pháp trị – bài thuốc – vị thuốc – huyệt."
        image="/images/ginseng-rock.png"
      />
      <div className="card">
        <p className="font-semibold mb-2">Chưa triển khai ở bản demo này.</p>
        <p className="text-sm text-gray-600">
          Dữ liệu quan hệ (bệnh–chứng hậu, chứng hậu–pháp trị, bài thuốc–vị thuốc, huyệt–phối huyệt) đã được lưu có
          cấu trúc trong cơ sở dữ liệu quan hệ, đủ để dựng sơ đồ nút–cạnh tương tác sau này. Ở bản demo, bạn có thể đi
          qua các liên kết này bằng cách bấm từ trang chi tiết (vd mở Bệnh → bấm vào Chứng hậu → bấm vào Pháp trị...).
        </p>
      </div>
    </div>
  );
}

import { EntityToolbar } from "@/components/EntityToolbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { saveObservations, runPatternAnalysis, confirmConclusion, recordOutcome } from "@/actions/case";
import type { PatternAnalysisResult } from "@/lib/reasoning";

export const dynamic = "force-dynamic";

const LABEL_STYLE: Record<string, string> = {
  "Phù hợp với một số tiêu chí đã ghi": "status-APPROVED",
  "Có dữ kiện mâu thuẫn — cần xem lại": "status-NEEDS_REVISION",
  "Chưa đủ dữ kiện để đối chiếu": "status-DRAFT",
};

export default async function ClinicalCaseDetailPage({ params }: { params: { id: string } }) {
  const kase = await prisma.clinicalCase.findUnique({ where: { id: params.id } });
  if (!kase) notFound();

  const obs = kase.observations ? (JSON.parse(kase.observations) as Record<string, string>) : null;
  const analysis = kase.candidatePatterns ? (JSON.parse(kase.candidatePatterns) as PatternAnalysisResult[]) : null;

  const confirmedPattern = kase.confirmedConclusion
    ? await prisma.pattern.findFirst({
        where: { name: kase.confirmedConclusion },
        include: { principleLinks: { include: { principle: { include: { formulas: true, protocols: true } } } } },
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ca-lam-sang" className="text-sm text-brand-deep underline">
          ← Danh mục ca lâm sàng
        </Link>
        <EntityToolbar entity="ca-lam-sang" id={params.id} />
        <h1 className="text-2xl font-bold text-brand-deep mt-1">{kase.caseCode}</h1>
        {kase.minimalIdentity && <p className="text-sm text-gray-500">{kase.minimalIdentity}</p>}
        {kase.history && <p className="text-sm text-gray-700 mt-1">{kase.history}</p>}
      </div>

      {/* Bước 2: Tứ chẩn */}
      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-3">Bước 2 — Tứ chẩn có cấu trúc</h2>
        <form action={saveObservations} className="space-y-2">
          <input type="hidden" name="caseId" value={kase.id} />
          <label className="block text-sm">
            Vọng (quan sát: sắc mặt, lưỡi/rêu lưỡi...)
            <textarea name="vong" defaultValue={obs?.vong} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </label>
          <label className="block text-sm">
            Văn (nghe/ngửi: tiếng nói, hơi thở, mùi...)
            <textarea name="van" defaultValue={obs?.van} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </label>
          <label className="block text-sm">
            Vấn (hỏi bệnh: triệu chứng cơ năng, diễn biến...)
            <textarea name="vanHoi" defaultValue={obs?.vanHoi} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </label>
          <label className="block text-sm">
            Thiết (bắt mạch, sờ nắn)
            <textarea name="thiet" defaultValue={obs?.thiet} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </label>
          <label className="block text-sm">
            Ghi chú tự do khác
            <textarea name="freeNote" defaultValue={obs?.freeNote} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </label>
          <button className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">Lưu dữ kiện tứ chẩn</button>
        </form>
      </div>

      {/* Bước 4: Đối chiếu chứng hậu */}
      {obs && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-2">Bước 4 — Đối chiếu chứng hậu ứng viên</h2>
          <p className="text-xs text-gray-500 mb-3">
            Phương pháp: so khớp từ khóa đơn giản giữa dữ kiện đã nhập và tiêu chí ủng hộ/không phù hợp của từng
            chứng hậu trong hệ thống. Không phải điểm số xác suất — chỉ là gợi ý cần người hành nghề xác nhận.
          </p>
          <form action={runPatternAnalysis}>
            <input type="hidden" name="caseId" value={kase.id} />
            <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm mb-4">
              Chạy đối chiếu chứng hậu
            </button>
          </form>

          {analysis && (
            <div className="space-y-3">
              {analysis
                .slice()
                .sort((a, b) => b.supportMatches.length - a.supportMatches.length)
                .map((r) => (
                  <div key={r.patternId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Link href={`/chung-hau/${r.patternId}`} className="font-medium text-brand-deep underline">
                        {r.patternName}
                      </Link>
                      <span className={`status-pill ${LABEL_STYLE[r.label]}`}>{r.label}</span>
                    </div>
                    {r.supportMatches.length > 0 && (
                      <div className="text-sm mt-1">
                        <span className="text-xs uppercase text-gray-500">Dấu hiệu ủng hộ khớp: </span>
                        {r.supportMatches.join("; ")}
                      </div>
                    )}
                    {r.againstMatches.length > 0 && (
                      <div className="text-sm mt-1 text-red-700">
                        <span className="text-xs uppercase">Dấu hiệu chống lại: </span>
                        {r.againstMatches.join("; ")}
                      </div>
                    )}
                    {r.missingDataPrompts && (
                      <div className="text-xs text-gray-500 mt-1">Cần hỏi thêm: {r.missingDataPrompts}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Bước 10: xác nhận */}
      {analysis && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-3">Bước 10 — Người có thẩm quyền xác nhận</h2>
          <form action={confirmConclusion} className="space-y-2">
            <input type="hidden" name="caseId" value={kase.id} />
            <label className="block text-sm">
              Chứng hậu kết luận (chọn đúng tên để hệ thống nối tới pháp trị/bài thuốc liên quan)
              <select name="confirmedConclusion" defaultValue={kase.confirmedConclusion ?? ""} className="w-full border rounded px-3 py-2 mt-1">
                <option value="">— Chọn chứng hậu —</option>
                {analysis.map((r) => (
                  <option key={r.patternId} value={r.patternName}>
                    {r.patternName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Kế hoạch điều trị dự kiến / lý do điều chỉnh
              <textarea name="plan" defaultValue={kase.plan ?? ""} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
            </label>
            <button className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">Xác nhận kết luận</button>
          </form>
        </div>
      )}

      {confirmedPattern && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-2">Pháp trị và bài thuốc liên quan đến kết luận</h2>
          <ul className="space-y-2">
            {confirmedPattern.principleLinks.map((pl) => (
              <li key={pl.id} className="border rounded-lg p-3">
                <Link href={`/phap-tri/${pl.principle.id}`} className="font-medium text-brand-deep underline">
                  {pl.principle.name}
                </Link>
                {pl.rationale && <div className="text-xs text-gray-500">{pl.rationale}</div>}
                {pl.principle.formulas.length > 0 && (
                  <div className="text-sm mt-1">
                    Bài thuốc gợi ý:{" "}
                    {pl.principle.formulas.map((f, i) => (
                      <span key={f.id}>
                        {i > 0 && ", "}
                        <Link href={`/bai-thuoc/${f.id}`} className="underline text-brand-deep">
                          {f.name}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
            {confirmedPattern.principleLinks.length === 0 && (
              <p className="text-sm text-gray-500">Chứng hậu này chưa liên kết pháp trị nào trong hệ thống.</p>
            )}
          </ul>
        </div>
      )}

      {kase.confirmedConclusion && (
        <div className="card">
          <h2 className="font-semibold text-brand-deep mb-3">Theo dõi điều trị thực tế</h2>
          <form action={recordOutcome} className="space-y-2">
            <input type="hidden" name="caseId" value={kase.id} />
            <textarea name="actualTreatment" defaultValue={kase.actualTreatment ?? ""} placeholder="Điều trị thực tế đã áp dụng" className="w-full border rounded px-3 py-2" rows={2} />
            <textarea name="outcome" defaultValue={kase.outcome ?? ""} placeholder="Kết quả / diễn biến" className="w-full border rounded px-3 py-2" rows={2} />
            <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lưu theo dõi</button>
          </form>
        </div>
      )}
    </div>
  );
}

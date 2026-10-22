import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import {
  startExam, saveFindings, saveDiagnosis, savePrinciple, saveClinical, saveAllergies, cancelExam, addFormulaToPrescription, savePrescriptionMeta,
  addPrescriptionLine, updatePrescriptionLine, removePrescriptionLine, addExamPoint, removeExamPoint,
  addExamTherapy, removeExamTherapy, finishExam, reopenExam,
} from "@/actions/exam";
import { BAT_CUONG, BAT_PHAP, parseDoseRange } from "@/lib/exam";
import { input } from "@/lib/stock";
import Image from "next/image";
import { PrintButton } from "@/components/PrintButton";
import { AlertTriangle, FolderOpen, Pencil, Save, XCircle } from "lucide-react";
import { SaveDraftButton } from "@/components/SaveDraftButton";
import { ExamTabs } from "@/components/ExamTabs";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, patientCode, qty as fmtQty, bmiText, vnDayStart, timeVN, dateVN } from "@/lib/format";
import { ageOf, toDateInput } from "@/lib/person";
import { GROUPS, TAG_LABEL, readTuChan, summarize, type Tag } from "@/lib/tuchan";
import { applyProposal } from "@/actions/proposal";
import { proposeFromTuChan } from "@/lib/proposal";
import { SampleFill } from "@/components/SampleFill";
import { TuChanFields } from "@/components/TuChanFields";

export const dynamic = "force-dynamic";

const ta = `${input} min-h-[4.5rem]`;
const btnMain = "rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold";
const btnSub = "rounded-lg border border-brand-gold/50 px-3 py-2 text-sm";

export default async function ExamPage({ params, searchParams }: { params: { visitId: string }; searchParams: { loi?: string } }) {
  const staff = await requireRole(...EXAM_ROLES);
  const visit = await prisma.visit.findUnique({
    where: { id: params.visitId },
    include: {
      patient: true,
      branch: { select: { name: true } },
      exam: {
        include: {
          points: { orderBy: { id: "asc" } },
          therapies: { orderBy: { id: "asc" } },
          prescription: {
            include: {
              lines: { orderBy: { position: "asc" }, include: { item: { include: { herb: { select: { dosage: true } } } } } },
            },
          },
        },
      },
    },
  });
  if (!visit) notFound();
  if (!staff.isOwner && !staff.branchIds.includes(visit.branchId)) redirect("/khong-co-quyen");
  const p = visit.patient;
  const exam = visit.exam;

  const vitals = [
    visit.pulse != null && ["Mạch", `${visit.pulse}/phút`],
    visit.bloodPressure && ["HA", visit.bloodPressure],
    visit.temperature != null && ["Nhiệt độ", `${visit.temperature}°C`],
    visit.weightKg != null && ["Cân nặng", `${visit.weightKg} kg`],
    visit.heightCm != null && ["Chiều cao", `${visit.heightCm} cm`],
    bmiText(visit.weightKg, visit.heightCm) && ["BMI", bmiText(visit.weightKg, visit.heightCm) as string],
  ].filter(Boolean) as [string, string][];
  const initials = p.fullName.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  const header = (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-brand-deeper text-white shadow-md">
        <Image src="/images/art/herbs-wide.jpg" alt="" width={900} height={300} className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deeper from-50% via-brand-deeper/85 to-transparent" />
        <div className="relative flex flex-wrap items-center gap-4 p-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-lg font-bold ring-2 ring-brand-goldLight/60">{initials}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold">{p.fullName}</h1>
              <span className="text-brand-goldLight">{p.sex === "M" ? "♂" : p.sex === "F" ? "♀" : ""}</span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">{VISIT_STATUS[visit.status] ?? visit.status}</span>
            </div>
            <div className="text-sm text-white/80">
              {patientCode(p.seq)} · {SEX_LABEL[p.sex] ?? p.sex} · {ageOf(p.birthDate, p.birthYear)} tuổi · {p.phone} · Số {visit.queueNo} · {visit.branch.name}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {vitals.length === 0 ? <span className="text-xs text-white/60">Chưa ghi sinh hiệu</span> : vitals.map(([k, v]) => (
                <span key={k} className="rounded-lg bg-white/12 px-2 py-0.5 text-xs"><span className="text-white/60">{k}: </span><b>{v}</b></span>
              ))}
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${p.allergies ? "border-red-300 bg-red-600/90 font-semibold" : "border-white/25 bg-white/10 text-white/85"}`}>
              <AlertTriangle className="h-4 w-4" /> Dị ứng: {p.allergies || "chưa ghi nhận"} <a href="#hanh-chinh" title="Sửa dị ứng" className="ml-1 opacity-80 hover:opacity-100"><Pencil className="h-3.5 w-3.5" /></a>
            </div>
            <Link href={`/benh-nhan/${p.id}`} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-brand-deep hover:bg-emerald-50"><FolderOpen className="h-4 w-4" />Hồ sơ bệnh nhân</Link>
            <Link href="/kham" className="rounded-xl border border-white/30 px-3 py-2 text-sm hover:bg-white/10">◂ Danh sách khám</Link>
          </div>
        </div>
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
    </>
  );

  if (!exam) {
    return (
      <div className="space-y-4">
        {header}
        {visit.status === "CANCELLED" ? (
          <div className="warn-box text-sm">Lượt khám này đã hủy.</div>
        ) : (
          <form action={startExam}>
            <input type="hidden" name="visitId" value={visit.id} />
            <button className={btnMain}>Bắt đầu khám</button>
          </form>
        )}
      </div>
    );
  }

  const locked = exam.status === "FINAL";
  const queue = await prisma.visit.findMany({
    where: { branchId: visit.branchId, createdAt: { gte: vnDayStart() }, status: { not: "CANCELLED" } },
    orderBy: { queueNo: "asc" },
    include: { patient: { select: { fullName: true, sex: true, birthDate: true, birthYear: true } } },
  });
  const tuChan = readTuChan(exam.tuChanData);
  const tc = summarize(tuChan);
  const proposals = proposeFromTuChan(tuChan);
  const rx = exam.prescription;
  const lines = rx?.lines ?? [];

  // Bài thuốc theo pháp trị đã chọn.
  const formulas = !locked && exam.principleId
    ? await prisma.formula.findMany({
        where: { principleId: exam.principleId },
        select: { id: true, name: true, indications: true, _count: { select: { ingredients: true } } },
        take: 20,
      })
    : [];

  const [diseases, patterns, principles, items, pointList, therapyList] = locked
    ? [[], [], [], [], [], []]
    : await Promise.all([
        prisma.disease.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
        prisma.pattern.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
        prisma.treatmentPrinciple.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
        prisma.item.findMany({ where: { active: true }, select: { id: true, name: true, type: true, unit: true }, orderBy: { name: "asc" }, take: 1500 }),
        prisma.acupuncturePoint.findMany({ select: { code: true, standardName: true }, orderBy: { code: "asc" }, take: 600 }),
        prisma.manualTherapy.findMany({ select: { name: true }, orderBy: { name: "asc" }, take: 200 }),
      ]);

  // Tồn kho tại chi nhánh cho các dòng thuốc.
  const stockRows = lines.length
    ? await prisma.stockLot.groupBy({
        by: ["itemId"],
        where: {
          branchId: visit.branchId, itemId: { in: lines.map((l) => l.itemId) }, qtyRemaining: { gt: 0 },
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        },
        _sum: { qtyRemaining: true },
      })
    : [];
  const stock = new Map(stockRows.map((r) => [r.itemId, r._sum.qtyRemaining ?? 0]));
  const thang = rx?.thangCount ?? 0;

  const sel = (name: string, cur: string | null | undefined, opts: { id: string; name: string }[]) => (
    <select name={name} defaultValue={cur ?? ""} className={input}>
      <option value="">— Không chọn —</option>
      {opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  );
  const hidden = <input type="hidden" name="visitId" value={visit.id} />;

  const qChip: Record<string, [string, string]> = { WAITING: ["Chờ khám", "chip-amber"], IN_EXAM: ["Đang khám", "chip-blue"], DONE: ["Đã khám", "chip-green"] };
  return (
    <div className="grid items-start gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="card hidden !p-0 xl:sticky xl:top-[4.5rem] xl:block">
        <div className="border-b border-slate-100 px-4 py-3 font-bold">Danh sách khám ({queue.length})</div>
        <ul className="max-h-[calc(100vh-9rem)] divide-y divide-slate-100 overflow-y-auto">
          {queue.map((q) => {
            const [t, c] = qChip[q.status] ?? [q.status, "chip-gray"];
            return (
              <li key={q.id}>
                <Link href={`/kham/${q.id}`} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 ${q.id === visit.id ? "bg-amber-50" : ""}`}>
                  <span className="w-5 pt-0.5 text-lg font-bold text-brand-deep">{q.queueNo}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{q.patient.fullName}</span>
                    <span className="block truncate text-xs text-brand-ink/55">{q.reason ?? "—"}</span>
                    <span className={`chip mt-1 ${c}`}>{t}</span>
                  </span>
                  <span className="text-xs text-brand-ink/55">{timeVN(q.createdAt)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <div className="min-w-0 space-y-4">
      {header}

      {locked && (
        <div className="card !bg-green-50 text-sm text-green-800 flex flex-wrap items-center gap-3">
          <span>Bệnh án đã hoàn tất{exam.doctorName ? ` · BS ${exam.doctorName}` : ""}. Đang ở chế độ chỉ xem.</span>
          <form action={reopenExam}>{hidden}<ConfirmSubmit message="Mở lại bệnh án để sửa?">Mở lại để sửa</ConfirmSubmit></form>
        </div>
      )}

      <ExamTabs tabs={[
        { key: "hanh-chinh", label: "Hành chính", ids: ["hanh-chinh"], content: (<>
      <section className="card space-y-4" id="hanh-chinh">
        <h2 className="font-semibold text-brand-deep">Thông tin hành chính</h2>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {([
            ["Họ tên", p.fullName], ["Mã BN", patientCode(p.seq)], ["Giới tính", SEX_LABEL[p.sex] ?? p.sex],
            ["Ngày sinh", p.birthDate ? `${dateVN(p.birthDate)} (${ageOf(p.birthDate, p.birthYear)} tuổi)` : `${p.birthYear}`],
            ["Số điện thoại", p.phone], ["CCCD / CMND", p.nationalId], ["Số thẻ BHYT", p.insuranceNo],
            ["Nghề nghiệp", p.occupation], ["Nhóm máu", p.bloodType], ["Dân tộc", p.ethnicity],
            ["Địa chỉ", [p.address, p.ward, p.district, p.province].filter(Boolean).join(", ")],
            ["Liên hệ khẩn cấp", [p.emergencyName, p.emergencyRelation, p.emergencyPhone].filter(Boolean).join(" · ")],
            ["Lượt khám", `Số ${visit.queueNo} · ${timeVN(visit.createdAt)} · ${visit.branch.name}`],
            ["Lý do đến khám", visit.reason],
          ] as [string, string | null | undefined][]).map(([k, v]) => (
            <div key={k}><dt className="text-xs uppercase tracking-wide text-brand-ink/50">{k}</dt><dd className="font-medium">{v || "—"}</dd></div>
          ))}
        </dl>
        <form action={saveAllergies} className="flex flex-wrap items-end gap-2 rounded-xl border border-red-200 bg-red-50/60 p-3">
          {hidden}
          <label className="min-w-[14rem] flex-1 text-sm font-semibold text-red-700">Dị ứng thuốc / thức ăn
            <input name="allergies" defaultValue={p.allergies ?? ""} placeholder="Để trống nếu chưa ghi nhận dị ứng" className={input} />
          </label>
          <button className={btnSub}>Lưu dị ứng</button>
        </form>
        <Link href={`/benh-nhan/${p.id}/sua`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep underline"><Pencil className="h-4 w-4" />Sửa hồ sơ bệnh nhân</Link>
      </section>
</>) },
        { key: "kham-benh", label: "Khám bệnh", ids: ["kham-benh", "hoi-benh", "tu-chan", "tong-hop", "de-xuat", "kham-lam-sang", "chan-doan", "phap-tri", "phuong-thuoc", "don-thuoc", "bai-thuoc", "cham-cuu", "dan-do", "hoan-tat"], content: (<div className="space-y-4">
            {(p.pastHistory || p.chronicConditions || p.familyHistory) && (
        <div className="card text-sm space-y-1" id="hoi-benh">
          {p.chronicConditions && <div><b>Bệnh mạn tính:</b> {p.chronicConditions}</div>}
          {p.pastHistory && <div><b>Tiền sử bệnh:</b> {p.pastHistory}</div>}
          {p.familyHistory && <div><b>Gia đình:</b> {p.familyHistory}</div>}
        </div>
      )}
      
      {/* 1. Hỏi bệnh và tứ chẩn */}
      <section className="card space-y-3" id="tu-chan">
        <h2 className="font-semibold text-brand-deep">Lý do khám, bệnh sử và tứ chẩn</h2>
        <form action={saveFindings} data-draft className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <label className="block text-sm">Lý do khám / triệu chứng chính
              <textarea name="chiefComplaint" defaultValue={exam.chiefComplaint ?? ""} className={ta} />
            </label>
            <label className="block text-sm">Bệnh sử hiện tại
              <textarea name="presentHistory" defaultValue={exam.presentHistory ?? ""} className={ta} />
            </label>
            <details open className="rounded-xl border border-brand-gold/40 bg-brand-cream/40 p-3 text-sm">
              <summary className="cursor-pointer font-semibold text-brand-deep">Hướng dẫn nhanh và ví dụ mẫu</summary>
              <div className="mt-2 space-y-2">
                <p><b>Cách dùng:</b> mở từng nhóm Vọng, Văn, Vấn, Thiết, tích những gì quan sát được. Chỉ tích điều có thật, không tích thì để trống. Thiếu lựa chọn: gõ vào ô viền đứt “Bổ sung ghi tay” ngay dưới mục đó. Rê chuột lên một lựa chọn để xem ý nghĩa. Bấm “Lưu tứ chẩn và xem tổng hợp”.</p>
                <p><b>Ví dụ:</b> bệnh nhân nam 46 tuổi, đau vai gáy 2 tuần, sợ lạnh, không ra mồ hôi, rêu lưỡi trắng mỏng, mạch Phù Khẩn. Cách ghi:</p>
                <ul className="ml-4 list-disc text-xs">
                  <li>Vấn chẩn › Hàn nhiệt: tích “Sợ lạnh (ố hàn)”, “Sợ gió”. Hãn: tích “Không ra mồ hôi”. Đau: tích “Đau cổ vai gáy” ở mục Đầu, mặt, thân mình.</li>
                  <li>Vọng chẩn › Thiệt chẩn: Sắc rêu chọn “Trắng”, tính chất rêu tích “Mỏng”.</li>
                  <li>Thiết chẩn › Mạch tượng chung: tích “Phù” và “Khẩn”.</li>
                </ul>
                <p><b>Hệ thống làm gì:</b> (1) liệt kê lại đúng những gì bạn đã tích và xếp vào bát cương (chỉ liệt kê, không chấm điểm); (2) đề xuất chứng hậu, bát cương, bát pháp, pháp trị, bài thuốc kèm liều, huyệt, xoa bóp, dặn dò và ngày tái khám, bấm “Dùng đề xuất này” để điền sẵn vào các mục bên dưới; (3) bác sĩ xem lại, sửa hoặc đổi theo ý mình rồi hoàn tất. Bác sĩ là người quyết định cuối cùng.</p>
                {!locked && <SampleFill />}
              </div>
            </details>
            <TuChanFields
              data={tuChan}
              groupNotes={{ vong: exam.inspection, van: exam.listening, vanhoi: exam.inquiry, thiet: exam.palpation }}
            />
          </fieldset>
          {!locked && <button className={btnMain}>Lưu tứ chẩn và xem tổng hợp</button>}
        </form>
      </section>

      {/* 1b. Tổng hợp tứ chẩn */}
      {tc.count > 0 && (
        <section className="card space-y-3" id="tong-hop">
          <h2 className="font-semibold text-brand-deep">Tổng hợp tứ chẩn ({tc.count} dữ kiện)</h2>
          <div className="space-y-2 text-sm">
            {GROUPS.map((g) => {
              const rows = tc.rows.filter((r) => r.group === g.title);
              if (!rows.length) return null;
              return (
                <div key={g.key}>
                  <div className="font-semibold">{g.title}</div>
                  <ul className="ml-4 list-disc space-y-0.5">
                    {rows.map((r, i) => <li key={i}><span className="text-gray-600">{r.section} · {r.field}:</span> {r.labels.join("; ")}{r.note && <span className="text-brand-deep">{r.labels.length ? "; " : ""}ghi tay: {r.note}</span>}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
          <div>
            <div className="text-sm font-semibold">Dữ kiện theo bát cương (chỉ liệt kê, không chấm điểm)</div>
            <div className="mt-1 grid gap-2 sm:grid-cols-2 text-xs">
              {(Object.keys(TAG_LABEL) as Tag[]).map((t) => (
                <div key={t} className="rounded-lg border border-brand-gold/30 p-2">
                  <b>{TAG_LABEL[t]}</b> ({tc.cuong[t].length})
                  {tc.cuong[t].length > 0 && <div className="text-gray-700">{tc.cuong[t].join("; ")}</div>}
                </div>
              ))}
            </div>
          </div>
          {tc.hints.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm font-semibold">Ý nghĩa tham khảo theo giáo trình ({tc.hints.length})</summary>
              <ul className="mt-1 ml-4 list-disc space-y-0.5 text-xs">
                {tc.hints.map((h, i) => <li key={i}><b>{h.label}</b> <span className="text-gray-600">({h.field})</span>: {h.hint}</li>)}
              </ul>
            </details>
          )}
          <p className="text-xs text-gray-600">Nguồn nội dung: bài giảng Tứ chẩn (Võ Thanh Phong; Bộ môn YHCT), dẫn Maciocia, Trung Y chẩn đoán học (HV Trung Y Quảng Châu), Kirschbaum. Chỉ để tham khảo, bác sĩ tự kết luận.</p>
        </section>
      )}

      {/* 1c. Đề xuất của hệ thống */}
      {!locked && proposals.length > 0 && (
        <section className="card space-y-3" id="de-xuat">
          <h2 className="font-semibold text-brand-deep">Đề xuất của hệ thống từ tứ chẩn (bác sĩ duyệt)</h2>
          <p className="text-xs text-gray-600">
            Hệ thống đối chiếu các dấu hiệu đã tích với bộ quy tắc biện chứng và đề xuất chứng hậu, bát cương, bát pháp, bài thuốc, huyệt, dặn dò, tái khám.
            Bấm “Dùng đề xuất này” để điền sẵn vào các mục bên dưới, sau đó bác sĩ tự sửa, thêm hoặc bỏ. Bác sĩ là người quyết định cuối cùng. Nội dung là DEMO, chưa qua chuyên gia duyệt.
          </p>
          {proposals.map((pr, i) => {
            const r = pr.rule;
            return (
              <div key={r.key} className={`rounded-xl border p-3 space-y-2 text-sm ${i === 0 ? "border-brand-deep bg-white" : "border-brand-gold/40 bg-white/60"}`}>
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-brand-deep">{i === 0 ? "Đề xuất chính: " : "Khả năng khác: "}{r.pattern}</div>
                    <div className="text-xs text-gray-600">
                      Khớp {pr.coreHit.length}/{pr.coreTotal} dấu hiệu chính và {pr.supportHit.length}/{pr.supportTotal} dấu hiệu phụ
                      {pr.againstHit.length > 0 && <span className="text-red-700"> · có {pr.againstHit.length} dấu hiệu không phù hợp</span>}
                    </div>
                  </div>
                  <form action={applyProposal}>
                    <input type="hidden" name="visitId" value={visit.id} />
                    <input type="hidden" name="key" value={r.key} />
                    <button className="rounded-lg bg-brand-deep text-brand-cream px-3 py-1.5 text-sm font-semibold">Dùng đề xuất này</button>
                  </form>
                </div>
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  <div><b>Bát cương:</b> {[r.cuong.exteriorInterior && TAG_LABEL[r.cuong.exteriorInterior], r.cuong.coldHeat && TAG_LABEL[r.cuong.coldHeat], r.cuong.deficiencyExcess && TAG_LABEL[r.cuong.deficiencyExcess], r.cuong.yinYang && TAG_LABEL[r.cuong.yinYang]].filter(Boolean).join(", ")}</div>
                  <div><b>Bát pháp:</b> {r.methods.join(", ")}</div>
                  <div><b>Bệnh danh:</b> {r.disease}</div>
                  <div><b>Pháp trị:</b> {r.principle}</div>
                </div>
                <div><b>Bài thuốc:</b> {r.formula}, {r.thang} thang. <span className="text-gray-700">{r.herbs.map((h) => `${h.n} ${h.g} g`).join("; ")}</span></div>
                {r.modifications && <div className="text-xs text-gray-700"><b>Gia giảm tham khảo:</b> {r.modifications}</div>}
                <div><b>Huyệt:</b> {r.points.map(([l]) => l).join("; ")}{r.therapy.length > 0 && <> · <b>Xoa bóp:</b> {r.therapy.map(([l]) => l).join("; ")}</>}</div>
                <div><b>Dặn dò:</b> {r.advice}</div>
                <div><b>Tái khám:</b> sau {r.followUpDays} ngày</div>
                <details className="text-xs">
                  <summary className="cursor-pointer text-brand-deep">Dấu hiệu đã khớp</summary>
                  <div className="mt-1 space-y-0.5">
                    <div><b>Chính:</b> {pr.coreHit.map((x) => x.label).join("; ") || "—"}</div>
                    <div><b>Phụ:</b> {pr.supportHit.map((x) => x.label).join("; ") || "—"}</div>
                    {pr.againstHit.length > 0 && <div className="text-red-700"><b>Không phù hợp:</b> {pr.againstHit.map((x) => x.label).join("; ")}</div>}
                  </div>
                </details>
              </div>
            );
          })}
        </section>
      )}


      <section className="card space-y-3" id="kham-lam-sang">
        <h2 className="font-semibold text-brand-deep">Sinh hiệu và khám thực thể</h2>
        <form action={saveClinical} data-draft className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <label className="text-sm">Mạch (lần/phút)<input name="pulse" inputMode="numeric" defaultValue={visit.pulse ?? ""} className={input} /></label>
              <label className="text-sm">Huyết áp<input name="bloodPressure" placeholder="120/80" defaultValue={visit.bloodPressure ?? ""} className={input} /></label>
              <label className="text-sm">Nhiệt độ (°C)<input name="temperature" inputMode="decimal" defaultValue={visit.temperature ?? ""} className={input} /></label>
              <label className="text-sm">Cân nặng (kg)<input name="weightKg" inputMode="decimal" defaultValue={visit.weightKg ?? ""} className={input} /></label>
              <label className="text-sm">Chiều cao (cm)<input name="heightCm" inputMode="decimal" defaultValue={visit.heightCm ?? ""} className={input} /></label>
            </div>
            <label className="block text-sm">Khám lâm sàng (khám thực thể, các cơ quan)
              <textarea name="clinicalExam" defaultValue={exam.clinicalExam ?? ""} placeholder="vd: Cơ cổ vai gáy co cứng, ấn đau điểm Phong trì; tầm vận động cổ giảm khi xoay phải; tim phổi bình thường." className={`${ta} min-h-[8rem]`} />
            </label>
          </fieldset>
          {!locked && <button className={btnMain}>Lưu khám lâm sàng</button>}
        </form>
      </section>

      <section className="card space-y-3" id="chan-doan">
        <h2 className="font-semibold text-brand-deep">Chẩn đoán</h2>
        <form action={saveDiagnosis} data-draft className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <div className="font-semibold text-amber-800">Chẩn đoán YHCT</div>
                {(["pattern", "disease"] as const).map((k) => {
                  const label = k === "disease" ? "Bệnh danh" : "Chứng hậu";
                  const list = k === "disease" ? diseases : patterns;
                  const idv = exam[`${k}Id` as "diseaseId"];
                  const tx = exam[`${k}Text` as "diseaseText"];
                  return (
                    <div key={k} className="space-y-2">
                      <label className="block text-sm">{label} (chọn từ danh mục)
                        {locked ? <div className={input}>{tx ?? "—"}</div> : sel(`${k}Id`, idv, list)}
                      </label>
                      <label className="block text-sm">{label} (ghi tay, nếu khác danh mục)
                        <input name={`${k}Text`} defaultValue={tx ?? ""} className={input} />
                      </label>
                    </div>
                  );
                })}
                <div className="grid gap-3 sm:grid-cols-2">
                  {BAT_CUONG.map((g) => (
                    <label key={g.name} className="text-sm">{g.label}
                      <select name={g.name} defaultValue={(exam as Record<string, unknown>)[g.name] as string ?? ""} className={input}>
                        <option value="">— Chưa xác định —</option>
                        {g.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
                <div className="font-semibold text-sky-800">Chẩn đoán hiện đại</div>
                <label className="block text-sm">Bệnh / hội chứng
                  <input name="modernDiagnosis" defaultValue={exam.modernDiagnosis ?? ""} placeholder="vd: Hội chứng đau vai gáy do thoái hóa cột sống cổ" className={input} />
                </label>
                <label className="block text-sm">Mã ICD-10
                  <input name="icd10Code" defaultValue={exam.icd10Code ?? ""} placeholder="vd: M47.8" className={input} />
                </label>
                <p className="text-xs text-brand-ink/60">Mã ICD-10 do bác sĩ tự nhập (chưa có danh mục tra cứu tự động).</p>
              </div>
            </div>
          </fieldset>
          {!locked && <button className={btnMain}>Lưu chẩn đoán</button>}
        </form>
      </section>

      <section className="card space-y-3" id="phap-tri">
        <h2 className="font-semibold text-brand-deep">Pháp trị và bát pháp</h2>
        <form action={savePrinciple} data-draft className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-sm">Pháp trị (chọn từ danh mục)
                {locked ? <div className={input}>{exam.principleText ?? "—"}</div> : sel("principleId", exam.principleId, principles)}
              </label>
              <label className="text-sm">Pháp trị (ghi tay, nếu khác danh mục)
                <input name="principleText" defaultValue={exam.principleText ?? ""} className={input} />
              </label>
            </div>
            <div className="text-sm">Bát pháp
              <div className="mt-1 flex flex-wrap gap-3">
                {BAT_PHAP.map((m) => (
                  <label key={m} className="flex items-center gap-1">
                    <input type="checkbox" name="eightMethods" value={m} defaultChecked={(exam.eightMethods ?? "").split(",").includes(m)} /> {m}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>
          {!locked && <button className={btnMain}>Lưu pháp trị</button>}
        </form>
      </section>

      {/* 4. Đơn thuốc */}
      <section className="card space-y-3" id="don-thuoc">
        <h2 className="font-semibold text-brand-deep" id="phuong-thuoc">Phương thuốc (thang thuốc)</h2>
        {!locked && formulas.length > 0 && (
          <div className="rounded-lg border border-brand-gold/30 p-3 space-y-2">
            <div className="text-sm font-semibold">Bài thuốc theo pháp trị “{exam.principleText}”</div>
            {formulas.map((f) => (
              <form key={f.id} action={addFormulaToPrescription} className="flex flex-wrap items-center gap-2 text-sm">
                {hidden}<input type="hidden" name="formulaId" value={f.id} />
                <span className="flex-1 min-w-[10rem]"><b>{f.name}</b> · {f._count.ingredients} vị{f.indications ? ` · ${f.indications.slice(0, 80)}` : ""}</span>
                <button className={btnSub}>Dùng bài này</button>
              </form>
            ))}
            <p className="text-xs text-gray-600">Thêm bài sẽ chép các vị vào đơn để bác sĩ chỉnh liều. Vị chưa có trong kho sẽ được báo lại.</p>
          </div>
        )}

        <form action={savePrescriptionMeta} data-draft className="flex flex-wrap items-end gap-3">
          {hidden}
          <fieldset disabled={locked} className="flex flex-wrap items-end gap-3 w-full">
            <label className="text-sm">Số thang
              <input name="thangCount" type="number" min={0} max={60} step={1} defaultValue={thang} className={`${input} w-28`} />
            </label>
            <label className="text-sm flex-1 min-w-[12rem]">Cách sắc / cách dùng thang thuốc
              <input name="decoctionNote" defaultValue={rx?.decoctionNote ?? ""} placeholder="vd: sắc 3 chén còn 1 chén, uống ấm sau ăn" className={input} />
            </label>
            {!locked && <button className={btnSub}>Lưu</button>}
          </fieldset>
        </form>

        {lines.length === 0 ? (
          <p className="text-sm text-gray-600">Đơn chưa có thuốc.</p>
        ) : (
          <div className="space-y-2">
            {(["HERB", "PRODUCT"] as const).map((kind) => {
              const ls = lines.filter((l) => l.kind === kind);
              if (!ls.length) return null;
              return (
                <div key={kind}>
                  <div className="text-sm font-semibold mb-1">
                    {kind === "HERB" ? `Thuốc sắc (gam mỗi thang${thang ? `, ${thang} thang` : ""})` : "Thành phẩm"}
                  </div>
                  {ls.map((l) => {
                    const total = kind === "HERB" ? l.qty * Math.max(thang, 0) : l.qty;
                    const have = stock.get(l.itemId) ?? 0;
                    const short = total > have;
                    const range = kind === "HERB" ? parseDoseRange(l.item.herb?.dosage) : null;
                    const dose = range && l.qty > 0 && (l.qty > range.max || l.qty < range.min * 0.5) ? range : null;
                    return (
                      <div key={l.id} className="border-b border-brand-gold/20 py-2 space-y-1">
                        <form action={updatePrescriptionLine} className="flex flex-wrap items-end gap-2">
                          {hidden}<input type="hidden" name="lineId" value={l.id} />
                          <div className="min-w-[8rem] flex-1 text-sm font-medium">{l.itemName}</div>
                          <fieldset disabled={locked} className="flex flex-wrap items-end gap-2">
                            <label className="text-xs">SL ({l.unit})
                              <input name="qty" type="number" step="any" min="0" defaultValue={l.qty} className={`${input} w-24`} />
                            </label>
                            <label className="text-xs">{kind === "HERB" ? "Ghi chú" : "Cách dùng"}
                              <input name={kind === "HERB" ? "note" : "usage"} defaultValue={(kind === "HERB" ? l.note : l.usage) ?? ""} className={`${input} w-44`} />
                            </label>
                            {kind === "PRODUCT" && <input type="hidden" name="note" value={l.note ?? ""} />}
                            {kind === "HERB" && <input type="hidden" name="usage" value={l.usage ?? ""} />}
                            {!locked && <button className={btnSub}>Lưu</button>}
                          </fieldset>
                        </form>
                        {!locked && (
                          <form action={removePrescriptionLine}>
                            {hidden}<input type="hidden" name="lineId" value={l.id} />
                            <ConfirmSubmit message={`Bỏ “${l.itemName}” khỏi đơn?`}>Bỏ</ConfirmSubmit>
                          </form>
                        )}
                        <div className="text-xs">
                          {kind === "HERB" && thang > 0 && <span>Tổng {fmtQty(total)} {l.unit} · </span>}
                          <span className={short ? "text-red-700 font-semibold" : "text-gray-600"}>
                            Tồn tại chi nhánh: {fmtQty(have)} {l.unit}{short ? " (không đủ)" : ""}
                          </span>
                          {dose && <span className="text-amber-700 font-semibold"> · Ngoài khoảng liều thường dùng {dose.min}–{dose.max} g, bác sĩ kiểm tra lại</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {!locked && (
          <form action={addPrescriptionLine} className="flex flex-wrap items-end gap-2 pt-2">
            {hidden}
            <label className="text-sm flex-1 min-w-[12rem]">Thêm thuốc
              <select name="itemId" defaultValue="" className={input} required>
                <option value="" disabled>Chọn thuốc</option>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.type === "HERB" ? "vị thuốc" : "thành phẩm"}, {i.unit})</option>)}
              </select>
            </label>
            <label className="text-sm">Số lượng
              <input name="qty" type="number" step="any" min="0" required className={`${input} w-28`} />
            </label>
            <label className="text-sm">Cách dùng
              <input name="usage" placeholder="vd: 2 viên x 3 lần/ngày" className={`${input} w-52`} />
            </label>
            <button className={btnSub}>Thêm</button>
          </form>
        )}
        {!locked && items.length === 0 && (
          <div className="warn-box text-sm">Kho chưa có mặt hàng nào. Quản lý cần thêm ở “Kho và giá → Mặt hàng”.</div>
        )}
      </section>


      {/* 5. Châm cứu, xoa bóp */}
      <section className="card space-y-3" id="cham-cuu">
        <h2 className="font-semibold text-brand-deep">Châm cứu và xoa bóp</h2>
        {exam.points.length === 0 && exam.therapies.length === 0 && <p className="text-sm text-gray-600">Chưa chỉ định.</p>}
        {exam.points.map((x) => (
          <div key={x.id} className="flex items-center gap-2 text-sm">
            <span className="flex-1">Huyệt: <b>{x.label}</b>{x.note ? ` · ${x.note}` : ""}</span>
            {!locked && <form action={removeExamPoint}>{hidden}<input type="hidden" name="id" value={x.id} /><ConfirmSubmit message="Bỏ huyệt này?">Bỏ</ConfirmSubmit></form>}
          </div>
        ))}
        {exam.therapies.map((x) => (
          <div key={x.id} className="flex items-center gap-2 text-sm">
            <span className="flex-1">Xoa bóp: <b>{x.label}</b>{x.note ? ` · ${x.note}` : ""}</span>
            {!locked && <form action={removeExamTherapy}>{hidden}<input type="hidden" name="id" value={x.id} /><ConfirmSubmit message="Bỏ phương pháp này?">Bỏ</ConfirmSubmit></form>}
          </div>
        ))}
        {!locked && (
          <div className="grid gap-3 sm:grid-cols-2">
            <form action={addExamPoint} className="flex flex-wrap items-end gap-2">
              {hidden}
              <label className="text-sm flex-1 min-w-[10rem]">Huyệt (mã hoặc tên)
                <input name="point" list="dl-points" className={input} />
              </label>
              <label className="text-sm w-32">Ghi chú
                <input name="note" className={input} />
              </label>
              <button className={btnSub}>Thêm huyệt</button>
              <datalist id="dl-points">{pointList.map((x) => <option key={x.code} value={`${x.code} — ${x.standardName}`} />)}</datalist>
            </form>
            <form action={addExamTherapy} className="flex flex-wrap items-end gap-2">
              {hidden}
              <label className="text-sm flex-1 min-w-[10rem]">Phương pháp xoa bóp
                <input name="therapy" list="dl-therapies" className={input} />
              </label>
              <label className="text-sm w-32">Ghi chú
                <input name="note" className={input} />
              </label>
              <button className={btnSub}>Thêm</button>
              <datalist id="dl-therapies">{therapyList.map((x) => <option key={x.name} value={x.name} />)}</datalist>
            </form>
          </div>
        )}
      </section>


      {/* 6. Hoàn tất */}
      <section className="card space-y-3" id="hoan-tat">
        <h2 className="font-semibold text-brand-deep">Dặn dò và hoàn tất</h2>
        <form action={finishExam} className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <label className="block text-sm">Lời dặn (ăn uống, sinh hoạt, kiêng cữ)
              <textarea name="advice" defaultValue={exam.advice ?? ""} className={ta} />
            </label>
            <label className="block text-sm">Ngày tái khám
              <input name="followUpDate" type="date" defaultValue={toDateInput(exam.followUpDate)} className={`${input} w-52`} />
            </label>
          </fieldset>
          {!locked && (
            <ConfirmSubmit message="Hoàn tất bệnh án? Đơn thuốc sẽ chuyển sang bước thu tiền và phát thuốc." className={btnMain}>
              Hoàn tất khám
            </ConfirmSubmit>
          )}
        </form>
      </section>

</div>) },
      ]} />

      <p className="text-xs text-gray-500">
        <Link href={`/benh-nhan/${p.id}`} className="underline">Hồ sơ bệnh nhân</Link>
      </p>
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <Link href="/kham" className="mr-auto rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50">◂ Danh sách khám</Link>
        {!locked && (
          <form action={cancelExam}>
            {hidden}
            <ConfirmSubmit message="Hủy khám lượt này? Chỉ hủy được khi chưa có hóa đơn." className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50"><XCircle className="h-4 w-4" />Hủy khám</ConfirmSubmit>
          </form>
        )}
        {!locked && <SaveDraftButton />}
        <PrintButton label="In bệnh án" />
        {!locked && <a href="#hoan-tat" className="rounded-xl bg-brand-deep px-5 py-2.5 font-semibold text-white hover:bg-brand-deeper">Hoàn tất khám ▸</a>}
      </div>
      </div>
    </div>
  );
}

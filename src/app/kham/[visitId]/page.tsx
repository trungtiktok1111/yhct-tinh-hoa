import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import {
  startExam, saveFindings, saveDiagnosis, chooseSuggestion, addFormulaToPrescription, savePrescriptionMeta,
  addPrescriptionLine, updatePrescriptionLine, removePrescriptionLine, addExamPoint, removeExamPoint,
  addExamTherapy, removeExamTherapy, finishExam, reopenExam,
} from "@/actions/exam";
import { analyzePatterns } from "@/lib/reasoning";
import { BAT_CUONG, BAT_PHAP, parseDoseRange } from "@/lib/exam";
import { input } from "@/lib/stock";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, patientCode, qty as fmtQty, bmiText } from "@/lib/format";
import { ageOf, toDateInput } from "@/lib/person";
import { GROUPS, TAG_LABEL, readTuChan, summarize, type Tag } from "@/lib/tuchan";
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

  const header = (
    <div className="space-y-2">
      <BackLink href="/kham" label="Danh sách khám" />
      <h1 className="text-2xl font-bold font-display">{p.fullName}</h1>
      <div className="text-sm text-gray-700">
        {patientCode(p.seq)} · {SEX_LABEL[p.sex] ?? p.sex} · {ageOf(p.birthDate, p.birthYear)} tuổi · Số {visit.queueNo} · {visit.branch.name} · {VISIT_STATUS[visit.status] ?? visit.status}
      </div>
      {p.allergies && <div className="warn-box text-sm"><b>Dị ứng:</b> {p.allergies}</div>}
      {(p.pastHistory || p.chronicConditions || p.familyHistory) && (
        <div className="card text-sm space-y-1">
          {p.chronicConditions && <div><b>Bệnh mạn tính:</b> {p.chronicConditions}</div>}
          {p.pastHistory && <div><b>Tiền sử:</b> {p.pastHistory}</div>}
          {p.familyHistory && <div><b>Gia đình:</b> {p.familyHistory}</div>}
        </div>
      )}
      <div className="text-sm text-gray-700">
        Sinh hiệu: {[
          visit.pulse != null && `mạch ${visit.pulse}/phút`,
          visit.bloodPressure && `HA ${visit.bloodPressure}`,
          visit.temperature != null && `${visit.temperature}°C`,
          visit.weightKg != null && `${visit.weightKg} kg`,
          bmiText(visit.weightKg, visit.heightCm) && `BMI ${bmiText(visit.weightKg, visit.heightCm)}`,
          visit.heightCm != null && `${visit.heightCm} cm`,
        ].filter(Boolean).join(" · ") || "chưa ghi"}
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
    </div>
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
  const tuChan = readTuChan(exam.tuChanData);
  const tc = summarize(tuChan);
  const rx = exam.prescription;
  const lines = rx?.lines ?? [];

  // Gợi ý chứng hậu: chỉ so khớp từ khóa, không chấm điểm; bác sĩ phải tự chọn.
  const obsText = [exam.chiefComplaint, exam.presentHistory, exam.inspection, exam.listening, exam.inquiry, exam.palpation, tc.text]
    .filter(Boolean).join("; ");
  let suggestions: { id: string; name: string; support: string[]; against: string[]; principles: { id: string; name: string }[] }[] = [];
  if (!locked && obsText.length > 3) {
    const patterns = await prisma.pattern.findMany({
      select: {
        id: true, name: true, supportCriteria: true, againstCriteria: true, keySigns: true, missingDataPrompts: true,
        principleLinks: { select: { principle: { select: { id: true, name: true } } } },
      },
      take: 400,
    });
    const res = analyzePatterns(obsText, patterns);
    const byId = new Map(patterns.map((x) => [x.id, x]));
    suggestions = res
      .filter((r) => r.supportMatches.length > 0)
      .sort((a, b) => b.supportMatches.length - a.supportMatches.length)
      .slice(0, 6)
      .map((r) => ({
        id: r.patternId, name: r.patternName, support: r.supportMatches, against: r.againstMatches,
        principles: (byId.get(r.patternId)?.principleLinks ?? []).map((l) => l.principle),
      }));
  }

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

  return (
    <div className="space-y-5">
      {header}

      <div className="warn-box text-xs">
        Dữ liệu tri thức trong hệ thống là DEMO. Mọi gợi ý chỉ để tham khảo; chẩn đoán và đơn thuốc do bác sĩ quyết định.
      </div>

      {locked && (
        <div className="card !bg-green-50 text-sm text-green-800 flex flex-wrap items-center gap-3">
          <span>Bệnh án đã hoàn tất{exam.doctorName ? ` · BS ${exam.doctorName}` : ""}. Đang ở chế độ chỉ xem.</span>
          <form action={reopenExam}>{hidden}<ConfirmSubmit message="Mở lại bệnh án để sửa?">Mở lại để sửa</ConfirmSubmit></form>
        </div>
      )}

      {/* 1. Hỏi bệnh và tứ chẩn */}
      <section className="card space-y-3" id="tu-chan">
        <h2 className="font-semibold text-brand-deep">1. Hỏi bệnh và tứ chẩn</h2>
        <form action={saveFindings} className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
            <label className="block text-sm">Lý do khám / triệu chứng chính
              <textarea name="chiefComplaint" defaultValue={exam.chiefComplaint ?? ""} className={ta} />
            </label>
            <label className="block text-sm">Bệnh sử hiện tại
              <textarea name="presentHistory" defaultValue={exam.presentHistory ?? ""} className={ta} />
            </label>
            <details className="rounded-xl border border-brand-gold/40 bg-brand-cream/40 p-3 text-sm">
              <summary className="cursor-pointer font-semibold text-brand-deep">Hướng dẫn nhanh và ví dụ mẫu</summary>
              <div className="mt-2 space-y-2">
                <p><b>Cách dùng:</b> mở từng nhóm Vọng, Văn, Vấn, Thiết, tích những gì quan sát được. Chỉ tích điều có thật, không tích thì để trống. Thiếu lựa chọn: gõ vào ô viền đứt “Bổ sung ghi tay” ngay dưới mục đó. Rê chuột lên một lựa chọn để xem ý nghĩa. Bấm “Lưu tứ chẩn và xem tổng hợp”.</p>
                <p><b>Ví dụ:</b> bệnh nhân nam 46 tuổi, đau vai gáy 2 tuần, sợ lạnh, không ra mồ hôi, rêu lưỡi trắng mỏng, mạch Phù Khẩn. Cách ghi:</p>
                <ul className="ml-4 list-disc text-xs">
                  <li>Vấn chẩn › Hàn nhiệt: tích “Sợ lạnh (ố hàn)”, “Sợ gió”. Hãn: tích “Không ra mồ hôi”. Đau: tích “Đau cổ vai gáy” ở mục Đầu, mặt, thân mình.</li>
                  <li>Vọng chẩn › Thiệt chẩn: Sắc rêu chọn “Trắng”, tính chất rêu tích “Mỏng”.</li>
                  <li>Thiết chẩn › Mạch tượng chung: tích “Phù” và “Khẩn”.</li>
                </ul>
                <p><b>Hệ thống làm gì:</b> (1) liệt kê lại đúng những gì bạn đã tích; (2) xếp vào bát cương, ví dụ Phù thuộc Biểu, Khẩn và sợ lạnh thuộc Hàn, chỉ liệt kê, không chấm điểm; (3) gợi ý các chứng hậu có tiêu chí khớp từ khóa, ở ví dụ trên thường là nhóm ngoại cảm phong hàn; (4) bác sĩ tự chọn chứng hậu, pháp trị và kê đơn. Hệ thống không tự kết luận.</p>
              </div>
            </details>
            <TuChanFields
              data={tuChan}
              groupNotes={{ vong: exam.inspection, van: exam.listening, vanhoi: exam.inquiry, thiet: exam.palpation }}
            />
            <label className="block text-sm">Chẩn đoán theo y học hiện đại (nếu có)
              <input name="modernDiagnosis" defaultValue={exam.modernDiagnosis ?? ""} className={input} />
            </label>
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

      {/* 2. Gợi ý */}
      {!locked && (
        <section className="card space-y-3" id="goi-y">
          <h2 className="font-semibold text-brand-deep">2. Gợi ý tham khảo (bác sĩ tự chọn)</h2>
          <p className="text-xs text-gray-600">
            Hệ thống chỉ so khớp từ khóa trong phần tứ chẩn với tiêu chí đã ghi của từng chứng hậu. Đây không phải kết luận và không có điểm số.
          </p>
          {suggestions.length === 0 ? (
            <p className="text-sm text-gray-600">Chưa có gợi ý. Hãy ghi thêm triệu chứng ở bước 1 rồi bấm “Lưu và xem gợi ý”.</p>
          ) : (
            <div className="space-y-2">
              {suggestions.map((s) => (
                <div key={s.id} className="rounded-lg border border-brand-gold/30 p-3 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-brand-deep">{s.name}</b>
                    <form action={chooseSuggestion}>
                      {hidden}<input type="hidden" name="kind" value="pattern" /><input type="hidden" name="id" value={s.id} />
                      <button className={btnSub}>Chọn chứng này</button>
                    </form>
                  </div>
                  <div className="text-xs text-gray-700">Khớp: {s.support.join("; ")}</div>
                  {s.against.length > 0 && <div className="text-xs text-red-700">Có dữ kiện mâu thuẫn: {s.against.join("; ")}</div>}
                  {s.principles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      Pháp trị liên quan:
                      {s.principles.map((t) => (
                        <form key={t.id} action={chooseSuggestion}>
                          {hidden}<input type="hidden" name="kind" value="principle" /><input type="hidden" name="id" value={t.id} />
                          <button className="underline text-brand-deep">{t.name}</button>
                        </form>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Chẩn đoán */}
      <section className="card space-y-3" id="chan-doan">
        <h2 className="font-semibold text-brand-deep">3. Chẩn đoán và pháp trị</h2>
        <form action={saveDiagnosis} className="space-y-3">
          {hidden}
          <fieldset disabled={locked} className="space-y-3">
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
            <div className="text-sm">Bát pháp
              <div className="flex flex-wrap gap-3 mt-1">
                {BAT_PHAP.map((m) => (
                  <label key={m} className="flex items-center gap-1">
                    <input type="checkbox" name="eightMethods" value={m} defaultChecked={(exam.eightMethods ?? "").split(",").includes(m)} /> {m}
                  </label>
                ))}
              </div>
            </div>
            {(["disease", "pattern", "principle"] as const).map((k) => {
              const label = k === "disease" ? "Bệnh danh" : k === "pattern" ? "Chứng hậu" : "Pháp trị";
              const list = k === "disease" ? diseases : k === "pattern" ? patterns : principles;
              const idv = exam[`${k}Id` as "diseaseId"];
              const tx = exam[`${k}Text` as "diseaseText"];
              return (
                <div key={k} className="grid gap-2 sm:grid-cols-2">
                  <label className="text-sm">{label} (chọn từ danh mục)
                    {locked ? <div className={input}>{tx ?? "—"}</div> : sel(`${k}Id`, idv, list)}
                  </label>
                  <label className="text-sm">{label} (ghi tay, nếu khác danh mục)
                    <input name={`${k}Text`} defaultValue={tx ?? ""} className={input} />
                  </label>
                </div>
              );
            })}
          </fieldset>
          {!locked && <button className={btnMain}>Lưu chẩn đoán</button>}
        </form>
      </section>

      {/* 4. Đơn thuốc */}
      <section className="card space-y-3" id="don-thuoc">
        <h2 className="font-semibold text-brand-deep">4. Đơn thuốc</h2>
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

        <form action={savePrescriptionMeta} className="flex flex-wrap items-end gap-3">
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
        <h2 className="font-semibold text-brand-deep">5. Châm cứu và xoa bóp</h2>
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
        <h2 className="font-semibold text-brand-deep">6. Dặn dò và hoàn tất</h2>
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

      <p className="text-xs text-gray-500">
        <Link href={`/benh-nhan/${p.id}`} className="underline">Hồ sơ bệnh nhân</Link>
      </p>
    </div>
  );
}

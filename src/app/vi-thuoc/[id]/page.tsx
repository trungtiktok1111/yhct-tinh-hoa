import { EntityToolbar } from "@/components/EntityToolbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Microscope, Sprout, Thermometer, Route, ShieldAlert, ScrollText, Link2, FlaskConical, MapPin, Warehouse, TestTube, Leaf } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { MeridianWheel } from "@/components/MeridianWheel";
import { ClauseCard } from "@/components/ClauseCard";
import { splitClauses } from "@/lib/clauses";

export const dynamic = "force-dynamic";

function SectionTitle({ icon: Icon, children }: { icon: typeof Microscope; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="section-seal">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <h2 className="font-display text-lg font-bold text-brand-deep tracking-wide">{children}</h2>
    </div>
  );
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-brand-ink/50 shrink-0 w-28">{label}</span>
      <span className="text-brand-ink font-medium whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function Prose({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-brand-ink/45 font-semibold mb-1">{label}</div>
      <p className="text-sm text-brand-ink whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}

export default async function HerbDetailPage({ params }: { params: { id: string } }) {
  const herb = await prisma.herb.findUnique({
    where: { id: params.id },
    include: {
      source: true,
      formulaLinks: { include: { formula: true } },
    },
  });
  if (!herb) notFound();

  const actionClauses = herb.actions ? splitClauses(herb.actions) : [];
  const indicationClauses = herb.indications ? splitClauses(herb.indications) : [];
  const pharmacologyClauses = herb.modernPharmacology ? splitClauses(herb.modernPharmacology) : [];
  const natureItems = herb.natureFlavor ? herb.natureFlavor.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
  const hasHarvestInfo = herb.distribution || herb.harvestProcessing || herb.storage || herb.chemicalComposition;

  return (
    <div className="space-y-5">
      <Link href="/vi-thuoc" className="text-sm text-brand-deep underline">
        ← Danh mục vị thuốc
      </Link>
      <EntityToolbar entity="vi-thuoc" id={params.id} />

      {/* Tiêu đề — như mảng trích từ cuốn bản thảo cổ */}
      <div className="card relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-6 -top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl"
        />
        <div className="relative flex items-start gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl font-bold text-brand-deep tracking-wide">
                {herb.standardName}
              </h1>
              <StatusPill status={herb.status} />
            </div>
            {herb.latinName && (
              <p className="italic text-brand-ink/60 text-sm mt-0.5">{herb.latinName}</p>
            )}
            {herb.aliases && (
              <p className="text-sm text-brand-ink/50 mt-1">Tên khác: {herb.aliases}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[minmax(0,220px)_1fr] gap-5">
        {/* Khung tiêu bản */}
        <div className="specimen-frame flex items-center justify-center min-h-[180px]">
          {herb.imageUrl ? (
            <Image
              src={herb.imageUrl}
              alt={herb.standardName}
              width={300}
              height={260}
              className="relative max-h-56 w-auto object-contain rounded"
            />
          ) : (
            <div className="relative flex flex-col items-center gap-2 text-brand-ink/35 py-10">
              <Sprout className="h-10 w-10" strokeWidth={1.25} />
              <span className="text-xs">Chưa có ảnh tiêu bản</span>
            </div>
          )}
        </div>

        {/* Đặc điểm dược liệu */}
        <div className="card space-y-2.5">
          <SectionTitle icon={Microscope}>Đặc điểm dược liệu</SectionTitle>
          <Fact label="Họ" value={herb.family} />
          <Fact label="Bộ phận dùng" value={herb.partUsed} />
          <Fact label="Nguồn gốc" value={herb.origin} />
          <Fact label="Liều dùng" value={herb.dosage} />
        </div>
      </div>

      {/* Mô tả thực vật */}
      {herb.botanicalDescription && (
        <div className="card">
          <SectionTitle icon={Leaf}>Đặc điểm thực vật</SectionTitle>
          <p className="text-sm text-brand-ink whitespace-pre-wrap leading-relaxed">
            {herb.botanicalDescription}
          </p>
        </div>
      )}

      {/* Phân bố - Thu hái sơ chế - Bảo quản - Thành phần hóa học */}
      {hasHarvestInfo && (
        <div className="card grid sm:grid-cols-2 gap-4">
          <div className="flex gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-gold" strokeWidth={1.75} />
            <Prose label="Phân bố" value={herb.distribution} />
          </div>
          <div className="flex gap-2.5">
            <FlaskConical className="h-4 w-4 shrink-0 mt-0.5 text-brand-gold" strokeWidth={1.75} />
            <Prose label="Thu hái — Sơ chế / Bào chế" value={herb.harvestProcessing} />
          </div>
          <div className="flex gap-2.5">
            <Warehouse className="h-4 w-4 shrink-0 mt-0.5 text-brand-gold" strokeWidth={1.75} />
            <Prose label="Bảo quản" value={herb.storage} />
          </div>
          <div className="flex gap-2.5">
            <TestTube className="h-4 w-4 shrink-0 mt-0.5 text-brand-gold" strokeWidth={1.75} />
            <Prose label="Thành phần hóa học" value={herb.chemicalComposition} />
          </div>
        </div>
      )}

      {/* Tính vị - Quy kinh */}
      <div className="grid md:grid-cols-[1fr_auto] gap-5 items-stretch">
        <div className="card">
          <SectionTitle icon={Thermometer}>Tính vị</SectionTitle>
          {natureItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {natureItems.map((n) => (
                <span key={n} className="herb-chip">
                  {n}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-ink/40">Chưa có dữ liệu.</p>
          )}
          {herb.meridians && (
            <p className="text-sm text-brand-ink/60 mt-3">
              <span className="text-brand-ink/40">Quy kinh (nguyên văn): </span>
              {herb.meridians}
            </p>
          )}
        </div>
        {herb.meridians && (
          <div className="card flex flex-col items-center justify-center gap-1 px-6">
            <span className="text-xs uppercase tracking-wide text-brand-ink/40">Vòng Quy Kinh</span>
            <MeridianWheel meridians={herb.meridians} />
          </div>
        )}
      </div>

      {/* Công năng */}
      {actionClauses.length > 0 && (
        <div className="card">
          <SectionTitle icon={Sprout}>Công năng</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-2">
            {actionClauses.map((c, i) => (
              <ClauseCard key={i} clause={c} />
            ))}
          </div>
        </div>
      )}

      {/* Tác dụng dược lý hiện đại */}
      {pharmacologyClauses.length > 0 && (
        <div className="card">
          <SectionTitle icon={FlaskConical}>Tác dụng dược lý (nghiên cứu hiện đại)</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-2">
            {pharmacologyClauses.map((c, i) => (
              <ClauseCard key={i} clause={c} />
            ))}
          </div>
        </div>
      )}

      {/* Chủ trị */}
      {indicationClauses.length > 0 && (
        <div className="card">
          <SectionTitle icon={Route}>Chủ trị</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-2">
            {indicationClauses.map((c, i) => (
              <ClauseCard key={i} clause={c} />
            ))}
          </div>
        </div>
      )}

      {/* An toàn */}
      {herb.safetyNotes && (
        <div className="warn-box flex gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <div className="text-xs uppercase tracking-wide font-semibold">Kiêng kỵ — Thận trọng</div>
            <div className="whitespace-pre-wrap text-sm mt-0.5">{herb.safetyNotes}</div>
          </div>
        </div>
      )}

      {/* Phối ngũ / bài thuốc */}
      <div className="card">
        <SectionTitle icon={Link2}>Xuất hiện trong bài thuốc</SectionTitle>
        {herb.formulaLinks.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-2">
            {herb.formulaLinks.map((fi) => (
              <Link
                key={fi.id}
                href={`/bai-thuoc/${fi.formula.id}`}
                className="herb-chip !rounded-lg !py-2 !px-3 justify-start hover:bg-brand-gold/20 transition-colors"
              >
                <span className="truncate">{fi.formula.name}</span>
                {fi.role && <span className="text-brand-ink/40 font-normal shrink-0">· {fi.role}</span>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-ink/40">Chưa thuộc bài thuốc nào trong hệ thống.</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-brand-ink/40 pt-1">
        <ScrollText className="h-3.5 w-3.5" strokeWidth={1.75} />
        {herb.source ? <span>Nguồn: {herb.source.title}</span> : <span className="text-amber-700">Chưa gắn nguồn cho mục này.</span>}
      </div>
    </div>
  );
}

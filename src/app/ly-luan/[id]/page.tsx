import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default async function TheoryTopicDetailPage({ params }: { params: { id: string } }) {
  const topic = await prisma.theoryTopic.findUnique({
    where: { id: params.id },
    include: { source: true },
  });
  if (!topic) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ly-luan" className="text-sm text-brand-deep underline">
          ← Lý luận cơ bản
        </Link>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-brand-deep">{topic.name}</h1>
          <StatusPill status={topic.status} />
        </div>
        {topic.category && <p className="text-sm text-gray-500">Nhóm: {topic.category}</p>}
      </div>

      <div className="card space-y-3">
        <Field label="Tóm tắt" value={topic.summary} />
        <Field label="Nội dung" value={topic.content} />
        <Field label="Ứng dụng lâm sàng / điểm cần nhớ" value={topic.keyPoints} />
        {topic.source && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Nguồn: {topic.source.title}
            {topic.source.locator ? ` — ${topic.source.locator}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

import { REVIEW_STATUS_LABEL } from "@/lib/constants";

export function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill status-${status}`}>{REVIEW_STATUS_LABEL[status] ?? status}</span>;
}

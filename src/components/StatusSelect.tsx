import { REVIEW_STATUS_LABEL, REVIEW_STATUS_OPTIONS } from "@/lib/constants";

export function StatusSelect({ defaultValue = "DRAFT" }: { defaultValue?: string }) {
  return (
    <label className="block text-sm">
      Trạng thái thẩm định
      <select name="status" defaultValue={defaultValue} className="mt-1 w-full border rounded px-2 py-1.5">
        {REVIEW_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {REVIEW_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </label>
  );
}

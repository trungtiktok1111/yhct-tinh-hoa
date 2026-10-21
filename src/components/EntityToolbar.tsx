import Link from "next/link";
import { getCurrentStaff } from "@/lib/auth";
import { canEditKnowledge } from "@/lib/permissions";
import { ENTITIES } from "@/lib/entities";
import { deleteEntity } from "@/actions/entity";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

// Nút Sửa / Xóa cho một mục tri thức. Chỉ hiện với Chủ và Bác sĩ.
export async function EntityToolbar({ entity, id }: { entity: string; id: string }) {
  const staff = await getCurrentStaff();
  const def = ENTITIES[entity];
  if (!staff || !def || !canEditKnowledge(staff.role)) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 my-2">
      <Link
        href={`/${def.path}/${id}/sua`}
        className="rounded-lg bg-brand-deep text-brand-cream px-4 py-1.5 text-sm font-semibold hover:bg-brand-deeper"
      >
        Sửa
      </Link>
      <form action={deleteEntity}>
        <input type="hidden" name="entity" value={entity} />
        <input type="hidden" name="id" value={id} />
        <ConfirmSubmit message={`Xóa mục này khỏi ${def.label}? Không thể hoàn tác.`}>Xóa</ConfirmSubmit>
      </form>
    </div>
  );
}

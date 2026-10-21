import { EditEntityForm } from "@/components/EditEntityForm";

export const dynamic = "force-dynamic";

export default function EditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { loi?: string };
}) {
  return <EditEntityForm entity="chung-hau" id={params.id} loi={searchParams.loi} />;
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 py-10 max-w-md">
      <h1 className="text-xl font-bold">Không tìm thấy trang</h1>
      <p className="text-sm text-gray-600">Mục này không tồn tại hoặc đã bị xóa.</p>
      <Link href="/" className="inline-block rounded-lg bg-brand-deep text-brand-cream px-4 py-2 text-sm font-semibold">Về trang chủ</Link>
    </div>
  );
}

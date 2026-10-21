"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-3 py-10 max-w-md">
      <h1 className="text-xl font-bold">Có lỗi xảy ra</h1>
      <p className="text-sm text-gray-600">
        Trang này không tải được. Thử lại, hoặc quay về trang chủ. Nếu lỗi lặp lại, báo cho quản trị kèm mã: {error.digest ?? "không có"}.
      </p>
      <div className="flex gap-2">
        <button onClick={() => reset()} className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2 text-sm font-semibold">Thử lại</button>
        <a href="/" className="rounded-lg border border-brand-gold/50 px-4 py-2 text-sm">Về trang chủ</a>
      </div>
    </div>
  );
}

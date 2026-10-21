import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="card max-w-md mx-auto mt-8 space-y-2">
      <h1 className="text-xl font-bold font-display">Không có quyền truy cập</h1>
      <p className="text-sm text-gray-700">
        Tài khoản của bạn không được phép dùng chức năng này. Liên hệ chủ hoặc quản lý để được cấp quyền.
      </p>
      <Link href="/" className="inline-block text-sm underline">
        Về trang tổng quan
      </Link>
    </div>
  );
}

"use client";

// Nút gửi form có hỏi xác nhận trước (dùng cho thao tác xóa).
export function ConfirmSubmit({
  message,
  children,
  className = "rounded-lg border border-red-300 text-red-800 px-3 py-1.5 text-sm hover:bg-red-50",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

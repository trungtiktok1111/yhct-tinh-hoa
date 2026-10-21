import { requireStaff } from "@/lib/auth";
import { rolesLabel } from "@/lib/permissions";
import { changeOwnPassword } from "@/actions/account";
import { BackLink } from "@/components/BackLink";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export default async function AccountPage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const me = await requireStaff();
  return (
    <div className="space-y-5 max-w-md">
      <BackLink href="/" label="Về trang chủ" />
      <h1 className="text-2xl font-bold font-display">Tài khoản của tôi</h1>
      <div className="card text-sm">
        <div className="font-semibold">{me.fullName}</div>
        <div className="text-gray-600">@{me.username} · {rolesLabel(me.role)}</div>
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã đổi mật khẩu.</div>}
      <form action={changeOwnPassword} className="card space-y-3">
        <h2 className="font-semibold">Đổi mật khẩu</h2>
        <input name="current" type="password" placeholder="Mật khẩu hiện tại" required autoComplete="current-password" className={input} />
        <input name="next" type="password" placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" minLength={8} required autoComplete="new-password" className={input} />
        <input name="again" type="password" placeholder="Nhập lại mật khẩu mới" minLength={8} required autoComplete="new-password" className={input} />
        <button type="submit" className="w-full bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-2.5 font-semibold">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}

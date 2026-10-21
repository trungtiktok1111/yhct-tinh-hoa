"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/actions/auth";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-3 text-base font-semibold transition-colors disabled:opacity-60"
    >
      {pending ? "Đang đăng nhập…" : "Đăng nhập"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          required
          className="w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-3 text-base"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-3 text-base"
        />
      </div>
      {state.error && <div className="warn-box text-sm">{state.error}</div>}
      <Submit />
    </form>
  );
}

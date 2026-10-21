// Phiên đăng nhập: JWT ký HMAC lưu trong cookie httpOnly. Dùng được cả ở middleware (edge).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "yhct_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 giờ

export type SessionPayload = {
  sub: string; // staffId
  name: string;
  role: string;
};

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("Thiếu AUTH_SECRET (tối thiểu 32 ký tự) trong biến môi trường.");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(p: SessionPayload): Promise<string> {
  return new SignJWT({ name: p.name, role: p.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.name !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { sub: payload.sub, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

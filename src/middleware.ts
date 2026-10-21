import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { canAccessPath } from "@/lib/permissions";

const PUBLIC_PATHS = ["/dang-nhap"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dang-nhap";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!canAccessPath(session.role, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/khong-co-quyen";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Bỏ qua file tĩnh và ảnh.
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico).*)"],
};

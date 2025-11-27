import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PATHS = ["/train", "/dataset-preview", "/user", "/admin"];

async function getUserFromToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // contains id, email, role
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!needsAuth) return NextResponse.next();

  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  /* ✅ SPECIAL RULE FOR ADMIN ROUTE */
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin-only", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/train/:path*",
    "/dataset-preview/:path*",
    "/user/:path*",
    "/admin/:path*",
  ],
};

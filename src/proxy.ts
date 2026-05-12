/**
 * Proxy — Proteksi Rute (sebelumnya Middleware)
 *
 * Di Next.js 16, file convention "middleware" sudah deprecated
 * dan diganti menjadi "proxy". Fungsinya tetap sama:
 *
 * 1. Cek keberadaan cookie "session"
 * 2. Jika tidak ada → redirect ke /login
 * 3. Jika ada → lanjutkan request
 *
 * config.matcher menentukan rute mana yang dijaga.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  // Jika akses root "/", redirect berdasarkan status login
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Untuk /dashboard — jika tidak ada session, redirect ke /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Session valid, lanjutkan request
  return NextResponse.next();
}

/**
 * Config Matcher
 *
 * Hanya jalankan proxy pada rute /dashboard dan sub-rute-nya.
 * Rute lain (login, API, static files) tidak terpengaruh.
 */
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

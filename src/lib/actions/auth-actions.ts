/**
 * Auth Server Actions
 *
 * Server Actions untuk autentikasi:
 * - loginAction: Set session cookie dan redirect ke dashboard
 * - logoutAction: Hapus session cookie dan redirect ke login
 *
 * Cookie diset di server agar tidak bisa dimanipulasi dari browser.
 */

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Action: Login
 *
 * Simulasi login dengan mengecek email & password.
 * Jika valid, set session cookie berisi nama user.
 */
export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !email.trim()) {
    return { error: "Masukkan email Anda" };
  }
  if (!password || !password.trim()) {
    return { error: "Masukkan password" };
  }

  // Simulasi: extract nama dari email
  const name = email
    .split("@")[0]
    .replace(/\./g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Set session cookie di server
  const cookieStore = await cookies();
  cookieStore.set("session", name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  redirect("/dashboard");
}

/**
 * Server Action: Logout
 *
 * Hapus session cookie dan redirect ke halaman login.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

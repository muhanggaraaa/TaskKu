/**
 * Auth Server Actions
 *
 * - registerAction: Buat akun baru, simpan ke cookie store, set session
 * - loginAction: Validasi email + password terhadap akun terdaftar, set session
 * - logoutAction: Hapus session cookie, redirect ke login
 *
 * Akun disimpan di cookie httpOnly `taskku_accounts` (array JSON).
 * Password di-hash dengan SHA-256 sebelum disimpan.
 */

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

type StoredAccount = {
  name: string;
  email: string;
  passwordHash: string;
};

const ACCOUNTS_COOKIE = "taskku_accounts";
const SESSION_COOKIE = "session";
const ACCOUNTS_MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function readAccounts(): Promise<StoredAccount[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCOUNTS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is StoredAccount =>
        typeof a === "object" &&
        a !== null &&
        typeof a.name === "string" &&
        typeof a.email === "string" &&
        typeof a.passwordHash === "string",
    );
  } catch {
    return [];
  }
}

async function writeAccounts(accounts: StoredAccount[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCOUNTS_COOKIE, JSON.stringify(accounts), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCOUNTS_MAX_AGE,
  });
}

async function setSession(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action: Register
 *
 * Membuat akun baru dengan validasi:
 * - Nama wajib (min 2 karakter)
 * - Email valid & unik
 * - Password minimal 6 karakter
 * - Konfirmasi password harus sama
 */
export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const confirmPassword = (formData.get("confirmPassword") as string | null) ?? "";

  if (name.length < 2) {
    return { error: "Nama minimal 2 karakter" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Format email tidak valid" };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }
  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok" };
  }

  const accounts = await readAccounts();
  if (accounts.some((a) => a.email === email)) {
    return { error: "Email sudah terdaftar. Silakan login." };
  }

  accounts.push({
    name,
    email,
    passwordHash: hashPassword(password),
  });
  await writeAccounts(accounts);
  await setSession(name);

  redirect("/dashboard");
}

/**
 * Server Action: Login
 *
 * Validasi email + password terhadap akun terdaftar.
 * Jika cocok, set session cookie berisi nama user.
 */
export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email) {
    return { error: "Masukkan email Anda" };
  }
  if (!password) {
    return { error: "Masukkan password" };
  }

  const accounts = await readAccounts();
  const account = accounts.find((a) => a.email === email);

  if (!account) {
    return { error: "Akun tidak ditemukan. Silakan daftar dulu." };
  }
  if (account.passwordHash !== hashPassword(password)) {
    return { error: "Password salah" };
  }

  await setSession(account.name);
  redirect("/dashboard");
}

/**
 * Server Action: Logout
 *
 * Hapus session cookie dan redirect ke halaman login.
 * Akun yang terdaftar tetap tersimpan.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

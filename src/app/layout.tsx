import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskKu — Atur Tugasmu, Raih Nilaimu",
  description:
    "Aplikasi manajemen tugas interaktif berbasis Next.js dengan Server Actions dan Supabase. Kelola tugas kuliah, pekerjaan, dan pribadi dengan mudah.",
  keywords: ["task manager", "tugas", "Next.js", "Server Actions", "Supabase", "MVP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ThemedToaster } from "@/components/ThemedToaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskKu — Atur Tugasmu, Raih Nilaimu",
  description:
    "Aplikasi manajemen tugas interaktif berbasis Next.js dengan Server Actions dan Supabase. Kelola tugas kuliah, pekerjaan, dan pribadi dengan mudah.",
  keywords: ["task manager", "tugas", "Next.js", "Server Actions", "Supabase", "MVP"],
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('taskku_theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ThemedToaster />
      </body>
    </html>
  );
}

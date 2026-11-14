import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSS Prioritisasi CCTV Jatinangor",
  description:
    "Sistem pendukung keputusan AHP-TOPSIS untuk prioritisasi penempatan CCTV di permukiman mahasiswa Jatinangor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-ground text-ink antialiased">{children}</body>
    </html>
  );
}

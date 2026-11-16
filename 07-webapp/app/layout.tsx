import type { Metadata } from "next";
import "./globals.css";
import { DSSProvider } from "../lib/store";
import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "SiPrioCCTV Jatinangor — DSS Prioritisasi Penempatan CCTV",
  description:
    "Sistem pendukung keputusan multi-stakeholder AHP-TOPSIS untuk prioritisasi penempatan CCTV di permukiman mahasiswa Jatinangor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F3F5F4] text-[#14201F] antialiased flex flex-row">
        <DSSProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto min-h-screen p-8 lg:p-10">
            {children}
          </main>
        </DSSProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
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
      <body className="min-h-screen bg-[#F3F5F4] text-[#14201F] antialiased flex flex-col lg:flex-row">
        <DSSProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 w-full min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10">
            {children}
          </main>
        </DSSProvider>
      </body>
    </html>
  );
}

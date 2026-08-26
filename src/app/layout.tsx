import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toast } from "@/components/Toast";
import { TeamProvider } from "@/contexts/TeamContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oso Football Lab",
  description: "Football Team Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-oso-grafete`}>
        <TeamProvider>
          <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F7F8FA]">
              {children}
            </main>
            <Toast />
          </div>
        </TeamProvider>
      </body>
    </html>
  );
}

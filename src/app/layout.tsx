import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthWrapper } from "@/components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coach Tracker Dashboard",
  description: "Football Team Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen flex`}>
        <AuthWrapper>
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-950">
            {children}
          </main>
        </AuthWrapper>
      </body>
    </html>
  );
}

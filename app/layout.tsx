import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { RenderHorizontal, RenderVertical } from "../components/rootNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tripper CMS",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-h-screen">
        <RenderHorizontal />
        <div className="flex h-[calc(100vh-60px)]">
          <RenderVertical />
          {children}
        </div>
      </body>
    </html>
  );
}

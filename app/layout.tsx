import "./globals.css";
import type { Metadata, Viewport } from "next";
import prisma from "@/libs/prisma";
import { createClient } from '@/utils/supabase/server'
import { RenderHorizontal, RenderVertical } from "../components/rootNav";

export const metadata: Metadata = {
  title: "FlexType",
  description: "CMS based on Serverless",
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

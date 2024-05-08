import "./globals.css";
import type { Metadata, Viewport } from "next";
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
  const loginUserData = (await createClient().auth.getUser()).data
  let loginUserAvatar: string = '/icon.png'
  if (loginUserData.user !== null) {
    const userId = loginUserData.user?.id
    const userData = await prisma.user.findUnique({ where: { uid: userId } })
    loginUserAvatar = userData.image;
  } else {
    loginUserAvatar = '/icon.png';
  }
  return (
    <html lang="en">
      <body className="max-w-full">
        <RenderHorizontal loginUserAvatar={loginUserAvatar} loginUser={loginUserData} />
        <div className="flex gap-4 h-screen ">
          <RenderVertical loginUserAvatar={loginUserAvatar} loginUser={loginUserData} />
          <div className="pt-14 md:pt-0 overflow-y-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}

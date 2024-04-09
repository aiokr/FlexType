import "./globals.css";
import type { Metadata, Viewport } from "next";
import { auth } from "auth"
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
  const session: any = await auth()
  let loginUserAvatar: string = '/icon.png'
  if (session) {
    loginUserAvatar = await session.user.image
  } else {
    loginUserAvatar = '/icon.png';
  }
  return (
    <html lang="en">
      <body className="max-w-full">
        <RenderHorizontal loginUserAvatar={loginUserAvatar} />
        <div className="flex gap-4 h-[calc(100vh-60px)] md:h-full ">
          <RenderVertical loginUserAvatar={loginUserAvatar} />
          <div className="pt-14 md:pt-0">{children}</div>
        </div>
      </body>
    </html>
  );
}

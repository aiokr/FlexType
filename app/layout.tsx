import './globals.css'
import type {Metadata, Viewport} from 'next'
import {AntdRegistry} from '@ant-design/nextjs-registry'
import prisma from '@/libs/prisma'
import {createClient} from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'FlexType',
  description: 'CMS based on Serverless'
}

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({children}: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}

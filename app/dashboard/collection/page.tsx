import Link from 'next/link'
import {Breadcrumb} from 'antd'
import prisma from '@/libs/prisma'
import {createClient} from '@/utils/supabase/server'
import {CollectionTable} from './collectionClient'

const breadcrumbItem = [
  {
    title: '首页',
    href: '/'
  },
  {
    title: '仪表盘',
    href: '/dashboard'
  },
  {
    title: '内容集',
    href: '/dashboard/collection'
  }
]

export default async function DraftPaperPage() {
  const collectionItem = await prisma.collection.findMany({
    include: {
      authorizedUser: {
        include: {
          authorizedUser: true // 包含授权用户的信息
        }
      }
    }
  })

  const supabase = createClient()
  const authData = await supabase.auth.getUser()
  const userData = await prisma.user.findMany()
  return (
    <div className="mx-auto px-2 md:px-0 pt-4">
      <Breadcrumb items={breadcrumbItem} className="inline-block text-xs" />
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">内容集</div>
      <CollectionTable data={collectionItem} userData={userData} />
    </div>
  )
}

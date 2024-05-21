import Link from 'next/link'
import {Breadcrumb} from 'antd'
import prisma from '@/libs/prisma'
import {CreateNewPost, PostTable} from './postClient'

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
    title: '文章',
    href: '/dashboard/post'
  }
]

export default async function DraftPaperPage() {
  const postItem = await prisma.post.findMany()
  return (
    <div className="mx-auto px-2 md:px-0 pt-4">
      <Breadcrumb items={breadcrumbItem} className="text-xs" />
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">文章</div>
      <CreateNewPost />
      <PostTable data={postItem} />
    </div>
  )
}

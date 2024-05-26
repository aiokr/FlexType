import Link from 'next/link'
import {Breadcrumb} from 'antd'
import prisma from '@/libs/prisma'
import {CreateNewPost, PostTable} from './postClient'

export default async function DraftPaperPage({params}: {params: {coll: string}}) {
  const collName =
    params.coll === 'all'
      ? '所有内容集'
      : (
          await prisma.collection.findUnique({
            where: {
              slug: params.coll
            }
          })
        ).name

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
      title: `${collName}`,
      href: `/dashboard/${params.coll}`
    },
    {
      title: '文章',
      href: `/dashboard/${params.coll}/post`
    }
  ]

  const postItem = (await prisma.post.findMany()).filter(params.coll === 'all' ? (post) => post : (post) => post.collectionSlug === params.coll)

  return (
    <div className="mx-auto px-2 md:px-0 pt-4">
      <Breadcrumb items={breadcrumbItem} className="inline-block text-xs" />
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">文章</div>
      <CreateNewPost />
      <PostTable data={postItem} />
    </div>
  )
}

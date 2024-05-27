import Link from 'next/link'
import {Breadcrumb} from 'antd'
import prisma from '@/libs/prisma'
import {createClient} from '@/utils/supabase/server'
import {CreateNewPost, PostTable} from './postClient'

export default async function DraftPaperPage({params}: {params: {coll: string}}) {
  // 获取用户信息
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()
  const userData = await prisma.user.findUnique({
    where: {uid: data.user?.id},
    include: {
      post: true,
      collection: true
    }
  })

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

  // 获取所有内容集
  let collectionItem = await prisma.collection.findMany({
    include: {
      authorizedUser: {
        include: {
          authorizedUser: true // 包含授权用户的信息
        }
      },
      post: true,
      photo: true
    }
  })

  collectionItem = collectionItem.filter((item: any) => {
    return item.adminId === userData.id || item.authorizedUser.some((user: any) => user.authorizedUser.id === userData.id)
  })

  const breadcrumbItem = [
    {title: '首页', href: '/'},
    {title: '仪表盘', href: '/dashboard'},
    {title: `${collName}`, href: `/dashboard/${params.coll}`},
    {title: '文章', href: `/dashboard/${params.coll}/post`}
  ]

  const postItem = (await prisma.post.findMany()).filter(params.coll === 'all' ? (post) => post : (post) => post.collectionSlug === params.coll)

  return (
    <div className="mx-auto px-2 md:px-0 pt-4">
      <Breadcrumb items={breadcrumbItem} className="inline-block text-xs" />
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">文章</div>
      <CreateNewPost />
      <PostTable data={postItem} collectionItem={collectionItem} />
    </div>
  )
}

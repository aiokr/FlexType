import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import {Card, Col, Breadcrumb, Statistic} from 'antd'
import prisma from '@/libs/prisma'

export default async function CollecntionHomePage({params}: {params: {coll: string}}) {
  const collName =
    params.coll === 'all'
      ? '所有内容集'
      : await prisma.collection
          .findUnique({
            where: {
              slug: params.coll
            }
          })
          .then((res) => res.name)

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
    }
  ]

  let collectionData = null

  // 获取内容集数据
  if (params.coll === 'all') {
    // 如果是所有内容集，获取所有内容集
    let preCollection = await prisma.collection.findMany({
      include: {
        post: true,
        photo: true,
        authorizedUser: {
          include: {
            authorizedUser: true
          }
        }
      }
    })

    // 合并每个内容集的数据
    collectionData = {
      post: preCollection.map((item) => item.post).flat(),
      photo: preCollection.map((item) => item.photo).flat(),
      authorizedUser: preCollection.map((item) => item.authorizedUser).flat()
    }
  } else {
    // 如果是单个内容集
    collectionData = await prisma.collection.findUnique({
      where: {
        slug: params.coll
      },
      include: {
        authorizedUser: {
          include: {
            authorizedUser: true
          }
        },
        post: true,
        photo: true
      }
    })
  }

  // console.log(collectionData)

  return (
    <div className="pt-14 md:pt-0 mt-4 w-full">
      <Breadcrumb items={breadcrumbItem} className="inline-block text-xs" />
      <div className="container max-w-[1200px] mx-auto">
        <div className="pt-12 text-3xl font-bold">{collName}</div>
        <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <Card bordered={false}>
            <Statistic title="Post" value={collectionData.post.length} valueStyle={{color: '#222831'}} />
          </Card>
          <Card bordered={false}>
            <Statistic title="Photo Flow" value={collectionData.photo.length} valueStyle={{color: '#222831'}} />
          </Card>
          <Card bordered={false}>
            <Statistic title="User" value={collectionData.authorizedUser.length + 1} valueStyle={{color: '#222831'}} />
          </Card>
        </section>
      </div>
    </div>
  )
}

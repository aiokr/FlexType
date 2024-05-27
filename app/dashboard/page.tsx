import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'
import prisma from '@/libs/prisma'
import {Statistic} from 'antd'
import Link from 'next/link'
import {IconGithub} from '@/assets/icons'

export default async function Dashboard() {
  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()
  // console.log(data)

  const userData = await prisma.user.findUnique({
    where: {uid: data.user?.id},
    include: {
      post: true,
      collection: true,
      Assets: true
    }
  }) // 数据库 User 表中的信息

  let sumAssetsSize = userData.Assets.reduce((accumulator, current) => accumulator + current.size, 0)
  let assetsSizeMB = (sumAssetsSize / 1024 / 1024).toFixed(2)

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

  // console.log(collectionItem)

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="pt-14 md:pt-0 overflow-y-auto mt-4 w-full">
      <div className="container mx-auto">
        <div className="pt-12 text-3xl font-bold text-main">Welcome, {userData.name}</div>
        <section className="w-full grid grid-cols-2 md:grid-cols-4 pt-6 gap-4">
          <Link href={'/dashboard/all/post'} className="w-full h-full">
            <div className="border border-zinc-200 rounded-xl w-full h-36 p-4">
              <Statistic title="Posts" value={userData?.post?.length} />
            </div>
          </Link>
          <Link href={'/dashboard/all/post'} className="w-full h-full">
            <div className="border border-zinc-200 rounded-xl w-full h-36 p-4">
              <Statistic title="Assets" value={userData?.Assets?.length} />
            </div>
          </Link>
          <Link href={'/dashboard/all/post'} className="w-full h-full">
            <div className="border border-zinc-200 rounded-xl w-full h-36 p-4">
              <Statistic title="Assets Size" value={assetsSizeMB} suffix="MB" />
            </div>
          </Link>
        </section>
        <Link href={'/dashboard/all'} target="_blank">
          <div className="pt-8 text-2xl font-bold">Your Collections</div>
        </Link>
        <div className="flex flex-col gap-4 pt-6">
          {collectionItem?.map((collection) => (
            <Link key={collection.id} target="_blank" href={'/dashboard/' + collection.slug} className="w-full h-full">
              <div className="border border-zinc-100 hover:border-zinc-400 transition-all rounded-xl w-full h-36 p-4">
                {collection.name}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link target="_blank" href={'/dashboard/' + collection.slug + '/post'} className="block w-full h-full">
                    <Statistic title="Posts" value={collection?.post?.length} />
                  </Link>
                  <Link target="_blank" href={'/dashboard/' + collection.slug + '/photo'} className="block w-full h-full">
                    <Statistic title="Photos" value={collection?.photo?.length} />
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="pt-8 text-2xl font-bold">Fast Links</div>
        <div className="flex gap-4 pt-6">
          <Link href="/dashboard/settings" target="_blank" className="block btn">
            Settings
          </Link>
          <Link href="https://supabase.com/dashboard" target="_blank" className="block btn">
            Supabase
          </Link>
          <Link href="https://ant.design/components/overview-cn" target="_blank" className="block btn">
            Ant Design
          </Link>
        </div>
        <div className="pt-16 pb-8 flex items-center justify-center">
          <span className="border-zinc-100 border w-full pr-auto" />
          <Link
            href="https://github.com/aiokr/flextype"
            target="_blank"
            className="text-sm px-12 whitespace-nowrap text-zinc-400 hover:text-main transition-all"
          >
            FlexType by aiokr
          </Link>
          <span className="border-zinc-100 border w-full pl-auto" />
        </div>
      </div>
    </div>
  )
}

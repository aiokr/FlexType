import prisma from '@/libs/prisma'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import {RootNav} from '@/components/rootNav'
import {Breadcrumb, Layout, Menu} from 'antd'
import {Header, Content} from 'antd/es/layout/layout'

//TODO 新增用户的流程还没有写

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser() // Supabase Auth 中的用户信息

  if (error || !data?.user) {
    redirect('/login')
  }

  const loginUserData = (await createClient().auth.getUser()).data
  const userData = await prisma.user.findUnique({where: {uid: data.user?.id}}) // 数据库 User 表中的信息
  let loginUserAvatar: string = '/icon.png'

  if (loginUserData.user !== null) {
    loginUserAvatar = userData.image || loginUserData.user.user_metadata.avatar_url || '/icon.png'
  } else {
    loginUserAvatar = '/icon.png'
  }

  // 获取所有内容集
  const collectionItem = await prisma.collection.findMany({
    include: {
      authorizedUser: {
        include: {
          authorizedUser: true // 包含授权用户的信息
        }
      }
    }
  })

  return <>{children}</>
}

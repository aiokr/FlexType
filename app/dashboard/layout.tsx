import prisma from '@/libs/prisma'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import {RootNav} from '@/components/rootNav'
import {Breadcrumb, Layout, Menu, theme} from 'antd'

import {Header, Content} from 'antd/es/layout/layout'

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()
  const loginUserData = (await createClient().auth.getUser()).data
  const userData = await prisma.user.findUnique({where: {uid: data.user?.id}})
  let loginUserAvatar: string = '/icon.png'
  if (loginUserData.user !== null) {
    const userId = loginUserData.user?.id
    const userData = await prisma.user.findUnique({where: {uid: userId}})
    loginUserAvatar = userData.image
  } else {
    loginUserAvatar = '/icon.png'
  }

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      <RootNav loginUserAvatar={loginUserAvatar} data={data} userData={userData} />
      <Layout>
        <Content className="px-4">{children}</Content>
      </Layout>
    </Layout>
  )
}

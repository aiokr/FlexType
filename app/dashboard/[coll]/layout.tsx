import prisma from '@/libs/prisma'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import {RootNav} from '@/components/rootNav'
import {Breadcrumb, Layout, Menu} from 'antd'
import {Header, Content} from 'antd/es/layout/layout'

export default async function CollectionLayout({children, params}: {children: React.ReactNode; params: {coll: string}}) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser() // Supabase Auth 中的用户信息

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

  // 当前用户管理的内容集
  const adminCollection = collectionItem.filter((item: any) => {
    return item.adminId === userData.id
  })

  // 当前用户有权限的内容集
  const authorizedCollection = collectionItem.filter((item: any) => {
    return item.authorizedUser.some((user: any) => user.authorizedUserId === userData.id)
  })

  // 获取当前内容集 slug
  const currentCollectionSlug = params.coll

  // 获取当前内容集
  const currentCollection = collectionItem.filter((item: any) => {
    return item.slug === currentCollectionSlug
  })

  // 合并
  authorizedCollection.push(...adminCollection)

  return (
    <Layout style={{minHeight: '100vh'}}>
      <RootNav
        loginUserAvatar={loginUserAvatar}
        data={data}
        userData={userData}
        collectionItem={authorizedCollection}
        currentCollection={currentCollection}
        style={{minHeight: '100vh'}}
      />
      <Layout>
        <Content className="px-4">{children}</Content>
      </Layout>
    </Layout>
  )
}

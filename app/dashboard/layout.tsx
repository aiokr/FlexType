import prisma from '@/libs/prisma'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import Link from 'next/link'

//TODO 新增用户的流程还没有写

export default async function DashboardLayout(props: {children: React.ReactNode; modal: React.ReactNode}) {
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

  return (
    <>
      {props.children}
      {props.modal}
      <div id="modal-root" />
    </>
  )
}

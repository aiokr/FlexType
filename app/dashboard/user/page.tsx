import { redirect } from 'next/navigation'
import prisma from '@/libs/prisma'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function userManagementPage() {

  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const userId = data.user.id
  const userData = await prisma.user.findUnique({ where: { uid: userId } })

  
  const userEmail = data.user.email
  const userAvatar = data.user.user_metadata.avatar_url

  return (
    <div className='container max-w-[100vw] mx-auto '>
      <div className='text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3 px-2 md:px-0'>
        <Link href={'/'}>首页</Link><> / </>
        <Link href={'/dashboard'}>仪表盘</Link><> / </>
        <Link href={'/dashboard/user'}>用户管理</Link>
      </div>
      <div className='text-2xl font-bold pt-2 py-4 md:py-4 px-2 md:px-0'>用户管理</div>
      <h2>user data in supabase auth</h2>
      {JSON.stringify(data)}
      <h2>user data in database public</h2>
      <div>{JSON.stringify(userData)}</div>
    </div>
  )
}
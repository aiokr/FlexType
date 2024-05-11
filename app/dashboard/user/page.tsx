import {redirect} from 'next/navigation'
import prisma from '@/libs/prisma'
import {createClient} from '@/utils/supabase/server'
import Link from 'next/link'
import {LinkToGithub, UnlinkToGithub} from '@/app/dashboard/user/linkToGithub'

export default async function userManagementPage() {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()
  const userId = data.user?.id || ''
  const userData = await prisma.user.findUnique({where: {uid: userId}})

  const userEmail = data.user?.email || ''
  const userAvatar = data.user?.user_metadata.avatar_url || ''

  return (
    <div className="container max-w-[100vw] mx-auto ">
      <div className="text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3 px-2 md:px-0">
        <Link href={'/'}>首页</Link>
        <> / </>
        <Link href={'/dashboard'}>仪表盘</Link>
        <> / </>
        <Link href={'/dashboard/user'}>用户管理</Link>
      </div>
      <div className="text-2xl font-bold pt-2 py-4 md:py-4 px-2 md:px-0">用户管理</div>
      <h2 className="text-xl font-bold py-2">user data in supabase auth</h2>
      {JSON.stringify(data)}
      <h2 className="text-xl font-bold py-2">user data in database public</h2>
      <div>{JSON.stringify(userData)}</div>
      <h2 className="text-xl font-bold py-2">管理第三方账户</h2>
      <div className="container max-w-[400px] flex flex-col gap-2">
        {data.user.app_metadata.providers.includes('github') ? (
          <div className="flex justify-between text-sm items-center">
            已绑定 GitHub 账号: {data.user.identities.find((identity) => identity.provider === 'github')?.identity_data.email}
            <UnlinkToGithub />
          </div>
        ) : (
          <div className="flex justify-between text-sm items-center">
            未绑定 GitHub 账号
            <LinkToGithub />
          </div>
        )}
      </div>
    </div>
  )
}

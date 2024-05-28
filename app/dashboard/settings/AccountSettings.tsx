import Image from 'next/image'
import {createClient} from '@/utils/supabase/server'
import prisma from '@/libs/prisma'
import {LinkToGithub, UnlinkToGithub} from '@/app/dashboard/settings/LinkIdentity'
import {AccountClient} from './AccountClient'

export default async function AccountSettings() {
  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()
  const userData = await prisma.user.findUnique({where: {uid: data.user?.id}})

  const userName = userData?.name || ''
  const userEmail = data.user?.email || ''
  const userAvatar = userData?.image || data.user?.user_metadata.avatar_url || ''
  const userRole = userData?.role || ''

  return (
    <>
      <div className="p-4 flex items-center justify-between rounded border border-zinc-200 mb-4">
        <div className="flex gap-4">
          <Image className="rounded-full" src={userAvatar} alt={userEmail} width={64} height={64} unoptimized />
          <div className="flex flex-col justify-between pl-[auto]">
            <div className="text-2xl">
              {userName} ({userRole})
            </div>
            <div>{userEmail}</div>
          </div>
        </div>
        <AccountClient data={data} userData={userData} />
      </div>
      <div className="container p-4 flex flex-col gap-2 border border-zinc-200 rounded">
        {data.user.app_metadata.providers.includes('github') ? (
          <div className="flex justify-between text-sm items-center">
            已绑定 GitHub 账号：{data.user.identities.find((identity) => identity.provider === 'github')?.identity_data.email}
            <UnlinkToGithub />
          </div>
        ) : (
          <div className="flex justify-between text-sm items-center">
            GitHub：未绑定
            <LinkToGithub />
          </div>
        )}
      </div>
    </>
  )
}

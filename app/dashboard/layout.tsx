import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { RenderHorizontal, RenderVertical } from "@/components/rootNav";

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const loginUserData = (await createClient().auth.getUser()).data
  let loginUserAvatar: string = '/icon.png'
  if (loginUserData.user !== null) {
    const userId = loginUserData.user?.id
    const userData = await prisma.user.findUnique({ where: { uid: userId } })
    loginUserAvatar = userData.image;
  } else {
    loginUserAvatar = '/icon.png';
  }

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <>
      <RenderHorizontal loginUserAvatar={loginUserAvatar} loginUser={loginUserData} />
      <div className="flex gap-4 h-screen ">
        <RenderVertical loginUserAvatar={loginUserAvatar} loginUser={loginUserData} />
        <div className="pt-14 md:pt-0 overflow-y-auto mt-4">
          {children}
        </div>
      </div>
    </>
  )
}
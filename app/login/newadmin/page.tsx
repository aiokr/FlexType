import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/libs/prisma'

export default async function PrivatePage() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const userId = data.user.id // 当前用户ID
  const userRole = (await prisma.user.findUnique({ where: { uid: userId } }))?.role // 当前用户角色

  // 查找是否存在管理员
  const adminUsers = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  })

  const isAdmin = adminUsers.length

  // 如果未登录，重定向到登录页面
  if (error || !data?.user) {
    redirect('/login')
  }

  // 如果没有管理员，创建管理员
  else if (isAdmin === 0) {
    console.log('uid: ' + data.user.id)

    const addAdmin = await prisma.user.create({
      data: {
        uid: data.user.id,
        name: data.user.user_metadata.full_name || data.user.email || 'No Name',
        email: data.user.email,
        image: data.user.user_metadata.avatar_url || '',
        role: 'ADMIN'
      }
    })
    console.log(addAdmin)
  }

  // 如果已经存在管理员
  else {
    return (
      <p>Hello {data.user.email} {userRole}</p>
    )
  }

}
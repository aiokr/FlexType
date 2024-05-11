import {auth} from 'auth'
import prisma from '@/libs/prisma'
import {redirect} from 'next/navigation'
import Link from 'next/link'

export default async function dashboard() {
  const session: any = await auth()
  const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  const loginUserAvatar: string = session.user.image

  // 查是否已存在管理员账户
  const existingUser = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  })

  if (existingUser.length === 0) {
    // 管理员账户不存在，初始化整个系统
    return (
      <div>
        <div className="container mx-auto">
          <div className="pt-12 text-3xl text-center">初始化系统</div>
          <div className="w-96 h-96 my-12 mx-auto p-8 flex flex-col gap-2 shadow">
            <div className="text-slate-800">User Name</div>
            <div className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm">{loginUserName}</div>
            <div className="text-slate-800">User Email</div>
            <div className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm">{loginUserEmail}</div>
            <div className="text-slate-800">请检查以上信息是否正确</div>
            <Link
              href="/signup/newAdmin"
              className="text-sm text-center leading-5 w-full py-2 px-3 text-white bg-indigo-500 rounded-lg shadow-sm hover:shadow-lg transition-all"
            >
              创建管理员账户
            </Link>
          </div>
        </div>
      </div>
    )
  } else {
    // 管理员账户存在，新建普通用户
    return (
      <div className="container mx-auto">
        <div className="pt-12 text-3xl text-center">管理员账户已存在，请使用管理员账户登录</div>
      </div>
    )
  }
}

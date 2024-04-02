import { auth } from "auth"
import prisma from '@/libs/prisma'

export default async function dashboard() {
  const session: any = await auth()
  const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  const loginUserAvatar: string = session.user.image

  const existingUser = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  });

  if (existingUser.length === 0) {
    // 用户不存在，处理该情况
    console.log("不存在管理员账户，初始化系统");
    return (
      <div>
        {session ? (JSON.stringify(session, null, 2)) : "no login"}
        <div className="container mx-auto">
          <div className="pt-12 text-3xl text-center">初始化账户</div>
          <div className="w-96 h-96 my-12 mx-auto p-8 flex flex-col gap-2 shadow">
            <div className="text-slate-800">User Name</div>
            <div className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm">{loginUserName}</div>
            <div className="text-slate-800">User Email</div>
            <div className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm">{loginUserEmail}</div>
            <div className="text-slate-800">请检查以上信息是否正确</div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        {session ? (JSON.stringify(session, null, 2)) : "no login"}
      </div>
    )
  }
}
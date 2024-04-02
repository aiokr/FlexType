import { auth } from "auth"
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'


export default async function dashboard() {
  const session: any = await auth()

  const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  const loginUserAvatar: string = session.user.image

  const users = await prisma.user.findMany()

  console.log(users)

  const existingUser = await prisma.user.findMany({
    where: {
      email: loginUserEmail
    }
  });

  if (existingUser.length === 0) {
    // 用户不存在，处理该情况
    console.log("该用户不存在，请注册新账号或创建新用户记录。");
    redirect(`/signup`);;
  } else {
    return (
      <div>
        {session ? (JSON.stringify(session, null, 2)) : "no login"}
      </div>
    )
  }
}
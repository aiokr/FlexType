import { auth } from "auth"
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
  const session: any = await auth()
  const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  const loginUserAvatar: string = session.user.image
  console.log(loginUserEmail)

  // 检查是否已存在管理员账户
  const existingUser = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      }
    });

  const authedEmails = process.env.AUTHORIZED_EMAILS || ''; // 获取环境变量中的授权邮箱列表
  const authorizedEmailsArray = authedEmails.split(',').map(email => email.trim()); // 将以逗号分隔的字符串转换为字符串数组
  const isAuthorized = authorizedEmailsArray.includes(loginUserEmail); // 检查登录用户的邮箱是否在授权邮箱列表中

  if (isAuthorized && existingUser.length !== 0) { // 有管理员账户, 且管理员账户属于环境变量中配置的授权邮箱
    return (
      <div>
        {children}
      </div>
    );
  } else if (existingUser.length === 0) { // 无管理员账户，引导用户初始化管理员账户
    console.log("该用户不存在，请注册新账号或创建新用户记录。");
    redirect(`/signup`);;
  } else {
  }
}
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'
import AuthSession from '@/components/getAuthSession'

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
  const session = await AuthSession()
  // const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  // const loginUserAvatar: string = session.user.image
  // console.log(loginUserEmail)

  // 检查是否已存在管理员账户
  const existingUser = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  });

  const authedEmails = process.env.AUTHORIZED_EMAILS || ''; // 获取环境变量中的授权邮箱列表
  const authorizedEmailsArray = authedEmails.split(',').map(email => email.trim()); // 将以逗号分隔的字符串转换为字符串数组
  const isAuthorized = authorizedEmailsArray.includes(loginUserEmail); // 检查登录用户的邮箱是否在授权邮箱列表中

  // 有管理员账户, 且管理员账户属于环境变量中配置的授权邮箱
  if (isAuthorized && existingUser.length !== 0) {
    return (
      <div className="dashboard-container">
        {children}
      </div>
    );
  }
  // 无管理员账户，引导用户初始化管理员账户
  else if (existingUser.length === 0) {
    console.log("管理员账户未创建，初始化管理员账户");
    redirect(`/signup`);;
  } 
  // 有管理员账户，但管理员账户不属于环境变量中配置的授权邮箱
  else {
  }
}
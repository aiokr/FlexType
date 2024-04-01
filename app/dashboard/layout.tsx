import { auth } from "auth"
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
  const session: any = await auth()
  const loginUserEmail: string = session.user.email
  console.log(loginUserEmail)
  console.log(loginUserEmail)
  const authedEmails = process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS || ''; // 获取环境变量的值
  const authorizedEmailsArray = authedEmails.split(',').map(email => email.trim()); // 将以逗号分隔的字符串转换为字符串数组
  const isAuthorized = authorizedEmailsArray.includes(loginUserEmail); // 检查登录用户的邮箱是否在授权邮箱列表中
  if (isAuthorized) {
    return (
      <div>
        {children}
      </div>
    );
  } else {
    redirect(`/`)
  }
}
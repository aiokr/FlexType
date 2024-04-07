import { auth } from "auth"
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

export default async function NewAdminUser() {

  const prisma = new PrismaClient();
  const session: any = await auth()
  const loginUserName: string = session.user.name
  const loginUserEmail: string = session.user.email
  const loginUserAvatar: string = session.user.image
  const authedEmails = process.env.AUTHORIZED_EMAILS || ''; // 获取环境变量中的授权邮箱列表
  const authorizedEmailsArray = authedEmails.split(',').map(email => email.trim()); // 将以逗号分隔的字符串转换为字符串数组
  const isAuthorized = authorizedEmailsArray.includes(loginUserEmail); // 检查登录用户的邮箱是否在授权邮箱列表中

  // 检查是否已存在管理员账户
  const existingAdminUser = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  });

  // 无管理员账户，且管理员账户属于环境变量中配置的授权邮箱，初始化管理员账户
  if (isAuthorized && existingAdminUser.length === 0) {
    const newUser = await prisma.user.create({
      data: {
        name: loginUserName,
        email: loginUserEmail,
        image: loginUserAvatar,
        role: 'ADMIN'
      }
    });
  };

  // 检查是否已存在管理员账户
  const existingAdminUserResult = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  });

  console.log(existingAdminUserResult)

  redirect(`/signup/ok`)
}
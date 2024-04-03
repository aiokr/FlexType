import { auth } from "auth"
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'

export default async function dashboard() {
  const session: any = await auth()
  // const users = await prisma.user.findMany()
  // console.log(users)
  return (
    <div>
      {session ? (JSON.stringify(session, null, 2)) : "no login"}
    </div>
  )

}
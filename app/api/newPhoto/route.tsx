import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'

export async function PUT(req: any, res: any) {
  const session = await AuthSession()
  const userName = session.user.name
  const existingUser = await prisma.user.findMany({
    where: {
      name: userName,
      role: 'ADMIN' || 'EDITOR',
    }
  });
  const userID = existingUser[0].id

  if (session && existingUser.length !== 0) {
  
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
import {refreshFileList} from '@/libs/upyunFilesOperator'
import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'

export async function GET() {
  const session = await AuthSession()
  const userMail = session.user.email
  const existingUser = await prisma.user.findMany({
    where: {
      email: userMail,
      role: {
        in: ['ADMIN', 'EDITOR']
      }
    }
  })

  if (session && existingUser.length !== 0) {
    const response = await refreshFileList()

    if (response) {
      return Response.json(response)
    }
  } else {
    return Response.json({message: 'Not authenticated'}, {status: 403})
  }
}

import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'
import { errorToJSON } from 'next/dist/server/render';

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
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
    const delItemId = params.slug.toString()

    const delFlowItem = await prisma.photo.delete({
      where: {
        id: delItemId
      }
    })

    return Response.json({ message: "Success Deleted Item" }, { status: 200 })

  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
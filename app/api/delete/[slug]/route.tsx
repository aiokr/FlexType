import { deleteFileFromUpyun } from "@/libs/upyunFilesOperator"
import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'

type params = {
  assetId: number
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {

  const session = await AuthSession()
  const userName = session.user.name
  const existingUser = await prisma.user.findMany({
    where: {
      name: userName,
      role: 'ADMIN' || 'EDITOR',
    }
  });

  if (session && existingUser.length !== 0) {
  
    const delAssetsId = parseInt(params.slug)
    const response = await deleteFileFromUpyun(delAssetsId)

    if (!response) {
      return Response.json({ message: "Delete failed No response" }, { status: 500 })
    } else if (response.deleteFile.status == 200) {
      return Response.json({ message: "Delete success" }, { status: 200 })
    } else if (response.deleteFile.status) {
      return Response.json({ message: response.deleteFile.statusText }, { status: response.deleteFile.status })
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
import { deleteFileFromUpyun } from "@/libs/upyunFilesOperator"
import { createClient } from '@/utils/supabase/server'
import prisma from '@/libs/prisma'

type params = {
  assetId: number
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {

  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const userId = data.user.id
  const existingUser = await prisma.user.findMany({
    where: {
      uid: userId,
      role: 'ADMIN' || 'EDITOR',
    }
  });

  if (data && existingUser.length !== 0) {

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
import { getAssetsExif, getAssetsOtherInfo } from "@/libs/upyunFilesOperator"
import { createClient } from '@/utils/supabase/server'
import prisma from '@/libs/prisma'

export async function GET(request: Request, { params }: { params: { slug: string } }) {

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
    const assetId: number = parseInt(params.slug)
    const response = await getAssetsExif(assetId)
    const getOtherInfo = await getAssetsOtherInfo(assetId)

    if (response && getOtherInfo) {
      const resContent = JSON.parse(response)
      console.log(resContent)
      return Response.json(resContent)
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
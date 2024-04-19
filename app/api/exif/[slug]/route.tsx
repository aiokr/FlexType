import { getAssetsExif } from "@/libs/upyunFilesOperator"
import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'


export async function GET(request: Request, { params }: { params: { slug: string } }) {

  const session = await AuthSession()
  const userName = session.user.name
  const existingUser = await prisma.user.findMany({
    where: {
      name: userName,
      role: 'ADMIN' || 'EDITOR',
    }
  });

  if (session && existingUser.length !== 0) {
    const assetId: number = parseInt(params.slug)
    const response = await getAssetsExif(assetId)

    if (response) {
      return Response.json(JSON.stringify(response))
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
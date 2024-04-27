import { getAssetsExif, getAssetsOtherInfo } from "@/libs/upyunFilesOperator"
import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'

export async function GET(request: Request, { params }: { params: { slug: string } }) {

  const session = await AuthSession()
  const userName = session.user.name
  const userMail = session.user.email
  const existingUser = await prisma.user.findMany({
    where: {
      email: userMail,
      role: {
        in: ['ADMIN', 'EDITOR'],
      },
    }
  });

  if (session && existingUser.length !== 0) {
    const assetId: number = parseInt(params.slug)
    const response = await getAssetsExif(assetId)
    const getOtherInfo = await getAssetsOtherInfo(assetId)

    if (response && getOtherInfo) {
      const resContent = JSON.parse(response)
      console.log(resContent)
      return Response.json(resContent)
    }
  } else {
    console.log('USERNAME - ' + userName)
    console.log('existingUser - ' + existingUser.toString() + existingUser[0].role)
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
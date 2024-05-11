import {createClient} from '@/utils/supabase/server'
import prisma from '@/libs/prisma'

export async function PUT(req: any, res: any) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()
  const userId = data.user.id
  const existingUser = await prisma.user.findMany({
    where: {
      uid: userId,
      role: 'ADMIN' || 'EDITOR'
    }
  })

  if (data && existingUser.length !== 0) {
    const flowItemData: any = await req.json()
    // console.log(flowItemData)
    let info = typeof flowItemData.info === 'object' ? {...flowItemData.info} : {}
    for (const [key, value] of Object.entries(flowItemData)) {
      if (!['title', 'assetId', 'id', 'DateTimeOriginal', 'info'].includes(key) && value !== null) {
        info[key] = value
      }
    }

    let assertAlreadyExisting: boolean = null

    // check if assetId already exists
    const findAlreadyExistingAssert = await prisma.photo.findMany({
      where: {
        assetId: flowItemData.assetId
      }
    })
    if (findAlreadyExistingAssert.length !== 0) {
      assertAlreadyExisting = true
    }

    if (flowItemData.id !== null) {
      // 项目已存在，修改项目
      const updateFlowItem = await prisma.photo.update({
        where: {
          id: flowItemData.id
        },
        data: {
          assetId: parseInt(flowItemData.assetId),
          title: flowItemData.title,
          info: info
        }
      })
      return Response.json({message: `Success Update Item`}, {status: 200})
    } else if (flowItemData.id == null && !assertAlreadyExisting) {
      // 项目不存在，且assetId不存在，创建项目
      const writeFlowItem = await prisma.photo.create({
        data: {
          assetId: parseInt(flowItemData.assetId),
          title: flowItemData.title,
          info: info
        }
      })
      return Response.json({message: `Success Create Item`}, {status: 200})
    } else if (flowItemData.id == null && assertAlreadyExisting) {
      return Response.json({message: 'AssetId already exists'}, {status: 400})
    } else {
      return Response.json({message: 'Other error'}, {status: 400})
    }
  } else {
    return Response.json({message: 'Not authenticated'}, {status: 403})
  }
}

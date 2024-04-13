import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'
import { errorToJSON } from 'next/dist/server/render';

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
    const flowItemData: any = await req.json()
    console.log(flowItemData)
    const info = Object.entries(flowItemData).reduce((accumulator: any, [key, value]) => {
      if (value !== null) { // 只有当值不为null时，才将键值对添加到accumulator对象中
        accumulator[key] = value;
      }
      return accumulator;
    }, {});

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

    console.log(flowItemData.id !== null, assertAlreadyExisting)
    if (flowItemData.id !== null) { // 项目已存在，修改项目
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
      return Response.json({ message: "Success Update Item" }, { status: 200 })
    } else if (flowItemData.id == null && !assertAlreadyExisting) { // 项目不存在，创建项目
      const writeFlowItem = await prisma.photo.create({
        data: {
          assetId: parseInt(flowItemData.assetId),
          title: flowItemData.title,
          info: info
        }
      })
      return Response.json({ message: "Success Create New Item" }, { status: 200 })
    } else {
      return Response.json({ message: "Other error" }, { status: 400 })
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
import prisma from '@/libs/prisma'

export async function GET(request: Request) {
  const flowData = await prisma.photo.findMany()
  if (!flowData) {
    return Response.json({ message: "No data" }, { status: 500 })
  } else if (flowData.length === 0) {
    return Response.json({ message: "No data" }, { status: 200 })
  } else {
    return Response.json(flowData, { status: 200 })
  }
}
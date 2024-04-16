import prisma from '@/libs/prisma'
import { getAllFileInDatabase } from '@/libs/upyunFilesOperator'


export async function GET(request: Request) {
  const flowData = await prisma.photo.findMany()
  const fileData = await getAllFileInDatabase()
  const combinedData = flowData.map((photo: any) => {
    let photoId = photo.id
    let assetId = photo.assetId
    let photoTitle = photo.title
    let photoUrl = fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.url)[0]
    let exif = {
      width: photo.info.overExif?.width || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.width)[0],
      height: photo.info.overExif?.height || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.height)[0],
      DateTimeOriginal: photo.info.overExif?.DateTimeOriginal || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.DateTimeOriginal)[0],
      Make: photo.info.overExif?.Make || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Make)[0],
      Model: photo.info.overExif?.Model || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Model)[0],
      LensMake: photo.info.overExif?.LensMake || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensMake)[0],
      LensModel: photo.info.overExif?.LensModel || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensModel)[0],
    }
    return {
      id: photoId,
      assetId: assetId,
      title: photoTitle,
      url: photoUrl,
      exif: exif
    }
  })


  if (!flowData) {
    return Response.json({ message: "No data" }, { status: 500 })
  } else if (flowData.length === 0) {
    return Response.json({ message: "No data" }, { status: 200 })
  } else {
    return Response.json(combinedData, { status: 200 })
  }
}
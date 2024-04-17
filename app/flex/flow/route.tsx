import prisma from '@/libs/prisma'
import { getAllFileInDatabase } from '@/libs/upyunFilesOperator'
import { NextRequest } from "next/server";
import convertDMSToDecimal from '@/libs/convertDMSToDecimal'

export async function GET(request: NextRequest) {
  const flowData = await prisma.photo.findMany()
  const fileData = await getAllFileInDatabase()
  const combinedData = flowData.map((photo: any) => {
    let photoId = photo.id
    let assetId = photo.assetId
    let photoTitle = photo.title
    let photoUrl = fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.url)[0]
    let createdAt = photo.createdAt || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.DateTimeOriginal)[0]

    let GPSLatitudeOrigin = fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.GPSLatitude)[0] || "0/1,0/1,0/1";
    let GPSLatitude = convertDMSToDecimal(GPSLatitudeOrigin);
    let GPSLongitudeOrigin = fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.GPSLongitude)[0] || "0/1,0/1,0/1";
    let GPSLongitude = convertDMSToDecimal(GPSLongitudeOrigin);

    let exif = {
      width: photo.info.overExif?.width || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.width)[0],
      height: photo.info.overExif?.height || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.height)[0],
      DateTimeOriginal: photo.info.overExif?.DateTimeOriginal || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.DateTimeOriginal)[0],
      Make: photo.info.overExif?.Make || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Make)[0],
      Model: photo.info.overExif?.Model || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Model)[0],
      LensMake: photo.info.overExif?.LensMake || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensMake)[0],
      LensModel: photo.info.overExif?.LensModel || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensModel)[0],
      ExposureTime: photo.info.overExif?.exposeTime || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.exposeTime)[0],
      FNumber: photo.info.overExif?.FNumber || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.FNumber)[0],
      ISO: photo.info.overExif?.ISOSpeedRatings || fileData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.ISOSpeedRatings)[0],
      GPSLatitude: photo.info.overExif?.GPSLatitude || GPSLatitude,
      GPSLongitude: photo.info.overExif?.GPSLongitude || GPSLongitude,
    }
    return {
      id: photoId,
      assetId: assetId,
      title: photoTitle,
      url: photoUrl,
      createdAt: createdAt,
      exif: exif
    }
  })

  const pageNum: number = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const perPage: number = parseInt(request.nextUrl.searchParams.get("per_page") || "100");
  const maxPage: number = Math.ceil(combinedData.length / perPage)

  if (!flowData || flowData.length === 0) {
    return Response.json({ message: "No data" }, { status: 500 })
  }
  else if (pageNum > maxPage) {
    return Response.json({ message: "Out of range (> maxPage)" }, { status: 500 })
  } else if (pageNum < 1) {
    return Response.json({ message: "Out of range (< 1)" }, { status: 500 })
  } else {
    return Response.json(combinedData.sort((a: any, b: any) => new Date(b.exif.DateTimeOriginal).getTime() - new Date(a.exif.DateTimeOriginal).getTime() > 0 ? 1 : -1).slice((pageNum - 1) * perPage, pageNum * perPage), { status: 200 })
  }
}
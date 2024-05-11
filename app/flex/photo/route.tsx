import prisma from '@/libs/prisma'
import {NextRequest} from 'next/server'
import convertDMSToDecimal from '@/libs/convertDMSToDecimal'

interface Info {
  rating: number
  url: string
  overExif: any
  [key: string]: any
}

export async function GET(request: NextRequest) {
  const flowItemId = request.nextUrl.searchParams.get('id')
  console.log(flowItemId)
  const flowData = await prisma.photo.findUnique({
    where: {
      id: flowItemId
    }
  })
  const assetId = flowData?.assetId
  const fileData = await prisma.assets.findUnique({
    where: {
      assetId: assetId
    }
  })

  const combinedData = () => {
    const overExif = (flowData?.info as any).overExif
    const flowItemInfo = flowData?.info as Info
    const assetData = fileData as any

    let GPSLatitudeOrigin = assetData?.GPSLatitude || '0/1,0/1,0/1,'
    let GPSLongitudeOrigin = assetData?.GPSLongitude || '0/1,0/1,0/1,'

    let GPSLatitude = convertDMSToDecimal(GPSLatitudeOrigin)
    let GPSLongitude = convertDMSToDecimal(GPSLongitudeOrigin)

    let exif = {
      width: overExif?.width || fileData?.width,
      height: overExif?.height || fileData?.height,
      DateTimeOriginal: overExif?.DateTimeOriginal || fileData?.DateTimeOriginal,
      Make: overExif?.Make || fileData?.Make,
      Model: overExif?.Model || fileData?.Model,
      LensMake: overExif?.LensMake || fileData?.LensMake,
      LensModel: overExif?.LensModel || fileData?.LensModel,
      ExposureTime: overExif?.ExposureTime || fileData?.ExposureTime,
      FNumber: overExif?.FNumber || fileData?.FNumber,
      ISO: overExif?.ISOSpeedRatings || fileData?.ISOSpeedRatings,
      GPSLatitude: overExif?.GPSLatitude || GPSLatitude,
      GPSLongitude: overExif?.GPSLongitude || GPSLongitude
    }

    let info = {
      rating: flowItemInfo.rating || null,
      mainColor: flowItemInfo.mainColor || assetData.info?.mainColor
    }

    return {
      id: flowItemId,
      assetId: assetId,
      title: flowData?.title,
      url: fileData?.url,
      createdAt: flowData?.createdAt,
      info: info,
      exif: exif
    }
  }

  return new Response(JSON.stringify(combinedData()))
}

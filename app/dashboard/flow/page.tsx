import prisma from "@/libs/prisma"
import PhotoListComponent from "@/components/photoList"
import { getAllFileInDatabase } from '@/libs/upyunFilesOperator'
import convertDMSToDecimal from '@/libs/convertDMSToDecimal'

export default async function Photos() {

  let allPhotoFlowItems = await prisma.photo.findMany() // 从数据库获取所有照片流项目
  const fileData = (await getAllFileInDatabase()).sort((a, b) => new Date(b.uplishedAt).getTime() - new Date(a.uplishedAt).getTime()); // 从附件数据库获取照片流的附件信息
  let photoOriginalData = await prisma.assets.findMany({
    where: {
      assetId: {
        in: allPhotoFlowItems.map((photo: any) => photo.assetId)
      }
    }
  })

  let combinedData = allPhotoFlowItems.map((photo: any) => {
    let photoId = photo.id
    let assetId = photo.assetId
    let photoTitle = photo.title
    let photoUrl = photoOriginalData
      .filter((asset: any) => asset.assetId === photo.assetId)
      .map((asset: any) => asset.url)[0]
    let GPSLatitudeOrigin = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.GPSLatitude)[0] || "0/1,0/1,0/1";
    let GPSLatitude = convertDMSToDecimal(GPSLatitudeOrigin)
    let GPSLongitudeOrigin = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.GPSLongitude)[0] || "0/1,0/1,0/1";
    let GPSLongitude = convertDMSToDecimal(GPSLongitudeOrigin)
    let createdAt = photo.createdAt
    let rating = photo.info.rating || null
    let originExif = {
      width: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.width)[0],
      height: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.height)[0],
      DateTimeOriginal: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.DateTimeOriginal)[0],
      Make: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Make)[0],
      Model: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Model)[0],
      LensMake: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensMake)[0],
      LensModel: photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensModel)[0],
      GPSLatitude: GPSLatitude,
      GPSLongitude: GPSLongitude,
    }
    let overExif = {
      Make: photo.info.overExif?.Make,
      Model: photo.info.overExif?.Model,
      LensMake: photo.info.overExif?.LensMake,
      LensModel: photo.info.overExif?.LensModel,
      GPSLatitude: photo.info.overExif?.GPSLatitude,
      GPSLongitude: photo.info.overExif?.GPSLongitude,
      // width: photo.info.overExif?.width,
      // height: photo.info.overExif?.height,
      DateTimeOriginal: photo.info.overExif?.DateTimeOriginal,
      exposeTime: photo.info.overExif?.exposeTime,
      FNumber: photo.info.overExif?.FNumber,
      ExposureTime: photo.info.overExif?.exposeTime,
    }
    let info = {
      originExif: originExif,
      overExif: overExif,
      rating: rating
    }
    return {
      id: photoId,
      assetId: assetId,
      title: photoTitle,
      url: photoUrl,
      createdAt: createdAt,
      info: info,
    }
  })

  return (
    <div>
      <PhotoListComponent photosData={allPhotoFlowItems} combinedData={combinedData.sort((a, b) => new Date(b.info.originExif.DateTimeOriginal).getTime() - new Date(a.info.originExif.DateTimeOriginal).getTime() > 0 ? 1 : -1)} assertsData={fileData} />
    </div>
  )
}
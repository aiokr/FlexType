import prisma from "@/libs/prisma"
import PhotoListComponent from "@/components/photoList"
import { getAllFileInDatabase } from '@/libs/upyunFilesOperator'

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
    let info = photo.info
    let width = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.width)[0]
    let height = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.height)[0]
    let DateTimeOriginal = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.DateTimeOriginal)[0]
    let Make = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Make)[0]
    let Model = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.Model)[0]
    let LensMake = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensMake)[0]
    let LensModel = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetId).map((asset: any) => asset.LensModel)[0]
    return {
      id: photoId,
      assetId: assetId,
      title: photoTitle,
      info: info,
      url: photoUrl,
      width: width,
      height: height,
      DateTimeOriginal: DateTimeOriginal,
      Make: Make,
      Model: Model,
      LensMake: LensMake,
      LensModel: LensModel
    }
  })

  return (
    <div className="container mx-auto">
      <PhotoListComponent photosData={combinedData} assertsData={fileData} />
    </div>
  )
}
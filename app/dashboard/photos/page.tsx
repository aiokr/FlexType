import prisma from "@/libs/prisma"
import PhotoListComponent from "@/components/photoList"
import { getAllFileInDatabase } from '@/libs/upyunFilesOperator'

export default async function Photos() {
  let allPhotos = await prisma.photo.findMany()
  const fileData = (await getAllFileInDatabase()).sort((a, b) => new Date(b.uplishedAt).getTime() - new Date(a.uplishedAt).getTime());
  let photoOriginalData = await prisma.assets.findMany({
    where: {
      assetId: {
        in: allPhotos.map((photo: any) => photo.assetsId)
      }
    }
  })

  let combinedData = allPhotos.map((photo: any) => {
    let photoId = photo.id
    let photoTitle = photo.title
    let photoUrl = photoOriginalData
      .filter((asset: any) => asset.assetId === photo.assetsId)
      .map((asset: any) => asset.url)[0]
    let width = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.width)[0]
    let height = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.height)[0]
    let DateTimeOriginal = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.DateTimeOriginal)[0]
    let Make = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.Make)[0]
    let Model = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.Model)[0]
    let LensMake = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.LensMake)[0]
    let LensModel = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.LensModel)[0]
    return {
      id: photoId,
      title: photoTitle,
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
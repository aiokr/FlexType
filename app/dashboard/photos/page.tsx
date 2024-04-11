import prisma from "@/libs/prisma"
import PhotoListComponent from "@/components/photoList"

export default async function Photos() {
  let allPhotos = await prisma.photo.findMany()

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
    let takenAt = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.DateTimeOriginal)[0]
    let make = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.Make)[0]
    let model = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.Model)[0]
    let LensModel = photoOriginalData.filter((asset: any) => asset.assetId === photo.assetsId).map((asset: any) => asset.LensModel)[0]
    return {
      id: photoId,
      title: photoTitle,
      url: photoUrl,
      width: width,
      height: height,
      takenAt: takenAt,
      make: make,
      model: model,
      LensModel: LensModel
    }
  })

  console.log(combinedData)

  return (
    <div className="container mx-auto">
      <PhotoListComponent data={combinedData} />
    </div>
  )
}
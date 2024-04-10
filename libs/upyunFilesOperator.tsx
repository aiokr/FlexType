import { sign, getMD5 } from '@/libs/calcUpyunSecret'
import prisma from '@/libs/prisma'

const date = new Date().toUTCString();
// 获取 UpYun 仓库信息
const operator = process.env.UPYUN_OPERATOR // 操作员
const password = process.env.UPYUN_PASSWORD // 操作员对应的密码
const serverName = process.env.UPYUN_FILE_SERVER_NAME // 服务名称
const path = process.env.UPYUN_FILE_SERVER_FILE_DIRECTORY // 目录
let serverDomain = process.env.UPYUN_FILE_SERVER_DOMAIN // 加速域名

if (!serverDomain?.includes('https')) {
  serverDomain = 'https://' + serverDomain
}

// 图片处理 自定义版本 https://help.upyun.com/knowledge-base/image/
const upyunAvatarSuffix = process.env.UPYUN_THUMBFILE_AVATAR // 自定义版本：预览小图
const upyunOptimizedSuffix = process.env.UPYUN_THUMBFILE_OPTIMIZED // 自定义版本：常规图片压缩
const upyunInfoSuffix = process.env.UPYUN_THUMBFILE_INFO // 自定义版本：图片信息

const key: any = operator?.toString();
const secret: any = password?.toString();
// const method = 'GET';

const upyunUrl = "https://v0.api.upyun.com/"

// 拼接服务名称 + 目录
const uri = '/' + serverName + path;

// 获取目录下的所有文件列表
async function getAllFileInUpyunDir() {
  const signsecret = sign(key, getMD5(secret), 'GET', uri, date)
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  headers.append('Accept', 'application/json');
  headers.append('x-list-order', 'asc');
  const fileList = await fetch(upyunUrl + serverName + path, {
    method: 'GET',
    headers: headers,
  })
  const fileListjson = await fileList.json()
  return fileListjson
}

// 获取数据库中的所有文件列表
async function getAllFileInDatabase() {
  const fileList = await prisma.assets.findMany()
  return fileList
}

// 上传文件
async function uploadFileToUpyun(formData: any, userID: string) {

  const fileName = encodeURI(formData.name)
  console.log(fileName)

  // 计算密钥
  const upuri = uri + '/' + fileName
  const signsecret = sign(key, getMD5(secret), 'PUT', upuri, date)

  // 制作 Headers
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);

  let uploadFileResult = null

  // 上传文件
  const uploadFile = await fetch(upyunUrl + serverName + path + '/' + fileName, {
    method: 'PUT',
    headers: headers,
    body: formData,
  })
  console.log(fileName, uploadFile)

  // 写入数据库
  if (uploadFile.status === 200) {
    const writeFileRecord = await setFileDatabase(formData, userID, 'upyun')
    if (writeFileRecord) {
      uploadFileResult = writeFileRecord.assetId
    } else {
      console.error('上传到又拍云成功，写入数据库失败')
      uploadFileResult = { error: "Failed to save file information to the database." }
    }
  } else {
    console.error('上传到又拍云失败，状态码:', uploadFile.status)
    uploadFileResult = { error: `Failed to upload file to UPYUN. Status code: ${uploadFile.status}` }
  }

  console.log(uploadFileResult)

  // 返回上传结果
  return { uploadFile, setFileDatabase, uploadFileResult }
}

// 将文件列表存入数据库
async function setFileDatabase(formData: any, userID: string, ossProvider: string) {
  const fileName = formData.name
  const fileType = formData.type
  const fileSize = formData.size
  const fileUrl = serverDomain + path + '/' + fileName
  const createFileRecord = await prisma.assets.create({
    data: {
      title: fileName,
      url: fileUrl,
      type: fileType,
      uploadUserId: userID,
      size: fileSize,
      base: ossProvider
    }
  }).then().catch(e => {
    console.log(e)
    return e
  })
  return createFileRecord
}

// 从数据库获取文件ID
async function getAssetsID(fileName: string) {
  const AssetsID = await prisma.assets.findFirst({
    where: {
      title: fileName
    }
  });
  return AssetsID
}

// 从数据库获取文件信息
async function getAssets(assetId: number) {
  const assets = await prisma.assets.findUnique({
    where: {
      assetId: assetId
    }
  });
  return assets
}

// 获取图片 Exif 信息
async function getAssetsExif(assetId: number) {

  const assetTitle = await getAssets(assetId)
  const assetName = assetTitle?.title
  const response = await fetch(serverDomain + path + '/' + assetName + upyunInfoSuffix)
  const exifInfo = await response.json()

  if (exifInfo) {
    const writeExifInfo = await setAssetsExif(assetId, exifInfo)
    return writeExifInfo
  }

  return
}

// 写入 Exif 信息到数据库
async function setAssetsExif(assetId: number, exifInfo: any) {
  let width = exifInfo.width // 图片宽度
  let height = exifInfo.height // 图片高度
  let type = exifInfo.type // 图片格式
  let Make = exifInfo.EXIF.Make  // 相机厂商
  let Model = exifInfo.EXIF.Model // 相机型号
  let ApertureValue = exifInfo.EXIF.ApertureValue // 光圈值（以分数计）
  let ISOSpeedRatings = exifInfo.EXIF.ISOSpeedRatings // ISO 值
  let LensMake = exifInfo.EXIF.LensMake // 镜头品牌
  let LensModel = exifInfo.EXIF.LensModel // 镜头型号
  let ExposureTime = exifInfo.EXIF.ExposureTime // 曝光时间
  let FNumber = exifInfo.EXIF.FNumber // 光圈值（以 F 计）
  let FocalLength = exifInfo.EXIF.FocalLength // 焦距
  let FocalLengthIn35mmFilm = exifInfo.EXIF.FocalLengthIn35mmFilm // 35mm 焦距
  let GPSLatitude = exifInfo.EXIF.GPSLatitude // 纬度
  let GPSLatitudeRef = exifInfo.EXIF.GPSLatitudeRef // 纬度参考
  let GPSLongitude = exifInfo.EXIF.GPSLongitude // 经度
  let GPSLongitudeRef = exifInfo.EXIF.GPSLongitudeRef // 经度参考
  let GPSAltitude = exifInfo.EXIF.GPSAltitude // 海拔
  let GPSAltitudeRef = exifInfo.EXIF.GPSAltitudeRef // 海拔参考
  let GPSSpeed = exifInfo.EXIF.GPSSpeed // 速度
  let GPSSpeedRef = exifInfo.EXIF.GPSSpeedRef // 速度参考

  if (exifInfo.EXIF['0xA434']) {
    LensModel = exifInfo.EXIF['0xA434'];
  }

  let takenTime = exifInfo.EXIF.DateTimeOriginal // 拍摄时间
  // 格式化拍摄时间
  function formatToISO8601(takenTime: string) {
    const regex = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = takenTime.match(regex);

    if (match) {
      // 构建一个 ISO 8601 格式的日期字符串
      const timeFormatting: string = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`;
      const date = new Date(timeFormatting).toISOString();
      return date
    } else {
      throw new Error('Input string is not in the expected format "YYYY:MM:DD HH:MM:SS"');
    }
  }
  let DateTimeOriginal = formatToISO8601(takenTime)

  const updateExif = await prisma.assets.update({
    where: {
      assetId: assetId
    },
    data: {
      width: width,
      height: height,
      Make: Make,
      Model: Model,
      ApertureValue: ApertureValue,
      ISOSpeedRatings: ISOSpeedRatings,
      LensMake: LensMake,
      LensModel: LensModel,
      ExposureTime: ExposureTime,
      FNumber: FNumber,
      DateTimeOriginal: DateTimeOriginal,
      FocalLength: FocalLength,
      FocalLengthIn35mmFilm: FocalLengthIn35mmFilm,
      GPSLatitude: GPSLatitude,
      GPSLongitude: GPSLongitude,
      GPSAltitude: GPSAltitude,
    },
  }).catch(e => {
    console.log(e)
    return e
  })
  console.log(updateExif)
  return updateExif
}

// 删除文件
async function deleteFileFromUpyun(assetId: number) {
  const asset = await getAssets(assetId)
  const fileName = asset?.title
  const deluri = uri + '/' + fileName
  const signsecret = sign(key, getMD5(secret), 'DELETE', deluri, date)
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  let deleteFileResult = null
  const deleteFile = await fetch(upyunUrl + serverName + path + '/' + fileName, {
    headers: headers,
    method: 'DELETE',
  })

  // 删除数据库中的记录
  if (deleteFile.status === 200) {
    const delFileRecord = await setDelFileDatabase(assetId)
    if (delFileRecord) {
      deleteFileResult = delFileRecord
    } else {
      deleteFileResult = { error: "Failed to delete file." }
    }
  }
  console.log(deleteFileResult)
  return { deleteFile, deleteFileResult }
}

// 从数据库删除文件记录
async function setDelFileDatabase(assetId: number) {
  const delFileDatabase = await prisma.assets.delete({
    where: {
      assetId: assetId
    }
  }).then().catch(e => {
    console.log(e)
    return e
  })
  return delFileDatabase
}

export {
  getAllFileInUpyunDir, uploadFileToUpyun, getAllFileInDatabase, deleteFileFromUpyun, getAssetsID, getAssetsExif
}
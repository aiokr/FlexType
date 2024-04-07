import { sign, getMD5 } from '@/libs/calcUpyunSecret'
import prisma from '@/libs/prisma'

const date = new Date().toUTCString();
// 获取 UpYun 仓库信息
const operator = process.env.UPYUN_OPERATOR // 操作员
const password = process.env.UPYUN_PASSWORD // 操作员对应的密码
const serverName = process.env.UPYUN_FILE_SERVER_NAME // 服务名称
const path = process.env.UPYUN_FILE_SERVER_FILE_DIRECTORY // 目录
const serverDomain = process.env.UPYUN_FILE_SERVER_DOMAIN // 加速域名

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

  // 计算密钥
  const upuri = uri + '/' + formData.name
  const signsecret = sign(key, getMD5(secret), 'PUT', upuri, date)

  // 制作 Headers
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  const fileName = formData.name

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
  const fileUrl = 'https://' + serverDomain + path + '/' + fileName
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
  getAllFileInUpyunDir, uploadFileToUpyun, getAllFileInDatabase, deleteFileFromUpyun, getAssetsID
}
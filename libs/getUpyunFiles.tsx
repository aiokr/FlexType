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
  // 上传文件
  const uploadFile = await fetch(upyunUrl + serverName + path + '/' + fileName, {
    method: 'PUT',
    headers: headers,
    body: formData,
  })
  console.log(uploadFile)

  // 写入数据库
  if (uploadFile.status === 200) {
    setFileDatabase(formData, userID, 'upyun')
  }

  // 返回上传结果
  return { uploadFile, setFileDatabase }
}

// 将文件列表存入数据库
async function setFileDatabase(formData: any, userID: string, ossProvider: string) {
  const fileName = formData.name
  const fileType = formData.type
  const fileSize = formData.size
  const fileUrl = 'https://' + serverDomain + path + '/' + fileName
  const addFileDatabase = await prisma.assets.create({
    data: {
      title: fileName,
      url: fileUrl,
      type: fileType,
      uploadUserId: userID,
      size: fileSize,
      base: ossProvider
    }
  });
  return (addFileDatabase)
}

// 从数据库获取文件ID
async function getFileAssetsID(fileName: string) {
  const getAssetsID = await prisma.assets.findFirst({
    where: {
      title: fileName
    }
  });
  return getAssetsID
}

// 删除文件
async function deleteFileFromUpyun(fileName: string) {
  console.log(fileName)
  const deluri = uri + '/' + fileName
  const signsecret = sign(key, getMD5(secret), 'DELETE', deluri, date)
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  const deleteFile = await fetch(upyunUrl + serverName + path + '/' + fileName, {
    method: 'DELETE',
  })

  setDelFileDatabase(fileName)
  return deleteFile
}

// 从数据库删除文件记录
async function setDelFileDatabase(fileName: string) {
  return
}

export {
  getAllFileInUpyunDir, uploadFileToUpyun, getAllFileInDatabase, deleteFileFromUpyun
}
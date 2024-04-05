import { sign, getMD5 } from '@/libs/calcUpyunSecret'

const date = new Date().toUTCString();
// 获取 UpYun 仓库信息
const operator = process.env.UPYUN_OPERATOR // 操作员
const password = process.env.UPYUN_PASSWORD
const serverName = process.env.UPYUN_FILE_SERVER_NAME // 服务名称
const path = process.env.UPYUN_FILE_SERVER_FILE_DIRECTORY // 目录

const key: any = operator?.toString();
const secret: any = password?.toString();
// const method = 'GET';

const upyunUrl = "http://v0.api.upyun.com/"

// 拼接服务名称 + 目录
const uri = '/' + serverName + path;

// 获取目录下的所有文件列表
export async function getAllFileInUpyunDir() {
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
  console.log(fileListjson)
  return fileListjson
}

// 上传文件

export async function uploadFileToUpyun() {
  const signsecret = sign(key, getMD5(secret), 'PUT', uri, date)
  const headers = new Headers();
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  headers.append('Accept', 'application/json');
  const uploadFile = await fetch(upyunUrl + serverName + path, {
    method: 'PUT',
    headers: headers,
  })

}
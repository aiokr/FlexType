import crypto from 'crypto'
import { get } from 'http'
import { headers } from 'next/headers'

const date = new Date().toUTCString();

// 获取操作员
const operator = process.env.UPYUN_OPERATOR

// 编码密码
const operatorPassword = process.env.UPYUN_OPERATOR + ":" + process.env.UPYUN_PASSWORD
const Pword: any = process.env.UPYUN_PASSWORD
const PwordMD5: String = crypto.createHash('md5').update(Pword).digest('hex')
const PwordHMACSHA1 = crypto.createHash('sha1').update(Pword).digest('hex')
// const OperatorPwordMD5 = crypto.createHash('md5').update(operatorPassword).digest('hex')

// 获取链接
const upyunUrl = "http://v0.api.upyun.com/"
const upyunlink = upyunUrl + process.env.UPYUN_FILE_SERVER_NAME + process.env.UPYUN_FILE_SERVER_FILE_DIRECTORY

//console.log(PwordMD5)

async function getUpyunFileList() {
  const headers = new Headers();
  headers.append('Authorization', 'UPYUN ' + operator + ":" + PwordHMACSHA1);
  headers.append('Date', date);
  // console.log(headers)
  const fileList = await fetch(upyunlink, {
    method: 'GET',
    headers: headers
  })
  const fileListjson = await fileList.json()
  console.log(fileListjson)

  return fileListjson
}


export default async function Assets() {
  const fileList = await getUpyunFileList()
  return (
    <main>
      assets
      <div>上传文件</div>
      <div>文件列表</div>
      {'1'}
    </main>
  );
}
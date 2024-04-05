import crypto from 'crypto'
import { get } from 'http'

const upyunUrl = "http://v0.api.upyun.com/"
const operatorPassword = process.env.UPYUN_OPERATOR + ":" + process.env.UPYUN_PASSWORD
const Pword: any = process.env.UPYUN_PASSWORD
const PwordMD5: String = crypto.createHash('md5').update(Pword).digest('hex')
const upyunlink = operatorPassword + upyunUrl + process.env.UPYUN_FILE_SERVER_NAME
// const OperatorPwordMD5 = crypto.createHash('md5').update(operatorPassword).digest('hex')

//console.log(PwordMD5)

async function getUpyunFileList() {
  const res = await fetch(upyunlink)
  const json = await res.json()
  console.log()

  return json
}


export default async function Assets() {
  getUpyunFileList
  return (
    <main>
      assets
      <div>上传文件</div>
      <div>文件列表</div>

    </main>
  );
}
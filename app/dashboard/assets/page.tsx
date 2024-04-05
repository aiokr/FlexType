import { getAllFileInUpyunDir } from '@/libs/getUpyunFiles'

export default async function Assets() {
  const fileListjson = await getAllFileInUpyunDir()
  console.log(fileListjson)
  if (fileListjson.msg == 'Not found') {
    console.log("No Files Found")
  }

  return (
    <main>
      assets
      <div>上传文件</div>
      <div>文件列表</div>
    </main>
  );
}
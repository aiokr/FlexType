import { getAllFileInUpyunDir } from '@/libs/getUpyunFiles'
import Link from 'next/link'
import UpLoadFile from '@/components/upLoadFile'

export default async function Assets() {
  const fileListjson = await getAllFileInUpyunDir()
  // console.log(fileListjson)
  if (fileListjson.msg == 'Not found') {
    console.log("No Files Found")
  }

  return (
    <main>
      <div className='text-2xl font-bold pb-6'>文件管理</div>
      <div>上传文件</div>
      <UpLoadFile />

      <div>文件列表</div>
      <div>UpYUN File List</div>
      {fileListjson.files.map((file: any) => (
        <div key={file.name}>
          <Link href={'https://imgur.lzmun.com/tricms/' + file.name}>{file.name}</Link>
        </div>
      ))}
    </main>
  );
}
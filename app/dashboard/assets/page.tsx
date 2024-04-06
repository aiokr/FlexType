import { getAllFileInUpyunDir, getAllFileInDatabase } from '@/libs/getUpyunFiles'
import Link from 'next/link'
import UpLoadFile from '@/components/upLoadFile'
import TableComponent from '@/components/fileListTable'
import * as dateFns from 'date-fns';

export default async function Assets() {
  const fileData = await getAllFileInDatabase();
  const fileList = fileData.map((file: any) => ({
    title: file.title,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    url: file.url,
    delurl: file.delurl || '',
    type: file.type,
    date: dateFns.format(new Date(file.uplishedAt), 'yyyy-MM-dd HH:mm:ss'),
    uploader: file.uploader,
    assetId: file.assetId
  }));

  return (
    <main>
      <div className='text-2xl font-bold pb-6'>文件管理</div>
      <div>上传文件</div>
      <UpLoadFile />
      <div className='text-2xl font-bold py-6'>Database File List</div>
      <TableComponent data={fileList} />
    </main>
  );
}
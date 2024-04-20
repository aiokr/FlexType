import { getAllFileInUpyunDir, getAllFileInDatabase } from '@/libs/upyunFilesOperator'
import Link from 'next/link'
import UpLoadFile from '@/components/upLoadFile'
import TableComponent from '@/components/fileListTable'
import * as dateFns from 'date-fns';

export default async function Assets() {
  const fileData = (await getAllFileInDatabase()).sort((a, b) => new Date(b.uplishedAt).getTime() - new Date(a.uplishedAt).getTime());
  const fileList = fileData.map((file: any) => ({
    title: file.title,
    size: file.size,
    url: file.url,
    delurl: file.delurl || '',
    type: file.type,
    uplishedAt: dateFns.format(new Date(file.uplishedAt), 'yyyy-MM-dd HH:mm:ss'),
    uploader: file.uploader,
    dateTimeOriginal: dateFns.format(new Date(file.DateTimeOriginal), 'yyyy-MM-dd HH:mm:ss'),
    assetId: file.assetId,
    width: file.width,
    height: file.height,
    make: file.Make,
    model: file.Model,
    fNumber: file.FNumber,
    exposureTime: file.ExposureTime,
    iso: file.ISOSpeedRatings,
    focalLength: file.FocalLength,
    focalLengthIn35mmFilm: file.FocalLengthIn35mmFilm,
    lensMake: file.LensMake,
    lensModel: file.LensModel,
    latitude: file.GPSLatitude,
    longitude: file.GPSLongitude,
  }));

  return (
    <main className='container max-w-[100vw] mx-auto overflow-hidden'>
      <div className='text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3 px-2 md:px-0'>
        <Link href={'/'}>首页</Link><> / </>
        <Link href={'/dashboard'}>仪表盘</Link><> / </>
        <Link href={'/dashboard/assets'}>文件管理</Link>
      </div>
      <div className='text-2xl font-bold pt-2 py-4 md:py-4 px-2 md:px-0'>文件管理</div>
      <UpLoadFile />
      <div className='text-xl font-bold pt-2 py-4 md:py-4 px-2 md:px-0'>文件列表</div>
      <TableComponent data={fileList} />
    </main>
  );
}
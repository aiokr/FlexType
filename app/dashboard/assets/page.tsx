import { getAllFileInUpyunDir, getAllFileInDatabase } from '@/libs/upyunFilesOperator'
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
    <main className='container max-w-[100vw] mx-auto p-6 overflow-hidden'>
      <div className='text-2xl font-bold pb-6'>文件管理</div>
      <UpLoadFile />
      <div className='text-2xl font-bold py-6'>Database File List</div>
      <TableComponent data={fileList} />
    </main>
  );
}
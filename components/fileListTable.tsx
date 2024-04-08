"use client"

import React, { useState, useEffect } from 'react';
import { Table, Avatar, Toast, Popconfirm } from '@douyinfe/semi-ui';
const { Column } = Table;
import Link from 'next/link'

export default function TableComponent(data: any) {

  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    // 每当传入的 data 更新时，更新表格数据
    setTableData(data);
  }, [data]); // 将 data 加入依赖数组，这样任何 data 的改变都会触发这个 effect

  const deleteItem = (id: string) => {
    // 删除操作的实现
    const url = `/api/delete/${id}`;
    fetch(url, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          Toast.success(`File ID ${id} deleted successfully.`);
          // 可以在这里刷新列表或删除状态中的项目
        } else {
          Toast.error('Error deleting file.');
          console.error('Error deleting file:', response);
        }
      })
      .catch(error => {
        Toast.error('Network error.');
        console.error('Network error:', error);
      });
  };

  const getAssetsInfo = (id: string, title: string, type: string) => {
    if (type.includes('image')) {
      const url = `/api/exif/${id}`;
      fetch(url, { method: 'GET' }).then(response => {
        Toast.success(`Get ${id} Exif Info Successfully.`);
      })
    } else {
      Toast.error('This asset is not an image.');
    }
  }

  const renderTitle = (text: any, record: any) => {
    return (
      <span>
        <Avatar size="small" shape="square" src={record.url + '_avatar'} style={{ marginRight: 12 }}></Avatar>
        <Link href={record.url} target="_blank">{record.title}</Link>
      </span>
    )
  }

  const operateAsset = (text: any, record: any) => (
    <span className='flex gap-2'>
      <button className='text-indigo-500' onClick={() => getAssetsInfo(record.assetId, record.title, record.type)}>获取图片信息</button>
      <Popconfirm
        title="确定删除吗？"
        onConfirm={() => deleteItem(record.assetId)}
        okText="删除"
        okType='danger'
        cancelText="取消"
        cancelButtonProps={{
          autoFocus: true,
        }}
        position="bottomRight"
      >
        <button className='text-red-500'>删除</button>
      </Popconfirm>
    </span>
  );

  return (
    <Table dataSource={tableData.data} pagination={false} className='container !mr-12 overflow-x-auto table-fixed'>
      <Column title="ID" dataIndex="assetId" key="assetId" />
      <Column title="标题" dataIndex="name" key="name" render={renderTitle} />
      <Column title="大小" dataIndex="size" key="size" sorter={(a, b) => (a.size - b.size > 0 ? 1 : -1)} />
      <Column title="类型" dataIndex="type" key="type" />
      <Column title="上传时间" dataIndex="uplishedAt" key="uplishedAt" sorter={(a, b) => (a.uplishedAt - b.uplishedAt > 0 ? 1 : -1)} />
      <Column title="拍摄时间" dataIndex="dateTimeOriginal" key="dateTimeOriginal" sorter={(a, b) => (a.dateTimeOriginal - b.dateTimeOriginal > 0 ? 1 : -1)} />
      <Column title="光圈" dataIndex="fNumber" key="fNumber" />
      <Column title="快门" dataIndex="exposureTime" key="exposureTime" />
      <Column title="ISO" dataIndex="iso" key="iso" />
      <Column title="焦距" dataIndex="focalLength" key="focalLength" />
      <Column title="等效焦距" dataIndex="focalLengthIn35mmFilm" key="focalLengthIn35mmFilm" />
      <Column title="镜头" dataIndex="lensMake" key="lensMake" />
      <Column title="镜头型号" dataIndex="lensModel" key="lensModel" />
      <Column title="相机" dataIndex="make" key="make" />
      <Column title="相机型号" dataIndex="model" key="model" />
      <Column title="纬度" dataIndex="latitude" key="latitude" />
      <Column title="经度" dataIndex="longitude" key="longitude" />
      <Column title="操作" dataIndex="operate" key="operate" render={operateAsset} />
    </Table>
  )
}
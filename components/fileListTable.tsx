"use client"

import React, { useState, useEffect } from 'react';
import { Table, Avatar, Toast, Popconfirm, Modal, Button } from '@douyinfe/semi-ui';
const { Column } = Table;
import Link from 'next/link'
import Image from 'next/image'

export default function TableComponent(this: any, data: any, refresh: any) {

  const [tableData, setTableData] = useState(data);

  // 每当传入的 data 更新时，更新表格数据
  useEffect(() => { setTableData(data); }, [data]); // 将 data 加入依赖数组，这样任何 data 的改变都会触发这个 effect

  const [visible, setVisible] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
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

  const assetId = (text: any, record: any) => (
    <button className='text-indigo-500' onClick={() => showDialog(record)}>
      {record.assetId}
    </button>
  )

  const showDialog = (record: any) => {
    setVisible(true);
    setSelectedRecord(record);
  };

  const handleOk = (record: any) => {
    setVisible(false);
    getAssetsInfo(record.assetId, record.title, record.type)
    console.log('Ok button clicked');
  };
  const handleCancel = (record: any) => {
    setVisible(false);
    console.log('Cancel button clicked');
  };
  const handleAfterClose = () => {
    console.log('After Close callback executed');
  };

  return (
    <>
      <Table dataSource={tableData.data} pagination={{ pageSize: 10 }} className='!mr-12 overflow-x-auto table-fixed'>
        <Column title="ID" dataIndex="assetId" key="assetId" render={assetId} width={48} fixed />
        <Column title="标题" dataIndex="name" key="name" render={renderTitle} width={360} ellipsis />
        <Column title="大小" dataIndex="size" key="size" width={100}
          render={size => (size / 1024 / 1024).toFixed(2) + 'MB'}
          sorter={(a, b) => (a.size - b.size > 0 ? 1 : -1)} />
        <Column title="类型" dataIndex="type" key="type" width={120} ellipsis
          filters={[
            { text: 'image', value: 'image', },
            { text: 'text', value: 'text', },
          ]}
          onFilter={(type, record) => record.type.toString().includes(type)}
        />
        <Column title="上传时间" dataIndex="uplishedAt" key="uplishedAt" width={160}
          sorter={(a, b) => ((new Date(a.uplishedAt).getTime()) - (new Date(b.uplishedAt).getTime()) > 0 ? 1 : -1)}
        />
        <Column title="拍摄时间" dataIndex="dateTimeOriginal" key="dateTimeOriginal" width={160}
          sorter={(a, b) => ((new Date(a.dateTimeOriginal).getTime()) - (new Date(b.dateTimeOriginal).getTime()) > 0 ? 1 : -1)}
          render={
            dateTimeOriginal => {
              if (dateTimeOriginal.toString() === '1970-01-01 08:00:00') {
                return ''
              } else {
                return dateTimeOriginal
              }
            }}
        />
        <Column title="光圈" dataIndex="fNumber" key="fNumber" width={60}
          render={
            fNumber => {
              if (fNumber) {
                const parts = fNumber.split('/');
                if (parts.length === 2) {
                  const numerator = parseFloat(parts[0]);
                  const denominator = parseFloat(parts[1]);
                  return numerator / denominator;
                } else {
                  return fNumber
                }
              } else {
                return ''
              }
            }
          }
        />
        <Column title="快门" dataIndex="exposureTime" key="exposureTime" width={120}
          render={
            exposureTime => {
              if (exposureTime) {
                const parts = exposureTime.split('/');
                const numerator = parseFloat(parts[0]);
                const denominator = parseFloat(parts[1]);
                const exposureTimeNum = numerator / denominator;
                if (parts.length === 2 && exposureTimeNum < 1) {
                  return (numerator + '/' + denominator);
                } else if (parts.length === 2 && exposureTimeNum >= 1) {
                  return exposureTimeNum;
                } else {
                  return exposureTime
                }
              } else {
                return ''
              }
            }
          }
        />
        <Column title="ISO" dataIndex="iso" key="iso" width={100} />
        <Column title="焦距" dataIndex="focalLength" key="focalLength" width={100} />
        <Column title="35焦距" dataIndex="focalLengthIn35mmFilm" key="focalLengthIn35mmFilm" width={100} />
        <Column title="相机厂商" dataIndex="make" key="make" width={100} />
        <Column title="相机型号" dataIndex="model" key="model" width={100} />
        <Column title="镜头厂商" dataIndex="lensMake" key="lensMake" width={100} />
        <Column title="镜头型号" dataIndex="lensModel" key="lensModel" width={200} />
        <Column title="纬度" dataIndex="latitude" key="latitude" width={300} />
        <Column title="经度" dataIndex="longitude" key="longitude" width={300} />
        <Column title="操作" dataIndex="operate" key="operate" render={operateAsset} width={200} />
      </Table>
      <Modal
        title={(selectedRecord?.assetId) + ' - ' + (selectedRecord?.title)}
        visible={visible}
        afterClose={handleAfterClose}
        closeOnEsc={true}
        onOk={() => handleOk(selectedRecord)}
        onCancel={() => handleCancel(selectedRecord)}
        className='max-h-[80vh] overflow-y-auto'
        footer={
          <Button type="primary" onClick={() => handleOk(selectedRecord)}>
            获取图片信息
          </Button>
        }
        footerFill={true}
        okText={'返回'}
        cancelText={'获取图片信息'}
        centered
      >
        {selectedRecord && (
          <div>
            {selectedRecord.fNumber && selectedRecord.type.includes('image') && (
              <Image src={selectedRecord.url} alt={selectedRecord.title} width={selectedRecord.width} height={selectedRecord.height} className='pb-4' unoptimized />
            )}
            <ul>
              <li>文件类型: {selectedRecord.type}</li>
              <li>文件大小: {(selectedRecord.size / 1024 / 1024).toFixed(2)} MB</li>
              <li>上传时间: {selectedRecord.uplishedAt}</li>
              {selectedRecord.fNumber &&
                (
                  <>
                    <li>拍摄时间: {selectedRecord.dateTimeOriginal}</li>
                    <li>光圈: {selectedRecord.fNumber}</li>
                    <li>快门: {selectedRecord.exposureTime}</li>
                    <li>ISO: {selectedRecord.iso}</li>
                  </>
                )
              }
            </ul>
          </div>
        )}
      </Modal>
    </>
  )
}
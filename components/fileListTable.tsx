"use client"

import React, { useState, useMemo } from 'react';
import { Table, Avatar, Modal } from '@douyinfe/semi-ui';
const { Column } = Table;
import Link from 'next/link'

export default function TableComponent(data: any) {

const deleteItem = (id: string) => {
  Modal.confirm({
    title: '删除文件',
    content: '确定删除吗？',
    onOk: () => {
      const url = `/api/delete/${id}`; // 确保这里的 id 是一个字符串或数字
      fetch(url, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          // Handle successful deletion here, e.g., remove the item from the state
          console.log(`File with id ${id} deleted successfully.`);
        } else {
          // Handle error here
          console.error('Error deleting file:', response);
        }
      })
      .catch(error => {
        // Handle network errors here
        console.error('Network error:', error);
      });
    }
  });
};
  
  const renderTitle = (text: any, record: any) => {
    return (
      <span>
        <Avatar size="small" shape="square" src={record.url + '_avatar'} style={{ marginRight: 12 }}></Avatar>
        <Link href={record.url} target="_blank">{record.title}</Link>
      </span>
    )
  }
  const operateAsset = (text: any, record: any) => {
    return (
      <span className='flex gap-2'>
        <Link href={record.url} target="_blank">下载</Link>
        <button onClick={() => deleteItem(record.assetId)} className='text-red-500'>删除</button>
      </span>
    )
  }

  return (
    <Table dataSource={data.data} pagination={false}>
      <Column title="标题" dataIndex="name" key="name" render={renderTitle} />
      <Column title="大小" dataIndex="size" key="size" />
      <Column title="类型" dataIndex="type" key="type" />
      <Column title="上传时间" dataIndex="date" key="date" sorter={(a, b) => (a.date - b.date > 0 ? 1 : -1)} />
      <Column title="操作" dataIndex="operate" key="operate" render={operateAsset} />
      <Column title="assetsID" dataIndex="assetId" key="assetId" />
    </Table>
  )
}
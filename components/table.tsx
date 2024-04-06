"use client"

import React, { useState, useMemo } from 'react';
import { Table, Avatar } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';
const { Column } = Table;
import Link from 'next/link'


export default function TableComponent(data: any) {
  const renderTitle = (text: any, record: any) => {
    return (
      <span>
        <Avatar size="small" shape="square" src={record.url + '_avatar'} style={{ marginRight: 12 }}></Avatar>
        <Link href={record.url} target="_blank">{record.title}</Link>
      </span>
    )
  }
  const delAsset = (text: any, record: any) => {
    return (
      <Link href={record.url} target="_blank">删除</Link>
    )
  }

  return (
    <Table dataSource={data.data} pagination={false}>
      <Column title="标题" dataIndex="name" key="name" render={renderTitle} />
      <Column title="大小" dataIndex="size" key="size" />
      <Column title="类型" dataIndex="type" key="type" />
      <Column title="上传时间" dataIndex="date" key="date" />
      <Column title="操作" dataIndex="operate" key="operate" render={delAsset} />
    </Table>
  )
}
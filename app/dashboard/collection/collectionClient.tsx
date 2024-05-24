'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import {autoRevalidate} from '@/app/actions'
import {Button, Table, Tag, Modal, Input, Switch} from 'antd'

export const CollectionTable = (data: any) => {
  const userData = data.userData
  const tableData = data.data.map((item: any) => ({
    key: item.id,
    name: item.name,
    admin: userData.find((user: any) => user.id === item.adminId),
    adminId: item.adminId,
    adminUsername: userData.find((user: any) => user.id === item.adminId)?.name,
    authorizedUser: item.authorizedUser.map((user: any) => user.authorizedUser)
  }))

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <span>{text}</span>
    },
    {
      title: '集合名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '管理员',
      dataIndex: 'adminUsername',
      key: 'adminUsername',
      render: (text: any) => (
        <Tag color="geekblue">
          {text}
          {'(' + userData.find((user: any) => user.name === text)?.email + ')'}
        </Tag>
      )
    },
    {
      title: '授权用户',
      dataIndex: 'authorizedUser',
      key: 'authorizedUser',
      render: (text: any) => (
        <div>
          {text.map((user: any) => (
            <Tag key={user.id} color={user.role === 'ADMIN' ? 'blue' : 'green'}>
              {user.name}
              {'(' + user.email + ')'}
            </Tag>
          ))}
        </div>
      )
    }
  ]

  return (
    <div>
      <Table columns={columns} dataSource={tableData}></Table>
    </div>
  )
}

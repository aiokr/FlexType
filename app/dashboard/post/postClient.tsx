'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import {Button, Table, Tag, Modal, Input, Switch} from 'antd'
import {addNewPost, editPostInfo} from './actions'
import {autoRevalidate} from '@/app/actions'

export const CreateNewPost = () => {
  return (
    <>
      <Button onClick={() => addNewPost()} className="mb-4">
        New Post
      </Button>
    </>
  )
}

export const PostTable = (data: any) => {
  // 重新构造数据
  const tableData = data.data.map((item: any, index: number) => ({
    no: index + 1,
    id: item.id,
    title: item.Title,
    createdAt: item.createdAt,
    isPublished: item.published,
    historyNum: item.History.length
  }))

  // 定义表格列
  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <Link href={`/dashboard/editor/${record.id}`} target="_blank">
          {text}
        </Link>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {title: 'History Num', dataIndex: 'historyNum', key: 'historyNum'},
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (text: boolean) => <span>{text ? <Tag color="blue">Published</Tag> : <Tag color="volcano">Draft</Tag>}</span>,
      filters: [
        {
          text: 'Published',
          value: true
        },
        {
          text: 'Draft',
          value: false
        }
      ],
      onFilter: (value: any, record: any) => record.isPublished === value
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => <Button onClick={() => showModal(record.id)}>Edit</Button>
    }
  ]

  // 编辑框
  const [editModalVisible, setEditModalVisible] = useState(false) // 编辑框是否可见
  const [editPostId, setEditPostId] = useState(0) // 编辑的文章id
  const [editedPostInfo, setEditedPostInfo] = useState({} as EditPostInfo)

  type EditPostInfo = {
    Title: string
    published: boolean
  }

  // 显示编辑框
  const showModal = (postId: any) => {
    setEditPostId(postId) // 设置编辑的文章id
    setEditedPostInfo(data.data.find((item: any) => item.id === postId)) // 设置待编辑的文章信息
    setEditModalVisible(true) // 显示编辑框
  }

  // 清空编辑框
  const cleanEditModal = () => {
    setEditPostId(0)
    setEditedPostInfo({} as EditPostInfo)
  }

  // 确定
  const handleOk = () => {
    console.log('Clicked ok button')
    editPostInfo(editPostId, editedPostInfo).then(() => {
      setEditPostId(0)
      setEditedPostInfo({} as EditPostInfo)
      autoRevalidate()
      setEditModalVisible(false)
    })
  }

  // 取消
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setEditModalVisible(false)
  }

  // 关闭后
  const handleAfterClose = () => {
    setEditPostId(0)
  }

  return (
    <>
      <Table dataSource={tableData} columns={columns} />
      <Modal open={editModalVisible} onOk={handleOk} onCancel={handleCancel} afterClose={handleAfterClose}>
        <span className="block text-lg font-bold">Post Info</span>
        <Input
          className="mt-2"
          placeholder="Title"
          addonBefore="Title"
          value={editedPostInfo.Title}
          onChange={(e: any) => setEditedPostInfo({...editedPostInfo, Title: e.target.value})}
        ></Input>
        <span className="block text-lg font-bold mt-6">Post Status</span>
        <div className="flex items-center gap-2 mt-2">
          <Switch checked={editedPostInfo.published} onChange={(checked: boolean) => setEditedPostInfo({...editedPostInfo, published: checked})} />
          {JSON.stringify(editedPostInfo.published) === 'true' ? <Tag color="blue">Published</Tag> : <Tag color="volcano">Draft</Tag>}
        </div>
      </Modal>
    </>
  )
}

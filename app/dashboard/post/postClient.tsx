'use client'
import Link from 'next/link'
import {Button, Table} from 'antd'
import {addNewPost} from './actions'

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
  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title',
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
    }
  ]

  return (
    <>
      <Table dataSource={data.data} columns={columns} />;
    </>
  )
}

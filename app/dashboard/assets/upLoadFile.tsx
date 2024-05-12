'use client'
import React, {useState} from 'react'
import {Button, Toast, Modal, Dropdown} from '@douyinfe/semi-ui'
import {getUploadSecret} from '@/libs/upyunFilesOperator'
import action from '@/app/actions'
import {headers} from 'next/headers'

const ImageUploader = () => {
  // 明确 selectedFile 的类型为 File | null
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 上传按钮的状态
  const [active, setActive] = useState(false)

  // 上传弹窗的状态
  const [modalVisible, setModalVisible] = useState(false)

  // 上传模式
  const [uploadMode, setUploadMode] = useState('upyunServer') // upyunServer / upyunClient

  // 当文件输入变化时，更新状态
  const fileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 检查文件是否存在于事件对象中
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadFile = () => {
    if (uploadMode === 'upyunServer') {
      uploadFileServer()
    } else if (uploadMode === 'upyunClient') {
      uploadFileClient()
    }
  }

  // 处理文件上传的逻辑
  const uploadFileServer = async () => {
    setActive(!active)
    if (selectedFile) {
      const formData = new FormData()

      // 获取原始文件名
      const originalFileName = selectedFile.name

      // 创建时间戳
      const timestamp = Date.now()

      // 创建新的文件名：时间戳 + 原始文件名
      const newFileName = `${timestamp}-${originalFileName}`

      // 将文件添加到FormData中，并使用新的文件名
      formData.append('file', selectedFile, newFileName)

      try {
        const response = await fetch('/api/upload', {
          method: 'PUT',
          body: formData
        })
        setActive(active)
        if (response.ok) {
          const data = await response.json() // 等待响应的JSON数据
          action()
          Toast.success(`${data.message}`)
          console.log(data) // 打印成功的信息
        } else {
          console.error('Server responded with status:', response.status, response.statusText)
        }
      } catch (error) {
        console.error(error) // 捕获在请求过程中发生的错误
        setActive(active)
      }
    } else {
      setActive(active)
      Toast.error('No file selected')
      console.log('No file selected')
    }
  }

  const uploadFileClient = async () => {
    setActive(true)
    if (selectedFile) {
      const timestamp = Date.now() // 创建时间戳
      const originalFileName = selectedFile.name // 获取原始文件名
      const newFileName = `${timestamp}-${originalFileName}` // 创建新的文件名

      // 创建FormData
      const formData = new FormData()
      formData.append('file', selectedFile, newFileName)

      try {
        const {signsecret, date, url} = await getUploadSecret(newFileName)
        console.log(signsecret, date, url)

        const headers = new Headers()
        headers.append('Authorization', signsecret)
        headers.append('Date', date)

        const response = await fetch(url, {
          method: 'PUT',
          headers: headers,
          body: formData
        })

        console.log(response)

        if (response.ok) {
          const data = await response.json()
          Toast.success(`${data.message}`)
          console.log(data) // 打印成功的信息
        } else {
          console.error('Server responded with status:', response.status, response.statusText)
          Toast.error(`Upload failed: ${response.statusText}`)
        }
      } catch (error) {
        console.error(error) // 捕获在请求过程中发生的错误
        Toast.error('Upload failed')
      } finally {
        setActive(false) // 确保在操作结束后禁用按钮
      }
    } else {
      Toast.error('No file selected')
      console.log('No file selected')
      setActive(false)
    }
  }

  const uploadModalHeader = () => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold py-6">上传文件</span>
        {uploadModeSelect()}
      </div>
    )
  }

  const uploadModeSelect = () => {
    return (
      <Dropdown
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setUploadMode('upyunServer')}>服务端上传</Dropdown.Item>
            <Dropdown.Item onClick={() => setUploadMode('upyunClient')}>客户端上传（实验性）</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button>上传模式：{uploadMode === 'upyunServer' ? '服务端' : '客户端'}</Button>
      </Dropdown>
    )
  }

  return (
    <div className=" max-w-lg">
      <Button onClick={() => setModalVisible(true)}>上传文件</Button>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} header={uploadModalHeader()} footer={null}>
        <div className="flex flex-col gap-2 pb-6">
          <input type="file" name="file" id="file" onChange={fileInputChange} className={`block bg-gray-100 p-2 text-center rounded`}></input>
          <button onClick={uploadFile} className={`${active ? 'bg-indigo-500' : 'bg-gray-600'} block text-white p-2 text-center rounded transition-all`}>
            点击上传
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ImageUploader

'use client'
import React, { useState } from 'react';
import { uploadFileToUpyun, uploadFileToUpyunUrl } from '@/libs/getUpyunFiles'
import { Button, Upload } from '@douyinfe/semi-ui'

const dateJson = new Date().toJSON();
const date = new Date().toUTCString();
console.log(dateJson)

export default function UpLoadFile() {

  const serverName = process.env.UPYUN_FILE_SERVER_NAME // 服务名称
  const path = process.env.UPYUN_FILE_SERVER_FILE_DIRECTORY // 目录
  const upyunUrl = "http://v0.api.upyun.com/"
  const action = upyunUrl + serverName + path

  const signsecret = uploadFileToUpyunUrl()
  const headers = new Headers()
  headers.append('Authorization', signsecret);
  headers.append('Date', date);
  // console.log(headers)

  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputChange = (e: any) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (selectedFile) {

      const formData = new FormData()
      formData.append('file', selectedFile)

      fetch(action, {
        method: 'PUT',
        headers: headers,
        body: formData
      }).then((response) => response.json())
        .then((data) => console.log(data))
        .catch(error => {
          console.log(error)
        })
    }
  }

  const uploadFile = uploadFileToUpyun.bind(selectedFile)

  return (
    <div>
      <form action={uploadFile}>
        <input type='file' onChange={fileInputChange}></input>
        <button type='submit' >提交</button>
      </form>
    </div>
  )
}


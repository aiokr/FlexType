"use client"
import React, { useState } from 'react';
const dateString = new Date().toLocaleString('zh-cn')

const ImageUploader = () => {
  // 创建一个状态变量来存储选定的文件
  const [selectedFile, setSelectedFile] = useState(null);

  // 当文件输入变化时，更新状态
  const fileInputChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  // 处理文件上传的逻辑
  const uploadFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.set("file", selectedFile);
      try {
        const response = await fetch('/api/upload', {
          method: 'PUT',
          body: formData
        });

        if (response.ok) {
          const data = await response.json(); // 等待响应的JSON数据
          console.log(data); // 打印成功的信息
        } else {
          console.error('Server responded with a status:', response.status);
        }
      } catch (error) {
        console.error(error); // 捕获在请求过程中发生的错误
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div>
      <input type='file' name='file' onChange={fileInputChange}></input>
      {/* 添加一个按钮来触发上传 */}
      <button onClick={uploadFile}>Upload</button>
    </div>
  )
}

export default ImageUploader;

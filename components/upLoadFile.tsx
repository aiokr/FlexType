"use client"
import React, { useState } from 'react';
import { Collapse, Toast } from '@douyinfe/semi-ui';

const ImageUploader = () => {
  // 明确 selectedFile 的类型为 File | null
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 当文件输入变化时，更新状态
  const fileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 检查文件是否存在于事件对象中
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 处理文件上传的逻辑
  const uploadFile = async () => {
    if (selectedFile) {
      const formData = new FormData();

      // 获取原始文件名
      const originalFileName = selectedFile.name;

      // 创建时间戳
      const timestamp = Date.now();

      // 创建新的文件名：时间戳 + 原始文件名
      const newFileName = `${timestamp}-${originalFileName}`;

      // 将文件添加到FormData中，并使用新的文件名
      formData.append("file", selectedFile, newFileName);

      try {
        const response = await fetch('/api/upload', {
          method: 'PUT',
          body: formData
        });

        if (response.ok) {
          const data = await response.json(); // 等待响应的JSON数据
          Toast.success(`Upload success`);
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
    <div className=' max-w-lg'>
      <Collapse>
        <Collapse.Panel header="上传文件" itemKey="1">
          <div className='flex flex-col gap-2'>
            <input type='file' name='file' id='file' onChange={fileInputChange} className={`block bg-gray-100 p-2 text-center rounded`}></input>
            <button onClick={uploadFile} className='block text-white bg-indigo-500 p-2 text-center rounded'>点击上传</button>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ImageUploader;

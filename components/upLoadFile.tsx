'use client'

const ImageUploader = () => {

  const fileInputChange = async (e: any) => { // 将函数标记为异步
    const selectedFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch('/api/upload', { // 等待fetch调用完成
        method: 'PUT',
        body: formData
      });

      if (response.ok) { // 检查响应是否成功
        const data = await response.json(); // 等待响应的JSON数据
        console.log(data); // 打印成功的信息
      } else {
        console.error('Server responded with a status:', response.status);
      }
    } catch (error) {
      console.error(error); // 捕获在请求过程中发生的错误
    }
  }

  return (
    <div>
      <input type='file' onChange={fileInputChange}></input>
    </div>
  )
}

export default ImageUploader;
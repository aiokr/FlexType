import { uploadFileToUpyun } from "@/libs/getUpyunFiles"
import { auth } from "auth"

export async function PUT(req: any, res: any) {
  const formData = await req.formData();

  // 假设只有一个文件和其他字段
  let file;
  for (let [key, value] of formData.entries()) {
    if (key === 'file') {
      file = value; // 这里获取文件对象
      break;
    }
  }

  // 检查是否找到文件
  if (!file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // 如果uploadFileToUpyun函数接受File对象作为参数
  const response = await uploadFileToUpyun(file);
  console.log(response)

  if (!response) {
    return Response.json({ message: "Upload failed" }, { status: 500 })
  } else if (response.status == 200) {
    return Response.json({ message: "Upload success" }, { status: 200 })
  }
}
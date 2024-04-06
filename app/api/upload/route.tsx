import { uploadFileToUpyun } from "@/libs/getUpyunFiles"
import AuthSession from '@/components/getAuthSession'
import prisma from '@/libs/prisma'

export async function PUT(req: any, res: any) {
  const session = await AuthSession()
  const userName = session.user.name
  const existingUser = await prisma.user.findMany({
    where: {
      name: userName,
      role: 'ADMIN' || 'EDITOR',
    }
  });
  const userID = existingUser[0].id

  if (session && existingUser.length !== 0) {
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
    const response = await uploadFileToUpyun(file, userID);

    if (!response) {
      return Response.json({ message: "Upload failed no response" }, { status: 500 })
    } else if (response.uploadFile.status == 200) {
      return Response.json({ message: "Upload success" }, { status: 200 })
    } else if (response.uploadFile.status) {
      return Response.json({ message: response.uploadFile.statusText }, { status: response.uploadFile.status })
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
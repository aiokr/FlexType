import { uploadFileToUpyun } from "@/libs/upyunFilesOperator"
import { createClient } from '@/utils/supabase/server'
import prisma from '@/libs/prisma'

export async function PUT(req: any, res: any) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const userId = data.user.id
  const existingUser = await prisma.user.findMany({
    where: {
      uid: userId,
      role: 'ADMIN' || 'EDITOR',
    }
  });
  const userID = existingUser[0].id

  if (data && existingUser.length !== 0) {
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
      return Response.json({ message: `Upload success, File ID is ${response.uploadFileResult}` }, { status: 200 })
    } else if (response.uploadFile.status) {
      return Response.json({ message: response.uploadFile.statusText }, { status: response.uploadFile.status })
    }
  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
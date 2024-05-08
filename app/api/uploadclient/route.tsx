import { getUploadSecret } from "@/libs/upyunFilesOperator"
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

  if (data && existingUser.length !== 0) {
    const formData = await req.formData();
    const filename = formData.get('file').name;
    console.log(filename)
    const uploadSecret = await getUploadSecret(filename)
    console.log(uploadSecret.signsecret, uploadSecret.upuri)
    return Response.json(uploadSecret)
  }

  else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
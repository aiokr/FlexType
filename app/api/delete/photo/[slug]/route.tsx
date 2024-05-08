import { createClient } from '@/utils/supabase/server'
import prisma from '@/libs/prisma'
import { errorToJSON } from 'next/dist/server/render';

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
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
    const delItemId = params.slug.toString()

    const delFlowItem = await prisma.photo.delete({
      where: {
        id: delItemId
      }
    })

    return Response.json({ message: "Success Deleted Item" }, { status: 200 })

  } else {
    return Response.json({ message: "Not authenticated" }, { status: 403 })
  }
}
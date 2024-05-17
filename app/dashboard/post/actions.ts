"use server"
import prisma from '@/libs/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getUserData() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const userData = await prisma.user.findUnique({ where: { uid: data.user?.id } })
  const userId = userData?.id
  return { userId }
}

export async function addNewPost() {
  const { userId } = await getUserData()
  const newDraft = await prisma.draftPaper.create({
    data: {
      userId: userId,
      mainText: [{}]
    }
  })

  const newPost = await prisma.post.create({
    data: {
      userId: userId,
      currentDraftId: newDraft.id,
      Title: 'New Post',
      History: [
        {
          draftId: newDraft.id,
          version: 1
        }
      ],
      published: false
    }
  })

  redirect('./editor/' + newPost.id)
}
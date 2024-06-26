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

export async function addNewDraft() {
  const { userId } = await getUserData()
  const newDraft = await prisma.draftPaper.create({
    data: {
      userId: userId,
      mainText: [{}]
    }
  })
  const newDraftId: number = newDraft.id
  redirect('./editor/' + newDraftId)
}

export async function updateDraft(draftId: any, text: any) {
  const { userId } = await getUserData()
  if (Array.isArray(text) && text.length === 0) {
    // console.log('array is empty')
    return
  } else {
    await prisma.draftPaper.update({
      where: {
        id: parseInt(draftId)
      },
      data: {
        uplishedAt: new Date(),
        mainText: text
      }
    }).then(() => {
      // console.log('保存完成: ' + new Date())
    })
    return
  }
}

export async function getDraftPaperData(draftId: any) {
  const { userId } = await getUserData()
  const draftPaperData = await prisma.draftPaper.findUnique({
    where: {
      id: parseInt(draftId)
    }
  })
  return draftPaperData
}
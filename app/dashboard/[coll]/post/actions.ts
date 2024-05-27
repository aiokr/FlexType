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
      currentVersion: 1,
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

// 将文章的当前状态保存为版本，并新建一个新版本
export async function saveAsVersion(postId: any) {
  const { userId } = await getUserData()

  // 获取当前文章的当前版本
  const currentPost = await prisma.post.findUnique(
    {
      where: { id: parseInt(postId) }
    }
  )
  const currentVersion: number = currentPost.currentVersion  // 当前文章的版本号
  const currentDraftId: number = currentPost.currentDraftId  // 获取当前版本对应的的稿纸 Id
  const currentHistoryData: any = currentPost.History  // 获取当前文章的历史版本数据

  // 获取当前版本对应的的稿纸数据
  const currentDraftPaperData = await prisma.draftPaper.findUnique(
    {
      where: { id: currentDraftId }
    }
  )

  // 拼接新版本稿纸
  const newDraftPaper = await prisma.draftPaper.create({
    data: {
      userId: userId,
      mainText: currentDraftPaperData?.mainText
    }
  })

  const newDraftPaperId: number = newDraftPaper.id
  const newVersion = currentVersion + 1   // 新版本的版本号
  const newHistoryData = [...currentHistoryData, { draftId: newDraftPaperId, version: newVersion, createAt: new Date() }];

  // 更新当前文章的当前版本
  const newPost = await prisma.post.update({
    where: { id: parseInt(postId) },
    data: {
      currentDraftId: newDraftPaperId,
      currentVersion: newVersion,
      History: newHistoryData
    }
  })

  const handleNewVersion = () => {
    newPost
    redirect('./' + newPost.id)
  }

  return (handleNewVersion())
}

// 修改文章信息
export async function editPostInfo(postId: any, editedPostInfo: any) {
  const { userId } = await getUserData()
  const newPost = await prisma.post.update({
    where: { id: parseInt(postId) },
    data: {
      Title: editedPostInfo.Title,
      published: editedPostInfo.published,
      collectionSlug: editedPostInfo.collectionSlug,
      uplishedAt: new Date(),
    }
  })
  console.log(newPost)
  return (newPost)
}
import prisma from '@/libs/prisma'
import dynamic from 'next/dynamic'
import {Breadcrumb} from 'antd'
import {EditorClient} from './editorClient'

const Editor = dynamic(() => import('@/components/BlockEditor'), {ssr: false})

export default async function EditorPage(props: any) {
  const postId = props.params.slug

  // 查询文章的数据
  const postData = await prisma.post.findUnique({
    where: {
      id: parseInt(postId)
    }
  })
  const draftPaperId = postData?.currentDraftId
  const draftPaperData = await prisma.draftPaper.findUnique({
    where: {
      id: draftPaperId
    }
  })
  const draftPaperMainText = draftPaperData?.mainText

  // 所属的内容集
  const collectionSlug = postData?.collectionSlug
  const collectionName = (
    await prisma.collection.findUnique({
      where: {
        slug: collectionSlug
      }
    })
  ).name

  const breadcrumbItem = [
    {title: '首页', href: '/'},
    {title: '仪表盘', href: '/dashboard'},
    {title: `${collectionName}`, href: `/dashboard/${collectionSlug}`},
    {title: '文章', href: '/dashboard/post'},
    {title: postData?.Title, herf: `/dashboard/editor/${postId}`}
  ]

  return (
    <div className="relative px-4 pt-4 h-screen overflow-y-auto no-scrollbar">
      <Breadcrumb items={breadcrumbItem} className="absolute" />
      <section className="flex flex-col mx-auto overflow-x-hidden max-w-[1000px] pt-8 h-[calc(100%-22px)] no-scrollbar">
        <EditorClient data={postData} />
        <Editor postId={postId} postData={postData} id={draftPaperId} data={draftPaperMainText} />
      </section>
    </div>
  )
}

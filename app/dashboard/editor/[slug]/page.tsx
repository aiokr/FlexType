import prisma from '@/libs/prisma'
import dynamic from 'next/dynamic'
import {Breadcrumb} from 'antd'
import {EditorClient} from './editorClient'

const Editor = dynamic(() => import('@/components/BlockEditor'), {ssr: false})

export default async function EditorPage(props: any) {
  const postId = props.params.slug
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

  const breadcrumbItem = [
    {title: '首页', href: '/'},
    {title: '仪表盘', href: '/dashboard'},
    {title: '文章', href: '/dashboard/post'},
    {title: postData?.Title, herf: `/dashboard/editor/${postId}`}
  ]

  return (
    <div className="px-2 md:px-0 pt-4 h-full">
      <Breadcrumb items={breadcrumbItem} />
      <section className="flex flex-col mx-auto overflow-x-hidden max-w-[1000px] pt-4  h-[calc(100%-22px)]">
        <EditorClient data={postData} />
        <Editor postId={postId} postData={postData} id={draftPaperId} data={draftPaperMainText} />
      </section>
    </div>
  )
}

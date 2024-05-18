import prisma from '@/libs/prisma'
import dynamic from 'next/dynamic'

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

  return (
    <div className="pt-14 md:pt-0 overflow-y-auto mt-4 w-full">
      <div className="container mx-auto h-full">
        <section className="flex flex-col mx-auto h-full overflow-x-hidden max-w-[1000px]">
          <h1 className="text-2xl font-bold px-4 pb-3">{postData?.Title}</h1>
          <Editor postId={postId} postData={postData} id={draftPaperId} data={draftPaperMainText} />
        </section>
      </div>
    </div>
  )
}

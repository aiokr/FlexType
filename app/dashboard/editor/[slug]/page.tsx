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
    <div className="container mx-auto w-svw md:w-[90svw] lg:w-[80svw]">
      <section className="flex flex-col w-full md:w-[90%] lg:w-[80%] mx-auto">
        <h1 className="text-2xl font-bold md:px-[54px]">{postData?.Title}</h1>
        <Editor id={draftPaperId} data={draftPaperMainText} />
        <div>
          <button className="text-sm text-center leading-5 w-full py-2 text-white bg-main font-bold rounded hover:shadow-lg transition-all">Save</button>
        </div>
      </section>
    </div>
  )
}

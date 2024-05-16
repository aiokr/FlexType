import prisma from '@/libs/prisma'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/BlockEditor'), {ssr: false})

export default async function EditorPage(props: any) {
  const draftPaperId = props.params.slug
  const draftPaperData = await prisma.draftPaper.findUnique({
    where: {
      id: parseInt(draftPaperId)
    }
  })
  const draftPaperMainText = draftPaperData?.mainText

  return (
    <div className="container w-[80svw] mx-auto ">
      <section className="w-full flex flex-col ">
        {props.params.slug}
        <div>{JSON.stringify(draftPaperMainText)}</div>
        <Editor id={draftPaperId} data={draftPaperMainText} />
      </section>
    </div>
  )
}

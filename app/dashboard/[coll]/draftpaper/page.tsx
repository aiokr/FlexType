import Link from 'next/link'
import prisma from '@/libs/prisma'
import {CreateNewDraftPaper} from './draftPaperClient'

export default async function DraftPaperPage() {
  const draftpaperItem = await prisma.draftPaper.findMany()
  return (
    <div className="container mx-auto px-2 md:px-0 w-svw md:w-[800px] ">
      <div className="text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3">
        <Link href={'/'}>首页</Link>
        <> / </>
        <Link href={'/dashboard'}>仪表盘</Link>
        <> / </>
        <Link href={'/dashboard/draftpaper'}>稿纸</Link>
      </div>
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">稿纸</div>
      <CreateNewDraftPaper />
      {draftpaperItem.map((draftpaper) => (
        <div key={draftpaper.id} className="py-4">
          <Link href={`/dashboard/editor/${draftpaper.id}`} target="_blank">
            {draftpaper.id}
          </Link>
        </div>
      ))}
    </div>
  )
}

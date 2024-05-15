import Link from 'next/link'
export default async function DraftPaperPage() {
  return (
    <div className="container mx-auto px-2 md:px-0 w-svw md:w-[800px] ">
      <div className="text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3">
        <Link href={'/'}>首页</Link>
        <> / </>
        <Link href={'/dashboard'}>仪表盘</Link>
        <> / </>
        <Link href={'/dashboard/post'}>文章</Link>
      </div>
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">文章</div>
    </div>
  )
}

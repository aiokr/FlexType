"use client"

import Link from 'next/link'

export default function HorizontalNavMenu(data: any) {
  return (
    <div className="grid grid-cols-2 gap-4 items-start px-12">
      {data.data.map((item: any) => (
        <div key={item.itemKey} className="flex flex-col items-center">
          <Link href={item.itemKey} className='flex flex-row gap-6 text-sm font-bold'>
            {item.text}
          </Link>
        </div>
      ))}
    </div>
  )
}
"use client"

import Link from 'next/link'

export default function HorizontalNavMenu(data: any) {
  return (
    <div className="flex flex-col gap-4 items-start px-12">
      {data.data.map((item: any) => (
        <div key={item.itemKey} className="flex flex-col items-center">
          <Link href={item.itemKey} className='flex flex-row gap-6 text-sm font-bold'>
            <i className='inline-flex w-6 h-6'>{item.icon}</i>
            {item.text}
          </Link>
        </div>
      ))}
    </div>
  )
}
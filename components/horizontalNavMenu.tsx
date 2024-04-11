"use client"

import Link from 'next/link'

export default function HorizontalNavMenu({data, clickItem}: any) {
  return (
    <div className="grid grid-cols-2 gap-4 items-start px-12">
      {data.map((item: any) => (
        <div key={item.itemKey} className="flex flex-col items-center">
          <button onClick={() => clickItem(item.link)} className='flex flex-row gap-6 text-sm font-bold'>
            {item.text}
          </button>
        </div>
      ))}
    </div>
  )
}
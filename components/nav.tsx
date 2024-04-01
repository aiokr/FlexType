'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div className='position-fixed my-auto mx-0 h-14 border flex px-4 gap-4'>
      <Link href='/' className='flex items-center'>Home</Link>
      <Link href='/auth/signin' className='flex items-center'>signin</Link>
      <Link href='/auth/signout' className='flex items-center'>signout</Link>
      <Link href='/dashboard' className='flex items-center'>dashboard</Link>
    </div>
  )
}
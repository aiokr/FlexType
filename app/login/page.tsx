"use client"
import { login, signup } from './actions'
import Image from 'next/image';
import { Input } from '@douyinfe/semi-ui';

const coverUrl: string = 'https://images.unsplash.com/photo-1715354378861-1a0f0e38c470?q=80&w=3529&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function LoginPage() {
  return (
    <div className='w-screen h-screen flex items-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 md:shadow-2xl md:w-[800px] lg:w-[1000px] mx-auto'>
        <div className='hidden md:block'>
          <Image src={coverUrl} alt="logo"
            width={600} height={600} className='object-cover h-[600px]' />
        </div>
        <form className='flex flex-col items-start justify-center p-12 gap-3 '>
          <div className='flex items-center gap-2 w-full pb-8'>
            <Image src="/icon.png" alt="logo" width={50} height={50} /><span className='text-xl font-bold'>FlexType</span>
          </div>
          <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>Email:</label>
          <input id="email" name="email" type="email" required className='text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded' />
          <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-900'>Password:</label>
          <input id="password" name="password" type="password" required className='text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded' />
          <button formAction={login} className='text-sm text-center leading-5 w-full py-2 text-white bg-main font-bold rounded hover:shadow-lg transition-all'>Login</button>
        </form>
      </div>
    </div>
  )
}
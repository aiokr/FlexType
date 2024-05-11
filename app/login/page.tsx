'use client'
import {login, signup, signInWithGithub} from './actions'
import Image from 'next/image'
import {Input} from '@douyinfe/semi-ui'
import {IconGithub} from '@/assets/icons'

const coverUrl: string =
  'https://images.unsplash.com/photo-1612962280801-05d09bb6244c?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex items-center bg-white md:bg-[#222831ef] ">
      <Image src={coverUrl} alt="logo" width={600} height={600} className="hidden md:block md:fixed w-screen h-screen object-cover -z-10" />
      <div className="md:grid md:grid-cols-2 md:shadow-2xl w-full md:w-[800px] lg:w-[1000px] min-h-[600px] mx-auto">
        <div className="hidden p-6 md:p-12 lg:p-16 md:block bg-main">
          <div className="flex flex-col h-full gap-2 text-white font-bold text-3xl justify-center">
            <span>The Next Way</span>
            <span>To Show Yourself.</span>
          </div>
        </div>
        <div className="min-h-[400px] flex flex-col justify-between p-6 md:p-12 lg:p-16 bg-white">
          <form className="flex flex-col items-start justify-center gap-3">
            <div className="flex items-center gap-2 w-full pb-8">
              <Image src="/icon.png" alt="logo" width={50} height={50} />
              <span className="text-xl font-bold">FlexType</span>
            </div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email:
            </label>
            <input id="email" name="email" type="email" required className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded" />
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password:
            </label>
            <input id="password" name="password" type="password" required className="text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded" />
            <button
              formAction={login}
              className="text-sm text-center leading-5 w-full py-2 text-white bg-main font-bold rounded hover:shadow-lg transition-all"
            >
              Login
            </button>
          </form>
          <div className="flex gap-2">
            <button onClick={() => signInWithGithub()} className=" text-gray-300">
              <IconGithub />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import InterfaceSettings from './InterfaceSettings'
import AccountSettings from './AccountSettings'
import {IconMore} from '@/assets/icons'
import {Breadcrumb} from 'antd'

export default async function Settings(paramsData: any) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()

  const breadcrumbItem = [
    {title: '首页', href: '/'},
    {title: '仪表盘', href: '/dashboard'},
    {title: '设置', href: `/dashboard/${paramsData.params.coll}/assets`}
  ]

  console.log('This is origin settings route server')

  return (
    <div className="pt-14 md:pt-0 overflow-y-auto mt-4 w-full">
      <div className="container px-2 md:px-0 w-svw md:w-[800px] ">
        <Breadcrumb items={breadcrumbItem} className="inline-block text-xs" />
        <div className="text-2xl font-bold pt-2 py-4 md:py-4">设置</div>
        <h2 className="text-xl font-bold pt-2 pb-4">账户设置</h2>
        <AccountSettings />
        <h2 className="text-xl font-bold pt-6 pb-4">界面设置</h2>
        <InterfaceSettings />
        <h2 className="text-xl font-bold pt-6 pb-4">功能管理</h2>
        <Link href=""> self </Link>
      </div>
    </div>
  )
}

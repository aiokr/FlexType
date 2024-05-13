import Link from 'next/link'
import Image from 'next/image'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import InterfaceSettings from './InterfaceSettings'
import AccountSettings from './AccountSettings'
import {IconMore} from '@/assets/icons'
import {Modal} from '@douyinfe/semi-ui'

export default async function Settings() {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-2 md:px-0 w-svw md:w-[800px] ">
      <div className="text-xs text-gray-300 pt-1 md:pt-2 lg:pt-3">
        <Link href={'/'}>首页</Link>
        <> / </>
        <Link href={'/dashboard'}>仪表盘</Link>
        <> / </>
        <Link href={'/dashboard/settings'}>设置</Link>
      </div>
      <div className="text-2xl font-bold pt-2 py-4 md:py-4">设置</div>
      <h2 className="text-xl font-bold pt-2 pb-4">账户设置</h2>
      <AccountSettings />
      <h2 className="text-xl font-bold pt-6 pb-4">界面设置</h2>
      <InterfaceSettings />
      <h2 className="text-xl font-bold pt-6 pb-4">功能管理</h2>
    </div>
  )
}

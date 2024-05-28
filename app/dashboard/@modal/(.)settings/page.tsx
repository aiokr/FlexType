import Link from 'next/link'
import Image from 'next/image'
import {redirect} from 'next/navigation'
import {createClient} from '@/utils/supabase/server'
import InterfaceSettings from '@/app/dashboard/settings/InterfaceSettings'
import AccountSettings from '@/app/dashboard/settings/AccountSettings'
import {Breadcrumb} from 'antd'
import {SettingsModel} from './SettingsModelClient'

export default async function ModalSettings(params: any) {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()

  const breadcrumbItem = [
    {title: '首页', href: '/'},
    {title: '仪表盘', href: '/dashboard'},
    {title: '设置', href: `/dashboard/settings`}
  ]

  return (
    <SettingsModel>
      <Breadcrumb items={breadcrumbItem} />
    </SettingsModel>
  )
}

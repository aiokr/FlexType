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

  return (
    <SettingsModel>
      <h2 className="text-xl font-bold pt-2 pb-4">账户设置</h2>
      <AccountSettings />
      <h2 className="text-xl font-bold pt-6 pb-4">界面设置</h2>
      <InterfaceSettings />
      <h2 className="text-xl font-bold pt-6 pb-4">功能设置</h2>
    </SettingsModel>
  )
}

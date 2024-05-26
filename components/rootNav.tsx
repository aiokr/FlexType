'use client'
import React, {createContext, useContext, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {FileIcon, PhotoIcon, SettingIcon} from '@/assets/icons'
import {useRouter} from 'next/navigation'
import {signOut} from '@/app/login/actions'
import {Layout, Menu, Button, Popover, Select} from 'antd'
import type {MenuProps} from 'antd'

const {Header, Content, Footer, Sider} = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  type: 'group' | 'divider' | 'dropdown' | 'item',
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    type,
    key,
    icon,
    children,
    label
  } as MenuItem
}

// 导航内容
const items = (currentCollectionSlug: string) => [
  getItem('item', <Link href={`/dashboard`}>仪表盘</Link>, 'dashboard', <SettingIcon className="h-5 w-5" />),
  getItem('group', '内容集', 'collectionItem'),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}`}>内容集首页</Link>, 'collectionDashboard', <SettingIcon className="h-5 w-5" />),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}/post`}>文章</Link>, 'posts', <FileIcon className="h-5 w-5" />),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}/flow`}>照片流</Link>, 'photos', <PhotoIcon className="h-5 w-5" />),
  getItem('group', '全局', 'nonCollection'),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}/assets`}>文件管理</Link>, 'assets', <FileIcon className="h-5 w-5" />),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}/collection`}>内容集管理</Link>, 'collections', <SettingIcon className="h-5 w-5" />),
  getItem('item', <Link href={`/dashboard/${currentCollectionSlug}/settings`}>设置</Link>, 'settings', <SettingIcon className="h-5 w-5" />)
]

// AntD 导航
export function RootNav(props: any) {
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const {loginUserAvatar, data, userData, collectionItem, currentCollection} = props // 从 Layout 获取数据

  // 内容集选项列表
  const collectionSelectItems = collectionItem.map((item: any) => {
    return {label: item.name, value: item.id, slug: item.slug}
  })

  // 切换内容集
  const handleCollectionChange = (value: number) => {
    console.log('handleCollectionChange value: ', value)
    if (value === 0) {
      router.push(`/dashboard/all`)
    } else {
      const newCollectionSlug = collectionItem.find((item: any) => item.id === value).slug
      console.log(`Selected Collection ${value} - ${newCollectionSlug}`)
      router.push(`/dashboard/${newCollectionSlug}`)
    }
  }

  collectionSelectItems.push({label: 'All Collections', value: 0, slug: 'all'}) // 增加一个全部内容集

  // 内容集搜索
  const filterOption = (input: string, option?: {label: string; value: string}) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  // 头像 Popover
  const PopoverContent = ({data, userData}: any) => {
    if (data) {
      return (
        <div className="p-1">
          <div className="text-lg font-bold">{userData.name}</div>
          <div className="">{data.user.email}</div>
          <div className="flex gap-2 pt-4">
            <Button href="/dashboard/settings">设置</Button>
            <Button danger onClick={() => signOut()}>
              退出
            </Button>
          </div>
        </div>
      )
    }
  }

  const currentCollectionId = currentCollection.length == 0 ? 0 : currentCollection[0].id

  const menuItems = currentCollection.length == 0 ? items('all') : items(currentCollection[0].slug)

  return (
    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
      <div className="w-full py-6 text-xl font-semibold flex items-center justify-center gap-2 transition-all">
        <Popover content={PopoverContent({data, userData})}>
          <Image src={loginUserAvatar} alt="avatar" width={32} height={32} className="rounded-full" unoptimized />
        </Popover>
        <button className={`${!collapsed ? 'inline-block' : 'hidden'}`}>FlexType /</button>
      </div>
      <div className="w-full pb-6 flex items-center justify-center">
        <Select
          options={collectionSelectItems} // 内容集选项列表
          defaultValue={currentCollectionId} // 当前内容集
          showSearch
          placeholder="选择内容集"
          onChange={(value) => handleCollectionChange(value)}
          filterOption={filterOption}
          style={{width: 120}}
        ></Select>
      </div>
      <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={menuItems} className="w-full pb-auto" />
    </Sider>
  )
}

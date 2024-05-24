'use client'
import React, {createContext, useContext, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Nav, Avatar, Collapsible, List} from '@douyinfe/semi-ui'
import {FileIcon, PhotoIcon, SettingIcon} from '@/assets/icons'
import HorizontalNavMenu from './horizontalNavMenu'
import {redirect, useRouter} from 'next/navigation'
import {signOut} from '@/app/login/actions'
import {Dropdown, Layout, Menu, Button, Popover, Select} from 'antd'
import type {MenuProps} from 'antd'

const {Header, Content, Footer, Sider} = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

// 导航内容
const items: MenuItem[] = [
  getItem(<Link href={'/dashboard'}>仪表盘</Link>, 'dashboard', <SettingIcon className="h-5 w-5" />),
  getItem(<Link href={'/dashboard/post'}>文章管理</Link>, 'posts', <FileIcon className="h-5 w-5" />),
  getItem(<Link href={'/dashboard/flow'}>照片流</Link>, 'photos', <PhotoIcon className="h-5 w-5" />),
  getItem(<Link href={'/dashboard/assets'}>文件管理</Link>, 'assets', <FileIcon className="h-5 w-5" />),
  getItem(<Link href={'/dashboard/collection'}>内容集</Link>, 'collections', <SettingIcon className="h-5 w-5" />),
  getItem(<Link href={'/dashboard/settings'}>设置</Link>, 'settings', <SettingIcon className="h-5 w-5" />)
]

// 切换内容集

const handleCollectionChange = (value: string) => {
  console.log(`Selected Collection ${value}`)
}

// AntD 导航
export function RootNav(props: any) {
  const [collapsed, setCollapsed] = useState(false)
  const {loginUserAvatar, data, userData, collectionItem} = props

  // 内容集
  const collectionSelectItems = collectionItem.map((item: any) => {
    return {
      label: item.name,
      value: item.id
    }
  })

  collectionSelectItems.push({
    label: 'All Collections',
    value: 0
  })

  console.log(collectionSelectItems)

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
          options={collectionSelectItems}
          defaultOpen={false}
          showSearch
          placeholder="选择内容集"
          onChange={(value) => handleCollectionChange(value)}
          filterOption={filterOption}
          style={{width: 120}}
        ></Select>
      </div>
      <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} className="w-full pb-auto" />
    </Sider>
  )
}

"use client"

import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { Nav, Avatar, Dropdown, Select, Button, List } from '@douyinfe/semi-ui';
import { createContext, useContext, useState } from 'react';
import CollapseButton from '@douyinfe/semi-ui/lib/es/navigation/CollapseButton';
import { AssetsIcon, SettingsIcon } from '@/assets/icons';

// 导航内容

const navItem = [
  { itemKey: 'posts', text: '文章管理' },
  { itemKey: 'tags', text: '标签管理' },
  { itemKey: 'categories', text: '分类管理' },
  { itemKey: 'photos', text: '图片管理' },
  { itemKey: 'albums', text: '影集管理' },
  { itemKey: 'assets', text: '文件管理', link: '/dashboard/assets', icon: <AssetsIcon /> },
  { itemKey: 'sites', text: '站点管理' },
  { itemKey: 'settings', text: '设置', icon: <SettingsIcon /> },
];

const menu = navItem.map((item) => {
  return {
    node: 'item',
    name: item.text,
    type: 'primary',
  }
})

export function navLogo(loginUserAvatar: string, position: any) {
  return (
    <Dropdown
      position={position}
      render={
        <Dropdown.Menu>
          {loginUserAvatar == '/icon.png' ?
            (
              <Dropdown.Item><Link href={'/auth/signin'}>登录</Link></Dropdown.Item>
            ) : (
              <Dropdown.Item><Link href={'/auth/signout'}>退出</Link></Dropdown.Item>
            )
          }
        </Dropdown.Menu>
      }
    >
      <Image src={loginUserAvatar} alt="avatar" width={32} height={32} className='rounded-full' unoptimized />
    </Dropdown>
  )
}

const navText = (
  <div className="text-xl font-semibold pr-2">FlexType /</div>
)

// 定义横向导航
export function RenderHorizontal({ loginUserAvatar }: any) {

  const horizontalHeader = (
    { navText }
  )
  return (
    <Nav
      className='inline-flex md:!hidden absolute'
      mode={'horizontal'}
      header={navText}
      onSelect={key => console.log(key)}
      footer={navLogo(loginUserAvatar, 'bottom')}
    />
  );
}

// 定义纵向导航
export function RenderVertical({ loginUserAvatar }: any) {

  const [verticalItems, setverticalItems] = useState(navItem);
  return (
    <Nav
      className='!hidden md:!inline-flex h-screen'
      style={{ zIndex: 1 }}
      items={verticalItems}
      onSelect={key => console.log(key)}
      header={{
        logo: navLogo(loginUserAvatar, 'bottomLeft'),
        text: navText,
      }}
      logo={{
        children: navLogo
      }}
      footer={{
        collapseButton: true,
      }}
    />
  );
}
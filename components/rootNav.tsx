"use client"

import React from 'react';
import Link from 'next/link'
import { Nav, Avatar, Dropdown, Select, Button } from '@douyinfe/semi-ui';
import { createContext, useContext, useState } from 'react';
import CollapseButton from '@douyinfe/semi-ui/lib/es/navigation/CollapseButton';

// 导航内容

const navItem = [
  { itemKey: 'posts', text: '文章管理' },
  { itemKey: 'tags', text: '标签管理' },
  { itemKey: 'categories', text: '分类管理' },
  { itemKey: 'photos', text: '图片管理' },
  { itemKey: 'albums', text: '影集管理' },
  { itemKey: 'assets', text: '文件管理', link: '/dashboard/assets' },
  { itemKey: 'sites', text: '站点管理' },
  { itemKey: 'settings', text: '设置' },
];

const menu = navItem.map((item) => {
  return {
    node: 'item',
    name: item.text,
    type: 'primary',
  }
})

const navLogo = (
  <Dropdown
    position='bottomLeft'
    render={
      <Dropdown.Menu>
        <Dropdown.Item><Link href={'/auth/signin'}>登录</Link></Dropdown.Item>
        <Dropdown.Item><Link href={'/auth/signout'}>退出</Link></Dropdown.Item>
      </Dropdown.Menu>
    }
  >
    <Avatar className='aspect-square font-semibold' size="small" color='light-blue' style={{ padding: 4 }}>FT/</Avatar>
  </Dropdown>
)

const navText = (
  <div className="text-xl font-semibold pr-2">FlexType /</div>
)

// 定义横向导航
export function RenderHorizontal() {

  const horizontalHeader = (
    { navText }
  )

  return (
    <Nav
      className='inline-flex md:!hidden absolute'
      mode={'horizontal'}
      header={navText}
      onSelect={key => console.log(key)}
      footer={
        <Dropdown
          render={
            <Dropdown.Menu>
              <Dropdown.Item><Link href={'/auth/signin'}>登录</Link></Dropdown.Item>
              <Dropdown.Item><Link href={'/auth/signout'}>退出</Link></Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar size="small" color='light-blue' style={{ margin: 4 }}></Avatar>
        </Dropdown>
      }
    />
  );
}

// 定义纵向导航
export function RenderVertical() {

  const [verticalItems, setverticalItems] = useState(navItem);

  return (
    <Nav
      className='!hidden md:!inline-flex h-screen'
      style={{ zIndex: 1 }}
      items={verticalItems}
      onSelect={key => console.log(key)}
      header={{
        logo: navLogo,
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
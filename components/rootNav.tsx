"use client"

import React from 'react';
import Link from 'next/link'
import { Nav, Avatar, Dropdown, Select, Button } from '@douyinfe/semi-ui';
import { createContext, useContext, useState } from 'react';

// 定义横向导航
export function RenderHorizontal() {
  const [horizontalItems, sethorizontalItems] = useState([
    { itemKey: 'home', text: '首页', link: '/' },
    { itemKey: 'dashboard', text: '管理控制台', link: '/dashboard' },
  ]);

  return (
    <Nav
      mode={'horizontal'}
      header={{
        text: '内容管理平台'
      }}
      items={horizontalItems}
      onSelect={key => console.log(key)}
      footer={
        <Dropdown
          position="bottomRight"
          render={
            <Dropdown.Menu>
              <Dropdown.Item><Link href={'/auth/signin'}>登录</Link></Dropdown.Item>
              <Dropdown.Item><Link href={'/auth/signout'}>退出</Link></Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar size="small" color='light-blue' style={{ margin: 4 }}>MC</Avatar>
        </Dropdown>
      }
    />
  );
}

// 定义纵向导航
export function RenderVertical() {

  const [verticalItems, setverticalItems] = useState([
    { itemKey: 'posts', text: '文章管理' },
    { itemKey: 'tags', text: '标签管理' },
    { itemKey: 'categories', text: '分类管理' },
    { itemKey: 'photos', text: '图片管理' },
    { itemKey: 'albums', text: '影集管理' },
    { itemKey: 'assets', text: '文件管理', link: '/dashboard/assets' },
    { itemKey: 'sites', text: '站点管理' },
    { itemKey: 'settings', text: '设置' },
  ]);

  return (
    <Nav
      style={{ height: '100%' }}
      items={verticalItems}
      onSelect={key => console.log(key)}
      footer={{
        collapseButton: true,
      }}
    />
  );
}
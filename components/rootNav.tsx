"use client"

import React from 'react';
import Link from 'next/link'
import { Nav, Avatar, Dropdown, Select, Button } from '@douyinfe/semi-ui';
import { createContext, useContext, useState } from 'react';
import { useFormState } from 'react-dom';
import useSWR from 'swr'

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
        text: '内容管理'
      }}
      items={horizontalItems}
      onSelect={key => console.log(key)}
      footer={
        <Dropdown
          position="bottomRight"
          render={
            <Dropdown.Menu>
              <Dropdown.Item>详情</Dropdown.Item>
              <Dropdown.Item onClick={() => console.log('退出')}>退出</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar size="small" color='light-blue' style={{ margin: 4 }}></Avatar>
          <span>{'UserName'}</span>
        </Dropdown>
      }
    />
  );
}

// 定义纵向导航
export function RenderVertical() {

  const [verticalItems, setverticalItems] = useState([
    { itemKey: 'user', text: '用户管理' },
    { itemKey: 'union', text: '活动管理' },
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
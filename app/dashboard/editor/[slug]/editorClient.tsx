'use client'

import {Descriptions} from 'antd'
import type {DescriptionsProps} from 'antd'

export const EditorClient = (data: any) => {
  const postData = data.data
  return (
    <div className="pl-12 pr-4 pb-3">
      <h1 className="text-2xl font-bold">{postData.Title}</h1>
    </div>
  )
}

'use client'

import {Modal} from '@douyinfe/semi-ui'
import {useState} from 'react'
import {IconMore} from '@/assets/icons/'

export function AccountClient(data: any, userData: any) {
  return (
    <>
      <Modal></Modal>
    </>
  )
}

export const AccountButton = () => {
  const [visible, setVisible] = useState(false)
  return (
    <button
      className="text-zinc-400 p-1"
      onClick={() => {
        console.log('click')
      }}
    >
      <IconMore />
    </button>
  )
}

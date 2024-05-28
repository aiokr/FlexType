'use client'

import {type ElementRef, useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {Modal} from 'antd'

export function SettingsModel({children}: {children: React.ReactNode}) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setVisible(true)
  }, [])

  function onDismiss() {
    router.back()
  }

  return createPortal(
    <Modal open={visible} className="modal" title="设置" onCancel={onDismiss}>
      {children}
    </Modal>,
    document.getElementById('modal-root')!
  )
}

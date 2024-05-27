'use client'

import {type ElementRef, useEffect, useRef} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'

export function Modal({children}: {children: React.ReactNode}) {
  const router = useRouter()
  const dialogRef = useRef<ElementRef<'dialog'>>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  function onDismiss() {
    console.log('onDismiss')
    router.back()
  }

  console.log('Modal Client')

  return createPortal(
    <div className="modal-backdrop">
      <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
        {children}
        <button onClick={onDismiss} className="btn" />
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  )
}

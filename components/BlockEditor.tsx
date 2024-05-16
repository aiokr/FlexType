'use client'

import React, {useState, useEffect, useCallback, useRef} from 'react'
import {Block} from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import {useCreateBlockNote} from '@blocknote/react'
import {BlockNoteView} from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

import {updateDraft} from '@/app/dashboard/draftpaper/actions'

// Our <Editor> component we can reuse later
export default function Editor({id, data}: {id: number; data: any}) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const lastSyncTimeRef = useRef<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: data
  })

  // This function will be called to update the draft
  const saveDraft = useCallback(() => {
    updateDraft(id, blocks)
    lastSyncTimeRef.current = new Date() // Update the last sync time
    console.log('draft saved')
  }, [id, blocks])

  const scheduleSaveDraft = useCallback(() => {
    // Clear any existing save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Calculate the time since the last sync
    const now = new Date()
    const timeSinceLastSync = lastSyncTimeRef.current ? now.getTime() - lastSyncTimeRef.current.getTime() : Infinity

    // If it's been more than 3 seconds since the last sync, save immediately
    if (timeSinceLastSync >= 6000) {
      saveDraft()
    } else {
      // Otherwise, set a timeout for the remaining time
      saveTimeoutRef.current = setTimeout(saveDraft, 3000 - timeSinceLastSync)
    }
  }, [saveDraft])

  useEffect(() => {
    // This effect does nothing on mount, but on unmount it will clear the timeout if it exists
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const changeHandler = () => {
    const newBlocks = editor.document
    setBlocks(newBlocks) // This will trigger the useEffect above

    // Schedule a save draft operation
    scheduleSaveDraft()
  }

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} slashMenu tableHandles formattingToolbar onChange={changeHandler} />
}

'use client'

import React, {useState, useEffect, useCallback, useRef} from 'react'

// BlockNoteJs
import {Block} from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import {useCreateBlockNote} from '@blocknote/react'
import {BlockNoteView} from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import '@/app/blocknote.css'

export default function VersionPreviewEditor({data}: {data: any}) {
  const [blocks, setBlocks] = useState<Block[]>([])
  console.log(data)

  const editor = useCreateBlockNote({
    initialContent: data
  })
  return (
    <div>
      <BlockNoteView editor={editor} editable={false} />
    </div>
  )
}

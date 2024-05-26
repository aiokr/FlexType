'use client'

import React, {useState, useEffect, useCallback, useRef} from 'react'

// BlockNoteJs
import {Block} from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import {useCreateBlockNote} from '@blocknote/react'
import {BlockNoteView} from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import '@/app/blocknote.scss'

// UI
import {SideSheet, Timeline, Modal, Dropdown, Skeleton} from '@douyinfe/semi-ui'
import {IconMore} from '@/assets/icons'

// Actions
import {updateDraft, getDraftPaperData} from '@/app/dashboard/[coll]/draftpaper/actions'
import {saveAsVersion} from '@/app/dashboard/[coll]/post/actions'

import VersionPreviewEditor from '@/components/VersionPreviewEditor'

// <Editor> component
export default function Editor({postId, id, data, postData}: {postId: number; id: number; data: any; postData: any}) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isSaving, setIsSaving] = useState(false) // 保存状态，用于提示正在进行保存动作
  const [historyVisible, setHistoryVisible] = useState(false) // 历史记录侧边栏状态
  const [historyModalVisible, setHistoryModalVisible] = useState(false) // 历史记录弹窗状态
  const [historyModalVersionId, setHistoryModalVersionId] = useState(0) // 历史记录弹窗版本号
  const [historyModalData, setHistoryModalData] = useState<any>(null) // 历史记录弹窗数据
  const lastSyncTimeRef = useRef<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: data
  })

  // This function will be called to update the draft
  const saveDraft = useCallback(() => {
    setIsSaving(true) // 保存状态，更改为正在保存
    console.log('保存中...')
    updateDraft(id, blocks).then(() => {
      console.log('保存完成')
      setIsSaving(false) // 保存状态，更改为已保存
    })
    lastSyncTimeRef.current = new Date() // Update the last sync time
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
    if (timeSinceLastSync >= 4000) {
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
  }, [saveDraft])

  const changeHandler = () => {
    const newBlocks = editor.document
    setBlocks(newBlocks) // This will trigger the useEffect above

    // Schedule a save draft operation
    scheduleSaveDraft()
  }

  const showHistory = () => {
    setHistoryVisible(!historyVisible)
  }

  const currentVersion = postData.currentVersion

  // 点击历史记录版本后，从服务器获取对应版本的数据
  const timelineItemClick = (version: number, draftId: number) => {
    setHistoryModalVersionId(version)
    setHistoryModalVisible(true)
    const item = getDraftPaperData(draftId).then((item) => {
      setHistoryModalData(item)
    })
  }

  // 关闭历史记录弹窗
  const handleAfterClose = () => {
    setHistoryModalData(null) // 清空历史记录弹窗数据
  }

  const placeholder = () => {
    return (
      <div>
        <Skeleton.Image style={{width: '100%', height: 150}} />
        <Skeleton.Title style={{width: '100%', marginTop: 10}} />
        <Skeleton.Paragraph style={{width: '100%'}} rows={3} />
      </div>
    )
  }

  return (
    <>
      <div className="relative h-full">
        <BlockNoteView editor={editor} slashMenu tableHandles formattingToolbar onChange={changeHandler} />
        <div className="absolute border left-0 right-0 bottom-[48px] w-[90%] md:w-[80%] mx-auto rounded-full shadow-lg px-4 py-2 flex flex-between gap-3">
          <button onClick={showHistory}>History</button>
          <span className="block mr-auto"></span>
          <button onClick={saveDraft}>Save</button>
          {isSaving ? <div>Saving...</div> : <div>Saved</div>}
        </div>
      </div>
      <SideSheet title="History Version" visible={historyVisible} onCancel={showHistory}>
        <button className="btn" onClick={() => saveAsVersion(postId)}>
          Save As Version
        </button>
        <Timeline>
          {[...postData.History]
            .sort((b, a) => a.version - b.version)
            .map((item, index) => (
              <Timeline.Item
                key={index}
                time={new Date(item.createAt || 'null').toLocaleString('zh-CN', {hour12: false})}
                type={item.version === currentVersion ? 'success' : 'ongoing'}
                onClick={() => timelineItemClick(item.version, item.draftId)}
              >
                {item.version} - {item.draftId}
              </Timeline.Item>
            ))}
        </Timeline>
      </SideSheet>
      <Modal
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        afterClose={handleAfterClose}
        header={
          <div className="pt-5 pb-3 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">Version {historyModalVersionId}</div>
              <div className="text-xs text-zinc-400">Create at {new Date(historyModalData?.createdAt).toLocaleString()}</div>
            </div>
            <Dropdown
              trigger={'click'}
              position={'bottomLeft'}
              render={
                <Dropdown.Menu>
                  <Dropdown.Item>恢复到此版本</Dropdown.Item>
                  <Dropdown.Item>将此版本另存为新文章</Dropdown.Item>
                  <Dropdown.Item>删除此版本</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <button>
                <IconMore />
              </button>
            </Dropdown>
          </div>
        }
      >
        <div>
          {historyModalData === null ? (
            placeholder()
          ) : (
            <div>
              <VersionPreviewEditor data={historyModalData.mainText} />
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

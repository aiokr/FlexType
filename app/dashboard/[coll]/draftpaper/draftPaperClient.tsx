'use client'
import {Button} from '@douyinfe/semi-ui'
import {addNewDraft} from './actions'

export const CreateNewDraftPaper = () => {
  return (
    <>
      <Button onClick={() => addNewDraft()}>新稿</Button>
    </>
  )
}

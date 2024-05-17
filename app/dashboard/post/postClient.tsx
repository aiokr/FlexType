'use client'
import {Button} from '@douyinfe/semi-ui'
import {addNewPost} from './actions'

export const CreateNewPost = () => {
  return (
    <>
      <Button onClick={() => addNewPost()}>New Post</Button>
    </>
  )
}

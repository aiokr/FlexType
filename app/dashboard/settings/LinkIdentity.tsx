'use client'
import {linkWithGithub, unLinkWithGithub} from '@/app/login/actions'

export function LinkToGithub() {
  return (
    <button className="btn text-sm inline-block" onClick={() => linkWithGithub()}>
      Connect Github
    </button>
  )
}

export function UnlinkToGithub() {
  return (
    <button className="btn text-sm inline-block" onClick={() => unLinkWithGithub()}>
      Disconnect
    </button>
  )
}

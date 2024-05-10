"use client"
import Link from 'next/link'
import { linkWithGithub, unLinkWithGithub } from '@/app/login/actions'
import exp from 'constants'

export function LinkToGithub() {
  return (
      <button className='btn text-sm inline-block' onClick={() => linkWithGithub()}>Connect Github</button>
  )
}

export function UnlinkToGithub() {
  return (
      <button className='btn text-sm inline-block' onClick={() => unLinkWithGithub()}>Disconnect</button>
  )
}
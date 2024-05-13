'use client'
import {useState} from 'react'

let theme = 'light' // light | dark | system
const setTheme = (e: {preventDefault: () => void}) => {
  e.preventDefault()
  localStorage.setItem('theme', theme)
}

export default function InterfaceSettings() {
  return (
    <>
      <h3 className="text-lg font-bold pt-2 pb-1">主题模式（开发中）</h3>
      <div className="flex gap-2">
        <button className="btn" onClick={(e) => ((theme = 'light'), setTheme(e))}>
          light
        </button>
        <button className="btn" onClick={(e) => ((theme = 'dark'), setTheme(e))}>
          dark
        </button>
        <button className="btn" onClick={(e) => ((theme = 'system'), setTheme(e))}>
          system
        </button>
      </div>
    </>
  )
}

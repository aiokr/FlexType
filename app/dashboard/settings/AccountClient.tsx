'use client'

import {Modal, Collapsible} from '@douyinfe/semi-ui'
import {useState} from 'react'
import {IconMore} from '@/assets/icons/'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('json', json)

export function AccountClient({data, userData}: {data: any; userData: any}) {
  const [accountModalVisible, setAccountModalVisible] = useState(false)
  const [isDataOpen, setDataOpen] = useState(false)
  const [isUserDataOpen, setUserDataOpen] = useState(false)

  const dataMaskStyle = isDataOpen
    ? {}
    : {
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)'
      }

  const userDataMaskStyle = isUserDataOpen
    ? {}
    : {
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)'
      }

  const highlightedData = hljs.highlight(JSON.stringify(data, null, 2), {language: 'json'}).value
  const highlightedUserData = hljs.highlight(JSON.stringify(userData, null, 2), {language: 'json'}).value

  const handleAfterClose = () => {
    setDataOpen(false)
    setUserDataOpen(false)
  }

  return (
    <>
      <button
        className="text-zinc-400 p-1"
        onClick={() => {
          setAccountModalVisible(true)
        }}
      >
        <IconMore />
      </button>
      <Modal
        title="账户信息"
        fullScreen
        visible={accountModalVisible}
        onCancel={() => setAccountModalVisible(false)}
        bodyStyle={{overflowY: 'auto'}}
        afterClose={handleAfterClose}
      >
        <section>
          <button className="text-lg font-bold" onClick={() => setDataOpen(!isDataOpen)}>
            Supabase Auth Info
          </button>
          <Collapsible isOpen={isDataOpen} collapseHeight={48} style={{...dataMaskStyle}}>
            <pre className="w-full overflow-x-scroll [scrollbar-width:none]" dangerouslySetInnerHTML={{__html: highlightedData}}></pre>
          </Collapsible>
          {isDataOpen ? null : (
            <button className="btn" onClick={() => setDataOpen(true)}>
              Show Supabase Auth Info
            </button>
          )}
        </section>
        <section className="mt-4">
          <button className="text-lg font-bold" onClick={() => setUserDataOpen(!isUserDataOpen)}>
            Database User Info
          </button>
          <Collapsible isOpen={isUserDataOpen} collapseHeight={48} style={{...userDataMaskStyle}}>
            <pre className="w-full overflow-x-scroll [scrollbar-width:none]" dangerouslySetInnerHTML={{__html: highlightedUserData}}></pre>
          </Collapsible>
          {isUserDataOpen ? null : (
            <button className="btn" onClick={() => setUserDataOpen(true)}>
              Show Database User Info
            </button>
          )}
        </section>
      </Modal>
    </>
  )
}

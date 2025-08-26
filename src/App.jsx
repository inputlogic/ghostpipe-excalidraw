import { useEffect, useState, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { Excalidraw } from "@excalidraw/excalidraw";
import '@excalidraw/excalidraw/index.css';

let synced = null

const sync = (fn, value) => {
  if (value === synced) return
  console.log('sync', value, synced)
  synced = value
  fn(value)
}

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const App = () => {
  const [data, setData] = useState()
  const [diff, setDiff] = useState()
  const [meta, setMeta] = useState()
  const [ydoc, setYdoc] = useState()
  
  const onChange = useCallback(
    debounce((ev) => {
      const files = ydoc?.getMap('files')
      files.forEach((_value, key) => {
        const value = JSON.stringify({elements: ev})
        ydoc.transact(() => {
          files.set(key, value), value
        }, 'web-change')
      })
    }, 500),
    [ydoc]
  )
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const pipe = urlParams.get('pipe')
    const signaling = urlParams.get('signaling')
    const ydoc = new Y.Doc()
    setYdoc(ydoc)
    const webrtcProvider = new WebrtcProvider(pipe, ydoc, {
      signaling: [signaling]
    })
    ydoc.getMap('meta').observe(event => {
      setMeta(ydoc.getMap('meta').toJSON())
    })
    const filesMap = ydoc.getMap('files')
    filesMap.observe((event, transaction) => {
      if (transaction.origin === 'web-change') return
      filesMap.forEach((value, key) => {
        setData(JSON.parse(value))
      })
    })
    const baseFilesMap = ydoc.getMap('base-files')
    baseFilesMap.observe((event, transaction) => {
      baseFilesMap.forEach((value, key) => {
        setDiff(JSON.parse(value))
      })
    })
    webrtcProvider.on('status', ({ status }) => {
      console.log('status', status)
    })
    
    webrtcProvider.on('synced', () => {
      console.log('synced')
    })
  }, [])
  return <div style={{height:"100svh", width:"100%", display: 'flex', flexFlow: 'row nowrap'}}>
    {!data && 'Loading...'}
    {data && !diff &&
      <Excalidraw
        initialData={{...data, scrollToContent: true}}
        onChange={onChange}
      />
    }
    {data && diff &&
      <div style={{display: 'flex', flexFlow: 'row nowrap', width: '100%', gap: '0.5em', background: '#efefef', padding: '0.5em'}}>
        <DiffWrapper branch={meta['base-branch']}>
          <Excalidraw
            viewModeEnabled
            initialData={{...diff, scrollToContent: true}}
          />
        </DiffWrapper>
        <DiffWrapper branch={meta['head-branch']}>
          <Excalidraw
            initialData={{...data, scrollToContent: true}}
            onChange={onChange}
          />
        </DiffWrapper>
      </div>
    }
  </div>
}

const DiffWrapper = ({children, branch}) =>
  <div style={{flexShrink: '0', flexGrow: '1', height: 'calc(100% - 40px)' }}>
    <h3 style={{margin: '0', fontFamily: 'Arial, Helvetica', padding: '0.5em 0em', fontSize: '16px', fontWeight: '300'}}>{branch}</h3>
    {children}
  </div>

export default App

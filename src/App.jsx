import { useEffect, useState, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { Excalidraw } from "@excalidraw/excalidraw";
import '@excalidraw/excalidraw/index.css';

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const safeJsonParse = value => {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const App = () => {
  const [data, setData] = useState()
  const [diff, setDiff] = useState()
  const [meta, setMeta] = useState()
  const [ydoc, setYdoc] = useState()

  const onChange = useCallback(
    debounce((ev) => {
      const data = ydoc?.getMap('data')
      const value = JSON.stringify({elements: ev})
      ydoc.transact(() => {
        data.set('content', value), value
      }, 'web-change')
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
    const data = ydoc.getMap('data')
    data.observe((event, transaction) => {
      if (transaction.origin === 'web-change') return
      if (!event.keysChanged.has('content')) return
      setData(safeJsonParse(data.get('content')))
    })
    const baseData = ydoc.getMap('base-data')
    baseData.observe((event, transaction) => {
      if (!event.keysChanged.has('content')) return
      setDiff(safeJsonParse(baseData.get('content')))
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

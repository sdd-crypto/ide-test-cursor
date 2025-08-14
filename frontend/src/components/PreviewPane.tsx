import React, { useMemo, useRef, useEffect } from 'react'
import { useProjectStore } from '../state/useProjectStore'

export default function PreviewPane() {
  const files = useProjectStore(s => s.files)
  const activeId = useProjectStore(s => s.activeFileId)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const html = useMemo(() => {
    const htmlFile = files.find(f => f.name === 'index.html')
    const cssFile = files.find(f => f.name === 'styles.css')
    const jsFile = files.find(f => f.name === 'script.js')
    const css = cssFile ? `<style>${cssFile.content}</style>` : ''
    const js = jsFile ? `<script>${jsFile.content}</script>` : ''
    const body = htmlFile?.content || '<h1>No index.html</h1>'
    return body.replace('</head>', `${css}</head>`).replace('</body>', `${js}</body>`)
  }, [files])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(html)
    doc.close()
  }, [html, activeId])

  return (
    <div className="h-full">
      <iframe ref={iframeRef} className="w-full h-full bg-white" sandbox="allow-scripts"></iframe>
    </div>
  )
}
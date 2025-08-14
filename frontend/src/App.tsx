import React, { useEffect } from 'react'
import FileExplorer from './components/FileExplorer'
import CodeEditor from './components/Editor'
import ChatSidebar from './components/ChatSidebar'
import PreviewPane from './components/PreviewPane'
import { useProjectStore } from './state/useProjectStore'

export default function App() {
  const theme = useProjectStore(s => s.theme)
  const toggleTheme = useProjectStore(s => s.toggleTheme)

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
  }, [theme])

  return (
    <div className="app-shell">
      <header className="header h-12 bg-surface-200 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="font-semibold">Cursor-like Web IDE</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-slate-800 rounded" onClick={toggleTheme}>{theme==='dark'?'Light':'Dark'} mode</button>
        </div>
      </header>
      <FileExplorer />
      <main className="main grid grid-rows-2">
        <div className="row-span-1 border-b border-slate-800">
          <CodeEditor />
        </div>
        <div className="row-span-1">
          <PreviewPane />
        </div>
      </main>
      <ChatSidebar />
    </div>
  )
}
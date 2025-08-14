import React from 'react'
import { useProjectStore } from '../state/useProjectStore'

export default function FileExplorer() {
  const files = useProjectStore(s => s.files)
  const active = useProjectStore(s => s.activeFileId)
  const setActive = useProjectStore(s => s.setActiveFile)
  const openFile = useProjectStore(s => s.openFile)

  return (
    <div className="sidebar h-full bg-surface-100 border-r border-slate-800 p-3 text-sm">
      <div className="font-semibold mb-2">Files</div>
      <ul className="space-y-1">
        {files.map(f => (
          <li key={f.id}>
            <button className={`w-full text-left px-2 py-1 rounded hover:bg-slate-800 ${active===f.id?'bg-slate-800':''}`} onClick={() => { setActive(f.id); openFile(f.id) }}>
              {f.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
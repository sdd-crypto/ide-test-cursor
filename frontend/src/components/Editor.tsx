import React, { useMemo, useRef } from 'react'
import Editor, { OnChange, OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { useProjectStore } from '../state/useProjectStore'
import { registerAiCompletion } from '../lib/aiCompletion'

export default function CodeEditor() {
  const files = useProjectStore(s => s.files)
  const activeId = useProjectStore(s => s.activeFileId)
  const update = useProjectStore(s => s.updateFileContent)
  const disposeRef = useRef<null | (() => void)>(null)

  const file = useMemo(() => files.find(f => f.id === activeId) || null, [files, activeId])

  const onChange: OnChange = (value) => {
    if (!file) return
    update(file.id, value ?? '')
  }

  const onMount: OnMount = (_editor, monacoNs: typeof Monaco) => {
    if (disposeRef.current) disposeRef.current()
    disposeRef.current = registerAiCompletion(monacoNs)
  }

  return (
    <div className="h-full">
      {file ? (
        <Editor
          onMount={onMount}
          height="100%"
          theme="vs-dark"
          defaultLanguage={file.language === 'css' ? 'css' : file.language}
          language={file.language === 'css' ? 'css' : file.language}
          value={file.content}
          onChange={onChange}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      ) : (
        <div className="p-4 text-slate-400">No file selected</div>
      )}
    </div>
  )
}
import React, { useState } from 'react'
import { useProjectStore } from '../state/useProjectStore'
import { aiAssist, devLogin, executeCode, sonarAnalyze } from '../lib/api'

export default function ChatSidebar() {
  const [input, setInput] = useState('')
  const chat = useProjectStore(s => s.chat)
  const addMessage = useProjectStore(s => s.addMessage)
  const files = useProjectStore(s => s.files)
  const activeId = useProjectStore(s => s.activeFileId)

  async function ensureLogin() {
    if (!localStorage.getItem('jwt')) {
      await devLogin()
    }
    if (!localStorage.getItem('ui_api_key')) {
      localStorage.setItem('ui_api_key', 'dev-ui-key-change-me')
    }
  }

  const onSend = async () => {
    await ensureLogin()
    const active = files.find(f => f.id === activeId)
    if (!active) return
    const history = [...chat, { role: 'user' as const, content: input }]
    addMessage({ role: 'user', content: input })
    setInput('')
    const res = await aiAssist({
      code_context: active.content,
      cursor_position: { line: 1, column: 1 },
      chat_history: history
    })
    const content = res?.choices?.[0]?.message?.content || JSON.stringify(res)
    addMessage({ role: 'assistant', content })
  }

  const onExecute = async () => {
    await ensureLogin()
    const active = files.find(f => f.id === activeId)
    if (!active) return
    const res = await executeCode(active.language === 'html' ? 'html' : 'javascript', active.content)
    addMessage({ role: 'assistant', content: `Output: ${String(res.output)}\nLogs: ${res.logs?.join('\n')}` })
  }

  const onAnalyze = async () => {
    await ensureLogin()
    const active = files.find(f => f.id === activeId)
    if (!active) return
    const res = await sonarAnalyze(active.language, active.content)
    addMessage({ role: 'assistant', content: `Analysis:\n${JSON.stringify(res.report, null, 2)}` })
  }

  return (
    <div className="chat h-full bg-surface-100 border-l border-slate-800 flex flex-col">
      <div className="p-3 font-semibold">Assistant</div>
      <div className="flex-1 overflow-auto space-y-2 p-3 text-sm">
        {chat.map((m, i) => (
          <div key={i} className={m.role==='user' ? 'text-slate-200' : 'text-slate-400'}>
            <div className="font-mono text-xs mb-1">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-3 space-y-2 border-t border-slate-800">
        <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full bg-slate-900 rounded p-2 text-sm" rows={3} placeholder="Ask the AI..." />
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-800 rounded" onClick={onSend}>Send</button>
          <button className="px-3 py-1 bg-slate-800 rounded" onClick={onExecute}>Run</button>
          <button className="px-3 py-1 bg-slate-800 rounded" onClick={onAnalyze}>Analyze</button>
        </div>
      </div>
    </div>
  )
}
import { create } from 'zustand'

export type IdeFile = { id: string; name: string; language: 'javascript' | 'html' | 'css'; content: string }
export type Tab = { fileId: string }
export type ChatMessage = { role: 'system' | 'user' | 'assistant', content: string }

export type ProjectState = {
  files: IdeFile[]
  tabs: Tab[]
  activeFileId: string | null
  theme: 'dark' | 'light'
  chat: ChatMessage[]
  setActiveFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  openFile: (id: string) => void
  addMessage: (m: ChatMessage) => void
  toggleTheme: () => void
}

const initialFiles: IdeFile[] = [
  { id: 'f1', name: 'index.html', language: 'html', content: '<!doctype html>\n<html>\n  <head><title>Preview</title></head>\n  <body>\n    <h1>Hello Cursor-like IDE</h1>\n    <script src="/script.js"></script>\n  </body>\n</html>' },
  { id: 'f2', name: 'styles.css', language: 'css', content: 'body { font-family: system-ui; } h1 { color: #6ee7b7; }' },
  { id: 'f3', name: 'script.js', language: 'javascript', content: 'console.log("Hello from script.js")' }
]

export const useProjectStore = create<ProjectState>((set, get) => ({
  files: initialFiles,
  tabs: [{ fileId: 'f1' }],
  activeFileId: 'f1',
  theme: 'dark',
  chat: [],
  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content) => set({ files: get().files.map(f => f.id === id ? { ...f, content } : f) }),
  openFile: (id) => set(state => ({ tabs: state.tabs.find(t => t.fileId === id) ? state.tabs : [...state.tabs, { fileId: id }], activeFileId: id })),
  addMessage: (m) => set({ chat: [...get().chat, m] }),
  toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' })
}))
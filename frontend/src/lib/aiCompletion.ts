import type * as monaco from 'monaco-editor'
import { aiAssist } from './api'

export function registerAiCompletion(monacoNs: typeof monaco) {
  const provider: monaco.languages.CompletionItemProvider = {
    provideCompletionItems: async (model, position) => {
      try {
        const code = model.getValue()
        const res = await aiAssist({
          code_context: code,
          cursor_position: { line: position.lineNumber, column: position.column },
          chat_history: [{ role: 'user', content: 'Continue the code from here with a helpful snippet only.' }]
        })
        const content: string = res?.choices?.[0]?.message?.content || ''
        if (!content) return { suggestions: [] }
        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column
        }
        return {
          suggestions: [
            {
              label: 'ai-suggestion',
              kind: monacoNs.languages.CompletionItemKind.Snippet,
              insertText: content,
              range
            }
          ]
        }
      } catch {
        return { suggestions: [] }
      }
    }
  }

  const disposers: monaco.IDisposable[] = []
  disposers.push(monacoNs.languages.registerCompletionItemProvider('javascript', provider))
  disposers.push(monacoNs.languages.registerCompletionItemProvider('typescript', provider))
  disposers.push(monacoNs.languages.registerCompletionItemProvider('html', provider))
  disposers.push(monacoNs.languages.registerCompletionItemProvider('css', provider))

  return () => disposers.forEach(d => d.dispose())
}
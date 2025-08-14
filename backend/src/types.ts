export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiAssistRequest = {
  code_context: string;
  cursor_position: { line: number; column: number };
  chat_history: ChatMessage[];
};

export type ExecuteRequest = {
  language: 'javascript' | 'html';
  code: string;
};

export type SonarAnalyzeRequest = {
  language: string;
  code: string;
};
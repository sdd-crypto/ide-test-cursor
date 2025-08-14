import { logger } from './logger.js';
import type { ChatMessage } from '../types.js';

export type PerplexityOptions = {
  model: string;
  temperature: number;
  max_tokens: number;
};

export async function callPerplexity(
  apiKey: string,
  messages: ChatMessage[],
  options: PerplexityOptions
): Promise<any> {
  const endpoint = 'https://api.perplexity.ai/chat/completions';

  const body = {
    model: options.model,
    temperature: options.temperature,
    max_tokens: options.max_tokens,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    logger.error('Perplexity API error', { status: res.status, text });
    throw new Error(`Perplexity API failed: ${res.status}`);
  }

  return await res.json();
}
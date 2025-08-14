const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

function authHeaders() {
  const token = localStorage.getItem('jwt') || '';
  const uiKey = localStorage.getItem('ui_api_key') || '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (uiKey) headers['x-api-key'] = uiKey;
  return headers;
}

export async function devLogin(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/dev-login`, { method: 'POST' });
  const data = await res.json();
  localStorage.setItem('jwt', data.token);
  return data.token;
}

export async function aiAssist(payload: any) {
  const res = await fetch(`${API_BASE}/api/ai-assist`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('AI Assist failed');
  return res.json();
}

export async function executeCode(language: 'javascript' | 'html', code: string) {
  const res = await fetch(`${API_BASE}/api/execute`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ language, code })
  });
  if (!res.ok) throw new Error('Execute failed');
  return res.json();
}

export async function sonarAnalyze(language: string, code: string) {
  const res = await fetch(`${API_BASE}/api/sonar-analyze`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ language, code })
  });
  if (!res.ok) throw new Error('Sonar analyze failed');
  return res.json();
}
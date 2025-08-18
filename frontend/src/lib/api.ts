export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
export const api = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers||{}) }, ...options });
  if (!res.ok) { const payload = await res.json().catch(()=>({})); throw new Error(payload?.message || 'API Error'); }
  return res.json();
};

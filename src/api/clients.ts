export interface Client {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

const BASE = (import.meta as any).env.VITE_BASE_URL || '';

function authHeaders() {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json) return (json as any).data;
  return json;
}

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${BASE}/api/clients`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Client[]>;
}

export async function getClient(id: number): Promise<Client> {
  const res = await fetch(`${BASE}/api/clients/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Client>;
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  const res = await fetch(`${BASE}/api/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(client),
  });
  return handleRes(res);
}

export async function updateClient(id: number, client: Partial<Client>): Promise<Client> {
  const res = await fetch(`${BASE}/api/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(client),
  });
  return handleRes(res);
}

export async function deleteClient(id: number): Promise<null> {
  const res = await fetch(`${BASE}/api/clients/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res);
}

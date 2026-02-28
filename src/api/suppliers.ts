export interface Supplier {
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

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${BASE}/api/suppliers`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Supplier[]>;
}

export async function getSupplier(id: number): Promise<Supplier> {
  const res = await fetch(`${BASE}/api/suppliers/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Supplier>;
}

export async function createSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
  const res = await fetch(`${BASE}/api/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(supplier),
  });
  return handleRes(res);
}

export async function updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier> {
  const res = await fetch(`${BASE}/api/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(supplier),
  });
  return handleRes(res);
}

export async function deleteSupplier(id: number): Promise<null> {
  const res = await fetch(`${BASE}/api/suppliers/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res);
}

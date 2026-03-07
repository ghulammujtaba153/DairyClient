/**
 * Sales API Service
 */

const BASE = (import.meta as any).env.VITE_BASE_URL || '';

function authHeaders(): Record<string, string> {
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

export interface Sale {
  id: number;
  customer_id: number;
  customer_name?: string;
  production_id?: number | null;
  product_name?: string;
  raw_material_id?: number | null;
  raw_material_name?: string;
  quantity: number;
  price: number;
  total: number;
  payment_status: 'cash' | 'bank' | 'jazzcash' | 'easypaisa' | 'credit';
  status: 'paid' | 'unpaid' | 'partial';
  created_at: string;
}

export interface SalesStats {
  summary: {
    totalSales: number;
    totalRevenue: number;
    cashSales: number;
    otherSales: number;
  };
  recentSales: Sale[];
}

export async function getSales(): Promise<Sale[]> {
  const res = await fetch(`${BASE}/api/sales`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Sale[]>;
}

export async function getSalesStats(): Promise<SalesStats> {
  const res = await fetch(`${BASE}/api/sales/stats`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<SalesStats>;
}

export async function createSale(data: Partial<Sale>): Promise<Sale> {
  const res = await fetch(`${BASE}/api/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function updateSale(id: number | string, data: Partial<Sale>): Promise<Sale> {
  const res = await fetch(`${BASE}/api/sales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteSale(id: number | string): Promise<void> {
  const res = await fetch(`${BASE}/api/sales/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res);
}

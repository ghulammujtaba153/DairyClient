export interface RawMaterial {
  id?: number;
  supplier_id: number;
  supplier_name?: string;
  material: string;
  quantity: number;
  unit: string;
  price: number;
  total_price: number;
  paid_amount: number;
  remaining_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface RawMaterialStats {
  summary: {
    totalSpending: number;
    monthlySpending: number;
    totalSuppliers: number;
    stockValue: number;
  };
  stocks: {
    material: string;
    totalQuantity: number;
    totalValue: number;
    unit: string;
  }[];
  topSuppliers: {
    name: string;
    totalSpent: number;
    transactions: number;
  }[];
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

export async function getRawMaterials(): Promise<RawMaterial[]> {
  const res = await fetch(`${BASE}/api/raw-materials`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<RawMaterial[]>;
}

export async function getRawMaterialStats(): Promise<RawMaterialStats> {
  const res = await fetch(`${BASE}/api/raw-materials/stats`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<RawMaterialStats>;
}

export async function createRawMaterial(data: Partial<RawMaterial>): Promise<RawMaterial> {
  const res = await fetch(`${BASE}/api/raw-materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function updateRawMaterial(id: number, data: Partial<RawMaterial>): Promise<RawMaterial> {
  const res = await fetch(`${BASE}/api/raw-materials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteRawMaterial(id: number): Promise<null> {
  const res = await fetch(`${BASE}/api/raw-materials/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res);
}

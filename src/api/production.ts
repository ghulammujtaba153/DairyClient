import { RawMaterial } from './rawMaterial';

export interface Production {
  id?: number;
  production_name: string;
  production_date: string;
  raw_material_id: number;
  raw_material_quantity: number;
  production_output: number;
  efficiency: number;
  labour_cost: number;
  other_cost: number;
  total_cost: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  raw_material_name?: string;
}

export interface ProductionStats {
  summary: {
    todayBatches: number;
    avgEfficiency: number;
    thisMonthBatches: number;
    totalProductionCost: number;
  };
  efficiencyTrend: {
    date: string;
    ghee: number;
    butter: number;
    khoya: number;
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

export async function getProductions(): Promise<Production[]> {
  const res = await fetch(`${BASE}/api/production`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<Production[]>;
}

export async function getProductionStats(): Promise<ProductionStats> {
  const res = await fetch(`${BASE}/api/production/stats`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res) as Promise<ProductionStats>;
}

export async function createProduction(data: Partial<Production>): Promise<Production> {
  const res = await fetch(`${BASE}/api/production`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function updateProduction(id: number, data: Partial<Production>): Promise<Production> {
  const res = await fetch(`${BASE}/api/production/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteProduction(id: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE}/api/production/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleRes(res);
}

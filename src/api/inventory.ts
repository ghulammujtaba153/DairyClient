/**
 * Inventory API Service
 */

const BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleRes = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API Request failed');
  return data.data;
};

export interface ProductStock {
  id: number;
  product_name: string;
  in_hand_quantity: number;
  in_market_quantity: number;
  unit: string;
  min_stock_level: number;
  price: number;
  total_price?: number;
  status?: 'good' | 'low' | 'oversold';
  valueInHand?: number;
  valueInMarket?: number;
}

export interface StockMovement {
  id: number | string;
  movement_date: string;
  product_name: string;
  movement_type: 'in' | 'out' | 'market';
  quantity: number;
  unit: string;
  reference_id: string;
  source_destination: string;
  price?: number;
}

export interface InventoryStats {
  totalValue: number;
  inHandValue: number;
  inMarketValue: number;
  lowStockCount: number;
  movementData: {
    date: string;
    inflow: number;
    outflow: number;
  }[];
}

export async function getInventory(): Promise<ProductStock[]> {
  const res = await fetch(`${BASE}/api/inventory`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function getInventoryStats(): Promise<InventoryStats> {
  const res = await fetch(`${BASE}/api/inventory/stats`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function getMovements(): Promise<StockMovement[]> {
  const res = await fetch(`${BASE}/api/inventory/movements`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function recordMovement(data: Partial<StockMovement>): Promise<StockMovement> {
  const res = await fetch(`${BASE}/api/inventory/movement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function updateMovement(id: number | string, data: Partial<StockMovement>): Promise<StockMovement> {
  const res = await fetch(`${BASE}/api/inventory/movement/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteMovement(id: number | string): Promise<void> {
  const res = await fetch(`${BASE}/api/inventory/movement/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleRes(res);
}

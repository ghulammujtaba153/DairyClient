import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Filter, Loader2, Plus, ArrowUpRight, ArrowDownLeft, X, Edit2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  getInventory, getInventoryStats, getMovements, 
  recordMovement, updateMovement, deleteMovement,
  ProductStock, StockMovement, InventoryStats 
} from '../api/inventory';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: ProductStock[];
  editingMovement?: StockMovement | null;
}

function MovementModal({ isOpen, onClose, onSuccess, products, editingMovement }: MovementModalProps) {
  const [formData, setFormData] = useState({
    unit: 'kg',
    reference_id: '',
    source_destination: '',
    price: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingMovement) {
      setFormData({
        product_name: editingMovement.product_name,
        movement_type: editingMovement.movement_type,
        quantity: editingMovement.quantity.toString(),
        unit: editingMovement.unit,
        reference_id: editingMovement.reference_id || '',
        source_destination: editingMovement.source_destination || '',
        price: editingMovement.price?.toString() || ''
      });
    } else {
      setFormData({
        product_name: '',
        movement_type: 'in',
        quantity: '',
        unit: 'kg',
        reference_id: '',
        source_destination: '',
        price: ''
      });
    }
  }, [editingMovement]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingMovement) {
        await updateMovement(editingMovement.id, {
          ...formData,
          quantity: Number(formData.quantity)
        });
      } else {
        await recordMovement({
          ...formData,
          quantity: Number(formData.quantity),
          price: Number(formData.price || 0)
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save movement error:', err);
      alert('Failed to save movement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {editingMovement ? 'Edit Stock Movement' : 'Record Stock Movement'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <select
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
              value={formData.product_name}
              onChange={(e: any) => {
                const p = products.find(prod => prod.product_name === e.target.value);
                setFormData({ ...formData, product_name: e.target.value, unit: p?.unit || 'kg' });
              }}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.product_name}>{p.product_name}</option>
              ))}
            </select>
            {formData.product_name && (
              <p className="text-xs text-slate-500 mt-1">
                Asset Value: PKR {(products.find(p => p.product_name === formData.product_name)?.price || 0).toLocaleString()} 
                {Number(products.find(p => p.product_name === formData.product_name)?.in_hand_quantity) > 0 && 
                  ` (Est. Cost: PKR ${(Number(products.find(p => p.product_name === formData.product_name)?.price || 0) / Number(products.find(p => p.product_name === formData.product_name)?.in_hand_quantity)).toFixed(2)} / ${formData.unit})`
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
                value={formData.movement_type}
                onChange={(e: any) => setFormData({ ...formData, movement_type: e.target.value })}
              >
                <option value="in">Stock In (Production)</option>
                <option value="out">Stock Out (Sales/Waste)</option>
                <option value="market">Move to Market (To Client)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
                  value={formData.quantity}
                  onChange={(e: any) => setFormData({ ...formData, quantity: e.target.value })}
                />
                <span className="absolute right-3 top-2 text-slate-400 text-sm">{formData.unit}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference ID (Invoice/Batch)</label>
            <input
              type="text"
              placeholder="e.g. INV-2024-001"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
              value={formData.reference_id}
              onChange={(e: any) => setFormData({ ...formData, reference_id: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source / Destination</label>
            <input
              type="text"
              placeholder="e.g. Ahmed Foods"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
              value={formData.source_destination}
              onChange={(e: any) => setFormData({ ...formData, source_destination: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Value / Price (PKR)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Total value of this movement"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--dairy-green)] outline-none"
              value={formData.price}
              onChange={(e: any) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingMovement ? 'Update Movement' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Inventory() {
  const [inventory, setInventory] = useState<ProductStock[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invData, statsData, movData] = await Promise.all([
        getInventory(),
        getInventoryStats(),
        getMovements()
      ]);
      
      setInventory(invData);
      setStats(statsData);
      setMovements(movData);
      setError(null);
    } catch (err: any) {
      console.error('Fetch inventory error:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this movement record? This will adjust stock levels accordingly.')) return;
    try {
      await deleteMovement(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete movement');
    }
  };

  const handleEdit = (movement: StockMovement) => {
    setEditingMovement(movement);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[var(--dairy-green-dark)]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory / Stock Management</h1>
          <p className="text-sm text-slate-600 mt-1">Monitor product stock levels and movements</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setEditingMovement(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md shadow-green-900/20"
          >
            <Plus size={20} />
            Record Movement
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Inventory</p>
              <h3 className="text-2xl font-bold text-slate-900">PKR {stats?.totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">In Hand Value</p>
              <h3 className="text-2xl font-bold text-slate-900">PKR {stats?.inHandValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">In Market Value</p>
              <h3 className="text-2xl font-bold text-slate-900">PKR {stats?.inMarketValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.lowStockCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Product Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inventory.map((item: ProductStock, index: number) => {
          const inHand = Number(item.in_hand_quantity);
          const inMarket = Number(item.in_market_quantity);
          const totalStock = inHand + inMarket;
          const minStock = Number(item.min_stock_level);
          const status = inHand < 0 ? 'oversold' : inHand < minStock ? 'low' : 'good';
          
          // item.total_price is the total accumulated asset value
          const totalAssetValue = Number(item.total_price || item.price || 0);
          const unitAssetCost = inHand > 0 ? totalAssetValue / inHand : 0;
          const valueInWarehouse = inHand * unitAssetCost;
          
          // item.valueInMarket is the real sale value from unpaid invoices
          const valueInMarket = Number(item.valueInMarket || 0);

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-green-600 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{item.product_name}</h3>
                  {status === 'oversold' && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={14} className="text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Oversold - Need Production</span>
                    </div>
                  )}
                  {status === 'low' && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={14} className="text-orange-500" />
                      <span className="text-xs text-orange-600 font-medium">Low Stock Alert</span>
                    </div>
                  )}
                  {status === 'good' && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Good Stock Level</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-600">Min Stock</span>
                  <p className="font-medium text-slate-900">
                    {minStock} {item.unit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 transition-colors group-hover:bg-green-100/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">In Hand</p>
                    <ArrowDownLeft size={14} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {inHand} <span className="text-sm">{item.unit}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">PKR {valueInWarehouse.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 transition-colors group-hover:bg-blue-100/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">In Market</p>
                    <ArrowUpRight size={14} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {inMarket} <span className="text-sm">{item.unit}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">PKR {valueInMarket.toLocaleString()}</p>
                </div>
                <div
                  className={`rounded-lg p-4 border transition-colors ${
                    inHand < 0
                      ? 'bg-red-50 border-red-200 group-hover:bg-red-100/50'
                      : inHand < minStock
                      ? 'bg-orange-50 border-orange-200 group-hover:bg-orange-100/50'
                      : 'bg-purple-50 border-purple-200 group-hover:bg-purple-100/50'
                  }`}
                >
                  <p className="text-xs text-slate-600 mb-1">Stock Total</p>
                  <p
                    className={`text-2xl font-bold ${
                      inHand < 0
                        ? 'text-red-700'
                        : inHand < minStock
                        ? 'text-orange-700'
                        : 'text-purple-700'
                    }`}
                  >
                    {totalStock} <span className="text-sm">{item.unit}</span>
                  </p>
                </div>
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    inHand < 0
                      ? 'bg-red-500'
                      : inHand < minStock
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (inHand / (totalStock || 1)) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Movement Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Inventory Movement (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.movementData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="inflow" fill="#22c55e" name="Inflow (Production/Other)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" fill="#ef4444" name="Outflow (Sales/Loss)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Stock Movements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Date & Time</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Product</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700">Quantity</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700">Value (PKR)</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Reference</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Source/Destination</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement: StockMovement) => (
                <tr key={movement.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-semibold text-slate-900">MOV-{movement.id}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {new Date(movement.movement_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-900">{movement.product_name}</td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                        movement.movement_type === 'in'
                          ? 'bg-green-100 text-green-700'
                          : movement.movement_type === 'market'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {movement.movement_type === 'in' ? 'Inflow' : movement.movement_type === 'market' ? 'To Market' : 'Outflow'}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-sm text-right font-bold ${
                    movement.movement_type === 'in' ? 'text-green-600' : movement.movement_type === 'market' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {movement.movement_type === 'in' ? '+' : movement.movement_type === 'market' ? '→' : '-'}
                    {movement.quantity} {movement.unit}
                  </td>
                  <td className="py-4 px-4 text-sm text-right font-medium text-slate-900">
                    {movement.price ? `PKR ${Number(movement.price).toLocaleString()}` : '-'}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{movement.reference_id}</td>
                  <td className="py-4 px-4 text-sm text-slate-900 font-medium">{movement.source_destination}</td>
                  
                </tr>
              ))}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-3 opacity-20" />
                    No stock movements recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MovementModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingMovement(null);
        }} 
        onSuccess={fetchData}
        products={inventory}
        editingMovement={editingMovement}
      />
    </div>
  );
}



import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Plus, Search, DollarSign, Package, TrendingDown, Calendar, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRawMaterials, getRawMaterialStats, createRawMaterial, RawMaterial as IRawMaterial, RawMaterialStats } from '../api/rawMaterial';
import { getSuppliers, Supplier } from '../api/suppliers';

export function RawMaterial() {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rawMaterials, setRawMaterials] = useState<IRawMaterial[]>([]);
  const [stats, setStats] = useState<RawMaterialStats | null>(null);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  
  const [formData, setFormData] = useState({
    supplier_id: '',
    material: 'Fresh Cream',
    quantity: '',
    rate: '',
    payment: 'cash',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const [materialsData, statsData, suppliersData] = await Promise.all([
        getRawMaterials(),
        getRawMaterialStats(),
        getSuppliers()
      ]);
      setRawMaterials(materialsData || []);
      setStats(statsData);
      setSuppliersList(suppliersData || []);
    } catch (err: any) {
      console.error('Fetch raw materials error:', err);
      if (retryCount < 1) {
        console.log('Retrying fetch in 1s...');
        setTimeout(() => fetchData(retryCount + 1), 1000);
      } else {
        setError('Failed to load data. Please check your connection and try again.');
        setLoading(false);
      }
    } finally {
      if (retryCount >= 1 || !error) {
        // Only stop loading if we're done or there's no error
        // If we're retrying, we keep loading true
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const quantity = Number(formData.quantity);
      const price = Number(formData.rate);
      const totalPrice = quantity * price;
      
      await createRawMaterial({
        supplier_id: Number(formData.supplier_id),
        material: formData.material,
        quantity,
        unit: 'liters', // Default for now
        price,
        paid_amount: formData.payment === 'cash' ? totalPrice : 0,
      });
      
      setShowPurchaseForm(false);
      setFormData({ supplier_id: '', material: 'Fresh Cream', quantity: '', rate: '', payment: 'cash' });
      fetchData();
    } catch (err) {
      console.error('Submit purchase error:', err);
      alert('Failed to record purchase');
    }
  };

  if (loading && !rawMaterials.length && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--dairy-green)]" />
      </div>
    );
  }

  if (error && !rawMaterials.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => fetchData()}
          className="px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Raw Material Management</h1>
          <p className="text-sm text-slate-600 mt-1">Track purchases, suppliers, and raw material inventory</p>
        </div>
        <button
          onClick={() => setShowPurchaseForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
        >
          <Plus size={20} />
          New Purchase
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Suppliers</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{stats?.summary.totalSuppliers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Spending</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {stats?.summary.totalSpending.toLocaleString() || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">This Month Spend</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {stats?.summary.monthlySpending.toLocaleString() || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Stock Value</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {stats?.summary.stockValue.toLocaleString() || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Suppliers List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3>Top Suppliers</h3>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
              />
            </div>
          </div>
          <div className="space-y-3">
            {stats?.topSuppliers.map((supplier: { name: string; totalSpent: number; transactions: number }, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--dairy-green)] text-white rounded-full flex items-center justify-center font-bold">
                      {supplier.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{supplier.name}</p>
                      <p className="text-sm text-slate-600">{supplier.transactions} Transactions</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Total Spent</p>
                  <p className="font-bold text-lg text-[var(--navy)]">
                    PKR {supplier.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Material Stock Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Raw Material Stock</h3>
          <div className="space-y-4">
            {stats?.stocks.map((item: { material: string; totalQuantity: number; totalValue: number; unit: string }, index: number) => (
              <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <p className="font-medium text-slate-900">{item.material}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-[var(--navy)]">{item.totalQuantity}</span>
                  <span className="text-sm text-slate-600">{item.unit}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">Value: PKR {item.totalValue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Spend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Spending by Supplier</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.topSuppliers.map((s: { name: string; totalSpent: number }) => ({ name: s.name, amount: s.totalSpent }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#ef4444" name="Spent (PKR)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Recent Purchase History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Supplier</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Material</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Rate</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((purchase: IRawMaterial) => (
                <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{purchase.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {new Date(purchase.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">{purchase.supplier_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{purchase.material}</td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">
                    {purchase.quantity} {purchase.unit}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">PKR {Number(purchase.price).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-slate-900">
                    PKR {Number(purchase.total_price).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        Number(purchase.remaining_amount) <= 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {Number(purchase.remaining_amount) <= 0 ? 'Cash' : 'Credit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="mb-4 text-xl font-bold">New Purchase Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <select
                  value={formData.supplier_id}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, supplier_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliersList.map((s: Supplier) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {formData.supplier_id && (
                  <p className="mt-1 text-xs text-[var(--dairy-green-dark)] font-medium">
                    Selected: {suppliersList.find((s: Supplier) => String(s.id) === formData.supplier_id)?.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                <select
                  value={formData.material}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                >
                  <option>Fresh Cream</option>
                  <option>Raw Milk</option>
                  <option>Salt</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    placeholder="50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rate (PKR)</label>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    placeholder="500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total</label>
                <input
                  type="text"
                  value={
                    formData.quantity && formData.rate
                      ? `PKR ${(Number(formData.quantity) * Number(formData.rate)).toLocaleString()}`
                      : 'PKR 0'
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="cash"
                      checked={formData.payment === 'cash'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-4 h-4 text-[var(--dairy-green-dark)]"
                    />
                    <span className="text-sm">Cash</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="credit"
                      checked={formData.payment === 'credit'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-4 h-4 text-[var(--dairy-green-dark)]"
                    />
                    <span className="text-sm">Credit</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPurchaseForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
                >
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

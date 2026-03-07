import React, { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, TrendingUp, FileText, CreditCard, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router';
import { getSales, getSalesStats, createSale, updateSale, deleteSale, Sale, SalesStats } from '../api/sales';
import { getClients, Client } from '../api/clients';
import { getProductions, Production } from '../api/production';
import { getRawMaterials, RawMaterial } from '../api/rawMaterial';

export function Sales() {
  const location = useLocation();
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [formData, setFormData] = useState({
    customer_id: '',
    item_type: 'production' as 'production' | 'raw_material',
    item_id: '',
    quantity: '',
    price: '',
    payment_status: 'cash',
    status: 'paid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesData, statsData, clientsData, prodData, rawData] = await Promise.all([
        getSales(),
        getSalesStats(),
        getClients(),
        getProductions(),
        getRawMaterials()
      ]);
      setSales(salesData);
      setStats(statsData);
      setClients(clientsData);
      setProductions(prodData);
      setRawMaterials(rawData);
    } catch (err: any) {
      console.error('Fetch sales error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      item_type: 'production',
      item_id: '',
      quantity: '',
      price: '',
      payment_status: 'cash',
      status: 'paid'
    });
    setEditingSale(null);
  };

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      customer_id: sale.customer_id.toString(),
      item_type: sale.production_id ? 'production' : 'raw_material',
      item_id: (sale.production_id || sale.raw_material_id || '').toString(),
      quantity: sale.quantity.toString(),
      price: sale.price.toString(),
      payment_status: sale.payment_status,
      status: sale.status
    });
    setShowInvoiceForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sale record?')) return;
    try {
      await deleteSale(id);
      await fetchData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Determine which product filter to apply based on route
  const getProductFilter = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('butter')) return 'Butter';
    if (path.includes('ghee')) return 'Desi Ghee';
    if (path.includes('khoya')) return 'Khoya';
    if (path.includes('cream')) return 'Cream';
    return null;
  };

  const productFilter = getProductFilter();
  
  const filteredSales = sales.filter((sale) => {
    const itemName = (sale.product_name || sale.raw_material_name || '').toLowerCase();
    const customerName = (sale.customer_name || '').toLowerCase();
    const matchesFilter = productFilter ? itemName.includes(productFilter.toLowerCase()) : true;
    const matchesSearch = itemName.includes(searchTerm.toLowerCase()) || customerName.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todaySales = sales
    .filter((s: Sale) => new Date(s.created_at).toISOString().split('T')[0] === todayStr)
    .reduce((sum: number, s: Sale) => sum + Number(s.total), 0);
    
  const cashSales = sales
    .filter((s: Sale) => s.payment_status === 'cash' && new Date(s.created_at).toISOString().split('T')[0] === todayStr)
    .reduce((sum: number, s: Sale) => sum + Number(s.total), 0);
    
  const creditSales = sales
    .filter((s: Sale) => s.payment_status === 'credit' && new Date(s.created_at).toISOString().split('T')[0] === todayStr)
    .reduce((sum: number, s: Sale) => sum + Number(s.total), 0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: Partial<Sale> = {
        customer_id: Number(formData.customer_id),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        total: Number(formData.quantity) * Number(formData.price),
        payment_status: formData.payment_status as any,
        status: formData.status as any
      };

      if (formData.item_type === 'production') {
        payload.production_id = Number(formData.item_id);
        payload.raw_material_id = null;
      } else {
        payload.raw_material_id = Number(formData.item_id);
        payload.production_id = null;
      }

      if (editingSale) {
        await updateSale(editingSale.id, payload);
      } else {
        await createSale(payload);
      }
      
      await fetchData();
      setShowInvoiceForm(false);
      resetForm();
    } catch (err: any) {
      alert('Failed to save invoice: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>{productFilter ? `${productFilter} Sales` : 'Sales Management'}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {productFilter ? `Track ${productFilter.toLowerCase()} sales and invoices` : 'Track all sales and invoices'}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowInvoiceForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
        >
          <Plus size={20} />
          New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Sales</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {todaySales.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cash Sales</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {cashSales.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Credit Sales</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {creditSales.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Invoices</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{filteredSales.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3>Sales History</h3>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Invoice ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Product</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Rate</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Payment</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale: Sale) => (
                <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">#INV-{sale.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">{sale.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{sale.product_name || sale.raw_material_name}</td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">
                    {sale.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">PKR {Number(sale.price).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-slate-900">
                    PKR {Number(sale.total).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        sale.payment_status === 'cash'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {sale.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        sale.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : sale.status === 'partial'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => openEditModal(sale)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(sale.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
            <h3 className="mb-4">{editingSale ? 'Edit Invoice' : 'Create New Invoice'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e: any) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    required
                  >
                    <option value="">Select Customer</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id!}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    defaultValue={editingSale ? new Date(editingSale.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    disabled={!!editingSale}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                    <h4>Product Details</h4>
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, item_type: 'production', item_id: ''})}
                            className={`px-3 py-1 rounded text-xs ${formData.item_type === 'production' ? 'bg-[var(--dairy-green)] text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            Production
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, item_type: 'raw_material', item_id: ''})}
                            className={`px-3 py-1 rounded text-xs ${formData.item_type === 'raw_material' ? 'bg-[var(--dairy-green)] text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            Raw Material
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                    <select
                      value={formData.item_id}
                      onChange={(e: any) => setFormData({ ...formData, item_id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    >
                      <option value="">Select Item</option>
                      {formData.item_type === 'production' ? 
                        productions.map((p: Production) => (
                            <option key={p.id} value={p.id}>{p.production_name}</option>
                        )) : 
                        rawMaterials.map((r: RawMaterial) => (
                            <option key={r.id} value={r.id}>{r.material}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e: any) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      placeholder="10"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rate (PKR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e: any) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
                    <input
                      type="text"
                      value={
                        formData.quantity && formData.price
                          ? `PKR ${(Number(formData.quantity) * Number(formData.price)).toLocaleString()}`
                          : 'PKR 0'
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Payment Type</label>
                        <select
                            value={formData.payment_status}
                            onChange={(e: any) => setFormData({ ...formData, payment_status: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                        >
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                            <option value="jazzcash">JazzCash</option>
                            <option value="easypaisa">EasyPaisa</option>
                            <option value="credit">Credit (Pay Later)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                        >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                        </select>
                    </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowInvoiceForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {submitting ? 'Saving...' : editingSale ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

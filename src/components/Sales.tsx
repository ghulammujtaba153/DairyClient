import { useState } from 'react';
import { Plus, Search, DollarSign, TrendingUp, FileText, CreditCard } from 'lucide-react';
import { useLocation } from 'react-router';

const salesData = [
  {
    id: 'INV-1243',
    date: '2026-01-26',
    customer: 'Ahmed Foods',
    product: 'Desi Ghee',
    quantity: 25,
    unit: 'kg',
    rate: 1800,
    total: 45000,
    payment: 'credit',
    status: 'unpaid',
  },
  {
    id: 'INV-1242',
    date: '2026-01-26',
    customer: 'Cash Sale',
    product: 'Butter',
    quantity: 10,
    unit: 'kg',
    rate: 1250,
    total: 12500,
    payment: 'cash',
    status: 'paid',
  },
  {
    id: 'INV-1241',
    date: '2026-01-26',
    customer: 'Fresh Store',
    product: 'Khoya',
    quantity: 15,
    unit: 'kg',
    rate: 1800,
    total: 27000,
    payment: 'cash',
    status: 'paid',
  },
  {
    id: 'INV-1240',
    date: '2026-01-25',
    customer: 'Karachi Mart',
    product: 'Desi Ghee',
    quantity: 30,
    unit: 'kg',
    rate: 1800,
    total: 54000,
    payment: 'credit',
    status: 'partial',
    paid: 20000,
  },
  {
    id: 'INV-1239',
    date: '2026-01-25',
    customer: 'Ahmed Foods',
    product: 'Butter',
    quantity: 20,
    unit: 'kg',
    rate: 1250,
    total: 25000,
    payment: 'credit',
    status: 'unpaid',
  },
];

const customers = [
  { id: 1, name: 'Ahmed Foods', balance: 70000 },
  { id: 2, name: 'Karachi Mart', balance: 34000 },
  { id: 3, name: 'Fresh Store', balance: 0 },
  { id: 4, name: 'City Market', balance: 45000 },
];

const products = [
  { name: 'Desi Ghee', stock: 60, rate: 1800, unit: 'kg' },
  { name: 'Butter', stock: -25, rate: 1250, unit: 'kg' },
  { name: 'Khoya', stock: 27, rate: 1800, unit: 'kg' },
  { name: 'Cream', stock: 23, rate: 500, unit: 'liter' },
];

export function Sales() {
  const location = useLocation();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    product: 'Desi Ghee',
    quantity: '',
    rate: '1800',
    payment: 'cash',
  });

  // Determine which product filter to apply based on route
  const getProductFilter = () => {
    if (location.pathname.includes('butter')) return 'Butter';
    if (location.pathname.includes('ghee')) return 'Desi Ghee';
    if (location.pathname.includes('khoya')) return 'Khoya';
    if (location.pathname.includes('cream')) return 'Cream';
    return null;
  };

  const productFilter = getProductFilter();
  const filteredSales = productFilter
    ? salesData.filter((sale) => sale.product === productFilter)
    : salesData;

  const todaySales = salesData
    .filter((s) => s.date === '2026-01-26')
    .reduce((sum, s) => sum + s.total, 0);
  const cashSales = salesData
    .filter((s) => s.payment === 'cash' && s.date === '2026-01-26')
    .reduce((sum, s) => sum + s.total, 0);
  const creditSales = salesData
    .filter((s) => s.payment === 'credit' && s.date === '2026-01-26')
    .reduce((sum, s) => sum + s.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInvoiceForm(false);
    setFormData({ customer: '', product: 'Desi Ghee', quantity: '', rate: '1800', payment: 'cash' });
  };

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
          onClick={() => setShowInvoiceForm(true)}
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
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{sale.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{sale.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{sale.customer}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{sale.product}</td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">
                    {sale.quantity} {sale.unit}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-slate-900">PKR {sale.rate}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-slate-900">
                    PKR {sale.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        sale.payment === 'cash'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {sale.payment === 'cash' ? 'Cash' : 'Credit'}
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
                      {sale.status === 'paid' ? 'Paid' : sale.status === 'partial' ? 'Partial' : 'Unpaid'}
                    </span>
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
            <h3 className="mb-4">Create New Invoice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                  <select
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    required
                  >
                    <option value="">Select Customer</option>
                    <option value="cash">Cash Sale</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} {c.balance > 0 && `(Balance: PKR ${c.balance.toLocaleString()})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    defaultValue="2026-01-26"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Product Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                    <select
                      value={formData.product}
                      onChange={(e) => {
                        const product = products.find((p) => p.name === e.target.value);
                        setFormData({
                          ...formData,
                          product: e.target.value,
                          rate: product?.rate.toString() || '',
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    >
                      {products.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} (Stock: {p.stock} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
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
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="cash"
                      checked={formData.payment === 'cash'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-4 h-4 text-[var(--dairy-green-dark)]"
                    />
                    <span className="text-sm">Cash (Immediate Payment)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="credit"
                      checked={formData.payment === 'credit'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-4 h-4 text-[var(--dairy-green-dark)]"
                    />
                    <span className="text-sm">Credit (Pay Later)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowInvoiceForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

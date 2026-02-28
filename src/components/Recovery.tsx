import { Plus, AlertTriangle, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const customers = [
  {
    id: 1,
    name: 'Ahmed Foods',
    outstanding: 125000,
    aging: { current: 25000, days7: 35000, days15: 40000, days30: 25000 },
    lastPayment: '2026-01-20',
    contact: '+92 300 1234567',
    status: 'overdue',
  },
  {
    id: 2,
    name: 'Karachi Mart',
    outstanding: 85000,
    aging: { current: 45000, days7: 40000, days15: 0, days30: 0 },
    lastPayment: '2026-01-22',
    contact: '+92 301 7654321',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Fresh Store',
    outstanding: 45000,
    aging: { current: 45000, days7: 0, days15: 0, days30: 0 },
    lastPayment: '2026-01-24',
    contact: '+92 302 9876543',
    status: 'current',
  },
  {
    id: 4,
    name: 'City Market',
    outstanding: 95000,
    aging: { current: 30000, days7: 25000, days15: 40000, days30: 0 },
    lastPayment: '2026-01-18',
    contact: '+92 303 1122334',
    status: 'overdue',
  },
];

const recentPayments = [
  { date: '2026-01-24', customer: 'Fresh Store', amount: 28000, method: 'Bank Transfer', invoice: 'INV-1235' },
  { date: '2026-01-22', customer: 'Karachi Mart', amount: 45000, method: 'Cash', invoice: 'INV-1230' },
  { date: '2026-01-20', customer: 'Ahmed Foods', amount: 35000, method: 'Cheque', invoice: 'INV-1225' },
  { date: '2026-01-18', customer: 'City Market', amount: 50000, method: 'Bank Transfer', invoice: 'INV-1220' },
];

const agingDistribution = [
  { name: '0-7 Days', value: 145000, color: '#22c55e' },
  { name: '8-15 Days', value: 100000, color: '#f59e0b' },
  { name: '16-30 Days', value: 80000, color: '#ef4444' },
  { name: '30+ Days', value: 25000, color: '#7f1d1d' },
];

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#7f1d1d'];

export function Recovery() {
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0);
  const overdueCustomers = customers.filter((c) => c.status === 'overdue').length;
  const totalCurrent = customers.reduce((sum, c) => sum + c.aging.current, 0);
  const totalOverdue = totalOutstanding - totalCurrent;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Recovery / Receivables</h1>
          <p className="text-sm text-slate-600 mt-1">Track customer payments and outstanding balances</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Outstanding</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalOutstanding.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Current (0-7 Days)</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalCurrent.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalOverdue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Overdue Customers</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{overdueCustomers}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Outstanding List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Customer-wise Outstanding Balances</h3>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--dairy-green)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--navy)]">{customer.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{customer.contact}</p>
                      <p className="text-sm text-slate-500 mt-1">Last Payment: {customer.lastPayment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">PKR {customer.outstanding.toLocaleString()}</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
                        customer.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : customer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {customer.status === 'overdue'
                        ? 'Overdue'
                        : customer.status === 'pending'
                        ? 'Pending'
                        : 'Current'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-slate-600 mb-1">0-7 Days</p>
                    <p className="text-sm font-bold text-green-600">
                      PKR {customer.aging.current.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-xs text-slate-600 mb-1">8-15 Days</p>
                    <p className="text-sm font-bold text-yellow-600">PKR {customer.aging.days7.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <p className="text-xs text-slate-600 mb-1">16-30 Days</p>
                    <p className="text-sm font-bold text-orange-600">
                      PKR {customer.aging.days15.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-xs text-slate-600 mb-1">30+ Days</p>
                    <p className="text-sm font-bold text-red-600">PKR {customer.aging.days30.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 text-sm bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
                    Record Payment
                  </button>
                  <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                    View Ledger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aging Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Aging Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={agingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {agingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {agingDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900">PKR {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-600" />
              <p className="font-medium text-red-900">Action Required</p>
            </div>
            <p className="text-sm text-red-700">
              PKR {totalOverdue.toLocaleString()} is overdue for more than 7 days. Follow up with customers
              immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Recent Payment Received</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Customer</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Payment Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Invoice Ref</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-600">{payment.date}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{payment.customer}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-green-600">
                    PKR {payment.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{payment.method}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{payment.invoice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

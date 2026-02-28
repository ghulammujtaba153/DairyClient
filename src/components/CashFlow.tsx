import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const cashFlowData = [
  { month: 'Sep', inflow: 2850000, outflow: 425000, net: 2425000 },
  { month: 'Oct', inflow: 2950000, outflow: 455000, net: 2495000 },
  { month: 'Nov', inflow: 2900000, outflow: 448000, net: 2452000 },
  { month: 'Dec', inflow: 3100000, outflow: 485000, net: 2615000 },
  { month: 'Jan', inflow: 3050000, outflow: 505200, net: 2544800 },
];

const currentCashPosition = {
  cashInHand: 425000,
  cashInBank: 1250000,
  cashInMarket: 350000,
  total: 2025000,
};

const cashInflows = {
  cashSales: 1850000,
  creditRecoveries: 1200000,
  total: 3050000,
};

const cashOutflows = {
  rawMaterial: 225000,
  labour: 94200,
  utilities: 28000,
  transportation: 15000,
  maintenance: 9000,
  supplierPayments: 85000,
  other: 49000,
  total: 505200,
};

const netCashFlow = cashInflows.total - cashOutflows.total;

export function CashFlow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Cash Flow Statement</h1>
          <p className="text-sm text-slate-600 mt-1">Track cash inflows and outflows - January 2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Download size={18} />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Cash Position</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">
                PKR {currentCashPosition.total.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cash Inflows</p>
              <h3 className="text-2xl font-bold text-green-600">
                PKR {cashInflows.total.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cash Outflows</p>
              <h3 className="text-2xl font-bold text-red-600">PKR {cashOutflows.total.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Net Cash Flow</p>
              <h3 className="text-2xl font-bold text-green-600">PKR {netCashFlow.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Position Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Current Cash Position</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-slate-600 mb-2">Cash in Hand</p>
            <p className="text-3xl font-bold text-green-700">
              PKR {currentCashPosition.cashInHand.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {((currentCashPosition.cashInHand / currentCashPosition.total) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-slate-600 mb-2">Cash in Bank</p>
            <p className="text-3xl font-bold text-blue-700">
              PKR {currentCashPosition.cashInBank.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {((currentCashPosition.cashInBank / currentCashPosition.total) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <p className="text-sm text-slate-600 mb-2">Cash in Market (Receivables)</p>
            <p className="text-3xl font-bold text-orange-700">
              PKR {currentCashPosition.cashInMarket.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {((currentCashPosition.cashInMarket / currentCashPosition.total) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-slate-600 mb-2">Total Cash</p>
            <p className="text-3xl font-bold text-purple-700">
              PKR {currentCashPosition.total.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">All liquid assets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Inflows */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 text-green-700">Cash Inflows (January 2026)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-slate-700">Cash Sales</span>
              <span className="font-bold text-green-700">PKR {cashInflows.cashSales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-slate-700">Credit Recoveries</span>
              <span className="font-bold text-green-700">
                PKR {cashInflows.creditRecoveries.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border-2 border-green-300">
              <span className="font-bold text-lg text-green-900">Total Cash Inflows</span>
              <span className="font-bold text-2xl text-green-700">PKR {cashInflows.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cash Outflows */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 text-red-700">Cash Outflows (January 2026)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Raw Material Purchases</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.rawMaterial.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Labour Wages</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.labour.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Utilities</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.utilities.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Transportation</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.transportation.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Maintenance</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.maintenance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Supplier Payments</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.supplierPayments.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-slate-700">Other Expenses</span>
              <span className="font-medium text-red-700">PKR {cashOutflows.other.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-100 to-red-50 rounded-lg border-2 border-red-300 mt-3">
              <span className="font-bold text-lg text-red-900">Total Cash Outflows</span>
              <span className="font-bold text-2xl text-red-700">PKR {cashOutflows.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Cash Flow */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-8 border-2 border-green-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-green-900">Net Cash Flow (January 2026)</h3>
            <p className="text-sm text-green-700 mt-2">Total Cash Inflows - Total Cash Outflows</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-700">PKR {netCashFlow.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">Positive Cash Flow ✓</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Cash Flow Trend (5 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} name="Inflows" />
              <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} name="Outflows" />
              <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Net Cash Flow by Month */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Net Cash Flow by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="net" fill="#22c55e" name="Net Cash Flow (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

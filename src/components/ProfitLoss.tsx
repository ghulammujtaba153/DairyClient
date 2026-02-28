import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  {
    month: 'Sep',
    revenue: 2950000,
    rawMaterial: 185000,
    production: 65000,
    labour: 82000,
    other: 45000,
    totalExpense: 377000,
    netProfit: 2573000,
  },
  {
    month: 'Oct',
    revenue: 3100000,
    rawMaterial: 198000,
    production: 72000,
    labour: 85000,
    other: 48000,
    totalExpense: 403000,
    netProfit: 2697000,
  },
  {
    month: 'Nov',
    revenue: 3050000,
    rawMaterial: 205000,
    production: 68000,
    labour: 88000,
    other: 42000,
    totalExpense: 403000,
    netProfit: 2647000,
  },
  {
    month: 'Dec',
    revenue: 3200000,
    rawMaterial: 210000,
    production: 78000,
    labour: 90000,
    other: 50000,
    totalExpense: 428000,
    netProfit: 2772000,
  },
  {
    month: 'Jan',
    revenue: 3245000,
    rawMaterial: 225000,
    production: 84000,
    labour: 94200,
    other: 52000,
    totalExpense: 455200,
    netProfit: 2789800,
  },
];

const currentMonth = {
  revenue: 3245000,
  expenses: {
    rawMaterial: 225000,
    production: 84000,
    labour: 94200,
    utilities: 28000,
    transportation: 15000,
    maintenance: 9000,
    other: 52000,
  },
  grossProfit: 0,
  netProfit: 0,
};

currentMonth.grossProfit = currentMonth.revenue - currentMonth.expenses.rawMaterial - currentMonth.expenses.production;
currentMonth.netProfit = currentMonth.revenue - Object.values(currentMonth.expenses).reduce((sum, val) => sum + val, 0);

const profitMargin = ((currentMonth.netProfit / currentMonth.revenue) * 100).toFixed(1);

export function ProfitLoss() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Profit & Loss Statement</h1>
          <p className="text-sm text-slate-600 mt-1">Track revenue, expenses, and profitability</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
            <option>January 2026</option>
            <option>December 2025</option>
            <option>November 2025</option>
            <option>Custom Period</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">
                PKR {currentMonth.revenue.toLocaleString()}
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
              <p className="text-sm text-slate-600">Total Expenses</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">
                PKR{' '}
                {Object.values(currentMonth.expenses)
                  .reduce((sum, val) => sum + val, 0)
                  .toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Net Profit</p>
              <h3 className="text-2xl font-bold text-green-600">
                PKR {currentMonth.netProfit.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Profit Margin</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{profitMargin}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed P&L Statement */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">January 2026 - Profit & Loss Statement</h3>
        <div className="space-y-1">
          {/* Revenue Section */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-green-900">Revenue (Sales)</span>
              <span className="font-bold text-xl text-green-700">
                PKR {currentMonth.revenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Expense Sections */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-base text-slate-800">Operating Expenses</span>
            </div>
            <div className="space-y-2 ml-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Raw Material Cost</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.rawMaterial.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Production Cost</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.production.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Labour Wages</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.labour.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Utilities (Electricity, Gas, Water)</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.utilities.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Transportation</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.transportation.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Maintenance & Repairs</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.maintenance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-700">Other Expenses</span>
                <span className="font-medium text-slate-900">
                  PKR {currentMonth.expenses.other.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-red-900">Total Expenses</span>
              <span className="font-bold text-xl text-red-700">
                PKR{' '}
                {Object.values(currentMonth.expenses)
                  .reduce((sum, val) => sum + val, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg border-2 border-green-300 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-2xl text-green-900">Net Profit</span>
                <p className="text-sm text-green-700 mt-1">Profit Margin: {profitMargin}%</p>
              </div>
              <span className="font-bold text-3xl text-green-700">
                PKR {currentMonth.netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expense Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Revenue vs Expense Trend (5 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="totalExpense" stroke="#ef4444" strokeWidth={3} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Net Profit Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Net Profit Trend (5 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="netProfit" fill="#22c55e" name="Net Profit (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Expense Category Breakdown (Current Month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(currentMonth.expenses).map(([key, value]) => {
            const percentage = ((value / Object.values(currentMonth.expenses).reduce((sum, v) => sum + v, 0)) * 100).toFixed(1);
            return (
              <div key={key} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-600 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xl font-bold text-[var(--navy)]">PKR {value.toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">{percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

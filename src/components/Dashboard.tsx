import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const kpiData = [
  {
    title: "Today's Sales",
    value: 'PKR 185,500',
    change: '+12.5%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Monthly Revenue',
    value: 'PKR 3,245,000',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Monthly Profit',
    value: 'PKR 845,300',
    change: '+5.4%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Cash in Hand',
    value: 'PKR 425,000',
    change: '-3.2%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Cash in Market',
    value: 'PKR 1,150,000',
    change: '+15.8%',
    trend: 'up',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    title: 'Total Inventory Value',
    value: 'PKR 2,340,000',
    change: '+2.1%',
    trend: 'up',
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];

const salesTrendData = [
  { date: 'Jan 20', sales: 120000, profit: 35000 },
  { date: 'Jan 21', sales: 145000, profit: 42000 },
  { date: 'Jan 22', sales: 135000, profit: 38000 },
  { date: 'Jan 23', sales: 165000, profit: 48000 },
  { date: 'Jan 24', sales: 155000, profit: 45000 },
  { date: 'Jan 25', sales: 185000, profit: 52000 },
  { date: 'Jan 26', sales: 185500, profit: 53000 },
];

const expenseProfitData = [
  { month: 'Sep', expenses: 180000, profit: 65000 },
  { month: 'Oct', expenses: 195000, profit: 72000 },
  { month: 'Nov', expenses: 205000, profit: 68000 },
  { month: 'Dec', expenses: 210000, profit: 78000 },
  { month: 'Jan', expenses: 220000, profit: 84000 },
];

const productSalesData = [
  { name: 'Desi Ghee', value: 45, amount: 1456000 },
  { name: 'Butter', value: 30, amount: 972000 },
  { name: 'Khoya', value: 20, amount: 648000 },
  { name: 'Cream', value: 5, amount: 162000 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

const lowStockAlerts = [
  { product: 'Desi Ghee', current: 45, min: 50, unit: 'kg' },
  { product: 'Butter', current: 28, min: 40, unit: 'kg' },
];

const pendingRecoveries = [
  { customer: 'Ahmed Foods', amount: 125000, days: 32, status: 'overdue' },
  { customer: 'Karachi Mart', amount: 85000, days: 18, status: 'pending' },
  { customer: 'Fresh Store', amount: 45000, days: 8, status: 'current' },
];

const topProducts = [
  { name: 'Desi Ghee (Premium)', sales: 245000, units: 350 },
  { name: 'Butter (500g)', sales: 185000, units: 740 },
  { name: 'Khoya (Fresh)', sales: 142000, units: 284 },
];

const recentTransactions = [
  { id: 'INV-1243', customer: 'Ahmed Foods', product: 'Desi Ghee', amount: 45000, type: 'credit', time: '2 hrs ago' },
  { id: 'INV-1242', customer: 'Cash Sale', product: 'Butter', amount: 12500, type: 'cash', time: '3 hrs ago' },
  { id: 'PUR-524', supplier: 'Cream Supplier', product: 'Fresh Cream', amount: -25000, type: 'purchase', time: '5 hrs ago' },
  { id: 'INV-1241', customer: 'Fresh Store', product: 'Khoya', amount: 28000, type: 'cash', time: '6 hrs ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-[var(--navy)] mt-2">{kpi.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-600" />
                  ) : (
                    <TrendingDown size={16} className="text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {kpi.change}
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-lg`}>
                <kpi.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Sales & Profit Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="#22c55e"
                fill="#86efac"
                name="Sales (PKR)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="2"
                stroke="#3b82f6"
                fill="#93c5fd"
                name="Profit (PKR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense vs Profit */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Expense vs Profit (Last 5 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseProfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses (PKR)" />
              <Bar dataKey="profit" fill="#22c55e" name="Profit (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product-wise Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Product-wise Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productSalesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productSalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {productSalesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900">PKR {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-orange-500" />
            <h3>Low Stock Alerts</h3>
          </div>
          <div className="space-y-4">
            {lowStockAlerts.map((item, index) => (
              <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{item.product}</span>
                  <span className="text-sm text-orange-600 font-medium">Low Stock</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Current: {item.current} {item.unit}
                  </span>
                  <span className="text-slate-600">
                    Min: {item.min} {item.unit}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${(item.current / item.min) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">Cream</span>
                <span className="text-sm text-green-600 font-medium">Good Stock</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-slate-600">Current: 85 liters</span>
                <span className="text-slate-600">Min: 50 liters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Award size={20} className="text-[var(--dairy-green-dark)]" />
            <h3>Top Performing Products</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 text-[var(--dairy-green-dark)] rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-600">{item.units} units sold</span>
                    <span className="text-sm font-medium text-[var(--dairy-green-dark)]">
                      PKR {item.sales.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Recoveries */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Pending Recoveries</h3>
          <div className="space-y-3">
            {pendingRecoveries.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.customer}</p>
                  <p className="text-sm text-slate-600 mt-1">Due for {item.days} days</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">PKR {item.amount.toLocaleString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.status === 'overdue' ? 'Overdue' : item.status === 'pending' ? 'Pending' : 'Current'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((txn, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{txn.id}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        txn.type === 'cash'
                          ? 'bg-green-100 text-green-700'
                          : txn.type === 'credit'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {txn.type === 'purchase' ? 'Purchase' : txn.type === 'cash' ? 'Cash' : 'Credit'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {txn.customer || txn.supplier} • {txn.product}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{txn.time}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      txn.type === 'purchase' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {txn.type === 'purchase' ? '' : '+'}PKR {Math.abs(txn.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

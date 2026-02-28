import { Download, FileText, Calendar, Filter } from 'lucide-react';

const reportTypes = [
  {
    category: 'Sales Reports',
    reports: [
      { name: 'Daily Sales Report', description: 'Detailed daily sales breakdown', icon: '📊' },
      { name: 'Product-wise Sales', description: 'Sales analysis by product', icon: '🥛' },
      { name: 'Customer Ledger', description: 'Customer transaction history', icon: '👥' },
      { name: 'Credit Sales Report', description: 'All credit sales and status', icon: '💳' },
    ],
  },
  {
    category: 'Inventory Reports',
    reports: [
      { name: 'Stock Summary', description: 'Current stock levels', icon: '📦' },
      { name: 'Stock Movement', description: 'Inflow and outflow analysis', icon: '🔄' },
      { name: 'Low Stock Alert', description: 'Products below minimum level', icon: '⚠️' },
      { name: 'Inventory Valuation', description: 'Stock value report', icon: '💰' },
    ],
  },
  {
    category: 'Production Reports',
    reports: [
      { name: 'Production Summary', description: 'Daily/monthly production data', icon: '🏭' },
      { name: 'Batch Analysis', description: 'Production batch efficiency', icon: '📈' },
      { name: 'Cost Analysis', description: 'Production cost breakdown', icon: '💵' },
      { name: 'Raw Material Usage', description: 'Material consumption report', icon: '🧈' },
    ],
  },
  {
    category: 'Financial Reports',
    reports: [
      { name: 'Profit & Loss', description: 'Income statement', icon: '📊' },
      { name: 'Balance Sheet', description: 'Financial position', icon: '⚖️' },
      { name: 'Cash Flow Statement', description: 'Cash movement analysis', icon: '💸' },
      { name: 'Expense Report', description: 'Detailed expense breakdown', icon: '💳' },
    ],
  },
  {
    category: 'Labour Reports',
    reports: [
      { name: 'Attendance Report', description: 'Labour attendance tracking', icon: '📅' },
      { name: 'Wage Summary', description: 'Salary and wages report', icon: '💰' },
      { name: 'Labour Dues', description: 'Outstanding labour payments', icon: '⏰' },
      { name: 'Productivity Report', description: 'Labour productivity analysis', icon: '📊' },
    ],
  },
  {
    category: 'Recovery Reports',
    reports: [
      { name: 'Outstanding Balances', description: 'Customer receivables', icon: '💵' },
      { name: 'Aging Analysis', description: 'Receivables aging report', icon: '📆' },
      { name: 'Payment History', description: 'Recovery tracking', icon: '✅' },
      { name: 'Overdue Report', description: 'Overdue payments list', icon: '🚨' },
    ],
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate detailed reports for business insights and decision making
          </p>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Period</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input
              type="date"
              defaultValue="2026-01-01"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input
              type="date"
              defaultValue="2026-01-26"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      {reportTypes.map((category, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.reports.map((report, reportIndex) => (
              <div
                key={reportIndex}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{report.icon}</div>
                  <div>
                    <h4 className="font-medium text-slate-900">{report.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-600 hover:text-[var(--dairy-green-dark)] hover:bg-white rounded-lg transition-colors">
                    <FileText size={20} />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-[var(--dairy-green-dark)] hover:bg-white rounded-lg transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Analytics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Quick Analytics Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-slate-600 mb-2">Best Selling Product</p>
            <p className="text-2xl font-bold text-green-700">Desi Ghee</p>
            <p className="text-sm text-slate-600 mt-2">PKR 1,456,000 revenue</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-slate-600 mb-2">Top Customer</p>
            <p className="text-2xl font-bold text-blue-700">Ahmed Foods</p>
            <p className="text-sm text-slate-600 mt-2">PKR 245,000 this month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-slate-600 mb-2">Avg. Daily Sales</p>
            <p className="text-2xl font-bold text-purple-700">PKR 124,808</p>
            <p className="text-sm text-slate-600 mt-2">26 days tracked</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2">Export All Reports</h3>
            <p className="text-sm text-slate-600">
              Download comprehensive business reports in multiple formats
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Export as Excel
            </button>
            <button className="px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

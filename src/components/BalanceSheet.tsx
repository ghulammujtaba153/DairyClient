import { Download, TrendingUp } from 'lucide-react';

const balanceSheet = {
  assets: {
    current: {
      cash: 425000,
      bank: 1250000,
      inventory: 436600,
      receivables: 350000,
    },
    fixed: {
      equipment: 2500000,
      vehicles: 1800000,
      building: 5000000,
    },
  },
  liabilities: {
    current: {
      payables: 210000,
      labourDues: 78200,
      utilities: 15000,
    },
    longTerm: {
      loans: 800000,
    },
  },
};

const totalCurrentAssets = Object.values(balanceSheet.assets.current).reduce((sum, val) => sum + val, 0);
const totalFixedAssets = Object.values(balanceSheet.assets.fixed).reduce((sum, val) => sum + val, 0);
const totalAssets = totalCurrentAssets + totalFixedAssets;

const totalCurrentLiabilities = Object.values(balanceSheet.liabilities.current).reduce((sum, val) => sum + val, 0);
const totalLongTermLiabilities = Object.values(balanceSheet.liabilities.longTerm).reduce((sum, val) => sum + val, 0);
const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

const netWorth = totalAssets - totalLiabilities;

export function BalanceSheet() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Balance Sheet</h1>
          <p className="text-sm text-slate-600 mt-1">Financial position statement as of January 26, 2026</p>
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
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Assets</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalAssets.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Liabilities</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">
                PKR {totalLiabilities.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Net Business Worth (Equity)</p>
              <h3 className="text-2xl font-bold text-green-600">PKR {netWorth.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">Assets - Liabilities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 text-xl font-bold text-green-700">ASSETS</h3>

          {/* Current Assets */}
          <div className="mb-6">
            <h4 className="mb-3 font-medium text-slate-800">Current Assets</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Cash in Hand</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.current.cash.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Cash in Bank</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.current.bank.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Inventory / Stock</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.current.inventory.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Accounts Receivable</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.current.receivables.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-green-50 rounded px-2 mt-2">
                <span className="font-bold text-green-900">Total Current Assets</span>
                <span className="font-bold text-green-700">PKR {totalCurrentAssets.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Fixed Assets */}
          <div className="mb-4">
            <h4 className="mb-3 font-medium text-slate-800">Fixed Assets</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Equipment & Machinery</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.fixed.equipment.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Vehicles</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.fixed.vehicles.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Building / Property</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.assets.fixed.building.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-green-50 rounded px-2 mt-2">
                <span className="font-bold text-green-900">Total Fixed Assets</span>
                <span className="font-bold text-green-700">PKR {totalFixedAssets.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Total Assets */}
          <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border-2 border-green-300 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl text-green-900">TOTAL ASSETS</span>
              <span className="font-bold text-2xl text-green-700">PKR {totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 text-xl font-bold text-red-700">LIABILITIES</h3>

          {/* Current Liabilities */}
          <div className="mb-6">
            <h4 className="mb-3 font-medium text-slate-800">Current Liabilities</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Accounts Payable</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.liabilities.current.payables.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Labour Dues</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.liabilities.current.labourDues.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Utilities Payable</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.liabilities.current.utilities.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-red-50 rounded px-2 mt-2">
                <span className="font-bold text-red-900">Total Current Liabilities</span>
                <span className="font-bold text-red-700">
                  PKR {totalCurrentLiabilities.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Long-term Liabilities */}
          <div className="mb-4">
            <h4 className="mb-3 font-medium text-slate-800">Long-term Liabilities</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700">Bank Loans</span>
                <span className="font-medium text-slate-900">
                  PKR {balanceSheet.liabilities.longTerm.loans.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-red-50 rounded px-2 mt-2">
                <span className="font-bold text-red-900">Total Long-term Liabilities</span>
                <span className="font-bold text-red-700">
                  PKR {totalLongTermLiabilities.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Liabilities */}
          <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-lg border-2 border-red-300 mt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl text-red-900">TOTAL LIABILITIES</span>
              <span className="font-bold text-2xl text-red-700">PKR {totalLiabilities.toLocaleString()}</span>
            </div>
          </div>

          {/* Owner's Equity */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-purple-700">OWNER'S EQUITY</h3>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg border-2 border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xl text-purple-900">Net Business Worth</span>
                  <p className="text-sm text-purple-700 mt-1">Total Assets - Total Liabilities</p>
                </div>
                <span className="font-bold text-3xl text-purple-700">PKR {netWorth.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Key Financial Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Current Ratio</p>
            <p className="text-2xl font-bold text-[var(--navy)]">
              {(totalCurrentAssets / totalCurrentLiabilities).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Current Assets / Current Liabilities</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Debt-to-Equity Ratio</p>
            <p className="text-2xl font-bold text-[var(--navy)]">{(totalLiabilities / netWorth).toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1">Total Liabilities / Equity</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Asset Turnover</p>
            <p className="text-2xl font-bold text-[var(--navy)]">
              {((3245000 / totalAssets) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Revenue / Total Assets</p>
          </div>
        </div>
      </div>

      {/* Accounting Equation Verification */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-300">
        <h3 className="mb-3 text-center">Accounting Equation Verification</h3>
        <div className="flex items-center justify-center gap-4 text-lg">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Assets</p>
            <p className="text-2xl font-bold text-green-700">PKR {totalAssets.toLocaleString()}</p>
          </div>
          <span className="text-3xl font-bold text-slate-400">=</span>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Liabilities</p>
            <p className="text-2xl font-bold text-red-700">PKR {totalLiabilities.toLocaleString()}</p>
          </div>
          <span className="text-3xl font-bold text-slate-400">+</span>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Equity</p>
            <p className="text-2xl font-bold text-purple-700">PKR {netWorth.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-center text-sm text-green-700 mt-4 font-medium">✓ Balance Sheet is Balanced</p>
      </div>
    </div>
  );
}

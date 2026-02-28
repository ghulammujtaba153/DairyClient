import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Users, DollarSign, TrendingDown, Calendar, Loader2, X, Check, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  getLabour, getLabourStats, createLabour, 
  markAttendance, recordAdvance, getRecentTransactions,
  LabourProfile, LabourStats, LabourTransaction 
} from '../api/labour';
import { AddLabourModal } from './labour/AddLabourModal';
import { AttendanceModal } from './labour/AttendanceModal';
import { AdvanceModal } from './labour/AdvanceModal';


// --- Main Page ---

export function Labour() {
  const [labourProfiles, setLabourProfiles] = useState<LabourProfile[]>([]);
  const [stats, setStats] = useState<LabourStats | null>(null);
  const [transactions, setTransactions] = useState<LabourTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttModalOpen, setIsAttModalOpen] = useState(false);
  const [isAdvModalOpen, setIsAdvModalOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState<LabourProfile | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profiles, statData, txData] = await Promise.all([
        getLabour(),
        getLabourStats(),
        getRecentTransactions()
      ]);
      setLabourProfiles(profiles);
      setStats(statData);
      setTransactions(txData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const totalLabour = stats?.totalLabour || 0;
  const monthlyExpense = stats?.monthlyExpenseData.reduce((sum, m) => sum + m.amount, 0) || 0;
  const totalAdvances = labourProfiles.reduce((sum, l) => sum + Number(l.total_advances), 0);
  const totalBalance = labourProfiles.reduce((sum, l) => sum + Number(l.balance), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[var(--dairy-green-dark)]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-8 rounded-2xl border border-red-200 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <div>
          <h2 className="text-xl font-bold">Failed to Load Labour Data</h2>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
        <button 
          onClick={() => fetchData()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg"
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
          <h1>Labour Management</h1>
          <p className="text-sm text-slate-600 mt-1">Track labour attendance, wages, and payments</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Labour
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Labour</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{totalLabour}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Disbursed (Month)</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {monthlyExpense.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Advances</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalAdvances.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Balance Payable</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {totalBalance.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Labour Profiles */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-[var(--navy)]">Labour Profiles</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {labourProfiles.map((labour) => (
              <div key={labour.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-slate-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[var(--dairy-green)] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner uppercase">
                      {labour.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--navy)]">{labour.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">{labour.role}</span>
                        <span className="text-xs font-medium text-slate-500 bg-white border px-2 py-0.5 rounded-full">{labour.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 font-medium">Balance Payable</p>
                    <p className="text-xl font-bold text-red-600 leading-tight">PKR {labour.balance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Daily Wage</p>
                    <p className="text-sm font-bold text-[var(--navy)]">PKR {labour.daily_wage}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Days Worked</p>
                    <p className="text-sm font-bold text-blue-600">{labour.days_worked} days</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Advances</p>
                    <p className="text-sm font-bold text-orange-600">PKR {labour.total_advances.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedLabour(labour); setIsAttModalOpen(true); }}
                    className="flex-1 px-4 py-2 text-sm font-bold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                  >
                    Attendance
                  </button>
                  <button 
                    onClick={() => { setSelectedLabour(labour); setIsAdvModalOpen(true); }}
                    className="flex-1 px-4 py-2 text-sm font-bold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all"
                  >
                    Advance
                  </button>
                  <Link 
                    to={`/labour/${labour.id}`}
                    className="flex-1 px-4 py-2 text-sm font-bold bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-opacity-90 transition-all text-center flex items-center justify-center gap-2"
                  >
                    History
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 font-bold">Attendance Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.attendanceData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#22c55e" name="Present / Late" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="mb-4 font-bold">Monthly Labour Disbursement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.monthlyExpenseData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#ef4444" name="Amount (PKR)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4 font-bold text-lg">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Labour</th>
                <th className="text-center py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-right py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{txn.labour_name}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${
                      txn.type === 'advance' ? 'bg-orange-100 text-orange-700' : 
                      txn.type === 'bonus' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {txn.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-sm text-right font-bold ${
                    txn.type === 'bonus' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    PKR {txn.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 italic max-w-xs truncate">{txn.notes || '-'}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No recent transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddLabourModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchData} />
      <AttendanceModal isOpen={isAttModalOpen} onClose={() => setIsAttModalOpen(false)} onSuccess={fetchData} labour={selectedLabour} />
      <AdvanceModal isOpen={isAdvModalOpen} onClose={() => setIsAdvModalOpen(false)} onSuccess={fetchData} labour={selectedLabour} />
    </div>
  );
}

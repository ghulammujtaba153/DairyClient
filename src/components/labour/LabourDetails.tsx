import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  TrendingUp,
  History,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { getLabourById, getLabourHistory, deleteAttendance } from '../../api/labour';
import type { LabourProfile, AttendanceRecord, LabourTransaction } from '../../api/labour';
import { AttendanceModal } from './AttendanceModal';

export function LabourDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [labour, setLabour] = useState<LabourProfile | null>(null);
  const [history, setHistory] = useState<{ attendance: AttendanceRecord[], transactions: LabourTransaction[] }>({ attendance: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAttModalOpen, setIsAttModalOpen] = useState(false);
  const [selectedAttRecord, setSelectedAttRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const handleDeleteAttendance = async (attId: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      await deleteAttendance(attId);
      if (id) fetchData(id);
    } catch (err) {
      alert('Failed to delete attendance record');
    }
  };

  const fetchData = async (labourId: string) => {
    try {
      setLoading(true);
      const [profile, hist] = await Promise.all([
        getLabourById(labourId),
        getLabourHistory(labourId)
      ]);
      setLabour(profile);
      setHistory(hist);
    } catch (err) {
      setError('Failed to fetch labour details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error || !labour) return (
    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-center gap-3">
      <AlertCircle className="w-6 h-6" />
      <p>{error || 'Labour not found'}</p>
      <button onClick={() => navigate('/labour')} className="ml-auto underline font-bold">Back to List</button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/labour')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{labour.name}</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{labour.role}</span>
            • Joining Date: {new Date(labour.joining_date).toLocaleDateString()}
          </p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Worker Profile</h2>
          
          <div className="space-y-4">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Phone Number</p>
                <p className="text-slate-700 font-medium">{labour.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Daily Wage</p>
                <p className="text-slate-700 font-medium">RS {labour.daily_wage.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Status</p>
                <p className={`font-bold capitalize ${labour.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                  {labour.status}
                </p>
              </div>
            </div>
          </div>

          
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <TrendingUp className="w-8 h-8 opacity-50 mb-4" />
            <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider">Total Earned</p>
            <h3 className="text-3xl font-black">RS {labour.total_earned.toLocaleString()}</h3>
            <p className="text-indigo-200 text-xs mt-2">Based on {labour.days_worked} work days</p>
          </div>

          <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
            <DollarSign className="w-8 h-8 opacity-50 mb-4" />
            <p className="text-orange-100 font-bold text-sm uppercase tracking-wider">Total Advances</p>
            <h3 className="text-3xl font-black">RS {labour.total_advances.toLocaleString()}</h3>
            <p className="text-orange-200 text-xs mt-2">Pending deduction from balance</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-200">
            <AlertCircle className="w-8 h-8 opacity-50 mb-4 text-emerald-400" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Current Balance</p>
            <h3 className="text-3xl font-black text-emerald-400">RS {labour.balance.toLocaleString()}</h3>
            <p className="text-slate-400 text-xs mt-2">Net payable to worker</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Recent Attendance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.attendance.length > 0 ? history.attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {att.status === 'present' && <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> Present</span>}
                      {att.status === 'absent' && <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><XCircle className="w-4 h-4" /> Absent</span>}
                      {att.status === 'late' && <span className="flex items-center gap-1 text-orange-600 font-bold text-xs"><Clock className="w-4 h-4" /> Late</span>}
                      {att.status === 'half-day' && <span className="flex items-center gap-1 text-blue-600 font-bold text-xs"><Clock className="w-4 h-4" /> Half Day</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedAttRecord(att);
                            setIsAttModalOpen(true);
                          }}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAttendance(att.id)}
                          title="Delete"
                          className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">No attendance records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-orange-500" />
              Payment History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.transactions.length > 0 ? history.transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        txn.type === 'advance' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {txn.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                      ₹ {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">
                      {txn.payment_method}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AttendanceModal 
        isOpen={isAttModalOpen} 
        onClose={() => {
          setIsAttModalOpen(false);
          setSelectedAttRecord(null);
        }} 
        onSuccess={() => id && fetchData(id)} 
        labour={labour} 
        initialData={selectedAttRecord}
      />
    </div>
  );
}

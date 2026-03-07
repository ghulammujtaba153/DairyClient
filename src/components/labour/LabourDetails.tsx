import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Phone, 
  Clock, 
  AlertCircle,
  TrendingUp,
  History,
  CheckCircle2,
  XCircle,
  Percent
} from 'lucide-react';
import { getLabourById, getLabourHistory, deleteAttendance, deleteTransaction } from '../../api/labour';
import type { LabourProfile, AttendanceRecord, LabourTransaction } from '../../api/labour';
import { AttendanceModal } from './AttendanceModal';
import { AttendanceHistory } from './AttendanceHistory';
import { PaymentHistory } from './PaymentHistory';

export function LabourDetails() {
  const { id } = useParams();
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

  const handleDeleteTransaction = async (txnId: number) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      await deleteTransaction(txnId);
      if (id) fetchData(id);
    } catch (err) {
      alert('Failed to delete transaction');
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dairy-green)]"></div>
    </div>
  );

  if (error || !labour) return (
    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-center gap-3">
      <AlertCircle className="w-6 h-6" />
      <p>{error || 'Labour not found'}</p>
      <button onClick={() => navigate('/labour')} className="ml-auto underline font-bold">Back to List</button>
    </div>
  );

  const attendanceRate = labour.attendance_days > 0 
    ? Math.round((labour.present_days / labour.attendance_days) * 100) 
    : 0;

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
            <span className="bg-[var(--dairy-green)] text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{labour.role}</span>
            • Joining Date: {new Date(labour.joining_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earnings</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Earned</p>
            <h3 className="text-3xl font-black text-slate-900">PKR {labour.total_earned.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-slate-400">Fixed salary for {labour.total_months} month(s)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advances</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Advances</p>
            <h3 className="text-3xl font-black text-orange-600">PKR {labour.total_advances.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-slate-400">Pending deductions</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To Pay</span>
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">Current Balance</p>
            <h3 className="text-3xl font-black text-emerald-400">PKR {labour.balance.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-slate-400">Net payable amount</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-4">
          <div className="p-2.5 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-green-700 font-bold uppercase tracking-tight">Present</p>
            <p className="text-xl font-black text-green-900">{labour.present_days} Days</p>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex items-center gap-4">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-red-700 font-bold uppercase tracking-tight">Absent</p>
            <p className="text-xl font-black text-red-900">{labour.absent_days} Days</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-blue-700 font-bold uppercase tracking-tight">Late / Half</p>
            <p className="text-xl font-black text-blue-900">{labour.half_days} Days</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex items-center gap-4">
          <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-xs text-purple-700 font-bold uppercase tracking-tight">Attendance</p>
            <p className="text-xl font-black text-purple-900">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Attendance History */}
        <AttendanceHistory 
          attendance={history.attendance} 
          onEdit={(record) => {
            setSelectedAttRecord(record);
            setIsAttModalOpen(true);
          }}
          onDelete={handleDeleteAttendance}
        />

        {/* Transaction History */}
        <PaymentHistory 
          transactions={history.transactions}
          onDelete={handleDeleteTransaction}
        />
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

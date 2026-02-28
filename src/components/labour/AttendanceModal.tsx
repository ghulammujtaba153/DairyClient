import React, { useState } from 'react';
import { X, Loader2, Check, Clock, AlertCircle } from 'lucide-react';
import { markAttendance, LabourProfile, AttendanceRecord } from '../../api/labour';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  labour: LabourProfile | null;
  initialData?: AttendanceRecord | null;
}

export function AttendanceModal({ isOpen, onClose, onSuccess, labour, initialData }: AttendanceModalProps) {
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], status: 'present', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: initialData?.status || 'present',
        notes: initialData?.notes || ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen || !labour) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await markAttendance({
        labour_id: labour.id,
        date: formData.date,
        status: formData.status as any,
        notes: formData.notes
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Mark Attendance</h3>
            <p className="text-xs text-slate-500 mt-0.5">{labour.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Date*</label>
            <input
              type="date" required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.date}
              onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Status*</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'present', label: 'Present', color: 'text-green-600', icon: Check },
                { id: 'absent', label: 'Absent', color: 'text-red-600', icon: X },
                { id: 'late', label: 'Late', color: 'text-orange-600', icon: Clock },
                { id: 'half-day', label: 'Half Day', color: 'text-blue-600', icon: AlertCircle },
              ].map(opt => (
                <button
                  key={opt.id} type="button"
                  onClick={() => setFormData({ ...formData, status: opt.id })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    formData.status === opt.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <opt.icon size={18} className={opt.color} />
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Special Notes</label>
            <textarea
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px] resize-none"
              placeholder="Any specific details..."
              value={formData.notes}
              onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit" disabled={submitting}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold shadow-md shadow-green-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving...</span>
                </>
              ) : 'Submit Attendance'}
            </button>

            
            
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { recordAdvance, LabourProfile } from '../../api/labour';

interface AdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  labour: LabourProfile | null;
}

export function AdvanceModal({ isOpen, onClose, onSuccess, labour }: AdvanceModalProps) {
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    type: 'advance', 
    amount: '', 
    payment_method: 'Cash',
    notes: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !labour) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await recordAdvance({
        labour_id: labour.id,
        date: formData.date,
        type: formData.type as any,
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        notes: formData.notes
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to record transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Record Transaction</h3>
            <p className="text-xs text-slate-500 mt-0.5">{labour.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date*</label>
              <input
                type="date" required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.date}
                onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type*</label>
              <select
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                value={formData.type}
                onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="advance">💸 Advance</option>
                <option value="salary_payment">🏦 Salary Payment</option>
                <option value="bonus">🎁 Bonus</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (PKR)*</label>
            <input
              type="number" required
              placeholder="e.g. 5000"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-lg"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: (e.target as HTMLInputElement).value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <input
              type="text" placeholder="e.g. Cash, JazzCash, etc."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={formData.payment_method}
              onChange={e => setFormData({ ...formData, payment_method: (e.target as HTMLInputElement).value })}
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
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving...</span>
                </>
              ) : 'Confirm Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

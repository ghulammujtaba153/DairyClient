import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createLabour } from '../../api/labour';

interface AddLabourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLabourModal({ isOpen, onClose, onSuccess }: AddLabourModalProps) {
  const [formData, setFormData] = useState({ name: '', role: '', daily_wage: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createLabour({
        name: formData.name,
        role: formData.role,
        daily_wage: Number(formData.daily_wage),
        phone: formData.phone
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to add labour');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Add New Labour</h3>
            <p className="text-xs text-slate-500 mt-0.5">Worker Onboarding</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Worker Name*</label>
            <input
              type="text" required
              placeholder="e.g. Muhammad Ali"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
            <input
              type="text" placeholder="e.g. Production Worker"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
              value={formData.role}
              onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Daily Wage (PKR)*</label>
              <input
                type="number" required
                placeholder="1000"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
                value={formData.daily_wage}
                onChange={(e: any) => setFormData({ ...formData, daily_wage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="0300-1234567"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
                value={formData.phone}
                onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
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
              ) : 'Add Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

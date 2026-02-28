import React from 'react';
import { User, Mail, Phone, MapPin, Loader2, X } from 'lucide-react';
import { Supplier } from '../../api/suppliers';

interface SupplierModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e?: React.FormEvent) => void;
	form: Partial<Supplier>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	isSubmitting: boolean;
	editing: number | null;
}

export function SupplierModal({
	isOpen,
	onClose,
	onSubmit,
	form,
	onChange,
	isSubmitting,
	editing
}: SupplierModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl animate-in zoom-in duration-300">
				<div className="flex items-center justify-between mb-6 border-b pb-4">
					<h3 className="text-xl font-bold text-slate-900">
						{editing ? 'Update Supplier' : 'Add New Supplier'}
					</h3>
					<button 
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				<form onSubmit={onSubmit} className="space-y-4">
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
							<User size={16} /> Supplier Name*
						</label>
						<input
							name="name"
							type="text"
							placeholder="e.g. Quality Dairy Supplies"
							value={form.name || ''}
							onChange={onChange}
							className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
							required
						/>
					</div>
					
					{/* Contact Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
								<Mail size={16} /> Email Address
							</label>
							<input
								name="email"
								type="email"
								placeholder="supplier@example.com"
								value={form.email || ''}
								onChange={onChange}
								className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
								<Phone size={16} /> Phone Number
							</label>
							<input
								name="phone"
								type="text"
								placeholder="0300-9876543"
								value={form.phone || ''}
								onChange={onChange}
								className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all"
							/>
						</div>
					</div>

					{/* Address */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
							<MapPin size={16} /> Business Address
						</label>
						<textarea
							name="address"
							placeholder="Full address here..."
							value={form.address || ''}
							onChange={onChange}
							className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)] transition-all min-h-[100px] resize-none"
						/>
					</div>

					{/* Footer Actions */}
					<div className="flex gap-3 mt-8 pt-4 border-t">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-[1.5] px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-all font-bold shadow-md shadow-green-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									<span>Saving...</span>
								</>
							) : (
								editing ? 'Save Changes' : 'Create Supplier'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SupplierModal;

import React, { useEffect, useState, useMemo } from 'react';
import {
	Supplier,
	getSuppliers,
	createSupplier,
	updateSupplier,
	deleteSupplier,
} from '../api/suppliers';
import { 
	Plus, 
	Edit, 
	Trash2, 
	Search, 
	Truck, 
	AlertCircle,
	Loader2,
	Package,
	BarChart3,
	ClipboardCheck
} from 'lucide-react';
import { SupplierModal } from './suppliers/SupplierModal';

export function Suppliers(): JSX.Element {
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const [editing, setEditing] = useState<number | null>(null);
	const [form, setForm] = useState<Partial<Supplier>>({ name: '' });
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const data = await getSuppliers();
			setSuppliers(data || []);
		} catch (err: any) {
			setError(err.message || 'Failed to load suppliers');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const filteredSuppliers = useMemo(() => {
		return suppliers.filter((s: Supplier) => {
			const query = searchQuery.toLowerCase();
			return (
				s.name.toLowerCase().indexOf(query) !== -1 ||
				(s.email && s.email.toLowerCase().indexOf(query) !== -1) ||
				(s.phone && s.phone.indexOf(searchQuery) !== -1)
			);
		});
	}, [suppliers, searchQuery]);

	function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setForm((s: Partial<Supplier>) => ({ ...s, [name]: value }));
	}

	async function onSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		if (!form.name || form.name.trim() === '') {
			setError('Supplier name is required');
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			if (editing) {
				await updateSupplier(editing, form as Partial<Supplier>);
				setEditing(null);
			} else {
				await createSupplier(form as Partial<Supplier>);
			}
			setForm({ name: '' });
			setIsOpen(false);
			await load();
		} catch (err: any) {
			setError(err.message || 'Failed to save supplier');
		} finally {
			setIsSubmitting(false);
		}
	}

	function onEdit(s: Supplier) {
		setEditing(s.id ?? null);
		setForm({ 
			name: s.name, 
			email: s.email || '', 
			phone: s.phone || '', 
			address: s.address || '', 
			notes: s.notes || '' 
		});
		setIsOpen(true);
	}

	async function onDelete(id?: number) {
		if (!id) return;
		if (!confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) return;
		try {
			await deleteSupplier(id);
			await load();
		} catch (err: any) {
			setError(err.message || 'Failed to delete supplier');
		}
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1>Suppliers Management</h1>
					<p className="text-sm text-slate-600 mt-1">Manage your raw material providers and vendor contact information.</p>
				</div>
				<button
					onClick={() => {
						setEditing(null);
						setForm({ name: '' });
						setError(null);
						setIsOpen(true);
					}}
					className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
				>
					<Plus size={20} />
					Add Supplier
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<div className="flex items-center gap-3">
						<div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
							<Truck size={24} />
						</div>
						<div>
							<p className="text-sm text-slate-600">Total Vendors</p>
							<h3 className="text-2xl font-bold text-[var(--navy)]">{suppliers.length}</h3>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<div className="flex items-center gap-3">
						<div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
							<ClipboardCheck size={24} />
						</div>
						<div>
							<p className="text-sm text-slate-600">Active Partners</p>
							<h3 className="text-2xl font-bold text-[var(--navy)]">{suppliers.length}</h3>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<div className="flex items-center gap-3">
						<div className="bg-green-50 text-green-600 p-3 rounded-lg">
							<BarChart3 size={24} />
						</div>
						<div>
							<p className="text-sm text-slate-600">Filtered</p>
							<h3 className="text-2xl font-bold text-[var(--navy)]">{filteredSuppliers.length}</h3>
						</div>
					</div>
				</div>
			</div>

			{/* Suppliers Table */}
			<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-slate-800">Vendor List</h3>
					<div className="relative">
						<Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
						<input
							type="text"
							placeholder="Search suppliers..."
							className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{error && (
					<div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium">
						<AlertCircle size={18} />
						{error}
					</div>
				)}

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-slate-200">
								<th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Vendor Name</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-slate-600 hidden md:table-cell">Email</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-slate-600 hidden sm:table-cell">Phone</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-slate-600 hidden lg:table-cell">Address</th>
								<th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan={5} className="py-20 text-center text-slate-500">
										<div className="flex flex-col items-center gap-2">
											<Loader2 className="animate-spin text-[var(--dairy-green-dark)]" size={32} />
											<span>Loading vendors...</span>
										</div>
									</td>
								</tr>
							) : filteredSuppliers.length > 0 ? (
								filteredSuppliers.map((s) => (
									<tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
										<td className="py-3 px-4 text-sm font-medium text-slate-900">{s.name}</td>
										<td className="py-3 px-4 text-sm text-slate-600 hidden md:table-cell">{s.email || "-"}</td>
										<td className="py-3 px-4 text-sm text-slate-600 hidden sm:table-cell">{s.phone || "-"}</td>
										<td className="py-3 px-4 text-sm text-slate-600 hidden lg:table-cell truncate max-w-xs">{s.address || "-"}</td>
										<td className="py-3 px-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => onEdit(s)}
													className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
													title="Edit"
												>
													<Edit size={18} />
												</button>
												<button
													onClick={() => onDelete(s.id)}
													className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													title="Delete"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="py-20 text-center">
										<div className="flex flex-col items-center text-slate-500">
											<div className="p-4 bg-slate-50 rounded-full mb-4">
												<Package size={40} className="text-slate-300" />
											</div>
											<h4 className="font-bold text-slate-900">No vendors found</h4>
											<p className="text-sm max-w-[280px] mt-1">
												{searchQuery ? `No results for "${searchQuery}"` : "Maintain your supply chain by adding vendors."}
											</p>
											{!searchQuery && (
												<button
													onClick={() => setIsOpen(true)}
													className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-all"
												>
													<Plus size={18} /> Add Your First Vendor
												</button>
											)}
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<SupplierModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSubmit={onSubmit}
				form={form}
				onChange={onChange}
				isSubmitting={isSubmitting}
				editing={editing}
			/>
		</div>
	);
}

export default Suppliers;

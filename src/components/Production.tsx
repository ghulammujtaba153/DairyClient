import React, { useState, useEffect } from 'react';
import { Plus, Factory, TrendingUp, Loader2, Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProductions, getProductionStats, createProduction, updateProduction, deleteProduction, Production as ProductionModel, ProductionStats } from '../api/production';
import { getRawMaterials, RawMaterial } from '../api/rawMaterial';
import { getInventory, ProductStock } from '../api/inventory';

const productTabs = ['Desi Ghee', 'Butter', 'Khoya'];

export function Production() {
  const [activeTab, setActiveTab] = useState('Desi Ghee');
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productions, setProductions] = useState<ProductionModel[]>([]);
  const [stats, setStats] = useState<ProductionStats | null>(null);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [inventory, setInventory] = useState<ProductStock[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    production_name: 'Desi Ghee',
    production_date: new Date().toISOString().split('T')[0],
    raw_material_id: '',
    raw_material_quantity: '',
    production_output: '',
    labour_cost: '',
    other_cost: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const [prodData, statsData, rmData, invData] = await Promise.all([
        getProductions(),
        getProductionStats(),
        getRawMaterials(),
        getInventory()
      ]);
      setProductions(prodData || []);
      setStats(statsData);
      setRawMaterials(rmData || []);
      setInventory(invData || []);
    } catch (err: any) {
      console.error('Fetch production error:', err);
      if (retryCount < 1) {
        setTimeout(() => fetchData(retryCount + 1), 1000);
      } else {
        setError('Failed to load production data.');
        setLoading(false);
      }
    } finally {
      if (retryCount >= 1 || !error) {
        setLoading(false);
      }
    }
  };

  // Derive available in-hand stock for a given material name from inventory
  const getAvailableStock = (materialName: string): number => {
    const inv = inventory.find(i => i.product_name === materialName);
    return inv ? Number(inv.in_hand_quantity) : 0;
  };

  // For the currently selected raw material, compute the usable available qty.
  // When editing, we add back the original batch's usage so the user isn't blocked
  // from re-saving the same or lower quantity.
  const selectedRM = rawMaterials.find(rm => String(rm.id) === formData.raw_material_id);
  const originalBatchQty = editingId
    ? (productions.find(p => p.id === editingId)?.raw_material_quantity || 0)
    : 0;
  const maxAvailable = selectedRM
    ? getAvailableStock(selectedRM.material) + Number(originalBatchQty)
    : Infinity;
  const enteredQty = Number(formData.raw_material_quantity);
  const isOverLimit = selectedRM && formData.raw_material_quantity !== '' && enteredQty > maxAvailable;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isOverLimit) {
      alert(`Quantity exceeds available stock. Maximum available: ${maxAvailable} ${selectedRM?.unit || 'units'}`);
      return;
    }
    try {
      setSubmitting(true);
      const labour = Number(formData.labour_cost);
      const other = Number(formData.other_cost);
      const inputQty = Number(formData.raw_material_quantity);
      const outputQty = Number(formData.production_output);
      const efficiency = inputQty > 0 ? Math.round((outputQty / inputQty) * 100) : 0;
      const totalCost = labour + other;

      const payload = {
        production_name: formData.production_name,
        production_date: formData.production_date,
        raw_material_id: Number(formData.raw_material_id),
        raw_material_quantity: inputQty,
        production_output: outputQty,
        efficiency,
        labour_cost: labour,
        other_cost: other,
        total_cost: totalCost,
        notes: formData.notes,
      };

      if (editingId) {
        await updateProduction(editingId, payload);
      } else {
        await createProduction(payload);
      }

      setShowProductionForm(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      console.error('Submit production error:', err);
      alert('Failed to save production: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (batch: ProductionModel) => {
    setEditingId(batch.id || null);
    setFormData({
      production_name: batch.production_name,
      production_date: batch.production_date,
      raw_material_id: String(batch.raw_material_id),
      raw_material_quantity: String(batch.raw_material_quantity),
      production_output: String(batch.production_output),
      labour_cost: String(batch.labour_cost),
      other_cost: String(batch.other_cost),
      notes: batch.notes || '',
    });
    setShowProductionForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this production batch?')) {
      try {
        await deleteProduction(id);
        fetchData();
      } catch (err: any) {
        console.error('Delete production error:', err);
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  if (loading && !productions.length && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--dairy-green)]" />
      </div>
    );
  }

  if (error && !productions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => fetchData()}
          className="px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredBatches = productions.filter((p: ProductionModel) => p.production_name === activeTab);
  const efficiencyData = stats?.efficiencyTrend || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Production Management</h1>
          <p className="text-sm text-slate-600 mt-1">Track production batches, costs, and efficiency</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              production_name: activeTab,
              production_date: new Date().toISOString().split('T')[0],
              raw_material_id: '',
              raw_material_quantity: '',
              production_output: '',
              labour_cost: '',
              other_cost: '',
              notes: '',
            });
            setShowProductionForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors"
        >
          <Plus size={20} />
          New Production Batch
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <Factory size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Batches</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{stats?.summary?.todayBatches || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg Efficiency</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{stats?.summary?.avgEfficiency || 0}%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <Factory size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">{stats?.summary?.thisMonthBatches || 0} Batches</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Production Cost</p>
              <h3 className="text-2xl font-bold text-[var(--navy)]">PKR {((stats?.summary?.totalProductionCost || 0) / 1000).toFixed(1)}K</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Production Efficiency Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[80, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ghee" stroke="#22c55e" strokeWidth={2} name="Desi Ghee (%)" />
            <Line type="monotone" dataKey="butter" stroke="#3b82f6" strokeWidth={2} name="Butter (%)" />
            <Line type="monotone" dataKey="khoya" stroke="#f59e0b" strokeWidth={2} name="Khoya (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex gap-2 p-2">
            {productTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--dairy-green-dark)] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Production Batches Table */}
        <div className="p-6">
          <h3 className="mb-4">{activeTab} Production Batches</h3>
          <div className="space-y-4">
            {filteredBatches.map((batch: ProductionModel) => (
              <div key={batch.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[var(--navy)]">BATCH-{batch.id}</h4>
                    <p className="text-sm text-slate-600 mt-1">{batch.production_date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                       <button 
                        onClick={() => handleEdit(batch)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(batch.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Efficiency</span>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          batch.efficiency >= 90
                            ? 'bg-green-100 text-green-700'
                            : batch.efficiency >= 85
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {batch.efficiency}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Raw Material Input</p>
                    <p className="text-xl font-bold text-[var(--navy)]">
                      {batch.raw_material_quantity} liters
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {batch.raw_material_name || 'Raw Material'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Product Output</p>
                    <p className="text-xl font-bold text-green-600">
                      {batch.production_output} kg
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activeTab}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Total Cost</p>
                    <p className="text-xl font-bold text-[var(--navy)]">
                      PKR {batch.total_cost.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Labour: PKR {batch.labour_cost} | Other: PKR {batch.other_cost}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Cost Per Unit</p>
                    <p className="text-xl font-bold text-purple-600">PKR {batch.production_output > 0 ? Math.round(batch.total_cost / batch.production_output) : 0}</p>
                    <p className="text-xs text-slate-500 mt-1">per kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Form Modal */}
      {showProductionForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4">{editingId ? 'Edit Production Batch' : 'New Production Batch'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Type</label>
                  <select 
                    value={formData.production_name}
                    onChange={(e: any) => setFormData({ ...formData, production_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                  >
                    <option>Desi Ghee</option>
                    <option>Butter</option>
                    <option>Khoya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Production Date</label>
                  <input
                    type="date"
                    value={formData.production_date}
                    onChange={(e: any) => setFormData({ ...formData, production_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Raw Material Input</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                    <select 
                      value={formData.raw_material_id}
                      onChange={(e) => setFormData({ ...formData, raw_material_id: e.target.value, raw_material_quantity: '' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    >
                      <option value="">Select Material</option>
                      {/* Deduplicate by material name and show available stock */}
                      {rawMaterials
                        .filter((rm, idx, arr) => arr.findIndex(x => x.material === rm.material) === idx)
                        .map((rm: RawMaterial) => {
                          const avail = getAvailableStock(rm.material);
                          return (
                            <option key={rm.id} value={rm.id}>
                              {rm.material} — Available: {avail} {rm.unit}
                            </option>
                          );
                        })
                      }
                    </select>
                    {/* Available stock hint below the select */}
                    {selectedRM && (
                      <p className={`text-xs mt-1 font-medium ${
                        maxAvailable <= 0 ? 'text-red-500' : maxAvailable < 50 ? 'text-orange-500' : 'text-green-600'
                      }`}>
                        {maxAvailable <= 0
                          ? `⚠ No stock available for ${selectedRM.material}`
                          : `✓ Available in hand: ${maxAvailable} ${selectedRM.unit}`
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Quantity ({selectedRM?.unit || 'units'})
                    </label>
                    <input
                      type="number"
                      value={formData.raw_material_quantity}
                      onChange={(e: any) => setFormData({ ...formData, raw_material_quantity: e.target.value })}
                      placeholder={selectedRM ? `Max ${maxAvailable}` : '0'}
                      max={maxAvailable !== Infinity ? maxAvailable : undefined}
                      min={0}
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isOverLimit
                          ? 'border-red-400 focus:ring-red-400 bg-red-50'
                          : 'border-slate-300 focus:ring-[var(--dairy-green)]'
                      }`}
                      required
                    />
                    {/* Real-time over-limit warning */}
                    {isOverLimit && (
                      <p className="text-xs mt-1 font-medium text-red-600">
                        ⚠ Exceeds available stock by {(enteredQty - maxAvailable).toFixed(2)} {selectedRM?.unit}. Max: {maxAvailable} {selectedRM?.unit}.
                      </p>
                    )}
                    {!isOverLimit && selectedRM && formData.raw_material_quantity && (
                      <p className="text-xs mt-1 text-slate-500">
                        Remaining after use: {(maxAvailable - enteredQty).toFixed(2)} {selectedRM.unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Product Output</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Output Quantity (kg)</label>
                    <input
                      type="number"
                      value={formData.production_output}
                      onChange={(e: any) => setFormData({ ...formData, production_output: e.target.value })}
                      placeholder="45"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Efficiency (auto-calculated)
                    </label>
                    <input
                      type="text"
                      value={formData.raw_material_quantity && formData.production_output 
                        ? `${Math.round((Number(formData.production_output) / Number(formData.raw_material_quantity)) * 100)}%`
                        : '0%'
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Cost Allocation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Labour Cost (PKR)</label>
                    <input
                      type="number"
                      value={formData.labour_cost}
                      onChange={(e: any) => setFormData({ ...formData, labour_cost: e.target.value })}
                      placeholder="2500"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Other Costs (PKR)</label>
                    <input
                      type="number"
                      value={formData.other_cost}
                      onChange={(e: any) => setFormData({ ...formData, other_cost: e.target.value })}
                      placeholder="1200"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this batch..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
                ></textarea>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductionForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!isOverLimit || submitting}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isOverLimit || submitting
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[var(--dairy-green-dark)] text-white hover:bg-[var(--dairy-green)]'
                  }`}
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Saving...' : editingId ? 'Update Batch' : 'Add Production Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

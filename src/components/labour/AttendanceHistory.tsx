import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Search, Filter, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import type { AttendanceRecord } from '../../api/labour';

interface AttendanceHistoryProps {
  attendance: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: number) => void;
}

export function AttendanceHistory({ attendance, onEdit, onDelete }: AttendanceHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering
  const filteredAttendance = attendance.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesDate = filterDate === '' || record.date.split('T')[0] === filterDate;
    return matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle2 size={14} /> Present</span>;
      case 'absent':
        return <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><XCircle size={14} /> Absent</span>;
      case 'late':
        return <span className="flex items-center gap-1 text-orange-600 font-bold text-xs"><Clock size={14} /> Late</span>;
      case 'half-day':
        return <span className="flex items-center gap-1 text-blue-600 font-bold text-xs"><Clock size={14} /> Half Day</span>;
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[var(--dairy-green)]" />
            Attendance History
          </h2>
          <span className="text-sm text-slate-500 font-medium">{filteredAttendance.length} records found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--dairy-green)] transition-colors" size={18} />
            <input 
              type="date"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]/20 focus:border-[var(--dairy-green)] transition-all text-sm font-medium"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
            />
            {filterDate && (
              <button 
                onClick={() => { setFilterDate(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--dairy-green)] transition-colors" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]/20 focus:border-[var(--dairy-green)] transition-all text-sm appearance-none cursor-pointer font-medium"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAttendance.length > 0 ? paginatedAttendance.map((att) => (
              <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                  {new Date(att.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(att.status)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                  {att.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(att)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(att.id)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No matching records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredAttendance.length)}</span> of <span className="font-bold text-slate-700">{filteredAttendance.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

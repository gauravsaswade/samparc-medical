import { useState } from 'react';
import { CalendarCheck, Trash2, CheckCircle, XCircle, Clock, Phone, Mail, Calendar, Stethoscope, MessageSquare, Loader2 } from 'lucide-react';
import { useListAppointments, useUpdateAppointmentStatus, useDeleteAppointment } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import type { Appointment } from '../../backend';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const statusIcons: Record<string, typeof Clock> = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Cancelled: XCircle,
};

function AppointmentCard({ appt }: { appt: Appointment }) {
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppt = useDeleteAppointment();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const StatusIcon = statusIcons[appt.status] ?? Clock;
  const statusClass = statusColors[appt.status] ?? 'bg-gray-50 text-gray-600 border-gray-200';

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({ id: appt.id, status: newStatus });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteAppt.mutate(appt.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const formattedDate = appt.submittedAt
    ? new Date(appt.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-medical-light rounded-xl flex items-center justify-center shrink-0">
            <CalendarCheck size={18} className="text-medical-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{appt.patientName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>
          <StatusIcon size={12} />
          {appt.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone size={13} className="text-medical-primary shrink-0" />
          <a href={`tel:${appt.phone}`} className="hover:text-medical-primary transition-colors font-medium">{appt.phone}</a>
        </div>
        {appt.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={13} className="text-medical-primary shrink-0" />
            <a href={`mailto:${appt.email}`} className="hover:text-medical-primary transition-colors truncate">{appt.email}</a>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <Stethoscope size={13} className="text-medical-primary shrink-0" />
          <span>{appt.department}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={13} className="text-medical-primary shrink-0" />
          <span className="font-medium text-gray-800">{appt.preferredDate}</span>
        </div>
      </div>

      {appt.message && (
        <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600">
          <MessageSquare size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">{appt.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {appt.status !== 'Confirmed' && (
          <button
            type="button"
            onClick={() => handleStatusChange('Confirmed')}
            disabled={updateStatus.isPending}
            className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            {updateStatus.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
            Confirm
          </button>
        )}
        {appt.status !== 'Pending' && (
          <button
            type="button"
            onClick={() => handleStatusChange('Pending')}
            disabled={updateStatus.isPending}
            className="flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Clock size={12} /> Mark Pending
          </button>
        )}
        {appt.status !== 'Cancelled' && (
          <button
            type="button"
            onClick={() => handleStatusChange('Cancelled')}
            disabled={updateStatus.isPending}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            <XCircle size={12} /> Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteAppt.isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ml-auto disabled:opacity-50 ${
            confirmDelete
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
          }`}
        >
          {deleteAppt.isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          {confirmDelete ? 'Confirm Delete' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default function AppointmentsManager() {
  const { data: appointments, isLoading } = useListAppointments();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');

  const filtered = appointments?.filter(a => filter === 'All' || a.status === filter) ?? [];
  const sorted = [...filtered].sort((a, b) => {
    // Sort by submission date descending
    return b.submittedAt.localeCompare(a.submittedAt);
  });

  const counts = {
    All: appointments?.length ?? 0,
    Pending: appointments?.filter(a => a.status === 'Pending').length ?? 0,
    Confirmed: appointments?.filter(a => a.status === 'Confirmed').length ?? 0,
    Cancelled: appointments?.filter(a => a.status === 'Cancelled').length ?? 0,
  };

  const filters: Array<'All' | 'Pending' | 'Confirmed' | 'Cancelled'> = ['All', 'Pending', 'Confirmed', 'Cancelled'];
  const filterColors: Record<string, string> = {
    All: 'bg-medical-primary text-white',
    Pending: 'bg-yellow-500 text-white',
    Confirmed: 'bg-green-600 text-white',
    Cancelled: 'bg-red-500 text-white',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Appointments</h2>
        <p className="text-gray-500 text-sm">View and manage all patient appointment requests.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filters.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-2xl p-4 text-center border transition-all ${
              filter === f
                ? `${filterColors[f]} shadow-md`
                : 'bg-white border-gray-100 text-gray-700 hover:border-medical-primary/30 hover:bg-medical-light/50'
            }`}
          >
            <p className="text-2xl font-extrabold">{counts[f]}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{f}</p>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map(appt => (
            <AppointmentCard key={appt.id.toString()} appt={appt} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CalendarCheck size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} appointments yet.</p>
          <p className="text-gray-400 text-sm mt-1">When patients book appointments, they will appear here.</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  Store, CheckCircle, XCircle, Clock, AlertTriangle, Trash2,
  Loader2, Users, Search, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { SellerStatus } from '../../backend';
import type { Seller } from '../../backend';
import { useListSellers, useUpdateSellerStatus, useDeleteSeller } from '../../hooks/useQueries';

// ── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  [SellerStatus.Approved]: { label: 'Approved', cls: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  [SellerStatus.Pending]: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  [SellerStatus.Rejected]: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  [SellerStatus.Suspended]: { label: 'Suspended', cls: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};

function StatusBadge({ status }: { status: SellerStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[SellerStatus.Pending];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Filter Tabs ───────────────────────────────────────────────────────────────

type FilterTab = 'all' | SellerStatus;
const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: SellerStatus.Pending, label: 'Pending' },
  { id: SellerStatus.Approved, label: 'Approved' },
  { id: SellerStatus.Rejected, label: 'Rejected' },
  { id: SellerStatus.Suspended, label: 'Suspended' },
];

// ── Seller Row ────────────────────────────────────────────────────────────────

interface SellerRowProps {
  seller: Seller;
  onStatusChange: (id: bigint, status: SellerStatus) => void;
  onDelete: (seller: Seller) => void;
  isUpdating: boolean;
}

function SellerRow({ seller, onStatusChange, onDelete, isUpdating }: SellerRowProps) {
  const [docsExpanded, setDocsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      seller.status === SellerStatus.Pending ? 'border-amber-200 shadow-amber-50' : 'border-gray-100'
    }`}>
      {seller.status === SellerStatus.Pending && (
        <div className="bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
          <Clock size={12} /> Pending Review — Action Required
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Seller Info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
              <Store size={18} className="text-teal-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-gray-900 text-base">{seller.businessName}</p>
                <StatusBadge status={seller.status} />
              </div>
              <p className="text-sm text-gray-500">{seller.name}</p>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                <a href={`mailto:${seller.email}`} className="hover:text-medical-primary transition-colors">{seller.email}</a>
                <a href={`tel:${seller.phone}`} className="hover:text-medical-primary transition-colors">{seller.phone}</a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {seller.status !== SellerStatus.Approved && (
              <button
                type="button"
                onClick={() => onStatusChange(seller.id, SellerStatus.Approved)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                <CheckCircle size={13} /> Approve
              </button>
            )}
            {seller.status !== SellerStatus.Rejected && (
              <button
                type="button"
                onClick={() => onStatusChange(seller.id, SellerStatus.Rejected)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                <XCircle size={13} /> Reject
              </button>
            )}
            {seller.status !== SellerStatus.Suspended && seller.status !== SellerStatus.Rejected && (
              <button
                type="button"
                onClick={() => onStatusChange(seller.id, SellerStatus.Suspended)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                <AlertTriangle size={13} /> Suspend
              </button>
            )}
            {seller.status === SellerStatus.Suspended && (
              <button
                type="button"
                onClick={() => onStatusChange(seller.id, SellerStatus.Pending)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Clock size={13} /> Set Pending
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(seller)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Documents */}
        {seller.documentsSubmitted && seller.documentsSubmitted.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => setDocsExpanded(v => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FileText size={13} />
              {seller.documentsSubmitted.length} document{seller.documentsSubmitted.length !== 1 ? 's' : ''} submitted
              {docsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {docsExpanded && (
              <ul className="mt-2 space-y-1.5 pl-5">
                {seller.documentsSubmitted.map((doc) => (
                  <li key={doc} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{doc}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SellersManager() {
  const { data: sellers, isLoading } = useListSellers();
  const updateStatus = useUpdateSellerStatus();
  const deleteSeller = useDeleteSeller();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const handleStatusChange = async (id: bigint, status: SellerStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Seller status updated to ${status}.`);
    } catch {
      toast.error('Failed to update seller status.');
    }
  };

  const handleDelete = async (seller: Seller) => {
    if (!confirm(`Delete seller "${seller.businessName}" (${seller.name})? This cannot be undone.`)) return;
    try {
      await deleteSeller.mutateAsync(seller.id);
      toast.success('Seller deleted successfully.');
    } catch {
      toast.error('Failed to delete seller.');
    }
  };

  const filtered = (sellers ?? []).filter(s => {
    const matchTab = activeTab === 'all' || s.status === activeTab;
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.businessName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts: Record<FilterTab, number> = {
    all: sellers?.length ?? 0,
    [SellerStatus.Pending]: sellers?.filter(s => s.status === SellerStatus.Pending).length ?? 0,
    [SellerStatus.Approved]: sellers?.filter(s => s.status === SellerStatus.Approved).length ?? 0,
    [SellerStatus.Rejected]: sellers?.filter(s => s.status === SellerStatus.Rejected).length ?? 0,
    [SellerStatus.Suspended]: sellers?.filter(s => s.status === SellerStatus.Suspended).length ?? 0,
  };

  const isActing = updateStatus.isPending || deleteSeller.isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Seller Management</h2>
          <p className="text-sm text-gray-500">Manage and approve pharmacy sellers</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 w-52"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Sellers', value: counts.all, icon: Users, color: 'text-gray-600 bg-gray-50' },
          { label: 'Pending', value: counts[SellerStatus.Pending], icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Approved', value: counts[SellerStatus.Approved], icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Rejected/Suspended', value: counts[SellerStatus.Rejected] + counts[SellerStatus.Suspended], icon: XCircle, color: 'text-red-600 bg-red-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                tab.id === SellerStatus.Pending ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={36} className="text-medical-primary animate-spin" />
          <p className="text-gray-500">Loading sellers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Store size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            {search ? 'No sellers match your search.' : `No ${activeTab !== 'all' ? activeTab.toLowerCase() : ''} sellers found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(seller => (
            <SellerRow
              key={seller.id.toString()}
              seller={seller}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isUpdating={isActing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

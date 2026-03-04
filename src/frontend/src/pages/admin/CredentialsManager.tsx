import { useState } from 'react';
import {
  KeyRound, Users, Store, Search, Copy, Check,
  Loader2, ShieldCheck, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { SellerStatus } from '../../backend';
import type { CustomerCredentials, SellerCredentials } from '../../backend';
import { useListCustomerCredentials, useListSellerCredentials } from '../../hooks/useQueries';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(createdAt: bigint): string {
  return new Date(Number(createdAt) / 1_000_000).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncateHash(hash: string, max = 20): string {
  if (hash.length <= max) return hash;
  return hash.slice(0, max) + '…';
}

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Password hash copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy password hash'}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all shrink-0 ${
        copied
          ? 'bg-green-100 text-green-600'
          : 'bg-gray-100 text-gray-500 hover:bg-medical-primary/10 hover:text-medical-primary'
      }`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ── Password Cell ─────────────────────────────────────────────────────────────

function PasswordCell({ hash }: { hash: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 cursor-default select-all"
        title={hash}
      >
        {truncateHash(hash)}
      </span>
      <CopyButton value={hash} />
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  [SellerStatus.Approved]: { cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  [SellerStatus.Pending]:  { cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  [SellerStatus.Rejected]: { cls: 'bg-red-100 text-red-700',     dot: 'bg-red-500' },
  [SellerStatus.Suspended]:{ cls: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
};

function StatusBadge({ status }: { status: SellerStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[SellerStatus.Pending];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ── Customers Table ───────────────────────────────────────────────────────────

function CustomersTable({ search }: { search: string }) {
  const { data: customers, isLoading } = useListCustomerCredentials();

  const filtered = (customers ?? []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={32} className="text-medical-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading customer credentials…</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Users size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">
          {search ? 'No customers match your search.' : 'No customers registered yet.'}
        </p>
        <p className="text-xs text-gray-400">Customer accounts will appear here once registered.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">ID</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Phone</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Password Hash</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">Registered</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c: CustomerCredentials, i: number) => (
            <tr
              key={c.id.toString()}
              className={`border-b border-gray-50 transition-colors hover:bg-blue-50/40 ${
                i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  #{c.id.toString()}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <a href={`mailto:${c.email}`} className="text-medical-primary hover:underline text-xs">
                  {c.email}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{c.phone}</td>
              <td className="px-4 py-3">
                <PasswordCell hash={c.passwordHash} />
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Sellers Table ─────────────────────────────────────────────────────────────

function SellersTable({ search }: { search: string }) {
  const { data: sellers, isLoading } = useListSellerCredentials();

  const filtered = (sellers ?? []).filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.businessName.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={32} className="text-medical-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading seller credentials…</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Store size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">
          {search ? 'No sellers match your search.' : 'No sellers registered yet.'}
        </p>
        <p className="text-xs text-gray-400">Seller accounts will appear here once they register.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">ID</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Phone</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">Business Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Password Hash</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">Registered</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s: SellerCredentials, i: number) => (
            <tr
              key={s.id.toString()}
              className={`border-b border-gray-50 transition-colors hover:bg-teal-50/40 ${
                i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  #{s.id.toString()}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-teal-600 font-bold text-xs">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{s.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <a href={`mailto:${s.email}`} className="text-medical-primary hover:underline text-xs">
                  {s.email}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{s.phone}</td>
              <td className="px-4 py-3">
                <span className="font-medium text-gray-700 whitespace-nowrap">{s.businessName}</span>
              </td>
              <td className="px-4 py-3">
                <PasswordCell hash={s.passwordHash} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(s.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type Tab = 'customers' | 'sellers';

export default function CredentialsManager() {
  const [activeTab, setActiveTab] = useState<Tab>('customers');
  const [search, setSearch] = useState('');

  const { data: customers } = useListCustomerCredentials();
  const { data: sellers } = useListSellerCredentials();

  const customerCount = customers?.length ?? 0;
  const sellerCount = sellers?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-medical-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <KeyRound size={20} className="text-medical-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Credentials</h2>
            <p className="text-sm text-gray-500 mt-0.5">View all registered customer and seller accounts with their credentials</p>
          </div>
        </div>

        {/* Search */}
        <div className="sm:ml-auto">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 w-52"
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Sensitive Information</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Password hashes are shown for administrative access only. Store securely and never share with unauthorized parties.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{customerCount}</p>
            <p className="text-xs text-gray-500">Total Customers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
            <Store size={18} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{sellerCount}</p>
            <p className="text-xs text-gray-500">Total Sellers</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {([
          { id: 'customers' as Tab, label: 'Customers', icon: Users, count: customerCount },
          { id: 'sellers' as Tab, label: 'Sellers', icon: Store, count: sellerCount },
        ]).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-medical-primary/10 text-medical-primary' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Encryption note */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
        <ShieldCheck size={13} className="text-green-500" />
        Passwords are stored as hashed values — original passwords are not recoverable
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-700">
            {activeTab === 'customers' ? 'Customer Accounts' : 'Seller Accounts'}
          </p>
        </div>
        <div className="p-4">
          {activeTab === 'customers'
            ? <CustomersTable search={search} />
            : <SellersTable search={search} />
          }
        </div>
      </div>
    </div>
  );
}

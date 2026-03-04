import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Store, Pill, LogOut, Menu, X, Plus, Edit2, Trash2,
  CheckCircle, Clock, XCircle, AlertTriangle, Loader2,
  User, ChevronRight, Tag, DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { SellerStatus } from '../../backend';
import type { SellerMedicine } from '../../backend';
import { useSellerAuth } from '../../hooks/useSellerAuth';
import {
  useListSellerMedicines,
  useAddSellerMedicine,
  useEditSellerMedicine,
  useDeleteSellerMedicine,
} from '../../hooks/useQueries';

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SellerStatus }) {
  const configs = {
    [SellerStatus.Approved]: { label: 'Approved', icon: CheckCircle, cls: 'bg-green-100 text-green-700 border-green-200' },
    [SellerStatus.Pending]: { label: 'Pending Review', icon: Clock, cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    [SellerStatus.Rejected]: { label: 'Rejected', icon: XCircle, cls: 'bg-red-100 text-red-700 border-red-200' },
    [SellerStatus.Suspended]: { label: 'Suspended', icon: AlertTriangle, cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  };
  const cfg = configs[status] ?? configs[SellerStatus.Pending];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${cfg.cls}`}>
      <cfg.icon size={14} />
      {cfg.label}
    </span>
  );
}

// ── Medicine Form Modal ───────────────────────────────────────────────────────

interface MedicineFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
}

interface MedicineModalProps {
  onClose: () => void;
  onSave: (data: MedicineFormData) => Promise<void>;
  initial?: Partial<MedicineFormData>;
  title: string;
  isPending: boolean;
}

function MedicineModal({ onClose, onSave, initial = {}, title, isPending }: MedicineModalProps) {
  const [form, setForm] = useState<MedicineFormData>({
    name: initial.name ?? '',
    description: initial.description ?? '',
    price: initial.price ?? '',
    category: initial.category ?? '',
    available: initial.available ?? true,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required.');
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    setError('');
    await onSave(form);
  };

  const categories = ['Antibiotics', 'Vitamins', 'Pain Relief', 'Cardiac', 'Diabetes', 'Skin Care', 'Digestive', 'ENT', 'Respiratory', 'General'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-medical-dark to-teal-700 rounded-t-2xl p-5 flex items-center justify-between">
          <h2 className="text-white font-extrabold text-lg">{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="med-name" className="block text-sm font-semibold text-gray-700 mb-1">Medicine Name *</label>
              <input id="med-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Paracetamol 500mg" required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="med-desc" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea id="med-desc" name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief description of the medicine..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="med-price" className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="med-price" type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label htmlFor="med-cat" className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select id="med-cat" name="category" value={form.category} onChange={handleChange} required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 bg-white">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="available" checked={form.available}
                onChange={handleChange}
                className="w-4 h-4 accent-teal-600" />
              <span className="text-sm font-medium text-gray-700">Available in stock</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isPending}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Medicine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Seller Dashboard ─────────────────────────────────────────────────────

type Section = 'medicines' | 'account';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { currentSeller, logoutSeller, isSellerLoggedIn } = useSellerAuth();
  const [activeSection, setActiveSection] = useState<Section>('medicines');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<SellerMedicine | null>(null);

  const sellerId = currentSeller ? BigInt(currentSeller.id) : null;
  const { data: medicines, isLoading } = useListSellerMedicines(sellerId);
  const addMedicine = useAddSellerMedicine();
  const editMedicine = useEditSellerMedicine();
  const deleteMedicine = useDeleteSellerMedicine();

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!isSellerLoggedIn) {
      navigate({ to: '/seller/login' });
    }
  }, [isSellerLoggedIn, navigate]);

  if (!currentSeller) return null;

  const isApproved = currentSeller.status === SellerStatus.Approved;

  const handleLogout = () => {
    logoutSeller();
    toast.success('Logged out successfully.');
    navigate({ to: '/seller/login' });
  };

  const handleAddMedicine = async (data: MedicineFormData) => {
    if (!sellerId) return;
    try {
      await addMedicine.mutateAsync({
        sellerId,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
      });
      toast.success('Medicine added successfully!');
      setShowAddModal(false);
    } catch {
      toast.error('Failed to add medicine. Please try again.');
    }
  };

  const handleEditMedicine = async (data: MedicineFormData) => {
    if (!editingMedicine) return;
    try {
      await editMedicine.mutateAsync({
        id: editingMedicine.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        available: data.available,
      });
      toast.success('Medicine updated successfully!');
      setEditingMedicine(null);
    } catch {
      toast.error('Failed to update medicine.');
    }
  };

  const handleDeleteMedicine = async (id: bigint, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMedicine.mutateAsync(id);
      toast.success('Medicine deleted.');
    } catch {
      toast.error('Failed to delete medicine.');
    }
  };

  const formatPrice = (price: bigint) => `₹${(Number(price) / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Modals */}
      {showAddModal && (
        <MedicineModal
          title="Add New Medicine"
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedicine}
          isPending={addMedicine.isPending}
        />
      )}
      {editingMedicine && (
        <MedicineModal
          title="Edit Medicine"
          onClose={() => setEditingMedicine(null)}
          onSave={handleEditMedicine}
          isPending={editMedicine.isPending}
          initial={{
            name: editingMedicine.name,
            description: editingMedicine.description,
            price: (Number(editingMedicine.price) / 100).toString(),
            category: editingMedicine.category,
            available: editingMedicine.available,
          }}
        />
      )}

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden w-full h-full"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-medical-dark text-white flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm leading-tight">{currentSeller.businessName}</p>
              <p className="text-teal-300 text-xs">{currentSeller.name}</p>
            </div>
          </div>
          <div className="mt-3">
            <StatusBadge status={currentSeller.status} />
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {([
            { id: 'medicines', label: 'My Medicines', icon: Pill },
            { id: 'account', label: 'Account Info', icon: User },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {activeSection === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">
                {activeSection === 'medicines' ? 'My Medicines' : 'Account Info'}
              </h1>
              <p className="text-xs text-gray-500">Seller Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeSection === 'medicines' && (
            <div>
              {/* Status alert */}
              {!isApproved && (
                <div className={`rounded-2xl p-5 mb-6 flex items-start gap-4 ${
                  currentSeller.status === SellerStatus.Pending
                    ? 'bg-amber-50 border border-amber-200'
                    : currentSeller.status === SellerStatus.Rejected
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-orange-50 border border-orange-200'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    currentSeller.status === SellerStatus.Pending ? 'bg-amber-100' :
                    currentSeller.status === SellerStatus.Rejected ? 'bg-red-100' : 'bg-orange-100'
                  }`}>
                    {currentSeller.status === SellerStatus.Pending ? <Clock size={18} className="text-amber-600" /> :
                     currentSeller.status === SellerStatus.Rejected ? <XCircle size={18} className="text-red-600" /> :
                     <AlertTriangle size={18} className="text-orange-600" />}
                  </div>
                  <div>
                    <p className={`font-bold text-base ${
                      currentSeller.status === SellerStatus.Pending ? 'text-amber-800' :
                      currentSeller.status === SellerStatus.Rejected ? 'text-red-800' : 'text-orange-800'
                    }`}>
                      {currentSeller.status === SellerStatus.Pending
                        ? 'Account Pending Approval'
                        : currentSeller.status === SellerStatus.Rejected
                        ? 'Account Rejected'
                        : 'Account Suspended'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      currentSeller.status === SellerStatus.Pending ? 'text-amber-700' :
                      currentSeller.status === SellerStatus.Rejected ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {currentSeller.status === SellerStatus.Pending
                        ? 'Your account is pending admin approval. You cannot list medicines until approved. This typically takes 1–2 business days.'
                        : currentSeller.status === SellerStatus.Rejected
                        ? 'Your application was rejected. Please contact admin at samparc6@gmail.com for more information.'
                        : 'Your account has been suspended. Please contact admin at samparc6@gmail.com.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Medicines section */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Medicine Listings</h2>
                  <p className="text-sm text-gray-500">{medicines?.length ?? 0} medicine{(medicines?.length ?? 0) !== 1 ? 's' : ''} listed</p>
                </div>
                {isApproved && (
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
                  >
                    <Plus size={16} /> Add Medicine
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 size={36} className="text-teal-600 animate-spin" />
                  <p className="text-gray-500">Loading your medicines...</p>
                </div>
              ) : !medicines || medicines.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <Pill size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-lg">No medicines listed yet</p>
                  {isApproved ? (
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm"
                    >
                      <Plus size={16} /> Add your first medicine
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">You can list medicines once your account is approved.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicines.map((med) => (
                    <div key={med.id.toString()} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                          <Pill size={18} className="text-teal-600" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          med.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {med.available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{med.name}</h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{med.description || 'No description'}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Tag size={11} /> {med.category || 'General'}
                        </span>
                        <span className="text-teal-600 font-bold">{formatPrice(med.price)}</span>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-50">
                        <button
                          type="button"
                          onClick={() => setEditingMedicine(med)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedicine(med.id, med.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'account' && (
            <div className="max-w-xl space-y-5">
              {/* Application Status Card */}
              <div className={`rounded-2xl p-5 flex items-start gap-4 border ${
                currentSeller.status === SellerStatus.Approved
                  ? 'bg-green-50 border-green-200'
                  : currentSeller.status === SellerStatus.Pending
                  ? 'bg-amber-50 border-amber-200'
                  : currentSeller.status === SellerStatus.Rejected
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  currentSeller.status === SellerStatus.Approved ? 'bg-green-100' :
                  currentSeller.status === SellerStatus.Pending ? 'bg-amber-100' :
                  currentSeller.status === SellerStatus.Rejected ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  {currentSeller.status === SellerStatus.Approved
                    ? <CheckCircle size={20} className="text-green-600" />
                    : currentSeller.status === SellerStatus.Pending
                    ? <Clock size={20} className="text-amber-600" />
                    : currentSeller.status === SellerStatus.Rejected
                    ? <XCircle size={20} className="text-red-600" />
                    : <AlertTriangle size={20} className="text-orange-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className={`font-extrabold text-base ${
                      currentSeller.status === SellerStatus.Approved ? 'text-green-800' :
                      currentSeller.status === SellerStatus.Pending ? 'text-amber-800' :
                      currentSeller.status === SellerStatus.Rejected ? 'text-red-800' : 'text-orange-800'
                    }`}>Application Status</p>
                    <StatusBadge status={currentSeller.status} />
                  </div>
                  <p className={`text-sm ${
                    currentSeller.status === SellerStatus.Approved ? 'text-green-700' :
                    currentSeller.status === SellerStatus.Pending ? 'text-amber-700' :
                    currentSeller.status === SellerStatus.Rejected ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {currentSeller.status === SellerStatus.Approved
                      ? 'Your seller account is approved! You can list medicines and sell on SAMPARC MEDICAL.'
                      : currentSeller.status === SellerStatus.Pending
                      ? 'Your application is under review. Admin will approve you within 1–2 business days. You will be notified once approved.'
                      : currentSeller.status === SellerStatus.Rejected
                      ? 'Your application was rejected. Please contact admin at samparc6@gmail.com for more information or to reapply.'
                      : 'Your account has been suspended. Please contact admin at samparc6@gmail.com to resolve this.'}
                  </p>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-medical-dark to-teal-700 px-6 py-5">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                    <Store size={24} className="text-white" />
                  </div>
                  <h2 className="text-white font-extrabold text-xl">{currentSeller.businessName}</h2>
                  <p className="text-teal-200 text-sm">{currentSeller.name}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Account Status</span>
                    <StatusBadge status={currentSeller.status} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <span className="text-sm font-semibold text-gray-900">{currentSeller.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <span className="text-sm font-semibold text-gray-900">{currentSeller.phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-gray-500">Business Name</span>
                    <span className="text-sm font-semibold text-gray-900">{currentSeller.businessName}</span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    <p className="font-semibold mb-1">Need help?</p>
                    <p>Contact admin at <a href="mailto:samparc6@gmail.com" className="underline font-medium">samparc6@gmail.com</a> or call <a href="tel:+919766343454" className="underline font-medium">+91 9766343454</a></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, Search, Pill } from 'lucide-react';
import { toast } from 'sonner';
import { useListMedicines, useAddMedicine, useEditMedicine, useDeleteMedicine } from '../../hooks/useQueries';
import type { Medicine } from '../../../src/backend';
import { Skeleton } from '@/components/ui/skeleton';

interface MedicineForm {
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
}

const emptyForm: MedicineForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  available: true,
};

function formatPrice(price: bigint): string {
  return `₹${(Number(price) / 100).toFixed(2)}`;
}

export default function MedicinesManager() {
  const { data: medicines, isLoading } = useListMedicines();
  const addMedicine = useAddMedicine();
  const editMedicine = useEditMedicine();
  const deleteMedicine = useDeleteMedicine();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<MedicineForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const filtered = (medicines || []).filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingId(med.id);
    setForm({
      name: med.name,
      description: med.description,
      price: (Number(med.price) / 100).toFixed(2),
      category: med.category,
      available: med.available,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price.');
      return;
    }

    try {
      if (editingId !== null) {
        await editMedicine.mutateAsync({
          id: editingId,
          name: form.name.trim(),
          description: form.description.trim(),
          price: priceNum,
          category: form.category.trim(),
          available: form.available,
        });
        toast.success('Medicine updated successfully!');
      } else {
        await addMedicine.mutateAsync({
          name: form.name.trim(),
          description: form.description.trim(),
          price: priceNum,
          category: form.category.trim(),
        });
        toast.success('Medicine added successfully!');
      }
      handleCancel();
    } catch {
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMedicine.mutateAsync(id);
      toast.success('Medicine deleted successfully!');
      setDeleteConfirmId(null);
    } catch {
      toast.error('Failed to delete medicine. Please try again.');
    }
  };

  const isSaving = addMedicine.isPending || editMedicine.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Medicines Manager</h2>
          <p className="text-gray-500 text-sm">Add, edit, or remove medicines from the public catalog.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-medical-primary hover:bg-medical-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md shrink-0"
        >
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-medical-primary/5 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Pill size={18} className="text-medical-primary" />
              {editingId !== null ? 'Edit Medicine' : 'Add New Medicine'}
            </h3>
            <button onClick={handleCancel} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medicine Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Paracetamol 500mg"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Analgesic, Antibiotic"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 25.50"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.available ? 'bg-medical-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.available ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {form.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </label>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the medicine, usage, dosage..."
                required
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-medical-primary hover:bg-medical-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving...</>
                ) : (
                  <><Check size={15} /> {editingId !== null ? 'Update Medicine' : 'Add Medicine'}</>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search medicines by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 bg-white"
        />
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Pill size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-500">
              {search ? 'No medicines match your search.' : 'No medicines added yet.'}
            </p>
            {!search && (
              <button
                onClick={handleOpenAdd}
                className="mt-3 text-sm text-medical-primary hover:underline font-medium"
              >
                Add your first medicine →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Medicine</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(med => (
                  <tr key={med.id.toString()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-medical-light rounded-lg flex items-center justify-center shrink-0">
                          <Pill size={14} className="text-medical-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{med.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{med.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                        {med.category || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-medical-primary">{formatPrice(med.price)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        med.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {med.available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {deleteConfirmId === med.id ? (
                          <>
                            <span className="text-xs text-gray-500 mr-1">Delete?</span>
                            <button
                              onClick={() => handleDelete(med.id)}
                              disabled={deleteMedicine.isPending}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                              title="Confirm delete"
                            >
                              {deleteMedicine.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Cancel"
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEdit(med)}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(med.id)}
                              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
              {filtered.length} medicine{filtered.length !== 1 ? 's' : ''} {search ? 'found' : 'total'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

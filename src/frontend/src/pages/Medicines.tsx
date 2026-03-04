import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Pill, Tag, CheckCircle, XCircle, Loader2, ShoppingCart, Store } from 'lucide-react';
import { toast } from 'sonner';
import { useListMedicines, useListAllSellerMedicines } from '../hooks/useQueries';
import { getCustomerSession } from '../hooks/useCustomerAuth';
import type { Medicine, SellerMedicine } from '../backend';

function formatPrice(price: bigint): string {
  return `₹${(Number(price) / 100).toFixed(2)}`;
}

export default function Medicines() {
  const navigate = useNavigate();
  const { data: medicines, isLoading, error } = useListMedicines();
  const { data: sellerMedicines, isLoading: isLoadingSeller } = useListAllSellerMedicines();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set((medicines || []).map(m => m.category).filter(Boolean)))];

  const filtered = (medicines || []).filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleBuy = (medicineName: string) => {
    const session = getCustomerSession();
    if (!session) {
      toast.error('Please login to purchase medicines.');
      navigate({ to: '/customer/login' });
      return;
    }
    toast.success(`Added to cart! Contact pharmacy to complete purchase: +91 9766343454`);
  };

  const handleBuySeller = (medicineName: string) => {
    const session = getCustomerSession();
    if (!session) {
      toast.error('Please login to purchase medicines.');
      navigate({ to: '/customer/login' });
      return;
    }
    toast.success(`Added to cart! Contact pharmacy to complete purchase: +91 9766343454`);
  };

  const availableSellerMedicines = (sellerMedicines || []).filter(m => m.available);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-medical-dark to-medical-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Pharmacy</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Browse our comprehensive range of medicines and health products available at SAMPARC MEDICAL.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-medical-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-medical-light hover:text-medical-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Medicines Grid */}
      <section className="py-12 bg-gray-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Pill size={22} className="text-medical-primary" /> SAMPARC Pharmacy
          </h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="text-medical-primary animate-spin" />
              <p className="text-gray-500">Loading medicines...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">Failed to load medicines. Please try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Pill size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                {search || selectedCategory !== 'All' ? 'No medicines found matching your search.' : 'No medicines available yet.'}
              </p>
              {(search || selectedCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                  className="mt-4 text-medical-primary hover:underline text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{filtered.length} medicine{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((medicine: Medicine) => (
                  <div
                    key={medicine.id.toString()}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-medical transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-medical-light rounded-xl flex items-center justify-center">
                        <Pill size={18} className="text-medical-primary" />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        medicine.available
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {medicine.available ? (
                          <><CheckCircle size={11} /> In Stock</>
                        ) : (
                          <><XCircle size={11} /> Out of Stock</>
                        )}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 leading-tight">{medicine.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{medicine.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Tag size={11} /> {medicine.category || 'General'}
                      </span>
                      <span className="text-medical-primary font-bold text-lg">{formatPrice(medicine.price)}</span>
                    </div>
                    {medicine.available && (
                      <button
                        type="button"
                        onClick={() => handleBuy(medicine.name)}
                        className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-sm font-semibold transition-all mt-auto"
                      >
                        <ShoppingCart size={14} /> Buy Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seller Medicines Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Store size={22} className="text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Seller Medicines</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Medicines listed by our authorized partner pharmacies
          </p>

          {isLoadingSeller ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="text-teal-600 animate-spin" />
              <p className="text-gray-500">Loading seller medicines...</p>
            </div>
          ) : availableSellerMedicines.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <Store size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No seller medicines available yet.</p>
              <p className="text-sm text-gray-400 mt-1">Authorized partner pharmacies will list medicines here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {availableSellerMedicines.map((medicine: SellerMedicine) => (
                <div
                  key={medicine.id.toString()}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-teal-100 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                      <Pill size={18} className="text-teal-600" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                      <CheckCircle size={11} /> In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 leading-tight">{medicine.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{medicine.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Tag size={11} /> {medicine.category || 'General'}
                    </span>
                    <span className="text-teal-600 font-bold text-lg">{formatPrice(medicine.price)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBuySeller(medicine.name)}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-sm font-semibold transition-all mt-auto"
                  >
                    <ShoppingCart size={14} /> Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact for medicines */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">Contact our pharmacy team for medicine availability and pricing.</p>
          <a
            href="tel:+919766343454"
            className="inline-flex items-center gap-2 bg-medical-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-dark transition-all shadow-md"
          >
            Call Pharmacy: +91 9766343454
          </a>
        </div>
      </section>
    </div>
  );
}

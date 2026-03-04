import { Pill, CheckCircle, XCircle, TrendingUp, LayoutDashboard, Package } from 'lucide-react';
import { useListMedicines } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function Overview() {
  const { data: medicines, isLoading } = useListMedicines();

  const total = medicines?.length ?? 0;
  const available = medicines?.filter(m => m.available).length ?? 0;
  const unavailable = total - available;
  const categories = new Set(medicines?.map(m => m.category).filter(Boolean) ?? []).size;

  const stats = [
    {
      label: 'Total Medicines',
      value: total,
      icon: Pill,
      color: 'bg-medical-light text-medical-primary',
      border: 'border-medical-primary/20',
    },
    {
      label: 'In Stock',
      value: available,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-200',
    },
    {
      label: 'Out of Stock',
      value: unavailable,
      icon: XCircle,
      color: 'bg-red-50 text-red-500',
      border: 'border-red-200',
    },
    {
      label: 'Categories',
      value: categories,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome to SAMPARC MEDICAL admin panel. Manage your medicines and website content here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm`}>
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            )}
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LayoutDashboard size={18} className="text-medical-primary" />
            Quick Actions Guide
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-medical-light text-medical-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <p>Use the <strong className="text-gray-800">Medicines</strong> section to add, edit, or remove medicines from the public catalog.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-medical-light text-medical-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <p>Use the <strong className="text-gray-800">Content Editor</strong> to update website text, hero section, about section, and announcements.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-medical-light text-medical-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <p>All changes are saved to the blockchain and reflect <strong className="text-gray-800">immediately</strong> on the public website.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-medical-light text-medical-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
              <p>You can access this dashboard from <strong className="text-gray-800">any device or browser</strong> using your admin credentials.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-medical-primary" />
            Recent Medicines
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : medicines && medicines.length > 0 ? (
            <div className="space-y-2">
              {medicines.slice(-5).reverse().map(med => (
                <div key={med.id.toString()} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-medical-light rounded-lg flex items-center justify-center">
                      <Pill size={13} className="text-medical-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 leading-tight">{med.name}</p>
                      <p className="text-xs text-gray-400">{med.category || 'General'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    med.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {med.available ? 'In Stock' : 'Out'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Pill size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No medicines added yet.</p>
              <p className="text-xs mt-1">Go to the Medicines section to add your first medicine.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hospital Info Card */}
      <div className="bg-gradient-to-r from-medical-dark to-medical-primary rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3">SAMPARC MEDICAL — Admin Portal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-teal-300 text-xs mb-1">Hospital Email</p>
            <p className="font-medium">samparc6@gmail.com</p>
          </div>
          <div>
            <p className="text-teal-300 text-xs mb-1">Customer Care</p>
            <p className="font-medium">+91 9766343454</p>
          </div>
          <div>
            <p className="text-teal-300 text-xs mb-1">Location</p>
            <p className="font-medium">Malavali, Maharashtra 410405</p>
          </div>
        </div>
      </div>
    </div>
  );
}

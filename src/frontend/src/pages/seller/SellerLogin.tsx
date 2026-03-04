import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Mail, Lock, Loader2, Store, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLoginSeller } from '../../hooks/useQueries';
import { useSellerAuth } from '../../hooks/useSellerAuth';
import { hashPassword } from '../../utils/hashPassword';

export default function SellerLogin() {
  const navigate = useNavigate();
  const loginSeller = useLoginSeller();
  const { saveSession } = useSellerAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const hash = await hashPassword(form.password);
      const seller = await loginSeller.mutateAsync({ email: form.email, passwordHash: hash });

      saveSession({
        id: seller.id.toString(),
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        businessName: seller.businessName,
        status: seller.status,
      });

      toast.success(`Welcome back, ${seller.name}!`);
      navigate({ to: '/seller/dashboard' });
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-teal-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-dark to-teal-700 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Store size={20} className="text-white" />
              </div>
              <div>
                <p className="font-extrabold text-lg leading-tight">SAMPARC MEDICAL</p>
                <p className="text-teal-200 text-xs">Seller Portal</p>
              </div>
            </div>
            <h1 className="text-2xl font-extrabold mt-4">Seller Sign In</h1>
            <p className="text-white/80 text-sm mt-1">Access your seller dashboard to manage medicines</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@business.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSeller.isPending}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2 mt-2"
              >
                {loginSeller.isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                ) : (
                  'Sign In to Seller Portal'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                New seller?{' '}
                <Link to="/seller/signup" className="text-teal-600 font-semibold hover:underline">
                  Register your pharmacy
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Are you a customer?{' '}
                <Link to="/customer/login" className="text-gray-500 hover:text-medical-primary font-medium">
                  Customer Login →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 SAMPARC MEDICAL. Your health, our mission.
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { User, Mail, Phone, Lock, Store, FileText, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRegisterSeller, useLoginSeller } from '../../hooks/useQueries';
import { useSellerAuth } from '../../hooks/useSellerAuth';
import { hashPassword } from '../../utils/hashPassword';

export default function SellerSignup() {
  const navigate = useNavigate();
  const registerSeller = useRegisterSeller();
  const loginSeller = useLoginSeller();
  const { saveSession } = useSellerAuth();

  const [form, setForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pharmacyLicense: '',
    businessRegNumber: '',
    govtIdProof: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.businessName || !form.email || !form.phone || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.pharmacyLicense || !form.businessRegNumber || !form.govtIdProof) {
      setError('All document fields are required for seller registration.');
      return;
    }

    try {
      const hash = await hashPassword(form.password);
      const documentDescriptions = [
        `Pharmacy License: ${form.pharmacyLicense}`,
        `Business Registration Number: ${form.businessRegNumber}`,
        `Government ID Proof: ${form.govtIdProof}`,
      ];

      await registerSeller.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        passwordHash: hash,
        documentDescriptions,
      });

      // Auto-login after registration
      const seller = await loginSeller.mutateAsync({ email: form.email, passwordHash: hash });
      saveSession({
        id: seller.id.toString(),
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        businessName: seller.businessName,
        status: seller.status,
      });

      toast.success('Registration successful! Your account is under review.');
      navigate({ to: '/seller/dashboard' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist')) {
        setError('An account with this email already exists. Please sign in.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const isPending = registerSeller.isPending || loginSeller.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
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
                <p className="text-teal-200 text-xs">Seller Registration</p>
              </div>
            </div>
            <h1 className="text-2xl font-extrabold mt-4">Register Your Pharmacy</h1>
            <p className="text-white/80 text-sm mt-1">Become an authorized seller on SAMPARC MEDICAL platform</p>
          </div>

          {/* Approval Notice */}
          <div className="mx-8 mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Account Review Required</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your account will be reviewed and approved by admin before you can list medicines. This process typically takes 1–2 business days.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 pb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info */}
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={14} /> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="businessName"
                        type="text"
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        placeholder="Your pharmacy name"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@pharmacy.com"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXXXXXXX"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lock size={14} /> Account Security
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters"
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <FileText size={14} /> Required Documents
                </h2>
                <p className="text-xs text-teal-600 mb-4">
                  All three document fields are compulsory. Please provide details/descriptions for verification.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="pharmacyLicense" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Pharmacy License <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-1.5">Describe your pharmacy license details (license number, issuing authority, validity)</p>
                    <textarea
                      id="pharmacyLicense"
                      name="pharmacyLicense"
                      value={form.pharmacyLicense}
                      onChange={handleChange}
                      placeholder="e.g., License No. MH-XXXX-YYYY, Issued by: Maharashtra FDA, Valid till: Dec 2027"
                      rows={2}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all resize-none bg-white"
                    />
                    {form.pharmacyLicense && (
                      <p className="flex items-center gap-1 text-xs text-green-600 mt-1"><CheckCircle size={12} /> Provided</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="businessRegNumber" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Business Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="businessRegNumber"
                      type="text"
                      name="businessRegNumber"
                      value={form.businessRegNumber}
                      onChange={handleChange}
                      placeholder="e.g., CIN: U12345MH2020PTC123456"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all bg-white"
                    />
                    {form.businessRegNumber && (
                      <p className="flex items-center gap-1 text-xs text-green-600 mt-1"><CheckCircle size={12} /> Provided</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="govtIdProof" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Government ID Proof <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-1.5">Describe your government ID (type, number, name on ID)</p>
                    <textarea
                      id="govtIdProof"
                      name="govtIdProof"
                      value={form.govtIdProof}
                      onChange={handleChange}
                      placeholder="e.g., Aadhaar Card: XXXX-XXXX-XXXX, Name: [Your Name]"
                      rows={2}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all resize-none bg-white"
                    />
                    {form.govtIdProof && (
                      <p className="flex items-center gap-1 text-xs text-green-600 mt-1"><CheckCircle size={12} /> Provided</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting registration...</>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already registered?{' '}
                <Link to="/seller/login" className="text-teal-600 font-semibold hover:underline">
                  Sign in to your account
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

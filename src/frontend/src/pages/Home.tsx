import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Stethoscope, Pill, FlaskConical, HeartPulse, Ambulance,
  ShieldCheck, Users, Award, Clock, ChevronRight, Star, X, CalendarCheck, Loader2,
  Store, UserPlus, LogIn, CheckCircle2, ClipboardList, Calendar, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetContent, useSubmitAppointment, useListAppointments } from '../hooks/useQueries';
import { getCustomerSession, useCustomerAuth } from '../hooks/useCustomerAuth';

const FORMSPREE_URL = 'https://formspree.io/f/xpwrqdbd';

const departments = [
  'General Medicine',
  'Emergency Care',
  'Pharmacy',
  'Diagnostics',
  'Cardiac Care',
  'Preventive Health',
  'Other',
];

interface AppointmentModalProps {
  onClose: () => void;
  prefill?: { patientName?: string; phone?: string; email?: string };
}

function AppointmentModal({ onClose, prefill }: AppointmentModalProps) {
  const [form, setForm] = useState({
    patientName: prefill?.patientName ?? '',
    phone: prefill?.phone ?? '',
    email: prefill?.email ?? '',
    department: '',
    preferredDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const submitAppointment = useSubmitAppointment();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.patientName || !form.phone || !form.department || !form.preferredDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Save to backend
      await submitAppointment.mutateAsync(form);

      // Send to email via Formspree
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.patientName,
          phone: form.phone,
          email: form.email,
          department: form.department,
          preferredDate: form.preferredDate,
          message: form.message,
          _subject: `New Appointment Request - ${form.patientName}`,
          _replyto: form.email,
        }),
      });

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-dark to-rose-600 rounded-t-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CalendarCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg leading-tight">Book Appointment</h2>
              <p className="text-teal-200 text-xs">SAMPARC MEDICAL</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Appointment Requested!</h3>
              <p className="text-gray-600 text-sm mb-1">Thank you, <strong>{form.patientName}</strong>.</p>
              <p className="text-gray-500 text-sm mb-6">Our team will contact you shortly to confirm your appointment.</p>
              <div className="bg-medical-light rounded-xl p-4 text-sm text-medical-primary font-medium mb-4">
                For urgent assistance, call <a href="tel:+919766343454" className="underline font-bold">+91 9766343454</a>
              </div>
              <button type="button" onClick={onClose} className="bg-medical-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-medical-dark transition-all">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appt-name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    id="appt-name"
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="appt-phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input
                    id="appt-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXXXXXXX"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="appt-email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  id="appt-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appt-dept" className="block text-sm font-semibold text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                  <select
                    id="appt-dept"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all bg-white"
                  >
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="appt-date" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date <span className="text-red-500">*</span></label>
                  <input
                    id="appt-date"
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="appt-msg" className="block text-sm font-semibold text-gray-700 mb-1">Message / Reason for Visit</label>
                <textarea
                  id="appt-msg"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:border-medical-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitAppointment.isPending}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                {submitAppointment.isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <><CalendarCheck size={16} /> Confirm Appointment</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By submitting, our team will call you to confirm. For emergencies, call <a href="tel:+919766343454" className="text-medical-primary font-semibold">+91 9766343454</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const services = [
  { icon: Stethoscope, title: 'General Medicine', desc: 'Comprehensive primary care for all age groups with experienced physicians.', color: 'bg-teal-50 text-medical-primary' },
  { icon: Ambulance, title: 'Emergency Care', desc: '24/7 emergency services with rapid response and critical care support.', color: 'bg-red-50 text-red-600' },
  { icon: Pill, title: 'Pharmacy', desc: 'Full-service pharmacy with a wide range of medicines at affordable prices.', color: 'bg-blue-50 text-blue-600' },
  { icon: FlaskConical, title: 'Diagnostics', desc: 'Advanced laboratory and imaging services for accurate diagnosis.', color: 'bg-purple-50 text-purple-600' },
  { icon: HeartPulse, title: 'Cardiac Care', desc: 'Specialized cardiac monitoring, ECG, and preventive heart health services.', color: 'bg-pink-50 text-pink-600' },
  { icon: ShieldCheck, title: 'Preventive Health', desc: 'Regular health checkups, vaccinations, and wellness programs.', color: 'bg-green-50 text-green-600' },
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Patients Served' },
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: Clock, value: '24/7', label: 'Emergency Care' },
  { icon: Star, value: '4.9★', label: 'Patient Rating' },
];

const testimonials = [
  { name: 'Rajesh Sharma', text: 'SAMPARC MEDICAL provided excellent care during my treatment. The staff is professional and compassionate.', rating: 5 },
  { name: 'Priya Patel', text: 'The pharmacy has all medicines available at reasonable prices. Highly recommend this hospital!', rating: 5 },
  { name: 'Suresh Kumar', text: 'Emergency services are top-notch. They responded quickly and provided excellent treatment.', rating: 5 },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: heroContent } = useGetContent('hero');
  const { currentCustomer, isCustomerLoggedIn } = useCustomerAuth();
  const { data: allAppointments } = useListAppointments();
  const heroSection = useIntersectionObserver();
  const servicesSection = useIntersectionObserver();
  const statsSection = useIntersectionObserver();
  const testimonialsSection = useIntersectionObserver();

  const [heroVisible, setHeroVisible] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Filter appointments for logged-in customer only
  const myAppointments = isCustomerLoggedIn && currentCustomer
    ? (allAppointments ?? []).filter(appt => appt.email === currentCustomer.email)
    : [];

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    // Check if ?book=1 is in URL to auto-open modal
    if (window.location.search.includes('book=1')) {
      const session = getCustomerSession();
      if (session) {
        setTimeout(() => setShowAppointmentModal(true), 300);
      } else {
        navigate({ to: '/customer/login' });
      }
    }
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBookAppointment = () => {
    const session = getCustomerSession();
    if (!session) {
      toast.error('Please login to book an appointment.');
      navigate({ to: '/customer/login' });
      return;
    }
    setShowAppointmentModal(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 size={12} />;
      case 'Cancelled': return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="overflow-hidden">
      {showAppointmentModal && (
        <AppointmentModal
          onClose={() => setShowAppointmentModal(false)}
          prefill={currentCustomer ? {
            patientName: currentCustomer.name,
            phone: currentCustomer.phone,
            email: currentCustomer.email,
          } : undefined}
        />
      )}
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1440x600.png"
            alt="SAMPARC MEDICAL Hospital"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/95 via-pink-50/90 to-rose-100/80"></div>
        </div>

        {/* Animated background shapes - accretive layered background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large ambient glows */}
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

          {/* Floating orbs */}
          <div className="absolute top-16 right-1/4 w-24 h-24 bg-rose-300/25 rounded-full blur-xl" style={{ animation: 'floatOrb 6s ease-in-out infinite' }}></div>
          <div className="absolute bottom-24 right-16 w-16 h-16 bg-pink-400/20 rounded-full blur-lg" style={{ animation: 'floatOrb 8s ease-in-out infinite', animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 left-16 w-20 h-20 bg-pink-200/30 rounded-full blur-xl" style={{ animation: 'floatOrb 7s ease-in-out infinite', animationDelay: '4s' }}></div>

          {/* Geometric grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>

          {/* Diagonal accent lines */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <svg viewBox="0 0 1440 600" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
              <line x1="1200" y1="0" x2="1440" y2="300" stroke="white" strokeWidth="1"/>
              <line x1="1300" y1="0" x2="1440" y2="200" stroke="white" strokeWidth="0.5"/>
              <line x1="900" y1="0" x2="1440" y2="600" stroke="gold" strokeWidth="0.8"/>
              <circle cx="1350" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="1350" cy="100" r="50" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3"/>
            </svg>
          </div>

          {/* Sparkle dots */}
          <div className="absolute w-1.5 h-1.5 bg-rose-400 rounded-full" style={{ top: '15%', right: '10%', opacity: 0.4, animation: 'twinkle 2s ease-in-out infinite' }} />
          <div className="absolute w-1.5 h-1.5 bg-pink-500 rounded-full" style={{ top: '25%', right: '25%', opacity: 0.55, animation: 'twinkle 2.5s ease-in-out infinite', animationDelay: '0.4s' }} />
          <div className="absolute w-1.5 h-1.5 bg-rose-500 rounded-full" style={{ top: '35%', right: '40%', opacity: 0.7, animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0.8s' }} />
          <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full" style={{ top: '45%', right: '10%', opacity: 0.4, animation: 'twinkle 3.5s ease-in-out infinite', animationDelay: '1.2s' }} />
          <div className="absolute w-1.5 h-1.5 bg-rose-400 rounded-full" style={{ top: '55%', right: '25%', opacity: 0.55, animation: 'twinkle 4s ease-in-out infinite', animationDelay: '1.6s' }} />
          <div className="absolute w-1.5 h-1.5 bg-pink-500 rounded-full" style={{ top: '65%', right: '40%', opacity: 0.7, animation: 'twinkle 4.5s ease-in-out infinite', animationDelay: '2s' }} />
          <div className="absolute w-1.5 h-1.5 bg-rose-400 rounded-full" style={{ top: '75%', right: '10%', opacity: 0.4, animation: 'twinkle 5s ease-in-out infinite', animationDelay: '2.4s' }} />
          <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full" style={{ top: '85%', right: '25%', opacity: 0.55, animation: 'twinkle 5.5s ease-in-out infinite', animationDelay: '2.8s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className={`max-w-2xl transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 bg-pink-200/60 border border-pink-300/60 text-rose-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Trusted Healthcare Since 2009
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
              {heroContent || (
                <>
                  Your Health is Our<br />
                  <span className="text-rose-600">Top Priority</span>
                </>
              )}
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
              SAMPARC MEDICAL — a beacon of healthcare excellence in Malavali. We combine modern medicine with compassionate care to serve our community.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleBookAppointment}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Book Appointment <ChevronRight size={18} />
              </button>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-white/70 hover:bg-white/90 text-rose-700 border border-rose-300/50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-rose-500/70 text-xs animate-bounce">
          <span>Scroll</span>
          <div className="w-0.5 h-6 bg-rose-400/40 rounded-full"></div>
        </div>
      </section>

      {/* My Appointments Section — only for logged-in customers */}
      {isCustomerLoggedIn && currentCustomer && (
        <section id="my-appointments" className="py-12 bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-rose-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <ClipboardList size={20} className="text-rose-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    My Appointments
                    {myAppointments.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-rose-600 text-white rounded-full">
                        {myAppointments.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">Welcome back, <strong className="text-rose-600">{currentCustomer.name.split(' ')[0]}</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBookAppointment}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 self-start sm:self-auto"
              >
                <CalendarCheck size={16} /> Book New Appointment
              </button>
            </div>

            {/* Appointments grid */}
            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-rose-100 p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} className="text-rose-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No appointments yet</h3>
                <p className="text-gray-500 text-sm mb-5">Book your first appointment with our specialists today.</p>
                <button
                  type="button"
                  onClick={handleBookAppointment}
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-100"
                >
                  <CalendarCheck size={16} /> Book Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myAppointments.map((appt) => (
                  <div key={appt.id.toString()} className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                        <CalendarCheck size={18} className="text-rose-500" />
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(appt.status)}`}>
                        {getStatusIcon(appt.status)}
                        {appt.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 truncate">{appt.patientName}</h3>
                    <p className="text-sm text-rose-600 font-medium mb-3">{appt.department}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} className="text-gray-400" />
                      <span>{appt.preferredDate}</span>
                    </div>
                    {appt.message && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">"{appt.message}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section ref={statsSection.ref} className="bg-medical-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${statsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <stat.icon size={24} className="text-gold mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-sm text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesSection.ref} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-medical-primary font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Our Medical Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SAMPARC MEDICAL offers a comprehensive range of healthcare services designed to meet all your medical needs under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-medical transition-all duration-500 hover:-translate-y-1 border border-gray-100 group ${
                  servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-medical-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-dark transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Services <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section ref={heroSection.ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <span className="text-medical-primary font-semibold text-sm uppercase tracking-widest">About SAMPARC MEDICAL</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-6">
                A Legacy of <span className="text-medical-primary">Healthcare Excellence</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                SAMPARC MEDICAL is a premier healthcare institution located near Malavali Railway Station, Maharashtra. Founded with a vision to provide accessible, quality healthcare to the community, we have grown into a trusted medical center serving thousands of patients.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Under the visionary leadership of our Founder Director <strong>AMITKUMAR BANERJEE</strong> and CEO <strong>ANUJ SINGH</strong>, SAMPARC MEDICAL continues to expand its services and embrace modern medical technologies to deliver the best patient outcomes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-medical-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-medical-dark transition-all"
                >
                  Meet Our Team <ChevronRight size={16} />
                </Link>
                <a
                  href="tel:+919766343454"
                  className="inline-flex items-center gap-2 border-2 border-medical-primary text-medical-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-medical-light transition-all"
                >
                  Call Us Now
                </a>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${heroSection.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-medical-light rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-medical-primary mb-1">10K+</div>
                  <div className="text-sm text-gray-600 font-medium">Happy Patients</div>
                </div>
                <div className="bg-gold/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-gold-dark mb-1">15+</div>
                  <div className="text-sm text-gray-600 font-medium">Years Experience</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-blue-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Medical Staff</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-green-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Emergency Care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsSection.ref} className="py-20 bg-gradient-to-br from-medical-dark to-medical-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-gold font-semibold text-sm uppercase tracking-widest">Patient Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">What Our Patients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-700 ${
                  testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star key={`star-${t.name}-${j}`} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Portal Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(20,184,166,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-100 border border-teal-200 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Store size={14} />
              Partner With Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Sell on <span className="text-teal-600">SAMPARC MEDICAL</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join our growing network of authorized medicine sellers and reach thousands of customers. 
              Trusted sellers. Verified products. Better healthcare.
            </p>
          </div>

          {/* Two-card layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1 – New Seller Register */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <UserPlus size={24} className="text-white" />
                </div>
                <h3 className="text-white font-extrabold text-xl mb-1">New Seller?</h3>
                <p className="text-teal-100 text-sm">Create your seller account</p>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Become an Authorized Seller</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Register as an authorized medicine seller on SAMPARC MEDICAL. Expand your reach, manage your inventory, and grow your pharmaceutical business with our trusted platform.
                </p>
                <ul className="space-y-1.5 mb-6">
                  {['Verified seller badge', 'Manage your own inventory', 'Reach thousands of customers', 'Secure & fast payments'].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-teal-500 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/seller/signup"
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300"
                >
                  <UserPlus size={16} /> Sign Up as Seller
                </Link>
              </div>
            </div>

            {/* Card 2 – Existing Seller Login */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <LogIn size={24} className="text-white" />
                </div>
                <h3 className="text-white font-extrabold text-xl mb-1">Already a Seller?</h3>
                <p className="text-teal-100 text-sm">Access your seller dashboard</p>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Seller Login</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Sign in to your seller portal to manage your medicines, track orders, update stock levels, and monitor your sales performance on SAMPARC MEDICAL.
                </p>
                <ul className="space-y-1.5 mb-6">
                  {['Full inventory management', 'Add & edit medicines', 'View sales analytics', 'Admin-verified account'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/seller/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300"
                >
                  <LogIn size={16} /> Sign In to Seller Portal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-gray-500 mt-8">
            All sellers are verified by SAMPARC MEDICAL admin. Documents required during signup. 
            <a href="mailto:samparc6@gmail.com" className="text-teal-600 font-semibold hover:underline ml-1">Questions? Email us.</a>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to Experience Quality Healthcare?</h2>
          <p className="text-gray-600 mb-8 text-lg">Visit SAMPARC MEDICAL today or contact us for appointments and inquiries.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919766343454"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+919766343454"
              className="inline-flex items-center gap-2 bg-medical-primary hover:bg-medical-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Call Now: +91 9766343454
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

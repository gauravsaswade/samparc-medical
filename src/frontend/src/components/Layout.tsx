import { Link, useRouterState, Outlet, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, Heart, User, LogOut, Store, CalendarCheck, ClipboardList } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { toast } from 'sonner';
import ChatAssistant from './ChatAssistant';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Medicines', path: '/medicines' },
  { label: 'Contact Us', path: '/contact' },
];

export default function Layout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { currentCustomer, logoutCustomer, isCustomerLoggedIn } = useCustomerAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logoutCustomer();
    toast.success('Logged out successfully.');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Info Bar */}
      <div className="bg-medical-dark text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="mailto:samparc6@gmail.com" className="flex items-center gap-1.5 hover:text-gold-light transition-colors">
              <Mail size={13} />
              <span>samparc6@gmail.com</span>
            </a>
            <a href="tel:+919766343454" className="flex items-center gap-1.5 hover:text-gold-light transition-colors">
              <Phone size={13} />
              <span>+91 9766343454</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-gold-light" />
            <span className="text-gray-300">Near Malavali Railway Station, Maharashtra</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-medical' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/assets/uploads/IMG-20260227-WA0000-1-1.jpg"
                alt="SAMPARC MEDICAL Logo"
                className="h-12 w-12 object-cover rounded-full ring-2 ring-medical-primary/30 group-hover:ring-medical-primary transition-all duration-300 shadow-md"
              />
              <div>
                <div className="text-medical-primary font-extrabold text-xl leading-tight tracking-wide">SAMPARC</div>
                <div className="text-gold font-bold text-xs tracking-widest">MEDICAL</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    currentPath === link.path
                      ? 'bg-medical-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-medical-light hover:text-medical-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Seller Portal link */}
              <Link
                to="/seller/login"
                className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-teal-700 hover:bg-teal-50 border border-teal-200 hover:border-teal-400 transition-all"
              >
                <Store size={14} /> Seller Portal
              </Link>
              {/* Customer auth */}
              {isCustomerLoggedIn && currentCustomer ? (
                <div className="flex items-center gap-1.5 ml-2">
                  <a
                    href="/?book=1"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-400 transition-all"
                  >
                    <CalendarCheck size={14} /> Book Appointment
                  </a>
                  <a
                    href="/#my-appointments"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-400 transition-all"
                  >
                    <ClipboardList size={14} /> My Appointments
                  </a>
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-medical-light text-medical-primary rounded-md text-sm font-semibold">
                    <User size={14} /> {currentCustomer.name.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/customer/login"
                  className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm font-semibold transition-all shadow-sm"
                >
                  <User size={14} /> Login
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-medical-light"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                    currentPath === link.path
                      ? 'bg-medical-primary text-white'
                      : 'text-gray-700 hover:bg-medical-light hover:text-medical-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <Link
                  to="/seller/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200"
                >
                  <Store size={14} /> Seller Portal
                </Link>
                {isCustomerLoggedIn && currentCustomer ? (
                  <>
                    <p className="px-4 py-2 text-sm font-semibold text-medical-primary flex items-center gap-2">
                      <User size={14} /> {currentCustomer.name}
                    </p>
                    <a
                      href="/?book=1"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                    >
                      <CalendarCheck size={14} /> Book Appointment
                    </a>
                    <a
                      href="/#my-appointments"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                    >
                      <ClipboardList size={14} /> My Appointments
                    </a>
                    <button
                      type="button"
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/customer/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-semibold bg-rose-600 text-white"
                  >
                    <User size={14} /> Customer Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-medical-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/uploads/IMG-20260227-WA0000-1-1.jpg"
                  alt="SAMPARC MEDICAL Logo"
                  className="w-10 h-10 object-cover rounded-full ring-2 ring-medical-primary/50 shadow-md"
                />
                <div>
                  <div className="text-white font-extrabold text-lg leading-tight">SAMPARC</div>
                  <div className="text-gold font-bold text-xs tracking-widest">MEDICAL</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted healthcare partner, committed to providing quality medical care with compassion and excellence.
              </p>
              <p className="text-gold font-semibold italic text-sm">"Your Health, Our Mission"</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 border-b border-medical-primary pb-2">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-1.5">
                      <span className="text-medical-primary">›</span> {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/seller/login" className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-1.5">
                    <Store size={12} className="text-teal-400" /> Seller Portal
                  </Link>
                </li>
                <li>
                  <Link to="/customer/login" className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-1.5">
                    <User size={12} className="text-medical-primary" /> Customer Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 border-b border-medical-primary pb-2">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="tel:+919766343454" className="flex items-start gap-2 text-gray-400 hover:text-gold transition-colors">
                    <Phone size={14} className="mt-0.5 text-medical-primary shrink-0" />
                    <span>+91 9766343454 (Customer Care)</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919766343454" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-gray-400 hover:text-gold transition-colors">
                    <SiWhatsapp size={14} className="mt-0.5 text-green-400 shrink-0" />
                    <span>+91 9766343454 (WhatsApp)</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919270556455" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-gray-400 hover:text-gold transition-colors">
                    <SiWhatsapp size={14} className="mt-0.5 text-green-400 shrink-0" />
                    <span>+91 9270556455 (Cross WhatsApp)</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919766343456" className="flex items-start gap-2 text-gray-400 hover:text-gold transition-colors">
                    <Phone size={14} className="mt-0.5 text-medical-primary shrink-0" />
                    <span>+91 9766343456 (CEO)</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:samparc6@gmail.com" className="flex items-start gap-2 text-gray-400 hover:text-gold transition-colors">
                    <Mail size={14} className="mt-0.5 text-medical-primary shrink-0" />
                    <span>samparc6@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 border-b border-medical-primary pb-2">Our Location</h3>
              <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
                <MapPin size={14} className="mt-0.5 text-medical-primary shrink-0" />
                <address className="not-italic leading-relaxed">
                  SAMPARC MEDICAL,<br />
                  Nearby Malavali Railway Station,<br />
                  Samparc Malavali Campus,<br />
                  Near Malavli, Malavli,<br />
                  Maharashtra 410405
                </address>
              </div>
              <a
                href="https://maps.google.com/?q=Malavali+Railway+Station+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-medical-primary/20 text-medical-light px-3 py-1.5 rounded-full hover:bg-medical-primary/30 transition-colors"
              >
                <MapPin size={12} /> View on Map
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} SAMPARC MEDICAL. All Rights Reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with <Heart size={14} className="text-red-400 fill-red-400" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'samparc-medical')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <ChatAssistant />
    </div>
  );
}

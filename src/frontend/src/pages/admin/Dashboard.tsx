import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LayoutDashboard, Pill, FileEdit, LogOut, Menu, ChevronRight, CalendarCheck, Store, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Overview from './Overview';
import MedicinesManager from './MedicinesManager';
import ContentEditor from './ContentEditor';
import AppointmentsManager from './AppointmentsManager';
import SellersManager from './SellersManager';
import CredentialsManager from './CredentialsManager';

type Section = 'overview' | 'medicines' | 'content' | 'appointments' | 'sellers' | 'credentials';

const navItems = [
  { id: 'overview' as Section, label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments' as Section, label: 'Appointments', icon: CalendarCheck },
  { id: 'medicines' as Section, label: 'Medicines', icon: Pill },
  { id: 'sellers' as Section, label: 'Sellers', icon: Store },
  { id: 'credentials' as Section, label: 'User Credentials', icon: KeyRound },
  { id: 'content' as Section, label: 'Content Editor', icon: FileEdit },
];

const RESTRICTED_EMAIL = 'samparc2026@gmail.com';
const RESTRICTED_SECTIONS: Section[] = ['credentials', 'content'];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, adminEmail } = useAuth();
  const navigate = useNavigate();

  const visibleNavItems = navItems.filter(
    (item) => !(adminEmail === RESTRICTED_EMAIL && RESTRICTED_SECTIONS.includes(item.id))
  );

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin' });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <Overview />;
      case 'appointments': return <AppointmentsManager />;
      case 'medicines': return <MedicinesManager />;
      case 'sellers': return <SellersManager />;
      case 'credentials': return <CredentialsManager />;
      case 'content': return <ContentEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            <div className="w-10 h-10 bg-medical-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">✚</span>
            </div>
            <div>
              <p className="font-extrabold text-sm leading-tight">SAMPARC</p>
              <p className="text-gold text-xs font-bold tracking-widest">MEDICAL</p>
            </div>
          </div>
          <p className="text-teal-300 text-xs mt-2">Admin Dashboard</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-medical-primary text-white shadow-sm'
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
                {visibleNavItems.find(n => n.id === activeSection)?.label ?? navItems.find(n => n.id === activeSection)?.label}
              </h1>
              <p className="text-xs text-gray-500">SAMPARC MEDICAL Admin</p>
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
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

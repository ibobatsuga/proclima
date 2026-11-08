import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Calendar, 
  Briefcase, 
  Wrench, 
  FileText, 
  Bell, 
  Clock, 
  QrCode, 
  Star, 
  Users,
  ShieldCheck
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoleView, activeScreen, setActiveScreen } = useApp();

  // If in customer view (Link Publik FR-08)
  if (currentRoleView === 'CLIENT') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
          {/* Status Live (Screen 9) */}
          <button
            onClick={() => setActiveScreen('screen-9')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'screen-9' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Status Live</span>
          </button>

          {/* Riwayat Unit (Screen 10) */}
          <button
            onClick={() => setActiveScreen('screen-10')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'screen-10' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Riwayat AC</span>
          </button>

          {/* Elevated Home Center Button */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => setActiveScreen('screen-9')}
              className="w-14 h-14 rounded-2xl bg-navy text-white shadow-xl shadow-navy/30 flex items-center justify-center border-4 border-[#F6F5EF] active:scale-95 transition-transform"
              aria-label="Beranda Pelanggan"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>

          {/* Laporan Servis (Screen 11) */}
          <button
            onClick={() => setActiveScreen('screen-11')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'screen-11' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Laporan</span>
          </button>

          {/* Beri Ulasan (Screen 12) */}
          <button
            onClick={() => setActiveScreen('screen-12')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'screen-12' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Star className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Ulasan</span>
          </button>
        </div>
      </nav>
    );
  }

  // If in Admin / Owner View
  if (currentRoleView === 'ADMIN') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
          {/* Kalender Anti-Bentrok */}
          <button
            onClick={() => setActiveScreen('admin-calendar')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'admin-calendar' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Kalender</span>
          </button>

          {/* Pelanggan & Unit */}
          <button
            onClick={() => setActiveScreen('admin-customers')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'admin-customers' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Unit & QR</span>
          </button>

          {/* Elevated Home Center Button */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => setActiveScreen('admin-dashboard')}
              className="w-14 h-14 rounded-2xl bg-brandOrange text-white shadow-xl shadow-brandOrange/40 flex items-center justify-center border-4 border-[#F6F5EF] active:scale-95 transition-transform"
              aria-label="Dashboard Admin"
            >
              <ShieldCheck className="w-7 h-7" />
            </button>
          </div>

          {/* Invoice */}
          <button
            onClick={() => setActiveScreen('admin-invoices')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'admin-invoices' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Invoice</span>
          </button>

          {/* Pengingat WA 90 Hari */}
          <button
            onClick={() => setActiveScreen('admin-reminders')}
            className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
              activeScreen === 'admin-reminders' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Ingatkan WA</span>
          </button>
        </div>
      </nav>
    );
  }

  // Default: Technician View (Screens 1 to 8)
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl safe-area-bottom">
      <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
        {/* All Jobs / Hari Ini (Screen 2) */}
        <button
          onClick={() => setActiveScreen('screen-2')}
          className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
            activeScreen === 'screen-2' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Daftar Job</span>
        </button>

        {/* Scan & Check-in (Screen 4) */}
        <button
          onClick={() => setActiveScreen('screen-4')}
          className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
            activeScreen === 'screen-4' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
          }`}
        >
          <QrCode className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Scan QR</span>
        </button>

        {/* Elevated Home Center Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => setActiveScreen('screen-1')}
            className="w-14 h-14 rounded-2xl bg-navy text-white shadow-xl shadow-navy/30 flex items-center justify-center border-4 border-[#F6F5EF] active:scale-95 transition-transform"
            aria-label="Dashboard Teknisi"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>

        {/* Laporan Servis Aktif (Screen 5) */}
        <button
          onClick={() => setActiveScreen('screen-5')}
          className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
            activeScreen === 'screen-5' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Laporan</span>
        </button>

        {/* Selesaikan & TTD (Screen 7) */}
        <button
          onClick={() => setActiveScreen('screen-7')}
          className={`touch-target flex-1 flex flex-col items-center justify-center transition-all ${
            activeScreen === 'screen-7' ? 'text-navy font-bold' : 'text-slate-400 hover:text-navy'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">TTD Customer</span>
        </button>
      </div>
    </nav>
  );
};

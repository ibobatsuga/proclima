import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { BottomNav } from './components/BottomNav';

// 12 screens from reference
import { Screen1Dashboard } from './screens/Screen1Dashboard';
import { Screen2AllJobs } from './screens/Screen2AllJobs';
import { Screen3JobDetail } from './screens/Screen3JobDetail';
import { Screen4ScanCheckIn } from './screens/Screen4ScanCheckIn';
import { Screen5ServiceReport } from './screens/Screen5ServiceReport';
import { Screen6PartsRequisition } from './screens/Screen6PartsRequisition';
import { Screen7SignatureSignOff } from './screens/Screen7SignatureSignOff';
import { Screen8JobComplete } from './screens/Screen8JobComplete';
import { Screen9ClientDashboard } from './screens/Screen9ClientDashboard';
import { Screen10ClientJobHistory } from './screens/Screen10ClientJobHistory';
import { Screen11ClientServiceReport } from './screens/Screen11ClientServiceReport';
import { Screen12GiveReview } from './screens/Screen12GiveReview';

// Additional Admin & Public Screens from PRD
import { ScreenAdminCalendar } from './screens/ScreenAdminCalendar';
import { ScreenAdminInvoices } from './screens/ScreenAdminInvoices';
import { ScreenAdminReminders } from './screens/ScreenAdminReminders';
import { ScreenAdminCustomers } from './screens/ScreenAdminCustomers';
import { ScreenAdminDashboard } from './screens/ScreenAdminDashboard';
import { ScreenPublicBooking } from './screens/ScreenPublicBooking';
import { Layers, ChevronDown } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeScreen, setActiveScreen, currentRoleView, setCurrentRoleView } = useApp();
  const [showScreenPicker, setShowScreenPicker] = useState(false);

  const screens12List = [
    { id: 'screen-1', name: '1. Dashboard Teknisi', group: 'Stage 1: Job Intake' },
    { id: 'screen-2', name: '2. All Jobs (Hari Ini)', group: 'Stage 1: Job Intake' },
    { id: 'screen-3', name: '3. Detail Job & Riwayat AC', group: 'Stage 1: Job Intake' },
    { id: 'screen-4', name: '4. Scan QR & Check-In', group: 'Stage 1: Job Intake' },
    { id: 'screen-5', name: '5. Laporan Servis (Checklist)', group: 'Stage 2: Service Execution' },
    { id: 'screen-6', name: '6. Sparepart & Freon Tambahan', group: 'Stage 2: Service Execution' },
    { id: 'screen-7', name: '7. Tanda Tangan Customer', group: 'Stage 2: Service Execution' },
    { id: 'screen-8', name: '8. Job Selesai & Invoice Terbit', group: 'Stage 2: Service Execution' },
    { id: 'screen-9', name: '9. Status Live (Link Publik)', group: 'Stage 3: Client Proof' },
    { id: 'screen-10', name: '10. Riwayat Unit AC Pelanggan', group: 'Stage 3: Client Proof' },
    { id: 'screen-11', name: '11. Laporan Servis Client (PDF)', group: 'Stage 3: Client Proof' },
    { id: 'screen-12', name: '12. Beri Ulasan & Rating', group: 'Stage 3: Client Proof' },
  ];

  const adminScreensList = [
    { id: 'admin-calendar', name: 'Kalender & Anti-Bentrok', group: 'Admin / Owner' },
    { id: 'admin-customers', name: 'Pelanggan & Stiker QR', group: 'Admin / Owner' },
    { id: 'admin-invoices', name: 'Invoice & Piutang', group: 'Admin / Owner' },
    { id: 'admin-reminders', name: 'Pengingat WA 90 Hari', group: 'Admin / Owner' },
    { id: 'admin-dashboard', name: 'Dashboard Owner & Kuota', group: 'Admin / Owner' },
    { id: 'public-booking', name: 'Form Booking Publik', group: 'Customer' },
  ];

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'screen-1': return <Screen1Dashboard />;
      case 'screen-2': return <Screen2AllJobs />;
      case 'screen-3': return <Screen3JobDetail />;
      case 'screen-4': return <Screen4ScanCheckIn />;
      case 'screen-5': return <Screen5ServiceReport />;
      case 'screen-6': return <Screen6PartsRequisition />;
      case 'screen-7': return <Screen7SignatureSignOff />;
      case 'screen-8': return <Screen8JobComplete />;
      case 'screen-9': return <Screen9ClientDashboard />;
      case 'screen-10': return <Screen10ClientJobHistory />;
      case 'screen-11': return <Screen11ClientServiceReport />;
      case 'screen-12': return <Screen12GiveReview />;
      case 'admin-calendar': return <ScreenAdminCalendar />;
      case 'admin-invoices': return <ScreenAdminInvoices />;
      case 'admin-reminders': return <ScreenAdminReminders />;
      case 'admin-customers': return <ScreenAdminCustomers />;
      case 'admin-dashboard': return <ScreenAdminDashboard />;
      case 'public-booking': return <ScreenPublicBooking />;
      default: return <Screen1Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-start relative text-navy antialiased">
      {/* Full Mobile Web Container */}
      <div className="w-full flex-1 flex flex-col relative overflow-x-hidden">
        
        {/* Floating Quick 12-Screen Navigator Pill (For Easy Assessment & Demo) */}
        <div className="fixed top-2 right-2 z-50">
          <button
            onClick={() => setShowScreenPicker(prev => !prev)}
            className="bg-navy/90 hover:bg-navy text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 border border-white/20 active:scale-95 transition-all"
            title="Buka Peta 12 Layar & Menu"
          >
            <Layers className="w-3.5 h-3.5 text-brandOrange" />
            <span className="hidden xs:inline">Peta Layar</span>
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>

          {showScreenPicker && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-2 z-50 text-xs max-h-[480px] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-display font-bold text-navy">Peta 12 Layar ProClima</span>
                <button onClick={() => setShowScreenPicker(false)} className="text-slate-400 font-bold hover:text-navy">✕</button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">12 Layar Alur Inti (Referensi)</p>
                {screens12List.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveScreen(s.id);
                      if (s.id.startsWith('screen-9') || s.id.startsWith('screen-10') || s.id.startsWith('screen-11') || s.id.startsWith('screen-12')) {
                        setCurrentRoleView('CLIENT');
                      } else {
                        setCurrentRoleView('TECHNICIAN');
                      }
                      setShowScreenPicker(false);
                    }}
                    className={`w-full text-left p-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                      activeScreen === s.id ? 'bg-navy text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Fitur Admin & Booking</p>
                {adminScreensList.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveScreen(s.id);
                      if (s.id === 'public-booking') {
                        setCurrentRoleView('CLIENT');
                      } else {
                        setCurrentRoleView('ADMIN');
                      }
                      setShowScreenPicker(false);
                    }}
                    className={`w-full text-left p-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                      activeScreen === s.id ? 'bg-brandOrange text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Active Screen View */}
        <main className="flex-1">
          {renderActiveScreen()}
        </main>

        {/* Global Bottom Navigation (Principle 2) */}
        <BottomNav />
      </div>
    </div>
  );
};

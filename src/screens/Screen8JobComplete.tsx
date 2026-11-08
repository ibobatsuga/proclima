import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  CheckCircle2, 
  FileText, 
  Bell, 
  Share2, 
  ChevronRight, 
  Home, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Screen8JobComplete: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    acUnits, 
    services, 
    invoices, 
    reminders, 
    setActiveScreen,
    setCurrentRoleView
  } = useApp();

  const customer = customers.find(c => c.id === activeJob?.customerId);
  const unit = acUnits.find(u => u.id === activeJob?.unitId);
  const service = services.find(s => s.id === activeJob?.serviceId);
  const latestInvoice = invoices.find(inv => inv.jobId === activeJob?.id) || invoices[0];
  const reminder = reminders.find(r => r.jobId === activeJob?.id) || reminders[0];

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title="Pekerjaan Selesai!" 
        subtitle="Tahap 2: Rantai pengerjaan job tuntas" 
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Celebration Header Card */}
        <div className="bg-emerald-600 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
            Same-Day Service Loop Closed
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            Job #{activeJob?.id} Selesai!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Bukti foto & tanda tangan telah tersimpan. Invoice resmi otomatis terbit hari ini.
          </p>
        </div>

        {/* 1. Same-Day Invoice Notice (PRD FR-13) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brandOrange" />
              <div>
                <h4 className="font-display font-bold text-sm text-navy">Invoice Same-Day Terbit</h4>
                <span className="text-[11px] text-slate-500">ID: {latestInvoice?.id}</span>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              latestInvoice?.status === 'LUNAS' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {latestInvoice?.status === 'LUNAS' ? 'LUNAS' : 'Belum Bayar'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">Total Nominal Jasa:</span>
            <span className="font-display font-bold text-base text-navy">
              Rp {latestInvoice?.amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* 2. Pembeda Khas ProClima: Pengingat Servis Ulang Otomatis 90 Hari (PRD FR-15) */}
        <div className="bg-white rounded-2xl p-4 border-2 border-brandOrange/30 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brandOrange/15 flex items-center justify-center text-brandOrange">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-brandOrange tracking-wider">
                Pembeda Produk Otomatis
              </span>
              <h4 className="font-display font-bold text-sm text-navy">
                Pengingat Servis 90 Hari Terjadwal
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem secara otomatis mengunci tanggal jatuh tempo servis berikutnya pada <span className="font-bold text-navy">{reminder?.dueDate || '90 hari ke depan'}</span>. Pelanggan akan menerima WhatsApp resmi untuk menjaga AC tetap awet & dingin.
          </p>

          <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-[11px] text-slate-600">
            <p className="font-semibold text-navy mb-0.5">Template WhatsApp Resmi:</p>
            <p className="italic">"{reminder?.messageText.slice(0, 110)}..."</p>
          </div>
        </div>

        {/* 3. Client Proof Switcher (Tahap 3 Preview) */}
        <div className="bg-navy rounded-2xl p-4 text-white shadow space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold">Sisi Pelanggan (Link Publik)</span>
              <h4 className="font-display font-bold text-sm text-white">Lihat Hasil Dari Sudut Pandang Client</h4>
            </div>
            <Sparkles className="w-5 h-5 text-brandOrange" />
          </div>
          <p className="text-xs text-slate-300">
            Customer dapat melihat laporan transparan, foto sebelum/sesudah, dan memberikan ulasan tanpa login atau install aplikasi.
          </p>
          <button
            onClick={() => {
              setCurrentRoleView('CLIENT');
              setActiveScreen('screen-9'); // Client Dashboard
            }}
            className="touch-target w-full bg-white text-navy rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow active:bg-slate-100"
          >
            <span>Buka Link Publik Customer</span>
            <ArrowRight className="w-4 h-4 text-brandOrange" />
          </button>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('screen-1')}
            className="touch-target flex-1 bg-white border border-slate-300 text-navy rounded-xl py-3.5 text-xs font-semibold flex items-center justify-center gap-1 active:bg-slate-100"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveScreen('screen-2')}
            className="touch-target flex-[2] bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
          >
            <span>Mulai Job Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

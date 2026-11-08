import React from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  Sparkles,
  ShieldCheck,
  Ban
} from 'lucide-react';

export const ScreenAdminReminders: React.FC = () => {
  const { 
    reminders, 
    customers, 
    acUnits, 
    tenant, 
    sendWhatsAppReminderNow, 
    optOutReminder 
  } = useApp();

  const sentCount = reminders.filter(r => r.status === 'TERKIRIM').length;
  const remainingQuota = Math.max(0, tenant.limits.whatsappPerMonth - sentCount);

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Pengingat Servis WA 90 Hari" 
        subtitle="Otomasi Retensi Pelanggan Khas ProClima" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* WhatsApp Quota & Plan Tracker (PRD FR-17) */}
        <div className="bg-navy rounded-2xl p-4 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-slate-300">WhatsApp Cloud API Meta</span>
            </div>
            <span className="bg-brandOrange text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Paket {tenant.plan}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {sentCount} / {tenant.limits.whatsappPerMonth}
              </div>
              <p className="text-[11px] text-slate-300">Pesan Pengingat Terkirim Bulan Ini</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">{remainingQuota} Tersisa</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brandOrange h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (sentCount / tenant.limits.whatsappPerMonth) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Why this is ProClima's Moat */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 text-xs text-navy space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-brandOrange">
            <Sparkles className="w-4 h-4" />
            <span>Pembeda Utama: Pelanggan Kembali Tanpa Diingat Manual</span>
          </p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Begitu pekerjaan servis AC diselesaikan, sistem langsung membuat jadwal pengingat 90 hari sesuai siklus standar cuci AC di iklim tropis Indonesia.
          </p>
        </div>

        {/* List of Reminders */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy">
            Daftar Jadwal Pengingat ({reminders.length})
          </h4>

          {reminders.map(rem => {
            const cust = customers.find(c => c.id === rem.customerId);
            const unit = acUnits.find(u => u.id === rem.unitId);
            const isSent = rem.status === 'TERKIRIM';
            const isOptOut = rem.status === 'OPT_OUT';

            return (
              <div
                key={rem.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy">{cust?.name}</h4>
                    <span className="text-[11px] text-slate-500">{unit?.brand} ({unit?.locationIndoor})</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSent 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : isOptOut
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isSent ? 'Terkirim' : isOptOut ? 'Opt-Out' : 'Terjadwal'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-navy" />
                    Jatuh Tempo:
                  </span>
                  <span className="font-bold text-navy">{rem.dueDate}</span>
                </div>

                {/* Message preview */}
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-slate-700 italic">
                  "{rem.messageText}"
                </div>

                {/* Action buttons */}
                {!isSent && !isOptOut && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => sendWhatsAppReminderNow(rem.id)}
                      className="touch-target flex-1 bg-emerald-600 text-white rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:bg-emerald-700"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Sekarang</span>
                    </button>

                    <button
                      onClick={() => optOutReminder(rem.id)}
                      className="touch-target px-3 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 rounded-xl py-2 text-xs font-medium"
                      title="Pelanggan minta berhenti dikirimi (Opt-Out)"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

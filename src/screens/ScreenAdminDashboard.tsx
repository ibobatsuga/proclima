import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Download, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const ScreenAdminDashboard: React.FC = () => {
  const { 
    tenant, 
    updateTenantPlan, 
    jobs, 
    invoices, 
    customers, 
    acUnits, 
    reminders, 
    auditLogs, 
    exportCSV 
  } = useApp();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const totalRevenue = invoices
    .filter(i => i.status === 'LUNAS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingReceivables = invoices
    .filter(i => i.status === 'BELUM_BAYAR')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const completedJobsCount = jobs.filter(j => j.status === 'SELESAI').length;

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Dashboard Owner" 
        subtitle="Analisis bisnis & limit kuota usaha AC" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Usaha & Plan Badge */}
        <div className="bg-navy rounded-3xl p-5 text-white shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Profil Usaha AC
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              tenant.plan === 'Pro' ? 'bg-amber-400 text-navy' : 'bg-white/20 text-white'
            }`}>
              Paket {tenant.plan}
            </span>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl leading-tight text-white">{tenant.name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{tenant.address}</p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span>Status: <strong className="text-emerald-400">Aktif & Berjalan</strong></span>
            {tenant.plan === 'Basic' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-brandOrange hover:bg-brandOrange-dark text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow active:scale-95 transition-all"
              >
                <span>Upgrade Pro</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Financial Metrics (FR-20) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Uang Masuk</span>
            <div className="text-lg font-display font-bold text-navy">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Bulan berjalan</span>
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Piutang Tertunggak</span>
            <div className="text-lg font-display font-bold text-brandOrange">
              Rp {pendingReceivables.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">Belum ditandai bayar</span>
          </div>
        </div>

        {/* Usage Quota Card (PRD FR-17 Server-enforced Limits) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy">
              Limit Paket ({tenant.plan})
            </h4>
            <span className="text-[10px] text-slate-500">Ditegakkan di server</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Pelanggan */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600">Pelanggan Aktif:</span>
                <span className="font-bold text-navy">{customers.length} / {tenant.limits.customers}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-navy h-full rounded-full" 
                  style={{ width: `${Math.min(100, (customers.length / tenant.limits.customers) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Unit AC */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600">Unit AC Terdaftar:</span>
                <span className="font-bold text-navy">{acUnits.length} / {tenant.limits.acUnits}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-navy h-full rounded-full" 
                  style={{ width: `${Math.min(100, (acUnits.length / tenant.limits.acUnits) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* WA Reminders */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600">Kuota WhatsApp 90 Hari:</span>
                <span className="font-bold text-brandOrange">
                  {reminders.filter(r => r.status === 'TERKIRIM').length} / {tenant.limits.whatsappPerMonth}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brandOrange h-full rounded-full" 
                  style={{ width: `${Math.min(100, (reminders.filter(r => r.status === 'TERKIRIM').length / tenant.limits.whatsappPerMonth) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export (FR-18) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
            <Download className="w-4 h-4 text-brandOrange" />
            <span>Ekspor Data Usaha (CSV)</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Sesuai kepatuhan UU PDP, data operasional adalah milik penuh pengusaha dan dapat diunduh sewaktu-waktu.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => exportCSV('customers')}
              className="touch-target bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-1 text-[11px] font-bold text-navy text-center transition-colors"
            >
              CSV Pelanggan
            </button>
            <button
              onClick={() => exportCSV('jobs')}
              className="touch-target bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-1 text-[11px] font-bold text-navy text-center transition-colors"
            >
              CSV Jobs
            </button>
            <button
              onClick={() => exportCSV('invoices')}
              className="touch-target bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-1 text-[11px] font-bold text-navy text-center transition-colors"
            >
              CSV Invoice
            </button>
          </div>
        </div>

        {/* Live Audit Log (FR-19) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-navy" />
              <span>Audit Log Sistem (Real-Time)</span>
            </h4>
            <span className="text-[10px] text-slate-400">Tidak dapat dihapus</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {auditLogs.slice(0, 6).map(log => (
              <div key={log.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy">{log.actor} ({log.role})</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="bg-brandOrange/15 text-brandOrange font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                ProClima Pro SaaS
              </span>
              <h3 className="font-display font-bold text-lg text-navy">
                Upgrade ke Paket Pro
              </h3>
              <p className="text-xl font-display font-bold text-brandOrange">
                Rp 149.000 <span className="text-xs font-normal text-slate-500">/ bulan</span>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-navy font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hingga 5 Teknisi & 2 Admin</span>
              </div>
              <div className="flex items-center gap-2 text-navy font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>500 Pelanggan & 2.000 Unit AC</span>
              </div>
              <div className="flex items-center gap-2 text-navy font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1.000 Pengingat WhatsApp / bulan</span>
              </div>
              <div className="flex items-center gap-2 text-navy font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Invoice Same-day & Ekspor CSV</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="touch-target flex-1 bg-slate-100 text-slate-700 rounded-xl py-2.5 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  updateTenantPlan('Pro');
                  setShowUpgradeModal(false);
                  alert('Selamat! Akun Anda telah di-upgrade ke Paket Pro.');
                }}
                className="touch-target flex-1 bg-brandOrange text-white rounded-xl py-2.5 text-xs font-semibold shadow active:bg-brandOrange-dark"
              >
                Aktifkan Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

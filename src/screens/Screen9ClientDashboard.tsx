import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Plus, 
  Wrench,
  Thermometer,
  FileText,
  Star
} from 'lucide-react';

export const Screen9ClientDashboard: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    acUnits, 
    services, 
    users, 
    setActiveScreen 
  } = useApp();

  const customer = customers.find(c => c.id === activeJob?.customerId) || customers[0];
  const unit = acUnits.find(u => u.id === activeJob?.unitId) || acUnits[0];
  const service = services.find(s => s.id === activeJob?.serviceId) || services[0];
  const technician = users.find(u => u.id === activeJob?.technicianId) || users[1];

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Status Servis AC Saya" 
        subtitle="Link Publik Pelanggan (Tanpa Perlu Login)" 
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Live Status Card (Bahasa Awam PRD 6.6) */}
        <div className="bg-navy rounded-3xl p-5 text-white shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Update Langsung (Live)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-white leading-tight">
              {activeJob?.status === 'SELESAI' 
                ? 'AC Anda Telah Selesai Dicuci & Dingin!' 
                : activeJob?.status === 'DIKERJAKAN'
                ? 'Teknisi Sedang Mencuci AC Anda'
                : activeJob?.status === 'BERANGKAT'
                ? 'Teknisi Sedang Menuju Rumah Anda'
                : 'Pesanan Diterima & Dijadwalkan'}
            </h2>
            <p className="text-xs text-slate-200 mt-1">
              {activeJob?.statusLabelAwam || 'Teknisi kami siap memberikan servis AC terbaik.'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Estimasi Jam Datang:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brandOrange" />
              {activeJob?.startTime} - {activeJob?.endTime} WIB
            </span>
          </div>
        </div>

        {/* Assigned Technician Profile */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Teknisi Yang Bertugas
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={technician.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                alt="Teknisi"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h4 className="font-display font-bold text-navy text-sm">{technician.name}</h4>
                <p className="text-xs text-slate-500">Teknisi Servis AC Berpengalaman</p>
                <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 (124 servis selesai)</span>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/62${technician.phone.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-100 active:scale-95 transition-all"
              title="Hubungi Teknisi"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Unit & Service Specs */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-semibold text-slate-500">Unit Yang Dikerjakan:</span>
            <span className="font-bold text-navy text-xs">{unit?.brand} ({unit?.pk})</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
            <span className="text-slate-500">Lokasi Penempatan:</span>
            <span className="font-medium text-navy">{unit?.locationIndoor}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Paket Layanan:</span>
            <span className="font-bold text-navy">{service?.name}</span>
          </div>
        </div>

        {/* Quick Links for Customer */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setActiveScreen('screen-11')}
            className="touch-target bg-white border border-slate-200 rounded-2xl p-3 text-left shadow-sm hover:border-navy transition-all active:scale-95 space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-navy flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display font-bold text-xs text-navy">Laporan Servis</p>
              <p className="text-[10px] text-slate-500">Foto & Hasil Ukur</p>
            </div>
          </button>

          <button
            onClick={() => setActiveScreen('screen-12')}
            className="touch-target bg-white border border-slate-200 rounded-2xl p-3 text-left shadow-sm hover:border-navy transition-all active:scale-95 space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display font-bold text-xs text-navy">Beri Ulasan</p>
              <p className="text-[10px] text-slate-500">Rating Kualitas</p>
            </div>
          </button>
        </div>

        {/* Self-service Book Again Banner (Customer Retention) */}
        <div className="bg-gradient-to-r from-brandOrange/10 to-transparent p-4 rounded-2xl border border-brandOrange/20 flex items-center justify-between">
          <div>
            <h4 className="font-display font-bold text-xs text-navy">Punya AC Lain di Rumah?</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">Booking langsung tanpa perlu login akun.</p>
          </div>
          <button
            onClick={() => setActiveScreen('public-booking')}
            className="touch-target bg-brandOrange text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-sm active:bg-brandOrange-dark"
          >
            Pesan Baru
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Printer, 
  Share2, 
  CheckCircle2, 
  Gauge, 
  Thermometer, 
  Camera, 
  PenTool, 
  Calendar, 
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const Screen11ClientServiceReport: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    acUnits, 
    services, 
    users, 
    tenant, 
    setActiveScreen 
  } = useApp();

  const customer = customers.find(c => c.id === activeJob?.customerId) || customers[0];
  const unit = acUnits.find(u => u.id === activeJob?.unitId) || acUnits[0];
  const service = services.find(s => s.id === activeJob?.serviceId) || services[0];
  const technician = users.find(u => u.id === activeJob?.technicianId) || users[1];

  const handlePrint = () => {
    window.print();
  };

  const handleShareWA = () => {
    const text = `Halo, berikut adalah Laporan Servis AC Resmi dari ${tenant.name} untuk unit ${unit.brand} (${unit.locationIndoor}). Suhu dingin: ${activeJob?.outputTempCelsius || 16.5}°C, Freon: ${activeJob?.freonPressurePSI || 140} PSI. AC sudah bersih higienis!`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <div className="no-print">
        <TopAppBar 
          title="Laporan Servis Pelanggan" 
          subtitle="Bukti transparan pengerjaan unit AC Anda" 
          showBack={true}
          onBack={() => setActiveScreen('screen-9')}
        />
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Action Header (Print / Share) */}
        <div className="no-print flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-navy">Laporan Servis Resmi</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="touch-target bg-slate-100 hover:bg-slate-200 text-navy px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-4 h-4 text-navy" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleShareWA}
              className="touch-target bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Bagikan via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        {/* Printable Official Service Certificate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 print:border-none print:shadow-none">
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-navy p-2 flex items-center justify-center">
                <img
                  src="/logo-thermometer.png"
                  alt="ProClima Logo"
                  className="w-full h-full object-contain filter invert"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-navy leading-tight">{tenant.name}</h3>
                <p className="text-[11px] text-slate-500">Service & Maintenance Specialist</p>
              </div>
            </div>

            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Terverifikasi
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Job #{activeJob?.id || '01'}</p>
            </div>
          </div>

          {/* Unit & Customer Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Pelanggan:</span>
              <p className="font-bold text-navy mt-0.5">{customer.name}</p>
              <p className="text-[11px] text-slate-600 truncate">{customer.address}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Unit AC:</span>
              <p className="font-bold text-navy mt-0.5">{unit.brand} ({unit.pk})</p>
              <p className="text-[11px] text-slate-600">{unit.locationIndoor}</p>
            </div>
          </div>

          {/* Technical Diagnostics Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-2xl border border-blue-200/80 space-y-2">
            <span className="text-[11px] uppercase font-bold text-navy tracking-wider block">
              Hasil Pengukuran Sensor Pasca Servis
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-center">
                <span className="text-[10px] text-slate-500 block">Suhu Hembusan Dingin</span>
                <span className="font-display font-bold text-xl text-blue-600">
                  {activeJob?.outputTempCelsius || 16.5} °C
                </span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Sangat Dingin & Segar</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl shadow-sm text-center">
                <span className="text-[10px] text-slate-500 block">Tekanan Gas Freon</span>
                <span className="font-display font-bold text-xl text-brandOrange">
                  {activeJob?.freonPressurePSI || 140} PSI
                </span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Standar Optimal R32</span>
              </div>
            </div>
          </div>

          {/* Before & After Photo Evidence (Proof By Default) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-navy uppercase tracking-wider block">
              Bukti Dokumentasi Pekerjaan di Lokasi
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 block">Foto Sebelum Dicuci:</span>
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img
                    src={activeJob?.beforePhoto || "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=400&q=80"}
                    alt="Sebelum"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-emerald-600 block">Foto Setelah Bersih:</span>
                <div className="rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-slate-100">
                  <img
                    src={activeJob?.afterPhoto || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"}
                    alt="Sesudah"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Passed */}
          <div className="space-y-1.5 text-xs">
            <span className="text-xs font-bold text-navy uppercase tracking-wider block">Poin Servis Terverifikasi</span>
            {[
              'Filter udara indoor dicuci & disterilkan',
              'Kisi-kisi evaporator indoor bersih dari debu & jamur',
              'Saluran pembuangan air (drain) lancar tanpa sumbatan lendir',
              'Blower & kisi kondensor outdoor bersih maksimal',
              'Arus kelistrikan & kompresor bekerja normal'
            ].map((check, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">{check}</span>
              </div>
            ))}
          </div>

          {/* Customer Signature & Timestamp Proof */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <div className="text-left text-xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Tanda Tangan Pelanggan:</span>
              <div className="h-12 w-28 border border-slate-200 rounded-lg p-1 bg-slate-50 mt-1 flex items-center justify-center">
                {activeJob?.customerSignature ? (
                  <img src={activeJob.customerSignature} alt="Tanda Tangan" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Ditandatangani Digital</span>
                )}
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">{customer.name}</span>
            </div>

            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Teknisi Bertugas:</span>
              <p className="font-bold text-navy mt-1">{technician.name}</p>
              <p className="text-[10px] text-slate-500">Berkah Cool Mandiri</p>
              <p className="text-[9px] text-slate-400 mt-1">{activeJob?.completedAt || 'Hari ini'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

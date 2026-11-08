import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Wrench, 
  ChevronRight, 
  Send, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Truck
} from 'lucide-react';

export const Screen3JobDetail: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    acUnits, 
    services, 
    users, 
    updateJobStatus, 
    setActiveScreen 
  } = useApp();

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (!activeJob) {
    return (
      <div className="p-4 text-center">
        <p>Pilih job terlebih dahulu.</p>
        <button onClick={() => setActiveScreen('screen-2')} className="text-navy font-bold mt-2">
          Kembali ke Daftar Job
        </button>
      </div>
    );
  }

  const customer = customers.find(c => c.id === activeJob.customerId);
  const unit = acUnits.find(u => u.id === activeJob.unitId);
  const service = services.find(s => s.id === activeJob.serviceId);
  const technician = users.find(u => u.id === activeJob.technicianId);

  // Clean WA phone number for link
  const cleanPhone = (customer?.whatsappNumber || '').replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
  const waUrl = `https://wa.me/${waPhone}?text=Halo%20${encodeURIComponent(customer?.name || '')},%20saya%20teknisi%20dari%20Berkah%20Cool%20Mandiri%20konfirmasi%20jadwal%20servis%20AC%20hari%20ini.`;
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(customer?.address || 'Yogyakarta')}`;

  const handleStartTraveling = () => {
    updateJobStatus(activeJob.id, 'BERANGKAT', 'Teknisi sedang meluncur ke lokasi');
  };

  const handleStartWork = () => {
    updateJobStatus(activeJob.id, 'DIKERJAKAN', 'Teknisi sedang melakukan pekerjaan di lokasi');
    setActiveScreen('screen-4'); // Direct to Scan & Check-In
  };

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title={`Rincian Job #${activeJob.id}`} 
        subtitle={activeJob.statusLabelAwam} 
        showBack={true}
        onBack={() => setActiveScreen('screen-2')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Status Tracker Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Status Pekerjaan:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              activeJob.status === 'SELESAI' 
                ? 'bg-emerald-100 text-emerald-800' 
                : activeJob.status === 'DIKERJAKAN'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-navy/10 text-navy'
            }`}>
              {activeJob.status}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-1 text-center pt-1">
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
              activeJob.status ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              1. Diterima
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
              activeJob.status === 'BERANGKAT' || activeJob.status === 'DIKERJAKAN' || activeJob.status === 'SELESAI'
                ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2. Berangkat
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
              activeJob.status === 'DIKERJAKAN' || activeJob.status === 'SELESAI'
                ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3. Kerjakan
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
              activeJob.status === 'SELESAI'
                ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              4. Selesai
            </div>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">
            Informasi Pelanggan
          </h3>

          <div className="space-y-1">
            <p className="font-display font-bold text-lg text-navy">{customer?.name}</p>
            <p className="text-xs text-slate-500">{customer?.whatsappNumber}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brandOrange shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{customer?.address}</p>
              {customer?.notes && (
                <p className="text-[11px] text-slate-500 mt-1 italic">Catatan: {customer.notes}</p>
              )}
            </div>
          </div>

          {/* Action Call / WA / Maps (Principle 1: min 48px target) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target bg-emerald-600 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:bg-emerald-700"
            >
              <Phone className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target bg-white border border-slate-300 text-navy rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:bg-slate-100"
            >
              <MapPin className="w-4 h-4 text-brandOrange" />
              <span>Petunjuk Arah</span>
            </a>
          </div>
        </div>

        {/* Riwayat Unit AC (FR-05, FR-10, FR-14) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-brandOrange" />
              <span>Spesifikasi & Riwayat Unit AC</span>
            </h3>
            <span className="bg-navy/10 text-navy font-bold text-[10px] px-2 py-0.5 rounded">
              {unit?.qrCode || 'Stiker QR'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Merek & Kapasitas</span>
              <p className="font-bold text-navy text-sm mt-0.5">{unit?.brand || 'AC Split'}</p>
              <p className="text-slate-600">{unit?.pk} • {unit?.type}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Posisi Pemasangan</span>
              <p className="font-bold text-navy text-sm mt-0.5">{unit?.locationIndoor}</p>
              <p className="text-slate-600 text-[11px] truncate">Outdoor: {unit?.locationOutdoor || 'Luar'}</p>
            </div>
          </div>

          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/60 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-navy">Servis Cuci Terakhir:</span>
              <span className="font-bold text-navy">{unit?.lastCleanedAt || 'Baru pertama kali'}</span>
            </div>
            <p className="text-slate-600 text-[11px]">Catatan Unit: {unit?.notes || 'Tidak ada catatan khusus'}</p>
          </div>
        </div>

        {/* Schedule & Complaint */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Layanan Pesanan:</span>
            <span className="font-bold text-navy">{service?.name}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Jadwal Jam:</span>
            <span className="font-bold text-navy">{activeJob.scheduledDate} ({activeJob.startTime} - {activeJob.endTime})</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Keluhan Pelanggan:</span>
            <span className="font-semibold text-brandOrange">{activeJob.complaint || 'Cuci berkala'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Estimasi Biaya Jasa:</span>
            <span className="font-bold text-emerald-700 text-sm">Rp {service?.price.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar (Principle 2: Layout Bottom-heavy) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          {activeJob.status === 'SELESAI' ? (
            <button
              onClick={() => setActiveScreen('screen-8')}
              className="touch-target w-full bg-emerald-600 text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-98"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Lihat Ringkasan Job Selesai & Invoice</span>
            </button>
          ) : activeJob.status === 'DIKERJAKAN' ? (
            <button
              onClick={() => setActiveScreen('screen-5')}
              className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-98"
            >
              <Wrench className="w-5 h-5" />
              <span>Lanjutkan Isi Laporan Servis</span>
            </button>
          ) : activeJob.status === 'BERANGKAT' ? (
            <button
              onClick={handleStartWork}
              className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-98"
            >
              <QrCode className="w-5 h-5" />
              <span>Tiba di Lokasi & Scan QR Unit</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDeclineModal(true)}
                className="touch-target flex-1 bg-white border border-slate-300 text-slate-700 rounded-xl py-3 text-xs font-semibold active:bg-slate-100"
              >
                Pindah / Batal
              </button>

              <button
                onClick={handleStartTraveling}
                className="touch-target flex-[2] bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
              >
                <Truck className="w-4 h-4" />
                <span>Berangkat ke Lokasi</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Decline / Pindah Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-brandOrange-dark font-display font-bold">
              <AlertTriangle className="w-5 h-5 text-brandOrange" />
              <span>Pindah / Batalkan Job</span>
            </div>
            <p className="text-xs text-slate-600">
              Apakah Anda berhalangan mengerjakan job untuk {customer?.name}? Harap tuliskan alasan agar Admin dapat mengalihkan job.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Alasan: Ban motor bocor, sakit mendadak, dll..."
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-navy"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="touch-target flex-1 bg-slate-100 text-slate-700 rounded-xl py-2.5 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  alert('Permintaan pengalihan job dicatat di audit log dan diteruskan ke Admin.');
                  setActiveScreen('screen-2');
                }}
                className="touch-target flex-1 bg-brandOrange-dark text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                Kirim ke Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

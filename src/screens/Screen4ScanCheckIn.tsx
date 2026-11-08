import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  QrCode, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Camera, 
  RefreshCw, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const Screen4ScanCheckIn: React.FC = () => {
  const { 
    activeJob, 
    acUnits, 
    customers, 
    updateJobStatus, 
    setActiveScreen 
  } = useApp();

  const [scannedCode, setScannedCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [checkInDone, setCheckInDone] = useState<boolean>(!!activeJob?.checkInTime);
  const [coords, setCoords] = useState<string>(activeJob?.checkInLocation || '-7.7712, 110.3881 (Sleman, D.I. Yogyakarta)');

  const targetUnit = acUnits.find(u => u.id === activeJob?.unitId) || acUnits[0];
  const customer = customers.find(c => c.id === activeJob?.customerId);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedCode(targetUnit.qrCode);
      setIsScanning(false);
    }, 800);
  };

  const handleConfirmCheckIn = () => {
    if (activeJob) {
      updateJobStatus(activeJob.id, 'DIKERJAKAN', 'Teknisi tiba di lokasi dan check-in');
      setCheckInDone(true);
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Scan QR & Check-in" 
        subtitle="Verifikasi unit stiker AC di lokasi" 
        showBack={true}
        onBack={() => setActiveScreen('screen-3')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Unit Stiker Context */}
        <div className="bg-navy rounded-2xl p-4 text-white shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Target Unit AC:</span>
            <span className="bg-brandOrange text-white font-bold px-2 py-0.5 rounded text-[10px]">
              {targetUnit.brand} ({targetUnit.pk})
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-white leading-tight">
            {targetUnit.locationIndoor}
          </h3>
          <p className="text-xs text-slate-200">
            Pelanggan: <span className="font-semibold text-white">{customer?.name}</span>
          </p>
        </div>

        {/* Viewfinder Camera Simulation */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl min-h-[280px] flex flex-col items-center justify-center border-4 border-slate-800">
          {/* Scanning Reticle Lines */}
          <div className="relative w-52 h-52 border-2 border-dashed border-brandOrange/80 rounded-2xl flex flex-col items-center justify-center bg-black/40 p-4">
            {/* Animated Laser Bar */}
            <div className="absolute left-2 right-2 h-0.5 bg-brandOrange shadow-[0_0_12px_#EA6216] animate-bounce"></div>

            <QrCode className="w-16 h-16 text-white/40 mb-2" />
            <p className="text-white text-[11px] font-medium max-w-[140px]">
              Arahkan kamera ke stiker QR ProClima di bodi AC
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="touch-target bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-brandOrange" />
              <span>{isScanning ? 'Mendeteksi QR...' : 'Simulasi Scan Kamera'}</span>
            </button>
          </div>
        </div>

        {/* Scan Result Card */}
        {scannedCode ? (
          <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Unit AC Terverifikasi Cocok!</span>
            </div>
            <div className="text-xs text-emerald-950 space-y-1 bg-white/80 p-3 rounded-xl border border-emerald-200">
              <p><span className="font-semibold">Kode Stiker:</span> {scannedCode}</p>
              <p><span className="font-semibold">Merek:</span> {targetUnit.brand} ({targetUnit.pk})</p>
              <p><span className="font-semibold">Posisi:</span> {targetUnit.locationIndoor}</p>
              <p><span className="font-semibold">Outdoor:</span> {targetUnit.locationOutdoor || 'Balkon'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Stiker belum discan?</span>
            <button 
              onClick={() => setScannedCode(targetUnit.qrCode)}
              className="text-navy font-bold hover:underline"
            >
              Gunakan {targetUnit.qrCode}
            </button>
          </div>
        )}

        {/* GPS Check-in Details */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy">
            Pencatatan Kehadiran Lokasi (GPS)
          </h4>

          <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-brandOrange shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy">{coords}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Akurasi GPS: ~5 meter (Lokasi diverifikasi)</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Waktu Tiba:
            </span>
            <span className="font-bold text-navy">
              {activeJob?.checkInTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto">
          {checkInDone ? (
            <button
              onClick={() => setActiveScreen('screen-5')}
              className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
            >
              <span>Lanjut ke Laporan Servis (Checklist)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmCheckIn}
              className="touch-target w-full bg-navy text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-navy-dark"
            >
              <CheckCircle2 className="w-5 h-5 text-brandOrange" />
              <span>Konfirmasi Check-In di Lokasi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

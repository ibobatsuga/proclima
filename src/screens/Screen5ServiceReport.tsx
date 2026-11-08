import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  CheckSquare, 
  Square, 
  Camera, 
  Gauge, 
  Thermometer, 
  ChevronRight, 
  Save, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const Screen5ServiceReport: React.FC = () => {
  const { 
    activeJob, 
    saveServiceReport, 
    setActiveScreen, 
    isOnline 
  } = useApp();

  const [checklist, setChecklist] = useState(activeJob?.checklist || {
    cleanFilterIndoor: true,
    cleanEvaporator: true,
    cleanDrainPipe: true,
    cleanOutdoorCondenser: true,
    electricalCheck: true
  });

  const [freonPSI, setFreonPSI] = useState<number>(activeJob?.freonPressurePSI || 140);
  const [tempCelsius, setTempCelsius] = useState<number>(activeJob?.outputTempCelsius || 16.5);
  const [notes, setNotes] = useState<string>(activeJob?.technicianNotes || 'Unit AC dicuci menyeluruh. Evaporator bersih, talang air lancar tidak menetes.');

  // Pre-loaded realistic photos if empty
  const [beforePhoto, setBeforePhoto] = useState<string>(
    activeJob?.beforePhoto || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500&q=80'
  );
  const [afterPhoto, setAfterPhoto] = useState<string>(
    activeJob?.afterPhoto || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80'
  );

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveDraft = () => {
    if (activeJob) {
      saveServiceReport(activeJob.id, {
        checklist,
        freonPressurePSI: Number(freonPSI),
        outputTempCelsius: Number(tempCelsius),
        beforePhoto,
        afterPhoto,
        technicianNotes: notes
      });
      alert(isOnline ? 'Laporan servis berhasil tersimpan di server!' : 'Laporan tersimpan sebagai DRAFT LOKAL di perangkat Anda (Mode Offline).');
    }
  };

  const handleNext = () => {
    if (activeJob) {
      saveServiceReport(activeJob.id, {
        checklist,
        freonPressurePSI: Number(freonPSI),
        outputTempCelsius: Number(tempCelsius),
        beforePhoto,
        afterPhoto,
        technicianNotes: notes
      });
      setActiveScreen('screen-6'); // Go to Parts Requisition
    }
  };

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title="Laporan Servis AC" 
        subtitle="Tahap 2: Catat kondisi fisik & teknis" 
        showBack={true}
        onBack={() => setActiveScreen('screen-3')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Offline Draft Status Bar (Principle 3: Offline is a state) */}
        <div className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
          isOnline 
            ? 'bg-blue-50/70 text-navy border-blue-200' 
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className="font-medium">
              {isOnline ? 'Draft tersinkron otomatis ke cloud' : 'Mode Lapangan (Draft tersimpan di HP)'}
            </span>
          </div>
          <button 
            onClick={handleSaveDraft}
            className="text-navy font-bold hover:underline flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>

        {/* 1. Checklist Pekerjaan Servis */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">
              Checklist Pembersihan AC
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Wajib Lengkap
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'cleanFilterIndoor', label: 'Cuci & Keringkan Filter Udara Indoor' },
              { id: 'cleanEvaporator', label: 'Cuci Semprot Kisi-kisi Evaporator Indoor' },
              { id: 'cleanDrainPipe', label: 'Flushing & Tes Saluran Pembuangan Air (Drain)' },
              { id: 'cleanOutdoorCondenser', label: 'Cuci Blower & Kondensor Unit Outdoor' },
              { id: 'electricalCheck', label: 'Cek Kelistrikan, Sambungan Kabel & Grounding' },
            ].map(item => {
              const isChecked = checklist[item.id as keyof typeof checklist];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id as keyof typeof checklist)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all active:scale-98 ${
                    isChecked 
                      ? 'bg-emerald-50/60 border-emerald-300 text-navy' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs font-medium leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Technical Readings: Freon & Suhu */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">
            Pengukuran Teknis Pasca Servis
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Freon PSI */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-brandOrange" />
                <span>Tekanan Freon (PSI)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={freonPSI}
                  onChange={(e) => setFreonPSI(Number(e.target.value))}
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-base font-bold text-navy focus:outline-none focus:border-navy"
                  placeholder="140"
                />
                <span className="text-xs font-bold text-slate-500">PSI</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Standar: 130 - 150 PSI</span>
            </div>

            {/* Suhu Hembusan °C */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                <span>Suhu Dingin (°C)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-base font-bold text-navy focus:outline-none focus:border-navy"
                  placeholder="16.5"
                />
                <span className="text-xs font-bold text-slate-500">°C</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Optimal: &le; 18 °C</span>
            </div>
          </div>
        </div>

        {/* 3. Proof by Default: Foto Sebelum & Sesudah (PRD FR-11 & Principle 4) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-brandOrange" />
              <span>Bukti Foto Sebelum & Sesudah</span>
            </h3>
            <span className="text-[10px] text-slate-400">Proof by default</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Foto Sebelum */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">1. Sebelum Servis</span>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group">
                <img 
                  src={beforePhoto} 
                  alt="Foto Sebelum" 
                  className="w-full h-full object-cover" 
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition-opacity">
                  <Upload className="w-4 h-4 mr-1" />
                  <span>Ubah Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setBeforePhoto(url);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>

            {/* Foto Sesudah */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-600 block">2. Sesudah Servis</span>
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-slate-100 aspect-video group">
                <img 
                  src={afterPhoto} 
                  alt="Foto Sesudah" 
                  className="w-full h-full object-cover" 
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition-opacity">
                  <Upload className="w-4 h-4 mr-1" />
                  <span>Ubah Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setAfterPhoto(url);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Catatan Teknisi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-navy uppercase tracking-wider block">
            Catatan Tambahan Teknisi
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Catatan kondisi unit, anjuran servis, atau keluhan yang diselesaikan..."
            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-navy text-navy"
          />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('screen-6')}
            className="touch-target flex-1 bg-white border border-slate-300 text-navy rounded-xl py-3.5 text-xs font-semibold flex items-center justify-center gap-1 active:bg-slate-100"
          >
            <Plus className="w-4 h-4 text-brandOrange" />
            <span>Tambah Part / Freon</span>
          </button>

          <button
            onClick={handleNext}
            className="touch-target flex-[2] bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
          >
            <span>Lanjut ke Tanda Tangan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

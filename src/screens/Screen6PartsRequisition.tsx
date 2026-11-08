import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Plus, 
  Trash2, 
  Wrench, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { SparepartItem } from '../types';

export const Screen6PartsRequisition: React.FC = () => {
  const { activeJob, addSparepartsToJob, setActiveScreen } = useApp();

  const [items, setItems] = useState<SparepartItem[]>(activeJob?.spareparts || []);
  const [selectedPreset, setSelectedPreset] = useState('');

  const PRESETS = [
    { name: 'Freon R32 (Isi Ulang 0.5 - 1 PK)', price: 150000 },
    { name: 'Freon R410A (Isi Ulang 1.5 - 2 PK)', price: 180000 },
    { name: 'Kapasitor Kompresor 25uF', price: 95000 },
    { name: 'Kapasitor Kompresor 35uF', price: 110000 },
    { name: 'Armaflex & Lakban Pembungkus Pipa', price: 45000 },
    { name: 'Flushing Kimia Evaporator Tersumbat', price: 75000 },
  ];

  const handleAddPreset = () => {
    if (!selectedPreset) return;
    const found = PRESETS.find(p => p.name === selectedPreset);
    if (!found) return;

    const newItem: SparepartItem = {
      id: `part-${Date.now()}`,
      name: found.name,
      quantity: 1,
      unitPrice: found.price,
      approvedByCustomer: true
    };

    const updated = [...items, newItem];
    setItems(updated);
    if (activeJob) {
      addSparepartsToJob(activeJob.id, updated);
    }
    setSelectedPreset('');
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    if (activeJob) {
      addSparepartsToJob(activeJob.id, updated);
    }
  };

  const totalPartsCost = items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  const exceedsThreshold = totalPartsCost > 100000;

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title="Sparepart & Biaya Tambahan" 
        subtitle="Tahap 2: Catat penambahan freon & komponen" 
        showBack={true}
        onBack={() => setActiveScreen('screen-5')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Notice Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-navy font-display font-bold text-sm">
            <Wrench className="w-4 h-4 text-brandOrange" />
            <span>Katalog Komponen AC Terstandar</span>
          </div>
          <p className="text-xs text-slate-600">
            Pilih komponen atau pengisian freon tambahan jika dibutuhkan selama pengerjaan di lokasi. Semua biaya akan transparan masuk ke invoice same-day.
          </p>
        </div>

        {/* Add Preset Item Dropdown (Dropdown 3-state PRD 6.9) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-bold text-navy uppercase tracking-wider block">
            Pilih Komponen / Freon:
          </label>

          <div className="flex gap-2">
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-xs text-navy focus:outline-none focus:border-navy"
            >
              <option value="">-- Pilih Sparepart / Tambah Freon --</option>
              {PRESETS.map((p, idx) => (
                <option key={idx} value={p.name}>
                  {p.name} - Rp {p.price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddPreset}
              disabled={!selectedPreset}
              className="touch-target bg-brandOrange text-white px-4 rounded-xl text-xs font-semibold disabled:opacity-50 active:bg-brandOrange-dark flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* List of Added Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy">
              Daftar Komponen Ditambahkan ({items.length})
            </h4>
            <span className="text-xs font-bold text-navy">
              Subtotal: Rp {totalPartsCost.toLocaleString('id-ID')}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-navy">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} unit &times; Rp {item.unitPrice.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-700">
                      Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500">
              Belum ada part atau freon tambahan. Jika hanya cuci standar, langsung lanjutkan ke tanda tangan.
            </div>
          )}
        </div>

        {/* Customer Approval Threshold Notice (PRD FR-06 / 6.5 Layar 6) */}
        {exceedsThreshold && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Memerlukan Konfirmasi Persetujuan Pelanggan</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Biaya part melebihi ambang batas Rp 100.000. Pastikan pelanggan sudah mengizinkan penggantian part ini sebelum dilakukan pemasangan.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pelanggan telah menyetujui di lokasi</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => setActiveScreen('screen-7')}
            className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
          >
            <span>Lanjut ke Tanda Tangan Pelanggan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Users, 
  Plus, 
  QrCode, 
  Wrench, 
  MapPin, 
  Phone, 
  Printer, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ScreenAdminCustomers: React.FC = () => {
  const { customers, acUnits, addCustomer, addACUnit } = useApp();

  const [showAddCustModal, setShowAddCustModal] = useState(false);
  const [selectedUnitForSticker, setSelectedUnitForSticker] = useState<string | null>(null);

  // Form New Customer
  const [custForm, setCustForm] = useState({
    name: '',
    whatsappNumber: '',
    address: '',
    notes: ''
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name || !custForm.whatsappNumber) {
      alert('Nama dan Nomor WhatsApp wajib diisi');
      return;
    }

    const newCust = addCustomer({
      name: custForm.name,
      whatsappNumber: custForm.whatsappNumber,
      address: custForm.address,
      notes: custForm.notes
    });

    // Automatically create first AC unit for convenience
    addACUnit({
      customerId: newCust.id,
      brand: 'Daikin Inverter',
      pk: '1 PK',
      type: 'Split Wall',
      locationIndoor: 'Kamar Utama',
      locationOutdoor: 'Balkon',
      notes: 'Unit baru terpasang'
    });

    setShowAddCustModal(false);
    setCustForm({ name: '', whatsappNumber: '', address: '', notes: '' });
    alert('Pelanggan dan unit AC perdana berhasil ditambahkan!');
  };

  const activeUnit = acUnits.find(u => u.id === selectedUnitForSticker);
  const activeCustomer = customers.find(c => c.id === activeUnit?.customerId);

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Pelanggan & Stiker QR AC" 
        subtitle="Kelola aset unit AC per pelanggan" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Header CTA */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-navy">Database Pelanggan ({customers.length})</h3>
            <p className="text-[11px] text-slate-500">Total {acUnits.length} Unit AC terlacak</p>
          </div>
          <button
            onClick={() => setShowAddCustModal(true)}
            className="touch-target bg-brandOrange text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow active:bg-brandOrange-dark"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>

        {/* Customer Cards */}
        <div className="space-y-3">
          {customers.map(cust => {
            const units = acUnits.filter(u => u.customerId === cust.id);
            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-display font-bold text-sm text-navy">{cust.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{cust.whatsappNumber}</span>
                    </p>
                  </div>
                  <span className="bg-navy/10 text-navy font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {units.length} Unit AC
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{cust.address}</span>
                </div>

                {/* Units List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Terpasang:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {units.map(unit => (
                      <div
                        key={unit.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-navy">{unit.brand} ({unit.pk})</p>
                          <p className="text-[10px] text-slate-500">{unit.locationIndoor}</p>
                        </div>

                        <button
                          onClick={() => setSelectedUnitForSticker(unit.id)}
                          className="bg-navy hover:bg-navy-dark text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-brandOrange" />
                          <span>Cetak Stiker</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Cetak Stiker QR Unit AC (Pekerjaan Baru PRD Layar 4 & 6.5) */}
      {selectedUnitForSticker && activeUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 space-y-4 shadow-2xl text-center">
            <h3 className="font-display font-bold text-base text-navy">
              Stiker QR Unit AC ProClima
            </h3>
            <p className="text-[11px] text-slate-500">
              Tempel stiker ini pada bodi indoor/outdoor unit AC pelanggan saat kunjungan pertama untuk memudahkan scan cepat di masa depan.
            </p>

            {/* Sticker Physical Preview */}
            <div className="bg-surface border-2 border-navy rounded-2xl p-4 shadow-inner space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-navy font-bold text-xs">
                <img src="/logo-thermometer.png" alt="Logo" className="w-4 h-4 object-contain" />
                <span>ProClima Asset ID</span>
              </div>

              {/* QR Mock graphic with actual code */}
              <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex flex-col items-center justify-center p-2 shadow-sm">
                <QrCode className="w-24 h-24 text-navy" />
                <span className="font-mono font-bold text-xs text-navy tracking-widest mt-1">
                  {activeUnit.qrCode}
                </span>
              </div>

              <div className="text-[10px] text-navy font-medium pt-1">
                <p className="font-bold">{activeUnit.brand} - {activeUnit.pk}</p>
                <p className="text-slate-500">{activeCustomer?.name}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedUnitForSticker(null)}
                className="touch-target flex-1 bg-slate-100 text-slate-700 rounded-xl py-2 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="touch-target flex-1 bg-navy text-white rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pelanggan Baru */}
      {showAddCustModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-navy">
              Tambah Pelanggan Baru
            </h3>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy block mb-1">Nama Lengkap Pelanggan:</label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Ibu Rina Melati"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Nomor WhatsApp (Aktif):</label>
                <input
                  type="tel"
                  required
                  value={custForm.whatsappNumber}
                  onChange={(e) => setCustForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="08123456789"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Alamat Lengkap di Yogyakarta:</label>
                <textarea
                  required
                  rows={2}
                  value={custForm.address}
                  onChange={(e) => setCustForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Jl. Kaliurang KM 7, Gg. Melati No. 8, Sleman..."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustModal(false)}
                  className="touch-target flex-1 bg-slate-100 text-slate-700 rounded-xl py-2.5 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="touch-target flex-1 bg-brandOrange text-white rounded-xl py-2.5 font-semibold shadow active:bg-brandOrange-dark"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

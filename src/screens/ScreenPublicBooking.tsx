import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScreenPublicBooking: React.FC = () => {
  const { 
    tenant, 
    services, 
    createBooking, 
    addCustomer, 
    addACUnit, 
    customers, 
    setActiveScreen 
  } = useApp();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [brand, setBrand] = useState('Daikin');
  const [pk, setPk] = useState('1 PK');
  const [complaint, setComplaint] = useState('AC Kurang Dingin / Cuci Rutin');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check existing customer or create
    let cust = customers.find(c => c.whatsappNumber === whatsapp);
    if (!cust) {
      cust = addCustomer({
        name,
        whatsappNumber: whatsapp,
        address,
        notes: 'Dipesan via Link Booking Publik'
      });
    }

    const unit = addACUnit({
      customerId: cust.id,
      brand,
      pk,
      type: 'Split Wall',
      locationIndoor: 'Ruangan Utama',
      notes: complaint
    });

    const endTime = `${Number(startTime.split(':')[0]) + 1}:${startTime.split(':')[1]}`;

    createBooking({
      customerId: cust.id,
      unitId: unit.id,
      serviceId,
      scheduledDate,
      startTime,
      endTime,
      complaint,
      source: 'LINK_PUBLIK'
    });

    setIsSuccess(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Form Booking Servis AC" 
        subtitle="Pesan Servis Tanpa Perlu Akun / Aplikasi" 
        showBack={true}
        onBack={() => setActiveScreen('screen-9')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-md space-y-3">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-bold text-lg text-navy">
              Booking Berhasil Dikirim!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Tim {tenant.name} telah menerima pesanan Anda untuk tanggal <span className="font-bold text-navy">{scheduledDate}</span> jam <span className="font-bold text-navy">{startTime} WIB</span>. Konfirmasi resmi akan dikirim via WhatsApp ke {whatsapp}.
            </p>

            <div className="pt-3">
              <button
                onClick={() => setActiveScreen('screen-9')}
                className="touch-target bg-navy text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow"
              >
                Lihat Status Servis di Client Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-navy rounded-2xl p-4 text-white shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-300">Formulir Resmi</span>
              <h3 className="font-display font-bold text-base text-white">{tenant.name}</h3>
              <p className="text-xs text-slate-200">Teknisi profesional siap datang ke lokasi rumah/kantor Anda di area Yogyakarta.</p>
            </div>

            {/* Data Pemesan */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-display font-bold text-navy uppercase tracking-wider">
                1. Data Pemesan & Alamat
              </h4>

              <div>
                <label className="font-bold text-navy block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: dr. Anita / Pak Hendro"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Nomor WhatsApp Aktif:</label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Alamat Lengkap di Yogyakarta:</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Kaliurang / Gejayan / Pogung Baru No..."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>
            </div>

            {/* Unit & Jadwal */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-display font-bold text-navy uppercase tracking-wider">
                2. Jadwal & Detail Unit AC
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-navy block mb-1">Tanggal Kunjungan:</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Jam Pilihan:</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 font-bold text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Pilihan Layanan:</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-medium text-navy"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Rp {s.price.toLocaleString('id-ID')})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-navy block mb-1">Merek AC:</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                  >
                    <option value="Daikin">Daikin</option>
                    <option value="Panasonic">Panasonic</option>
                    <option value="Sharp">Sharp</option>
                    <option value="Gree">Gree</option>
                    <option value="LG">LG</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Kapasitas (PK):</label>
                  <select
                    value={pk}
                    onChange={(e) => setPk(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                  >
                    <option value="0.5 PK">0.5 PK</option>
                    <option value="1 PK">1 PK</option>
                    <option value="1.5 PK">1.5 PK</option>
                    <option value="2 PK">2 PK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Keluhan / Catatan:</label>
                <input
                  type="text"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="AC menetes air, bau apek, dll..."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brandOrange/30 active:bg-brandOrange-dark transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Booking Sekarang</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

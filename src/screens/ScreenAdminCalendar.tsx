import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  MapPin, 
  ChevronRight,
  Filter,
  ShieldAlert
} from 'lucide-react';

export const ScreenAdminCalendar: React.FC = () => {
  const { 
    jobs, 
    customers, 
    services, 
    users, 
    createBooking, 
    assignTechnician, 
    acUnits,
    setActiveJobId,
    setActiveScreen
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form Booking Baru
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    unitId: acUnits[0]?.id || '',
    serviceId: services[0]?.id || '',
    technicianId: users[1]?.id || '',
    scheduledDate: selectedDate,
    startTime: '10:00',
    endTime: '11:30',
    complaint: 'AC Kurang Dingin / Cuci Berkala',
    notes: ''
  });

  // Error modal state for anti-bentrok
  const [conflictError, setConflictError] = useState<{
    message: string;
    suggestedTechs: any[];
  } | null>(null);

  const technicians = users.filter(u => u.role === 'TECHNICIAN');
  const dayJobs = jobs.filter(j => j.scheduledDate === selectedDate && j.status !== 'DIBATALKAN');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const res = createBooking({
      ...formData,
      source: 'ADMIN'
    });

    if (!res.success) {
      setConflictError({
        message: res.error || 'Jadwal teknisi bentrok!',
        suggestedTechs: res.suggestedTechnicians || []
      });
      return;
    }

    setShowBookingModal(false);
    alert('Booking berhasil dibuat dan teknisi telah dijadwalkan!');
  };

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Kalender Jadwal Teknisi" 
        subtitle="Validasi Anti Double-Booking Aktif" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Date Selector Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-navy" />
              <span className="font-display font-bold text-sm text-navy">Pilih Tanggal Jadwal:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-navy focus:outline-none"
            />
          </div>

          {/* Quick Add Booking CTA */}
          <button
            onClick={() => {
              setFormData(prev => ({ ...prev, scheduledDate: selectedDate }));
              setShowBookingModal(true);
            }}
            className="touch-target w-full bg-brandOrange text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Booking Baru (Admin)</span>
          </button>
        </div>

        {/* Anti-Bentrok Rule Badge */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-navy">
          <ShieldAlert className="w-4 h-4 text-brandOrange shrink-0" />
          <span>
            <strong>Aturan Server FR-09:</strong> Sistem otomatis menolak penugasan teknisi jika terdapat jam overlap/bentrok.
          </span>
        </div>

        {/* Schedule Grid by Technicians */}
        <div className="space-y-4">
          {technicians.map(tech => {
            const techJobs = dayJobs.filter(j => j.technicianId === tech.id);
            return (
              <div key={tech.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={tech.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
                      alt={tech.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-navy">{tech.name}</h4>
                      <span className="text-[10px] text-slate-400">Teknisi Servis AC</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    techJobs.length > 0 ? 'bg-navy/10 text-navy' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {techJobs.length} Job Terjadwal
                  </span>
                </div>

                {/* Job timeline list */}
                {techJobs.length > 0 ? (
                  <div className="space-y-2">
                    {techJobs.map(job => {
                      const cust = customers.find(c => c.id === job.customerId);
                      const srv = services.find(s => s.id === job.serviceId);
                      return (
                        <div
                          key={job.id}
                          onClick={() => {
                            setActiveJobId(job.id);
                            setActiveScreen('screen-3');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200/80 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {job.startTime} - {job.endTime}
                              </span>
                              <span className="text-xs font-bold text-navy">{cust?.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{srv?.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[220px]">{cust?.address}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200 text-center text-xs text-emerald-800">
                    Jadwal masih kosong (Tersedia untuk slot booking)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

        {/* Modal Buat Booking Baru dengan Validasi Anti-Bentrok */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-base text-navy">
                Buat Booking Baru (Admin)
              </h3>
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  setConflictError(null);
                }} 
                className="text-slate-400 hover:text-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error Bentrok Alert Banner (PRD FR-09) */}
            {conflictError && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-rose-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{conflictError.message}</p>
                </div>

                {conflictError.suggestedTechs.length > 0 && (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
                    <span className="font-bold text-navy block text-[11px]">Saran Teknisi Yang Masih Kosong:</span>
                    <div className="flex flex-wrap gap-1">
                      {conflictError.suggestedTechs.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, technicianId: t.id }));
                            setConflictError(null);
                          }}
                          className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold active:scale-95"
                        >
                          Pilih {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy block mb-1">Pelanggan:</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    const firstUnit = acUnits.find(u => u.customerId === cId);
                    setFormData(prev => ({
                      ...prev,
                      customerId: cId,
                      unitId: firstUnit ? firstUnit.id : prev.unitId
                    }));
                  }}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-medium text-navy"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.whatsappNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Unit AC Terdaftar:</label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-medium text-navy"
                >
                  {acUnits
                    .filter(u => u.customerId === formData.customerId)
                    .map(u => (
                      <option key={u.id} value={u.id}>{u.brand} ({u.pk}) - {u.locationIndoor}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Paket Layanan:</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-medium text-navy"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - Rp {s.price.toLocaleString('id-ID')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Tugaskan Teknisi:</label>
                <select
                  value={formData.technicianId}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicianId: e.target.value }))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-medium text-navy"
                >
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-navy block mb-1">Jam Mulai:</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Jam Selesai:</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 font-bold text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Keluhan / Catatan:</label>
                <input
                  type="text"
                  value={formData.complaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, complaint: e.target.value }))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-navy"
                  placeholder="AC menetes air, tidak dingin, dll..."
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="touch-target flex-1 bg-slate-100 text-slate-700 rounded-xl py-3 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="touch-target flex-1 bg-brandOrange text-white rounded-xl py-3 font-semibold shadow active:bg-brandOrange-dark"
                >
                  Simpan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

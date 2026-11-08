import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Search, 
  QrCode, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const Screen2AllJobs: React.FC = () => {
  const { 
    currentUser, 
    jobs, 
    customers, 
    services, 
    setActiveJobId, 
    setActiveScreen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'TODAY' | 'UPCOMING' | 'COMPLETED'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const myJobs = jobs.filter(j => j.technicianId === currentUser.id || !j.technicianId);

  // Filter based on tab
  const filteredJobs = myJobs.filter(job => {
    const cust = customers.find(c => c.id === job.customerId);
    const srv = services.find(s => s.id === job.serviceId);
    
    // Search query matching
    const matchesSearch = 
      (cust?.name.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (srv?.name.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (cust?.address.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'TODAY') {
      return job.scheduledDate === todayStr && job.status !== 'SELESAI' && job.status !== 'DIBATALKAN';
    } else if (activeTab === 'UPCOMING') {
      return job.scheduledDate > todayStr || (job.scheduledDate === todayStr && job.status === 'MENUNGGU_PENUGASAN');
    } else {
      return job.status === 'SELESAI';
    }
  });

  return (
    <div className="pb-24 min-h-screen bg-surface">
      <TopAppBar 
        title="Daftar Pekerjaan (Jobs)" 
        subtitle="Kelola semua job teknisi lapangan" 
        showBack={true}
        onBack={() => setActiveScreen('screen-1')}
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Search & Scan Component (Sesuai Referensi Desain Bagian 6.9) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pelanggan, alamat, layanan..."
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-navy text-navy placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <button
            onClick={() => setActiveScreen('screen-4')}
            className="touch-target w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-navy hover:bg-slate-50 active:scale-95 shadow-sm transition-all"
            title="Scan Stiker QR AC"
          >
            <QrCode className="w-5 h-5 text-brandOrange" />
          </button>
        </div>

        {/* 3 Tabs: Today / Upcoming / Completed */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('TODAY')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'TODAY'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Hari Ini ({myJobs.filter(j => j.scheduledDate === todayStr && j.status !== 'SELESAI').length})
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Mendatang
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'COMPLETED'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Selesai ({myJobs.filter(j => j.status === 'SELESAI').length})
          </button>
        </div>

        {/* Job Cards */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map(job => {
              const cust = customers.find(c => c.id === job.customerId);
              const srv = services.find(s => s.id === job.serviceId);
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setActiveJobId(job.id);
                    setActiveScreen('screen-3');
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{job.id}</span>
                      <h4 className="font-display font-bold text-base text-navy leading-tight">{cust?.name}</h4>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      job.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'DIKERJAKAN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-navy/10 text-navy'
                    }`}>
                      {job.status === 'SELESAI' ? 'Selesai' : job.status === 'DIKERJAKAN' ? 'Sedang Dikerjakan' : 'Siap Berangkat'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{cust?.address}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">{srv?.name}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Keluhan: {job.complaint || 'Pembersihan AC rutin'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-brandOrange" />
                        {job.startTime} - {job.endTime}
                      </p>
                      <p className="text-[10px] text-slate-400">{job.scheduledDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-brandOrange">Buka Rincian Job</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state PRD 6.3: Teks: "Tidak ada job pada hari ini." Ditampilkan sebagai kabar baik, bukan error */
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-display font-bold text-navy text-base">Tidak ada job pada hari ini.</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                {activeTab === 'TODAY' 
                  ? 'Semua jadwal sudah selesai atau belum ada pesanan baru. Kabar baik untuk rehat sejenak!' 
                  : 'Belum ada jadwal pekerjaan pada tab ini.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

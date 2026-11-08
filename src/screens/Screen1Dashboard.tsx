import React from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Wrench,
  Sparkles
} from 'lucide-react';

export const Screen1Dashboard: React.FC = () => {
  const { 
    currentUser, 
    jobs, 
    customers, 
    services, 
    setActiveJobId, 
    setActiveScreen 
  } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const myJobs = jobs.filter(j => j.technicianId === currentUser.id || !j.technicianId);
  const todayJobs = myJobs.filter(j => j.scheduledDate === today);

  const totalCount = todayJobs.length;
  const pendingCount = todayJobs.filter(j => j.status === 'DITERIMA' || j.status === 'BERANGKAT' || j.status === 'MENUNGGU_PENUGASAN').length;
  const completedCount = todayJobs.filter(j => j.status === 'SELESAI').length;
  const partsCount = todayJobs.filter(j => j.spareparts && j.spareparts.length > 0).length;

  const currentActiveJob = todayJobs.find(j => j.status === 'DITERIMA' || j.status === 'BERANGKAT' || j.status === 'DIKERJAKAN') || todayJobs[0];

  return (
    <div className="pb-24 min-h-screen bg-surface">
      <TopAppBar 
        title="ProClima Teknisi" 
        subtitle="Sistem Service & Cleaning AC" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Greeting Card with Logo Accent */}
        <div className="bg-navy rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">Teknisi Lapangan</span>
              <h2 className="text-xl font-display font-bold leading-tight">
                Halo, {currentUser.name.split(' ')[0]} 👋
              </h2>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-brandOrange overflow-hidden shadow">
              <img 
                src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <p className="text-xs text-slate-200">
            {todayJobs.length > 0 
              ? `Hari ini kamu memiliki ${todayJobs.length} jadwal servis AC di Yogyakarta.` 
              : 'Tidak ada job pada hari ini. Istirahat yang cukup ya!'}
          </p>
        </div>

        {/* 4 Metrics Counter Grid (Built for gloves & sunlight) */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setActiveScreen('screen-2')} 
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">Total Job Hari Ini</span>
              <Clock className="w-4 h-4 text-navy" />
            </div>
            <div className="text-3xl font-display font-bold text-navy">{totalCount}</div>
            <span className="text-[10px] text-slate-400">Jadwal resmi</span>
          </div>

          <div 
            onClick={() => setActiveScreen('screen-2')} 
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">Menunggu</span>
              <AlertCircle className="w-4 h-4 text-brandOrange" />
            </div>
            <div className="text-3xl font-display font-bold text-brandOrange">{pendingCount}</div>
            <span className="text-[10px] text-slate-400">Siap dikerjakan</span>
          </div>

          <div 
            onClick={() => setActiveScreen('screen-2')} 
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">Job Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-display font-bold text-emerald-600">{completedCount}</div>
            <span className="text-[10px] text-slate-400">Bukti TTD terunggah</span>
          </div>

          <div 
            onClick={() => setActiveScreen('screen-6')} 
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">Freon / Part</span>
              <Wrench className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-display font-bold text-indigo-600">{partsCount}</div>
            <span className="text-[10px] text-slate-400">Kebutuhan tambahan</span>
          </div>
        </div>

        {/* Quick Action Button Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('screen-4')}
            className="touch-target flex-1 bg-navy text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:bg-navy-dark transition-all"
          >
            <QrCode className="w-4 h-4 text-brandOrange" />
            <span>Scan Stiker AC</span>
          </button>
          
          <button
            onClick={() => setActiveScreen('screen-2')}
            className="touch-target flex-1 bg-white border border-slate-300 text-navy rounded-xl py-3 px-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:bg-slate-100 transition-all"
          >
            <Sparkles className="w-4 h-4 text-navy" />
            <span>Semua Job ({myJobs.length})</span>
          </button>
        </div>

        {/* Highlighted Next Job Card */}
        {currentActiveJob ? (
          <div className="bg-white rounded-2xl p-4 border-2 border-brandOrange/30 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-brandOrange/15 text-brandOrange text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                Job Aktif Saat Ini
              </span>
              <span className="text-xs font-bold text-navy flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentActiveJob.startTime} - {currentActiveJob.endTime}
              </span>
            </div>

            {(() => {
              const cust = customers.find(c => c.id === currentActiveJob.customerId);
              const srv = services.find(s => s.id === currentActiveJob.serviceId);
              return (
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-navy leading-tight">
                    {cust?.name || 'Pelanggan'}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cust?.address}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <p className="font-semibold text-navy">{srv?.name}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Keluhan: {currentActiveJob.complaint || 'Cuci berkala'}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveJobId(currentActiveJob.id);
                        setActiveScreen('screen-3');
                      }}
                      className="touch-target w-full bg-brandOrange text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow active:bg-brandOrange-dark transition-all"
                    >
                      <span>Buka Lembar Kerja</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-display font-bold text-navy">Semua Job Tuntas</h4>
            <p className="text-xs text-slate-500 mt-1">Tidak ada job yang perlu dikerjakan saat ini.</p>
          </div>
        )}

        {/* List of Today's Jobs */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-navy">Jadwal Job Hari Ini</h3>
            <button 
              onClick={() => setActiveScreen('screen-2')}
              className="text-xs font-semibold text-brandOrange hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5">
            {todayJobs.map(job => {
              const cust = customers.find(c => c.id === job.customerId);
              const srv = services.find(s => s.id === job.serviceId);
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setActiveJobId(job.id);
                    setActiveScreen('screen-3');
                  }}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between active:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-navy bg-slate-100 px-2 py-0.5 rounded">
                        {job.startTime}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        job.status === 'SELESAI' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : job.status === 'DIKERJAKAN'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.status === 'SELESAI' ? 'Selesai' : job.status === 'DIKERJAKAN' ? 'Sedang Dikerjakan' : 'Diterima'}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-navy">{cust?.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[220px]">{srv?.name}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

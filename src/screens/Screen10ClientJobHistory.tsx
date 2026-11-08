import React from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Calendar, 
  Wrench, 
  FileText, 
  ChevronRight, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Screen10ClientJobHistory: React.FC = () => {
  const { 
    customers, 
    jobs, 
    acUnits, 
    services, 
    users, 
    setActiveJobId, 
    setActiveScreen 
  } = useApp();

  // Pick first customer context for public link view
  const customer = customers[0];
  const customerUnits = acUnits.filter(u => u.customerId === customer?.id);
  const customerJobs = jobs.filter(j => j.customerId === customer?.id);

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Riwayat Servis AC" 
        subtitle={`Daftar riwayat unit AC ${customer?.name || ''}`} 
        showBack={true}
        onBack={() => setActiveScreen('screen-9')}
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Unit Tabs / Overview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Unit AC Terdaftar</span>
            <span className="text-xs font-bold text-navy">{customerUnits.length} Unit di Lokasi</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {customerUnits.map(unit => (
              <div
                key={unit.id}
                className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shrink-0 text-xs text-navy"
              >
                <p className="font-bold">{unit.brand} ({unit.pk})</p>
                <p className="text-[10px] text-slate-500">{unit.locationIndoor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History Feed */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy">
            Semua Kunjungan Servis
          </h4>

          {customerJobs.map((job, index) => {
            const unit = acUnits.find(u => u.id === job.unitId);
            const srv = services.find(s => s.id === job.serviceId);
            const tech = users.find(u => u.id === job.technicianId);

            return (
              <div
                key={job.id}
                onClick={() => {
                  setActiveJobId(job.id);
                  setActiveScreen('screen-11');
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer active:scale-[0.99] transition-transform space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-navy/10 text-navy flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-navy">{unit?.brand} ({unit?.locationIndoor})</p>
                      <p className="text-[11px] text-slate-500">{job.scheduledDate} • {job.startTime} WIB</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    job.status === 'SELESAI' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {job.status === 'SELESAI' ? 'Selesai' : 'Diproses'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Layanan:</span>
                    <span className="font-semibold text-navy">{srv?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Teknisi:</span>
                    <span className="font-semibold text-navy">{tech?.name || 'Teknisi ProClima'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-brandOrange flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buka Lembar Laporan & Bukti Foto</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

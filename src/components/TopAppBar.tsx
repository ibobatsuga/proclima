import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, RefreshCw, UserCheck, Shield, Smartphone } from 'lucide-react';

export const TopAppBar: React.FC<{ title: string; subtitle?: string; showBack?: boolean; onBack?: () => void }> = ({
  title,
  subtitle,
  showBack = false,
  onBack
}) => {
  const {
    tenant,
    currentRoleView,
    setCurrentRoleView,
    isOnline,
    toggleSimulatedOffline,
    pendingOfflineSyncCount,
    syncOfflineQueue
  } = useApp();

  return (
    <header className="bg-navy text-white sticky top-0 z-40 shadow-md">
      {/* Simulation Banner & System Indicator */}
      <div className="bg-[#1c244f] border-b border-white/10">
        <div className="max-w-xl mx-auto px-4 py-1 text-[11px] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300 truncate max-w-[170px]">{tenant.name}</span>
            <span className="bg-brandOrange/20 text-brandOrange border border-brandOrange/30 px-1.5 py-0.2 rounded font-bold text-[9px]">
              {tenant.plan}
            </span>
          </div>

          {/* Offline / Online Toggle (Design System Principle 3) */}
          <div className="flex items-center space-x-2">
            {pendingOfflineSyncCount > 0 && (
              <button
                onClick={syncOfflineQueue}
                className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] active:scale-95"
                title="Klik untuk sinkronkan data draft offline"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{pendingOfflineSyncCount} Draft</span>
              </button>
            )}

            <button
              onClick={toggleSimulatedOffline}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
              }`}
              title="Klik untuk simulasi koneksi internet lapangan"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Offline (Draft Lokal)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top App Bar */}
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="touch-target p-2 -ml-2 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-all"
              aria-label="Kembali"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/15 shadow-inner">
              <img
                src="/logo-thermometer.png"
                alt="ProClima Logo"
                className="w-full h-full object-contain filter invert"
              />
            </div>
          )}

          <div>
            <h1 className="font-display font-semibold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[12px] text-slate-300 font-sans leading-tight mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Role Switcher Pill (2 Apps 1 Language - Principle 5) */}
        <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
          <button
            onClick={() => setCurrentRoleView('TECHNICIAN')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              currentRoleView === 'TECHNICIAN'
                ? 'bg-brandOrange text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Tampilan Teknisi Lapangan"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teknisi</span>
          </button>

          <button
            onClick={() => setCurrentRoleView('ADMIN')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              currentRoleView === 'ADMIN'
                ? 'bg-brandOrange text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Tampilan Owner / Admin"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={() => setCurrentRoleView('CLIENT')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              currentRoleView === 'CLIENT'
                ? 'bg-brandOrange text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Tampilan Pelanggan (Link Publik tanpa Login)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer</span>
          </button>
        </div>
      </div>
    </header>
  );
};

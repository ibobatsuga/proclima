import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Send,
  Filter,
  User
} from 'lucide-react';

export const ScreenAdminInvoices: React.FC = () => {
  const { invoices, customers, jobs, markInvoicePaid } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'BELUM_BAYAR' | 'LUNAS'>('ALL');
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'ALL') return true;
    return inv.status === filter;
  });

  const totalReceivables = invoices
    .filter(i => i.status === 'BELUM_BAYAR')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalCollected = invoices
    .filter(i => i.status === 'LUNAS')
    .reduce((sum, i) => sum + i.amount, 0);

  const handlePay = (method: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI') => {
    if (selectedInvoiceForPay) {
      markInvoicePaid(selectedInvoiceForPay, method);
      setSelectedInvoiceForPay(null);
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-surface">
      <TopAppBar 
        title="Daftar Invoice & Piutang" 
        subtitle="Kelola penagihan jasa servis AC" 
      />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* KPI Financial Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-amber-600 block uppercase">Piutang Belum Bayar</span>
            <div className="text-xl font-display font-bold text-navy">
              Rp {totalReceivables.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">
              {invoices.filter(i => i.status === 'BELUM_BAYAR').length} Invoice Menunggu
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 block uppercase">Uang Masuk (Lunas)</span>
            <div className="text-xl font-display font-bold text-emerald-700">
              Rp {totalCollected.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">
              {invoices.filter(i => i.status === 'LUNAS').length} Transaksi Terbayar
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              filter === 'ALL' ? 'bg-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Semua ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('BELUM_BAYAR')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              filter === 'BELUM_BAYAR' ? 'bg-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Belum Bayar
          </button>
          <button
            onClick={() => setFilter('LUNAS')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              filter === 'LUNAS' ? 'bg-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Lunas
          </button>
        </div>

        {/* Invoice Feed */}
        <div className="space-y-3">
          {filteredInvoices.map(inv => {
            const cust = customers.find(c => c.id === inv.customerId);
            const isUnpaid = inv.status === 'BELUM_BAYAR';

            return (
              <div
                key={inv.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{inv.id}</span>
                    <h4 className="font-display font-bold text-sm text-navy">{cust?.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isUnpaid ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isUnpaid ? 'Belum Bayar' : 'LUNAS'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1 text-xs">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>{item.name} ({item.qty}x)</span>
                      <span className="font-semibold text-navy">Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-navy">
                    <span>Total Tagihan:</span>
                    <span className="text-brandOrange">Rp {inv.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {isUnpaid ? (
                  <button
                    onClick={() => setSelectedInvoiceForPay(inv.id)}
                    className="touch-target w-full bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Lunas (Manual / QRIS)</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Lunas via {inv.paymentMethod}</span>
                    <span className="font-medium text-emerald-700">{inv.markedPaidAt}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedInvoiceForPay && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-navy">
              Konfirmasi Penerimaan Pembayaran
            </h3>
            <p className="text-xs text-slate-600">
              Pilih metode pembayaran manual yang telah diterima dari pelanggan untuk invoice #{selectedInvoiceForPay}:
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handlePay('QRIS')}
                className="touch-target w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs font-bold text-navy transition-all"
              >
                <QrCode className="w-5 h-5 text-brandOrange" />
                <span>QRIS ProClima / Merchant</span>
              </button>

              <button
                onClick={() => handlePay('TRANSFER_BANK')}
                className="touch-target w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs font-bold text-navy transition-all"
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Transfer Bank (BCA/Mandiri/BRI)</span>
              </button>

              <button
                onClick={() => handlePay('TUNAI')}
                className="touch-target w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs font-bold text-navy transition-all"
              >
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Tunai / Cash di Lokasi</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedInvoiceForPay(null)}
              className="touch-target w-full text-slate-500 text-xs font-semibold py-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
